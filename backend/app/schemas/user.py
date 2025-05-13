"""
User schemas for data validation.
"""
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime
from app.schemas.base import BaseSchema
from app.models.user import UserRole, UserStatus

class UserBase(BaseModel):
    """Base schema for user data."""
    
    email: EmailStr
    name: str = Field(..., min_length=2, max_length=100)
    role: str = Field(default=UserRole.USER.value)
    
    @validator('role')
    def validate_role(cls, v):
        """Validate that role is one of the allowed values."""
        if v not in [role.value for role in UserRole]:
            raise ValueError(f'Role must be one of {[role.value for role in UserRole]}')
        return v

class UserCreate(UserBase):
    """Schema for creating a new user."""
    
    password: str = Field(..., min_length=8)
    
    @validator('password')
    def validate_password(cls, v):
        """Validate password complexity."""
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(char.islower() for char in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        return v

class UserUpdate(BaseModel):
    """Schema for updating an existing user."""
    
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    status: Optional[str] = None
    
    @validator('role')
    def validate_role(cls, v):
        """Validate that role is one of the allowed values."""
        if v is not None and v not in [role.value for role in UserRole]:
            raise ValueError(f'Role must be one of {[role.value for role in UserRole]}')
        return v
        
    @validator('status')
    def validate_status(cls, v):
        """Validate that status is one of the allowed values."""
        if v is not None and v not in [status.value for status in UserStatus]:
            raise ValueError(f'Status must be one of {[status.value for status in UserStatus]}')
        return v

class UserPasswordUpdate(BaseModel):
    """Schema for updating a user's password."""
    
    current_password: str
    new_password: str = Field(..., min_length=8)
    
    @validator('new_password')
    def validate_password(cls, v):
        """Validate password complexity."""
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(char.islower() for char in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        return v

class UserPasswordReset(BaseModel):
    """Schema for resetting a user's password."""
    
    token: str
    new_password: str = Field(..., min_length=8)
    
    @validator('new_password')
    def validate_password(cls, v):
        """Validate password complexity."""
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(char.islower() for char in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        return v

class UserResponse(BaseSchema, UserBase):
    """Schema for user response data."""
    
    status: str
    email_verified: bool
    email_verified_at: Optional[datetime] = None
    last_login_at: Optional[datetime] = None
    
    class Config:
        """Pydantic configuration."""
        from_attributes = True
