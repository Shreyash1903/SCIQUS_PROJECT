from django.contrib import admin
from .models import Course


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    """Admin configuration for Course model"""

    list_display = ('course_code', 'course_name', 'course_duration',
                    'credits', 'is_active', 'enrolled_students_count', 'created_at')
    list_filter = ('is_active', 'course_duration', 'credits', 'created_at')
    search_fields = ('course_name', 'course_code', 'description')
    readonly_fields = ('course_id', 'created_at',
                       'updated_at', 'enrolled_students_count')
    list_editable = ('is_active',)
    ordering = ('course_code',)

    fieldsets = (
        ('Basic Information', {
            'fields': ('course_id', 'course_name', 'course_code', 'course_duration', 'credits')
        }),
        ('Details', {
            'fields': ('description', 'is_active'),
            'classes': ('wide',)
        }),
        ('Statistics', {
            'fields': ('enrolled_students_count',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def enrolled_students_count(self, obj):
        """Display count of enrolled students"""
        return obj.enrolled_students_count
    enrolled_students_count.short_description = 'Enrolled Students'

    actions = ['activate_courses', 'deactivate_courses']

    def activate_courses(self, request, queryset):
        """Bulk activate courses"""
        updated = queryset.update(is_active=True)
        self.message_user(
            request, f'{updated} courses were successfully activated.')
    activate_courses.short_description = 'Activate selected courses'

    def deactivate_courses(self, request, queryset):
        """Bulk deactivate courses"""
        updated = queryset.update(is_active=False)
        self.message_user(
            request, f'{updated} courses were successfully deactivated.')
    deactivate_courses.short_description = 'Deactivate selected courses'
