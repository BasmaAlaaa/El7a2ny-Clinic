const doctorModel = require('../Models/Doctor.js')
const appointmentSchema = require('../Models/Appointment.js')
const doctorSchema = require('../Models/Doctor.js')
const patientSchema = require('../Models/Patient.js')
const prescriptionModel = require('../Models/Prescription.js')

const registerPrescription = async (req, res) => {
    const {
        DoctorUsername,
        PatientUsername,
        Description,
        Date,
        Appointment_ID,
        Filled
    } = req.body

    try {
        const prescription = await prescriptionModel.register(
            DoctorUsername,
            PatientUsername,
            Description,
            Date,
            Appointment_ID,
            Filled
        )

        await prescription.save();
        res.status(200).json({ prescription });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


module.exports = registerPrescription