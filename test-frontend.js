// Test if authentication components are working
console.log('Testing frontend authentication...')

// Check if auth context is available
if (typeof window !== 'undefined') {
  console.log('✅ Browser environment detected')

  // Test API connection
  fetch('http://localhost:5000/api/health')
    .then((response) => response.json())
    .then((data) => {
      console.log('✅ Backend API is accessible:', data)
    })
    .catch((error) => {
      console.error('❌ Backend API connection failed:', error.message)
      console.log('Make sure the backend is running on port 5000')
    })
} else {
  console.log('❌ Not in browser environment')
}
