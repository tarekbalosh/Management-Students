const service = require('./dashboard.service');
const { sendSuccess } = require('../../utils/apiResponse');

const getStats = async (req, res, next) => {
  try {
    const stats = await service.getDashboardStats(req.user);
    sendSuccess(res, { message: 'Dashboard statistics retrieved', data: stats });
  } catch (err) { next(err); }
};

module.exports = { getStats };
