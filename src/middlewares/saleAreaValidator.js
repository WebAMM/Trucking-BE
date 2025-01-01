const { body, check, validationResult } = require("express-validator");

const validateCreateSaleArea = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Please provide name")
        .isLength({ min: 3, max: 50 }),
    body("note").trim().isEmail().withMessage("Please enter note"),
    body("savedFacilityIds")
        .isArray()
        .withMessage("Facility IDs should be an array of ObjectIds")
        .optional()
        .custom((value) => {
            if (value && value.length > 0) {
                for (let id of value) {
                    if (!mongoose.Types.ObjectId.isValid(id)) {
                        return false;
                    }
                }
            }
            return true;
        })
        .withMessage("Each facility ID must be a valid ObjectId")];

module.exports = {
    validateCreateSaleArea,
};
