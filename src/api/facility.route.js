const router = require("express").Router();
//controller
const facilityController = require("../controllers/facility/facility.controller");

//All facility
router.get("/all", facilityController.allFacility);

//Detail of facility
router.get("/detail/:id", facilityController.detailOfFacility);

module.exports = router;
