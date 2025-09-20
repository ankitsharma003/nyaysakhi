# NyayMitra Deployment Guide

## Prerequisites

- MongoDB Atlas account and cluster
- Node.js 18+ installed
- Git repository

## Quick Start with MongoDB Atlas

### 1. Set up MongoDB Atlas

Follow the detailed guide in `MONGODB_ATLAS_SETUP.md` to:

- Create a MongoDB Atlas account
- Set up a cluster
- Create database users
- Configure network access
- Get your connection string

### 2. Update Environment Variables

Replace the placeholder values in `backend/.env`:

```env
MONGODB_URI=mongodb+srv://nyaymitra_user:YOUR_ACTUAL_PASSWORD@nyaymitra-cluster.xxxxx.mongodb.net/nyaymitra?retryWrites=true&w=majority
JWT_SECRET=your-actual-jwt-secret-here
JWT_REFRESH_SECRET=your-actual-refresh-secret-here
```

## Deployment Options

### Option 1: Vercel (Recommended for Frontend)

#### Frontend Deployment:

1. **Install Vercel CLI:**

   ```bash
   npm i -g vercel
   ```

2. **Deploy Frontend:**

   ```bash
   vercel
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
   - `NEXT_PUBLIC_MONGODB_URI`: Your MongoDB Atlas connection string

#### Backend Deployment:

1. **Create `vercel.json` in backend folder:**

   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "src/server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "src/server.js"
       }
     ]
   }
   ```

2. **Deploy Backend:**
   ```bash
   cd backend
   vercel
   ```

### Option 2: Railway

1. **Connect GitHub Repository:**
   - Go to [Railway](https://railway.app)
   - Connect your GitHub repository

2. **Deploy Backend:**
   - Select backend folder
   - Add environment variables
   - Deploy

3. **Deploy Frontend:**
   - Create new project
   - Select frontend folder
   - Add environment variables
   - Deploy

### Option 3: Render

#### Backend Deployment:

1. **Create `render.yaml`:**

   ```yaml
   services:
     - type: web
       name: nyaymitra-backend
       env: node
       buildCommand: cd backend && npm install
       startCommand: cd backend && npm start
       envVars:
         - key: MONGODB_URI
           fromDatabase:
             name: mongodb
             property: connectionString
         - key: JWT_SECRET
           generateValue: true
         - key: JWT_REFRESH_SECRET
           generateValue: true
         - key: NODE_ENV
           value: production
   ```

2. **Deploy:**
   - Connect GitHub repository
   - Select render.yaml
   - Deploy

#### Frontend Deployment:

1. **Create Static Site:**
   - Connect GitHub repository
   - Build Command: `npm run build`
   - Publish Directory: `.next`
   - Add environment variables

### Option 4: Heroku

#### Backend Deployment:

1. **Create `Procfile` in backend folder:**

   ```
   web: npm start
   ```

2. **Deploy:**

   ```bash
   # Install Heroku CLI
   npm install -g heroku

   # Login to Heroku
   heroku login

   # Create app
   heroku create nyaymitra-backend

   # Set environment variables
   heroku config:set MONGODB_URI="your-mongodb-atlas-uri"
   heroku config:set JWT_SECRET="your-jwt-secret"
   heroku config:set JWT_REFRESH_SECRET="your-refresh-secret"
   heroku config:set NODE_ENV="production"

   # Deploy
   git push heroku main
   ```

#### Frontend Deployment:

1. **Create `package.json` scripts:**

   ```json
   {
     "scripts": {
       "build": "next build",
       "start": "next start -p $PORT"
     }
   }
   ```

2. **Deploy:**
   ```bash
   heroku create nyaymitra-frontend
   git push heroku main
   ```

### Option 5: DigitalOcean App Platform

1. **Create App Spec:**

   ```yaml
   name: nyaymitra
   services:
     - name: backend
       source_dir: /backend
       github:
         repo: your-username/nyaymitra
         branch: main
       run_command: npm start
       environment_slug: node-js
       instance_count: 1
       instance_size_slug: basic-xxs
       envs:
         - key: MONGODB_URI
           value: your-mongodb-atlas-uri
         - key: JWT_SECRET
           value: your-jwt-secret
         - key: NODE_ENV
           value: production
     - name: frontend
       source_dir: /
       github:
         repo: your-username/nyaymitra
         branch: main
       run_command: npm start
       environment_slug: node-js
       instance_count: 1
       instance_size_slug: basic-xxs
       envs:
         - key: NEXT_PUBLIC_API_URL
           value: https://backend-url.ondigitalocean.app
   ```

2. **Deploy:**
   - Connect GitHub repository
   - Upload app spec
   - Deploy

## Environment Variables for Production

### Backend (.env.production):

```env
MONGODB_URI=mongodb+srv://nyaymitra_user:PROD_PASSWORD@nyaymitra-cluster.xxxxx.mongodb.net/nyaymitra?retryWrites=true&w=majority
JWT_SECRET=your-production-jwt-secret-here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-production-refresh-secret-here
JWT_REFRESH_EXPIRE=30d
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env.production):

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
NEXT_PUBLIC_MONGODB_URI=mongodb+srv://nyaymitra_user:PROD_PASSWORD@nyaymitra-cluster.xxxxx.mongodb.net/nyaymitra?retryWrites=true&w=majority
```

## Security Considerations

### 1. Environment Variables

- Never commit `.env` files to version control
- Use platform-specific secret management
- Rotate secrets regularly
- Use different secrets for different environments

### 2. MongoDB Atlas Security

- Use strong passwords
- Enable IP whitelisting
- Use VPC peering for production
- Enable encryption at rest
- Regular security audits

### 3. Application Security

- Use HTTPS in production
- Enable CORS properly
- Implement rate limiting
- Use secure headers
- Regular dependency updates

## Monitoring and Logging

### 1. Application Monitoring

- Use platform monitoring tools
- Set up alerts for errors
- Monitor performance metrics
- Track user analytics

### 2. Database Monitoring

- Use MongoDB Atlas monitoring
- Set up alerts for connection issues
- Monitor query performance
- Track storage usage

## Troubleshooting

### Common Issues:

1. **Connection Refused:**
   - Check MongoDB Atlas network access
   - Verify connection string
   - Check firewall settings

2. **Authentication Failed:**
   - Verify username and password
   - Check database user permissions
   - Ensure user exists in Atlas

3. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for missing environment variables

4. **CORS Issues:**
   - Update CORS settings in backend
   - Check frontend API URL configuration
   - Verify domain names

### Debug Steps:

1. **Check Logs:**

   ```bash
   # For Vercel
   vercel logs

   # For Railway
   railway logs

   # For Heroku
   heroku logs --tail
   ```

2. **Test Database Connection:**

   ```bash
   # Test locally
   cd backend
   node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI)"
   ```

3. **Verify Environment Variables:**
   ```bash
   # Check if variables are set
   echo $MONGODB_URI
   ```

## Cost Optimization

### MongoDB Atlas:

- Start with M0 (free) tier
- Monitor usage and scale as needed
- Use auto-scaling for production
- Optimize queries for performance

### Hosting Platforms:

- Choose appropriate instance sizes
- Use CDN for static assets
- Implement caching strategies
- Monitor resource usage

## Backup and Recovery

### Database Backups:

- Enable continuous backups in Atlas
- Set up point-in-time recovery
- Test backup restoration regularly
- Document recovery procedures

### Application Backups:

- Use version control (Git)
- Keep deployment configurations
- Document deployment procedures
- Test disaster recovery plans
