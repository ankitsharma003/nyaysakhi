import express from 'express'
import multer from 'multer'
import path from 'path'
import { protect } from '../middleware/auth.js'
import Document from '../models/Document.js'
import { extractStructuredData } from '../utils/documentProcessor.js'
import { processDocumentWithOCR } from '../utils/ocrProcessor.js'

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    )
  },
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/tiff',
  ]
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(
      new Error(
        'Invalid file type. Only PDF, JPG, PNG, and TIFF files are allowed.'
      ),
      false
    )
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter,
})

// @desc    Upload and process document
// @route   POST /api/documents/upload
// @access  Private
router.post('/upload', protect, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: 'No file uploaded' })
    }

    const { language = 'en' } = req.body
    const filePath = req.file.path
    const fileName = req.file.originalname
    const fileSize = req.file.size
    const fileType = req.file.mimetype

    // Process document with OCR
    let extractedData = null
    let confidence = 0

    try {
      const ocrResult = await processDocumentWithOCR(filePath, language)
      
      if (ocrResult.success) {
        // Extract structured data from OCR text
        extractedData = extractStructuredData(ocrResult.text)
        confidence = ocrResult.confidence
      } else {
        console.warn('OCR processing failed:', ocrResult.error)
        extractedData = extractStructuredData('')
        confidence = 0
      }
    } catch (ocrError) {
      console.error('OCR Error:', ocrError)
      // Continue with empty extracted data if OCR fails
      extractedData = extractStructuredData('')
      confidence = 0
    }

    // Save document to database
    const document = new Document({
      user: req.user._id,
      fileName: req.file.filename,
      originalName: fileName,
        fileSize,
      fileType: fileType.split('/')[1], // Extract file extension
        filePath,
      extractedData,
        confidence,
        language,
      status: 'completed',
    })

    await document.save()

    res.status(201).json({
      success: true,
      data: {
        document,
        extractedData,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    res
      .status(500)
      .json({ success: false, message: 'Error processing document' })
  }
})

// @desc    Get user's documents
// @route   GET /api/documents
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, language } = req.query
    const skip = (page - 1) * limit

    const query = { user: req.user._id }

    if (status) {
      query.status = status
    }
    
    if (category) {
      query.category = category
    }
    
    if (language) {
      query.language = language
    }

    const documents = await Document.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Document.countDocuments(query)

    res.json({
      success: true,
      data: {
        documents,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      },
    })
  } catch (error) {
    console.error('Get documents error:', error)
    res
      .status(500)
      .json({ success: false, message: 'Error fetching documents' })
  }
})

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!document) {
      return res
        .status(404)
        .json({ success: false, message: 'Document not found' })
    }

    res.json({
      success: true,
      data: document,
    })
  } catch (error) {
    console.error('Get document error:', error)
    res.status(500).json({ success: false, message: 'Error fetching document' })
  }
})

// @desc    Update document extracted data
// @route   PUT /api/documents/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { extractedData, tags, category } = req.body

    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!document) {
      return res
        .status(404)
        .json({ success: false, message: 'Document not found' })
    }

    if (extractedData) {
      document.extractedData = { ...document.extractedData, ...extractedData }
    }
    
    if (tags) {
      document.tags = tags
    }
    
    if (category) {
      document.category = category
    }

    await document.save()

    res.json({
      success: true,
      data: document,
    })
  } catch (error) {
    console.error('Update document error:', error)
    res.status(500).json({ success: false, message: 'Error updating document' })
  }
})

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!document) {
      return res
        .status(404)
        .json({ success: false, message: 'Document not found' })
    }

    res.json({
      success: true,
      message: 'Document deleted successfully',
    })
  } catch (error) {
    console.error('Delete document error:', error)
    res.status(500).json({ success: false, message: 'Error deleting document' })
  }
})

export default router
