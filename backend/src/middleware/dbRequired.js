/* eslint-disable @typescript-eslint/no-var-requires */
/* src/middleware/dbRequired.js */
const { isDBConnected } = require('../config/database')

module.exports = function dbRequired(req, res, next) {
  if (isDBConnected()) {
    return next()
  }
  // Return clear 503 with JSON and a code
  return res.status(503).json({
    success: false,
    message: 'Service temporarily unavailable: database connection error',
    code: 'SERVICE_UNAVAILABLE',
  })
}
