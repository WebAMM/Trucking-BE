const { error400, error500, error409 } = require("../services/helpers/errors");

//Centralized error handling
const errorHandler = (err, req, res, next) => {
  //Apollo errors
  if (err?.response?.data?.error?.includes("insufficient credits")) {
    return error500(res, "Insufficient credits in Apollo");
  }
  return error500(res, "Server error");
};

module.exports = { errorHandler };
