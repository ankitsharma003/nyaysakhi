/* eslint-disable @typescript-eslint/no-unused-vars */
/* src/config/database.js */
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/nyaymitra'

// Internal state
let connected = false
let connecting = false

// Basic retry config - reduce retries for serverless environments
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production'
const MAX_RETRIES = isServerless ? 2 : parseInt(process.env.MONGODB_CONNECT_RETRIES || '5', 10)
const RETRY_DELAY_MS = isServerless ? 2000 : parseInt(
  process.env.MONGODB_RETRY_DELAY_MS || '5000',
  10
)

async function _connectWithRetry(retriesLeft = MAX_RETRIES) {
  if (connecting) {
    console.log('⏳ MongoDB connection already in progress...')
    return
  }
  connecting = true

  try {
    console.log(`🔌 Attempting to connect to MongoDB... (${retriesLeft} retries left)`)
    console.log(`📍 Connection URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`) // Hide credentials in logs
    
    // Use modern mongoose defaults with additional options for stability
    const connectionOptions = {
      serverSelectionTimeoutMS: 30000, // Increased timeout for Atlas
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000, // Increased connection timeout
      maxPoolSize: 10, // Maintain up to 10 socket connections
      retryWrites: true,
      w: 'majority',
    }

    // Add Atlas-specific options if using Atlas
    if (MONGODB_URI.includes('mongodb+srv://') || MONGODB_URI.includes('atlas')) {
      connectionOptions.serverApi = {
        version: '1',
        strict: false,
        deprecationErrors: true,
      }
      // Atlas-specific retry settings
      connectionOptions.retryReads = true
      connectionOptions.retryWrites = true
    }

    await mongoose.connect(MONGODB_URI, connectionOptions)

    connected = true
    connecting = false
    console.log('✅ MongoDB connected successfully to', mongoose.connection.host)
    console.log('📊 Database name:', mongoose.connection.name)
  } catch (err) {
    connecting = false
    connected = false
    console.error(`❌ MongoDB connection attempt failed: ${err.message}`)
    console.error('🔍 Error details:', {
      name: err.name,
      code: err.code,
      reason: err.reason,
    })

    if (retriesLeft > 0) {
      console.log(
        `⏳ Retrying MongoDB connection in ${RETRY_DELAY_MS}ms... (${retriesLeft - 1} retries left)`
      )
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS))
      return _connectWithRetry(retriesLeft - 1)
    } else {
      console.error('❌ MongoDB connection failed after all retries.')
      console.error('💡 Please check:')
      console.error('   1. MongoDB is running locally or Atlas connection string is correct')
      console.error('   2. Network connectivity')
      console.error('   3. Environment variables are set correctly')
      // Don't exit in production/serverless environments
      if (process.env.NODE_ENV === 'development' && process.env.FORCE_EXIT_ON_DB_FAIL === 'true') {
        process.exit(1)
      }
    }
  }
}

// Public function to initiate connection (call once at app start)
async function connectDB() {
  if (connected) {
    console.log('✅ MongoDB already connected')
    return true
  }

  // Set up listeners before attempting connection
  mongoose.connection.on('connected', () => {
    connected = true
    console.log('🔄 MongoDB connection event: connected')
  })

  mongoose.connection.on('disconnected', () => {
    connected = false
    console.warn('⚠️ MongoDB connection event: disconnected')
  })

  mongoose.connection.on('error', (err) => {
    connected = false
    console.error('❌ MongoDB connection event: error', err.message)
  })

  mongoose.connection.on('reconnected', () => {
    connected = true
    console.log('🔄 MongoDB reconnected')
  })

  // Attempt connection
  try {
    await _connectWithRetry()
    return connected
  } catch (error) {
    console.error('❌ Failed to establish initial MongoDB connection:', error.message)
    return false
  }
}

// Graceful shutdown function
const gracefulShutdown = async () => {
  try {
    console.log('🔄 Gracefully closing MongoDB connection...')
        if (mongoose.connection.readyState === 1) {
          await mongoose.connection.close(false)
      console.log('🔌 MongoDB connection closed gracefully.')
        }
      } catch (e) {
    console.error('❌ Error closing MongoDB connection:', e)
      } finally {
        // Only exit in non-serverless local environments if desired
        if (
          process.env.NODE_ENV !== 'production' &&
          process.env.FORCE_EXIT_ON_DB_CLOSE === 'true'
        ) {
          process.exit(0)
        }
      }
    }

// Set up graceful shutdown handlers
if (typeof process !== 'undefined') {
  process.on('SIGINT', gracefulShutdown)
  process.on('SIGTERM', gracefulShutdown)
  process.on('SIGUSR2', gracefulShutdown) // For nodemon
}

// Exported accessor used by middleware
function isDBConnected() {
  // mongoose.connection.readyState values:
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  try {
    if (!mongoose || !mongoose.connection) {
      return false
    }
    
    const readyState = mongoose.connection.readyState
    const isConnected = readyState === 1
    
    // Also check if we have a valid connection object
    if (isConnected && mongoose.connection.host) {
      return true
    }
    
    return false
  } catch (e) {
    console.error('Error checking DB connection status:', e.message)
    return false
  }
}

// Additional utility function to get connection status
function getConnectionStatus() {
  try {
    if (!mongoose || !mongoose.connection) {
      return {
        connected: false,
        readyState: 'unknown',
        host: null,
        name: null,
        error: 'Mongoose not initialized'
      }
    }

    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }

    return {
      connected: mongoose.connection.readyState === 1,
      readyState: states[mongoose.connection.readyState] || 'unknown',
      host: mongoose.connection.host || null,
      name: mongoose.connection.name || null,
      error: null
    }
  } catch (e) {
    return {
      connected: false,
      readyState: 'error',
      host: null,
      name: null,
      error: e.message
    }
  }
}

// Helpful: exposes the underlying mongoose for models/tests
export { connectDB, isDBConnected, getConnectionStatus, mongoose }
