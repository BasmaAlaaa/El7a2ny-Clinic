const { StatusFile } = require('git');
const appointmentSchema = require('../Models/Appointment.js');
const doctorSchema = require('../Models/Doctor.js');
const patientSchema = require('../Models/Patient.js');
const ContractSchema = require('../Models/Contract.js');
const {isEmailUnique, isUsernameUnique} = require('../utils.js');
//const Doctor = require('../Models/Doctor'); 

// register Doctor
// const registerDoctor = async (req, res) => {
    
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Credentials',true);

//   const { 
//         Username,
//         Name,
//         Email,
//         Password,
//         DateOfBirth,
//         HourlyRate,
//         Affiliation,
//         EDB,
//         PatientsUsernames,
//         Speciality,
//         Schedule
//     } = req.body;

//     try {

//       if (!(await isUsernameUnique(Username))) {
//         throw new Error('Username is already taken.');
//       }
    
//       if (!(await isEmailUnique(Email))) {
//           throw new Error('Email is already in use.');
//       }
//         const doctor = await doctorSchema.register(
//             Username,
//             Name,
//             Email,
//             Password,
//             DateOfBirth,
//             HourlyRate,
//             Affiliation,
//             EDB,
//             PatientsUsernames,
//             Speciality,
//             Schedule
//         );
          
//         await doctor.save();
//         res.status(200).json({ doctor });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// }

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
      Speciality,
      Schedule
  } = req.body;

  console.log(req.files)

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

      const guestDoctor = new doctorSchema ({
          Username,
          Name,
          Email,
          Password,
          DateOfBirth,
          HourlyRate,
          Affiliation,
          EDB,
          Speciality,
          Schedule,
          IDDocument: req.files['IDDocument'][0].path,
          MedicalDegreeDocument: req.files['MedicalDegreeDocument'][0].path,
          WorkingLicenseDocument: req.files['WorkingLicenseDocument'][0].path
      });

      await guestDoctor.save();
      res.status(200).json({ guestDoctor })
  } catch (error) {
      res.status(400).json({ error: error.message })
  }
}

//Req 14(edit/ update my email, hourly rate or affiliation (hospital))
const updateDoctorByEmail = async (req, res) => {
    
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  const {Username} = req.params;
    try { 
        const doctor = await doctorSchema.findOne({Username: Username});
        
        if(!doctor){
            return res.status(404).json({error : "This doctor doesn't exist!"})
        }

        const updatedDoc = {
          $set: {
              Email: req.body.Email
          },
        };
      
        const updated = await doctorSchema.updateOne({Username: Username},updatedDoc);
        const doc = await doctorSchema.findOne({Username: Username});
        res.status(200).json({doc});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateDoctorByHourlyRate = async (req, res) => {
    
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  const {Username} = req.params;
    try {

        const doctor = await doctorSchema.findOne({Username: Username});
        
        if(!doctor){
            return res.status(404).json({error : "This doctor doesn't exist!"})
        }

        const updatedDoc = {
          $set: {
              HourlyRate: req.body.HourlyRate
          },
        };
      
        const updated = await doctorSchema.updateOne({Username: Username},updatedDoc);
        const doc = await doctorSchema.findOne({Username: Username});
        res.status(200).json({doc});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateDoctorByAffiliation = async (req, res) => {
    
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  const {Username} = req.params;
    try { 
        const doctor = await doctorSchema.findOne({Username: Username});
        
        if(!doctor){
            return res.status(404).json({error : "This doctor doesn't exist!"})
        }

        const updatedDoc = {
          $set: {
              Affiliation: req.body.Affiliation
          },
        };
      
        const updated = await doctorSchema.updateOne({Username: Username},updatedDoc);
        const doc = await doctorSchema.findOne({Username: Username});
        res.status(200).json({doc});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Req 23 (filter appointments by date/status)
const docFilterAppsByDate = async (req,res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { Username, Date } = req.params;

    try {
        const doctor = await doctorSchema.findOne({Username:Username});

        if(!doctor){
          return res.status(404).json({error : "This doctor doesn't exist!"})
      }
        // Use the filter object to query the appointment collection
        const filteredAppointments = await appointmentSchema.find({DoctorUsername: Username, Date: Date});

        if (filteredAppointments.length === 0) {
            return res.status(404).send('No matching appointments found');
        }
        // Send the list of matching appointments as a response
        res.send(filteredAppointments);
    } catch (error) {
        res.status(500).send({error: error.message});
    }
}

const docFilterAppsByStatus = async (req,res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  const { Status, Username } = req.params;      

  try {

      const user = await doctorSchema.findOne({Username: Username});
        if(!user){
          return res.status(404).send('No doctor found');
        }

      // Use the filter object to query the appointment collection
      const filteredAppointments = await appointmentSchema.find({DoctorUsername: Username, Status: Status});

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
    const user = await doctorSchema.findOne({Username: Username});
    if(!user){  
         return res.status(404).send('No doctor found');
    }

      // Use the filter object to query the appointment collection
      const filteredAppointments = await appointmentSchema.find({DoctorUsername: Username});

      if (filteredAppointments.length === 0) {
          return res.status(404).send('No matching appointments found');
      }

      // Send the list of matching appointments as a response
      res.status(200).send(filteredAppointments);
  } catch (error) {
    res.status(500).send({error: error.message});
}
}

//Req 25 (view information and health records of patient registered with me)
const viewInfoAndRecords = async (req,res)=>{

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

    try {
        const { DoctorUsername, PatientUsername } = req.params;
    
        // Find the doctor by ID
        const doctor = await doctorSchema.findOne({Username: DoctorUsername});
    
        if (!doctor) {
          return res.status(404).send('Doctor not found');
        }
    
        const patientsUsernames = doctor.PatientsUsernames; // Assuming it's an array of patient IDs
    
        // Find all patients whose IDs are in the patientIds array
        const patients = await patientSchema.findOne({ Username: PatientUsername});
    
        if (!patients) {
          return res.status(404).send('No patients found for this doctor');
        }
    
        // You can send the list of patients and their health records as a response
        res.status(200).send(patients);
      } catch (error) {
        res.status(500).send({error: error.message});
      }
}

//Req 33 (view a list of all my patients)
const MyPatients = async (req,res) =>{

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

    try {
        const { Username } = req.params;
    
        // Find the doctor by ID
        const doctor = await doctorSchema.findOne({Username: Username});
    
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

        //const appointments = await appointmentSchema.find({DoctorUsername: Username, PatientUsername: { $in: patientsUsernames}});
    
        // Extract patient names and send them as an array
        /*const patientNames = 
        patients.map((patient) => 
        ({Name: patient.Name,
          Username: patient.Username,
          Email: patient.Email,
          DateOfBirth: patient.DateOfBirth,
        }));*/

        const appointments = await appointmentSchema.find({PatientUsername: { $in: patientsUsernames}});

        const result = [];
        for(const patient of patients){
          for(const app of appointments){
            if(app.PatientUsername === patient.Username){
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
        res.status(200).send(result);
      } catch (error) {
        res.status(500).send({error: error.message});
      }
}
//Req 34 (search for a patient by name)
const PatientByName = async (req,res)=>{

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

    try {
        const { Username, Name } = req.params;
    
        // Find patients with the given name
        const doc = await doctorSchema.findOne({Username: Username});
        if(!doc){
          return res.status(404).send("Doctor doesn't exist!");
        }

        const patients = await patientSchema.findOne({ Name: Name });
    
        if (!patients) {
          return res.status(404).send('No patients found with this name');
        }
    
        // Send the list of patients with matching names as a response
        res.status(200).send(patients);
      } catch (error) {
        res.status(500).send({eror: error.message});
      }
}

//Req 35 (filter patients based on upcoming appointments)
const PatientsUpcoming = async (req,res) =>{
    
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  try {
        const { Username } = req.params;
    
        // Find the doctor by ID
        const doctor = await doctorSchema.findOne({Username:Username});
    
        if (!doctor) {
          return res.status(404).send('Doctor not found');
        }
    
        const patientsUsernames = doctor.PatientsUsernames; // Assuming it's an array of patient IDs
    
        // Find upcoming appointments for the doctor
        const upcomingAppointments = await appointmentSchema.find({
          DoctorUsername: Username,
          Status: { $in: ["Upcoming", "Following","upcoming","following"]}, // Adjust this condition based on your schema
          PatientUsername: {$in: patientsUsernames}
        },{PatientUsername: 1, Date:1, Status:1, _id:0});
    
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
//Req 36 (select a patient from the list of patients)
const selectPatientWithHisName = async (req,res) =>{
    try {
        const { DoctorId, Username } = req.params;
    
        // Find the doctor by ID
        const doctor = await doctorSchema.findById(DoctorId);
    
        if (!doctor) {
          return res.status(404).send('Doctor not found');
        }
    
        // Find patients with the given name
        const patient = await patientSchema.findOne({ Username: Username});
    
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


const addDoctor = async (req,res) =>{
    const doc = new doctorSchema({
        Username:'SobhyInjection3',
        Name:'sobhyy',
        Email:'SobhyInjection@icloud.comm23',
        Password:'12345',
        DateOfBirth:'2023-10-05',
        HourlyRate:77,
        Affiliation:'Tagamo3',
        EDB:'homarrr',
        patients:['651e02202d5bf34b78d9ae71','651ecb157de4aa33de984688'],
        Speciality:'Derma'
    });

    doc.save().then((result)=>{
            res.send(result)
        }).catch((err)=>{
            console.log(err);
        });
}

const viewContract = async (req, res) => {
  try {
      const DoctorUsername = req.params.DoctorUsername; //passing the doctor's username
      const doctorExists = await doctorSchema.findOne({ Username: DoctorUsername });
      if (!doctorExists) {
          return res.status(404).json({ error: 'Doctor not found.' });
      }
      const contractDetails = await ContractSchema.findOne({ DoctorUsername });

      if (!contractDetails) {
          return res.status(404).json({ error: "Contract not found for this doctor." });
      }
      res.status(200).json({ contract: contractDetails });
  } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
  }
};
const acceptContract = async (req, res) => {
  try {
      const DoctorUsername = req.params.DoctorUsername; 
      // Update the contract status to 'accepted' for the specific doctor
      const updatedContract = await ContractSchema.findOneAndUpdate({ DoctorUsername: DoctorUsername }, { Status: 'accepted' }, { new: true });

      if (!updatedContract) {
          return res.status(404).json({ error: "Contract not found for this doctor." });
      }

      res.status(200).json({ message: 'Contract accepted successfully', contract: updatedContract });
  } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
  }
};

//Req 67: view Wallet amount
const viewWalletAmountByDoc = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const {DoctorUsername} = req.params;
    
  try{
    const doc = await doctorSchema.findOne({Username: DoctorUsername});

    if(!doc){
      return res.status(404).send("No doctor found");
    }

    res.status(200).json(doc.WalletAmount);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Req 24 viewing the health records of a patient

const viewHealthRecords = async (req, res) => {
  const { DoctorUsername, PatientUsername } = req.params;

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
    const healthRecords = patient.healthRecords;

    if (healthRecords.length === 0) {
      return res.status(404).json({ message: 'No health records found for the patient.' });
    }

    // Sending the health records in the response
    res.status(200).json({ healthRecords });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};


// Req 60 Add new health record for a patient

const addHealthRecordForPatient = async (req, res) => {
  const { DoctorUsername, PatientUsername } = req.params;
  const { newHealthRecord } = req.body;

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
      date: newHealthRecord.date,
      description: newHealthRecord.description,
      diagnosis: newHealthRecord.diagnosis,
      medication: newHealthRecord.medication,
    };

    // Add the new health record to the patient's healthRecords array
    patient.healthRecords.push(healthRecord);
    await patient.save();

    res.status(200).json({ message: 'New health record added for the patient.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
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
    viewHealthRecords ,
    addHealthRecordForPatient,
};














