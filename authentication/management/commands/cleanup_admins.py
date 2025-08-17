from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction

User = get_user_model()


class Command(BaseCommand):
    help = 'Clean up multiple admin accounts and keep only one'

    def add_arguments(self, parser):
        parser.add_argument(
            '--keep',
            type=str,
            help='Username of the admin to keep (default: first admin found)'
        )
        parser.add_argument(
            '--confirm',
            action='store_true',
            help='Actually perform the cleanup (required for safety)'
        )

    def handle(self, *args, **options):
        keep_username = options.get('keep')
        confirm = options.get('confirm')

        admins = User.objects.filter(role='admin').order_by('date_joined')
        admin_count = admins.count()

        if admin_count <= 1:
            self.stdout.write(
                self.style.SUCCESS(
                    f'System is already clean - only {admin_count} admin(s) found')
            )
            return

        self.stdout.write(
            self.style.WARNING(f'Found {admin_count} admin accounts:')
        )

        for i, admin in enumerate(admins, 1):
            self.stdout.write(
                f'  {i}. {admin.username} ({admin.email}) - Created: {admin.date_joined.strftime("%Y-%m-%d")}'
            )

        # Determine which admin to keep
        if keep_username:
            admin_to_keep = admins.filter(username=keep_username).first()
            if not admin_to_keep:
                self.stdout.write(
                    self.style.ERROR(
                        f'Admin with username "{keep_username}" not found')
                )
                return
        else:
            admin_to_keep = admins.first()  # Keep the first (oldest) admin

        admins_to_remove = admins.exclude(pk=admin_to_keep.pk)

        self.stdout.write('')
        self.stdout.write(
            self.style.SUCCESS(
                f'Will keep: {admin_to_keep.username} ({admin_to_keep.email})')
        )
        self.stdout.write(
            self.style.WARNING(
                f'Will remove {admins_to_remove.count()} admin(s):')
        )

        for admin in admins_to_remove:
            self.stdout.write(f'  - {admin.username} ({admin.email})')

        if not confirm:
            self.stdout.write('')
            self.stdout.write(
                self.style.NOTICE(
                    'This is a dry run. Use --confirm flag to actually perform the cleanup.'
                )
            )
            return

        # Perform the cleanup
        with transaction.atomic():
            removed_count = 0
            for admin in admins_to_remove:
                self.stdout.write(f'Removing admin: {admin.username}')
                admin.delete()
                removed_count += 1

            self.stdout.write('')
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully removed {removed_count} admin account(s). '
                    f'System now has only one admin: {admin_to_keep.username}'
                )
            )
