/**
 * Redux store configuration
 */
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import profileReducer from '../features/profile/profileSlice';
import resourceReducer from '../features/resources/resourceSlice';
import adminReducer from '../features/admin/adminSlice';

/**
 * Configure the Redux store with all reducers
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    resources: resourceReducer,
    admin: adminReducer,
    // Add other reducers here as the application grows
  },
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
