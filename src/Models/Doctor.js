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
  Affilation:{
      type:String,
      required: true
  },
  EDB:{
    type:String,
    required: true
  }
}, { timestamps: true });

  // static register method
  doctorSchema.statics.register = async function (
    Username,
    Name,
    Email,
    Password,
    DateOfBirth,
    HourlyRate,
    Affilation,
    EDB
    
  ) {

    // validation 
    if (!Username ||
      !Name ||
      !Email ||
      !Password ||
      !DateOfBirth ||
      !HourlyRate ||
      !Affilation ||
      !EDB ) { 
    throw Error('All fields must be filled.');
}


    if (!validator.isEmail(Email)) {
      throw Error('Email must be in the form of johndoe@example.com');
    }
    
    const existsUsername = await this.findOne({ Username });
    const existsEmail = await this.findOne({ Email });
  
    if (existsUsername) {
      throw new Error('Username is already taken.');
    }
  
    if (existsEmail) {
      throw new Error('Email is already in use.');
    }

    const doctor = await this.create({
      Username,
      Name,
      Email,
      Password,
      HourlyRate,
      Affilation,
      EDB
    });
  
    return doctor;
  };
  
  const Doctor = mongoose.model('Doctor', doctorSchema);
  module.exports = Doctor;