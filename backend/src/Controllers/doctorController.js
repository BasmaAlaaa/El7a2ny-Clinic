const { StatusFile } = require('git');
const appointmentSchema = require('../Models/Appointment.js');
const doctorSchema = require('../Models/Doctor.js');
const patientSchema = require('../Models/Patient.js');
const {isEmailUnique, isUsernameUnique} = require('../utils.js');

// register Doctor
const registerDoctor = async (req, res) => {
    
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials',true);

  const { 
        Username,
        Name,
        Email,
        Password,
        DateOfBirth,
        HourlyRate,
        Affiliation,
        EDB,
        PatientsUsernames,
        Speciality,
        Schedule
    } = req.body;

    try {

      if (!(await isUsernameUnique(Username))) {
        throw new Error('Username is already taken.');
      }
    
      if (!(await isEmailUnique(Email))) {
          throw new Error('Email is already in use.');
      }
        const doctor = await doctorSchema.register(
            Username,
            Name,
            Email,
            Password,
            DateOfBirth,
            HourlyRate,
            Affiliation,
            EDB,
            PatientsUsernames,
            Speciality,
            Schedule
        );
          
        await doctor.save();
        res.status(200).json({ doctor });
    } catch (error) {
        res.status(400).json({ error: error.message });
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
      res.status(200).send({filteredAppointments});
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
        const patients = await patientSchema.findOne({ Username: PatientUsername, Username: { $in: patientsUsernames } });
    
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
    
        const patientsUsernames = doctor.PatientsUsernames; // Assuming it's an array of patient IDs
    
        // Find all patients whose IDs are in the patientIds array
        const patients = await patientSchema.find({ Username: { $in: patientsUsernames } });
    
        if (patients.length === 0) {
          return res.status(404).send('No patients found for this doctor');
        }

        //const appointments = await appointmentSchema.find({DoctorUsername: Username, PatientUsername: { $in: patientsUsernames}});
    
        // Extract patient names and send them as an array
        const patientNames = 
        patients.map((patient) => 
        ({Name: patient.Name,
          Username: patient.Username,
          Email: patient.Email,
          DateOfBirth: patient.DateOfBirth,
        }));
        res.status(200).send(patientNames);
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
    allAppointments
};


