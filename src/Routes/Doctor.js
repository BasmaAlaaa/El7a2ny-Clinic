const express = require('express');

// controller functions
const registerDoctor= require('../Controllers/doctorController')

const router = express.Router();

// register route
router.post('/Register', registerDoctor)

module.exports = router