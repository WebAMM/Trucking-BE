const router = require("express").Router();
//All routes
const facilityRouter = require("./facility.route");

//Routes
router.use("/facility", facilityRouter);

module.exports = router;
