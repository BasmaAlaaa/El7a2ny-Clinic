const express = require("express");

// controller functions
const adminController = require("../Controllers/adminController");

const router = express.Router();

// #Routing to adminController here

router.use(express.json());
router.post("/createAdmin", adminController.createAdmin);

//app.post("/addUser",createUser);
//router.get("/doctorInfo", getDocInfo);
//app.put("/updateUser", updateUser);
router.delete("/deleteEntity/:entityType/:Username", adminController.deleteEntity);
router.delete("/deleteEntity2/:Username", adminController.deleteEntity2);

module.exports = router;
