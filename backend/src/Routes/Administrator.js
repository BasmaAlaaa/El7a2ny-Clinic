const express = require("express");

// controller functions
const adminController = require("../Controllers/adminController");

const router = express.Router();

// #Routing to adminController here

router.use(express.json());

router.post("/createAdmin", adminController.createAdmin);
router.delete("/deleteEntity/:entityType/:Username", adminController.deleteEntity);
router.delete("/deleteEntity2/:Username", adminController.deleteEntity2);
router.get("/viewUnapprovedDoctors", adminController.viewUnapprovedDoctors);
router.get("/viewDoctorInfo/:Username", adminController.viewDoctorInfo);
router.post('/acceptOrRejectDoctorRequest/:Username', adminController.acceptOrRejectDoctorRequest);
router.post("/createContract", adminController.createContract);


//app.post("/addUser",createUser);
//router.get("/doctorInfo", getDocInfo);
//app.put("/updateUser", updateUser);

module.exports = router;
