const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const EventSchema = new mongoose.Schema(
  {
    facilityId: { type: mongoose.Schema.Types.ObjectId, ref: "SavedFacility" },
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: "FacilityContact" },
    notes: {
      type: String,
      required: [true, "Notes is required"],
    },
    meetingNotes: { type: String, },
    startDate: {
      type: Date,
      required: [true, "startDate is required"],
      default: Date.now()
    },
    endDate: {
      type: Date,
      required: [true, "endDate is required"],
      default: Date.now()
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const User = mongoose.model("Event", EventSchema);
module.exports = User;
