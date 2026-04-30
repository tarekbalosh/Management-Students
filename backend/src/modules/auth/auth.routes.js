const router = require('express').Router();
const ctrl = require('./auth.controller');
const authenticate = require('../../middleware/authenticate');
const { validate } = require('../../middleware/validate.middleware');
const { loginRules, registerRules, refreshRules } = require('./auth.validation');

router.post('/register', registerRules, validate, ctrl.register);
router.post('/login', loginRules, validate, ctrl.login);
router.post('/refresh', refreshRules, validate, ctrl.refresh);

// Protected routes
router.use(authenticate);
router.post('/logout', ctrl.logout);
router.get('/me', ctrl.me);

module.exports = router;
