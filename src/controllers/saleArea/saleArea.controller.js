//Model
const SaleArea = require("../../models/SaleArea.model.js");
const SavedFacility = require("../../models/SavedFacility.model.js");
//Response and errors
const { error404, error400 } = require("../../services/helpers/errors.js");
const { status200, success } = require("../../services/helpers/response.js");

const getSalesArea = async (req, res, next) => {
  const loggedInUser = req.user;
  try {
    const data = await SaleArea.find({ userId: loggedInUser._id }).select(
      "-__v -userId -savedFacilityIds"
    );
    return success(res, 200, "All sales area", data);
  } catch (err) {
    return next(err);
  }
};

const getAllFacilities = async (req, res, next) => {
  const { id } = req.params;
  const loggedInUser = req.user;
  try {
    const data = await SavedFacility.find({
      saleAreaId: id,
      userId: loggedInUser._id,
    })
      .select("-__v -userId")
      .populate({
        path: "facilityId",
      });
    // if (!data) {
    //   return error404(res, "No such sale area found");
    // }
    return success(res, 200, "All facilities of sale area", data);
  } catch (err) {
    return next(err);
  }
};

const changeStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedSaleArea = await SaleArea.findByIdAndUpdate(id, {
      status,
    });
    if (updatedSaleArea.savedFacilityIds.length) {
      await SavedFacility.updateMany({ saleAreaId: id }, { status });
    }
    return status200(
      res,
      `Sales area and all saved facilities status changed to ${status}`
    );
  } catch (err) {
    return next(err);
  }
};

//Attach sales area
// const createSaleArea = async (req, res, next) => {
//   const { facilityId, saleAreaId, name } = req.body;
//   try {
//     if (saleAreaId) {
//       const saleArea = await SaleArea.findById(saleAreaId);
//       if (saleArea) {
//         saleArea.facilityIds.push(facilityId);
//         await saleArea.save();
//         return status200(res, "Facility added to sales area");
//       } else {
//         return error404(res, "No such facility found");
//       }
//     } else if (name) {
//       const newSaleArea = new SaleArea({
//         name,
//         facilityIds: [facilityId],
//         status: "Active",
//       });
//       await newSaleArea.save();
//       return status200(res, "New sale area created successfully");
//     } else return error400(res, "SaleAreaId or name must be provided");
//   } catch (err) {
//     return next(err);
//   }
// };

module.exports = {
  // createSaleArea,
  getSalesArea,
  getAllFacilities,
  changeStatus,
};
