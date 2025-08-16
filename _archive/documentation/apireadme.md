# API Endpoints Documentation

## Base URL

All endpoints are prefixed with: `http://127.0.0.1:8000/`

## Authentication Endpoints

**Base Path:** `/api/auth/`

| Method | Endpoint                     | Description                   | Authentication Required | Permission Level |
| ------ | ---------------------------- | ----------------------------- | ----------------------- | ---------------- |
| POST   | `/api/auth/register/`        | User registration             | No                      | Public           |
| POST   | `/api/auth/login/`           | User login                    | No                      | Public           |
| POST   | `/api/auth/logout/`          | User logout                   | Yes                     | All Users        |
| POST   | `/api/auth/token/refresh/`   | Refresh JWT token             | No                      | Public           |
| GET    | `/api/auth/profile/`         | Get user profile              | Yes                     | All Users        |
| PUT    | `/api/auth/profile/`         | Update user profile           | Yes                     | All Users        |
| PATCH  | `/api/auth/profile/`         | Partially update user profile | Yes                     | All Users        |
| POST   | `/api/auth/change-password/` | Change user password          | Yes                     | All Users        |
| GET    | `/api/auth/users/`           | List all users (admin only)   | Yes                     | Admin Only       |

## Course Endpoints

**Base Path:** `/api/courses/`

| Method | Endpoint                          | Description                        | Authentication Required | Permission Level |
| ------ | --------------------------------- | ---------------------------------- | ----------------------- | ---------------- |
| GET    | `/api/courses/`                   | List all courses                   | Yes                     | All Users        |
| POST   | `/api/courses/`                   | Create new course                  | Yes                     | Admin Only       |
| GET    | `/api/courses/{uuid}/`            | Get course details                 | Yes                     | All Users        |
| PUT    | `/api/courses/{uuid}/`            | Update course                      | Yes                     | Admin Only       |
| PATCH  | `/api/courses/{uuid}/`            | Partially update course            | Yes                     | Admin Only       |
| DELETE | `/api/courses/{uuid}/`            | Delete course                      | Yes                     | Admin Only       |
| GET    | `/api/courses/{uuid}/students/`   | Get students enrolled in course    | Yes                     | All Users        |
| POST   | `/api/courses/{uuid}/enroll/`     | Enroll student to course           | Yes                     | Admin Only       |
| POST   | `/api/courses/{uuid}/unenroll/`   | Unenroll student from course       | Yes                     | Admin Only       |
| POST   | `/api/courses/{uuid}/activate/`   | Activate course                    | Yes                     | Admin Only       |
| POST   | `/api/courses/{uuid}/deactivate/` | Deactivate course                  | Yes                     | Admin Only       |
| GET    | `/api/courses/active/`            | List all active courses            | Yes                     | All Users        |
| GET    | `/api/courses/list/`              | Alternative course list endpoint   | Yes                     | All Users        |
| GET    | `/api/courses/{uuid}/detail/`     | Alternative course detail endpoint | Yes                     | All Users        |

## Student Endpoints

**Base Path:** `/api/students/`

| Method | Endpoint                               | Description                         | Authentication Required | Permission Level            |
| ------ | -------------------------------------- | ----------------------------------- | ----------------------- | --------------------------- |
| GET    | `/api/students/`                       | List all students                   | Yes                     | Admin (All) / Student (Own) |
| POST   | `/api/students/`                       | Create new student                  | Yes                     | Admin Only                  |
| GET    | `/api/students/{uuid}/`                | Get student details                 | Yes                     | Admin / Own Profile         |
| PUT    | `/api/students/{uuid}/`                | Update student                      | Yes                     | Admin / Own Profile         |
| PATCH  | `/api/students/{uuid}/`                | Partially update student            | Yes                     | Admin / Own Profile         |
| DELETE | `/api/students/{uuid}/`                | Delete student                      | Yes                     | Admin / Own Profile         |
| GET    | `/api/students/{uuid}/course-details/` | Get student's course details        | Yes                     | Admin / Own Profile         |
| POST   | `/api/students/{uuid}/change-status/`  | Change student status               | Yes                     | Admin / Own Profile         |
| POST   | `/api/students/{uuid}/change-course/`  | Change student's course             | Yes                     | Admin / Own Profile         |
| GET    | `/api/students/by-course/`             | Get students filtered by course     | Yes                     | All Users                   |
| GET    | `/api/students/active/`                | List all active students            | Yes                     | All Users                   |
| GET    | `/api/students/my-profile/`            | Get current student's profile       | Yes                     | All Users                   |
| GET    | `/api/students/list/`                  | Alternative student list endpoint   | Yes                     | Admin (All) / Student (Own) |
| GET    | `/api/students/{uuid}/detail/`         | Alternative student detail endpoint | Yes                     | Admin / Own Profile         |

## Admin Endpoints

**Base Path:** `/admin/`

| Method | Endpoint  | Description        | Authentication Required |
| ------ | --------- | ------------------ | ----------------------- |
| GET    | `/admin/` | Django admin panel | Yes (Admin)             |

## API Documentation Endpoints

| Method | Endpoint     | Description                      | Authentication Required |
| ------ | ------------ | -------------------------------- | ----------------------- |
| GET    | `/api/docs/` | API documentation (if available) | No                      |
| GET    | `/api-auth/` | DRF browsable API authentication | No                      |

## Permission Levels

### Admin Users

- **Full Access**: Can perform all operations (CRUD) on courses and students
- **User Management**: Can view all users in the system
- **Course Management**: Can create, update, delete, activate/deactivate courses
- **Student Management**: Can create, view, update, delete any student profile

### Student Users

- **Course Access**: Can view all active courses and course details (read-only)
- **Limited Student Access**: Can only view and modify their own student profile
- **Student Lists**: Can only see their own profile in student lists
- **Profile Management**: Can view and update their own user profile

### General Users (Authenticated)

- **Profile Management**: Can view and update their own user profile
- **Password Management**: Can change their own password
- **Course Viewing**: Can view active courses (read-only)

## Authentication Notes

- Most endpoints require JWT authentication
- Include the JWT token in the Authorization header: `Authorization: Bearer <token>`
- Use the `/api/auth/login/` endpoint to get tokens
- Use the `/api/auth/token/refresh/` endpoint to refresh expired tokens
- Admin endpoints require superuser or admin role privileges
- Student endpoints use `IsStudentOwnerOrAdmin` permission (students can only access their own data)

## Response Format

All API responses follow a consistent JSON format:

### Success Response

```json
{
    "message": "Success message",
    "data": {...},
    "count": 10 // for list endpoints
}
```

### Error Response

```json
{
    "error": "Error message",
    "details": {...}
}
```

## Status Codes

- `200 OK` - Successful GET, PUT, PATCH requests
- `201 Created` - Successful POST requests
- `204 No Content` - Successful DELETE requests
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error
