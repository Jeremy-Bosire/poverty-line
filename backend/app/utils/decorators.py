"""
Decorators for the PovertyLine application.
"""
from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, current_user

def admin_required(fn):
    """
    Decorator to restrict access to admin users only.
    
    Args:
        fn: The function to decorate
        
    Returns:
        The decorated function
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        if not current_user.is_admin():
            return jsonify({"error": "Admin access required"}), 403
        return fn(*args, **kwargs)
    return wrapper

def provider_required(fn):
    """
    Decorator to restrict access to provider users only.
    
    Args:
        fn: The function to decorate
        
    Returns:
        The decorated function
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        if not current_user.is_provider() and not current_user.is_admin():
            return jsonify({"error": "Provider access required"}), 403
        return fn(*args, **kwargs)
    return wrapper
