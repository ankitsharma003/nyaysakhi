/* src/config/database.js */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */

const mongoose = require('mongoose')

/**
 * Robust mongoose connection helper suited for serverless / Next.js deployments.
 * - Does NOT call process.exit (serverless functions mustn't exit process)
 * - Retries with exponential backoff (configurable)
 * - Prevents multiple concurrent connections in development by caching
 */

const DEFAULT_MAX_RETRIES = 5
const DEFAULT_RETRY_DELAY_MS = 2000
const DEFAULT_SERVER_SELECTION_TIMEOUT_MS = 5000

// Use env var name you set in Vercel. Keep fallback for local dev.
const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.MONGODB_ATLAS_URI ||
  'mongodb://localhost:27017/nyaymitra'

let retries = 0
let connected = false
let connectingPromise = null

// In Next.js / serverless we want to reuse a connection between hot reloads.
// Use a global to cache connection in dev.
if (!global._mongoose) {
  global._mongoose = { conn: null, promise: null }
}

/**
 * Connect to MongoDB with retries.
 * Returns a promise that resolves when connected (or rejects after retries exhausted).
 * Does not call process.exit on failure (so serverless env doesn't crash).
 */
async function connectDB(options = {}) {
  if (connected) {
    return mongoose
  }

  // If a connection is in progress, return the existing promise
  if (global._mongoose.promise) {
    await global._mongoose.promise
    return mongoose
  }

  // Connection options (explicit and future-proof)
  const connectOptions = {
    // useNewUrlParser/useUnifiedTopology are defaults in recent mongoose but set explicitly
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS:
      options.serverSelectionTimeoutMS || DEFAULT_SERVER_SELECTION_TIMEOUT_MS,
    // other options can be added as necessary
  }

  // Wrap connect attempt
  const attemptConnect = async () => {
    try {
      console.log(
        '🔗 Attempting MongoDB connection to:',
        sanitizeUri(MONGODB_URI)
      )
      const conn = await mongoose.connect(MONGODB_URI, connectOptions)
      connected = true
      retries = 0
      global._mongoose.conn = conn
      console.log(`✅ MongoDB connected to ${conn.connection.host}`)
      setupListeners()
      return conn
    } catch (err) {
      retries += 1
      console.error(
        `❌ MongoDB connection attempt ${retries} failed:`,
        (err && err.message) || err
      )
      if (retries >= (options.maxRetries || DEFAULT_MAX_RETRIES)) {
        console.error(
          `⚠️ Reached max MongoDB connection retries (${options.maxRetries || DEFAULT_MAX_RETRIES}). Giving up for now.`
        )
        // do not exit the process in serverless; rethrow so caller can handle
        throw err
      }
      const delay = computeBackoffDelay(
        retries,
        options.baseDelayMs || DEFAULT_RETRY_DELAY_MS
      )
      console.log(`⏳ Retrying MongoDB connection in ${delay}ms...`)
      await sleep(delay)
      return attemptConnect()
    }
  }

  // Save promise to prevent duplicate attempts
  connectingPromise = attemptConnect()
  global._mongoose.promise = connectingPromise

  try {
    await connectingPromise
    return mongoose
  } finally {
    // clear the connecting promise once resolved/rejected so new attempts can be made later
    global._mongoose.promise = null
  }
}

function sanitizeUri(uri) {
  try {
    // hide credentials for logging
    return uri.replace(/\/\/.*:.*@/, '//***:***@')
  } catch {
    return uri
  }
}

function computeBackoffDelay(attempt, base = DEFAULT_RETRY_DELAY_MS) {
  // exponential backoff with jitter: base * 2^(attempt-1) + random(0, base)
  const jitter = Math.floor(Math.random() * base)
  return base * Math.pow(2, Math.max(0, attempt - 1)) + jitter
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function setupListeners() {
  // Only set listeners once
  if (global._mongoose.listenersSetup) return
  global._mongoose.listenersSetup = true

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err)
    connected = false
  })

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected')
    connected = false
  })

  // graceful close in local dev when pressing ctrl+c
  if (typeof process !== 'undefined' && process && process.on) {
    process.on('SIGINT', async () => {
      try {
        if (mongoose.connection && mongoose.connection.readyState === 1) {
          await mongoose.connection.close(false)
          console.log(
            '🔌 MongoDB connection closed through app termination (SIGINT)'
          )
        }
      } catch (e) {
        console.error('Error closing MongoDB connection on SIGINT:', e)
      } finally {
        // only exit in non-serverless environments
        if (process.env.NODE_ENV !== 'production') process.exit(0)
      }
    })
  }
}

// Helper so other modules can check DB state
function isConnected() {
  return (
    connected || (mongoose.connection && mongoose.connection.readyState === 1)
  )
}

module.exports = {
  connectDB,
  isConnected,
  mongoose,
}
