# PovertyLine Frontend

This is the frontend application for the PovertyLine platform, designed to connect individuals in need with available support services. The frontend is built with React, Redux Toolkit, and Material-UI, focusing on a mobile-first responsive design.

## Project Structure

The project follows a modular architecture with clear separation of concerns:

```
src/
├── assets/            # Static assets like images and styles
├── components/        # UI components organized by feature
│   ├── admin/         # Admin dashboard components
│   ├── auth/          # Authentication components
│   ├── common/        # Reusable UI components
│   ├── layout/        # Layout components
│   ├── profile/       # User profile components
│   └── resources/     # Resource management components
├── features/          # Redux Toolkit slices and logic
├── hooks/             # Custom React hooks
├── routes/            # Routing configuration
├── services/          # API services and utilities
├── store/             # Redux store configuration
└── utils/             # Utility functions
```

## Key Features

- **Authentication System**: User registration, login, and password recovery
- **Profile Management**: User profile creation and management
- **Resource Board**: Browse and search for available resources
- **Admin Dashboard**: Manage users and resources (admin only)
- **Responsive Design**: Mobile-first approach for all components

## Tech Stack

- **Framework**: React with Vite
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI
- **Routing**: React Router
- **Form Handling**: Formik with Yup validation
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development Guidelines

- Follow the modular architecture and file organization
- Create reusable components in the `components/common` directory
- Implement proper prop validation for all components
- Follow the mobile-first approach for all UI components
- Keep files under 500 lines of code, splitting into modules when necessary
- Write unit tests for components using Jest

## API Integration

The frontend communicates with the Flask backend through RESTful API endpoints. The base URL for API requests is configured in the `services/authService.js` file.

## Testing

Unit tests are implemented using Jest and React Testing Library. Run tests with:

```bash
npm test
```
