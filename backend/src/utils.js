const Patient = require('./Models/Patient');
const GuestDoctor = require('./Models/GuestDoctor');
const Doctor = require('./Models/Doctor');
const Admin = require('./Models/Administrator');

async function isUsernameUnique(username) {
  const patientExists = await Patient.findOne({ Username: username });
  const guestDoctorExists = await GuestDoctor.findOne({ Username: username });
  const doctorExists = await Doctor.findOne({ Username: username });
  const adminExists = await Admin.findOne({ Username: username });
  return !patientExists && !guestDoctorExists && !adminExists && !doctorExists;
}

async function isEmailUnique(email) {
  const patientExists = await Patient.findOne({ Email: email });
  const guestDoctorExists = await GuestDoctor.findOne({ Email: email });
  const doctorExists = await Doctor.findOne({ Email: email });
  return !patientExists && !guestDoctorExists && !doctorExists;
}

module.exports = {
  isEmailUnique,
  isUsernameUnique
};
