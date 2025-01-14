const router = require("express").Router();
//All routes
const userRouter = require("./user.route");
const facilityRouter = require("./facility.route");
const savedFacilityRouter = require("./savedFacility.route");
const saleAreaRouter = require("./saleArea.route");
const contactRouter = require("./contact.route");
const eventRouter = require('./event.route')
const pipelineRouter = require('./pipeline.route')


//Routes
router.use("/user", userRouter);
router.use("/facility", facilityRouter);
router.use("/saved-facility", savedFacilityRouter);
router.use("/sale-area", saleAreaRouter);
router.use("/contact", contactRouter);
router.use("/event", eventRouter)
router.use("/pipeline", pipelineRouter)

module.exports = router;
