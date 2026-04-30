const Student = require('../../models/Student');
const { parsePagination, buildPaginationMeta } = require('../../utils/pagination');

const listStudents = async (queryParams, requestingUser) => {
  const { page, limit, skip, sort } = parsePagination(queryParams);
  const filter = {};

  if (requestingUser.role === 'employee') filter.assignedTo = requestingUser.id;
  if (queryParams.status)      filter.status      = queryParams.status;
  if (queryParams.nationality) filter.nationality = new RegExp(queryParams.nationality, 'i');
  if (queryParams.assignedTo)  filter.assignedTo  = queryParams.assignedTo;
  if (queryParams.search)      filter.$text       = { $search: queryParams.search };

  const [students, total] = await Promise.all([
    Student.find(filter, 'firstName lastName email phone nationality status registrationDate assignedTo')
      .populate('assignedTo', 'firstName lastName email')
      .populate('applicationsCount')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Student.countDocuments(filter),
  ]);

  return { students, pagination: buildPaginationMeta({ page, limit, total }) };
};

const getStudentById = async (id, requestingUser) => {
  const student = await Student.findById(id)
    .populate('assignedTo', 'firstName lastName email')
    .populate('applicationsCount')
    .lean();

  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }

  if (requestingUser.role === 'employee' && student.assignedTo?._id?.toString() !== requestingUser.id.toString()) {
    const err = new Error('Access denied');
    err.statusCode = 403;
    throw err;
  }

  return student;
};

const createStudent = async (data) => {
  const exists = await Student.findOne({ email: data.email });
  if (exists) {
    const err = new Error('Student with this email already exists');
    err.statusCode = 409;
    throw err;
  }
  return await Student.create(data);
};

const updateStudent = async (id, data, requestingUser) => {
  const student = await Student.findById(id);
  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }

  if (requestingUser.role === 'employee' && student.assignedTo?.toString() !== requestingUser.id.toString()) {
    const err = new Error('Access denied');
    err.statusCode = 403;
    throw err;
  }

  Object.assign(student, data);
  return await student.save();
};

const deleteStudent = async (id) => {
  const student = await Student.findById(id);
  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }
  return await student.softDelete();
};

module.exports = { listStudents, getStudentById, createStudent, updateStudent, deleteStudent };
