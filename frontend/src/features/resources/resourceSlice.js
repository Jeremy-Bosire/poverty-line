/**
 * Redux slice for resources state management
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import resourceService from '../../services/resourceService';

// Initial state
const initialState = {
  resources: [],
  resource: null,
  isLoading: false,
  error: null,
  message: '',
  count: 0
};

// Async thunks for resource operations
export const getResources = createAsyncThunk(
  'resources/getAll',
  async (filters, thunkAPI) => {
    try {
      return await resourceService.getResources(filters);
    } catch (error) {
      const message = error.response?.data?.error || 
                      error.message || 
                      'Failed to fetch resources';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getMyResources = createAsyncThunk(
  'resources/getMine',
  async (filters, thunkAPI) => {
    try {
      return await resourceService.getMyResources(filters);
    } catch (error) {
      const message = error.response?.data?.error || 
                      error.message || 
                      'Failed to fetch your resources';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllResources = createAsyncThunk(
  'resources/getAllAdmin',
  async (filters, thunkAPI) => {
    try {
      return await resourceService.getAllResources(filters);
    } catch (error) {
      const message = error.response?.data?.error || 
                      error.message || 
                      'Failed to fetch all resources';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getResource = createAsyncThunk(
  'resources/getOne',
  async (id, thunkAPI) => {
    try {
      return await resourceService.getResource(id);
    } catch (error) {
      const message = error.response?.data?.error || 
                      error.message || 
                      'Failed to fetch resource';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createResource = createAsyncThunk(
  'resources/create',
  async (resourceData, thunkAPI) => {
    try {
      return await resourceService.createResource(resourceData);
    } catch (error) {
      const message = error.response?.data?.error || 
                      error.message || 
                      'Failed to create resource';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateResource = createAsyncThunk(
  'resources/update',
  async ({ id, resourceData }, thunkAPI) => {
    try {
      return await resourceService.updateResource(id, resourceData);
    } catch (error) {
      const message = error.response?.data?.error || 
                      error.message || 
                      'Failed to update resource';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteResource = createAsyncThunk(
  'resources/delete',
  async (id, thunkAPI) => {
    try {
      const response = await resourceService.deleteResource(id);
      // Include the ID in the returned object so we can remove it from state
      return { ...response, id };
    } catch (error) {
      const message = error.response?.data?.error || 
                      error.message || 
                      'Failed to delete resource';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const approveOrRejectResource = createAsyncThunk(
  'resources/approve',
  async ({ id, approvalData }, thunkAPI) => {
    try {
      return await resourceService.approveOrRejectResource(id, approvalData);
    } catch (error) {
      const message = error.response?.data?.error || 
                      error.message || 
                      'Failed to update resource approval';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Resource slice
const resourceSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
      state.message = '';
    },
    clearResourceData: (state) => {
      state.resources = [];
      state.resource = null;
      state.count = 0;
    },
    clearResourceMessage: (state) => {
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all public resources
      .addCase(getResources.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getResources.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resources = action.payload.resources;
        state.count = action.payload.count;
      })
      .addCase(getResources.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get my resources (provider)
      .addCase(getMyResources.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyResources.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resources = action.payload.resources;
        state.count = action.payload.count;
      })
      .addCase(getMyResources.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get all resources (admin)
      .addCase(getAllResources.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllResources.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resources = action.payload.resources;
        state.count = action.payload.count;
      })
      .addCase(getAllResources.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get single resource
      .addCase(getResource.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getResource.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resource = action.payload.resource;
      })
      .addCase(getResource.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create resource
      .addCase(createResource.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createResource.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resources.push(action.payload.resource);
        state.count += 1;
        state.message = 'Resource created successfully';
      })
      .addCase(createResource.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update resource
      .addCase(updateResource.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateResource.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the resource in the array
        const index = state.resources.findIndex(r => r.id === action.payload.resource.id);
        if (index !== -1) {
          state.resources[index] = action.payload.resource;
        }
        // Update the single resource view if it matches
        if (state.resource && state.resource.id === action.payload.resource.id) {
          state.resource = action.payload.resource;
        }
        state.message = 'Resource updated successfully';
      })
      .addCase(updateResource.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete resource
      .addCase(deleteResource.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteResource.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the resource from the array
        state.resources = state.resources.filter(r => r.id !== action.payload.id);
        state.count -= 1;
        // Clear the single resource view if it matches
        if (state.resource && state.resource.id === action.payload.id) {
          state.resource = null;
        }
        state.message = 'Resource deleted successfully';
      })
      .addCase(deleteResource.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Approve or reject resource
      .addCase(approveOrRejectResource.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(approveOrRejectResource.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the resource in the array
        const index = state.resources.findIndex(r => r.id === action.payload.resource.id);
        if (index !== -1) {
          state.resources[index] = action.payload.resource;
        }
        // Update the single resource view if it matches
        if (state.resource && state.resource.id === action.payload.resource.id) {
          state.resource = action.payload.resource;
        }
        state.message = action.payload.message;
      })
      .addCase(approveOrRejectResource.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

// Export selectors
export const selectResources = (state) => state.resources.resources;
export const selectResource = (state) => state.resources.resource;
export const selectResourcesLoading = (state) => state.resources.isLoading;
export const selectResourcesError = (state) => state.resources.error;
export const selectResourcesMessage = (state) => state.resources.message;
export const selectResourcesCount = (state) => state.resources.count;

// Export actions
export const { reset, clearResourceData, clearResourceMessage } = resourceSlice.actions;

// Export reducer
export default resourceSlice.reducer;
