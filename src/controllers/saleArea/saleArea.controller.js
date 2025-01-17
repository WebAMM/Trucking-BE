const mongoose = require('mongoose');
//Model
const Facility = require("../../models/Facility.model.js");
const SaleArea = require("../../models/SaleArea.model.js");
const SavedFacility = require("../../models/SavedFacility.model.js");
const FacilityContact = require("../../models/FacilityContact.model.js");
//Response and errors
const { error404, error400 } = require("../../services/helpers/errors.js");
const { status200, success } = require("../../services/helpers/response.js");

//Get all the sales area of a user
const getSalesArea = async (req, res, next) => {
  const { page = 1, pageSize = 10, text, status } = req.query;
  const loggedInUser = req.user;
  try {
    const currentPage = parseInt(page);
    const pageLimit = parseInt(pageSize);
    const skip = (currentPage - 1) * pageLimit;
    //Search based on name and status of sale area according to logged in user
    let query = {
      userId: loggedInUser._id,
    };

    text ? query.name = { $regex: text, $options: "i" } : undefined
    status ? query.status = status : undefined

    let data = await SaleArea.find(query)
      .select("-__v -userId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit)
      .lean();

    await Promise.all(data.map(async (saleArea) => {
      let facilityIds = saleArea?.savedFacilityIds;

      let contacts = await FacilityContact.countDocuments({ savedFacilityId: { $in: facilityIds } });

      // Assign the necessary values to the saleArea object
      saleArea.contacts = contacts;
      saleArea.facilities = facilityIds.length;

      delete saleArea.savedFacilityIds;
    }));

    const totalData = await SaleArea.countDocuments(query);
    const totalPages = Math.ceil(totalData / pageLimit);

    const response = {
      data,
      pagination: {
        totalItems: totalData,
        totalPages,
        currentPage,
        limit: pageLimit,
      },
    };

    return success(res, 200, "All sales area", response);
  } catch (err) {
    return next(err);
  }
};

//Get all the facilities of the sale area of a user
const getAllFacilities = async (req, res, next) => {
  const { page = 1, pageSize = 10 } = req.query;
  const { id } = req.params;
  const loggedInUser = req.user;
  try {
    const currentPage = parseInt(page);
    const pageLimit = parseInt(pageSize);
    const skip = (currentPage - 1) * pageLimit;

    const data = await SavedFacility.find({
      saleAreaId: id,
      userId: loggedInUser._id,
    })
      .select("-__v -userId -contactIds")
      .populate({
        path: "facilityId",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit);

    const totalData = await SavedFacility.countDocuments({
      saleAreaId: id,
      userId: loggedInUser._id,
    });

    const totalPages = Math.ceil(totalData / pageSize);

    const response = {
      data,
      pagination: {
        totalItems: totalData,
        totalPages,
        currentPage,
        limit: pageLimit,
      },
    };
    return success(res, 200, "Facilities inside sale area", response);
  } catch (err) {
    return next(err);
  }
};

//Change the status of the sale area
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

//Change the status of the sale area
const createSaleArea = async (req, res, next) => {
  const { name, note, savedFacilityIds } = req.body;

  try {
    const saleArea = await SaleArea.create({ userId: req.user._id, name, note });

    if (savedFacilityIds) {
      for (const id of savedFacilityIds) {
        const facility = await Facility.findById(id);
        if (!facility) {
          return error404(res, "Facility not found");
        }
      }

      // Add facility ids
      const updatedSaleArea = await SaleArea.findByIdAndUpdate(
        saleArea._id,
        { $push: { savedFacilityIds: { $each: savedFacilityIds } } },
        { new: true }
      );
    }

    return status200(
      res,
      `New sale area created successfully`
    );

  } catch (err) {
    // Catch errors and pass them to the next middleware (for error handling)
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
  createSaleArea,
  getSalesArea,
  getAllFacilities,
  changeStatus,
};
