/**
 * Admin state management
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005/api';

// Initial state
const initialState = {
  users: [],
  pendingResources: [],
  allResources: [],
  loading: false,
  error: null,
  success: false,
  message: ''
};

/**
 * Fetch all users (admin only)
 */
export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch users'
      );
    }
  }
);

/**
 * Update user details (admin only)
 */
export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/users/${userId}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to update user'
      );
    }
  }
);

/**
 * Change user status (active/inactive) (admin only)
 */
export const changeUserStatus = createAsyncThunk(
  'admin/changeUserStatus',
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${API_URL}/users/${userId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return { userId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to change user status'
      );
    }
  }
);

/**
 * Fetch all resources including pending (admin only)
 */
export const fetchAllResources = createAsyncThunk(
  'admin/fetchAllResources',
  async (filters, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      let url = `${API_URL}/resources/all`;
      
      // Add query parameters if filters are provided
      if (filters) {
        const queryParams = new URLSearchParams();
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.provider_id) queryParams.append('provider_id', filters.provider_id);
        
        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`;
        }
      }
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch resources'
      );
    }
  }
);

/**
 * Fetch pending resources (admin only)
 */
export const fetchPendingResources = createAsyncThunk(
  'admin/fetchPendingResources',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/resources/all?status=pending`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch pending resources'
      );
    }
  }
);

/**
 * Approve or reject a resource (admin only)
 */
export const approveRejectResource = createAsyncThunk(
  'admin/approveRejectResource',
  async ({ resourceId, status, rejectionReason }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/resources/${resourceId}/approval`,
        { status, rejection_reason: rejectionReason },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return { resourceId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to update resource status'
      );
    }
  }
);

/**
 * Admin slice
 */
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    resetAdminState: (state) => {
      state.error = null;
      state.success = false;
      state.message = '';
    },
    clearAdminMessages: (state) => {
      state.error = null;
      state.success = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.success = true;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.map(user => 
          user.id === action.payload.user.id ? action.payload.user : user
        );
        state.success = true;
        state.message = 'User updated successfully';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Change user status
      .addCase(changeUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.map(user => 
          user.id === action.payload.userId 
            ? { ...user, status: action.payload.status }
            : user
        );
        state.success = true;
        state.message = `User status changed to ${action.payload.status}`;
      })
      .addCase(changeUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch all resources
      .addCase(fetchAllResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllResources.fulfilled, (state, action) => {
        state.loading = false;
        state.allResources = action.payload.resources;
        state.success = true;
      })
      .addCase(fetchAllResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch pending resources
      .addCase(fetchPendingResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingResources.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingResources = action.payload.resources;
        state.success = true;
      })
      .addCase(fetchPendingResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Approve/reject resource
      .addCase(approveRejectResource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveRejectResource.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update both allResources and pendingResources lists
        state.allResources = state.allResources.map(resource => 
          resource.id === action.payload.resourceId 
            ? { ...resource, status: action.payload.status }
            : resource
        );
        
        // Remove the resource from pendingResources if it was approved or rejected
        state.pendingResources = state.pendingResources.filter(
          resource => resource.id !== action.payload.resourceId
        );
        
        state.success = true;
        state.message = `Resource ${action.payload.status === 'approved' ? 'approved' : 'rejected'} successfully`;
      })
      .addCase(approveRejectResource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetAdminState, clearAdminMessages } = adminSlice.actions;
export default adminSlice.reducer;
