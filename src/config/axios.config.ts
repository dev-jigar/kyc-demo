import axios, { AxiosInstance } from "axios";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// // Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     // Add auth token if available
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error: AxiosError) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// api.interceptors.response.use(
//   (response: AxiosResponse) => {
//     return response;
//   },
//   (error: AxiosError) => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized
//       console.error('Unauthorized access');
//       // Maybe redirect to login
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
