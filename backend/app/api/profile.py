"""
Profile API endpoints for the PovertyLine application.
"""
from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, current_user
from app import db
from app.api import api_bp
from app.models.profile import Profile
from app.schemas.profile import ProfileUpdate, ProfileResponse
from pydantic import ValidationError

@api_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """
    Get the current user's profile.
    
    Returns:
        JSON response with profile data
    """
    try:
        # Get profile from current user
        profile = current_user.profile
        
        if not profile:
            return jsonify({"error": "Profile not found"}), 404
        
        # Convert to response schema
        profile_data = ProfileResponse.model_validate(profile).model_dump()
        
        return jsonify({
            "profile": profile_data
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting profile: {str(e)}")
        return jsonify({"error": "An error occurred while retrieving profile"}), 500

@api_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """
    Update the current user's profile.
    
    Returns:
        JSON response with updated profile data
    """
    try:
        # Validate request data
        profile_data = ProfileUpdate(**request.json)
        
        # Get profile from current user
        profile = current_user.profile
        
        if not profile:
            return jsonify({"error": "Profile not found"}), 404
        
        # Update profile fields
        for key, value in profile_data.model_dump(exclude_unset=True).items():
            setattr(profile, key, value)
        
        # Update completion percentage
        profile.update_completion_percentage()
        
        # Save changes
        db.session.commit()
        
        # Convert to response schema
        updated_profile = ProfileResponse.model_validate(profile).model_dump()
        
        return jsonify({
            "message": "Profile updated successfully",
            "profile": updated_profile
        }), 200
        
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        current_app.logger.error(f"Error updating profile: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "An error occurred while updating profile"}), 500
