const express = require('express');

// controller functions
const registerPatient= require('../Controllers/patientController')

const router = express.Router();

// register route
router.post('/Register', registerPatient)

module.exports = router