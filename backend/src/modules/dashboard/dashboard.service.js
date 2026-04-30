const Student = require('../../models/Student');
const Application = require('../../models/Application');
const Payment = require('../../models/Payment');
const VisaTracking = require('../../models/VisaTracking');
const Notification = require('../../models/Notification');
const mongoose = require('mongoose');

const getDashboardStats = async (requestingUser) => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Filter based on role (employees only see their data)
  const filterByAssigned = requestingUser.role === 'employee' ? { assignedTo: requestingUser.id } : {};

  // 1. KPI Counts
  const [
    totalStudents,
    newStudentsThisMonth,
    totalApplications,
    applicationStatusCounts,
    totalPayments,
    visaStats,
  ] = await Promise.all([
    Student.countDocuments({ ...filterByAssigned, isDeleted: false }),
    Student.countDocuments({ ...filterByAssigned, createdAt: { $gte: firstDayOfMonth }, isDeleted: false }),
    Application.countDocuments({ ...filterByAssigned, isDeleted: false }),
    Application.aggregate([
      { $match: { ...filterByAssigned, isDeleted: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    Payment.aggregate([
      { $match: { isDeleted: false } },
      { $group: { 
        _id: null, 
        totalAmount: { $sum: '$paidAmount' }, 
        pendingAmount: { 
          $sum: { $cond: [{ $in: ['$status', ['unpaid', 'partially_paid']] }, { $subtract: ['$total', '$paidAmount'] }, 0] } 
        } 
      }}
    ]),
    VisaTracking.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])
  ]);

  // 2. Applications by Month (Last 12 months)
  const applicationsByMonth = await Application.aggregate([
    {
      $match: {
        ...filterByAssigned,
        createdAt: { $gte: new Date(now.getFullYear() - 1, now.getMonth(), 1) },
        isDeleted: false
      }
    },
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // 3. Recent Activity
  const recentApplications = await Application.find({ ...filterByAssigned, isDeleted: false })
    .populate('studentId', 'firstName lastName')
    .populate('universityId', 'name')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const recentNotifications = await Notification.find({ recipientId: requestingUser.id, isRead: false })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // Format Status Breakdown
  const appStatus = applicationStatusCounts.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});

  const visaStatus = visaStats.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});

  return {
    totalStudents,
    newStudentsThisMonth,
    totalApplications,
    pendingApplications: (appStatus['submitted'] || 0) + (appStatus['under_review'] || 0),
    acceptedApplications: appStatus['accepted'] || 0,
    rejectedApplications: appStatus['rejected'] || 0,
    totalPaymentsAmount: totalPayments[0]?.totalAmount || 0,
    pendingPayments: totalPayments[0]?.pendingAmount || 0,
    visaApproved: visaStatus['approved'] || 0,
    visaPending: (visaStatus['submitted'] || 0) + (visaStatus['processing'] || 0),
    applicationsByMonth: applicationsByMonth.map(item => ({
      month: `${item._id.month}/${item._id.year}`,
      count: item.count
    })),
    recentApplications,
    recentNotifications
  };
};

module.exports = { getDashboardStats };
