import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const DashboardPage = () => {
  const { user } = useAuth();

  // Redirect to role-specific dashboards
  if (!user) {
    return <div>Loading...</div>;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === "student") {
    return <Navigate to="/student/dashboard" replace />;
  }

  // Fallback for unknown roles
  return <Navigate to="/student/dashboard" replace />;
};

export default DashboardPage;

  const handleAddCourse = () => {
    setShowCourseModal(true);
  };

  const handleAddStudent = () => {
    navigate("/students");
  };

  const handleViewReports = () => {
    navigate("/courses");
  };

  const handleManageCourses = () => {
    navigate("/courses");
  };

  const handleEnrollInCourse = async (courseId) => {
    try {
      setEnrolling(courseId);
      console.log("🎯 Starting enrollment for course:", courseId);

      // Get student profile to get student_id
      console.log("📝 Fetching student profile...");
      const profileResponse = await studentsAPI.getProfile();
      console.log("👤 Profile response:", profileResponse);

      const studentData = profileResponse.data || profileResponse;
      const studentId = studentData.student_id;
      console.log("🆔 Student ID:", studentId);

      if (!studentId) {
        throw new Error("Student ID not found in profile");
      }

      // Call the enrollment API
      console.log("📚 Enrolling student in course...");
      const enrollmentResponse = await coursesAPI.enrollStudent(courseId, {
        student_id: studentId,
      });
      console.log("✅ Enrollment response:", enrollmentResponse);

      setEnrollmentSuccess(courseId);
      // Refresh dashboard data to show updated enrollment
      fetchDashboardData();
      // Hide success message after 3 seconds
      setTimeout(() => setEnrollmentSuccess(null), 3000);
    } catch (error) {
      console.error("❌ Enrollment error:", error);
      console.error("❌ Error details:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);

      // Better error handling
      let errorMessage = "Enrollment failed";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(`Enrollment failed: ${errorMessage}`);
    } finally {
      setEnrolling(null);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      if (user.role === "admin") {
        // Admin dashboard - fetch summary data
        const coursesResponse = await coursesAPI.list({ limit: 5 });
        const activeCoursesResponse = await coursesAPI.listActive({ limit: 5 });
        const studentsResponse = await studentsAPI.list({ limit: 5 });
        const activeStudentsResponse = await studentsAPI.listActive({
          limit: 5,
        });

        console.log("📊 Dashboard - Students data:", studentsResponse.data);
        console.log(
          "📋 Dashboard - First student structure:",
          studentsResponse.data.results?.[0]
        );

        // Fetch all courses for student modal
        const allCoursesResponse = await coursesAPI.list({ is_active: true });

        setStats({
          totalCourses:
            coursesResponse.data.count ||
            coursesResponse.data.results?.length ||
            0,
          activeCourses:
            activeCoursesResponse.data.count ||
            activeCoursesResponse.data.results?.length ||
            0,
          totalStudents:
            studentsResponse.data.count ||
            studentsResponse.data.results?.length ||
            0,
          activeStudents:
            activeStudentsResponse.data.count ||
            activeStudentsResponse.data.results?.length ||
            0,
        });

        setRecentCourses(
          coursesResponse.data.results || coursesResponse.data || []
        );
        setRecentStudents(
          studentsResponse.data.results || studentsResponse.data || []
        );
        setCourses(
          allCoursesResponse.data.results || allCoursesResponse.data || []
        );
      } else {
        // Student dashboard - fetch all available courses and student profile
        const [allCoursesResponse, profileResponse] = await Promise.all([
          coursesAPI.list({ is_active: true }),
          studentsAPI.getProfile(),
        ]);

        const allCourses =
          allCoursesResponse.data.results || allCoursesResponse.data || [];
        const studentData = profileResponse.data || profileResponse;
        setStudentProfile(studentData);

        // Separate enrolled and available courses
        const studentCurrentCourse = studentData?.course;
        const enrolled = studentCurrentCourse ? [studentCurrentCourse] : [];
        const available = allCourses.filter(
          (course) =>
            !enrolled.some(
              (enrolledCourse) => enrolledCourse.course_id === course.course_id
            )
        );

        setEnrolledCourses(enrolled);
        setAvailableCourses(available);
        setRecentCourses(available); // Keep for compatibility
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      name: "Total Courses",
      stat: stats.totalCourses,
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      name: "Active Courses",
      stat: stats.activeCourses,
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      name: "Total Students",
      stat: stats.totalStudents,
      icon: Users,
      color: "bg-purple-500",
    },
    {
      name: "Active Students",
      stat: stats.activeStudents,
      icon: UserCheck,
      color: "bg-orange-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <GraduationCap className="h-12 w-12 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Welcome back, {user?.first_name || user?.username}!
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {user?.role === "admin"
                    ? "Administrator Dashboard"
                    : "Student Dashboard"}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Dashboard Content */}
      {user?.role === "admin" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`${item.color} p-3 rounded-md`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {item.name}
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {item.stat}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Data */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Courses */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Recent Courses
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigate("/courses")}
                      className="text-sm text-primary-600 hover:text-primary-900"
                    >
                      View All
                    </button>
                    <BookOpen className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-3">
                  {recentCourses.length > 0 ? (
                    recentCourses.slice(0, 5).map((course) => (
                      <div
                        key={course.course_id}
                        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {course.course_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {course.course_code} • {course.credits} credits
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              course.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {course.is_active ? "Active" : "Inactive"}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {course.enrolled_students_count || 0} students
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No courses found
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Students */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Recent Students
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigate("/students")}
                      className="text-sm text-primary-600 hover:text-primary-900"
                    >
                      View All
                    </button>
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-3">
                  {recentStudents.length > 0 ? (
                    recentStudents.slice(0, 5).map((student) => (
                      <div
                        key={student.student_id}
                        className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {student.user_details?.first_name ||
                                  student.user?.first_name}{" "}
                                {student.user_details?.last_name ||
                                  student.user?.last_name}
                                {student.full_name &&
                                  !student.user_details &&
                                  !student.user && (
                                    <span>{student.full_name}</span>
                                  )}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {student.user_details?.email ||
                                  student.user?.email ||
                                  student.email}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-gray-600">
                                  ID: {student.student_number}
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-600">
                                  Course:{" "}
                                  {student.course_details?.course_name ||
                                    student.course?.course_name ||
                                    student.course?.course_code ||
                                    "Not enrolled"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              student.status === "active"
                                ? "bg-green-100 text-green-800"
                                : student.status === "graduated"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {student.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No students found
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {user?.role === "admin" && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <button
                    onClick={handleAddCourse}
                    className="btn-primary flex items-center justify-center"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Add New Course
                  </button>
                  <button
                    onClick={handleManageCourses}
                    className="btn-secondary flex items-center justify-center"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Manage Courses
                  </button>
                  <button
                    onClick={handleAddStudent}
                    className="btn-primary flex items-center justify-center"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Add New Student
                  </button>
                  <button
                    onClick={() => navigate("/students")}
                    className="btn-secondary flex items-center justify-center"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Students
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Student Dashboard Content */}
      {user?.role === "student" && (
        <div className="space-y-6">
          {/* Student Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg text-white">
            <div className="px-6 py-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">
                    Welcome back, {user?.first_name || "Student"}!
                  </h1>
                  <p className="text-blue-100 mt-2">
                    Track your academic journey and explore new courses
                  </p>
                </div>
                <div className="hidden md:block">
                  <GraduationCap className="h-20 w-20 text-blue-200" />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center">
                    <BookOpen className="h-8 w-8 text-blue-200" />
                    <div className="ml-3">
                      <p className="text-blue-100 text-sm">Enrolled Courses</p>
                      <p className="text-2xl font-bold">
                        {enrolledCourses.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-green-200" />
                    <div className="ml-3">
                      <p className="text-blue-100 text-sm">Available Courses</p>
                      <p className="text-2xl font-bold">
                        {availableCourses.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center">
                    <UserCheck className="h-8 w-8 text-purple-200" />
                    <div className="ml-3">
                      <p className="text-blue-100 text-sm">Status</p>
                      <p className="text-lg font-semibold">Active Student</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Student Information Card */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="px-6 py-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Users className="h-6 w-6 mr-2 text-blue-600" />
                Student Information
              </h3>
            </div>
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {studentProfile?.full_name ||
                      `${user?.first_name || ""} ${
                        user?.last_name || ""
                      }`.trim() ||
                      "Not set"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">
                    Email Address
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {user?.email}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">
                    Phone Number
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {studentProfile?.phone_number || "Not provided"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    {studentProfile?.is_active !== false
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="px-6 py-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-purple-600" />
                Quick Actions
              </h3>
            </div>
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    /* Add profile edit functionality */
                  }}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Users className="h-8 w-8 text-blue-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Edit Profile</p>
                    <p className="text-sm text-gray-500">
                      Update your information
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    /* Add course history functionality */
                  }}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BookOpen className="h-8 w-8 text-green-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Course History</p>
                    <p className="text-sm text-gray-500">
                      View your course records
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    /* Add support functionality */
                  }}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <AlertCircle className="h-8 w-8 text-orange-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Get Support</p>
                    <p className="text-sm text-gray-500">
                      Contact administration
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Creation Modal */}
      {showCourseModal && (
        <CourseModal
          type="create"
          course={null}
          onClose={() => setShowCourseModal(false)}
          onSuccess={() => {
            setShowCourseModal(false);
            fetchDashboardData(); // Refresh dashboard data
          }}
        />
      )}
    </div>
  );
};

// Course Modal Component
const CourseModal = ({ type, course, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    course_name: course?.course_name || "",
    course_code: course?.course_code || "",
    description: course?.description || "",
    prerequisites: course?.prerequisites || "",
    course_duration: course?.course_duration || "",
    credits: course?.credits || "",
    is_active: course?.is_active ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (type === "create") {
        await coursesAPI.create(formData);
      } else if (type === "edit") {
        await coursesAPI.update(course.course_id, formData);
      } else if (type === "delete") {
        await coursesAPI.delete(course.course_id);
      }
      onSuccess();
    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  if (type === "delete") {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Delete Course</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Are you sure you want to delete "{course?.course_name}"? This action
            cannot be undone.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="btn-danger flex-1"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          {type === "create" ? "Create New Course" : "Edit Course"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Name *
              </label>
              <input
                type="text"
                value={formData.course_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    course_name: e.target.value,
                  }))
                }
                className="input-field"
                required
              />
              {errors.course_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.course_name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Code *
              </label>
              <input
                type="text"
                value={formData.course_code}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    course_code: e.target.value,
                  }))
                }
                className="input-field"
                required
              />
              {errors.course_code && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.course_code}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prerequisites
            </label>
            <textarea
              value={formData.prerequisites}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  prerequisites: e.target.value,
                }))
              }
              rows={2}
              className="input-field"
              placeholder="Enter course prerequisites..."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Credits *
              </label>
              <input
                type="number"
                value={formData.credits}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, credits: e.target.value }))
                }
                className="input-field"
                min="1"
                max="10"
                required
              />
              {errors.credits && (
                <p className="text-red-500 text-xs mt-1">{errors.credits}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Duration (months) *
              </label>
              <input
                type="number"
                value={formData.course_duration}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    course_duration: e.target.value,
                  }))
                }
                className="input-field"
                min="1"
                max="72"
                required
                placeholder="Enter duration in months"
              />
              {errors.course_duration && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.course_duration}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_active: e.target.checked,
                  }))
                }
                className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Active Course</span>
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : type === "create"
                ? "Create Course"
                : "Update Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;
