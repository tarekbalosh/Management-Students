const Notification = require('../../models/Notification');
const User = require('../../models/User');
const { parsePagination, buildPaginationMeta } = require('../../utils/pagination');
const { sendEmail, getTemplate } = require('../../utils/email');

const listNotifications = async (userId, queryParams) => {
  const { page, limit, skip, sort } = parsePagination(queryParams);
  const filter = { recipientId: userId };

  if (queryParams.isRead !== undefined) filter.isRead = queryParams.isRead === 'true';
  if (queryParams.type) filter.type = queryParams.type;

  const [notifications, total] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Notification.countDocuments(filter),
  ]);

  return { notifications, pagination: buildPaginationMeta({ page, limit, total }) };
};

const getUnreadCount = async (userId) => {
  return await Notification.countDocuments({ recipientId: userId, isRead: false });
};

const markAsRead = async (id, userId) => {
  return await Notification.findOneAndUpdate(
    { _id: id, recipientId: userId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
};

const markAllAsRead = async (userId) => {
  await Notification.updateMany(
    { recipientId: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

const createNotification = async (data) => {
  const notification = await Notification.create(data);

  if (data.deliveryChannels?.email) {
    const recipient = await User.findById(data.recipientId);
    if (recipient && recipient.email) {
      const html = getTemplate(data.metadata?.templateKey || 'default', {
        ...data.metadata,
        message: data.message,
        title: data.title
      });
      const sent = await sendEmail(recipient.email, data.title, html);
      notification.emailStatus = sent ? 'sent' : 'failed';
      await notification.save();
    }
  }

  return notification;
};

// Business Event Specific Notifiers
const notifyApplicationStatusChange = async (application, newStatus, studentId) => {
  return await createNotification({
    recipientId: studentId,
    recipientRole: 'student',
    type: 'application_status_changed',
    title: 'Application Update',
    message: `Your application status has been updated to: ${newStatus}`,
    relatedModule: 'application',
    relatedId: application._id,
    deliveryChannels: { inApp: true, email: true },
    metadata: {
      templateKey: 'application_accepted',
      universityName: application.universityId?.name || 'Target University',
      status: newStatus,
      link: `${process.env.CLIENT_URL}/applications/${application._id}`
    }
  });
};

const notifyDocumentMissing = async (studentId, documentNames) => {
  return await createNotification({
    recipientId: studentId,
    recipientRole: 'student',
    type: 'document_missing',
    title: 'Action Required: Missing Documents',
    message: `The following documents are missing: ${documentNames.join(', ')}`,
    relatedModule: 'document',
    deliveryChannels: { inApp: true, email: true },
    metadata: {
      templateKey: 'document_missing',
      documentNames: documentNames.join(', '),
      link: `${process.env.CLIENT_URL}/documents`
    }
  });
};

const notifyVisaAppointment = async (visa, studentId) => {
  return await createNotification({
    recipientId: studentId,
    recipientRole: 'student',
    type: 'visa_appointment_scheduled',
    title: 'Visa Appointment Scheduled',
    message: `Your visa appointment is scheduled for ${visa.appointmentDate}`,
    relatedModule: 'visa',
    relatedId: visa._id,
    deliveryChannels: { inApp: true, email: true },
    metadata: {
      templateKey: 'visa_appointment',
      date: visa.appointmentDate,
      location: visa.location || 'Embassy',
      link: `${process.env.CLIENT_URL}/visa`
    }
  });
};

const notifyPaymentReceived = async (payment, studentId) => {
  return await createNotification({
    recipientId: studentId,
    recipientRole: 'student',
    type: 'payment_received',
    title: 'Payment Received',
    message: `We have received your payment for invoice ${payment.invoiceNumber}`,
    relatedModule: 'payment',
    relatedId: payment._id,
    deliveryChannels: { inApp: true, email: true },
    metadata: {
      invoiceNumber: payment.invoiceNumber,
      amount: payment.amount,
      link: `${process.env.CLIENT_URL}/payments/${payment._id}`
    }
  });
};

module.exports = {
  listNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  createNotification,
  notifyApplicationStatusChange,
  notifyDocumentMissing,
  notifyVisaAppointment,
  notifyPaymentReceived
};
