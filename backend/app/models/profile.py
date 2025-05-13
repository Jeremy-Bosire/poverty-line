"""
Profile model for storing user profile information.
"""
from app import db
from app.models.base import Base

class Profile(Base):
    """Profile model for storing user profile information."""
    
    __tablename__ = 'profiles'
    
    # User relationship
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    
    # Personal information
    phone = db.Column(db.String(20), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    
    # Location information
    address = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    state = db.Column(db.String(100), nullable=True)
    zip_code = db.Column(db.String(20), nullable=True)
    
    # Basic needs information
    needs = db.Column(db.Text, nullable=True)  # JSON-serialized list of needs
    
    # Profile completion tracking
    is_complete = db.Column(db.Boolean, default=False)
    completion_percentage = db.Column(db.Integer, default=0)
    
    def update_completion_percentage(self):
        """
        Calculate and update the profile completion percentage.
        
        Returns:
            int: The updated completion percentage
        """
        # Define required fields for a complete profile
        required_fields = ['phone', 'address', 'city', 'state', 'zip_code']
        optional_fields = ['bio', 'needs']
        
        # Calculate percentage based on filled required fields
        filled_required = sum(1 for field in required_fields if getattr(self, field))
        filled_optional = sum(1 for field in optional_fields if getattr(self, field))
        
        # Weight required fields more heavily than optional fields
        required_weight = 0.7
        optional_weight = 0.3
        
        required_percentage = (filled_required / len(required_fields)) * required_weight * 100
        optional_percentage = (filled_optional / len(optional_fields)) * optional_weight * 100
        
        total_percentage = int(required_percentage + optional_percentage)
        
        # Update fields
        self.completion_percentage = total_percentage
        self.is_complete = total_percentage >= 80  # Consider complete if 80% or more
        
        # Save changes
        db.session.commit()
        
        return self.completion_percentage
