const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock Data
const MOCK_USER = { id: '1', firstName: 'Sarah', lastName: 'Mitchell', email: 'admin@studycrm.com', role: 'admin' };
const MOCK_STATS = {
  totalStudents: 156,
  newStudentsThisMonth: 12,
  totalApplications: 45,
  pendingApplications: 18,
  acceptedApplications: 22,
  rejectedApplications: 5,
  totalPaymentsAmount: 125000,
  pendingPayments: 4,
  visaApproved: 14,
  visaPending: 8,
  applicationsByMonth: Array.from({length: 12}, (_, i) => ({ month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i], count: Math.floor(Math.random() * 20) + 5 })),
  recentApplications: [
    { _id: 'a1', studentId: { firstName: 'Ahmed', lastName: 'Rashid' }, universityId: { name: 'University of Toronto' }, status: 'under_review', createdAt: new Date() },
    { _id: 'a2', studentId: { firstName: 'Priya', lastName: 'Sharma' }, universityId: { name: 'Stanford University' }, status: 'accepted', createdAt: new Date() },
  ],
  visaStats: {
    total: 24,
    approvalRate: 85,
    rejectionRate: 5,
    avgProcessingTimeDays: 14,
    statsByUniversity: [
      { university: 'University of Toronto', total: 12, approved: 10, rate: 83.3 },
      { university: 'Stanford University', total: 8, approved: 7, rate: 87.5 },
      { university: 'MIT', total: 4, approved: 4, rate: 100 },
    ]
  },
  recentNotifications: [
    { _id: 'n1', title: 'New Application', message: 'Ahmed Rashid submitted an application to UofT.', type: 'application' }
  ]
};

const MOCK_STUDENTS = [
  { _id: 's1', firstName: 'Ahmed', lastName: 'Rashid', email: 'ahmed@example.com', nationality: 'Saudi Arabia', status: 'active', createdAt: new Date() }
];

// Routes
app.post('/api/auth/login', (req, res) => {
  res.json({ success: true, data: { accessToken: 'mock_token', user: MOCK_USER } });
});

app.get('/api/dashboard/stats', (req, res) => {
  res.json({ success: true, data: MOCK_STATS });
});

app.get('/api/students', (req, res) => {
  const search = req.query.search?.toLowerCase();
  let students = MOCK_STUDENTS;
  if (search) {
    students = students.filter(s => 
      s.firstName.toLowerCase().includes(search) || 
      s.lastName.toLowerCase().includes(search) || 
      s.email.toLowerCase().includes(search)
    );
  }
  res.json({ success: true, data: { students, pagination: { total: students.length, page: 1, limit: 10 } } });
});

app.post('/api/students', (req, res) => {
  const newStudent = { 
    _id: 's' + Math.floor(Math.random() * 10000), 
    ...req.body,
    createdAt: new Date()
  };
  MOCK_STUDENTS.push(newStudent);
  res.json({ success: true, message: 'Student created successfully', data: newStudent });
});

app.get('/api/students/:id', (req, res) => {
  res.json({ 
    success: true, 
    data: { 
      student: { 
        _id: req.params.id, 
        firstName: 'Ahmed', 
        lastName: 'Rashid', 
        email: 'ahmed@example.com', 
        nationality: 'Saudi Arabia', 
        status: 'active',
        address: { street: '123 Main St', city: 'Riyadh', country: 'Saudi Arabia' },
        educationLevel: 'bachelor',
        previousUniversity: 'King Saud University',
        GPA: '3.8/4.0',
        fieldOfStudy: 'Computer Science'
      } 
    } 
  });
});

app.get('/api/universities', (req, res) => {
  res.json({ success: true, data: { universities: [{ _id: 'u1', name: 'University of Toronto', country: 'Canada', city: 'Toronto', programs: [{ name: 'CS', degree: 'Master' }] }] } });
});

app.get('/api/applications', (req, res) => {
  res.json({ success: true, data: [MOCK_STATS.recentApplications[0]] });
});

app.get('/api/visa/stats', (req, res) => {
  res.json({ success: true, data: MOCK_STATS.visaStats });
});

app.get('/api/visa/:applicationId', (req, res) => {
  res.json({ 
    success: true, 
    data: {
      _id: 'v1',
      applicationId: req.params.applicationId,
      currentStage: 'embassy_appointment',
      embassyDetails: { name: 'German Embassy', address: '123 Embassy Row', appointmentDate: new Date(Date.now() + 86400000 * 3) },
      stageHistory: [
        { stage: 'documents_preparation', updatedAt: new Date(Date.now() - 86400000 * 5), notes: 'Initial prep' },
        { stage: 'documents_submitted', updatedAt: new Date(Date.now() - 86400000 * 2), notes: 'Submitted via VFS' },
        { stage: 'embassy_appointment', updatedAt: new Date(), notes: 'Appointment scheduled', appointmentDate: new Date(Date.now() + 86400000 * 3) }
      ]
    } 
  });
});

app.post('/api/visa', (req, res) => {
  res.json({ success: true, message: 'Visa tracking initialized', data: { _id: 'v' + Math.random(), ...req.body } });
});

app.patch('/api/visa/:id/stage', (req, res) => {
  res.json({ success: true, message: 'Stage updated' });
});

const MOCK_PAYMENTS = [
  {
    _id: 'inv1',
    invoiceNumber: 'INV-2026-88291',
    studentId: { _id: 's1', firstName: 'Ahmed', lastName: 'Rashid', email: 'ahmed@example.com' },
    totalAmount: 1500,
    paidAmount: 500,
    subtotal: 1500,
    discount: { type: 'percent', value: 0 },
    tax: 0,
    status: 'partial',
    dueDate: new Date(Date.now() + 86400000 * 7),
    createdAt: new Date(Date.now() - 86400000 * 2),
    items: [{ description: 'Application Fee', quantity: 1, unitPrice: 500, total: 500 }, { description: 'Consultation', quantity: 1, unitPrice: 1000, total: 1000 }],
    transactions: [{ amount: 500, method: 'bank_transfer', paidAt: new Date(Date.now() - 86400000), reference: 'TX-990' }]
  }
];

const MOCK_FINANCIALS = {
  overview: { totalRevenue: 125000, totalPending: 18400, totalOverdue: 4200, thisMonth: 12400 },
  monthlyRevenue: [
    { _id: '2026-01', revenue: 8500 },
    { _id: '2026-02', revenue: 12000 },
    { _id: '2026-03', revenue: 15000 },
    { _id: '2026-04', revenue: 12400 }
  ],
  methodBreakdown: [
    { _id: 'bank_transfer', count: 45, amount: 85000 },
    { _id: 'credit_card', count: 22, amount: 32000 },
    { _id: 'cash', count: 12, amount: 8000 }
  ],
  topStudents: [
    { _id: 's1', totalPaid: 5200, student: { firstName: 'Ahmed', lastName: 'Rashid', nationality: 'Saudi Arabia' } },
    { _id: 's2', totalPaid: 4800, student: { firstName: 'Sarah', lastName: 'Smith', nationality: 'USA' } }
  ]
};

app.get('/api/payments', (req, res) => {
  res.json({ success: true, data: { payments: MOCK_PAYMENTS }, pagination: { total: 1, page: 1, limit: 10 } });
});

app.get('/api/payments/summary', (req, res) => {
  res.json({ success: true, data: MOCK_FINANCIALS });
});

app.get('/api/payments/:id', (req, res) => {
  res.json({ success: true, data: { payment: MOCK_PAYMENTS[0] } });
});

app.post('/api/payments', (req, res) => {
  res.json({ success: true, message: 'Invoice created', data: { payment: { _id: 'inv' + Math.floor(Math.random()*1000), ...req.body } } });
});

app.post('/api/payments/:id/transaction', (req, res) => {
  res.json({ success: true, message: 'Transaction recorded' });
});

app.get('/api/payments/:id/pdf', async (req, res) => {
  const payment = MOCK_PAYMENTS.find(p => p._id === req.params.id) || MOCK_PAYMENTS[0];
  const PDFDocument = require('pdfkit');
  const doc = new PDFDocument({ margin: 50 });
  let chunks = [];
  
  doc.on('data', chunk => chunks.push(chunk));
  doc.on('end', () => {
    const result = Buffer.concat(chunks);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${payment.invoiceNumber}.pdf`);
    res.send(result);
  });

  // Professional Invoice Header
  doc.fontSize(20).text('STUDY ABROAD CRM', 50, 50);
  doc.fontSize(10).text('123 Education Blvd, Suite 100', 50, 75);
  doc.text('New York, NY 10001', 50, 90);

  doc.fontSize(25).text('INVOICE', 400, 50, { align: 'right' });
  doc.fontSize(10).text(`Invoice #: ${payment.invoiceNumber}`, 400, 80, { align: 'right' });
  doc.text(`Date: ${new Date(payment.createdAt).toLocaleDateString()}`, 400, 95, { align: 'right' });
  doc.text(`Due Date: ${new Date(payment.dueDate).toLocaleDateString()}`, 400, 110, { align: 'right' });

  // Bill To
  doc.fontSize(12).text('BILL TO:', 50, 150, { underline: true });
  doc.fontSize(10).text(`${payment.studentId.firstName} ${payment.studentId.lastName}`, 50, 170);
  doc.text(payment.studentId.email, 50, 185);

  // Table
  const tableTop = 230;
  doc.font('Helvetica-Bold').text('Description', 50, tableTop);
  doc.text('Qty', 300, tableTop);
  doc.text('Unit Price', 380, tableTop);
  doc.text('Total', 480, tableTop);
  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

  doc.font('Helvetica');
  let currentY = tableTop + 25;
  payment.items.forEach(item => {
    doc.text(item.description, 50, currentY);
    doc.text(item.quantity.toString(), 300, currentY);
    doc.text(`$${item.unitPrice.toLocaleString()}`, 380, currentY);
    doc.text(`$${item.total.toLocaleString()}`, 480, currentY);
    currentY += 20;
  });

  doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
  
  // Totals
  currentY += 20;
  doc.text('Subtotal:', 380, currentY);
  doc.text(`$${(payment.subtotal || payment.totalAmount).toLocaleString()}`, 480, currentY);
  currentY += 20;
  doc.fontSize(12).font('Helvetica-Bold').text('GRAND TOTAL:', 330, currentY);
  doc.text(`$${payment.totalAmount.toLocaleString()}`, 480, currentY);

  doc.fontSize(10).font('Helvetica').text('Note:', 50, currentY + 50);
  doc.text('Thank you for choosing Study Abroad CRM.', 50, currentY + 65);

  doc.end();
});

app.get('/api/notifications', (req, res) => {
  res.json({ 
    success: true, 
    data: { 
      notifications: [
        { _id: 'n1', type: 'application_status_changed', title: 'Application Update', message: 'Your application to UofT is now Under Review.', isRead: false, createdAt: new Date() },
        { _id: 'n2', type: 'payment_received', title: 'Payment Confirmed', message: 'We received your $500 application fee.', isRead: true, createdAt: new Date(Date.now() - 86400000) }
      ] 
    } 
  });
});

app.get('/api/notifications/unread-count', (req, res) => {
  res.json({ success: true, data: { count: 1 } });
});

app.patch('/api/notifications/read-all', (req, res) => {
  res.json({ success: true, message: 'All read' });
});

app.get('/api/portal/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      student: { firstName: 'Ahmed', lastName: 'Rashid', email: 'ahmed@example.com' },
      application: {
        universityId: { name: 'University of Toronto' },
        programName: 'MSc Computer Science',
        status: 'under_review',
        intake: 'September 2026',
        createdAt: new Date(),
        statusHistory: [{ status: 'submitted', changedAt: new Date(Date.now() - 86400000 * 5) }]
      },
      docStats: { total: 8, verified: 5, pending: 3 },
      recentNotifications: [
        { _id: 'n1', title: 'Document Verified', message: 'Your passport copy has been verified.', createdAt: new Date() }
      ]
    }
  });
});

app.get('/api/portal/documents', (req, res) => {
  res.json({ success: true, data: { documents: [
    { _id: 'd1', type: 'passport', status: 'verified', createdAt: new Date() },
    { _id: 'd2', type: 'transcripts', status: 'pending', createdAt: new Date() },
    { _id: 'd3', type: 'cv', status: 'rejected', rejectionReason: 'File is not readable', createdAt: new Date() }
  ]}});
});

app.get('/api/portal/payments', (req, res) => {
  res.json({ success: true, data: { payments: [
    { _id: 'p1', invoiceNumber: 'INV-2026-001', totalAmount: 5000, paidAmount: 2000, status: 'partial', createdAt: new Date() }
  ]}});
});

app.get('/api/portal/visa', (req, res) => {
  res.json({ success: true, data: { visa: { currentStage: 'visa_applied', location: 'Embassy of Canada', appointmentDate: new Date(Date.now() + 86400000 * 10) }}});
});

app.get('/api/health', (req, res) => res.json({ success: true, mode: 'MOCK' }));


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀  MOCK SERVER running on port ${PORT}`);
  console.log(`⚠️  Using in-memory data. Changes will not be saved to MongoDB.`);
});
