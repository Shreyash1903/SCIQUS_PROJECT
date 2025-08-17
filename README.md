# SCIQUS - Student Course Management System

A comprehensive Django-based REST API backend for managing students and courses with JWT authentication and role-based access control.

## 🚀 Features

### Core Functionality

- **Student Management**: Complete CRUD operations for student profiles
- **Course Management**: Course creation, editing, and management
- **Enrollment System**: Student-course enrollment management
- **Authentication**: JWT-based authentication with role-based access control
- **Admin Dashboard**: Comprehensive admin interface for system management

### Security Features

- 🔐 JWT token-based authentication
- � Role-based permissions (Admin/Student)
- 🛡️ Secure password handling with validation
- 🌐 CORS protection for cross-origin requests
- ✅ Comprehensive input validation and sanitization

## �️ Technology Stack

- **Backend**: Django 5.2.5, Django REST Framework 3.15.2
- **Database**: MySQL 8.0+ / SQLite (development)
- **Authentication**: Simple JWT 5.3.0
- **API Documentation**: Django REST Framework browsable API
- **Frontend**: React 18.2.0 with Tailwind CSS

## ⚡ Quick Start

### Prerequisites

- Python 3.8+
- MySQL 8.0+ (optional - SQLite works for development)
- Node.js 14+ (for frontend)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd SCIQUS_Project
   ```

2. **Setup Python environment**

   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   ```

3. **Configure environment**
   Create `.env` file:

   ```env
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1

   # Database Configuration (optional)
   DB_ENGINE=django.db.backends.mysql
   DB_NAME=student_course_db
   DB_USER=root
   DB_PASSWORD=your-password
   DB_HOST=localhost
   DB_PORT=3306
   ```

4. **Setup database**

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```

5. **Run the server**
   ```bash
   python manage.py runserver
   ```

Visit: http://127.0.0.1:8000/

## 📋 API Endpoints

### Base URLs

- **API Root**: `http://127.0.0.1:8000/api/v1/`
- **Admin Panel**: `http://127.0.0.1:8000/admin/`
- **Frontend**: `http://localhost:3000/`

### Authentication Endpoints

| Method | Endpoint               | Description       |
| ------ | ---------------------- | ----------------- |
| POST   | `/auth/login/`         | User login        |
| POST   | `/auth/register/`      | User registration |
| POST   | `/auth/token/refresh/` | Refresh JWT token |
| POST   | `/auth/logout/`        | User logout       |

### Student Endpoints

| Method | Endpoint                 | Description         |
| ------ | ------------------------ | ------------------- |
| GET    | `/students/`             | List all students   |
| POST   | `/students/`             | Create new student  |
| GET    | `/students/{id}/`        | Get student details |
| PUT    | `/students/{id}/`        | Update student      |
| DELETE | `/students/{id}/`        | Delete student      |
| POST   | `/students/{id}/enroll/` | Enroll in course    |

### Course Endpoints

| Method | Endpoint                  | Description                |
| ------ | ------------------------- | -------------------------- |
| GET    | `/courses/`               | List all courses           |
| POST   | `/courses/`               | Create course (Admin only) |
| GET    | `/courses/{id}/`          | Get course details         |
| PUT    | `/courses/{id}/`          | Update course (Admin only) |
| DELETE | `/courses/{id}/`          | Delete course (Admin only) |
| GET    | `/courses/{id}/students/` | Get enrolled students      |

## 📁 Project Structure

```
SCIQUS_Project/
├── student_course_management/    # Main Django project
│   ├── settings.py              # Django configuration
│   ├── urls.py                  # URL routing
│   └── wsgi.py                  # WSGI application
├── authentication/               # Custom user authentication
│   ├── models.py                # User model
│   ├── serializers.py           # API serializers
│   ├── views.py                 # Authentication views
│   └── urls.py                  # Auth URL patterns
├── students/                    # Student management
│   ├── models.py                # Student model
│   ├── views.py                 # Student API views
│   └── serializers.py           # Student serializers
├── courses/                     # Course management
│   ├── models.py                # Course model
│   ├── views.py                 # Course API views
│   └── serializers.py           # Course serializers
├── frontend/                    # React frontend application
│   ├── src/                     # Source files
│   ├── public/                  # Static assets
│   └── package.json            # Node.js dependencies
├── requirements.txt            # Python dependencies
└── manage.py                   # Django management script
```

## 🔒 Authentication & Security

### JWT Configuration

- **Access Token**: 60 minutes lifetime
- **Refresh Token**: 7 days lifetime
- **Auto Rotation**: Enabled for enhanced security
- **Blacklist**: Old tokens after rotation

### Role-Based Access Control

- **Admin**: Full system access and management
- **Student**: Limited access to own data and course browsing

### Security Features

- Password strength validation
- CORS protection for API endpoints
- Input sanitization and validation
- Secure token storage and handling

## 🧪 Testing

### Run Backend Tests

```bash
python manage.py test
```

### Run Frontend Tests

```bash
cd frontend
npm test
```

### API Testing

Use the provided test scripts:

```bash
python test_api.py
python test_search_api.py
```

## 🔧 Development

### Default Credentials

- **Admin**: username=`admin`, password=`admin123`
- **Student**: username=`john_doe`, password=`student123`

### Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### Code Style Guidelines

- **Python**: Follow PEP 8 standards
- **JavaScript**: ESLint configuration provided
- **Git**: Use conventional commit messages

## 🚀 Deployment

### Production Requirements

- Python 3.8+ with virtual environment
- MySQL 8.0+ or PostgreSQL 12+
- Nginx/Apache web server
- SSL certificate for HTTPS

### Environment Variables

Set these in production:

```env
DEBUG=False
SECRET_KEY=your-production-secret-key
ALLOWED_HOSTS=yourdomain.com
DATABASE_URL=your-production-database-url
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- 📖 **Documentation**: Check this README and code comments
- 🐛 **Issues**: GitHub Issues
- 💬 **Discussions**: GitHub Discussions

---

**SCIQUS** - Student Course Intelligence & Quality University System

⭐ If you found this project helpful, please give it a star!

![Python](https://img.shields.io/badge/python-v3.8+-blue.svg)
![Django](https://img.shields.io/badge/django-v5.2.5-green.svg)
![React](https://img.shields.io/badge/react-v18.2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
