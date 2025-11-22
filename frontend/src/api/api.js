import axios from 'axios';

// Get backend API URL from environment variable
// VITE_API_URL should include /api (e.g., https://ar-viewer.onrender.com/api)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ar-viewer.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;

