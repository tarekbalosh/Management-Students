const { body, query } = require('express-validator');

const uploadRules = [
  body('studentId').isMongoId().withMessage('Valid student ID is required'),
  body('applicationId').optional().isMongoId().withMessage('Invalid application ID'),
  body('type').notEmpty().withMessage('Document type is required'),
  body('label').optional().trim(),
];

const verifyRules = [
  body('status').isIn(['verified', 'rejected']).withMessage('Status must be verified or rejected'),
  body('reason').optional().trim(),
];

module.exports = { uploadRules, verifyRules };
