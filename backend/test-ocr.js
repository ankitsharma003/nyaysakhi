#!/usr/bin/env node

// Simple test script to verify OCR functionality
import { processDocumentWithOCR, isOCRAvailable } from './src/utils/ocrProcessor.js'

async function testOCR() {
  console.log('🧪 Testing OCR functionality...')
  
  try {
    // Check if OCR is available
    const available = await isOCRAvailable()
    console.log('OCR Available:', available)
    
    if (!available) {
      console.log('❌ OCR is not available. This might be due to:')
      console.log('   - tesseract.js not installed properly')
      console.log('   - Missing language packs')
      console.log('   - Module compatibility issues')
      return
    }
    
    console.log('✅ OCR module loaded successfully!')
    console.log('📝 Note: To test actual OCR processing, you need to provide a valid image file path.')
    
  } catch (error) {
    console.error('❌ OCR test failed:', error.message)
  }
}

// Run the test
testOCR().catch(console.error)
