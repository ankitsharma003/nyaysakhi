/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require('mongoose')

// Test MongoDB connection
async function testConnection() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nyaymitra'

    // Hide credentials in logs
    console.log('Testing connection to:', uri.replace(/\/\/.*@/, '//***:***@'))

    // Connect with recommended options
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('✅ MongoDB connection successful!')

    // Test basic operations
    const testSchema = new mongoose.Schema({ name: String })
    const TestModel = mongoose.model('Test', testSchema)

    const testDoc = new TestModel({ name: 'Test Document' })
    await testDoc.save()
    console.log('✅ Database write test successful!')

    await TestModel.deleteOne({ name: 'Test Document' })
    console.log('✅ Database delete test successful!')

    await mongoose.disconnect()
    console.log('✅ MongoDB disconnection successful!')
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
    console.log('')
    console.log('🔧 To fix this:')
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
}

testConnection()
