from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction

User = get_user_model()


class Command(BaseCommand):
    help = 'Create or replace the system admin account'

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str,
                            help='Admin username', default='admin')
        parser.add_argument('--email', type=str,
                            help='Admin email', required=True)
        parser.add_argument('--password', type=str,
                            help='Admin password', default='admin123')
        parser.add_argument('--first-name', type=str,
                            help='Admin first name', default='System')
        parser.add_argument('--last-name', type=str,
                            help='Admin last name', default='Admin')
        parser.add_argument('--force', action='store_true',
                            help='Replace existing admin if exists')

    def handle(self, *args, **options):
        username = options['username']
        email = options['email']
        password = options['password']
        first_name = options['first_name']
        last_name = options['last_name']
        force = options['force']

        with transaction.atomic():
            # Check if admin already exists
            existing_admin = User.objects.filter(role='admin').first()

            if existing_admin and not force:
                self.stdout.write(
                    self.style.WARNING(
                        f'Admin account already exists: {existing_admin.username} ({existing_admin.email})'
                    )
                )
                self.stdout.write(
                    self.style.NOTICE(
                        'Use --force flag to replace the existing admin')
                )
                return

            if existing_admin and force:
                self.stdout.write(
                    self.style.WARNING(
                        f'Replacing existing admin: {existing_admin.username} ({existing_admin.email})'
                    )
                )
                existing_admin.delete()

            # Create new admin
            admin_user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                role='admin',
                is_staff=True
            )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created admin account: {admin_user.username} ({admin_user.email})'
                )
            )
            self.stdout.write(
                self.style.NOTICE(
                    f'Login credentials - Username: {username}, Password: {password}'
                )
            )
