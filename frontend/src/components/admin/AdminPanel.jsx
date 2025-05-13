/**
 * AdminPanel component for administrative functions
 */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Snackbar,
  FormControlLabel,
  Switch
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

// Import admin actions
import { 
  fetchAllUsers, 
  updateUser, 
  changeUserStatus, 
  fetchAllResources, 
  fetchPendingResources, 
  approveRejectResource,
  clearAdminMessages 
} from '../../features/admin/adminSlice';

// Resource category options for filtering
const resourceCategories = [
  { value: 'all', label: 'All Categories' },
  { value: 'food', label: 'Food' },
  { value: 'housing', label: 'Housing' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'employment', label: 'Employment' },
  { value: 'legal', label: 'Legal' },
  { value: 'financial', label: 'Financial' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'other', label: 'Other' }
];

// Resource status options for filtering
const resourceStatuses = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' }
];

/**
 * AdminPanel component for administrative functions
 * 
 * @returns {React.ReactElement} - Rendered component
 */
const AdminPanel = () => {
  const dispatch = useDispatch();
  const { 
    users, 
    pendingResources, 
    allResources, 
    loading, 
    error, 
    success, 
    message 
  } = useSelector(state => state.admin);

  // Local state
  const [tabValue, setTabValue] = useState(0);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [openResourceDialog, setOpenResourceDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setOpenUserDialog(true);
  };

  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
  };

  // Load data when component mounts
  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllResources());
    dispatch(fetchPendingResources());
    
    // Clear any messages or errors when component unmounts
    return () => {
      dispatch(clearAdminMessages());
    };
  }, [dispatch]);
  
  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    dispatch(clearAdminMessages());
  };
  
  // Show snackbar when success or error occurs
  useEffect(() => {
    if (success || error) {
      setShowSnackbar(true);
    }
  }, [success, error]);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveUser = () => {
    dispatch(updateUser({ 
      userId: currentUser.id, 
      userData: currentUser 
    }));
    setOpenUserDialog(false);
  };

  const handleToggleUserStatus = (userId) => {
    const userToUpdate = users.find(user => user.id === userId);
    if (userToUpdate) {
      const newStatus = userToUpdate.status === 'active' ? 'inactive' : 'active';
      dispatch(changeUserStatus({ userId, status: newStatus }));
    }
  };
  
  // Handle resource approval
  const handleApproveResource = (resourceId) => {
    dispatch(approveRejectResource({ 
      resourceId, 
      status: 'approved' 
    }));
  };
  
  // Open rejection dialog
  const handleOpenRejectDialog = (resourceId) => {
    setSelectedResourceId(resourceId);
    setRejectionReason('');
    setOpenResourceDialog(true);
  };
  
  // Close rejection dialog
  const handleCloseResourceDialog = () => {
    setOpenResourceDialog(false);
    setSelectedResourceId(null);
    setRejectionReason('');
  };
  
  // Submit resource rejection
  const handleRejectResource = () => {
    if (selectedResourceId) {
      dispatch(approveRejectResource({ 
        resourceId: selectedResourceId, 
        status: 'rejected', 
        rejectionReason 
      }));
      handleCloseResourceDialog();
    }
  };
  
  // Filter resources by status and category
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    if (event.target.value !== 'all') {
      dispatch(fetchAllResources({ status: event.target.value, category: categoryFilter !== 'all' ? categoryFilter : undefined }));
    } else {
      dispatch(fetchAllResources({ category: categoryFilter !== 'all' ? categoryFilter : undefined }));
    }
  };
  
  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value);
    if (event.target.value !== 'all') {
      dispatch(fetchAllResources({ category: event.target.value, status: statusFilter !== 'all' ? statusFilter : undefined }));
    } else {
      dispatch(fetchAllResources({ status: statusFilter !== 'all' ? statusFilter : undefined }));
    }
  };

  // Filter resources based on status filter
  const getFilteredResources = () => {
    if (!allResources) return [];
    
    // Filtering is handled by the API, so we just return what we have
    return allResources;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Panel
      </Typography>
      
      {/* Success/Error Messages */}
      <Snackbar 
        open={showSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={error ? "error" : "success"} 
          sx={{ width: '100%' }}
        >
          {error || message}
        </Alert>
      </Snackbar>
      
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
            <Tab label="Users" id="tab-0" />
            <Tab label="Resources" id="tab-1" />
            <Tab label="System Settings" id="tab-2" />
          </Tabs>
        </Box>
        
        {/* Users Tab */}
        {tabValue === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              User Management
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
                <CircularProgress />
              </Box>
            ) : users && users.length > 0 ? (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table aria-label="users table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role} 
                            color={
                              user.role === 'admin' ? 'error' : 
                              user.role === 'provider' ? 'warning' : 'info'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.status} 
                            color={user.status === 'active' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{new Date(user.created_at || user.created).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <IconButton aria-label="edit" size="small" onClick={() => handleEditUser(user)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            aria-label="toggle status" 
                            size="small"
                            onClick={() => handleToggleUserStatus(user.id)}
                            color={user.status === 'active' ? 'default' : 'success'}
                          >
                            {user.status === 'active' ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  No users found
                </Typography>
              </Box>
            )}
          </Box>
        )}
        
        {/* Resources Tab */}
        {tabValue === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Resource Management
            </Typography>
            
            {/* Filter controls */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={handleStatusFilterChange}
                  >
                    {resourceStatuses.map(status => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    label="Category"
                    onChange={handleCategoryFilterChange}
                  >
                    {resourceCategories.map(category => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            {/* Pending Resources */}
            {pendingResources && pendingResources.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }} color="warning.main">
                  Pending Approvals ({pendingResources.length})
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Provider</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Submitted On</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingResources.map((resource) => (
                        <TableRow key={resource.id}>
                          <TableCell>{resource.title || resource.name}</TableCell>
                          <TableCell>{resource.category || resource.type}</TableCell>
                          <TableCell>{resource.provider_name || resource.provider}</TableCell>
                          <TableCell>{resource.city || 'N/A'}</TableCell>
                          <TableCell>{new Date(resource.created_at || resource.created).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <IconButton 
                              size="small" 
                              color="success"
                              title="Approve resource"
                              onClick={() => handleApproveResource(resource.id)}
                            >
                              <ThumbUpIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error"
                              title="Reject resource"
                              onClick={() => handleOpenRejectDialog(resource.id)}
                            >
                              <ThumbDownIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
            
            {/* All Resources */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
                <CircularProgress />
              </Box>
            ) : getFilteredResources().length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Provider</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getFilteredResources().map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell>{resource.title || resource.name}</TableCell>
                        <TableCell>{resource.category || resource.type}</TableCell>
                        <TableCell>{resource.provider_name || resource.provider}</TableCell>
                        <TableCell>
                          <Chip 
                            label={resource.status} 
                            color={
                              resource.status === 'approved' || resource.status === 'active'
                                ? 'success' 
                                : resource.status === 'pending' 
                                  ? 'warning' 
                                  : 'error'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{resource.city || 'N/A'}</TableCell>
                        <TableCell>{new Date(resource.created_at || resource.created).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {resource.status === 'pending' ? (
                            <>
                              <IconButton 
                                size="small" 
                                color="success"
                                title="Approve resource"
                                onClick={() => handleApproveResource(resource.id)}
                              >
                                <ThumbUpIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                color="error"
                                title="Reject resource"
                                onClick={() => handleOpenRejectDialog(resource.id)}
                              >
                                <ThumbDownIcon fontSize="small" />
                              </IconButton>
                            </>
                          ) : (
                            <IconButton 
                              size="small" 
                              color={resource.status === 'approved' || resource.status === 'active' ? 'default' : 'success'}
                              title={resource.status === 'approved' || resource.status === 'active' ? 'Deactivate resource' : 'Activate resource'}
                              onClick={() => {
                                if (resource.status === 'rejected') {
                                  handleApproveResource(resource.id);
                                } else {
                                  handleOpenRejectDialog(resource.id);
                                }
                              }}
                            >
                              {resource.status === 'approved' || resource.status === 'active'
                                ? <BlockIcon fontSize="small" /> 
                                : <CheckCircleIcon fontSize="small" />}
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  No resources found
                </Typography>
              </Box>
            )}
          </Box>
        )}
        
        {/* System Settings Tab */}
        {tabValue === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              System Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Application Settings
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Application Name"
                      value="PovertyLine"
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Support Email"
                      value="support@povertyline.org"
                      margin="normal"
                    />
                    <Button variant="contained" sx={{ mt: 2 }}>
                      Save Settings
                    </Button>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Maintenance
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button variant="outlined" color="error" sx={{ mr: 2 }}>
                      Clear Cache
                    </Button>
                    <Button variant="outlined">
                      Backup Database
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
      
      {/* Edit User Dialog */}
      <Dialog open={openUserDialog} onClose={handleCloseUserDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {currentUser && (
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={currentUser.name}
                  onChange={handleUserChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={currentUser.email}
                  onChange={handleUserChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={currentUser.role}
                    label="Role"
                    onChange={handleUserChange}
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="provider">Provider</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={currentUser.status}
                    label="Status"
                    onChange={handleUserChange}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDialog}>Cancel</Button>
          <Button onClick={handleSaveUser} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Resource Rejection Dialog */}
      <Dialog open={openResourceDialog} onClose={handleCloseResourceDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Resource</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
            Please provide a reason for rejecting this resource. This information will be shared with the provider.
          </Typography>
          <TextField
            fullWidth
            label="Rejection Reason"
            multiline
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="E.g., Insufficient information provided, contact information missing, etc."
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResourceDialog}>Cancel</Button>
          <Button 
            onClick={handleRejectResource} 
            variant="contained" 
            color="error"
            disabled={!rejectionReason.trim()}
          >
            Reject Resource
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPanel;
