/**
 * Resources component for viewing and managing resources
 * 
 * This component has two modes:
 * 1. Public view mode - for all users to search and view resources
 * 2. Management mode - for providers to add, edit, and delete resources
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
  Button,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Chip,
  InputAdornment,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoIcon from '@mui/icons-material/Info';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import HomeIcon from '@mui/icons-material/Home';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import CheckroomIcon from '@mui/icons-material/Checkroom';

import { selectUser } from '../../features/auth/authSlice';
import {
  getResources,
  getMyResources,
  createResource,
  updateResource,
  deleteResource,
  selectResources,
  selectResourcesLoading,
  selectResourcesError,
  selectResourcesMessage,
  reset
} from '../../features/resources/resourceSlice';

// Resource status options
const resourceStatuses = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// Resource types
const resourceTypes = [
  { value: 'food', label: 'Food' },
  { value: 'housing', label: 'Housing' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'employment', label: 'Employment' },
  { value: 'financial', label: 'Financial Assistance' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'other', label: 'Other' }
];

/**
 * Get icon based on resource type
 * 
 * @param {string} type - Resource type
 * @returns {React.ReactElement} - Icon component
 */
const getResourceIcon = (type) => {
  switch (type) {
    case 'food':
      return <FoodBankIcon />;
    case 'housing':
      return <HomeIcon />;
    case 'healthcare':
      return <LocalHospitalIcon />;
    case 'education':
      return <SchoolIcon />;
    case 'employment':
      return <WorkIcon />;
    case 'financial':
      return <AccountBalanceIcon />;
    case 'transportation':
      return <DirectionsBusIcon />;
    case 'clothing':
      return <CheckroomIcon />;
    default:
      return <InfoIcon />;
  }
};

/**
 * Resources component for viewing and managing resources
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isManage - Whether to show management mode (provider view)
 * @returns {React.ReactElement} - Rendered component
 */
const Resources = ({ isManage = false }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  
  // Redux selectors
  const resources = useSelector(selectResources);
  const isLoading = useSelector(selectResourcesLoading);
  const error = useSelector(selectResourcesError);
  const message = useSelector(selectResourcesMessage);
  const [filteredResources, setFilteredResources] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentResource, setCurrentResource] = useState({
    name: '',
    description: '',
    type: '',
    location: '',
    availability: '',
    requirements: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  
  // Public view state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTab, setSelectedTab] = useState(0);

  const handleOpenDialog = (resource = null) => {
    if (resource) {
      setCurrentResource(resource);
      setIsEditing(true);
    } else {
      setCurrentResource({
        name: '',
        description: '',
        type: '',
        location: '',
        availability: '',
        requirements: ''
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentResource(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveResource = () => {
    if (isEditing) {
      // Update existing resource
      dispatch(updateResource({
        id: currentResource.id,
        resourceData: currentResource
      }));
    } else {
      // Add new resource
      dispatch(createResource(currentResource));
    }
    
    handleCloseDialog();
  };

  const handleDeleteResource = (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      dispatch(deleteResource(id));
    }
  };

  const getTypeLabel = (typeValue) => {
    const type = resourceTypes.find(t => t.value === typeValue);
    return type ? type.label : 'Unknown';
  };

  useEffect(() => {
    // Load resources when component mounts
    if (isManage) {
      dispatch(getMyResources());
    } else {
      dispatch(getResources({ category: selectedType === 'all' ? '' : selectedType }));
    }

    // Clear any messages when component unmounts
    return () => {
      dispatch(reset());
    };
  }, [dispatch, isManage, selectedType]);
  
  // Update filtered resources when resources change or search term changes
  useEffect(() => {
    if (!resources) return;
    
    let filtered = [...resources];
    
    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(resource => 
        resource.name.toLowerCase().includes(search) ||
        resource.description.toLowerCase().includes(search) ||
        resource.location.toLowerCase().includes(search)
      );
    }
    
    setFilteredResources(filtered);
  }, [resources, searchTerm]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    
    // Filter by category based on tab
    if (newValue === 0) {
      setSelectedType('all');
    } else {
      setSelectedType(resourceTypes[newValue - 1].value);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Different headers for public vs. management view */}
      {isManage ? (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Manage Resources
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Resource
          </Button>
        </Box>
      ) : (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Available Resources
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto', mb: 4 }}>
            Browse available resources in your community or search for specific support services.
          </Typography>
          
          {/* Error message */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {/* Success message */}
          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          
          {/* Search bar */}
          <Box sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
            <TextField
              fullWidth
              placeholder="Search for resources..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '50px',
                  backgroundColor: 'white',
                }
              }}
            />
          </Box>
          
          {/* Category tabs */}
          <Tabs 
            value={selectedTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              mb: 2,
              '& .MuiTab-root': { minWidth: 100 } 
            }}
          >
            <Tab label="All" />
            <Tab label="Food" icon={<FoodBankIcon />} iconPosition="start" />
            <Tab label="Housing" icon={<HomeIcon />} iconPosition="start" />
            <Tab label="Healthcare" icon={<LocalHospitalIcon />} iconPosition="start" />
            <Tab label="Education" icon={<SchoolIcon />} iconPosition="start" />
          </Tabs>
        </Box>
      )}
      
      <Paper sx={{ p: 3, mt: 2 }}>
        {/* Loading indicator */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        
        {/* Resources grid */}
        <Grid container spacing={3}>
          {filteredResources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardMedia
                  component="div"
                  sx={{
                    height: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: (() => {
                      switch(resource.type) {
                        case 'food': return 'primary.light';
                        case 'housing': return 'secondary.light';
                        case 'healthcare': return 'info.light';
                        case 'education': return 'success.light';
                        case 'employment': return 'warning.light';
                        default: return 'grey.300';
                      }
                    })(),
                  }}
                >
                  <Box sx={{ color: 'white', fontSize: '3rem' }}>
                    {getResourceIcon(resource.type)}
                  </Box>
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {resource.name}
                  </Typography>
                  <Chip 
                    label={getTypeLabel(resource.type)} 
                    size="small" 
                    sx={{ mb: 2 }}
                    color={(() => {
                      switch(resource.type) {
                        case 'food': return 'primary';
                        case 'housing': return 'secondary';
                        case 'healthcare': return 'info';
                        case 'education': return 'success';
                        case 'employment': return 'warning';
                        default: return 'default';
                      }
                    })()}
                  />
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {resource.description}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    {resource.location}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    {resource.availability}
                  </Typography>
                  {resource.requirements && (
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                      <InfoIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <strong>Required:</strong> {resource.requirements}
                    </Typography>
                  )}
                </CardContent>
                {isManage && (
                  <CardActions>
                    <Button 
                      size="small" 
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenDialog(resource)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      color="error" 
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteResource(resource.id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {filteredResources.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              {isManage
                ? "You haven't added any resources yet. Click 'Add Resource' to get started."
                : searchTerm
                  ? "No resources match your search criteria. Try different keywords or remove filters."
                  : "No resources available in this category yet."}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Add/Edit Resource Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Resource' : 'Add New Resource'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Resource Name"
                name="name"
                value={currentResource.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={currentResource.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="resource-type-label">Resource Type</InputLabel>
                <Select
                  labelId="resource-type-label"
                  name="type"
                  value={currentResource.type}
                  onChange={handleInputChange}
                  label="Resource Type"
                >
                  {resourceTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={currentResource.location}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Availability"
                name="availability"
                value={currentResource.availability}
                onChange={handleInputChange}
                placeholder="e.g., Mondays 9am-5pm"
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Requirements"
                name="requirements"
                value={currentResource.requirements}
                onChange={handleInputChange}
                placeholder="e.g., Photo ID, Proof of residence"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveResource} 
            variant="contained"
            disabled={!currentResource.name || !currentResource.type}
          >
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Resources;
