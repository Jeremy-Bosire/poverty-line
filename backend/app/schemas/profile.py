"""
Profile schemas for data validation.
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from app.schemas.base import BaseSchema
import json

class ProfileBase(BaseModel):
    """Base schema for profile data."""
    
    phone: Optional[str] = Field(None, max_length=20)
    bio: Optional[str] = None
    address: Optional[str] = Field(None, max_length=255)
    city: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=100)
    zip_code: Optional[str] = Field(None, max_length=20)
    needs: Optional[List[str]] = None
    
    @validator('needs', pre=True)
    def parse_needs(cls, v):
        """Parse needs from JSON string if needed."""
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                raise ValueError('Invalid JSON for needs')
        return v

class ProfileCreate(ProfileBase):
    """Schema for creating a new profile."""
    
    user_id: int

class ProfileUpdate(ProfileBase):
    """Schema for updating an existing profile."""
    pass

class ProfileResponse(BaseSchema, ProfileBase):
    """Schema for profile response data."""
    
    user_id: int
    is_complete: bool
    completion_percentage: int
    
    class Config:
        """Pydantic configuration."""
        from_attributes = True
