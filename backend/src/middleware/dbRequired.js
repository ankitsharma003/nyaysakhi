// src/middleware/dbRequired.js
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { isDBConnected } = require('../config/database')

module.exports = (req, res, next) => {
  if (!isDBConnected()) {
    return res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable: database connection error',
      code: 'SERVICE_UNAVAILABLE',
    })
  }
  next()
}
