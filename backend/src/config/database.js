/* eslint-disable @typescript-eslint/no-var-requires */
/* config/database.js */

const mongoose = require('mongoose')
require('dotenv').config()

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/nyaymitra'

let isConnected = false

async function connectDB() {
  try {
    // Connect and update the flag
    const conn = await mongoose.connect(MONGODB_URI)
    isConnected = true
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err)
      isConnected = false
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected')
      isConnected = false
    })

    // Graceful shutdown in non-serverless local environments
    if (process.env.NODE_ENV !== 'production') {
      process.on('SIGINT', async () => {
        try {
          await mongoose.connection.close()
          console.log('🔌 MongoDB connection closed through app termination')
        } catch (e) {
          console.error('Error closing MongoDB connection on SIGINT', e)
        } finally {
          process.exit(0)
        }
      })
    }
  } catch (err) {
    isConnected = false
    console.error(
      '❌ Database connection error:',
      err && err.message ? err.message : err
    )
    console.error(
      '💡 Make sure MongoDB is running and the connection string is correct'
    )
    console.error('💡 For local MongoDB: mongodb://localhost:27017/nyaymitra')
    console.error(
      '💡 For MongoDB Atlas: Check your connection string and network access (IP whitelist)'
    )
    // Do not exit here when running on serverless platforms (Vercel); let app start and respond 503 where needed
  }
}

function getDbStatus() {
  return isConnected
}

module.exports = {
  connectDB,
  getDbStatus,
  mongoose,
}
