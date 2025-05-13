import { Box, Typography, Container, Paper, Grid, Divider } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="md">
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          About PovertyLine
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="body1" paragraph>
          PovertyLine is a platform designed to connect individuals in need with available support services. 
          Our mission is to bridge the gap between those who need help and the resources available in their communities.
        </Typography>
        
        <Typography variant="body1" paragraph>
          We believe that everyone deserves access to essential resources, regardless of their circumstances. 
          By creating a digital platform that is accessible via mobile devices, we aim to make it easier for 
          people to find and connect with the support they need.
        </Typography>
        
        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
          Our Vision
        </Typography>
        
        <Typography variant="body1" paragraph>
          A world where everyone has equal access to resources and opportunities, 
          regardless of their socioeconomic status or background.
        </Typography>
        
        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
          Our Mission
        </Typography>
        
        <Typography variant="body1" paragraph>
          To create a platform that connects individuals in need with available support services, 
          making it easier for people to access the resources they need to improve their lives.
        </Typography>
        
        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
          Core Values
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Accessibility
              </Typography>
              <Typography variant="body2">
                We design our platform to be accessible to everyone, with a focus on mobile-first 
                design to reach those who may only have access to mobile devices.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Empowerment
              </Typography>
              <Typography variant="body2">
                We believe in empowering individuals by providing them with the tools and 
                information they need to access resources and improve their circumstances.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Dignity
              </Typography>
              <Typography variant="body2">
                We respect the dignity of all individuals and strive to create a platform 
                that treats everyone with respect and compassion.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Community
              </Typography>
              <Typography variant="body2">
                We believe in the power of community and work to foster connections between 
                individuals, resource providers, and community organizations.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default About;
