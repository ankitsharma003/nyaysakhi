# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" or "Start Free"
3. Sign up with your email or Google account
4. Verify your email address

## Step 2: Create a New Cluster

1. **Choose a Cloud Provider and Region:**
   - Select AWS, Google Cloud, or Azure
   - Choose a region closest to your users
   - For free tier, select a region that supports M0 (free) clusters

2. **Select Cluster Tier:**
   - For development: M0 (Free) - 512 MB storage
   - For production: M10 or higher

3. **Cluster Name:**
   - Enter: `nyaymitra-cluster`

4. Click "Create Cluster"

## Step 3: Configure Database Access

1. **Create Database User:**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `nyaymitra_user`
   - Password: Generate a strong password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

## Step 4: Configure Network Access

1. **Add IP Address:**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add specific IP addresses
   - Click "Confirm"

## Step 5: Get Connection String

1. **Connect to Cluster:**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Driver: Node.js
   - Version: 4.1 or later
   - Copy the connection string

2. **Connection String Format:**
   ```
   mongodb+srv://nyaymitra_user:<password>@nyaymitra-cluster.xxxxx.mongodb.net/nyaymitra?retryWrites=true&w=majority
   ```

## Step 6: Update Environment Variables

Replace the connection string in your `.env` file:

```env
MONGODB_URI=mongodb+srv://nyaymitra_user:YOUR_PASSWORD@nyaymitra-cluster.xxxxx.mongodb.net/nyaymitra?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-change-this-in-production
JWT_REFRESH_EXPIRE=30d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Step 7: Test Connection

1. Start your backend:

   ```bash
   cd backend
   npm start
   ```

2. You should see:
   ```
   ✅ MongoDB Connected: nyaymitra-cluster-shard-00-00.xxxxx.mongodb.net
   ```

## Step 8: Create Collections (Optional)

MongoDB Atlas will automatically create collections when you first insert data. However, you can create them manually:

1. Go to "Database" → "Browse Collections"
2. Click "Create Database"
3. Database Name: `nyaymitra`
4. Collection Name: `users` (or any collection name)
5. Click "Create"

## Security Best Practices

### For Development:

- Use IP whitelist with your current IP
- Use strong passwords
- Enable authentication

### For Production:

- Use VPC peering or private endpoints
- Enable encryption at rest
- Use database-level authentication
- Regular security audits
- Monitor access logs

## Environment-Specific Configuration

### Development (.env.development):

```env
MONGODB_URI=mongodb+srv://nyaymitra_user:dev_password@nyaymitra-cluster-dev.xxxxx.mongodb.net/nyaymitra-dev?retryWrites=true&w=majority
NODE_ENV=development
```

### Production (.env.production):

```env
MONGODB_URI=mongodb+srv://nyaymitra_user:prod_password@nyaymitra-cluster-prod.xxxxx.mongodb.net/nyaymitra-prod?retryWrites=true&w=majority
NODE_ENV=production
```

## Troubleshooting

### Connection Issues:

1. **Authentication Failed:**
   - Check username and password
   - Verify database user exists
   - Check if user has correct permissions

2. **Network Access Denied:**
   - Add your IP to whitelist
   - Check if IP address is correct
   - Try "Allow Access from Anywhere" for testing

3. **DNS Resolution Issues:**
   - Check internet connection
   - Try different DNS servers
   - Verify connection string format

### Common Error Messages:

- `bad auth : Authentication failed` → Wrong credentials
- `querySrv ECONNREFUSED` → Network access issue
- `ETIMEOUT` → Connection timeout, check network

## Monitoring and Alerts

1. **Set up Alerts:**
   - Go to "Alerts" in Atlas
   - Set up alerts for connection failures
   - Monitor database performance

2. **View Metrics:**
   - Check "Metrics" tab for performance data
   - Monitor connection count
   - Watch for slow queries

## Backup and Recovery

1. **Enable Backups:**
   - Go to "Backups" in Atlas
   - Enable continuous backups
   - Set retention period

2. **Point-in-Time Recovery:**
   - Available for M10+ clusters
   - Restore to any point in time
   - Useful for data recovery

## Cost Optimization

1. **Free Tier Limits:**
   - 512 MB storage
   - Shared RAM and vCPU
   - 100 connections

2. **Scaling:**
   - Start with M0 for development
   - Scale up as needed
   - Use auto-scaling for production

## Deployment Considerations

### For Vercel/Netlify:

- Use environment variables
- Store connection string securely
- Use different clusters for different environments

### For Docker:

- Use environment variables
- Don't hardcode credentials
- Use Docker secrets for production

### For Kubernetes:

- Use ConfigMaps and Secrets
- Store credentials in Kubernetes secrets
- Use service accounts for authentication
