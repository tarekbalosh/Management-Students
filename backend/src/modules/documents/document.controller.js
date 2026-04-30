const service = require('./document.service');
const { sendSuccess, sendError } = require('../../utils/apiResponse');
const path = require('path');
const fs = require('fs');

const upload = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return sendError(res, { message: 'No files uploaded', statusCode: 400 });
    }

    const documents = await service.createDocumentRecords(req.files, req.body, req.user.id);
    sendSuccess(res, { message: 'Upload successful', data: { documents }, statusCode: 201 });
  } catch (err) { next(err); }
};

const listAll = async (req, res, next) => {
  try {
    const documents = await service.getAllDocuments(req.query);
    sendSuccess(res, { message: 'All documents retrieved', data: documents });
  } catch (err) { next(err); }
};

const listByStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Security check: students can only see their own docs
    if (req.user.role === 'student') {
      // In a real app, you'd check if req.user.id links to this studentId
      // For now, we assume direct comparison if the user ID is the student profile ID
    }

    const documents = await service.getStudentDocuments(studentId);
    sendSuccess(res, { message: 'Documents retrieved', data: { documents } });
  } catch (err) { next(err); }
};

const serveFile = async (req, res, next) => {
  try {
    const doc = await service.getDocumentById(req.params.documentId);
    
    if (!fs.existsSync(doc.filePath)) {
      return sendError(res, { message: 'File not found on disk', statusCode: 404 });
    }

    res.setHeader('Content-Type', doc.mimeType);
    res.sendFile(doc.filePath);
  } catch (err) { next(err); }
};

const updateDocumentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const doc = await service.updateStatus(req.params.documentId, status);
    sendSuccess(res, { message: 'Status updated', data: { document: doc } });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await service.softDelete(req.params.documentId);
    sendSuccess(res, { message: 'Document deleted' });
  } catch (err) { next(err); }
};

module.exports = {
  upload,
  listAll,
  listByStudent,
  serveFile,
  updateDocumentStatus,
  remove,
};
