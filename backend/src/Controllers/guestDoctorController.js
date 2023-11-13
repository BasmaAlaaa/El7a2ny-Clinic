const guestDoctorModel = require('../Models/GuestDoctor.js');
const { default: mongoose } = require('mongoose');
const { isEmailUnique, isUsernameUnique, validatePassword } = require('../utils.js');
const upload = require('../Routes/multer-config');

// Task 3 : register Doctor
const registerGuestDoctor = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);

    const {
        Username,
        Name,
        Email,
        Password,
        DateOfBirth,
        HourlyRate,
        Affiliation,
        EDB,
        Speciality
    } = req.body;

    try {
        if (!req.files || !req.files['IDDocument'] || !req.files['MedicalDegreeDocument'] || !req.files['WorkingLicenseDocument']) {
            return res.status(400).json('Missing file(s)');
        }

        if (!(await isUsernameUnique(Username))) {
            return res.status(400).json('Username is already taken.');
        }

        if (!(await isEmailUnique(Email))) {
            return res.status(400).json('Email is already in use.');
        }

        if(!(await validatePassword(Password))){
            return res.status(400).json("Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long");
          }

        if (!Username ||
            !Name ||
            !Email ||
            !Password ||
            !DateOfBirth ||
            !HourlyRate ||
            !Affiliation ||
            !EDB ||
            !Speciality) {
            return res.status(400).json('All fields must be filled.');
        }
        
        const guestDoctor = new guestDoctorModel({
            Username,
            Name,
            Email,
            Password,
            DateOfBirth,
            HourlyRate,
            Affiliation,
            EDB,
            Speciality,
            IDDocument: {
                data: Buffer.from(req.files['IDDocument'][0].buffer),
                contentType: req.files['IDDocument'][0].mimetype,
            },
            MedicalDegreeDocument: {
                data: Buffer.from(req.files['MedicalDegreeDocument'][0].buffer),
                contentType: req.files['MedicalDegreeDocument'][0].mimetype,
            },
            WorkingLicenseDocument: {
                data: Buffer.from(req.files['WorkingLicenseDocument'][0].buffer),
                contentType: req.files['WorkingLicenseDocument'][0].mimetype,
            },
        });

        await guestDoctor.save();
        res.status(200).json({ guestDoctor });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = registerGuestDoctor;