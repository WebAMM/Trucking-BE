const router = require("express").Router();
//controllers
const facilityController = require("../controllers/facility/facility.controller");

//All facilities, enriching using the organization bulk Api of Apollo
router.get("/all", facilityController.allFacility);

//Detail of facility, enriching the organization detail using the Api of Apollo
router.get("/detail/:id", facilityController.detailOfFacility);

//Company contact list, using people search api of Apollo
// router.get("/contact-list/:orgId", facilityController.facilityContactList);

module.exports = router;
