const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

const doctorSchema = new Schema({
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
  HourlyRate:{
      type: Number,
      required: true,
  },
  Affiliation:{
      type:String,
      required: true
  },
  EDB:{
    type:String,
    required: true
  },
  PatientsUsernames: [{
    type: String,
    ref: 'Patient', // This should match the model name you defined for Patient
  }],
  Speciality:{
    type: String,
    required: true,
    enum:["dermatology","dentistry","psychiatry","neurology","orthopedics","Dermatology","Dentistry","Psychiatry","Neurology","Orthopedics"]

  },
  Schedule: [
    {
      Date:{
        type: Date,
       // required: true
      },
      From:{
        type:Number,
      //  required:true
      },
      To: {
        type:Number,
       // required:true
      }
    }
  ],
  WalletAmount:{
    type: Number,
    default: 0
  },
  IDDocument: {
    type: String,
  },
  MedicalDegreeDocument: {
    type: String,
  },
  WorkingLicenseDocument: {
    type: String,
  } ,
 



}, { timestamps: true });

  // static register method
  doctorSchema.statics.register = async function (
    Username,
    Name,
    Email,
    Password,
    DateOfBirth,
    HourlyRate,
    Affiliation,
    EDB,
    PatientsUsernames,
    Speciality,
    Schedule    
  ) {

    // validation 
    if (!Username ||
      !Name ||
      !Email ||
      !Password ||
      !DateOfBirth ||
      !HourlyRate ||
      !Affiliation ||
      !EDB ||
      !Speciality ||
      !Schedule) 
      { 
    throw Error('All fields must be filled.');
}
    if (!validator.isEmail(Email)) {
      throw Error('Email must be in the form of johndoe@example.com');
    }

    const doctor = await this.create({
      Username,
      Name,
      Email,
      Password,
      DateOfBirth,
      HourlyRate,
      Affiliation,
      EDB,
      PatientsUsernames,
      Speciality,
      Schedule
    });
  
    return doctor;
  };

  const Doctor = mongoose.model('Doctor', doctorSchema);
  module.exports = Doctor;