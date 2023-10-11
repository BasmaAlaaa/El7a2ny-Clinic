const express = require("express");
const healthPackageController = require("../Controllers/healthPackageController");
const router = express.Router();
//const authorizeAdmin = require("../middleware/authorizeAdmin");

router.get("/packages", healthPackageController.getAllPackages);
router.post("/subscribe", healthPackageController.subscribeToPackage);
router.post("/create", healthPackageController.createPackage);

router.put("/updateAnnualFee/:Type", healthPackageController.updatePackageByAnnualFee);
router.put("/updateDoctorSessionDiscount/:Type", healthPackageController.updatePackageByDoctorSessionDiscount);
router.put("/updateFamilySubscriptionDiscount/:Type", healthPackageController.updatePackageByFamilySubscriptionDiscount);
router.put("/updateMedicineDiscount/:Type", healthPackageController.updatePackageByMedicineDiscount);

router.delete("/delete/:Type", healthPackageController.deletePackage);

module.exports = router;
