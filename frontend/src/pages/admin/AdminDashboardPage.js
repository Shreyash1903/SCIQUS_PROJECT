import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { coursesAPI, studentsAPI } from "../../services/api";
import {
  BookOpen,
  Users,
  GraduationCap,
  TrendingUp,
  UserCheck,
  AlertCircle,
  User,
  Edit,
  Trash2,
  Plus,
  Activity,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from "lucide-react";

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeCourses: 0,
    totalStudents: 0,
    activeStudents: 0,
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalType, setModalType] = useState("create"); // 'create', 'edit', 'delete'

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle URL parameters for quick actions
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const action = params.get("action");

    if (action === "addCourse") {
      setShowCourseModal(true);
      // Clean up the URL
      navigate("/admin/dashboard", { replace: true });
    } else if (action === "addStudent") {
      setShowStudentModal(true);
      // Clean up the URL
      navigate("/admin/dashboard", { replace: true });
    }
  }, [location.search, navigate]);

  // Handlers for course operations
  const handleEditCourse = (course) => {
    setModalType("edit");
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  const handleDeleteCourse = (course) => {
    setModalType("delete");
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

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
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      change: "+12%",
      changeType: "positive",
    },
    {
      name: "Active Courses",
      stat: stats.activeCourses,
      icon: TrendingUp,
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      change: "+8%",
      changeType: "positive",
    },
    {
      name: "Total Students",
      stat: stats.totalStudents,
      icon: Users,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      change: "+15%",
      changeType: "positive",
    },
    {
      name: "Active Students",
      stat: stats.activeStudents,
      icon: UserCheck,
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      change: "+5%",
      changeType: "positive",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Mobile-Optimized Welcome Section */}
        <div className="relative overflow-hidden bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90"></div>
          <div className="relative px-4 py-6 sm:px-8 sm:py-12">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                    Welcome back, {user?.first_name || user?.username}! 👋
                  </h1>
                  <p className="mt-1 text-blue-100 text-sm sm:text-base">
                    Administrator Dashboard
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white backdrop-blur-sm">
                  <Activity className="w-3 h-3 mr-1" />
                  System Active
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white backdrop-blur-sm">
                  <Award className="w-3 h-3 mr-1" />
                  Admin Access
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white backdrop-blur-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></div>
                  {stats.totalCourses + stats.totalStudents} Total Records
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-Optimized Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {statsCards.map((item, index) => {
            const Icon = item.icon;
            const ChangeIcon =
              item.changeType === "positive" ? ArrowUpRight : ArrowDownRight;
            return (
              <div
                key={item.name}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 ${item.bgColor} rounded-lg`}
                      >
                        <Icon
                          className={`w-5 h-5 sm:w-6 sm:h-6 ${item.textColor}`}
                        />
                      </div>
                      <div
                        className={`w-1.5 h-8 sm:h-12 ${item.color} rounded-full`}
                      ></div>
                    </div>

                    <div>
                      <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-1 leading-tight">
                        {item.name}
                      </h3>
                      <div className="flex items-end justify-between">
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                          {item.stat}
                        </p>
                        <div
                          className={`flex items-center space-x-1 text-xs font-medium ${
                            item.changeType === "positive"
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          <ChangeIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">
                            {item.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`h-1 ${item.color}`}></div>
              </div>
            );
          })}
        </div>

        {/* Mobile-Optimized Recent Data Section */}
        <div className="space-y-4 sm:space-y-6">
          {/* Recent Courses */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 sm:px-6 sm:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white">
                    Recent Courses
                  </h3>
                </div>
                <button
                  onClick={() => navigate("/admin/courses")}
                  className="text-blue-100 hover:text-white text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {recentCourses.length > 0 ? (
                  recentCourses.slice(0, 5).map((course, index) => (
                    <div
                      key={course.course_id}
                      className="group flex items-center p-3 sm:p-4 bg-gray-50 hover:bg-blue-50 rounded-xl transition-all duration-300 border border-transparent hover:border-blue-200"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 ${
                            course.is_active ? "bg-blue-100" : "bg-gray-100"
                          } rounded-lg flex items-center justify-center flex-shrink-0`}
                        >
                          <BookOpen
                            className={`w-5 h-5 sm:w-6 sm:h-6 ${
                              course.is_active
                                ? "text-blue-600"
                                : "text-gray-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                            {course.course_name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">
                            {course.course_code} • {course.credits} credits
                          </p>
                          <div className="flex items-center mt-1.5 sm:mt-2 space-x-2 sm:space-x-3">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                course.is_active
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full mr-1 ${
                                  course.is_active
                                    ? "bg-emerald-400"
                                    : "bg-red-400"
                                }`}
                              ></div>
                              {course.is_active ? "Active" : "Inactive"}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {course.enrolled_students_count || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-2">
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                          title="Edit Course"
                        >
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course)}
                          className="p-1.5 sm:p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors duration-200"
                          title="Delete Course"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                    <p className="text-gray-500 font-medium text-sm sm:text-base">
                      No courses found
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                      Create your first course to get started
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Students */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-4 py-3 sm:px-6 sm:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white">
                    Recent Students
                  </h3>
                </div>
                <button
                  onClick={() => navigate("/admin/students")}
                  className="text-purple-100 hover:text-white text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {recentStudents.length > 0 ? (
                  recentStudents.slice(0, 5).map((student, index) => (
                    <div
                      key={student.student_id}
                      className="group flex items-center p-3 sm:p-4 bg-gray-50 hover:bg-purple-50 rounded-xl transition-all duration-300 border border-transparent hover:border-purple-200"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                            <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white ${
                              student.status === "active"
                                ? "bg-emerald-400"
                                : "bg-red-400"
                            }`}
                          ></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                            {student.user_details?.first_name ||
                              student.user?.first_name}{" "}
                            {student.user_details?.last_name ||
                              student.user?.last_name}
                            {student.full_name &&
                              !student.user_details &&
                              !student.user && <span>{student.full_name}</span>}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">
                            {student.user_details?.email ||
                              student.user?.email ||
                              student.email}
                          </p>
                          <div className="flex items-center space-x-2 sm:space-x-3 mt-1.5 sm:mt-2">
                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                              ID: {student.student_number}
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                              {student.active_courses &&
                              student.active_courses.length > 0
                                ? student.active_courses.length === 1
                                  ? student.active_courses[0].course_name
                                  : `${student.active_courses.length} courses`
                                : "Not enrolled"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                            student.status === "active"
                              ? "bg-emerald-100 text-emerald-800"
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
                  <div className="text-center py-8 sm:py-12">
                    <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                    <p className="text-gray-500 font-medium text-sm sm:text-base">
                      No students found
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                      Add students to see them here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Creation/Edit Modal */}
      {showCourseModal && (
        <CourseModal
          type={modalType}
          course={selectedCourse}
          onClose={() => {
            setShowCourseModal(false);
            setSelectedCourse(null);
            setModalType("create");
          }}
          onSuccess={() => {
            setShowCourseModal(false);
            setSelectedCourse(null);
            setModalType("create");
            fetchDashboardData(); // Refresh dashboard data
          }}
        />
      )}

      {/* Student Creation Modal */}
      {showStudentModal && (
        <StudentModal
          type="create"
          student={null}
          courses={courses}
          onClose={() => setShowStudentModal(false)}
          onSuccess={() => {
            setShowStudentModal(false);
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

// Student Modal Component
const StudentModal = ({ type, student, courses, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: student?.user?.username || student?.user_details?.username || "",
    email: student?.user?.email || student?.user_details?.email || "",
    first_name:
      student?.user?.first_name || student?.user_details?.first_name || "",
    last_name:
      student?.user?.last_name || student?.user_details?.last_name || "",
    password: "",
    confirm_password: "",
    phone_number: student?.phone_number || "",
    course:
      student?.course?.course_id || student?.course_details?.course_id || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";

    // Password validation for new students
    if (type === "create") {
      if (!formData.password) newErrors.password = "Password is required";
      if (formData.password.length < 6)
        newErrors.password = "Password must be at least 6 characters";
      if (formData.password !== formData.confirm_password) {
        newErrors.confirm_password = "Passwords do not match";
      }
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const submitData = { ...formData };

      // Clean up data for submission
      if (type === "edit" && !submitData.password) {
        delete submitData.password;
        delete submitData.confirm_password;
      }

      if (type === "create") {
        await studentsAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error("Form submission error:", error);
      if (error.response?.data) {
        if (typeof error.response.data === "object") {
          setErrors(error.response.data);
        } else {
          setErrors({
            general: "An error occurred while processing your request",
          });
        }
      } else {
        setErrors({ general: "Network error. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-semibold text-gray-900">
            Create New Student
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Display general errors */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-800 text-sm">{errors.general}</p>
              </div>
            </div>
          )}

          {/* User Account Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-primary-600" />
              User Account
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  className="input-field"
                  required
                  placeholder="Enter username"
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="input-field"
                  required
                  placeholder="student@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      first_name: e.target.value,
                    }))
                  }
                  className="input-field"
                  required
                  placeholder="Enter first name"
                />
                {errors.first_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.first_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      last_name: e.target.value,
                    }))
                  }
                  className="input-field"
                  required
                  placeholder="Enter last name"
                />
                {errors.last_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.last_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="input-field"
                  required
                  placeholder="Enter password"
                  minLength={6}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={formData.confirm_password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      confirm_password: e.target.value,
                    }))
                  }
                  className="input-field"
                  required
                  placeholder="Confirm password"
                  minLength={6}
                />
                {errors.confirm_password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirm_password}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Student Information Section */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-primary-600" />
              Student Information
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone_number: e.target.value,
                    }))
                  }
                  className="input-field"
                  placeholder="+919123456789"
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone_number}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course (Optional)
                </label>
                <select
                  value={formData.course}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, course: e.target.value }))
                  }
                  className="input-field"
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.course_code} - {course.course_name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Students can be enrolled in courses later through the
                  enrollment process
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200">
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
              {loading ? "Creating..." : "Create Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
