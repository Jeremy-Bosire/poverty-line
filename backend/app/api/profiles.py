"""
Profile API endpoints for the PovertyLine application.
"""
from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, current_user
from app import db
from app.api import api_bp
from app.models import User, Profile
from app.schemas import ProfileUpdate, ProfileResponse
from app.utils.decorators import admin_required
from pydantic import ValidationError
import json

@api_bp.route('/profiles/<int:user_id>', methods=['GET'])
@jwt_required()
def get_profile(user_id):
    """
    Get a user's profile.
    
    Args:
        user_id (int): The ID of the user whose profile to retrieve
        
    Returns:
        JSON response with profile data
    """
    try:
        # Check if the requesting user is an admin or the profile owner
        if not current_user.is_admin() and current_user.id != user_id:
            return jsonify({"error": "Unauthorized access"}), 403
        
        # Find profile by user ID
        profile = Profile.query.filter_by(user_id=user_id).first()
        
        if not profile:
            return jsonify({"error": "Profile not found"}), 404
        
        return jsonify({
            "profile": ProfileResponse.model_validate(profile).model_dump()
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting profile for user {user_id}: {str(e)}")
        return jsonify({"error": "An error occurred while retrieving profile data"}), 500

@api_bp.route('/profiles/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_profile(user_id):
    """
    Update a user's profile.
    
    Args:
        user_id (int): The ID of the user whose profile to update
        
    Returns:
        JSON response with updated profile data
    """
    try:
        # Check if the requesting user is an admin or the profile owner
        if not current_user.is_admin() and current_user.id != user_id:
            return jsonify({"error": "Unauthorized access"}), 403
        
        # Find profile by user ID
        profile = Profile.query.filter_by(user_id=user_id).first()
        
        if not profile:
            return jsonify({"error": "Profile not found"}), 404
        
        # Validate request data
        profile_data = ProfileUpdate(**request.json)
        
        # Update profile fields
        if profile_data.phone is not None:
            profile.phone = profile_data.phone
        if profile_data.bio is not None:
            profile.bio = profile_data.bio
        if profile_data.address is not None:
            profile.address = profile_data.address
        if profile_data.city is not None:
            profile.city = profile_data.city
        if profile_data.state is not None:
            profile.state = profile_data.state
        if profile_data.zip_code is not None:
            profile.zip_code = profile_data.zip_code
        if profile_data.needs is not None:
            profile.needs = json.dumps(profile_data.needs)
        
        # Update completion percentage
        profile.update_completion_percentage()
        
        # Save changes
        db.session.commit()
        
        return jsonify({
            "message": "Profile updated successfully",
            "profile": ProfileResponse.model_validate(profile).model_dump()
        }), 200
        
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        current_app.logger.error(f"Error updating profile for user {user_id}: {str(e)}")
        return jsonify({"error": "An error occurred while updating profile"}), 500

@api_bp.route('/profiles', methods=['GET'])
@jwt_required()
@admin_required
def get_profiles():
    """
    Get all profiles (admin only).
    
    Returns:
        JSON response with list of profiles
    """
    try:
        # Get query parameters for filtering
        completion_status = request.args.get('completion_status')
        
        # Base query
        query = Profile.query
        
        # Apply filters if provided
        if completion_status == 'complete':
            query = query.filter(Profile.is_complete == True)
        elif completion_status == 'incomplete':
            query = query.filter(Profile.is_complete == False)
        
        # Execute query and convert to response format
        profiles = query.all()
        profile_responses = [ProfileResponse.model_validate(profile).model_dump() for profile in profiles]
        
        return jsonify({
            "profiles": profile_responses,
            "count": len(profile_responses)
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting profiles: {str(e)}")
        return jsonify({"error": "An error occurred while retrieving profiles"}), 500
