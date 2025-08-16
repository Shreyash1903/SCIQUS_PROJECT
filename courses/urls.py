from django.urls import path
from . import views

app_name = 'courses'

urlpatterns = [
    # Course CRUD endpoints
    path('', views.CourseListCreateAPIView.as_view(), name='course_list_create'),
    path('<uuid:pk>/', views.CourseDetailAPIView.as_view(), name='course_detail'),

    # Course action endpoints
    path('<uuid:pk>/students/', views.CourseStudentsAPIView.as_view(),
         name='course_students'),
    path('<uuid:pk>/enroll/', views.CourseEnrollStudentAPIView.as_view(),
         name='course_enroll_student'),
    path('<uuid:pk>/unenroll/', views.CourseUnenrollStudentAPIView.as_view(),
         name='course_unenroll_student'),
    path('<uuid:pk>/activate/', views.CourseActivateAPIView.as_view(),
         name='course_activate'),
    path('<uuid:pk>/deactivate/', views.CourseDeactivateAPIView.as_view(),
         name='course_deactivate'),
    path('active/', views.ActiveCoursesAPIView.as_view(), name='active_courses'),

    # Additional course endpoints
    path('list/', views.CourseListCreateAPIView.as_view(),
         name='course_list_create_alt'),
    path('<uuid:pk>/detail/', views.CourseDetailAPIView.as_view(),
         name='course_detail_alt'),
]
