import axios from 'axios';
import { triggerGlobalLoading, completeGlobalLoading } from '../context/LoadingContext';

// Backend URL resolution with automatic Render fallback in production
const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const RAW_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (!isLocalhost ? 'https://physics-mirror-api.onrender.com' : '');

const API_BASE_URL = RAW_BASE_URL ? RAW_BASE_URL.replace(/\/+$/, '') : '';

const api = axios.create({
  baseURL: API_BASE_URL ? `${API_BASE_URL}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token & trigger percentage loading splash
api.interceptors.request.use(
  (config) => {
    // Generate context-aware database operation message
    let msg = 'Fetching data from database...';
    const url = config.url || '';
    const method = (config.method || 'get').toLowerCase();

    if (method === 'post' || method === 'put' || method === 'patch') {
      if (url.includes('login')) {
        msg = 'Authenticating user & fetching profile...';
      } else if (url.includes('payments')) {
        msg = 'Recording fee transaction in database...';
      } else if (url.includes('students')) {
        msg = 'Saving student admission details...';
      } else if (url.includes('attendance')) {
        msg = 'Syncing attendance records with database...';
      } else {
        msg = 'Writing updates to database...';
      }
    } else {
      if (url.includes('reports') || url.includes('dashboard')) {
        msg = 'Aggregating live institute statistics...';
      } else if (url.includes('students')) {
        msg = 'Fetching student records & enrollments...';
      } else if (url.includes('batches')) {
        msg = 'Fetching batch timetables & rosters...';
      } else if (url.includes('payments')) {
        msg = 'Fetching payment history & fee receipts...';
      } else if (url.includes('attendance')) {
        msg = 'Loading batch attendance logs...';
      } else if (url.includes('faculties')) {
        msg = 'Fetching faculty profiles & assignments...';
      }
    }

    if (!config.skipLoading) {
      triggerGlobalLoading(msg);
    }

    const token = localStorage.getItem('pm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    completeGlobalLoading();
    return Promise.reject(error);
  }
);

// Response interceptor to complete loading splash & handle unauthorized errors
api.interceptors.response.use(
  (response) => {
    if (!response.config?.skipLoading) {
      completeGlobalLoading();
    }
    return response;
  },
  (error) => {
    if (!error.config?.skipLoading) {
      completeGlobalLoading();
    }

    if (error.response && error.response.status === 401) {
      const isLoginRequest = (error.config?.url || '').includes('/auth/login');
      if (!isLoginRequest) {
        localStorage.removeItem('pm_token');
        localStorage.removeItem('pm_user');
        if (window.location.pathname !== '/login' && !window.location.pathname.startsWith('/login/')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
