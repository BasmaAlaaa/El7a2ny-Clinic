// External variables
const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
/*const doctorSchema = require('../Models/Doctor.js'); // Import your Doctor model
const patientSchema = require('../../../Models/Patient.js');
const appointmentSchema = require('../../../Models/Appointment.js');*/
const { registerDoctor,
    updateDoctor,
    filterApps,
    viewInfoAndRecords,
    MyPatients,
    PatientByName,
    PatientsUpcoming,
    selectPatientWithHisName} = require('../Controllers/doctorController'); // Import the function
//const doctorController = require('../../../Controllers/doctorController.js');





const router = express.Router();

// register route
router.post('/Register', registerDoctor)

//Req 14(edit/ update my email, hourly rate or affiliation (hospital))
router.put('/updateDoctor/:id', updateDoctor);
//Req 23 (filter appointments by date/status)
router.get('/filterApps/:date/:status',filterApps)
//Req 25 (view information and health records of patient registered with me)
router.get('/viewInfoAndRecords/:id',viewInfoAndRecords)
//Req 33 (view a list of all my patients)
router.get('/MyPatients/:id',MyPatients)
//Req 34 (search for a patient by name)
router.get('/PatientByName/:name',PatientByName)
//Req 35 (filter patients based on upcoming appointments)
router.get('/PatientsUpcoming/:id',PatientsUpcoming)
//Req 36 (select a patient from the list of patients)
router.get('/selectPatientWithHisName/:doctorId/:name',selectPatientWithHisName)

module.exports = router