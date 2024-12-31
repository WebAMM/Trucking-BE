const mongoose = require("mongoose");

const savedFacilitySchema = new mongoose.Schema(
  {
    facilityId: {
      type: mongoose.Types.ObjectId,
      ref: "Facility",
      required: [true, "Facility id is required"],
    },
    //After attaching the sale area
    saleAreaId: {
      type: mongoose.Types.ObjectId,
      ref: "SaleArea",
      default: null,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
    shortDescription: {
      type: String,
      default: null,
    },
    annualRevenue: {
      type: Number,
      default: 0,
    },
    industry: {
      type: String,
      default: null,
    },
    linkedInUrl: {
      type: String,
      default: null,
    },
    contactIds: [
      {
        type: mongoose.Types.ObjectId,
        ref: "FacilityContact",
      },
    ],
    docs: [{
      name: {
        type: String,
        required: [true, "Name of picture is required"],
      },
      format: {
        type: String,
        required: [true, "Format of picture is required"],
      },
      location: {
        type: String,
        required: [true, "Location of picture is required"],
      },
      key: {
        type: String,
        required: [true, "Key of picture is required"],
      },
    }],
    // eventIds: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "Event",
    // },
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
