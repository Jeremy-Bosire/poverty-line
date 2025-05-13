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
  Alert,
  Card,
  CardContent,
  CardActions,
  Collapse,
  Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CategoryIcon from '@mui/icons-material/Category';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Mock data for resources pending approval
const mockPendingResources = [
  {
    id: 1,
    title: 'Food Assistance Program',
    provider: 'Community Food Bank',
    providerEmail: 'info@communityfoodbank.org',
    category: 'Food',
    location: 'Downtown',
    description: 'Weekly food distribution for families in need. No registration required.',
    date: '2025-05-20',
    status: 'pending',
    submittedDate: '2025-05-12',
    contactName: 'John Smith',
    contactPhone: '(555) 123-4567',
    contactEmail: 'info@communityfoodbank.org',
    address: '123 Main St, Downtown',
    requirements: [
      'Photo ID',
      'Proof of residence',
      'Income verification (if available)'
    ],
    additionalInfo: 'Distribution occurs every Tuesday from 10am to 2pm. Please bring your own bags or containers.'
  },
  {
    id: 2,
    title: 'Mental Health Support Group',
    provider: 'Wellness Center',
    providerEmail: 'support@wellnesscenter.org',
    category: 'Healthcare',
    location: 'Eastside',
    description: 'Weekly support group for individuals dealing with anxiety and depression.',
    date: '2025-05-25',
    status: 'pending',
    submittedDate: '2025-05-11',
    contactName: 'Sarah Johnson',
    contactPhone: '(555) 987-6543',
    contactEmail: 'groups@wellnesscenter.org',
    address: '456 Health Ave, Eastside',
    requirements: [
      'Pre-registration required',
      '18 years or older',
      'Initial intake assessment'
    ],
    additionalInfo: 'Groups meet every Wednesday from 6pm to 7:30pm. All information shared in the group is confidential.'
  },
  {
    id: 3,
    title: 'Financial Literacy Workshop',
    provider: 'Community Credit Union',
    providerEmail: 'workshops@communitycredit.org',
    category: 'Financial',
    location: 'Westside',
    description: 'Learn basic financial skills including budgeting, saving, and understanding credit.',
    date: '2025-05-30',
    status: 'pending',
    submittedDate: '2025-05-10',
    contactName: 'Michael Brown',
    contactPhone: '(555) 456-7890',
    contactEmail: 'michael.b@communitycredit.org',
    address: '789 Finance St, Westside',
    requirements: [
      'Registration required',
      'Bring a notebook and pen',
      'Optional: recent bank statements or bills for personalized advice'
    ],
    additionalInfo: 'Workshop runs from 10am to 2pm with a lunch break. Light refreshments will be provided.'
  },
  {
    id: 4,
    title: 'Legal Aid Clinic',
    provider: 'Justice For All',
    providerEmail: 'help@justiceforall.org',
    category: 'Legal',
    location: 'Downtown',
    description: 'Free legal consultation for low-income individuals.',
    date: '2025-05-22',
    status: 'pending',
    submittedDate: '2025-05-09',
    contactName: 'Robert Davis',
    contactPhone: '(555) 234-5678',
    contactEmail: 'legal@justiceforall.org',
    address: '321 Court St, Downtown',
    requirements: [
      'Proof of income',
      'Photo ID',
      'Any relevant legal documents'
    ],
    additionalInfo: 'Consultations are by appointment only. Each session lasts approximately 30 minutes.'
  },
  {
    id: 5,
    title: 'Computer Skills Training',
    provider: 'Digital Literacy Foundation',
    providerEmail: 'training@digitalliteracy.org',
    category: 'Education',
    location: 'Northside',
    description: 'Basic computer skills training for beginners, including email, internet, and Microsoft Office.',
    date: '2025-06-05',
    status: 'pending',
    submittedDate: '2025-05-08',
    contactName: 'Lisa Chen',
    contactPhone: '(555) 876-5432',
    contactEmail: 'classes@digitalliteracy.org',
    address: '654 Tech Blvd, Northside',
    requirements: [
      'Registration required',
      'No prior computer experience necessary',
      'Ages 16 and up'
    ],
    additionalInfo: 'Classes run twice a week for 4 weeks. Computers are provided during class time.'
  }
];

// Resource statuses
const statuses = [
  'all',
  'pending',
  'approved',
  'rejected'
];

// Resource categories
const categories = [
  'All Categories',
  'Food',
  'Housing',
  'Healthcare',
  'Employment',
  'Education',
  'Transportation',
  'Financial',
  'Legal'
];

const ResourceApproval = () => {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedResource, setSelectedResource] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setResources(mockPendingResources);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter resources based on search and filters
  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === 'All Categories' || resource.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || resource.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
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
  const handleOpenViewDialog = (resource) => {
    setSelectedResource(resource);
    setOpenViewDialog(true);
  };
  
  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedResource(null);
  };
  
  const handleOpenApproveDialog = (resource) => {
    setSelectedResource(resource);
    setOpenApproveDialog(true);
  };
  
  const handleCloseApproveDialog = () => {
    setOpenApproveDialog(false);
    setSelectedResource(null);
  };
  
  const handleOpenRejectDialog = (resource) => {
    setSelectedResource(resource);
    setOpenRejectDialog(true);
  };
  
  const handleCloseRejectDialog = () => {
    setOpenRejectDialog(false);
    setSelectedResource(null);
    setRejectionReason('');
  };
  
  // Expand/collapse card
  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  // Approval/rejection handlers
  const handleApproveResource = async () => {
    setError(null);
    setSuccess(null);
    
    try {
      // This would be replaced with actual API call
      // await resourceService.approveResource(selectedResource.id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setResources(prevResources => 
        prevResources.map(resource => 
          resource.id === selectedResource.id 
            ? { ...resource, status: 'approved' } 
            : resource
        )
      );
      
      setSuccess(`Resource "${selectedResource.title}" has been approved`);
      handleCloseApproveDialog();
    } catch (err) {
      setError('Failed to approve resource. Please try again.');
    }
  };
  
  const handleRejectResource = async () => {
    setError(null);
    setSuccess(null);
    
    if (!rejectionReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }
    
    try {
      // This would be replaced with actual API call
      // await resourceService.rejectResource(selectedResource.id, rejectionReason);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setResources(prevResources => 
        prevResources.map(resource => 
          resource.id === selectedResource.id 
            ? { ...resource, status: 'rejected' } 
            : resource
        )
      );
      
      setSuccess(`Resource "${selectedResource.title}" has been rejected`);
      handleCloseRejectDialog();
    } catch (err) {
      setError('Failed to reject resource. Please try again.');
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
        Resource Approval
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
            label="Search Resources"
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
            <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
              labelId="category-filter-label"
              id="category-filter"
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
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
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>
      
      {/* Card-based view for resources */}
      <Grid container spacing={3}>
        {filteredResources
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((resource) => (
            <Grid item xs={12} key={resource.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h2">
                      {resource.title}
                    </Typography>
                    <Chip 
                      label={resource.status.charAt(0).toUpperCase() + resource.status.slice(1)} 
                      color={
                        resource.status === 'approved' 
                          ? 'success' 
                          : resource.status === 'rejected' 
                            ? 'error' 
                            : 'warning'
                      }
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Provider: {resource.provider} ({resource.providerEmail})
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    {resource.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                    <Chip 
                      icon={<CategoryIcon />} 
                      label={resource.category} 
                      size="small" 
                    />
                    <Chip 
                      icon={<LocationOnIcon />} 
                      label={resource.location} 
                      size="small" 
                    />
                    <Chip 
                      icon={<PersonIcon />} 
                      label={`Submitted: ${resource.submittedDate}`} 
                      size="small" 
                    />
                  </Box>
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box>
                    <Button
                      size="small"
                      startIcon={<ExpandMoreIcon 
                        sx={{ 
                          transform: expandedId === resource.id ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s'
                        }} 
                      />}
                      onClick={() => handleExpandClick(resource.id)}
                    >
                      {expandedId === resource.id ? 'Show Less' : 'Show More'}
                    </Button>
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleOpenViewDialog(resource)}
                      sx={{ ml: 1 }}
                    >
                      View Details
                    </Button>
                  </Box>
                  
                  {resource.status === 'pending' && (
                    <Box>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => handleOpenRejectDialog(resource)}
                        sx={{ mr: 1 }}
                      >
                        Reject
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleOpenApproveDialog(resource)}
                      >
                        Approve
                      </Button>
                    </Box>
                  )}
                </CardActions>
                
                <Collapse in={expandedId === resource.id} timeout="auto" unmountOnExit>
                  <CardContent sx={{ pt: 0 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Contact Information:
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {resource.contactName} | {resource.contactPhone} | {resource.contactEmail}
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Address:
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {resource.address}
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Requirements:
                    </Typography>
                    <ul>
                      {resource.requirements.map((req, index) => (
                        <li key={index}>
                          <Typography variant="body2">
                            {req}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Additional Information:
                    </Typography>
                    <Typography variant="body2">
                      {resource.additionalInfo}
                    </Typography>
                  </CardContent>
                </Collapse>
              </Card>
            </Grid>
          ))}
      </Grid>
      
      {filteredResources.length === 0 && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            No resources found matching the criteria
          </Typography>
        </Paper>
      )}
      
      <Box sx={{ mt: 3 }}>
        <TablePagination
          component="div"
          count={filteredResources.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>
      
      {/* View Resource Dialog */}
      <Dialog 
        open={openViewDialog} 
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Resource Details</DialogTitle>
        <DialogContent>
          {selectedResource && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedResource.title}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip 
                  label={selectedResource.status.charAt(0).toUpperCase() + selectedResource.status.slice(1)} 
                  color={
                    selectedResource.status === 'approved' 
                      ? 'success' 
                      : selectedResource.status === 'rejected' 
                        ? 'error' 
                        : 'warning'
                  }
                  size="small"
                />
                <Chip 
                  icon={<CategoryIcon />} 
                  label={selectedResource.category} 
                  size="small" 
                />
                <Chip 
                  icon={<LocationOnIcon />} 
                  label={selectedResource.location} 
                  size="small" 
                />
              </Box>
              
              <Typography variant="subtitle2" gutterBottom>
                Provider Information:
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedResource.provider} | {selectedResource.providerEmail}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Description:
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedResource.description}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Contact Information:
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedResource.contactName} | {selectedResource.contactPhone} | {selectedResource.contactEmail}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Address:
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedResource.address}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Requirements:
              </Typography>
              <ul>
                {selectedResource.requirements.map((req, index) => (
                  <li key={index}>
                    <Typography variant="body2">
                      {req}
                    </Typography>
                  </li>
                ))}
              </ul>
              
              <Typography variant="subtitle2" gutterBottom>
                Additional Information:
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedResource.additionalInfo}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Submission Date:
              </Typography>
              <Typography variant="body2">
                {selectedResource.submittedDate}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
          {selectedResource && selectedResource.status === 'pending' && (
            <>
              <Button 
                onClick={() => {
                  handleCloseViewDialog();
                  handleOpenRejectDialog(selectedResource);
                }} 
                color="error"
              >
                Reject
              </Button>
              <Button 
                onClick={() => {
                  handleCloseViewDialog();
                  handleOpenApproveDialog(selectedResource);
                }} 
                color="success" 
                variant="contained"
              >
                Approve
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Approve Resource Dialog */}
      <Dialog open={openApproveDialog} onClose={handleCloseApproveDialog}>
        <DialogTitle>Approve Resource</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve "{selectedResource?.title}"? This resource will be visible to all users.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApproveDialog}>Cancel</Button>
          <Button onClick={handleApproveResource} color="success" variant="contained">Approve</Button>
        </DialogActions>
      </Dialog>
      
      {/* Reject Resource Dialog */}
      <Dialog open={openRejectDialog} onClose={handleCloseRejectDialog}>
        <DialogTitle>Reject Resource</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please provide a reason for rejecting "{selectedResource?.title}". This will be sent to the provider.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="rejection-reason"
            label="Reason for Rejection"
            fullWidth
            multiline
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog}>Cancel</Button>
          <Button onClick={handleRejectResource} color="error" variant="contained">Reject</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResourceApproval;
