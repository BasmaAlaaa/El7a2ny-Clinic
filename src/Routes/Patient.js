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
    searchDocByNameAndSpec,
    findDocBySpecalityAndavail,
    addPresToPatient,
    viewMyPres,
    filterMyPres,
    viewDoctorsWithSessionPrices

} = require('../Controllers/patientController')

const router = express.Router();

// register route

router.post('/registerPatient', registerPatient)

router.post('/addFamMember/:Username', addFamMember)

router.get('/getFamMembers/:Username', getFamMembers)

router.get('/findDocBySpecalityAndavail', findDocBySpecalityAndavail)

router.get('/searchDocByNameAndSpec', searchDocByNameAndSpec)

router.post('/addPresToPatient/:Username/:prescriptionID', addPresToPatient)

router.get('/viewMyPres/:Username', viewMyPres)

router.get('/filterMyPres/:Username', filterMyPres)

router.get('/viewAllDoctors', viewDoctorsWithSessionPrices)




module.exports = router