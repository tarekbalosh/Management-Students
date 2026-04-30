const router = require('express').Router();
const ctrl = require('./visa.controller');
const { protect, requireRole } = require('../../middleware/auth.middleware');

router.use(protect);

router.get('/stats', requireRole('admin', 'employee'), ctrl.getStats);
router.get('/:applicationId', ctrl.getByApplicationId);
router.post('/', requireRole('admin', 'employee'), ctrl.create);
router.patch('/:id/stage', requireRole('admin', 'employee'), ctrl.updateStage);
router.post('/:id/reminder', requireRole('admin', 'employee'), ctrl.addReminder);

module.exports = router;

