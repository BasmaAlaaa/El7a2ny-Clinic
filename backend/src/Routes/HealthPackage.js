const express = require("express");
const healthPackageController = require("../Controllers/healthPackageController");
const router = express.Router();
//const authorizeAdmin = require("../middleware/authorizeAdmin");

router.get("/packages", healthPackageController.getAllPackages);
router.post("/subscribe", healthPackageController.subscribeToPackage);
router.post("/create", healthPackageController.createPackage);
router.put("/update/:type", healthPackageController.updatePackage);
router.delete('/delete/:type', healthPackageController.deletePackage);

module.exports = router;
