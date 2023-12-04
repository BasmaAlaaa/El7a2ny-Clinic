// External variables
const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = express.Router(); // Make sure you are creating a router object
const upload = require('../Routes/multer-config');



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
    scheduleFollowUp, 
    doctorPastApp,
    createAvailableApps,
    updateDosage,
    downloadPrescriptionPDF ,
    acceptFollowUpRequest,
    rejectFollowUpRequest,
    addPatientPrescription,
    ViewAllPres,
    updatePatientPrescription,
    addMedicineToPrescription,
    DeleteMedecineFromPrescription,
    rescheduleAppointmentPatient,
    cancelAppointmentPatient,
    cancelAppointmentPatientFamMem,
    displayDoctorNotifications,
    sendAppointmentDoctorRescheduleNotificationEmail,
    sendAppointmentDoctorCancelledNotificationEmail,


} = require('../Controllers/doctorController');

const { verify } = require('../Controllers/loginController');


// register route
router.post('/Register', upload.fields([
    { name: 'IDDocument', maxCount: 1 },
    { name: 'MedicalDegreeDocument', maxCount: 1 },
    { name: 'WorkingLicenseDocument', maxCount: 1 },
  ]), registerDoctor) ;

//Req 14(edit/ update my email, hourly rate or affiliation (hospital))
router.put('/updateDoctorByAffiliation/:Username' ,verify, updateDoctorByAffiliation);
router.put('/updateDoctorByEmail/:Username', verify, updateDoctorByEmail);
router.put('/updateDoctorByHourlyRate/:Username', verify, updateDoctorByHourlyRate);

//Req 23 (filter appointments by date/status)
router.get('/docFilterAppsByDate/:Username/:Date', verify, docFilterAppsByDate)
router.get('/docFilterAppsByStatus/:Username/:Status', verify, docFilterAppsByStatus)
router.get('/allAppointments/:Username', verify, allAppointments);

//Req 25 (view information and health records of patient registered with me)
router.get('/viewInfoAndRecords/:DoctorUsername/:PatientUsername', verify, viewInfoAndRecords)

//Req 33 (view a list of all my patients)
router.get('/MyPatients/:Username',verify,  MyPatients)

//Req 34 (search for a patient by name)
router.get('/PatientByName/:Username/:Name',verify, PatientByName)

//Req 35 (filter patients based on upcoming appointments)
router.get('/PatientsUpcoming/:Username',verify, PatientsUpcoming)

//Req 36 (select a patient from the list of patients)
router.get('/selectPatientWithHisName/:DoctorId/:Username',verify, selectPatientWithHisName)

router.post('/addDoc', verify, addDoctor);
router.get('/viewContract/:DoctorUsername', verify, viewContract);
router.post('/acceptContract/:DoctorUsername', verify, acceptContract);

router.get('/viewWalletAmountByDoc/:DoctorUsername', verify, viewWalletAmountByDoc);

// route to show the uploaded health records
router.get('/viewHealthRecords/:DoctorUsername/:PatientUsername', verify, viewHealthRecords);

// Define the route for adding a health record for a patient
router.post('/addHealthRecord/:DoctorUsername/:PatientUsername',verify, addHealthRecordForPatient);

// Route to add available time slots 
router.post('/addAvailableTimeSlots/:DoctorUsername',verify, addAvailableTimeSlots);

// Define a route for scheduling a follow-up appointment
router.post('/scheduleFollowUp/:DoctorUsername/:PatientUsername', verify, scheduleFollowUp);
router.get('/doctorPastApp/:Username', verify, doctorPastApp);
router.post('/createAvailableApps/:DoctorUsername', verify, createAvailableApps);

//Req 53: add/update dosage for each medicine added to the prescription 
router.post('/updateDosage/:DoctorUsername', verify, updateDosage);

// Define route for accepting follow-up request
router.post('/acceptFollowUpRequest/:DoctorUsername/:PatientUsername',verify, acceptFollowUpRequest);

// Define route for accepting follow-up request
router.post('/rejectFollowUpRequest/:DoctorUsername/:PatientUsername',verify, rejectFollowUpRequest);


// Define a route to trigger the download
router.get('/downloadPrescriptionPDF/:DoctorUsername', verify, downloadPrescriptionPDF);

router.post('/addMedicineToPrescription',addMedicineToPrescription)

// add patient prescription
router.post('/addPatientPrescription/:username/:PatientUsername', verify, addPatientPrescription);

router.get('/viewAllPres/:DoctorUsername/:PatientUsername', verify, ViewAllPres);

// update patient prescription
router.put('/updatePatientPrescription/:DoctorUsername/:PatientUsername/:prescriptionId', verify, updatePatientPrescription);

router.post('/DeleteMedecineFromPrescription',DeleteMedecineFromPrescription);

router.post('/rescheduleAppointment/:username/:appointmentId/:timeSlot', verify, rescheduleAppointmentPatient);

router.post('/cancelAppointmentPatient/:username/:appointmentId', verify, cancelAppointmentPatient);

router.post('/cancelAppointmentPatientFamMem/:username/:appointmentId/:familyId', verify, cancelAppointmentPatientFamMem);

router.get('/displayDoctorNotifications/:Username', verify, displayDoctorNotifications);

router.post('/sendAppointmentDoctorRescheduleNotificationEmail/:Username/:AppointmentId', verify, sendAppointmentDoctorRescheduleNotificationEmail);
router.post('/sendAppointmentDoctorCancelledNotificationEmail/:Username/:AppointmentId', verify, sendAppointmentDoctorCancelledNotificationEmail);

const log =require("../Controllers/loginController")

router.post('/login',log.login);
router.get('/logout',log.logout);
module.exports = router
