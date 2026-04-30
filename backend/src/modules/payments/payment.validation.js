const { body } = require('express-validator');

const createPaymentRules = [
  body('studentId').isMongoId().withMessage('Valid student ID is required'),
  body('applicationId').optional().isMongoId(),
  body('type').isIn([
    'consultation_fee', 'service_fee', 'application_fee', 'university_fee',
    'visa_fee', 'courier_fee', 'translation_fee', 'other'
  ]).withMessage('Invalid payment type'),
  body('items').isArray({ min: 1 }).withMessage('At least one line item is required'),
  body('items.*.description').notEmpty().withMessage('Item description is required'),
  body('items.*.unitPrice').isNumeric({ min: 0 }).withMessage('Unit price must be a positive number'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('currency').optional().isString().isLength({ min: 3, max: 3 }),
];

const updatePaymentStatusRules = [
  body('status').isIn(['draft', 'unpaid', 'partially_paid', 'paid', 'overdue', 'cancelled', 'refunded']),
  body('paidAmount').optional().isNumeric({ min: 0 }),
  body('paymentMethod').optional().isIn(['cash', 'bank_transfer', 'card', 'cheque', 'online', 'other']),
  body('reference').optional().trim(),
];

module.exports = { createPaymentRules, updatePaymentStatusRules };
