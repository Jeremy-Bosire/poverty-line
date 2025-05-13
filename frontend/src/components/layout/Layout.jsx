/**
 * Main Layout component that wraps the application content
 * 
 * This component implements a professional dashboard layout with:
 * - Fixed position app bar at the top
 * - Persistent sidebar on desktop, drawer on mobile
 * - Main content area with proper spacing
 * - Sticky footer
 */
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, useMediaQuery, useTheme, Toolbar } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

// Sidebar width constant - must match the one in Sidebar.jsx
const DRAWER_WIDTH = 240;

/**
 * Layout component that provides consistent structure across all pages
 * 
 * @returns {React.ReactElement} - Rendered component
 */
const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar - fixed at the top */}
      <Navbar onDrawerToggle={handleDrawerToggle} />
      
      {/* Permanent sidebar for desktop */}
      <Sidebar />
      
      {/* Mobile sidebar */}
      <Sidebar 
        isMobile={true} 
        open={mobileDrawerOpen} 
        onClose={handleDrawerToggle} 
      />
      
      {/* Main content area */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { xs: 0, md: `${DRAWER_WIDTH}px` },
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Toolbar spacer to push content below app bar */}
        <Toolbar />
        
        {/* Main content */}
        <Container 
          maxWidth="lg" 
          sx={{ 
            flexGrow: 1, 
            py: 3, 
            px: { xs: 2, sm: 3 },
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Outlet />
        </Container>
        
        {/* Footer */}
        <Box 
          component="footer" 
          sx={{ 
            py: 3, 
            px: 2, 
            mt: 'auto', 
            backgroundColor: theme.palette.grey[100],
            borderTop: `1px solid ${theme.palette.divider}`
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ mb: 1 }}>
                © {new Date().getFullYear()} PovertyLine
              </Box>
              <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                Connecting those in need with resources to help
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
