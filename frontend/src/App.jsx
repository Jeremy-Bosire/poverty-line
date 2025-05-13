import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from './features/auth/authSlice';
import { ROLES } from './routes';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// Layout Component
import Layout from './components/layout/Layout';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Unauthorized from './components/auth/Unauthorized';

// Public Pages
import Home from './components/Home';
import About from './components/About';

// Lazy-loaded components
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const Profile = lazy(() => import('./components/profile/Profile'));
const Resources = lazy(() => import('./components/resources/Resources'));
const AdminPanel = lazy(() => import('./components/admin/AdminPanel'));
const NotFound = lazy(() => import('./components/common/NotFound'));

// Loading component for suspense fallback
const Loading = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

function App() {
  const dispatch = useDispatch();

  // Check if user is already logged in
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <>
      <CssBaseline />
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Auth Routes for password reset outside main layout */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Main Layout with Navbar */}
            <Route element={<Layout />}>
              {/* Auth Routes with navbar */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              
              {/* Public Resources Route */}
              <Route path="/resources" element={<Resources />} />
              
              {/* Protected Routes - Any authenticated user */}
              <Route element={<ProtectedRoute allowedRoles={[]} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Provider Routes */}
              <Route element={<ProtectedRoute allowedRoles={[ROLES.PROVIDER, ROLES.ADMIN]} />}>
                <Route path="/resources/manage" element={<Resources isManage={true} />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
                <Route path="/admin" element={<AdminPanel />} />
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;
