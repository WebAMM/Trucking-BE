const router = require("express").Router();
//controllers
const savedFacilityController = require("../controllers/facility/savedFacility.controller");
//middlewares
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/add", verifyToken, savedFacilityController.saveFacility);

router.get("/all", verifyToken, savedFacilityController.allSavedFacilities);

router.get(
  "/detail/:id",
  verifyToken,
  savedFacilityController.detailOfSavedFacility
);

router.put("/attach/:id", verifyToken, savedFacilityController.attachSaleArea);

router.patch(
  "/status/:id",
  verifyToken,
  savedFacilityController.changeFacilityStatus
);

router.post("/add-contact/:id", verifyToken, savedFacilityController.addContact);

router.put(
  "/edit-contact/:id",
  verifyToken,
  savedFacilityController.editContact
);

module.exports = router;
