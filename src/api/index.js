const router = require("express").Router();
//All routes
const facilityRouter = require("./facility.route");
const userRouter = require("./user.route");
const saleAreaRouter = require("./saleArea.route");

//Routes
router.use("/user", userRouter);
router.use("/facility", facilityRouter);
router.use("/sale-area", saleAreaRouter);

module.exports = router;
