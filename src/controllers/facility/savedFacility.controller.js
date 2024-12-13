//Model
const SavedFacility = require("../../models/SavedFacility.model");
const SaleArea = require("../../models/SaleArea.model");
const FacilityContact = require("../../models/FacilityContact.model.js");
//Response and errors
const { error404, error400 } = require("../../services/helpers/errors.js");
const { status200, success } = require("../../services/helpers/response.js");

const saveFacility = async (req, res, next) => {
  const { facilitiesInfo, saleAreaId, saleAreaName, saleAreaNote } = req.body;

  const loggedInUser = req.user;

  try {
    if (saleAreaId && saleAreaName) {
      return error400(res, "Provide either saleAreaId or saleAreaName");
    }

    const createFacilities = async (saleArea, facilities) => {
      const savedFacilities = await Promise.all(
        facilities.map(async (facility) => {
          const newFacility = await SavedFacility.create({
            ...facility,
            facilityId: facility.facilityId,
            saleAreaId: saleArea._id.toString(),
            userId: loggedInUser._id,
          });
          saleArea.savedFacilityIds.push(newFacility._id.toString());
          saleArea.totalSavedFacility += 1;
        })
      );
      await saleArea.save();
      return savedFacilities;
    };

    if (saleAreaId) {
      const saleArea = await SaleArea.findById(saleAreaId);
      if (!saleArea) {
        return error404(res, "Sale area not found");
      }
      await createFacilities(saleArea, facilitiesInfo);
      return status200(res, "Facilities saved successfully in sale area");
    }

    if (saleAreaName) {
      const newSaleArea = await SaleArea.create({
        name: saleAreaName,
        userId: loggedInUser._id,
        note: saleAreaNote,
      });

      await createFacilities(newSaleArea, facilitiesInfo);
      return status200(res, "Facilities saved in new sale area");
    }

    await Promise.all(
      facilitiesInfo.map(async (facility) => {
        await SavedFacility.create({
          ...facility,
          facilityId: facility.facilityId,
          saleAreaId: null,
          userId: loggedInUser._id,
        });
      })
    );

    return status200(res, "Facilities saved successfully");
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
  const { id } = req.params;
  try {
    const existsFacility = await SavedFacility.findById(id);
    if (existsFacility) {
      const newContact = await FacilityContact.create({
        ...req.body,
        savedFacilityId: id,
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
        match: { status: "Active" },
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
