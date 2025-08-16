from rest_framework import permissions, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction
from django.core.exceptions import ValidationError
from django.core.paginator import Paginator
from django.db.models import Q
from django.utils import timezone
from .models import Course
from .serializers import CourseSerializer, CourseDetailSerializer
from .permissions import IsAdminOrReadOnly, IsStudentOrAdmin


class CourseListCreateAPIView(APIView):
    """
    List all courses or create a new course using APIView
    """
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]

    def get(self, request):
        """Get list of courses with filtering and pagination"""
        queryset = Course.objects.all()

        # Apply role-based filtering
        if hasattr(request.user, 'role') and request.user.role == 'student':
            queryset = queryset.filter(is_active=True)

        # Apply search filter
        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(course_name__icontains=search) |
                Q(course_code__icontains=search) |
                Q(description__icontains=search)
            )

        # Apply filters
        is_active = request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')

        course_duration = request.query_params.get('course_duration')
        if course_duration:
            queryset = queryset.filter(course_duration=course_duration)

        credits = request.query_params.get('credits')
        if credits:
            queryset = queryset.filter(credits=credits)

        # Apply ordering
        ordering = request.query_params.get('ordering', 'course_name')
        queryset = queryset.order_by(ordering)

        # Pagination
        page_size = int(request.query_params.get('page_size', 20))
        page = int(request.query_params.get('page', 1))

        paginator = Paginator(queryset, page_size)
        page_obj = paginator.get_page(page)

        serializer = CourseSerializer(page_obj.object_list, many=True)

        return Response({
            'count': paginator.count,
            'next': page_obj.has_next(),
            'previous': page_obj.has_previous(),
            'page': page,
            'total_pages': paginator.num_pages,
            'results': serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request):
        """Create a new course"""
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            course = serializer.save()
            return Response({
                'message': 'Course created successfully',
                'course': CourseSerializer(course).data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CourseDetailAPIView(APIView):
    """
    Retrieve, update or delete a course using APIView
    """
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]

    def get_object(self, pk):
        try:
            return Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return None

    def get(self, request, pk):
        """Retrieve course details"""
        course = self.get_object(pk)
        if not course:
            return Response({
                'error': 'Course not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = CourseDetailSerializer(course)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        """Update course"""
        course = self.get_object(pk)
        if not course:
            return Response({
                'error': 'Course not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = CourseSerializer(course, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Course updated successfully',
                'course': serializer.data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        """Partial update course"""
        course = self.get_object(pk)
        if not course:
            return Response({
                'error': 'Course not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = CourseSerializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Course updated successfully',
                'course': serializer.data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Delete course"""
        course = self.get_object(pk)
        if not course:
            return Response({
                'error': 'Course not found'
            }, status=status.HTTP_404_NOT_FOUND)

        # Check if course has enrolled students
        if course.enrolled_students.exists():
            return Response({
                'error': 'Cannot delete course with enrolled students'
            }, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            course.delete()

        return Response({
            'message': 'Course deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)


class CourseStudentsAPIView(APIView):
    """Get all students enrolled in a course using APIView"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            course = Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return Response({
                'error': 'Course not found'
            }, status=status.HTTP_404_NOT_FOUND)

        from students.serializers import StudentBasicSerializer
        students = course.enrolled_students.all()
        serializer = StudentBasicSerializer(students, many=True)

        return Response({
            'course': CourseSerializer(course).data,
            'students_count': students.count(),
            'students': serializer.data
        }, status=status.HTTP_200_OK)


class CourseEnrollStudentAPIView(APIView):
    """Enroll a student to a course using APIView"""
    permission_classes = [permissions.IsAuthenticated, IsStudentOrAdmin]

    def post(self, request, pk):
        # Debug logging
        print(
            f"🔐 Enrollment request from user: {request.user.username if request.user.is_authenticated else 'Anonymous'}")
        print(f"🔐 User role: {getattr(request.user, 'role', 'No role')}")
        print(f"🔐 User authenticated: {request.user.is_authenticated}")
        print(f"🔐 Request data: {request.data}")

        try:
            course = Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return Response({
                'error': 'Course not found'
            }, status=status.HTTP_404_NOT_FOUND)

        student_id = request.data.get('student_id')

        # If student_id is not provided and user is a student, use their own profile
        if not student_id and request.user.role == 'student':
            try:
                # Get the student profile for the current user
                from students.models import Student
                student = Student.objects.get(user=request.user)
                student_id = student.student_id
                print(f"🎓 Auto-detected student ID: {student_id}")
            except Student.DoesNotExist:
                return Response({
                    'error': 'Student profile not found for current user'
                }, status=status.HTTP_404_NOT_FOUND)
        elif not student_id:
            return Response({
                'error': 'student_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            from students.models import Student
            student = Student.objects.get(student_id=student_id)
        except Student.DoesNotExist:
            return Response({
                'error': 'Student not found'
            }, status=status.HTTP_404_NOT_FOUND)

        # Students can only enroll themselves, admins can enroll anyone
        if request.user.role == 'student' and student.user != request.user:
            return Response({
                'error': 'Students can only enroll themselves'
            }, status=status.HTTP_403_FORBIDDEN)

        # Check if student is already enrolled in this course
        if student.is_enrolled_in_course(course):
            return Response({
                'error': 'Student is already enrolled in this course'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Enroll student in course using the enrollment method
        enrollment = student.enroll_in_course(course)

        print(
            f"✅ Successfully enrolled {student.student_number} in {course.course_code}")

        return Response({
            'message': f'Student {student.student_number} successfully enrolled in {course.course_code}',
            'student': {
                'student_id': str(student.student_id),
                'student_number': student.student_number,
                'name': student.full_name,
                'course': course.course_code,
                'enrollment_date': enrollment.enrollment_date.strftime('%Y-%m-%d'),
                'enrollment_status': enrollment.status
            }
        }, status=status.HTTP_200_OK)


class CourseUnenrollStudentAPIView(APIView):
    """Unenroll a student from a course using APIView"""
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]

    def post(self, request, pk):
        try:
            course = Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return Response({
                'error': 'Course not found'
            }, status=status.HTTP_404_NOT_FOUND)

        student_id = request.data.get('student_id')
        if not student_id:
            return Response({
                'error': 'student_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            from students.models import Student
            student = Student.objects.get(student_id=student_id)
        except Student.DoesNotExist:
            return Response({
                'error': 'Student not found'
            }, status=status.HTTP_404_NOT_FOUND)

        # Check if student is enrolled in this course
        if not student.is_enrolled_in_course(course):
            return Response({
                'error': 'Student is not enrolled in this course'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Unenroll student from course using the enrollment method
        enrollment = student.unenroll_from_course(course)

        return Response({
            'message': f'Student {student.student_number} successfully unenrolled from {course.course_code}',
            'student': {
                'student_id': str(student.student_id),
                'student_number': student.student_number,
                'name': student.full_name,
                'course': course.course_code,
                'enrollment_status': enrollment.status if enrollment else 'withdrawn',
                'note': 'Enrollment status changed to withdrawn'
            }
        }, status=status.HTTP_200_OK)


class CourseActivateAPIView(APIView):
    """Activate a course using APIView"""
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]

    def post(self, request, pk):
        try:
            course = Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return Response({
                'error': 'Course not found'
            }, status=status.HTTP_404_NOT_FOUND)

        course.is_active = True
        course.save()

        return Response({
            'message': 'Course activated successfully',
            'course': CourseSerializer(course).data
        }, status=status.HTTP_200_OK)


class CourseDeactivateAPIView(APIView):
    """Deactivate a course using APIView"""
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]

    def post(self, request, pk):
        try:
            course = Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return Response({
                'error': 'Course not found'
            }, status=status.HTTP_404_NOT_FOUND)

        course.is_active = False
        course.save()

        return Response({
            'message': 'Course deactivated successfully',
            'course': CourseSerializer(course).data
        }, status=status.HTTP_200_OK)


class ActiveCoursesAPIView(APIView):
    """Get all active courses using APIView"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        active_courses = Course.objects.filter(is_active=True)
        serializer = CourseSerializer(active_courses, many=True)

        return Response({
            'count': active_courses.count(),
            'results': serializer.data
        }, status=status.HTTP_200_OK)
