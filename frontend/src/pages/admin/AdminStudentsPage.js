import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { studentsAPI, coursesAPI } from "../../services/api";
import {
  Plus,
  Search,
  User,
  Filter,
  Download,
  GraduationCap,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Calendar,
  BookOpen,
} from "lucide-react";

const AdminStudentsPage = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]); // Store all students for client-side filtering
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [filters, setFilters] = useState({
    status: "",
  });

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch all students at once for client-side filtering
      console.log("🔍 Fetching all students for client-side filtering");
      const response = await studentsAPI.list({});
      console.log("📊 Students API Response:", response.data);

      const studentsData = response.data.results || response.data || [];
      setAllStudents(studentsData); // Store all students

      // Apply filtering on client-side
      applyFilters(studentsData, searchTerm, filters);
    } catch (error) {
      console.error("❌ Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  }, []); // Remove dependencies to fetch only once

  // Client-side filtering function
  const applyFilters = useCallback((studentsData, search, activeFilters) => {
    let filteredStudents = studentsData;

    // Apply search filter
    if (search && search.trim() !== "") {
      const searchLower = search.toLowerCase();
      filteredStudents = filteredStudents.filter(
        (student) =>
          student.full_name?.toLowerCase().includes(searchLower) ||
          student.student_number?.toLowerCase().includes(searchLower) ||
          student.user_details?.first_name
            ?.toLowerCase()
            .includes(searchLower) ||
          student.user_details?.last_name
            ?.toLowerCase()
            .includes(searchLower) ||
          student.user_details?.email?.toLowerCase().includes(searchLower) ||
          student.email?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (activeFilters.status && activeFilters.status !== "") {
      filteredStudents = filteredStudents.filter(
        (student) => student.status === activeFilters.status
      );
    }

    setStudents(filteredStudents);
  }, []);

  // Handle search change - immediate filtering
  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    applyFilters(allStudents, newSearchTerm, filters);
  };

  // Handle filter change - immediate filtering
  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...filters, [filterKey]: value };
    setFilters(newFilters);
    applyFilters(allStudents, searchTerm, newFilters);
  };

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.list({ is_active: true });
      setCourses(response.data.results || response.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // useEffect for initial data loading and when dependencies change
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateStudent = () => {
    setModalType("create");
    setSelectedStudent(null);
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    setModalType("edit");
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleViewStudent = (student) => {
    setModalType("view");
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleDeleteStudent = (student) => {
    setModalType("delete");
    setSelectedStudent(student);
    setShowModal(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({ status: "" });
    applyFilters(allStudents, "", { status: "" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-4 sm:space-y-6">
        {/* Enhanced Header - Mobile Responsive */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 sm:p-8 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-white rounded-full"></div>
            <div className="absolute top-1/4 right-1/3 w-4 h-4 bg-white rounded-full"></div>
          </div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm w-fit">
                    <User className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                      Students Management
                    </h1>
                    <p className="text-purple-100 text-sm sm:text-base lg:text-lg mt-1">
                      Manage all students in the system • {students.length}{" "}
                      students
                    </p>
                  </div>
                </div>
              </div>

              {user?.role === "admin" && (
                <button
                  onClick={handleCreateStudent}
                  className="group bg-white text-purple-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start"
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-90 transition-transform duration-200" />
                  <span className="text-sm sm:text-base">Create Student</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters - Mobile Responsive */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white shadow-sm"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Students List - Enhanced Table View */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Students ({students.length})
            </h2>

            {students.length === 0 ? (
              <div className="text-center py-12">
                <User className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                  No students found
                </h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto px-4">
                  {searchTerm || filters.status
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by creating your first student"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  {/* Desktop Table View */}
                  <div className="hidden lg:block">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact Info
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {students.map((student) => (
                          <tr
                            key={student.student_id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-12 w-12">
                                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                                    <User className="h-6 w-6 text-purple-600" />
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {student.full_name ||
                                      (student.user_details
                                        ? `${student.user_details.first_name} ${student.user_details.last_name}`
                                        : "Unknown Student")}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ID: {student.student_number}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {student.email ||
                                  student.user_details?.email ||
                                  "No email"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {student.user_details?.phone || "No phone"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  student.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : student.status === "graduated"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {student.status || "active"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleViewStudent(student)}
                                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-full transition-colors"
                                  title="View Student"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleEditStudent(student)}
                                  className="text-green-600 hover:text-green-800 hover:bg-green-50 p-2 rounded-full transition-colors"
                                  title="Edit Student"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteStudent(student)}
                                  className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-full transition-colors"
                                  title="Delete Student"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="lg:hidden space-y-4">
                    {students.map((student) => (
                      <div
                        key={student.student_id}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300"
                      >
                        {/* Student Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-full">
                              <User className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-sm">
                                {student.full_name ||
                                  (student.user_details
                                    ? `${student.user_details.first_name} ${student.user_details.last_name}`
                                    : "Unknown Student")}
                              </h3>
                              <p className="text-xs text-gray-500">
                                ID: {student.student_number}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              student.status === "active"
                                ? "bg-green-100 text-green-800"
                                : student.status === "graduated"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {student.status || "active"}
                          </span>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-1 mb-3">
                          <p className="text-xs text-gray-600">
                            📧{" "}
                            {student.email ||
                              student.user_details?.email ||
                              "No email"}
                          </p>
                          <p className="text-xs text-gray-600">
                            📱 {student.user_details?.phone || "No phone"}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => handleViewStudent(student)}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="text-xs">View</span>
                          </button>
                          <button
                            onClick={() => handleEditStudent(student)}
                            className="flex items-center space-x-1 text-green-600 hover:text-green-800 hover:bg-green-50 px-3 py-2 rounded-lg transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="text-xs">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student)}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="text-xs">Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <StudentModal
          type={modalType}
          student={selectedStudent}
          courses={courses}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchStudents();
          }}
          onEdit={handleEditStudent}
        />
      )}
    </div>
  );
};

// Student Modal Component
const StudentModal = ({
  type,
  student,
  courses,
  onClose,
  onSuccess,
  onEdit,
}) => {
  const [formData, setFormData] = useState({
    username: student?.user?.username || student?.user_details?.username || "",
    email: student?.user?.email || student?.user_details?.email || "",
    first_name:
      student?.user?.first_name || student?.user_details?.first_name || "",
    last_name:
      student?.user?.last_name || student?.user_details?.last_name || "",
    password: "",
    confirm_password: "",
    course:
      student?.course?.course_id || student?.course_details?.course_id || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Update form data when student prop changes (for edit mode)
  useEffect(() => {
    if (student && type === "edit") {
      console.log("🔄 Edit mode - Student data:", student);
      setFormData({
        username:
          student?.user?.username || student?.user_details?.username || "",
        email: student?.user?.email || student?.user_details?.email || "",
        first_name:
          student?.user?.first_name || student?.user_details?.first_name || "",
        last_name:
          student?.user?.last_name || student?.user_details?.last_name || "",
        password: "",
        confirm_password: "",
        course:
          student?.course?.course_id ||
          student?.course_details?.course_id ||
          "",
      });
    }
  }, [student, type]);

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

    // Password validation for edit mode (only if password is being changed)
    if (type === "edit" && formData.password) {
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

    // Phone number validation (if provided)
    if (formData.phone_number && formData.phone_number.length > 0) {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(formData.phone_number.replace(/[\s\-()]/g, ""))) {
        newErrors.phone_number = "Please enter a valid phone number";
      }
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
      } else if (type === "edit") {
        await studentsAPI.update(student.student_id, submitData);
      } else if (type === "delete") {
        await studentsAPI.delete(student.student_id);
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

  if (type === "view") {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Student Details
                  </h3>
                  <p className="text-blue-100 text-sm">
                    Complete student information and enrollment history
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Personal Information */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Personal Information
              </h4>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Full Name
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {student?.full_name ||
                      (student?.user_details
                        ? `${student.user_details.first_name} ${student.user_details.last_name}`
                        : "Not available")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Student ID
                  </p>
                  <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-900">
                    {student?.student_number}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    UUID: {student?.student_id}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Email
                  </p>
                  <p className="text-sm text-gray-900">
                    {student?.email ||
                      student?.user_details?.email ||
                      "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Username
                  </p>
                  <p className="text-sm text-gray-900">
                    {student?.user_details?.username || "Not available"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Phone
                  </p>
                  <p className="text-sm text-gray-900">
                    {student?.user_details?.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Status
                  </p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      student?.status === "active"
                        ? "bg-green-100 text-green-800"
                        : student?.status === "graduated"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {student?.status || "Active"}
                  </span>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <GraduationCap className="h-5 w-5 mr-2 text-green-600" />
                Academic Information
              </h4>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Enrollment Date
                  </p>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-900">
                      {student?.enrollment_date
                        ? new Date(student.enrollment_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : new Date(student?.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          ) || "Not available"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Total Credits
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {student?.total_credits_enrolled || 0} credits enrolled
                  </p>
                </div>
              </div>
            </div>

            {/* Enrolled Courses */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                Enrolled Courses ({student?.active_courses?.length || 0})
              </h4>
              {student?.active_courses && student.active_courses.length > 0 ? (
                <div className="space-y-4">
                  {student.active_courses.map((course, index) => (
                    <div
                      key={index}
                      className="bg-white p-5 rounded-lg border border-gray-200 hover:border-purple-300 transition-all duration-200 hover:shadow-md"
                    >
                      {/* Course Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h5 className="font-bold text-gray-900 text-base mb-1">
                            {course.course_name}
                          </h5>
                          <p className="text-sm font-mono bg-purple-100 text-purple-800 px-3 py-1 rounded-full inline-block">
                            {course.course_code}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            course.is_active
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-gray-100 text-gray-800 border border-gray-200"
                          }`}
                        >
                          {course.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>

                      {/* Course Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                        <div className="bg-blue-50 px-3 py-2 rounded-lg">
                          <p className="text-xs text-blue-600 font-medium">
                            Credits
                          </p>
                          <p className="text-sm font-bold text-blue-800">
                            {course.credits}
                          </p>
                        </div>
                        <div className="bg-green-50 px-3 py-2 rounded-lg">
                          <p className="text-xs text-green-600 font-medium">
                            Duration
                          </p>
                          <p className="text-sm font-bold text-green-800">
                            {course.course_duration} months
                          </p>
                        </div>
                        <div className="bg-orange-50 px-3 py-2 rounded-lg">
                          <p className="text-xs text-orange-600 font-medium">
                            Students Enrolled
                          </p>
                          <p className="text-sm font-bold text-orange-800">
                            {course.enrolled_students_count}
                          </p>
                        </div>
                      </div>

                      {/* Course Description */}
                      {course.description && (
                        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
                          <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                            Course Objectives
                          </p>
                          <div className="text-sm text-gray-700 leading-relaxed">
                            {course.description
                              .split("●")
                              .filter((obj) => obj.trim())
                              .map((objective, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start mb-2 last:mb-0"
                                >
                                  <span className="text-purple-600 mr-2 mt-1 flex-shrink-0">
                                    ●
                                  </span>
                                  <span className="text-gray-700">
                                    {objective.trim()}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <h5 className="text-sm font-medium text-gray-900 mb-1">
                    No Enrolled Courses
                  </h5>
                  <p className="text-xs text-gray-500">
                    This student is not currently enrolled in any courses
                  </p>
                </div>
              )}
            </div>

            {/* Enrollment History */}
            {student?.active_enrollments &&
              student.active_enrollments.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-amber-600" />
                    Enrollment History
                  </h4>
                  <div className="space-y-3">
                    {student.active_enrollments.map((enrollment, index) => (
                      <div
                        key={index}
                        className="bg-white p-3 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {enrollment.course_name} ({enrollment.course_code}
                              )
                            </p>
                            <p className="text-xs text-gray-500">
                              Enrolled:{" "}
                              {new Date(
                                enrollment.enrollment_date
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              enrollment.status === "enrolled"
                                ? "bg-green-100 text-green-800"
                                : enrollment.status === "completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {enrollment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          <div className="border-t border-gray-200 p-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                if (onEdit) {
                  setTimeout(() => onEdit(student), 100);
                }
              }}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors font-medium"
            >
              Edit Student
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (type === "delete") {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">
              Delete Student
            </h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Are you sure you want to delete "{student?.user_details?.first_name}{" "}
            {student?.user_details?.last_name}
            {student?.full_name && !student?.user_details && (
              <span>{student.full_name}</span>
            )}
            "? This action cannot be undone.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {type === "create" ? "Create New Student" : "Edit Student"}
                </h3>
                <p className="text-purple-100 text-sm">
                  {type === "create"
                    ? "Add a new student to the system"
                    : "Update student information"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Display general errors */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-800 text-sm">{errors.general}</p>
              </div>
            </div>
          )}

          {/* User Account Section */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-purple-600" />
              User Account Information
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-1 text-gray-500" />
                    Username *
                  </span>
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm"
                  required
                  placeholder="Enter username"
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.username}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <svg
                      className="h-4 w-4 mr-1 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                    Email *
                  </span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm"
                  required
                  placeholder="student@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-1 text-gray-500" />
                    First Name *
                  </span>
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm"
                  required
                  placeholder="Enter first name"
                />
                {errors.first_name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.first_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-1 text-gray-500" />
                    Last Name *
                  </span>
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm"
                  required
                  placeholder="Enter last name"
                />
                {errors.last_name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.last_name}
                  </p>
                )}
              </div>

              {/* Password fields */}
              {type === "create" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <svg
                          className="h-4 w-4 mr-1 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        Password *
                      </span>
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm"
                      required
                      placeholder="Enter password"
                      minLength={6}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <svg
                          className="h-4 w-4 mr-1 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        Confirm Password *
                      </span>
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm"
                      required
                      placeholder="Confirm password"
                      minLength={6}
                    />
                    {errors.confirm_password && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.confirm_password}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Student Information Section */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
              Student Information
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <GraduationCap className="h-4 w-4 mr-1 text-gray-500" />
                    Course (Optional)
                  </span>
                </label>
                <select
                  value={formData.course}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, course: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white shadow-sm"
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.course_code || course.name} -{" "}
                      {course.course_name || course.name}
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
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : type === "create" ? (
                "Create Student"
              ) : (
                "Update Student"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminStudentsPage;
