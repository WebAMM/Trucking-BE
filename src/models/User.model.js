const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    profileImage: {
      publicUrl: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
      format: {
        type: String,
        default: "",
      },
    },
    role: {
      type: String,
      enum: ["SuperAdmin", "Admin", "User"],
      required: [true, "Please provide role"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
