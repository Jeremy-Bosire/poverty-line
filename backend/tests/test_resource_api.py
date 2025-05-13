"""
Tests for the resource API endpoints.
"""
import pytest
import json
from datetime import date, timedelta
from app.models import ResourceCategory, ResourceStatus

def test_get_resources_public(client):
    """Test getting resources as a public user (no authentication)."""
    response = client.get('/api/resources')
    
    assert response.status_code == 200
    assert 'resources' in response.json
    assert 'count' in response.json
    
    # Public users should only see approved resources
    for resource in response.json['resources']:
        assert resource['status'] == ResourceStatus.APPROVED.value

def test_get_resources_with_filters(client):
    """Test getting resources with filters."""
    # Test category filter
    response = client.get('/api/resources?category=FOOD')
    
    assert response.status_code == 200
    for resource in response.json['resources']:
        assert resource['category'] == ResourceCategory.FOOD.value
    
    # Test location filter
    response = client.get('/api/resources?location=Downtown')
    
    assert response.status_code == 200
    # Location filter uses LIKE, so we just check that some resources are returned
    
    # Test search filter
    response = client.get('/api/resources?search=food')
    
    assert response.status_code == 200
    # Search filter uses LIKE on title and description, so we just check that some resources are returned

def test_get_all_resources_admin(client, auth_headers):
    """Test getting all resources as an admin."""
    response = client.get('/api/resources/all', headers=auth_headers['admin'])
    
    assert response.status_code == 200
    assert 'resources' in response.json
    assert 'count' in response.json
    
    # Admin should see resources with all statuses
    statuses = set(resource['status'] for resource in response.json['resources'])
    assert len(statuses) > 1  # There should be more than one status

def test_get_all_resources_unauthorized(client, auth_headers):
    """Test getting all resources as a non-admin user."""
    # Try as a provider
    response = client.get('/api/resources/all', headers=auth_headers['provider'])
    assert response.status_code == 403
    
    # Try as a regular user
    response = client.get('/api/resources/all', headers=auth_headers['user'])
    assert response.status_code == 403
    
    # Try without authentication
    response = client.get('/api/resources/all')
    assert response.status_code == 401

def test_get_my_resources(client, auth_headers):
    """Test getting resources created by the current user."""
    response = client.get('/api/resources/my', headers=auth_headers['provider'])
    
    assert response.status_code == 200
    assert 'resources' in response.json
    assert 'count' in response.json

def test_create_resource_provider(client, auth_headers):
    """Test creating a resource as a provider."""
    resource_data = {
        'title': 'New Test Resource',
        'description': 'This is a new test resource created via API',
        'category': ResourceCategory.FOOD.value,
        'location': 'API Test Location',
        'address': '123 API St',
        'city': 'API City',
        'state': 'AP',
        'zip_code': '12345',
        'contact_name': 'API Contact',
        'contact_phone': '(555) 987-6543',
        'contact_email': 'api@test.com',
        'start_date': date.today().isoformat(),
        'end_date': (date.today() + timedelta(days=30)).isoformat(),
        'requirements': ['API Requirement 1', 'API Requirement 2'],
        'additional_info': 'API additional info'
    }
    
    response = client.post(
        '/api/resources',
        json=resource_data,
        headers=auth_headers['provider']
    )
    
    assert response.status_code == 201
    assert 'resource' in response.json
    assert response.json['resource']['title'] == 'New Test Resource'
    assert response.json['resource']['status'] == ResourceStatus.PENDING.value

def test_create_resource_unauthorized(client, auth_headers):
    """Test creating a resource as a non-provider user."""
    resource_data = {
        'title': 'Unauthorized Resource',
        'description': 'This resource should not be created',
        'category': ResourceCategory.FOOD.value,
        'location': 'Unauthorized Location'
    }
    
    # Try as a regular user
    response = client.post(
        '/api/resources',
        json=resource_data,
        headers=auth_headers['user']
    )
    assert response.status_code == 403
    
    # Try without authentication
    response = client.post('/api/resources', json=resource_data)
    assert response.status_code == 401

def test_get_specific_resource(client):
    """Test getting a specific resource."""
    # First get all resources to find one to test with
    response = client.get('/api/resources')
    resources = response.json['resources']
    
    if resources:
        resource_id = resources[0]['id']
        
        # Get the specific resource
        response = client.get(f'/api/resources/{resource_id}')
        
        assert response.status_code == 200
        assert 'resource' in response.json
        assert response.json['resource']['id'] == resource_id
    else:
        pytest.skip("No resources available to test with")

def test_update_resource(client, auth_headers):
    """Test updating a resource."""
    # First create a resource as a provider
    resource_data = {
        'title': 'Resource to Update',
        'description': 'This resource will be updated',
        'category': ResourceCategory.EDUCATION.value,
        'location': 'Update Location'
    }
    
    create_response = client.post(
        '/api/resources',
        json=resource_data,
        headers=auth_headers['provider']
    )
    
    resource_id = create_response.json['resource']['id']
    
    # Update the resource
    update_data = {
        'title': 'Updated Resource Title',
        'description': 'This resource has been updated'
    }
    
    update_response = client.put(
        f'/api/resources/{resource_id}',
        json=update_data,
        headers=auth_headers['provider']
    )
    
    assert update_response.status_code == 200
    assert update_response.json['resource']['title'] == 'Updated Resource Title'
    assert update_response.json['resource']['description'] == 'This resource has been updated'
    assert update_response.json['resource']['category'] == ResourceCategory.EDUCATION.value  # Unchanged

def test_update_resource_unauthorized(client, auth_headers):
    """Test updating a resource without proper authorization."""
    # First create a resource as a provider
    resource_data = {
        'title': 'Resource for Auth Test',
        'description': 'This resource will test authorization',
        'category': ResourceCategory.LEGAL.value,
        'location': 'Auth Test Location'
    }
    
    create_response = client.post(
        '/api/resources',
        json=resource_data,
        headers=auth_headers['provider']
    )
    
    resource_id = create_response.json['resource']['id']
    
    # Try to update as a different user
    update_data = {
        'title': 'Unauthorized Update'
    }
    
    update_response = client.put(
        f'/api/resources/{resource_id}',
        json=update_data,
        headers=auth_headers['user']
    )
    
    assert update_response.status_code == 403

def test_approve_resource(client, auth_headers):
    """Test approving a resource as an admin."""
    # First create a resource as a provider
    resource_data = {
        'title': 'Resource for Approval',
        'description': 'This resource will be approved',
        'category': ResourceCategory.FOOD.value,
        'location': 'Approval Test Location'
    }
    
    create_response = client.post(
        '/api/resources',
        json=resource_data,
        headers=auth_headers['provider']
    )
    
    resource_id = create_response.json['resource']['id']
    
    # Approve the resource as an admin
    approval_data = {
        'status': ResourceStatus.APPROVED.value
    }
    
    approval_response = client.post(
        f'/api/resources/{resource_id}/approval',
        json=approval_data,
        headers=auth_headers['admin']
    )
    
    assert approval_response.status_code == 200
    assert approval_response.json['resource']['status'] == ResourceStatus.APPROVED.value

def test_reject_resource(client, auth_headers):
    """Test rejecting a resource as an admin."""
    # First create a resource as a provider
    resource_data = {
        'title': 'Resource for Rejection',
        'description': 'This resource will be rejected',
        'category': ResourceCategory.HOUSING.value,
        'location': 'Rejection Test Location'
    }
    
    create_response = client.post(
        '/api/resources',
        json=resource_data,
        headers=auth_headers['provider']
    )
    
    resource_id = create_response.json['resource']['id']
    
    # Reject the resource as an admin
    rejection_data = {
        'status': ResourceStatus.REJECTED.value,
        'rejection_reason': 'Does not meet our criteria'
    }
    
    rejection_response = client.post(
        f'/api/resources/{resource_id}/approval',
        json=rejection_data,
        headers=auth_headers['admin']
    )
    
    assert rejection_response.status_code == 200
    assert rejection_response.json['resource']['status'] == ResourceStatus.REJECTED.value
    assert rejection_response.json['resource']['rejection_reason'] == 'Does not meet our criteria'

def test_approval_unauthorized(client, auth_headers):
    """Test resource approval without admin privileges."""
    # First create a resource as a provider
    resource_data = {
        'title': 'Resource for Auth Approval Test',
        'description': 'This resource will test approval authorization',
        'category': ResourceCategory.HEALTHCARE.value,
        'location': 'Auth Approval Test Location'
    }
    
    create_response = client.post(
        '/api/resources',
        json=resource_data,
        headers=auth_headers['provider']
    )
    
    resource_id = create_response.json['resource']['id']
    
    # Try to approve as a provider
    approval_data = {
        'status': ResourceStatus.APPROVED.value
    }
    
    approval_response = client.post(
        f'/api/resources/{resource_id}/approval',
        json=approval_data,
        headers=auth_headers['provider']
    )
    
    assert approval_response.status_code == 403
    
    # Try to approve as a regular user
    approval_response = client.post(
        f'/api/resources/{resource_id}/approval',
        json=approval_data,
        headers=auth_headers['user']
    )
    
    assert approval_response.status_code == 403

def test_delete_resource(client, auth_headers):
    """Test deleting a resource."""
    # First create a resource as a provider
    resource_data = {
        'title': 'Resource to Delete',
        'description': 'This resource will be deleted',
        'category': ResourceCategory.EMPLOYMENT.value,
        'location': 'Delete Test Location'
    }
    
    create_response = client.post(
        '/api/resources',
        json=resource_data,
        headers=auth_headers['provider']
    )
    
    resource_id = create_response.json['resource']['id']
    
    # Delete the resource
    delete_response = client.delete(
        f'/api/resources/{resource_id}',
        headers=auth_headers['provider']
    )
    
    assert delete_response.status_code == 200
    
    # Verify the resource is deleted
    get_response = client.get(f'/api/resources/{resource_id}')
    assert get_response.status_code == 404

def test_delete_resource_unauthorized(client, auth_headers):
    """Test deleting a resource without proper authorization."""
    # First create a resource as a provider
    resource_data = {
        'title': 'Resource for Delete Auth Test',
        'description': 'This resource will test delete authorization',
        'category': ResourceCategory.TRANSPORTATION.value,
        'location': 'Delete Auth Test Location'
    }
    
    create_response = client.post(
        '/api/resources',
        json=resource_data,
        headers=auth_headers['provider']
    )
    
    resource_id = create_response.json['resource']['id']
    
    # Try to delete as a different user
    delete_response = client.delete(
        f'/api/resources/{resource_id}',
        headers=auth_headers['user']
    )
    
    assert delete_response.status_code == 403
    
    # Admin should be able to delete any resource
    delete_response = client.delete(
        f'/api/resources/{resource_id}',
        headers=auth_headers['admin']
    )
    
    assert delete_response.status_code == 200
