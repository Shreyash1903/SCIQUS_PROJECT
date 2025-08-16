#!/usr/bin/env python
"""
Test script to verify the enrollment fix is working
"""
from courses.models import Course
from students.models import Student
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


def test_enrollment_api():
    """Test the enrollment API endpoints"""
    base_url = "http://127.0.0.1:8000/api"

    print("🔍 Testing Course Enrollment Fix...")
    print("=" * 50)

    # First, let's get a student token
    print("\n1. Getting student authentication token...")

    # Use existing student credentials
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
        print(login_response.text)
        return

    # Get student profile
    print("\n2. Getting student profile...")
    headers = {"Authorization": f"Bearer {student_token}"}

    profile_response = requests.get(
        f"{base_url}/students/my-profile/", headers=headers)

    if profile_response.status_code == 200:
        student_data = profile_response.json()
        print(f"✅ Student profile retrieved: {student_data['student_number']}")
        student_id = student_data['student_id']
    else:
        print(
            f"❌ Failed to get student profile: {profile_response.status_code}")
        return

    # Get available courses
    print("\n3. Getting available courses...")
    courses_response = requests.get(f"{base_url}/courses/", headers=headers)

    if courses_response.status_code == 200:
        courses_data = courses_response.json()
        if courses_data['results']:
            course = courses_data['results'][0]
            course_id = course['course_id']
            print(
                f"✅ Found course: {course['course_code']} - {course['course_name']}")
        else:
            print("❌ No courses found")
            return
    else:
        print(f"❌ Failed to get courses: {courses_response.status_code}")
        return

    # Test enrollment
    print("\n4. Testing course enrollment...")
    enrollment_data = {
        "student_id": student_id
    }

    enrollment_response = requests.post(
        f"{base_url}/courses/{course_id}/enroll/",
        headers=headers,
        json=enrollment_data
    )

    print(f"📡 Enrollment request to: {base_url}/courses/{course_id}/enroll/")
    print(f"📡 Request data: {enrollment_data}")
    print(f"📡 Response status: {enrollment_response.status_code}")

    if enrollment_response.status_code == 200:
        response_data = enrollment_response.json()
        print("✅ Enrollment successful!")
        print(f"   📚 Message: {response_data['message']}")
        print(f"   🎓 Student: {response_data['student']['student_number']}")
        print(
            f"   📅 Enrollment Date: {response_data['student']['enrollment_date']}")
        print(f"   📊 Status: {response_data['student']['enrollment_status']}")
    else:
        print(f"❌ Enrollment failed: {enrollment_response.status_code}")
        try:
            error_data = enrollment_response.json()
            print(f"   Error: {error_data}")
        except:
            print(f"   Raw response: {enrollment_response.text}")

    print("\n" + "=" * 50)
    print("🏁 Test completed!")


if __name__ == "__main__":
    test_enrollment_api()
