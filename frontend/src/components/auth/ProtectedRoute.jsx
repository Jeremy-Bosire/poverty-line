/**
 * Protected Route component for handling role-based access control
 */
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

/**
 * ProtectedRoute component that restricts access based on user authentication and roles
 * 
 * @param {Object} props - Component props
 * @param {string[]} props.allowedRoles - Array of roles allowed to access the route
 * @returns {React.ReactElement} - Rendered component
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If no specific roles are required or user has the required role, render the route
  if (!allowedRoles || allowedRoles.length === 0 || allowedRoles.includes(user.role)) {
    return <Outlet />;
  }

  // If user doesn't have the required role, redirect to unauthorized page
  return <Navigate to="/unauthorized" replace />;
};

ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string)
};

ProtectedRoute.defaultProps = {
  allowedRoles: []
};

export default ProtectedRoute;
