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
    company: {
      type: String,
      required: [true, "Company is required"],
    },
    linkedIn: {
      type: String,
      required: [true, "LinkedIn is required"],
    },
    pipelineId: { type: mongoose.Schema.Types.ObjectId, ref: "Pipeline" },
    addedFrom: {
      type: String,
      enum: ["Apollo", "App"],
      required: [true, "Added From is required"],
      default: "App"
    },
    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], default: [0.0, 0.0] },
      address: String,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "UserId is required"],
    },
    status: {
      type: String,
      enum: ["Active", "InActive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

facilityContactSchema.index({ location: "2dsphere" });

const FacilityContact = mongoose.model(
  "FacilityContact",
  facilityContactSchema
);
module.exports = FacilityContact;
