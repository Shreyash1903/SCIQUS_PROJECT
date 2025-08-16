import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { studentsAPI, coursesAPI } from "../services/api";
import {
  Plus,
  Search,
  User,
  Filter,
  Download,
  GraduationCap,
  AlertCircle,
} from "lucide-react";

const StudentsPage = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create"); // 'create', 'edit', 'delete', 'view'
  const [filters, setFilters] = useState({
    status: "",
    course: "",
    enrollment_year: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, [searchTerm, filters, pagination.currentPage]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        search: searchTerm,
        ...filters,
      };

      console.log("🔍 Fetching students with params:", params);
      const response = await studentsAPI.list(params);
      console.log("📊 Students API Response:", response.data);
      console.log(
        "📋 First student data structure:",
        response.data.results?.[0]
      );

      setStudents(response.data.results || response.data || []);

      if (response.data.count) {
        setPagination((prev) => ({
          ...prev,
          totalCount: response.data.count,
          totalPages: Math.ceil(response.data.count / 10),
        }));
      }
    } catch (error) {
      console.error("❌ Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.list({ is_active: true });
      setCourses(response.data.results || response.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

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

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      graduated: "bg-blue-100 text-blue-800",
      suspended: "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const filteredStudents = students.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.user_details?.first_name?.toLowerCase().includes(searchLower) ||
      student.user_details?.last_name?.toLowerCase().includes(searchLower) ||
      student.user_details?.email?.toLowerCase().includes(searchLower) ||
      student.full_name?.toLowerCase().includes(searchLower) ||
      student.email?.toLowerCase().includes(searchLower) ||
      student.student_number?.toLowerCase().includes(searchLower) ||
      student.phone_number?.includes(searchTerm) ||
      student.course_details?.course_code
        ?.toLowerCase()
        .includes(searchLower) ||
      student.course_details?.course_name?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Students Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all students in the system
          </p>
        </div>
        {user?.role === "admin" && (
          <button
            onClick={handleCreateStudent}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            className="input-field"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="graduated">Graduated</option>
            <option value="suspended">Suspended</option>
          </select>

          {/* Course Filter */}
          <select
            value={filters.course}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, course: e.target.value }))
            }
            className="input-field"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.course_id} value={course.course_id}>
                {course.course_code} - {course.course_name}
              </option>
            ))}
          </select>

          {/* Actions */}
          <div className="flex space-x-2">
            <button className="btn-secondary flex items-center flex-1">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            {user?.role === "admin" && (
              <button className="btn-secondary flex items-center">
                <Download className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enrollment Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.student_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {student.user_details?.first_name}{" "}
                        {student.user_details?.last_name}
                        {student.full_name && !student.user_details && (
                          <span>{student.full_name}</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.user_details?.email || student.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.student_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.course_details ? (
                    <div>
                      <div className="font-medium">
                        {student.course_details.course_code}
                      </div>
                      <div className="text-gray-500">
                        {student.course_details.course_name}
                      </div>
                    </div>
                  ) : student.course ? (
                    <div>
                      <div className="font-medium">
                        {student.course.course_code}
                      </div>
                      <div className="text-gray-500">
                        {student.course.course_name || student.course.title}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">Not enrolled</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      student.status
                    )}`}
                  >
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.enrollment_date
                    ? new Date(student.enrollment_date).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleViewStudent(student)}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    View
                  </button>
                  {user?.role === "admin" && (
                    <>
                      <button
                        onClick={() => handleEditStudent(student)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && !loading && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No students found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Try adjusting your search criteria"
              : "Get started by adding a new student"}
          </p>
          {user?.role === "admin" && !searchTerm && (
            <div className="mt-6">
              <button onClick={handleCreateStudent} className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </button>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage - 1,
                }))
              }
              disabled={pagination.currentPage === 1}
              className="btn-secondary"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage + 1,
                }))
              }
              disabled={pagination.currentPage === pagination.totalPages}
              className="btn-secondary"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page {pagination.currentPage} of {pagination.totalPages}
                ({pagination.totalCount} total students)
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, currentPage: page }))
                    }
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === pagination.currentPage
                        ? "z-10 bg-primary-50 border-primary-500 text-primary-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

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
        />
      )}
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
        phone_number: student?.phone_number || "",
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
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Student Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Debug - log student object */}
            {console.log("🔍 Student object in view:", student)}

            {/* Personal Information */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-sm text-gray-900">
                    {student?.user_details?.first_name}{" "}
                    {student?.user_details?.last_name}
                    {student?.full_name && !student?.user_details && (
                      <span>{student.full_name}</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">
                    {student?.user_details?.email || student?.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Username</p>
                  <p className="text-sm text-gray-900">
                    {student?.user_details?.username ||
                      student?.username ||
                      "Not available"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-sm text-gray-900">
                    {student?.phone_number || student?.phone || "Not provided"}
                  </p>
                  {/* Debug info - remove this after testing */}
                  <p className="text-xs text-gray-400 mt-1">
                    Debug: phone_number={student?.phone_number}, phone=
                    {student?.phone}
                  </p>
                </div>
                {/* Only show Student Number if it exists */}
                {student?.student_number && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Student Number
                    </p>
                    <p className="text-sm text-gray-900">
                      {student.student_number}
                    </p>
                  </div>
                )}
                {/* Only show Date of Birth if it exists */}
                {student?.date_of_birth && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Date of Birth
                    </p>
                    <p className="text-sm text-gray-900">
                      {new Date(student.date_of_birth).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {/* Only show Status if it exists */}
                {student?.status && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student?.status === "active"
                          ? "bg-green-100 text-green-800"
                          : student?.status === "graduated"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {student.status}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">
                Academic Information
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Course</p>
                  <p className="text-sm text-gray-900">
                    {student?.course_details
                      ? `${student.course_details.course_code} - ${student.course_details.course_name}`
                      : student?.course
                      ? `${student.course.course_code} - ${
                          student.course.course_name || student.course.title
                        }`
                      : "Not enrolled"}
                  </p>
                </div>
                {/* Only show Enrollment Date if it exists */}
                {student?.enrollment_date && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Enrollment Date
                    </p>
                    <p className="text-sm text-gray-900">
                      {new Date(student.enrollment_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button onClick={onClose} className="btn-secondary">
              Close
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
      <div className="bg-white rounded-lg p-8 max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-semibold text-gray-900">
            {type === "create" ? "Create New Student" : "Edit Student"}
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

              {type === "create" && (
                <>
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
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password}
                      </p>
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
                </>
              )}

              {type === "edit" && (
                <div className="md:col-span-2">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Leave password fields empty to keep
                      the current password unchanged.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password (Optional)
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
                        placeholder="Enter new password"
                        minLength={6}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
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
                        placeholder="Confirm new password"
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
              )}
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
              {loading
                ? "Creating..."
                : type === "create"
                ? "Create Student"
                : "Update Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentsPage;
