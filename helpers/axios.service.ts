import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add Auth or Logging
api.interceptors.request.use(
  (config) => {
    // You can retrieve a token from a cookie or local storage here
    // const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    // if (token) config.headers.Authorization = `Bearer ${token.split('=')[1]}`;
    console.log(`[API Request] ${config.method?.toUpperCase() || 'UNKNOWN'} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unknown error occurred';
    console.error(`[API Error] ${message}`);
    // You could trigger a global notification state here
    return Promise.reject(message);
  }
);

export default api;