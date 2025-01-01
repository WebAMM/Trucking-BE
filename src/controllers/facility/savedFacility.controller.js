//Model
const SavedFacility = require("../../models/SavedFacility.model");
const SaleArea = require("../../models/SaleArea.model");
const FacilityContact = require("../../models/FacilityContact.model.js");
//Response and errors
const { error404, error400 } = require("../../services/helpers/errors.js");
const { status200, success } = require("../../services/helpers/response.js");

//Save the facility for the user
const saveFacility = async (req, res, next) => {
  const { facilitiesInfo, saleAreaId, saleAreaName, saleAreaNote } = req.body;

  const loggedInUser = req.user;

  try {
    if (saleAreaId && saleAreaName) {
      return error400(res, "Provide either saleAreaId or saleAreaName");
    }

    //To add the facilities
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

//All the saved facilities for the user
const allSavedFacilities = async (req, res, next) => {
  const { page = 1, pageSize = 10, text, status } = req.query;
  try {
    const loggedInUser = req.user;
    filter = { userId: loggedInUser._id }
    const currentPage = parseInt(page);
    const pageLimit = parseInt(pageSize);
    const skip = (currentPage - 1) * pageLimit;
    if (status) { filter.status = status }

    let data = await SavedFacility.find(filter)
      .select("-__v -userId -contactIds")
      .populate([
        { path: "facilityId" },
        {
          path: "saleAreaId",
          select: "_id name",
        },
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit);

    data = data.filter(d => {
      const searchRegex = new RegExp(text, "i");
      const name = searchRegex.test(d.facilityId.name);

      return name
    });

    const totalData = await SavedFacility.countDocuments({
      userId: loggedInUser._id,
    });

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
    return success(res, 200, "Saved facility", response);
  } catch (err) {
    return next(err);
  }
};

//Attach the sale area to the saved facility
const attachSaleArea = async (req, res, next) => {
  const { id } = req.params;
  const { saleAreaId } = req.body;
  try {
    let existing = await SaleArea.findOne({
      _id: saleAreaId,
      savedFacilityIds: { $in: [id] }
    });

    if (existing) {
      return error400(res, "This sale area has already been assigned to this facility.");
    }

    const existsSaleArea = await SaleArea.findById(saleAreaId);
    if (existsSaleArea) {
      const existFacility = await SavedFacility.findByIdAndUpdate(
        { _id: id, },
        { saleAreaId, }
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

//Change the saved facility status [Active/Inactive]
const changeFacilityStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedFacility = await SavedFacility.findByIdAndUpdate(
      id,
      { status },
      { new: true }
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

//Detail of the saved facility
const detailOfSavedFacility = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await SavedFacility.findById(id)
      .select("-__v -userId -saleAreaId")
      .populate([
        {
          path: "contactIds",
          match: { status: "Active" },
          select: "-__v -savedFacilityId",
        },
        {
          path: "facilityId",
        },
      ]);
    if (data) {
      return success(res, 200, "Detail of facility", data);
    }
    return error404(res, "No such saved facility found");
  } catch (err) {
    return next(err);
  }
};

//Add the contacts inside the saved facility
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

//Edit the contact in the saved facility
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
