const appointmentModel = require('../Models/Appointment.js');
const { default: mongoose } = require('mongoose');

// register appointment
const registerAppointment = async (req, res) => {

    const { 
        date,
        doctorID,
        patientID,
        status,
        
    } = req.body;

    try {
        const appointment = await appointmentModel.register(
            date,
            doctorID,
            patientID,
            status,
          );
          
        await appointment.save();
        res.status(200).json({appointment})
    } catch(error) {
        res.status(400).json({ error: error.message})
    }
}

module.exports = registerAppointment