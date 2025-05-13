/**
 * Unauthorized component displayed when a user tries to access a restricted route
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/**
 * Unauthorized component that displays an access denied message
 * 
 * @returns {React.ReactElement} - Rendered component
 */
const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

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
          Access Denied
        </Typography>
        
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          You don't have permission to access this page. Please contact your administrator
          if you believe this is an error.
        </Typography>
        
        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={goBack}
          >
            Go Back
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Unauthorized;
