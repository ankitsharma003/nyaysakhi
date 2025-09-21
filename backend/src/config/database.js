/* eslint-disable @typescript-eslint/no-var-requires */
/* config/database.js */
/* src/config/database.js */
const mongoose = require('mongoose')

const DEFAULT_URI = 'mongodb://localhost:27017/nyaymitra'
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_URI

// internal state
let dbConnected = false
let connectAttempts = 0
const MAX_RETRIES = Number(process.env.MONGODB_CONNECT_RETRIES || 5)
const RETRY_DELAY_MS = Number(process.env.MONGODB_RETRY_DELAY_MS || 5000) // 5s default

async function connectDB() {
  if (dbConnected) {
    return
  }

  const opts = {
    // use modern mongoose defaults
    autoIndex: false, // production
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    // other flags are mongoose-managed
  }

  async function tryConnect() {
    try {
      connectAttempts += 1
      const conn = await mongoose.connect(MONGODB_URI, opts)
      dbConnected = true
      console.log(`✅ MongoDB connected to ${conn.connection.host}`)
      setupListeners()
      return
    } catch (err) {
      dbConnected = false
      console.error(
        `❌ MongoDB connection attempt ${connectAttempts} failed:`,
        err.message
      )
      if (connectAttempts < MAX_RETRIES) {
        console.log(`⏳ Retrying MongoDB connection in ${RETRY_DELAY_MS}ms...`)
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS))
        return tryConnect()
      } else {
        console.error('🚨 MongoDB connection failed after max retries.')
        // Don't exit in serverless environment — just surface the status.
        // Optionally you could throw here for non-serverless environment.
        return
      }
    }
  }

  return tryConnect()
}

function setupListeners() {
  mongoose.connection.on('connected', () => {
    dbConnected = true
    console.log('MongoDB event: connected')
  })

  mongoose.connection.on('error', (err) => {
    dbConnected = false
    console.error('MongoDB event: error', err)
  })

  mongoose.connection.on('disconnected', () => {
    dbConnected = false
    console.log('MongoDB event: disconnected')
    // In many deployments you might attempt auto-reconnect (mongoose does some of this)
  })

  // graceful shutdown handlers (for local/dev)
  const graceful = async () => {
    try {
      await mongoose.connection.close()
      console.log('MongoDB connection closed through app termination')
      process.exit(0)
    } catch (e) {
      console.error('Error closing MongoDB connection on shutdown', e)
      process.exit(1)
    }
  }
  process.once('SIGINT', graceful)
  process.once('SIGTERM', graceful)
}

function isDBConnected() {
  // quick check: mongoose.connection.readyState
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const rs = mongoose.connection && mongoose.connection.readyState
  return dbConnected || rs === 1
}

// For code that wants to await initial attempt
function dbReady() {
  return new Promise((resolve) => {
    if (isDBConnected()) return resolve(true)

    // wait up to some time for connection to become true
    const checkInterval = setInterval(() => {
      if (isDBConnected()) {
        clearInterval(checkInterval)
        resolve(true)
      }
    }, 500)

    // safety timeout (optional)
    setTimeout(
      () => {
        clearInterval(checkInterval)
        resolve(isDBConnected())
      },
      (MAX_RETRIES + 1) * RETRY_DELAY_MS + 2000
    )
  })
}

module.exports = {
  connectDB,
  isDBConnected,
  dbReady,
  mongoose,
}
