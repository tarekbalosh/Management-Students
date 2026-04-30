const router     = require('express').Router();
const ctrl       = require('./university.controller');
const { protect, requireRole } = require('../../middleware/auth.middleware');

router.use(protect);

// University CRUD
router.get('/',     ctrl.list);
router.post('/',    requireRole('admin'), ctrl.create);
router.get('/:id',  ctrl.getOne);
router.patch('/:id', requireRole('admin'), ctrl.update);
router.delete('/:id', requireRole('admin'), ctrl.remove);

// Programs sub-resource
router.post('/:id/programs',               requireRole('admin'), ctrl.addProgram);
router.patch('/:id/programs/:programId',   requireRole('admin'), ctrl.updateProgram);
router.delete('/:id/programs/:programId',  requireRole('admin'), ctrl.deleteProgram);

module.exports = router;
