import { Box, Typography, Button, Grid, Card, CardContent, CardMedia, Container, Paper, Divider, Stack, Chip, Avatar, useTheme, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FoodBankOutlinedIcon from '@mui/icons-material/FoodBankOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box>
      {/* Hero Section */}
      <Paper 
        elevation={0}
        sx={{ 
          position: 'relative',
          overflow: 'hidden',
          borderRadius: { xs: 0, sm: 3 },
          mb: 6,
          background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
          color: 'white',
        }}
      >
        {/* Background pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          }}
        />
        
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ py: { xs: 6, md: 10 } }}>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '2.25rem', md: '3.5rem' },
                  lineHeight: 1.2,
                  mb: 2
                }}
              >
                Connecting People with Resources
              </Typography>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 4, 
                  fontWeight: 400,
                  opacity: 0.9,
                  maxWidth: { md: '80%' }
                }}
              >
                PovertyLine helps connect individuals in need with available support services in their community.
              </Typography>
              
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2}
                sx={{ mt: 4, justifyContent: { xs: 'center', md: 'flex-start' } }}
              >
                <Button 
                  component={Link} 
                  to="/register" 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    backgroundColor: 'white',
                    color: 'primary.main',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }
                  }}
                >
                  Get Started
                </Button>
                <Button 
                  component={Link} 
                  to="/resources" 
                  variant="outlined" 
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ 
                    px: 3,
                    py: 1.5,
                    borderColor: 'rgba(255, 255, 255, 0.7)',
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Find Resources
                </Button>
              </Stack>
              
              {/* Stats */}
              <Stack 
                direction="row" 
                spacing={4} 
                sx={{ 
                  mt: 6, 
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  display: { xs: 'none', md: 'flex' }
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight={700}>500+</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Resources</Typography>
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>12+</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Categories</Typography>
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>24/7</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Support</Typography>
                </Box>
              </Stack>
            </Grid>
            
            {!isMobile && (
              <Grid item md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Box 
                  sx={{ 
                    position: 'relative',
                    height: '100%',
                    minHeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* Feature cards floating in 3D space */}
                  <Paper 
                    elevation={4} 
                    sx={{ 
                      position: 'absolute',
                      width: 200,
                      p: 2,
                      top: '10%',
                      left: '5%',
                      backgroundColor: 'white',
                      transform: 'rotate(-5deg)',
                      zIndex: 3
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        <FoodBankOutlinedIcon />
                      </Avatar>
                      <Typography variant="subtitle1" color="text.primary" fontWeight={600}>
                        Food Assistance
                      </Typography>
                    </Stack>
                  </Paper>
                  
                  <Paper 
                    elevation={4} 
                    sx={{ 
                      position: 'absolute',
                      width: 220,
                      p: 2,
                      top: '40%',
                      right: '5%',
                      backgroundColor: 'white',
                      transform: 'rotate(3deg)',
                      zIndex: 2
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar sx={{ bgcolor: 'secondary.light' }}>
                        <HomeWorkOutlinedIcon />
                      </Avatar>
                      <Typography variant="subtitle1" color="text.primary" fontWeight={600}>
                        Housing Support
                      </Typography>
                    </Stack>
                  </Paper>
                  
                  <Paper 
                    elevation={4} 
                    sx={{ 
                      position: 'absolute',
                      width: 240,
                      p: 2,
                      bottom: '15%',
                      left: '15%',
                      backgroundColor: 'white',
                      transform: 'rotate(-2deg)',
                      zIndex: 1
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar sx={{ bgcolor: 'info.light' }}>
                        <HealthAndSafetyOutlinedIcon />
                      </Avatar>
                      <Typography variant="subtitle1" color="text.primary" fontWeight={600}>
                        Healthcare Access
                      </Typography>
                    </Stack>
                  </Paper>
                </Box>
              </Grid>
            )}
          </Grid>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              position: 'relative',
              display: 'inline-block',
              pb: 2,
              '&:after': {
                content: '""',
                position: 'absolute',
                width: '60px',
                height: '4px',
                bottom: 0,
                left: 'calc(50% - 30px)',
                backgroundColor: 'primary.main',
                borderRadius: '2px'
              }
            }}
          >
            How PovertyLine Works
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto', mt: 2 }}>
            Our platform makes it easy to find and connect with resources in your community through a simple three-step process.
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="div"
                  sx={{
                    height: 160,
                    backgroundColor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <PeopleAltOutlinedIcon sx={{ fontSize: 60, color: 'white' }} />
                </CardMedia>
                <Avatar 
                  sx={{ 
                    position: 'absolute',
                    bottom: '-20px',
                    left: '20px',
                    width: 40,
                    height: 40,
                    bgcolor: 'primary.dark',
                    border: '2px solid white'
                  }}
                >
                  1
                </Avatar>
              </Box>
              <CardContent sx={{ pt: 4 }}>
                <Typography gutterBottom variant="h5" component="div" fontWeight={600}>
                  Create Your Profile
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Sign up and create your digital profile to help us understand your needs and connect you with relevant resources.
                </Typography>
                <Button 
                  component={Link} 
                  to="/register"
                  size="small" 
                  endIcon={<ArrowForwardIcon />}
                  sx={{ textTransform: 'none', fontWeight: 500 }}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="div"
                  sx={{
                    height: 160,
                    backgroundColor: 'secondary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <SearchOutlinedIcon sx={{ fontSize: 60, color: 'white' }} />
                </CardMedia>
                <Avatar 
                  sx={{ 
                    position: 'absolute',
                    bottom: '-20px',
                    left: '20px',
                    width: 40,
                    height: 40,
                    bgcolor: 'secondary.dark',
                    border: '2px solid white'
                  }}
                >
                  2
                </Avatar>
              </Box>
              <CardContent sx={{ pt: 4 }}>
                <Typography gutterBottom variant="h5" component="div" fontWeight={600}>
                  Find Resources
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Search for resources by category, location, or specific needs. Filter results to find exactly what you're looking for.
                </Typography>
                <Button 
                  component={Link} 
                  to="/resources"
                  size="small" 
                  color="secondary"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ textTransform: 'none', fontWeight: 500 }}
                >
                  Browse Resources
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="div"
                  sx={{
                    height: 160,
                    backgroundColor: 'info.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <HandshakeOutlinedIcon sx={{ fontSize: 60, color: 'white' }} />
                </CardMedia>
                <Avatar 
                  sx={{ 
                    position: 'absolute',
                    bottom: '-20px',
                    left: '20px',
                    width: 40,
                    height: 40,
                    bgcolor: 'info.dark',
                    border: '2px solid white'
                  }}
                >
                  3
                </Avatar>
              </Box>
              <CardContent sx={{ pt: 4 }}>
                <Typography gutterBottom variant="h5" component="div" fontWeight={600}>
                  Get Connected
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Connect with resource providers directly through the platform and access the support you need.
                </Typography>
                <Button 
                  component={Link} 
                  to="/about"
                  size="small" 
                  color="info"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ textTransform: 'none', fontWeight: 500 }}
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box 
        sx={{ 
          position: 'relative',
          overflow: 'hidden',
          py: { xs: 6, md: 8 },
          px: { xs: 2, md: 4 },
          mb: 6,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #5E35B1 0%, #4527A0 100%)',
          color: 'white',
        }}
      >
        {/* Background pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography 
                variant="h3" 
                component="h2" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                }}
              >
                Ready to connect with resources in your community?
              </Typography>
              
              <Typography variant="h6" sx={{ mb: 4, fontWeight: 400, opacity: 0.9 }}>
                Create your profile today and start finding the support you need.
              </Typography>
              
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2}
                sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}
              >
                <Button 
                  component={Link} 
                  to="/register" 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    backgroundColor: 'white',
                    color: 'secondary.main',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }
                  }}
                >
                  Create Your Profile
                </Button>
                <Button 
                  component={Link} 
                  to="/resources" 
                  variant="outlined" 
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ 
                    px: 3,
                    py: 1.5,
                    borderColor: 'rgba(255, 255, 255, 0.7)',
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Browse Resources
                </Button>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ position: 'relative', height: '100%', minHeight: 200 }}>
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxWidth: 300,
                    height: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Paper 
                    elevation={4} 
                    sx={{ 
                      width: '100%',
                      p: 3,
                      borderRadius: 2,
                      backgroundColor: 'white',
                      transform: 'rotate(2deg)',
                      mb: 2
                    }}
                  >
                    <Stack spacing={2}>
                      <Typography variant="h6" color="text.primary" fontWeight={600}>
                        Resource Categories
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip label="Food" size="small" color="primary" />
                        <Chip label="Housing" size="small" color="secondary" />
                        <Chip label="Healthcare" size="small" color="info" />
                        <Chip label="Education" size="small" color="success" />
                        <Chip label="Employment" size="small" color="warning" />
                      </Stack>
                    </Stack>
                  </Paper>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
