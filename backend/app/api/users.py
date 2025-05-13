"""
User API endpoints for the PovertyLine application.
"""
from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, current_user
from app import db
from app.api import api_bp
from app.models import User, UserRole
from app.schemas import UserUpdate, UserResponse
from app.utils.decorators import admin_required
from pydantic import ValidationError

@api_bp.route('/users', methods=['GET'])
@jwt_required()
@admin_required
def get_users():
    """
    Get all users (admin only).
    
    Returns:
        JSON response with list of users
    """
    try:
        # Get query parameters for filtering
        role = request.args.get('role')
        status = request.args.get('status')
        
        # Base query
        query = User.query
        
        # Apply filters if provided
        if role:
            query = query.filter(User.role == role)
        if status:
            query = query.filter(User.status == status)
        
        # Execute query and convert to response format
        users = query.all()
        user_responses = [UserResponse.model_validate(user).model_dump() for user in users]
        
        return jsonify({
            "users": user_responses,
            "count": len(user_responses)
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting users: {str(e)}")
        return jsonify({"error": "An error occurred while retrieving users"}), 500

@api_bp.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    """
    Get a specific user.
    
    Args:
        user_id (int): The ID of the user to retrieve
        
    Returns:
        JSON response with user data
    """
    try:
        # Check if the requesting user is an admin or the user being requested
        if not current_user.is_admin() and current_user.id != user_id:
            return jsonify({"error": "Unauthorized access"}), 403
        
        # Find user by ID
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({
            "user": UserResponse.model_validate(user).model_dump()
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting user {user_id}: {str(e)}")
        return jsonify({"error": "An error occurred while retrieving user data"}), 500

@api_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    """
    Update a specific user.
    
    Args:
        user_id (int): The ID of the user to update
        
    Returns:
        JSON response with updated user data
    """
    try:
        # Check if the requesting user is an admin or the user being updated
        if not current_user.is_admin() and current_user.id != user_id:
            return jsonify({"error": "Unauthorized access"}), 403
        
        # Find user by ID
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Validate request data
        user_data = UserUpdate(**request.json)
        
        # Check if email is being changed and if it's already in use
        if user_data.email and user_data.email != user.email:
            existing_user = User.query.filter_by(email=user_data.email).first()
            if existing_user:
                return jsonify({"error": "Email already in use"}), 409
        
        # Check if role is being changed and if the requesting user is an admin
        if user_data.role and user_data.role != user.role and not current_user.is_admin():
            return jsonify({"error": "Only admins can change user roles"}), 403
        
        # Check if status is being changed and if the requesting user is an admin
        if user_data.status and user_data.status != user.status and not current_user.is_admin():
            return jsonify({"error": "Only admins can change user status"}), 403
        
        # Update user fields
        if user_data.name:
            user.name = user_data.name
        if user_data.email:
            user.email = user_data.email
        if user_data.role and current_user.is_admin():
            user.role = user_data.role
        if user_data.status and current_user.is_admin():
            user.status = user_data.status
        
        # Save changes
        db.session.commit()
        
        return jsonify({
            "message": "User updated successfully",
            "user": UserResponse.model_validate(user).model_dump()
        }), 200
        
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        current_app.logger.error(f"Error updating user {user_id}: {str(e)}")
        return jsonify({"error": "An error occurred while updating user"}), 500

@api_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_user(user_id):
    """
    Delete a specific user (admin only).
    
    Args:
        user_id (int): The ID of the user to delete
        
    Returns:
        JSON response with success message
    """
    try:
        # Find user by ID
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Prevent deleting the last admin
        if user.is_admin():
            admin_count = User.query.filter_by(role=UserRole.ADMIN.value).count()
            if admin_count <= 1:
                return jsonify({"error": "Cannot delete the last admin user"}), 400
        
        # Delete user
        user.delete()
        
        return jsonify({
            "message": "User deleted successfully"
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error deleting user {user_id}: {str(e)}")
        return jsonify({"error": "An error occurred while deleting user"}), 500
