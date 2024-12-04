//Model
const SaleArea = require("../../models/SaleArea.model.js");
//Response and errors
const {
  error500,
  error404,
  error400,
} = require("../../services/helpers/errors.js");
const { status200, success } = require("../../services/helpers/response.js");

//Attach sales area
const attachSaleArea = async (req, res, next) => {
  const { facilityId, saleAreaId, name } = req.body;
  try {
    if (saleAreaId) {
      const saleArea = await SaleArea.findById(saleAreaId);
      if (saleArea) {
        saleArea.facilityIds.push(facilityId);
        await saleArea.save();
        return status200(res, "Facility added to sales area");
      } else {
        return error404(res, "No such facility found");
      }
    } else if (name) {
      const newSaleArea = new SaleArea({
        name,
        facilityIds: [facilityId],
        status: "Active",
      });
      await newSaleArea.save();
      return status200(res, "New sale area created successfully");
    } else return error400(res, "SaleAreaId or name must be provided");
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  attachSaleArea,
};
