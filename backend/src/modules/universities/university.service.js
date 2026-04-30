const University = require('../../models/University');
const { parsePagination, buildPaginationMeta } = require('../../utils/pagination');

const listUniversities = async (queryParams) => {
  const { page, limit, skip, sort } = parsePagination(queryParams);
  const filter = {};
  if (queryParams.country)             filter.country = new RegExp(queryParams.country, 'i');
  if (queryParams.search)              filter.$text   = { $search: queryParams.search };
  if (queryParams['programs.degree'])  filter['programs.degree']       = queryParams['programs.degree'];
  if (queryParams['programs.field'])   filter['programs.fieldOfStudy'] = new RegExp(queryParams['programs.field'], 'i');

  const [universities, total] = await Promise.all([
    University.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    University.countDocuments(filter),
  ]);
  return { universities, pagination: buildPaginationMeta({ page, limit, total }) };
};

const getUniversityById = async (id) => {
  const u = await University.findById(id).lean();
  if (!u) { const e = new Error('University not found'); e.statusCode = 404; throw e; }
  return u;
};

const createUniversity = async (data) => University.create(data);

const updateUniversity = async (id, data) => {
  const u = await University.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!u) { const e = new Error('University not found'); e.statusCode = 404; throw e; }
  return u;
};

const deleteUniversity = async (id) => {
  const u = await University.findById(id);
  if (!u) { const e = new Error('University not found'); e.statusCode = 404; throw e; }
  u.isDeleted = true; u.deletedAt = new Date(); u.isActive = false;
  await u.save();
};

// ── Programs sub-resource ──────────────────────
const addProgram = async (universityId, programData) => {
  const u = await University.findById(universityId);
  if (!u) { const e = new Error('University not found'); e.statusCode = 404; throw e; }
  u.programs.push(programData);
  await u.save();
  return u.programs[u.programs.length - 1];
};

const updateProgram = async (universityId, programId, data) => {
  const u = await University.findById(universityId);
  if (!u) { const e = new Error('University not found'); e.statusCode = 404; throw e; }
  const prog = u.programs.id(programId);
  if (!prog) { const e = new Error('Program not found'); e.statusCode = 404; throw e; }
  Object.assign(prog, data);
  await u.save();
  return prog;
};

const deleteProgram = async (universityId, programId) => {
  const u = await University.findById(universityId);
  if (!u) { const e = new Error('University not found'); e.statusCode = 404; throw e; }
  const prog = u.programs.id(programId);
  if (!prog) { const e = new Error('Program not found'); e.statusCode = 404; throw e; }
  prog.deleteOne();
  await u.save();
};

module.exports = {
  listUniversities, getUniversityById, createUniversity, updateUniversity, deleteUniversity,
  addProgram, updateProgram, deleteProgram,
};
