import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Import reducers
import authReducer from '../features/auth/authSlice.jsx';
// We'll add these as we develop the features
// import profileReducer from '../features/profile/profileSlice';
// import resourcesReducer from '../features/resources/resourcesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // profile: profileReducer,
    // resources: resourcesReducer,
    // Add more reducers as needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [],
        // Ignore these field paths in all actions
        ignoredActionPaths: [],
        // Ignore these paths in the state
        ignoredPaths: [],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
// See `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export default store;
