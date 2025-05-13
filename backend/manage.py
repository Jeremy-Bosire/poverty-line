#!/usr/bin/env python
"""
Management script for the PovertyLine application.

This script provides commands for common tasks such as running the server,
initializing the database, and running tests.
"""
import os
import click
from flask.cli import FlaskGroup
from app import create_app, db
from app.models import User, Profile, Resource

app = create_app()

@click.group(cls=FlaskGroup, create_app=lambda: app)
def cli():
    """Management script for the PovertyLine application."""
    pass

@cli.command("init-db")
def init_db():
    """Initialize the database with tables and sample data."""
    click.echo("Initializing the database...")
    from init_db import init_db as _init_db
    _init_db()
    click.echo("Database initialized successfully!")

@cli.command("create-admin")
@click.option("--email", prompt=True, help="Admin email address")
@click.option("--name", prompt=True, help="Admin name")
@click.option("--password", prompt=True, hide_input=True, confirmation_prompt=True, help="Admin password")
def create_admin(email, name, password):
    """Create an admin user."""
    from app.models import User, UserRole, UserStatus
    
    with app.app_context():
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

@cli.command("run-tests")
def run_tests():
    """Run the test suite."""
    import pytest
    exit_code = pytest.main(["-xvs", "tests"])
    exit(exit_code)

@cli.command("reset-db")
@click.confirmation_option(prompt="Are you sure you want to reset the database? This will delete all data.")
def reset_db():
    """Reset the database by dropping all tables and recreating them."""
    with app.app_context():
        click.echo("Dropping all tables...")
        db.drop_all()
        click.echo("Creating all tables...")
        db.create_all()
        click.echo("Database reset successfully!")

@cli.command("migrate")
@click.option("--message", "-m", help="Migration message")
def migrate(message):
    """Generate a database migration."""
    if message:
        os.system(f"flask db migrate -m \"{message}\"")
    else:
        os.system("flask db migrate")
    click.echo("Migration generated successfully!")

@cli.command("upgrade")
def upgrade():
    """Apply database migrations."""
    os.system("flask db upgrade")
    click.echo("Database upgraded successfully!")

@cli.command("downgrade")
def downgrade():
    """Revert the last database migration."""
    os.system("flask db downgrade")
    click.echo("Database downgraded successfully!")

if __name__ == "__main__":
    cli()
