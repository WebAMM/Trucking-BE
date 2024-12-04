const router = require("express").Router();
//controller
const saleAreaController = require("../controllers/saleArea/saleArea.controller");

//Add new sales area
router.post("/add", saleAreaController.addSaleArea);
