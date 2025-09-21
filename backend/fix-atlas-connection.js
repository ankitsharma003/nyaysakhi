#!/usr/bin/env node

// Quick fix script for MongoDB Atlas connection issues
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

console.log('🔧 MongoDB Atlas Connection Fix Tool')
console.log('=====================================')

// Check environment variables
console.log('📋 Checking Environment Variables:')
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`)
console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? 'Set' : '❌ Not set'}`)
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? 'Set' : '❌ Not set'}`)
console.log(`   JWT_REFRESH_SECRET: ${process.env.JWT_REFRESH_SECRET ? 'Set' : '❌ Not set'}`)

if (!process.env.MONGODB_URI) {
  console.log('\n❌ MONGODB_URI is not set!')
  console.log('💡 Please set your MongoDB Atlas connection string in your .env file')
  console.log('   Example: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nyaymitra?retryWrites=true&w=majority')
  process.exit(1)
}

// Check if it's an Atlas connection
const isAtlas = process.env.MONGODB_URI.includes('mongodb+srv://') || process.env.MONGODB_URI.includes('atlas')

if (isAtlas) {
  console.log('\n☁️ MongoDB Atlas connection detected')
  console.log('🔍 Checking connection string format...')
  
  // Basic validation
  const uri = process.env.MONGODB_URI
  const hasUsername = uri.includes('://') && uri.split('://')[1].includes('@')
  const hasCluster = uri.includes('.mongodb.net')
  const hasDatabase = uri.includes('/nyaymitra')
  
  console.log(`   Username/Password: ${hasUsername ? '✅' : '❌'}`)
  console.log(`   Cluster URL: ${hasCluster ? '✅' : '❌'}`)
  console.log(`   Database Name: ${hasDatabase ? '✅' : '❌'}`)
  
  if (!hasUsername || !hasCluster || !hasDatabase) {
    console.log('\n❌ Connection string format is incorrect!')
    console.log('💡 Expected format: mongodb+srv://username:password@cluster.mongodb.net/nyaymitra?retryWrites=true&w=majority')
    process.exit(1)
  }
  
  console.log('\n✅ Connection string format looks correct')
  console.log('\n🔧 Common Atlas Issues and Solutions:')
  console.log('   1. IP Whitelist: Add 0.0.0.0/0 to allow all IPs')
  console.log('   2. User Permissions: Ensure user has read/write access')
  console.log('   3. Cluster Status: Check if cluster is running (not paused)')
  console.log('   4. Network Access: Verify network access settings')
  
} else {
  console.log('\n🏠 Local MongoDB connection detected')
  console.log('💡 For Vercel deployment, you need to use MongoDB Atlas')
}

console.log('\n🚀 Next Steps:')
console.log('   1. Ensure your MongoDB Atlas cluster is running')
console.log('   2. Add 0.0.0.0/0 to IP whitelist in Atlas')
console.log('   3. Verify user has proper permissions')
console.log('   4. Test connection: npm run test:db')
console.log('   5. Deploy to Vercel with environment variables set')

console.log('\n📚 For detailed setup instructions, see: ATLAS_SETUP.md')
