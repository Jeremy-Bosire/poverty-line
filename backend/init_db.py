"""
Database initialization script for the PovertyLine application.

This script creates the initial database tables and populates them with sample data.
"""
import os
import json
from datetime import datetime, timedelta, date
from app import create_app, db, bcrypt
from app.models import User, UserRole, UserStatus, Profile, Resource, ResourceCategory, ResourceStatus

def init_db():
    """Initialize the database with tables and sample data."""
    app = create_app()
    
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Check if there are any users in the database
        if User.query.count() > 0:
            print("Database already contains data. Skipping initialization.")
            return
        
        print("Initializing database with sample data...")
        
        # Create admin user
        admin = User(
            email='admin@example.com',
            name='Admin User',
            role=UserRole.ADMIN.value,
            status=UserStatus.ACTIVE.value,
            email_verified=True,
            email_verified_at=datetime.utcnow()
        )
        admin.password = 'Admin123'  # This will be hashed
        admin.save()
        
        # Create admin profile
        admin_profile = Profile(user_id=admin.id)
        admin_profile.phone = '(555) 123-4567'
        admin_profile.address = '123 Admin St'
        admin_profile.city = 'Admin City'
        admin_profile.state = 'Admin State'
        admin_profile.zip_code = '12345'
        admin_profile.update_completion_percentage()
        admin_profile.save()
        
        # Create provider user
        provider = User(
            email='provider@example.com',
            name='Community Services',
            role=UserRole.PROVIDER.value,
            status=UserStatus.ACTIVE.value,
            email_verified=True,
            email_verified_at=datetime.utcnow()
        )
        provider.password = 'Provider123'  # This will be hashed
        provider.save()
        
        # Create provider profile
        provider_profile = Profile(user_id=provider.id)
        provider_profile.phone = '(555) 987-6543'
        provider_profile.address = '456 Provider Ave'
        provider_profile.city = 'Provider City'
        provider_profile.state = 'Provider State'
        provider_profile.zip_code = '54321'
        provider_profile.bio = 'We are a community organization dedicated to helping those in need.'
        provider_profile.update_completion_percentage()
        provider_profile.save()
        
        # Create regular user
        user = User(
            email='user@example.com',
            name='John Smith',
            role=UserRole.USER.value,
            status=UserStatus.ACTIVE.value,
            email_verified=True,
            email_verified_at=datetime.utcnow()
        )
        user.password = 'User123'  # This will be hashed
        user.save()
        
        # Create user profile
        user_profile = Profile(user_id=user.id)
        user_profile.phone = '(555) 555-5555'
        user_profile.address = '789 User Blvd'
        user_profile.city = 'User City'
        user_profile.state = 'User State'
        user_profile.zip_code = '67890'
        user_profile.needs = json.dumps(['food', 'housing', 'employment'])
        user_profile.update_completion_percentage()
        user_profile.save()
        
        # Create sample resources
        resources = [
            {
                'title': 'Food Assistance Program',
                'description': 'Weekly food distribution for families in need. No registration required.',
                'category': ResourceCategory.FOOD.value,
                'location': 'Downtown',
                'address': '123 Main St',
                'city': 'Downtown',
                'state': 'CA',
                'zip_code': '12345',
                'provider_id': provider.id,
                'contact_name': 'Jane Doe',
                'contact_phone': '(555) 123-4567',
                'contact_email': 'jane@example.com',
                'start_date': date.today(),
                'end_date': date.today() + timedelta(days=90),
                'requirements': json.dumps(['Photo ID', 'Proof of residence']),
                'additional_info': 'Distribution occurs every Tuesday from 10am to 2pm.',
                'status': ResourceStatus.APPROVED.value,
                'approved_at': datetime.utcnow(),
                'approved_by_id': admin.id
            },
            {
                'title': 'Emergency Housing Support',
                'description': 'Temporary housing for individuals and families facing homelessness.',
                'category': ResourceCategory.HOUSING.value,
                'location': 'Eastside',
                'address': '456 Shelter Ave',
                'city': 'Eastside',
                'state': 'CA',
                'zip_code': '54321',
                'provider_id': provider.id,
                'contact_name': 'Robert Johnson',
                'contact_phone': '(555) 987-6543',
                'contact_email': 'robert@example.com',
                'start_date': date.today(),
                'end_date': date.today() + timedelta(days=180),
                'requirements': json.dumps(['Photo ID', 'Intake interview', 'Background check']),
                'additional_info': 'Open 24/7 for emergency intake.',
                'status': ResourceStatus.APPROVED.value,
                'approved_at': datetime.utcnow(),
                'approved_by_id': admin.id
            },
            {
                'title': 'Job Training Workshop',
                'description': 'Free workshop on resume building, interview skills, and job search strategies.',
                'category': ResourceCategory.EMPLOYMENT.value,
                'location': 'Westside',
                'address': '789 Career Blvd',
                'city': 'Westside',
                'state': 'CA',
                'zip_code': '67890',
                'provider_id': provider.id,
                'contact_name': 'Michael Brown',
                'contact_phone': '(555) 456-7890',
                'contact_email': 'michael@example.com',
                'start_date': date.today() + timedelta(days=7),
                'end_date': date.today() + timedelta(days=7),
                'requirements': json.dumps(['Pre-registration required', 'Must be 18 or older']),
                'additional_info': 'Workshop runs from 9am to 3pm. Lunch will be provided.',
                'status': ResourceStatus.PENDING.value
            }
        ]
        
        for resource_data in resources:
            resource = Resource(**resource_data)
            resource.save()
        
        print("Database initialized successfully!")

if __name__ == '__main__':
    init_db()
