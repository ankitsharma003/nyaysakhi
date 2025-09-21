#!/usr/bin/env node

import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, mkdirSync } from 'fs'

// Load environment variables
dotenv.config()

// Ensure uploads directory exists
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const uploadsDir = join(__dirname, 'uploads', 'documents')

if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true })
  console.log('📁 Created uploads directory:', uploadsDir)
}

// Import and start the server
import serverApp from './src/server.js'

const port = process.env.PORT || 5000

serverApp.listen(port, () => {
  console.log('🚀 NyayMitra Backend Server Started')
  console.log('=====================================')
  console.log(`📍 Server running on port ${port}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`📊 Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`)
  console.log('=====================================')
})
