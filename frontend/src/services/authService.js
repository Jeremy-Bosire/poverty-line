/**
 * Authentication service for handling user authentication operations
 */
import axios from 'axios';

// API base URL - should match the backend port from our fixes
const API_URL = 'http://localhost:5005/api/auth';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - Promise with registration response
 */
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

/**
 * Login a user
 * @param {Object} credentials - User login credentials
 * @returns {Promise} - Promise with login response
 */
const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

/**
 * Logout the current user
 */
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Get the current authenticated user
 * @returns {Promise} - Promise with current user data
 */
const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  
  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.user;
  } catch (error) {
    logout();
    return null;
  }
};

/**
 * Change the current user's password
 * @param {Object} passwordData - Password change data
 * @returns {Promise} - Promise with password change response
 */
const changePassword = async (passwordData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/change-password`, passwordData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Request a password reset
 * @param {string} email - User email
 * @returns {Promise} - Promise with password reset request response
 */
const requestPasswordReset = async (email) => {
  const response = await axios.post(`${API_URL}/reset-password`, { email });
  return response.data;
};

/**
 * Reset a password using a token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise} - Promise with password reset response
 */
const resetPassword = async (token, newPassword) => {
  const response = await axios.post(`${API_URL}/reset-password/${token}`, {
    new_password: newPassword
  });
  return response.data;
};

/**
 * Get the current user from local storage
 * @returns {Object|null} - User object or null if not logged in
 */
const getUserFromStorage = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Get the authentication token from local storage
 * @returns {string|null} - JWT token or null if not logged in
 */
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Check if the current user has a specific role
 * @param {string} role - Role to check
 * @returns {boolean} - True if user has the role
 */
const hasRole = (role) => {
  const user = getUserFromStorage();
  return user && user.role === role;
};

/**
 * Setup axios interceptors for authentication
 */
const setupAuthInterceptors = () => {
  // Request interceptor
  axios.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Unauthorized, clear local storage
        logout();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  changePassword,
  requestPasswordReset,
  resetPassword,
  getUserFromStorage,
  getToken,
  hasRole,
  setupAuthInterceptors
};

export default authService;
