import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { studentsAPI, coursesAPI } from "../../services/api";
import {
  BookOpen,
  GraduationCap,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  FileText,
  ExternalLink,
} from "lucide-react";

const StudentEnrolledCoursesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "student") {
      fetchStudentProfile();
    }
  }, [user]);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      console.log("🎓 Fetching student profile for enrolled courses...");

      const profileResponse = await studentsAPI.getProfile();
      const studentData = profileResponse.data || profileResponse;

      console.log("📊 Full student data:", studentData);
      console.log("� Active courses:", studentData?.active_courses);

      // The backend returns active_courses array with enrolled course details
      if (
        studentData?.active_courses &&
        Array.isArray(studentData.active_courses)
      ) {
        console.log(
          "✅ Found active_courses array:",
          studentData.active_courses.length,
          "courses"
        );
        setEnrolledCourses(studentData.active_courses);
      } else {
        console.log("❌ No active_courses found in student data");
        setEnrolledCourses([]);
      }
    } catch (error) {
      console.error("❌ Error fetching student profile:", error);
      setEnrolledCourses([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-6 text-white">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <GraduationCap className="h-8 w-8 mr-3" />
            My Enrolled Courses
          </h1>
          <p className="text-blue-100 mt-2">
            {enrolledCourses.length > 0
              ? `You are enrolled in ${enrolledCourses.length} course${
                  enrolledCourses.length !== 1 ? "s" : ""
                }`
              : "You haven't enrolled in any courses yet"}
          </p>
        </div>
      </div>

      {/* Enrolled Courses Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {enrolledCourses.length === 0 ? (
          <div className="text-center py-12 px-6">
            <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Enrolled Courses
            </h3>
            <p className="text-gray-500 mb-6">
              You haven't enrolled in any courses yet. Explore available courses
              to get started.
            </p>
            <button
              onClick={() => navigate("/student/courses")}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course, index) => {
                console.log("🔍 Displaying course:", course);

                // Extract course information from the active_courses format
                const courseName = course.course_name || "Unknown Course";
                const courseCode = course.course_code || "N/A";
                const courseDuration = course.course_duration || null;
                const courseCredits = course.credits || "N/A";
                const courseId = course.course_id || course.id;

                // Format description to handle bullet points
                const formatDescription = (desc) => {
                  if (!desc) return "No description available";

                  // Split by bullet points and clean up
                  const points = desc
                    .split(/[●•]/)
                    .filter((point) => point.trim().length > 0);

                  if (points.length > 1) {
                    // Return as separate bullet points
                    return points.map((point) => point.trim());
                  }

                  // If no bullet points found, return as is
                  return [desc.trim()];
                };

                return (
                  <div
                    key={courseId || index}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {/* Course Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-xl">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <BookOpen className="h-5 w-5 text-white" />
                          </div>
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Enrolled
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                            <span
                              className={`w-2 h-2 rounded-full mr-2 ${
                                course.is_active ? "bg-green-400" : "bg-red-400"
                              }`}
                            ></span>
                            {course.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-2 leading-tight">
                        {courseName}
                      </h3>
                      <p className="text-blue-100 text-sm">
                        <span className="font-medium">Course Code:</span>{" "}
                        <span className="font-mono bg-white/20 px-2 py-1 rounded text-white">
                          {courseCode}
                        </span>
                      </p>
                    </div>

                    {/* Course Details */}
                    <div className="p-6">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200">
                          <div className="flex items-center justify-center mb-2">
                            <div className="p-2 bg-yellow-200 rounded-lg">
                              <Star className="h-4 w-4 text-yellow-700" />
                            </div>
                          </div>
                          <p className="text-xs font-semibold text-yellow-700 mb-1">
                            Credits
                          </p>
                          <p className="text-lg font-bold text-yellow-900">
                            {courseCredits}
                          </p>
                        </div>

                        <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                          <div className="flex items-center justify-center mb-2">
                            <div className="p-2 bg-blue-200 rounded-lg">
                              <Clock className="h-4 w-4 text-blue-700" />
                            </div>
                          </div>
                          <p className="text-xs font-semibold text-blue-700 mb-1">
                            Duration
                          </p>
                          <p className="text-sm font-bold text-blue-900">
                            {courseDuration
                              ? `${courseDuration} months`
                              : "1 semester"}
                          </p>
                        </div>
                      </div>

                      {/* Course Description */}
                      <div className="mb-4">
                        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-gray-600" />
                          Course Description
                        </h4>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[100px]">
                          {Array.isArray(
                            formatDescription(course.description)
                          ) ? (
                            <ul className="space-y-2">
                              {formatDescription(course.description).map(
                                (point, idx) => (
                                  <li
                                    key={idx}
                                    className="text-sm text-gray-700 leading-relaxed flex items-start"
                                  >
                                    <span className="text-blue-500 mr-2 mt-1 flex-shrink-0">
                                      •
                                    </span>
                                    <span>{point}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {formatDescription(course.description)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {enrolledCourses.length > 0 && (
        <div className="text-center">
          <button
            onClick={() => navigate("/student/courses")}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <ExternalLink className="h-5 w-5 mr-2" />
            Explore More Courses
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentEnrolledCoursesPage;
