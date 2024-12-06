const mongoose = require("mongoose");

const savedFacilitySchema = new mongoose.Schema(
  {
    facilityId: {
      type: mongoose.Types.ObjectId,
      ref: "Facility",
    },
    saleAreaId: {
      type: mongoose.Types.ObjectId,
      ref: "SaleArea",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    shortDescription: {
      type: String,
    },
    annualRevenue: {
      type: String,
    },
    industry: {
      type: String,
    },
    linkedInUrl: {
      type: String,
    },
    contactIds: {
      type: mongoose.Types.ObjectId,
    },
    eventIds: {
      type: mongoose.Types.ObjectId,
    },
    status: {
      type: String,
      enum: ["Active", "InActive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const SavedFacility = mongoose.model("SavedFacility", savedFacilitySchema);
module.exports = SavedFacility;
