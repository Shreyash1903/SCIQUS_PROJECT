from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from courses.models import Course
from students.models import Student
import uuid

User = get_user_model()


class Command(BaseCommand):
    help = 'Initialize the database with sample data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear-data',
            action='store_true',
            help='Clear existing data before creating sample data',
        )

    def handle(self, *args, **options):
        if options['clear_data']:
            self.stdout.write('Clearing existing data...')
            Student.objects.all().delete()
            Course.objects.all().delete()
            User.objects.filter(role__in=['admin', 'student']).delete()

        self.stdout.write('Creating sample data...')

        with transaction.atomic():
            # Create admin user
            admin_user, created = User.objects.get_or_create(
                username='admin',
                defaults={
                    'email': 'admin@scms.com',
                    'first_name': 'System',
                    'last_name': 'Administrator',
                    'role': 'admin',
                    'is_staff': True,
                    'is_superuser': True,
                }
            )
            if created:
                admin_user.set_password('admin123')
                admin_user.save()
                self.stdout.write(f'Created admin user: {admin_user.username}')

            # Create sample courses
            courses_data = [
                {
                    'course_name': 'Computer Science',
                    'course_code': 'CS101',
                    'course_duration': 48,
                    'description': 'Comprehensive computer science program covering programming, algorithms, and software engineering.',
                    'credits': 4,
                },
                {
                    'course_name': 'Data Science',
                    'course_code': 'DS201',
                    'course_duration': 36,
                    'description': 'Data science program focusing on machine learning, statistics, and data analysis.',
                    'credits': 4,
                },
                {
                    'course_name': 'Web Development',
                    'course_code': 'WD301',
                    'course_duration': 24,
                    'description': 'Full-stack web development program covering frontend and backend technologies.',
                    'credits': 3,
                },
                {
                    'course_name': 'Cybersecurity',
                    'course_code': 'CY401',
                    'course_duration': 42,
                    'description': 'Cybersecurity program covering network security, ethical hacking, and risk management.',
                    'credits': 4,
                },
                {
                    'course_name': 'Mobile App Development',
                    'course_code': 'MAD501',
                    'course_duration': 30,
                    'description': 'Mobile application development for iOS and Android platforms.',
                    'credits': 3,
                },
            ]

            courses = []
            for course_data in courses_data:
                course, created = Course.objects.get_or_create(
                    course_code=course_data['course_code'],
                    defaults=course_data
                )
                courses.append(course)
                if created:
                    self.stdout.write(f'Created course: {course.course_name}')

            # Create sample students
            students_data = [
                {
                    'username': 'john_doe',
                    'email': 'john.doe@student.scms.com',
                    'first_name': 'John',
                    'last_name': 'Doe',
                    'phone': '+1234567890',
                    'gender': 'M',
                    'course': courses[0],  # Computer Science
                },
                {
                    'username': 'jane_smith',
                    'email': 'jane.smith@student.scms.com',
                    'first_name': 'Jane',
                    'last_name': 'Smith',
                    'phone': '+1234567891',
                    'gender': 'F',
                    'course': courses[1],  # Data Science
                },
                {
                    'username': 'mike_johnson',
                    'email': 'mike.johnson@student.scms.com',
                    'first_name': 'Mike',
                    'last_name': 'Johnson',
                    'phone': '+1234567892',
                    'gender': 'M',
                    'course': courses[2],  # Web Development
                },
                {
                    'username': 'sarah_wilson',
                    'email': 'sarah.wilson@student.scms.com',
                    'first_name': 'Sarah',
                    'last_name': 'Wilson',
                    'phone': '+1234567893',
                    'gender': 'F',
                    'course': courses[3],  # Cybersecurity
                },
                {
                    'username': 'alex_brown',
                    'email': 'alex.brown@student.scms.com',
                    'first_name': 'Alex',
                    'last_name': 'Brown',
                    'phone': '+1234567894',
                    'gender': 'M',
                    'course': courses[4],  # Mobile App Development
                },
                {
                    'username': 'emily_davis',
                    'email': 'emily.davis@student.scms.com',
                    'first_name': 'Emily',
                    'last_name': 'Davis',
                    'phone': '+1234567895',
                    'gender': 'F',
                    'course': courses[0],  # Computer Science
                },
                {
                    'username': 'david_martinez',
                    'email': 'david.martinez@student.scms.com',
                    'first_name': 'David',
                    'last_name': 'Martinez',
                    'phone': '+1234567896',
                    'gender': 'M',
                    'course': courses[1],  # Data Science
                },
                {
                    'username': 'lisa_taylor',
                    'email': 'lisa.taylor@student.scms.com',
                    'first_name': 'Lisa',
                    'last_name': 'Taylor',
                    'phone': '+1234567897',
                    'gender': 'F',
                    'course': courses[2],  # Web Development
                },
            ]

            for student_data in students_data:
                course = student_data.pop('course')
                gender = student_data.pop('gender', 'M')

                # Create user (remove gender from user data)
                user_data = {k: v for k, v in student_data.items()
                             if k != 'gender'}
                user, created = User.objects.get_or_create(
                    username=user_data['username'],
                    defaults={
                        **user_data,
                        'role': 'student',
                        'is_active': True,
                    }
                )

                if created:
                    user.set_password('student123')
                    user.save()

                    # Create student profile
                    student = Student.objects.create(
                        user=user,
                        course=course,
                        gender=gender,
                        emergency_contact_name=f"{student_data['first_name']} Emergency Contact",
                        emergency_contact_phone=student_data.get('phone', ''),
                    )

                    self.stdout.write(
                        f'Created student: {student.full_name} ({student.student_number})')

        self.stdout.write(
            self.style.SUCCESS(
                'Successfully initialized database with sample data!')
        )

        self.stdout.write('\nLogin credentials:')
        self.stdout.write('Admin: username=admin, password=admin123')
        self.stdout.write(
            'Students: username=<student_username>, password=student123')
        self.stdout.write(
            '\nExample student usernames: john_doe, jane_smith, mike_johnson, etc.')
