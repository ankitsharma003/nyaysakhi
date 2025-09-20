/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require('mongoose')

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/nyaymitra'

if (!MONGODB_URI) {
  throw new Error(
    '❌ Please define the MONGODB_URI environment variable inside .env.local'
  )
}

/**
 * In serverless environments (like Vercel), Next.js API routes
 * can be called multiple times rapidly. We cache the connection
 * to avoid exhausting connections.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Additional options can go here
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log(`✅ MongoDB connected: ${mongoose.connection.host}`)

        mongoose.connection.on('error', (err) => {
          console.error('❌ MongoDB connection error:', err)
        })

        mongoose.connection.on('disconnected', () => {
          console.log('⚠️ MongoDB disconnected')
        })

        return mongoose
      })
      .catch((err) => {
        console.error('❌ Database connection error:', err.message)
        throw err
      })
  }

  cached.conn = await cached.promise
  return cached.conn
}

module.exports = {
  connectDB,
  mongoose,
}
