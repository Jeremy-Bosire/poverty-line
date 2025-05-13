# PovertyLine API Documentation

This document provides comprehensive documentation for the PovertyLine API endpoints, including request/response formats, authentication requirements, and examples.

## Base URL

All API endpoints are prefixed with: `http://localhost:5005/api`

> **Note**: If you encounter connection issues, ensure that the backend server is properly running on port 5005.

## Authentication

Most endpoints require authentication via JWT (JSON Web Token). 

To authenticate requests, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Getting a JWT Token

- Request a JWT token by sending a POST request to `/api/auth/login`
- The token will be valid for 24 hours
- Use the refresh token endpoint to obtain a new token without re-authentication

## Error Handling

The API returns standard HTTP status codes to indicate the success or failure of a request:

- `200 OK`: The request was successful
- `201 Created`: The resource was successfully created
- `400 Bad Request`: The request was invalid or malformed
- `401 Unauthorized`: Authentication failed or token expired
- `403 Forbidden`: The authenticated user doesn't have permission
- `404 Not Found`: The requested resource doesn't exist
- `409 Conflict`: The request conflicts with the current state
- `500 Internal Server Error`: An error occurred on the server

Error responses include a JSON object with an `error` field describing the error.

## Endpoints

### Authentication

#### Register User

Creates a new user account.

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "securepassword123",
    "role": "user"
  }
  ```
- **Success Response**:
  - **Code**: `201 Created`
  - **Content**:
    ```json
    {
      "message": "User registered successfully",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "johndoe@example.com",
        "role": "user"
      },
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
- **Error Responses**:
  - **Code**: `400 Bad Request`
    ```json
    { "error": "Email already in use" }
    ```
  - **Code**: `400 Bad Request`
    ```json
    { "error": "Invalid role" }
    ```

#### Login

Authenticates a user and provides a JWT token.

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "johndoe@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "message": "Login successful",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "johndoe@example.com",
        "role": "user"
      },
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
- **Error Response**:
  - **Code**: `401 Unauthorized`
    ```json
    { "error": "Invalid email or password" }
    ```

#### Refresh Token

Refreshes an existing JWT token.

- **URL**: `/api/auth/refresh`
- **Method**: `POST`
- **Auth Required**: Yes (Refresh Token)
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
- **Error Response**:
  - **Code**: `401 Unauthorized`
    ```json
    { "error": "Invalid or expired refresh token" }
    ```

#### Forgot Password

Initiates the password reset process by sending a reset link to the user's email.

- **URL**: `/api/auth/forgot-password`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "johndoe@example.com"
  }
  ```
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    { "message": "Password reset link sent to email if it exists in our system" }
    ```

#### Reset Password

Resets a user's password using a valid reset token.

- **URL**: `/api/auth/reset-password`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "token": "reset_token_from_email",
    "new_password": "newsecurepassword123"
  }
  ```
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    { "message": "Password reset successful" }
    ```
- **Error Response**:
  - **Code**: `400 Bad Request`
    ```json
    { "error": "Invalid or expired token" }
    ```

### User Profiles

#### Get User Profile

Retrieves a user's profile information.

- **URL**: `/api/profiles/<user_id>`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**: `user_id=[integer]`
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "profile": {
        "user_id": 1,
        "phone": "555-123-4567",
        "bio": "Looking for housing assistance",
        "address": "123 Main St",
        "city": "San Francisco",
        "state": "California",
        "zip_code": "94105",
        "needs": ["Housing", "Food", "Healthcare"],
        "is_complete": true,
        "completion_percentage": 90
      }
    }
    ```
- **Error Response**:
  - **Code**: `404 Not Found`
    ```json
    { "error": "Profile not found" }
    ```
  - **Code**: `403 Forbidden`
    ```json
    { "error": "Unauthorized access" }
    ```

#### Update User Profile

Updates a user's profile information.

- **URL**: `/api/profiles/<user_id>`
- **Method**: `PUT`
- **Auth Required**: Yes
- **URL Parameters**: `user_id=[integer]`
- **Request Body**:
  ```json
  {
    "phone": "555-987-6543",
    "bio": "Updated bio information",
    "address": "456 Oak Ave",
    "city": "San Francisco",
    "state": "California",
    "zip_code": "94105",
    "needs": ["Housing", "Employment", "Education"]
  }
  ```
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "message": "Profile updated successfully",
      "profile": {
        "user_id": 1,
        "phone": "555-987-6543",
        "bio": "Updated bio information",
        "address": "456 Oak Ave",
        "city": "San Francisco",
        "state": "California",
        "zip_code": "94105",
        "needs": ["Housing", "Employment", "Education"],
        "is_complete": true,
        "completion_percentage": 100
      }
    }
    ```
- **Error Response**:
  - **Code**: `404 Not Found`
    ```json
    { "error": "Profile not found" }
    ```
  - **Code**: `403 Forbidden`
    ```json
    { "error": "Unauthorized access" }
    ```
  - **Code**: `400 Bad Request`
    ```json
    { "error": "Invalid phone number format" }
    ```

#### Get All Profiles (Admin Only)

Retrieves all user profiles (admin access only).

- **URL**: `/api/profiles`
- **Method**: `GET`
- **Auth Required**: Yes (Admin role)
- **Query Parameters**:
  - `completion_status=[complete|incomplete]` (optional)
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "profiles": [
        {
          "user_id": 1,
          "phone": "555-123-4567",
          "bio": "Looking for housing assistance",
          "address": "123 Main St",
          "city": "San Francisco",
          "state": "California",
          "zip_code": "94105",
          "needs": ["Housing", "Food", "Healthcare"],
          "is_complete": true,
          "completion_percentage": 100
        },
        {
          "user_id": 2,
          "phone": "555-987-6543",
          "bio": "Seeking education resources",
          "address": "789 Pine St",
          "city": "San Francisco",
          "state": "California",
          "zip_code": "94102",
          "needs": ["Education", "Employment"],
          "is_complete": true,
          "completion_percentage": 90
        }
      ],
      "count": 2
    }
    ```
- **Error Response**:
  - **Code**: `403 Forbidden`
    ```json
    { "error": "Unauthorized access" }
    ```

### Resources

#### Get All Resources (Public)

Retrieves all approved resources (public access).

- **URL**: `/api/resources`
- **Method**: `GET`
- **Auth Required**: No
- **Query Parameters**:
  - `category=[string]` (optional)
  - `location=[string]` (optional)
  - `search=[string]` (optional)
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "resources": [
        {
          "id": 1,
          "title": "Food Pantry",
          "description": "Weekly food distribution for families in need",
          "category": "food",
          "status": "approved",
          "provider_id": 3,
          "location": "Downtown Community Center",
          "address": "101 Market St",
          "city": "San Francisco",
          "state": "California",
          "zip_code": "94105",
          "contact_name": "Jane Smith",
          "contact_phone": "555-123-4567",
          "contact_email": "jane@example.com",
          "start_date": "2025-01-01",
          "end_date": null,
          "requirements": ["Photo ID", "Proof of residence"],
          "additional_info": "Please call ahead to confirm availability"
        },
        {
          "id": 2,
          "title": "Job Training Workshop",
          "description": "Free workshop on resume building and interview skills",
          "category": "employment",
          "status": "approved",
          "provider_id": 4,
          "location": "Public Library",
          "address": "345 Larkin St",
          "city": "San Francisco",
          "state": "California",
          "zip_code": "94102",
          "contact_name": "Robert Johnson",
          "contact_phone": "555-987-6543",
          "contact_email": "robert@example.com",
          "start_date": "2025-02-15",
          "end_date": "2025-02-15",
          "requirements": [],
          "additional_info": "Registration required"
        }
      ],
      "count": 2
    }
    ```

#### Get Resource by ID

Retrieves a specific resource by ID.

- **URL**: `/api/resources/<resource_id>`
- **Method**: `GET`
- **Auth Required**: No
- **URL Parameters**: `resource_id=[integer]`
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "resource": {
        "id": 1,
        "title": "Food Pantry",
        "description": "Weekly food distribution for families in need",
        "category": "food",
        "status": "approved",
        "provider_id": 3,
        "location": "Downtown Community Center",
        "address": "101 Market St",
        "city": "San Francisco",
        "state": "California",
        "zip_code": "94105",
        "contact_name": "Jane Smith",
        "contact_phone": "555-123-4567",
        "contact_email": "jane@example.com",
        "start_date": "2025-01-01",
        "end_date": null,
        "requirements": ["Photo ID", "Proof of residence"],
        "additional_info": "Please call ahead to confirm availability"
      }
    }
    ```
- **Error Response**:
  - **Code**: `404 Not Found`
    ```json
    { "error": "Resource not found" }
    ```

#### Get My Resources (Provider)

Retrieves resources created by the authenticated provider.

- **URL**: `/api/resources/my`
- **Method**: `GET`
- **Auth Required**: Yes (Provider or Admin role)
- **Query Parameters**:
  - `status=[pending|approved|rejected]` (optional)
  - `category=[string]` (optional)
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "resources": [
        {
          "id": 1,
          "title": "Food Pantry",
          "description": "Weekly food distribution for families in need",
          "category": "food",
          "status": "approved",
          "provider_id": 3,
          "location": "Downtown Community Center",
          "address": "101 Market St",
          "city": "San Francisco",
          "state": "California",
          "zip_code": "94105",
          "contact_name": "Jane Smith",
          "contact_phone": "555-123-4567",
          "contact_email": "jane@example.com",
          "start_date": "2025-01-01",
          "end_date": null,
          "requirements": ["Photo ID", "Proof of residence"],
          "additional_info": "Please call ahead to confirm availability"
        }
      ],
      "count": 1
    }
    ```
- **Error Response**:
  - **Code**: `403 Forbidden`
    ```json
    { "error": "Unauthorized access" }
    ```

#### Get All Resources (Admin)

Retrieves all resources including pending and rejected (admin only).

- **URL**: `/api/resources/all`
- **Method**: `GET`
- **Auth Required**: Yes (Admin role)
- **Query Parameters**:
  - `status=[pending|approved|rejected]` (optional)
  - `category=[string]` (optional)
  - `provider_id=[integer]` (optional)
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "resources": [
        {
          "id": 1,
          "title": "Food Pantry",
          "description": "Weekly food distribution for families in need",
          "category": "food",
          "status": "approved",
          "provider_id": 3,
          "location": "Downtown Community Center",
          "address": "101 Market St",
          "city": "San Francisco",
          "state": "California",
          "zip_code": "94105",
          "contact_name": "Jane Smith",
          "contact_phone": "555-123-4567",
          "contact_email": "jane@example.com",
          "start_date": "2025-01-01",
          "end_date": null,
          "requirements": ["Photo ID", "Proof of residence"],
          "additional_info": "Please call ahead to confirm availability"
        },
        {
          "id": 3,
          "title": "Financial Counseling",
          "description": "Free financial counseling services",
          "category": "financial",
          "status": "pending",
          "provider_id": 5,
          "location": "Financial Services Center",
          "address": "789 Market St",
          "city": "San Francisco",
          "state": "California",
          "zip_code": "94103",
          "contact_name": "Michael Brown",
          "contact_phone": "555-444-5555",
          "contact_email": "michael@example.com",
          "start_date": "2025-03-01",
          "end_date": null,
          "requirements": ["Appointment required"],
          "additional_info": "By appointment only"
        }
      ],
      "count": 2
    }
    ```
- **Error Response**:
  - **Code**: `403 Forbidden`
    ```json
    { "error": "Unauthorized access" }
    ```

#### Create Resource

Creates a new resource (provider only).

- **URL**: `/api/resources`
- **Method**: `POST`
- **Auth Required**: Yes (Provider or Admin role)
- **Request Body**:
  ```json
  {
    "title": "Housing Assistance Program",
    "description": "Financial assistance for rent and utilities",
    "category": "housing",
    "location": "Housing Authority Office",
    "address": "555 Franklin St",
    "city": "San Francisco",
    "state": "California",
    "zip_code": "94102",
    "contact_name": "Lisa Johnson",
    "contact_phone": "555-777-8888",
    "contact_email": "lisa@example.com",
    "start_date": "2025-04-01",
    "end_date": null,
    "requirements": ["Income verification", "Proof of residence"],
    "additional_info": "Applications reviewed monthly"
  }
  ```
- **Success Response**:
  - **Code**: `201 Created`
  - **Content**:
    ```json
    {
      "message": "Resource created successfully",
      "resource": {
        "id": 4,
        "title": "Housing Assistance Program",
        "description": "Financial assistance for rent and utilities",
        "category": "housing",
        "status": "pending",
        "provider_id": 3,
        "location": "Housing Authority Office",
        "address": "555 Franklin St",
        "city": "San Francisco",
        "state": "California",
        "zip_code": "94102",
        "contact_name": "Lisa Johnson",
        "contact_phone": "555-777-8888",
        "contact_email": "lisa@example.com",
        "start_date": "2025-04-01",
        "end_date": null,
        "requirements": ["Income verification", "Proof of residence"],
        "additional_info": "Applications reviewed monthly"
      }
    }
    ```
- **Error Response**:
  - **Code**: `400 Bad Request`
    ```json
    { "error": "Title and description are required" }
    ```
  - **Code**: `403 Forbidden`
    ```json
    { "error": "Unauthorized access" }
    ```

#### Update Resource

Updates an existing resource.

- **URL**: `/api/resources/<resource_id>`
- **Method**: `PUT`
- **Auth Required**: Yes (Resource provider or Admin)
- **URL Parameters**: `resource_id=[integer]`
- **Request Body**:
  ```json
  {
    "title": "Updated Housing Assistance Program",
    "description": "Financial assistance for rent, utilities, and housing deposits",
    "category": "housing",
    "location": "Housing Authority Office",
    "address": "555 Franklin St",
    "city": "San Francisco",
    "state": "California",
    "zip_code": "94102",
    "contact_name": "Lisa Johnson",
    "contact_phone": "555-777-8888",
    "contact_email": "lisa@example.com",
    "start_date": "2025-04-15",
    "end_date": null,
    "requirements": ["Income verification", "Proof of residence", "ID"],
    "additional_info": "Applications accepted on an ongoing basis"
  }
  ```
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "message": "Resource updated successfully",
      "resource": {
        "id": 4,
        "title": "Updated Housing Assistance Program",
        "description": "Financial assistance for rent, utilities, and housing deposits",
        "category": "housing",
        "status": "pending",
        "provider_id": 3,
        "location": "Housing Authority Office",
        "address": "555 Franklin St",
        "city": "San Francisco",
        "state": "California",
        "zip_code": "94102",
        "contact_name": "Lisa Johnson",
        "contact_phone": "555-777-8888",
        "contact_email": "lisa@example.com",
        "start_date": "2025-04-15",
        "end_date": null,
        "requirements": ["Income verification", "Proof of residence", "ID"],
        "additional_info": "Applications accepted on an ongoing basis"
      }
    }
    ```
- **Error Response**:
  - **Code**: `404 Not Found`
    ```json
    { "error": "Resource not found" }
    ```
  - **Code**: `403 Forbidden`
    ```json
    { "error": "Unauthorized access" }
    ```

#### Delete Resource

Deletes a resource.

- **URL**: `/api/resources/<resource_id>`
- **Method**: `DELETE`
- **Auth Required**: Yes (Resource provider or Admin)
- **URL Parameters**: `resource_id=[integer]`
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "message": "Resource deleted successfully"
    }
    ```
- **Error Response**:
  - **Code**: `404 Not Found`
    ```json
    { "error": "Resource not found" }
    ```
  - **Code**: `403 Forbidden`
    ```json
    { "error": "Unauthorized access" }
    ```

#### Approve or Reject Resource

Approves or rejects a resource (admin only).

- **URL**: `/api/resources/<resource_id>/approval`
- **Method**: `POST`
- **Auth Required**: Yes (Admin role)
- **URL Parameters**: `resource_id=[integer]`
- **Request Body**:
  ```json
  {
    "status": "approved",
    "rejection_reason": null
  }
  ```
  or
  ```json
  {
    "status": "rejected",
    "rejection_reason": "Insufficient information provided"
  }
  ```
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "message": "Resource approved successfully",
      "resource": {
        "id": 4,
        "title": "Updated Housing Assistance Program",
        "description": "Financial assistance for rent, utilities, and housing deposits",
        "category": "housing",
        "status": "approved",
        "provider_id": 3,
        "location": "Housing Authority Office",
        "address": "555 Franklin St",
        "city": "San Francisco",
        "state": "California",
        "zip_code": "94102",
        "contact_name": "Lisa Johnson",
        "contact_phone": "555-777-8888",
        "contact_email": "lisa@example.com",
        "start_date": "2025-04-15",
        "end_date": null,
        "requirements": ["Income verification", "Proof of residence", "ID"],
        "additional_info": "Applications accepted on an ongoing basis"
      }
    }
    ```
- **Error Response**:
  - **Code**: `404 Not Found`
    ```json
    { "error": "Resource not found" }
    ```
  - **Code**: `403 Forbidden`
    ```json
    { "error": "Unauthorized access" }
    ```
  - **Code**: `400 Bad Request`
    ```json
    { "error": "Invalid status" }
    ```
  - **Code**: `400 Bad Request`
    ```json
    { "error": "Rejection reason required when rejecting a resource" }
    ```
