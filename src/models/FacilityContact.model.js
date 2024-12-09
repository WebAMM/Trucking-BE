const mongoose = require("mongoose");

const facilityContactSchema = new mongoose.Schema(
  {
    savedFacilityId: {
      type: mongoose.Types.ObjectId,
      ref: "SavedFacility",
      required: [true, "Saved facility id is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    phoneNo: {
      type: String,
      required: [true, "Phone no is required"],
    },
    linkedIn: {
      type: String,
      required: [true, "LinkedIn is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
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

const FacilityContact = mongoose.model(
  "FacilityContact",
  facilityContactSchema
);
module.exports = FacilityContact;
