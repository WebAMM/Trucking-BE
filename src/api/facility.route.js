const router = require("express").Router();
//controller
const facilityController = require("../controllers/facility/facility.controller");

//All facility, using the organization bulk api of Apollo
router.get("/all", facilityController.allFacility);

//Detail of facility, using the organization detail api of Apollo
router.get("/detail/:id", facilityController.detailOfFacility);

//Company contact list, using people search api of Apollo
router.get("/contact-list/:orgId", facilityController.facilityContactList);

//Save the facility to saved facilities
router.post("/save", facilityController.saveFacility);

//Get the saved facility
router.get("/saved-facility", facilityController.allSavedFacilities);

//Attach the sale area to the facility
router.put("/attach-saleArea/:id", facilityController.attachSaleArea);

module.exports = router;
