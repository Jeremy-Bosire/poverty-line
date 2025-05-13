import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Chip, 
  Button, 
  Divider,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';

// Mock data for resources (same as in ResourcesList)
const mockResources = [
  {
    id: 1,
    title: 'Food Assistance Program',
    provider: 'Community Food Bank',
    category: 'Food',
    location: 'Downtown',
    description: 'Weekly food distribution for families in need. No registration required.',
    date: '2025-05-20',
    status: 'Available',
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
    title: 'Emergency Housing Support',
    provider: 'City Shelter Services',
    category: 'Housing',
    location: 'Eastside',
    description: 'Temporary housing for individuals and families facing homelessness.',
    date: '2025-05-15',
    status: 'Available',
    contactName: 'Maria Johnson',
    contactPhone: '(555) 987-6543',
    contactEmail: 'housing@cityshelter.org',
    address: '456 Shelter Ave, Eastside',
    requirements: [
      'Photo ID',
      'Intake interview',
      'Background check'
    ],
    additionalInfo: 'Open 24/7 for emergency intake. Priority given to families with children and elderly individuals.'
  },
  {
    id: 3,
    title: 'Job Training Workshop',
    provider: 'Career Development Center',
    category: 'Employment',
    location: 'Westside',
    description: 'Free workshop on resume building, interview skills, and job search strategies.',
    date: '2025-05-25',
    status: 'Upcoming',
    contactName: 'David Williams',
    contactPhone: '(555) 456-7890',
    contactEmail: 'workshops@careercenter.org',
    address: '789 Career Blvd, Westside',
    requirements: [
      'Pre-registration required',
      'Resume draft (if available)',
      'Must be 18 or older'
    ],
    additionalInfo: 'Workshop runs from 9am to 3pm. Lunch will be provided. Bring a notebook and pen.'
  },
  {
    id: 4,
    title: 'Free Medical Clinic',
    provider: 'Community Health Network',
    category: 'Healthcare',
    location: 'Northside',
    description: 'Free basic medical services for uninsured individuals.',
    date: '2025-05-18',
    status: 'Available',
    contactName: 'Dr. Sarah Chen',
    contactPhone: '(555) 234-5678',
    contactEmail: 'clinic@communityhealth.org',
    address: '321 Health St, Northside',
    requirements: [
      'Photo ID',
      'Proof of residence',
      'Income verification'
    ],
    additionalInfo: 'Services include basic check-ups, vaccinations, and non-emergency care. Open Mondays and Wednesdays from 1pm to 7pm.'
  },
  {
    id: 5,
    title: 'After-School Tutoring',
    provider: 'Education Foundation',
    category: 'Education',
    location: 'Southside',
    description: 'Free tutoring for K-12 students in math, science, and reading.',
    date: '2025-05-22',
    status: 'Available',
    contactName: 'Robert Taylor',
    contactPhone: '(555) 876-5432',
    contactEmail: 'tutoring@educationfoundation.org',
    address: '654 School Rd, Southside',
    requirements: [
      'Student ID or school verification',
      'Parent/guardian permission form',
      'Initial assessment test'
    ],
    additionalInfo: 'Tutoring sessions are available Monday through Thursday from 3:30pm to 6:30pm. Students must commit to at least two sessions per week.'
  }
];

const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Simulate fetching resource data
  useEffect(() => {
    const timer = setTimeout(() => {
      const foundResource = mockResources.find(r => r.id === parseInt(id));
      
      if (foundResource) {
        setResource(foundResource);
      } else {
        setError('Resource not found');
      }
      
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error || !resource) {
    return (
      <Box>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/resources')}
          sx={{ mb: 3 }}
        >
          Back to Resources
        </Button>
        
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Resource not found'}
        </Alert>
      </Box>
    );
  }
  
  return (
    <Box>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/resources')}
        sx={{ mb: 3 }}
      >
        Back to Resources
      </Button>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {resource.title}
          </Typography>
          <Chip 
            label={resource.status} 
            color={resource.status === 'Available' ? 'success' : 'primary'} 
            size="medium" 
          />
        </Box>
        
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Provided by: {resource.provider}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
          <Chip 
            icon={<CategoryIcon />} 
            label={resource.category} 
          />
          <Chip 
            icon={<LocationOnIcon />} 
            label={resource.location} 
          />
          <Chip 
            icon={<AccessTimeIcon />} 
            label={resource.date} 
          />
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          Description
        </Typography>
        <Typography variant="body1" paragraph>
          {resource.description}
        </Typography>
        
        <Typography variant="body1" paragraph>
          {resource.additionalInfo}
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Requirements
            </Typography>
            <List>
              {resource.requirements.map((req, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={req} />
                </ListItem>
              ))}
            </List>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Location
            </Typography>
            <Typography variant="body1" paragraph>
              {resource.address}
            </Typography>
            
            {/* This would be a map in a real implementation */}
            <Paper 
              sx={{ 
                height: 200, 
                width: '100%', 
                bgcolor: 'grey.200', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mb: 2
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Map would be displayed here
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Contact Information
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Contact Person" 
                secondary={resource.contactName} 
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <PhoneIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Phone" 
                secondary={resource.contactPhone} 
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Email" 
                secondary={resource.contactEmail} 
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/resources"
        >
          Back to Resources
        </Button>
        
        <Button 
          variant="contained"
          endIcon={<InfoIcon />}
        >
          Request More Information
        </Button>
      </Box>
    </Box>
  );
};

export default ResourceDetail;
