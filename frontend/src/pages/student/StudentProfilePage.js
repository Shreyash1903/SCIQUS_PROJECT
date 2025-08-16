import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { authAPI, studentsAPI } from "../../services/api";
import {
  User,
  Mail,
  Phone,
  Edit,
  Save,
  X,
  Lock,
  AlertCircle,
  CheckCircle,
  UserCircle,
  Shield,
  Star,
  Award,
  Sparkles,
  BookOpen,
  Eye,
  EyeOff,
} from "lucide-react";

const StudentProfilePage = () => {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      if (user?.role === "student") {
        // Get student profile
        const response = await studentsAPI.getProfile();
        setProfile(response.data);
        setFormData({
          first_name: response.data.user_details?.first_name || "",
          last_name: response.data.user_details?.last_name || "",
          email: response.data.user_details?.email || "",
          phone: response.data.user_details?.phone || "",
        });
      } else {
        // For admin users, create a profile from user data
        setProfile({
          user: user,
          student_number: null,
          phone: "",
          course: null,
          status: "admin",
        });
        setFormData({
          first_name: user?.first_name || "",
          last_name: user?.last_name || "",
          email: user?.email || "",
          phone: "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setErrors({ general: "Failed to load profile data" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      first_name: profile?.user_details?.first_name || "",
      last_name: profile?.user_details?.last_name || "",
      email: profile?.user_details?.email || "",
      phone: profile?.user_details?.phone || "",
    });
    setErrors({});
  };

  const handleSave = async () => {
    try {
      setErrors({});
      setLoading(true);

      // Always use auth API to update user profile fields
      await authAPI.updateProfile(formData);

      setSuccess("Profile updated successfully!");
      setEditing(false);

      // Refresh profile data
      await fetchProfile();

      // Update auth context if user data changed
      if (
        formData.first_name !== user.first_name ||
        formData.last_name !== user.last_name
      ) {
        const updatedUser = {
          ...user,
          first_name: formData.first_name,
          last_name: formData.last_name,
        };
        login(updatedUser, localStorage.getItem("access_token"));
      }
    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: "Failed to update profile" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      setErrors({});
      setLoading(true);

      // Transform the data to match backend expectations
      const apiPasswordData = {
        old_password: passwordData.current_password,
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password,
      };

      // Debug: Log what we're sending
      console.log(
        "🔍 Frontend: Sending password change data:",
        apiPasswordData
      );
      console.log(
        "🔍 Frontend: Current password length:",
        passwordData.current_password?.length
      );
      console.log(
        "🔍 Frontend: New password length:",
        passwordData.new_password?.length
      );

      await authAPI.changePassword(apiPasswordData);

      setSuccess("Password changed successfully!");
      setChangingPassword(false);
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error("🔍 Frontend: Password change error:", error);
      console.error("🔍 Frontend: Error response:", error.response?.data);
      if (error.response?.data) {
        // Handle specific error format
        const errorData = error.response.data;
        const formattedErrors = {};

        // Convert array errors to string messages
        Object.keys(errorData).forEach((key) => {
          if (Array.isArray(errorData[key])) {
            formattedErrors[key] = errorData[key][0]; // Take first error message
          } else {
            formattedErrors[key] = errorData[key];
          }
        });

        console.log("🔍 Frontend: Formatted errors:", formattedErrors);
        setErrors(formattedErrors);
      } else {
        setErrors({ general: "Failed to change password" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-purple-600"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <UserCircle className="h-12 w-12 text-purple-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto py-4 sm:py-8 px-4 space-y-6 sm:space-y-8">
        {/* Enhanced Header with Gradient Background */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black bg-opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            ></div>
          </div>

          <div className="relative px-4 sm:px-8 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
                {/* Enhanced Profile Picture */}
                <div className="relative group mb-4 sm:mb-0">
                  <div className="h-20 w-20 sm:h-28 sm:w-28 rounded-full bg-white bg-opacity-20 backdrop-blur-sm border-4 border-white border-opacity-30 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-105">
                    <UserCircle className="h-14 w-14 sm:h-20 sm:w-20 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -left-1 h-5 w-5 sm:h-6 sm:w-6 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>

                {/* Profile Info */}
                <div className="sm:ml-8">
                  <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 flex flex-col sm:flex-row items-center">
                    <span className="mb-1 sm:mb-0">
                      {profile?.user_details?.first_name}{" "}
                      {profile?.user_details?.last_name}
                    </span>
                    <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-yellow-300 sm:ml-3 animate-pulse" />
                  </h1>
                  <div className="flex flex-col sm:flex-row items-center sm:space-x-6 mb-3 space-y-2 sm:space-y-0 sm:flex-wrap gap-2">
                    <p className="text-blue-100 text-base sm:text-lg font-semibold flex items-center bg-white bg-opacity-20 px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm">
                      {user?.role === "admin" ? (
                        <>
                          <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                          Administrator
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                          Student
                        </>
                      )}
                    </p>
                    {profile?.student_number && (
                      <p className="text-blue-200 text-sm bg-white bg-opacity-20 px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm border border-white border-opacity-30">
                        ID: {profile.student_number}
                      </p>
                    )}
                  </div>
                  {profile?.status && (
                    <div className="mt-3 flex justify-center sm:justify-start">
                      <span
                        className={`inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm border-2 shadow-lg ${
                          profile?.status === "active"
                            ? "bg-green-500 bg-opacity-90 text-white border-green-300"
                            : "bg-gray-500 bg-opacity-90 text-white border-gray-300"
                        }`}
                      >
                        <Award className="h-4 w-4 mr-2" />
                        {profile.status.charAt(0).toUpperCase() +
                          profile.status.slice(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center sm:justify-end w-full sm:w-auto mt-4 sm:mt-0">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="group bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 sm:px-8 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center backdrop-blur-sm border border-white border-opacity-30 hover:scale-105 shadow-xl hover:shadow-2xl text-sm sm:text-base"
                  >
                    <Edit className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 group-hover:rotate-12 transition-transform" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="group bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center disabled:opacity-50 shadow-xl hover:scale-105 text-sm sm:text-base"
                    >
                      <Save className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:scale-110 transition-transform" />
                      {loading ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="group bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center shadow-xl hover:scale-105 text-sm sm:text-base"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:rotate-90 transition-transform" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mr-2 sm:mr-3 flex-shrink-0" />
              <p className="text-green-800 font-medium text-sm sm:text-base">
                {success}
              </p>
            </div>
          </div>
        )}

        {errors.general && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mr-2 sm:mr-3 flex-shrink-0" />
              <p className="text-red-800 font-medium text-sm sm:text-base">
                {errors.general}
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 sm:px-8 py-4 sm:py-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                  Personal Information
                </h3>
              </div>
              <div className="px-4 sm:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
                {/* First Name */}
                <div className="group">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2 text-purple-500" />
                    First Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          first_name: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  ) : (
                    <p className="text-base sm:text-lg text-gray-800 bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 break-words">
                      {profile?.user_details?.first_name || "Not provided"}
                    </p>
                  )}
                  {errors.first_name && (
                    <p className="text-red-500 text-sm mt-1 flex items-start">
                      <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                      <span>{errors.first_name}</span>
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="group">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2 text-purple-500" />
                    Last Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          last_name: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  ) : (
                    <p className="text-base sm:text-lg text-gray-800 bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 break-words">
                      {profile?.user_details?.last_name || "Not provided"}
                    </p>
                  )}
                  {errors.last_name && (
                    <p className="text-red-500 text-sm mt-1 flex items-start">
                      <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                      <span>{errors.last_name}</span>
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="group">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-purple-500" />
                    Email
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  ) : (
                    <p className="text-base sm:text-lg text-gray-800 bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 break-all">
                      {profile?.user_details?.email || "Not provided"}
                    </p>
                  )}
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-start">
                      <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="group">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-purple-500" />
                    Phone Number
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  ) : (
                    <p className="text-base sm:text-lg text-gray-800 bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 break-words">
                      {profile?.user_details?.phone || "Not provided"}
                    </p>
                  )}
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-start">
                      <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Academic Information (for students) */}
            {user?.role === "student" && (
              <div className="bg-white shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 px-4 sm:px-6 py-3 sm:py-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Academic Info
                  </h3>
                </div>
                <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">
                      Student Number
                    </p>
                    <p className="text-base sm:text-lg text-gray-800 font-mono bg-gray-50 px-3 py-2 rounded-lg break-all">
                      {profile?.student_number || "Not assigned"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-2">
                      Status
                    </p>
                    <span
                      className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold ${
                        profile?.status === "active"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : profile?.status === "graduated"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : profile?.status === "admin"
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      <Award className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="break-words">
                        {profile?.status || "Unknown"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Security */}
            <div className="bg-white shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 px-4 sm:px-6 py-3 sm:py-4">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Security
                </h3>
              </div>
              <div className="px-4 sm:px-6 py-4 sm:py-6">
                {!changingPassword ? (
                  <button
                    onClick={() => setChangingPassword(true)}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-2.5 sm:py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
                  >
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Change Password
                  </button>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.current_password}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              current_password: e.target.value,
                            }))
                          }
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                          ) : (
                            <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                          )}
                        </button>
                      </div>
                      {errors.current_password && (
                        <p className="text-red-500 text-sm mt-1 flex items-start">
                          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                          <span>{errors.current_password}</span>
                        </p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.new_password}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              new_password: e.target.value,
                            }))
                          }
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                          ) : (
                            <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                          )}
                        </button>
                      </div>
                      {errors.new_password && (
                        <p className="text-red-500 text-sm mt-1 flex items-start">
                          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                          <span>{errors.new_password}</span>
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirm_password}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            confirm_password: e.target.value,
                          }))
                        }
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      />
                      {errors.confirm_password && (
                        <p className="text-red-500 text-sm mt-1 flex items-start">
                          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                          <span>{errors.confirm_password}</span>
                        </p>
                      )}
                    </div>

                    {/* Password Change Actions */}
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
                      <button
                        onClick={() => setChangingPassword(false)}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center text-sm sm:text-base"
                      >
                        <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Cancel
                      </button>
                      <button
                        onClick={handlePasswordChange}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center disabled:opacity-50 text-sm sm:text-base"
                        disabled={loading}
                      >
                        <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {loading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
