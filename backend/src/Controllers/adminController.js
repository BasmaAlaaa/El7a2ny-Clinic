const Admin = require("../Models/Administrator");
const Doctor = require("../Models/Doctor");
const Patient = require("../Models/Patient");
const HealthPackage = require("../Models/HealthPackage");
const GuestDoctor = require("../Models/GuestDoctor");
const Appointment = require("../Models/Appointment");
const Prescription = require("../Models/Prescription");
const FamilyMemberSchema = require("../Models/FamilyMember");
const Contract = require("../Models/Contract");
const jwt = require ('jsonwebtoken');
const Administrator = require("../Models/Administrator");
//const isUsernameUnique = require('../utils');

async function isUsernameUnique(username) {
  const patientExists = await Patient.findOne({ Username: username });
  const doctorExists = await GuestDoctor.findOne({ Username: username });
  const adminExists = await Admin.findOne({ Username: username });
  return !patientExists && !doctorExists && !adminExists;
}

async function isEmailUnique(email) {
  const patientExists = await Patient.findOne({ Email: email });
  const guestDoctorExists = await GuestDoctor.findOne({ Email: email });
  const doctorExists = await Doctor.findOne({ Email: email });
  const adminExists = await Admin.findOne({ Email: email });
  return !patientExists && !guestDoctorExists && !doctorExists && !adminExists;
}

// Task 8 : remove a patient, doctor, admin
const deleteEntity = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);

  try {
    // Destructure 'username' and 'entityType' from request parameters.
    const { entityType, Username } = req.params;

    // Determine which model to use based on the entity type.
    let Model;
    switch (entityType.toLowerCase()) {
      case "doctor":
        Model = Doctor;
        break;
      case "patient":
        Model = Patient;
        break;
      case "admin":
        Model = Admin;
        break;
      default:
        // If the entity type is invalid/not supported, return a 400 status code and an error message.
        return res.status(400).json({ error: "Invalid entity type" });
    }

    // Search and delete the document where the Username field equals the provided Username.
    switch (entityType.toLowerCase()) {
      case "doctor":
        const deletedAp1 = await Appointment.deleteMany({
          DoctorUsername: Username,
        });
        break;
      case "patient":
        const patient = await Patient.findOne({ Username: Username });
        const deletedAp2 = await Appointment.deleteMany({
          PatientUsername: Username,
        });
        const deletedPres = await Prescription.deleteMany({
          PatientUsername: Username,
        });

        const famMembersIds = patient.FamilyMembers;
        //const res = [];
        const allPatients = await Patient.find();
        for (let i = 0; i < famMembersIds.length; i++) {
          let x = false;
          for (const pat of allPatients) {
            if (
              !(pat.Username === Username) &&
              pat.FamilyMembers.includes(famMembersIds[i])
            ) {
              console.log(famMembersIds[i]);
              x = true;
              break;
            }
          }
          if (x === false) {
            const deleted = await FamilyMemberSchema.deleteOne({
              NationalID: famMembersIds[i],
            });
            console.log(deleted);
          }
        }
        //const deletedFams = await FamilyMemberSchema.deleteMany({NationalID:{ $in: famMembersIds}});

        const healthPacks = await HealthPackage.find();
        for (const hp of healthPacks) {
          const index = hp.PatientsUsernames.indexOf(Username);
          if (!index) {
            const update = await HealthPackage.updateOne(
              { Type: hp.Type },
              { $pull: { PatientsUsernames: Username } }
            );
          }
        }

        const docs = await Doctor.find();
        for (const doc of docs) {
          const index = doc.PatientsUsernames.indexOf(Username);
          if (!index) {
            const update = await Doctor.updateOne(
              { Username: doc.Username },
              { $pull: { PatientsUsernames: Username } }
            );
          }
        }
        break;
    }
    const deletedEntity = await Model.findOneAndDelete({ Username: Username });

    // Check if an entity was actually deleted; if not, respond with a 404 status code and an error message.
    if (!deletedEntity) {
      return res.status(404).json({ error: `${entityType} not found` });
    }

    // If an entity was found and deleted, respond with a 200 status code and a success message.
    res.status(200).json({ message: `${entityType} deleted successfully` });
  } catch (error) {
    // If an error occurs (e.g., a problem with the database), respond with a 500 status code and an error message.
    res.status(500).json({ error: error.message });
  }
};

// Task 7 : add admin to DB
const createAdmin = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);

  try {
    const { Username, Password, Email} = req.body;
    // Validate input, ensure admin does not already exist

    if (!Username || !Password || Email) {
      throw Error("All fields must be filled.");
    }

    if (!(await isUsernameUnique(Username))) {
      throw new Error("Username is already taken.");
    }

    if (!(await isEmailUnique(Email))) {
      throw new Error("Email is already taken.");
    }

    const newAdmin = new Admin({ Username, Password, Email });
    await newAdmin.save();

    res.status(200).json({ message: "New admin created", admin: newAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Task 8 : remove a patient, doctor, admin
const deleteEntity2 = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);

  try {
    // Destructure 'username' from request parameters.
    const { Username } = req.params;

    // Define an array of models to search through.
    const models = [Doctor, Patient, Admin];

    // Initialize a variable to store the deleted entity and the model name.
    let deletedEntity;
    let modelUsed;

    // Loop through each model and try to find and delete the entity.
    for (const Model of models) {
      deletedEntity = await Model.findOneAndDelete({ Username: Username });
      // If an entity is found and deleted, exit the loop.
      if (deletedEntity) {
        modelUsed = Model.modelName; // Assuming the model name is available on the Model object.
        break;
      }
    }

    // Check if an entity was actually deleted; if not, respond with a 404 status code and an error message.
    if (!deletedEntity) {
      return res.status(404).json({ error: "Entity not found" });
    }

    // If an entity was found and deleted, respond with a 200 status code and a success message.
    res.status(200).json({
      message: `${modelUsed} deleted successfully`,
      data: deletedEntity,
    });
  } catch (error) {
    // If an error occurs (e.g., a problem with the database), respond with a 500 status code and an error message.
    res.status(500).json({ error: "Server error" });
  }
};

// Task 9 : view all information of doctors who wants to join platform
const viewUnapprovedDoctors = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  try {
    // Find all doctors where IsApproved is false.
    const unapprovedDoctors = await GuestDoctor.find({ IsApproved: false },{Password: 0, DateOfBirth: 0, _id: 0});

    // Check if there are any unapproved doctors; if not, respond with a 404 status code and an error message.
    if (!unapprovedDoctors.length) {
      return res.status(404).json({ error: "No unapproved doctors found" });
    }

    // If there are unapproved doctors, respond with a 200 status code and the array of doctors.
    res.status(200).json({ doctors: unapprovedDoctors });
  } catch (error) {
    // If an error occurs (e.g., a problem with the database), respond with a 500 status code and an error message.
    res.status(500).json({ error: "Server error" });
  }
};

const viewDoctorInfo = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);

  try {
    const { Username } = req.params;

    const doc = await GuestDoctor.findOne(
      { Username: Username },
      { _id: 0, Password: 0 }
    );

    if (!doc) {
      return res
        .status(404)
        .json({ error: "No unapproved doctor found by this username" });
    }

    res.status(200).json({ doctor: doc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//Task 10:accept or reject the request of a doctor to join the platform
const acceptOrRejectDoctorRequest = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);

  try {
    const { Username } = req.params;
    const { action } = req.body;
    const guestDoctor = await GuestDoctor.findOne({ Username, IsApproved: false });
    // doctor doesn't exist or is already approved
    if (!guestDoctor) {
      return res
        .status(404)
        .json({ error: "Doctor not found or already approved" });
    }
    if (action === 'accept') {
      // Create a new doctor in the Doctor model.
      const newDoctor = new Doctor(guestDoctor.toObject());
      await newDoctor.save();
      // Delete from the GuestDoctor.
      await guestDoctor.remove();

      return res
        .status(200)
        .json({ message: "Doctor approved and added to the platform" });
    } else if (action === 'reject') {
      await guestDoctor.remove();
      return res.status(200).json({ message: "Doctor request rejected , Doctor is removed" });
    } else {
      return res.status(400).json({ error: "Invalid action , Please type accept or reject" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
//create A METHOD TO CREATE A NEW CONTRACT
const createContract = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    try {
        const { DoctorUsername, MarkUp,StartDate, EndDate,DoctorSpecialty,Salary,compensation,workingHours,workingDays,Type,Status} = req.body;
        if (!DoctorUsername || !MarkUp || !EndDate||!DoctorSpecialty||!Salary||!compensation||!workingHours||!workingDays) {
            throw Error('All fields must be filled.');
        }
        const doctorExists = await Doctor.findOne({ Username: DoctorUsername });
        if (!doctorExists) {
            return res.status(404).json({ error: 'Doctor not found.' });
        }
        const newContract = new Contract({ DoctorUsername, MarkUp,StartDate, EndDate,DoctorSpecialty,Salary,compensation,workingHours,workingDays,Type,Status });
        await newContract.save();
        res.status(200).json({ message: 'New contract created', contract: newContract });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    //this concerns patient and pharmacist and admin

};

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (name) => {
    return jwt.sign({ name }, 'supersecret', {
        expiresIn: maxAge
    });
};
const login = async (req, res) => {
  const { Username, password } = req.body;
  try {
    const userDoctor = await Doctor.findOne({ Username: Username });
    const userPatient = await Patient.findOne({ Username: Username });
    const userAdmin = await Administrator.findOne({ Username: Username });
    if (userDoctor && !userPatient && !userAdmin) {
      if (password===userDoctor.Password) {
        const token = createToken(userDoctor.Username);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ userDoctor, token });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } else if (!userDoctor && userPatient && !userAdmin) {
        if (password===userPatient.Password) {
          const token = createToken(userPatient.Username);
          res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
          res.status(200).json({ userPatient, token });
        }
        else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      }
    else if (!userDoctor && !userPatient&& userAdmin) {
      if (password===userAdmin.Password) {
          const token = createToken(userAdmin.Username);
          res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
          res.status(200).json({ userAdmin, token });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      }
    else {
      res.status(401).json({ error: 'User not found' });
    }
  }
   catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const logout = async (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 }); // Clear the JWT cookie to log the user out
  res.status(200).json({ message: 'Logged out successfully' });
}
module.exports = {
  viewUnapprovedDoctors,
  deleteEntity2,
  createAdmin,
  deleteEntity,
  viewDoctorInfo,
  acceptOrRejectDoctorRequest,
  createContract,
  login,
  logout
};
