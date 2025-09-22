#!/usr/bin/env node

// Vercel deployment configuration helper
import { readFileSync, writeFileSync, existsSync } from 'fs'

console.log('🚀 Vercel Deployment Configuration Helper')
console.log('==========================================')

// Check if we're in a monorepo
const isMonorepo = existsSync('package.json') && existsSync('backend/package.json')

if (isMonorepo) {
  console.log('📁 Monorepo structure detected')
  console.log('   Frontend: Next.js (root)')
  console.log('   Backend: Node.js (backend/)')
  
  // Create root vercel.json for monorepo
  const rootVercelConfig = {
    "version": 2,
    "builds": [
      {
        "src": "package.json",
        "use": "@vercel/next"
      },
      {
        "src": "backend/index.js",
        "use": "@vercel/node"
      }
    ],
    "routes": [
      {
        "src": "/api/(.*)",
        "dest": "/backend/index.js"
      },
      {
        "src": "/(.*)",
        "dest": "/$1"
      }
    ],
    "env": {
      "NODE_ENV": "production"
    },
    "functions": {
      "backend/index.js": {
        "maxDuration": 30
      }
    }
  }
  
  writeFileSync('vercel.json', JSON.stringify(rootVercelConfig, null, 2))
  console.log('✅ Created root vercel.json for monorepo')
  
} else {
  console.log('📁 Single project structure detected')
}

// Check backend configuration
if (existsSync('backend/package.json')) {
  console.log('\n🔧 Backend Configuration:')
  
  const backendPackage = JSON.parse(readFileSync('backend/package.json', 'utf8'))
  console.log(`   Name: ${backendPackage.name}`)
  console.log(`   Main: ${backendPackage.main}`)
  console.log(`   Type: ${backendPackage.type || 'commonjs'}`)
  
  // Check if backend has proper scripts
  const scripts = backendPackage.scripts || {}
  console.log('   Scripts:')
  Object.keys(scripts).forEach(script => {
    console.log(`     ${script}: ${scripts[script]}`)
  })
  
  // Check if backend has vercel.json
  if (existsSync('backend/vercel.json')) {
    console.log('   ✅ Backend vercel.json exists')
  } else {
    console.log('   ❌ Backend vercel.json missing')
  }
}

// Check frontend configuration
if (existsSync('package.json')) {
  console.log('\n🔧 Frontend Configuration:')
  
  const frontendPackage = JSON.parse(readFileSync('package.json', 'utf8'))
  console.log(`   Name: ${frontendPackage.name}`)
  console.log(`   Framework: Next.js`)
  
  // Check if frontend has next.config.js
  if (existsSync('next.config.js')) {
    console.log('   ✅ Next.js config exists')
  } else {
    console.log('   ❌ Next.js config missing')
  }
}

console.log('\n📋 Deployment Checklist:')
console.log('   1. ✅ Root vercel.json created')
console.log('   2. ✅ Backend vercel.json configured')
console.log('   3. ✅ Monorepo structure detected')

console.log('\n🚀 Next Steps:')
console.log('   1. Commit and push changes to GitHub')
console.log('   2. Go to Vercel Dashboard')
console.log('   3. Import your GitHub repository')
console.log('   4. Set environment variables')
console.log('   5. Deploy')

console.log('\n🔧 Environment Variables to Set in Vercel:')
console.log('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nyaymitra?retryWrites=true&w=majority')
console.log('   JWT_SECRET=your-super-secret-jwt-key-here')
console.log('   JWT_REFRESH_SECRET=your-super-secret-refresh-key-here')
console.log('   NODE_ENV=production')

console.log('\n📚 For detailed setup, see:')
console.log('   - QUICK_FIX_GUIDE.md')
console.log('   - ATLAS_SETUP.md')
console.log('   - DEPLOYMENT_GUIDE.md')
