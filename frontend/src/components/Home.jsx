import { Box, Typography, Button, Grid, Card, CardContent, CardMedia, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          py: { xs: 6, md: 10 },
          textAlign: 'center',
          backgroundColor: 'primary.light',
          color: 'primary.contrastText',
          borderRadius: 2,
          mb: 6
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" gutterBottom>
            Connecting People with Resources
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            PovertyLine helps connect individuals in need with available support services in their community.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button 
              component={Link} 
              to="/register" 
              variant="contained" 
              size="large"
              sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}
            >
              Get Started
            </Button>
            <Button 
              component={Link} 
              to="/resources" 
              variant="outlined" 
              size="large"
              sx={{ 
                backgroundColor: 'background.paper',
                '&:hover': {
                  backgroundColor: 'background.default'
                }
              }}
            >
              Find Resources
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
        How PovertyLine Works
      </Typography>
      
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardMedia
              component="div"
              sx={{
                height: 140,
                backgroundColor: 'secondary.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography variant="h1" component="div" color="secondary.contrastText">1</Typography>
            </CardMedia>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Create Your Profile
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign up and create your digital profile to help us understand your needs and connect you with relevant resources.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardMedia
              component="div"
              sx={{
                height: 140,
                backgroundColor: 'secondary.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography variant="h1" component="div" color="secondary.contrastText">2</Typography>
            </CardMedia>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Find Resources
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Search for resources by category, location, or specific needs. Filter results to find exactly what you're looking for.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardMedia
              component="div"
              sx={{
                height: 140,
                backgroundColor: 'secondary.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography variant="h1" component="div" color="secondary.contrastText">3</Typography>
            </CardMedia>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Get Connected
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Connect with resource providers directly through the platform and access the support you need.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Call to Action */}
      <Box 
        sx={{ 
          py: 6, 
          textAlign: 'center',
          backgroundColor: 'secondary.light',
          borderRadius: 2
        }}
      >
        <Typography variant="h5" gutterBottom>
          Ready to get started?
        </Typography>
        <Button 
          component={Link} 
          to="/register" 
          variant="contained" 
          size="large"
          sx={{ mt: 2 }}
        >
          Create Your Profile
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
