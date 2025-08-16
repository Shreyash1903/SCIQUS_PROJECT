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
  Camera,
  BookOpen,
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
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setErrors({});
    setSuccess("");
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

      if (passwordData.new_password !== passwordData.confirm_password) {
        setErrors({ confirm_password: "Passwords do not match" });
        return;
      }

      setLoading(true);
      await authAPI.changePassword(passwordData);

      setSuccess("Password changed successfully!");
      setChangingPassword(false);
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ password: "Failed to change password" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Enhanced Header with Gradient Background */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 shadow-xl rounded-2xl overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black bg-opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        <div className="relative px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Enhanced Profile Picture */}
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-white bg-opacity-20 backdrop-blur-sm border-4 border-white border-opacity-30 flex items-center justify-center shadow-2xl">
                  <UserCircle className="h-16 w-16 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-yellow-400 rounded-full flex items-center justify-center border-3 border-white shadow-lg">
                  <Star className="h-4 w-4 text-yellow-800" />
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="ml-6">
                <h1 className="text-3xl font-bold text-white mb-1 flex items-center">
                  {profile?.user_details?.first_name} {profile?.user_details?.last_name}
                  <Sparkles className="h-6 w-6 text-yellow-300 ml-2" />
                </h1>
                <div className="flex items-center space-x-4">
                  <p className="text-blue-100 text-lg font-medium flex items-center">
                    {user?.role === "admin" ? (
                      <>
                        <Shield className="h-4 w-4 mr-1" />
                        Administrator
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-4 w-4 mr-1" />
                        Student
                      </>
                    )}
                  </p>
                  {profile?.student_number && (
                    <p className="text-blue-200 text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full backdrop-blur-sm">
                      ID: {profile.student_number}
                    </p>
                  )}
                </div>
                {profile?.status && (
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${
                      profile?.status === "active"
                        ? "bg-green-500 bg-opacity-80 text-white"
                        : "bg-gray-500 bg-opacity-80 text-white"
                    }`}>
                      <Award className="h-3 w-3 mr-1" />
                      {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 flex items-center backdrop-blur-sm border border-white border-opacity-30 hover:scale-105 shadow-lg"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center disabled:opacity-50 shadow-lg hover:scale-105"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center shadow-lg hover:scale-105"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </button>
                </div>
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
            <button
              onClick={() => setSuccess("")}
              className="ml-auto text-green-400 hover:text-green-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                {errors.general}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Personal Information */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Personal Information
              </h3>
            </div>
            <div className="px-6 py-4 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
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
                      className="input-field"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">
                      {profile?.user?.first_name || "Not provided"}
                    </p>
                  )}
                  {errors.first_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.first_name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
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
                      className="input-field"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">
                      {profile?.user?.last_name || "Not provided"}
                    </p>
                  )}
                  {errors.last_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.last_name}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
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
                      className="input-field"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">
                      {profile?.user?.email || "Not provided"}
                    </p>
                  )}
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-1" />
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
                      className="input-field"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">
                      {profile?.user_details?.phone || "Not provided"}
                    </p>
                  )}
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Academic Information (for students) */}
          {user?.role === "student" && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Academic Information
                </h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Student Number
                  </p>
                  <p className="text-sm text-gray-900">
                    {profile?.student_number || "Not assigned"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      profile?.status === "active"
                        ? "bg-green-100 text-green-800"
                        : profile?.status === "graduated"
                        ? "bg-blue-100 text-blue-800"
                        : profile?.status === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {profile?.status || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Security */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Security</h3>
            </div>
            <div className="px-6 py-4">
              {!changingPassword ? (
                <button
                  onClick={() => setChangingPassword(true)}
                  className="btn-secondary w-full flex items-center justify-center"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.current_password}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          current_password: e.target.value,
                        }))
                      }
                      className="input-field"
                    />
                    {errors.current_password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.current_password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.new_password}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          new_password: e.target.value,
                        }))
                      }
                      className="input-field"
                    />
                    {errors.new_password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.new_password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
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
                      className="input-field"
                    />
                    {errors.confirm_password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.confirm_password}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setChangingPassword(false);
                        setPasswordData({
                          current_password: "",
                          new_password: "",
                          confirm_password: "",
                        });
                        setErrors({});
                      }}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePasswordChange}
                      className="btn-primary flex-1"
                      disabled={loading}
                    >
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
  );
};

export default StudentProfilePage;
