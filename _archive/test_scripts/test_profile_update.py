#!/usr/bin/env python
"""
Test script to verify profile update functionality
"""
import os
import sys
import django
import requests
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      'student_course_management.settings')
django.setup()


def test_profile_update():
    """Test the profile update API endpoint"""

    # First login to get token
    login_url = "http://127.0.0.1:8000/api/auth/login/"
    login_data = {
        "username": "shimpi_rohit",
        "password": "student123"
    }

    print("🔐 Testing login...")
    response = requests.post(login_url, json=login_data)
    if response.status_code == 200:
        token_data = response.json()
        access_token = token_data['access']
        print("✅ Login successful")
    else:
        print("❌ Login failed:", response.text)
        return

    # Test profile retrieval
    profile_url = "http://127.0.0.1:8000/api/auth/profile/"
    headers = {"Authorization": f"Bearer {access_token}"}

    print("\n📋 Getting current profile...")
    response = requests.get(profile_url, headers=headers)
    if response.status_code == 200:
        current_profile = response.json()
        print("✅ Current profile retrieved:")
        print(
            f"   Name: {current_profile.get('first_name')} {current_profile.get('last_name')}")
        print(f"   Email: {current_profile.get('email')}")
        print(f"   Phone: {current_profile.get('phone')}")
    else:
        print("❌ Failed to get profile:", response.text)
        return

    # Test profile update
    print("\n✏️  Testing profile update...")
    update_data = {
        "first_name": "Rohit Updated",
        "last_name": "Shimpi",
        "email": current_profile.get('email'),  # Keep existing email
        "phone": "+91 9876543210"
    }

    response = requests.put(profile_url, json=update_data, headers=headers)
    if response.status_code == 200:
        updated_profile = response.json()
        print("✅ Profile updated successfully:")
        print(f"   Updated user data: {updated_profile.get('user', {})}")
    else:
        print("❌ Profile update failed:")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text}")

    # Verify update
    print("\n🔍 Verifying update...")
    response = requests.get(profile_url, headers=headers)
    if response.status_code == 200:
        verified_profile = response.json()
        print("✅ Verification successful:")
        print(
            f"   Name: {verified_profile.get('first_name')} {verified_profile.get('last_name')}")
        print(f"   Email: {verified_profile.get('email')}")
        print(f"   Phone: {verified_profile.get('phone')}")

        # Check if update worked
        if verified_profile.get('first_name') == "Rohit Updated":
            print("🎉 Profile update test PASSED!")
        else:
            print("❌ Profile update test FAILED - name not updated")
    else:
        print("❌ Failed to verify update:", response.text)


if __name__ == "__main__":
    print("🧪 Testing Profile Update API\n")
    test_profile_update()
