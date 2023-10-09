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
  PatientsIDs:[{
    type: Schema.Types.ObjectId,
    ref: 'Patient', // This should match the model name you defined for Patient
  }],
});

module.exports = mongoose.model("HealthPackage", HealthPackageSchema);
