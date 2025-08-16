import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { coursesAPI, studentsAPI } from "../../services/api";
import {
  Search,
  Filter,
  Users,
  BookOpen,
  Eye,
  Mail,
  Phone,
  Calendar,
  BarChart3,
  User,
  X,
  Award,
} from "lucide-react";

const AdminEnrolledStudentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [enrollmentStats, setEnrollmentStats] = useState({
    totalEnrollments: 0,
    activeCourses: 0,
    totalStudents: 0,
  });

  useEffect(() => {
    fetchEnrollments();
    fetchCourses();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const studentsResponse = await studentsAPI.list({});
      const studentsData =
        studentsResponse.data.results || studentsResponse.data || [];

      console.log("📚 Students data:", studentsData);

      // Process enrollment data
      const enrollmentData = [];
      studentsData.forEach((student) => {
        if (student.active_courses && student.active_courses.length > 0) {
          student.active_courses.forEach((course) => {
            enrollmentData.push({
              enrollmentId: `${student.student_id}_${course.course_id}`,
              student: {
                id: student.student_id,
                studentNumber: student.student_number,
                name:
                  student.full_name ||
                  (student.user_details
                    ? `${student.user_details.first_name} ${student.user_details.last_name}`
                    : "Unknown Student"),
                email:
                  student.email || student.user_details?.email || "No email",
                phone: student.user_details?.phone || "No phone",
                status: student.status || "active",
                enrollmentDate: student.enrollment_date || student.created_at,
              },
              course: {
                id: course.course_id,
                code: course.course_code,
                name: course.course_name,
                credits: course.credits,
                duration: course.course_duration,
                status: course.is_active ? "Active" : "Inactive",
              },
            });
          });
        }
      });

      setEnrollments(enrollmentData);

      // Calculate stats
      const uniqueStudents = new Set(enrollmentData.map((e) => e.student.id))
        .size;
      const uniqueCourses = new Set(enrollmentData.map((e) => e.course.id))
        .size;

      setEnrollmentStats({
        totalEnrollments: enrollmentData.length,
        activeCourses: uniqueCourses,
        totalStudents: uniqueStudents,
      });
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.list({});
      setCourses(response.data.results || response.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleViewStudent = (enrollment) => {
    setSelectedStudent(enrollment);
    setShowModal(true);
  };

  // Filter enrollments
  const filteredEnrollments = enrollments.filter((enrollment) => {
    const matchesSearch =
      searchTerm === "" ||
      enrollment.student.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      enrollment.student.studentNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      enrollment.course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.course.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse =
      selectedCourse === "" || enrollment.course.id === selectedCourse;

    return matchesSearch && matchesCourse;
  });

  // Group enrollments by course for better visualization
  const enrollmentsByCourse = filteredEnrollments.reduce((acc, enrollment) => {
    const courseId = enrollment.course.id;
    if (!acc[courseId]) {
      acc[courseId] = {
        course: enrollment.course,
        students: [],
      };
    }
    acc[courseId].students.push(enrollment.student);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-purple-600"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Users className="h-12 w-12 text-purple-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Enhanced Mobile-First Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center justify-center sm:justify-start">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 text-purple-600" />
                Enrolled Students
              </h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600 px-2 sm:px-0">
                Manage and view all student enrollments across courses
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile-Responsive Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Total Enrollments
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {enrollmentStats.totalEnrollments}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-green-100 rounded-full">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Active Courses
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {enrollmentStats.activeCourses}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Enrolled Students
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {enrollmentStats.totalStudents}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile-Responsive Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <input
                type="text"
                placeholder="Search students or courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              />
            </div>

            {/* Course Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 appearance-none bg-white text-sm sm:text-base"
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option
                    key={course.course_id || course.id}
                    value={course.course_id || course.id}
                  >
                    {course.course_name} ({course.course_code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedCourse) && (
            <div className="mt-4 flex justify-center sm:justify-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCourse("");
                }}
                className="flex items-center space-x-2 px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                <X className="h-4 w-4" />
                <span>Clear Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Enhanced Mobile-Responsive Enrollments by Course */}
        <div className="space-y-4 sm:space-y-6">
          {Object.entries(enrollmentsByCourse).length > 0 ? (
            Object.entries(enrollmentsByCourse).map(
              ([courseId, { course, students }]) => (
                <div
                  key={courseId}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                >
                  {/* Enhanced Mobile-Responsive Course Header */}
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-4 sm:px-6 sm:py-4">
                    <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-white text-center sm:text-left">
                          {course.name}
                        </h3>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-purple-100 text-xs sm:text-sm mt-2">
                          <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs sm:text-sm">
                            {course.code}
                          </span>
                          <span className="hidden sm:inline">•</span>
                          <span>{course.credits} Credits</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{course.duration} Months</span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              course.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {course.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-center sm:text-right">
                        <div className="bg-white bg-opacity-20 px-3 py-2 sm:px-4 sm:py-2 rounded-lg inline-block">
                          <p className="text-white text-xs sm:text-sm">
                            Enrolled Students
                          </p>
                          <p className="text-xl sm:text-2xl font-bold text-white">
                            {students.length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Mobile-Responsive Students List */}
                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                      {students.map((student, index) => (
                        <div
                          key={`${student.id}_${index}`}
                          className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <User className="h-4 w-4 text-purple-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-semibold text-gray-900 text-sm truncate">
                                    {student.name}
                                  </h4>
                                  <p className="text-xs text-gray-500 truncate">
                                    ID: {student.studentNumber}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-1 text-xs text-gray-600">
                                <div className="flex items-center min-w-0">
                                  <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                                  <span className="truncate">
                                    {student.email}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                                  <span className="truncate">
                                    {student.phone}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                                  <span className="text-xs">
                                    Enrolled:{" "}
                                    {new Date(
                                      student.enrollmentDate
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-2">
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    student.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : student.status === "graduated"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  <Award className="h-3 w-3 mr-1" />
                                  {student.status
                                    ? student.status.charAt(0).toUpperCase() +
                                      student.status.slice(1)
                                    : "Active"}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() =>
                                handleViewStudent({ student, course })
                              }
                              className="opacity-100 sm:opacity-0 group-hover:opacity-100 p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-full transition-all duration-200 flex-shrink-0"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 sm:p-12 text-center">
              <div className="max-w-md mx-auto">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Enrollments Found
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {searchTerm || selectedCourse
                    ? "Try adjusting your search or filter criteria"
                    : "No students have enrolled in any courses yet"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Mobile-Responsive Student Detail Modal */}
        {showModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-full sm:max-w-2xl w-full mx-2 sm:mx-4 max-h-[95vh] sm:max-h-screen overflow-y-auto">
              {/* Mobile-Optimized Modal Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-4 sm:px-6 sm:py-4 flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Student Enrollment Details
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile-Responsive Modal Content */}
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Student Info - Mobile Grid */}
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center justify-center sm:justify-start">
                    <User className="h-5 w-5 mr-2 text-purple-600" />
                    Student Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                    <div className="text-center sm:text-left">
                      <p className="text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">
                        {selectedStudent.student.name}
                      </p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-gray-500">Student ID</p>
                      <p className="font-medium text-gray-900">
                        {selectedStudent.student.studentNumber}
                      </p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium text-gray-900 break-all sm:break-normal">
                        {selectedStudent.student.email}
                      </p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">
                        {selectedStudent.student.phone}
                      </p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-gray-500">Status</p>
                      <div className="flex justify-center sm:justify-start">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            selectedStudent.student.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedStudent.student.status
                            ? selectedStudent.student.status
                                .charAt(0)
                                .toUpperCase() +
                              selectedStudent.student.status.slice(1)
                            : "Active"}
                        </span>
                      </div>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-gray-500">Enrollment Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(
                          selectedStudent.student.enrollmentDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Course Info - Mobile Grid */}
                <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center justify-center sm:justify-start">
                    <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                    Course Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                    <div className="text-center sm:text-left">
                      <p className="text-gray-500">Course Name</p>
                      <p className="font-medium text-gray-900">
                        {selectedStudent.course.name}
                      </p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-gray-500">Course Code</p>
                      <p className="font-medium text-gray-900">
                        {selectedStudent.course.code}
                      </p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-gray-500">Credits</p>
                      <p className="font-medium text-gray-900">
                        {selectedStudent.course.credits}
                      </p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-gray-500">Duration</p>
                      <p className="font-medium text-gray-900">
                        {selectedStudent.course.duration} Months
                      </p>
                    </div>
                    <div className="text-center sm:text-left sm:col-span-2">
                      <p className="text-gray-500">Course Status</p>
                      <div className="flex justify-center sm:justify-start">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            selectedStudent.course.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedStudent.course.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEnrolledStudentsPage;
