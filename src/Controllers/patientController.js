const { default: mongoose } = require("mongoose");
const { isEmailUnique, isUsernameUnique } = require("../utils.js")
const patientSchema = require('../Models/Patient.js');
const doctorSchema = require('../Models/Doctor.js');
const prescriptionSchema = require('../Models/Prescription.js');
const FamilyMember = require('../Models/FamilyMember.js');
const appointment = require('../Models/Appointment.js');
const HealthPackage = require("../Models/HealthPackage.js");


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


//app.post('/addFamMember/:Username')
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

    const patient = await patientSchema.findOne({ Username });

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


//app.get('/getFamMembers/:Username')

const getFamMembers = async (req, res) => {
  const { Username } = req.params;
  try {
    const patient = await patientSchema.findOne({ Username });

    if (!patient) {
      return res.status(404).send({ error: 'Patient not found' });
    }

    const familyMembers = patient.FamilyMembers;

    const members = await FamilyMember.find({ _id: { $in: familyMembers } });

    if (members.length === 0) {
      return res.status(404).send('No patients found for this doctor');
    }

    const FamMembersInfo = members.map((member) => ({
      Name: member.Name,
      RelationToPatient: member.RelationToPatient,
    }));

    res.send(FamMembersInfo);

  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};


const viewDoctorsWithSessionPrices = async (req, res) => {
  try {
    const { Username } = req.params;
    const patient = await patientSchema.findOne({ username: Username });

    if (!patient) {
      return res.status(404).send({ error: 'Patient not found' });
    }

    const doctors = await Doctor.find().exec();

    const result = [];

    for (const doctor of doctors) {
      const doctorRate = doctor.HourlyRate;

      const clinicMarkup = 0.10; // 10% markup

      let sessionPrice = doctorRate;

      const healthPackage = await HealthPackage.findOne({ patientID: req.user._id }).exec();

      if (healthPackage) {
        const discountPercentage = healthPackage.doctorSessionDiscount || 0;

        const discountAmount = (doctorRate * discountPercentage) / 100;

        sessionPrice -= discountAmount;
      }

      sessionPrice += sessionPrice * clinicMarkup;

      result.push({
        Name: doctor.Nameame,
        Speciality: doctor.Speciality,
        sessionPrice,
      });
    }


    res.status(200).json(result);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};


const findDocBySpecalityAndavail = async (req, res) => {

  const { Speciality, date, time } = req.body;
  //console.log(Speciality)

  const filter = {}
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
    res.send(doctors)

  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while filtering doctors.' });
  }
}



//app.get('/searchDocByNameAndSpec')
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
    res.send(doctors)

  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while filtering doctors.' });
  }
}


module.exports = {
  registerPatient,
  addFamMember,
  getFamMembers,
  searchDocByNameAndSpec,
  findDocBySpecalityAndavail,
  viewDoctorsWithSessionPrices
}