from django.urls import path
from . import views

app_name = 'students'

urlpatterns = [
    # Student CRUD endpoints
    path('', views.StudentListCreateAPIView.as_view(), name='student_list_create'),
    path('<uuid:pk>/', views.StudentDetailAPIView.as_view(), name='student_detail'),

    # Student enrollment endpoints
    path('<uuid:pk>/enroll/', views.StudentEnrollmentAPIView.as_view(),
         name='student_enroll'),
    path('<uuid:pk>/enrollments/',
         views.StudentEnrollmentsAPIView.as_view(), name='student_enrollments'),

    # Student action endpoints
    path('<uuid:pk>/change-status/',
         views.StudentChangeStatusAPIView.as_view(), name='student_change_status'),
    path('<uuid:pk>/change-course/',
         # Deprecated but kept for compatibility
         views.StudentChangeCourseAPIView.as_view(), name='student_change_course'),
    path('by-course/', views.StudentsByCourseAPIView.as_view(),
         name='students_by_course'),
    path('active/', views.ActiveStudentsAPIView.as_view(), name='active_students'),
    path('my-profile/', views.MyProfileAPIView.as_view(), name='my_profile'),

    # Additional student endpoints (for compatibility)
    path('list/', views.StudentListCreateAPIView.as_view(),
         name='student_list_create_alt'),
    path('<uuid:pk>/detail/', views.StudentDetailAPIView.as_view(),
         name='student_detail_alt'),
]
