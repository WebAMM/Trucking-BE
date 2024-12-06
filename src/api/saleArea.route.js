const router = require("express").Router();
//controller
const saleAreaController = require("../controllers/saleArea/saleArea.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

//Add new sales area
router.post("/create", verifyToken, saleAreaController.createSaleArea);

//Get all the sales area
router.get("/all", verifyToken, saleAreaController.getSalesArea);

//Get all the facilities in the sales are
router.get("/all-facilities/:id", verifyToken, saleAreaController.getAllFacilities);

module.exports = router;
