/**
 * Resource service for handling resource operations
 */
import axios from 'axios';
import authService from './authService';

// API base URL - matches the backend port from our memories (5005)
const API_URL = 'http://localhost:5005/api';

/**
 * Get all approved resources (public)
 * @param {Object} filters - Optional filters (category, location, search)
 * @returns {Promise} - Promise with resources data
 */
const getResources = async (filters = {}) => {
  // Build query string from filters
  const queryParams = new URLSearchParams();
  
  if (filters.category) {
    queryParams.append('category', filters.category);
  }
  if (filters.location) {
    queryParams.append('location', filters.location);
  }
  if (filters.search) {
    queryParams.append('search', filters.search);
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  const response = await axios.get(`${API_URL}/resources${queryString}`);
  
  return response.data;
};

/**
 * Get resources created by the current user (provider only)
 * @param {Object} filters - Optional filters (status, category)
 * @returns {Promise} - Promise with resources data
 */
const getMyResources = async (filters = {}) => {
  // Build query string from filters
  const queryParams = new URLSearchParams();
  
  if (filters.status) {
    queryParams.append('status', filters.status);
  }
  if (filters.category) {
    queryParams.append('category', filters.category);
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  const response = await axios.get(`${API_URL}/resources/my${queryString}`, {
    headers: {
      Authorization: `Bearer ${authService.getToken()}`
    }
  });
  
  return response.data;
};

/**
 * Get all resources including pending and rejected (admin only)
 * @param {Object} filters - Optional filters (status, category, provider_id)
 * @returns {Promise} - Promise with resources data
 */
const getAllResources = async (filters = {}) => {
  // Build query string from filters
  const queryParams = new URLSearchParams();
  
  if (filters.status) {
    queryParams.append('status', filters.status);
  }
  if (filters.category) {
    queryParams.append('category', filters.category);
  }
  if (filters.provider_id) {
    queryParams.append('provider_id', filters.provider_id);
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  const response = await axios.get(`${API_URL}/resources/all${queryString}`, {
    headers: {
      Authorization: `Bearer ${authService.getToken()}`
    }
  });
  
  return response.data;
};

/**
 * Get a specific resource by ID
 * @param {number} resourceId - Resource ID
 * @returns {Promise} - Promise with resource data
 */
const getResource = async (resourceId) => {
  const response = await axios.get(`${API_URL}/resources/${resourceId}`);
  
  return response.data;
};

/**
 * Create a new resource (provider only)
 * @param {Object} resourceData - Resource data
 * @returns {Promise} - Promise with created resource data
 */
const createResource = async (resourceData) => {
  const response = await axios.post(`${API_URL}/resources`, resourceData, {
    headers: {
      Authorization: `Bearer ${authService.getToken()}`
    }
  });
  
  return response.data;
};

/**
 * Update a resource
 * @param {number} resourceId - Resource ID
 * @param {Object} resourceData - Updated resource data
 * @returns {Promise} - Promise with updated resource data
 */
const updateResource = async (resourceId, resourceData) => {
  const response = await axios.put(`${API_URL}/resources/${resourceId}`, resourceData, {
    headers: {
      Authorization: `Bearer ${authService.getToken()}`
    }
  });
  
  return response.data;
};

/**
 * Delete a resource
 * @param {number} resourceId - Resource ID
 * @returns {Promise} - Promise with success message
 */
const deleteResource = async (resourceId) => {
  const response = await axios.delete(`${API_URL}/resources/${resourceId}`, {
    headers: {
      Authorization: `Bearer ${authService.getToken()}`
    }
  });
  
  return response.data;
};

/**
 * Approve or reject a resource (admin only)
 * @param {number} resourceId - Resource ID
 * @param {Object} approvalData - Approval data (status, rejection_reason)
 * @returns {Promise} - Promise with updated resource data
 */
const approveOrRejectResource = async (resourceId, approvalData) => {
  const response = await axios.post(`${API_URL}/resources/${resourceId}/approval`, approvalData, {
    headers: {
      Authorization: `Bearer ${authService.getToken()}`
    }
  });
  
  return response.data;
};

const resourceService = {
  getResources,
  getMyResources,
  getAllResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  approveOrRejectResource
};

export default resourceService;
