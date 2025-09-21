// src/middleware/dbRequired.js
import { isDBConnected } from '../config/database.js'

export default (req, res, next) => {
  if (!isDBConnected()) {
    return res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable: database connection error',
      code: 'SERVICE_UNAVAILABLE',
    })
  }
  next()
}
