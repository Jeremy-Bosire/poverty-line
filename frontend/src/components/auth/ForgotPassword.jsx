import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Paper, 
  Alert, 
  CircularProgress,
  Grid
} from '@mui/material';
import axios from 'axios';

// Validation schema
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // This would be replaced with actual API call
      // await authService.requestPasswordReset(values.email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 2,
          mt: 4
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Reset Password
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success ? (
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              Password reset instructions have been sent to your email.
            </Alert>
            <Typography variant="body2" paragraph>
              Please check your email for instructions to reset your password. If you don't receive an email within a few minutes, check your spam folder.
            </Typography>
            <Button 
              component={Link} 
              to="/login" 
              variant="contained" 
              sx={{ mt: 2 }}
            >
              Return to Login
            </Button>
          </Box>
        ) : (
          <Formik
            initialValues={{ email: '' }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form style={{ width: '100%' }}>
                <Typography variant="body2" paragraph color="text.secondary">
                  Enter your email address and we'll send you instructions to reset your password.
                </Typography>
                
                <Field name="email">
                  {({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      fullWidth
                      id="email"
                      label="Email Address"
                      autoComplete="email"
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      disabled={isLoading}
                    />
                  )}
                </Field>
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Send Reset Link'}
                </Button>
                
                <Grid container justifyContent="center">
                  <Grid item>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                      <Typography variant="body2" color="primary">
                        Back to Login
                      </Typography>
                    </Link>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        )}
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
