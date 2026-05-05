/**
 * seed.js — Study Abroad CRM Seed Data
 *
 * Usage:
 *   node src/db/seed.js
 *
 * This script clears existing data and inserts fresh seed records.
 * Run ONLY in development.
 */

require('dotenv').config();
const mongoose = require('mongoose');

const User        = require('../models/User');
const Student     = require('../models/Student');
const University  = require('../models/University');
const Application = require('../models/Application');
const VisaTracking = require('../models/VisaTracking');
const Document    = require('../models/Document');
const Payment     = require('../models/Payment');
const Notification = require('../models/Notification');

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
const id = () => new mongoose.Types.ObjectId();

// ─────────────────────────────────────────────
//  Raw Seed Data (pre-hashing handled by model hooks)
// ─────────────────────────────────────────────

// USERS
const adminId    = id();
const emp1Id     = id();
const emp2Id     = id();
const stuUser1Id = id();
const stuUser2Id = id();

const usersData = [
  {
    _id:       adminId,
    firstName: 'Sarah',
    lastName:  'Mitchell',
    email:     'admin@resturant.com',
    password:  'admin123',
    role:      'admin',
    isActive:  true,
  },
  {
    _id:       emp1Id,
    firstName: 'James',
    lastName:  'Okafor',
    email:     'james.okafor@studycrm.com',
    password:  'Employee@123',
    role:      'employee',
    isActive:  true,
  },
  {
    _id:       emp2Id,
    firstName: 'Lena',
    lastName:  'Hoffmann',
    email:     'lena.hoffmann@studycrm.com',
    password:  'Employee@123',
    role:      'employee',
    isActive:  true,
  },
  {
    _id:       stuUser1Id,
    firstName: 'Ahmed',
    lastName:  'Al-Rashid',
    email:     'ahmed.portal@studycrm.com',
    password:  'Student@123',
    role:      'student',
    isActive:  true,
  },
  {
    _id:       stuUser2Id,
    firstName: 'Priya',
    lastName:  'Sharma',
    email:     'priya.portal@studycrm.com',
    password:  'Student@123',
    role:      'student',
    isActive:  true,
  },
];

// STUDENTS
const s1Id = id();
const s2Id = id();
const s3Id = id();
const s4Id = id();
const s5Id = id();

const studentsData = [
  {
    _id:        s1Id,
    userId:     stuUser1Id,
    assignedTo: emp1Id,
    firstName:  'Ahmed',
    lastName:   'Al-Rashid',
    email:      'ahmed.alrashid@gmail.com',
    phone:      '+966501234567',
    dateOfBirth: new Date('1999-03-15'),
    gender:     'male',
    nationality: 'Saudi Arabian',
    address:    { city: 'Riyadh', country: 'Saudi Arabia' },
    passport:   { number: 'G1234567', expiryDate: new Date('2028-05-10'), issuedAt: 'Saudi Arabia' },
    education: [
      {
        degree:         'Bachelor',
        institution:    'King Saud University',
        fieldOfStudy:   'Computer Science',
        gpa:            3.6,
        graduationYear: 2022,
        country:        'Saudi Arabia',
      },
    ],
    languageTests: [
      { testType: 'IELTS', score: 7.0, testDate: new Date('2023-06-01'), expiryDate: new Date('2025-06-01') },
    ],
    status: 'applied',
    source: 'website',
    tags:   ['scholarship', 'canada'],
  },
  {
    _id:        s2Id,
    userId:     stuUser2Id,
    assignedTo: emp1Id,
    firstName:  'Priya',
    lastName:   'Sharma',
    email:      'priya.sharma@gmail.com',
    phone:      '+919876543210',
    dateOfBirth: new Date('2000-07-22'),
    gender:     'female',
    nationality: 'Indian',
    address:    { city: 'Mumbai', country: 'India' },
    passport:   { number: 'P9876543', expiryDate: new Date('2027-11-20'), issuedAt: 'India' },
    education: [
      {
        degree:         'Bachelor',
        institution:    'University of Mumbai',
        fieldOfStudy:   'Electrical Engineering',
        gpa:            3.8,
        graduationYear: 2023,
        country:        'India',
      },
    ],
    languageTests: [
      { testType: 'TOEFL', score: 105, testDate: new Date('2023-09-10'), expiryDate: new Date('2025-09-10') },
      { testType: 'GRE',   score: 320, testDate: new Date('2023-08-15') },
    ],
    status: 'applied',
    source: 'referral',
    tags:   ['engineering', 'usa'],
  },
  {
    _id:        s3Id,
    assignedTo: emp2Id,
    firstName:  'Carlos',
    lastName:   'Mendez',
    email:      'carlos.mendez@gmail.com',
    phone:      '+52551234567',
    dateOfBirth: new Date('1998-11-05'),
    gender:     'male',
    nationality: 'Mexican',
    address:    { city: 'Mexico City', country: 'Mexico' },
    passport:   { number: 'MX5678901', expiryDate: new Date('2026-03-15'), issuedAt: 'Mexico' },
    education: [
      {
        degree:         'Bachelor',
        institution:    'UNAM',
        fieldOfStudy:   'Business Administration',
        gpa:            3.4,
        graduationYear: 2021,
        country:        'Mexico',
      },
    ],
    languageTests: [
      { testType: 'IELTS', score: 6.5, testDate: new Date('2023-04-20'), expiryDate: new Date('2025-04-20') },
      { testType: 'GMAT', score: 680, testDate: new Date('2023-05-10') },
    ],
    status: 'active',
    source: 'agent',
    tags:   ['mba', 'uk'],
  },
  {
    _id:        s4Id,
    assignedTo: emp2Id,
    firstName:  'Yuki',
    lastName:   'Tanaka',
    email:      'yuki.tanaka@gmail.com',
    phone:      '+81312345678',
    dateOfBirth: new Date('2001-02-28'),
    gender:     'female',
    nationality: 'Japanese',
    address:    { city: 'Tokyo', country: 'Japan' },
    passport:   { number: 'TK9901234', expiryDate: new Date('2029-01-10'), issuedAt: 'Japan' },
    education: [
      {
        degree:         'Bachelor',
        institution:    'Waseda University',
        fieldOfStudy:   'International Relations',
        gpa:            3.9,
        graduationYear: 2023,
        country:        'Japan',
      },
    ],
    languageTests: [
      { testType: 'TOEFL', score: 112, testDate: new Date('2023-10-05'), expiryDate: new Date('2025-10-05') },
    ],
    status: 'enrolled',
    source: 'walk_in',
    tags:   ['political-science', 'usa'],
  },
  {
    _id:        s5Id,
    assignedTo: emp1Id,
    firstName:  'Amira',
    lastName:   'Hassan',
    email:      'amira.hassan@gmail.com',
    phone:      '+201098765432',
    dateOfBirth: new Date('2000-09-12'),
    gender:     'female',
    nationality: 'Egyptian',
    address:    { city: 'Cairo', country: 'Egypt' },
    passport:   { number: 'EG1122334', expiryDate: new Date('2027-08-30'), issuedAt: 'Egypt' },
    education: [
      {
        degree:         'Bachelor',
        institution:    'Cairo University',
        fieldOfStudy:   'Pharmacy',
        gpa:            3.7,
        graduationYear: 2023,
        country:        'Egypt',
      },
    ],
    languageTests: [
      { testType: 'IELTS', score: 7.5, testDate: new Date('2023-11-01'), expiryDate: new Date('2025-11-01') },
    ],
    status: 'active',
    source: 'social_media',
    tags:   ['health-sciences', 'germany'],
  },
];

// UNIVERSITIES
const uniTorontoId   = id();
const uniMITId       = id();
const uniLondonId    = id();

const universitiesData = [
  {
    _id:     uniTorontoId,
    name:    'University of Toronto',
    country: 'Canada',
    city:    'Toronto',
    website: 'https://www.utoronto.ca',
    ranking: { world: 21, national: 1, source: 'QS' },
    accreditation: ['AUCC'],
    contactEmail: 'admissions@utoronto.ca',
    programs: [
      {
        name:           'Master of Computer Science',
        degree:         'master',
        fieldOfStudy:   'Computer Science',
        language:       'English',
        durationMonths: 24,
        tuitionFee:     28000,
        currency:       'CAD',
        intakes: [
          { month: 9, year: 2025, deadline: new Date('2025-01-15'), isOpen: true },
        ],
        requirements: {
          minGPA:  3.5,
          minIELTS: 7.0,
          requiredDocTypes: ['transcript', 'diploma', 'sop', 'recommendation_letter'],
        },
      },
    ],
    isActive: true,
  },
  {
    _id:     uniMITId,
    name:    'Massachusetts Institute of Technology',
    country: 'USA',
    city:    'Cambridge',
    website: 'https://www.mit.edu',
    ranking: { world: 1, national: 1, source: 'QS' },
    accreditation: ['NECHE'],
    contactEmail: 'admissions@mit.edu',
    programs: [
      {
        name:           'Master of Science in Electrical Engineering',
        degree:         'master',
        fieldOfStudy:   'Electrical Engineering',
        language:       'English',
        durationMonths: 24,
        tuitionFee:     57986,
        currency:       'USD',
        intakes: [
          { month: 9, year: 2025, deadline: new Date('2024-12-01'), isOpen: true },
        ],
        requirements: {
          minGPA:   3.7,
          minTOEFL: 100,
          minGRE:   315,
          requiredDocTypes: ['transcript', 'diploma', 'sop', 'recommendation_letter', 'cv_resume'],
        },
      },
      {
        name:           'MBA',
        degree:         'mba',
        fieldOfStudy:   'Business Administration',
        language:       'English',
        durationMonths: 24,
        tuitionFee:     83840,
        currency:       'USD',
        intakes: [
          { month: 9, year: 2025, deadline: new Date('2025-04-01'), isOpen: true },
        ],
        requirements: {
          minGPA:  3.5,
          minGMAT: 720,
          minTOEFL: 100,
          workExperience: 3,
          requiredDocTypes: ['transcript', 'diploma', 'sop', 'cv_resume', 'recommendation_letter'],
        },
      },
    ],
    isActive: true,
  },
  {
    _id:     uniLondonId,
    name:    'University College London',
    country: 'UK',
    city:    'London',
    website: 'https://www.ucl.ac.uk',
    ranking: { world: 8, national: 2, source: 'QS' },
    accreditation: ['QAA'],
    contactEmail: 'admissions@ucl.ac.uk',
    programs: [
      {
        name:           'MBA',
        degree:         'mba',
        fieldOfStudy:   'Business Administration',
        language:       'English',
        durationMonths: 12,
        tuitionFee:     48500,
        currency:       'GBP',
        intakes: [
          { month: 9, year: 2025, deadline: new Date('2025-03-01'), isOpen: true },
        ],
        requirements: {
          minGPA:   3.3,
          minIELTS: 6.5,
          minGMAT:  650,
          workExperience: 2,
          requiredDocTypes: ['transcript', 'diploma', 'sop', 'cv_resume', 'recommendation_letter'],
        },
      },
    ],
    isActive: true,
  },
];

// Grab program IDs from embedded docs (set manually for seed)
const prog_MSCS_Toronto_Id = id();
const prog_MSEE_MIT_Id     = id();
const prog_MBA_UCL_Id      = id();

// APPLICATIONS
const app1Id = id();
const app2Id = id();
const app3Id = id();
const app4Id = id();
const app5Id = id();

const applicationsData = [
  {
    _id:          app1Id,
    studentId:    s1Id,
    universityId: uniTorontoId,
    programId:    prog_MSCS_Toronto_Id,
    assignedTo:   emp1Id,
    programSnapshot: {
      name:           'Master of Computer Science',
      degree:         'master',
      fieldOfStudy:   'Computer Science',
      tuitionFee:     28000,
      currency:       'CAD',
      durationMonths: 24,
    },
    intake:          { month: 9, year: 2025 },
    status:          'submitted',
    submittedAt:     new Date('2024-01-20'),
    referenceNumber: 'APP-2024-A1R4S',
    priority:        'high',
    timeline: [
      { stage: 'Application Created', status: 'completed', date: new Date('2024-01-05') },
      { stage: 'Documents Collected', status: 'completed', date: new Date('2024-01-18') },
      { stage: 'Submitted to University', status: 'completed', date: new Date('2024-01-20') },
      { stage: 'Awaiting Decision', status: 'in_progress', date: new Date('2024-01-21') },
    ],
  },
  {
    _id:          app2Id,
    studentId:    s2Id,
    universityId: uniMITId,
    programId:    prog_MSEE_MIT_Id,
    assignedTo:   emp1Id,
    programSnapshot: {
      name:           'Master of Science in Electrical Engineering',
      degree:         'master',
      fieldOfStudy:   'Electrical Engineering',
      tuitionFee:     57986,
      currency:       'USD',
      durationMonths: 24,
    },
    intake:         { month: 9, year: 2025 },
    status:         'unconditional_offer',
    submittedAt:    new Date('2023-11-25'),
    decisionDate:   new Date('2024-02-10'),
    referenceNumber:'APP-2024-B2K9M',
    priority:       'high',
    timeline: [
      { stage: 'Application Created', status: 'completed', date: new Date('2023-11-01') },
      { stage: 'Submitted to University', status: 'completed', date: new Date('2023-11-25') },
      { stage: 'Under Review', status: 'completed', date: new Date('2023-12-05') },
      { stage: 'Offer Received', status: 'completed', date: new Date('2024-02-10') },
      { stage: 'Student Acceptance', status: 'in_progress', date: new Date('2024-02-12') },
    ],
  },
  {
    _id:          app3Id,
    studentId:    s3Id,
    universityId: uniLondonId,
    programId:    prog_MBA_UCL_Id,
    assignedTo:   emp2Id,
    programSnapshot: {
      name:           'MBA',
      degree:         'mba',
      fieldOfStudy:   'Business Administration',
      tuitionFee:     48500,
      currency:       'GBP',
      durationMonths: 12,
    },
    intake:         { month: 9, year: 2025 },
    status:         'under_review',
    submittedAt:    new Date('2024-02-01'),
    referenceNumber:'APP-2024-C3P7W',
    priority:       'medium',
    timeline: [
      { stage: 'Application Created', status: 'completed', date: new Date('2024-01-10') },
      { stage: 'Documents Collected', status: 'completed', date: new Date('2024-01-28') },
      { stage: 'Submitted to University', status: 'completed', date: new Date('2024-02-01') },
      { stage: 'Under Review', status: 'in_progress', date: new Date('2024-02-03') },
    ],
  },
  {
    _id:          app4Id,
    studentId:    s4Id,
    universityId: uniMITId,
    programId:    prog_MSEE_MIT_Id,
    assignedTo:   emp2Id,
    programSnapshot: {
      name:           'Master of Science in Electrical Engineering',
      degree:         'master',
      fieldOfStudy:   'Electrical Engineering',
      tuitionFee:     57986,
      currency:       'USD',
      durationMonths: 24,
    },
    intake:         { month: 9, year: 2024 },
    status:         'enrolled',
    submittedAt:    new Date('2023-10-15'),
    decisionDate:   new Date('2024-01-20'),
    referenceNumber:'APP-2024-D4Q2X',
    priority:       'high',
    timeline: [
      { stage: 'Application Created', status: 'completed', date: new Date('2023-10-01') },
      { stage: 'Submitted to University', status: 'completed', date: new Date('2023-10-15') },
      { stage: 'Offer Received', status: 'completed', date: new Date('2024-01-20') },
      { stage: 'Enrolled', status: 'completed', date: new Date('2024-02-01') },
    ],
  },
  {
    _id:          app5Id,
    studentId:    s5Id,
    universityId: uniTorontoId,
    programId:    prog_MSCS_Toronto_Id,
    assignedTo:   emp1Id,
    programSnapshot: {
      name:           'Master of Computer Science',
      degree:         'master',
      fieldOfStudy:   'Computer Science',
      tuitionFee:     28000,
      currency:       'CAD',
      durationMonths: 24,
    },
    intake:         { month: 9, year: 2025 },
    status:         'draft',
    referenceNumber:'APP-2025-E5Z6N',
    priority:       'medium',
    timeline: [
      { stage: 'Application Created', status: 'completed', date: new Date('2024-03-01') },
      { stage: 'Documents Collection', status: 'in_progress', date: new Date('2024-03-01') },
    ],
  },
];

// ─────────────────────────────────────────────
//  Main Seed Function
// ─────────────────────────────────────────────
async function seed() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/study_abroad_crm';
    await mongoose.connect(MONGO_URI);
    console.log('✅  Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Student.deleteMany({}),
      University.deleteMany({}),
      Application.deleteMany({}),
      VisaTracking.deleteMany({}),
      Document.deleteMany({}),
      Payment.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log('🗑️   Cleared existing collections');

    // Insert Users (password hashing via pre-save hook)
    const users = await Promise.all(usersData.map((u) => new User(u).save()));
    console.log(`👤  Inserted ${users.length} users`);

    // Insert Students
    const students = await Student.insertMany(studentsData);
    console.log(`🎓  Inserted ${students.length} students`);

    // Insert Universities (slug auto-generated via pre-save)
    const universities = await Promise.all(
      universitiesData.map((u) => new University(u).save())
    );
    console.log(`🏫  Inserted ${universities.length} universities`);

    // Insert Applications
    const applications = await Application.insertMany(applicationsData);
    console.log(`📋  Inserted ${applications.length} applications`);

    // Insert VisaTracking records for submitted+ applications
    const visaData = [
      {
        applicationId:  app1Id,
        studentId:      s1Id,
        assignedTo:     emp1Id,
        country:        'Canada',
        visaType:       'study_permit',
        status:         'docs_collection',
        stages: [
          { name: 'Checklist Review', status: 'completed', order: 1 },
          { name: 'Document Collection', status: 'in_progress', order: 2 },
          { name: 'Form Preparation', status: 'not_started', order: 3 },
          { name: 'Biometrics', status: 'not_started', order: 4 },
          { name: 'Submission', status: 'not_started', order: 5 },
        ],
      },
      {
        applicationId:  app2Id,
        studentId:      s2Id,
        assignedTo:     emp1Id,
        country:        'USA',
        visaType:       'f1',
        status:         'submitted',
        submissionDate: new Date('2024-03-01'),
        appointmentDate: new Date('2024-03-20'),
        stages: [
          { name: 'Checklist Review', status: 'completed', order: 1 },
          { name: 'DS-160 Form', status: 'completed', order: 2 },
          { name: 'Fee Payment', status: 'completed', order: 3 },
          { name: 'Interview Scheduled', status: 'completed', order: 4 },
          { name: 'Interview', status: 'in_progress', order: 5 },
        ],
      },
    ];

    const visas = await VisaTracking.insertMany(visaData);
    console.log(`🛂  Inserted ${visas.length} visa tracking records`);

    // Insert sample Payments
    const paymentData = [
      {
        studentId:    s1Id,
        applicationId: app1Id,
        createdBy:    emp1Id,
        type:         'service_fee',
        items: [
          { description: 'Consultation Fee', quantity: 1, unitPrice: 300 },
          { description: 'Application Processing', quantity: 1, unitPrice: 200 },
        ],
        total:    500,
        currency: 'USD',
        status:   'paid',
        dueDate:  new Date('2024-01-15'),
        paidAt:   new Date('2024-01-10'),
        paidAmount: 500,
        paymentMethod: 'bank_transfer',
        transactionReference: 'TXN-20240110-001',
      },
      {
        studentId:    s2Id,
        applicationId: app2Id,
        createdBy:    emp1Id,
        type:         'visa_fee',
        items: [
          { description: 'F1 Visa Processing Fee (SEVIS)', quantity: 1, unitPrice: 350 },
          { description: 'Visa Service Fee', quantity: 1, unitPrice: 150 },
        ],
        total:    500,
        currency: 'USD',
        status:   'unpaid',
        dueDate:  new Date('2024-03-10'),
        paidAmount: 0,
      },
    ];

    const payments = await Payment.insertMany(paymentData);
    console.log(`💳  Inserted ${payments.length} payments`);

    // Insert sample Notifications
    const notifData = [
      {
        recipientId: stuUser1Id,
        type:        'application_status_changed',
        title:       'Application Submitted ✅',
        message:     'Your application to University of Toronto has been submitted successfully.',
        relatedTo:   { model: 'Application', id: app1Id },
        isRead:      false,
        triggeredBy: emp1Id,
        priority:    'high',
      },
      {
        recipientId: stuUser2Id,
        type:        'application_status_changed',
        title:       'Congratulations! Offer Received 🎉',
        message:     'You have received an unconditional offer from MIT. Please confirm acceptance.',
        relatedTo:   { model: 'Application', id: app2Id },
        isRead:      false,
        triggeredBy: emp1Id,
        priority:    'urgent',
      },
      {
        recipientId: emp1Id,
        type:        'payment_due_reminder',
        title:       'Payment Due Reminder',
        message:     "Priya Sharma's visa fee invoice (INV) is due in 3 days.",
        relatedTo:   { model: 'Payment', id: payments[1]._id },
        isRead:      false,
        triggeredBy: null,
        priority:    'normal',
      },
    ];

    const notifications = await Notification.insertMany(notifData);
    console.log(`🔔  Inserted ${notifications.length} notifications`);

    console.log('\n🌱  Seed complete! Summary:');
    console.log(`    Users:         ${users.length}`);
    console.log(`    Students:      ${students.length}`);
    console.log(`    Universities:  ${universities.length}`);
    console.log(`    Applications:  ${applications.length}`);
    console.log(`    Visa Records:  ${visas.length}`);
    console.log(`    Payments:      ${payments.length}`);
    console.log(`    Notifications: ${notifications.length}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌  Seed failed:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
