from authentication.models import User
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      'student_course_management.settings')
django.setup()


# Find your user
user = User.objects.filter(username='waghmare_shreyash').first()
if user:
    # Set a known password
    new_password = 'Shreyash@22210311'
    user.set_password(new_password)
    user.save()
    print(f'✅ Password reset successfully for {user.username}')
    print(f'✅ New password is: {new_password}')
else:
    print('❌ User not found')
