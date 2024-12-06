const router = require("express").Router();
//controller
const facilityController = require("../controllers/facility/facility.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

//All facility, using the organization bulk api of Apollo
router.get("/all", facilityController.allFacility);

//Detail of facility, using the organization detail api of Apollo
router.get("/detail/:id", facilityController.detailOfFacility);

//Company contact list, using people search api of Apollo
router.get("/contact-list/:orgId", facilityController.facilityContactList);

//Save the facility to saved facilities
router.post("/save", verifyToken, facilityController.saveFacility);

//Get the saved facility
router.get(
  "/saved-facility",
  verifyToken,
  facilityController.allSavedFacilities
);

//Attach the sale area to the facility later on using the listing
router.put("/attach-sale-area/:id", facilityController.attachSaleArea);

//Change status of facility
router.patch(
  "/status/:id",
  verifyToken,
  facilityController.changeFacilityStatus
);

module.exports = router;
