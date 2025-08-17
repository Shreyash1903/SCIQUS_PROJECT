from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'List all admin accounts in the system'

    def handle(self, *args, **options):
        admins = User.objects.filter(role='admin')

        if not admins:
            self.stdout.write(
                self.style.NOTICE('No admin accounts found in the system')
            )
            return

        self.stdout.write(
            self.style.SUCCESS(f'Found {admins.count()} admin account(s):')
        )

        for admin in admins:
            self.stdout.write(
                f'  • Username: {admin.username}'
            )
            self.stdout.write(
                f'    Email: {admin.email}'
            )
            self.stdout.write(
                f'    Name: {admin.first_name} {admin.last_name}'
            )
            self.stdout.write(
                f'    Created: {admin.date_joined.strftime("%Y-%m-%d %H:%M")}'
            )
            self.stdout.write(
                f'    Active: {"Yes" if admin.is_active else "No"}'
            )
            self.stdout.write('')
