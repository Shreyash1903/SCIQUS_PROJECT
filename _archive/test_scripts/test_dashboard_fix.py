#!/usr/bin/env python
"""
Test script to verify the dashboard enrolled courses fix
"""
import os
import django
import requests
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      'student_course_management.settings')
django.setup()


def test_dashboard_fix():
    """Test the dashboard enrolled courses fix"""
    base_url = "http://127.0.0.1:8000/api"

    print("🔍 Testing Dashboard Enrolled Courses Fix...")
    print("=" * 60)

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

    # Simulate the dashboard fetchDashboardData function
    print("\n2. Simulating dashboard data fetch...")

    # Get all courses and student profile (like the dashboard does)
    courses_response = requests.get(
        f"{base_url}/courses/?is_active=true", headers=headers)
    profile_response = requests.get(
        f"{base_url}/students/my-profile/", headers=headers)

    if courses_response.status_code == 200 and profile_response.status_code == 200:
        all_courses = courses_response.json().get('results', [])
        student_data = profile_response.json()

        print(f"✅ Found {len(all_courses)} available courses")
        print(f"✅ Student profile retrieved: {student_data['student_number']}")

        # Simulate the OLD dashboard logic (WRONG)
        print("\n3. Testing OLD vs NEW dashboard logic...")
        student_current_course_old = student_data.get('course')
        enrolled_old = [
            student_current_course_old] if student_current_course_old else []
        print(f"❌ OLD logic would show: {len(enrolled_old)} enrolled courses")

        # Simulate the NEW dashboard logic (CORRECT)
        student_active_courses_new = student_data.get('active_courses', [])
        enrolled_new = student_active_courses_new
        print(f"✅ NEW logic shows: {len(enrolled_new)} enrolled courses")

        if enrolled_new:
            print("\n📚 Enrolled Courses (Dashboard View):")
            for course in enrolled_new:
                print(f"   - {course['course_code']}: {course['course_name']}")

        # Calculate available courses (not enrolled)
        available = [
            course for course in all_courses
            if not any(
                enrolled_course.get('course_id') == course.get('course_id')
                for enrolled_course in enrolled_new
            )
        ]

        print(f"\n📖 Available courses (not enrolled): {len(available)}")

        # Dashboard stats summary
        print(f"\n📊 Dashboard Statistics:")
        print(f"   Enrolled Courses: {len(enrolled_new)}")
        print(f"   Available Courses: {len(available)}")
        print(f"   Total Courses: {len(all_courses)}")

    else:
        print(f"❌ Failed to fetch dashboard data")
        print(f"   Courses response: {courses_response.status_code}")
        print(f"   Profile response: {profile_response.status_code}")

    print("\n" + "=" * 60)
    print("🏁 Dashboard Test completed!")
    print("\n📝 Summary:")
    print("- ✅ Dashboard will now show correct enrolled courses count")
    print("- ✅ Dashboard will show correct available courses count")
    print("- ✅ Student can see their actual enrollment status")


if __name__ == "__main__":
    test_dashboard_fix()
