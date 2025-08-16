import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/api/auth/token/refresh/`,
            {
              refresh: refreshToken,
            }
          );

          const { access } = response.data;
          localStorage.setItem("access_token", access);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (credentials) => api.post("/api/auth/login/", credentials),
  register: (userData) => api.post("/api/auth/register/", userData),
  logout: (refreshToken) =>
    api.post("/api/auth/logout/", { refresh: refreshToken }),
  getProfile: () => api.get("/api/auth/profile/"),
  updateProfile: (userData) => api.put("/api/auth/profile/", userData),
  changePassword: (passwordData) =>
    api.post("/api/auth/change-password/", passwordData),
  refreshToken: (refreshToken) =>
    api.post("/api/auth/token/refresh/", { refresh: refreshToken }),
  listUsers: () => api.get("/api/auth/users/"),
};

// Courses API
export const coursesAPI = {
  list: (params) => api.get("/api/courses/", { params }),
  create: (courseData) => api.post("/api/courses/", courseData),
  get: (id) => api.get(`/api/courses/${id}/`),
  update: (id, courseData) => api.put(`/api/courses/${id}/`, courseData),
  partialUpdate: (id, courseData) =>
    api.patch(`/api/courses/${id}/`, courseData),
  delete: (id) => api.delete(`/api/courses/${id}/`),
  getStudents: (id) => api.get(`/api/courses/${id}/students/`),
  enrollStudent: (id, studentData) =>
    api.post(`/api/courses/${id}/enroll/`, studentData),
  unenrollStudent: (id, studentData) =>
    api.post(`/api/courses/${id}/unenroll/`, studentData),
  activate: (id) => api.post(`/api/courses/${id}/activate/`),
  deactivate: (id) => api.post(`/api/courses/${id}/deactivate/`),
  listActive: (params) => api.get("/api/courses/active/", { params }),
  getAllCourses: () => api.get("/api/courses/"),
};

// Students API
export const studentsAPI = {
  list: (params) => api.get("/api/students/", { params }),
  create: (studentData) => api.post("/api/students/", studentData),
  get: (id) => api.get(`/api/students/${id}/`),
  update: (id, studentData) => api.put(`/api/students/${id}/`, studentData),
  partialUpdate: (id, studentData) =>
    api.patch(`/api/students/${id}/`, studentData),
  delete: (id) => api.delete(`/api/students/${id}/`),
  changeStatus: (id, statusData) =>
    api.post(`/api/students/${id}/change-status/`, statusData),

  // Multiple course enrollment endpoints
  enrollInCourse: (studentId, courseData) =>
    api.post(`/api/students/${studentId}/enroll/`, courseData),
  unenrollFromCourse: (studentId, courseData) =>
    api.delete(`/api/students/${studentId}/enroll/`, { data: courseData }),
  getEnrollments: (studentId, params) =>
    api.get(`/api/students/${studentId}/enrollments/`, { params }),

  // Deprecated but kept for backward compatibility
  changeCourse: (id, courseData) =>
    api.post(`/api/students/${id}/change-course/`, courseData),
  getCourseDetails: (id) => api.get(`/api/students/${id}/course-details/`),

  // General endpoints
  listByCourse: (params) => api.get("/api/students/by-course/", { params }),
  listActive: (params) => api.get("/api/students/active/", { params }),
  getMyProfile: () => api.get("/api/students/my-profile/"),
  getProfile: () => api.get("/api/students/my-profile/"),
  updateProfile: (userData) => api.put("/api/students/my-profile/", userData),
  getAllStudents: () => api.get("/api/students/"),

  // Quick enrollment for student's own profile
  enrollSelf: (courseId) =>
    api.post("/api/students/my-profile/enroll/", { course_id: courseId }),
};

export default api;
