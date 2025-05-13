"""
Error handlers for the PovertyLine application.
"""
from flask import jsonify
from pydantic import ValidationError
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

def register_error_handlers(app):
    """
    Register error handlers for the Flask application.
    
    Args:
        app: The Flask application
    """
    @app.errorhandler(400)
    def bad_request(error):
        """Handle bad request errors."""
        return jsonify({"error": "Bad request", "message": str(error)}), 400
    
    @app.errorhandler(401)
    def unauthorized(error):
        """Handle unauthorized errors."""
        return jsonify({"error": "Unauthorized", "message": "Authentication required"}), 401
    
    @app.errorhandler(403)
    def forbidden(error):
        """Handle forbidden errors."""
        return jsonify({"error": "Forbidden", "message": "You don't have permission to access this resource"}), 403
    
    @app.errorhandler(404)
    def not_found(error):
        """Handle not found errors."""
        return jsonify({"error": "Not found", "message": "The requested resource was not found"}), 404
    
    @app.errorhandler(405)
    def method_not_allowed(error):
        """Handle method not allowed errors."""
        return jsonify({"error": "Method not allowed", "message": "The method is not allowed for the requested URL"}), 405
    
    @app.errorhandler(409)
    def conflict(error):
        """Handle conflict errors."""
        return jsonify({"error": "Conflict", "message": str(error)}), 409
    
    @app.errorhandler(422)
    def unprocessable_entity(error):
        """Handle unprocessable entity errors."""
        return jsonify({"error": "Unprocessable entity", "message": str(error)}), 422
    
    @app.errorhandler(500)
    def internal_server_error(error):
        """Handle internal server errors."""
        app.logger.error(f"Internal server error: {str(error)}")
        return jsonify({"error": "Internal server error", "message": "An unexpected error occurred"}), 500
    
    @app.errorhandler(ValidationError)
    def validation_error(error):
        """Handle Pydantic validation errors."""
        return jsonify({"error": "Validation error", "message": str(error)}), 400
    
    @app.errorhandler(IntegrityError)
    def integrity_error(error):
        """Handle SQLAlchemy integrity errors."""
        app.logger.error(f"Database integrity error: {str(error)}")
        return jsonify({"error": "Database error", "message": "A database constraint was violated"}), 409
    
    @app.errorhandler(SQLAlchemyError)
    def sqlalchemy_error(error):
        """Handle general SQLAlchemy errors."""
        app.logger.error(f"Database error: {str(error)}")
        return jsonify({"error": "Database error", "message": "A database error occurred"}), 500
