"""
Tests for the Resource model.
"""
import pytest
import json
from datetime import date, datetime, timedelta
from app.models import Resource, ResourceCategory, ResourceStatus, User
from app import db

def test_create_resource(app):
    """Test creating a resource."""
    with app.app_context():
        # Get a provider user
        provider = User.query.filter_by(email='provider@test.com').first()
        
        # Create a new resource
        resource = Resource(
            title='Test Resource',
            description='This is a test resource',
            category=ResourceCategory.FOOD.value,
            location='Test Location',
            provider_id=provider.id,
            address='123 Test St',
            city='Test City',
            state='TS',
            zip_code='12345',
            contact_name='Test Contact',
            contact_phone='(555) 123-4567',
            contact_email='contact@test.com',
            start_date=date.today(),
            end_date=date.today() + timedelta(days=30),
            requirements=json.dumps(['Test Requirement']),
            additional_info='Test additional info',
            status=ResourceStatus.PENDING.value
        )
        resource.save()
        
        # Retrieve the resource from the database
        saved_resource = Resource.query.filter_by(title='Test Resource').first()
        
        # Assert that the resource was saved correctly
        assert saved_resource is not None
        assert saved_resource.title == 'Test Resource'
        assert saved_resource.description == 'This is a test resource'
        assert saved_resource.category == ResourceCategory.FOOD.value
        assert saved_resource.location == 'Test Location'
        assert saved_resource.provider_id == provider.id
        assert saved_resource.status == ResourceStatus.PENDING.value

def test_approve_resource(app):
    """Test approving a resource."""
    with app.app_context():
        # Get a provider and admin user
        provider = User.query.filter_by(email='provider@test.com').first()
        admin = User.query.filter_by(email='admin@test.com').first()
        
        # Create a new resource
        resource = Resource(
            title='Resource to Approve',
            description='This resource will be approved',
            category=ResourceCategory.HOUSING.value,
            location='Approval Location',
            provider_id=provider.id,
            status=ResourceStatus.PENDING.value
        )
        resource.save()
        
        # Approve the resource
        resource.approve(admin.id)
        
        # Retrieve the resource from the database
        approved_resource = Resource.query.filter_by(title='Resource to Approve').first()
        
        # Assert that the resource was approved correctly
        assert approved_resource.status == ResourceStatus.APPROVED.value
        assert approved_resource.approved_by_id == admin.id
        assert approved_resource.approved_at is not None
        assert approved_resource.rejection_reason is None

def test_reject_resource(app):
    """Test rejecting a resource."""
    with app.app_context():
        # Get a provider and admin user
        provider = User.query.filter_by(email='provider@test.com').first()
        admin = User.query.filter_by(email='admin@test.com').first()
        
        # Create a new resource
        resource = Resource(
            title='Resource to Reject',
            description='This resource will be rejected',
            category=ResourceCategory.HEALTHCARE.value,
            location='Rejection Location',
            provider_id=provider.id,
            status=ResourceStatus.PENDING.value
        )
        resource.save()
        
        # Reject the resource
        rejection_reason = 'Missing required information'
        resource.reject(admin.id, rejection_reason)
        
        # Retrieve the resource from the database
        rejected_resource = Resource.query.filter_by(title='Resource to Reject').first()
        
        # Assert that the resource was rejected correctly
        assert rejected_resource.status == ResourceStatus.REJECTED.value
        assert rejected_resource.rejected_by_id == admin.id
        assert rejected_resource.rejected_at is not None
        assert rejected_resource.rejection_reason == rejection_reason
        assert rejected_resource.approved_by_id is None
        assert rejected_resource.approved_at is None

def test_update_resource(app):
    """Test updating a resource."""
    with app.app_context():
        # Get a provider user
        provider = User.query.filter_by(email='provider@test.com').first()
        
        # Create a new resource
        resource = Resource(
            title='Original Title',
            description='Original description',
            category=ResourceCategory.EDUCATION.value,
            location='Original Location',
            provider_id=provider.id,
            status=ResourceStatus.PENDING.value
        )
        resource.save()
        
        # Update the resource
        resource.title = 'Updated Title'
        resource.description = 'Updated description'
        resource.category = ResourceCategory.EMPLOYMENT.value
        db.session.commit()
        
        # Retrieve the resource from the database
        updated_resource = Resource.query.filter_by(title='Updated Title').first()
        
        # Assert that the resource was updated correctly
        assert updated_resource is not None
        assert updated_resource.title == 'Updated Title'
        assert updated_resource.description == 'Updated description'
        assert updated_resource.category == ResourceCategory.EMPLOYMENT.value
        assert updated_resource.location == 'Original Location'  # Unchanged
        assert updated_resource.provider_id == provider.id  # Unchanged

def test_delete_resource(app):
    """Test deleting a resource."""
    with app.app_context():
        # Get a provider user
        provider = User.query.filter_by(email='provider@test.com').first()
        
        # Create a new resource
        resource = Resource(
            title='Resource to Delete',
            description='This resource will be deleted',
            category=ResourceCategory.LEGAL.value,
            location='Delete Location',
            provider_id=provider.id,
            status=ResourceStatus.PENDING.value
        )
        resource.save()
        
        # Get the resource ID
        resource_id = resource.id
        
        # Delete the resource
        resource.delete()
        
        # Try to retrieve the resource from the database
        deleted_resource = Resource.query.get(resource_id)
        
        # Assert that the resource was deleted
        assert deleted_resource is None

def test_resource_status_transitions(app):
    """Test resource status transitions."""
    with app.app_context():
        # Get a provider and admin user
        provider = User.query.filter_by(email='provider@test.com').first()
        admin = User.query.filter_by(email='admin@test.com').first()
        
        # Create a new resource
        resource = Resource(
            title='Status Transition Resource',
            description='This resource will go through status transitions',
            category=ResourceCategory.FOOD.value,
            location='Transition Location',
            provider_id=provider.id,
            status=ResourceStatus.PENDING.value
        )
        resource.save()
        
        # Approve the resource
        resource.approve(admin.id)
        
        # Assert that the resource was approved
        assert resource.status == ResourceStatus.APPROVED.value
        assert resource.approved_by_id == admin.id
        assert resource.approved_at is not None
        
        # Reject the resource
        resource.reject(admin.id, 'Changed decision')
        
        # Assert that the resource was rejected and approval info was cleared
        assert resource.status == ResourceStatus.REJECTED.value
        assert resource.rejected_by_id == admin.id
        assert resource.rejected_at is not None
        assert resource.rejection_reason == 'Changed decision'
        assert resource.approved_by_id is None
        assert resource.approved_at is None
        
        # Approve the resource again
        resource.approve(admin.id)
        
        # Assert that the resource was approved and rejection info was cleared
        assert resource.status == ResourceStatus.APPROVED.value
        assert resource.approved_by_id == admin.id
        assert resource.approved_at is not None
        assert resource.rejected_by_id is None
        assert resource.rejected_at is None
        assert resource.rejection_reason is None
