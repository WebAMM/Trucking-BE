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
    company: {
      type: String,
      required: [true, "Company is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phoneNo: {
      type: String,
      required: [true, "PhoneNo is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Male", "Female", "Other"],
      default: "Male"
    },
    dob: {
      type: String,
      required: [true, "DOB is required"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
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
      default: "User",
      required: [true, "Role is required"],
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
