from rest_framework import permissions, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction
from django.core.exceptions import ValidationError
from django.core.paginator import Paginator
from django.db.models import Q
from django.contrib.auth import get_user_model
from .models import Student, Enrollment
from .serializers import (
    StudentSerializer,
    StudentCreateSerializer,
    StudentUpdateSerializer,
    StudentBasicSerializer,
    EnrollStudentSerializer,
    UnenrollStudentSerializer,
    EnrollmentSerializer
)
from courses.permissions import IsAdminOrReadOnly, IsStudentOwnerOrAdmin

User = get_user_model()


class StudentListCreateAPIView(APIView):
    """
    List all students or create a new student using APIView
    """
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]

    def get(self, request):
        """Get list of students with filtering and pagination"""
        queryset = Student.objects.select_related('user').prefetch_related(
            'courses', 'enrollments__course').all()

        # Apply role-based filtering
        if hasattr(request.user, 'role') and request.user.role == 'student':
            if hasattr(request.user, 'student_profile'):
                queryset = queryset.filter(user=request.user)
            else:
                queryset = queryset.none()

        # Apply search filter
        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(student_number__icontains=search) |
                Q(user__username__icontains=search) |
                Q(user__first_name__icontains=search) |
                Q(user__last_name__icontains=search) |
                Q(user__email__icontains=search)
            )

        # Apply filters
        status_filter = request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        gender_filter = request.query_params.get('gender')
        if gender_filter:
            queryset = queryset.filter(gender=gender_filter)

        course_filter = request.query_params.get('course')
        if course_filter:
            queryset = queryset.filter(
                courses__course_id=course_filter).distinct()

        # Apply ordering
        ordering = request.query_params.get('ordering', 'student_number')
        queryset = queryset.order_by(ordering)

        # Pagination
        page_size = int(request.query_params.get('page_size', 20))
        page = int(request.query_params.get('page', 1))

        paginator = Paginator(queryset, page_size)
        page_obj = paginator.get_page(page)

        serializer = StudentSerializer(page_obj.object_list, many=True)

        return Response({
            'count': paginator.count,
            'next': page_obj.has_next(),
            'previous': page_obj.has_previous(),
            'page': page,
            'total_pages': paginator.num_pages,
            'results': serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request):
        """Create a new student"""
        serializer = StudentCreateSerializer(data=request.data)
        if serializer.is_valid():
            student = serializer.save()
            return Response({
                'message': 'Student created successfully',
                'student': StudentSerializer(student).data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StudentDetailAPIView(APIView):
    """
    Retrieve, update or delete a student using APIView
    """
    permission_classes = [permissions.IsAuthenticated, IsStudentOwnerOrAdmin]

    def get_object(self, pk):
        try:
            return Student.objects.select_related('user').prefetch_related('courses', 'enrollments__course').get(pk=pk)
        except Student.DoesNotExist:
            return None

    def get(self, request, pk):
        """Retrieve student details"""
        student = self.get_object(pk)
        if not student:
            return Response({
                'error': 'Student not found'
            }, status=status.HTTP_404_NOT_FOUND)

        # Check permissions
        if not self.has_object_permission(request, student):
            return Response({
                'error': 'Permission denied'
            }, status=status.HTTP_403_FORBIDDEN)

        serializer = StudentSerializer(student)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        """Update student"""
        student = self.get_object(pk)
        if not student:
            return Response({
                'error': 'Student not found'
            }, status=status.HTTP_404_NOT_FOUND)

        if not self.has_object_permission(request, student):
            return Response({
                'error': 'Permission denied'
            }, status=status.HTTP_403_FORBIDDEN)

        serializer = StudentUpdateSerializer(student, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Student updated successfully',
                'student': StudentSerializer(student).data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        """Partial update student"""
        student = self.get_object(pk)
        if not student:
            return Response({
                'error': 'Student not found'
            }, status=status.HTTP_404_NOT_FOUND)

        if not self.has_object_permission(request, student):
            return Response({
                'error': 'Permission denied'
            }, status=status.HTTP_403_FORBIDDEN)

        serializer = StudentUpdateSerializer(
            student, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Student updated successfully',
                'student': StudentSerializer(student).data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Delete student"""
        student = self.get_object(pk)
        if not student:
            return Response({
                'error': 'Student not found'
            }, status=status.HTTP_404_NOT_FOUND)

        if not self.has_object_permission(request, student):
            return Response({
                'error': 'Permission denied'
            }, status=status.HTTP_403_FORBIDDEN)

        with transaction.atomic():
            user = student.user
            student.delete()
            user.delete()

        return Response({
            'message': 'Student deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)

    def has_object_permission(self, request, obj):
        """Check object-level permissions"""
        if request.user.is_superuser or request.user.role == 'admin':
            return True
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return False


class StudentEnrollmentAPIView(APIView):
    """Handle student enrollment in courses"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        """Enroll student in a course"""
        try:
            student = Student.objects.get(pk=pk)
        except Student.DoesNotExist:
            return Response({
                'error': 'Student not found'
            }, status=status.HTTP_404_NOT_FOUND)

        # Check permissions
        if not self.has_object_permission(request, student):
            return Response({
                'error': 'Permission denied'
            }, status=status.HTTP_403_FORBIDDEN)

        serializer = EnrollStudentSerializer(
            data=request.data,
            context={'student': student}
        )

        if serializer.is_valid():
            try:
                enrollment = serializer.save()
                return Response({
                    'message': 'Student enrolled successfully',
                    'enrollment': EnrollmentSerializer(enrollment).data
                }, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response({
                    'error': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Unenroll student from a course"""
        try:
            student = Student.objects.get(pk=pk)
        except Student.DoesNotExist:
            return Response({
                'error': 'Student not found'
            }, status=status.HTTP_404_NOT_FOUND)

        # Check permissions
        if not self.has_object_permission(request, student):
            return Response({
                'error': 'Permission denied'
            }, status=status.HTTP_403_FORBIDDEN)

        serializer = UnenrollStudentSerializer(
            data=request.data,
            context={'student': student}
        )

        if serializer.is_valid():
            try:
                enrollment = serializer.save()
                return Response({
                    'message': 'Student unenrolled successfully',
                    'enrollment': EnrollmentSerializer(enrollment).data
                }, status=status.HTTP_200_OK)
            except ValidationError as e:
                return Response({
                    'error': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def has_object_permission(self, request, obj):
        """Check object-level permissions"""
        if request.user.is_superuser or request.user.role == 'admin':
            return True
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return False


class StudentEnrollmentsAPIView(APIView):
    """Get all enrollments for a student"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        """Get student's enrollment history"""
        try:
            student = Student.objects.get(pk=pk)
        except Student.DoesNotExist:
            return Response({
                'error': 'Student not found'
            }, status=status.HTTP_404_NOT_FOUND)

        # Check permissions
        if not self.has_object_permission(request, student):
            return Response({
                'error': 'Permission denied'
            }, status=status.HTTP_403_FORBIDDEN)

        # Filter enrollments
        status_filter = request.query_params.get('status')
        queryset = student.enrollments.all()

        if status_filter:
            queryset = queryset.filter(status=status_filter)

        serializer = EnrollmentSerializer(queryset, many=True)

        return Response({
            'student_id': student.student_id,
            'student_name': student.full_name,
            'total_enrollments': queryset.count(),
            'active_enrollments': student.active_enrollments.count(),
            'enrollments': serializer.data
        }, status=status.HTTP_200_OK)

    def has_object_permission(self, request, obj):
        """Check object-level permissions"""
        if request.user.is_superuser or request.user.role == 'admin':
            return True
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return False


class StudentChangeStatusAPIView(APIView):
    """Change student status using APIView"""
    permission_classes = [permissions.IsAuthenticated, IsStudentOwnerOrAdmin]

    def post(self, request, pk):
        try:
            student = Student.objects.get(pk=pk)
        except Student.DoesNotExist:
            return Response({
                'error': 'Student not found'
            }, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if new_status not in dict(Student.STATUS_CHOICES):
            return Response({
                'error': 'Invalid status'
            }, status=status.HTTP_400_BAD_REQUEST)

        student.status = new_status
        student.save()

        return Response({
            'message': f'Student status changed to {new_status}',
            'student': StudentSerializer(student).data
        }, status=status.HTTP_200_OK)


class StudentChangeCourseAPIView(APIView):
    """DEPRECATED: Change student's course using APIView (kept for backward compatibility)"""
    permission_classes = [permissions.IsAuthenticated, IsStudentOwnerOrAdmin]

    def post(self, request, pk):
        try:
            student = Student.objects.get(pk=pk)
        except Student.DoesNotExist:
            return Response({
                'error': 'Student not found'
            }, status=status.HTTP_404_NOT_FOUND)

        course_id = request.data.get('course_id')

        try:
            from courses.models import Course
            course = Course.objects.get(pk=course_id, is_active=True)

            # For backward compatibility, enroll in the new course
            if student.is_enrolled_in_course(course):
                return Response({
                    'message': 'Student is already enrolled in this course',
                    'student': StudentSerializer(student).data
                }, status=status.HTTP_200_OK)

            enrollment = student.enroll_in_course(course)

            return Response({
                'message': f'Student enrolled in {course.course_name}',
                'student': StudentSerializer(student).data,
                'enrollment': EnrollmentSerializer(enrollment).data
            }, status=status.HTTP_200_OK)

        except Course.DoesNotExist:
            return Response({
                'error': 'Course not found or inactive'
            }, status=status.HTTP_404_NOT_FOUND)


class StudentsByCourseAPIView(APIView):
    """Get all students by course using APIView"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        course_id = request.query_params.get('course_id')
        if not course_id:
            return Response({
                'error': 'course_id parameter is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Get students enrolled in the course
        enrollments = Enrollment.objects.filter(
            course_id=course_id,
            status__in=['enrolled', 'completed']
        ).select_related('student__user')

        students = [enrollment.student for enrollment in enrollments]

        # Apply role-based filtering
        if hasattr(request.user, 'role') and request.user.role == 'student':
            if hasattr(request.user, 'student_profile'):
                students = [s for s in students if s.user == request.user]
            else:
                students = []

        serializer = StudentBasicSerializer(students, many=True)
        return Response({
            'course_id': course_id,
            'students_count': len(students),
            'students': serializer.data
        }, status=status.HTTP_200_OK)


class ActiveStudentsAPIView(APIView):
    """Get all active students using APIView"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        queryset = Student.objects.filter(
            status='active').select_related('user').prefetch_related('courses', 'enrollments__course')

        # Apply role-based filtering
        if hasattr(request.user, 'role') and request.user.role == 'student':
            if hasattr(request.user, 'student_profile'):
                queryset = queryset.filter(user=request.user)
            else:
                queryset = queryset.none()

        serializer = StudentSerializer(queryset, many=True)
        return Response({
            'count': queryset.count(),
            'results': serializer.data
        }, status=status.HTTP_200_OK)


class MyProfileAPIView(APIView):
    """
    Student's own profile view using APIView
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Get current user's student profile"""
        try:
            student = request.user.student_profile
            serializer = StudentSerializer(student)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Student.DoesNotExist:
            # Auto-create student profile if it doesn't exist
            if request.user.role == 'student':
                try:
                    student = Student.objects.create(
                        user=request.user
                    )
                    serializer = StudentSerializer(student)
                    return Response({
                        'message': 'Student profile created automatically',
                        'data': serializer.data
                    }, status=status.HTTP_201_CREATED)
                except Exception as e:
                    return Response({
                        'error': f'Failed to create student profile: {str(e)}'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                return Response({
                    'error': 'Student profile not found for this user'
                }, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        """Update current user's student profile"""
        try:
            student = request.user.student_profile
            serializer = StudentUpdateSerializer(student, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'message': 'Profile updated successfully',
                    'student': StudentSerializer(student).data
                }, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Student.DoesNotExist:
            return Response({
                'error': 'Student profile not found for this user'
            }, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request):
        """Partial update current user's student profile"""
        try:
            student = request.user.student_profile
            serializer = StudentUpdateSerializer(
                student, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'message': 'Profile updated successfully',
                    'student': StudentSerializer(student).data
                }, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Student.DoesNotExist:
            return Response({
                'error': 'Student profile not found for this user'
            }, status=status.HTTP_404_NOT_FOUND)
