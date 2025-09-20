/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require('mongoose')
require('dotenv').config()

// MongoDB connection string
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/nyaymitra'

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Remove deprecated options
    const conn = await mongoose.connect(MONGODB_URI)

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)

    // Set up connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected')
    })

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close()
      console.log('🔌 MongoDB connection closed through app termination')
      process.exit(0)
    })
  } catch (err) {
    console.error('❌ Database connection error:', err.message)
    console.error(
      '💡 Make sure MongoDB is running and the connection string is correct'
    )
    console.error('💡 For local MongoDB: mongodb://localhost:27017/nyaymitra')
    console.error(
      '💡 For MongoDB Atlas: Check your connection string and network access'
    )
    process.exit(1)
  }
}

module.exports = {
  connectDB,
  mongoose,
}
