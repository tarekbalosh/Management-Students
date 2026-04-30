const Visa = require('../../models/Visa');
const Application = require('../../models/Application');

const getByApplicationId = async (applicationId) => {
  return await Visa.findOne({ applicationId })
    .populate('studentId', 'firstName lastName email nationality')
    .populate('applicationId', 'status universityId');
};

const createRecord = async (data, userId) => {
  const existing = await Visa.findOne({ applicationId: data.applicationId });
  if (existing) {
    throw new Error('Visa record already exists for this application');
  }

  const visa = new Visa({
    ...data,
    stageHistory: [{
      stage: data.currentStage || 'documents_preparation',
      updatedBy: userId,
      notes: 'Record initialized',
      updatedAt: new Date()
    }]
  });

  return await visa.save();
};

const updateStage = async (id, stageData, userId) => {
  const visa = await Visa.findById(id);
  if (!visa) throw new Error('Visa record not found');

  visa.currentStage = stageData.stage;
  
  // Add to history
  visa.stageHistory.push({
    ...stageData,
    updatedBy: userId,
    updatedAt: new Date()
  });

  // Update specific top-level details if provided
  if (stageData.stage === 'embassy_appointment' && stageData.appointmentDate) {
    visa.embassyDetails.appointmentDate = stageData.appointmentDate;
    if (stageData.appointmentLocation) visa.embassyDetails.address = stageData.appointmentLocation;
  }

  if (stageData.stage === 'visa_approved' && stageData.visaNumber) {
    visa.visaDetails.number = stageData.visaNumber;
    visa.visaDetails.issuedDate = stageData.validFrom;
    visa.visaDetails.expiryDate = stageData.validTo;
  }

  if (stageData.stage === 'visa_rejected' && stageData.rejectionReason) {
    // We could add rejection logic here if top-level fields existed for it
  }

  return await visa.save();
};

const addReminder = async (id, reminderData) => {
  const visa = await Visa.findById(id);
  if (!visa) throw new Error('Visa record not found');

  visa.reminders.push({
    ...reminderData,
    sent: false
  });

  return await visa.save();
};

const getStats = async () => {
  const total = await Visa.countDocuments();
  const approved = await Visa.countDocuments({ currentStage: 'visa_approved' });
  const rejected = await Visa.countDocuments({ currentStage: 'visa_rejected' });

  // Average processing time (documents_preparation to visa_approved)
  const approvedVisas = await Visa.find({ currentStage: 'visa_approved' });
  let totalDays = 0;
  
  approvedVisas.forEach(v => {
    const start = v.createdAt;
    const end = v.stageHistory.find(h => h.stage === 'visa_approved')?.updatedAt || v.updatedAt;
    totalDays += (end - start) / (1000 * 60 * 60 * 24);
  });

  // Stats by university (requires aggregation)
  const statsByUniversity = await Visa.aggregate([
    {
      $lookup: {
        from: 'applications',
        localField: 'applicationId',
        foreignField: '_id',
        as: 'application'
      }
    },
    { $unwind: '$application' },
    {
      $lookup: {
        from: 'universities',
        localField: 'application.universityId',
        foreignField: '_id',
        as: 'university'
      }
    },
    { $unwind: '$university' },
    {
      $group: {
        _id: '$university.name',
        total: { $sum: 1 },
        approved: {
          $sum: { $cond: [{ $eq: ['$currentStage', 'visa_approved'] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        university: '$_id',
        total: 1,
        approved: 1,
        rate: { $multiply: [{ $divide: ['$approved', '$total'] }, 100] }
      }
    }
  ]);

  return {
    total,
    approvalRate: total > 0 ? (approved / total) * 100 : 0,
    rejectionRate: total > 0 ? (rejected / total) * 100 : 0,
    avgProcessingTimeDays: approvedVisas.length > 0 ? totalDays / approvedVisas.length : 0,
    statsByUniversity
  };
};

module.exports = {
  getByApplicationId,
  createRecord,
  updateStage,
  addReminder,
  getStats
};

