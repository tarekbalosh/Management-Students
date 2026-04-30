const service = require('./portal.service');
const { sendSuccess } = require('../../utils/apiResponse');

const getDashboard = async (req, res, next) => {
  try {
    const data = await service.getDashboardData(req.studentId);
    sendSuccess(res, { message: 'Portal dashboard data retrieved', data });
  } catch (err) { next(err); }
};

const getDocuments = async (req, res, next) => {
  try {
    const documents = await service.getMyDocuments(req.studentId);
    sendSuccess(res, { message: 'My documents retrieved', data: { documents } });
  } catch (err) { next(err); }
};

const getPayments = async (req, res, next) => {
  try {
    const payments = await service.getMyPayments(req.studentId);
    sendSuccess(res, { message: 'My payments retrieved', data: { payments } });
  } catch (err) { next(err); }
};

const getVisa = async (req, res, next) => {
  try {
    const visa = await service.getMyVisa(req.studentId);
    sendSuccess(res, { message: 'My visa status retrieved', data: { visa } });
  } catch (err) { next(err); }
};

module.exports = {
  getDashboard,
  getDocuments,
  getPayments,
  getVisa
};
