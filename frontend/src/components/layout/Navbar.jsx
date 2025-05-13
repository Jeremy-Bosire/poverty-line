/**
 * Responsive Navbar component for navigation
 */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  Container, 
  Avatar, 
  Button, 
  Tooltip, 
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from '../../features/auth/authSlice';
import { ROLES } from '../../routes';

/**
 * Responsive Navbar component that adapts to different screen sizes
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onDrawerToggle - Function to toggle the sidebar drawer
 * @returns {React.ReactElement} - Rendered component
 */
const Navbar = ({ onDrawerToggle }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Handle user menu open/close
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Handle mobile drawer open/close
  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleCloseUserMenu();
  };

  // Navigation items based on user role and authentication status
  const getNavItems = () => {
    if (!isAuthenticated) {
      return [
        { label: 'Login', path: '/login' },
        { label: 'Register', path: '/register' }
      ];
    }

    const items = [
      { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> }
    ];

    // Add provider-specific items
    if (user?.role === ROLES.PROVIDER || user?.role === ROLES.ADMIN) {
      items.push({ 
        label: 'Resources', 
        path: '/resources', 
        icon: <InventoryIcon /> 
      });
    }

    // Add admin-specific items
    if (user?.role === ROLES.ADMIN) {
      items.push({ 
        label: 'Admin', 
        path: '/admin', 
        icon: <AdminPanelSettingsIcon /> 
      });
    }

    return items;
  };

  // User menu items
  const userMenuItems = [
    { label: 'Profile', path: '/profile', icon: <PersonIcon /> },
    { label: 'Logout', action: handleLogout, icon: <LogoutIcon /> }
  ];

  const navItems = getNavItems();
  
  // Drawer content for mobile view
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        PovertyLine
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton 
              component={Link} 
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        {isAuthenticated && (
          <>
            <Divider sx={{ my: 1 }} />
            {userMenuItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton 
                  component={item.path ? Link : 'button'}
                  to={item.path}
                  onClick={item.action}
                  selected={item.path && location.pathname === item.path}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={2}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'white',
          color: 'primary.main'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo - Desktop */}
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                color: 'primary.main',
                textDecoration: 'none',
                alignItems: 'center',
                fontFamily: '"Poppins", sans-serif'
              }}
            >
              PovertyLine
            </Typography>

            {/* Mobile menu icon */}
            <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={onDrawerToggle}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Logo - Mobile */}
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontWeight: 700,
                color: 'primary.main',
                textDecoration: 'none',
                fontFamily: '"Poppins", sans-serif'
              }}
            >
              PovertyLine
            </Typography>

            {/* Desktop navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  to={item.path}
                  sx={{ 
                    my: 2, 
                    color: 'text.primary', 
                    display: 'block',
                    mx: 1,
                    backgroundColor: location.pathname === item.path ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    },
                    fontWeight: location.pathname === item.path ? 'medium' : 'regular',
                    borderRadius: 1
                  }}
                  startIcon={item.icon}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* User menu - Desktop */}
            {isAuthenticated && (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user?.name || 'User'}>
                      {user?.name?.charAt(0) || 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {userMenuItems.map((item) => (
                    <MenuItem 
                      key={item.label} 
                      onClick={item.action || handleCloseUserMenu}
                      component={item.path ? Link : 'li'}
                      to={item.path}
                    >
                      <ListItemIcon>
                        {item.icon}
                      </ListItemIcon>
                      <Typography textAlign="center">{item.label}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}

            {/* Login/Register buttons when not authenticated - Desktop */}
            {!isAuthenticated && (
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Button 
                  variant="text"
                  component={Link} 
                  to="/login"
                  sx={{ 
                    mx: 1,
                    color: 'primary.main'
                  }}
                >
                  Login
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  component={Link} 
                  to="/register"
                  sx={{ 
                    mx: 1,
                    boxShadow: 1
                  }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileDrawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

Navbar.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired
};

export default Navbar;
