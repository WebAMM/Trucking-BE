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
    //Profile url represent the google map url
    profileUrl: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    //Website url represent google map url
    websiteURL: {
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
