"""
Resource schemas for data validation.
"""
from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional, List, Dict, Any
from datetime import date, datetime
from app.schemas.base import BaseSchema
from app.models.resource import ResourceCategory, ResourceStatus
import json

class ResourceBase(BaseModel):
    """Base schema for resource data."""
    
    title: str = Field(..., min_length=3, max_length=255)
    description: str = Field(..., min_length=10)
    category: str = Field(...)
    location: str = Field(..., min_length=2, max_length=255)
    address: Optional[str] = Field(None, max_length=255)
    city: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=100)
    zip_code: Optional[str] = Field(None, max_length=20)
    contact_name: Optional[str] = Field(None, max_length=100)
    contact_phone: Optional[str] = Field(None, max_length=20)
    contact_email: Optional[EmailStr] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    requirements: Optional[List[str]] = None
    additional_info: Optional[str] = None
    
    @validator('category')
    def validate_category(cls, v):
        """Validate that category is one of the allowed values."""
        if v not in [category.value for category in ResourceCategory]:
            raise ValueError(f'Category must be one of {[category.value for category in ResourceCategory]}')
        return v
        
    @validator('end_date')
    def validate_end_date(cls, v, values):
        """Validate that end_date is after start_date."""
        if v and 'start_date' in values and values['start_date'] and v < values['start_date']:
            raise ValueError('End date must be after start date')
        return v
        
    @validator('requirements', pre=True)
    def parse_requirements(cls, v):
        """Parse requirements from JSON string if needed."""
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                raise ValueError('Invalid JSON for requirements')
        return v

class ResourceCreate(ResourceBase):
    """Schema for creating a new resource."""
    
    provider_id: Optional[int] = None  # Will be set from the authenticated user

class ResourceUpdate(BaseModel):
    """Schema for updating an existing resource."""
    
    title: Optional[str] = Field(None, min_length=3, max_length=255)
    description: Optional[str] = Field(None, min_length=10)
    category: Optional[str] = None
    location: Optional[str] = Field(None, min_length=2, max_length=255)
    address: Optional[str] = Field(None, max_length=255)
    city: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=100)
    zip_code: Optional[str] = Field(None, max_length=20)
    contact_name: Optional[str] = Field(None, max_length=100)
    contact_phone: Optional[str] = Field(None, max_length=20)
    contact_email: Optional[EmailStr] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    requirements: Optional[List[str]] = None
    additional_info: Optional[str] = None
    
    @validator('category')
    def validate_category(cls, v):
        """Validate that category is one of the allowed values."""
        if v is not None and v not in [category.value for category in ResourceCategory]:
            raise ValueError(f'Category must be one of {[category.value for category in ResourceCategory]}')
        return v
        
    @validator('end_date')
    def validate_end_date(cls, v, values):
        """Validate that end_date is after start_date."""
        if v and 'start_date' in values and values['start_date'] and v < values['start_date']:
            raise ValueError('End date must be after start date')
        return v
        
    @validator('requirements', pre=True)
    def parse_requirements(cls, v):
        """Parse requirements from JSON string if needed."""
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                raise ValueError('Invalid JSON for requirements')
        return v

class ResourceApproval(BaseModel):
    """Schema for approving or rejecting a resource."""
    
    status: str = Field(...)
    rejection_reason: Optional[str] = None
    
    @validator('status')
    def validate_status(cls, v):
        """Validate that status is either approved or rejected."""
        if v not in [ResourceStatus.APPROVED.value, ResourceStatus.REJECTED.value]:
            raise ValueError(f'Status must be either {ResourceStatus.APPROVED.value} or {ResourceStatus.REJECTED.value}')
        return v
        
    @validator('rejection_reason')
    def validate_rejection_reason(cls, v, values):
        """Validate that rejection_reason is provided if status is rejected."""
        if values.get('status') == ResourceStatus.REJECTED.value and not v:
            raise ValueError('Rejection reason is required when rejecting a resource')
        return v

class ResourceResponse(BaseSchema, ResourceBase):
    """Schema for resource response data."""
    
    provider_id: int
    status: str
    approved_at: Optional[datetime] = None
    approved_by_id: Optional[int] = None
    rejection_reason: Optional[str] = None
    
    class Config:
        """Pydantic configuration."""
        from_attributes = True
