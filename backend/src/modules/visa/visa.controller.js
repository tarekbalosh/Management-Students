const service = require('./visa.service');
const { sendSuccess } = require('../../utils/apiResponse');

const create = async (req, res, next) => {
  try {
    const visa = await service.createRecord(req.body, req.user?.id);
    sendSuccess(res, { message: 'Visa tracking created', data: { visa }, statusCode: 201 });
  } catch (err) { next(err); }
};

const getByApplicationId = async (req, res, next) => {
  try {
    const visa = await service.getByApplicationId(req.params.applicationId);
    sendSuccess(res, { message: 'Visa tracking retrieved', data: { visa } });
  } catch (err) { next(err); }
};

const updateStage = async (req, res, next) => {
  try {
    const visa = await service.updateStage(req.params.id, req.body, req.user?.id);
    sendSuccess(res, { message: 'Visa stage updated', data: { visa } });
  } catch (err) { next(err); }
};

const addReminder = async (req, res, next) => {
  try {
    const visa = await service.addReminder(req.params.id, req.body);
    sendSuccess(res, { message: 'Reminder added', data: { visa } });
  } catch (err) { next(err); }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await service.getStats();
    sendSuccess(res, { message: 'Visa stats retrieved', data: stats });
  } catch (err) { next(err); }
};

module.exports = {
  create,
  getByApplicationId,
  updateStage,
  addReminder,
  getStats
};

