const Patient = require('./Models/Patient');
const GuestDoctor = require('./Models/GuestDoctor');
const Admin = require('./Models/Admin');

async function isUsernameUnique(username) {
  const patientExists = await Patient.findOne({ Username: username });
  const doctorExists = await GuestDoctor.findOne({ Username: username });
  const adminExists = await Admin.findOne({ Username: username });
  return !patientExists && !doctorExists && !adminExists;
}

async function isEmailUnique(email) {
  const patientExists = await Patient.findOne({ Email: email });
  const doctorExists = await GuestDoctor.findOne({ Email: email });
  return !patientExists && !doctorExists;
}

module.exports = {
  isEmailUnique,
  isUsernameUnique
};
