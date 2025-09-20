/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const express = require('express')
const { body, validationResult } = require('express-validator')
const Lawyer = require('../models/Lawyer')
// const User = require('../models/User')
const Document = require('../models/Document')
const { protect, authorize, optionalAuth } = require('../middleware/auth')

const router = express.Router()

// @desc    Get all lawyers with filtering
// @route   GET /api/lawyers
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      district,
      practiceArea,
      language,
      verified,
      minRating = 0,
      search,
      sortBy = 'rating',
      sortOrder = 'desc',
    } = req.query

    const skip = (page - 1) * limit
    const query = { isActive: true }

    // Add filters
    if (district) {
      query.districts = { $in: [district] }
    }

    if (practiceArea) {
      query.practiceAreas = { $in: [practiceArea] }
    }

    if (language) {
      query.languages = { $in: [language] }
    }

    if (verified !== undefined) {
      query.isVerified = verified === 'true'
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) }
    }

    // Build sort object
    const sort = {}
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1

    let lawyers
    let total

    if (search) {
      // Text search
      lawyers = await Lawyer.find({
        ...query,
        $text: { $search: search },
      })
        .populate('user', 'name email phone')
        .sort({ score: { $meta: 'textScore' }, ...sort })
        .skip(skip)
        .limit(parseInt(limit))

      total = await Lawyer.countDocuments({
        ...query,
        $text: { $search: search },
      })
    } else {
      lawyers = await Lawyer.find(query)
        .populate('user', 'name email phone')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))

      total = await Lawyer.countDocuments(query)
    }

    res.json({
      success: true,
      data: {
        lawyers,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      },
    })
  } catch (error) {
    console.error('Get lawyers error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching lawyers',
    })
  }
})

// @desc    Get single lawyer
// @route   GET /api/lawyers/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const lawyer = await Lawyer.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate('user', 'name email phone district state language')

    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: 'Lawyer not found',
      })
    }

    res.json({
      success: true,
      data: lawyer,
    })
  } catch (error) {
    console.error('Get lawyer error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching lawyer',
    })
  }
})

// @desc    Register new lawyer
// @route   POST /api/lawyers/register
// @access  Private
router.post(
  '/register',
  [
    body('barCouncilNumber')
      .notEmpty()
      .withMessage('Bar Council Number is required'),
    body('practiceAreas')
      .isArray()
      .withMessage('Practice areas must be an array'),
    body('districts').isArray().withMessage('Districts must be an array'),
    body('languages').isArray().withMessage('Languages must be an array'),
    body('experience')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Experience must be a non-negative integer'),
    body('bio')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Bio cannot exceed 1000 characters'),
  ],
  protect,
  authorize('lawyer'),
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        })
      }

      const {
        barCouncilNumber,
        practiceAreas,
        districts,
        languages,
        experience = 0,
        bio,
        consultationFee = 0,
        specializations = [],
        education = [],
        achievements = [],
        socialLinks = {},
      } = req.body

      // Check if lawyer profile already exists
      const existingLawyer = await Lawyer.findOne({ user: req.user._id })
      if (existingLawyer) {
        return res.status(400).json({
          success: false,
          message: 'Lawyer profile already exists',
        })
      }

      // Check if bar council number is already taken
      const existingBarNumber = await Lawyer.findOne({ barCouncilNumber })
      if (existingBarNumber) {
        return res.status(400).json({
          success: false,
          message: 'Bar Council Number already exists',
        })
      }

      // Create lawyer profile
      const lawyer = new Lawyer({
        user: req.user._id,
        barCouncilNumber,
        practiceAreas,
        districts,
        languages,
        experience,
        bio,
        consultationFee,
        specializations,
        education,
        achievements,
        socialLinks,
      })

      await lawyer.save()

      res.status(201).json({
        success: true,
        data: lawyer,
      })
    } catch (error) {
      console.error('Register lawyer error:', error)
      res.status(500).json({
        success: false,
        message: 'Error registering lawyer',
      })
    }
  }
)

// @desc    Update lawyer profile
// @route   PUT /api/lawyers/me
// @access  Private
router.put(
  '/me',
  [
    body('practiceAreas')
      .optional()
      .isArray()
      .withMessage('Practice areas must be an array'),
    body('districts')
      .optional()
      .isArray()
      .withMessage('Districts must be an array'),
    body('languages')
      .optional()
      .isArray()
      .withMessage('Languages must be an array'),
    body('experience')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Experience must be a non-negative integer'),
    body('bio')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Bio cannot exceed 1000 characters'),
    body('consultationFee')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Consultation fee must be non-negative'),
  ],
  protect,
  authorize('lawyer'),
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        })
      }

      const lawyer = await Lawyer.findOne({ user: req.user._id })
      if (!lawyer) {
        return res.status(404).json({
          success: false,
          message: 'Lawyer profile not found',
        })
      }

      const updateData = { ...req.body }
      delete updateData.barCouncilNumber // Cannot change bar council number

      const updatedLawyer = await Lawyer.findByIdAndUpdate(
        lawyer._id,
        updateData,
        { new: true, runValidators: true }
      ).populate('user', 'name email phone')

      res.json({
        success: true,
        data: updatedLawyer,
      })
    } catch (error) {
      console.error('Update lawyer error:', error)
      res.status(500).json({
        success: false,
        message: 'Error updating lawyer profile',
      })
    }
  }
)

// @desc    Get case matches for a document
// @route   GET /api/lawyers/matches/:documentId
// @access  Private
router.get('/matches/:documentId', protect, async (req, res) => {
  try {
    const { documentId } = req.params

    // Get document details
    const document = await Document.findOne({
      _id: documentId,
      user: req.user._id,
    })

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      })
    }

    const extractedData = document.extractedData

    if (!extractedData) {
      return res.json({
        success: true,
        data: {
          matches: [],
          message: 'No extracted data available for matching',
        },
      })
    }

    // Find matching lawyers based on case type and location
    const query = {
      isVerified: true,
      isActive: true,
    }

    if (extractedData.caseType) {
      query.practiceAreas = { $in: [extractedData.caseType] }
    }

    if (req.user.district) {
      query.districts = { $in: [req.user.district] }
    }

    const lawyers = await Lawyer.find(query)
      .populate('user', 'name email phone')
      .sort({ rating: -1, experience: -1 })
      .limit(10)

    // Calculate match scores
    const matches = lawyers.map((lawyer) => {
      let matchScore = 0.4 // Base score
      const reasons = []

      if (
        extractedData.caseType &&
        lawyer.practiceAreas.includes(extractedData.caseType)
      ) {
        matchScore += 0.4
        reasons.push('Practice area match')
      }

      if (req.user.district && lawyer.districts.includes(req.user.district)) {
        matchScore += 0.2
        reasons.push('Location match')
      }

      return {
        ...lawyer.toObject(),
        matchScore: Math.min(matchScore, 1.0),
        reasons,
      }
    })

    // Sort by match score
    matches.sort((a, b) => b.matchScore - a.matchScore)

    res.json({
      success: true,
      data: {
        matches,
        document: document,
      },
    })
  } catch (error) {
    console.error('Get matches error:', error)
    res.status(500).json({
      success: false,
      message: 'Error finding matches',
    })
  }
})

// @desc    Get lawyer's cases
// @route   GET /api/lawyers/cases
// @access  Private
router.get('/cases', protect, authorize('lawyer'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    const skip = (page - 1) * limit

    const query = { lawyer: req.user._id }
    if (status) {
      query.status = status
    }

    const cases = await Document.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Document.countDocuments(query)

    res.json({
      success: true,
      data: {
        cases,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      },
    })
  } catch (error) {
    console.error('Get lawyer cases error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching cases',
    })
  }
})

// @desc    Update case status
// @route   PUT /api/lawyers/cases/:caseId/status
// @access  Private
router.put(
  '/cases/:caseId/status',
  [
    body('status')
      .isIn(['in_progress', 'completed', 'cancelled'])
      .withMessage('Invalid status'),
    body('notes').optional().isString().withMessage('Notes must be a string'),
  ],
  protect,
  authorize('lawyer'),
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        })
      }

      const { caseId } = req.params
      const { status, notes } = req.body

      const document = await Document.findOne({
        _id: caseId,
        lawyer: req.user._id,
      })

      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Case not found',
        })
      }

      document.status = status
      if (notes) {
        document.notes = notes
      }

      await document.save()

      res.json({
        success: true,
        data: document,
      })
    } catch (error) {
      console.error('Update case status error:', error)
      res.status(500).json({
        success: false,
        message: 'Error updating case status',
      })
    }
  }
)

// @desc    Get lawyer statistics
// @route   GET /api/lawyers/stats
// @access  Private
router.get('/stats', protect, authorize('lawyer'), async (req, res) => {
  try {
    const lawyer = await Lawyer.findOne({ user: req.user._id })

    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: 'Lawyer profile not found',
      })
    }

    const stats = {
      totalCases: lawyer.totalCases,
      successfulCases: lawyer.successfulCases,
      successRate: lawyer.successRate,
      averageRating: lawyer.rating,
      totalReviews: lawyer.totalReviews,
      responseTime: lawyer.responseTime,
      isVerified: lawyer.isVerified,
    }

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Get lawyer stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching lawyer statistics',
    })
  }
})

module.exports = router
