const { default: mongoose } = require("mongoose");
const { isEmailUnique, isUsernameUnique, validatePassword } = require("../utils.js")
const patientSchema = require('../Models/Patient.js');
const doctorSchema = require('../Models/Doctor.js');
const prescriptionSchema = require('../Models/Prescription.js');
const FamilyMember = require('../Models/FamilyMember.js');
const appointmentSchema = require('../Models/Appointment.js');
const HealthPackage = require("../Models/HealthPackage.js");
const Appointment = require("../Models/Appointment.js");

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const Prescription = require('../Models/Prescription.js');

require("dotenv").config();

const stripe = require('stripe')(process.env.STRIPE_KEY);

//Function for Stripe
async function createStripeCustomer({ Email, Name, Phone }) {
  return new Promise(async (resolve, reject) => {
    try {
      const Customer = await stripe.customers.create({
        name: Name,
        email: Email,
        phone: Phone
      });

      resolve(Customer);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}

// Task 1 : register patient
const registerPatient = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const {
    Username,
    Name,
    NationalID,
    Email,
    Password,
    DateOfBirth,
    Gender,
    MobileNumber,
    EmergencyContactName,
    EmergencyContactMobile,
    FamilyMembers,
    PatientPrescriptions,
    SubscribedHP
  } = req.body;

  try {
    if (!(await isUsernameUnique(Username))) {
      throw new Error('Username is already taken.');
    }

    if (!(await isEmailUnique(Email))) {
      throw new Error('Email is already in use.');
    }

    if(!(await validatePassword(Password))){
      return res.status(400).json("Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long");
    }

    const patientExists = await patientSchema.findOne({ Email: Email });

    if (patientExists) {
      return res.status(404).send("You already registered.");
    }

    const customer = await createStripeCustomer({ Email, Name, MobileNumber });

    const patient = await patientSchema.register(
      Username,
      Name,
      NationalID,
      Email,
      Password,
      DateOfBirth,
      Gender,
      MobileNumber,
      EmergencyContactName,
      EmergencyContactMobile,
      FamilyMembers,
      PatientPrescriptions,
      SubscribedHP,
      customer.id
    );

    await patient.save();

    res.status(200).json({ patient });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Req 18: app.post('/addFamMember/:Username')
const addFamMember = async (req, res) => {

  const {Username} = req.params;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{

    const {
      Name,
      NationalID,
      Age,
      Gender,
      RelationToPatient
    } = req.body;
    try {

      const patient = await patientSchema.findOne({ Username: Username });

      if (!patient) {
        return res.status(404).send({ error: 'Patient not found' });
      }

      const newFamilyMember = await FamilyMember.create({
        Name,
        NationalID,
        Age,
        Gender,
        RelationToPatient
      });

      patient.FamilyMembers.push(newFamilyMember.NationalID);
      await patient.save();

      res.status(200).send({ familyMember: newFamilyMember });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
};


// Req 22 app.get('/getFamMembers/:Username')

const getFamMembers = async (req, res) => {
  const {Username} = req.params;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      const patient = await patientSchema.findOne({ Username: Username });

      if (!patient) {
        return res.status(404).send({ error: 'Patient not found' });
      }

      const familyMembers = patient.FamilyMembers;

      const members = await FamilyMember.find({ NationalID: { $in: familyMembers } });

      if (members.length === 0) {
        return res.status(404).send('No family members linked to this patient');
      }

      const FamMembersInfo = members.map((member) => ({
        Name: member.Name,
        Age: member.Age,
        NationalID: member.NationalID,
        Gender: member.Gender,
        RelationToPatient: member.RelationToPatient,
      }));

      res.status(200).send(FamMembersInfo);

    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
};

const patientFilterAppsByDate = async (req, res) => {

  const {Username, Date} = req.params;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{

    try {
      const user = await patientSchema.findOne({ Username: Username });

      if (!user) {
        return res.status(404).send('No patient found');
      }
      // Use the filter object to query the appointment collection
      const filteredAppointments = await appointmentSchema.find({ PatientUsername: Username, Date: Date });

      if (filteredAppointments.length === 0) {
        return res.status(404).send('No matching appointments found');
      }
      // Send the list of matching appointments as a response
      res.send(filteredAppointments);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
}

const patientFilterAppsByStatus = async (req, res) => {

  const {Username, Status} = req.params;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      const user = await patientSchema.findOne({ Username: Username });

      if (!user) {
        return res.status(404).send('No patient found');
      }

      // Use the filter object to query the appointment collection
      const filteredAppointments = await appointmentSchema.find({ PatientUsername: Username, Status: Status });

      if (filteredAppointments.length === 0) {
        return res.status(404).send('No matching appointments found');
      }

      // Send the list of matching appointments as a response
      res.status(200).send({ filteredAppointments });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
}

const allAppointments = async (req, res) => {
  const {Username} = req.params;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{

    try {
      const user = await patientSchema.findOne({ Username: Username });
      if (!user) {
        return res.status(404).send('No patient found');
      }

      // Use the filter object to query the appointment collection
      const filteredAppointments = await appointmentSchema.find({ PatientUsername: Username });

      if (filteredAppointments.length === 0) {
        return res.status(404).send('No matching appointments found');
      }

      // Send the list of matching appointments as a response
      res.status(200).send({ filteredAppointments });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
}

// Req 37: view a list of all doctors
const viewDoctorsWithSessionPrices = async (req, res) => {

  const {Username} = req.params;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{

    try {
      const patient = await patientSchema.findOne({ Username: Username });

      if (!patient) {
        return res.status(404).send({ error: 'Patient not found' });
      }

      const doctors = await doctorSchema.find().exec();

      const result = [];

      for (const doctor of doctors) {
        const doctorRate = doctor.HourlyRate;

        const clinicMarkup = 0.10; // 10% markup

        let sessionPrice = doctorRate;

        const healthPackage = await HealthPackage.findOne({ PatientsUsernames: Username }).exec();

        if (healthPackage) {
          const discountPercentage = healthPackage.doctorSessionDiscount || 0;

          const discountAmount = (doctorRate * discountPercentage) / 100;

          sessionPrice -= discountAmount;
        }

        sessionPrice += sessionPrice * clinicMarkup;

        result.push({
          Name: doctor.Name,
          Username: doctor.Username,
          Email: doctor.Email,
          Speciality: doctor.Speciality,
          sessionPrice,
          AvailableTimeSlots: doctor.AvailableTimeSlots
        });
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
};

// Req 39: Filter for a doctor by name/speciality
const findDocBySpecality = async (req, res) => {

  const { Username, Speciality } = req.params;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {

      const patient = await patientSchema.findOne({ Username: Username });

      if (!patient) {
        return res.status(404).send("NO patient found");
      }

      //console.log(filter)
      const doctors = await doctorSchema.find({ Speciality: Speciality });
      if (doctors.length === 0) {
        return res.status(404).send({ error: 'Doctor is not Found' });
      }
      res.status(200).send(doctors)

    }
    catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }
};

const findDocByAvailability = async (req, res) => {
  const {Username, Date, Time} = req.params;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {

      // const patient = await patientSchema.findOne({Username: Username});

      // if(!patient){
      //   return res.status(404).send("NO patient found");
      // }

      const doctors = await doctorSchema.find();
      //const result = doctors.flatMap(({Schedule}) => Schedule.map(({Date,Time}) => ({Date,Time})));

      const result = [];
      for (const doc of doctors) {
        // const sch = doc.Schedule.map(({Date, From, To})=>({Date, From, To}));
        doc.AvailableTimeSlots.map((e) => {

          if (e.Date.toISOString().substring(0, 4) === Date.substring(0, 4) && e.Date.toISOString().substring(5, 7) === Date.substring(5, 7) && e.Date.toISOString().substring(8, 10) === Date.substring(8, 10)
            && e.From <= Time && e.To >= Time) {
            result.push(doc);
          }
        });

      }

      console.log(result);

      if (result.length === 0) {
        return res.status(404).send({ error: 'Doctor is not Found' });
      }
      res.status(200).send(result)

    }
    catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

// Req 38 : app.get('/searchDocByNameAndSpec')
const searchDocByName = async (req, res) => {

  const {Username, Name} = req.params;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {

      const patient = await patientSchema.findOne({ Username: Username });

      if (!patient) {
        return res.status(404).send("NO patient found");
      }

      const doctors = await doctorSchema.find({ Name: Name })
      if (doctors.length === 0) {
        return res.status(404).send({ error: 'Doctor is not Found' });
      }
      res.status(200).send(doctors)
    }
    catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

const searchDocBySpec = async (req, res) => {

  const {Username, Speciality} = req.params;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{

    try {
      const patient = await patientSchema.findOne({ Username: Username });

      if (!patient) {
        return res.status(404).send("NO patient found");
      }

      const doctors = await doctorSchema.find({ Speciality: Speciality })
      if (doctors.length === 0) {
        return res.status(404).send({ error: 'Doctor is not Found' });
      }

      res.status(200).send(doctors)
    }
    catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

//Req 40+41: Select a doctor from results and view all his info
const viewDoctorInfo = async (req, res) => {

  const { DoctorUsername, PatientUsername } = req.params;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === PatientUsername)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      const patient = await patientSchema.findOne({ Username: PatientUsername });

      if (!patient) {
        return res.status(404).send("NO patient found");
      }

      const doctor = await doctorSchema.findOne({ Username: DoctorUsername }, { _id: 0, Password: 0, patients: 0 });

      if (!doctor) {
        return res.status(404).send({ error: 'Doctor not found' });
      }

      const doctorRate = doctor.HourlyRate;

      const clinicMarkup = 0.10; // 10% markup

      let sessionPrice = doctorRate;

      const healthPackages = patient.SubscribedHP;

      for (const hp of healthPackages) {
        if (hp.Status === "Subscribed") {
          const discountPercentage = hp.doctorSessionDiscount || 0;

          const discountAmount = (doctorRate * discountPercentage) / 100;

          sessionPrice -= discountAmount;
        }
      }

      sessionPrice += sessionPrice * clinicMarkup;

      const slots = doctor.AvailableTimeSlots;
      const availableSlots = [];

      for( const slot of slots){
        if(slot.Status === "available"){
          availableSlots.push(slot);
        }
      }

      const result = {
        Username: doctor.Username,
        Name: doctor.Name,
        Email: doctor.Email,
        DateOfBirth: doctor.DateOfBirth,
        HourlyRate: doctor.HourlyRate,
        Affiliation: doctor.Affiliation,
        EBD: doctor.EDB,
        Speciality: doctor.Speciality,
        IDDocument: doctor.IDDocument,
        MedicalDegreeDocument: doctor.MedicalDegreeDocument,
        WorkingLicenseDocument: doctor.WorkingLicenseDocument,
        AvailableTimeSlots: availableSlots,
        SessionPrice: sessionPrice
      };

      res.status(200).json(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
};

//app.post('/addPresToPatient/:Username/:id')
const addPresToPatient = async (req, res) => {

  const { Username, id } = req.params;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      const patient = await patientSchema.findOne({ Username: Username });

      if (!patient) {
        return res.status(404).send({ error: 'Patient not found' });
      }

      patient.PatientPrescriptions.push(id);

      await patient.save();

      res.status(200).send({ message: patient });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
};



// Req 54: app.get('/viewMyPres/:Username')
const viewAllMyPres = async (req, res) => {
  const {Username} = req.params;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      const patient = await patientSchema.findOne({ Username: Username });

      if (!patient) {
        return res.status(404).send({ error: 'Patient not found' });
      }

      const allPrescriptions = patient.PatientPrescriptions;

      if (allPrescriptions.length === 0) {
        return res.status(404).send('No prescriptions found for this patient');
      }

      const prescriptions = await prescriptionSchema.find({ _id: { $in: allPrescriptions } });

      if (prescriptions.length === 0) {
        return res.status(404).send('No prescriptions found for this patient2');
      }

      const result = prescriptions.map(prescription => ({
        prescriptionID: prescription._id,
        Appointment_ID: prescription.Appointment_ID,
        Date: prescription.Date,
        DoctorUsername: prescription.DoctorUsername,
        Description: prescription.Description,
        Filled: prescription.Filled
      }));

      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
};


//app.get('/filterMyPres/:Username')



const filterMyPresBasedOnDate = async (req, res) => {

  const { Username, Date } = req.params;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      const patient = await patientSchema.findOne({ Username: Username });

      if (!patient) {
        return res.status(404).send({ error: 'Patient not found' });
      }

      const query = { _id: { $in: patient.PatientPrescriptions }, Date: Date };

      const prescriptions = await prescriptionSchema.find(query);

      if (prescriptions.length === 0) {
        return res.status(404).send('No prescriptions found for the specified criteria');
      }

      const result = prescriptions.map((prescription) => ({
        prescriptionID: prescription._id,
        Appointment_ID: prescription.Appointment_ID,
        Date: prescription.Date,
        DoctorUsername: prescription.DoctorUsername,
        Description: prescription.Description,
        Filled: prescription.Filled
      }));

      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
};

const filterMyPresBasedOnFilled = async (req, res) => {

  const { Username, Filled } = req.params;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{

    try {
      const patient = await patientSchema.findOne({ Username: Username });

      if (!patient) {
        return res.status(404).send({ error: 'Patient not found' });
      }

      const query = { _id: { $in: patient.PatientPrescriptions }, Filled: Filled };

      const prescriptions = await prescriptionSchema.find(query);

      if (prescriptions.length === 0) {
        return res.status(404).send('No prescriptions found for the specified criteria');
      }

      const result = prescriptions.map((prescription) => ({
        prescriptionID: prescription._id,
        Appointment_ID: prescription.Appointment_ID,
        Date: prescription.Date,
        DoctorUsername: prescription.DoctorUsername,
        Description: prescription.Description,
        Filled: prescription.Filled
      }));

      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
};

const filterMyPresBasedOnDoctor = async (req, res) => {

  const { Username, DoctorUsername } = req.params;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{

    try {
      const patient = await patientSchema.findOne({ Username: Username });

      if (!patient) {
        return res.status(404).send({ error: 'Patient not found' });
      }

      const query = { _id: { $in: patient.PatientPrescriptions }, DoctorUsername: DoctorUsername };

      const prescriptions = await prescriptionSchema.find(query);

      if (prescriptions.length === 0) {
        return res.status(404).send('No prescriptions found for the specified criteria');
      }

      const result = prescriptions.map((prescription) => ({
        prescriptionID: prescription._id,
        Appointment_ID: prescription.Appointment_ID,
        Date: prescription.Date,
        DoctorUsername: prescription.DoctorUsername,
        Description: prescription.Description,
        Filled: prescription.Filled
      }));

      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
};

const viewMyPres = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { id } = req.params;

  const prescription = await prescriptionSchema.findById(id);

    if (!prescription) {
      return res.status(404).send({ error: 'Prescription not found' });
    }

  if (!(req.user.Username === prescription.PatientUsername)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      
      const patient = await patientSchema.findOne({ Username: prescription.PatientUsername });

      const doctor = await doctorSchema.findOne({ Username: prescription.DoctorUsername });

      const appointment = await Appointment.findOne({ _id: prescription.Appointment_ID });

      const result = {
        PatientName: patient.Name,
        PatientUsername: patient.Username,
        DoctorName: doctor.Name,
        Description: prescription.Description,
        Date: prescription.Date,
        Filled: prescription.Filled,
        AppointmentID: prescription.Appointment_ID
      }

      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
};

//Req 20: choose payment method of appointment
const choosePaymentMethodForApp = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { id } = req.params;
  try {

    const app = await HealthPackage.findById(id);

    if (!app) {
      return res.status(404).json({ error: "This appointment doesn't exist!" })
    }

    const updatedApp = {
      $set: {
        PaymentMethod: req.body.PaymentMethod
      },
    };

    const updated = await Appointment.updateOne({ _id: id }, updatedApp);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }

};

//Req 29: choose payment method of health package
const choosePaymentMethodForHP = async (req, res) => {

  const { type, PatientUsername } = req.params;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === PatientUsername)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {

      const hp = await HealthPackage.findOne({ Type: type });

      if (!hp) {
        return res.status(404).json({ error: "This health package doesn't exist!" })
      }

      const patient = await patientSchema.findOne({ Username: PatientUsername });

      if (!patient) {
        return res.status(404).json({ error: "This patient doesn't exist!" })
      }

      const updatedHP = {
        $set: {
          "SubscribedHP.$[].PaymentMethod": req.body.PaymentMethod
        }
      };

      const updated = await patientSchema.updateOne({ Username: PatientUsername, "SubscribedHP.Type": type }, updatedHP);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
};

//Req 67: view Wallet amount
const viewWalletAmountByPatient = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { PatientUsername } = req.params;
  if (!(req.user.Username === PatientUsername)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      const patient = await patientSchema.findOne({ Username: PatientUsername });

      if (!patient) {
        return res.status(404).send("No patient found");
      }

      res.status(200).json(patient.WalletAmount);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
};

// Req 30: view subscribed health packages for the patient and family members
const viewSubscribedHealthPackages = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { Username } = req.params;
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{

    try {
      // Find the patient by username
      const patient = await patientSchema.findOne({ Username });

      if (!patient) {
        return res.status(404).send('Patient not found');
      }

      // Get the subscribed health packages for the patient
      const subscribedHPs = patient.SubscribedHP;

      for( const hp of subscribedHPs){
        if(hp.Status === "Subscribed"){
          return res.status(200).send([hp]);
        }
      }
      
      return res.status(404).send("The patient is not subscribed to any health package at the moment");

      // Send the list of subscribed health packages as a response
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

// Req 30: view subscribed health packages for the patient and family members
const viewSubscribedHealthPackagesOfFamilyMember = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { Username, NationalID} = req.params;
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{

    try {
      // Find the patient by username
      const patient = await patientSchema.findOne({ Username });

      if (!patient) {
        return res.status(404).send('Patient not found');
      }      
      
      const famMember = await FamilyMember.findOne({NationalID});

      if (!famMember || !(famMember.PatientUsername === Username)) {
        return res.status(404).send('Family member not found');
      }

      const subscribedHPs = famMember.SubscribedHP;

      for( const hp of subscribedHPs){
        if(hp.Status === "Subscribed"){
          return res.status(200).send([hp]);
        }
      }
      return res.status(404).send("The patient is not subscribed to any health package at the moment");

      // Send the list of subscribed health packages as a response
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

//req 21 : pay for appointment
const payForAppointment = async (res, req) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { appId, paymentMethod } = req.params;

  try {

    const app = await Appointment.findOne({ _id: appId });

    if (!app) {
      return res.status(404).send({ error: 'Appointment not found' });
    }

    const patient = await patientSchema.findOne({ Username: app.PatientUsername });

    if (paymentMethod === "card") {

      const paymentIntent = await stripe.paymentIntents.create({
        amount: app.Price,
        currency: 'egp',
        customer: patient.StripeCustomerId,
        description: "Paying for an appointment"
      });

      await stripe.paymentIntents.confirm(paymentIntent);

      const updatedApp = {
        $set: {
          PaymentMethod: "card"
        },
      };

      const updated = await Appointment.updateOne({ _id: appId }, updatedApp);
    }
    else if (paymentMethod === "Wallet") {

      if (patient.WalletAmount <= app.Price)
        return res.status(400).send("Your wallet amount won't cover the whole appointment price!")

      if (patient.WalletAmount >= app.Price) {

        const updatedPat = {
          $set: {
            WalletAmount: (WalletAmount - app.Price),
          },
        };

        const update = await patientSchema.updateOne({ Username: app.PatientUsername }, updatedPat);

        const updatedApp = {
          $set: {
            PaymentMethod: "wallet"
          },
        };

        const updated = await Appointment.updateOne({ _id: appId }, updatedApp);
      }
      else {

        const updatedApp = {
          $set: {
            PaymentMethod: "wallet"
          },
        };

        const updated = await Appointment.updateOne({ _id: appId }, updatedApp);

        return res.status(400).send("Not enough money in the wallet!");
      }

    }
    const updatedDoc = {
      $set: {
        WalletAmount: (WalletAmount + app.Price),
      },
    };

    const update = await doctorSchema.updateOne({ Username: app.DoctorUsername }, updatedDoc);

    return res.status(200).send(payment);

  } catch (error) {
    res.status(400).send({ error: error.message });
  }

};
// Req 31: View the status of health care package subscription for the patient and family members
const viewHealthCarePackageStatus = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { Username, healthPackageType} = req.params;

  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{

    try {
      // Find the patient by username
      const patient = await patientSchema.findOne({ Username });

      if (!patient) {
        return res.status(404).send('Patient not found');
      }

      const healthPackage = await HealthPackage.findOne({Type: healthPackageType});

      if (!healthPackage) {
        return res.status(404).send('Health Package not found');
      }

      // Get the health care package status for the patient
      const patientSubscription = patient.SubscribedHP;
      var result ={};

      var found = false;

      if(patientSubscription.length === 0){
        result  = {
          Type: healthPackageType,
          AnnualFee: healthPackage.AnnualFee,
          DoctorSessionDiscount: healthPackage.DoctorSessionDiscount,
          MedicineDiscount: healthPackage.MedicineDiscount,
          FamilySubscriptionDiscount: healthPackage.FamilySubscriptionDiscount,
          Status: 'Unsubscribed',
        }
        found = true;
      }
      else{
        for(const hp of patientSubscription){
          if(hp.Type === healthPackageType && !found){
            if(hp.Status === "Cancelled"){
              result  = {
                Type: healthPackageType,
                AnnualFee: healthPackage.AnnualFee,
                DoctorSessionDiscount: healthPackage.DoctorSessionDiscount,
                MedicineDiscount: healthPackage.MedicineDiscount,
                FamilySubscriptionDiscount: healthPackage.FamilySubscriptionDiscount,
                Status: 'Cancelled',
                CancellationDate: hp.CancellationDate
              }
            }
            else if(hp.Status === "Subscribed"){
              result  = {
                Type: healthPackageType,
                AnnualFee: healthPackage.AnnualFee,
                DoctorSessionDiscount: healthPackage.DoctorSessionDiscount,
                MedicineDiscount: healthPackage.MedicineDiscount,
                FamilySubscriptionDiscount: healthPackage.FamilySubscriptionDiscount,
                Status: 'Subscribed',
                RenewalDate: hp.RenewalDate
              }
            }
            found = true;
          }
        }
          if(!found){
            result  = {
              Type: healthPackageType,
              AnnualFee: healthPackage.AnnualFee,
              DoctorSessionDiscount: healthPackage.DoctorSessionDiscount,
              MedicineDiscount: healthPackage.MedicineDiscount,
              FamilySubscriptionDiscount: healthPackage.FamilySubscriptionDiscount,
              Status: 'Unsubscribed',
            }
          }
      }
      // Send the health care package status as a response
      res.status(200).send(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

const viewHealthPackageStatusOfFamilyMember = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { Username, healthPackageType, NationalID} = req.params;
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{

    try {
      // Find the patient by username
      const patient = await patientSchema.findOne({ Username });

      if (!patient) {
        return res.status(404).send('Patient not found');
      }

      const healthPackage = await HealthPackage.findOne({Type: healthPackageType});

      if (!healthPackage) {
        return res.status(404).send('Health Package not found');
      }

      // Find the patient by username
      const famMember = await FamilyMember.findOne({ NationalID });

      if (!famMember) {
        return res.status(404).send('Family member not found');
      }
      // Get the health care package status for the patient
      const famSubscription = famMember.SubscribedHP;
      var result ={};

      if(famSubscription.length === 0){
        result  = {
          Type: healthPackageType,
          AnnualFee: healthPackage.AnnualFee,
          DoctorSessionDiscount: healthPackage.DoctorSessionDiscount,
          MedicineDiscount: healthPackage.MedicineDiscount,
          FamilySubscriptionDiscount: healthPackage.FamilySubscriptionDiscount,
          Status: 'Unsubscribed',
        }
      }
      else{
        for(const hp of famSubscription){
          if(hp.Type === healthPackageType){
            if(hp.Status === "Cancelled"){
              result  = {
                Type: healthPackageType,
                AnnualFee: healthPackage.AnnualFee,
                DoctorSessionDiscount: healthPackage.DoctorSessionDiscount,
                MedicineDiscount: healthPackage.MedicineDiscount,
                FamilySubscriptionDiscount: healthPackage.FamilySubscriptionDiscount,
                Status: 'Cancelled',
                CancellationDate: hp.CancellationDate
              }
            }
            else if(hp.Status === "Subscribed"){
              result  = {
                Type: healthPackageType,
                AnnualFee: healthPackage.AnnualFee,
                DoctorSessionDiscount: healthPackage.DoctorSessionDiscount,
                MedicineDiscount: healthPackage.MedicineDiscount,
                FamilySubscriptionDiscount: healthPackage.FamilySubscriptionDiscount,
                Status: 'Subscribed',
                RenewalDate: hp.RenewalDate
              }
            }
          }
          else{
            result  = {
              Type: healthPackageType,
              AnnualFee: healthPackage.AnnualFee,
              DoctorSessionDiscount: healthPackage.DoctorSessionDiscount,
              MedicineDiscount: healthPackage.MedicineDiscount,
              FamilySubscriptionDiscount: healthPackage.FamilySubscriptionDiscount,
              Status: 'Unsubscribed',
            }
          }
        }
      }
      // Send the health care package status as a response
      res.status(200).send(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

// Req 32: Cancel a subscription of a health package for the patient and family members
const cancelHealthCarePackageSubscription = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { Username, Type } = req.params;
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{
    
    try {
      // Find the patient by username
      const patient = await patientSchema.findOne({ Username });

      if (!patient) {
        return res.status(404).send('Patient not found');
      }

      const healthPackage = await HealthPackage.findOne({ Type });

      if (!healthPackage) {
        return res.status(404).send('Health Package not found');
      }

      // Check if the patient has a subscription for the specified health package type
      const subscription = patient.SubscribedHP;
      if(subscription.length === 0){
        return res.status(404).send('You are not subscribed to any health package');
      }

      for(const hp of subscription){
        if (hp.Type === Type && hp.Status === "Subscribed") {
          // Cancel the patient's subscription
          hp.Status = 'Cancelled';
          hp.CancellationDate = new Date();
          hp.RenewalDate = null;

          // Save the updated patient
          await patient.save();
        }
        else if (hp.Type === Type && (hp.Status === "Cancelled" || hp.Status === "Unsubscribed")){
          return res.status(404).send('You are not subscribed to this health package');
        }
      }

      return res.status(200).send('Health package subscription has been cancelled for the patient and family members.');
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

// Req 32: Cancel a subscription of a health package for the patient and family members
const cancelHealthCarePackageSubscriptionOfFamMember = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { Username, Type, NationalID} = req.params;
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{
    
    try {
      // Find the patient by username
      const patient = await patientSchema.findOne({ Username });

      if (!patient) {
        return res.status(404).send('Patient not found');
      }

      const healthPackage = await HealthPackage.findOne({ Type });

      if (!healthPackage) {
        return res.status(404).send('Health Package not found');
      }

      // Find the patient by username
      const famMember = await FamilyMember.findOne({ NationalID });

      if (!famMember) {
        return res.status(404).send('Family member not found');
      }

      // Check if the patient has a subscription for the specified health package type
      const subscription = famMember.SubscribedHP;
      if(subscription.length === 0){
        return res.status(404).send('You are not subscribed to any health package');
      }

      for(const hp of subscription){
        if (hp.Type === Type && hp.Status === "Subscribed") {
          // Cancel the patient's subscription
          hp.Status = 'Cancelled';
          hp.CancellationDate = new Date();
          hp.RenewalDate = null;

          // Save the updated patient
          await famMember.save();
        }
        else if (hp.Type === Type && (hp.Status === "Cancelled" || hp.Status === "Unsubscribed")){
          return res.status(404).send('You are not subscribed to this health package');
        }
      }
      
      return res.status(200).send('Health package subscription has been cancelled for the patient and family members.');
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

// Req 27 view health package options and details
const viewHealthPackages = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { Username } = req.params;
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      const healthPackages = await HealthPackage.find();

      if (healthPackages.length === 0) {
        return res.status(404).send('No health packages found');
      }

      const packageInfo = healthPackages.map((package) => ({
        Type: package.Type,
        AnnualFee: package.AnnualFee,
        DoctorSessionDiscount: package.DoctorSessionDiscount,
        MedicineDiscount: package.MedicineDiscount,
        FamilySubscriptionDiscount: package.FamilySubscriptionDiscount,
      }));

      res.status(200).json(packageInfo);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
};

// // Task 2: upload medical history document
const addMedicalHistoryDocument = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { username } = req.params;
  if (!(req.user.Username === username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      const patient = await patientSchema.findOne({ Username: username });

      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Update to handle the new schema structure
      const newDocument = {
        document: req.file.buffer,  // Assuming req.file.buffer contains the file data
        contentType: req.file.mimetype,  // Assuming req.file.mimetype contains the content type
      };

      patient.MedicalHistoryDocuments.push(newDocument);

      await patient.save();

      return res.status(200).json({ message: 'Document uploaded successfully', document: newDocument });
    } catch (error) {
      console.error('Error in addMedicalHistoryDocument:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};


// Task 2: delete medical history document
const deleteMedicalHistoryDocument = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { Username, filePathToRemove } = req.params;
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{

    try {
      const patient = await patientSchema.findOne({ Username });

      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      // Find the index of the document with the given _id
      const documentIndex = patient.MedicalHistoryDocuments.findIndex(
        (document) => document._id.toString() === filePathToRemove
      );

      if (documentIndex === -1) {
        return res.status(404).json({ error: 'Document not found' });
      }

      // Remove the document at the found index
      patient.MedicalHistoryDocuments.splice(documentIndex, 1);

      await patient.save();

      res.status(200).send({ message: 'Document deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};


// view medical history documents
const viewMedicalHistoryDocuments = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { Username } = req.params;
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      const patient = await patientSchema.findOne({ Username });

      if (!patient) {
        return res.status(404).json({ error: 'Patient not found.' });
      }

      const medicalHistoryDocuments = patient.MedicalHistoryDocuments;

      if (medicalHistoryDocuments.length === 0) {
        return res.status(404).json({ message: 'No medical history documents found for the patient.' });
      }

      const formattedMedicalHistoryDocuments = medicalHistoryDocuments.map(doc => ({
        contentType: doc.contentType,
        _id: doc._id,
        documentHex: doc.document.toString('hex')
      }));

      res.status(200).json({ MedicalHistoryDocuments: formattedMedicalHistoryDocuments });
    } catch (error) {
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  }
};


const viewHealthRecords = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { Username } = req.params;
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{

    try {
      const patient = await patientSchema.findOne({ Username: Username });

      if (!patient) {
        return res.status(404).json({ error: 'Patient not found.' });
      }

      const healthRecords = patient.HealthRecords;

      if (healthRecords.length === 0) {
        return res.status(404).json({ message: 'No health records found for the patient.' });
      }

      res.status(200).json({ healthRecords });
    } catch (error) {
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  }
};

const patientPastApp = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { Username } = req.params;
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{

    try {

      // Find the doctor by ID
      const patient = await patientSchema.findOne({ Username: Username });

      if (!patient) {
        return res.status(404).send('patient not found');
      }


      // Find upcoming appointments for the doctor
      const pastAppointments = await appointmentSchema.find({
        Status: { $in: ["Finished", "Following", "finished", "following"] }, // Adjust this condition based on your schema
        PatientUsername: Username
      }, { DoctorUsername: 1, Date: 1, Status: 1, _id: 0, PaymentMethod: 1, Time: 1 });

      if (pastAppointments.length === 0) {
        return res.status(404).send('No upcoming appointments found for this patient');
      }

      res.send(pastAppointments);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }
}

const patientUpcoming = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { Username } = req.params;
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{

    try {

      // Find the doctor by ID
      const patient = await patientSchema.findOne({ Username: Username });

      if (!patient) {
        return res.status(404).send('patient not found');
      }

      // Find upcoming appointments for the doctor
      const upcomingAppointments = await appointmentSchema.find({
        Status: { $in: ["Upcoming", "Following", "upcoming", "following"] }, // Adjust this condition based on your schema
        PatientUsername: Username
      }, { DoctorUsername: 1, Date: 1, Status: 1, _id: 0, PaymentMethod: 1, Time: 1 });

      if (upcomingAppointments.length === 0) {
        return res.status(404).send('No upcoming appointments found for this patient');
      }

      res.send(upcomingAppointments);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }
}

const availableDoctorApps = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { Username } = req.params;
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{
    const { DoctorUsername } = req.body;
    try {
      const patient = await patientSchema.findOne({ Username: Username });

      if (!patient) {
        return res.status(404).send({ error: 'Patient not found' });
      }

      const doctor = await doctorSchema.findOne({ Username: DoctorUsername });

      if (!doctor) {
        return res.status(404).send({ error: 'doctor not found' });
      }

      let result = [];
      const slots = doctor.AvailableTimeSlots;
      for(const slot of slots){
        if(slot.Status === "available"){
          result.push(slot);
        }
      }

      res.send(result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }
}

const selectAppointmentDateTimeAndPay = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { patientUsername, timeSlot, doctorUsername } = req.params;
  const { paymentMethod } = req.body;

  if (!(req.user.Username === patientUsername)) {
    res.status(403).json("You are not logged in!");
  }else{

    try {

      //Selecting the date and time and payment method of appointment
      const patient = await patientSchema.findOne({ Username: patientUsername });

      if (!patient) {
        return res.status(404).send({ error: 'Patient not found' });
      }

      const doctor = await doctorSchema.findOne({ Username: doctorUsername });

      if (!doctor) {
        return res.status(404).send({ error: 'Doctor not found' });
      }

      const doctorRate = doctor.HourlyRate;

      const clinicMarkup = 0.10; // 10% markup

      let sessionPrice = doctorRate;

      const healthPackages = patient.SubscribedHP;

      for (const hp of healthPackages) {
        if (hp.Status === "Subscribed") {
          const discountPercentage = hp.doctorSessionDiscount || 0;

          const discountAmount = (doctorRate * discountPercentage) / 100;

          sessionPrice -= discountAmount;
        }
      }

      sessionPrice += sessionPrice * clinicMarkup;

      const availableSlots = doctor.AvailableTimeSlots;
      
      let slot;
      var found = false;
      for(const s of availableSlots){
        if(!found){
        if(s._id.equals(timeSlot)){
          found = true;
          slot = s;
        }
      }
      }

      if(slot.Status === "available"){
        let newAppointment;

        if(paymentMethod === "card" || (paymentMethod === "wallet" && patient.WalletAmount >= sessionPrice)){
        newAppointment = await appointmentSchema.create({
          Date: slot.Date,
          Time: slot.Time,
          DoctorUsername: doctorUsername,
          PatientUsername: patientUsername,
          Status: 'Upcoming',
          PaymentMethod: paymentMethod,
          Price: sessionPrice,
          Name: patient.Name
        });

          if (paymentMethod === "wallet") {
            patient.WalletAmount = (patient.WalletAmount - sessionPrice),
            patient.save();
          }

        slot.Status = "booked";
        doctor.WalletAmount = (doctor.WalletAmount + sessionPrice),
        doctor.save();
        }
        else{
          return res.status(400).send("Your wallet amount won't cover the whole appointment price!");
        }
          res.status(200).send(newAppointment);
      }
      else{
        return res.status(400).send("This slot is already booked");
      }

    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
};


const selectAppointmentDateTimeAndPayFam = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { patientUsername, timeSlot, doctorUsername } = req.params;
  const { paymentMethod, familyId } = req.body;

  if (!(req.user.Username === patientUsername)) {
    res.status(403).json("You are not logged in!");
  }else{

    try {

      //Selecting the date and time and payment method of appointment
      const patient = await patientSchema.findOne({ Username: patientUsername });

      if (!patient) {
        return res.status(404).send({ error: 'Patient not found' });
      }

      const doctor = await doctorSchema.findOne({ Username: doctorUsername });

      if (!doctor) {
        return res.status(404).send({ error: 'Doctor not found' });
      }

      const familyMem = await FamilyMember.findOne({NationalID: familyId, PatientUsername: patientUsername});

      if(!familyMem){
        return res.status(404).send({ error: 'Family member not found' });
      }

      const doctorRate = doctor.HourlyRate;

      const clinicMarkup = 0.10; // 10% markup

      let sessionPrice = doctorRate;

      const healthPackages = patient.SubscribedHP;

      for (const hp of healthPackages) {
        if (hp.Status === "Subscribed") {
          const discountPercentage = hp.doctorSessionDiscount || 0;

          const discountAmount = (doctorRate * discountPercentage) / 100;

          sessionPrice -= discountAmount;
        }
      }

      sessionPrice += sessionPrice * clinicMarkup;

      const availableSlots = doctor.AvailableTimeSlots;
      
      let slot;
      var found = false;
      for(const s of availableSlots){
        if(!found){
        if(s._id.equals(timeSlot)){
          found = true;
          slot = s;
        }
      }
      }

      if(slot.Status === "available"){
        let newAppointment;

        if(paymentMethod === "card" || (paymentMethod === "wallet" && patient.WalletAmount >= sessionPrice)){
        newAppointment = await appointmentSchema.create({
          Date: slot.Date,
          Time: slot.Time,
          DoctorUsername: doctorUsername,
          PatientUsername: patientUsername,
          Status: 'Upcoming',
          PaymentMethod: paymentMethod,
          Price: sessionPrice,
          Name: familyMem.Name
        });

          if (paymentMethod === "wallet") {
            patient.WalletAmount = (patient.WalletAmount - sessionPrice),
            patient.save();
          }

        slot.Status = "booked";
        doctor.WalletAmount = (doctor.WalletAmount + sessionPrice),
        doctor.save();
        }
        else{
          return res.status(400).send("Your wallet amount won't cover the whole appointment price!");
        }
          res.status(200).send(newAppointment);
      }
      else{
        return res.status(400).send("This slot is already booked");
      }

    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
};

const linkPatientAccountAsFam = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { PatientUsername } = req.params;
  const { Email, RelationToPatient } = req.body;

  if (!(req.user.Username === PatientUsername)) {
    res.status(403).json("You are not logged in!");
  }else{

    try {
      const patient = await patientSchema.findOne({ Username: PatientUsername });

      if (!patient) {
        return res.status(404).send({ error: 'Patient not found' });
      }

      const famToBeLinked = await patientSchema.findOne({ Email: Email });

      if (!famToBeLinked) {
        return res.status(404).send({ error: 'Patient to be linked not found' });
      }

      if (patient.Email === famToBeLinked.Email) {
        return res.status(404).send({ error: 'It is your email' });
      }

      //Calculating the age of the patientToBeLinked
      var dob = new Date(famToBeLinked.DateOfBirth);
      var month_diff = Date.now() - dob.getTime();
      var age_dt = new Date(month_diff);
      var year = age_dt.getUTCFullYear();
      var ageofFam1 = Math.abs(year - 1970);

      patient.FamilyMembers.push(famToBeLinked.NationalID);
      /*const familyMem = await FamilyMember.create({
        Name: famToBeLinked.Name,
        NationalID: famToBeLinked.NationalID,
        Age: ageofFam1,
        Gender: famToBeLinked.Gender,
        RelationToPatient: RelationToPatient,
        PatientUsername: PatientUsername
      });*/

      patient.save();

      famToBeLinked.FamilyMembers.push(patient.NationalID);
      famToBeLinked.save();

      res.status(200).send({ message: 'Patient is successfully linked', LinkedPatient: famToBeLinked, MyPatient: patient });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
};

const subscribeToAHealthPackage = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { patientUsername, healthPackageType } = req.params;
  const { paymentMethod } = req.body;
  if (!(req.user.Username === patientUsername)) {
    res.status(403).json("You are not logged in!");
  }else{

    try {
      //Selecting the date and time and payment method of appointment
      const patient = await patientSchema.findOne({ Username: patientUsername });

      if (!patient) {
        return res.status(404).send({ error: 'Patient not found' });
      }

      const healthPackage = await HealthPackage.findOne({ Type: healthPackageType });

      if (!healthPackage) {
        return res.status(404).send({ error: 'Health Package not found' });
      }

      if(paymentMethod === "card" || (paymentMethod === "wallet" && patient.WalletAmount >= healthPackage.AnnualFee)){

        if(paymentMethod === "wallet" && !(patient.WalletAmount >= healthPackage.AnnualFee)){
          return res.status(400).send("Not enough cash in the wallet");
        }
        const healthPackagesOfPatient = patient.SubscribedHP;
        var patSub = false;
        console.log(healthPackagesOfPatient);
        const aYearFromNow = new Date();
        aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);

        for (const hp of healthPackagesOfPatient) {
          if (hp.Status === "Subscribed") {
            patSub = true;
            return res.status(404).send("You are already subscribed to a health package");
          }
        }

        for (const hp of healthPackagesOfPatient) {
          if(hp.Type === healthPackageType && hp.Status === "Cancelled" && !patSub){
            hp.Status = "Subscribed";
            hp.RenewalDate = aYearFromNow;
            hp.CancellationDate = null;
            hp.PaymentMethod = paymentMethod;
            hp.SubscriptionStartDate = new Date();
            if(paymentMethod === "wallet"){
              patient.WalletAmount = patient.WalletAmount-healthPackage.AnnualFee;
            }
            patient.save();
            patSub = true;
          }
          else if(hp.Type === healthPackageType && hp.Status === "Unsubscribed"  && !patSub){
            hp.Status = "Subscribed";
            hp.RenewalDate = aYearFromNow;
            hp.CancellationDate = null;
            hp.PaymentMethod = paymentMethod;
            hp.SubscriptionStartDate = new Date();
            if(paymentMethod === "wallet"){
              patient.WalletAmount = patient.WalletAmount-healthPackage.AnnualFee;
            }          
            patient.save();
            patSub = true;
          }
        }
        if (!patSub) {
          patient.SubscribedHP.push({
            Type: healthPackageType,
            PaymentMethod: paymentMethod,
            Status: "Subscribed",
            SubscriptionStartDate: Date.now(),
            RenewalDate: aYearFromNow
          });

          if(paymentMethod === "wallet"){
            patient.WalletAmount = patient.WalletAmount-healthPackage.AnnualFee;
          }        
          patient.save();
        }

      }
      res.status(200).send({ message: 'Subscribed successfully', patient });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
};

const subscribeToAHealthPackageForFamilyMember = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { patientUsername, healthPackageType, NationalID} = req.params;
  const { paymentMethod } = req.body;
  if (!(req.user.Username === patientUsername)) {
    res.status(403).json("You are not logged in!");
  }else{

    try {
      //Selecting the date and time and payment method of appointment
      const patient = await patientSchema.findOne({ Username: patientUsername });

      if (!patient) {
        return res.status(404).send({ error: 'Patient not found' });
      }

      const healthPackage = await HealthPackage.findOne({ Type: healthPackageType });

      if (!healthPackage) {
        return res.status(404).send({ error: 'Health Package not found' });
      }

      // Find the patient by username
      const famMember = await FamilyMember.findOne({ NationalID });

      if (!famMember) {
        return res.status(404).send('Family member not found');
      }

      const totalPrice = healthPackage.AnnualFee * (1 - healthPackage.FamilySubscriptionDiscount/100);

      if(paymentMethod === "card" || (paymentMethod === "wallet" && patient.WalletAmount >= totalPrice)){

        if(paymentMethod === "wallet" && !(patient.WalletAmount >= totalPrice)){
          return res.status(400).send("Not enough cash in the wallet");
        }

        const healthPackagesOfFam = famMember.SubscribedHP;
        var patSub = false;
        console.log(healthPackagesOfFam);
        const aYearFromNow = new Date();
        aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);

        for (const hp of healthPackagesOfFam) {
          if (hp.Status === "Subscribed") {
            patSub = true;
            return res.status(404).send("He is already subscribed to a health package");
          }
        }

        for (const hp of healthPackagesOfFam) {
          if(hp.Type === healthPackageType && hp.Status === "Cancelled" && !patSub){
            hp.Status = "Subscribed";
            hp.RenewalDate = aYearFromNow;
            hp.CancellationDate = null;
            hp.PaymentMethod = paymentMethod;
            hp.SubscriptionStartDate = new Date();
            if(paymentMethod === "wallet"){
              patient.WalletAmount = patient.WalletAmount-totalPrice;
            }
            patient.save();
            patSub = true;
          }
          else if(hp.Type === healthPackageType && hp.Status === "Unsubscribed"  && !patSub){
            hp.Status = "Subscribed";
            hp.RenewalDate = aYearFromNow;
            hp.CancellationDate = null;
            hp.PaymentMethod = paymentMethod;
            hp.SubscriptionStartDate = new Date();
            if(paymentMethod === "wallet"){
              patient.WalletAmount = patient.WalletAmount-totalPrice;
            }          
            patient.save();
            patSub = true;
          }
        }
        if (!patSub) {
          famMember.SubscribedHP.push({
            Type: healthPackageType,
            PaymentMethod: paymentMethod,
            Status: "Subscribed",
            SubscriptionStartDate: Date.now(),
            RenewalDate: aYearFromNow
          });

          if(paymentMethod === "wallet"){
            patient.WalletAmount = patient.WalletAmount-totalPrice;
          }        
          patient.save();
          famMember.save();
        }
      }
      res.status(200).send({ message: 'Subscribed successfully', patient });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
};

//Req 59: download selected prescription (PDF) 
const downloadPrescriptionPDF = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { patientUsername, doctorUsername} = req.params;
  if (!(req.user.Username === patientUsername)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
        if (!doctorUsername) {
            return res.status(400).json({ error: 'doctorUsername is a required parameter.' });
        }

        const prescriptions = await Prescription.find({ DoctorUsername: doctorUsername });

        if (!prescriptions || prescriptions.length === 0) {
            return res.status(404).json({ error: 'No prescriptions found for the specified doctor.' });
        }

        // Ensure the directory exists
        const directoryPath = path.join(__dirname, 'pdfs');
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath);
        }

        // Resolve the full file path
        const filePath = path.resolve(directoryPath, 'prescription.pdf');

        const pdfDoc = new PDFDocument();
        pdfDoc.pipe(fs.createWriteStream(filePath));

        // Customize the content of the PDF based on your prescription data
        prescriptions.forEach((prescription) => {
            pdfDoc.text(`Prescription ID: ${prescription._id}`);
            pdfDoc.text(`Doctor: ${prescription.DoctorUsername}`);
            pdfDoc.text(`Patient: ${prescription.PatientUsername}`);
            pdfDoc.text(`Description: ${prescription.Description}`);
            pdfDoc.text(`Date: ${prescription.Date}`);
            pdfDoc.text(`Dose: ${prescription.Dose}`);
            pdfDoc.text('-----------------------------------------');
        });

        pdfDoc.end();

        // Download the PDF
        res.download(filePath, 'prescription.pdf', (err) => {
            if (err) {
                return res.status(500).json({ error: `Error downloading PDF: ${err.message}` });
            }

            // Clean up the temporary PDF file after download
            fs.unlinkSync(filePath);
        });
    } catch (error) {
        return res.status(500).json({ error: `Error generating PDF: ${error.message}` });
    }
  }
};

// Req 66 


const AddRefundForPatient = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { username, appointmentId} = req.params;
  if (!(req.user.Username === username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      // Find the patient by username
      const patient = await patientSchema.findOne({ Username: username });

      if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient not found.' });
      }

      // Find the appointment by ID
      const appointment = await appointmentSchema.findById(appointmentId);

      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found.' });
      }

      // Check if the patient is associated with the appointment
      if (appointment.PatientUsername !== patient.Username) {
        return res.status(403).json({ success: false, message: 'Patient is not associated with this appointment.' });
      }

      // Check if the appointment is canceled
      if (appointment.Status.toLowerCase() !== 'canceled') {
        return res.status(400).json({ success: false, message: 'Refund can only be processed for canceled appointments.' });
      }

      // Calculate the refund amount based on your business logic
      const refundAmount = appointment.Price * 0.8; // Assuming 80% refund

      // Update the WalletAmount directly in the database using $inc
      await patientSchema.updateOne({ Username: username }, { $inc: { WalletAmount: refundAmount } });

      // Fetch the updated patient data after the update
      const updatedPatient = await patientSchema.findOne({ Username: username });

      return res.status(200).json({
        success: true,
        message: 'Refund processed successfully.',
        updatedWalletAmount: updatedPatient.WalletAmount,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }
};


// Req 64 Requesting a follow-up for a previous app (himself)

const requestFollowUpAppointment = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { username, appointmentId } = req.params;
  if (!(req.user.Username === username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      const { Date, Time } = req.body;

      // Find the patient by username
      const patient = await patientSchema.findOne({ Username: username });

      if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient not found.' });
      }

      // Find the previous appointment by ID
      const previousAppointment = await appointmentSchema.findById(appointmentId);

      if (!previousAppointment) {
        return res.status(404).json({ success: false, message: 'Previous appointment not found.' });
      }

      // Check if the patient is associated with the previous appointment
      if (previousAppointment.PatientUsername !== patient.Username) {
        return res.status(403).json({ success: false, message: 'Patient is not associated with this appointment.' });
      }

      // Check if the previous appointment is completed or following
      if (['Completed', 'completed', 'Following', 'following'].includes(previousAppointment.Status)) {
        // Save the follow-up request details in the database
        previousAppointment.FollowUpRequest = {
          Date,
          Time,
          Status: 'A new follow-up is Requested'
        };

        // Update the patient's status to 'Requested' 
        previousAppointment.Status = 'Requesting';

        // Save the updated patient and appointment
        previousAppointment.save();
      

        return res.status(200).json({ success: true, message: 'A new Follow-up appointment is requested successfully.' });
      } else {
        return res.status(400).json({ success: false, message: 'Follow-up appointment can only be requested for completed or following appointments.' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }
};

// Req 64 Requesting a follow-up for a previous appointment (family member)

const requestFollowUpForFamilyMember = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const {patientusername, doctorUsername } = req.params;

  
   if (!(req.user.Username === username)) {
   res.status(403).json("You are not logged in!");
   } else {
  try {
    const { familyMemberName, Date, Time } = req.body;

    // Find the patient by username
    const patient = await patientSchema.findOne({ Username: patientusername });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    // Check if the patient has family members
    if (patient.FamilyMembers.length === 0) {
      return res.status(403).json({ success: false, message: 'Patient has no family members.' });
    }

    // Check if the specified family member exists for the patient
    const familyMember = patient.FamilyMembers.find(member => member.Name === familyMemberName);

    if (!familyMember) {
      return res.status(404).json({ success: false, message: 'Family member not found for the patient.' });
    }

    // Find the previous appointment by doctor's username and patient's username
    const previousAppointment = await appointmentSchema.findOne({
      DoctorUsername: doctorUsername,
      PatientUsername: patient.Username,
    });

    if (!previousAppointment) {
      return res.status(404).json({ success: false, message: 'Previous appointment not found.' });
    }

    // Check if the patient or family member is associated with the previous appointment
    if (
      previousAppointment.PatientUsername !== patient.Username &&
      previousAppointment.PatientUsername !== familyMember.Name
    ) {
      return res
        .status(403)
        .json({ success: false, message: 'Patient or family member is not associated with this appointment.' });
    }

    // Check if the previous appointment is completed or following
    if (['Completed', 'completed', 'Following', 'following'].includes(previousAppointment.Status)) {
      // Save the follow-up request details in the database
      previousAppointment.FollowUpRequest = {
        Date,
        Time,
        Status: 'Requested',
        RequestingFamilyMember: familyMember.Name,
      };

      // Update the appointment's status to 'Requested'
      previousAppointment.Status = 'Requesting';

      // Save the updated appointment
      await previousAppointment.save();

      return res.status(200).json({ success: true, message: 'Follow-up appointment requested successfully.' });
    } else {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Follow-up appointment can only be requested for completed or following appointments.',
        });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
  }
};


const ViewAllPres = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { PatientUsername } = req.params;
  if (!(req.user.Username === PatientUsername)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      const patient = await patientSchema.findOne({ Username: PatientUsername });

      if (!patient) {
        return res.status(404).send({ error: 'Patient not found' });
      }

      const prescriptions = await prescriptionSchema.find({ PatientUsername: PatientUsername });

      if (!prescriptions || prescriptions.length === 0) {
        return res.status(404).send({ error: 'No prescriptions found for the specified patient.' });
      }

      res.status(200).send(prescriptions);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
}

const ViewPresDetails = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { PatientUsername , id } = req.params;
  if (!(req.user.Username === PatientUsername)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      const prescription = await Prescription.findById(id);
      if (!prescription) {
          return res.status(404).json({ error: 'Prescription not found' });
      }

      res.status(200).json(prescription);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  }
};


const rescheduleAppointment = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { username, appointmentId , timeSlot } = req.params;

  if (!(req.user.Username === username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      //const { newDate, newTime } = req.body;

      // Find the patient by username
      const patient = await patientSchema.findOne({ Username: username });

      if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient not found.' });
      }

      // Find the selected appointment by ID
      const selectedAppointment = await appointmentSchema.findById(appointmentId);

      if (!selectedAppointment) {
        return res.status(404).json({ success: false, message: ' appointment not found.' });
      }

      // Check if the patient is associated with the selected appointment
      if (selectedAppointment.PatientUsername !== patient.Username) {
        return res.status(403).json({ success: false, message: 'Patient is not associated with this appointment.' });
      }

      // Check if the selected appointment is upcoming or following
      if (['Upcoming', 'upcoming', 'Following', 'following'].includes(selectedAppointment.Status)) {

       

      // Fetch the doctor's details using DoctorUsername
        const doctorUsername = selectedAppointment.DoctorUsername;
        const doctor = await doctorSchema.findOne({ Username: doctorUsername });

        if (!doctor) {
          return res.status(404).json({ success: false, message: 'Doctor not found.' });
        }

        // Access doctor's available time slots
        const doctorAvailableTimeSlots = doctor.AvailableTimeSlots;

        // Match the appointment date and time with the doctor's available time slots
        const selectedAppointmentDate = selectedAppointment.Date;
        const selectedAppointmentTime = selectedAppointment.Time;

        const matchingTimeSlot = doctorAvailableTimeSlots.find(slot =>
          slot.Date.getTime() === selectedAppointmentDate.getTime() &&
          slot.Time === selectedAppointmentTime &&
          slot.Status === 'booked'
        );

        if (matchingTimeSlot) {
          matchingTimeSlot.Status = 'available';
         } else {
          return res.status(403).json({ success: false, message: 'Cannot reschedule this appointment' });
        }
      
        let slot;
        var found = false;
        for(const s of doctorAvailableTimeSlots){
          if(!found){
          if(s._id.equals(timeSlot)){
            found = true;
            slot = s;
          }
        }
        }

        if(slot.Status === "available"){
          let newAppointment;
  
          
          newAppointment = await appointmentSchema.create({
            Date: slot.Date,
            Time: slot.Time,
            DoctorUsername: selectedAppointment.DoctorUsername,
            PatientUsername: selectedAppointment.PatientUsername,
            Status: selectedAppointment.Status,
            PaymentMethod: selectedAppointment.PaymentMethod,
            Price: selectedAppointment.Price,
            Name: selectedAppointment.Name
          });
  
            
          slot.Status = "booked";
          await doctor.save();
          res.status(200).send(newAppointment);
        }
        else{
          return res.status(400).send("This slot is already booked");
        }

         // Update the patient's status to 'Rescheduled' 
         selectedAppointment.Status = 'Rescheduled';

         // Save the updated patient and appointment
         await selectedAppointment.save();

      
        return res.status(200).json({ success: true, message: 'Appointment is rescheduled' });
      } else {
        return res.status(400).json({ success: false, message: 'Reschedule appointment can only be requested for Upcoming or following appointments.' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }
};



const rescheduleAppointmentFamMem = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { username, appointmentId , timeSlot } = req.params;
  const { familyId } = req.body;

  if (!(req.user.Username === username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      //const { newDate, newTime } = req.body;

      // Find the patient by username
      const patient = await patientSchema.findOne({ Username: username });

      if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient not found.' });
      }

      const familyMem = await FamilyMember.findOne({NationalID: familyId, PatientUsername: username});

      if(!familyMem){
        return res.status(404).send({ error: 'Family member not found' });
      }

      // Find the selected appointment by ID
      const selectedAppointment = await appointmentSchema.findById(appointmentId);

      if (!selectedAppointment) {
        return res.status(404).json({ success: false, message: ' appointment not found.' });
      }

      // Check if the patient is associated with the selected appointment
      if (selectedAppointment.PatientUsername !== patient.Username) {
        return res.status(403).json({ success: false, message: 'Patient is not associated with this appointment.' });
      }

      // Check if the selected appointment is upcoming or following
      if (['Upcoming', 'upcoming', 'Following', 'following'].includes(selectedAppointment.Status)) {

       

      // Fetch the doctor's details using DoctorUsername
        const doctorUsername = selectedAppointment.DoctorUsername;
        const doctor = await doctorSchema.findOne({ Username: doctorUsername });

        if (!doctor) {
          return res.status(404).json({ success: false, message: 'Doctor not found.' });
        }

        // Access doctor's available time slots
        const doctorAvailableTimeSlots = doctor.AvailableTimeSlots;

        // Match the appointment date and time with the doctor's available time slots
        const selectedAppointmentDate = selectedAppointment.Date;
        const selectedAppointmentTime = selectedAppointment.Time;

        const matchingTimeSlot = doctorAvailableTimeSlots.find(slot =>
          slot.Date.getTime() === selectedAppointmentDate.getTime() &&
          slot.Time === selectedAppointmentTime &&
          slot.Status === 'booked'
        );

        if (matchingTimeSlot) {
          matchingTimeSlot.Status = 'available';
         } else {
          return res.status(403).json({ success: false, message: 'Cannot reschedule this appointment' });
        }
      
        let slot;
        var found = false;
        for(const s of doctorAvailableTimeSlots){
          if(!found){
          if(s._id.equals(timeSlot)){
            found = true;
            slot = s;
          }
        }
        }

        if(slot.Status === "available"){
          let newAppointment;
  
          
          newAppointment = await appointmentSchema.create({
            Date: slot.Date,
            Time: slot.Time,
            DoctorUsername: selectedAppointment.DoctorUsername,
            PatientUsername: selectedAppointment.PatientUsername,
            Status: selectedAppointment.Status,
            PaymentMethod: selectedAppointment.PaymentMethod,
            Price: selectedAppointment.Price,
            Name: familyMem.Name
          });
  
            
          slot.Status = "booked";
          await doctor.save();
          res.status(200).send(newAppointment);
        }
        else{
          return res.status(400).send("This slot is already booked");
        }

         // Update the patient's status to 'Rescheduled' 
         selectedAppointment.Status = 'Rescheduled';

         // Save the updated patient and appointment
         await selectedAppointment.save();

      
        return res.status(200).json({ success: true, message: 'Appointment is rescheduled' });
      } else {
        return res.status(400).json({ success: false, message: 'Reschedule appointment can only be requested for Upcoming or following appointments.' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }
};


const cancelAppointment = async (req, res) => {
  try {
    const { username, appointmentId } = req.params;

    if (req.user.Username !== username) {
      return res.status(403).json({ success: false, message: 'You are not logged in!' });
    }

    const patient = await patientSchema.findOne({ Username: username });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    const selectedAppointment = await appointmentSchema.findById(appointmentId);

    if (!selectedAppointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    if (selectedAppointment.PatientUsername !== patient.Username) {
      return res.status(403).json({ success: false, message: 'Patient is not associated with this appointment.' });
    }

    if (!['Upcoming', 'upcoming', 'Following', 'following'].includes(selectedAppointment.Status)) {
      return res.status(400).json({ success: false, message: 'Cancel appointment can only be requested for Upcoming or following appointments.' });
    }

    const appointmentDateTime = new Date(selectedAppointment.Date);
    appointmentDateTime.setHours(selectedAppointment.Time, 0, 0, 0);

    const currentTime = new Date();

    // Calculate the time difference in milliseconds between the current time and appointment time
    const timeDifference = appointmentDateTime.getTime() - currentTime.getTime();

    // Convert milliseconds to hours
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    if (hoursDifference >= 24) {
      // Calculate the refund amount based on your business logic
      const refundAmount = selectedAppointment.Price;

      // Update the WalletAmount directly in the database using $inc
      await patientSchema.updateOne({ Username: username }, { $inc: { WalletAmount: refundAmount } });
    }

    const doctor = await doctorSchema.findOne({ Username: selectedAppointment.DoctorUsername });

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    const matchingTimeSlot = doctor.AvailableTimeSlots.find(slot =>
      slot.Date.getTime() === selectedAppointment.Date.getTime() &&
      slot.Time === selectedAppointment.Time &&
      slot.Status === 'booked'
    );

    if (matchingTimeSlot) {
      matchingTimeSlot.Status = 'available';
    }

    // Update existing appointment status to 'canceled'
    selectedAppointment.Status = 'Canceled';

    // Save changes to appointment and doctor
    await selectedAppointment.save();
    await doctor.save();
    //await Promise.all([selectedAppointment.save(), doctor.save()]);

    return res.status(200).json({ success: true, message: 'Appointment is canceled' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};


const cancelAppointmentFamMem = async (req, res) => {
  try {
    const { username, appointmentId , familyId } = req.params;

    if (req.user.Username !== username) {
      return res.status(403).json({ success: false, message: 'You are not logged in!' });
    }

    const patient = await patientSchema.findOne({ Username: username });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    const familyMem = await FamilyMember.findOne({NationalID: familyId, PatientUsername: username});

      if(!familyMem){
        return res.status(404).send({ error: 'Family member not found' });
      }

    const selectedAppointment = await appointmentSchema.findById(appointmentId);

    if (!selectedAppointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    if (selectedAppointment.PatientUsername !== patient.Username) {
      return res.status(403).json({ success: false, message: 'Patient is not associated with this appointment.' });
    }

    if (!['Upcoming', 'upcoming', 'Following', 'following'].includes(selectedAppointment.Status)) {
      return res.status(400).json({ success: false, message: 'Cancel appointment can only be requested for Upcoming or following appointments.' });
    }

    const appointmentDateTime = new Date(selectedAppointment.Date);
    appointmentDateTime.setHours(selectedAppointment.Time, 0, 0, 0);

    const currentTime = new Date();

    // Calculate the time difference in milliseconds between the current time and appointment time
    const timeDifference = appointmentDateTime.getTime() - currentTime.getTime();

    // Convert milliseconds to hours
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    if (hoursDifference >= 24) {
      // Calculate the refund amount based on your business logic
      const refundAmount = selectedAppointment.Price;

      // Update the WalletAmount directly in the database using $inc
      await patientSchema.updateOne({ Username: username }, { $inc: { WalletAmount: refundAmount } });
    }

    const doctor = await doctorSchema.findOne({ Username: selectedAppointment.DoctorUsername });

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    const matchingTimeSlot = doctor.AvailableTimeSlots.find(slot =>
      slot.Date.getTime() === selectedAppointment.Date.getTime() &&
      slot.Time === selectedAppointment.Time &&
      slot.Status === 'booked'
    );

    if (matchingTimeSlot) {
      matchingTimeSlot.Status = 'available';
    }

    // Update existing appointment status to 'canceled'
    selectedAppointment.Status = 'Canceled';

    // Save changes to appointment and doctor
    await selectedAppointment.save();
    await doctor.save();
    //await Promise.all([selectedAppointment.save(), doctor.save()]);

    return res.status(200).json({ success: true, message: 'Appointment is canceled' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};


module.exports = {
  registerPatient,
  addFamMember,
  getFamMembers,
  searchDocByName,
  searchDocBySpec,
  findDocBySpecality,
  findDocByAvailability,
  viewDoctorsWithSessionPrices,
  viewDoctorInfo,
  addPresToPatient,
  viewMyPres,
  viewAllMyPres,
  filterMyPresBasedOnDate,
  filterMyPresBasedOnDoctor,
  filterMyPresBasedOnFilled,
  patientFilterAppsByDate,
  patientFilterAppsByStatus,
  allAppointments,
  //choosePaymentMethodForApp,
  choosePaymentMethodForHP,
  viewWalletAmountByPatient,
  //payForAppointment,
  viewHealthPackages,
  viewSubscribedHealthPackages,
  cancelHealthCarePackageSubscription,
  viewHealthCarePackageStatus,
  viewHealthPackageStatusOfFamilyMember,
  addMedicalHistoryDocument,
  deleteMedicalHistoryDocument,
  viewMedicalHistoryDocuments,
  viewHealthRecords,
  selectAppointmentDateTimeAndPayFam,
  selectAppointmentDateTimeAndPay,
  availableDoctorApps,
  patientUpcoming,
  patientPastApp,
  linkPatientAccountAsFam,
  subscribeToAHealthPackage,
  subscribeToAHealthPackageForFamilyMember,
  downloadPrescriptionPDF ,
  requestFollowUpAppointment,
  requestFollowUpForFamilyMember ,
  AddRefundForPatient,
  ViewAllPres,
  ViewPresDetails,
  viewSubscribedHealthPackagesOfFamilyMember,
  cancelHealthCarePackageSubscriptionOfFamMember,
  rescheduleAppointment,
  rescheduleAppointmentFamMem,
  cancelAppointment,
  cancelAppointmentFamMem

}
