/**
 * AdminPanel component for administrative functions
 */
import React, { useState } from 'react';
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
  InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';

// Mock data for users
const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    status: 'active',
    created: '2023-01-15'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'provider',
    status: 'active',
    created: '2023-02-20'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'user',
    status: 'inactive',
    created: '2023-03-10'
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'provider',
    status: 'active',
    created: '2023-04-05'
  },
  {
    id: 5,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    created: '2023-01-01'
  }
];

// Mock data for resources
const mockResources = [
  {
    id: 1,
    name: 'Food Pantry',
    type: 'food',
    provider: 'Jane Smith',
    status: 'active',
    created: '2023-02-25'
  },
  {
    id: 2,
    name: 'Job Training Workshop',
    type: 'education',
    provider: 'Alice Brown',
    status: 'active',
    created: '2023-04-10'
  },
  {
    id: 3,
    name: 'Medical Clinic',
    type: 'healthcare',
    provider: 'Jane Smith',
    status: 'pending',
    created: '2023-05-01'
  }
];

/**
 * AdminPanel component for administrative functions
 * 
 * @returns {React.ReactElement} - Rendered component
 */
const AdminPanel = () => {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState(mockUsers);
  const [resources, setResources] = useState(mockResources);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveUser = () => {
    setUsers(prev => 
      prev.map(user => user.id === currentUser.id ? currentUser : user)
    );
    setOpenUserDialog(false);
  };

  const handleToggleUserStatus = (userId) => {
    setUsers(prev => 
      prev.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            status: user.status === 'active' ? 'inactive' : 'active'
          };
        }
        return user;
      })
    );
  };

  const handleToggleResourceStatus = (resourceId) => {
    setResources(prev => 
      prev.map(resource => {
        if (resource.id === resourceId) {
          return {
            ...resource,
            status: resource.status === 'active' ? 'inactive' : 'active'
          };
        }
        return resource;
      })
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Panel
      </Typography>
      
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
            <TableContainer>
              <Table>
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
                            user.role === 'admin' 
                              ? 'error' 
                              : user.role === 'provider' 
                                ? 'primary' 
                                : 'default'
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
                      <TableCell>{user.created}</TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditUser(user)}
                          title="Edit user"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleToggleUserStatus(user.id)}
                          color={user.status === 'active' ? 'default' : 'primary'}
                          title={user.status === 'active' ? 'Deactivate user' : 'Activate user'}
                        >
                          {user.status === 'active' 
                            ? <BlockIcon fontSize="small" /> 
                            : <CheckCircleIcon fontSize="small" />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        
        {/* Resources Tab */}
        {tabValue === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Resource Management
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Provider</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell>{resource.name}</TableCell>
                      <TableCell>{resource.type}</TableCell>
                      <TableCell>{resource.provider}</TableCell>
                      <TableCell>
                        <Chip 
                          label={resource.status} 
                          color={
                            resource.status === 'active' 
                              ? 'success' 
                              : resource.status === 'pending' 
                                ? 'warning' 
                                : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{resource.created}</TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleToggleResourceStatus(resource.id)}
                          color={resource.status === 'active' ? 'default' : 'primary'}
                          title={resource.status === 'active' ? 'Deactivate resource' : 'Activate resource'}
                        >
                          {resource.status === 'active' 
                            ? <BlockIcon fontSize="small" /> 
                            : <CheckCircleIcon fontSize="small" />}
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          title="Delete resource"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
    </Container>
  );
};

export default AdminPanel;
