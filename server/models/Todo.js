const mongoose = require("mongoose");
const geocoder = require("../utils/geocoder");

const TodoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "text field is required"],
    maxlength: [250, "250 chars limit"],
  },
  due_date: {
    type: Date,
    default: null,
  },
  star: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    enum: ["Green", "Red", "Blue", "Yellow", "Purple", "Orange", null],
    default: null,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
    maxlength: [100, "100 chars limit"],
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    zipcode: String,
    country: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  notebook: {
    type: mongoose.Schema.ObjectId,
    ref: "Notebook",
    required: true,
  },
});

//Geocode and create location field
TodoSchema.pre("save", async function (next) {
  if (this.address) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
      type: "Point",
      coordinates: [loc[0].longitude, loc[0].latitude],
      formattedAddress: loc[0].formattedAddress,
      street: loc[0].streetName,
      city: loc[0].city,
      zipcode: loc[0].zipcode,
      country: loc[0].countryCode,
    };
    this.address = undefined;
  }

  next();
});

module.exports = mongoose.model("Todo", TodoSchema);
