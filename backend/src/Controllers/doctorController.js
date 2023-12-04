const { StatusFile } = require('git');
const { default: mongoose } = require("mongoose");
const appointmentSchema = require('../Models/Appointment.js');
const doctorSchema = require('../Models/Doctor.js');
const patientSchema = require('../Models/Patient.js');
const contractSchema = require('../Models/Contract.js');
const Prescription = require('../Models/Prescription.js');
const FamilyMember = require('../Models/FamilyMember.js');
const Appointment = require("../Models/Appointment.js");
const Notification = require("../Models/notifications.js");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const axios = require('axios'); // for making HTTP requests


const { isEmailUnique, isUsernameUnique } = require('../utils.js');
//const Appointment = require ('../Models/Appointment.js');
//const Doctor = require('../Models/Doctor'); 

// register Doctor
const registerDoctor = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const {
    Username,
    Name,
    Email,
    Password,
    DateOfBirth,
    HourlyRate,
    Affiliation,
    EDB,
    Speciality
  } = req.body;

  try {
    if (!req.files || !req.files['IDDocument'] || !req.files['MedicalDegreeDocument'] || !req.files['WorkingLicenseDocument']) {
      return res.status(400).json('Missing file(s)');
    }

    if (!(await isUsernameUnique(Username))) {
      return res.status(400).json('Username is already taken.');
    }

    if (!(await isEmailUnique(Email))) {
      return res.status(400).json('Email is already in use.');
    }

    if (!Username ||
      !Name ||
      !Email ||
      !Password ||
      !DateOfBirth ||
      !HourlyRate ||
      !Affiliation ||
      !EDB ||
      !Speciality) {
      return res.status(400).json('All fields must be filled.');
    }

    const guestDoctor = new doctorSchema({
      Username,
      Name,
      Email,
      Password,
      DateOfBirth,
      HourlyRate,
      Affiliation,
      EDB,
      Speciality,
      IDDocument: {
        data: Buffer.from(req.files['IDDocument'][0].buffer),
        contentType: req.files['IDDocument'][0].mimetype,
      },
      MedicalDegreeDocument: {
        data: Buffer.from(req.files['MedicalDegreeDocument'][0].buffer),
        contentType: req.files['MedicalDegreeDocument'][0].mimetype,
      },
      WorkingLicenseDocument: {
        data: Buffer.from(req.files['WorkingLicenseDocument'][0].buffer),
        contentType: req.files['WorkingLicenseDocument'][0].mimetype,
      },
    });

    await guestDoctor.save();
    res.status(200).json({ guestDoctor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Req 14(edit/ update my email, hourly rate or affiliation (hospital))
const updateDoctorByEmail = async (req, res) => {
  const { Username } = req.params;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      const doctor = await doctorSchema.findOne({ Username: Username });

      if (!doctor) {
        return res.status(404).json({ error: "This doctor doesn't exist!" })
      }

      const updatedDoc = {
        $set: {
          Email: req.body.Email
        },
      };

      const updated = await doctorSchema.updateOne({ Username: Username }, updatedDoc);
      const doc = await doctorSchema.findOne({ Username: Username });
      res.status(200).json({ doc });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

const updateDoctorByHourlyRate = async (req, res) => {

  const { Username } = req.params;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {

      const doctor = await doctorSchema.findOne({ Username: Username });

      if (!doctor) {
        return res.status(404).json({ error: "This doctor doesn't exist!" })
      }

      const updatedDoc = {
        $set: {
          HourlyRate: req.body.HourlyRate
        },
      };

      const updated = await doctorSchema.updateOne({ Username: Username }, updatedDoc);
      const doc = await doctorSchema.findOne({ Username: Username });
      res.status(200).json({ doc });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

const updateDoctorByAffiliation = async (req, res) => {

  const { Username } = req.params;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      const doctor = await doctorSchema.findOne({ Username: Username });

      if (!doctor) {
        return res.status(404).json({ error: "This doctor doesn't exist!" })
      }

      const updatedDoc = {
        $set: {
          Affiliation: req.body.Affiliation
        },
      };

      const updated = await doctorSchema.updateOne({ Username: Username }, updatedDoc);
      const doc = await doctorSchema.findOne({ Username: Username });
      res.status(200).json({ doc });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

//Req 23 (filter appointments by date/status)
const docFilterAppsByDate = async (req, res) => {

  const { Username, Date} = req.params;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      const doctor = await doctorSchema.findOne({ Username: Username });

      if (!doctor) {
        return res.status(404).json({ error: "This doctor doesn't exist!" })
      }
      // Use the filter object to query the appointment collection
      const filteredAppointments = await appointmentSchema.find({ DoctorUsername: Username, Date: Date });

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

const docFilterAppsByStatus = async (req, res) => {

  const { Username, Status} = req.params;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {

      const user = await doctorSchema.findOne({ Username: Username });
      if (!user) {
        return res.status(404).send('No doctor found');
      }

      // Use the filter object to query the appointment collection
      const filteredAppointments = await appointmentSchema.find({ DoctorUsername: Username, Status: Status });

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
  const { Username} = req.params;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      const user = await doctorSchema.findOne({ Username: Username });
      if (!user) {
        return res.status(404).send('No doctor found');
      }

      // Use the filter object to query the appointment collection
      const filteredAppointments = await appointmentSchema.find({ DoctorUsername: Username });

      if (filteredAppointments.length === 0) {
        return res.status(404).send('No matching appointments found');
      }

      // Send the list of matching appointments as a response
      res.status(200).send(filteredAppointments);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
}

//Req 25 (view information and health records of patient registered with me)
const viewInfoAndRecords = async (req, res) => {

  const { DoctorUsername, PatientUsername } = req.params;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === DoctorUsername)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {

      // Find the doctor by ID
      const doctor = await doctorSchema.findOne({ Username: DoctorUsername });

      if (!doctor) {
        return res.status(404).send('Doctor not found');
      }

      const patientsUsernames = doctor.PatientsUsernames; // Assuming it's an array of patient IDs

      // Find all patients whose IDs are in the patientIds array
      const patients = await patientSchema.findOne({ Username: PatientUsername });

      if (!patients) {
        return res.status(404).send('No patients found for this doctor');
      }

      // You can send the list of patients and their health records as a response
      res.status(200).send(patients);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
}

//Req 33 (view a list of all my patients)
const MyPatients = async (req, res) => {

  const { Username } = req.params;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{

    try {
      // Find the doctor by ID
      const doctor = await doctorSchema.findOne({ Username: Username });

      if (!doctor) {
        return res.status(404).send('Doctor not found');
      }

      const patientsUsernames = doctor.PatientsUsernames;
      // console.log(doctor.PatientsUsernames) 
      // Assuming it's an array of patient IDs

      // Find all patients whose IDs are in the patientIds array
      const patients = await patientSchema.find({ Username: { $in: patientsUsernames } });

      if (patients.length === 0) {
        return res.status(404).send('No patients found for this doctor');
      }

      const appointments = await appointmentSchema.find({ PatientUsername: { $in: patientsUsernames } });

      const result = [];
      for (const patient of patients) {
        for (const app of appointments) {
          if (app.PatientUsername === patient.Username) {
            result.push({
              Name: patient.Name,
              Username: patient.Username,
              Email: patient.Email,
              DateOfBirth: patient.DateOfBirth,
              Appointment_Status: app.Status
            });
          }
        }
      }
      res.status(200).send(patients);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
}

//Req 34 (search for a patient by name)
const PatientByName = async (req, res) => {

  const { Username, Name } = req.params;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{

    try {
      // Find patients with the given name
      const doc = await doctorSchema.findOne({ Username: Username });
      if (!doc) {
        return res.status(404).send("Doctor doesn't exist!");
      }

      const patients = await patientSchema.findOne({ Name: Name });

      if (!patients) {
        return res.status(404).send('No patients found with this name');
      }

      // Send the list of patients with matching names as a response
      res.status(200).send(patients);
    } catch (error) {
      res.status(500).send({ eror: error.message });
    }
  }
}

//Req 35 (filter patients based on upcoming appointments)
const PatientsUpcoming = async (req, res) => {

  const { Username } = req.params;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      // Find the doctor by ID
      const doctor = await doctorSchema.findOne({ Username: Username });

      if (!doctor) {
        return res.status(404).send('Doctor not found');
      }

      const patientsUsernames = doctor.PatientsUsernames; // Assuming it's an array of patient IDs

      // Find upcoming appointments for the doctor
      const upcomingAppointments = await appointmentSchema.find({
        DoctorUsername: Username,
        Status: { $in: ["Upcoming", "Following", "upcoming", "following"] }, // Adjust this condition based on your schema
        PatientUsername: { $in: patientsUsernames }
      }, { PatientUsername: 1, Date: 1, Status: 1, _id: 0 });

      if (upcomingAppointments.length === 0) {
        return res.status(404).send('No upcoming appointments found for this doctor');
      }

      // Find the patients based on the patient IDs from appointments
      /*const patients = await patientSchema.find(
        { Username: { $in: upcomingAppointments.PatientUsername}}
        );

      // Extract patient names and send them as an array
      const patientNames = upcomingAppointments.map(
        (PatientUsername) => 
        (PatientUsername));*/

      res.send(upcomingAppointments);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }
}

//Req 36 (select a patient from the list of patients)
const selectPatientWithHisName = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  const { DoctorId, Username } = req.params;

      // Find the doctor by ID
      const doctor = await doctorSchema.findById(DoctorId);

      if (!doctor) {
        return res.status(404).send('Doctor not found');
      }
  if (!(req.user.Username === doctor.Username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      // Find patients with the given name
      const patient = await patientSchema.findOne({ Username: Username });

      if (!patient) {
        return res.status(404).send('No patient found with this username');
      }

      // Send the list of patients with matching names as a response
      res.send(patient);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }
}


const addDoctor = async (req, res) => {
  const doc = new doctorSchema({
    Username: 'SobhyInjection3',
    Name: 'sobhyy',
    Email: 'SobhyInjection@icloud.comm23',
    Password: '12345',
    DateOfBirth: '2023-10-05',
    HourlyRate: 77,
    Affiliation: 'Tagamo3',
    EDB: 'homarrr',
    patients: ['651e02202d5bf34b78d9ae71', '651ecb157de4aa33de984688'],
    Speciality: 'Derma'
  });

  doc.save().then((result) => {
    res.send(result)
  }).catch((err) => {
    console.log(err);
  });
}

const viewContract = async (req, res) => {
  const { DoctorUsername } = req.params;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === DoctorUsername)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      const doctorExists = await doctorSchema.findOne({ Username: DoctorUsername });
      if (!doctorExists) {
        return res.status(404).json({ error: 'Doctor not found.' });
      }
      const contractDetails = await contractSchema.findOne({ DoctorUsername });

      if (!contractDetails) {
        return res.status(404).json({ error: "Contract not found for this doctor." });
      }
      res.status(200).json({ contract: contractDetails });
    } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  }
};

const acceptContract = async (req, res) => {
  const { DoctorUsername } = req.params;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === DoctorUsername)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      const doctorExists = await doctorSchema.findOne({ Username: DoctorUsername });
      if (!doctorExists) {
        return res.status(404).json({ error: 'Doctor not found.' });
      }
      const contractDetails = await contractSchema.findOne({ DoctorUsername });
      if (contractDetails.Status === 'accepted') {
        return res.status(404).json({ error: "Contract already accepted." });
      }
      const updatedContract = await contractSchema.findOneAndUpdate({ DoctorUsername: DoctorUsername }, { Status: 'accepted' }, { new: true });

      if (!updatedContract) {
        return res.status(404).json({ error: "Contract not found for this doctor." });
      }

      res.status(200).json({ message: 'Contract accepted successfully', contract: updatedContract });
    } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  }
};

//Req 67: view Wallet amount
const viewWalletAmountByDoc = async (req, res) => {

  const { DoctorUsername } = req.params;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === DoctorUsername)) {
    res.status(403).json("You are not logged in!");
  }else{

    try {
      const doc = await doctorSchema.findOne({ Username: DoctorUsername });

      if (!doc) {
        return res.status(404).send("No doctor found");
      }

      res.status(200).json(doc.WalletAmount);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
};

// Req 24 viewing the health records of a patient

const viewHealthRecords = async (req, res) => {
  const { DoctorUsername, PatientUsername } = req.params;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === DoctorUsername)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      const doctor = await doctorSchema.findOne({ Username: DoctorUsername });

      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found.' });
      }

      // Check if the patient is in the doctor's list of patients
      if (!doctor.PatientsUsernames.includes(PatientUsername)) {
        return res.status(404).json({ error: 'Patient not found in the doctor\'s list of patients.' });
      }

      const patient = await patientSchema.findOne({ Username: PatientUsername });

      if (!patient) {
        return res.status(404).json({ error: 'Patient not found.' });
      }

      // Retrieving the health records
      const healthRecords = patient.HealthRecords;

      if (healthRecords.length === 0) {
        return res.status(404).json({ message: 'No health records found for the patient.' });
      }

      // Sending the health records in the response
      res.status(200).json({ healthRecords });
    } catch (error) {
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  }
};


// Req 60 Add new health record for a patient

const addHealthRecordForPatient = async (req, res) => {
  const { DoctorUsername, PatientUsername } = req.params;
  const { Date, Description, Diagnosis, Medication } = req.body;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === DoctorUsername)) {
    res.status(403).json("You are not logged in!");
  }else{

    try {
      // Check if the doctor exists
      const doctor = await doctorSchema.findOne({ Username: DoctorUsername });
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found.' });
      }

      // Check if the doctor has the patient in their list
      if (!doctor.PatientsUsernames.includes(PatientUsername)) {
        return res.status(404).json({ error: 'Patient not found in the doctor\'s list of patients.' });
      }

      // Retrieve the patient by their username
      const patient = await patientSchema.findOne({ Username: PatientUsername });

      if (!patient) {
        return res.status(404).json({ error: 'Patient not found.' });
      }

      // Create a new health record object based on your model structure
      const healthRecord = {
        Date: Date,
        Description: Description,
        Diagnosis: Diagnosis,
        Medication: Medication,
      };

      // Add the new health record to the patient's healthRecords array
      patient.HealthRecords.push(healthRecord);
      await patient.save();

      res.status(200).json({ message: 'New health record added for the patient.', patient });
    } catch (error) {
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  }
};


// req 17 add availableTimeSlots

const addAvailableTimeSlots = async (req, res) => {
  const { DoctorUsername } = req.params;
  const { date, time } = req.body; // Assuming availableTimeSlots is an array of time slots

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === DoctorUsername)) {
    res.status(403).json("You are not logged in!");
  }else{

    try {
      const doctor = await doctorSchema.findOne({ Username: DoctorUsername });

      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found.' });
      }

      const slots = doctor.AvailableTimeSlots;
      var found = false;

      const newDate = new Date(date);

      for (const slot of slots) {
        if (!found) {

          if (slot.Date.getTime() === newDate.getTime() && slot.Time === Number(time)) {
            found = true;
            return res.status(404).send("Already added Slot in your Schedule");
          }
        }
      }

      // Add the received availableTimeSlots to the doctor's existing availableTimeSlots array
      if (!found) {
        doctor.AvailableTimeSlots.push({ Date: date, Time: time, Status: "available" });
      }
      await doctor.save();

      res.status(200).json(doctor.AvailableTimeSlots);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

// 51 schedule a follow-up for a patient
const scheduleFollowUp = async (req, res) => {
  const { DoctorUsername, PatientUsername } = req.params;
  const { date, time } = req.body;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === DoctorUsername)) {
    res.status(403).json("You are not logged in!");
  }else{

    try {
      // Check if the doctor and patient are associated
      const doctor = await doctorSchema.findOne({ Username: DoctorUsername });

      if (!doctor) {
        return res.status(404).json({ error: 'DOCTOR NOT FOUND' });
      }

      const patient = await patientSchema.findOne({ Username: PatientUsername });

      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      const slots = doctor.AvailableTimeSlots;
      var found = false;

      const newDate = new Date(date);

      for (const slot of slots) {
        if (!found) {
          if ((slot.Date.getTime() === newDate.getTime()) && (slot.Time === Number(time)) && (slot.Status === "available")) {
            found = true;
            slot.Status = "booked",
              doctor.save();
            console.log("Added a follow up");
          }
        }
      }

      const newAppointment = await appointmentSchema.create({
        Date: date,
        Time: time,
        DoctorUsername: DoctorUsername,
        PatientUsername: PatientUsername,
        Status: "Following",
        PaymentMethod: null,
        Price: 0,
        Name: patient.Name
      });
      return res.status(200).send(newAppointment);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};


const doctorPastApp = async (req, res) => {

  const { Username } = req.params;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === Username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      // Find the doctor by ID
      const doctor = await doctorSchema.findOne({ Username: Username });

      if (!doctor) {
        return res.status(404).send('Doctor not found');
      }

      const patientsUsernames = doctor.PatientsUsernames; // Assuming it's an array of patient IDs

      // Find upcoming appointments for the doctor
      const pastAppointments = await appointmentSchema.find({
        DoctorUsername: Username,
        Status: { $in: ["Finished", "Following", "finished", "following"] }, // Adjust this condition based on your schema
        PatientUsername: { $in: patientsUsernames }
      }, { PatientUsername: 1, Date: 1, Status: 1, _id: 0, Time: 1 });

      if (pastAppointments.length === 0) {
        return res.status(404).send('No upcoming appointments found for this doctor');
      }

      res.send(pastAppointments);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }
};

const createAvailableApps = async (req, res) => {
  const { DoctorUsername } = req.params;
  const { Date, Time, Price } = req.body;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === DoctorUsername)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      const doctor = await doctorSchema.findOne({ Username: DoctorUsername });

      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found.' });
      }

      const newApp = Appointment.create({
        DoctorUsername: DoctorUsername,
        Date: Date,
        Price: Price,
        Time: Time,
        Status: "Available"
      })

      await newApp.save();
      res.status(200).json({ message: 'Available Appointment added successfully', appointment: newApp });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};


//Req 53: add/update dosage for each medicine added to the prescription 

const updateDosage = async (req, res) => {
  const { DoctorUsername } = req.params;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === DoctorUsername)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      const { newDosage } = req.body;

      if (!DoctorUsername || newDosage === undefined || newDosage === null) {
        return res.status(400).json({ error: 'DoctorUsername and newDosage are required parameters.' });
      }

      const prescriptions = await Prescription.find({ DoctorUsername: DoctorUsername });

      if (!prescriptions || prescriptions.length === 0) {
        return res.status(404).json({ error: 'No prescriptions found for the specified doctor.' });
      }

      const updatedPrescriptions = await Promise.all(prescriptions.map(async (prescription) => {
        prescription.Dose = newDosage;
        return await prescription.save();
      }));

      return res.status(200).json({ updatedPrescriptions });
    } catch (error) {
      return res.status(500).json({ error: `Error updating dosage: ${error.message}` });
    }
  }
};

//Req 59: download selected prescription (PDF) 
const downloadPrescriptionPDF = async (req, res) => {
  const { DoctorUsername } = req.params;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === DoctorUsername)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      if (!DoctorUsername) {
        return res.status(400).json({ error: 'DoctorUsername is a required parameter.' });
      }

      const prescriptions = await Prescription.find({ DoctorUsername: DoctorUsername });

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

// Req 65 Accept a follow-up request

const acceptFollowUpRequest = async (req, res) => {
  const { DoctorUsername, PatientUsername } = req.params;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === DoctorUsername)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      // Find the doctor by username
      const doctor = await doctorSchema.findOne({ Username: DoctorUsername });

      if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor not found.' });
      }

      // Find the appointment by patient username
      const appointment = await appointmentSchema.findOne({ PatientUsername: PatientUsername });

      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found.' });
      }

      // Check if the appointment is in the 'Requesting' status
      if (appointment.Status === 'Requesting' || appointment.Status === 'requesting') {
        // Update the appointment status to 'Upcoming' or any appropriate status
        appointment.Status = 'Upcoming'; // You can set it to 'Upcoming' or any other status as needed
        // Save the updated appointment
        await appointment.save();

        return res.status(200).json({ success: true, message: 'Follow-up appointment request accepted successfully.' });
      } else {
        return res.status(400).json({ success: false, message: 'Invalid request. The appointment is not in the requesting status.' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }
};


// Req 65 reject a follow-up request

const rejectFollowUpRequest = async (req, res) => {
  const { DoctorUsername, PatientUsername } = req.params;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === DoctorUsername)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      // Find the doctor by username
      const doctor = await doctorSchema.findOne({ Username: DoctorUsername });

      if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor not found.' });
      }

      // Find the appointment by patient username
      const appointment = await appointmentSchema.findOne({ PatientUsername: PatientUsername });

      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found.' });
      }

      // Check if the appointment is in the 'Requesting' status
      if (appointment.Status === 'Requesting' || appointment.Status === 'requesting') {
        // Update the appointment status to 'Canceled' or any appropriate status
        appointment.Status = 'Canceled'; // You can set it to 'Canceled' or any other status as needed
        // Save the updated appointment
        await appointment.save();

        return res.status(200).json({ success: true, message: 'Follow-up appointment request rejected successfully.' });
      } else {
        return res.status(400).json({ success: false, message: 'Invalid request. The appointment is not in the requesting status.' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }
};

const ViewAllPres = async (req, res) => {
  const { DoctorUsername } = req.params;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === DoctorUsername)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      const doctor = await doctorSchema.findOne({ Username: DoctorUsername });
      if (!doctor) {
        return res.status(404).send("No doctor found");
      }
      const prescriptions = await Prescription.find({ DoctorUsername: DoctorUsername });
      if (!prescriptions || prescriptions.length === 0) {
        return res.status(404).send("No prescriptions found for this patient");
      }
      res.status(200).send(prescriptions);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
}

// add a patient's prescription 
const addPatientPrescription = async (req, res) => {
  const { username } = req.params; // doctor username
  const { PatientUsername } = req.params;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      const { description, date, appointmentID, dose } = req.body;

      if (!username || !PatientUsername || !description || !date || !appointmentID || !dose) {
        return res.status(400).json({ error: 'All fields must be filled.' });
      }

      const doctor = await doctorSchema.findOne({ Username: username });
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found.' });
      }

      const patient = await patientSchema.findOne({ Username: PatientUsername });
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found.' });
      }

      const prescription = await Prescription.create({
        DoctorUsername: username,
        PatientUsername: PatientUsername,
        Description: description,
        Date: date,
        Appointment_ID: appointmentID,
        Filled: false,
        Dose: dose,
      });

      patient.PatientPrescriptions.push(prescription._id);
      await patient.save();

      return res.status(200).json({ success: 'Prescription added successfully.', prescription });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }
}


// update a patient's prescription
const updatePatientPrescription = async (req, res) => {
  const { DoctorUsername, PatientUsername, prescriptionId } = req.params;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.user.Username === DoctorUsername)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      const { updatedDescription, updatedDose } = req.body;

      const doctor = await doctorSchema.findOne({ Username: DoctorUsername });
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found.' });
      }

      const patient = await patientSchema.findOne({ Username: PatientUsername });
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found.' });
      }

      const prescription = await Prescription.findOne({
        _id: prescriptionId,
        DoctorUsername: DoctorUsername,
        PatientUsername: PatientUsername,
      });

      if (!prescription) {
        return res.status(404).json({ error: 'Prescription not found or does not belong to the specified doctor and patient.' });
      }

      if (updatedDescription) {
        prescription.Description = updatedDescription;
      }

      if (updatedDose) {
        prescription.Dose = updatedDose;
      }

      const updatedPrescription = await prescription.save();

      return res.status(200).json({ success: 'Prescription updated successfully.', updatedPrescription });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }
};


const pharmacyAPIUrl = 'http://localhost:8001';

// Method to add medicine to a prescription
const addMedicineToPrescription = async (req, res) => {
  const { DoctorUsername, PatientUsername, medicineName } = req.body;

  try {
    // Fetch the prescription from the clinic database
    const prescription = await Prescription.findOne({
      DoctorUsername: DoctorUsername,
      PatientUsername: PatientUsername,
    });

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    // Make a request to the pharmacy platform to get medicine details
    const pharmacyResponse = await axios.get(`${pharmacyAPIUrl}/DocotorFromTheClinic/GetMedicineByDoctor/${medicineName}`);

    // Assuming the pharmacy API responds with medicine details
    const medicineDetails = pharmacyResponse.data;

    // Add the medicine details to the prescription
    prescription.medecine.push(medicineDetails.Name);

    // Save the updated prescription
    await prescription.save();

    return res.status(200).json({ message: 'Medicine added to prescription successfully', prescription });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


const DeleteMedecineFromPrescription = async (req, res) => {
  const { DoctorUsername, PatientUsername, MedicineName } = req.body;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  try {
    const prescription = await Prescription.findOne({
      DoctorUsername,
      PatientUsername,
    });

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found.' });
    }

    // const medicineIndex2 = prescription.medecine.findOneAndUpdate(

    // )

    // Find the index of the medicine in the medecine array
    const medicineIndex = prescription.medecine.findIndex(medicine => medicine === MedicineName);

    // Check if the medicineName exists in the prescription
    if (medicineIndex === -1) {
      return res.status(404).json({ error: 'Medicine not found in the prescription.' });
    }

    // Remove the medicine at the specified index
    prescription.medecine.splice(medicineIndex, 1);

    // Save the updated prescription
    await prescription.save();

    res.status(200).json({ message: 'Medicine deleted from prescription successfully.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const rescheduleAppointmentPatient = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { username, appointmentId , timeSlot } = req.params;

  if (!(req.user.Username === username)) {
    res.status(403).json("You are not logged in!");
  }else{
    try {
      //const { newDate, newTime } = req.body;

      // Find the patient by username
      const doctor = await patientSchema.findOne({ Username: username });

      if (!doctor) {
        return res.status(404).json({ success: false, message: 'doctor not found.' });
      }

      // Find the selected appointment by ID
      const selectedAppointment = await appointmentSchema.findById(appointmentId);

      if (!selectedAppointment) {
        return res.status(404).json({ success: false, message: ' appointment not found.' });
      }

      // Check if the docotr is associated with the selected appointment
      if (selectedAppointment.DoctorUsername !== doctor.Username) {
        return res.status(403).json({ success: false, message: 'doctor is not associated with this appointment.' });
      }

      // Check if the selected appointment is upcoming or following
      if (['Upcoming', 'upcoming', 'Following', 'following'].includes(selectedAppointment.Status)) {

        

      // Fetch the patient's details using DoctorUsername
        const patientUsername = selectedAppointment.PatientUsername;
        const patient = await patientSchema.findOne({ Username: patientUsername });

        if (!patient) {
          return res.status(404).json({ success: false, message: 'Patient not found.' });
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
 
        // Update the App status to 'Rescheduled' 
        selectedAppointment.Status = 'Rescheduled';

        // Save the updated appointment
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


const cancelAppointmentPatient = async (req, res) => {
  try {
    const { username, appointmentId } = req.params;

    if (req.user.Username !== username) {
      return res.status(403).json({ success: false, message: 'You are not logged in!' });
    }

    const doctor = await doctorSchema.findOne({ Username: username });

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    const selectedAppointment = await appointmentSchema.findById(appointmentId);

    if (!selectedAppointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    if (selectedAppointment.DoctorUsername !== doctor.Username) {
      return res.status(403).json({ success: false, message: 'Doctor is not associated with this appointment.' });
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

    const patient = await patientSchema.findOne({ Username: selectedAppointment.PatientUsername });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    
      // Calculate the refund amount based on your business logic
      const refundAmount = selectedAppointment.Price;

      // Update the WalletAmount directly in the database using $inc
      await patientSchema.updateOne({ Username: patient.Username }, { $inc: { WalletAmount: refundAmount } });
  

   
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


const cancelAppointmentPatientFamMem = async (req, res) => {
  try {
    const { username, appointmentId , familyId } = req.params;

    if (req.user.Username !== username) {
      return res.status(403).json({ success: false, message: 'You are not logged in!' });
    }

    const doctor = await doctorSchema.findOne({ Username: username });

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    const selectedAppointment = await appointmentSchema.findById(appointmentId);

    if (!selectedAppointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    if (selectedAppointment.DoctorUsername !== doctor.Username) {
      return res.status(403).json({ success: false, message: 'Doctor is not associated with this appointment.' });
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

    const patient = await patientSchema.findOne({ Username: selectedAppointment.PatientUsername });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    const familyMem = await FamilyMember.findOne({NationalID: familyId, PatientUsername: patient.Username});

      if(!familyMem){
        return res.status(404).send({ error: 'Family member not found' });
      }


      // Calculate the refund amount based on your business logic
      const refundAmount = selectedAppointment.Price;

      // Update the WalletAmount directly in the database using $inc
      await patientSchema.updateOne({ Username: patient.Username }, { $inc: { WalletAmount: refundAmount } });
    

   
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





const createDoctorAppointmentNotifications = async () => {
  try {
    const upcomingAppointments = await Appointment.find({ Status: { $in: ["Upcoming", "Following","following","upcoming"] } });
    const canceledAppointments = await Appointment.find({ Status: { $in: ["Canceled"] } });
    const rescheduledAppointments = await Appointment.find({ Status: { $in: ["Rescheduled"] } });

    // Handle upcoming appointments
    for (const appointment of upcomingAppointments) {
      const existingDoctorNotificationUP = await Notification.findOne({ type: "Appointment", DoctorMessage: `Appointment with patient ${appointment.PatientUsername} on ${appointment.Date}` });

      if (!existingDoctorNotificationUP) {
        const newNotification = await Notification.create({
          type: "Appointment",
          username: `${appointment.DoctorUsername}`,
          DoctorMessage: `Appointment with patient ${appointment.PatientUsername} on ${appointment.Date}`,
        });
        console.log(newNotification);
        await newNotification.save();
        console.log('Appointment notification added');
      } else {
        console.log('Appointment notification already exists');
      }
    }

    // Handle canceled appointments
    for (const appointment of canceledAppointments) {
      const existingDoctorNotificationCa = await Notification.findOne({ type: "Appointment", DoctorMessage: `Appointment with patient ${appointment.PatientUsername} on ${appointment.Date} has been canceled.` });
      if (!existingDoctorNotificationCa) {
        const newNotification = await Notification.create({
          type: "Appointment",
          username: `${appointment.DoctorUsername}`,
          DoctorMessage: `Appointment with patient ${appointment.PatientUsername} on ${appointment.Date} has been canceled.`,
        });
        await newNotification.save();
        console.log('Canceled appointment notification added');
      } else {
        console.log('Canceled appointment notification already exists');
      }
    }

    // Handle rescheduled appointments
    for (const appointment of rescheduledAppointments) {
      const existingDoctorNotificationRe = await Notification.findOne({ type: "Appointment", DoctorMessage: `Appointment with patient ${appointment.PatientUsername} on ${appointment.Date} has been rescheduled.` });

      if (!existingDoctorNotificationRe) {
        const newNotification = await Notification.create({
          type: "Appointment",
          username: `${appointment.DoctorUsername}`,
          DoctorMessage: `Appointment with patient ${appointment.PatientUsername} on ${appointment.Date} has been rescheduled.`,
        });

        await newNotification.save();
        console.log('Rescheduled appointment notification added');
      } else {
        console.log('Rescheduled appointment notification already exists');
      }
    }
    await removeDoctorAppointmentNotifications();
  } catch (error) {
    console.error(error);
  }
};

const removeDoctorAppointmentNotifications = async () => {
  try {
    const pastAppointments = await Appointment.find({ Date: { $lt: new Date() } });
    for (const appointment of pastAppointments) {
      const existingDoctorNotification = await Notification.findOne({ type: "Appointment", DoctorMessage: `Appointment with patient ${appointment.PatientUsername} on ${appointment.Date}` });
      if (existingDoctorNotification) {
        await existingDoctorNotification.remove();
        console.log('Appointment notification removed');

      } else {
        console.log('Appointment notification does not exist');
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const displayDoctorNotifications = async (req, res) => {
  try {
    await createDoctorAppointmentNotifications(req);
    const { Username } = req.params;
    console.log(Username);
    const notifications = await Notification.find({ username: Username });
    const doctorMessages = notifications.map(notification => notification.DoctorMessage);
    res.status(200).json({ success: true, doctorMessages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

const nodemailer = require('nodemailer');

const sendAppointmentDoctorRescheduleNotificationEmail = async (req) => {
  try {
    const { AppointmentId } = req.params;
    console.log('AppointmentId:', AppointmentId);

    if (!mongoose.Types.ObjectId.isValid(AppointmentId)) {
      console.error('Invalid ObjectId format for AppointmentId');
      return;
    }

    const appointment = await Appointment.findById(AppointmentId);

    if (!appointment) {
      console.error('Appointment not found for the given appointmentId');
      return;
    }

    const { PatientUsername, DoctorUsername, Date} = appointment;
    const Doctor = require('../Models/Doctor'); 
    const doctor = await Doctor.findOne({ Username: DoctorUsername });

    if (!doctor) {
      console.error(`Doctor not found for the given username: ${DoctorUsername}`);
      return;
    }

    const doctorEmail = doctor.Email; // Adjust the attribute accordingly

    console.log(doctor);
    console.log(doctorEmail);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'SuicideSquadGUC@gmail.com',
        pass: 'wryq ofjx rybi hpom',
      },
    });

    const subject = 'Appointment Rescheduled';
    const text = `Dear ${DoctorUsername},

    We would like to inform you that the following appointment has been rescheduled:

    - Patient: ${PatientUsername}
    - Date: ${Date}

    Please make a note of the new appointment details. If you have any questions, feel free to contact us.

    Best regards,
    Your Clinic`;

    const mailOptions = {
      from: 'SuicideSquadGUC@gmail.com',
      to: doctorEmail,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log('Appointment notification email sent successfully');
  } catch (error) {
    console.error('Failed to send appointment notification email:', error);
  }
};



const sendAppointmentDoctorCancelledNotificationEmail = async (req) => {
  try {
    const { AppointmentId } = req.params;
    console.log('AppointmentId:', AppointmentId);

    if (!mongoose.Types.ObjectId.isValid(AppointmentId)) {
      console.error('Invalid ObjectId format for AppointmentId');
      return;
    }

    const appointment = await Appointment.findById(AppointmentId);

    if (!appointment) {
      console.error('Appointment not found for the given appointmentId');
      return;
    }

    const { PatientUsername, DoctorUsername, Date, RescheduleReason } = appointment;
    const Doctor = require('../Models/Doctor'); // Adjust the model path accordingly
    const doctor = await Doctor.findOne({ Username: DoctorUsername });

    if (!doctor) {
      console.error(`Doctor not found for the given username: ${DoctorUsername}`);
      return;
    }

    const doctorEmail = doctor.Email; // Adjust the attribute accordingly

    console.log(doctor);
    console.log(doctorEmail);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'SuicideSquadGUC@gmail.com',
        pass: 'wryq ofjx rybi hpom',
      },
    });

    const subject = 'Appointment Cancelled';
    const text = `Dear ${DoctorUsername},

    We're sorry to inform you that the following appointment has been Cancelled:

    - Patient: ${PatientUsername}
    - Date: ${Date}

    If you have any questions, feel free to contact us.

    Best regards,
    Your Clinic`;

    const mailOptions = {
      from: 'SuicideSquadGUC@gmail.com',
      to: doctorEmail,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log('Appointment notification email sent successfully');
  } catch (error) {
    console.error('Failed to send appointment notification email:', error);
  }
};




module.exports = {
  docFilterAppsByDate,
  docFilterAppsByStatus,
  viewInfoAndRecords,
  MyPatients,
  PatientByName,
  PatientsUpcoming,
  registerDoctor,
  updateDoctorByAffiliation,
  updateDoctorByEmail,
  updateDoctorByHourlyRate,
  selectPatientWithHisName,
  addDoctor,
  viewContract,
  allAppointments,
  acceptContract,
  viewWalletAmountByDoc,
  viewHealthRecords,
  addHealthRecordForPatient,
  addAvailableTimeSlots,
  scheduleFollowUp,
  doctorPastApp,
  createAvailableApps,
  updateDosage,
  downloadPrescriptionPDF,
  acceptFollowUpRequest,
  rejectFollowUpRequest,
  addPatientPrescription,
  ViewAllPres,
  updatePatientPrescription,
  addMedicineToPrescription,
  DeleteMedecineFromPrescription,
  rescheduleAppointmentPatient,
  cancelAppointmentPatient,
  cancelAppointmentPatientFamMem,
  displayDoctorNotifications,
  sendAppointmentDoctorRescheduleNotificationEmail,
  sendAppointmentDoctorCancelledNotificationEmail
};