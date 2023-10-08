const guestDoctorModel = require('../Models/GuestDoctor');
const { default: mongoose } = require('mongoose');

// Task 3 : register Doctor
const registerGuestDoctor = async (req, res) => {

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
        const guestDoctor = await guestDoctorModel.register(
            Username,
            Name,
            Email,
            Password,
            DateOfBirth,
            HourlyRate,
            Affilation,
            EDB
          );
          
        await guestDoctor.save();
        res.status(200).json({guestDoctor})
    } catch(error) {
        res.status(400).json({ error: error.message})
    }
}

module.exports = registerGuestDoctor;