"""
PovertyLine Backend Application

This module initializes the Flask application and configures all necessary extensions.
"""
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt

# Set default environment variables if not already set
if 'DATABASE_URL' not in os.environ:
    os.environ['DATABASE_URL'] = 'sqlite:///povertyline_db.sqlite'
if 'SECRET_KEY' not in os.environ:
    os.environ['SECRET_KEY'] = 'dev-secret-key'
if 'JWT_SECRET_KEY' not in os.environ:
    os.environ['JWT_SECRET_KEY'] = 'jwt-secret-key'

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
cors = CORS()
bcrypt = Bcrypt()

def create_app(config_name=None):
    """
    Application factory function that creates and configures the Flask app.
    
    Args:
        config_name: Name of the configuration to use (default, development, testing, production)
        
    Returns:
        Flask application instance
    """
    app = Flask(__name__)
    
    # Load configuration
    from app.config import config
    config_name = config_name or os.environ.get('FLASK_ENV', 'default')
    app.config.from_object(config[config_name])
    
    # Ensure instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    
    # Configure CORS
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}},
        supports_credentials=True
    )
    
    # Register blueprints
    from app.api import api_bp
    from app.auth import auth_bp
    
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    # Import models to ensure they are registered with SQLAlchemy
    from app.models import user, profile, resource
    
    # Setup JWT loader
    @jwt.user_identity_loader
    def user_identity_lookup(user):
        return user.id
    
    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        from app.models.user import User
        identity = jwt_data["sub"]
        return User.query.filter_by(id=identity).one_or_none()
    
    # Shell context processor
    @app.shell_context_processor
    def make_shell_context():
        # Import models here to avoid circular imports
        from app.models.user import User
        from app.models.profile import Profile
        from app.models.resource import Resource
        
        return {
            'db': db, 
            'User': User, 
            'Profile': Profile, 
            'Resource': Resource
        }
    
    # Register comprehensive error handlers
    from app.utils.error_handlers import register_error_handlers
    register_error_handlers(app)
    
    # Register CLI commands
    from app.cli import register_commands
    register_commands(app)
    
    # Create upload directory if it doesn't exist
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    
    return app
