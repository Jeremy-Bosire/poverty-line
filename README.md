# PovertyLine Application

A platform designed to connect individuals in need with available support services, focusing on creating digital profiles for users and providing access to resources.

## Features

- **User Authentication**: Secure login, registration, and role-based access control
- **Profile Management**: Create and manage user profiles with completion tracking
- **Resource Directory**: Browse, search, and filter available resources
- **Provider Tools**: Add, edit, and manage resources (for providers)
- **Mobile-First Design**: Optimized for all devices with responsive UI

## Technology Stack

### Frontend
- React.js with Redux Toolkit for state management
- Material-UI for component library
- Formik with Yup for form handling and validation
- React Router v6 for navigation
- Jest for testing

### Backend
- Flask (Python) for the REST API
- Flask-JWT-Extended for authentication
- SQLAlchemy as ORM
- PostgreSQL for database

## Getting Started

### Prerequisites
- Node.js (v14+)
- Python 3.8+
- PostgreSQL

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
python run_simple.py
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate and receive JWT token |
| POST | `/api/auth/refresh` | Refresh JWT token |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |

### Profiles

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profiles/<user_id>` | Get user profile |
| PUT | `/api/profiles/<user_id>` | Update user profile |
| GET | `/api/profiles` | Get all profiles (admin only) |

### Resources

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resources` | Get all approved resources (public) |
| GET | `/api/resources/<resource_id>` | Get specific resource |
| GET | `/api/resources/my` | Get resources created by current user |
| GET | `/api/resources/all` | Get all resources including pending (admin only) |
| POST | `/api/resources` | Create new resource (provider only) |
| PUT | `/api/resources/<resource_id>` | Update resource |
| DELETE | `/api/resources/<resource_id>` | Delete resource |
| POST | `/api/resources/<resource_id>/approval` | Approve/reject resource (admin only) |

## Project Structure

```
poverty-line/
├── backend/
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas for validation
│   │   ├── utils/          # Helper functions
│   │   └── __init__.py     # App initialization
│   ├── tests/              # Backend tests
│   ├── requirements.txt    # Python dependencies
│   └── run_simple.py       # Development server runner
│
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── app/            # Redux store setup
│   │   ├── components/     # React components
│   │   ├── features/       # Redux slices
│   │   ├── services/       # API service functions
│   │   ├── tests/          # Frontend tests
│   │   ├── utils/          # Helper functions
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Application entry point
│   ├── package.json        # Node dependencies
│   └── index.html          # HTML template
│
├── PLANNING.md             # Project planning document
├── TASK.md                 # Task tracking document
└── README.md               # This file
```

## Testing

### Frontend Tests

```bash
cd frontend
npm test
```

### Backend Tests

```bash
cd backend
python -m pytest
```

## Mobile-First Design

PovertyLine is designed with a mobile-first approach to ensure accessibility for users who primarily access the platform via mobile devices. All components are fully responsive and optimized for touch interactions.

## User Roles

- **User**: Can browse resources and maintain their profile
- **Provider**: Can create and manage resources in addition to user capabilities
- **Admin**: Has full access to the system including user management and resource approval

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
