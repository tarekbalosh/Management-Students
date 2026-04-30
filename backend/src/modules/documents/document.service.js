const Document = require('../../models/Document');
const path = require('path');
const fs = require('fs');

const createDocumentRecords = async (files, body, userId) => {
  const { studentId, documentType } = body;
  
  const records = files.map(file => ({
    studentId,
    documentType,
    originalName: file.originalname,
    storedName: file.filename,
    filePath: file.path,
    mimeType: file.mimetype,
    fileSize: file.size,
    uploadedBy: userId,
  }));

  return await Document.insertMany(records);
};

const getStudentDocuments = async (studentId) => {
  return await Document.find({ studentId }).sort({ createdAt: -1 });
};

const getAllDocuments = async (filters) => {
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.type) query.documentType = filters.type;
  
  return await Document.find(query)
    .populate('studentId', 'firstName lastName')
    .sort({ createdAt: -1 })
    .limit(50);
};

const getDocumentById = async (documentId) => {
  const doc = await Document.findById(documentId);
  if (!doc) {
    const err = new Error('Document not found');
    err.statusCode = 404;
    throw err;
  }
  return doc;
};

const updateStatus = async (documentId, status) => {
  const doc = await Document.findById(documentId);
  if (!doc) {
    const err = new Error('Document not found');
    err.statusCode = 404;
    throw err;
  }
  doc.status = status;
  return await doc.save();
};

const softDelete = async (documentId) => {
  const doc = await Document.findById(documentId);
  if (!doc) {
    const err = new Error('Document not found');
    err.statusCode = 404;
    throw err;
  }
  doc.isDeleted = true;
  doc.deletedAt = new Date();
  return await doc.save();
};

module.exports = {
  createDocumentRecords,
  getStudentDocuments,
  getAllDocuments,
  getDocumentById,
  updateStatus,
  softDelete,
};
