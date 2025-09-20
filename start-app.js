/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const { spawn } = require('child_process')
const path = require('path')

console.log('🚀 Starting NyayMitra Application')
console.log('=================================')
console.log('')

// Start backend
console.log('Starting backend...')
const backend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true,
})

backend.on('error', (error) => {
  console.error('Backend error:', error)
})

// Start frontend after a short delay
setTimeout(() => {
  console.log('Starting frontend...')
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true,
  })

  frontend.on('error', (error) => {
    console.error('Frontend error:', error)
  })
}, 3000)

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down...')
  backend.kill()
  process.exit(0)
})
