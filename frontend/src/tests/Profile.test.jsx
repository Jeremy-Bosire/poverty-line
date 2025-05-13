/**
 * Unit tests for the Profile component
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Profile from '../components/profile/Profile';

// Mock redux store
const mockStore = configureStore([thunk]);

// Mock profile data
const mockProfile = {
  phone: '555-123-4567',
  bio: 'Looking for housing and education resources',
  address: '123 Main St',
  city: 'San Francisco',
  state: 'California',
  zip_code: '94105',
  needs: ['Housing', 'Education', 'Food'],
  completion_percentage: 80,
  is_complete: true
};

// Mock incomplete profile
const mockIncompleteProfile = {
  phone: '555-123-4567',
  bio: '',
  address: '',
  city: '',
  state: '',
  zip_code: '',
  needs: [],
  completion_percentage: 20,
  is_complete: false
};

// Mock user data
const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user'
};

describe('Profile Component', () => {
  let store;

  beforeEach(() => {
    // Create a store with our initial test state
    store = mockStore({
      auth: {
        user: mockUser,
        isLoading: false,
        error: null
      },
      profile: {
        profile: mockProfile,
        isLoading: false,
        error: null,
        message: '',
        completionPercentage: 80,
        isComplete: true
      }
    });

    // Mock the dispatch function
    store.dispatch = jest.fn();
  });

  // TEST 1: Expected Use Case - Display Profile
  test('displays profile information correctly', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </Provider>
    );
    
    // Check if profile data is displayed
    expect(screen.getByDisplayValue('555-123-4567')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Looking for housing and education resources')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument();
    expect(screen.getByDisplayValue('San Francisco')).toBeInTheDocument();
    expect(screen.getByDisplayValue('California')).toBeInTheDocument();
    expect(screen.getByDisplayValue('94105')).toBeInTheDocument();
  });

  // TEST 2: Edge Case - Incomplete Profile
  test('shows correct completion status for incomplete profile', () => {
    // Create a store with incomplete profile
    const incompleteProfileStore = mockStore({
      auth: {
        user: mockUser,
        isLoading: false,
        error: null
      },
      profile: {
        profile: mockIncompleteProfile,
        isLoading: false,
        error: null,
        message: '',
        completionPercentage: 20,
        isComplete: false
      }
    });
    
    render(
      <Provider store={incompleteProfileStore}>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </Provider>
    );
    
    // Check completion percentage is correct
    expect(screen.getByText('20% Complete')).toBeInTheDocument();
    expect(screen.getByText('Incomplete')).toBeInTheDocument();
    
    // Check the "Complete Your Profile" button exists
    expect(screen.getByText('Complete Your Profile')).toBeInTheDocument();
  });

  // TEST 3: Failure Case - Validation Error
  test('shows validation errors when form is submitted with invalid data', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </Provider>
    );
    
    // Click Edit button to enter edit mode
    const editButton = screen.getByRole('button', { name: /edit profile/i });
    fireEvent.click(editButton);
    
    // Clear phone field and enter invalid phone number
    const phoneInput = screen.getByLabelText(/phone number/i);
    fireEvent.change(phoneInput, { target: { value: '123' } });
    
    // Submit the form
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);
    
    // Check for validation error message
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid phone number/i)).toBeInTheDocument();
    });
  });
  
  // TEST 4: Loading State
  test('displays loading indicator when profile is loading', () => {
    // Create a store with loading state
    const loadingStore = mockStore({
      auth: {
        user: mockUser,
        isLoading: false,
        error: null
      },
      profile: {
        profile: null,
        isLoading: true,
        error: null,
        message: '',
        completionPercentage: 0,
        isComplete: false
      }
    });
    
    render(
      <Provider store={loadingStore}>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </Provider>
    );
    
    // Check for CircularProgress
    const loadingIndicator = screen.getByRole('progressbar');
    expect(loadingIndicator).toBeInTheDocument();
  });
  
  // TEST 5: Form Editing
  test('allows editing profile information', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </Provider>
    );
    
    // Click Edit button to enter edit mode
    const editButton = screen.getByRole('button', { name: /edit profile/i });
    fireEvent.click(editButton);
    
    // Update bio field
    const bioInput = screen.getByLabelText(/bio/i);
    fireEvent.change(bioInput, { target: { value: 'Updated bio information' } });
    
    // Check if the input value was updated
    expect(screen.getByDisplayValue('Updated bio information')).toBeInTheDocument();
  });
  
  // TEST 6: Form Submission
  test('dispatches updateProfile action when form is submitted with valid data', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </Provider>
    );
    
    // Click Edit button to enter edit mode
    const editButton = screen.getByRole('button', { name: /edit profile/i });
    fireEvent.click(editButton);
    
    // Update bio field
    const bioInput = screen.getByLabelText(/bio/i);
    fireEvent.change(bioInput, { target: { value: 'Updated bio information' } });
    
    // Submit the form
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);
    
    // Check if updateProfile action was dispatched
    expect(store.dispatch).toHaveBeenCalled();
  });
  
  // TEST 7: Error Handling
  test('displays error message when there is an error', () => {
    // Create a store with an error
    const errorStore = mockStore({
      auth: {
        user: mockUser,
        isLoading: false,
        error: null
      },
      profile: {
        profile: mockProfile,
        isLoading: false,
        error: 'Failed to update profile',
        message: '',
        completionPercentage: 80,
        isComplete: true
      }
    });
    
    render(
      <Provider store={errorStore}>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </Provider>
    );
    
    // Check for error message
    expect(screen.getByText('Failed to update profile')).toBeInTheDocument();
  });
});
