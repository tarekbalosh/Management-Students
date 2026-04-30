const { sendError } = require('../utils/apiResponse');

/**
 * Middleware to authorize users based on roles.
 * @param {...string} roles - Allowed roles.
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return sendError(res, {
      message: 'You do not have permission to perform this action',
      statusCode: 403,
    });
  }
  next();
};

module.exports = authorize;
