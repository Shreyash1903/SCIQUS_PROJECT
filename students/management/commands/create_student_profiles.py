from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from students.models import Student

User = get_user_model()


class Command(BaseCommand):
    help = 'Create student profiles for existing users with student role who don\'t have profiles'

    def handle(self, *args, **options):
        # Find users with role 'student' who don't have student profiles
        users_without_profiles = User.objects.filter(
            role='student'
        ).exclude(
            student_profile__isnull=False
        )

        created_count = 0
        for user in users_without_profiles:
            try:
                Student.objects.create(
                    user=user,
                    course=None  # No course initially
                )
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✅ Created student profile for user: {user.username}'
                    )
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f'❌ Error creating profile for {user.username}: {e}'
                    )
                )

        if created_count == 0:
            self.stdout.write(
                self.style.WARNING(
                    '⚠️ No student profiles needed to be created'
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    f'🎉 Successfully created {created_count} student profiles'
                )
            )
