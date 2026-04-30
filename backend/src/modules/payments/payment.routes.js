const router = require('express').Router();
const ctrl = require('./payment.controller');
const { protect, requireRole } = require('../../middleware/auth.middleware');
const { validate } = require('../../middleware/validate.middleware');
const { createPaymentRules, updatePaymentStatusRules } = require('./payment.validation');

router.use(protect);

router.get('/', ctrl.list);
router.get('/summary', requireRole('admin'), ctrl.summary);
router.get('/:id', ctrl.getOne);

router.post('/', requireRole('admin', 'employee'), createPaymentRules, validate, ctrl.create);
router.post('/:id/transaction', requireRole('admin', 'employee'), ctrl.recordTransaction);
router.patch('/:id/status', requireRole('admin', 'employee'), updatePaymentStatusRules, validate, ctrl.updateStatus);
router.get('/:id/pdf', ctrl.generatePDF);

module.exports = router;
