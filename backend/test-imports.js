#!/usr/bin/env node

// Test script to verify all imports are working correctly
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

console.log('🧪 Testing backend imports...')

try {
  // Test server import
  console.log('📦 Testing server import...')
  const serverApp = await import('./src/server.js')
  console.log('✅ Server import successful')

  // Test middleware imports
  console.log('📦 Testing middleware imports...')
  const errorHandler = await import('./src/middleware/errorHandler.js')
  const dbRequired = await import('./src/middleware/dbRequired.js')
  const auth = await import('./src/middleware/auth.js')
  console.log('✅ Middleware imports successful')

  // Test route imports
  console.log('📦 Testing route imports...')
  const authRoutes = await import('./src/routes/auth.js')
  const documentRoutes = await import('./src/routes/documents.js')
  const userRoutes = await import('./src/routes/users.js')
  const lawyerRoutes = await import('./src/routes/lawyers.js')
  const qaRoutes = await import('./src/routes/qa.js')
  console.log('✅ Route imports successful')

  // Test model imports
  console.log('📦 Testing model imports...')
  const User = await import('./src/models/User.js')
  const Lawyer = await import('./src/models/Lawyer.js')
  const Document = await import('./src/models/Document.js')
  const Session = await import('./src/models/Session.js')
  const FAQ = await import('./src/models/FAQ.js')
  console.log('✅ Model imports successful')

  // Test utility imports
  console.log('📦 Testing utility imports...')
  const documentProcessor = await import('./src/utils/documentProcessor.js')
  const ocrProcessor = await import('./src/utils/ocrProcessor.js')
  console.log('✅ Utility imports successful')

  // Test config imports
  console.log('📦 Testing config imports...')
  const database = await import('./src/config/database.js')
  console.log('✅ Config imports successful')

  console.log('🎉 All imports successful! Backend is ready to run.')

} catch (error) {
  console.error('❌ Import test failed:', error.message)
  console.error('Stack trace:', error.stack)
  process.exit(1)
}
