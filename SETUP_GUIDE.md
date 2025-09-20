# NyayMitra Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose (recommended)
- OR MongoDB Community Edition (if not using Docker)

## Quick Start with Docker (Recommended)

1. **Start all services:**

   ```bash
   docker-compose up -d
   ```

2. **Check if services are running:**

   ```bash
   docker-compose ps
   ```

3. **View logs:**

   ```bash
   docker-compose logs -f
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

## Manual Setup (Without Docker)

### 1. Install MongoDB Community Edition

**For Windows:**

1. Download MongoDB Community Edition from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. Make sure to install MongoDB as a Windows Service
4. Start MongoDB service

**For macOS:**

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

**For Linux (Ubuntu/Debian):**

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2. Start Backend

```bash
cd backend
npm install
npm start
```

### 3. Start Frontend

```bash
npm install
npm run dev
```

## Environment Configuration

The `.env` file in the backend directory contains:

```env
MONGODB_URI=mongodb://nyaymitra_user:nyaymitra_password@localhost:27017/nyaymitra
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-change-this-in-production
JWT_REFRESH_EXPIRE=30d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Troubleshooting

### MongoDB Connection Issues

1. **If using Docker:**

   ```bash
   docker-compose down
   docker-compose up -d
   ```

2. **If using local MongoDB:**
   - Check if MongoDB service is running
   - Verify connection string in `.env` file
   - Check firewall settings

### Backend Issues

1. **Port already in use:**
   - Change PORT in `.env` file
   - Kill process using the port: `netstat -ano | findstr :5000`

2. **Module not found:**
   - Run `npm install` in backend directory

### Frontend Issues

1. **Build errors:**
   - Run `npm install`
   - Clear Next.js cache: `rm -rf .next`

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Users

- `GET /api/users/me` - Get user profile
- `PUT /api/users/me` - Update user profile
- `POST /api/users/change-password` - Change password

### Lawyers

- `GET /api/lawyers` - Get all lawyers
- `POST /api/lawyers/register` - Register as lawyer
- `GET /api/lawyers/me` - Get lawyer profile
- `PUT /api/lawyers/me` - Update lawyer profile

## Database Schema

### Users Collection

- `name`, `email`, `password`, `role`, `district`, `state`
- `isVerified`, `isActive`, `twoFactorEnabled`
- `loginAttempts`, `lockUntil`, `lastLogin`

### Lawyers Collection

- `user` (reference to User), `barCouncilNumber`, `practiceAreas`
- `districts`, `languages`, `experience`, `rating`
- `isVerified`, `consultationFee`, `availability`

### Sessions Collection

- `user`, `token`, `refreshToken`, `expiresAt`
- `deviceInfo`, `ipAddress`, `isActive`

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Refresh token mechanism
- Account lockout after failed attempts
- Two-factor authentication support
- Rate limiting
- Input validation
- CORS protection

## Development

### Running Tests

```bash
cd backend
npm test
```

### Code Formatting

```bash
npm run format
```

### Linting

```bash
npm run lint
```

## Production Deployment

1. Update environment variables
2. Use strong JWT secrets
3. Enable HTTPS
4. Configure proper CORS
5. Set up monitoring and logging
6. Use a production MongoDB instance

## Support

If you encounter any issues, please check:

1. All services are running
2. Environment variables are correct
3. MongoDB is accessible
4. Ports are not blocked by firewall
