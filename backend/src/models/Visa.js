const mongoose = require('mongoose');

const visaStageHistorySchema = new mongoose.Schema({
  stage: {
    type: String,
    enum: [
      'documents_preparation',
      'documents_submitted',
      'embassy_appointment',
      'interview_completed',
      'visa_approved',
      'visa_rejected',
      'visa_collected'
    ],
    required: true
  },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now },
  notes: String,
  appointmentDate: Date,
  appointmentLocation: String,
  visaNumber: String,
  validFrom: Date,
  validTo: Date,
  rejectionReason: String
}, { _id: false });

const visaSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true, unique: true },
  studentId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  currentStage: {
    type: String,
    enum: [
      'documents_preparation',
      'documents_submitted',
      'embassy_appointment',
      'interview_completed',
      'visa_approved',
      'visa_rejected',
      'visa_collected'
    ],
    default: 'documents_preparation'
  },
  stageHistory: [visaStageHistorySchema],
  embassyDetails: {
    name:     String,
    address:  String,
    phone:    String,
    country:  String,
    appointmentDate: Date
  },
  visaDetails: {
    type:           String,
    number:         String,
    issuedDate:     Date,
    expiryDate:     Date,
    scannedCopyUrl: String
  },
  reminders: [{
    type:         { type: String, enum: ['appointment', 'expiry', 'document_followup'] },
    scheduledFor: Date,
    sent:         { type: Boolean, default: false },
    sentAt:       Date
  }],
  notes:       String,
  attachments: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Visa', visaSchema);
