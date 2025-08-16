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


def test_student_data_format():
    """Test what data format is returned by student profile"""
    try:
        # Get the student user (shimpi_rohit)
        student_user = User.objects.get(username='shimpi_rohit')
        print(f"🔍 Found student user: {student_user.username}")

        # Get the student instance
        student = Student.objects.get(user=student_user)
        print(f"📚 Found student: {student.full_name}")

        # Check what fields are available
        print("\n📊 Student fields:")
        print(f"  - student_id: {student.student_id}")
        print(f"  - full_name: {student.full_name}")
        print(f"  - student_number: {student.student_number}")
        print(f"  - enrollment_date: {student.enrollment_date}")
        print(f"  - status: {student.status}")
        print(f"  - is_active_student: {student.is_active_student}")

        # Check enrolled courses using active_courses property
        active_courses = student.active_courses
        print(f"\n🎯 Active courses count: {active_courses.count()}")

        if active_courses.exists():
            print(f"📚 Active courses (from property):")
            for i, course in enumerate(active_courses, 1):
                print(f"  {i}. Course ID: {course.course_id}")
                print(f"     Course Name: {course.course_name}")
                print(f"     Course Code: {course.course_code}")
                print(f"     Credits: {course.credits}")
                print(f"     Duration: {course.course_duration}")
                print(f"     Active: {course.is_active}")
                print()
        else:
            print("❌ No active courses found")

        # Check using enrollments (many-to-many relationship)
        enrollments = student.enrollments.filter(status='enrolled')
        print(f"🔗 Active enrollments count: {enrollments.count()}")

        if enrollments.exists():
            print(f"📚 Active enrollments:")
            for enrollment in enrollments:
                course = enrollment.course
                print(f"  - Course: {course.course_name}")
                print(f"    Code: {course.course_code}")
                print(f"    ID: {course.course_id}")
                print(f"    Active: {course.is_active}")
                print(f"    Credits: {course.credits}")
                print(f"    Duration: {course.course_duration}")
                print(f"    Enrollment Date: {enrollment.enrollment_date}")
                print(f"    Status: {enrollment.status}")
                print()

        # Check the serialized format used by the API
        print("\n🔧 Testing serialized format (like API):")
        active_courses_list = []
        for course in student.active_courses:
            course_data = {
                'course_id': str(course.course_id),
                'course_name': course.course_name,
                'course_code': course.course_code,
                'credits': course.credits,
                'course_duration': course.course_duration,
                'is_active': course.is_active,
                'description': course.description,
            }
            active_courses_list.append(course_data)

        print(
            f"📊 Serialized active_courses format: {len(active_courses_list)} courses")
        for i, course in enumerate(active_courses_list, 1):
            print(f"  {i}. {course}")
            print()

    except User.DoesNotExist:
        print("❌ Student user 'shimpi_rohit' not found")
    except Student.DoesNotExist:
        print("❌ Student instance not found")
    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    print("🧪 Testing My Courses Data Format...")
    test_student_data_format()
