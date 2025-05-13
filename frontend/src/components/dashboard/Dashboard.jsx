/**
 * Dashboard component for the main user interface after login
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider
} from '@mui/material';

/**
 * Dashboard component that displays user-specific information and actions
 * 
 * @returns {React.ReactElement} - Rendered component
 */
const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.name || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          This is your PovertyLine dashboard where you can access resources and manage your profile.
        </Typography>
        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          {/* Quick Stats */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader title="Your Profile" />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Role: {user?.role === 'provider' ? 'Resource Provider' : 'Resource Seeker'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {user?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Account Status: Active
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Available Resources */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader title="Available Resources" />
              <CardContent>
                <Typography variant="h3" align="center" sx={{ mb: 2 }}>
                  42
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Resources available in your area
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader title="Recent Activity" />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  • Logged in today at {new Date().toLocaleTimeString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Profile updated 2 days ago
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Resource request submitted last week
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Dashboard;
