import axios from 'axios';

// ✅ baseURL includes /api — so all service calls use /route (NOT /api/route)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,                        // ✅ ADDED: 30s timeout (image uploads need it)
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor ───────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // ✅ Only redirect if not already on login/signup
      const publicPaths = ['/login', '/signup', '/'];
      if (!publicPaths.includes(window.location.pathname)) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }

    // ✅ ADDED: Log errors in dev for easier debugging
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        error.response?.data || error.message
      );
    }

    return Promise.reject(error);
  }
);

export default api;