const router = require('express').Router();
const ctrl = require('./dashboard.controller');
const { protect } = require('../../middleware/auth.middleware');

router.get('/stats', protect, ctrl.getStats);

module.exports = router;
