#!/usr/bin/env node

// Comprehensive MongoDB Atlas diagnostic tool
import dotenv from 'dotenv'
import { connectDB, isDBConnected, getConnectionStatus } from './src/config/database.js'

// Load environment variables
dotenv.config()

console.log('🔍 MongoDB Atlas Diagnostic Tool')
console.log('=====================================')

// Check environment variables
console.log('📋 Environment Check:')
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`)
console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? 'Set' : '❌ Not set'}`)
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? 'Set' : '❌ Not set'}`)
console.log(`   JWT_REFRESH_SECRET: ${process.env.JWT_REFRESH_SECRET ? 'Set' : '❌ Not set'}`)

if (!process.env.MONGODB_URI) {
  console.log('\n❌ MONGODB_URI is not set!')
  console.log('💡 Please set your MongoDB Atlas connection string in your .env file')
  process.exit(1)
}

// Parse connection string
const uri = process.env.MONGODB_URI
console.log('\n🔍 Connection String Analysis:')
console.log(`   Full URI: ${uri.replace(/\/\/.*@/, '//***:***@')}`)

const isAtlas = uri.includes('mongodb+srv://') || uri.includes('atlas')
console.log(`   Type: ${isAtlas ? 'MongoDB Atlas' : 'Local MongoDB'}`)

if (isAtlas) {
  // Extract components
  const match = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/)
  if (match) {
    const [, username, password, cluster, database] = match
    console.log(`   Username: ${username}`)
    console.log(`   Password: ${'*'.repeat(password.length)}`)
    console.log(`   Cluster: ${cluster}`)
    console.log(`   Database: ${database}`)
  } else {
    console.log('❌ Invalid Atlas connection string format!')
    console.log('💡 Expected: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority')
    process.exit(1)
  }
}

console.log('\n🧪 Testing Connection...')

// Test connection with detailed error handling
async function testConnection() {
  try {
    console.log('⏳ Attempting to connect...')
    
    const connected = await connectDB()
    
    if (connected) {
      console.log('✅ Connection successful!')
      
      const status = getConnectionStatus()
      console.log('\n📊 Connection Details:')
      console.log(`   Status: ${status.readyState}`)
      console.log(`   Host: ${status.host}`)
      console.log(`   Database: ${status.name}`)
      console.log(`   Connected: ${status.connected}`)
      
      // Test a simple operation
      try {
        const { mongoose } = await import('./src/config/database.js')
        const collections = await mongoose.connection.db.listCollections().toArray()
        console.log(`\n📁 Collections: ${collections.length} found`)
        if (collections.length > 0) {
          console.log('   Collections:', collections.map(c => c.name).join(', '))
        }
      } catch (opError) {
        console.warn('⚠️ Could not list collections:', opError.message)
      }
      
    } else {
      console.log('❌ Connection failed!')
      
      const status = getConnectionStatus()
      console.log('\n🔍 Error Analysis:')
      console.log(`   Status: ${status.readyState}`)
      console.log(`   Error: ${status.error}`)
      
      console.log('\n🛠️ Troubleshooting Steps:')
      console.log('   1. Check MongoDB Atlas Dashboard:')
      console.log('      - Go to https://cloud.mongodb.com')
      console.log('      - Select your project')
      console.log('      - Check if cluster is running (not paused)')
      
      console.log('\n   2. Fix IP Whitelist:')
      console.log('      - Go to "Network Access" in Atlas')
      console.log('      - Click "Add IP Address"')
      console.log('      - Click "Allow Access from Anywhere" (0.0.0.0/0)')
      console.log('      - Add comment: "Vercel deployment"')
      console.log('      - Click "Confirm"')
      
      console.log('\n   3. Check Database User:')
      console.log('      - Go to "Database Access" in Atlas')
      console.log('      - Verify user exists and has correct permissions')
      console.log('      - Check if password is correct')
      
      console.log('\n   4. Verify Connection String:')
      console.log('      - Ensure it includes the database name')
      console.log('      - Check for typos in username/password')
      console.log('      - Verify cluster name is correct')
      
      console.log('\n   5. For Vercel Deployment:')
      console.log('      - Set environment variables in Vercel dashboard')
      console.log('      - Redeploy after setting variables')
      console.log('      - Check Vercel function logs')
      
      process.exit(1)
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
    
    if (error.message.includes('IP')) {
      console.log('\n🚨 IP WHITELIST ISSUE DETECTED!')
      console.log('💡 This is the most common issue. Please:')
      console.log('   1. Go to MongoDB Atlas Dashboard')
      console.log('   2. Click "Network Access"')
      console.log('   3. Add IP Address: 0.0.0.0/0')
      console.log('   4. Click "Confirm"')
    } else if (error.message.includes('Authentication')) {
      console.log('\n🚨 AUTHENTICATION ISSUE DETECTED!')
      console.log('💡 Please check:')
      console.log('   1. Username and password in connection string')
      console.log('   2. User exists in Database Access')
      console.log('   3. User has proper permissions')
    } else if (error.message.includes('timeout')) {
      console.log('\n🚨 TIMEOUT ISSUE DETECTED!')
      console.log('💡 Please check:')
      console.log('   1. Cluster is running (not paused)')
      console.log('   2. Network connectivity')
      console.log('   3. Firewall settings')
    }
    
    process.exit(1)
  }
}

// Run the test
testConnection()
  .then(() => {
    console.log('\n🎉 All tests passed! Your MongoDB Atlas connection is working.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Diagnostic failed:', error)
    process.exit(1)
  })
