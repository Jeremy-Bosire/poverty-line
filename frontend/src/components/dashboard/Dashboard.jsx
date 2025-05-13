/**
 * Dashboard component for the main user interface after login
 */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoIcon from '@mui/icons-material/Info';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

// Redux
import { selectUser } from '../../features/auth/authSlice';
import { 
  getCurrentProfile, 
  selectProfile, 
  selectProfileLoading, 
  selectCompletionPercentage, 
  selectIsComplete 
} from '../../features/profile/profileSlice';
import { 
  getResources, 
  selectResources, 
  selectResourcesLoading 
} from '../../features/resources/resourceSlice';

/**
 * Dashboard component that displays user-specific information and actions
 * 
 * @returns {React.ReactElement} - Rendered component
 */
const Dashboard = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Redux selectors
  const user = useSelector(selectUser);
  const profile = useSelector(selectProfile);
  const profileLoading = useSelector(selectProfileLoading);
  const completionPercentage = useSelector(selectCompletionPercentage);
  const isProfileComplete = useSelector(selectIsComplete);
  const resources = useSelector(selectResources);
  const resourcesLoading = useSelector(selectResourcesLoading);
  
  // Local state for activity log
  const [activityLog, setActivityLog] = useState([
    { action: 'Logged in', timestamp: new Date() }
  ]);
  
  // Load profile and resources data when component mounts
  useEffect(() => {
    dispatch(getCurrentProfile());
    dispatch(getResources());
    
    // Add a login activity to the activity log
    setActivityLog(prev => [
      { action: 'Logged in', timestamp: new Date() },
      ...prev.slice(0, 4) // Keep only the 5 most recent activities
    ]);
  }, [dispatch]);
  
  // When profile is loaded/updated, add to activity log
  useEffect(() => {
    if (profile && !profileLoading) {
      setActivityLog(prev => [
        { action: 'Profile updated', timestamp: new Date() },
        ...prev.slice(0, 4)
      ]);
    }
  }, [profile, profileLoading]);
  
  // Format the activity timestamp
  const formatActivityTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 2, md: 4 } }}>
      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.name || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          This is your PovertyLine dashboard where you can access resources and manage your profile.
        </Typography>
        
        {/* Profile Completion Alert - Only show if profile is incomplete */}
        {profile && !isProfileComplete && (
          <Alert 
            severity="info" 
            sx={{ mb: 3 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                component={Link} 
                to="/profile"
                startIcon={<EditIcon />}
              >
                Complete
              </Button>
            }
          >
            Your profile is {completionPercentage}% complete. Complete your profile to better match you with available resources.
          </Alert>
        )}
        
        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          {/* Profile Summary Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader 
                title="Your Profile" 
                action={
                  <Chip 
                    icon={isProfileComplete ? <CheckCircleIcon /> : <ErrorOutlineIcon />}
                    label={isProfileComplete ? "Complete" : "Incomplete"}
                    color={isProfileComplete ? "success" : "warning"}
                    size="small"
                  />
                }
              />
              <CardContent sx={{ pb: 0 }}>
                {profileLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Role:</strong> {user?.role === 'provider' ? 'Resource Provider' : 'Resource Seeker'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Email:</strong> {user?.email}
                      </Typography>
                      {profile?.phone && (
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Phone:</strong> {profile.phone}
                        </Typography>
                      )}
                      {profile?.city && profile?.state && (
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Location:</strong> {profile.city}, {profile.state}
                        </Typography>
                      )}
                    </Box>
                    
                    {/* Profile completion progress */}
                    <Box sx={{ mt: 2, mb: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Profile Completion:
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={completionPercentage} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          mb: 1
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {completionPercentage}% Complete
                      </Typography>
                    </Box>
                  </>
                )}
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  component={Link} 
                  to="/profile"
                  startIcon={<EditIcon />}
                >
                  Edit Profile
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Resources Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader title="Available Resources" />
              <CardContent sx={{ pb: 0 }}>
                {resourcesLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <>
                    <Typography variant="h3" align="center" sx={{ mb: 2 }}>
                      {resources ? resources.length : 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
                      Resources available in your area
                    </Typography>
                    
                    {profile?.needs && profile.needs.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Your needs:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                          {profile.needs.map((need, index) => (
                            <Chip 
                              key={index} 
                              label={need} 
                              size="small" 
                              variant="outlined"
                              sx={{ mb: 1 }} 
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </>
                )}
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  component={Link} 
                  to="/resources"
                  startIcon={<SearchIcon />}
                >
                  Browse Resources
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Recent Activity Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader title="Recent Activity" />
              <CardContent>
                {activityLog.length > 0 ? (
                  <List dense disablePadding>
                    {activityLog.map((activity, index) => (
                      <ListItem key={index} disablePadding sx={{ pb: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <InfoIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.action}
                          secondary={formatActivityTime(activity.timestamp)}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center">
                    No recent activity
                  </Typography>
                )}
              </CardContent>
              {user?.role === 'provider' && (
                <CardActions>
                  <Button 
                    size="small" 
                    component={Link} 
                    to="/resources/manage"
                    startIcon={<MoreHorizIcon />}
                  >
                    Manage Resources
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Dashboard;
