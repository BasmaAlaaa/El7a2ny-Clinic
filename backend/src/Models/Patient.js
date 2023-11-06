const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const Appointment = require('./Appointment');

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
    required: true,
    enum: ["Male", "Female", "female", "male"]
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
    type: String,
    ref: 'FamilyMember', // This should match the model name you defined for Patient
  }],
  PatientPrescriptions: [{
    type: Schema.Types.ObjectId,
    ref: 'Prescription', // This should match the model name you defined for Patient
  }],
  SubscribedHP: [{
    Type:{
      type: String,
      required: false,
      ref: 'HealthPackage'
    },
    DateOfSubscription:{
      type: Date,
      required: false
    },
    PaymentMethod: {
      type: String,
      default: "Wallet",
      enum: ["wallet","Wallet","Credit Card","credit card"]
    },
    PaymentStatus: {
      type: String,
      default: "Unpaid",
      enum: ["paid","unpaid","Unpaid","Paid"]
    },
    RenewalDate: {
      type: Date,
      required: false
    }
  }],
  WalletAmount:{
    type: Number,
    default: 0
  }
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
    EmergencyContactMobile,
    FamilyMembers,
    PatientPrescriptions
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
      EmergencyContactMobile,
      FamilyMembers,
      PatientPrescriptions
    });
  
    return patient;
  };
  
  const Patient = mongoose.model('Patient', patientSchema);
  module.exports = Patient;