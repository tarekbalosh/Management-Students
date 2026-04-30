const service = require('./notification.service');
const { sendSuccess } = require('../../utils/apiResponse');

const list = async (req, res, next) => {
  try {
    const { notifications, pagination } = await service.listNotifications(req.user.id, req.query);
    sendSuccess(res, { message: 'Notifications retrieved', data: { notifications }, pagination });
  } catch (err) { next(err); }
};

const getUnreadCount = async (req, res, next) => {
  try {
    const count = await service.getUnreadCount(req.user.id);
    sendSuccess(res, { message: 'Unread count retrieved', data: { count } });
  } catch (err) { next(err); }
};

const readOne = async (req, res, next) => {
  try {
    const notif = await service.markAsRead(req.params.id, req.user.id);
    sendSuccess(res, { message: 'Notification marked as read', data: { notification: notif } });
  } catch (err) { next(err); }
};

const readAll = async (req, res, next) => {
  try {
    await service.markAllAsRead(req.user.id);
    sendSuccess(res, { message: 'All notifications marked as read', data: null });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await service.deleteNotification(req.params.id, req.user.id);
    sendSuccess(res, { message: 'Notification deleted', data: null });
  } catch (err) { next(err); }
};

module.exports = { list, getUnreadCount, readOne, readAll, remove };
