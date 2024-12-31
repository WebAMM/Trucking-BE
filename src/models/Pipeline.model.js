const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const pipelineSchema = new mongoose.Schema(
  {
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: "FacilityContact" },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    status: {
      type: String,
      enum: ["Active", "InActive"],
      default: "Active",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const User = mongoose.model("PIPELINE", pipelineSchema);
module.exports = User;
