import React from "react";
import { Link, useLocation } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const AuthNavbar = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              SCIQUS
            </span>
          </Link>

          {/* Auth Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isLoginPage
                  ? "bg-indigo-50 text-indigo-600 border border-indigo-200"
                  : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isRegisterPage
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-md"
              }`}
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AuthNavbar;
