const paginate = async (model, query, page, limit) => {
  page = parseInt(page) || 1;

  limit = parseInt(limit) || 10;

  const skip = (page - 1) * limit;

  const data = await model
    .find(query)
    .sort("-createdAt")
    .skip(skip)
    .limit(limit)
    .lean();

  const totalRecord = await model.countDocuments(query);

  return {
    data,
    totalRecord,
    totalPages: Math.ceil(totalRecord / limit),
    currentPage: page,
    limit,
  };
};

module.exports = paginate;
