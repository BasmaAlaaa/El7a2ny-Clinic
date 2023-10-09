const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

const patientSchema = new Schema({
  Username: {
    type: String,
    required: true,
    unique: true
  },  
  Name: {
      type: String,
      required: true
  },
  Email: {
    type: String,
    required: true,
    unique: true
  },
  Password: {
    type: String,
    required: true,
  },
  DateOfBirth: {
    type: Date,
    required: true
  },
  Gender: {
    type: String,
    required: true
  },
  MobileNumber: {
    type: String,
    required: true
  },
  EmergencyContactName: {
    type: String,
    required: true
  },
  EmergencyContactMobile: {
    type: String,
    required: true
  },
  FamilyMembers: [{
    type: Schema.Types.ObjectId,
    ref: 'FamilyMember', // This should match the model name you defined for Patient
  }],
  PatientPrescriptions: [{
    type: Schema.Types.ObjectId,
    ref: 'Prescription', // This should match the model name you defined for Patient
  }],

  }, { timestamps: true });

  // static register method
  patientSchema.statics.register = async function (
    Username,
    Name,
    Email,
    Password,
    DateOfBirth,
    Gender,
    MobileNumber,
    EmergencyContactName,
    EmergencyContactMobile
  ) {

    // validation 
    if (!Username ||
      !Name ||
      !Email ||
      !Password ||
      !DateOfBirth ||
      !Gender ||
      !MobileNumber ||
      !EmergencyContactName ||
      !EmergencyContactMobile ) { 
    throw Error('All fields must be filled.');
    }
    if (!validator.isEmail(Email)) {
      throw Error('Email must be in the form of johndoe@example.com');
    }

    const patient = await this.create({
      Username,
      Name,
      Email,
      Password,
      DateOfBirth,
      Gender,
      MobileNumber,
      EmergencyContactName,
      EmergencyContactMobile
    });
  
    return patient;
  };
  
  const Patient = mongoose.model('Patient', patientSchema);
  module.exports = Patient;