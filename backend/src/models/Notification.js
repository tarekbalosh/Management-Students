const mongoose = require('mongoose');

const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    recipientRole: {
      type: String,
      enum: ['admin', 'employee', 'student'],
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: [
        'application_status_changed', 'document_missing', 'document_verified',
        'document_rejected', 'visa_appointment_scheduled', 'visa_stage_updated',
        'payment_received', 'payment_overdue', 'new_message', 'system_alert'
      ],
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedModule: {
      type: String,
      enum: ['application', 'document', 'visa', 'payment', 'student'],
    },
    relatedId: { type: Schema.Types.ObjectId },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    deliveryChannels: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false }
    },
    emailStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending'
    },
    metadata: { type: Schema.Types.Mixed, default: {} }
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
