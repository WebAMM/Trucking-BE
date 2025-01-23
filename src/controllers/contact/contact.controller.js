//Model
const Facility = require("../../models/Facility.model.js");
const FacilityContact = require("../../models/FacilityContact.model");
const SavedFacility = require("../../models/SavedFacility.model.js");
const Pipeline = require('./../../models/Pipeline.model.js')
//Response and errors
const { error404, error400 } = require("../../services/helpers/errors.js");
const { status200, success, success201 } = require("../../services/helpers/response.js");

const allContact = async (req, res, next) => {
  const loggedInUser = req.user;
  try {
    // const data = await FacilityContact.find({
    //   savedFacilityId: {
    //     $in: await SavedFacility.find({
    //       userId: loggedInUser._id,
    //     }).select("_id"),
    //   },
    // }).populate({
    //   path: "savedFacilityId",
    //   select: "saleAreaId facilityId",
    //   populate: [
    //     {
    //       path: "saleAreaId",
    //       select: "name",
    //     },
    //     {
    //       path: "facilityId",
    //       select: "name",
    //     },
    //   ],
    // });

    const data = await FacilityContact.find({ userId: loggedInUser._id })
    .select("-__v -userId -addedFrom -linkedIn")
      .populate({ path: "pipelineId", select: "name _id" })
      .populate({
        path: "savedFacilityId",
        select: "saleAreaId userId contactIds",
        populate: {
          path: "saleAreaId",
          select: "name",
        },
      })


    return success(res, 200, "All contacts", data);
  } catch (err) {
    return next(err);
  }
};

const detailOfContact = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await FacilityContact.findById(id)
      .populate({
        path: "savedFacilityId",
        select: "-saleAreaId -userId -contactIds -__v",
        populate: {
          path: "facilityId",
          select: "-latitude -longitude",
        },
      })
      .select("-__v");
    if (data) {
      return success(res, 200, "All contacts", data);
    }
    return error404(res, "No such contact found");
  } catch (err) {
    return next(err);
  }
};

const createContact = async (req, res, next) => {
  try {
    const { savedFacilityId, name, title, email, phoneNo, company, linkedIn, addedFrom, location } = req.body;
    let facility = await SavedFacility.findById(savedFacilityId)
    
    if (!facility) {
      return error404(res, "Facility not found");
    }

    let userId = req.user._id
    const facilityContact = await FacilityContact.create({
      userId, name, title, email, phoneNo, company, linkedIn, addedFrom, location, savedFacilityId
    })

    await SavedFacility.findByIdAndUpdate(savedFacilityId, { $push: { contactIds: facilityContact._id } })

    success201(res, 201, "Contact created successfully.", facilityContact)
  } catch (err) {
    return next(err);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    let contact = await FacilityContact.findById(id)
    if (!contact) {
      return error404(res, "Contact not found");
    }

    const facilityContact = await FacilityContact.findByIdAndUpdate(id, { ...req.body }, { new: true })

    success(res, 200, "Contact updated successfully.", facilityContact)
  } catch (err) {
    return next(err);
  }
};

const attachPipeline = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { pipelineId } = req.body

    let contact = await FacilityContact.findById(id)
    if (!contact) {
      return error404(res, "Contact not found");
    }

    let pipeline = await Pipeline.findById({ _id: pipelineId })
    if (!pipeline) {
      return error404(res, "Pipeline not found");
    }

    const pipelineContact = await FacilityContact.findByIdAndUpdate(id, { pipelineId }, { new: true })

    success(res, 200, "Pipeline attached successfully.", pipelineContact)
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createContact,
  allContact,
  detailOfContact,
  updateContact,
  attachPipeline
};
