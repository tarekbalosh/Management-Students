const mongoose = require('mongoose');

const { Schema } = mongoose;

// ─────────────────────────────────────────────
//  Sub-schemas
// ─────────────────────────────────────────────
const intakeSchema = new Schema(
  {
    month:    { type: Number, required: true, min: 1, max: 12 },  // 1=Jan, 9=Sep
    year:     { type: Number, required: true, min: 2020, max: 2100 },
    deadline: { type: Date },
    isOpen:   { type: Boolean, default: true },
  },
  { _id: false }
);

const requirementsSchema = new Schema(
  {
    minGPA:          { type: Number, min: 0, max: 4 },
    minIELTS:        { type: Number, min: 0, max: 9 },
    minTOEFL:        { type: Number, min: 0, max: 120 },
    minGRE:          { type: Number },
    minGMAT:         { type: Number },
    workExperience:  { type: Number, default: 0 }, // years required
    requiredDocTypes: {
      type:    [String],
      default: ['passport', 'transcript', 'diploma', 'sop'],
    },
    additionalNotes: { type: String, trim: true },
  },
  { _id: false }
);

const programSchema = new Schema(
  {
    name: {
      type:     String,
      required: [true, 'Program name is required'],
      trim:     true,
    },
    degree: {
      type:     String,
      required: true,
      enum:     ['certificate', 'diploma', 'associate', 'bachelor', 'master', 'phd', 'mba'],
    },
    fieldOfStudy: {
      type:     String,
      required: true,
      trim:     true,
    },
    language: {
      type:    String,
      default: 'English',
      trim:    true,
    },
    durationMonths: {
      type:    Number,
      required: true,
      min:     1,
    },
    tuitionFee: {
      type:     Number,
      required: true,
      min:      0,
    },
    currency: {
      type:    String,
      default: 'USD',
      uppercase: true,
      trim:    true,
    },
    intakes:      { type: [intakeSchema], default: [] },
    requirements: { type: requirementsSchema, default: () => ({}) },
    isActive:     { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ─────────────────────────────────────────────
//  University Schema
// ─────────────────────────────────────────────
const universitySchema = new Schema(
  {
    name: {
      type:     String,
      required: [true, 'University name is required'],
      trim:     true,
    },
    slug: {
      type:   String,
      unique: true,
      lowercase: true,
      trim:   true,
    },
    country: {
      type:     String,
      required: [true, 'Country is required'],
      trim:     true,
    },
    city: {
      type:  String,
      trim:  true,
    },
    website: {
      type:  String,
      trim:  true,
      match: [/^https?:\/\/.+/, 'Please enter a valid URL'],
    },
    logoUrl:        { type: String, default: null },
    ranking: {
      world:    { type: Number, min: 1 },
      national: { type: Number, min: 1 },
      source:   { type: String, enum: ['QS', 'THE', 'ARWU', 'US_NEWS', 'Other'] },
    },
    accreditation:  { type: [String], default: [] },
    contactEmail:   {
      type:      String,
      lowercase: true,
      trim:      true,
    },
    contactPhone:   { type: String, trim: true },
    description:    { type: String, trim: true },
    programs:       { type: [programSchema], default: [] },
    isActive:       { type: Boolean, default: true },

    // ── Soft Delete ──────────────────────────────
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
);

// ─────────────────────────────────────────────
//  Pre-save: Auto-generate slug
// ─────────────────────────────────────────────
universitySchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }
  next();
});

// ─────────────────────────────────────────────
//  Query Middleware
// ─────────────────────────────────────────────
universitySchema.pre(/^find/, function (next) {
  if (this.getFilter().isDeleted === undefined) {
    this.where({ isDeleted: false });
  }
  next();
});

// ─────────────────────────────────────────────
//  Indexes
// ─────────────────────────────────────────────
universitySchema.index({ slug: 1 }, { unique: true });           // URL-based lookup
universitySchema.index({ country: 1, isActive: 1 });             // Filter by destination country
universitySchema.index({ 'programs.degree': 1 });                // Filter by program level
universitySchema.index({ 'programs.fieldOfStudy': 1 });          // Filter by field of study
universitySchema.index({ isDeleted: 1 });                        // Soft-delete exclusion
universitySchema.index(                                          // Full-text search
  { name: 'text', country: 'text', 'programs.name': 'text' },
  { name: 'university_search_index' }
);

const University = mongoose.model('University', universitySchema);

module.exports = University;
