# PovertyLine - Simplified Planning Document

## Project Vision
PovertyLine is a platform designed to connect individuals in need with available support services. The simplified version focuses on creating basic digital profiles for users and providing access to resources.

## Key Objectives
1. Enable users to create basic digital profiles
2. Allow resource providers to post available resources
3. Implement simple search functionality for users to find resources
4. Provide basic admin capabilities for oversight

## Architecture Overview

### System Architecture
- **Client-Server Architecture**: Clear separation between frontend and backend
- **API-First Design**: Core functionality exposed through RESTful APIs
- **Mobile-First Design**: Optimized for mobile devices with responsive design

### Technical Stack
- **Frontend**:
  - Framework: React.js with Redux Toolkit
  - UI Library: Material-UI
  - State Management: Redux Toolkit
  - Forms: Formik with Yup validation
  
- **Backend**:
  - Framework: Flask (Python)
  - API Design: RESTful endpoints
  - Authentication: JWT-based authentication
  - Database ORM: SQLAlchemy
  
- **Database**:
  - Primary Database: PostgreSQL
  - Migration Tool: Alembic

- **Testing**:
  - Jest (Frontend)
  - Pytest (Backend)

### Security Considerations
- Secure authorization and authentication flow
- Input validation and sanitization

## Core Features & Components

### User Authentication System
- Basic registration and login
- Simple role-based permissions (user, provider, admin)
- Password recovery

### Profile Management
- Basic user profile creation (name, contact, location, needs)
- Simple profile completion tracking

### Resource Board
- Basic posting format for resources
- Simple categories (jobs, food, education, healthcare)
- Basic search functionality

### Admin Dashboard
- User management
- Resource approval

## Database Schema (High-Level)

### Users Table
- Basic auth info (username, password hash)
- User role
- Account status

### Profiles Table
- Personal information
- Location data
- Basic needs information

### Resources Table
- Resource type and category
- Geographic availability
- Provider information
- Basic requirements

## MVP Scope
The Minimum Viable Product will focus on:
1. User authentication (register, login, logout)
2. Basic profile creation
3. Simple resource posting and listing
4. Basic search functionality
5. Mobile-responsive design

## Project Constraints
- Mobile-first approach due to target users' primary access method
- Emphasis on simplicity and usability
- Focus on core functionality over advanced features

## Success Metrics
- Number of registered users
- Number of resources posted
- Basic user engagement metrics