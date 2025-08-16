from django.db import models
from django.conf import settings
from django.core.validators import RegexValidator
from django.utils import timezone
import uuid


class Student(models.Model):
    """
    Student model to store student information
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('graduated', 'Graduated'),
        ('dropped', 'Dropped'),
    ]

    student_id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for the student"
    )
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='student_profile',
        help_text="User account associated with this student"
    )
    student_number = models.CharField(
        max_length=20,
        unique=True,
        help_text="Unique student registration number"
    )
    # Replace single course with many-to-many relationship through enrollments
    courses = models.ManyToManyField(
        'courses.Course',
        through='Enrollment',
        related_name='enrolled_students',
        blank=True,
        help_text="Courses enrolled by the student"
    )
    enrollment_date = models.DateField(
        default=timezone.now,
        help_text="Date when student first enrolled"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active',
        help_text="Current status of the student"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'students'
        verbose_name = 'Student'
        verbose_name_plural = 'Students'
        ordering = ['student_number']

    def __str__(self):
        return f"{self.student_number} - {self.user.get_full_name() or self.user.username}"

    @property
    def full_name(self):
        """Return the full name of the student"""
        return self.user.get_full_name() or self.user.username

    @property
    def email(self):
        """Return the email of the student"""
        return self.user.email

    @property
    def is_active_student(self):
        """Check if student is active"""
        return self.status == 'active'

    @property
    def active_enrollments(self):
        """Return active course enrollments"""
        return self.enrollments.filter(status='enrolled')

    @property
    def active_courses(self):
        """Return courses the student is actively enrolled in"""
        return self.courses.filter(enrollments__status='enrolled')

    def enroll_in_course(self, course):
        """Enroll student in a course"""
        enrollment, created = Enrollment.objects.get_or_create(
            student=self,
            course=course,
            defaults={'status': 'enrolled'}
        )
        if not created and enrollment.status != 'enrolled':
            enrollment.status = 'enrolled'
            enrollment.enrollment_date = timezone.now()
            enrollment.save()
        return enrollment

    def unenroll_from_course(self, course):
        """Unenroll student from a course"""
        try:
            enrollment = Enrollment.objects.get(student=self, course=course)
            enrollment.status = 'withdrawn'
            enrollment.save()
            return enrollment
        except Enrollment.DoesNotExist:
            return None

    def is_enrolled_in_course(self, course):
        """Check if student is enrolled in a specific course"""
        return self.enrollments.filter(course=course, status='enrolled').exists()

    def clean(self):
        """Custom validation"""
        from django.core.exceptions import ValidationError

        # Ensure user has student role
        if self.user and self.user.role != 'student':
            raise ValidationError("Associated user must have 'student' role")

    def save(self, *args, **kwargs):
        # Generate student number if not provided
        if not self.student_number:
            from django.utils import timezone
            year = timezone.now().year
            # Get the latest student number for this year
            latest_student = Student.objects.filter(
                student_number__startswith=f"STU{year}"
            ).order_by('student_number').last()

            if latest_student:
                # Extract the number and increment
                try:
                    last_number = int(latest_student.student_number[-4:])
                    new_number = last_number + 1
                except (ValueError, IndexError):
                    new_number = 1
            else:
                new_number = 1

            self.student_number = f"STU{year}{new_number:04d}"

        self.full_clean()
        super().save(*args, **kwargs)


class Enrollment(models.Model):
    """
    Intermediate model for student-course enrollment with additional information
    """
    ENROLLMENT_STATUS_CHOICES = [
        ('enrolled', 'Enrolled'),
        ('completed', 'Completed'),
        ('withdrawn', 'Withdrawn'),
        ('failed', 'Failed'),
        ('suspended', 'Suspended'),
    ]

    GRADE_CHOICES = [
        ('A+', 'A+'),
        ('A', 'A'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B', 'B'),
        ('B-', 'B-'),
        ('C+', 'C+'),
        ('C', 'C'),
        ('C-', 'C-'),
        ('D+', 'D+'),
        ('D', 'D'),
        ('F', 'F'),
        ('I', 'Incomplete'),
        ('W', 'Withdrawn'),
    ]

    enrollment_id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for the enrollment"
    )
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='enrollments',
        help_text="Student enrolled in the course"
    )
    course = models.ForeignKey(
        'courses.Course',
        on_delete=models.CASCADE,
        related_name='enrollments',
        help_text="Course the student is enrolled in"
    )
    enrollment_date = models.DateTimeField(
        default=timezone.now,
        help_text="Date and time of enrollment"
    )
    status = models.CharField(
        max_length=20,
        choices=ENROLLMENT_STATUS_CHOICES,
        default='enrolled',
        help_text="Current enrollment status"
    )
    grade = models.CharField(
        max_length=3,
        choices=GRADE_CHOICES,
        blank=True,
        null=True,
        help_text="Final grade for the course"
    )
    completion_date = models.DateTimeField(
        blank=True,
        null=True,
        help_text="Date when the course was completed"
    )
    credits_earned = models.PositiveIntegerField(
        blank=True,
        null=True,
        help_text="Credits earned for this course"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'enrollments'
        verbose_name = 'Enrollment'
        verbose_name_plural = 'Enrollments'
        ordering = ['-enrollment_date']
        # Prevent duplicate enrollments
        unique_together = [['student', 'course']]

    def __str__(self):
        return f"{self.student.student_number} - {self.course.course_code} ({self.status})"

    @property
    def is_active(self):
        """Check if enrollment is active"""
        return self.status == 'enrolled'

    @property
    def is_completed(self):
        """Check if enrollment is completed"""
        return self.status == 'completed'

    def complete_course(self, grade=None):
        """Mark the course as completed"""
        self.status = 'completed'
        self.completion_date = timezone.now()
        if grade:
            self.grade = grade
        if not self.credits_earned:
            self.credits_earned = self.course.credits
        self.save()

    def withdraw_from_course(self):
        """Withdraw from the course"""
        self.status = 'withdrawn'
        self.grade = 'W'
        self.save()

    def clean(self):
        """Custom validation"""
        from django.core.exceptions import ValidationError

        # Ensure completion date is set when status is completed
        if self.status == 'completed' and not self.completion_date:
            self.completion_date = timezone.now()

        # Ensure credits earned matches course credits when completed
        if self.status == 'completed' and not self.credits_earned:
            self.credits_earned = self.course.credits
