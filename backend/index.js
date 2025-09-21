// Backend entry point for Vercel deployment
import serverApp from './src/server.js'

// Get port from environment variable
const port = process.env.PORT || 5000

// Start the server only if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  // For local development, use the start script instead
  console.log('⚠️  For local development, please use: npm run dev or npm start')
  console.log('   This file is primarily for Vercel deployment')
  
  serverApp.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`)
  })
}

export default serverApp
