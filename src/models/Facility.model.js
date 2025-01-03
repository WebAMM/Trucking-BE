const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    streetAddress: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    profileUrl: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    websiteURL: {
      type: String,
      required: true,
    },
    distance: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    // saleAreaId: { type: mongoose.Schema.Types.ObjectId, ref: "SaleArea" },
    location: {
      // Geo JSON Object
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], default: [0.0, 0.0] },
      address: String,
    },
  },
  { timestamps: true }
);

facilitySchema.index({ location: "2dsphere" });

const Facility = mongoose.model("Facility", facilitySchema);
module.exports = Facility;
