import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

// Books API
export const booksAPI = {
  getAll: () => api.get("/books"),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post("/books", data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
};

// Borrowing API
export const borrowingAPI = {
  request: (data) => api.post("/borrowing/request", data),
  getMyBooks: () => api.get("/borrowing/my-books"),
  returnBook: (id) => api.post(`/borrowing/return/${id}`),
  getHistory: () => api.get("/borrowing/history"),
  getRequests: () => api.get("/borrowing/my-requests"),
};

// Admin API
export const adminAPI = {
  getRequests: () => api.get("/admin/requests"),
  approveRequest: (id) => api.put(`/admin/requests/${id}/approve`),
  rejectRequest: (id) => api.put(`/admin/requests/${id}/reject`),
  getBorrowings: () => api.get("/admin/borrowings"),
  getStats: () => api.get("/admin/stats"),
};

export default api;
