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
  NationalID: {
    type: String,
    required: true,
    unique: true
  },
  Email: {
    type: String,
    required: true,
    unique: true
  },
  Password: {
    type: String,
    required: true
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
    ref: 'FamilyMember', // This should match the model name you defined for FamilyMember
  }],
  PatientPrescriptions: [{
    type: Schema.Types.ObjectId,
    ref: 'Prescription', // This should match the model name you defined for Prescription
  }],
  StripeCustomerId: {
    type: String,
    required: false
  },
  SubscribedHP: [{
    Type: {
      type: String,
      required: false,
      ref: 'HealthPackage'
    },
    PaymentMethod: {
      type: String,
      default: "card",
      enum: ["wallet", "card"]
    },
    Status: {
      type: String,
      enum: ['Subscribed', 'Unsubscribed', 'Cancelled'],
      default: 'Unsubscribed',
    },
    SubscriptionStartDate: {
      type: Date,
      default: null,
    },
    SubscriptionEndDate: {
      type: Date,
      default: null,
    },
    CancellationDate: {
      type: Date,
      default: null,
    },
    RenewalDate: {
      type: Date,
      required: false
    },
  }],
  WalletAmount: {
    type: Number,
    default: 0
  },
  HealthRecords: [
    {
      // Define the structure of a health record
      Date: {
        type: Date
      },
      Description:{
        type: String
      },
      Diagnosis: {
        type: String
      },
      Medication: {
        type: String
      }
      // Other relevant fields
    }
  ],
  MedicalHistoryDocuments: [
    {
      type: String,
    },
  ],
  
  }, { timestamps: true });
  


// static register method
patientSchema.statics.register = async function (
  Username,
  Name,
  NationalID,
  Email,
  Password,
  DateOfBirth,
  Gender,
  MobileNumber,
  EmergencyContactName,
  EmergencyContactMobile,
  FamilyMembers,
  PatientPrescriptions,
  SubscribedHP,
  StripeCustomerId
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
    !EmergencyContactMobile ||
    !NationalID) {
    throw Error('All fields must be filled.');
  }

  if (!validator.isEmail(Email)) {
    throw Error('Email must be in the form of johndoe@example.com');
  }

  const patient = await this.create({
    Username,
    Name,
    NationalID,
    Email,
    Password,
    DateOfBirth,
    Gender,
    MobileNumber,
    EmergencyContactName,
    EmergencyContactMobile,
    FamilyMembers,
    PatientPrescriptions,
    SubscribedHP,
    StripeCustomerId
  });
  
    return patient;
  
};
const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
