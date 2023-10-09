const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const Doctor = require('./Doctor.js');
const Patient = require('./Patient.js');
const Appointment = require('./Appointment.js');

const prescriptionSchema = new Schema({

    DoctorUsername: {
        type: String,
        required: true,
    },

    PatientUsername: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    Date: {
        type: Date,
        required: true,

    },
    Appointment_ID: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'Appointment'
    },
    Filled: {
        type: Boolean,
        required: true,

    }

}, { timestamps: true });







prescriptionSchema.statics.register = async function (
    DoctorUsername,
    PatientUsername,
    Description,
    Date,
    Appointment_ID,
    Filled

) {

    // validation 
    if (!DoctorUsername ||
        !PatientUsername ||
        !Date ||
        !Description ||
        !Appointment_ID ||
        !Filled) {
        throw Error('All fields must be filled.');
    }






    const prescription = await this.create({
        DoctorUsername,
        PatientUsername,
        Description,
        Date,
        Appointment_ID,
        Filled
    });

    return prescription;
};


function generateRandom4DigitNumber() {
    const min = 1000; // Minimum 4-digit number
    const max = 9999; // Maximum 4-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



const Prescription = mongoose.model('Prescription', prescriptionSchema);
module.exports = Prescription;