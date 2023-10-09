const appointmentModel = require('../Models/Appointment.js');
const { default: mongoose } = require('mongoose');
const ObjectID = require('mongodb').ObjectID;

// register appointment
const registerAppointment = async (req, res) => {
    const { 
        Date,
        DoctorID,
        PatientID,
        Status
    } = req.body;

    try {
        
        const appointment = await appointmentModel.register(
            Date,
            DoctorID,
            PatientID,
            Status
          ); 
        await appointment.save();
        res.status(200).json({appointment})
    } catch(error) {
        res.status(400).json({ error: error.message})
    }
}

module.exports = registerAppointment;