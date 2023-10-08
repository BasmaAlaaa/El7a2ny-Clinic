const guestDoctorModel = require('../Models/GuestDoctor.js');
const { default: mongoose } = require('mongoose');
const {isEmailUnique, isUsernameUnique}=require('../utils.js');

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

        if (!(await isUsernameUnique(Username))) {
            throw new Error('Username is already taken.');
        }
        
        if (!(await isEmailUnique(Email))) {
            throw new Error('Email is already in use.');
        }

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