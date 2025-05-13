"""
Authentication routes for the PovertyLine application.
"""
from flask import request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity,
    get_jwt, current_user
)
from app import db, jwt
from app.auth import auth_bp
from app.models import User, Profile
from app.schemas import (
    UserCreate, UserResponse, UserPasswordUpdate, UserPasswordReset
)
from datetime import datetime
from pydantic import ValidationError

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    """
    Callback function that loads a user from the database whenever
    a protected route is accessed.
    """
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).first()

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user.
    
    Returns:
        JSON response with user data and access token
    """
    try:
        # Validate request data
        user_data = UserCreate(**request.json)
        
        # Check if user already exists
        if User.query.filter_by(email=user_data.email).first():
            return jsonify({"error": "Email already registered"}), 409
        
        # Create new user
        user = User(
            email=user_data.email,
            name=user_data.name,
            role=user_data.role
        )
        user.password = user_data.password  # This will hash the password
        user.save()
        
        # Create profile for the user
        profile = Profile(user_id=user.id)
        profile.save()
        
        # Generate access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            "message": "User registered successfully",
            "user": UserResponse.model_validate(user).model_dump(),
            "token": access_token
        }), 201
        
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        current_app.logger.error(f"Error registering user: {str(e)}")
        return jsonify({"error": "An error occurred while registering user"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Authenticate a user and issue an access token.
    
    Returns:
        JSON response with user data and access token
    """
    try:
        # Get request data
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        # Find user by email
        user = User.query.filter_by(email=email).first()
        
        # Check if user exists and password is correct
        if not user or not user.verify_password(password):
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Check if user is active
        if not user.is_active():
            return jsonify({"error": "Account is inactive or suspended"}), 403
        
        # Update last login timestamp
        user.update_last_login()
        
        # Generate access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            "message": "Login successful",
            "user": UserResponse.model_validate(user).model_dump(),
            "token": access_token
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error logging in: {str(e)}")
        return jsonify({"error": "An error occurred during login"}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """
    Get the current authenticated user.
    
    Returns:
        JSON response with user data
    """
    try:
        return jsonify({
            "user": UserResponse.model_validate(current_user).model_dump()
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error getting current user: {str(e)}")
        return jsonify({"error": "An error occurred while retrieving user data"}), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """
    Change the password for the current authenticated user.
    
    Returns:
        JSON response with success message
    """
    try:
        # Validate request data
        password_data = UserPasswordUpdate(**request.json)
        
        # Verify current password
        if not current_user.verify_password(password_data.current_password):
            return jsonify({"error": "Current password is incorrect"}), 401
        
        # Update password
        current_user.password = password_data.new_password
        db.session.commit()
        
        return jsonify({"message": "Password changed successfully"}), 200
        
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        current_app.logger.error(f"Error changing password: {str(e)}")
        return jsonify({"error": "An error occurred while changing password"}), 500

@auth_bp.route('/reset-password', methods=['POST'])
def request_password_reset():
    """
    Request a password reset for a user.
    
    Returns:
        JSON response with success message
    """
    try:
        # Get request data
        data = request.json
        email = data.get('email')
        
        if not email:
            return jsonify({"error": "Email is required"}), 400
        
        # Find user by email
        user = User.query.filter_by(email=email).first()
        
        # If user exists, generate reset token
        if user:
            token = user.generate_reset_token()
            
            # In a real application, you would send an email with the reset link
            # For now, we'll just return the token in the response
            reset_link = f"{request.host_url}reset-password/{token}"
            
            # Log the reset link for development purposes
            current_app.logger.info(f"Password reset link for {email}: {reset_link}")
            
            # In production, you would use a proper email service
            # send_password_reset_email(user, token)
        
        # Always return success to prevent email enumeration
        return jsonify({
            "message": "If the email exists, a password reset link has been sent"
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error requesting password reset: {str(e)}")
        return jsonify({"error": "An error occurred while processing your request"}), 500

@auth_bp.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    """
    Reset a user's password using a reset token.
    
    Args:
        token (str): The password reset token
        
    Returns:
        JSON response with success message
    """
    try:
        # Validate request data
        reset_data = UserPasswordReset(token=token, **request.json)
        
        # Find user by reset token
        user = User.query.filter_by(reset_token=token).first()
        
        # Check if user exists and token is valid
        if not user or not user.verify_reset_token(token):
            return jsonify({"error": "Invalid or expired reset token"}), 400
        
        # Update password and clear reset token
        user.password = reset_data.new_password
        user.clear_reset_token()
        
        return jsonify({"message": "Password has been reset successfully"}), 200
        
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        current_app.logger.error(f"Error resetting password: {str(e)}")
        return jsonify({"error": "An error occurred while resetting password"}), 500
