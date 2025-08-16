import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { coursesAPI } from "../../services/api";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  BookOpen,
  Filter,
  X,
  GraduationCap,
  CheckCircle,
  Clock,
  Star,
  ChevronRight,
  ChevronLeft,
  Eye,
  Globe,
  FileText,
  AlertCircle,
} from "lucide-react";

const AdminCoursesPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create"); // 'create', 'edit', 'delete'
  const [filters, setFilters] = useState({
    is_active: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });

  useEffect(() => {
    console.log("🚀 AdminCoursesPage mounted - Current user:", user);
    fetchCourses();
  }, [searchTerm, filters, pagination.currentPage]);

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
      console.log(
        "📋 First course data structure:",
        response.data.results?.[0]
      );
      console.log(
        "🔢 Number of courses received:",
        response.data.results?.length || 0
      );
      console.log("👤 Current user role:", user?.role);
      console.log("🏷️ Is staff:", user?.is_staff);
      console.log("📦 Raw response data:", response.data);

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

  const handleCreateCourse = () => {
    setModalType("create");
    setSelectedCourse(null);
    setShowModal(true);
  };

  const handleEditCourse = (course) => {
    setModalType("edit");
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleDeleteCourse = (course) => {
    setModalType("delete");
    setSelectedCourse(course);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
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
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm w-fit">
                    <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                      Course Management
                    </h1>
                    <p className="text-blue-100 text-sm sm:text-base lg:text-lg mt-1">
                      Manage your academic catalog • {pagination.totalCount}{" "}
                      courses total
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCreateCourse}
                className="group bg-white text-blue-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-90 transition-transform duration-200" />
                <span className="text-sm sm:text-base">Add New Course</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100">
          <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:gap-6">
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-xl p-2">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                <select
                  value={filters.is_active}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      is_active: e.target.value,
                    }))
                  }
                  className="bg-transparent border-none focus:ring-0 text-gray-700 font-medium cursor-pointer text-sm sm:text-base"
                >
                  <option value="">All Courses</option>
                  <option value="true">Active Only</option>
                  <option value="false">Inactive Only</option>
                </select>
              </div>

              {(searchTerm || filters.is_active) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({ is_active: "" });
                  }}
                  className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                >
                  <X className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                  <span className="font-medium text-sm sm:text-base">
                    Clear
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Empty State - Mobile Responsive */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-16 text-center border border-gray-100">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <BookOpen className="h-8 w-8 sm:h-12 sm:w-12 text-blue-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                {searchTerm || filters.is_active
                  ? "No Matching Courses"
                  : "No Courses Available"}
              </h3>
              <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                {searchTerm || filters.is_active
                  ? "Try adjusting your search criteria or browse all courses"
                  : "Get started by creating your first course to build your academic catalog"}
              </p>
              <button
                onClick={handleCreateCourse}
                className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-sm sm:text-base"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Create Your First Course
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {courses.map((course) => (
              <div
                key={course.course_id || course.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-200 overflow-hidden transform hover:-translate-y-2"
              >
                {/* Course Header with Gradient - Mobile Optimized */}
                <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-white rounded-full"></div>
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-full"></div>
                  </div>

                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start space-y-3 sm:space-y-0 mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold leading-tight line-clamp-2">
                            {course.course_name}
                          </h3>
                        </div>

                        <div className="flex items-center space-x-3 mb-3">
                          <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                            {course.course_code}
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              course.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${
                                course.is_active ? "bg-green-400" : "bg-red-400"
                              }`}
                            ></div>
                            {course.is_active ? "Active" : "Inactive"}
                          </span>
                          <span className="text-white/80 text-sm flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {course.enrolled_students_count || 0} students
                          </span>
                        </div>
                      </div>

                      {/* Desktop Action Buttons */}
                      <div className="hidden sm:flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm"
                          title="Edit Course"
                        >
                          <Edit className="h-4 w-4 text-white" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors backdrop-blur-sm"
                          title="Delete Course"
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </button>
                      </div>

                      {/* Mobile Action Buttons */}
                      <div className="flex sm:hidden space-x-2 w-full">
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm"
                        >
                          <Edit className="h-4 w-4 text-white" />
                          <span className="text-sm font-medium">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course)}
                          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors backdrop-blur-sm"
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                          <span className="text-sm font-medium">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Content - Mobile Optimized */}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 rounded-xl border border-blue-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                          Credits
                        </span>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-blue-900">
                        {course.credits || 0}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 sm:p-4 rounded-xl border border-purple-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                        <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
                          Duration
                        </span>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-purple-900">
                        {course.course_duration
                          ? `${course.course_duration} months`
                          : "1 sem"}
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
                      <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
                        {formatCourseText(course.description).length > 0 ? (
                          <ul className="text-sm text-gray-700 space-y-2">
                            {formatCourseText(course.description)
                              .slice(0, window.innerWidth < 640 ? 2 : 3)
                              .map((objective, index) => (
                                <li key={index} className="flex items-start">
                                  <ChevronRight className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                                  <span className="line-clamp-2">
                                    {objective}
                                  </span>
                                </li>
                              ))}
                            {formatCourseText(course.description).length >
                              (window.innerWidth < 640 ? 2 : 3) && (
                              <li className="text-blue-600 text-xs font-medium ml-6">
                                +
                                {formatCourseText(course.description).length -
                                  (window.innerWidth < 640 ? 2 : 3)}{" "}
                                more objectives...
                              </li>
                            )}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 sm:line-clamp-none">
                            {course.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Instructor Info */}
                  {course.instructor && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-500 font-medium">
                            Instructor
                          </p>
                          <p className="font-semibold text-gray-900 truncate">
                            {course.instructor.first_name}{" "}
                            {course.instructor.last_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Pagination - Mobile Responsive */}
        {pagination.totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="text-xs sm:text-sm text-gray-600 flex items-center space-x-2 order-2 sm:order-1">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
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

              <div className="flex items-center space-x-2 sm:space-x-3 order-1 sm:order-2">
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      currentPage: prev.currentPage - 1,
                    }))
                  }
                  disabled={pagination.currentPage === 1}
                  className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                >
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden sm:inline">Previous</span>
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
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 ${
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
                  className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Modal - Mobile Responsive */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-4xl w-full mx-auto transform transition-all max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl z-10 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-3 rounded-full ${
                        modalType === "delete" ? "bg-red-100" : "bg-blue-100"
                      }`}
                    >
                      {modalType === "delete" ? (
                        <Trash2 className="h-6 w-6 text-red-600" />
                      ) : modalType === "edit" ? (
                        <Edit className="h-6 w-6 text-blue-600" />
                      ) : (
                        <Plus className="h-6 w-6 text-blue-600" />
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {modalType === "create" && "Create New Course"}
                      {modalType === "edit" && "Edit Course"}
                      {modalType === "delete" && "Delete Course"}
                    </h3>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {modalType === "delete" ? (
                  <div className="space-y-6">
                    <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                      <p className="text-sm text-red-800 leading-relaxed">
                        Are you sure you want to delete "
                        {selectedCourse?.course_name}"? This action cannot be
                        undone and will remove all associated data.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                      <button
                        onClick={closeModal}
                        className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            await coursesAPI.delete(selectedCourse.course_id);
                            closeModal();
                            fetchCourses(); // Refresh courses list
                          } catch (error) {
                            console.error("Error deleting course:", error);
                          }
                        }}
                        className="flex-1 px-4 py-3 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors duration-200"
                      >
                        Delete Course
                      </button>
                    </div>
                  </div>
                ) : (
                  <CourseFormModal
                    modalType={modalType}
                    selectedCourse={selectedCourse}
                    onClose={closeModal}
                    onSuccess={() => {
                      closeModal();
                      fetchCourses(); // Refresh courses list
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Course Form Modal Component
const CourseFormModal = ({ modalType, selectedCourse, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    course_name: selectedCourse?.course_name || "",
    course_code: selectedCourse?.course_code || "",
    description: selectedCourse?.description || "",
    course_duration: selectedCourse?.course_duration || "",
    credits: selectedCourse?.credits || "",
    is_active: selectedCourse?.is_active ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (modalType === "create") {
        await coursesAPI.create(formData);
      } else if (modalType === "edit") {
        await coursesAPI.update(selectedCourse.course_id, formData);
      } else if (modalType === "delete") {
        await coursesAPI.delete(selectedCourse.course_id);
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

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Name and Code Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center">
              <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm"
              placeholder="Enter course name"
              required
            />
            {errors.course_name && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.course_name}
              </p>
            )}
          </div>

          <div>
            <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center">
              <GraduationCap className="h-4 w-4 mr-2 text-blue-600" />
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm"
              placeholder="e.g., CS101"
              required
            />
            {errors.course_code && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.course_code}
              </p>
            )}
          </div>
        </div>

        {/* Description Field */}
        <div>
          <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center">
            <FileText className="h-4 w-4 mr-2 text-blue-600" />
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
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm resize-none"
            placeholder="Enter course description and objectives..."
          />
        </div>

        {/* Credits and Duration Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center">
              <Star className="h-4 w-4 mr-2 text-blue-600" />
              Credits *
            </label>
            <input
              type="number"
              value={formData.credits}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, credits: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 shadow-sm"
              min="1"
              max="10"
              placeholder="Credits"
              required
            />
            {errors.credits && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.credits}
              </p>
            )}
          </div>

          <div>
            <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center">
              <Clock className="h-4 w-4 mr-2 text-blue-600" />
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 shadow-sm"
              min="1"
              max="72"
              placeholder="Duration in months"
              required
            />
            {errors.course_duration && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.course_duration}
              </p>
            )}
          </div>
        </div>

        {/* Active Course Checkbox */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_active: e.target.checked,
                }))
              }
              className="h-5 w-5 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-3 text-sm font-medium text-gray-700 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              Active Course
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-2 ml-8">
            Active courses will be visible to students for enrollment
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Saving...
              </div>
            ) : modalType === "create" ? (
              <div className="flex items-center justify-center">
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Edit className="h-4 w-4 mr-2" />
                Update Course
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCoursesPage;
