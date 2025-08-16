from rest_framework import serializers
from .models import Course


class CourseSerializer(serializers.ModelSerializer):
    """Serializer for Course model"""
    enrolled_students_count = serializers.ReadOnlyField()

    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ('course_id', 'created_at',
                            'updated_at', 'enrolled_students_count')

    def validate_course_code(self, value):
        """Validate course code format and uniqueness"""
        if not value:
            raise serializers.ValidationError("Course code is required")

        # Convert to uppercase
        value = value.upper()

        # Check uniqueness (excluding current instance if updating)
        queryset = Course.objects.filter(course_code=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                "Course with this code already exists")

        return value

    def validate_course_duration(self, value):
        """Validate course duration"""
        if value <= 0:
            raise serializers.ValidationError(
                "Course duration must be greater than 0")
        if value > 72:  # 6 years max
            raise serializers.ValidationError(
                "Course duration cannot exceed 72 months")
        return value

    def validate_credits(self, value):
        """Validate credits"""
        if value <= 0:
            raise serializers.ValidationError("Credits must be greater than 0")
        if value > 10:
            raise serializers.ValidationError("Credits cannot exceed 10")
        return value


class CourseDetailSerializer(CourseSerializer):
    """Detailed serializer for Course with student information"""
    students = serializers.SerializerMethodField()

    class Meta(CourseSerializer.Meta):
        fields = [
            'course_id', 'course_name', 'course_code', 'course_duration',
            'description', 'credits', 'is_active',
            'created_at', 'updated_at', 'enrolled_students_count', 'students'
        ]

    def get_students(self, obj):
        """Get basic student information for this course"""
        from students.serializers import StudentBasicSerializer
        return StudentBasicSerializer(obj.students.all(), many=True).data
