"""
Tests for the authentication routes.
"""
import pytest
import json
from app.models import User, UserRole, UserStatus

def test_register_success(client):
    """Test successful user registration."""
    response = client.post('/auth/register', json={
        'email': 'newuser@example.com',
        'name': 'New User',
        'password': 'Password123'
    })
    
    assert response.status_code == 201
    assert 'access_token' in response.json
    assert 'user' in response.json
    assert response.json['user']['email'] == 'newuser@example.com'
    assert response.json['user']['name'] == 'New User'
    assert response.json['user']['role'] == UserRole.USER.value

def test_register_duplicate_email(client):
    """Test registration with an existing email."""
    # First registration
    client.post('/auth/register', json={
        'email': 'duplicate@example.com',
        'name': 'First User',
        'password': 'Password123'
    })
    
    # Second registration with the same email
    response = client.post('/auth/register', json={
        'email': 'duplicate@example.com',
        'name': 'Second User',
        'password': 'Password456'
    })
    
    assert response.status_code == 409
    assert 'error' in response.json
    assert 'already exists' in response.json['error']

def test_register_invalid_data(client):
    """Test registration with invalid data."""
    # Missing email
    response = client.post('/auth/register', json={
        'name': 'Invalid User',
        'password': 'Password123'
    })
    
    assert response.status_code == 400
    assert 'error' in response.json
    
    # Invalid password (too short)
    response = client.post('/auth/register', json={
        'email': 'invalid@example.com',
        'name': 'Invalid User',
        'password': 'short'
    })
    
    assert response.status_code == 400
    assert 'error' in response.json
    assert 'password' in response.json['error'].lower()

def test_login_success(client):
    """Test successful login."""
    # Register a user first
    client.post('/auth/register', json={
        'email': 'login@example.com',
        'name': 'Login User',
        'password': 'Password123'
    })
    
    # Login with the registered user
    response = client.post('/auth/login', json={
        'email': 'login@example.com',
        'password': 'Password123'
    })
    
    assert response.status_code == 200
    assert 'access_token' in response.json
    assert 'user' in response.json
    assert response.json['user']['email'] == 'login@example.com'
    assert response.json['user']['name'] == 'Login User'

def test_login_invalid_credentials(client):
    """Test login with invalid credentials."""
    # Register a user first
    client.post('/auth/register', json={
        'email': 'badlogin@example.com',
        'name': 'Bad Login User',
        'password': 'Password123'
    })
    
    # Login with incorrect password
    response = client.post('/auth/login', json={
        'email': 'badlogin@example.com',
        'password': 'WrongPassword'
    })
    
    assert response.status_code == 401
    assert 'error' in response.json
    assert 'invalid' in response.json['error'].lower()
    
    # Login with non-existent email
    response = client.post('/auth/login', json={
        'email': 'nonexistent@example.com',
        'password': 'Password123'
    })
    
    assert response.status_code == 401
    assert 'error' in response.json
    assert 'invalid' in response.json['error'].lower()

def test_login_inactive_user(client, app):
    """Test login with an inactive user."""
    with app.app_context():
        # Create an inactive user
        user = User(
            email='inactive@example.com',
            name='Inactive User',
            role=UserRole.USER.value,
            status=UserStatus.INACTIVE.value
        )
        user.password = 'Password123'
        user.save()
    
    # Try to login with the inactive user
    response = client.post('/auth/login', json={
        'email': 'inactive@example.com',
        'password': 'Password123'
    })
    
    assert response.status_code == 403
    assert 'error' in response.json
    assert 'inactive' in response.json['error'].lower()

def test_login_suspended_user(client, app):
    """Test login with a suspended user."""
    with app.app_context():
        # Create a suspended user
        user = User(
            email='suspended@example.com',
            name='Suspended User',
            role=UserRole.USER.value,
            status=UserStatus.SUSPENDED.value
        )
        user.password = 'Password123'
        user.save()
    
    # Try to login with the suspended user
    response = client.post('/auth/login', json={
        'email': 'suspended@example.com',
        'password': 'Password123'
    })
    
    assert response.status_code == 403
    assert 'error' in response.json
    assert 'suspended' in response.json['error'].lower()

def test_protected_route(client):
    """Test accessing a protected route with and without authentication."""
    # Register and login a user
    client.post('/auth/register', json={
        'email': 'protected@example.com',
        'name': 'Protected User',
        'password': 'Password123'
    })
    
    login_response = client.post('/auth/login', json={
        'email': 'protected@example.com',
        'password': 'Password123'
    })
    
    token = login_response.json['access_token']
    
    # Access a protected route without authentication
    response = client.get('/api/users/1')
    assert response.status_code == 401
    
    # Access a protected route with authentication
    response = client.get('/api/users/1', headers={
        'Authorization': f'Bearer {token}'
    })
    
    # Note: This might return 403 if the user doesn't have permission to access user 1
    # or 404 if user 1 doesn't exist, but it shouldn't return 401
    assert response.status_code != 401

def test_refresh_token(client):
    """Test refreshing an access token."""
    # Register and login a user
    client.post('/auth/register', json={
        'email': 'refresh@example.com',
        'name': 'Refresh User',
        'password': 'Password123'
    })
    
    login_response = client.post('/auth/login', json={
        'email': 'refresh@example.com',
        'password': 'Password123'
    })
    
    token = login_response.json['access_token']
    
    # Refresh the token
    response = client.post('/auth/refresh', headers={
        'Authorization': f'Bearer {token}'
    })
    
    assert response.status_code == 200
    assert 'access_token' in response.json
    assert response.json['access_token'] != token  # The new token should be different
