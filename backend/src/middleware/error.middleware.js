const logger = require('../utils/logger');

/**
 * Global error handler — must be registered LAST in Express middleware chain.
 */
const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message    = err.message    || 'Internal Server Error';

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 422;
    const errors = Object.values(err.errors).map((e) => ({
      field:   e.path,
      message: e.message,
    }));
    return res.status(statusCode).json({ success: false, message: 'Validation failed', errors });
  }

  // Mongoose Duplicate Key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern)[0];
    message = `A record with this ${field} already exists`;
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for field: ${err.path}`;
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError')  { statusCode = 401; message = 'Invalid token'; }
  if (err.name === 'TokenExpiredError')  { statusCode = 401; message = 'Token expired'; }

  // Multer Errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    const maxMB = (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 10);
    message = `File too large. Maximum allowed size is ${maxMB}MB`;
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    message = 'Unexpected file field in upload';
  }

  if (statusCode === 500) {
    logger.error(`[${req.method}] ${req.originalUrl} → ${err.stack || err.message}`);
  }

  res.status(statusCode).json({ success: false, message });
};

/**
 * 404 handler for unmatched routes.
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = { errorHandler, notFoundHandler };
