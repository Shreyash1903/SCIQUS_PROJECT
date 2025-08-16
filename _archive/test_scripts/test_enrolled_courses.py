#!/usr/bin/env python
"""
Test script to check if students can see their enrolled courses
"""
from courses.models import Course
from students.models import Student, Enrollment
from django.contrib.auth import get_user_model
import os
import django
import requests
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      'student_course_management.settings')
django.setup()


User = get_user_model()


def test_enrolled_courses():
    """Test if student can see enrolled courses"""
    base_url = "http://127.0.0.1:8000/api"

    print("🔍 Testing Student Enrolled Courses...")
    print("=" * 50)

    # Get student token
    print("\n1. Getting student authentication token...")
    student_credentials = {
        "username": "shimpi_rohit",
        "password": "student123"
    }

    login_response = requests.post(
        f"{base_url}/auth/login/", json=student_credentials)

    if login_response.status_code == 200:
        student_token = login_response.json()["access"]
        print("✅ Student authentication successful")
    else:
        print(f"❌ Student authentication failed: {login_response.status_code}")
        return

    headers = {"Authorization": f"Bearer {student_token}"}

    # Get student profile to check enrolled courses
    print("\n2. Getting student profile with enrolled courses...")
    profile_response = requests.get(
        f"{base_url}/students/my-profile/", headers=headers)

    if profile_response.status_code == 200:
        student_data = profile_response.json()
        print(f"✅ Student profile retrieved: {student_data['student_number']}")
        print(
            f"📚 Active courses count: {len(student_data.get('active_courses', []))}")
        print(
            f"📝 Active enrollments count: {len(student_data.get('active_enrollments', []))}")

        if student_data.get('active_courses'):
            print("\n📖 Active Courses:")
            for course in student_data['active_courses']:
                print(f"   - {course['course_code']}: {course['course_name']}")
        else:
            print("❌ No active courses found")

        if student_data.get('active_enrollments'):
            print("\n📝 Active Enrollments:")
            for enrollment in student_data['active_enrollments']:
                print(f"   - Course: {enrollment.get('course_code', 'N/A')}")
                print(f"     Status: {enrollment.get('status', 'N/A')}")
                print(f"     Date: {enrollment.get('enrollment_date', 'N/A')}")
        else:
            print("❌ No active enrollments found")
    else:
        print(
            f"❌ Failed to get student profile: {profile_response.status_code}")
        print(profile_response.text)

    # Check enrollments endpoint
    print("\n3. Checking enrollments endpoint...")
    try:
        # First get student ID from profile
        student_id = student_data.get('student_id')
        if student_id:
            enrollments_response = requests.get(
                f"{base_url}/students/{student_id}/enrollments/", headers=headers)

            if enrollments_response.status_code == 200:
                enrollments_data = enrollments_response.json()
                print(
                    f"✅ Enrollments retrieved: {enrollments_data.get('total_enrollments', 0)} total")
                print(
                    f"📚 Active enrollments: {enrollments_data.get('active_enrollments', 0)}")

                if enrollments_data.get('enrollments'):
                    print("\n📋 Enrollment Details:")
                    for enrollment in enrollments_data['enrollments']:
                        print(
                            f"   - Course: {enrollment.get('course_code', 'N/A')}")
                        print(
                            f"     Status: {enrollment.get('status', 'N/A')}")
                        print(
                            f"     Date: {enrollment.get('enrollment_date', 'N/A')}")
            else:
                print(
                    f"❌ Failed to get enrollments: {enrollments_response.status_code}")
                print(enrollments_response.text)
    except Exception as e:
        print(f"❌ Error checking enrollments: {e}")

    # Check database directly
    print("\n4. Checking database directly...")
    try:
        user = User.objects.get(username='shimpi_rohit')
        student = user.student_profile

        print(f"🎓 Student found: {student.student_number}")
        print(f"📚 Total courses: {student.courses.count()}")
        print(f"📝 Total enrollments: {student.enrollments.count()}")
        print(f"🟢 Active enrollments: {student.active_enrollments.count()}")

        # List all enrollments
        enrollments = student.enrollments.all()
        print(f"\n📋 All Enrollments ({enrollments.count()}):")
        for enrollment in enrollments:
            print(
                f"   - Course: {enrollment.course.course_code} - {enrollment.course.course_name}")
            print(f"     Status: {enrollment.status}")
            print(f"     Date: {enrollment.enrollment_date}")
            print(f"     Active: {enrollment.is_active}")
            print()

        # Check active courses property
        active_courses = student.active_courses
        print(f"🎯 Active courses property: {active_courses.count()}")
        for course in active_courses:
            print(f"   - {course.course_code}: {course.course_name}")

    except Exception as e:
        print(f"❌ Database check error: {e}")

    print("\n" + "=" * 50)
    print("🏁 Test completed!")


if __name__ == "__main__":
    test_enrolled_courses()
