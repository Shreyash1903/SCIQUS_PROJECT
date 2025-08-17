from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from django.forms import ModelForm
from .models import User


class UserForm(ModelForm):
    """Custom form for User model with validation"""
    class Meta:
        model = User
        fields = '__all__'

    def clean_role(self):
        role = self.cleaned_data.get('role')

        # Check if trying to create/change to admin when one already exists
        if role == 'admin':
            existing_admin = User.objects.filter(role='admin').first()
            # Allow editing the existing admin, but not creating a new one
            if existing_admin and (not self.instance.pk or self.instance.pk != existing_admin.pk):
                raise ValidationError(
                    f"An admin account already exists (username: {existing_admin.username}). "
                    "Only one admin is allowed in the system."
                )

        return role


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for custom User model"""

    form = UserForm  # Use our custom form with validation

    list_display = ('username', 'email', 'first_name', 'last_name',
                    'role', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('role', 'is_staff', 'is_superuser',
                   'is_active', 'date_joined')
    search_fields = ('username', 'first_name', 'last_name', 'email')
    ordering = ('username',)

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name',
         'email', 'phone', 'date_of_birth', 'address', 'profile_picture')}),
        (_('Permissions'), {'fields': (
            'role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role'),
        }),
    )

    readonly_fields = ('date_joined', 'last_login')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        # Non-superusers can only see students
        return qs.filter(role='student')
