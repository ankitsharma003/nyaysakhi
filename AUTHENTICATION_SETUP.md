# Authentication & Authorization Setup

This document outlines the complete authentication and authorization system implemented for the Nyay Mitra platform.

## Overview

The system supports two main user types:

- **Users**: Regular citizens seeking legal assistance
- **Lawyers**: Legal professionals providing services

## Backend Implementation

### Database Models

#### User Model (`backend/src/models/User.js`)

- Basic user information (name, email, password, phone, etc.)
- Role-based access control (user, lawyer, admin)
- Account security features (2FA, login attempts, account lockout)
- Location and language preferences

#### Lawyer Model (`backend/src/models/Lawyer.js`)

- Extended profile for legal professionals
- Bar council number and verification status
- Practice areas, districts, and languages
- Professional statistics (rating, cases, success rate)
- Availability and consultation fees

#### Session Model (`backend/src/models/Session.js`)

- JWT token management
- Device tracking and security
- Session expiration and cleanup

### API Endpoints

#### Authentication Routes (`/api/auth`)

- `POST /register` - User registration
- `POST /login` - User login
- `POST /verify-2fa` - Two-factor authentication
- `GET /me` - Get current user
- `POST /refresh` - Refresh JWT token
- `POST /logout` - Logout user
- `POST /logout-all` - Logout from all devices
- `GET /sessions` - Get active sessions
- `DELETE /sessions/:id` - Revoke session
- `POST /enable-2fa` - Enable 2FA
- `POST /verify-enable-2fa` - Verify 2FA setup
- `POST /disable-2fa` - Disable 2FA

#### User Routes (`/api/users`)

- `GET /me` - Get user profile
- `PUT /me` - Update user profile
- `PUT /change-password` - Change password
- `GET /stats` - Get user statistics
- `DELETE /me` - Deactivate account

#### Lawyer Routes (`/api/lawyers`)

- `GET /` - Get all lawyers (with filtering)
- `GET /:id` - Get specific lawyer
- `POST /register` - Register as lawyer
- `PUT /me` - Update lawyer profile
- `GET /matches/:documentId` - Get case matches
- `GET /cases` - Get lawyer's cases
- `PUT /cases/:id/status` - Update case status
- `GET /stats` - Get lawyer statistics

### Security Features

1. **Password Security**
   - Bcrypt hashing with salt rounds
   - Password strength validation
   - Account lockout after failed attempts

2. **JWT Tokens**
   - Short-lived access tokens (15 minutes)
   - Refresh tokens for session management
   - Automatic token refresh

3. **Two-Factor Authentication**
   - TOTP-based 2FA using Speakeasy
   - QR code generation for setup
   - Optional for all users

4. **Session Management**
   - Device tracking
   - IP address logging
   - Session revocation
   - Automatic cleanup of expired sessions

## Frontend Implementation

### Authentication Context (`lib/auth-context.tsx`)

- Global state management for authentication
- User profile and session management
- Role-based access control
- Automatic token refresh

### API Client (`lib/api.ts`)

- Centralized API communication
- Automatic token handling
- Error handling and retry logic
- Type-safe API calls

### Auth Modal (`components/auth-modal.tsx`)

- Modern, responsive login/signup interface
- Multi-step registration for lawyers
- 2FA verification
- Form validation and error handling

### Role-Based Features

#### User Features

- Document upload and analysis
- Lawyer search and matching
- Case tracking
- Legal knowledge base access
- AI chatbot assistance

#### Lawyer Features

- Professional profile management
- Case management dashboard
- Client communication
- Appointment booking
- Performance analytics

## Setup Instructions

### Backend Setup

1. **Install Dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   Create `.env` file with:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/nyaymitra
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
   FRONTEND_URL=http://localhost:3000
   ```

3. **Start MongoDB**

   ```bash
   mongod
   ```

4. **Start Backend Server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create `.env.local` file with:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## Usage Examples

### User Registration

```typescript
// Regular user registration
const userData = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securepassword',
  phone: '+1234567890',
  role: 'user',
}

await apiClient.register(userData)

// Lawyer registration
const lawyerData = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  password: 'securepassword',
  phone: '+1234567890',
  role: 'lawyer',
  barCouncilNumber: 'ABC123456',
  practiceAreas: ['Criminal Law', 'Family Law'],
  districts: ['Delhi', 'Mumbai'],
  languages: ['en', 'hi'],
  bio: 'Experienced criminal defense attorney',
}

await apiClient.register(lawyerData)
```

### Authentication

```typescript
// Login
await apiClient.login({
  email: 'user@example.com',
  password: 'password',
})

// 2FA verification
await apiClient.verify2FA({
  email: 'user@example.com',
  code: '123456',
})

// Logout
await apiClient.logout()
```

### Role-Based Access

```typescript
// Check if user is authenticated
if (isAuthenticated) {
  // User is logged in
}

// Check user role
if (user?.role === 'lawyer') {
  // Show lawyer-specific features
}

// Check if feature requires authentication
if (feature.requiresAuth && !isAuthenticated) {
  // Show login modal
}
```

## Security Considerations

1. **Password Requirements**
   - Minimum 6 characters
   - Bcrypt hashing with 12 salt rounds

2. **Token Security**
   - Short-lived access tokens
   - Secure refresh token rotation
   - Automatic cleanup of expired tokens

3. **Account Protection**
   - Rate limiting on login attempts
   - Account lockout after 5 failed attempts
   - 2FA for enhanced security

4. **Data Validation**
   - Input sanitization
   - Email format validation
   - Phone number validation
   - Role-based access control

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
npm test
```

## Deployment

### Backend Deployment

1. Set production environment variables
2. Configure MongoDB Atlas or production database
3. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment

1. Build the application
2. Deploy to Vercel, Netlify, or your preferred platform
3. Configure environment variables

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env

2. **JWT Token Errors**
   - Verify JWT_SECRET is set
   - Check token expiration

3. **CORS Issues**
   - Ensure FRONTEND_URL is correctly set
   - Check CORS configuration

4. **2FA Setup Issues**
   - Verify Speakeasy configuration
   - Check QR code generation

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
DEBUG=auth:*
```

## Future Enhancements

1. **Social Login**
   - Google OAuth
   - Facebook Login
   - LinkedIn Integration

2. **Advanced Security**
   - Biometric authentication
   - Hardware security keys
   - Advanced threat detection

3. **Multi-tenancy**
   - Organization-based access
   - Team management
   - Role hierarchies

4. **Analytics**
   - User behavior tracking
   - Security event monitoring
   - Performance metrics
