const { default: mongoose } = require("mongoose");
const { isEmailUnique, isUsernameUnique } = require("../utils.js")
const patientSchema = require('../Models/Patient.js');
const doctorSchema = require('../Models/Doctor.js');
const prescriptionSchema = require('../Models/Prescription.js');
const FamilyMember = require('../Models/FamilyMember.js');
const appointmentSchema = require('../Models/Appointment.js');
const HealthPackage = require("../Models/HealthPackage.js");
const Appointment = require("../Models/Appointment.js");

const express = require("express");
const Stripe = require("stripe");
require("dotenv").config();
const stripe = Stripe(process.env.STRIPE_KEY);


// Task 1 : register patient
const registerPatient = async (req, res) => {
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials',true);
  
  const {
    Username,
    Name,
    Email,
    Password,
    DateOfBirth,
    Gender,
    MobileNumber,
    EmergencyContactName,
    EmergencyContactMobile,
    FamilyMembers,
    PatientPrescriptions
  } = req.body;
  
  try {
    if (!(await isUsernameUnique(Username))) {
      throw new Error('Username is already taken.');
    }

    if (!(await isEmailUnique(Email))) {
      throw new Error('Email is already in use.');
    }
console.log("username",Username)
    const patient = await patientSchema.register(
      Username,
      Name,
      Email,
      Password,
      DateOfBirth,
      Gender,
      MobileNumber,
      EmergencyContactName,
      EmergencyContactMobile,
      FamilyMembers,
      PatientPrescriptions
    );

    await patient.save();
    res.status(200).json({patient});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Req 18: app.post('/addFamMember/:Username')
const addFamMember = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { Username } = req.params;
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
};


// Req 22 app.get('/getFamMembers/:Username')

const getFamMembers = async (req, res) => {
  const { Username } = req.params;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

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
};

const patientFilterAppsByDate = async (req,res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  const { Date, Username } = req.params;

    try {
        const user = await patientSchema.findOne({Username: Username});

        if(!user){
          return res.status(404).send('No patient found');
        }
        // Use the filter object to query the appointment collection
        const filteredAppointments = await appointmentSchema.find({PatientUsername: Username, Date: Date});

        if (filteredAppointments.length === 0) {
            return res.status(404).send('No matching appointments found');
        }
        // Send the list of matching appointments as a response
        res.send(filteredAppointments);
    } catch (error) {
        res.status(500).send({error: error.message});
    }
}

const patientFilterAppsByStatus = async (req,res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  const { Status, Username } = req.params;      

  try {
      const user = await patientSchema.findOne({Username: Username});

        if(!user){
          return res.status(404).send('No patient found');
        }

      // Use the filter object to query the appointment collection
      const filteredAppointments = await appointmentSchema.find({PatientUsername: Username, Status: Status});

      if (filteredAppointments.length === 0) {
          return res.status(404).send('No matching appointments found');
      }

      // Send the list of matching appointments as a response
      res.status(200).send({filteredAppointments});
  } catch (error) {
      res.status(500).send({error: error.message});
  }
}

const allAppointments = async (req,res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  try{
    const {Username} = req.params;
    const user = await patientSchema.findOne({Username: Username});
    if(!user){  
         return res.status(404).send('No patient found');
    }

      // Use the filter object to query the appointment collection
      const filteredAppointments = await appointmentSchema.find({PatientUsername: Username});

      if (filteredAppointments.length === 0) {
          return res.status(404).send('No matching appointments found');
      }

      // Send the list of matching appointments as a response
      res.status(200).send({filteredAppointments});
  } catch (error) {
    res.status(500).send({error: error.message});
}
}

// Req 37: view a list of all doctors
const viewDoctorsWithSessionPrices = async (req, res) => {
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  try {
    
    const { Username } = req.params;
    const patient = await patientSchema.findOne({ Username: Username });

    if (!patient) {
      return res.status(404).send({ error: 'Patient not found' });
    }

    const doctors = await doctorSchema.find().exec();

    const result = [];

    for (const doctor of doctors) {
      console.log("sccc",doctor.Schedule)
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
        Username:doctor.Username,
        Email: doctor.Email,
        Speciality: doctor.Speciality,
        sessionPrice,
        Schedule: doctor.Schedule
      });
    }
    
    res.status(200).json(result);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Req 39: Filter for a doctor by name/speciality
const findDocBySpecality = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  //console.log(Speciality)

  const { Username, Speciality} = req.params;
  try {

    const patient = await patientSchema.findOne({Username: Username});

    if(!patient){
      return res.status(404).send("NO patient found");
    }

    //console.log(filter)
    const doctors = await doctorSchema.find({Speciality: Speciality});
    if (doctors.length === 0) {
      return res.status(404).send({ error: 'Doctor is not Found' });
    }
    res.status(200).send(doctors)

  }
  catch (error) {
    res.status(500).json({ error: error.message
     });
  }
};

const findDocByAvailability = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  //console.log(Speciality)
  const {Date, Time} = req.params;
  try {

    // const patient = await patientSchema.findOne({Username: Username});

    // if(!patient){
    //   return res.status(404).send("NO patient found");
    // }

    const doctors = await doctorSchema.find();
    //const result = doctors.flatMap(({Schedule}) => Schedule.map(({Date,Time}) => ({Date,Time})));

    const result = [];
    for (const doc of doctors){
      // const sch = doc.Schedule.map(({Date, From, To})=>({Date, From, To}));
    doc.Schedule.map((e) => {

      if(e.Date.toISOString().substring(0,4)=== Date.substring(0,4) && e.Date.toISOString().substring(5,7) === Date.substring(5,7) && e.Date.toISOString().substring(8,10) === Date.substring(8,10)
      && e.From<=Time && e.To>=Time){
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
    res.status(500).json({ error: error.message});
    }
};

// Req 38 : app.get('/searchDocByNameAndSpec')
const searchDocByName = async (req, res) => {
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  try {
    const { Name, Username } = req.params

    const patient = await patientSchema.findOne({Username: Username});

    if(!patient){
      return res.status(404).send("NO patient found");
    }

    const doctors = await doctorSchema.find({Name: Name})
    if (doctors.length === 0) {
      return res.status(404).send({ error: 'Doctor is not Found' });
    }
    res.status(200).send(doctors)
  }
  catch (error) {
    res.status(500).json({ error: error.message});
    }
};

const searchDocBySpec = async (req, res) => {
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  try {
    const { Speciality, Username } = req.params

    const patient = await patientSchema.findOne({Username: Username});

    if(!patient){
      return res.status(404).send("NO patient found");
    }
    
    const doctors = await doctorSchema.find({Speciality: Speciality})
    if (doctors.length === 0) {
      return res.status(404).send({ error: 'Doctor is not Found' });
    }

    res.status(200).send(doctors)
  }
  catch (error) {
    res.status(500).json({ error: error.message});
  }
};

//Req 40+41: Select a doctor from results and view all his info
const viewDoctorInfo = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const {DoctorUsername, PatientUsername} = req.params;
    
  try{
    const patient = await patientSchema.findOne({Username: PatientUsername});

    if(!patient){
      return res.status(404).send("NO patient found");
    }

    const doctor = await doctorSchema.findOne({Username: DoctorUsername},{_id:0, Password:0, patients:0});

    if(!doctor){
      return res.status(404).send({ error: 'Doctor not found' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

//app.post('/addPresToPatient/:Username/:id')
const addPresToPatient = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { Username, id } = req.params;
  try {
    const patient = await patientSchema.findOne({Username: Username});

    if (!patient) {
      return res.status(404).send({ error: 'Patient not found' });
    }

    patient.PatientPrescriptions.push(id);

    await patient.save();

    res.status(200).send({ message: patient});
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};



// Req 54: app.get('/viewMyPres/:Username')
const viewAllMyPres = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { Username } = req.params;
  try {
    const patient = await patientSchema.findOne({Username: Username});

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
};


//app.get('/filterMyPres/:Username')



const filterMyPresBasedOnDate = async (req, res) => {
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  const { Username, Date } = req.params;
  try {
    const patient = await patientSchema.findOne({ Username: Username });

    if (!patient) {
      return res.status(404).send({ error: 'Patient not found' });
    }

    const query = { _id: { $in: patient.PatientPrescriptions },Date: Date };

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
};

const filterMyPresBasedOnFilled = async (req, res) => {
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  const { Username, Filled } = req.params;

  try {
    const patient = await patientSchema.findOne({ Username: Username });

    if (!patient) {
      return res.status(404).send({ error: 'Patient not found' });
    }

    const query = { _id: { $in: patient.PatientPrescriptions }, Filled: Filled};

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
};

const filterMyPresBasedOnDoctor = async (req, res) => {
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  const { Username, DoctorUsername } = req.params;

  try {
    const patient = await patientSchema.findOne({ Username: Username });

    if (!patient) {
      return res.status(404).send({ error: 'Patient not found' });
    }

    const query = { _id: { $in: patient.PatientPrescriptions }, DoctorUsername: DoctorUsername};

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
};

const viewMyPres = async (req,res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { id } = req.params;
  try {
    const prescription = await prescriptionSchema.findById(id);

    if (!prescription) {
      return res.status(404).send({ error: 'Prescription not found' });
    }

    const patient = await patientSchema.findOne({Username: prescription.PatientUsername});

    const doctor = await doctorSchema.findOne({Username: prescription.DoctorUsername});

    const appointment = await Appointment.findOne({_id: prescription.Appointment_ID});

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
};

//Req 20: choose payment method of appointment
const choosePaymentMethodForApp = async(req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { id } = req.params;
  try{
    
    const app = await HealthPackage.findById(id);

    if(!app){
      return res.status(404).json({error : "This appointment doesn't exist!"})
  }

  const updatedApp = {
    $set: {
        PaymentMethod: req.body.PaymentMethod
    },
  };

  const updated = await Appointment.updateOne({_id: id},updatedApp);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }

};

//Req 29: choose payment method of health package
const choosePaymentMethodForHP = async(req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { type,PatientUsername } = req.params;
  try{
    
    const hp = await HealthPackage.findOne({Type: type});

    if(!hp){
      return res.status(404).json({error : "This health package doesn't exist!"})
  }

  const patient = await patientSchema.findOne({Username: PatientUsername});

    if(!patient){
      return res.status(404).json({error : "This patient doesn't exist!"})
  }

  const updatedHP = {
    $set: {
      "SubscribedHP.$[].PaymentMethod": req.body.PaymentMethod
    }
  };

  const updated = await patientSchema.updateOne({Username: PatientUsername, "SubscribedHP.Type": type}, updatedHP);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }

};

//Req 67: view Wallet amount
const viewWalletAmountByPatient = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const {PatientUsername} = req.params;
    
  try{
    const patient = await patientSchema.findOne({Username: PatientUsername});

    if(!patient){
      return res.status(404).send("No patient found");
    }

    res.status(200).json(patient.WalletAmount);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
//Task 30: 
const viewSubscribedHealthPackages = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { Username } = req.params;

  try {
    
    const patient = await patientSchema.findOne({ Username: Username });

    if (!patient) {
      return res.status(404).send({ error: 'Patient not found' });
    }

    // Get the health packages subscribed by the patient
    const healthPackages = await HealthPackage.find({ PatientsUsernames: Username });

    // Check if the patient has family members
    if (patient.FamilyMembers.length > 0) {
      // Get the usernames of family members
      const familyMemberUsernames = patient.FamilyMembers;

      // Find health packages for family members
      const familyHealthPackages = await HealthPackage.find({ PatientsUsernames: { $in: familyMemberUsernames } });

      // Combine the patient's and family members' health packages
      healthPackages.push(...familyHealthPackages);
    }

    if (healthPackages.length === 0) {
      return res.status(404).send('No subscribed health packages found');
    }

    res.status(200).send(healthPackages);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};



/*const payForAppointment = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const {username, id} = req.params;
  const { amount } = req.body;
    
  try{
    const patient = await patientSchema.findOne({Username: username});

    if(!patient){
      return res.status(404).send("No patient found");
    }

    const app = await appointmentSchema.findOne({_id: id});

    if(!app){
      return res.status(404).send("No appointment found");
    }

    const paymentIntent = await Stripe.paymentIntents.create({
      amount: amount,
      currency: 'egp'
    })

    res.status(200).json(patient.WalletAmount);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};*/

const payForAppointment = async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'egp',
          product_data: {
            name: 'Appointment',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: '${process.env.CLIENT_URL}/checkout-success',
    cancel_url: '${process.env.CLIENT_URL}/appointment',
  });

  res.send({url: session.url});
}


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
  choosePaymentMethodForApp,
  choosePaymentMethodForHP,
  viewWalletAmountByPatient
}