// OCR processing utility with CommonJS/ES module compatibility

let tesseractModule = null
let ocrAvailable = null

async function loadTesseract() {
  if (ocrAvailable === false) {
    throw new Error('OCR module not available')
  }
  
  if (!tesseractModule) {
    try {
      tesseractModule = await import('tesseract.js')
      ocrAvailable = true
    } catch (error) {
      console.error('Failed to load tesseract.js:', error)
      ocrAvailable = false
      throw new Error('OCR module not available')
    }
  }
  return tesseractModule
}

export async function processDocumentWithOCR(filePath, language = 'en') {
  try {
    const tesseract = await loadTesseract()
    const { createWorker } = tesseract
    
    const worker = await createWorker()
    
    // Load and initialize with the specified language
    const lang = language === 'hi' ? 'hin' : 'eng'
    await worker.loadLanguage(lang)
    await worker.initialize(lang)

    // Process the document
    const {
      data: { text, confidence },
    } = await worker.recognize(filePath)

    // Clean up
    await worker.terminate()

    return {
      text,
      confidence,
      success: true,
    }
  } catch (error) {
    console.error('OCR processing failed:', error)
    return {
      text: '',
      confidence: 0,
      success: false,
      error: error.message,
    }
  }
}

export async function isOCRAvailable() {
  if (ocrAvailable !== null) {
    return ocrAvailable
  }
  
  try {
    await loadTesseract()
    return true
  } catch (error) {
    return false
  }
}
