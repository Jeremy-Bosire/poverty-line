"""
Base schemas for data validation.
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class BaseSchema(BaseModel):
    """Base schema with common fields."""
    
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        """Pydantic configuration."""
        from_attributes = True  # Allow conversion from ORM models
        json_encoders = {
            datetime: lambda dt: dt.isoformat() if dt else None
        }
