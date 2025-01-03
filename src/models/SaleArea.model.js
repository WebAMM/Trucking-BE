const mongoose = require("mongoose");

const saleAreaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    note: {
      type: String,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "UserId is required"],
    },
    savedFacilityIds: [
      {
        type: mongoose.Types.ObjectId,
        ref: "SavedFacility",
      },
    ],
    // totalSavedFacility: {
    //   type: Number,
    //   default: 0,
    // },
    // contactIds: [
    //   {
    //     type: mongoose.Types.ObjectId,
    //     ref: "FacilityContact",
    //   },
    // ],
    // noOfContacts: {
    //   type: Number,
    //   default: 0,
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

const SaleArea = mongoose.model("SaleArea", saleAreaSchema);
module.exports = SaleArea;
