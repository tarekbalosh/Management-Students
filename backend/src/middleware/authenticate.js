const { verifyAccessToken } = require('../modules/auth/token.service');
const { sendError } = require('../utils/apiResponse');
const User = require('../models/User');

/**
 * Middleware to authenticate requests using JWT.
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, { message: 'Authentication required', statusCode: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id).select('_id role email isActive');
    if (!user || !user.isActive) {
      return sendError(res, { message: 'User not found or inactive', statusCode: 401 });
    }

    req.user = { id: user._id, role: user.role, email: user.email };
    next();
  } catch (err) {
    return sendError(res, { message: 'Invalid or expired token', statusCode: 401 });
  }
};

module.exports = authenticate;
