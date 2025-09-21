/* src/middleware/errorHandler.js */
const errorHandler = (err, req, res) => {
  let error = { ...err }
  error.message = err.message

  console.error('Error middleware caught:', err)

  if (err.name === 'CastError') {
    error = { message: 'Resource not found', statusCode: 404 }
  }
  if (err.code === 11000) {
    error = { message: 'Duplicate field value entered', statusCode: 400 }
  }
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((v) => v.message)
    error = { message, statusCode: 400 }
  }
  if (err.name === 'JsonWebTokenError') {
    error = { message: 'Invalid token', statusCode: 401 }
  }
  if (err.name === 'TokenExpiredError') {
    error = { message: 'Token expired', statusCode: 401 }
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

const notFound = (req, res, next) => {
  const err = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)
  next(err)
}

module.exports = { errorHandler, notFound }
