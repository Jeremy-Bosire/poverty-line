"""
Resource model for storing information about available resources.
"""
from app import db
from app.models.base import Base
from datetime import datetime
from enum import Enum as PyEnum

class ResourceCategory(PyEnum):
    """Enum for resource categories."""
    FOOD = 'food'
    HOUSING = 'housing'
    HEALTHCARE = 'healthcare'
    EMPLOYMENT = 'employment'
    EDUCATION = 'education'
    TRANSPORTATION = 'transportation'
    FINANCIAL = 'financial'
    LEGAL = 'legal'
    OTHER = 'other'

class ResourceStatus(PyEnum):
    """Enum for resource status."""
    PENDING = 'pending'
    APPROVED = 'approved'
    REJECTED = 'rejected'
    EXPIRED = 'expired'
    ARCHIVED = 'archived'

class Resource(Base):
    """Resource model for storing information about available resources."""
    
    __tablename__ = 'resources'
    
    # Basic information
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    
    # Category and status
    category = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default=ResourceStatus.PENDING.value, nullable=False)
    
    # Provider information
    provider_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Geographic availability
    location = db.Column(db.String(255), nullable=False)
    address = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    state = db.Column(db.String(100), nullable=True)
    zip_code = db.Column(db.String(20), nullable=True)
    
    # Contact information
    contact_name = db.Column(db.String(100), nullable=True)
    contact_phone = db.Column(db.String(20), nullable=True)
    contact_email = db.Column(db.String(255), nullable=True)
    
    # Availability information
    start_date = db.Column(db.Date, nullable=True)
    end_date = db.Column(db.Date, nullable=True)
    
    # Requirements and additional information
    requirements = db.Column(db.Text, nullable=True)  # JSON-serialized list of requirements
    additional_info = db.Column(db.Text, nullable=True)
    
    # Approval information
    approved_at = db.Column(db.DateTime, nullable=True)
    approved_by_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    approved_by = db.relationship('User', foreign_keys=[approved_by_id])
    rejection_reason = db.Column(db.Text, nullable=True)
    
    def approve(self, admin_id):
        """
        Approve the resource.
        
        Args:
            admin_id (int): ID of the admin approving the resource
            
        Returns:
            Resource: The updated resource
        """
        self.status = ResourceStatus.APPROVED.value
        self.approved_at = datetime.utcnow()
        self.approved_by_id = admin_id
        db.session.commit()
        return self
    
    def reject(self, admin_id, reason):
        """
        Reject the resource.
        
        Args:
            admin_id (int): ID of the admin rejecting the resource
            reason (str): Reason for rejection
            
        Returns:
            Resource: The updated resource
        """
        self.status = ResourceStatus.REJECTED.value
        self.approved_at = datetime.utcnow()
        self.approved_by_id = admin_id
        self.rejection_reason = reason
        db.session.commit()
        return self
    
    def archive(self):
        """
        Archive the resource.
        
        Returns:
            Resource: The updated resource
        """
        self.status = ResourceStatus.ARCHIVED.value
        db.session.commit()
        return self
    
    def is_available(self):
        """
        Check if the resource is currently available.
        
        Returns:
            bool: True if the resource is available, False otherwise
        """
        if self.status != ResourceStatus.APPROVED.value:
            return False
            
        today = datetime.utcnow().date()
        
        # Check start date
        if self.start_date and self.start_date > today:
            return False
            
        # Check end date
        if self.end_date and self.end_date < today:
            # Auto-update status to expired
            if self.status != ResourceStatus.EXPIRED.value:
                self.status = ResourceStatus.EXPIRED.value
                db.session.commit()
            return False
            
        return True
