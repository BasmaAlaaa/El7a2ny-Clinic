const doctorModel = require('../Models/Doctor.js');
const { default: mongoose } = require('mongoose');

// register Doctor
const registerDoctor = async (req, res) => {

    const { 
        Username,
        Name,
        Email,
        Password,
        DateOfBirth,
        HourlyRate,
        Affilation,
        EDB

    } = req.body;

    try {
        const doctor = await doctorModel.register(
            Username,
            Name,
            Email,
            Password,
            DateOfBirth,
            HourlyRate,
            Affilation,
            EDB
          );
          
        await doctor.save();
        res.status(200).json({doctor})
    } catch(error) {
        res.status(400).json({ error: error.message})
    }
}

module.exports = registerDoctor;