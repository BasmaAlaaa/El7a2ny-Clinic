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

router.post("/addFamMember/:Username", addFamMember);

router.get("/getFamMembers/:Username", getFamMembers);

router.get("/findDocBySpeciality/:Username/:Speciality", findDocBySpecality);
router.get("/findDocByAvailability/:Date/:Time", findDocByAvailability);

router.get("/searchDocByName/:Username/:Name", searchDocByName);
router.get("/searchDocBySpec/:Username/:Speciality", searchDocBySpec);

router.post("/addPresToPatient/:Username/:id", addPresToPatient);

router.get("/viewMyPres/:id", viewMyPres);

router.get("/filterMyPresBasedOnDate/:Username/:Date", filterMyPresBasedOnDate);
router.get(
  "/filterMyPresBasedOnDoctor/:Username/:DoctorUsername",
  filterMyPresBasedOnDoctor
);
router.get(
  "/filterMyPresBasedOnFilled/:Username/:Filled",
  filterMyPresBasedOnFilled
);

router.get("/viewAllDoctors/:Username", viewDoctorsWithSessionPrices);

router.get("/viewDoctorInfo/:DoctorUsername/:PatientUsername", viewDoctorInfo);

router.get("/viewAllMyPres/:Username", viewAllMyPres);

router.get("/patientFilterAppsByDate/:Username/:Date", patientFilterAppsByDate);
router.get(
  "/patientFilterAppsByStatus/:Username/:Status",
  patientFilterAppsByStatus
);
router.get("/allAppointments/:Username", allAppointments);

router.put(
  "/choosePaymentMethodForHP/:type/:PatientUsername",
  choosePaymentMethodForHP
);

router.get(
  "/viewWalletAmountByPatient/:PatientUsername",
  viewWalletAmountByPatient
);
router.get("/health-packages", viewHealthPackages);
router.get(
  "/viewSubscribedHealthPackages/:Username",
  viewSubscribedHealthPackages
);
router.post(
  "/cancelHealthCarePackageSubscription/:Username/:Type",
  cancelHealthCarePackageSubscription
);
router.get("/viewHealthPackages/:Username", viewSubscribedHealthPackages);
router.post(
  "/subscribeToAHealthPackage/:patientUsername/:healthPackageType",
  subscribeToAHealthPackage
);
router.get(
  "/viewHealthCarePackageStatus/:Username/:healthPackageType",
  viewHealthCarePackageStatus
);
router.get(
  "/viewHealthPackageStatus/:Username/:healthPackageType",
  viewHealthPackageStatus
);

router.post(
  "/addMedicalHistoryDocument/:Username",
  upload.single("MedicalHistoryDocuments"),
  addMedicalHistoryDocument
);
router.delete(
  "/deleteMedicalHistoryDocument/:Username/:filePathToRemove",
  deleteMedicalHistoryDocument
);
router.get(
  "/viewMedicalHistoryDocuments/:Username",
  viewMedicalHistoryDocuments
);
router.get("/viewHealthRecords/:Username", viewHealthRecords);

router.get("/patientPastApp/:Username", patientPastApp);
router.get("/patientUpcoming/:Username", patientUpcoming);
router.get("/availableDoctorApps/:Username", availableDoctorApps);
router.post(
  "/selectAppointment/:patientUsername/:timeSlot/:doctorUsername",
  selectAppointmentDateTimeAndPay
);
router.post(
  "/selectAppointmentDateTimeFamMem/:patientUsername/:timeSlot/:doctorUsername",
  selectAppointmentDateTimeAndPayFam
);
// router.get('/patientPastApp/:Username', patientPastApp);
// router.get('/patientUpcoming/:Username', patientUpcoming);
// router.get('/availableDoctorApps/:Username', availableDoctorApps);
// router.post('/selectAppointmentDateTimeFamMem/:Username', selectAppointmentDateTimeFamMem);

// Define a route to trigger the download
router.get("/downloadPrescriptionPDF/:doctorUsername", downloadPrescriptionPDF);

router.post(
  "/AddRefundForPatient/:patientId/:appointmentId",
  AddRefundForPatient
);
router.post(
  "/requestFollowUpAppointment/:username/:appointmentId",
  requestFollowUpAppointment
);
router.post(
  "/requestFollowUpForFamilyMember/:username/:appointmentId",
  requestFollowUpForFamilyMember
);

router.post(
  "/linkPatientAccountAsFam/:PatientUsername",
  linkPatientAccountAsFam
);
router.get("/ViewAllPres/:PatientUsername", ViewAllPres);
router.get("/ViewPresDetails/:PatientUsername/:id", ViewPresDetails);

const log = require("../Controllers/loginController");

router.post("/login", log.login);
router.get("/logout", log.logout);

module.exports = router;
