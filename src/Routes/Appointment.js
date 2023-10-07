const express = require('express');
const registerAppointment = require('../../../Controllers/appointmentController');

// controller functions
const registerAppointment= require('../../../Controllers/appointmentController')

const router = express.Router();

// register route
router.post('/Register', registerAppointment)

module.exports = router