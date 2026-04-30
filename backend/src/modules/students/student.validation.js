const { body, query } = require('express-validator');

const createStudentRules = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().trim(),
  body('nationality').optional().trim(),
  body('educationLevel').optional().isIn(['high_school', 'bachelor', 'master', 'other']),
  body('status').optional().isIn(['lead', 'active', 'applied', 'enrolled', 'dropped', 'graduated'])
];

const updateStudentRules = [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('email').optional().isEmail().normalizeEmail(),
  body('status').optional().isIn(['lead', 'active', 'applied', 'enrolled', 'dropped', 'graduated'])
];

const listStudentsRules = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status').optional().isIn(['lead', 'active', 'applied', 'enrolled', 'dropped', 'graduated']),
];

module.exports = { createStudentRules, updateStudentRules, listStudentsRules };
