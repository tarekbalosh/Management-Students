const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  status:    { type: String, required: true },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  changedAt: { type: Date, default: Date.now },
  reason:    String,
  notes:     String,
}, { _id: false });

const documentRequirementSchema = new mongoose.Schema({
  documentType: { type: String, required: true },
  status:       { type: String, enum: ['pending', 'received', 'verified'], default: 'pending' },
  documentId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
}, { _id: false });

const applicationSchema = new mongoose.Schema({
  studentId: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Student',
    required: true,
    index:    true,
  },
  universityId: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'University',
    required: true,
    index:    true,
  },
  programId: {
    type:     mongoose.Schema.Types.ObjectId,
    required: true,
  },
  intake: {
    semester: { type: String, enum: ['Spring', 'Summer', 'Fall', 'Winter'], required: true },
    year:     { type: Number, required: true },
  },
  status: {
    type:    String,
    enum:    ['draft', 'submitted', 'under_review', 'conditional', 'accepted', 'rejected', 'withdrawn'],
    default: 'draft',
    index:   true,
  },
  statusHistory: [statusHistorySchema],
  requiredDocuments: [documentRequirementSchema],
  applicationFee: {
    amount:   { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    status:   { type: String, enum: ['unpaid', 'paid', 'waived'], default: 'unpaid' },
    paidAt:   Date,
  },
  notes:         String,
  internalNotes: String,
  assignedTo:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  submittedAt:        Date,
  decisionDate:       Date,
  enrollmentDeadline: Date,
  offerLetterUrl:     String,
  
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
}, {
  timestamps: true,
});

// Populate student and university by default
applicationSchema.pre(/^find/, function(next) {
  if (this.getFilter().isDeleted === undefined) {
    this.where({ isDeleted: false });
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
