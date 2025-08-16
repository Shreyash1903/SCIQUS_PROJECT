#!/usr/bin/env python3

from authentication.models import User
from students.models import Student
import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      'student_course_management.settings')
django.setup()


def check_student_profile_data():
    """Check what data is missing for the student profile"""
    try:
        # Get the student user (shimpi_rohit)
        student_user = User.objects.get(username='shimpi_rohit')
        print(f"🔍 Found student user: {student_user.username}")

        # Check user fields
        print("\n👤 User Information:")
        print(f"  - ID: {student_user.id}")
        print(f"  - Username: {student_user.username}")
        print(f"  - Email: {student_user.email}")
        print(
            f"  - First Name: '{student_user.first_name}' (empty: {not student_user.first_name})")
        print(
            f"  - Last Name: '{student_user.last_name}' (empty: {not student_user.last_name})")
        print(f"  - Full Name: '{student_user.get_full_name()}'")
        print(f"  - Phone: {student_user.phone}")
        print(f"  - Date of Birth: {student_user.date_of_birth}")
        print(f"  - Address: {student_user.address}")
        print(f"  - Role: {student_user.role}")
        print(f"  - Date Joined: {student_user.date_joined}")
        print(f"  - Last Login: {student_user.last_login}")

        # Get the student instance
        student = Student.objects.get(user=student_user)
        print(f"\n📚 Student Information:")
        print(f"  - Student ID: {student.student_id}")
        print(f"  - Student Number: {student.student_number}")
        print(f"  - Full Name (property): '{student.full_name}'")
        print(f"  - Email (property): '{student.email}'")
        print(f"  - Status: {student.status}")
        print(f"  - Enrollment Date: {student.enrollment_date}")
        print(f"  - Active Student: {student.is_active_student}")

        # Check enrolled courses
        active_courses = student.active_courses
        print(f"\n🎯 Enrolled Courses: {active_courses.count()}")
        if active_courses.exists():
            for course in active_courses:
                print(f"  - {course.course_name} ({course.course_code})")
        else:
            print("  - No courses enrolled")

        print("\n🔧 Recommendations to fix 'Not provided' fields:")

        if not student_user.first_name:
            print("  1. Add first_name to user")
        if not student_user.last_name:
            print("  2. Add last_name to user")
        if not student_user.phone:
            print("  3. Add phone to user")
        if not student_user.date_of_birth:
            print("  4. Add date_of_birth to user")
        if not student_user.address:
            print("  5. Add address to user")

    except User.DoesNotExist:
        print("❌ Student user 'shimpi_rohit' not found")
    except Student.DoesNotExist:
        print("❌ Student instance not found")
    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    print("🧪 Checking Student Profile Data...")
    check_student_profile_data()
