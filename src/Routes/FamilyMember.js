const express = require('express');

// controller functions
const registerFamilyMember = require('../Controllers/FamilyMemberController')

const router = express.Router();

// register route
router.post('/Register', registerFamilyMember)

module.exports = router