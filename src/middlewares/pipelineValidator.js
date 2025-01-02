const { body, validationResult } = require("express-validator");


const validateCreatePipeline = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required and not empty")
    .isString().withMessage("Name must be a string"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateCreatePipeline };
