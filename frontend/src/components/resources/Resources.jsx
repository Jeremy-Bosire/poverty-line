/**
 * Resources component for managing provider resources
 */
import React, { useState } from 'react';
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
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Mock data for resources
const mockResources = [
  {
    id: 1,
    name: 'Food Pantry',
    description: 'Weekly food distribution for families in need',
    type: 'food',
    location: 'Downtown Community Center',
    availability: 'Wednesdays 2-5pm',
    requirements: 'Photo ID, Proof of residence'
  },
  {
    id: 2,
    name: 'Job Training Workshop',
    description: 'Free workshop on resume building and interview skills',
    type: 'education',
    location: 'Public Library',
    availability: 'First Monday of each month',
    requirements: 'None'
  },
  {
    id: 3,
    name: 'Medical Clinic',
    description: 'Free basic medical services for uninsured individuals',
    type: 'healthcare',
    location: 'Hope Medical Center',
    availability: 'Tuesdays and Thursdays 9am-12pm',
    requirements: 'Income verification'
  }
];

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
 * Resources component for providers to manage their resources
 * 
 * @returns {React.ReactElement} - Rendered component
 */
const Resources = () => {
  const [resources, setResources] = useState(mockResources);
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
      setResources(prev => 
        prev.map(res => res.id === currentResource.id ? currentResource : res)
      );
    } else {
      // Add new resource
      const newResource = {
        ...currentResource,
        id: Date.now() // Simple ID generation
      };
      setResources(prev => [...prev, newResource]);
    }
    handleCloseDialog();
  };

  const handleDeleteResource = (id) => {
    setResources(prev => prev.filter(res => res.id !== id));
  };

  const getTypeLabel = (typeValue) => {
    const type = resourceTypes.find(t => t.value === typeValue);
    return type ? type.label : 'Unknown';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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

      <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Your Resources
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Manage the resources you provide to those in need. Add new resources or update existing ones.
        </Typography>
        
        <Grid container spacing={3}>
          {resources.map((resource) => (
            <Grid item xs={12} md={6} lg={4} key={resource.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {resource.name}
                    </Typography>
                    <Chip 
                      label={getTypeLabel(resource.type)} 
                      color="primary" 
                      size="small" 
                      sx={{ ml: 1 }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {resource.description}
                  </Typography>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Typography variant="subtitle2">
                    Location:
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {resource.location}
                  </Typography>
                  
                  <Typography variant="subtitle2">
                    Availability:
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {resource.availability}
                  </Typography>
                  
                  <Typography variant="subtitle2">
                    Requirements:
                  </Typography>
                  <Typography variant="body2">
                    {resource.requirements}
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <Button 
                    size="small" 
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
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {resources.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              You haven't added any resources yet. Click "Add Resource" to get started.
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
