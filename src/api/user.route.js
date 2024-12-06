const router = require("express").Router();
//controller
const userController = require("../controllers/user/user.controller");
//helper
const { upload } = require("../services/helpers/fileHelper");

//Add the user
router.post("/add", upload.single("profilePic"), userController.addUser);

//Login the user
router.post("/login", userController.loginUser);

module.exports = router;
