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
import HomePage from "./pages/HomePage";
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
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AdminDashboardPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AdminCoursesPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AdminStudentsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/enrolled-students"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AdminEnrolledStudentsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AdminProfilePage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <StudentDashboardPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/courses"
              element={
                <ProtectedRoute>
                  <Layout>
                    <StudentCoursesPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <StudentProfilePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/my-courses"
              element={
                <ProtectedRoute>
                  <Layout>
                    <StudentEnrolledCoursesPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Catch all other protected routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route
                        path="/*"
                        element={<Navigate to="/dashboard" replace />}
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
