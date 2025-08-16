import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  BookOpen,
  Users,
  User,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Award,
  Plus,
  Settings,
} from "lucide-react";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    ...(user?.role === "admin"
      ? [
          { name: "Available Courses", href: "/admin/courses", icon: BookOpen },
          { name: "Students", href: "/admin/students", icon: Users },
          {
            name: "Enrolled Students",
            href: "/admin/enrolled-students",
            icon: Award,
          },
          { name: "Profile", href: "/admin/profile", icon: User },
        ]
      : [
          {
            name: "Available Courses",
            href: "/student/courses",
            icon: BookOpen,
          },
          {
            name: "My Enrolled Courses",
            href: "/student/my-courses",
            icon: Award,
          },
          { name: "Profile", href: "/student/profile", icon: User },
        ]),
  ];

  // Quick Actions for admin users
  const quickActions =
    user?.role === "admin"
      ? [
          {
            name: "Add Course",
            action: () => {
              // Navigate to admin dashboard with a query parameter to show modal
              navigate("/admin/dashboard?action=addCourse");
            },
            icon: Plus,
          },
          {
            name: "Create Student",
            action: () => {
              // Navigate to admin dashboard with a query parameter to show student modal
              navigate("/admin/dashboard?action=addStudent");
            },
            icon: Plus,
          },
        ]
      : [];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 flex z-40 md:hidden transition-all duration-300 ${
          sidebarOpen ? "" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200 hover:bg-white hover:bg-opacity-20"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SCMS
              </span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-3 py-3 text-base font-medium rounded-xl transition-all duration-200 transform hover:scale-105`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon
                      className={`mr-4 h-5 w-5 ${
                        isActive
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-600"
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}

              {/* Quick Actions for Admin - Mobile */}
              {user?.role === "admin" && quickActions.length > 0 && (
                <div className="pt-6 mt-6 border-t border-gray-200">
                  <div className="px-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Quick Actions
                    </h3>
                  </div>
                  <div className="mt-3 space-y-1">
                    {quickActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.name}
                          onClick={() => {
                            action.action();
                            setSidebarOpen(false);
                          }}
                          className="text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 group flex items-center px-3 py-3 text-base font-medium rounded-xl w-full text-left transition-all duration-200"
                        >
                          <Icon className="mr-4 h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                          {action.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white shadow-xl border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  SCMS
                </span>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      } group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-105`}
                    >
                      <Icon
                        className={`mr-3 h-5 w-5 ${
                          isActive
                            ? "text-white"
                            : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}

                {/* Quick Actions for Admin - Desktop */}
                {user?.role === "admin" && quickActions.length > 0 && (
                  <div className="pt-6 mt-6 border-t border-gray-200">
                    <div className="px-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Quick Actions
                      </h3>
                    </div>
                    <div className="mt-3 space-y-1">
                      {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={action.name}
                            onClick={action.action}
                            className="text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 group flex items-center px-3 py-3 text-sm font-medium rounded-xl w-full text-left transition-all duration-200"
                          >
                            <Icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                            {action.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile menu button */}
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white shadow-sm">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 hover:bg-gray-100 transition-all duration-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Enhanced Header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow-lg border-b border-gray-200">
          <div className="flex-1 px-4 sm:px-6 flex justify-between items-center">
            <div className="flex-1 flex">
              <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 truncate">
                {(() => {
                  const path = location.pathname;
                  if (path === "/student/my-courses")
                    return "My Enrolled Courses";
                  if (path === "/admin/students") return "Students";
                  if (path === "/admin/courses") return "Courses";
                  if (path === "/admin/enrolled-students")
                    return "Enrolled Students";
                  if (path === "/student/courses") return "Courses";
                  if (path === "/student/profile") return "Profile";
                  if (path === "/admin/profile") return "Profile";
                  return (
                    navigation.find((item) => item.href === path)?.name ||
                    "Dashboard"
                  );
                })()}
              </h1>
            </div>
            <div className="ml-2 sm:ml-4 flex items-center md:ml-6">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="hidden sm:block text-sm text-gray-700">
                  <span className="font-medium">Welcome, </span>
                  <span className="font-semibold text-blue-600">
                    {user?.first_name || user?.username}
                  </span>
                  <span className="text-xs text-gray-500 ml-2 px-2 py-1 bg-blue-50 rounded-full">
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  </span>
                </div>
                <div className="sm:hidden text-xs text-gray-700">
                  <span className="font-semibold text-blue-600">
                    {user?.first_name || user?.username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">Exit</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
