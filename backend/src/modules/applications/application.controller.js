const service = require('./application.service');
const { sendSuccess } = require('../../utils/apiResponse');

const list   = async (req, res, next) => { try { const { applications, pagination } = await service.listApplications(req.query, req.user); sendSuccess(res, { message: 'Applications retrieved', data: { applications }, pagination }); } catch (e) { next(e); } };
const getOne = async (req, res, next) => { try { const app = await service.getApplicationById(req.params.id, req.user); sendSuccess(res, { message: 'Application retrieved', data: { application: app } }); } catch (e) { next(e); } };
const create = async (req, res, next) => { try { const app = await service.createApplication(req.body, req.user.id); sendSuccess(res, { message: 'Application created', data: { application: app }, statusCode: 201 }); } catch (e) { next(e); } };
const update = async (req, res, next) => { try { const app = await service.updateApplication(req.params.id, req.body); sendSuccess(res, { message: 'Application updated', data: { application: app } }); } catch (e) { next(e); } };
const updateStatus = async (req, res, next) => { try { const app = await service.updateApplicationStatus(req.params.id, req.body.status, req.body.note, req.user.id); sendSuccess(res, { message: 'Status updated', data: { application: app } }); } catch (e) { next(e); } };
const addNote = async (req, res, next) => { try { const note = await service.addNote(req.params.id, req.body.text, req.user.id, req.body.isPrivate); sendSuccess(res, { message: 'Note added', data: { note }, statusCode: 201 }); } catch (e) { next(e); } };
const remove  = async (req, res, next) => { try { await service.deleteApplication(req.params.id); sendSuccess(res, { message: 'Application deleted', data: null }); } catch (e) { next(e); } };

module.exports = { list, getOne, create, update, updateStatus, addNote, remove };
