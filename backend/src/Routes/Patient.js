// routes
const express = require("express");
const mongoose = require("mongoose");
const upload = require("./multer-config");

// controller functions
const {
  registerPatient,
  addFamMember,
  getFamMembers,
  searchDocByName,
  searchDocBySpec,
  findDocBySpecality,
  findDocByAvailability,
  addPresToPatient,
  viewMyPres,
  filterMyPresBasedOnDate,
  filterMyPresBasedOnDoctor,
  filterMyPresBasedOnFilled,
  viewDoctorsWithSessionPrices,
  viewDoctorInfo,
  viewAllMyPres,
  patientFilterAppsByDate,
  patientFilterAppsByStatus,
  allAppointments,
  choosePaymentMethodForHP,
  viewWalletAmountByPatient,
  viewHealthPackages,
  viewSubscribedHealthPackages,
  viewHealthCarePackageStatus,
  viewHealthPackageStatus,
  cancelHealthCarePackageSubscription,
  addMedicalHistoryDocument,
  deleteMedicalHistoryDocument,
  viewMedicalHistoryDocuments,
  viewHealthRecords,
  patientPastApp,
  patientUpcoming,
  availableDoctorApps,
  selectAppointmentDateTimeAndPayFam,
  linkPatientAccountAsFam,
  selectAppointmentDateTimeAndPay,
  subscribeToAHealthPackage,
  downloadPrescriptionPDF,
  AddRefundForPatient,
  requestFollowUpAppointment,
  requestFollowUpForFamilyMember,
  ViewAllPres,
  ViewPresDetails,
} = require("../Controllers/patientController");

const router = express.Router();

const { verify } = require("../Controllers/loginController");

// register route

router.post("/registerPatient", registerPatient);

router.post("/addFamMember/:Username", verify, addFamMember);

router.get("/getFamMembers/:Username", verify, getFamMembers);

router.get("/findDocBySpeciality/:Username/:Speciality", verify, findDocBySpecality);
router.get("/findDocByAvailability/:Username/:Date/:Time", verify, findDocByAvailability);

router.get("/searchDocByName/:Username/:Name", verify, searchDocByName);
router.get("/searchDocBySpec/:Username/:Speciality", verify, searchDocBySpec);

router.post("/addPresToPatient/:Username/:id", verify, addPresToPatient);

router.get("/viewMyPres/:id", verify, viewMyPres);

router.get("/filterMyPresBasedOnDate/:Username/:Date", verify, filterMyPresBasedOnDate);
router.get("/filterMyPresBasedOnDoctor/:Username/:DoctorUsername", verify, filterMyPresBasedOnDoctor);

router.get("/filterMyPresBasedOnFilled/:Username/:Filled", verify, filterMyPresBasedOnFilled);

router.get("/viewAllDoctors/:Username", verify, viewDoctorsWithSessionPrices);

router.get("/viewDoctorInfo/:DoctorUsername/:PatientUsername", verify, viewDoctorInfo);

router.get("/viewAllMyPres/:Username", verify, viewAllMyPres);

router.get("/patientFilterAppsByDate/:Username/:Date", verify, patientFilterAppsByDate);
router.get("/patientFilterAppsByStatus/:Username/:Status", verify, patientFilterAppsByStatus);

router.get("/allAppointments/:Username", verify, allAppointments);

router.put("/choosePaymentMethodForHP/:type/:PatientUsername", verify, 
  choosePaymentMethodForHP
);

router.get(
  "/viewWalletAmountByPatient/:PatientUsername",verify, 
  viewWalletAmountByPatient
);
router.get("/health-packages/:Username", verify, viewHealthPackages);
router.get(
  "/viewSubscribedHealthPackages/:Username",verify, 
  viewSubscribedHealthPackages
);
router.post(
  "/cancelHealthCarePackageSubscription/:Username/:Type",verify, 
  cancelHealthCarePackageSubscription
);
router.get("/viewHealthPackages/:Username", verify, viewSubscribedHealthPackages);
router.post(
  "/subscribeToAHealthPackage/:patientUsername/:healthPackageType",verify, 
  subscribeToAHealthPackage
);
router.get(
  "/viewHealthCarePackageStatus/:Username/:healthPackageType",verify, 
  viewHealthCarePackageStatus
);
router.get(
  "/viewHealthPackageStatus/:Username/:healthPackageType",verify, 
  viewHealthPackageStatus
);

router.post(
  "/addMedicalHistoryDocument/:Username",verify, 
  upload.single("MedicalHistoryDocuments"),
  addMedicalHistoryDocument
);
router.delete(
  "/deleteMedicalHistoryDocument/:Username/:filePathToRemove",verify, 
  deleteMedicalHistoryDocument
);
router.get(
  "/viewMedicalHistoryDocuments/:Username",verify, 
  viewMedicalHistoryDocuments
);
router.get("/viewHealthRecords/:Username", verify, viewHealthRecords);

router.get("/patientPastApp/:Username", verify, patientPastApp);
router.get("/patientUpcoming/:Username", verify, patientUpcoming);
router.get("/availableDoctorApps/:Username", verify,availableDoctorApps);
router.post(
  "/selectAppointment/:patientUsername/:timeSlot/:doctorUsername",verify, 
  selectAppointmentDateTimeAndPay
);
router.post(
  "/selectAppointmentDateTimeFamMem/:patientUsername/:timeSlot/:doctorUsername",verify, 
  selectAppointmentDateTimeAndPayFam
);
// router.get('/patientPastApp/:Username', patientPastApp);
// router.get('/patientUpcoming/:Username', patientUpcoming);
// router.get('/availableDoctorApps/:Username', availableDoctorApps);
// router.post('/selectAppointmentDateTimeFamMem/:Username', selectAppointmentDateTimeFamMem);

// Define a route to trigger the download
router.get("/downloadPrescriptionPDF/:patientUsername/:doctorUsername", verify, downloadPrescriptionPDF);

router.post(
  "/AddRefundForPatient/:username/:appointmentId",verify, 
  AddRefundForPatient
);
router.post(
  "/requestFollowUpAppointment/:username/:appointmentId",verify, 
  requestFollowUpAppointment
);
router.post(
  "/requestFollowUpForFamilyMember/:patientusername/:doctorUsername",verify ,
  requestFollowUpForFamilyMember
);

router.post(
  "/linkPatientAccountAsFam/:PatientUsername",verify, 
  linkPatientAccountAsFam
);
router.get("/ViewAllPres/:PatientUsername", verify, ViewAllPres);
router.get("/ViewPresDetails/:PatientUsername/:id", verify, ViewPresDetails);

const log = require("../Controllers/loginController");

router.post("/login", log.login);
router.get("/logout", log.logout);

module.exports = router;
