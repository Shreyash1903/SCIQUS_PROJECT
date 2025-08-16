"""
URL configuration for student_course_management project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

# Try to import documentation support
try:
    from rest_framework.documentation import include_docs_urls
    DOCS_AVAILABLE = True
except ImportError:
    DOCS_AVAILABLE = False


def api_root(request):
    """
    API Root endpoint
    """
    return JsonResponse({
        'message': 'Welcome to Student Course Management System API',
        'version': '1.0',
        'endpoints': {
            'authentication': '/api/auth/',
            'courses': '/api/courses/',
            'students': '/api/students/',
            'admin': '/admin/',
            'api_browser': '/api-auth/',
        }
    })


urlpatterns = [
    path('', api_root, name='api_root'),
    path('admin/', admin.site.urls),

    # API URLs
    path('api/auth/', include('authentication.urls')),
    path('api/courses/', include('courses.urls')),
    path('api/students/', include('students.urls')),

    # DRF browsable API
    path('api-auth/', include('rest_framework.urls')),
]

# Add documentation URL if available
if DOCS_AVAILABLE:
    try:
        urlpatterns.append(
            path('api/docs/', include_docs_urls(title='Student Course Management API'))
        )
    except Exception:
        # If there's any issue with documentation, skip it
        pass

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)

# Admin site customization
admin.site.site_header = "Student Course Management System"
admin.site.site_title = "SCMS Admin"
admin.site.index_title = "Welcome to SCMS Administration"
