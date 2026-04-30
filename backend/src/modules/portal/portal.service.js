const Application = require('../../models/Application');
const Document = require('../../models/Document');
const VisaTracking = require('../../models/VisaTracking');
const Payment = require('../../models/Payment');
const Notification = require('../../models/Notification');
const Student = require('../../models/Student');

const getDashboardData = async (studentId) => {
  const [student, application, visa, payments, notifications] = await Promise.all([
    Student.findById(studentId).lean(),
    Application.findOne({ studentId }).populate('universityId').lean(),
    VisaTracking.findOne({ studentId }).lean(),
    Payment.find({ studentId }).sort({ createdAt: -1 }).limit(5).lean(),
    Notification.find({ recipientId: student?.userId, isRead: false }).sort({ createdAt: -1 }).limit(3).lean()
  ]);

  // Document stats
  const docs = await Document.find({ studentId });
  const docStats = {
    total: docs.length,
    verified: docs.filter(d => d.status === 'verified').length,
    pending: docs.filter(d => d.status === 'pending').length
  };

  return {
    student,
    application,
    visa,
    docStats,
    recentPayments: payments,
    recentNotifications: notifications
  };
};

const getMyDocuments = async (studentId) => {
  return await Document.find({ studentId }).sort({ createdAt: -1 }).lean();
};

const getMyPayments = async (studentId) => {
  return await Payment.find({ studentId }).sort({ createdAt: -1 }).lean();
};

const getMyVisa = async (studentId) => {
  return await VisaTracking.findOne({ studentId }).lean();
};

module.exports = {
  getDashboardData,
  getMyDocuments,
  getMyPayments,
  getMyVisa
};
