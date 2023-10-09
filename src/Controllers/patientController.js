const { default: mongoose } = require("mongoose");
const { isEmailUnique, isUsernameUnique } = require("../utils.js")
const patientSchema = require('../Models/Patient.js');
const doctorSchema = require('../Models/Doctor.js');
const prescriptionSchema = require('../Models/Prescription.js');
const FamilyMember = require('../Models/FamilyMember.js');
const appointment = require('../Models/Appointment.js');
const HealthPackage = require("../Models/HealthPackage.js");
const Appointment = require("../Models/Appointment.js");


// Task 1 : register patient
const registerPatient = async (req, res) => {
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
  } = req.body;

  try {

    if (!(await isUsernameUnique(Username))) {
      throw new Error('Username is already taken.');
    }

    if (!(await isEmailUnique(Email))) {
      throw new Error('Email is already in use.');
    }

    const patient = await patientSchema.register(
      Username,
      Name,
      Email,
      Password,
      DateOfBirth,
      Gender,
      MobileNumber,
      EmergencyContactName,
      EmergencyContactMobile
    );

    await patient.save();
    res.status(200).json({ patient });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Req 18: app.post('/addFamMember/:Username')
const addFamMember = async (req, res) => {
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

    patient.FamilyMembers.push(newFamilyMember.id);
    await patient.save();

    res.status(200).send({ familyMember: newFamilyMember });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}


// Req 22 app.get('/getFamMembers/:Username')

const getFamMembers = async (req, res) => {
  const { Username } = req.params;
  try {
    const patient = await patientSchema.findOne({ Username: Username });

    if (!patient) {
      return res.status(404).send({ error: 'Patient not found' });
    }

    const familyMembers = patient.FamilyMembers;

    const members = await FamilyMember.find({ _id: { $in: familyMembers } });

    if (members.length === 0) {
      return res.status(404).send('No family members linked to this patient');
    }

    const FamMembersInfo = members.map((member) => ({
      Name: member.Name,
      RelationToPatient: member.RelationToPatient,
    }));

    res.status(200).send(FamMembersInfo);

  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Req 37: view a list of all doctors
const viewDoctorsWithSessionPrices = async (req, res) => {
  try {
    const { Username } = req.params;
    const patient = await patientSchema.findOne({ username: Username });

    if (!patient) {
      return res.status(404).send({ error: 'Patient not found' });
    }

    const doctors = await doctorSchema.find().exec();

    const result = [];

    for (const doctor of doctors) {
      const doctorRate = doctor.HourlyRate;

      const clinicMarkup = 0.10; // 10% markup

      let sessionPrice = doctorRate;

      const healthPackage = await HealthPackage.findOne({ PatientsIDs: req.user._id }).exec();

      if (healthPackage) {
        const discountPercentage = healthPackage.doctorSessionDiscount || 0;

        const discountAmount = (doctorRate * discountPercentage) / 100;

        sessionPrice -= discountAmount;
      }

      sessionPrice += sessionPrice * clinicMarkup;

      result.push({
        Name: doctor.Name,
        Speciality: doctor.Speciality,
        sessionPrice
      });
    }


    res.status(200).json(result);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Req 39: search for a doctor by name/speciality
const findDocBySpecalityAndavail = async (req, res) => {

  const { Speciality, date, time } = req.body;
  //console.log(Speciality)

  const filter = {};
  try {

    if (Speciality) {
      filter.Speciality = Speciality;
    }

    if (date && time) {
      filter.Schedule = {
        $elemMatch: {
          date: new Date(date),
          time: time,
        },
      };
    }
    //console.log(filter)
    const doctors = await doctorSchema.find(filter);
    if (doctors.length == 0) {
      res.status(404).send({ error: 'Doctor is not Found' });
    }
    res.status(200).send(doctors)

  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while filtering doctors.' });
  }
}



// Req 38 : app.get('/searchDocByNameAndSpec')
const searchDocByNameAndSpec = async (req, res) => {
  try {
    const { Name, Speciality } = req.body
    const filter = {}
    if (Name)
      filter.Name = Name
    if (Speciality)
      filter.Speciality = Speciality
    console.log(filter)
    if (filter.length == 0)
      res.status(404).send({ error: 'Doctor is not Found' });

    const doctors = await doctorSchema.find(filter)
    if (doctors.length == 0) {
      res.status(404).send({ error: 'Doctor is not Found' });
    }
    res.status(200).send(doctors)
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while filtering doctors.' });
  }
}

//Req 40+41: Select a doctor from results and view all his info
const viewDoctorInfo = async (req, res) => {
  const {Username} = req.params;
  try{
    const doctor = await doctorSchema.findOne({Username: Username},{_id:0, Password:0, patients:0});

    if(!doctor){
      return res.status(404).send({ error: 'Doctor not found' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

//app.post('/addPresToPatient/:Username/:id')
const addPresToPatient = async (req, res) => {
  const { Username, id } = req.params;
  try {
    const patient = await patientSchema.findOne(Username);

    if (!patient) {
      return res.status(404).send({ error: 'Patient not found' });
    }

    patient.PatientPrescriptions.push(id);

    await patient.save();

    res.status(200).send({ message: 'Prescription added to patient' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};



// Req 54: app.get('/viewMyPres/:Username')
const viewAllMyPres = async (req, res) => {
  const { Username } = req.params;
  try {
    const patient = await patientSchema.findOne(Username);

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
      Date: prescription.Date
    }));

    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};


//app.get('/filterMyPres/:Username')

const filterMyPres = async (req, res) => {
  const { Username } = req.params;
  const { Date, DoctorUsername, Filled } = req.body;

  try {
    const patient = await patientSchema.findOne({ Username });

    if (!patient) {
      return res.status(404).send({ error: 'Patient not found' });
    }

    const query = { _id: { $in: patient.PatientPrescriptions } };

    if (Date) {
      query.Date = Date;
    }

    if (DoctorUsername) {
      query.DoctorUsername = DoctorUsername;
    }

    if (Filled !== undefined) {
      query.Filled = Filled;
    }

    const prescriptions = await prescriptionSchema.find(query);

    if (prescriptions.length === 0) {
      return res.status(404).send('No prescriptions found for the specified criteria');
    }

    const result = prescriptions.map((prescription) => ({
      prescriptionID: prescription._id,
      Appointment_ID: prescription.Appointment_ID,
      Date: prescription.Date,
      Filled: prescription.Filled,
    }));

    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const viewMyPres = async (req,res) => {
  const { id } = req.params;
  try {
    const prescription = await prescriptionSchema.findById();

    if (!prescription) {
      return res.status(404).send({ error: 'Prescription not found' });
    }

    const patient = await patientSchema.findOne({Username: prescription.PatientUsername});

    const doctor = await doctorSchema.findOne({Username: prescription.DoctorUsername});

    const appointment = await Appointment.findOne({_id: prescription.Appointment_ID});

    const result = {
      PatientName: patient.Name,
      DoctorName: doctor.Name,
      Description: prescription.Description,
      Date: prescription.Date,
      Filled: prescription.Filled,
      AppointmentStatus: appointment.status
    }

    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
} 

module.exports = {
  registerPatient,
  addFamMember,
  getFamMembers,
  searchDocByNameAndSpec,
  findDocBySpecalityAndavail,
  viewDoctorsWithSessionPrices,
  viewDoctorInfo,
  addPresToPatient,
  viewMyPres,
  viewAllMyPres,
  filterMyPres
}