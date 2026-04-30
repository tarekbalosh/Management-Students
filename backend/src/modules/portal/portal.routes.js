const router = require('express').Router();
const ctrl = require('./portal.controller');
const { protect, studentProtect } = require('../../middleware/auth.middleware');

router.use(protect);
router.use(studentProtect);

router.get('/dashboard', ctrl.getDashboard);
router.get('/documents', ctrl.getDocuments);
router.get('/payments', ctrl.getPayments);
router.get('/visa', ctrl.getVisa);

module.exports = router;
