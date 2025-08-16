#!/usr/bin/env python3

import os
import sys
import django
import requests
import json

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      'student_course_management.settings')
django.setup()


def test_my_courses_api():
    """Test the student profile API to see what data is returned"""
    try:
        # First login to get a token
        login_url = 'http://127.0.0.1:8000/api/auth/login/'
        login_data = {
            'username': 'shimpi_rohit',
            'password': 'student123'
        }

        print("🔑 Logging in...")
        login_response = requests.post(login_url, json=login_data)

        if login_response.status_code == 200:
            token = login_response.json().get('access')
            print(f"✅ Login successful, got token")

            # Now test the student profile endpoint
            profile_url = 'http://127.0.0.1:8000/api/students/my-profile/'
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }

            print("📊 Fetching student profile...")
            profile_response = requests.get(profile_url, headers=headers)

            if profile_response.status_code == 200:
                profile_data = profile_response.json()
                print("✅ Student profile API response:")
                print(json.dumps(profile_data, indent=2, default=str))

                # Check active_courses specifically
                active_courses = profile_data.get('active_courses', [])
                print(f"\n📚 Active courses count: {len(active_courses)}")

                if active_courses:
                    print("📋 Active courses details:")
                    for i, course in enumerate(active_courses, 1):
                        print(
                            f"  {i}. Course Name: {course.get('course_name', 'N/A')}")
                        print(
                            f"     Course Code: {course.get('course_code', 'N/A')}")
                        print(
                            f"     Course ID: {course.get('course_id', 'N/A')}")
                        print(f"     Credits: {course.get('credits', 'N/A')}")
                        print(
                            f"     Duration: {course.get('course_duration', 'N/A')}")
                        print(f"     Active: {course.get('is_active', 'N/A')}")
                        print()
                else:
                    print("❌ No active_courses found in response")

            else:
                print(f"❌ Profile API failed: {profile_response.status_code}")
                print(f"Response: {profile_response.text}")

        else:
            print(f"❌ Login failed: {login_response.status_code}")
            print(f"Response: {login_response.text}")

    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    print("🧪 Testing My Courses API...")
    test_my_courses_api()
