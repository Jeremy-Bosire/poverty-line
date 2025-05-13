import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Mock data for resources
const mockResources = [
  {
    id: 1,
    title: 'Food Assistance Program',
    provider: 'Community Food Bank',
    category: 'Food',
    location: 'Downtown',
    description: 'Weekly food distribution for families in need. No registration required.',
    date: '2025-05-20',
    status: 'Available'
  },
  {
    id: 2,
    title: 'Emergency Housing Support',
    provider: 'City Shelter Services',
    category: 'Housing',
    location: 'Eastside',
    description: 'Temporary housing for individuals and families facing homelessness.',
    date: '2025-05-15',
    status: 'Available'
  },
  {
    id: 3,
    title: 'Job Training Workshop',
    provider: 'Career Development Center',
    category: 'Employment',
    location: 'Westside',
    description: 'Free workshop on resume building, interview skills, and job search strategies.',
    date: '2025-05-25',
    status: 'Upcoming'
  },
  {
    id: 4,
    title: 'Free Medical Clinic',
    provider: 'Community Health Network',
    category: 'Healthcare',
    location: 'Northside',
    description: 'Free basic medical services for uninsured individuals.',
    date: '2025-05-18',
    status: 'Available'
  },
  {
    id: 5,
    title: 'After-School Tutoring',
    provider: 'Education Foundation',
    category: 'Education',
    location: 'Southside',
    description: 'Free tutoring for K-12 students in math, science, and reading.',
    date: '2025-05-22',
    status: 'Available'
  }
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

const ResourcesList = () => {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [page, setPage] = useState(1);
  const resourcesPerPage = 4;
  
  // Locations derived from resources
  const locations = ['All Locations', ...new Set(mockResources.map(r => r.location))];
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setResources(mockResources);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter resources based on search and filters
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.provider.toLowerCase().includes(searchTerm.toLowerCase());
                         
    const matchesCategory = selectedCategory === 'All Categories' || resource.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All Locations' || resource.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);
  const displayedResources = filteredResources.slice(
    (page - 1) * resourcesPerPage,
    page * resourcesPerPage
  );
  
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };
  
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };
  
  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
    setPage(1);
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
        Available Resources
      </Typography>
      
      <Typography variant="body1" paragraph color="text.secondary">
        Browse available resources or use the filters to find specific support services.
      </Typography>
      
      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Resources"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={selectedCategory}
                label="Category"
                onChange={handleCategoryChange}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel id="location-label">Location</InputLabel>
              <Select
                labelId="location-label"
                value={selectedLocation}
                label="Location"
                onChange={handleLocationChange}
              >
                {locations.map((location) => (
                  <MenuItem key={location} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      
      {/* Resources List */}
      {displayedResources.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {displayedResources.map((resource) => (
              <Grid item xs={12} sm={6} md={6} key={resource.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {resource.title}
                      </Typography>
                      <Chip 
                        label={resource.status} 
                        color={resource.status === 'Available' ? 'success' : 'primary'} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Provider: {resource.provider}
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
                        icon={<AccessTimeIcon />} 
                        label={resource.date} 
                        size="small" 
                      />
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      component={Link} 
                      to={`/resources/${resource.id}`}
                      size="small" 
                      variant="contained"
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            No resources found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or filters.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ResourcesList;
