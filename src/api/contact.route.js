const router = require("express").Router();
//controllers
const contactController = require("../controllers/contact/contact.controller");
//middlewares
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/all", verifyToken, contactController.allContact);

router.get("/detail/:id", verifyToken, contactController.detailOfContact);

module.exports = router;
