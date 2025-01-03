const router = require("express").Router();
//controllers
const eventController = require("../controllers/event/event.controller");
//middlewares
const { verifyToken } = require("../middlewares/auth.middleware");
const { validateCreateEvent } = require("../middlewares/eventValidator");

//Create Event
router.post("/create", verifyToken, validateCreateEvent, eventController.createEvent);

//Update Event, here id represent event id
router.patch("/update/:id", verifyToken, eventController.updateEvent);

//Event detail, here id represent event id
router.get("/detail/:id", verifyToken, eventController.detailOfEvent);

//Get Event of user
router.get("/all", verifyToken, eventController.allEvents);

module.exports = router;
