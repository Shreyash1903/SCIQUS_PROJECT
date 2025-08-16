import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { coursesAPI, studentsAPI } from "../../services/api";
import {
  BookOpen,
  Users,
  GraduationCap,
  TrendingUp,
  UserCheck,
  CheckCircle,
  Clock,
  Star,
  Award,
} from "lucide-react";

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Student dashboard - fetch all available courses and student profile
      const [allCoursesResponse, profileResponse] = await Promise.all([
        coursesAPI.list({ is_active: true }),
        studentsAPI.getProfile(),
      ]);

      const allCourses =
        allCoursesResponse.data.results || allCoursesResponse.data || [];
      const studentData = profileResponse.data || profileResponse;
      console.log("📊 Dashboard - Student Data:", studentData);
      setStudentProfile(studentData);

      // Separate enrolled and available courses
      const studentActiveCourses = studentData?.active_courses || [];
      console.log(
        "📚 Dashboard - Found enrolled courses:",
        studentActiveCourses
      );
      const enrolled = studentActiveCourses;
      const available = allCourses.filter(
        (course) =>
          !enrolled.some(
            (enrolledCourse) => enrolledCourse.course_id === course.course_id
          )
      );
      console.log("📖 Dashboard - Available courses:", available.length);

      setEnrolledCourses(enrolled);
      setAvailableCourses(available);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-sm sm:text-base text-gray-600">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Student Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-xl shadow-lg text-white">
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold">
                Welcome back, {user?.first_name || "Student"}!
              </h1>
              <p className="text-blue-100 mt-2 text-sm sm:text-base">
                Track your academic journey and explore new courses
              </p>
            </div>
            <div className="hidden sm:block">
              <GraduationCap className="h-16 w-16 sm:h-20 sm:w-20 text-blue-200" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
            <div className="bg-white/10 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
              <div className="flex items-center">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-200 flex-shrink-0" />
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-blue-100 text-xs sm:text-sm">
                    Enrolled Courses
                  </p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {enrolledCourses.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-200 flex-shrink-0" />
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-blue-100 text-xs sm:text-sm">
                    Available Courses
                  </p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {availableCourses.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
              <div className="flex items-center">
                <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-purple-200 flex-shrink-0" />
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-blue-100 text-xs sm:text-sm">Status</p>
                  <p className="text-base sm:text-lg font-semibold">
                    Active Student
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Information Card */}
      <div className="bg-white shadow-lg rounded-lg sm:rounded-xl border border-gray-100">
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-100">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600 flex-shrink-0" />
            <span className="truncate">Student Information</span>
          </h3>
        </div>
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Full Name
              </p>
              <p className="text-sm sm:text-lg font-semibold text-gray-900 break-words">
                {studentProfile?.user_details?.full_name ||
                  studentProfile?.full_name ||
                  `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
                  "Not set"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Email Address
              </p>
              <p className="text-xs sm:text-base font-semibold text-gray-900 whitespace-nowrap overflow-x-auto">
                {studentProfile?.user_details?.email ||
                  user?.email ||
                  "Not provided"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Phone Number
              </p>
              <p className="text-sm sm:text-lg font-semibold text-gray-900 break-words">
                {studentProfile?.user_details?.phone || "Not provided"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Status
              </p>
              <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full mr-1 sm:mr-2 flex-shrink-0"></div>
                <span className="truncate">
                  {studentProfile?.is_active !== false ? "Active" : "Inactive"}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Section */}
      <div className="bg-white shadow-lg rounded-lg sm:rounded-xl border border-gray-100">
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-green-600 flex-shrink-0" />
              <span className="truncate">
                My Enrolled Courses ({enrolledCourses.length})
              </span>
            </h3>
            {enrolledCourses.length > 0 && (
              <button
                onClick={() => navigate("/courses")}
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
              >
                View All Courses →
              </button>
            )}
          </div>
        </div>
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          {enrolledCourses.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <BookOpen className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                No Enrolled Courses
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 max-w-sm mx-auto px-4">
                Start your learning journey by enrolling in available courses
              </p>
              <button
                onClick={() => navigate("/courses")}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {enrolledCourses.map((course, index) => (
                <div
                  key={course.course_id || index}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-green-200 hover:shadow-md transition-all duration-200"
                >
                  {/* Course Header */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
                        <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 truncate max-w-full">
                          {course.course_code}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                      <span className="text-xs font-semibold text-green-700 hidden sm:inline">
                        ENROLLED
                      </span>
                    </div>
                  </div>

                  {/* Course Title */}
                  <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                    {course.course_name}
                  </h4>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="text-center bg-white/50 rounded-lg p-2 sm:p-3">
                      <div className="flex items-center justify-center mb-1">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900">
                        {course.credits || 0} Credits
                      </p>
                    </div>
                    <div className="text-center bg-white/50 rounded-lg p-2 sm:p-3">
                      <div className="flex items-center justify-center mb-1">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900">
                        {course.course_duration
                          ? `${course.course_duration} months`
                          : "1 semester"}
                      </p>
                    </div>
                  </div>

                  {/* Course Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                          course.is_active ? "bg-green-400" : "bg-red-400"
                        }`}
                      ></div>
                      <span
                        className={`text-xs font-medium ${
                          course.is_active ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {course.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate("/courses")}
                      className="text-xs text-green-600 hover:text-green-800 font-medium whitespace-nowrap"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary Stats */}
          {enrolledCourses.length > 0 && (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4 text-center">
                  <div className="flex items-center justify-center mb-1 sm:mb-2">
                    <Award className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Credits
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">
                    {enrolledCourses.reduce(
                      (total, course) => total + (course.credits || 0),
                      0
                    )}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 sm:p-4 text-center">
                  <div className="flex items-center justify-center mb-1 sm:mb-2">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Active Courses
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600">
                    {
                      enrolledCourses.filter((course) => course.is_active)
                        .length
                    }
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 sm:p-4 text-center">
                  <div className="flex items-center justify-center mb-1 sm:mb-2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Enrollment Status
                  </p>
                  <p className="text-base sm:text-lg font-bold text-green-600">
                    Enrolled
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
