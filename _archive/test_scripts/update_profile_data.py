#!/usr/bin/env python3

from authentication.models import User
from students.models import Student
import os
import sys
import django
from datetime import date

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      'student_course_management.settings')
django.setup()


def update_student_profile():
    """Update student profile with missing information"""
    try:
        # Get the student user (shimpi_rohit)
        student_user = User.objects.get(username='shimpi_rohit')
        print(f"🔍 Found student user: {student_user.username}")

        # Update missing user fields
        print("\n📝 Updating user information...")

        if not student_user.phone:
            student_user.phone = "+91 9876543210"  # Example phone number
            print("  ✅ Added phone number")

        if not student_user.date_of_birth:
            student_user.date_of_birth = date(2000, 1, 15)  # Example DOB
            print("  ✅ Added date of birth")

        if not student_user.address:
            student_user.address = "Pune, Maharashtra, India"  # Example address
            print("  ✅ Added address")

        # Save the user
        student_user.save()
        print("  💾 User information saved")

        # Print updated information
        print(f"\n📊 Updated User Information:")
        print(f"  - First Name: {student_user.first_name}")
        print(f"  - Last Name: {student_user.last_name}")
        print(f"  - Email: {student_user.email}")
        print(f"  - Phone: {student_user.phone}")
        print(f"  - Date of Birth: {student_user.date_of_birth}")
        print(f"  - Address: {student_user.address}")

        # Get student info
        student = Student.objects.get(user=student_user)
        print(f"\n📚 Student Information:")
        print(f"  - Student Number: {student.student_number}")
        print(f"  - Status: {student.status}")
        print(f"  - Enrollment Date: {student.enrollment_date}")

        print("\n✅ Profile updated successfully!")
        print("🔄 Refresh the profile page to see the changes")

    except User.DoesNotExist:
        print("❌ Student user 'shimpi_rohit' not found")
    except Student.DoesNotExist:
        print("❌ Student instance not found")
    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    print("🔧 Updating Student Profile Data...")
    update_student_profile()
