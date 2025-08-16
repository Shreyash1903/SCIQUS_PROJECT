import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { coursesAPI, studentsAPI } from "../../services/api";
import {
  Search,
  BookOpen,
  Filter,
  X,
  GraduationCap,
  CheckCircle,
  Clock,
  Star,
  Award,
  ChevronRight,
  Eye,
  TrendingUp,
  Globe,
  Users,
} from "lucide-react";

const StudentCoursesPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    is_active: "true", // Only show active courses for students by default
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });

  // Student enrollment states
  const [enrolling, setEnrolling] = useState(null);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    console.log("🚀 StudentCoursesPage mounted - Current user:", user);
    fetchCourses();
    fetchStudentProfile();
  }, [searchTerm, filters, pagination.currentPage]);

  const fetchStudentProfile = async () => {
    try {
      const profileResponse = await studentsAPI.getProfile();
      const studentData = profileResponse.data || profileResponse;
      console.log("👤 Student profile data:", studentData);
      setStudentProfile(studentData);

      // Get enrolled courses from active_courses array
      const enrolled = studentData?.active_courses || [];
      console.log("📚 Found enrolled courses:", enrolled);
      setEnrolledCourses(enrolled);
    } catch (error) {
      console.error("Error fetching student profile:", error);
    }
  };

  const handleEnrollInCourse = async (courseId) => {
    try {
      setEnrolling(courseId);
      console.log("🎯 Starting enrollment for course:", courseId);

      // Get student profile to get student_id
      const profileResponse = await studentsAPI.getProfile();
      console.log("👤 Profile response:", profileResponse);

      const studentData = profileResponse.data || profileResponse;
      const studentId = studentData.student_id;

      if (!studentId) {
        throw new Error("Student ID not found in profile");
      }

      // Call the enrollment API
      console.log("📚 Enrolling student in course...");
      await coursesAPI.enrollStudent(courseId, { student_id: studentId });

      setEnrollmentSuccess(courseId);

      // Refresh courses and student profile
      fetchCourses();
      fetchStudentProfile();

      // Hide success message after 3 seconds
      setTimeout(() => setEnrollmentSuccess(null), 3000);
    } catch (error) {
      console.error("❌ Enrollment error:", error);
      console.error("❌ Error response:", error.response?.data);

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

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        search: searchTerm,
      };

      // Only add filters that have actual values
      Object.keys(filters).forEach((key) => {
        if (filters[key] && filters[key] !== "") {
          params[key] = filters[key];
        }
      });

      console.log("🔍 Fetching courses with params:", params);
      const response = await coursesAPI.list(params);
      console.log("📊 Courses API Response:", response.data);

      setCourses(response.data.results || response.data || []);

      if (response.data.count !== undefined) {
        setPagination((prev) => ({
          ...prev,
          totalCount: response.data.count,
          totalPages: Math.ceil(response.data.count / 10),
        }));
      }
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to format course description
  const formatCourseText = (text) => {
    if (!text) return [];

    const items = text
      .split(/[●•]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    return items;
  };

  // Check if student is enrolled in a course
  const isEnrolledInCourse = (courseId) => {
    const isEnrolled = enrolledCourses.some(
      (course) => course.course_id === courseId || course.id === courseId
    );
    console.log(`🔍 Checking enrollment for course ${courseId}:`, isEnrolled);
    console.log("📚 Current enrolled courses:", enrolledCourses);
    return isEnrolled;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Enhanced Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-white rounded-full"></div>
            <div className="absolute top-1/4 right-1/3 w-4 h-4 bg-white rounded-full"></div>
          </div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight">
                      Discover Courses
                    </h1>
                    <p className="text-blue-100 text-lg mt-1">
                      Explore {pagination.totalCount} amazing courses and
                      advance your skills
                    </p>
                  </div>
                </div>

                {enrolledCourses.length > 0 && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-300" />
                      <div>
                        <p className="font-semibold">Currently Enrolled</p>
                        <p className="text-blue-100">
                          {enrolledCourses.length === 1
                            ? enrolledCourses[0].course_name
                            : `${enrolledCourses.length} courses`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Enrollment Success Message */}
        {enrollmentSuccess && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-900">
                  Enrollment Successful!
                </h3>
                <p className="text-green-700">
                  You've been successfully enrolled. Check your dashboard for
                  course details.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search courses by name, code, description, or instructor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-xl p-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={filters.is_active}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      is_active: e.target.value,
                    }))
                  }
                  className="bg-transparent border-none focus:ring-0 text-gray-700 font-medium cursor-pointer"
                >
                  <option value="true">Available Courses</option>
                  <option value="">All Courses</option>
                </select>
              </div>

              {(searchTerm || filters.is_active !== "true") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({ is_active: "true" });
                  }}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                >
                  <X className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                  <span className="font-medium">Clear</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Courses Grid */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-gray-100">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {searchTerm || filters.is_active !== "true"
                  ? "No Matching Courses"
                  : "No Courses Available"}
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {searchTerm || filters.is_active !== "true"
                  ? "Try adjusting your search criteria or browse all courses"
                  : "Check back later for new course offerings"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {courses.map((course) => {
              const isEnrolled = isEnrolledInCourse(
                course.course_id || course.id
              );

              return (
                <div
                  key={course.course_id || course.id}
                  className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 overflow-hidden transform hover:-translate-y-2 ${
                    isEnrolled
                      ? "border-green-300 bg-gradient-to-br from-green-50 to-emerald-50"
                      : "border-gray-100 hover:border-blue-200"
                  }`}
                >
                  {/* Course Header with Gradient */}
                  <div
                    className={`p-6 ${
                      isEnrolled
                        ? "bg-gradient-to-r from-green-500 to-emerald-600"
                        : "bg-gradient-to-r from-blue-600 to-purple-600"
                    } text-white relative overflow-hidden`}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute -top-4 -right-4 w-20 h-20 bg-white rounded-full"></div>
                      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-full"></div>
                    </div>

                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                              <BookOpen className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="text-xl font-bold leading-tight line-clamp-2">
                              {course.course_name}
                            </h3>
                          </div>

                          <div className="flex items-center space-x-3 mb-3">
                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                              {course.course_code}
                            </span>
                            {isEnrolled && (
                              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Enrolled
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                course.is_active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full mr-2 ${
                                  course.is_active
                                    ? "bg-green-400"
                                    : "bg-red-400"
                                }`}
                              ></div>
                              {course.is_active ? "Available" : "Unavailable"}
                            </span>
                            <span className="text-white/80 text-sm flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {course.enrolled_students_count || 0} students
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6 space-y-6">
                    {/* Course Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="h-4 w-4 text-blue-600" />
                          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                            Credits
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">
                          {course.credits || 0}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="h-4 w-4 text-purple-600" />
                          <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
                            Duration
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-purple-900">
                          {course.course_duration
                            ? `${course.course_duration} months`
                            : "1 semester"}
                        </p>
                      </div>
                    </div>

                    {/* Course Description */}
                    {course.description && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-blue-600" />
                          Course Overview
                        </h4>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          {formatCourseText(course.description).length > 0 ? (
                            <ul className="text-sm text-gray-700 space-y-2">
                              {formatCourseText(course.description)
                                .slice(0, 3)
                                .map((objective, index) => (
                                  <li key={index} className="flex items-start">
                                    <ChevronRight className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="line-clamp-2">
                                      {objective}
                                    </span>
                                  </li>
                                ))}
                              {formatCourseText(course.description).length >
                                3 && (
                                <li className="text-blue-600 text-xs font-medium ml-6">
                                  +
                                  {formatCourseText(course.description).length -
                                    3}{" "}
                                  more objectives...
                                </li>
                              )}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {course.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons - Only show for students */}
                    {user?.role === "student" && (
                      <div className="pt-4 border-t border-gray-200">
                        {isEnrolled ? (
                          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 border border-green-200">
                            <div className="flex items-center justify-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="font-bold text-green-800">
                                Successfully Enrolled
                              </span>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              handleEnrollInCourse(
                                course.course_id || course.id
                              )
                            }
                            disabled={
                              enrolling === (course.course_id || course.id) ||
                              !course.is_active
                            }
                            className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-200 flex items-center justify-center space-x-2 ${
                              course.is_active
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transform hover:-translate-y-1 disabled:from-blue-400 disabled:to-purple-400 disabled:cursor-not-allowed disabled:transform-none"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            {enrolling === (course.course_id || course.id) ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                <span>Enrolling...</span>
                              </>
                            ) : enrollmentSuccess ===
                              (course.course_id || course.id) ? (
                              <>
                                <CheckCircle className="h-5 w-5" />
                                <span>Enrolled Successfully!</span>
                              </>
                            ) : course.is_active ? (
                              <>
                                <Award className="h-5 w-5" />
                                <span>Enroll in Course</span>
                              </>
                            ) : (
                              <>
                                <X className="h-5 w-5" />
                                <span>Course Unavailable</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Enhanced Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-600 flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {(pagination.currentPage - 1) * 10 + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-gray-900">
                    {Math.min(
                      pagination.currentPage * 10,
                      pagination.totalCount
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900">
                    {pagination.totalCount}
                  </span>{" "}
                  courses
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      currentPage: prev.currentPage - 1,
                    }))
                  }
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Previous
                </button>

                <div className="flex items-center space-x-1">
                  {[...Array(Math.min(5, pagination.totalPages))].map(
                    (_, index) => {
                      const pageNum = Math.max(
                        1,
                        Math.min(
                          pagination.currentPage - 2 + index,
                          pagination.totalPages - 4 + index
                        )
                      );
                      if (pageNum > pagination.totalPages) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() =>
                            setPagination((prev) => ({
                              ...prev,
                              currentPage: pageNum,
                            }))
                          }
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            pagination.currentPage === pageNum
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      currentPage: prev.currentPage + 1,
                    }))
                  }
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCoursesPage;
