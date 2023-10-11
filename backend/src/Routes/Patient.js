// routes


const express = require('express');
const doctorSchema = require('../Models/Doctor.js');
const patientSchema = require('../Models/Patient.js');
const appointmentSchema = require('../Models/Appointment.js');
const prescriptionSchema = require('../Models/Prescription.js');
const HealthPackage = require("../Models/HealthPackage");
const mongoose = require('mongoose');
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
    allAppointments
} = require('../Controllers/patientController');

const router = express.Router();

// register route

router.post('/registerPatient', registerPatient)

router.post('/addFamMember/:Username', addFamMember)

router.get('/getFamMembers/:Username', getFamMembers)

router.get('/findDocBySpeciality/:Username/:Speciality', findDocBySpecality)
router.get('/findDocByAvailability/:Username/:Date/:Time', findDocByAvailability)

router.get('/searchDocByName/:Username/:Name', searchDocByName)
router.get('/searchDocBySpec/:Username/:Speciality', searchDocBySpec)

router.post('/addPresToPatient/:Username/:prescriptionID', addPresToPatient)

router.get('/viewMyPres/:id', viewMyPres);

router.get('/filterMyPresBasedOnDoctor/:Username/:Date', filterMyPresBasedOnDate)
router.get('/filterMyPresBasedOnDoctor/:Username/:Doctor', filterMyPresBasedOnDoctor)
router.get('/filterMyPresBasedOnDoctor/:Username/:Filled', filterMyPresBasedOnFilled)

router.get('/viewAllDoctors/:Username', viewDoctorsWithSessionPrices)

router.get('/viewDoctorInfo/:DoctorUsername/:PatientUsername', viewDoctorInfo);

router.get('/viewAllMyPres/:Username', viewAllMyPres);

router.get('/patientFilterAppsByDate/:Username/:Date',patientFilterAppsByDate)
router.get('/patientFilterAppsByStatus/:Username/:Status',patientFilterAppsByStatus)
 router.get('/allAppointments/:Username', allAppointments);

module.exports = router