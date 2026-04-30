const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street:     String,
  city:       String,
  country:    String,
  postalCode: String,
}, { _id: false });

const emergencyContactSchema = new mongoose.Schema({
  name:     String,
  phone:    String,
  relation: String,
}, { _id: false });

const languageScoreSchema = new mongoose.Schema({
  testType: { type: String, enum: ['IELTS', 'TOEFL', 'PTE', 'DUOLINGO', 'OTHER'] },
  score:    String,
  date:     Date,
}, { _id: false });

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'User',
    default: null, // Student might not have a login account yet
  },
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  phone:     String,
  dateOfBirth: Date,
  gender:    { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'] },
  nationality: String,
  nationalId:  String,
  profilePhoto: String, // URL/Path

  address: addressSchema,
  emergencyContact: emergencyContactSchema,

  educationLevel: { type: String, enum: ['high_school', 'bachelor', 'master', 'other'] },
  previousUniversity: String,
  fieldOfStudy: String,
  GPA:          String,
  graduationYear: Number,
  languageScore:  languageScoreSchema,

  status: {
    type:    String,
    enum:    ['lead', 'active', 'applied', 'enrolled', 'dropped', 'graduated'],
    default: 'lead',
  },
  registrationDate: { type: Date, default: Date.now },
  source:     { type: String, enum: ['walk_in', 'referral', 'website', 'social_media', 'agent', 'other'] },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags:       [String],
  notes:      String,
  
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for applications count
studentSchema.virtual('applicationsCount', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'studentId',
  count: true,
});

studentSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

// Soft delete middleware
studentSchema.pre(/^find/, function(next) {
  if (this.getFilter().isDeleted === undefined) {
    this.where({ isDeleted: false });
  }
  next();
});

studentSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Student', studentSchema);
