import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  signup: (name, email, password, address) =>
    api.post("/auth/signup", { name, email, password, address }),
  updatePassword: (oldPassword, newPassword) =>
    api.post("/auth/update-password", { oldPassword, newPassword }),
};

export const adminService = {
  getDashboard: () => api.get("/admin/dashboard"),
  addUser: (userData) => api.post("/admin/users", userData),
  getUsers: (page = 1, limit = 10, filters = {}) =>
    api.get("/admin/users", { params: { page, limit, ...filters } }),
  getUserDetails: (userId) => api.get(`/admin/users/${userId}`),
  updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  addStore: (storeData) => api.post("/admin/stores", storeData),
  getStores: (page = 1, limit = 10, filters = {}) =>
    api.get("/admin/stores", { params: { page, limit, ...filters } }),
  getStoreDetails: (storeId) => api.get(`/admin/stores/${storeId}`),
  updateStore: (storeId, storeData) =>
    api.put(`/admin/stores/${storeId}`, storeData),
  deleteStore: (storeId) => api.delete(`/admin/stores/${storeId}`),
};

export const userService = {
  getStores: (page = 1, limit = 10, filters = {}) =>
    api.get("/users/stores", { params: { page, limit, ...filters } }),
  getStoreDetails: (storeId) => api.get(`/users/stores/${storeId}`),
  submitRating: (storeId, rating) =>
    api.post("/users/ratings", { storeId, rating }),
  getUserRating: (storeId) => api.get(`/users/ratings/store/${storeId}`),
  getStoreAverageRating: (storeId) =>
    api.get(`/users/stores/${storeId}/average-rating`),
  deleteRating: (ratingId) => api.delete(`/users/ratings/${ratingId}`),
};

export const storeOwnerService = {
  getDashboard: (storeId) => api.get(`/store-owner/dashboard/${storeId}`),
  getStoreRatings: (storeId, page = 1, limit = 10) =>
    api.get(`/store-owner/dashboard/${storeId}/ratings`, {
      params: { page, limit },
    }),
};

export default api;
