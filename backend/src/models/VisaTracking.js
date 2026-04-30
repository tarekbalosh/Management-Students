const mongoose = require('mongoose');

const { Schema } = mongoose;

const VISA_STAGES = [
  'documents_preparation',
  'documents_submitted',
  'embassy_appointment',
  'interview_completed',
  'visa_approved',
  'visa_rejected',
  'visa_collected'
];

const stageHistorySchema = new Schema({
  stage: {
    type: String,
    enum: VISA_STAGES,
    required: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  notes: String,
  appointmentDate: Date,
  appointmentLocation: String,
  visaNumber: String,
  validFrom: Date,
  validTo: Date,
  rejectionReason: String
});

const reminderSchema = new Schema({
  type: {
    type: String,
    enum: ['appointment', 'document_deadline', 'expiry'],
    required: true
  },
  scheduledFor: {
    type: Date,
    required: true
  },
  sent: {
    type: Boolean,
    default: false
  },
  sentAt: Date
});

const visaTrackingSchema = new Schema(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      required: [true, 'Application reference is required'],
      unique: true
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    currentStage: {
      type: String,
      enum: VISA_STAGES,
      default: 'documents_preparation'
    },
    stageHistory: [stageHistorySchema],
    embassyDetails: {
      name: String,
      address: String,
      phone: String,
      country: String,
      appointmentDate: Date
    },
    visaDetails: {
      type: { type: String },
      number: String,
      issuedDate: Date,
      expiryDate: Date,
      scannedCopyUrl: String
    },
    reminders: [reminderSchema],
    notes: String,
    attachments: [String]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for success rate and processing time calculations (used in service)
visaTrackingSchema.index({ applicationId: 1 }, { unique: true });
visaTrackingSchema.index({ studentId: 1 });
visaTrackingSchema.index({ currentStage: 1 });

const VisaTracking = mongoose.model('VisaTracking', visaTrackingSchema);

module.exports = VisaTracking;

