const { verifyAccessToken } = require('../utils/token');
const { sendError }         = require('../utils/apiResponse');
const User                  = require('../models/User');

/**
 * Verifies JWT from Authorization: Bearer <token>
 * Attaches req.user = { id, role, email }
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, { message: 'Not authorized — no token', statusCode: 401 });
    }

    const token   = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    // Check user still exists and is active
    const user = await User.findById(decoded.id).select('_id role email isActive');
    if (!user || !user.isActive) {
      return sendError(res, { message: 'User no longer exists or is inactive', statusCode: 401 });
    }

    req.user = { id: user._id, role: user.role, email: user.email };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, { message: 'Token expired', statusCode: 401 });
    }
    return sendError(res, { message: 'Invalid token', statusCode: 401 });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return sendError(res, {
      message: `Access denied. Required role: ${roles.join(' or ')}`,
      statusCode: 403,
    });
  }
  next();
};

const studentProtect = async (req, res, next) => {
  const Student = require('../models/Student');
  try {
    if (req.user.role !== 'student') {
      return sendError(res, { message: 'Access denied. Student portal only.', statusCode: 403 });
    }

    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return sendError(res, { message: 'Student record not found for this user.', statusCode: 404 });
    }

    req.studentId = student._id;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { protect, requireRole, studentProtect };
