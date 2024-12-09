const router = require("express").Router();
//controllers
const saleAreaController = require("../controllers/saleArea/saleArea.controller");
//middlewares
const { verifyToken } = require("../middlewares/auth.middleware");

//Get all the sales area
router.get("/all", verifyToken, saleAreaController.getSalesArea);

//Get all the facilities in the sales are
router.get("/facilities/:id", verifyToken, saleAreaController.getAllFacilities);

//Change the status of sales area
router.patch("/status/:id", verifyToken, saleAreaController.changeStatus);

//Add new sales area
// router.post("/create", verifyToken, saleAreaController.createSaleArea);

module.exports = router;
