/**
 * Builds a MongoDB query object + pagination meta from request query params.
 *
 * Usage:
 *   const { skip, limit, page, sort } = parsePagination(req.query);
 *   const docs = await Model.find(filter).sort(sort).skip(skip).limit(limit);
 *   const total = await Model.countDocuments(filter);
 *   const pagination = buildPaginationMeta({ page, limit, total });
 */

const parsePagination = (query) => {
  const page  = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip  = (page - 1) * limit;

  // Sort: e.g. ?sort=-createdAt  → { createdAt: -1 }
  let sort = { createdAt: -1 };
  if (query.sort) {
    sort = {};
    const fields = query.sort.split(',');
    fields.forEach((field) => {
      if (field.startsWith('-')) {
        sort[field.slice(1)] = -1;
      } else {
        sort[field] = 1;
      }
    });
  }

  return { page, limit, skip, sort };
};

const buildPaginationMeta = ({ page, limit, total }) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
  hasNext:    page * limit < total,
  hasPrev:    page > 1,
});

module.exports = { parsePagination, buildPaginationMeta };
