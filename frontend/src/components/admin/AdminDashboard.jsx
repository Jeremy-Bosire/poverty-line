import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Tabs, 
  Tab, 
  Card, 
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    resources: 0,
    pendingApprovals: 0,
    activeUsers: 0
  });
  
  // Set active tab based on current path
  useEffect(() => {
    if (location.pathname === '/admin') {
      setActiveTab(0);
    } else if (location.pathname === '/admin/users') {
      setActiveTab(1);
    } else if (location.pathname === '/admin/resources') {
      setActiveTab(2);
    }
  }, [location.pathname]);
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        users: 125,
        resources: 48,
        pendingApprovals: 7,
        activeUsers: 83
      });
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    
    if (newValue === 0) {
      navigate('/admin');
    } else if (newValue === 1) {
      navigate('/admin/users');
    } else if (newValue === 2) {
      navigate('/admin/resources');
    }
  };
  
  // If we're on a sub-route, render the Outlet
  if (location.pathname !== '/admin') {
    return <Outlet />;
  }
  
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
        Admin Dashboard
      </Typography>
      
      <Paper sx={{ mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Overview" icon={<AssessmentIcon />} iconPosition="start" />
          <Tab label="User Management" icon={<PeopleIcon />} iconPosition="start" />
          <Tab label="Resource Approval" icon={<VolunteerActivismIcon />} iconPosition="start" />
        </Tabs>
      </Paper>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
            <PeopleIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h4" component="div">
              {stats.users}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Users
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
            <VolunteerActivismIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h4" component="div">
              {stats.resources}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Resources
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center', height: '100%', bgcolor: stats.pendingApprovals > 0 ? 'warning.light' : 'inherit' }}>
            <AssessmentIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h4" component="div">
              {stats.pendingApprovals}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending Approvals
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
            <PeopleIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h4" component="div">
              {stats.activeUsers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Users
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent User Registrations
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="John Smith" 
                    secondary="Registered: May 12, 2025 - User" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Community Services Inc." 
                    secondary="Registered: May 11, 2025 - Provider" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Maria Johnson" 
                    secondary="Registered: May 10, 2025 - User" 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Resource Submissions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                <ListItem>
                  <ListItemIcon>
                    <VolunteerActivismIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Food Assistance Program" 
                    secondary="Submitted: May 12, 2025 - Pending Approval" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <VolunteerActivismIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Job Training Workshop" 
                    secondary="Submitted: May 11, 2025 - Approved" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <VolunteerActivismIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Emergency Housing Support" 
                    secondary="Submitted: May 10, 2025 - Approved" 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
