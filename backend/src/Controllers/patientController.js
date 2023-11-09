const { default: mongoose } = require("mongoose");
const { isEmailUnique, isUsernameUnique } = require("../utils.js")
const patientSchema = require('../Models/Patient.js');
const doctorSchema = require('../Models/Doctor.js');
const prescriptionSchema = require('../Models/Prescription.js');
const FamilyMember = require('../Models/FamilyMember.js');
const appointmentSchema = require('../Models/Appointment.js');
const HealthPackage = require("../Models/HealthPackage.js");
const Appointment = require("../Models/Appointment.js");

require("dotenv").config();

const stripe = require('stripe')(process.env.STRIPE_KEY);


// Task 1 : register patient
const registerPatient = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
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

    const patientExists = await patientSchema.findOne({ NationalID: NationalID });

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

const patientFilterAppsByDate = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  const { Date, Username } = req.params;

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

const patientFilterAppsByStatus = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  const { Status, Username } = req.params;

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

const allAppointments = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  try {
    const { Username } = req.params;
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
};

// Req 39: Filter for a doctor by name/speciality
const findDocBySpecality = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  //console.log(Speciality)

  const { Username, Speciality } = req.params;
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
};

const findDocByAvailability = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  //console.log(Speciality)
  const { Date, Time } = req.params;
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
};

// Req 38 : app.get('/searchDocByNameAndSpec')
const searchDocByName = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  try {
    const { Name, Username } = req.params

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
};

const searchDocBySpec = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  try {
    const { Speciality, Username } = req.params

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
};

//Req 40+41: Select a doctor from results and view all his info
const viewDoctorInfo = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { DoctorUsername, PatientUsername } = req.params;

  try {
    const patient = await patientSchema.findOne({ Username: PatientUsername });

    if (!patient) {
      return res.status(404).send("NO patient found");
    }

    const doctor = await doctorSchema.findOne({ Username: DoctorUsername }, { _id: 0, Password: 0, patients: 0 });

    if (!doctor) {
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
};



// Req 54: app.get('/viewMyPres/:Username')
const viewAllMyPres = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { Username } = req.params;
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
};

const viewMyPres = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { id } = req.params;
  try {
    const prescription = await prescriptionSchema.findById(id);

    if (!prescription) {
      return res.status(404).send({ error: 'Prescription not found' });
    }

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

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { type, PatientUsername } = req.params;
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

};

//Req 67: view Wallet amount
const viewWalletAmountByPatient = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { PatientUsername } = req.params;

  try {
    const patient = await patientSchema.findOne({ Username: PatientUsername });

    if (!patient) {
      return res.status(404).send("No patient found");
    }

    res.status(200).json(patient.WalletAmount);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Req 30: view subscribed health packages for the patient and family members
const viewSubscribedHealthPackages = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { Username } = req.params;

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
    
    return res.status(404).send("The patient is not subscribed to any healthPackage at the moment");

    // Send the list of subscribed health packages as a response
  } catch (error) {
    res.status(400).json({ error: error.message });
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

  const { Username, healthPackageType } = req.params;

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
};

const viewHealthPackageStatus = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { Username, healthPackageType } = req.params;

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

    if(patientSubscription.length === 0){
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
      for(const hp of patientSubscription){
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
};

// Req 32: Cancel a subscription of a health package for the patient and family members
const cancelHealthCarePackageSubscription = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { Username, Type } = req.params;

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

        patient.WalletAmount = patient.WalletAmount+healthPackage.AnnualFee;
        // Save the updated patient
        await patient.save();
      }
      else if (hp.Type === Type && (hp.Status === "Cancelled" || hp.Status === "Unsubscribed")){
        return res.status(404).send('You are not subscribed to this health package');
      }
    }
    
    // Check if the patient has family members
    if (patient.FamilyMembers && patient.FamilyMembers.length > 0) {
      // Get the family members' usernames
      const familyMemberIds = patient.FamilyMembers;

      for (const familyMemberId of familyMemberIds) {
        // Find the family member by username
        const familyMember = await patientSchema.findOne({NationalID: familyMemberId});

        if (familyMember) {
          // Get the associated PatientUsername from the FamilyMember model
          const subscription = familyMember.SubscribedHP;
          if(subscription.length <= 0){
            console.log('Your family member is not subscribed to any health package');
          }

          for(const hp of subscription){
            if (hp.Type === Type && hp.Status === "Subscribed") {
              // Cancel the patient's subscription
              hp.Status = 'Cancelled';
              hp.CancellationDate = new Date();
              hp.RenewalDate = null;

              familyMember.WalletAmount = familyMember.WalletAmount+healthPackage.AnnualFee;

              // Save the updated patient
              await familyMember.save();
            }
          }
        }
      }
    }

    return res.status(200).send('Health package subscription has been cancelled for the patient and family members.');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Req 27 view health package options and details
const viewHealthPackages = async (req, res) => {
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
};

// // Task 2: upload medical history document
const addMedicalHistoryDocument = async (req, res) => {
  const username = req.params.Username;

  try {

    const patient = await patientSchema.findOne({ Username: username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    patient.MedicalHistoryDocuments.push(req.file.filename);

    await patient.save();

    return res.status(200).json({ message: 'Document uploaded successfully' });
  } catch (error) {
    console.error('Error in addMedicalHistoryDocument:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Task 2: delete medical history document
const deleteMedicalHistoryDocument = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { Username, filePathToRemove } = req.params;

  try {
    const patient = await patientSchema.findOne({ Username });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    const documentIndex = patient.MedicalHistoryDocuments.indexOf(filePathToRemove);

    if (documentIndex === -1) {
      return res.status(404).json({ error: 'Document not found' });
    }
    patient.MedicalHistoryDocuments.splice(documentIndex, 1);

    await patient.save();

    res.status(200).send({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// view medical history documents
const viewMedicalHistoryDocuments = async (req, res) => {
  const { Username } = req.params;

  try {
    const patient = await patientSchema.findOne({ Username: Username });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }
    const MedicalHistoryDocuments = patient.MedicalHistoryDocuments;
    if (MedicalHistoryDocuments.length === 0) {
      return res.status(404).json({ message: 'No health records found for the patient.' });
    }
    res.status(200).json({ MedicalHistoryDocuments });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const viewHealthRecords = async (req, res) => {
  const { Username } = req.params;

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
};

const patientPastApp = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  try {
    const { Username } = req.params;

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

const patientUpcoming = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  try {
    const { Username } = req.params;

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

const availableDoctorApps = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { Username } = req.params;
  const { DoctorUsername } = req.body;


  try {
    const patient = await patientSchema.findOne({ Username: Username });

    if (!patient) {
      return res.status(404).send({ error: 'Patient not found' });
    }

    const Appointments = await appointmentSchema.find({
      DoctorUsername: DoctorUsername,
      Status: { $in: ["Available", "available"] }, // Adjust this condition based on your schema
    }, { DoctorUsername: 1, Date: 1, Status: 1, _id: 0, Time: 1 });

    if (Appointments.length === 0) {
      return res.status(404).send('No upcoming appointments found for this patient');
    }

    res.send(Appointments);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
}

const selectAppointmentDateTimeAndPay = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { patientUsername, timeSlot, doctorUsername } = req.params;
  const { paymentMethod } = req.body;

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

    //var appDate = new Date(date);
    const booked = false;

    let newAppointment = {};

    for (const slot of availableSlots) {

      //if((appDate.getTime() === slot.Date.getTime()) && (time === slot.Time) && slot.Status === "available"){
      if (!booked && timeSlot === slot._id) {
        console.log("weseellt");
        slot.Status = "booked";
        doctor.save();

        newAppointment = appointmentSchema.create({
          Date: date,
          Time: time,
          DoctorUsername: doctorUsername,
          PatientUsername: patientUsername,
          Status: 'Upcoming',
          PaymentMethod: paymentMethod,
          Price: sessionPrice
        });

        booked = true;
      }
    }

    if (booked === false) {
      return res.status(404).send({ error: 'Selected appointment date and time are not available' });
    }

    // paying for appointment
    const appId = newAppointment._id;
    const app = await Appointment.findOne({ _id: appId });

    if (!app) {
      return res.status(404).send({ error: 'Appointment not found' });
    }

    if (paymentMethod === "card") {

      const paymentIntent = await stripe.paymentIntents.create({
        amount: app.Price,
        currency: 'egp',
        customer: patient.StripeCustomerId,
        description: "Paying for an appointment"
      });

      await stripe.paymentIntents.confirm(paymentIntent);
    }
    else if (paymentMethod === "wallet") {

      if (patient.WalletAmount < app.Price)
        return res.status(400).send("Your wallet amount won't cover the whole appointment price!")

      if (patient.WalletAmount >= app.Price) {
        const updatedPat = {
          $set: {
            WalletAmount: (WalletAmount - app.Price),
          },
        };

        const update = await patientSchema.updateOne({ Username: app.PatientUsername }, updatedPat);
      }
    }

    const updatedDoc = {
      $set: {
        WalletAmount: (WalletAmount + app.Price),
      },
    };

    const update = await doctorSchema.updateOne({ Username: app.DoctorUsername }, updatedDoc);

    res.status(200).send({ message: 'Appointment successfully scheduled', appointment: newAppointment });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};


const selectAppointmentDateTimeFamMem = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { Username } = req.params;
  const { Date, Time, DoctorUsername, Name, RelationToPatient } = req.body;

  try {
    const patient = await patientSchema.findOne({ Username: Username });

    if (!patient) {
      return res.status(404).send({ error: 'Patient not found' });
    }

    const FamilyMember = await FamilyMember.findOne({
      Name: Name,
      RelationToPatient: RelationToPatient,
      patientUsername: Username

    })

    if (!FamilyMember) {

      return res.status(404).send({ error: 'Family Member Not registered to this patient' });
    }


    // Check if the selected date and time are available for the specified doctor
    const isAppointmentAvailable = await appointmentSchema.exists({
      DoctorUsername: DoctorUsername,
      Date: Date,
      Time: Time,
      Status: { $in: ["Available", "available"] },
    });

    if (!isAppointmentAvailable) {
      return res.status(400).send({ error: 'Selected appointment date and time are not available' });
    }

    // Create a new appointment for the patient
    const newAppointment = new appointmentSchema({
      Date: Date,
      Time: Time,
      DoctorUsername: DoctorUsername,
      PatientUsername: Username,
      Status: 'Upcoming',
    });

    await newAppointment.save();

    res.status(200).send({ message: 'Appointment successfully scheduled', appointment: newAppointment });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const linkPatientAccountAsFam = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { PatientUsername } = req.params;
  const { Email, RelationToPatient } = req.body;

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
    const familyMem = await FamilyMember.create({
      Name: famToBeLinked.Name,
      NationalID: famToBeLinked.NationalID,
      Age: ageofFam1,
      Gender: famToBeLinked.Gender,
      RelationToPatient: RelationToPatient,
      PatientUsername: PatientUsername
    });

    patient.save();

    famToBeLinked.FamilyMembers.push(patient.NationalID);
    famToBeLinked.save();

    res.status(200).send({ message: 'Patient is successfully linked', LinkedPatient: famToBeLinked, MyPatient: patient });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const subscribeToAHealthPackage = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { patientUsername, healthPackageType } = req.params;
  const { paymentMethod } = req.body;

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

    const healthPackagesOfPatient = patient.SubscribedHP;
    var patSub = false;

    const aYearFromNow = new Date();
    aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);

    for (const hp of healthPackagesOfPatient) {
      if (hp.Status === "Subscribed" && !patSub) {
        patSub = true;
        return res.status(404).send("You are already subscribed to a health package");
      }
      else if(hp.Type === healthPackageType && hp.Status === "Cancelled" && !patSub){
        hp.Status = "Subscribed";
        hp.RenewalDate = aYearFromNow;
        hp.CancellationDate = null;
        hp.PaymentMethod = paymentMethod;
        hp.SubscriptionStartDate = new Date();
        patient.WalletAmount = patient.WalletAmount-healthPackage.AnnualFee;

        patient.save();
        patSub = true;
      }
      else if(hp.Type === healthPackageType && hp.Status === "Unsubscribed"  && !patSub){
        hp.Status = "Subscribed";
        hp.RenewalDate = aYearFromNow;
        hp.CancellationDate = null;
        hp.PaymentMethod = paymentMethod;
        hp.SubscriptionStartDate = new Date();
        patient.WalletAmount = patient.WalletAmount-healthPackage.AnnualFee;
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
      patient.WalletAmount = patient.WalletAmount-healthPackage.AnnualFee;
      patient.save();
    }
  }
  else{
    return res.status(404).send("Not enough cash in the wallet");
  }

    // Check if the patient has family members
    if (patient.FamilyMembers && patient.FamilyMembers.length > 0) {
      // Get the family members' usernames
      const familyMemberIds = patient.FamilyMembers;

      for (const familyMemberId of familyMemberIds) {
        // Find the family member by username
        const familyMember = await patientSchema.findOne({NationalID: familyMemberId});

        if (familyMember) {
          // Get the associated PatientUsername from the FamilyMember model
          const healthPackagesOfFam = familyMember.SubscribedHP;
          var patSub1 = false;

          const aYearFromNow = new Date();
          aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);

          for (const hp of healthPackagesOfFam) {
            if (hp.Status === "Subscribed" && !patSub1) {
              patSub1 = true;
              console.log("Your family member is already subscribed to a health package");
            }
            else if(hp.Type === healthPackageType && hp.Status === "Cancelled" && !patSub1){
              hp.Status = "Subscribed";
              hp.RenewalDate = aYearFromNow;
              hp.CancellationDate = null;
              hp.PaymentMethod = paymentMethod;
              hp.SubscriptionStartDate = new Date();

              familyMember.save();
              patSub1 = true;
            }
            else if(hp.Type === healthPackageType && hp.Status === "Unsubscribed"  && !patSub1){
              hp.Status = "Subscribed";
              hp.RenewalDate = aYearFromNow;
              hp.CancellationDate = null;
              hp.PaymentMethod = paymentMethod;
              hp.SubscriptionStartDate = new Date();

              familyMember.save();
              patSub1 = true;
            }
      
          }
          if (!patSub1) {
            familyMember.SubscribedHP.push({
              Type: healthPackageType,
              PaymentMethod: paymentMethod,
              Status: "Subscribed",
              SubscriptionStartDate: Date.now(),
              RenewalDate: aYearFromNow
            });

            familyMember.save();
          }
        }
      }
    }
    res.status(200).send({ message: 'Subscribed successfully', patient });
  } catch (error) {
    res.status(500).send({ error: error.message });
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
  viewHealthPackageStatus,
  addMedicalHistoryDocument,
  deleteMedicalHistoryDocument,
  viewMedicalHistoryDocuments,
  viewHealthRecords,
  selectAppointmentDateTimeFamMem,
  selectAppointmentDateTimeAndPay,
  availableDoctorApps,
  patientUpcoming,
  patientPastApp,
  linkPatientAccountAsFam,
  subscribeToAHealthPackage
}
