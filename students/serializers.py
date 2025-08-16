from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Student, Enrollment
from courses.models import Course
from courses.serializers import CourseSerializer
from authentication.serializers import UserProfileSerializer

User = get_user_model()


class EnrollmentSerializer(serializers.ModelSerializer):
    """Serializer for Enrollment model"""
    course_details = CourseSerializer(source='course', read_only=True)
    course_name = serializers.CharField(
        source='course.course_name', read_only=True)
    course_code = serializers.CharField(
        source='course.course_code', read_only=True)

    class Meta:
        model = Enrollment
        fields = '__all__'
        read_only_fields = ('enrollment_id', 'created_at', 'updated_at')


class StudentBasicSerializer(serializers.ModelSerializer):
    """Basic serializer for Student model (for references)"""
    full_name = serializers.ReadOnlyField()
    email = serializers.ReadOnlyField()
    active_courses_count = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ('student_id', 'student_number', 'full_name',
                  'email', 'status', 'enrollment_date', 'active_courses_count')

    def get_active_courses_count(self, obj):
        return obj.active_enrollments.count()


class StudentSerializer(serializers.ModelSerializer):
    """Full serializer for Student model"""
    full_name = serializers.ReadOnlyField()
    email = serializers.ReadOnlyField()
    active_enrollments = EnrollmentSerializer(many=True, read_only=True)
    active_courses = CourseSerializer(many=True, read_only=True)
    user_details = UserProfileSerializer(source='user', read_only=True)
    total_credits_enrolled = serializers.SerializerMethodField()
    total_credits_earned = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = '__all__'
        read_only_fields = ('student_id', 'created_at', 'updated_at',
                            'full_name', 'email', 'active_enrollments',
                            'active_courses', 'user_details')

    def get_total_credits_enrolled(self, obj):
        """Get total credits from active enrollments"""
        return sum([enrollment.course.credits for enrollment in obj.active_enrollments.all()])

    def get_total_credits_earned(self, obj):
        """Get total credits earned from completed courses"""
        return sum([enrollment.credits_earned or 0 for enrollment in obj.enrollments.filter(status='completed')])

    def validate_user(self, value):
        """Validate user selection"""
        if value.role != 'student':
            raise serializers.ValidationError(
                "Selected user must have 'student' role")

        # Check if user is already associated with another student profile
        if Student.objects.filter(user=value).exclude(pk=self.instance.pk if self.instance else None).exists():
            raise serializers.ValidationError(
                "This user is already associated with another student profile")

        return value

    def validate_student_number(self, value):
        """Validate student number uniqueness"""
        if not value:
            return value  # Will be auto-generated

        queryset = Student.objects.filter(student_number=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                "Student with this number already exists")

        return value


class StudentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a student with user data"""
    # User fields
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    phone_number = serializers.CharField(
        write_only=True, required=False, allow_blank=True)
    date_of_birth = serializers.DateField(
        write_only=True, required=False, allow_null=True)
    address = serializers.CharField(
        write_only=True, required=False, allow_blank=True)

    # Optional initial course enrollment
    course = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.none(),
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = Student
        fields = (
            'username', 'email', 'first_name', 'last_name', 'password',
            'phone_number', 'date_of_birth', 'address',
            'course', 'enrollment_date'
        )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        from courses.models import Course
        self.fields['course'].queryset = Course.objects.filter(is_active=True)

    def validate_username(self, value):
        """Validate username uniqueness"""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "A user with this username already exists")
        return value

    def validate_email(self, value):
        """Validate email uniqueness"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "A user with this email already exists")
        return value

    def create(self, validated_data):
        """Create user and student in a transaction"""
        from django.db import transaction

        # Extract user data
        user_data = {
            'username': validated_data.pop('username'),
            'email': validated_data.pop('email'),
            'first_name': validated_data.pop('first_name'),
            'last_name': validated_data.pop('last_name'),
            'password': validated_data.pop('password'),
            'phone': validated_data.pop('phone_number', ''),
            'date_of_birth': validated_data.pop('date_of_birth', None),
            'address': validated_data.pop('address', ''),
            'role': 'student',
        }

        # Extract course for optional enrollment
        course = validated_data.pop('course', None)

        with transaction.atomic():
            # Create user
            user = User.objects.create_user(**user_data)

            # Create student
            validated_data['user'] = user
            student = Student.objects.create(**validated_data)

            # Enroll in course if provided
            if course:
                student.enroll_in_course(course)

            return student


class StudentUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating student information"""
    full_name = serializers.ReadOnlyField()
    email = serializers.ReadOnlyField()

    class Meta:
        model = Student
        fields = (
            'enrollment_date', 'status', 'full_name', 'email'
        )
        read_only_fields = ('full_name', 'email')


class EnrollStudentSerializer(serializers.Serializer):
    """Serializer for enrolling a student in a course"""
    course_id = serializers.UUIDField()

    def validate_course_id(self, value):
        """Validate course exists and is active"""
        try:
            course = Course.objects.get(course_id=value, is_active=True)
            return course
        except Course.DoesNotExist:
            raise serializers.ValidationError(
                "Course not found or is not active")

    def create(self, validated_data):
        """Enroll student in course"""
        student = self.context['student']
        course = validated_data['course_id']

        # Check if already enrolled
        if student.is_enrolled_in_course(course):
            raise serializers.ValidationError(
                "Student is already enrolled in this course")

        enrollment = student.enroll_in_course(course)
        return enrollment


class UnenrollStudentSerializer(serializers.Serializer):
    """Serializer for unenrolling a student from a course"""
    course_id = serializers.UUIDField()

    def validate_course_id(self, value):
        """Validate course exists"""
        try:
            course = Course.objects.get(course_id=value)
            return course
        except Course.DoesNotExist:
            raise serializers.ValidationError("Course not found")

    def create(self, validated_data):
        """Unenroll student from course"""
        student = self.context['student']
        course = validated_data['course_id']

        # Check if enrolled
        if not student.is_enrolled_in_course(course):
            raise serializers.ValidationError(
                "Student is not enrolled in this course")

        enrollment = student.unenroll_from_course(course)
        return enrollment
