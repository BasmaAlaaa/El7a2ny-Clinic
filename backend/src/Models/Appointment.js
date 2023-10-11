const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

const appointmentSchema = new Schema({    
    Date:{
        type: Date,
        required: true
    },
    DoctorUsername:{
        type: String,
        ref: 'Doctor'
    },
    PatientUsername:{
        type: String,
        ref: 'Patient'
    },
    Status: {
        type: String,
        default:"Upcoming",
        enum: ["Finished", "Following", "Upcoming","finished", "following", "upcoming"]
    }
},{ timestamps: true })

appointmentSchema.statics.register = async function (
    Date,
    DoctorUsername,
    PatientUsername,
    Status
  ) {

    // validation 
    if (!Date ||
      !PatientUsername ||
      !DoctorUsername ||
      !Status ) { 
    throw Error('All fields must be filled.');
}
    const appointment = await this.create({
      Date,
      DoctorUsername,
      PatientUsername,
      Status
    });
  
    return appointment;
  };
  const Appointment = mongoose.model('Appointment', appointmentSchema);
  module.exports = Appointment;