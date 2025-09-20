/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
// const jwt = require('jsonwebtoken')
// const User = require('../models/User')
const Session = require('../models/Session')

// Protect routes
const protect = async (req, res, next) => {
  try {
    let token

    // Check for token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token',
      })
    }

    try {
      // Verify token
      // const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Check if session exists and is active
      const session = await Session.findOne({
        token,
        isActive: true,
        expiresAt: { $gt: new Date() },
      }).populate(
        'user',
        'name email phone district state language role isActive isVerified'
      )

      if (!session || !session.user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired session',
        })
      }

      // Check if user is active
      if (!session.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated',
        })
      }

      // Update last activity
      session.lastActivity = new Date()
      await session.save()

      req.user = session.user
      req.session = session
      next()
    } catch (error) {
      console.error('Token verification error:', error)
      return res.status(401).json({
        success: false,
        message: 'Token is not valid',
      })
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
}

// Check if user has specific role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource',
      })
    }

    next()
  }
}

// Check if user is verified
const requireVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized',
    })
  }

  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Account verification required',
    })
  }

  next()
}

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    let token

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (token) {
      try {
        // const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const session = await Session.findOne({
          token,
          isActive: true,
          expiresAt: { $gt: new Date() },
        }).populate(
          'user',
          'name email phone district state language role isActive isVerified'
        )

        if (session && session.user && session.user.isActive) {
          session.lastActivity = new Date()
          await session.save()
          req.user = session.user
          req.session = session
        }
      } catch (error) {
        // Token is invalid, but we don't fail the request
        console.log('Optional auth token invalid:', error.message)
      }
    }

    next()
  } catch (error) {
    console.error('Optional auth middleware error:', error)
    next()
  }
}

module.exports = {
  protect,
  authorize,
  requireVerification,
  optionalAuth,
}
