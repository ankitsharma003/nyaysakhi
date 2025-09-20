/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const express = require('express')
const { body, validationResult } = require('express-validator')
const User = require('../models/User')
const Lawyer = require('../models/Lawyer')
const { protect } = require('../middleware/auth')

const router = express.Router()

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    // If user is a lawyer, get lawyer profile
    let lawyerProfile = null
    if (user.role === 'lawyer') {
      lawyerProfile = await Lawyer.findOne({ user: user._id })
    }

    res.json({
      success: true,
      data: {
        user,
        lawyerProfile,
      },
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
    })
  }
})

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
router.put(
  '/me',
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('phone')
      .optional()
      .isMobilePhone()
      .withMessage('Please provide a valid phone number'),
    body('district')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('District name too long'),
    body('state')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('State name too long'),
    body('language')
      .optional()
      .isIn(['en', 'hi'])
      .withMessage('Language must be either en or hi'),
  ],
  protect,
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

      const { name, phone, district, state, language } = req.body
      const updateData = {}

      if (name) updateData.name = name
      if (phone) updateData.phone = phone
      if (district) updateData.district = district
      if (state) updateData.state = state
      if (language) updateData.language = language

      const user = await User.findByIdAndUpdate(req.user._id, updateData, {
        new: true,
        runValidators: true,
      })

      res.json({
        success: true,
        data: user,
      })
    } catch (error) {
      console.error('Update user error:', error)
      res.status(500).json({
        success: false,
        message: 'Error updating user',
      })
    }
  }
)

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
router.put(
  '/change-password',
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters'),
  ],
  protect,
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

      const { currentPassword, newPassword } = req.body

      // Get user with password
      const user = await User.findById(req.user._id).select('+password')

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        })
      }

      // Check current password
      const isMatch = await user.comparePassword(currentPassword)

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect',
        })
      }

      // Update password
      user.password = newPassword
      await user.save()

      res.json({
        success: true,
        message: 'Password updated successfully',
      })
    } catch (error) {
      console.error('Change password error:', error)
      res.status(500).json({
        success: false,
        message: 'Error changing password',
      })
    }
  }
)

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    let stats = {
      totalDocuments: 0,
      totalCases: 0,
      successfulCases: 0,
      averageRating: 0,
    }

    if (user.role === 'lawyer') {
      const lawyer = await Lawyer.findOne({ user: user._id })
      if (lawyer) {
        stats = {
          totalDocuments: lawyer.totalCases || 0,
          totalCases: lawyer.totalCases || 0,
          successfulCases: lawyer.successfulCases || 0,
          averageRating: lawyer.rating || 0,
          successRate: lawyer.successRate || 0,
        }
      }
    }

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Get user stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
    })
  }
})

// @desc    Deactivate account
// @route   DELETE /api/users/me
// @access  Private
router.delete(
  '/me',
  [
    body('password')
      .notEmpty()
      .withMessage('Password is required for account deletion'),
  ],
  protect,
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

      const { password } = req.body

      // Get user with password
      const user = await User.findById(req.user._id).select('+password')

      // Check password
      const isMatch = await user.comparePassword(password)

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Password is incorrect',
        })
      }

      // Deactivate account instead of deleting
      user.isActive = false
      await user.save()

      // Revoke all sessions
      const Session = require('../models/Session')
      await Session.revokeAllForUser(user._id)

      res.json({
        success: true,
        message: 'Account deactivated successfully',
      })
    } catch (error) {
      console.error('Deactivate account error:', error)
      res.status(500).json({
        success: false,
        message: 'Error deactivating account',
      })
    }
  }
)

module.exports = router
