/* src/middleware/dbRequired.js */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */

const { isDBConnected } = require('../config/database')

/**
 * Middleware to require DB connection for routes that need it.
 * If DB is not connected, returns 503 SERVICE_UNAVAILABLE.
 */
function dbRequired(req, res, next) {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Service temporarily unavailable: database connection error',
        code: 'SERVICE_UNAVAILABLE',
      })
    }
    return next()
  } catch (err) {
    console.error('dbRequired middleware error:', err)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    })
  }
}

module.exports = dbRequired
