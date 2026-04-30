const router = require('express').Router();
const ctrl = require('./notification.controller');
const { protect } = require('../../middleware/auth.middleware');

router.use(protect);

router.get('/', ctrl.list);
router.get('/unread-count', ctrl.getUnreadCount);
router.patch('/read-all', ctrl.readAll);
router.patch('/:id/read', ctrl.readOne);
router.delete('/:id', ctrl.remove);

module.exports = router;
