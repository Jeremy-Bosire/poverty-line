/**
 * NotFound component for 404 errors
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';

/**
 * NotFound component displayed when a user navigates to a non-existent route
 * 
 * @returns {React.ReactElement} - Rendered component
 */
const NotFound = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 2
        }}
      >
        <ErrorOutlineIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
        
        <Typography variant="h4" component="h1" gutterBottom>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        
        <Box mt={3}>
          <Button
            component={Link}
            to="/dashboard"
            variant="contained"
            color="primary"
            startIcon={<HomeIcon />}
          >
            Go to Dashboard
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;
