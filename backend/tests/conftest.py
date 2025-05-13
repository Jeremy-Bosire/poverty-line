"""
Test configuration for the PovertyLine application.
"""
import os
import pytest
import tempfile
from app import create_app, db
from app.models import User, UserRole, UserStatus, Profile, Resource

@pytest.fixture
def app():
    """Create and configure a Flask app for testing."""
    # Create a temporary file to isolate the database for each test
    db_fd, db_path = tempfile.mkstemp()
    app = create_app({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': f'sqlite:///{db_path}',
        'SQLALCHEMY_TRACK_MODIFICATIONS': False,
        'JWT_SECRET_KEY': 'test-secret-key',
        'JWT_ACCESS_TOKEN_EXPIRES': 3600,  # 1 hour
    })

    # Create the database and load test data
    with app.app_context():
        db.create_all()
        
        # Create test users
        admin = User(
            email='admin@test.com',
            name='Test Admin',
            role=UserRole.ADMIN.value,
            status=UserStatus.ACTIVE.value,
            email_verified=True
        )
        admin.password = 'TestAdmin123'
        admin.save()
        
        provider = User(
            email='provider@test.com',
            name='Test Provider',
            role=UserRole.PROVIDER.value,
            status=UserStatus.ACTIVE.value,
            email_verified=True
        )
        provider.password = 'TestProvider123'
        provider.save()
        
        user = User(
            email='user@test.com',
            name='Test User',
            role=UserRole.USER.value,
            status=UserStatus.ACTIVE.value,
            email_verified=True
        )
        user.password = 'TestUser123'
        user.save()
        
        # Create test profiles
        admin_profile = Profile(user_id=admin.id)
        admin_profile.save()
        
        provider_profile = Profile(user_id=provider.id)
        provider_profile.save()
        
        user_profile = Profile(user_id=user.id)
        user_profile.save()

    yield app

    # Close and remove the temporary database
    os.close(db_fd)
    os.unlink(db_path)

@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()

@pytest.fixture
def runner(app):
    """A test CLI runner for the app."""
    return app.test_cli_runner()

@pytest.fixture
def auth_headers(client):
    """Get auth headers for different user types."""
    headers = {}
    
    # Admin login
    response = client.post('/auth/login', json={
        'email': 'admin@test.com',
        'password': 'TestAdmin123'
    })
    headers['admin'] = {
        'Authorization': f'Bearer {response.json["access_token"]}'
    }
    
    # Provider login
    response = client.post('/auth/login', json={
        'email': 'provider@test.com',
        'password': 'TestProvider123'
    })
    headers['provider'] = {
        'Authorization': f'Bearer {response.json["access_token"]}'
    }
    
    # User login
    response = client.post('/auth/login', json={
        'email': 'user@test.com',
        'password': 'TestUser123'
    })
    headers['user'] = {
        'Authorization': f'Bearer {response.json["access_token"]}'
    }
    
    return headers
