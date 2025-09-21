/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const express = require('express')
// const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const speakeasy = require('speakeasy')
const QRCode = require('qrcode')
const crypto = require('crypto')
const { body, validationResult } = require('express-validator')
const User = require('../models/User')
const Session = require('../models/Session')
const Lawyer = require('../models/Lawyer')
const { protect } = require('../middleware/auth')
const { isConnected } = require('../config/database')

const router = express.Router()

/**
 * Helper: returns 503 if DB is not connected
 */
function requireDb(req, res) {
  if (!isConnected()) {
    res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable: database connection error',
      code: 'SERVICE_UNAVAILABLE',
    })
    return false
  }
  return true
}

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  })

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  })

  return { accessToken, refreshToken }
}

// Create session
const createSession = async (user, deviceInfo, ipAddress, userAgent) => {
  const { accessToken, refreshToken } = generateTokens(user._id)

  const session = new Session({
    user: user._id,
    token: accessToken,
    refreshToken,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    deviceInfo,
    ipAddress,
    userAgent,
    isActive: true,
  })

  await session.save()
  return session
}

/**
 * Safe model-email lookup that falls back to findOne if findByEmail static
 * method doesn't exist on the model.
 */
async function findUserByEmailModel(email, selectFields = '') {
  try {
    if (typeof User.findByEmail === 'function') {
      // some implementations may return a Query — await resolves it
      return await User.findByEmail(email).select(selectFields)
    }
    return await User.findOne({ email }).select(selectFields)
  } catch (err) {
    // rethrow to be handled by caller
    throw err
  }
}

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post(
  '/register',
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('phone')
      .optional()
      .isMobilePhone()
      .withMessage('Please provide a valid phone number'),
    body('role')
      .optional()
      .isIn(['user', 'lawyer'])
      .withMessage('Role must be either user or lawyer'),
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
  async (req, res) => {
    if (!requireDb(req, res)) return

    try {
      // Validation
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        })
      }

      const {
        name,
        email,
        password,
        phone,
        role = 'user',
        district,
        state,
        language = 'en',
      } = req.body

      // Check existing user (safe lookup)
      const existingUser = await findUserByEmailModel(email)
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email',
        })
      }

      // Create user
      const user = new User({
        name,
        email,
        password,
        phone,
        role,
        district,
        state,
        language,
      })

      await user.save()

      // If role is lawyer, create lawyer profile
      if (role === 'lawyer') {
        const lawyer = new Lawyer({
          user: user._id,
          barCouncilNumber: req.body.barCouncilNumber || 'PENDING',
          practiceAreas: req.body.practiceAreas || [],
          districts: req.body.districts || (district ? [district] : []),
          languages: req.body.languages || [language],
          bio: req.body.bio || '',
        })
        await lawyer.save()
      }

      // Generate email verification token (store on user)
      const emailVerificationToken = crypto.randomBytes(32).toString('hex')
      user.emailVerificationToken = emailVerificationToken
      user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      await user.save()

      // TODO: send verification email via your mailer

      res.status(201).json({
        success: true,
        message:
          'User registered successfully. Please check your email for verification.',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
          },
        },
      })
    } catch (error) {
      console.error('Register error:', error)
      res.status(500).json({
        success: false,
        message: 'Error creating user',
      })
    }
  }
)

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    if (!requireDb(req, res)) return

    try {
      // Validation
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        })
      }

      const { email, password } = req.body

      // Find user and include password for comparison
      const user = await findUserByEmailModel(
        email,
        '+password +twoFactorEnabled +twoFactorSecret +isLocked'
      )
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        })
      }

      // Check if account is locked (field name may vary)
      if (user.isLocked) {
        return res.status(423).json({
          success: false,
          message:
            'Account is temporarily locked due to too many failed login attempts',
        })
      }

      // Compare password (expects instance method comparePassword)
      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        // Increment login attempts (if implemented)
        if (typeof user.incLoginAttempts === 'function') {
          try {
            await user.incLoginAttempts()
          } catch (e) {
            console.warn('incLoginAttempts failed:', e)
          }
        }
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        })
      }

      // Reset login attempts on successful login if method exists
      if (typeof user.resetLoginAttempts === 'function') {
        try {
          await user.resetLoginAttempts()
        } catch (e) {
          console.warn('resetLoginAttempts failed:', e)
        }
      }

      // Update last login
      user.lastLogin = new Date()
      await user.save()

      // Device info
      const ua = req.headers['user-agent'] || ''
      const deviceInfo = {
        type: ua.includes('Mobile')
          ? 'mobile'
          : ua.includes('Tablet')
            ? 'tablet'
            : 'desktop',
        os: ua.split(' ')[0] || 'Unknown',
        browser: ua.split(' ')[1] || 'Unknown',
      }

      // Create session
      const session = await createSession(user, deviceInfo, req.ip, ua)

      // If 2FA enabled: ask for 2FA (do not return tokens yet)
      if (user.twoFactorEnabled) {
        return res.json({
          success: true,
          requiresTwoFactor: true,
          message: 'Two-factor authentication required',
        })
      }

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            twoFactorEnabled: user.twoFactorEnabled,
            lastLogin: user.lastLogin,
          },
          session: {
            id: session._id,
            token: session.token,
            refreshToken: session.refreshToken,
            expiresAt: session.expiresAt,
          },
        },
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({
        success: false,
        message: 'Error logging in',
      })
    }
  }
)

// @desc    Verify 2FA
// @route   POST /api/auth/verify-2fa
// @access  Public
router.post(
  '/verify-2fa',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('code')
      .isLength({ min: 6, max: 6 })
      .withMessage('Code must be 6 digits'),
  ],
  async (req, res) => {
    if (!requireDb(req, res)) return

    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        })
      }

      const { email, code } = req.body

      const user = await findUserByEmailModel(
        email,
        '+twoFactorSecret +twoFactorEnabled +password'
      )
      if (!user || !user.twoFactorEnabled) {
        return res.status(400).json({
          success: false,
          message: '2FA not enabled for this account',
        })
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: code,
        window: 2,
      })

      if (!verified) {
        return res.status(400).json({
          success: false,
          message: 'Invalid verification code',
        })
      }

      // Update last login
      user.lastLogin = new Date()
      await user.save()

      // Device info
      const ua = req.headers['user-agent'] || ''
      const deviceInfo = {
        type: ua.includes('Mobile')
          ? 'mobile'
          : ua.includes('Tablet')
            ? 'tablet'
            : 'desktop',
        os: ua.split(' ')[0] || 'Unknown',
        browser: ua.split(' ')[1] || 'Unknown',
      }

      // Create session
      const session = await createSession(user, deviceInfo, req.ip, ua)

      res.json({
        success: true,
        message: '2FA verification successful',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            twoFactorEnabled: user.twoFactorEnabled,
            lastLogin: user.lastLogin,
          },
          session: {
            id: session._id,
            token: session.token,
            refreshToken: session.refreshToken,
            expiresAt: session.expiresAt,
          },
        },
      })
    } catch (error) {
      console.error('2FA verification error:', error)
      res.status(500).json({
        success: false,
        message: 'Error verifying 2FA',
      })
    }
  }
)

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  // protect middleware should already ensure DB-backed session & user; still check DB in case
  if (!requireDb(req, res)) return

  try {
    res.json({
      success: true,
      data: {
        user: req.user,
        session: req.session,
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

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
router.post('/refresh', async (req, res) => {
  if (!requireDb(req, res)) return

  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required',
      })
    }

    const session = await Session.findOne({
      refreshToken,
      isActive: true,
      expiresAt: { $gt: new Date() },
    }).populate('user')

    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      })
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      session.user._id
    )

    session.token = accessToken
    session.refreshToken = newRefreshToken
    session.expiresAt = new Date(Date.now() + 15 * 60 * 1000)
    await session.save()

    res.json({
      success: true,
      data: {
        token: accessToken,
        refreshToken: newRefreshToken,
        expiresAt: session.expiresAt,
      },
    })
  } catch (error) {
    console.error('Refresh token error:', error)
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
    })
  }
})

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, async (req, res) => {
  if (!requireDb(req, res)) return

  try {
    // Deactivate current session
    if (req.session) {
      req.session.isActive = false
      await req.session.save()
    }

    res.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      message: 'Error logging out',
    })
  }
})

// @desc    Logout from all devices
// @route   POST /api/auth/logout-all
// @access  Private
router.post('/logout-all', protect, async (req, res) => {
  if (!requireDb(req, res)) return

  try {
    // Deactivate all sessions for user
    if (req.user && typeof Session.revokeAllForUser === 'function') {
      await Session.revokeAllForUser(req.user._id)
    } else {
      // Fallback: update many
      await Session.updateMany({ user: req.user._id }, { isActive: false })
    }

    res.json({
      success: true,
      message: 'Logged out from all devices successfully',
    })
  } catch (error) {
    console.error('Logout all error:', error)
    res.status(500).json({
      success: false,
      message: 'Error logging out from all devices',
    })
  }
})

// @desc    Get active sessions
// @route   GET /api/auth/sessions
// @access  Private
router.get('/sessions', protect, async (req, res) => {
  if (!requireDb(req, res)) return

  try {
    let sessions = []
    if (typeof Session.findActiveByUser === 'function') {
      sessions = await Session.findActiveByUser(req.user._id)
    } else {
      sessions = await Session.find({ user: req.user._id, isActive: true })
    }

    res.json({
      success: true,
      data: sessions,
    })
  } catch (error) {
    console.error('Get sessions error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching sessions',
    })
  }
})

// @desc    Revoke session
// @route   DELETE /api/auth/sessions/:sessionId
// @access  Private
router.delete('/sessions/:sessionId', protect, async (req, res) => {
  if (!requireDb(req, res)) return

  try {
    const session = await Session.findOne({
      _id: req.params.sessionId,
      user: req.user._id,
    })

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      })
    }

    if (typeof session.revoke === 'function') {
      await session.revoke()
    } else {
      session.isActive = false
      await session.save()
    }

    res.json({
      success: true,
      message: 'Session revoked successfully',
    })
  } catch (error) {
    console.error('Revoke session error:', error)
    res.status(500).json({
      success: false,
      message: 'Error revoking session',
    })
  }
})

// @desc    Enable 2FA
// @route   POST /api/auth/enable-2fa
// @access  Private
router.post('/enable-2fa', protect, async (req, res) => {
  if (!requireDb(req, res)) return

  try {
    const user = await User.findById(req.user._id).select('+twoFactorSecret')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: '2FA is already enabled',
      })
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `NyayMitra (${user.email})`,
      issuer: 'NyayMitra',
    })

    user.twoFactorSecret = secret.base32
    await user.save()

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url)

    res.json({
      success: true,
      data: {
        secret: secret.base32,
        qrCode: qrCodeUrl,
        manualEntryKey: secret.base32,
      },
    })
  } catch (error) {
    console.error('Enable 2FA error:', error)
    res.status(500).json({
      success: false,
      message: 'Error enabling 2FA',
    })
  }
})

// @desc    Verify and enable 2FA
// @route   POST /api/auth/verify-enable-2fa
// @access  Private
router.post(
  '/verify-enable-2fa',
  [
    body('code')
      .isLength({ min: 6, max: 6 })
      .withMessage('Code must be 6 digits'),
  ],
  protect,
  async (req, res) => {
    if (!requireDb(req, res)) return

    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        })
      }

      const { code } = req.body
      const user = await User.findById(req.user._id).select('+twoFactorSecret')

      if (user.twoFactorEnabled) {
        return res.status(400).json({
          success: false,
          message: '2FA is already enabled',
        })
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: code,
        window: 2,
      })

      if (!verified) {
        return res.status(400).json({
          success: false,
          message: 'Invalid verification code',
        })
      }

      user.twoFactorEnabled = true
      await user.save()

      res.json({
        success: true,
        message: '2FA enabled successfully',
      })
    } catch (error) {
      console.error('Verify enable 2FA error:', error)
      res.status(500).json({
        success: false,
        message: 'Error enabling 2FA',
      })
    }
  }
)

// @desc    Disable 2FA
// @route   POST /api/auth/disable-2fa
// @access  Private
router.post(
  '/disable-2fa',
  [body('password').notEmpty().withMessage('Password is required')],
  protect,
  async (req, res) => {
    if (!requireDb(req, res)) return

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
      const user = await User.findById(req.user._id).select('+password')

      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Invalid password',
        })
      }

      user.twoFactorEnabled = false
      user.twoFactorSecret = undefined
      await user.save()

      res.json({
        success: true,
        message: '2FA disabled successfully',
      })
    } catch (error) {
      console.error('Disable 2FA error:', error)
      res.status(500).json({
        success: false,
        message: 'Error disabling 2FA',
      })
    }
  }
)

module.exports = router
