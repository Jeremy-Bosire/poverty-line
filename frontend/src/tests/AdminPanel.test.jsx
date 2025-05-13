/**
 * Unit tests for the AdminPanel component
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import AdminPanel from '../components/admin/AdminPanel';
import { 
  fetchAllUsers, 
  fetchAllResources, 
  fetchPendingResources, 
  updateUser,
  changeUserStatus,
  approveRejectResource
} from '../features/admin/adminSlice';

// Mock redux-thunk
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

// Mock the async action creators
jest.mock('../features/admin/adminSlice', () => ({
  fetchAllUsers: jest.fn(),
  fetchAllResources: jest.fn(),
  fetchPendingResources: jest.fn(),
  updateUser: jest.fn(),
  changeUserStatus: jest.fn(),
  approveRejectResource: jest.fn(),
  clearAdminMessages: jest.fn()
}));

describe('AdminPanel Component', () => {
  let store;
  
  // Sample initial state
  const initialState = {
    admin: {
      users: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
          status: 'active',
          created_at: '2023-01-15'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'provider',
          status: 'active',
          created_at: '2023-02-20'
        }
      ],
      pendingResources: [
        {
          id: 1,
          title: 'Medical Clinic',
          category: 'healthcare',
          provider_name: 'Jane Smith',
          city: 'San Francisco',
          status: 'pending',
          created_at: '2023-05-01'
        }
      ],
      allResources: [
        {
          id: 1,
          title: 'Medical Clinic',
          category: 'healthcare',
          provider_name: 'Jane Smith',
          city: 'San Francisco',
          status: 'pending',
          created_at: '2023-05-01'
        },
        {
          id: 2,
          title: 'Food Pantry',
          category: 'food',
          provider_name: 'John Doe',
          city: 'Oakland',
          status: 'approved',
          created_at: '2023-04-15'
        }
      ],
      loading: false,
      error: null,
      success: false,
      message: ''
    }
  };
  
  beforeEach(() => {
    store = mockStore(initialState);
    
    // Clear all mocks before each test
    fetchAllUsers.mockClear();
    fetchAllResources.mockClear();
    fetchPendingResources.mockClear();
    updateUser.mockClear();
    changeUserStatus.mockClear();
    approveRejectResource.mockClear();
  });
  
  // Test 1: Component renders correctly
  test('renders AdminPanel component', () => {
    render(
      <Provider store={store}>
        <AdminPanel />
      </Provider>
    );
    
    // Check if the component renders basic elements
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('System Settings')).toBeInTheDocument();
  });
  
  // Test 2: Component dispatches fetch actions on mount
  test('dispatches fetch actions on mount', () => {
    render(
      <Provider store={store}>
        <AdminPanel />
      </Provider>
    );
    
    // Verify that the component dispatches the correct actions on mount
    expect(fetchAllUsers).toHaveBeenCalledTimes(1);
    expect(fetchAllResources).toHaveBeenCalledTimes(1);
    expect(fetchPendingResources).toHaveBeenCalledTimes(1);
  });
  
  // Test 3: Test tab switching
  test('switches between tabs', () => {
    render(
      <Provider store={store}>
        <AdminPanel />
      </Provider>
    );
    
    // Initially the Users tab should be active
    expect(screen.getByText('User Management')).toBeInTheDocument();
    
    // Click on Resources tab
    fireEvent.click(screen.getByText('Resources'));
    expect(screen.getByText('Resource Management')).toBeInTheDocument();
    
    // Click on System Settings tab
    fireEvent.click(screen.getByText('System Settings'));
    expect(screen.getByText('Application Settings')).toBeInTheDocument();
    expect(screen.getByText('Maintenance')).toBeInTheDocument();
  });
  
  // Test 4: Test user editing
  test('opens user edit dialog when edit button is clicked', () => {
    render(
      <Provider store={store}>
        <AdminPanel />
      </Provider>
    );
    
    // Find edit buttons
    const editButtons = screen.getAllByTitle('Edit user');
    
    // Click the first edit button
    fireEvent.click(editButtons[0]);
    
    // Verify the edit dialog is shown
    expect(screen.getByText('Edit User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
  });

  // Test 5: Test resource approval
  test('approves a pending resource', () => {
    render(
      <Provider store={store}>
        <AdminPanel />
      </Provider>
    );
    
    // Switch to resources tab
    fireEvent.click(screen.getByText('Resources'));
    
    // Find and click approve button
    const approveButtons = screen.getAllByTitle('Approve resource');
    fireEvent.click(approveButtons[0]);
    
    // Verify the approve action was dispatched
    expect(approveRejectResource).toHaveBeenCalledWith({
      resourceId: 1,
      status: 'approved'
    });
  });

  // Test 6: Test error handling in the UI
  test('displays error message when there is an error', () => {
    // Create a store with an error state
    const errorState = {
      admin: {
        ...initialState.admin,
        error: 'Failed to fetch users'
      }
    };
    
    const errorStore = mockStore(errorState);
    
    render(
      <Provider store={errorStore}>
        <AdminPanel />
      </Provider>
    );
    
    // Check if the error message is displayed
    expect(screen.getByText('Failed to fetch users')).toBeInTheDocument();
  });
});
