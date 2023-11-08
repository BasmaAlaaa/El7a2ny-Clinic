// External variables
const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = express.Router(); // Make sure you are creating a router object
const upload = require('../Routes/multer-config');
/*const doctorSchema = require('../Models/Doctor.js'); // Import your Doctor model
const patientSchema = require('../../../Models/Patient.js');
const appointmentSchema = require('../../../Models/Appointment.js');*/
const { registerDoctor,
    viewInfoAndRecords,
    MyPatients,
    PatientByName,
    PatientsUpcoming,
    selectPatientWithHisName,
    addDoctor,
    updateDoctorByAffiliation,
    updateDoctorByHourlyRate,
    updateDoctorByEmail,
    docFilterAppsByDate,
    docFilterAppsByStatus,
    allAppointments,
    viewContract,
    acceptContract,
    viewWalletAmountByDoc ,
    addHealthRecordForPatient,
    viewHealthRecords ,
    addAvailableTimeSlots ,
    scheduleFollowUp
} = require('../Controllers/doctorController'); // Import the function

// register route
router.post('/Register', upload.fields([
    { name: 'IDDocument', maxCount: 1 },
    { name: 'MedicalDegreeDocument', maxCount: 1 },
    { name: 'WorkingLicenseDocument', maxCount: 1 },
  ]), registerDoctor) ;

//Req 14(edit/ update my email, hourly rate or affiliation (hospital))
router.put('/updateDoctorByAffiliation/:Username', updateDoctorByAffiliation);
router.put('/updateDoctorByEmail/:Username', updateDoctorByEmail);
router.put('/updateDoctorByHourlyRate/:Username', updateDoctorByHourlyRate);

//Req 23 (filter appointments by date/status)
router.get('/docFilterAppsByDate/:Username/:Date',docFilterAppsByDate)
router.get('/docFilterAppsByStatus/:Username/:Status',docFilterAppsByStatus)
router.get('/allAppointments/:Username', allAppointments);

//Req 25 (view information and health records of patient registered with me)
router.get('/viewInfoAndRecords/:DoctorUsername/:PatientUsername',viewInfoAndRecords)

//Req 33 (view a list of all my patients)
router.get('/MyPatients/:Username',MyPatients)

//Req 34 (search for a patient by name)
router.get('/PatientByName/:Username/:Name',PatientByName)

//Req 35 (filter patients based on upcoming appointments)
router.get('/PatientsUpcoming/:Username',PatientsUpcoming)

//Req 36 (select a patient from the list of patients)
router.get('/selectPatientWithHisName/:DoctorId/:Username',selectPatientWithHisName)

router.post('/addDoc', addDoctor);
router.get('/viewContract/:DoctorUsername', viewContract);
router.post('/acceptContract/:DoctorUsername', acceptContract);

router.get('/viewWalletAmountByDoc/:DoctorUsername', viewWalletAmountByDoc);

// route to show the uploaded health records
router.get('/viewHealthRecords/:DoctorUsername/:PatientUsername', viewHealthRecords);



// Define the route for adding a health record for a patient
router.post('/addHealthRecord/:DoctorUsername/:PatientUsername',addHealthRecordForPatient);

// Route to add available time slots 
router.post('/addAvailableTimeSlots/:DoctorUsername',addAvailableTimeSlots);

// Define a route for scheduling a follow-up appointment
router.post('/schedule-follow-up', scheduleFollowUp);


const log =require("../Controllers/loginController")

router.post('/login',log.login);
router.get('/logout',log.logout);

module.exports = router
