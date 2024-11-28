const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    streetAddress: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    postalCode: {
      type: Number,
    },
    profileUrl: {
      type: String,
    },
    PhoneNumber: {
      type: String,
    },
    WebsiteURL: {
      type: String,
    },
    longitude: {
      type: String,
    },
    latitude: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Facility = mongoose.model("Facility", facilitySchema);
module.exports = Facility;
