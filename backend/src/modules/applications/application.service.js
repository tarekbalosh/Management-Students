const Application = require('../../models/Application');
const Notification = require('../../models/Notification');
const { parsePagination, buildPaginationMeta } = require('../../utils/pagination');

const listApplications = async (queryParams, requestingUser) => {
  const { page, limit, skip, sort } = parsePagination(queryParams);
  const filter = {};

  if (requestingUser.role === 'employee') filter.assignedTo = requestingUser.id;
  if (queryParams.studentId)    filter.studentId    = queryParams.studentId;
  if (queryParams.universityId) filter.universityId = queryParams.universityId;
  if (queryParams.status)       filter.status       = queryParams.status;
  if (queryParams.year)         filter['intake.year'] = queryParams.year;

  const [applications, total] = await Promise.all([
    Application.find(filter)
      .populate('studentId', 'firstName lastName email')
      .populate('universityId', 'name country')
      .populate('assignedTo', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Application.countDocuments(filter),
  ]);

  return { applications, pagination: buildPaginationMeta({ page, limit, total }) };
};

const getApplicationById = async (id) => {
  const app = await Application.findById(id)
    .populate('studentId')
    .populate('universityId')
    .populate('assignedTo', 'firstName lastName')
    .populate('statusHistory.changedBy', 'firstName lastName')
    .lean();

  if (!app) {
    const err = new Error('Application not found');
    err.statusCode = 404;
    throw err;
  }
  return app;
};

const createApplication = async (data, creatorId) => {
  const app = await Application.create({
    ...data,
    statusHistory: [{
      status: 'draft',
      changedBy: creatorId,
      notes: 'Initial application created',
    }]
  });
  return app;
};

const updateStatus = async (id, { status, reason, notes }, userId) => {
  const app = await Application.findById(id);
  if (!app) {
    const err = new Error('Application not found');
    err.statusCode = 404;
    throw err;
  }

  const prevStatus = app.status;
  app.status = status;
  app.statusHistory.push({
    status,
    changedBy: userId,
    reason,
    notes,
  });

  if (status === 'submitted' && !app.submittedAt) app.submittedAt = new Date();
  if (['accepted', 'rejected'].includes(status)) app.decisionDate = new Date();

  await app.save();

  // Create notification
  await Notification.create({
    recipientId: app.studentId, // We'd need to find the student's User ID if we want to notify them
    title: 'Application Status Updated',
    message: `Your application status has changed from ${prevStatus} to ${status}.`,
    type: 'application_status_changed',
    relatedTo: { model: 'Application', id: app._id },
    triggeredBy: userId,
  });

  return app;
};

const updateDocuments = async (id, documents) => {
  const app = await Application.findById(id);
  if (!app) {
    const err = new Error('Application not found');
    err.statusCode = 404;
    throw err;
  }
  app.requiredDocuments = documents;
  return await app.save();
};

const deleteApplication = async (id) => {
  const app = await Application.findById(id);
  if (!app) {
    const err = new Error('Application not found');
    err.statusCode = 404;
    throw err;
  }
  app.status = 'withdrawn'; // Mark as withdrawn before soft-deleting
  app.isDeleted = true;
  app.deletedAt = new Date();
  return await app.save();
};

module.exports = {
  listApplications,
  getApplicationById,
  createApplication,
  updateStatus,
  updateDocuments,
  deleteApplication,
};
