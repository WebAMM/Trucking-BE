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

module.exports = router;
