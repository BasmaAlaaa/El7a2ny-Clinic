const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

const doctorFile = require('../Models/Doctor.js');
const patientFile = require('../Models/Patient.js');

const appointmentSchema = new Schema({    
    Date:{
        type: Date,
        required: true
    },
    DoctorID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    PatientID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },
    Status: {
        type: String,
        enum: ['Finished', 'Following', 'Upcoming'],
    }
},{ timestamps: true })

appointmentSchema.statics.register = async function (
    Date,
    DoctorID,
    PatientID,
    Status
  ) {

    // validation 
    if (!Date ||
      !DoctorID ||
      !PatientID ||
      !Status ) { 
    throw Error('All fields must be filled.');
}
    const appointment = await this.create({
      Date,
      DoctorID,
      PatientID,
      Status
    });
  
    return appointment;
  };
  const Appointment = mongoose.model('Appointment', appointmentSchema);
  module.exports = Appointment;