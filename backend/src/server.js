/* src/server.js */
'use strict'
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
const { connectDB, isDBConnected } = require('./config/database')
const { dbRequired } = require('./middleware/dbRequired')

const app = express()

// Set trust proxy early (important behind Vercel / proxies)
app.set('trust proxy', 1)

// Connect to DB with better error handling and logging
connectDB().catch((err) => {
  console.error('Database Connection Error:', {
    message: err.message,
    code: err.code,
    name: err.name,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  })

  // Set up MongoDB reconnection monitor
  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected! Attempting to reconnect...')
    setTimeout(connectDB, 5000)
  })

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err)
  })

  mongoose.connection.on('connected', () => {
    console.log('MongoDB reconnected successfully')
  })
})

// Security & cors
app.use(helmet())

// Build allowed origins
const rawOrigins = process.env.FRONTEND_URLS || process.env.FRONTEND_URL || ''
const allowedOrigins = rawOrigins
  .split(',')
  .map((s) => s.trim().replace(/\/$/, ''))
  .filter(Boolean)

if (
  !allowedOrigins.includes('http://localhost:3000') &&
  process.env.NODE_ENV !== 'production'
) {
  allowedOrigins.push('http://localhost:3000')
}
console.log('Allowed CORS origins:', allowedOrigins)

const corsOptionsDelegate = (req, callback) => {
  const origin = req.header('origin')
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
    })
  }
  return callback(null, { origin: false })
}

app.use(cors(corsOptionsDelegate))
app.options('*', (req, res) => {
  // simple preflight responder
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type,Authorization,Accept,X-Requested-With'
  )
  res.header(
    'Access-Control-Allow-Methods',
    'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
  )
  const origin = req.header('origin') || ''
  if (allowedOrigins.includes(origin) || origin === '') {
    res.setHeader('Access-Control-Allow-Origin', origin || '')
  }
  return res.sendStatus(204)
})

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
  const dbUp = isDBConnected()
  if (dbUp) {
    return res.status(200).json({
      status: 'OK',
      dbConnected: true,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
    })
  }
  return res.status(200).json({
    status: 'DEGRADED',
    dbConnected: false,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  })
})

// Mount routes that require DB behind dbRequired middleware
// If you'd prefer some routes to be available even without DB, mount them before dbRequired.
app.use('/api/auth', dbRequired, authRoutes)
app.use('/api/documents', dbRequired, documentRoutes)
app.use('/api/users', dbRequired, userRoutes)
app.use('/api/lawyers', dbRequired, lawyerRoutes)
app.use('/api/qa', dbRequired, qaRoutes)

// Generic unknown-route handler and error handler
app.use(notFound)
app.use(errorHandler)

module.exports = app

// Run locally if started directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on port ${PORT}`)
  })
}
