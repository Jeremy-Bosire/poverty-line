/**
 * Redux slice for profile state management
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import profileService from '../../services/profileService';

// Initial state
const initialState = {
  profile: null,
  isLoading: false,
  error: null,
  message: '',
  completionPercentage: 0,
  isComplete: false
};

// Async thunks for profile operations
export const getCurrentProfile = createAsyncThunk(
  'profile/getCurrentProfile',
  async (_, thunkAPI) => {
    try {
      return await profileService.getCurrentUserProfile();
    } catch (error) {
      const message = error.response?.data?.error || 
                      error.message || 
                      'Failed to get profile data';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData, thunkAPI) => {
    try {
      return await profileService.updateProfile(profileData);
    } catch (error) {
      const message = error.response?.data?.error || 
                      error.message || 
                      'Failed to update profile';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Profile slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
      state.message = '';
    },
    clearProfile: (state) => {
      state.profile = null;
      state.completionPercentage = 0;
      state.isComplete = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get current profile cases
      .addCase(getCurrentProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.completionPercentage = action.payload.completion_percentage;
        state.isComplete = action.payload.is_complete;
      })
      .addCase(getCurrentProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update profile cases
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.completionPercentage = action.payload.completion_percentage;
        state.isComplete = action.payload.is_complete;
        state.message = 'Profile updated successfully';
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

// Export selectors
export const selectProfile = (state) => state.profile.profile;
export const selectProfileLoading = (state) => state.profile.isLoading;
export const selectProfileError = (state) => state.profile.error;
export const selectProfileMessage = (state) => state.profile.message;
export const selectCompletionPercentage = (state) => state.profile.completionPercentage;
export const selectIsComplete = (state) => state.profile.isComplete;

// Export actions
export const { reset, clearProfile } = profileSlice.actions;

// Export reducer
export default profileSlice.reducer;
