//Model
const FacilityContact = require("../../models/FacilityContact.model");
const SavedFacility = require("../../models/SavedFacility.model.js");
//Response and errors
const { error404, error400 } = require("../../services/helpers/errors.js");
const { status200, success } = require("../../services/helpers/response.js");

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
    const data = await FacilityContact.findById(id).populate({
      path: "savedFacilityId",
      populate: {
        path: "facilityId",
      },
    });
    if (data) {
      return success(res, 200, "All contacts", data);
    }
    return error404(res, "No such contact found");
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  allContact,
  detailOfContact,
};
