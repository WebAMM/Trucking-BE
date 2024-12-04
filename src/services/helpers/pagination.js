const paginate = async (model, query, page, limit) => {
  page = parseInt(page) || 1;

  limit = parseInt(limit) || 10;

  const skip = (page - 1) * limit;

  const data = await model
    .find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalRecords = await model.countDocuments(query);

  return {
    data,
    totalRecords,
    totalPages: Math.ceil(totalRecords / limit),
    currentPage: page,
    limit,
  };
};

module.exports = paginate;
