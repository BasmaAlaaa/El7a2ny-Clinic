const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const guestDoctorSchema = new Schema(
  {
    Username: {
      type: String,
      required: true,
      unique: true,
    },
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    DateOfBirth: {
      type: Date,
    },
    HourlyRate: {
      type: Number,
      required: true,
    },
    Affiliation: {
      type: String,
      required: true,
    },
    EDB: {
      type: String,
      required: true,
    },
    IsApproved: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

// static register method
guestDoctorSchema.statics.register = async function (
  Username,
  Name,
  Email,
  Password,
  DateOfBirth,
  HourlyRate,
  Affiliation,
  EDB
) {
  // validation
  if (
    !Username ||
    !Name ||
    !Email ||
    !Password ||
    !DateOfBirth ||
    !HourlyRate ||
    !Affiliation ||
    !EDB
  ) {
    throw Error("All fields must be filled.");
  }

  if (!validator.isEmail(Email)) {
    throw Error("Email must be in the form of johndoe@example.com");
  }

  const guestDoctor = await this.create({
    Username,
    Name,
    Email,
    Password,
    DateOfBirth,
    HourlyRate,
    Affiliation,
    EDB,
  });

  return guestDoctor;
};

const guestDoctor = mongoose.model("guestDoctor", guestDoctorSchema);
module.exports = guestDoctor;
