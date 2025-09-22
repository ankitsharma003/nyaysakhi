#!/usr/bin/env node

// Vercel environment setup helper
import dotenv from 'dotenv'
import { readFileSync, writeFileSync, existsSync } from 'fs'

// Load environment variables
dotenv.config()

console.log('🚀 Vercel Environment Setup Helper')
console.log('=====================================')

// Check if .env file exists
if (!existsSync('.env')) {
  console.log('❌ .env file not found!')
  console.log('💡 Creating .env file from env.example...')
  
  try {
    const envExample = readFileSync('env.example', 'utf8')
    writeFileSync('.env', envExample)
    console.log('✅ .env file created!')
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message)
    process.exit(1)
  }
}

// Read current .env file
const envContent = readFileSync('.env', 'utf8')
const lines = envContent.split('\n')

console.log('\n📋 Current Environment Variables:')
lines.forEach(line => {
  if (line.trim() && !line.startsWith('#')) {
    const [key, value] = line.split('=')
    if (key && value) {
      if (key.includes('SECRET') || key.includes('PASSWORD')) {
        console.log(`   ${key}=${'*'.repeat(value.length)}`)
      } else {
        console.log(`   ${key}=${value}`)
      }
    }
  }
})

console.log('\n🔧 Vercel Environment Variables Setup:')
console.log('=====================================')
console.log('1. Go to https://vercel.com/dashboard')
console.log('2. Select your project')
console.log('3. Go to Settings → Environment Variables')
console.log('4. Add these variables:')
console.log('')

// Generate environment variables for Vercel
const requiredVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'NODE_ENV',
  'JWT_EXPIRE',
  'JWT_REFRESH_EXPIRE',
  'FRONTEND_URL'
]

requiredVars.forEach(varName => {
  const value = process.env[varName]
  if (value) {
    console.log(`${varName}=${value}`)
  } else {
    console.log(`${varName}=your-${varName.toLowerCase().replace(/_/g, '-')}-here`)
  }
})

console.log('\n💡 Important Notes:')
console.log('   - Replace "your-*" values with actual values')
console.log('   - MONGODB_URI should be your Atlas connection string')
console.log('   - JWT_SECRET and JWT_REFRESH_SECRET should be strong, random strings')
console.log('   - After setting variables, redeploy your Vercel project')

console.log('\n🔍 MongoDB Atlas Connection String Format:')
console.log('   mongodb+srv://username:password@cluster.mongodb.net/nyaymitra?retryWrites=true&w=majority')
console.log('   Replace:')
console.log('     - username: your Atlas username')
console.log('     - password: your Atlas password')
console.log('     - cluster: your cluster name')
console.log('     - nyaymitra: your database name')

console.log('\n🛠️ Quick Fix Commands:')
console.log('   npm run diagnose    # Run full diagnostic')
console.log('   npm run test:db     # Test database connection')
console.log('   npm run fix:atlas   # Check Atlas configuration')

// Check if we're in a Vercel environment
if (process.env.VERCEL) {
  console.log('\n☁️ Detected Vercel environment!')
  console.log('   Make sure all environment variables are set in Vercel dashboard')
} else {
  console.log('\n🏠 Local environment detected')
  console.log('   Make sure .env file is properly configured')
}
