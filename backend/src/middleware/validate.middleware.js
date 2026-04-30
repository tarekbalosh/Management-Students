const { validationResult } = require('express-validator');
const { sendError }        = require('../utils/apiResponse');

/**
 * Runs after express-validator checks.
 * If errors exist, returns 422 with structured error list.
 * Otherwise calls next().
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field:   e.path,
      message: e.msg,
      value:   e.value,
    }));
    return sendError(res, {
      message:    'Validation failed',
      statusCode: 422,
      errors:     formatted,
    });
  }
  next();
};

module.exports = { validate };
