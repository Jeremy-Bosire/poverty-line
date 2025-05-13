/**
 * Sidebar component for desktop navigation
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Typography,
  useTheme,
  Toolbar
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import { ROLES } from '../../routes';

// Sidebar width
const DRAWER_WIDTH = 240;

/**
 * Sidebar component that provides navigation options
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the sidebar is open (mobile only)
 * @param {Function} props.onClose - Function to close the sidebar (mobile only)
 * @param {boolean} props.isMobile - Whether the sidebar is in mobile mode
 * @returns {React.ReactElement} - Rendered component
 */
const Sidebar = ({ open, onClose, isMobile = false }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  const theme = useTheme();

  // Navigation items based on user role and authentication status
  const getNavItems = () => {
    // Public navigation items
    const publicItems = [
      { 
        label: 'Home', 
        path: '/', 
        icon: <HomeIcon />,
        section: 'public'
      },
      { 
        label: 'About', 
        path: '/about', 
        icon: <InfoIcon />,
        section: 'public'
      }
    ];

    // Return only public items if not authenticated
    if (!isAuthenticated) {
      return publicItems;
    }

    // User navigation items
    const userItems = [
      { 
        label: 'Dashboard', 
        path: '/dashboard', 
        icon: <DashboardIcon />,
        section: 'user'
      },
      { 
        label: 'Profile', 
        path: '/profile', 
        icon: <PersonIcon />,
        section: 'user'
      }
    ];

    // Provider navigation items
    const providerItems = user?.role === ROLES.PROVIDER || user?.role === ROLES.ADMIN 
      ? [
          { 
            label: 'Resources', 
            path: '/resources', 
            icon: <InventoryIcon />,
            section: 'provider'
          }
        ] 
      : [];

    // Admin navigation items
    const adminItems = user?.role === ROLES.ADMIN 
      ? [
          { 
            label: 'Admin Panel', 
            path: '/admin', 
            icon: <AdminPanelSettingsIcon />,
            section: 'admin'
          }
        ] 
      : [];

    return [...publicItems, ...userItems, ...providerItems, ...adminItems];
  };

  const navItems = getNavItems();
  
  // Group navigation items by section
  const groupedNavItems = navItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {});

  // Sidebar content
  const sidebarContent = (
    <Box sx={{ 
      width: DRAWER_WIDTH, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Toolbar spacer to push content below app bar */}
      <Toolbar />
      
      <Divider />
      
      {/* Navigation Lists */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', px: 2, py: 1 }}>
        {Object.entries(groupedNavItems).map(([section, items]) => (
          <React.Fragment key={section}>
            {/* Section Title */}
            <Typography 
              variant="overline" 
              sx={{ 
                px: 2, 
                pt: 2, 
                display: 'block',
                color: 'text.secondary',
                fontWeight: 'bold'
              }}
            >
              {section === 'public' ? 'Navigation' : 
               section === 'user' ? 'User' : 
               section === 'provider' ? 'Provider' : 'Admin'}
            </Typography>
            
            {/* Section Items */}
            <List>
              {items.map((item) => (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton 
                    component={Link} 
                    to={item.path}
                    selected={location.pathname === item.path}
                    onClick={isMobile ? onClose : undefined}
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.12)',
                        },
                        '& .MuiListItemIcon-root': {
                          color: 'primary.main',
                        }
                      }
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            
            <Divider sx={{ mt: 1 }} />
          </React.Fragment>
        ))}
      </Box>
      
      {/* Sidebar Footer */}
      <Box sx={{ 
        p: 2, 
        backgroundColor: theme.palette.grey[100],
        borderTop: `1px solid ${theme.palette.divider}`
      }}>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          © {new Date().getFullYear()} PovertyLine
        </Typography>
      </Box>
    </Box>
  );

  // Render permanent drawer for desktop or temporary drawer for mobile
  return isMobile ? (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': { 
          boxSizing: 'border-box', 
          width: DRAWER_WIDTH,
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.default
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  ) : (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { 
          boxSizing: 'border-box', 
          width: DRAWER_WIDTH,
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.default,
          zIndex: theme.zIndex.appBar - 1
        },
      }}
      open
    >
      {sidebarContent}
    </Drawer>
  );
};

export default Sidebar;
