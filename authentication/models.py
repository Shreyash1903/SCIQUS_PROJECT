from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser
    """
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('student', 'Student'),
    ]

    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='student',
        help_text="User role in the system"
    )
    phone = models.CharField(
        max_length=15,
        blank=True,
        null=True,
        help_text="Contact phone number"
    )
    date_of_birth = models.DateField(
        blank=True,
        null=True,
        help_text="Date of birth"
    )
    address = models.TextField(
        blank=True,
        null=True,
        help_text="User's address"
    )
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        blank=True,
        null=True,
        help_text="Profile picture"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'auth_user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

    @property
    def is_admin(self):
        return self.role == 'admin'

    @property
    def is_student(self):
        return self.role == 'student'
