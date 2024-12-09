const { error400, error500, error409 } = require("../services/helpers/errors");

//Centralized error handling
const errorHandler = (err, req, res, next) => {
  //---Apollo Errors
  //Apollo errors of insufficient credits which client don't want
  // if (err?.response?.data?.error?.includes("insufficient credits")) {
  //   return error500(res, "Insufficient credits in Apollo");
  // }
  console.log("The error", err);
  return error500(res, "Server error");
};

module.exports = { errorHandler };
