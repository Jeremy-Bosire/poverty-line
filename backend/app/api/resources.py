"""
Resource API endpoints for the PovertyLine application.
"""
from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, current_user
from app import db
from app.api import api_bp
from app.models import Resource, ResourceStatus
from app.schemas import ResourceCreate, ResourceUpdate, ResourceResponse, ResourceApproval
from app.utils.decorators import admin_required, provider_required
from pydantic import ValidationError
import json
from datetime import datetime

@api_bp.route('/resources', methods=['GET'])
def get_resources():
    """
    Get all approved resources.
    
    Returns:
        JSON response with list of resources
    """
    try:
        # Get query parameters for filtering
        category = request.args.get('category')
        location = request.args.get('location')
        search = request.args.get('search')
        
        # Base query - only show approved resources to the public
        query = Resource.query.filter_by(status=ResourceStatus.APPROVED.value)
        
        # Apply filters if provided
        if category:
            query = query.filter(Resource.category == category)
        if location:
            query = query.filter(Resource.location.ilike(f'%{location}%'))
        if search:
            query = query.filter(
                db.or_(
                    Resource.title.ilike(f'%{search}%'),
                    Resource.description.ilike(f'%{search}%')
                )
            )
        
        # Execute query and convert to response format
        resources = query.all()
        resource_responses = [ResourceResponse.model_validate(resource).model_dump() for resource in resources]
        
        return jsonify({
            "resources": resource_responses,
            "count": len(resource_responses)
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting resources: {str(e)}")
        return jsonify({"error": "An error occurred while retrieving resources"}), 500

@api_bp.route('/resources/all', methods=['GET'])
@jwt_required()
@admin_required
def get_all_resources():
    """
    Get all resources including pending and rejected (admin only).
    
    Returns:
        JSON response with list of resources
    """
    try:
        # Get query parameters for filtering
        status = request.args.get('status')
        category = request.args.get('category')
        provider_id = request.args.get('provider_id')
        
        # Base query
        query = Resource.query
        
        # Apply filters if provided
        if status:
            query = query.filter(Resource.status == status)
        if category:
            query = query.filter(Resource.category == category)
        if provider_id:
            query = query.filter(Resource.provider_id == provider_id)
        
        # Execute query and convert to response format
        resources = query.all()
        resource_responses = [ResourceResponse.model_validate(resource).model_dump() for resource in resources]
        
        return jsonify({
            "resources": resource_responses,
            "count": len(resource_responses)
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting all resources: {str(e)}")
        return jsonify({"error": "An error occurred while retrieving resources"}), 500

@api_bp.route('/resources/my', methods=['GET'])
@jwt_required()
def get_my_resources():
    """
    Get resources created by the current user.
    
    Returns:
        JSON response with list of resources
    """
    try:
        # Get query parameters for filtering
        status = request.args.get('status')
        category = request.args.get('category')
        
        # Base query - filter by current user
        query = Resource.query.filter_by(provider_id=current_user.id)
        
        # Apply filters if provided
        if status:
            query = query.filter(Resource.status == status)
        if category:
            query = query.filter(Resource.category == category)
        
        # Execute query and convert to response format
        resources = query.all()
        resource_responses = [ResourceResponse.model_validate(resource).model_dump() for resource in resources]
        
        return jsonify({
            "resources": resource_responses,
            "count": len(resource_responses)
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting user resources: {str(e)}")
        return jsonify({"error": "An error occurred while retrieving resources"}), 500

@api_bp.route('/resources', methods=['POST'])
@jwt_required()
@provider_required
def create_resource():
    """
    Create a new resource (provider only).
    
    Returns:
        JSON response with created resource data
    """
    try:
        # Validate request data
        resource_data = ResourceCreate(**request.json)
        
        # Set provider ID to current user
        resource_data.provider_id = current_user.id
        
        # Create new resource
        resource = Resource(
            title=resource_data.title,
            description=resource_data.description,
            category=resource_data.category,
            location=resource_data.location,
            provider_id=resource_data.provider_id,
            address=resource_data.address,
            city=resource_data.city,
            state=resource_data.state,
            zip_code=resource_data.zip_code,
            contact_name=resource_data.contact_name,
            contact_phone=resource_data.contact_phone,
            contact_email=resource_data.contact_email,
            start_date=resource_data.start_date,
            end_date=resource_data.end_date,
            requirements=json.dumps(resource_data.requirements) if resource_data.requirements else None,
            additional_info=resource_data.additional_info
        )
        resource.save()
        
        return jsonify({
            "message": "Resource created successfully",
            "resource": ResourceResponse.model_validate(resource).model_dump()
        }), 201
        
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        current_app.logger.error(f"Error creating resource: {str(e)}")
        return jsonify({"error": "An error occurred while creating resource"}), 500

@api_bp.route('/resources/<int:resource_id>', methods=['GET'])
def get_resource(resource_id):
    """
    Get a specific resource.
    
    Args:
        resource_id (int): The ID of the resource to retrieve
        
    Returns:
        JSON response with resource data
    """
    try:
        # Find resource by ID
        resource = Resource.query.get(resource_id)
        
        if not resource:
            return jsonify({"error": "Resource not found"}), 404
        
        # Check if resource is approved or if the user is the provider or an admin
        is_authenticated = False
        try:
            is_authenticated = current_user and (current_user.is_admin() or current_user.id == resource.provider_id)
        except:
            pass
            
        if resource.status != ResourceStatus.APPROVED.value and not is_authenticated:
            return jsonify({"error": "Resource not available"}), 403
        
        return jsonify({
            "resource": ResourceResponse.model_validate(resource).model_dump()
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting resource {resource_id}: {str(e)}")
        return jsonify({"error": "An error occurred while retrieving resource"}), 500

@api_bp.route('/resources/<int:resource_id>', methods=['PUT'])
@jwt_required()
def update_resource(resource_id):
    """
    Update a specific resource.
    
    Args:
        resource_id (int): The ID of the resource to update
        
    Returns:
        JSON response with updated resource data
    """
    try:
        # Find resource by ID
        resource = Resource.query.get(resource_id)
        
        if not resource:
            return jsonify({"error": "Resource not found"}), 404
        
        # Check if the requesting user is an admin or the resource provider
        if not current_user.is_admin() and current_user.id != resource.provider_id:
            return jsonify({"error": "Unauthorized access"}), 403
        
        # Validate request data
        resource_data = ResourceUpdate(**request.json)
        
        # Update resource fields
        if resource_data.title is not None:
            resource.title = resource_data.title
        if resource_data.description is not None:
            resource.description = resource_data.description
        if resource_data.category is not None:
            resource.category = resource_data.category
        if resource_data.location is not None:
            resource.location = resource_data.location
        if resource_data.address is not None:
            resource.address = resource_data.address
        if resource_data.city is not None:
            resource.city = resource_data.city
        if resource_data.state is not None:
            resource.state = resource_data.state
        if resource_data.zip_code is not None:
            resource.zip_code = resource_data.zip_code
        if resource_data.contact_name is not None:
            resource.contact_name = resource_data.contact_name
        if resource_data.contact_phone is not None:
            resource.contact_phone = resource_data.contact_phone
        if resource_data.contact_email is not None:
            resource.contact_email = resource_data.contact_email
        if resource_data.start_date is not None:
            resource.start_date = resource_data.start_date
        if resource_data.end_date is not None:
            resource.end_date = resource_data.end_date
        if resource_data.requirements is not None:
            resource.requirements = json.dumps(resource_data.requirements)
        if resource_data.additional_info is not None:
            resource.additional_info = resource_data.additional_info
        
        # If the resource was approved and a provider makes changes, set it back to pending
        if resource.status == ResourceStatus.APPROVED.value and not current_user.is_admin():
            resource.status = ResourceStatus.PENDING.value
        
        # Save changes
        db.session.commit()
        
        return jsonify({
            "message": "Resource updated successfully",
            "resource": ResourceResponse.model_validate(resource).model_dump()
        }), 200
        
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        current_app.logger.error(f"Error updating resource {resource_id}: {str(e)}")
        return jsonify({"error": "An error occurred while updating resource"}), 500

@api_bp.route('/resources/<int:resource_id>/approval', methods=['POST'])
@jwt_required()
@admin_required
def approve_or_reject_resource(resource_id):
    """
    Approve or reject a resource (admin only).
    
    Args:
        resource_id (int): The ID of the resource to approve or reject
        
    Returns:
        JSON response with updated resource data
    """
    try:
        # Find resource by ID
        resource = Resource.query.get(resource_id)
        
        if not resource:
            return jsonify({"error": "Resource not found"}), 404
        
        # Validate request data
        approval_data = ResourceApproval(**request.json)
        
        # Update resource status
        if approval_data.status == ResourceStatus.APPROVED.value:
            resource.approve(current_user.id)
            message = "Resource approved successfully"
        elif approval_data.status == ResourceStatus.REJECTED.value:
            resource.reject(current_user.id, approval_data.rejection_reason)
            message = "Resource rejected successfully"
        else:
            return jsonify({"error": "Invalid status"}), 400
        
        return jsonify({
            "message": message,
            "resource": ResourceResponse.model_validate(resource).model_dump()
        }), 200
        
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        current_app.logger.error(f"Error updating resource approval {resource_id}: {str(e)}")
        return jsonify({"error": "An error occurred while updating resource approval"}), 500

@api_bp.route('/resources/<int:resource_id>', methods=['DELETE'])
@jwt_required()
def delete_resource(resource_id):
    """
    Delete a specific resource.
    
    Args:
        resource_id (int): The ID of the resource to delete
        
    Returns:
        JSON response with success message
    """
    try:
        # Find resource by ID
        resource = Resource.query.get(resource_id)
        
        if not resource:
            return jsonify({"error": "Resource not found"}), 404
        
        # Check if the requesting user is an admin or the resource provider
        if not current_user.is_admin() and current_user.id != resource.provider_id:
            return jsonify({"error": "Unauthorized access"}), 403
        
        # Delete resource
        resource.delete()
        
        return jsonify({
            "message": "Resource deleted successfully"
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error deleting resource {resource_id}: {str(e)}")
        return jsonify({"error": "An error occurred while deleting resource"}), 500
