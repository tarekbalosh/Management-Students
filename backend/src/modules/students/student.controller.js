const service = require('./student.service');
const { sendSuccess } = require('../../utils/apiResponse');

const list = async (req, res, next) => {
  try {
    const { students, pagination } = await service.listStudents(req.query, req.user);
    sendSuccess(res, { message: 'Students retrieved', data: { students }, pagination });
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const student = await service.getStudentById(req.params.id, req.user);
    sendSuccess(res, { message: 'Student retrieved', data: { student } });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const student = await service.createStudent(req.body);
    sendSuccess(res, { message: 'Student created', data: { student }, statusCode: 201 });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const student = await service.updateStudent(req.params.id, req.body, req.user);
    sendSuccess(res, { message: 'Student updated', data: { student } });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await service.deleteStudent(req.params.id);
    sendSuccess(res, { message: 'Student deleted', data: null });
  } catch (err) { next(err); }
};

module.exports = { list, getOne, create, update, remove };
