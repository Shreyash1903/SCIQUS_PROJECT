# 🎓 Student Course Management System (SCIQUS)

A comprehensive full-stack web application for managing students, courses, and enrollments built with **Django REST Framework** (backend) and **React** (frontend). This system provides role-based access control with separate interfaces for administrators and students.

## 📸 Project Screenshots

![Login Page](Project%20Screenshots/Screenshot%202025-08-17%20133012.png)

![Registration Page](Project%20Screenshots/Screenshot%202025-08-17%20133025.png)

![Admin Dashboard](Project%20Screenshots/Screenshot%202025-08-17%20133037.png)

![Admin Statistics](Project%20Screenshots/Screenshot%202025-08-17%20133050.png)

![Admin Courses List](Project%20Screenshots/Screenshot%202025-08-17%20133102.png)

![Add New Course](Project%20Screenshots/Screenshot%202025-08-17%20133107.png)

![Course Details View](Project%20Screenshots/Screenshot%202025-08-17%20133121.png)

![Edit Course](Project%20Screenshots/Screenshot%202025-08-17%20133204.png)

![Students Overview](Project%20Screenshots/Screenshot%202025-08-17%20133213.png)

![Student Profile](Project%20Screenshots/Screenshot%202025-08-17%20133233.png)

![Student Information](Project%20Screenshots/Screenshot%202025-08-17%20133244.png)

![Enrollment Tracking](Project%20Screenshots/Screenshot%202025-08-17%20133300.png)

![Enrollment Details](Project%20Screenshots/Screenshot%202025-08-17%20133323.png)

![Enrollment Reports](Project%20Screenshots/Screenshot%202025-08-17%20133337.png)

![Student Dashboard](Project%20Screenshots/Screenshot%202025-08-17%20133404.png)

![Dashboard Features](Project%20Screenshots/Screenshot%202025-08-17%20133424.png)

![Available Courses](Project%20Screenshots/Screenshot%202025-08-17%20133448.png)

![Course Information](Project%20Screenshots/Screenshot%202025-08-17%20133502.png)

![Course Search](Project%20Screenshots/Screenshot%202025-08-17%20133515.png)

![Course Enrollment](Project%20Screenshots/Screenshot%202025-08-17%20133544.png)

![My Enrolled Courses](Project%20Screenshots/Screenshot%202025-08-17%20133627.png)

![Course Progress](Project%20Screenshots/Screenshot%202025-08-17%20133642.png)

![Student Profile](Project%20Screenshots/Screenshot%202025-08-17%20133655.png)

![Profile Editing](Project%20Screenshots/Screenshot%202025-08-17%20133724.png)

![Account Settings](Project%20Screenshots/Screenshot%202025-08-17%20133737.png)

![Additional Features](Project%20Screenshots/Screenshot%202025-08-17%20133754.png)

![System Navigation](Project%20Screenshots/Screenshot%202025-08-17%20133810.png)

![Mobile Responsive Design](Project%20Screenshots/Screenshot%202025-08-17%20133836.png)

## 🎯 Key Features

### 👨‍💼 Admin Features

- **📊 Dashboard Analytics**: Real-time system statistics and KPIs
- **👥 Student Management**: Complete CRUD operations for student profiles
- **📚 Course Management**: Course creation, editing, and activation/deactivation
- **📝 Enrollment Tracking**: Monitor and manage student enrollments
- **🔍 Advanced Search**: Powerful search and filtering across all entities
- **📈 Reporting**: Comprehensive reports and analytics
- **🔒 Role Management**: User role assignment and permission control

### 🧑‍🎓 Student Features

- **🎯 Personal Dashboard**: Customized dashboard with course progress
- **📚 Course Catalog**: Browse and search available courses
- **✅ Easy Enrollment**: Simple course enrollment process
- **📋 My Courses**: View enrolled courses and progress
- **👤 Profile Management**: Update personal information and settings
- **🔔 Notifications**: Course updates and system notifications
- **📱 Mobile Friendly**: Responsive design for all devices

### 🔒 Security Features

- **🔐 JWT Authentication**: Secure token-based authentication
- **👥 Role-based Access**: Admin and student roles with appropriate permissions
- **🛡️ Password Security**: Strong password requirements and validation
- **🌐 CORS Protection**: Properly configured cross-origin requests
- **✅ Input Validation**: Comprehensive data validation on both ends

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
   cd SCIQUS-Project
   ```

2. **Create virtual environment**

   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   # source .venv/bin/activate  # macOS/Linux
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Setup database**

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create admin user**

   ```bash
   python manage.py createsuperuser
   ```

6. **Run server**
   ```bash
   python manage.py runserver
   ```
   Backend available at: `http://127.0.0.1:8000/`

### Frontend Setup (React)

1. **Navigate to frontend**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   Frontend available at: `http://localhost:3000/`

## 🔧 Default Credentials

### Admin Access

- **Username**: `admin`
- **Password**: `admin@1234`
- **Access**: Full system administration

### Student Access

- **Username**: `john` (or create new student account)
- **Password**: `John@1234`
- **Access**: Course enrollment and profile management

## 🏗️ Technical Architecture

### Backend (Django REST Framework)

- **Authentication**: Custom User model with JWT tokens
- **API Design**: RESTful APIs with proper HTTP methods
- **Database**: SQLite (development) / PostgreSQL (production)
- **Security**: CORS, authentication middleware, input validation

### Frontend (React)

- **UI Framework**: React 18 with functional components
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context API and hooks
- **Routing**: React Router for navigation
- **API Integration**: Axios for HTTP requests

### Database Models

- **User**: Authentication and profile management
- **Student**: Student-specific information and enrollment
- **Course**: Course details and management
- **Enrollment**: Student-course relationship tracking

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:

- 💻 **Desktop**: Full-featured interface with advanced functionality
- 📱 **Mobile**: Touch-optimized interface with intuitive navigation
- 📟 **Tablet**: Adaptive layout that works on all screen sizes

## 🔌 API Endpoints

### Authentication

```
POST /api/auth/login/          # User login
POST /api/auth/register/       # User registration
POST /api/auth/logout/         # User logout
GET  /api/auth/profile/        # Get user profile
PUT  /api/auth/profile/        # Update profile
```

### Courses

```
GET    /api/courses/           # List courses
POST   /api/courses/           # Create course (admin)
GET    /api/courses/{id}/      # Course details
PUT    /api/courses/{id}/      # Update course (admin)
DELETE /api/courses/{id}/      # Delete course (admin)
```

### Students

```
GET  /api/students/            # List students (admin)
POST /api/students/            # Create student (admin)
GET  /api/students/profile/    # Get student profile
PUT  /api/students/profile/    # Update student profile
POST /api/courses/{id}/enroll/ # Enroll in course
```

## 🧪 Testing

### Backend Testing

```bash
python manage.py test
```

### Frontend Testing

```bash
cd frontend
npm test
```

## 📈 Future Enhancements

- 📧 Email notifications for enrollment updates
- 📊 Advanced analytics and reporting dashboard
- 💬 Real-time chat support system
- 📱 Mobile app for iOS and Android
- 🎥 Video course content integration
- 📝 Assignment and grading system
- 🔔 Push notifications
- 📤 Bulk data import/export features

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, questions, or feature requests:

- 🐛 Create an issue on GitHub
- 📧 Email: support@sciqus.com
- 📖 Check the API documentation at `/api/`
- 🔧 Review Django admin panel at `/admin/`

---

**Made with ❤️ for educational excellence**

_SCIQUS - Student Course Intelligence & Quality University System_
