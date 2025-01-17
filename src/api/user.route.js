const router = require("express").Router();
//controllers
const userController = require("../controllers/user/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
//middlewares
const { upload } = require("../services/helpers/fileHelper");

//Add the user
router.post("/add", upload.single("profilePic"), userController.addUser);

//Login the user
router.post("/login", userController.loginUser);

//generate reset password email and OTP
router.post("/reset-password", userController.generateResetPasswordEmailWithOTP);

//Verify otp of reset password email
router.post("/reset-password/otp/verify", userController.verifyResetPasswordOTP);

//User update password
router.patch("/update/password", userController.updateUserPassword);

// update password
router.patch("/update-password", verifyToken, userController.updatePassword);

// update profile
router.patch("/update-profile", verifyToken, userController.updateProfile);

// Get users for admin
router.get("/getAllUsers", verifyToken, userController.getAllUsers);

module.exports = router;
