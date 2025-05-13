import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  Alert, 
  CircularProgress,
  InputAdornment,
  IconButton,
  MenuItem,
  FormControl,
  FormHelperText
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { register, selectAuthLoading, selectAuthError } from '../../features/auth/authSlice.jsx';

// Validation schema
const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  role: Yup.string()
    .oneOf(['user', 'provider'], 'Invalid role')
    .required('Role is required'),
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...userData } = values;
    
    try {
      await dispatch(register(userData)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the auth slice
      setSubmitting(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container component="main" maxWidth="sm">
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
          Create an Account
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Formik
          initialValues={{ 
            name: '', 
            email: '', 
            password: '', 
            confirmPassword: '',
            role: 'user'
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, values, handleChange }) => (
            <Form style={{ width: '100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field name="name">
                    {({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        id="name"
                        label="Full Name"
                        autoComplete="name"
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                        disabled={isLoading}
                      />
                    )}
                  </Field>
                </Grid>
                
                <Grid item xs={12}>
                  <Field name="email">
                    {({ field }) => (
                      <TextField
                        {...field}
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
                </Grid>
                
                <Grid item xs={12}>
                  <Field name="password">
                    {({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        id="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
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
                </Grid>
                
                <Grid item xs={12}>
                  <Field name="confirmPassword">
                    {({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        id="confirmPassword"
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
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
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth error={touched.role && Boolean(errors.role)}>
                    <TextField
                      select
                      id="role"
                      name="role"
                      label="I am a..."
                      value={values.role}
                      onChange={handleChange}
                      disabled={isLoading}
                      error={touched.role && Boolean(errors.role)}
                    >
                      <MenuItem value="user">Person seeking resources</MenuItem>
                      <MenuItem value="provider">Resource provider</MenuItem>
                    </TextField>
                    {touched.role && errors.role && (
                      <FormHelperText>{errors.role}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
              </Button>
              
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="/login" style={{ textDecoration: 'none' }}>
                    <Typography variant="body2" color="primary">
                      Already have an account? Sign in
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default Register;
