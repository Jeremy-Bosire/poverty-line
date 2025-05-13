"""
User model for authentication and authorization.
"""
from app import db, bcrypt
from app.models.base import Base
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime
from enum import Enum as PyEnum

class UserRole(PyEnum):
    """Enum for user roles."""
    USER = 'user'
    PROVIDER = 'provider'
    ADMIN = 'admin'

class UserStatus(PyEnum):
    """Enum for user account status."""
    ACTIVE = 'active'
    INACTIVE = 'inactive'
    SUSPENDED = 'suspended'

class User(Base):
    """User model for authentication and authorization."""
    
    __tablename__ = 'users'
    
    # Authentication fields
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    _password = db.Column('password', db.String(128), nullable=False)
    
    # User information
    name = db.Column(db.String(100), nullable=False)
    
    # Role and status
    role = db.Column(db.String(20), default=UserRole.USER.value, nullable=False)
    status = db.Column(db.String(20), default=UserStatus.ACTIVE.value, nullable=False)
    
    # Account management
    email_verified = db.Column(db.Boolean, default=False)
    email_verified_at = db.Column(db.DateTime, nullable=True)
    last_login_at = db.Column(db.DateTime, nullable=True)
    
    # Reset password
    reset_token = db.Column(db.String(100), nullable=True)
    reset_token_expires_at = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    profile = db.relationship('Profile', backref='user', uselist=False, cascade='all, delete-orphan')
    resources = db.relationship('Resource', backref='provider', lazy='dynamic', 
                               cascade='all, delete-orphan',
                               foreign_keys='Resource.provider_id')
    
    @hybrid_property
    def password(self):
        """Prevent password from being accessed."""
        raise AttributeError('Password is not a readable attribute')
    
    @password.setter
    def password(self, password):
        """Hash password on set."""
        self._password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def verify_password(self, password):
        """Check if password matches the hashed password."""
        return bcrypt.check_password_hash(self._password, password)
    
    def update_last_login(self):
        """Update the last login timestamp."""
        self.last_login_at = datetime.utcnow()
        db.session.commit()
    
    def generate_reset_token(self):
        """Generate a password reset token."""
        import secrets
        from datetime import timedelta
        
        self.reset_token = secrets.token_urlsafe(32)
        self.reset_token_expires_at = datetime.utcnow() + timedelta(hours=24)
        db.session.commit()
        return self.reset_token
    
    def verify_reset_token(self, token):
        """Verify if the reset token is valid."""
        if (self.reset_token != token or 
            self.reset_token_expires_at is None or 
            datetime.utcnow() > self.reset_token_expires_at):
            return False
        return True
    
    def clear_reset_token(self):
        """Clear the reset token after use."""
        self.reset_token = None
        self.reset_token_expires_at = None
        db.session.commit()
    
    def verify_email(self):
        """Mark email as verified."""
        self.email_verified = True
        self.email_verified_at = datetime.utcnow()
        db.session.commit()
    
    def is_admin(self):
        """Check if user has admin role."""
        return self.role == UserRole.ADMIN.value
    
    def is_provider(self):
        """Check if user has provider role."""
        return self.role == UserRole.PROVIDER.value
    
    def is_active(self):
        """Check if user account is active."""
        return self.status == UserStatus.ACTIVE.value
    
    def to_dict(self):
        """Convert user to dictionary without sensitive information."""
        user_dict = super().to_dict()
        # Remove sensitive fields
        user_dict.pop('_password', None)
        user_dict.pop('reset_token', None)
        user_dict.pop('reset_token_expires_at', None)
        # Rename _password to password in the dictionary
        user_dict['password'] = '********'
        return user_dict
