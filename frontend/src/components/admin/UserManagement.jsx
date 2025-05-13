import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';

// Mock data for users
const mockUsers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'user',
    status: 'active',
    registeredDate: '2025-05-01',
    lastLogin: '2025-05-12'
  },
  {
    id: 2,
    name: 'Community Services Inc.',
    email: 'info@communityservices.org',
    role: 'provider',
    status: 'active',
    registeredDate: '2025-04-15',
    lastLogin: '2025-05-11'
  },
  {
    id: 3,
    name: 'Maria Johnson',
    email: 'maria.j@example.com',
    role: 'user',
    status: 'active',
    registeredDate: '2025-05-10',
    lastLogin: '2025-05-10'
  },
  {
    id: 4,
    name: 'City Shelter Services',
    email: 'contact@cityshelter.org',
    role: 'provider',
    status: 'active',
    registeredDate: '2025-03-22',
    lastLogin: '2025-05-09'
  },
  {
    id: 5,
    name: 'David Williams',
    email: 'david.w@example.com',
    role: 'user',
    status: 'inactive',
    registeredDate: '2025-04-05',
    lastLogin: '2025-04-20'
  },
  {
    id: 6,
    name: 'Sarah Chen',
    email: 'sarah.c@example.com',
    role: 'admin',
    status: 'active',
    registeredDate: '2025-01-15',
    lastLogin: '2025-05-12'
  },
  {
    id: 7,
    name: 'Education Foundation',
    email: 'info@educationfoundation.org',
    role: 'provider',
    status: 'active',
    registeredDate: '2025-02-28',
    lastLogin: '2025-05-08'
  },
  {
    id: 8,
    name: 'Robert Taylor',
    email: 'robert.t@example.com',
    role: 'user',
    status: 'suspended',
    registeredDate: '2025-03-10',
    lastLogin: '2025-04-15'
  },
  {
    id: 9,
    name: 'Career Development Center',
    email: 'info@careercenter.org',
    role: 'provider',
    status: 'active',
    registeredDate: '2025-01-20',
    lastLogin: '2025-05-07'
  },
  {
    id: 10,
    name: 'Emily Johnson',
    email: 'emily.j@example.com',
    role: 'user',
    status: 'active',
    registeredDate: '2025-04-25',
    lastLogin: '2025-05-11'
  }
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    role: '',
    status: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setUsers(mockUsers);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Dialog handlers
  const handleOpenEditDialog = (user) => {
    setSelectedUser(user);
    setEditFormData({
      role: user.role,
      status: user.status
    });
    setOpenEditDialog(true);
  };
  
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedUser(null);
  };
  
  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUser(null);
  };
  
  // Form handlers
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleEditSubmit = async () => {
    setError(null);
    setSuccess(null);
    
    try {
      // This would be replaced with actual API call
      // await userService.updateUser(selectedUser.id, editFormData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedUser.id 
            ? { ...user, ...editFormData } 
            : user
        )
      );
      
      setSuccess('User updated successfully');
      handleCloseEditDialog();
    } catch (err) {
      setError('Failed to update user. Please try again.');
    }
  };
  
  const handleDeleteSubmit = async () => {
    setError(null);
    setSuccess(null);
    
    try {
      // This would be replaced with actual API call
      // await userService.deleteUser(selectedUser.id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUser.id));
      
      setSuccess('User deleted successfully');
      handleCloseDeleteDialog();
    } catch (err) {
      setError('Failed to delete user. Please try again.');
    }
  };
  
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
        User Management
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <TextField
            label="Search Users"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: '200px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: '150px' }}>
            <InputLabel id="role-filter-label">Role</InputLabel>
            <Select
              labelId="role-filter-label"
              id="role-filter"
              value={roleFilter}
              label="Role"
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="provider">Provider</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: '150px' }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Registered</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user.name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role.charAt(0).toUpperCase() + user.role.slice(1)} 
                      color={
                        user.role === 'admin' 
                          ? 'primary' 
                          : user.role === 'provider' 
                            ? 'secondary' 
                            : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.status.charAt(0).toUpperCase() + user.status.slice(1)} 
                      color={
                        user.status === 'active' 
                          ? 'success' 
                          : user.status === 'suspended' 
                            ? 'error' 
                            : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{user.registeredDate}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleOpenEditDialog(user)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleOpenDeleteDialog(user)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No users found matching the criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      
      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Update user information for {selectedUser?.name}
          </DialogContentText>
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="edit-role-label">Role</InputLabel>
            <Select
              labelId="edit-role-label"
              id="edit-role"
              name="role"
              value={editFormData.role}
              label="Role"
              onChange={handleEditFormChange}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="provider">Provider</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="edit-status-label">Status</InputLabel>
            <Select
              labelId="edit-status-label"
              id="edit-status"
              name="status"
              value={editFormData.status}
              label="Status"
              onChange={handleEditFormChange}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete User Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the user "{selectedUser?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteSubmit} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
