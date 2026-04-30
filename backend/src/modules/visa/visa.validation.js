const { body } = require('express-validator');

const createVisaRules = [
  body('applicationId').isMongoId().withMessage('Valid application ID is required'),
  body('studentId').isMongoId().withMessage('Valid student ID is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('visaType').isIn(['student_visa', 'study_permit', 'tier4', 'f1', 'tier_1', 'other']).withMessage('Invalid visa type'),
  body('assignedTo').optional().isMongoId(),
];

const updateVisaRules = [
  body('status').optional().isIn([
    'not_started', 'checklist_review', 'docs_collection', 'form_preparation',
    'biometrics', 'submitted', 'processing', 'approved', 'rejected',
    'expired', 'cancelled', 'withdrawn'
  ]),
  body('appointmentDate').optional().isISO8601(),
  body('submissionDate').optional().isISO8601(),
];

const addStageRules = [
  body('name').trim().notEmpty().withMessage('Stage name is required'),
  body('status').optional().isIn(['not_started', 'in_progress', 'completed', 'failed', 'skipped']),
  body('dueDate').optional().isISO8601(),
];

module.exports = { createVisaRules, updateVisaRules, addStageRules };
