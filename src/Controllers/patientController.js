const patientModel = require("../Models/Patient.js");
const { default: mongoose } = require("mongoose");

// Task 1 : register patient
const registerPatient = async (req, res) => {
  const {
    Username,
    Name,
    Email,
    Password,
    DateOfBirth,
    Gender,
    MobileNumber,
    EmergencyContactName,
    EmergencyContactMobile,
  } = req.body;

  try {
    const patient = await patientModel.register(
      Username,
      Name,
      Email,
      Password,
      DateOfBirth,
      Gender,
      MobileNumber,
      EmergencyContactName,
      EmergencyContactMobile
    );

    await patient.save();
    res.status(200).json({ patient });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = registerPatient;
