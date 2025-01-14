//Model
const Event = require("../../models/Event.model");
const FacilityContact = require("../../models/FacilityContact.model");
const SavedFacility = require("../../models/SavedFacility.model");
//Responses and errors
const {
  error500,
  error409,
  error404,
  customError,
  error400,
} = require("../../services/helpers/errors");
const { status200, success } = require("../../services/helpers/response");

// Create Event
const createEvent = async (req, res, next) => {
  try {
    const user = req.user;
    const { ...body } = req.body

    let company = await SavedFacility.findById(body.facilityId)
    if (!company) {
      return error404(res, "Company not found");
    }

    let contact = await FacilityContact.findById(body.contactId)
    if (!contact) {
      return error404(res, "contact not found");
    }

    await Event.create({
      ...body,
      userId: user._id
    });

    return status200(res, "Event created successfully");
  } catch (err) {
    return next(err);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { ...body } = req.body
    const { id } = req.params

    let event = await Event.findById(id)
    if (!event) {
      return error404(res, "Event not found");
    }

    let eventData = await Event.findByIdAndUpdate(id, { ...body, }, { new: true });

    return success(res, 200, "Event updated successfully.", eventData);
  } catch (err) {
    return next(err);
  }
};

const detailOfEvent = async (req, res, next) => {
  try {
    const { id } = req.params

    let event = await Event.findById(id)
      .populate("facilityId", "-userId -createdAt -updatedAt -addedFrom -pipelineId -__v")
      .populate("contactId", "-userId -createdAt -updatedAt -addedFrom -pipelineId -__v")

    if (!event) {
      return error404(res, "Event not found");
    }

    return success(res, 200, "Detail of event", event);
  } catch (err) {
    return next(err);
  }
};

const allEvents = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const user = req.user;

    if (!startDate && !endDate) {
      return error400(res, "Start and end dates are required")
    }

    // Convert startDate and endDate to Date objects
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();

    if (start > end) {
      return error400(res, "startDate cannot be later than endDate");
    }

    let events = await Event.find({
      userId: user._id,
      startDate: { $gte: start },
      endDate: { $lte: end }
    });

    return success(res, 200, "All events data", events);
  } catch (err) {
    return next(err);
  }
};


module.exports = {
  createEvent,
  updateEvent,
  detailOfEvent,
  allEvents
};
