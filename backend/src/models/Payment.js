const mongoose = require('mongoose');

const { Schema } = mongoose;

const transactionSchema = new Schema({
  amount: { type: Number, required: true },
  method: {
    type: String,
    enum: ['cash', 'bank_transfer', 'credit_card', 'online', 'cheque'],
    required: true
  },
  reference: String,
  paidAt: { type: Date, default: Date.now },
  recordedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  notes: String
}, { _id: true });

const lineItemSchema = new Schema({
  description: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  total: { type: Number }
}, { _id: false });

const paymentSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true
    },
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      default: null
    },
    invoiceNumber: {
      type: String,
      unique: true,
      trim: true
    },
    items: [lineItemSchema],
    subtotal: { type: Number, default: 0 },
    discount: {
      type: { type: String, enum: ['percent', 'fixed'], default: 'fixed' },
      value: { type: Number, default: 0 }
    },
    tax: { type: Number, default: 0 }, // as percentage (e.g. 15 for 15%)
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    paymentMethod: {
      type: String,
      enum: ['cash', 'bank_transfer', 'credit_card', 'online', 'cheque']
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'pending', 'partial', 'paid', 'overdue', 'cancelled', 'refunded'],
      default: 'draft'
    },
    dueDate: { type: Date, required: true },
    paidAt: Date,
    paidAmount: { type: Number, default: 0 },
    transactions: [transactionSchema],
    notes: String,
    attachments: [String] // Array of file paths/URLs for receipts
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Pre-save: Auto-generate invoice number and compute totals
paymentSchema.pre('save', function (next) {
  // Compute line item totals
  this.items.forEach(item => {
    item.total = item.quantity * item.unitPrice;
  });

  // Compute subtotal
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);

  // Auto-generate invoice number if missing
  if (this.isNew && !this.invoiceNumber) {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    this.invoiceNumber = `INV-${year}-${random}`;
  }

  // Final check for overdue status
  if (['draft', 'sent', 'pending', 'partial'].includes(this.status) && this.dueDate < new Date()) {
    this.status = 'overdue';
  }

  next();
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;

