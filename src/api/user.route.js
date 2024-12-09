const router = require("express").Router();
//controllers
const userController = require("../controllers/user/user.controller");
//middlewares
const { upload } = require("../services/helpers/fileHelper");

//Add the user
router.post("/add", upload.single("profilePic"), userController.addUser);

//Login the user
router.post("/login", userController.loginUser);

module.exports = router;
