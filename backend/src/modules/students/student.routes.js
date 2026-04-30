const router     = require('express').Router();
const controller = require('./student.controller');
const { protect, requireRole } = require('../../middleware/auth.middleware');
const { validate }             = require('../../middleware/validate.middleware');
const { createStudentRules, updateStudentRules, listStudentsRules } = require('./student.validation');

router.use(protect);

router.get('/',    listStudentsRules,  validate, controller.list);
router.post('/',   requireRole('admin', 'employee'), createStudentRules, validate, controller.create);
router.get('/:id', controller.getOne);
router.patch('/:id', requireRole('admin', 'employee'), updateStudentRules, validate, controller.update);
router.delete('/:id', requireRole('admin'), controller.remove);

module.exports = router;
