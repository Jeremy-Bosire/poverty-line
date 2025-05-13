/**
 * Profile service for handling user profile operations
 */
import axios from 'axios';
import authService from './authService';

// API base URL - should match the backend port (5005 from the memory)
const API_URL = 'http://localhost:5005/api';

/**
 * Get the current user's profile
 * @returns {Promise} - Promise with profile data
 */
const getCurrentUserProfile = async () => {
  const user = authService.getUserFromStorage();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const response = await axios.get(`${API_URL}/profiles/${user.id}`, {
    headers: {
      Authorization: `Bearer ${authService.getToken()}`
    }
  });
  
  return response.data.profile;
};

/**
 * Update the current user's profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise} - Promise with updated profile data
 */
const updateProfile = async (profileData) => {
  const user = authService.getUserFromStorage();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const response = await axios.put(`${API_URL}/profiles/${user.id}`, profileData, {
    headers: {
      Authorization: `Bearer ${authService.getToken()}`
    }
  });
  
  return response.data.profile;
};

/**
 * Get a user's profile by ID (admin only)
 * @param {number} userId - User ID
 * @returns {Promise} - Promise with profile data
 */
const getUserProfile = async (userId) => {
  const response = await axios.get(`${API_URL}/profiles/${userId}`, {
    headers: {
      Authorization: `Bearer ${authService.getToken()}`
    }
  });
  
  return response.data.profile;
};

/**
 * Get all profiles (admin only)
 * @param {Object} filters - Optional filters
 * @returns {Promise} - Promise with profiles data
 */
const getAllProfiles = async (filters = {}) => {
  // Build query string from filters
  const queryParams = new URLSearchParams();
  if (filters.completionStatus) {
    queryParams.append('completion_status', filters.completionStatus);
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  const response = await axios.get(`${API_URL}/profiles${queryString}`, {
    headers: {
      Authorization: `Bearer ${authService.getToken()}`
    }
  });
  
  return response.data;
};

const profileService = {
  getCurrentUserProfile,
  updateProfile,
  getUserProfile,
  getAllProfiles
};

export default profileService;
