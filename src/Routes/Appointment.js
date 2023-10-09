const express = require('express');
const registerAppointment = require('../Controllers/appointmentController');

// controller functions
const router = express.Router();

// register route
router.post('/Register', registerAppointment)

module.exports = router