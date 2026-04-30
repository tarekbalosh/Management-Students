const { body } = require('express-validator');

const createRules = [
  body('studentId').isMongoId().withMessage('Valid student ID required'),
  body('universityId').isMongoId().withMessage('Valid university ID required'),
  body('programId').isMongoId().withMessage('Valid program ID required'),
  body('intake.month').isInt({ min: 1, max: 12 }).withMessage('Intake month 1-12'),
  body('intake.year').isInt({ min: 2020 }).withMessage('Valid intake year required'),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('assignedTo').optional().isMongoId(),
];

const updateStatusRules = [
  body('status').isIn([
    'draft', 'documents_pending', 'submitted', 'under_review',
    'conditional_offer', 'unconditional_offer', 'accepted', 'rejected',
    'waitlisted', 'enrolled', 'cancelled', 'withdrawn',
  ]).withMessage('Invalid status value'),
  body('note').optional().trim(),
];

const addNoteRules = [
  body('text').trim().notEmpty().withMessage('Note text is required'),
  body('isPrivate').optional().isBoolean(),
];

module.exports = { createRules, updateStatusRules, addNoteRules };
