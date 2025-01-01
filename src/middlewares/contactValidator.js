const { body, validationResult } = require("express-validator");
const mongoose = require('mongoose'); // For ObjectId validation

const validateCreateContact = [
    body("savedFacilityId")
        .isMongoId()
        .withMessage("Saved Facility ID must be a valid ObjectId")
        .notEmpty()
        .withMessage("Saved Facility ID is required"),
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 1 })
        .withMessage("Name must be a non-empty string"),
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 1 })
        .withMessage("Title must be a non-empty string"),
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .notEmpty()
        .withMessage("Email is required"),
    body("phoneNo")
        .notEmpty()
        .withMessage("Phone number is required")
        .matches(/^[0-9+\-()\s]*$/)
        .withMessage("Phone number is not in a valid format"),
    body("company")
        .trim()
        .notEmpty()
        .withMessage("Company is required")
        .isLength({ min: 1 })
        .withMessage("Company must be a non-empty string"),
    body("linkedIn")
        .trim()
        .notEmpty()
        .withMessage("LinkedIn URL is required")
        .isURL()
        .withMessage("LinkedIn must be a valid URL"),
    body("pipelineId")
        .optional()
        .isMongoId()
        .withMessage("Pipeline ID must be a valid ObjectId"),
    body("addedFrom")
        .isIn(["Apollo", "App"])
        .withMessage("Added From must be either 'Apollo' or 'App'")
        .notEmpty()
        .withMessage("Added From is required"),
    body("location")
        .optional()
        .isObject()
        .withMessage("Location must be an object")
        .custom((value) => {
            if (value && value.coordinates) {
                const coordinates = value.coordinates;
                if (!Array.isArray(coordinates) || coordinates.length !== 2 ||
                    typeof coordinates[0] !== "number" || typeof coordinates[1] !== "number") {
                    throw new Error("Coordinates must be an array with two numeric values [longitude, latitude]");
                }
            }
            return true;
        })
        .withMessage("Coordinates must be an array with two numeric values [longitude, latitude]")
];

module.exports = {
    validateCreateContact,
};
