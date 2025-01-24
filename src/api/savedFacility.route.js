const router = require("express").Router();
//controllers
const savedFacilityController = require("../controllers/facility/savedFacility.controller");
//middlewares
const { verifyToken } = require("../middlewares/auth.middleware");

//Add facility in saved facility for specific user
router.post("/add", verifyToken, savedFacilityController.saveFacility);

//All saved facilities for specific user
router.get("/all", verifyToken, savedFacilityController.allSavedFacilities);

// Get all the facilities for dropdown
router.get("/dropDown", verifyToken, savedFacilityController.facilitiesDropDown);

//Detail of saved facility for specific user
router.get(
  "/detail/:id",
  verifyToken,
  savedFacilityController.detailOfSavedFacility
);

//Attach the sale area later to a saved facility, /:id for saved facility id
router.put("/attach/:id", verifyToken, savedFacilityController.attachSaleArea);

//Change the status of saved facility, /:id for saved facility id
router.patch(
  "/status/:id",
  verifyToken,
  savedFacilityController.changeFacilityStatus
);

//Add contact to the user specific saved facility, /:id for saved facility id
router.post(
  "/add-contact/:id",
  verifyToken,
  savedFacilityController.addContact
);

//Edit the contact to the user specific saved facility, /:id for saved facility id
router.put(
  "/edit-contact/:id",
  verifyToken,
  savedFacilityController.editContact
);

module.exports = router;
