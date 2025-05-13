/**
 * Reset Password component for resetting a user's password with a token
 */
import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
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
  InputAdornment,
  IconButton,
  Grid
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../../features/auth/authSlice';

// Validation schema
const ResetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

/**
 * ResetPassword component for resetting a user's password with a token
 * 
 * @returns {React.ReactElement} - Rendered component
 */
const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await dispatch(resetPassword({ 
        token,
        newPassword: values.newPassword
      })).unwrap();
      
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (!token) {
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
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            Invalid password reset link. Please request a new password reset.
          </Alert>
          <Button 
            component={Link} 
            to="/forgot-password" 
            variant="contained" 
            sx={{ mt: 2 }}
          >
            Request New Reset Link
          </Button>
        </Paper>
      </Container>
    );
  }

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
          Reset Your Password
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success ? (
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              Your password has been reset successfully!
            </Alert>
            <Typography variant="body2" paragraph>
              You will be redirected to the login page in a few seconds...
            </Typography>
            <Button 
              component={Link} 
              to="/login" 
              variant="contained" 
              sx={{ mt: 2 }}
            >
              Go to Login
            </Button>
          </Box>
        ) : (
          <Formik
            initialValues={{ newPassword: '', confirmPassword: '' }}
            validationSchema={ResetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form style={{ width: '100%' }}>
                <Typography variant="body2" paragraph color="text.secondary">
                  Enter your new password below.
                </Typography>
                
                <Field name="newPassword">
                  {({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      fullWidth
                      id="newPassword"
                      label="New Password"
                      type={showPassword ? 'text' : 'password'}
                      error={touched.newPassword && Boolean(errors.newPassword)}
                      helperText={touched.newPassword && errors.newPassword}
                      disabled={isLoading}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                </Field>
                
                <Field name="confirmPassword">
                  {({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      fullWidth
                      id="confirmPassword"
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                      helperText={touched.confirmPassword && errors.confirmPassword}
                      disabled={isLoading}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle confirm password visibility"
                              onClick={handleToggleConfirmPasswordVisibility}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
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
                  {isLoading ? <CircularProgress size={24} /> : 'Reset Password'}
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

export default ResetPassword;
