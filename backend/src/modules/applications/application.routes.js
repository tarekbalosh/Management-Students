const router = require('express').Router();
const ctrl   = require('./application.controller');
const { protect, requireRole } = require('../../middleware/auth.middleware');
const { validate }             = require('../../middleware/validate.middleware');
const { createRules, updateStatusRules, addNoteRules } = require('./application.validation');

router.use(protect);

router.get('/',    ctrl.list);
router.post('/',   requireRole('admin', 'employee'), createRules, validate, ctrl.create);
router.get('/:id', ctrl.getOne);
router.patch('/:id', requireRole('admin', 'employee'), ctrl.update);
router.patch('/:id/status', requireRole('admin', 'employee'), updateStatusRules, validate, ctrl.updateStatus);
router.post('/:id/notes',   requireRole('admin', 'employee'), addNoteRules, validate, ctrl.addNote);
router.delete('/:id',       requireRole('admin'), ctrl.remove);

module.exports = router;
