/**
 * Role-based access control constants and route configuration
 */

// Role constants for protected routes
export const ROLES = {
  USER: 'user',
  PROVIDER: 'provider',
  ADMIN: 'admin'
};

/**
 * This file has been updated to use the new routing approach in App.jsx
 * The routes are now defined directly in App.jsx using the new React Router v6 approach
 * with nested routes and the Outlet pattern.
 * 
 * This file now only exports the role constants for use in protected routes.
 */
