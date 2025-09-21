/* src/server.js */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const documentRoutes = require('./routes/documents')
const userRoutes = require('./routes/users')
const lawyerRoutes = require('./routes/lawyers')
const qaRoutes = require('./routes/qa')
const { errorHandler, notFound } = require('./middleware/errorHandler')
const { connectDB, getDbStatus } = require('./config/database')

const app = express()

// Trust proxy (important behind Vercel / other proxies)
// Must be set before rate-limit and IP-based middleware
app.set('trust proxy', 1)

// Connect to DB (attempt)
connectDB()

// Security headers
app.use(helmet())

// Build allowed origins from env:
// FRONTEND_URLS (comma-separated) OR FRONTEND_URL (single)
const rawOrigins = process.env.FRONTEND_URLS || process.env.FRONTEND_URL || ''
const allowedOrigins = rawOrigins
  .split(',')
  .map((s) => s.trim().replace(/\/$/, '')) // remove trailing slash
  .filter(Boolean)

// allow localhost during development
if (
  process.env.NODE_ENV !== 'production' &&
  !allowedOrigins.includes('http://localhost:3000')
) {
  allowedOrigins.push('http://localhost:3000')
}

console.log('Allowed CORS origins:', allowedOrigins)

// CORS delegate that returns exact origin when allowed (so credentialed requests are accepted)
const corsOptionsDelegate = (req, callback) => {
  const origin = req.header('origin')
  // If no origin (server-to-server request) allow
  if (!origin) {
    return callback(null, { origin: true, credentials: true })
  }
  if (allowedOrigins.includes(origin)) {
    return callback(null, {
      origin,
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept',
        'X-Requested-With',
      ],
      preflightContinue: false,
    })
  }
  // not allowed
  return callback(null, { origin: false })
}

// Use CORS delegate
app.use(cors(corsOptionsDelegate))

// Ensure preflight OPTIONS requests get CORS headers even when DB is down
app.options('*', (req, res) => {
  const origin = req.header('origin') || ''
  if (allowedOrigins.includes(origin) || origin === '') {
    res.setHeader('Access-Control-Allow-Origin', origin || '')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
    )
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type,Authorization,Accept,X-Requested-With'
    )
    return res.sendStatus(204)
  }
  return res.sendStatus(204)
})

// Middleware: block requests when DB is not connected
// Allow health route and OPTIONS through so monitoring / preflight works.
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next()
  }

  // Allow health check always (so you can check service health)
  if (req.path === '/api/health' || req.path === '/api/health/') {
    return next()
  }

  if (getDbStatus()) {
    return next()
  }

  // DB is not connected -> send 503
  // Also include CORS headers if origin allowed (so browsers can get the response)
  const origin = req.header('origin') || ''
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
  }

  return res.status(503).json({
    success: false,
    message: 'Service temporarily unavailable: database connection error',
    code: 'SERVICE_UNAVAILABLE',
  })
})

// Body parser
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Compression, logging
app.use(compression())
app.use(morgan('combined'))

// Rate limiter (after trust proxy)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
})
app.use('/api/', limiter)

// Root route - helpful for non-API calls to show basic info or redirect to health
app.get('/', (req, res) => {
  return res.redirect('/api/health')
})

// Health check endpoint (should always respond)
app.get('/api/health', (req, res) => {
  const dbUp = getDbStatus()
  res.json({
    status: dbUp ? 'OK' : 'DEGRADED',
    dbConnected: dbUp,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/users', userRoutes)
app.use('/api/lawyers', lawyerRoutes)
app.use('/api/qa', qaRoutes)

// Error handlers
app.use(notFound)
app.use(errorHandler)

// Export app (for serverless)
module.exports = app

// Run locally if executed directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on port ${PORT}`)
    console.log(`📚 API Health: http://localhost:${PORT}/api/health`)
  })
}
