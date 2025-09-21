import express from 'express'
import multer from 'multer'
import path from 'path'
import { TesseractWorker } from 'tesseract.js'
import { protect } from '../middleware/auth.js'
import { pool } from '../config/database.js'
import { extractStructuredData } from '../utils/documentProcessor.js'

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
      const worker = new TesseractWorker()
      await worker.loadLanguage(language === 'hi' ? 'hin' : 'eng')
      await worker.initialize(language === 'hi' ? 'hin' : 'eng')

      const {
        data: { text, confidence: ocrConfidence },
      } = await worker.recognize(filePath)

      // Extract structured data
      extractedData = extractStructuredData(text)
      confidence = ocrConfidence

      await worker.terminate()
    } catch (ocrError) {
      console.error('OCR Error:', ocrError)
      // Continue with empty extracted data if OCR fails
    }

    // Save document to database
    const result = await pool.query(
      `INSERT INTO documents (user_id, file_name, file_size, file_type, file_path, extracted_data, confidence, language, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        req.user.id,
        fileName,
        fileSize,
        fileType,
        filePath,
        JSON.stringify(extractedData),
        confidence,
        language,
        'completed',
      ]
    )

    res.status(201).json({
      success: true,
      data: {
        document: result.rows[0],
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
    const { page = 1, limit = 10, status } = req.query
    const offset = (page - 1) * limit

    let query = 'SELECT * FROM documents WHERE user_id = $1'
    const params = [req.user.id]

    if (status) {
      query += ' AND status = $2'
      params.push(status)
    }

    query +=
      ' ORDER BY created_at DESC LIMIT $' +
      (params.length + 1) +
      ' OFFSET $' +
      (params.length + 2)
    params.push(limit, offset)

    const result = await pool.query(query, params)

    res.json({
      success: true,
      data: result.rows,
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
    const result = await pool.query(
      'SELECT * FROM documents WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    )

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'Document not found' })
    }

    res.json({
      success: true,
      data: result.rows[0],
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
    const { extractedData } = req.body

    const result = await pool.query(
      'UPDATE documents SET extracted_data = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *',
      [JSON.stringify(extractedData), req.params.id, req.user.id]
    )

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'Document not found' })
    }

    res.json({
      success: true,
      data: result.rows[0],
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
    const result = await pool.query(
      'DELETE FROM documents WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    )

    if (result.rows.length === 0) {
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
