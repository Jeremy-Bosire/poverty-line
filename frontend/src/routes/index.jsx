import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole } from '../features/auth/authSlice.jsx';

// Layout components
import MainLayout from '../components/layout/MainLayout';

// Auth components - to be implemented
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import ForgotPassword from '../components/auth/ForgotPassword';

// Public pages - to be implemented
import Home from '../components/Home';
import About from '../components/About';

// Protected pages - to be implemented
import Dashboard from '../components/Dashboard';
import Profile from '../components/profile/Profile';
import ResourcesList from '../components/resources/ResourcesList';
import ResourceDetail from '../components/resources/ResourceDetail';

// Admin pages - to be implemented
import AdminDashboard from '../components/admin/AdminDashboard';
import UserManagement from '../components/admin/UserManagement';
import ResourceApproval from '../components/admin/ResourceApproval';

// Protected route wrapper
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

// Routes configuration
const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { 
        path: 'dashboard', 
        element: <ProtectedRoute><Dashboard /></ProtectedRoute> 
      },
      { 
        path: 'profile', 
        element: <ProtectedRoute><Profile /></ProtectedRoute> 
      },
      { 
        path: 'resources', 
        element: <ResourcesList /> 
      },
      { 
        path: 'resources/:id', 
        element: <ResourceDetail /> 
      },
      { 
        path: 'admin', 
        element: <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'users', element: <UserManagement /> },
          { path: 'resources', element: <ResourceApproval /> }
        ]
      },
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  }
];

// Create router
const router = createBrowserRouter(routes);

export default router;
