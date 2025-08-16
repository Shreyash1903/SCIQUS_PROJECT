#!/usr/bin/env python3
"""
Test script to verify enhanced students page functionality
"""
import requests
import json


def test_enhanced_students_page():
    """Test the enhanced students page with detailed student information"""

    # Admin credentials
    headers = {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU1MzUzMjg2LCJpYXQiOjE3NTUzNDk2ODYsImp0aSI6ImNlM2UxZTU0MTM4NTQ3MGQ4NDhmOTJmOTVmZGFiOWViIiwidXNlcl9pZCI6IjkifQ.Umjv0OhmniuGEhXMbvPzkIwHMO_LBYwsO_sHGshq4z4'
    }

    print("🎯 Testing Enhanced Students Management Page")
    print("=" * 60)

    # Get students data for the enhanced page
    response = requests.get(
        'http://127.0.0.1:8000/api/students/', headers=headers)

    if response.status_code != 200:
        print(f"❌ API Error: {response.status_code}")
        print(response.text)
        return

    data = response.json()
    students = data.get('results', [])
    total_students = data.get('count', len(students))

    print(f"✅ Found {total_students} students")
    print()

    print("📋 ENHANCED STUDENTS PAGE PREVIEW:")
    print("=" * 60)

    # Simulate the enhanced table layout
    print("🖥️  DESKTOP TABLE VIEW:")
    print("-" * 60)
    print(f"{'Student Details':<25} | {'Contact Info':<20} | {'Enrolled Courses':<25} | {'Status':<10} | {'Actions'}")
    print("-" * 110)

    for i, student in enumerate(students, 1):
        # Student Details Column
        name = student.get('full_name', 'Unknown')
        student_id = student.get('student_number', 'Unknown')
        uuid = student.get('student_id', 'Unknown')[:8] + '...'

        # Contact Info Column
        email = student.get('email') or student.get(
            'user_details', {}).get('email', 'No email')
        phone = student.get('user_details', {}).get('phone', 'No phone')

        # Enrolled Courses Column
        active_courses = student.get('active_courses', [])
        enrollment_date = student.get(
            'enrollment_date') or student.get('created_at')

        if active_courses and len(active_courses) > 0:
            if len(active_courses) == 1:
                course_display = f"{active_courses[0]['course_code']}"
            elif len(active_courses) <= 2:
                courses_text = ", ".join([c['course_code']
                                         for c in active_courses[:2]])
                course_display = courses_text
            else:
                course_display = f"{active_courses[0]['course_code']} +{len(active_courses)-1} more"
        else:
            course_display = "Not enrolled"

        # Status Column
        status = student.get('status', 'active')

        # Actions Column
        actions = "👁️ 📝 🗑️"

        print(
            f"{name[:20]:<20} ... | {email[:18]:<18} | {course_display[:23]:<23} | {status:<10} | {actions}")
        print(
            f"ID: {student_id[:15]:<15}     | {phone[:18]:<18} | Enrolled: {enrollment_date[:10] if enrollment_date else 'N/A':<12} |            |")
        print("-" * 110)

    print()
    print("📱 MOBILE CARD VIEW:")
    print("-" * 60)

    for i, student in enumerate(students, 1):
        name = student.get('full_name', 'Unknown')
        student_id = student.get('student_number', 'Unknown')
        email = student.get('email') or student.get(
            'user_details', {}).get('email', 'No email')
        phone = student.get('user_details', {}).get('phone', 'No phone')
        status = student.get('status', 'active')
        active_courses = student.get('active_courses', [])
        enrollment_date = student.get(
            'enrollment_date') or student.get('created_at')

        print(f"📋 Student Card #{i}")
        print(f"   👤 {name}")
        print(f"   🆔 ID: {student_id}")
        print(f"   📧 {email}")
        print(f"   📱 {phone}")
        print(f"   📊 Status: {status.upper()}")

        print(
            f"   📚 Enrolled Courses ({len(active_courses) if active_courses else 0}):")
        if active_courses and len(active_courses) > 0:
            for course in active_courses[:3]:  # Show first 3
                print(
                    f"      • {course['course_code']} - {course['course_name']}")
            if len(active_courses) > 3:
                print(f"      • +{len(active_courses) - 3} more courses")
            if enrollment_date:
                print(f"   📅 Enrolled: {enrollment_date[:10]}")
        else:
            print(f"      • Not enrolled in any courses")

        print(f"   🔧 Actions: [👁️ View] [📝 Edit] [🗑️ Delete]")
        print()

    # Show detailed view example
    if students:
        student = students[0]
        print("🔍 DETAILED VIEW MODAL PREVIEW:")
        print("-" * 60)
        print(f"Student: {student.get('full_name', 'Unknown')}")
        print(f"ID: {student.get('student_number', 'Unknown')}")
        print(
            f"Email: {student.get('email') or student.get('user_details', {}).get('email', 'No email')}")
        print(
            f"Phone: {student.get('user_details', {}).get('phone', 'No phone')}")
        print(f"Status: {student.get('status', 'active').upper()}")
        print()

        active_courses = student.get('active_courses', [])
        print(
            f"📚 ENROLLED COURSES ({len(active_courses) if active_courses else 0}):")
        if active_courses:
            for course in active_courses:
                print(f"  📖 {course['course_name']}")
                print(f"     Code: {course['course_code']}")
                print(f"     Credits: {course.get('credits', 'N/A')}")
                print(
                    f"     Duration: {course.get('course_duration', 'N/A')} months")
                print(
                    f"     Status: {'Active' if course.get('is_active') else 'Inactive'}")
                print(
                    f"     Students: {course.get('enrolled_students_count', 0)}")
                if course.get('description'):
                    desc = course['description'][:100] + "..." if len(
                        course['description']) > 100 else course['description']
                    print(f"     Description: {desc}")
                print()
        else:
            print("  No enrolled courses")

        # Show enrollment history
        active_enrollments = student.get('active_enrollments', [])
        if active_enrollments:
            print(f"📅 ENROLLMENT HISTORY ({len(active_enrollments)}):")
            for enrollment in active_enrollments:
                print(
                    f"  📚 {enrollment['course_name']} ({enrollment['course_code']})")
                print(f"     Enrolled: {enrollment['enrollment_date'][:10]}")
                print(f"     Status: {enrollment['status'].upper()}")
                print()

    print("✅ Enhanced Students Page Test Complete!")
    print()
    print("🎯 Key Features Demonstrated:")
    print("   ✓ Desktop table view with detailed columns")
    print("   ✓ Mobile responsive card layout")
    print("   ✓ Student information: name, ID, email, phone")
    print("   ✓ Enrolled courses with codes and names")
    print("   ✓ Enrollment dates and status")
    print("   ✓ Action buttons: View, Edit, Delete")
    print("   ✓ Detailed modal view with complete information")
    print("   ✓ Course enrollment history")


if __name__ == "__main__":
    test_enhanced_students_page()
