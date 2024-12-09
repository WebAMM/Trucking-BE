//Model
const SavedFacility = require("../../models/SavedFacility.model");
const SaleArea = require("../../models/SaleArea.model");
//Response and errors
const { error404, error400 } = require("../../services/helpers/errors.js");
const { status200, success } = require("../../services/helpers/response.js");
const FacilityContact = require("../../models/FacilityContact.model.js");

const saveFacility = async (req, res, next) => {
  const { facilitiesInfo, saleAreaId, saleAreaName, saleAreaNote } = req.body;
  try {
    const loggedInUser = req.user;
    if (saleAreaId && saleAreaName) {
      return error400(res, "Provide either saleAreaId or saleAreaName");
    }
    if (saleAreaId) {
      const existSaleArea = await SaleArea.findById(saleAreaId);
      if (existSaleArea) {
        for (let i = 0; i < facilitiesInfo.length; i++) {
          const newSavedFacility = await SavedFacility.create({
            ...facilitiesInfo[i],
            facilityId: facilitiesInfo[i].facilityId,
            saleAreaId: existSaleArea._id,
            userId: loggedInUser._id,
          });
          existSaleArea.savedFacilityIds.push(newSavedFacility._id.toString());
          existSaleArea.totalSavedFacility += 1;
        }
        await existSaleArea.save();
      } else return error404(res, "No such sale area found");
    } else if (saleAreaName) {
      const newSaleArea = await SaleArea.create({
        name: saleAreaName,
        userId: loggedInUser._id,
        note: saleAreaNote,
      });
      for (let i = 0; i < facilitiesInfo.length; i++) {
        const newSavedFacility = await SavedFacility.create({
          ...facilitiesInfo[i],
          facilityId: facilitiesInfo[i].facilityId,
          saleAreaId: newSaleArea._id.toString(),
          userId: loggedInUser._id,
        });
        newSaleArea.savedFacilityIds.push(newSavedFacility._id.toString());
        newSaleArea.totalSavedFacility += 1;
      }
      await newSaleArea.save();
    } else {
      for (let i = 0; i < facilitiesInfo.length; i++) {
        await SavedFacility.create({
          ...facilitiesInfo[i],
          facilityId: facilitiesInfo[i].facilityId,
          saleAreaId: null,
          userId: loggedInUser._id,
        });
      }
    }
    return status200(res, "Facility saved successfully");
  } catch (err) {
    return next(err);
  }
};

const allSavedFacilities = async (req, res, next) => {
  try {
    // const { data, totalRecords, totalPages, currentPage, limit } =
    //   await paginate(SavedFacility, {}, page, pageSize);
    const loggedInUser = req.user;
    const data = await SavedFacility.find({
      userId: loggedInUser._id,
    })
      .select("-__v -userId")
      .populate([
        { path: "facilityId" },
        {
          path: "saleAreaId",
          select: "_id name",
        },
      ]);

    return success(res, 200, "Saved facility", data);
  } catch (err) {
    return next(err);
  }
};

const attachSaleArea = async (req, res, next) => {
  const { id } = req.params;
  const { saleAreaId } = req.body;
  try {
    const existsSaleArea = await SaleArea.findById(saleAreaId);
    if (existsSaleArea) {
      const existFacility = await SavedFacility.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          saleAreaId,
        }
      );
      if (existFacility) {
        existsSaleArea.savedFacilityIds.push(id);
        existsSaleArea.totalSavedFacility += 1;
        await existsSaleArea.save();
        return status200(res, "Facility added in sale area");
      }
      return error404(res, "No such facility found");
    }
    return error404(res, "No such sale area found");
  } catch (err) {
    return next(err);
  }
};

const changeFacilityStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedFacility = await SavedFacility.findByIdAndUpdate(
      id,
      {
        status,
      },
      {
        new: true,
      }
    );
    if (updatedFacility) {
      return status200(
        res,
        `Facility status updated to ${updatedFacility.status}`
      );
    }
    return error404(res, "No facility found");
  } catch (err) {
    return next(err);
  }
};

const addContact = async (req, res, next) => {
  const { savedFacilityId } = req.body;
  try {
    const existsFacility = await SavedFacility.findById(savedFacilityId);
    if (existsFacility) {
      const newContact = await FacilityContact.create({
        ...req.body,
        savedFacilityId: savedFacilityId,
      });
      existsFacility.contactIds.push(newContact._id.toString());
      await existsFacility.save();
      return status200(res, "Facility contact added successfully");
    }
    return error404(res, "No such saved facility found");
  } catch (err) {
    return next(err);
  }
};

const detailOfSavedFacility = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await SavedFacility.findById(id)
      .select("-__v -facilityId -userId -saleAreaId")
      .populate({
        path: "contactIds",
        select: "-__v -savedFacilityId",
      });
    if (data) {
      return success(res, 200, "Detail of facility", data);
    }
    return error404(res, "No such saved facility found");
  } catch (err) {
    return next(err);
  }
};

const editContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const facilityUpdated = await FacilityContact.findByIdAndUpdate(id, {
      ...req.body,
    });
    if (facilityUpdated) {
      return status200(res, "Facility contact updated successfully");
    }
    return error404(res, "Facility contact not found");
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  saveFacility,
  allSavedFacilities,
  attachSaleArea,
  changeFacilityStatus,
  addContact,
  detailOfSavedFacility,
  editContact,
};
