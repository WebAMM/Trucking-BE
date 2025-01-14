const router = require("express").Router();
//controllers
const contactController = require("../controllers/contact/contact.controller");
//middlewares
const { verifyToken } = require("../middlewares/auth.middleware");
const { validateCreateContact, attachPipeline } = require("../middlewares/contactValidator");

//All contacts of user
router.get("/all", verifyToken, contactController.allContact);

//Detail of the contact
router.get("/detail/:id", verifyToken, contactController.detailOfContact);

//Create contact
router.post("/create", verifyToken, validateCreateContact, contactController.createContact);

//Update contact, here id represent to contact id
router.patch("/update/:id", verifyToken, contactController.updateContact);

//Update contact and attach pipeline, here id represent to contact id
router.patch("/attachPipeline/:id", verifyToken, attachPipeline, contactController.attachPipeline);

module.exports = router;
