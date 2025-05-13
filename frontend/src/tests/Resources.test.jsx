/**
 * Unit tests for the Resources component
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Resources from '../components/resources/Resources';

// Mock redux store
const mockStore = configureStore([thunk]);

// Mock resources data
const mockResources = [
  {
    id: 1,
    name: 'Food Pantry',
    description: 'Weekly food distribution for families in need',
    type: 'food',
    location: 'Downtown Community Center',
    availability: 'Wednesdays 2-5pm',
    requirements: 'Photo ID, Proof of residence'
  },
  {
    id: 2,
    name: 'Job Training Workshop',
    description: 'Free workshop on resume building and interview skills',
    type: 'education',
    location: 'Public Library',
    availability: 'First Monday of each month',
    requirements: 'None'
  },
  {
    id: 3,
    name: 'Medical Clinic',
    description: 'Free basic medical services for uninsured individuals',
    type: 'healthcare',
    location: 'Hope Medical Center',
    availability: 'Tuesdays and Thursdays 9am-12pm',
    requirements: 'Income verification'
  }
];

// Mock user data (regular user)
const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user'
};

// Mock user data (provider)
const mockProviderUser = {
  id: 2,
  name: 'Jane Smith',
  email: 'jane@example.com',
  role: 'provider'
};

describe('Resources Component', () => {
  let store;

  beforeEach(() => {
    // Create a store with our initial test state
    store = mockStore({
      auth: {
        user: mockUser,
        isLoading: false,
        error: null
      },
      resources: {
        resources: mockResources,
        isLoading: false,
        error: null,
        message: ''
      }
    });

    // Mock the dispatch function
    store.dispatch = jest.fn();
  });

  // TEST 1: Expected Use Case - Resource Display
  test('displays resources in card format', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Resources />
        </BrowserRouter>
      </Provider>
    );
    
    // Check if resource names are displayed
    expect(screen.getByText('Food Pantry')).toBeInTheDocument();
    expect(screen.getByText('Job Training Workshop')).toBeInTheDocument();
    expect(screen.getByText('Medical Clinic')).toBeInTheDocument();
    
    // Check if descriptions are displayed
    expect(screen.getByText(/Weekly food distribution/i)).toBeInTheDocument();
    expect(screen.getByText(/Free workshop on resume building/i)).toBeInTheDocument();
    expect(screen.getByText(/Free basic medical services/i)).toBeInTheDocument();
  });

  // TEST 2: Edge Case - Search Functionality
  test('filters resources when search term is entered', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Resources />
        </BrowserRouter>
      </Provider>
    );
    
    // Find the search input
    const searchInput = screen.getByPlaceholderText(/search resources/i);
    
    // Type in the search box
    fireEvent.change(searchInput, { target: { value: 'medical' } });
    
    // Only Medical Clinic should be visible
    expect(screen.getByText('Medical Clinic')).toBeInTheDocument();
    expect(screen.queryByText('Food Pantry')).not.toBeInTheDocument();
    expect(screen.queryByText('Job Training Workshop')).not.toBeInTheDocument();
  });

  // TEST 3: Failure Case - No Resources Found
  test('displays appropriate message when no resources match search criteria', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Resources />
        </BrowserRouter>
      </Provider>
    );
    
    // Find the search input
    const searchInput = screen.getByPlaceholderText(/search resources/i);
    
    // Type in a search term that won't match any resources
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    // Check for "no resources" message
    expect(screen.getByText(/No resources match your search criteria/i)).toBeInTheDocument();
  });

  // TEST 4: Provider View - Management Mode
  test('shows add resource button in management mode', () => {
    // Update store with provider user
    store = mockStore({
      auth: {
        user: mockProviderUser,
        isLoading: false,
        error: null
      },
      resources: {
        resources: mockResources,
        isLoading: false,
        error: null,
        message: ''
      }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Resources isManage={true} />
        </BrowserRouter>
      </Provider>
    );
    
    // Check if Add Resource button is displayed
    expect(screen.getByText(/Add Resource/i)).toBeInTheDocument();
    
    // Check if edit buttons are visible
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    expect(editButtons.length).toBe(mockResources.length);
  });

  // TEST 5: Loading State
  test('displays loading indicator when resources are loading', () => {
    // Create a store with loading state
    const loadingStore = mockStore({
      auth: {
        user: mockUser,
        isLoading: false,
        error: null
      },
      resources: {
        resources: [],
        isLoading: true,
        error: null,
        message: ''
      }
    });
    
    render(
      <Provider store={loadingStore}>
        <BrowserRouter>
          <Resources />
        </BrowserRouter>
      </Provider>
    );
    
    // Check for CircularProgress
    const loadingIndicator = screen.getByRole('progressbar');
    expect(loadingIndicator).toBeInTheDocument();
  });
  
  // TEST 6: Category Filtering
  test('filters resources by category when tabs are clicked', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Resources />
        </BrowserRouter>
      </Provider>
    );
    
    // Find and click the Healthcare tab
    const healthcareTab = screen.getByRole('tab', { name: /healthcare/i });
    fireEvent.click(healthcareTab);
    
    // Only Medical Clinic should be visible
    expect(screen.getByText('Medical Clinic')).toBeInTheDocument();
    expect(screen.queryByText('Food Pantry')).not.toBeInTheDocument();
    expect(screen.queryByText('Job Training Workshop')).not.toBeInTheDocument();
    
    // Find and click the Food tab
    const foodTab = screen.getByRole('tab', { name: /food/i });
    fireEvent.click(foodTab);
    
    // Only Food Pantry should be visible
    expect(screen.getByText('Food Pantry')).toBeInTheDocument();
    expect(screen.queryByText('Medical Clinic')).not.toBeInTheDocument();
    expect(screen.queryByText('Job Training Workshop')).not.toBeInTheDocument();
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
      resources: {
        resources: [],
        isLoading: false,
        error: 'Failed to load resources',
        message: ''
      }
    });
    
    render(
      <Provider store={errorStore}>
        <BrowserRouter>
          <Resources />
        </BrowserRouter>
      </Provider>
    );
    
    // Check for error message
    expect(screen.getByText('Failed to load resources')).toBeInTheDocument();
  });
});
