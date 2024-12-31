const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    otp: {
      type: Number,
      required: [true, "OTP is required"],
    },
    isVerified: {
      type: Boolean,
      required: [true, "IsVerified is required"],
      default: false
    },
    expiresAt: {
      type: Date,
      required: [true, "expiresAt is required"],
      default: Date.now()
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const User = mongoose.model("OTP", otpSchema);
module.exports = User;
