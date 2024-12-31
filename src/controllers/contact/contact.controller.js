//Model
const Facility = require("../../models/Facility.model.js");
const FacilityContact = require("../../models/FacilityContact.model");
const SavedFacility = require("../../models/SavedFacility.model.js");
//Response and errors
const { error404, error400 } = require("../../services/helpers/errors.js");
const { status200, success, success201 } = require("../../services/helpers/response.js");

const allContact = async (req, res) => {
  const loggedInUser = req.user;
  try {
    const data = await FacilityContact.find({
      savedFacilityId: {
        $in: await SavedFacility.find({
          userId: loggedInUser._id,
        }).select("_id"),
      },
    }).populate({
      path: "savedFacilityId",
      select: "saleAreaId facilityId",
      populate: [
        {
          path: "saleAreaId",
          select: "name",
        },
        {
          path: "facilityId",
          select: "name",
        },
      ],
    });
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
  console.log(123456789);

  try {
    const { savedFacilityId, name, title, email, phoneNo, company, linkedIn, pipelineId, addedFrom, location } = req.body;
    let facility = await Facility.findById(savedFacilityId)
    if (!facility) {
      return error404(res, "Facility not found");
    }

    let userId = req.user._id
    const facilityContact = await FacilityContact.create({
      userId, name, title, email, phoneNo, company, linkedIn, pipelineId, addedFrom, location, savedFacilityId
    })

    success201(res, 201, "Contact created successfully.", facilityContact)
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createContact,
  allContact,
  detailOfContact,
};
