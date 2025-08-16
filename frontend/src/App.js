import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Auth Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Legacy Dashboard (will route to role-specific dashboards)
import DashboardPage from "./pages/DashboardPage";

// Admin Pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminCoursesPage from "./pages/admin/AdminCoursesPage";
import AdminStudentsPage from "./pages/admin/AdminStudentsPage";
import AdminEnrolledStudentsPage from "./pages/admin/AdminEnrolledStudentsPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";

// Student Pages
import StudentDashboardPage from "./pages/student/StudentDashboardPage";
import StudentCoursesPage from "./pages/student/StudentCoursesPage";
import StudentProfilePage from "./pages/student/StudentProfilePage";
import StudentEnrolledCoursesPage from "./pages/student/StudentEnrolledCoursesPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route
                        path="/"
                        element={<Navigate to="/dashboard" replace />}
                      />
                      <Route path="/dashboard" element={<DashboardPage />} />

                      {/* Admin Routes */}
                      <Route
                        path="/admin/dashboard"
                        element={<AdminDashboardPage />}
                      />
                      <Route
                        path="/admin/courses"
                        element={<AdminCoursesPage />}
                      />
                      <Route
                        path="/admin/students"
                        element={<AdminStudentsPage />}
                      />
                      <Route
                        path="/admin/enrolled-students"
                        element={<AdminEnrolledStudentsPage />}
                      />
                      <Route
                        path="/admin/profile"
                        element={<AdminProfilePage />}
                      />

                      {/* Student Routes */}
                      <Route
                        path="/student/dashboard"
                        element={<StudentDashboardPage />}
                      />
                      <Route
                        path="/student/courses"
                        element={<StudentCoursesPage />}
                      />
                      <Route
                        path="/student/profile"
                        element={<StudentProfilePage />}
                      />
                      <Route
                        path="/student/my-courses"
                        element={<StudentEnrolledCoursesPage />}
                      />

                      {/* Legacy Routes - redirect to role-specific routes */}
                      <Route
                        path="/courses"
                        element={<Navigate to="/student/courses" replace />}
                      />
                      <Route
                        path="/students"
                        element={<Navigate to="/admin/students" replace />}
                      />
                      <Route
                        path="/profile"
                        element={<Navigate to="/student/profile" replace />}
                      />
                      <Route
                        path="/my-courses"
                        element={<Navigate to="/student/my-courses" replace />}
                      />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
