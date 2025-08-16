# Student Course Management System

A comprehensive web application for managing students, courses, and enrollments built with Django REST Framework (backend) and React (frontend).

## 🎯 Features

- **User Management**: Registration, authentication, and role-based access control
- **Student Management**: Complete CRUD operations for student profiles
- **Course Management**: Course creation, editing, and activation/deactivation
- **Enrollment System**: Student-course enrollment with status tracking
- **Dashboard**: Interactive dashboards for students and administrators
- **Profile Management**: User profile updates and password changes
- **Responsive Design**: Mobile-friendly interface with modern UI/UX

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+**
- **Node.js 14+**
- **npm or yarn**
- **Git**

### Backend Setup (Django)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd student-course-management-system
   ```

2. **Create and activate virtual environment**

   ```bash
   # Windows
   python -m venv .venv
   .venv\Scripts\activate

   # macOS/Linux
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. **Install Python dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure database**

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser (optional)**

   ```bash
   python manage.py createsuperuser
   ```

6. **Load sample data** (creates demo users and courses)

   ```bash
   python manage.py shell -c "
   from authentication.models import User
   from students.models import Student
   from courses.models import Course

   # Create admin user
   admin_user = User.objects.create_user(
       username='admin',
       email='admin@example.com',
       password='admin123',
       role='admin',
       first_name='System',
       last_name='Administrator',
       phone='+1-555-0123'
   )

   # Create sample student
   student_user = User.objects.create_user(
       username='john_doe',
       email='john.doe@example.com',
       password='student123',
       role='student',
       first_name='John',
       last_name='Doe',
       phone='+1-555-0456'
   )

   student = Student.objects.create(
       user=student_user,
       student_number='STU202400001'
   )

   # Create sample courses
   Course.objects.create(
       course_code='CS101',
       course_name='Introduction to Computer Science',
       description='Fundamentals of computer science and programming.',
       credits=3,
       course_duration=4
   )

   Course.objects.create(
       course_code='MATH201',
       course_name='Calculus I',
       description='Introduction to differential and integral calculus.',
       credits=4,
       course_duration=4
   )

   print('✅ Sample data created successfully!')
   "
   ```

7. **Run the development server**

   ```bash
   python manage.py runserver
   ```

   The backend API will be available at `http://127.0.0.1:8000/`

### Frontend Setup (React)

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm start
   # or
   yarn start
   ```

   The frontend will be available at `http://localhost:3000/` (or another port if 3000 is busy)

## 📚 Database Schema

### Core Models

#### User Model (authentication/models.py)

```python
User (extends AbstractUser):
  - id: AutoField (Primary Key)
  - username: CharField(150) [Unique]
  - email: EmailField [Unique]
  - first_name: CharField(150)
  - last_name: CharField(150)
  - role: CharField(10) [Choices: 'admin', 'student']
  - phone: CharField(15) [Optional]
  - date_of_birth: DateField [Optional]
  - address: TextField [Optional]
  - profile_picture: ImageField [Optional]
  - created_at: DateTimeField [Auto]
  - updated_at: DateTimeField [Auto]
```

#### Student Model (students/models.py)

```python
Student:
  - student_id: UUIDField (Primary Key)
  - user: OneToOneField(User) [CASCADE]
  - student_number: CharField(20) [Unique, Auto-generated]
  - courses: ManyToManyField(Course) [Through Enrollment]
  - enrollment_date: DateField [Default: today]
  - status: CharField(20) [Choices: 'active', 'inactive', 'graduated', 'dropped']
  - created_at: DateTimeField [Auto]
  - updated_at: DateTimeField [Auto]
```

#### Course Model (courses/models.py)

```python
Course:
  - course_id: UUIDField (Primary Key)
  - course_code: CharField(20) [Unique]
  - course_name: CharField(200)
  - description: TextField [Optional]
  - credits: PositiveIntegerField [Default: 3]
  - course_duration: PositiveIntegerField [Default: 4, in months]
  - is_active: BooleanField [Default: True]
  - created_at: DateTimeField [Auto]
  - updated_at: DateTimeField [Auto]
```

#### Enrollment Model (students/models.py)

```python
Enrollment:
  - enrollment_id: UUIDField (Primary Key)
  - student: ForeignKey(Student) [CASCADE]
  - course: ForeignKey(Course) [CASCADE]
  - enrollment_date: DateTimeField [Default: now]
  - status: CharField(20) [Choices: 'enrolled', 'completed', 'withdrawn', 'failed', 'suspended']
  - grade: CharField(3) [Optional, Choices: A+, A, A-, B+, B, B-, C+, C, C-, D+, D, F, I, W]
  - completion_date: DateTimeField [Optional]
  - credits_earned: PositiveIntegerField [Optional]
  - created_at: DateTimeField [Auto]
  - updated_at: DateTimeField [Auto]
  - unique_together: [student, course]
```

### Database Relationships

```
User (1) ←→ (1) Student
Student (M) ←→ (M) Course [Through: Enrollment]
Student (1) ←→ (M) Enrollment
Course (1) ←→ (M) Enrollment
```

## 🔌 API Endpoints

### Authentication Endpoints

```
POST   /api/auth/register/           # User registration
POST   /api/auth/login/              # User login
POST   /api/auth/logout/             # User logout
GET    /api/auth/profile/            # Get user profile
PUT    /api/auth/profile/            # Update user profile
POST   /api/auth/change-password/    # Change password
POST   /api/auth/token/refresh/      # Refresh JWT token
GET    /api/auth/users/              # List users (admin only)
```

### Student Endpoints

```
GET    /api/students/                # List students
POST   /api/students/                # Create student
GET    /api/students/{id}/           # Get student details
PUT    /api/students/{id}/           # Update student
DELETE /api/students/{id}/           # Delete student
GET    /api/students/profile/        # Get current student profile
POST   /api/students/{id}/enroll/    # Enroll in course
POST   /api/students/{id}/unenroll/  # Unenroll from course
```

### Course Endpoints

```
GET    /api/courses/                 # List courses
POST   /api/courses/                 # Create course
GET    /api/courses/{id}/            # Get course details
PUT    /api/courses/{id}/            # Update course
DELETE /api/courses/{id}/            # Delete course
GET    /api/courses/{id}/students/   # Get enrolled students
```

## 🛠 Custom Management Commands

### Database Operations

```bash
# Create sample data
python manage.py shell -c "exec(open('scripts/create_sample_data.py').read())"

# Reset student passwords
python manage.py shell -c "
from authentication.models import User
user = User.objects.get(username='username')
user.set_password('new_password')
user.save()
"

# Generate student numbers
python manage.py shell -c "
from students.models import Student
for student in Student.objects.filter(student_number=''):
    student.save()  # Auto-generates student number
"
```

### Data Migration Scripts

```bash
# Export students to CSV
python manage.py shell -c "
import csv
from students.models import Student
with open('students_export.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['Student Number', 'Full Name', 'Email', 'Status'])
    for student in Student.objects.all():
        writer.writerow([student.student_number, student.full_name, student.email, student.status])
"
```

## 🏗 Project Structure

```
student-course-management/
├── authentication/                 # User authentication app
│   ├── models.py                  # User model
│   ├── serializers.py             # API serializers
│   ├── views.py                   # API views
│   └── urls.py                    # URL routing
├── students/                      # Student management app
│   ├── models.py                  # Student and Enrollment models
│   ├── serializers.py             # API serializers
│   ├── views.py                   # API views
│   └── urls.py                    # URL routing
├── courses/                       # Course management app
│   ├── models.py                  # Course model
│   ├── serializers.py             # API serializers
│   ├── views.py                   # API views
│   └── urls.py                    # URL routing
├── student_course_management/     # Main Django project
│   ├── settings.py                # Project settings
│   ├── urls.py                    # Main URL configuration
│   └── wsgi.py                    # WSGI configuration
├── frontend/                      # React frontend
│   ├── src/
│   │   ├── components/            # Reusable components
│   │   ├── pages/                 # Page components
│   │   ├── services/              # API services
│   │   └── context/               # React context
│   ├── public/                    # Static files
│   └── package.json               # Node dependencies
├── requirements.txt               # Python dependencies
└── manage.py                      # Django management script
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Admin and student roles with appropriate permissions
- **Password Validation**: Strong password requirements
- **CORS Configuration**: Properly configured cross-origin requests
- **Input Validation**: Comprehensive data validation on both frontend and backend
- **SQL Injection Protection**: Django ORM provides built-in protection

## 🧪 Testing

### Running Tests

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test authentication
python manage.py test students
python manage.py test courses

# Run with coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📝 Sample Data Structure

### Default Users

- **Admin**: `username: admin`, `password: admin123`
- **Student**: `username: john_doe`, `password: student123`

### Sample Courses

- **CS101**: Introduction to Computer Science (3 credits)
- **MATH201**: Calculus I (4 credits)
- **ENG101**: English Composition (3 credits)

## 🚀 Deployment

### Production Setup

1. **Environment Variables**

   ```bash
   DEBUG=False
   SECRET_KEY=your-production-secret-key
   DATABASE_URL=your-database-url
   ALLOWED_HOSTS=your-domain.com
   ```

2. **Static Files**

   ```bash
   python manage.py collectstatic
   ```

3. **Database Migration**
   ```bash
   python manage.py migrate
   ```

### Docker Deployment (Optional)

```dockerfile
# Dockerfile example
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support or questions:

- Create an issue on GitHub
- Check the API documentation at `/api/` endpoint
- Review the Django admin panel at `/admin/`

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy Coding! 🎓**
