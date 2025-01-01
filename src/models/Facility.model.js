const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    industry: {
      type: String,
      required: [true, "Industry is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "PhoneNumber is required"],
    },
    //Website url represent google map url
    companyURL: {
      type: String,
      required: [true, "CompanyURL is required"],
    },
    linkedin: {
      type: String,
      required: [true, "Linkedin is required"],
    },
    revenue: {
      type: Number,
      required: [true, "Revenue is required"],
    },
    //Profile url represent the google map url
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    saleAreaId: { type: mongoose.Schema.Types.ObjectId, ref: "SaleArea" },
    meetingNotes: { type: String },
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
