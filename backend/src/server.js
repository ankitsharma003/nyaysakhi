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
const { connectDB } = require('./config/database')

const app = express()

// IMPORTANT: When behind a proxy (Vercel), set trust proxy BEFORE rate limiter
app.set('trust proxy', 1) // trust first proxy

// Connect to database
connectDB()

// Security middleware
app.use(helmet())

// --- CORS setup ------------------------------------------------------------
// Build allowed origins list from env. Accept either FRONTEND_URLS (comma-separated) or FRONTEND_URL (single)
function normalizeOrigin(u) {
  if (!u) return ''
  return u.trim().replace(/\/+$/, '') // remove trailing slashes
}

const rawOrigins = process.env.FRONTEND_URLS || process.env.FRONTEND_URL || ''
const allowedOrigins = rawOrigins
  .split(',')
  .map((s) => normalizeOrigin(s))
  .filter(Boolean)

// Always allow localhost in non-prod for development convenience
if (
  !allowedOrigins.includes('http://localhost:3000') &&
  process.env.NODE_ENV !== 'production'
) {
  allowedOrigins.push('http://localhost:3000')
}

console.info('[CORS] allowed origins:', allowedOrigins)

// CORS delegate that returns exact origin when allowed and enables credentials
const corsOptionsDelegate = (req, callback) => {
  const rawOrigin = req.header('origin') || ''
  const origin = normalizeOrigin(rawOrigin)

  // If no origin header (same-origin or server-to-server), allow request without CORS headers
  if (!origin) {
    // callback null with origin true allows no Access-Control-Allow-Origin header (same-origin/server internal)
    return callback(null, { origin: false })
  }

  if (allowedOrigins.includes(origin)) {
    // Allow this origin and enable credentials
    return callback(null, {
      origin: origin,
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept',
        'X-Requested-With',
      ],
    })
  }

  // Disallowed origin -> do not set CORS headers
  return callback(null, { origin: false })
}

// Use CORS middleware with delegate
app.use(cors(corsOptionsDelegate))

// Explicitly handle OPTIONS preflight for all routes
app.options('*', (req, res) => {
  const rawOrigin = req.header('origin') || ''
  const origin = normalizeOrigin(rawOrigin)

  if (!origin) {
    // No origin -> no CORS headers required for server-to-server requests
    return res.sendStatus(204)
  }

  if (!allowedOrigins.includes(origin)) {
    // Origin not allowed: respond 204 without CORS headers (browser will block actual request)
    return res.sendStatus(204)
  }

  // Allowed origin: echo it back and provide the rest of preflight headers
  res.setHeader('Access-Control-Allow-Origin', origin)
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
})
// ---------------------------------------------------------------------------

// Rate limiting (after trust proxy & CORS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
})
app.use('/api/', limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Compression middleware
app.use(compression())

// Logging middleware
app.use(morgan('combined'))

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
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

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Export the app for serverless deployment (Vercel)
module.exports = app

// Optional: run server locally if not in serverless environment
if (require.main === module) {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on port ${PORT}`)
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`)
  })
}
