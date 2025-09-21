import express from 'express'
import { pool } from '../config/database.js'

const router = express.Router()

// @desc    Get FAQs with filtering
// @route   GET /api/qa/faqs
// @access  Public
router.get('/faqs', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      language = 'en',
      search,
    } = req.query

    const offset = (page - 1) * limit
    let query = `
      SELECT id, question, answer, category, language, tags, created_at
      FROM faqs 
      WHERE language = $1
    `
    const params = [language]
    let paramCount = 1

    // Add filters
    if (category) {
      paramCount++
      query += ` AND category = $${paramCount}`
      params.push(category)
    }

    if (search) {
      paramCount++
      query += ` AND (question ILIKE $${paramCount} OR answer ILIKE $${paramCount})`
      params.push(`%${search}%`)
    }

    // Add ordering and pagination
    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`
    params.push(limit, offset)

    const result = await pool.query(query, params)

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM faqs WHERE language = $1'
    const countParams = [language]
    let countParamCount = 1

    if (category) {
      countParamCount++
      countQuery += ` AND category = $${countParamCount}`
      countParams.push(category)
    }

    if (search) {
      countParamCount++
      countQuery += ` AND (question ILIKE $${countParamCount} OR answer ILIKE $${countParamCount})`
      countParams.push(`%${search}%`)
    }

    const countResult = await pool.query(countQuery, countParams)
    const total = parseInt(countResult.rows[0].count)

    res.json({
      success: true,
      data: {
        faqs: result.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      },
    })
  } catch (error) {
    console.error('Get FAQs error:', error)
    res.status(500).json({ success: false, message: 'Error fetching FAQs' })
  }
})

// @desc    Search FAQs
// @route   GET /api/qa/search
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q, language = 'en', limit = 5 } = req.query

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      })
    }

    const result = await pool.query(
      `SELECT id, question, answer, category, language, tags,
              ts_rank(to_tsvector('english', question || ' ' || answer), plainto_tsquery('english', $1)) as rank
       FROM faqs 
       WHERE language = $2 
         AND (to_tsvector('english', question || ' ' || answer) @@ plainto_tsquery('english', $1)
              OR question ILIKE $3 
              OR answer ILIKE $3)
       ORDER BY rank DESC, created_at DESC
       LIMIT $4`,
      [q, language, `%${q}%`, parseInt(limit)]
    )

    res.json({
      success: true,
      data: result.rows,
    })
  } catch (error) {
    console.error('Search FAQs error:', error)
    res.status(500).json({ success: false, message: 'Error searching FAQs' })
  }
})

// @desc    Get FAQ categories
// @route   GET /api/qa/categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const { language = 'en' } = req.query

    const result = await pool.query(
      `SELECT category, COUNT(*) as count
       FROM faqs 
       WHERE language = $1
       GROUP BY category
       ORDER BY count DESC`,
      [language]
    )

    res.json({
      success: true,
      data: result.rows,
    })
  } catch (error) {
    console.error('Get categories error:', error)
    res
      .status(500)
      .json({ success: false, message: 'Error fetching categories' })
  }
})

// @desc    Get single FAQ
// @route   GET /api/qa/faqs/:id
// @access  Public
router.get('/faqs/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM faqs WHERE id = $1', [
      req.params.id,
    ])

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'FAQ not found' })
    }

    res.json({
      success: true,
      data: result.rows[0],
    })
  } catch (error) {
    console.error('Get FAQ error:', error)
    res.status(500).json({ success: false, message: 'Error fetching FAQ' })
  }
})

// @desc    Submit a question
// @route   POST /api/qa/submit-question
// @access  Public
router.post('/submit-question', async (req, res) => {
  try {
    const { question, email, language = 'en' } = req.body

    // For now, just log the question. In a real app, you might:
    // 1. Store it in a database for admin review
    // 2. Send it to a support system
    // 3. Use AI to generate a response

    console.log('New question submitted:', {
      question,
      email,
      language,
      timestamp: new Date().toISOString(),
    })

    res.json({
      success: true,
      message: 'Question submitted successfully. We will get back to you soon.',
    })
  } catch (error) {
    console.error('Submit question error:', error)
    res
      .status(500)
      .json({ success: false, message: 'Error submitting question' })
  }
})

export default router
