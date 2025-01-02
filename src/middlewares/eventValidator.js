const { body, check, validationResult } = require("express-validator");

const validateCreateEvent = [
  body("notes")
    .isLength({ min: 1 })
    .withMessage("Notes is required"),
  body("startDate")
    .isISO8601()
    .withMessage("Start date must be a valid date"),
  body("endDate")
    .isISO8601()
    .withMessage("End date must be a valid date")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
  body("companyId")
    .notEmpty()
    .withMessage("Company ID is required")
    .isMongoId()
    .withMessage("Company ID must be a valid MongoDB ObjectId"),
  body("contactId")
    .notEmpty()
    .withMessage("Contact ID is required")
    .isMongoId()
    .withMessage("Contact ID must be a valid MongoDB ObjectId"),
];

module.exports = {
  validateCreateEvent,
};
