const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    streetAddress: {
      type: String,
      required: [true, "StreetAddress is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    postalCode: {
      type: Number,
      required: [true, "PostalCode is required"],
    },
    //Profile url represent the google map url
    profileUrl: {
      type: String,
      required: [true, "ProfileUrl is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "PhoneNumber is required"],
    },
    //Website url represent google map url
    websiteURL: {
      type: String,
      required: [true, "WebsiteURL is required"],
    },
    longitude: {
      type: String,
      required: [true, "Longitude is required"],
    },
    latitude: {
      type: String,
      required: [true, "Latitude is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Facility = mongoose.model("Facility", facilitySchema);
module.exports = Facility;
