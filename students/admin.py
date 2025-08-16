from django.contrib import admin
from .models import Student, Enrollment


class EnrollmentInline(admin.TabularInline):
    """Inline admin for Enrollment model"""
    model = Enrollment
    extra = 0
    fields = ('course', 'enrollment_date', 'status',
              'grade', 'completion_date', 'credits_earned')
    readonly_fields = ('enrollment_id', 'created_at', 'updated_at')


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    """Admin configuration for Student model"""

    list_display = ('student_number', 'full_name', 'email',
                    'get_active_courses', 'status', 'enrollment_date')
    list_filter = ('status', 'enrollment_date', 'created_at')
    search_fields = ('student_number', 'user__username', 'user__first_name',
                     'user__last_name', 'user__email')
    readonly_fields = ('student_id', 'created_at',
                       'updated_at', 'full_name', 'email')
    list_editable = ('status',)
    ordering = ('student_number',)
    inlines = [EnrollmentInline]

    fieldsets = (
        ('Basic Information', {
            'fields': ('student_id', 'user', 'student_number', 'full_name', 'email')
        }),
        ('Academic Information', {
            'fields': ('enrollment_date', 'status'),
            'classes': ('wide',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def full_name(self, obj):
        """Display student's full name"""
        return obj.full_name
    full_name.short_description = 'Full Name'

    def email(self, obj):
        """Display student's email"""
        return obj.email
    email.short_description = 'Email'

    def get_active_courses(self, obj):
        """Display active courses for the student"""
        active_courses = obj.active_courses.all()
        if active_courses:
            return ", ".join([f"{course.course_code}" for course in active_courses[:3]])
        return "No active enrollments"
    get_active_courses.short_description = 'Active Courses'

    actions = ['activate_students', 'deactivate_students', 'graduate_students']

    def activate_students(self, request, queryset):
        """Bulk activate students"""
        updated = queryset.update(status='active')
        self.message_user(
            request, f'{updated} students were successfully activated.')
    activate_students.short_description = 'Activate selected students'

    def deactivate_students(self, request, queryset):
        """Bulk deactivate students"""
        updated = queryset.update(status='inactive')
        self.message_user(
            request, f'{updated} students were successfully deactivated.')
    deactivate_students.short_description = 'Deactivate selected students'

    def graduate_students(self, request, queryset):
        """Bulk graduate students"""
        updated = queryset.update(status='graduated')
        self.message_user(
            request, f'{updated} students were successfully graduated.')
    graduate_students.short_description = 'Graduate selected students'

    def get_queryset(self, request):
        """Customize queryset based on user permissions"""
        qs = super().get_queryset(request)
        if request.user.is_superuser or request.user.role == 'admin':
            return qs
        elif hasattr(request.user, 'student_profile'):
            # Students can only see their own profile
            return qs.filter(user=request.user)
        return qs.none()


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    """Admin configuration for Enrollment model"""

    list_display = ('student', 'course', 'enrollment_date',
                    'status', 'grade', 'credits_earned')
    list_filter = ('status', 'enrollment_date', 'course', 'grade')
    search_fields = ('student__student_number', 'student__user__username',
                     'course__course_code', 'course__course_name')
    readonly_fields = ('enrollment_id', 'created_at', 'updated_at')
    list_editable = ('status', 'grade')
    ordering = ('-enrollment_date',)

    fieldsets = (
        ('Enrollment Information', {
            'fields': ('enrollment_id', 'student', 'course', 'enrollment_date', 'status')
        }),
        ('Academic Progress', {
            'fields': ('grade', 'completion_date', 'credits_earned'),
            'classes': ('wide',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    actions = ['mark_completed', 'mark_withdrawn']

    def mark_completed(self, request, queryset):
        """Bulk mark enrollments as completed"""
        updated = queryset.update(status='completed')
        self.message_user(
            request, f'{updated} enrollments were marked as completed.')
    mark_completed.short_description = 'Mark selected enrollments as completed'

    def mark_withdrawn(self, request, queryset):
        """Bulk mark enrollments as withdrawn"""
        updated = queryset.update(status='withdrawn', grade='W')
        self.message_user(
            request, f'{updated} enrollments were marked as withdrawn.')
    mark_withdrawn.short_description = 'Mark selected enrollments as withdrawn'
