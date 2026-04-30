const { body, query } = require('express-validator');

const createUniversityRules = [
  body('name').trim().notEmpty().withMessage('University name is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('city').optional().trim(),
  body('website').optional().isURL().withMessage('Invalid website URL'),
  body('contactEmail').optional().isEmail().withMessage('Invalid contact email'),
  body('ranking.world').optional().isInt({ min: 1 }),
  body('ranking.national').optional().isInt({ min: 1 }),
  body('ranking.source').optional().isIn(['QS', 'THE', 'ARWU', 'US_NEWS', 'Other']),
];

const updateUniversityRules = [
  body('name').optional().trim().notEmpty(),
  body('country').optional().trim().notEmpty(),
  body('website').optional().isURL(),
  body('contactEmail').optional().isEmail(),
];

const addProgramRules = [
  body('name').trim().notEmpty().withMessage('Program name is required'),
  body('degree').isIn(['certificate', 'diploma', 'associate', 'bachelor', 'master', 'phd', 'mba']).withMessage('Invalid degree type'),
  body('fieldOfStudy').trim().notEmpty().withMessage('Field of study is required'),
  body('durationMonths').isInt({ min: 1 }).withMessage('Duration must be at least 1 month'),
  body('tuitionFee').isNumeric({ min: 0 }).withMessage('Tuition fee must be a positive number'),
  body('currency').optional().isString().isLength({ min: 3, max: 3 }),
  body('intakes').isArray().withMessage('Intakes must be an array'),
  body('intakes.*.month').isInt({ min: 1, max: 12 }),
  body('intakes.*.year').isInt({ min: 2024 }),
];

module.exports = { createUniversityRules, updateUniversityRules, addProgramRules };
