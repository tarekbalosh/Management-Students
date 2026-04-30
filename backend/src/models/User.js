const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

// ─────────────────────────────────────────────
//  Sub-schema: Password Reset Token
// ─────────────────────────────────────────────
const passwordResetSchema = new Schema(
  {
    token:     { type: String },
    expiresAt: { type: Date },
  },
  { _id: false }
);

// ─────────────────────────────────────────────
//  Main Schema
// ─────────────────────────────────────────────
const userSchema = new Schema(
  {
    firstName: {
      type:     String,
      required: [true, 'First name is required'],
      trim:     true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type:     String,
      required: [true, 'Last name is required'],
      trim:     true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type:      String,
      required:  [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select:    false, // Never returned by default in queries
    },
    role: {
      type:     String,
      enum:     {
        values:  ['admin', 'employee', 'student'],
        message: 'Role must be one of: admin, employee, student',
      },
      required: [true, 'Role is required'],
    },
    avatar: {
      type:    String,
      default: null,
    },
    phone: {
      type:  String,
      trim:  true,
      match: [/^\+?[\d\s\-().]{7,20}$/, 'Please provide a valid phone number'],
    },
    isActive: {
      type:    Boolean,
      default: true,
    },
    lastLoginAt: {
      type:    Date,
      default: null,
    },
    loginAttempts: {
      type:    Number,
      required: true,
      default:  0,
    },
    lockUntil: {
      type:    Date,
      default: null,
    },
    passwordReset: {
      type:    passwordResetSchema,
      default: null,
    },
    refreshTokens: {
      type:    [String], // Will store hashed refresh tokens
      default: [],
      select:  false,
    },
    // ── Soft Delete ──────────────────────────────
    isDeleted: {
      type:    Boolean,
      default: false,
    },
    deletedAt: {
      type:    Date,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
);

// ─────────────────────────────────────────────
//  Virtuals
// ─────────────────────────────────────────────
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// ─────────────────────────────────────────────
//  Pre-save Middleware: Hash password
// ─────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─────────────────────────────────────────────
//  Instance Methods
// ─────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.isActive  = false;
  return this.save();
};

// ─────────────────────────────────────────────
//  Query Middleware: Exclude soft-deleted by default
// ─────────────────────────────────────────────
userSchema.pre(/^find/, function (next) {
  if (this.getFilter().isDeleted === undefined) {
    this.where({ isDeleted: false });
  }
  next();
});

// ─────────────────────────────────────────────
//  Indexes
// ─────────────────────────────────────────────
userSchema.index({ email: 1 }, { unique: true });               // Fast login lookup
userSchema.index({ role: 1, isActive: 1 });                     // Filter employees / students
userSchema.index({ isDeleted: 1 });                             // Soft-delete exclusion
userSchema.index(
  { 'passwordReset.token': 1 },
  { sparse: true, expireAfterSeconds: 0 }                       // Auto-expire reset tokens
);

const User = mongoose.model('User', userSchema);

module.exports = User;
