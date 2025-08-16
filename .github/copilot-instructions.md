# Student and Course Management Backend System

This project implements a comprehensive backend system for managing students and courses using Django and Django REST Framework.

## Project Overview

- **Framework**: Django with Django REST Framework
- **Database**: SQLite (default) / MySQL (configurable)
- **Authentication**: JWT-based with role-based access control
- **Features**: Full CRUD operations, course management, student enrollment

## Development Guidelines

- Follow Django best practices
- Use class-based views for consistency
- Implement proper error handling and validation
- Ensure secure endpoints with authentication
- Write clean, documented code

## API Endpoints

- Student management (CRUD)
- Course management (CRUD)
- Student-Course enrollment
- Authentication and authorization

## Completed Steps

✅ Project structure created
✅ Django project and apps created
✅ Models implemented with proper relationships
✅ Custom User model with role-based access
✅ REST API serializers created
✅ ViewSets and API views implemented
✅ Authentication and authorization configured
✅ Database migrations completed
✅ Sample data created
✅ Server running successfully

## Quick Start

1. The server is running at: http://127.0.0.1:8000/
2. Admin panel: http://127.0.0.1:8000/admin/
3. API root: http://127.0.0.1:8000/api/v1/
4. Login credentials:
   - Admin: username=admin, password=admin123
   - Students: username=john_doe, password=student123

## Next Steps

- Test all API endpoints
- Run the API test script: `python test_api.py`
- Explore the browsable API interface
- Build a frontend application (React/Vue/Angular)
