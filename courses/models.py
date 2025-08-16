from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone
import uuid


class Course(models.Model):
    """
    Course model to store course information
    """
    course_id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for the course"
    )
    course_name = models.CharField(
        max_length=255,
        help_text="Name of the course"
    )
    course_code = models.CharField(
        max_length=20,
        unique=True,
        help_text="Unique course code"
    )
    course_duration = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        help_text="Course duration in months"
    )
    description = models.TextField(
        blank=True,
        null=True,
        help_text="Detailed description of the course"
    )
    credits = models.PositiveIntegerField(
        default=3,
        validators=[MinValueValidator(1)],
        help_text="Number of credits for the course"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether the course is currently active"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'courses'
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'
        ordering = ['course_name']

    def __str__(self):
        return f"{self.course_code} - {self.course_name}"

    @property
    def enrolled_students_count(self):
        """Return the number of students enrolled in this course"""
        return self.enrolled_students.count()

    def clean(self):
        """Custom validation"""
        from django.core.exceptions import ValidationError
        if self.course_duration <= 0:
            raise ValidationError("Course duration must be greater than 0")

        # Convert course_code to uppercase
        if self.course_code:
            self.course_code = self.course_code.upper()

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
