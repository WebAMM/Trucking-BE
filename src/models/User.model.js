const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "FullName is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    company: { type: String },
    title: { type: String },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phoneNo: { type: String },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Male"
    },
    dob: { type: String },
    country: { type: String },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    resetPassOtp: {
      code: {
        type: Number,
        default: null,
      },
      expiresAt: {
        type: Date,
        default: null,
      },
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
      default: "User",
      required: [true, "Role is required"],
    },
    createdBy: {
      type: String,
      enum: ["Self", "Admin", ],
      default: "Self",
      required: [true, "CreatedBy is required"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = 10;
    this.password = bcryptjs.hashSync(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
