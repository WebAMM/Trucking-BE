//imports from packages
const { body, check, validationResult } = require("express-validator");

const validateLogin = [
  body("email").trim().isEmail().withMessage("Please enter a valid email"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Please enter password")
    .isLength({ min: 6, max: 25 })
    .withMessage("Password must be between 6 and 25 characters long"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
    } else {
      return res
        .status(400)
        .json({ error: errors.array().map((error) => error.msg) });
    }
  },
];

module.exports = {
  validateLogin,
};
