const express = require('express');

// controller functions
const registerGuestDoctor= require('../Controllers/guestDoctorController')

const router = express.Router();

// register route
router.post('/Register', registerGuestDoctor)

module.exports = router