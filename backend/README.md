# PovertyLine Backend

The backend API for the PovertyLine application, built with Flask, SQLAlchemy, and PostgreSQL.

## Features

- User authentication with JWT tokens
- Role-based access control (admin, provider, user)
- Resource management system
- Profile management
- RESTful API design
- Comprehensive error handling
- Database migrations with Alembic
- Unit testing with pytest

## Setup

### Prerequisites

- Python 3.8+
- PostgreSQL
- Virtual environment (recommended)

### Installation

1. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Set up environment variables by creating a `.env` file in the backend directory:

```
# Flask
FLASK_APP=wsgi.py
FLASK_ENV=development
SECRET_KEY=your-secret-key

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/povertyline_dev

# JWT
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ACCESS_TOKEN_EXPIRES=3600
JWT_REFRESH_TOKEN_EXPIRES=2592000

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

4. Initialize the database:

```bash
python manage.py init-db
```

## Running the Application

```bash
python manage.py run
```

The API will be available at http://localhost:5000

## Database Migrations

Generate a migration:

```bash
python manage.py migrate -m "Migration description"
```

Apply migrations:

```bash
python manage.py upgrade
```

Revert the last migration:

```bash
python manage.py downgrade
```

## Creating an Admin User

```bash
python manage.py create-admin
```

## Running Tests

```bash
python manage.py run-tests
```

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get access token
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/reset-password` - Request password reset
- `POST /api/auth/reset-password/<token>` - Reset password with token

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/<id>` - Get a specific user
- `PUT /api/users/<id>` - Update a user
- `DELETE /api/users/<id>` - Delete a user (admin only)

### Profiles

- `GET /api/profiles/<user_id>` - Get a user's profile
- `PUT /api/profiles/<user_id>` - Update a user's profile
- `GET /api/profiles` - Get all profiles (admin only)

### Resources

- `GET /api/resources` - Get all approved resources
- `GET /api/resources/all` - Get all resources (admin only)
- `GET /api/resources/my` - Get resources created by the current user
- `POST /api/resources` - Create a new resource (provider only)
- `GET /api/resources/<id>` - Get a specific resource
- `PUT /api/resources/<id>` - Update a resource
- `DELETE /api/resources/<id>` - Delete a resource
- `POST /api/resources/<id>/approval` - Approve or reject a resource (admin only)
