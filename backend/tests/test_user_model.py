"""
Tests for the User model.
"""
import pytest
from app.models import User, UserRole, UserStatus
from app import db

def test_create_user(app):
    """Test creating a user."""
    with app.app_context():
        # Create a new user
        user = User(
            email='newuser@test.com',
            name='New User',
            role=UserRole.USER.value,
            status=UserStatus.ACTIVE.value
        )
        user.password = 'Password123'
        user.save()
        
        # Retrieve the user from the database
        saved_user = User.query.filter_by(email='newuser@test.com').first()
        
        # Assert that the user was saved correctly
        assert saved_user is not None
        assert saved_user.email == 'newuser@test.com'
        assert saved_user.name == 'New User'
        assert saved_user.role == UserRole.USER.value
        assert saved_user.status == UserStatus.ACTIVE.value
        assert saved_user.verify_password('Password123')

def test_password_hashing(app):
    """Test that passwords are properly hashed."""
    with app.app_context():
        # Create a new user
        user = User(
            email='password@test.com',
            name='Password User',
            role=UserRole.USER.value,
            status=UserStatus.ACTIVE.value
        )
        user.password = 'TestPassword123'
        user.save()
        
        # Assert that the password is hashed
        assert user._password != 'TestPassword123'
        assert user.verify_password('TestPassword123')
        assert not user.verify_password('WrongPassword')

def test_user_roles(app):
    """Test user role methods."""
    with app.app_context():
        # Create users with different roles
        admin = User(
            email='roleadmin@test.com',
            name='Role Admin',
            role=UserRole.ADMIN.value,
            status=UserStatus.ACTIVE.value
        )
        admin.save()
        
        provider = User(
            email='roleprovider@test.com',
            name='Role Provider',
            role=UserRole.PROVIDER.value,
            status=UserStatus.ACTIVE.value
        )
        provider.save()
        
        user = User(
            email='roleuser@test.com',
            name='Role User',
            role=UserRole.USER.value,
            status=UserStatus.ACTIVE.value
        )
        user.save()
        
        # Test role methods
        assert admin.is_admin()
        assert not admin.is_provider()
        
        assert provider.is_provider()
        assert not provider.is_admin()
        
        assert not user.is_admin()
        assert not user.is_provider()

def test_user_status(app):
    """Test user status methods."""
    with app.app_context():
        # Create users with different statuses
        active = User(
            email='active@test.com',
            name='Active User',
            role=UserRole.USER.value,
            status=UserStatus.ACTIVE.value
        )
        active.save()
        
        inactive = User(
            email='inactive@test.com',
            name='Inactive User',
            role=UserRole.USER.value,
            status=UserStatus.INACTIVE.value
        )
        inactive.save()
        
        suspended = User(
            email='suspended@test.com',
            name='Suspended User',
            role=UserRole.USER.value,
            status=UserStatus.SUSPENDED.value
        )
        suspended.save()
        
        # Test status methods
        assert active.is_active()
        assert not active.is_inactive()
        assert not active.is_suspended()
        
        assert inactive.is_inactive()
        assert not inactive.is_active()
        assert not inactive.is_suspended()
        
        assert suspended.is_suspended()
        assert not suspended.is_active()
        assert not suspended.is_inactive()

def test_change_role(app):
    """Test changing a user's role."""
    with app.app_context():
        # Create a new user
        user = User(
            email='changerole@test.com',
            name='Change Role User',
            role=UserRole.USER.value,
            status=UserStatus.ACTIVE.value
        )
        user.save()
        
        # Change role to provider
        user.role = UserRole.PROVIDER.value
        db.session.commit()
        
        # Retrieve the user from the database
        updated_user = User.query.filter_by(email='changerole@test.com').first()
        
        # Assert that the role was updated
        assert updated_user.role == UserRole.PROVIDER.value
        assert updated_user.is_provider()
        assert not updated_user.is_admin()

def test_change_status(app):
    """Test changing a user's status."""
    with app.app_context():
        # Create a new user
        user = User(
            email='changestatus@test.com',
            name='Change Status User',
            role=UserRole.USER.value,
            status=UserStatus.ACTIVE.value
        )
        user.save()
        
        # Change status to suspended
        user.status = UserStatus.SUSPENDED.value
        db.session.commit()
        
        # Retrieve the user from the database
        updated_user = User.query.filter_by(email='changestatus@test.com').first()
        
        # Assert that the status was updated
        assert updated_user.status == UserStatus.SUSPENDED.value
        assert updated_user.is_suspended()
        assert not updated_user.is_active()
        
        # Change status back to active
        updated_user.status = UserStatus.ACTIVE.value
        db.session.commit()
        
        # Retrieve the user from the database again
        reactivated_user = User.query.filter_by(email='changestatus@test.com').first()
        
        # Assert that the status was updated
        assert reactivated_user.status == UserStatus.ACTIVE.value
        assert reactivated_user.is_active()
        assert not reactivated_user.is_suspended()
