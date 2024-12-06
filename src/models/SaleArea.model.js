const mongoose = require("mongoose");

const saleAreaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    facilityIds: [
      {
        type: mongoose.Types.ObjectId,
        ref: "SavedFacility",
      },
    ],
    noOfFacility: {
      type: Number,
      default: 0,
    },
    note: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Active", "InActive"],
      default: "InActive",
    },
  },
  {
    timestamps: true,
  }
);

const SaleArea = mongoose.model("SaleArea", saleAreaSchema);
module.exports = SaleArea;
