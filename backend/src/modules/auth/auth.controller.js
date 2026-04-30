const authService = require('./auth.service');
const { sendSuccess } = require('../../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const data = await authService.register(req.body);
    sendSuccess(res, { message: 'Registration successful', data, statusCode: 201 });
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    sendSuccess(res, { message: 'Login successful', data });
  } catch (err) { next(err); }
};

const refresh = async (req, res, next) => {
  try {
    const tokens = await authService.refresh(req.body.refreshToken);
    sendSuccess(res, { message: 'Token refreshed', data: tokens });
  } catch (err) { next(err); }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.id, req.body.refreshToken);
    sendSuccess(res, { message: 'Logged out successfully' });
  } catch (err) { next(err); }
};

const me = async (req, res, next) => {
  try {
    // req.user is attached by authenticate middleware
    sendSuccess(res, { message: 'Profile retrieved', data: { user: req.user } });
  } catch (err) { next(err); }
};

module.exports = { register, login, refresh, logout, me };
