/**
 * Standardized API response wrapper.
 * All controllers should use these helpers to ensure consistent shape.
 */

const sendSuccess = (res, { message = 'Success', data = null, statusCode = 200, pagination = null } = {}) => {
  const body = { success: true, message, data };
  if (pagination) body.pagination = pagination;
  return res.status(statusCode).json(body);
};

const sendError = (res, { message = 'An error occurred', statusCode = 500, errors = null } = {}) => {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
};

module.exports = { sendSuccess, sendError };
