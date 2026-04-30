const Payment = require('../../models/Payment');
const { parsePagination, buildPaginationMeta } = require('../../utils/pagination');

const listPayments = async (queryParams) => {
  const { page, limit, skip, sort } = parsePagination(queryParams);
  const filter = {};

  if (queryParams.studentId) filter.studentId = queryParams.studentId;
  if (queryParams.status) filter.status = queryParams.status;
  if (queryParams.invoiceNumber) filter.invoiceNumber = queryParams.invoiceNumber;
  if (queryParams.startDate && queryParams.endDate) {
    filter.createdAt = { $gte: new Date(queryParams.startDate), $lte: new Date(queryParams.endDate) };
  }

  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .populate('studentId', 'firstName lastName email')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Payment.countDocuments(filter),
  ]);

  return { payments, pagination: buildPaginationMeta({ page, limit, total }) };
};

const getPaymentById = async (id) => {
  const payment = await Payment.findById(id).populate('studentId', 'firstName lastName email').lean();
  if (!payment) {
    const err = new Error('Invoice not found');
    err.statusCode = 404;
    throw err;
  }
  return payment;
};

const createPayment = async (data) => {
  return await Payment.create(data);
};

const recordTransaction = async (id, transactionData, userId) => {
  const payment = await Payment.findById(id);
  if (!payment) throw new Error('Invoice not found');

  payment.transactions.push({
    ...transactionData,
    recordedBy: userId,
    paidAt: transactionData.paidAt || new Date()
  });

  // Update paid amount and status
  payment.paidAmount += Number(transactionData.amount);
  
  if (payment.paidAmount >= payment.totalAmount) {
    payment.status = 'paid';
    payment.paidAt = new Date();
  } else if (payment.paidAmount > 0) {
    payment.status = 'partial';
  }

  return await payment.save();
};

const updateStatus = async (id, status) => {
  return await Payment.findByIdAndUpdate(id, { status }, { new: true });
};

const getPaymentSummary = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const stats = await Payment.aggregate([
    {
      $facet: {
        totals: [
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$paidAmount' },
              totalPending: { $sum: { $cond: [{ $in: ['$status', ['sent', 'pending', 'partial', 'overdue']] }, { $subtract: ['$totalAmount', '$paidAmount'] }, 0] } },
              totalOverdue: { $sum: { $cond: [{ $eq: ['$status', 'overdue'] }, { $subtract: ['$totalAmount', '$paidAmount'] }, 0] } },
              thisMonth: { $sum: { $cond: [{ $gte: ['$paidAt', startOfMonth] }, '$paidAmount', 0] } }
            }
          }
        ],
        monthlyRevenue: [
          {
            $match: { status: { $in: ['paid', 'partial'] }, paidAt: { $exists: true } }
          },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m", date: "$paidAt" } },
              revenue: { $sum: "$paidAmount" }
            }
          },
          { $sort: { "_id": 1 } },
          { $limit: 12 }
        ],
        methodBreakdown: [
          { $match: { status: 'paid' } },
          {
            $group: {
              _id: "$paymentMethod",
              count: { $sum: 1 },
              amount: { $sum: "$totalAmount" }
            }
          }
        ],
        topStudents: [
          {
            $group: {
              _id: "$studentId",
              totalPaid: { $sum: "$paidAmount" }
            }
          },
          { $sort: { totalPaid: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: 'students',
              localField: '_id',
              foreignField: '_id',
              as: 'student'
            }
          },
          { $unwind: '$student' }
        ]
      }
    }
  ]);

  return {
    overview: stats[0].totals[0] || { totalRevenue: 0, totalPending: 0, totalOverdue: 0, thisMonth: 0 },
    monthlyRevenue: stats[0].monthlyRevenue,
    methodBreakdown: stats[0].methodBreakdown,
    topStudents: stats[0].topStudents
  };
};

const PDFDocument = require('pdfkit');

const generatePDF = async (paymentId) => {
  const payment = await getPaymentById(paymentId);
  
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.fontSize(20).text('STUDY ABROAD CRM', { align: 'left' });
    doc.fontSize(10).text('123 Education Blvd, Suite 100', { align: 'left' });
    doc.text('New York, NY 10001', { align: 'left' });
    doc.moveDown();

    doc.fontSize(25).text('INVOICE', { align: 'right' });
    doc.fontSize(10).text(`Invoice #: ${payment.invoiceNumber}`, { align: 'right' });
    doc.text(`Date: ${new Date(payment.createdAt).toLocaleDateString()}`, { align: 'right' });
    doc.text(`Due Date: ${new Date(payment.dueDate).toLocaleDateString()}`, { align: 'right' });
    doc.moveDown();

    // Bill To
    doc.fontSize(12).text('BILL TO:', { underline: true });
    doc.fontSize(10).text(`${payment.studentId.firstName} ${payment.studentId.lastName}`);
    doc.text(payment.studentId.email);
    doc.moveDown(2);

    // Table Header
    const tableTop = 250;
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Description', 50, tableTop);
    doc.text('Qty', 300, tableTop, { width: 50, align: 'center' });
    doc.text('Unit Price', 350, tableTop, { width: 100, align: 'right' });
    doc.text('Total', 450, tableTop, { width: 100, align: 'right' });
    
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
    doc.font('Helvetica');

    // Table Content
    let currentY = tableTop + 25;
    payment.items.forEach(item => {
      doc.text(item.description, 50, currentY);
      doc.text(item.quantity.toString(), 300, currentY, { width: 50, align: 'center' });
      doc.text(`$${item.unitPrice.toLocaleString()}`, 350, currentY, { width: 100, align: 'right' });
      doc.text(`$${item.total.toLocaleString()}`, 450, currentY, { width: 100, align: 'right' });
      currentY += 20;
    });

    doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
    currentY += 20;

    // Totals
    const totalsX = 350;
    doc.text('Subtotal:', totalsX, currentY, { width: 100, align: 'right' });
    doc.text(`$${payment.subtotal.toLocaleString()}`, 450, currentY, { width: 100, align: 'right' });
    currentY += 15;

    if (payment.discount?.value) {
      const discountText = payment.discount.type === 'percent' ? `${payment.discount.value}%` : `$${payment.discount.value}`;
      doc.text(`Discount (${discountText}):`, totalsX, currentY, { width: 100, align: 'right' });
      const discountAmt = payment.discount.type === 'percent' ? (payment.subtotal * payment.discount.value / 100) : payment.discount.value;
      doc.text(`-$${discountAmt.toLocaleString()}`, 450, currentY, { width: 100, align: 'right' });
      currentY += 15;
    }

    doc.text(`Tax (${payment.tax}%):`, totalsX, currentY, { width: 100, align: 'right' });
    doc.text(`$${(payment.subtotal * payment.tax / 100).toLocaleString()}`, 450, currentY, { width: 100, align: 'right' });
    currentY += 25;

    doc.fontSize(14).font('Helvetica-Bold');
    doc.text('TOTAL:', totalsX, currentY, { width: 100, align: 'right' });
    doc.text(`$${payment.totalAmount.toLocaleString()}`, 450, currentY, { width: 100, align: 'right' });

    doc.moveDown(4);
    doc.fontSize(10).font('Helvetica').text('Notes:', 50);
    doc.text(payment.notes || 'Thank you for your business!', 50);

    doc.end();
  });
};

module.exports = { 
  listPayments, 
  getPaymentById, 
  createPayment, 
  recordTransaction, 
  updateStatus, 
  getPaymentSummary,
  generatePDF
};

