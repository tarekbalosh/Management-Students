const service = require('./payment.service');
const { sendSuccess } = require('../../utils/apiResponse');

const list = async (req, res, next) => {
  try {
    const { payments, pagination } = await service.listPayments(req.query);
    sendSuccess(res, { message: 'Invoices retrieved', data: { payments }, pagination });
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const payment = await service.getPaymentById(req.params.id);
    sendSuccess(res, { message: 'Invoice retrieved', data: { payment } });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const payment = await service.createPayment(req.body);
    sendSuccess(res, { message: 'Invoice created', data: { payment }, statusCode: 201 });
  } catch (err) { next(err); }
};

const recordTransaction = async (req, res, next) => {
  try {
    const payment = await service.recordTransaction(req.params.id, req.body, req.user.id);
    sendSuccess(res, { message: 'Transaction recorded', data: { payment } });
  } catch (err) { next(err); }
};

const updateStatus = async (req, res, next) => {
  try {
    const payment = await service.updateStatus(req.params.id, req.body.status);
    sendSuccess(res, { message: 'Status updated', data: { payment } });
  } catch (err) { next(err); }
};

const summary = async (req, res, next) => {
  try {
    const stats = await service.getPaymentSummary();
    sendSuccess(res, { message: 'Financial summary retrieved', data: stats });
  } catch (err) { next(err); }
};

const generatePDF = async (req, res, next) => {
  try {
    const pdfBuffer = await service.generatePDF(req.params.id);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${req.params.id}.pdf`);
    res.send(pdfBuffer);
  } catch (err) { next(err); }
};

module.exports = { list, getOne, create, recordTransaction, updateStatus, summary, generatePDF };

