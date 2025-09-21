#!/usr/bin/env node

// Database connection test script
import dotenv from 'dotenv'
import { connectDB, isDBConnected, getConnectionStatus } from './src/config/database.js'

// Load environment variables
dotenv.config()

console.log('🧪 Testing MongoDB connection...')
console.log('=====================================')

// Display environment info
console.log('📋 Environment Information:')
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`)
console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? 'Set' : 'Not set'}`)
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? 'Set' : 'Not set'}`)
console.log('=====================================')

async function testDatabaseConnection() {
  try {
    console.log('🔌 Attempting to connect to MongoDB...')
    
    // Test connection
    const connected = await connectDB()
    
    if (connected) {
      console.log('✅ Database connection successful!')
      
      // Get detailed status
      const status = getConnectionStatus()
      console.log('📊 Connection Details:')
      console.log(`   Status: ${status.readyState}`)
      console.log(`   Host: ${status.host}`)
      console.log(`   Database: ${status.name}`)
      console.log(`   Connected: ${status.connected}`)
      
      // Test a simple operation
      try {
        const { mongoose } = await import('./src/config/database.js')
        const collections = await mongoose.connection.db.listCollections().toArray()
        console.log(`📁 Collections found: ${collections.length}`)
        if (collections.length > 0) {
          console.log('   Collections:', collections.map(c => c.name).join(', '))
        }
      } catch (opError) {
        console.warn('⚠️ Could not list collections:', opError.message)
      }
      
    } else {
      console.log('❌ Database connection failed!')
      const status = getConnectionStatus()
      console.log('🔍 Error Details:')
      console.log(`   Status: ${status.readyState}`)
      console.log(`   Error: ${status.error}`)
      
      console.log('\n💡 Troubleshooting Tips:')
      console.log('   1. Check if MongoDB is running locally')
      console.log('   2. Verify MONGODB_URI in your .env file')
      console.log('   3. For MongoDB Atlas, check your connection string')
      console.log('   4. Ensure network connectivity')
      console.log('   5. Check firewall settings')
      
      process.exit(1)
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message)
    console.error('Stack trace:', error.stack)
    process.exit(1)
  }
}

// Run the test
testDatabaseConnection()
  .then(() => {
    console.log('🎉 Database connection test completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Database test failed:', error)
    process.exit(1)
  })
