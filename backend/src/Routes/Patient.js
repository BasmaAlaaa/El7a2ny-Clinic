// routes
const express = require('express');
const mongoose = require('mongoose');
const upload = require('./multer-config');

// controller functions
const {
    registerPatient,
    addFamMember,
    getFamMembers,
    searchDocByName,
    searchDocBySpec,
    findDocBySpecality,
    findDocByAvailability,
    addPresToPatient,
    viewMyPres,
    filterMyPresBasedOnDate,
    filterMyPresBasedOnDoctor,
    filterMyPresBasedOnFilled,
    viewDoctorsWithSessionPrices,
    viewDoctorInfo,
    viewAllMyPres,
    patientFilterAppsByDate,
    patientFilterAppsByStatus,
    allAppointments,
    choosePaymentMethodForHP,
    choosePaymentMethodForApp,
    viewWalletAmountByPatient,
    viewHealthPackages,
    viewSubscribedHealthPackages,
    viewHealthCarePackageStatus,
    cancelHealthCarePackageSubscription,
    payForAppointment,
    addMedicalHistoryDocument,
    deleteMedicalHistoryDocument,
    //viewMedicalHistoryDocuments,
    viewHealthRecords,
    patientPastApp,
    patientUpcoming,
    availableDoctorApps,
    selectAppointmentDateTime,
    selectAppointmentDateTimeFamMem,
    linkPatientAccountAsFam
} = require('../Controllers/patientController');

const router = express.Router();

// register route

router.post('/registerPatient', registerPatient)

router.post('/addFamMember/:Username', addFamMember)

router.get('/getFamMembers/:Username', getFamMembers)

router.get('/findDocBySpeciality/:Username/:Speciality', findDocBySpecality)
router.get('/findDocByAvailability/:Date/:Time', findDocByAvailability)

router.get('/searchDocByName/:Username/:Name', searchDocByName)
router.get('/searchDocBySpec/:Username/:Speciality', searchDocBySpec)

router.post('/addPresToPatient/:Username/:id', addPresToPatient)

router.get('/viewMyPres/:id', viewMyPres);

router.get('/filterMyPresBasedOnDate/:Username/:Date', filterMyPresBasedOnDate)
router.get('/filterMyPresBasedOnDoctor/:Username/:DoctorUsername', filterMyPresBasedOnDoctor)
router.get('/filterMyPresBasedOnFilled/:Username/:Filled', filterMyPresBasedOnFilled)

router.get('/viewAllDoctors/:Username', viewDoctorsWithSessionPrices)

router.get('/viewDoctorInfo/:DoctorUsername/:PatientUsername', viewDoctorInfo);

router.get('/viewAllMyPres/:Username', viewAllMyPres);

router.get('/patientFilterAppsByDate/:Username/:Date', patientFilterAppsByDate)
router.get('/patientFilterAppsByStatus/:Username/:Status', patientFilterAppsByStatus)
router.get('/allAppointments/:Username', allAppointments);

router.put('/choosePaymentMethodForHP/:type/:PatientUsername', choosePaymentMethodForHP);
router.put('/choosePaymentMethodForApp/:_id', choosePaymentMethodForApp);

router.put('/payForAppointment/:appId/:paymentMethod',payForAppointment);

router.get('/viewWalletAmountByPatient/:PatientUsername', viewWalletAmountByPatient);
router.get('/health-packages', viewHealthPackages);
router.get('/viewSubscribedHealthPackages/:Username', viewSubscribedHealthPackages);
router.get('/viewHealthCarePackageStatus/:Username', viewHealthCarePackageStatus);
router.post('/cancelHealthCarePackageSubscription/:Username/:Type', cancelHealthCarePackageSubscription);
router.get('/viewHealthPackages/:Username', viewSubscribedHealthPackages);

router.post('/addMedicalHistoryDocument/:Username', upload.single('MedicalHistoryDocuments'), addMedicalHistoryDocument);
router.delete('/deleteMedicalHistoryDocument/:Username/MedicalHistoryDocuments/:filePathToRemove', deleteMedicalHistoryDocument);
//router.get('/viewMedicalHistoryDocuments/:Username', viewMedicalHistoryDocuments);
router.get('/viewHealthRecords/:Username', viewHealthRecords);
router.get('/patientPastApp/:Username', patientPastApp);
router.get('/patientUpcoming/:Username', patientUpcoming);
router.get('/availableDoctorApps/:Username', availableDoctorApps);
router.post('/selectAppointment/:Username', selectAppointmentDateTime);
router.post('/selectAppointmentDateTimeFamMem/:Username', selectAppointmentDateTimeFamMem);

router.post('/linkPatientAccountAsFam/:PatientUsername', linkPatientAccountAsFam);
const log =require("../Controllers/loginController")

router.post('/login',log.login);
router.get('/logout',log.logout);




module.exports = router