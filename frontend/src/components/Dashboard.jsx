import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { selectCurrentUser } from '../features/auth/authSlice.jsx';

const Dashboard = () => {
  const user = useSelector(selectCurrentUser);
  const [isLoading, setIsLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Simulate loading data
  useEffect(() => {
    // This would be replaced with actual API calls
    const timer = setTimeout(() => {
      setResources([
        { id: 1, title: 'Food Assistance Program', category: 'Food', location: 'Downtown', status: 'Available' },
        { id: 2, title: 'Housing Support', category: 'Housing', location: 'Eastside', status: 'Available' },
        { id: 3, title: 'Job Training Workshop', category: 'Employment', location: 'Westside', status: 'Upcoming' }
      ]);
      
      setNotifications([
        { id: 1, message: 'Your profile is 70% complete', type: 'info', date: '2025-05-12' },
        { id: 2, message: 'New food resources available in your area', type: 'new', date: '2025-05-11' },
        { id: 3, message: 'Housing application status updated', type: 'update', date: '2025-05-10' }
      ]);
      
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user?.name || 'User'}
      </Typography>
      
      <Typography variant="body1" paragraph color="text.secondary">
        Here's an overview of your current status and available resources.
      </Typography>
      
      <Grid container spacing={3}>
        {/* Profile Completion Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Profile Completion
            </Typography>
            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
              <CircularProgress variant="determinate" value={70} size={80} />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="caption" component="div" color="text.secondary">
                  70%
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Complete your profile to improve resource matching.
            </Typography>
            <Button variant="outlined" size="small">
              Update Profile
            </Button>
          </Paper>
        </Grid>
        
        {/* Recommended Resources Card */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recommended Resources
            </Typography>
            {resources.length > 0 ? (
              <List>
                {resources.map((resource) => (
                  <ListItem key={resource.id} alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemIcon>
                      <VolunteerActivismIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={resource.title}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {resource.category}
                          </Typography>
                          {` — ${resource.location}`}
                        </>
                      }
                    />
                    <Chip 
                      label={resource.status} 
                      color={resource.status === 'Available' ? 'success' : 'primary'} 
                      size="small" 
                      variant="outlined"
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No resources found. Update your profile to get personalized recommendations.
              </Typography>
            )}
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" size="small">
                View All Resources
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Recent Activity Card */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Notifications
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {notifications.length > 0 ? (
              <List>
                {notifications.map((notification) => (
                  <ListItem key={notification.id} alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemIcon>
                      {notification.type === 'info' && <AssignmentIcon color="info" />}
                      {notification.type === 'new' && <NotificationsIcon color="primary" />}
                      {notification.type === 'update' && <CheckCircleIcon color="success" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={notification.message}
                      secondary={`Date: ${notification.date}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No recent notifications.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
