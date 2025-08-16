from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Student

User = get_user_model()


@receiver(post_save, sender=User)
def create_student_profile(sender, instance, created, **kwargs):
    """
    Create a Student profile when a User with role 'student' is created.
    Note: This will create a student profile without a course initially.
    The student can then enroll in courses later.
    """
    if created and instance.role == 'student':
        # Check if student profile already exists
        if not hasattr(instance, 'student_profile'):
            try:
                # Create student profile without course (course is optional now)
                Student.objects.create(
                    user=instance,
                    course=None  # No course initially - student can enroll later
                )
                print(
                    f"✅ Student profile created for user: {instance.username}")
            except Exception as e:
                print(
                    f"❌ Error creating student profile for {instance.username}: {e}")


@receiver(post_save, sender=User)
def save_student_profile(sender, instance, **kwargs):
    """
    Save the Student profile when the User is updated.
    """
    if instance.role == 'student' and hasattr(instance, 'student_profile'):
        try:
            instance.student_profile.save()
        except Exception as e:
            print(
                f"❌ Error saving student profile for {instance.username}: {e}")
