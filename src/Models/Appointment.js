const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

const doctorFile = require('../Models/Doctor.js');
const patientFile = require('../Models/Patient.js');

const appointmentSchema = new Schema({
    
    date:{
        type: Date,
        required: true
    },

    doctorID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    patientID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },
    status: {
        type: String,
        enum: ['finished', 'Following', 'upcoming'],
        required: true
    }


},{ timestamps: true })

appointmentSchema.statics.register = async function (
    date,
    doctorID,
    patientID,
    status,
    
  ) {

    // validation 
    if (!date ||
      !doctorID ||
      !patientID ||
      !status  ) { 
    throw Error('All fields must be filled.');
}


   

    const appointment = await this.create({
      date,
      doctorID,
      patientID,
      status,
      
    });
  
    return appointment;
  };
  
  const Appointment = mongoose.model('Appointment', appointmentSchema);
  module.exports = Appointment;