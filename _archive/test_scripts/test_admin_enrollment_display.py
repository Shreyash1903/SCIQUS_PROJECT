#!/usr/bin/env python3
"""
Test script to verify admin dashboard enrollment display fix
"""
import requests
import json


def test_admin_dashboard_enrollment_display():
    """Test the admin dashboard enrollment display logic"""

    # Admin credentials
    headers = {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU1MzUzMjg2LCJpYXQiOjE3NTUzNDk2ODYsImp0aSI6ImNlM2UxZTU0MTM4NTQ3MGQ4NDhmOTJmOTVmZGFiOWViIiwidXNlcl9pZCI6IjkifQ.Umjv0OhmniuGEhXMbvPzkIwHMO_LBYwsO_sHGshq4z4'
    }

    print("🔍 Testing Admin Dashboard Enrollment Display Fix")
    print("=" * 60)

    # Get students data from admin dashboard API
    response = requests.get(
        'http://127.0.0.1:8000/api/students/?limit=5', headers=headers)

    if response.status_code != 200:
        print(f"❌ API Error: {response.status_code}")
        print(response.text)
        return

    data = response.json()
    print(f"✅ Found {len(data.get('results', []))} students")
    print()

    # Simulate the frontend logic for each student
    for i, student in enumerate(data.get('results', []), 1):
        print(f"📋 Student #{i}: {student.get('full_name', 'Unknown')}")
        print(f"   📧 Email: {student.get('email', 'N/A')}")
        print(f"   🆔 ID: {student.get('student_number', 'N/A')}")
        print(f"   📊 Status: {student.get('status', 'Unknown')}")

        # Apply the NEW frontend logic
        active_courses = student.get('active_courses', [])
        if active_courses and len(active_courses) > 0:
            if len(active_courses) == 1:
                enrollment_text = active_courses[0]['course_name']
                print(f"   📚 Course: {enrollment_text}")
            else:
                enrollment_text = f"{len(active_courses)} courses"
                print(f"   📚 Courses: {enrollment_text}")
                print("      📚 Enrolled in:")
                for course in active_courses:
                    print(
                        f"         • {course['course_name']} ({course['course_code']})")
        else:
            enrollment_text = "Not enrolled"
            print(f"   📚 Course: {enrollment_text}")

        print(f"   💡 Dashboard Display: 'Courses: {enrollment_text}'")
        print()

    print("✅ Admin Dashboard Enrollment Display Test Complete!")
    print()
    print("🎯 Expected Results:")
    print("   - Rohit should show '3 courses' instead of 'Not enrolled'")
    print("   - Other students should show their actual enrollment status")


if __name__ == "__main__":
    test_admin_dashboard_enrollment_display()
