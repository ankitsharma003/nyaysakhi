# Database Setup Guide

This guide will help you set up MongoDB for the NyayMitra backend application.

## Quick Start

### 1. Install MongoDB

#### Option A: Local MongoDB Installation

**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. Start MongoDB service: `net start MongoDB`

**macOS:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/gpg.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Use the connection string in your `.env` file

### 2. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` file with your MongoDB connection:

   **For Local MongoDB:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/nyaymitra
   ```

   **For MongoDB Atlas:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nyaymitra?retryWrites=true&w=majority
   ```

3. Set other required variables:
   ```env
   JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-change-this-in-production
   NODE_ENV=development
   PORT=5000
   ```

### 3. Test Database Connection

```bash
# Test database connection
npm run test:db

# Test all imports
npm run test:imports

# Test OCR functionality
npm run test:ocr
```

### 4. Start the Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Troubleshooting

### Common Issues

#### 1. Connection Refused Error
```
MongoDB connection attempt failed: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
- Ensure MongoDB is running: `sudo systemctl status mongod` (Linux) or check Services (Windows)
- Check if MongoDB is listening on the correct port: `netstat -an | grep 27017`
- Verify MongoDB configuration file

#### 2. Authentication Failed
```
MongoDB connection attempt failed: Authentication failed
```

**Solutions:**
- Check username and password in connection string
- Ensure user has proper permissions
- For Atlas, check IP whitelist settings

#### 3. Network Timeout
```
MongoDB connection attempt failed: Server selection timed out
```

**Solutions:**
- Check network connectivity
- Verify firewall settings
- For Atlas, check cluster status and IP whitelist

#### 4. Database Not Found
```
MongoDB connection attempt failed: Database not found
```

**Solutions:**
- Database will be created automatically on first use
- Check if you have permission to create databases
- Verify database name in connection string

### Health Check

The application provides a health check endpoint:

```bash
curl http://localhost:5000/api/health
```

**Expected Response (Connected):**
```json
{
  "status": "OK",
  "dbConnected": true,
  "timestamp": "2025-01-21T14:54:23.960Z",
  "version": "1.0.0",
  "database": {
    "status": "connected",
    "host": "localhost:27017",
    "name": "nyaymitra",
    "error": null
  },
  "environment": "development",
  "uptime": 123.456
}
```

**Expected Response (Degraded):**
```json
{
  "status": "DEGRADED",
  "dbConnected": false,
  "timestamp": "2025-01-21T14:54:23.960Z",
  "version": "1.0.0",
  "database": {
    "status": "disconnected",
    "host": null,
    "name": null,
    "error": "Connection failed"
  },
  "environment": "development",
  "uptime": 123.456
}
```

### Development Tips

1. **Use MongoDB Compass** for visual database management
2. **Enable MongoDB logs** for debugging:
   ```bash
   # Linux
   tail -f /var/log/mongodb/mongod.log
   
   # macOS with Homebrew
   tail -f /usr/local/var/log/mongodb/mongo.log
   ```

3. **Test with MongoDB Shell**:
   ```bash
   mongo
   use nyaymitra
   show collections
   ```

4. **Monitor Connection Status**:
   ```bash
   # Check if MongoDB is running
   ps aux | grep mongod
   
   # Check port usage
   netstat -an | grep 27017
   ```

## Production Considerations

1. **Use MongoDB Atlas** for production deployments
2. **Set strong passwords** and rotate them regularly
3. **Enable authentication** and authorization
4. **Configure backup strategies**
5. **Monitor performance** and set up alerts
6. **Use connection pooling** for high-traffic applications

## Support

If you continue to have issues:

1. Check the application logs for detailed error messages
2. Run the database test script: `npm run test:db`
3. Verify your MongoDB installation and configuration
4. Check network connectivity and firewall settings
5. Review MongoDB documentation for your specific setup
