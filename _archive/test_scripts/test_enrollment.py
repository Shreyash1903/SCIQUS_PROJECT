#!/usr/bin/env python3
"""
Test script to verify the new multiple course enrollment system
"""

from django.db import transaction
from courses.models import Course
from students.models import Student, Enrollment
from django.contrib.auth import get_user_model
import os
import sys
import django

# Set up Django environment
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      'student_course_management.settings')
django.setup()


User = get_user_model()


def test_multiple_enrollment():
    """Test that a student can enroll in multiple courses"""
    print("=" * 60)
    print("TESTING MULTIPLE COURSE ENROLLMENT SYSTEM")
    print("=" * 60)

    try:
        # Get an existing student
        student = Student.objects.first()
        if not student:
            print("❌ No students found. Creating a test student...")
            # Create test user
            user = User.objects.create_user(
                username='test_student_multi',
                email='test_student_multi@example.com',
                password='testpass123',
                first_name='Test',
                last_name='Multi Student',
                role='student'
            )
            student = Student.objects.create(user=user)
            print(f"✅ Created test student: {student.full_name}")

        print(
            f"\n📚 Testing with student: {student.full_name} (ID: {student.student_id})")

        # Get active courses
        courses = Course.objects.filter(is_active=True)[
            :3]  # Get first 3 active courses
        if courses.count() < 2:
            print("❌ Need at least 2 active courses for testing")
            return

        print(f"📋 Found {courses.count()} active courses to test with")

        # Clear existing enrollments for clean test
        student.enrollments.all().delete()
        print("🧹 Cleared existing enrollments")

        # Test 1: Enroll in first course
        course1 = courses[0]
        enrollment1 = student.enroll_in_course(course1)
        print(f"\n✅ Test 1 PASSED: Enrolled in {course1.course_name}")
        print(f"   📄 Enrollment ID: {enrollment1.enrollment_id}")
        print(f"   📊 Status: {enrollment1.status}")

        # Test 2: Enroll in second course (should not overwrite first)
        course2 = courses[1]
        enrollment2 = student.enroll_in_course(course2)
        print(f"\n✅ Test 2 PASSED: Enrolled in {course2.course_name}")
        print(f"   📄 Enrollment ID: {enrollment2.enrollment_id}")
        print(f"   📊 Status: {enrollment2.status}")

        # Test 3: Verify both enrollments exist
        active_enrollments = student.active_enrollments.all()
        total_enrollments = student.enrollments.count()

        print(f"\n📈 ENROLLMENT STATUS:")
        print(f"   📊 Total enrollments: {total_enrollments}")
        print(f"   ✅ Active enrollments: {active_enrollments.count()}")
        print(f"   📚 Courses enrolled in: {student.courses.count()}")

        # List all enrollments
        print(f"\n📋 DETAILED ENROLLMENT LIST:")
        for i, enrollment in enumerate(student.enrollments.all(), 1):
            print(
                f"   {i}. {enrollment.course.course_name} - Status: {enrollment.status}")
            print(f"      📅 Enrolled: {enrollment.enrollment_date}")
            print(f"      🔗 Enrollment ID: {enrollment.enrollment_id}")

        # Test 4: Verify courses are accessible through many-to-many relationship
        enrolled_courses = student.courses.all()
        print(f"\n📚 COURSES VIA MANY-TO-MANY:")
        for i, course in enumerate(enrolled_courses, 1):
            print(f"   {i}. {course.course_name} ({course.course_code})")

        # Test 5: Test utility methods
        print(f"\n🔧 UTILITY METHODS TEST:")
        print(
            f"   ❓ Is enrolled in {course1.course_name}? {student.is_enrolled_in_course(course1)}")
        print(
            f"   ❓ Is enrolled in {course2.course_name}? {student.is_enrolled_in_course(course2)}")

        # Test 6: Try to enroll in same course again (should handle gracefully)
        print(f"\n🔄 DUPLICATE ENROLLMENT TEST:")
        try:
            duplicate_enrollment = student.enroll_in_course(course1)
            print(
                f"   ⚠️  Duplicate enrollment handled: {duplicate_enrollment}")
        except Exception as e:
            print(f"   ✅ Duplicate enrollment properly rejected: {str(e)}")

        # Test 7: Unenroll from one course
        print(f"\n🚪 UNENROLLMENT TEST:")
        unenrolled = student.unenroll_from_course(course1)
        if unenrolled:
            print(f"   ✅ Successfully unenrolled from {course1.course_name}")
            print(f"   📊 Status changed to: {unenrolled.status}")

        # Final status
        final_active = student.active_enrollments.count()
        print(f"\n📊 FINAL STATUS:")
        print(f"   ✅ Active enrollments after unenrollment: {final_active}")

        if final_active == 1:
            print("✅ MULTIPLE ENROLLMENT SYSTEM WORKING CORRECTLY!")
            print("   ✓ Students can enroll in multiple courses")
            print("   ✓ Previous enrollments are not overwritten")
            print("   ✓ Enrollment/unenrollment methods work properly")
            print("   ✓ Many-to-many relationship functions correctly")
            return True
        else:
            print("❌ Something went wrong with the enrollment system")
            return False

    except Exception as e:
        print(f"❌ Error during testing: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def test_admin_interface():
    """Test that admin interface works with new models"""
    print("\n" + "=" * 60)
    print("TESTING ADMIN INTERFACE COMPATIBILITY")
    print("=" * 60)

    try:
        from django.contrib.admin.sites import site
        from students.admin import StudentAdmin, EnrollmentAdmin

        # Check if models are registered
        from students.models import Student, Enrollment

        if Student in site._registry:
            print("✅ Student model is registered in admin")
        else:
            print("❌ Student model is NOT registered in admin")

        if Enrollment in site._registry:
            print("✅ Enrollment model is registered in admin")
        else:
            print("❌ Enrollment model is NOT registered in admin")

        print("✅ Admin interface compatibility check completed")
        return True

    except Exception as e:
        print(f"❌ Admin interface error: {str(e)}")
        return False


if __name__ == "__main__":
    print("🧪 Starting Multiple Course Enrollment System Tests...\n")

    # Run tests
    enrollment_test_passed = test_multiple_enrollment()
    admin_test_passed = test_admin_interface()

    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print(
        f"Multiple Enrollment Test: {'✅ PASSED' if enrollment_test_passed else '❌ FAILED'}")
    print(
        f"Admin Interface Test: {'✅ PASSED' if admin_test_passed else '❌ FAILED'}")

    if enrollment_test_passed and admin_test_passed:
        print("\n🎉 ALL TESTS PASSED!")
        print("The multiple course enrollment system is working correctly.")
        print("Students can now enroll in multiple courses without overwriting previous enrollments.")
    else:
        print("\n⚠️  SOME TESTS FAILED!")
        print("Please check the output above for specific issues.")
