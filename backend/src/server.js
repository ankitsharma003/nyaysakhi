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

// Connect to database
connectDB()

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
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

// Add this after creating app
app.set('trust proxy', 1)
// Export the app for serverless deployment
module.exports = app

// Optional: run server locally if not in serverless environment
if (require.main === module) {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on port ${PORT}`)
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`)
  })
}
