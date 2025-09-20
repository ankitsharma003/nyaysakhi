/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require('mongoose')

// Simple MongoDB connection test
async function testConnection() {
  try {
    console.log('🔧 Testing MongoDB connection...')

    // Try local MongoDB first
    const localUri = 'mongodb://localhost:27017/nyaymitra'
    console.log('Testing local MongoDB connection...')

    try {
      await mongoose.connect(localUri, {
        serverSelectionTimeoutMS: 5000, // 5 second timeout
      })
      console.log('✅ Local MongoDB connection successful!')

      // Test basic operations
      const testSchema = new mongoose.Schema({ name: String, test: Boolean })
      const TestModel = mongoose.model('ConnectionTest', testSchema)

      const testDoc = new TestModel({ name: 'Connection Test', test: true })
      await testDoc.save()
      console.log('✅ Database write test successful!')

      await TestModel.deleteOne({ name: 'Connection Test' })
      console.log('✅ Database delete test successful!')

      await mongoose.disconnect()
      console.log('✅ MongoDB disconnection successful!')
      console.log('')
      console.log(
        '🎉 Local MongoDB is working! You can use this for development.'
      )
      console.log('')
      console.log('📋 To use local MongoDB:')
      console.log(
        '1. Update backend/.env with: MONGODB_URI=mongodb://localhost:27017/nyaymitra'
      )
      console.log('2. Start your backend: npm start')
      console.log('3. Start your frontend: npm run dev')
    } catch (localError) {
      console.log('❌ Local MongoDB not available:', localError.message)
      console.log('')
      console.log('🔧 MongoDB Atlas Setup Required:')
      console.log('1. Go to https://www.mongodb.com/atlas')
      console.log('2. Create a free account and cluster')
      console.log('3. Create a database user (nyaymitra_user)')
      console.log(
        '4. Add your IP to network access (or 0.0.0.0/0 for development)'
      )
      console.log('5. Get your connection string from Atlas')
      console.log(
        '6. Replace YOUR_PASSWORD and xxxxx in backend/.env with your actual credentials'
      )
      console.log('')
      console.log('📖 See MONGODB_ATLAS_SETUP.md for detailed instructions')
    }
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
  }
}

testConnection()
