# MongoDB Atlas Setup Guide for Vercel Deployment

This guide will help you set up MongoDB Atlas for your NyayMitra backend deployed on Vercel.

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project (e.g., "NyayMitra")

## Step 2: Create a Cluster

1. Click "Build a Database"
2. Choose "FREE" tier (M0 Sandbox)
3. Select a cloud provider and region close to your users
4. Name your cluster (e.g., "nyaymitra-cluster")
5. Click "Create"

## Step 3: Configure Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and strong password
5. Set privileges to "Atlas admin" or "Read and write to any database"
6. Click "Add User"

## Step 4: Configure Network Access (IP Whitelist)

### For Development:
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Add Current IP Address" to add your current IP
4. Click "Confirm"

### For Vercel Deployment:
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Add a comment: "Vercel deployment"
5. Click "Confirm"

⚠️ **Security Note**: Allowing access from anywhere (0.0.0.0/0) is less secure but necessary for Vercel. For production, consider using Vercel's IP ranges.

## Step 5: Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string

Example connection string:
```
mongodb+srv://username:password@cluster.mongodb.net/nyaymitra?retryWrites=true&w=majority
```

## Step 6: Configure Vercel Environment Variables

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add the following variables:

### Required Variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nyaymitra?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-change-this-in-production
NODE_ENV=production
```

### Optional Variables:
```
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=https://your-frontend-domain.vercel.app
MONGODB_CONNECT_RETRIES=2
MONGODB_RETRY_DELAY_MS=2000
```

## Step 7: Test the Connection

1. Deploy your backend to Vercel
2. Check the health endpoint: `https://your-backend.vercel.app/api/health`
3. Expected response:
```json
{
  "status": "OK",
  "dbConnected": true,
  "timestamp": "2025-01-21T15:24:59.881Z",
  "version": "1.0.0",
  "database": {
    "status": "connected",
    "host": "cluster-shard-00-00.ml37j3p.mongodb.net:27017",
    "name": "nyaymitra",
    "error": null
  },
  "environment": "production",
  "uptime": 123.456
}
```

## Troubleshooting

### Common Issues:

#### 1. IP Whitelist Error
```
Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted.
```

**Solution:**
- Add your current IP to the whitelist
- For Vercel, add 0.0.0.0/0 to allow all IPs
- Check if your IP has changed

#### 2. Authentication Failed
```
Authentication failed
```

**Solution:**
- Check username and password in connection string
- Ensure user has proper permissions
- Verify the user exists in Database Access

#### 3. Connection Timeout
```
Server selection timed out
```

**Solution:**
- Check network connectivity
- Verify cluster is running
- Check if cluster is paused (free tier pauses after inactivity)

#### 4. Cluster Not Found
```
Cluster not found
```

**Solution:**
- Verify cluster name in connection string
- Check if cluster is in the correct project
- Ensure cluster is not deleted

### Vercel-Specific Issues:

#### 1. Environment Variables Not Set
- Ensure all environment variables are set in Vercel dashboard
- Redeploy after adding new variables
- Check variable names are correct

#### 2. Cold Start Issues
- First request might be slow due to cold start
- Consider upgrading to a paid plan for better performance
- Use connection pooling (already implemented)

#### 3. Function Timeout
- Vercel functions have a 10-second timeout on free tier
- Database connection should complete within this time
- Consider upgrading for longer timeouts

## Security Best Practices

1. **Use Strong Passwords**: Generate strong, unique passwords for database users
2. **Rotate Credentials**: Regularly rotate database passwords
3. **Limit Permissions**: Use least privilege principle for database users
4. **Monitor Access**: Enable MongoDB Atlas monitoring and alerts
5. **Use VPC Peering**: For production, consider VPC peering with Vercel
6. **Enable Encryption**: Ensure data is encrypted in transit and at rest

## Monitoring and Maintenance

1. **Enable Monitoring**: Set up alerts for connection issues
2. **Monitor Performance**: Watch for slow queries and connection issues
3. **Regular Backups**: Set up automated backups
4. **Update Dependencies**: Keep MongoDB drivers and dependencies updated
5. **Review Logs**: Regularly check application and database logs

## Support

If you continue to have issues:

1. Check Vercel function logs in the dashboard
2. Check MongoDB Atlas logs and metrics
3. Test connection string locally first
4. Verify all environment variables are set correctly
5. Check MongoDB Atlas status page for outages

## Quick Test Commands

```bash
# Test local connection
npm run test:db

# Test all imports
npm run test:imports

# Check health endpoint
curl https://your-backend.vercel.app/api/health
```
