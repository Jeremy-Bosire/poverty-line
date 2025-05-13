/**
 * Unit tests for the Dashboard component
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Dashboard from '../components/dashboard/Dashboard';

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

// Mock user data
const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user'
};

// Mock resources data
const mockResources = [
  {
    id: 1,
    name: 'Food Pantry',
    description: 'Weekly food distribution',
    type: 'food',
    location: 'Community Center',
    availability: 'Wednesdays 2-5pm'
  },
  {
    id: 2,
    name: 'Housing Assistance',
    description: 'Rent assistance program',
    type: 'housing',
    location: 'City Hall',
    availability: 'Weekdays 9am-5pm'
  }
];

// Set up tests
describe('Dashboard Component', () => {
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
        completionPercentage: 80,
        isComplete: true
      },
      resources: {
        resources: mockResources,
        isLoading: false,
        error: null
      }
    });

    // Mock the dispatch function
    store.dispatch = jest.fn();
  });

  test('renders welcome message with user name', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByText(/Welcome, John Doe!/i)).toBeInTheDocument();
  });

  test('displays profile information correctly', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByText(/Resource Seeker/i)).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/555-123-4567/i)).toBeInTheDocument();
    expect(screen.getByText(/San Francisco, California/i)).toBeInTheDocument();
  });

  test('shows correct resource count', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText(/Resources available in your area/i)).toBeInTheDocument();
  });

  test('displays user needs as chips', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByText('Housing')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
  });

  test('renders loading indicators when data is loading', () => {
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
        completionPercentage: 0,
        isComplete: false
      },
      resources: {
        resources: [],
        isLoading: true,
        error: null
      }
    });

    render(
      <Provider store={loadingStore}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );
    
    // Check for CircularProgress components
    const loadingIndicators = screen.getAllByRole('progressbar');
    expect(loadingIndicators.length).toBeGreaterThan(0);
  });

  test('displays incomplete profile alert when profile is not complete', () => {
    // Create a store with incomplete profile
    const incompleteProfileStore = mockStore({
      auth: {
        user: mockUser,
        isLoading: false,
        error: null
      },
      profile: {
        profile: { ...mockProfile, is_complete: false, completion_percentage: 40 },
        isLoading: false,
        error: null,
        completionPercentage: 40,
        isComplete: false
      },
      resources: {
        resources: mockResources,
        isLoading: false,
        error: null
      }
    });

    render(
      <Provider store={incompleteProfileStore}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByText(/Your profile is 40% complete/i)).toBeInTheDocument();
    expect(screen.getByText(/Complete/i)).toBeInTheDocument();
  });

  test('shows special provider options for provider users', () => {
    // Create a store with provider role
    const providerStore = mockStore({
      auth: {
        user: { ...mockUser, role: 'provider' },
        isLoading: false,
        error: null
      },
      profile: {
        profile: mockProfile,
        isLoading: false,
        error: null,
        completionPercentage: 80,
        isComplete: true
      },
      resources: {
        resources: mockResources,
        isLoading: false,
        error: null
      }
    });

    render(
      <Provider store={providerStore}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByText(/Resource Provider/i)).toBeInTheDocument();
    expect(screen.getByText(/Manage Resources/i)).toBeInTheDocument();
  });
});
