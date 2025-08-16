from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = 'authentication'

urlpatterns = [
    # Authentication endpoints
    path('register/', views.UserRegistrationAPIView.as_view(), name='register'),
    path('login/', views.UserLoginAPIView.as_view(), name='login'),
    path('logout/', views.LogoutAPIView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User profile endpoints
    path('profile/', views.UserProfileAPIView.as_view(), name='profile'),
    path('change-password/', views.ChangePasswordAPIView.as_view(),
         name='change_password'),

    # User management (admin)
    path('users/', views.UserListAPIView.as_view(), name='user_list'),
]
