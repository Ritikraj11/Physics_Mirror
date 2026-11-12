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

    // Sanitize technical errors into polite, human-friendly general errors
    let userFriendlyMessage = 'An unexpected error occurred. Please try again.';

    if (!error.response) {
      // Network disconnected or backend server cold-starting
      userFriendlyMessage =
        'Unable to connect to Physics Mirror server. Please check your internet connection or try again in a few moments.';
    } else {
      const status = error.response.status;
      const serverMsg = error.response.data?.message;

      // Handle 401 Unauthorized
      if (status === 401) {
        const isLoginRequest = (error.config?.url || '').includes('/auth/login');
        userFriendlyMessage = serverMsg || 'Your session has expired. Please sign in again.';
        if (!isLoginRequest) {
          localStorage.removeItem('pm_token');
          localStorage.removeItem('pm_user');
          if (window.location.pathname !== '/login' && !window.location.pathname.startsWith('/login/')) {
            window.location.href = '/login';
          }
        }
      } else if (status === 429) {
        // Rate limit block
        userFriendlyMessage =
          serverMsg ||
          'Too many attempts from your IP. Access is temporarily blocked for security. Please try again later.';
      } else if (status === 403) {
        userFriendlyMessage = serverMsg || 'You do not have permission to perform this action.';
      } else if (status === 404) {
        userFriendlyMessage =
          serverMsg && !/id of|cast|mongo|objectid|route not found|api route/i.test(serverMsg)
            ? serverMsg
            : 'The requested service or feature is currently updating or not available yet. Please try again shortly.';
      } else if (status >= 500) {
        userFriendlyMessage = 'The server is temporarily busy or updating. Please try again in a moment.';
      } else {
        // 400 or other 4xx: check if message contains technical phrases
        const isTechnical =
          /mongo|bson|cast|sql|syntax|stack|null|undefined|jwt|at object|at module|CastError|ValidationError/i.test(
            serverMsg || ''
          );
        if (serverMsg && !isTechnical) {
          userFriendlyMessage = serverMsg;
        } else {
          userFriendlyMessage = 'Unable to complete this action. Please check your details and try again.';
        }
      }
    }

    // Ensure error.response.data.message reflects the sanitized message
    if (error.response) {
      if (!error.response.data || typeof error.response.data !== 'object') {
        error.response.data = {};
      }
      error.response.data.message = userFriendlyMessage;
    }
    error.message = userFriendlyMessage;

    return Promise.reject(error);
  }
);

export default api;
