// Backend entry point for Vercel deployment
import serverApp from './src/server.js'

// Get port from environment variable
const port = process.env.PORT || 5000

// Start the server
if (import.meta.url === `file://${process.argv[1]}`) {
  serverApp.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`)
  })
}

export default serverApp
