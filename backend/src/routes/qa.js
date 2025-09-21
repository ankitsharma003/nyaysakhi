import express from 'express'
import FAQ from '../models/FAQ.js'

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

    const skip = (page - 1) * limit
    const query = { language, isActive: true }

    // Add filters
    if (category) {
      query.category = category
    }

    let faqs
    let total

    if (search) {
      // Text search
      faqs = await FAQ.find({
        ...query,
        $text: { $search: search },
      })
        .sort({ score: { $meta: 'textScore' }, order: 1 })
        .skip(skip)
        .limit(parseInt(limit))

      total = await FAQ.countDocuments({
        ...query,
        $text: { $search: search },
      })
    } else {
      faqs = await FAQ.find(query)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))

      total = await FAQ.countDocuments(query)
    }

    res.json({
      success: true,
      data: {
        faqs,
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

    const faqs = await FAQ.find({
      $text: { $search: q },
      language,
      isActive: true,
    })
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit))

    res.json({
      success: true,
      data: faqs,
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

    const categories = await FAQ.aggregate([
      { $match: { language, isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    res.json({
      success: true,
      data: categories,
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
    const faq = await FAQ.findById(req.params.id)

    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' })
    }

    res.json({
      success: true,
      data: faq,
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
