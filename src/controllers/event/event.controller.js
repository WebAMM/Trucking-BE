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
} = require("../../services/helpers/errors");
const { status200, success } = require("../../services/helpers/response");

// Create Event
const createEvent = async (req, res, next) => {
  try {
    const user = req.user;
    const { ...body } = req.body

    let company = await SavedFacility.findById(body.companyId)
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

module.exports = {
  createEvent,
  updateEvent,
};
