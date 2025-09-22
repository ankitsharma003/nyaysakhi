/* src/server.js */
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import { connectDB, isDBConnected, getConnectionStatus, mongoose } from './config/database.js'
import dbRequired from './middleware/dbRequired.js'

// Initialize dotenv
dotenv.config()

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'JWT_REFRESH_SECRET']
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '))
  console.error('Please check your .env file or environment configuration')
  process.exit(1)
}

// Import routes directly
import authRoutes from './routes/auth.js'
import documentRoutes from './routes/documents.js'
import userRoutes from './routes/users.js'
import lawyerRoutes from './routes/lawyers.js'
import qaRoutes from './routes/qa.js'

const app = express()

// Build allowed origins
const rawOrigins = process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '';
const allowedOrigins = rawOrigins
  .split(',')
  .map((s) => s.trim().replace(/\/$/, ''))
  .filter(Boolean);

if (process.env.NODE_ENV !== 'production') {
  if (!allowedOrigins.includes('http://localhost:3000')) {
    allowedOrigins.push('http://localhost:3000');
  }
  if (!allowedOrigins.includes('http://localhost:3001')) {
    allowedOrigins.push('http://localhost:3001');
  }
}
console.log('Allowed CORS origins:', allowedOrigins);

// Always set CORS headers for all responses
app.use((req, res, next) => {
  const origin = req.header('origin');
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  next();
});

// Respond to all OPTIONS requests with CORS headers
app.options('*', (req, res) => {
  const origin = req.header('origin');
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.sendStatus(204);
});

// Add this handler after the above middleware:
app.options('*', (req, res) => {
  res.sendStatus(204);
});

// Set trust proxy early (important behind Vercel / proxies)
app.set('trust proxy', 1)

// Initialize database connection
let dbConnectionAttempted = false

async function initializeDatabase() {
  if (dbConnectionAttempted) {
    return
  }
  
  dbConnectionAttempted = true
  console.log('🔌 Initializing database connection...')
  
  // Check if we're in a serverless environment
  const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
  
  if (isServerless) {
    console.log('☁️ Detected serverless environment, optimizing connection...')
  }
  
  try {
    const connected = await connectDB()
    if (connected) {
      console.log('✅ Database connection established successfully')
    } else {
      console.warn('⚠️ Database connection failed, but server will continue running')
      console.warn('💡 Some features may be limited until database is available')
      
      if (isServerless) {
        console.warn('☁️ In serverless environment, connection will be retried on next request')
      }
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message)
    console.warn('⚠️ Server will continue running in degraded mode')
    
    if (isServerless) {
      console.warn('☁️ Serverless environment detected - connection will be retried on next request')
    }
  }
}

// Start database connection
initializeDatabase()

// Security & cors
app.use(helmet())

// ...existing code...

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, try later' },
})
app.use('/api/', limiter)

// Parsing / compression / logging
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(compression())
app.use(morgan('combined'))

// Health endpoint: returns OK if DB connected, otherwise DEGRADED
app.get('/api/health', (req, res) => {
  const dbStatus = getConnectionStatus()
  const dbUp = isDBConnected()
  
  const healthResponse = {
    status: dbUp ? 'OK' : 'DEGRADED',
    dbConnected: dbUp,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
    database: {
      status: dbStatus.readyState,
      host: dbStatus.host,
      name: dbStatus.name,
      error: dbStatus.error
    },
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  }

  // Return 200 for both OK and DEGRADED status
  // Only return 503 for critical failures
  if (dbStatus.error && dbStatus.error.includes('not initialized')) {
    return res.status(503).json({
      ...healthResponse,
      status: 'ERROR',
      message: 'Database not initialized'
    })
  }

  return res.status(200).json(healthResponse)
})

// Mount routes that require DB behind dbRequired middleware
// Verify routes are properly exported before mounting
const routes = [
  { path: '/api/auth', router: authRoutes },
  { path: '/api/documents', router: documentRoutes },
  { path: '/api/users', router: userRoutes },
  { path: '/api/lawyers', router: lawyerRoutes },
  { path: '/api/qa', router: qaRoutes },
]

routes.forEach(({ path, router }) => {
  if (!router || typeof router !== 'function') {
    console.error(`Error: Route ${path} is not properly exported. Got:`, router)
    process.exit(1)
  }
  app.use(path, dbRequired, router)
})

// Generic unknown-route handler and error handler
app.use(notFound)
app.use(errorHandler)

export default app
