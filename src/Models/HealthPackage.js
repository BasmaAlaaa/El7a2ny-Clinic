const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const HealthPackageSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true,
  },
  annualFee: {
    type: Number,
    required: true,
  },
  doctorSessionDiscount: {
    type: Number,
    required: true,
    min: 0, // Minimum percentage
    max: 100, // Maximum percentage
  },
  medicineDiscount: {
    type: Number,
    required: true,
    min: 0, // Minimum percentage
    max: 100, // Maximum percentage
  },
  familySubscriptionDiscount: {
    type: Number,
    required: true,
    min: 0, // Minimum percentage
    max: 100, // Maximum percentage
  },
});

module.exports = mongoose.model("HealthPackage", HealthPackageSchema);
