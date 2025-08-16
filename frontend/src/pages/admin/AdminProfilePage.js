import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";
import {
  User,
  Mail,
  Phone,
  Lock,
  AlertCircle,
  CheckCircle,
  Shield,
  X,
  Edit,
  Save,
} from "lucide-react";

const AdminProfilePage = () => {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
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

      // Fetch actual profile data from the API
      const response = await authAPI.getProfile();
      const userData = response.data;

      // Set profile with actual API data
      setProfile({
        user: userData,
        phone_number: userData.phone || "",
        department: "Administration",
        role: "Administrator",
        permissions: [
          "manage_courses",
          "manage_students",
          "view_reports",
          "system_settings",
        ],
      });

      // Initialize form data
      setFormData({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
      });
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
      first_name: profile?.user?.first_name || "",
      last_name: profile?.user?.last_name || "",
      email: profile?.user?.email || "",
      phone: profile?.user?.phone || "",
    });
    setErrors({});
  };

  const handleSave = async () => {
    try {
      setErrors({});
      setLoading(true);

      // Update via auth API
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

      // Transform the data to match backend expectations
      const apiPasswordData = {
        old_password: passwordData.current_password,
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password,
      };

      await authAPI.changePassword(apiPasswordData);

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Enhanced Header with Mobile Optimization */}
        <div className="relative overflow-hidden bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 opacity-90"></div>
          <div className="relative px-4 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative">
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center shadow-2xl">
                  <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-emerald-400 rounded-full border-3 border-white flex items-center justify-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>

              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {profile?.user?.first_name} {profile?.user?.last_name}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white backdrop-blur-sm">
                    <Shield className="w-3 h-3 mr-1" />
                    Administrator
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white backdrop-blur-sm">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-1.5 animate-pulse"></div>
                    Active
                  </span>
                </div>
              </div>

              {/* Edit Profile Buttons */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                {!editing ? (
                  <button
                    onClick={handleEdit}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-sm border border-white border-opacity-30 hover:border-opacity-50 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-3 w-full sm:w-auto">
                    <button
                      onClick={handleCancel}
                      className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-sm border border-white border-opacity-30 hover:border-opacity-50 flex-1 sm:flex-none"
                    >
                      <X className="h-4 w-4" />
                      <span className="hidden sm:inline">Cancel</span>
                    </button>
                    <button
                      onClick={handleSave}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 flex-1 sm:flex-none"
                      disabled={loading}
                    >
                      <Save className="h-4 w-4" />
                      <span>{loading ? "Saving..." : "Save"}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4 sm:p-6 shadow-lg animate-in slide-in-from-top duration-300">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-emerald-800">
                  Success!
                </h3>
                <p className="text-sm text-emerald-700 mt-1">{success}</p>
              </div>
              <button
                onClick={() => setSuccess("")}
                className="ml-3 text-emerald-400 hover:text-emerald-600 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Error Messages */}
        {errors.general && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 sm:p-6 shadow-lg animate-in slide-in-from-top duration-300">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{errors.general}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Layout with Mobile Optimization */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Enhanced Personal Information Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-4 sm:px-6 sm:py-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Personal Information
                  </h3>
                </div>
              </div>

              <div className="px-4 py-6 sm:px-6 sm:py-8 space-y-6">
                {/* Name Fields - Mobile Responsive */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center mr-2">
                        <User className="h-3 w-3 text-blue-600" />
                      </div>
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter first name"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {profile?.user?.first_name || "Not provided"}
                        </p>
                      </div>
                    )}
                    {errors.first_name && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.first_name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center mr-2">
                        <User className="h-3 w-3 text-blue-600" />
                      </div>
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter last name"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {profile?.user?.last_name || "Not provided"}
                        </p>
                      </div>
                    )}
                    {errors.last_name && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.last_name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email and Phone Fields - Mobile Responsive */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center mr-2">
                        <Mail className="h-3 w-3 text-purple-600" />
                      </div>
                      Email Address
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter email address"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-sm font-medium text-gray-900 break-all">
                          {profile?.user?.email || "Not provided"}
                        </p>
                      </div>
                    )}
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      <div className="w-5 h-5 bg-emerald-100 rounded flex items-center justify-center mr-2">
                        <Phone className="h-3 w-3 text-emerald-600" />
                      </div>
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {profile?.user?.phone || "Not provided"}
                        </p>
                      </div>
                    )}
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Security Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Security Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 px-4 py-4 sm:px-6 sm:py-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Security
                  </h3>
                </div>
              </div>

              <div className="px-4 py-6 sm:px-6 sm:py-8">
                {!changingPassword ? (
                  <button
                    onClick={() => setChangingPassword(true)}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Change Password</span>
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter current password"
                      />
                      {errors.current_password && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.current_password}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter new password"
                      />
                      {errors.new_password && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.new_password}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Confirm new password"
                      />
                      {errors.confirm_password && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.confirm_password}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
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
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handlePasswordChange}
                        className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Update"}
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

export default AdminProfilePage;
