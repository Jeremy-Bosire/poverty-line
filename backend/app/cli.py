"""
Command line interface extensions for the PovertyLine application.
"""
import os
import click
from flask import current_app
from flask.cli import with_appcontext
from app import db
from app.models import User, UserRole, UserStatus, Profile

def register_commands(app):
    """Register Flask CLI commands."""
    app.cli.add_command(init_db_command)
    app.cli.add_command(create_admin_command)

@click.command('init-db')
@with_appcontext
def init_db_command():
    """Initialize the database with tables and sample data."""
    from init_db import init_db
    init_db()
    click.echo('Database initialized successfully!')

@click.command('create-admin')
@click.option('--email', prompt=True, help='Admin email address')
@click.option('--name', prompt=True, help='Admin name')
@click.option('--password', prompt=True, hide_input=True, confirmation_prompt=True, help='Admin password')
@with_appcontext
def create_admin_command(email, name, password):
    """Create an admin user."""
    # Check if user already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        click.echo(f"User with email {email} already exists.")
        return
    
    # Create new admin user
    admin = User(
        email=email,
        name=name,
        role=UserRole.ADMIN.value,
        status=UserStatus.ACTIVE.value,
        email_verified=True
    )
    admin.password = password
    admin.save()
    
    # Create admin profile
    profile = Profile(user_id=admin.id)
    profile.save()
    
    click.echo(f"Admin user {email} created successfully!")
