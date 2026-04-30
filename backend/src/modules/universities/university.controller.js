const service = require('./university.service');
const { sendSuccess } = require('../../utils/apiResponse');

const list    = async (req, res, next) => { try { const { universities, pagination } = await service.listUniversities(req.query); sendSuccess(res, { message: 'Universities retrieved', data: { universities }, pagination }); } catch (err) { next(err); } };
const getOne  = async (req, res, next) => { try { const u = await service.getUniversityById(req.params.id); sendSuccess(res, { message: 'University retrieved', data: { university: u } }); } catch (err) { next(err); } };
const create  = async (req, res, next) => { try { const u = await service.createUniversity(req.body); sendSuccess(res, { message: 'University created', data: { university: u }, statusCode: 201 }); } catch (err) { next(err); } };
const update  = async (req, res, next) => { try { const u = await service.updateUniversity(req.params.id, req.body); sendSuccess(res, { message: 'University updated', data: { university: u } }); } catch (err) { next(err); } };
const remove  = async (req, res, next) => { try { await service.deleteUniversity(req.params.id); sendSuccess(res, { message: 'University deleted', data: null }); } catch (err) { next(err); } };

// Programs
const addProgram    = async (req, res, next) => { try { const p = await service.addProgram(req.params.id, req.body); sendSuccess(res, { message: 'Program added', data: { program: p }, statusCode: 201 }); } catch (err) { next(err); } };
const updateProgram = async (req, res, next) => { try { const p = await service.updateProgram(req.params.id, req.params.programId, req.body); sendSuccess(res, { message: 'Program updated', data: { program: p } }); } catch (err) { next(err); } };
const deleteProgram = async (req, res, next) => { try { await service.deleteProgram(req.params.id, req.params.programId); sendSuccess(res, { message: 'Program deleted', data: null }); } catch (err) { next(err); } };

module.exports = { list, getOne, create, update, remove, addProgram, updateProgram, deleteProgram };
