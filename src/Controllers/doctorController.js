const doctorModel = require('../Models/Doctor.js');
const appointmentSchema = require('../Models/Appointment.js');
const doctorSchema = require('../Models/Doctor.js');
const patientSchema = require('../Models/Patient.js');
const {isEmailUnique, isUsernameUnique} = require('../utils.js');

// register Doctor
const registerDoctor = async (req, res) => {
    const { 
        Username,
        Name,
        Email,
        Password,
        DateOfBirth,
        HourlyRate,
        Affilation,
        EDB,
        patients,
        Speciality
    } = req.body;

    try {

      if (!(await isUsernameUnique(Username))) {
        throw new Error('Username is already taken.');
      }
    
      if (!(await isEmailUnique(Email))) {
          throw new Error('Email is already in use.');
      }
        const doctor = await doctorModel.register(
            Username,
            Name,
            Email,
            Password,
            DateOfBirth,
            HourlyRate,
            Affilation,
            EDB,
            patients,
            Speciality
        );
          
        await doctor.save();
        res.status(200).json({ doctor });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

//Req 14(edit/ update my email, hourly rate or affiliation (hospital))
const updateDoctor = async (req, res) => {
    const {Username} = req.params;
    try {
        // Find the doctor by their name and update their information
        /*const result = await doctorModel.updateOne({ Username: Username }, {
            $set: {
                Email: Email ,
                HourlyRate: HourlyRate ,
                Affilation: Affilation 
            }
        });*/
        
        const doctor = await doctorModel.findOne({Username: Username});
        if(!doctor){
            return res.status(404).json({error : "This doctor doesn't exist!"})
        }

        const updatedDoc = {
          $set: {
              Email: req.body.Email,
              HourlyRate: req.body.HourlyRate,
              Affilation: req.body.Affilation,
          },
      };
        const updated = await doctorModel.updateOne({Username: Username},updatedDoc);
        const doc = await doctorModel.findOne({Username: Username});
        res.status(200).json({doc});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
//Req 23 (filter appointments by date/status)
const filterApps = async (req,res) => {
    try {
        const { Date, Status } = req.params;

        // Create a filter object to match appointments based on date and status
        const filter = {};

        if (Date) {
            // If a date parameter is provided, add it to the filter
            filter.Date = Date;
        }

        if (Status) {
            // If a status parameter is provided, add it to the filter
            filter.Status = Status;
        }

        // Use the filter object to query the appointment collection
        const filteredAppointments = await appointmentSchema.find({Date: Date, Status: Status});


        if (filteredAppointments.length === 0) {
            return res.status(404).send('No matching appointments found');
        }

        // Send the list of matching appointments as a response
        res.send(filteredAppointments);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

//Req 25 (view information and health records of patient registered with me)
const viewInfoAndRecords = async (req,res)=>{
    try {
        const { id, Username } = req.params;
    
        // Find the doctor by ID
        const doctor = await doctorSchema.findById(id);
    
        if (!doctor) {
          return res.status(404).send('Doctor not found');
        }
    
        const patientIds = doctor.patients; // Assuming it's an array of patient IDs
    
        // Find all patients whose IDs are in the patientIds array
        const patients = await patientSchema.findOne({Username: Username, _id: { $in: patientIds } });
    
        if (!patients) {
          return res.status(404).send('No patients found for this doctor');
        }
    
        // You can send the list of patients and their health records as a response
        res.status(200).send(patients);
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
}

//Req 33 (view a list of all my patients)
const MyPatients = async (req,res) =>{
    try {
        const { id } = req.params;
    
        // Find the doctor by ID
        const doctor = await doctorSchema.findById(id);
    
        if (!doctor) {
          return res.status(404).send('Doctor not found');
        }
    
        const patientIds = doctor.patients; // Assuming it's an array of patient IDs
    
        // Find all patients whose IDs are in the patientIds array
        const patients = await patientSchema.find({ _id: { $in: patientIds } });
    
        if (patients.length === 0) {
          return res.status(404).send('No patients found for this doctor');
        }
    
        // Extract patient names and send them as an array
        const patientNames = 
        patients.map(({Name, Email}) => 
        ({Name, Email}));
        res.status(200).send(patientNames);
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
}
//Req 34 (search for a patient by name)
const PatientByName = async (req,res)=>{
    try {
        const { Name } = req.params;
    
        // Find patients with the given name
        const patients = await patientSchema.findOne({ Name: Name });
    
        if (!patients) {
          return res.status(404).send('No patients found with this name');
        }
    
        // Send the list of patients with matching names as a response
        res.status(200).send(patients);
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
}

//Req 35 (filter patients based on upcoming appointments)
const PatientsUpcoming = async (req,res) =>{
    try {
        const { id } = req.params;
    
        // Find the doctor by ID
        const doctor = await doctorSchema.findById(id);
    
        if (!doctor) {
          return res.status(404).send('Doctor not found');
        }
    
        const patientIds = doctor.patients; // Assuming it's an array of patient IDs
    
        // Find upcoming appointments for the doctor
        const upcomingAppointments = await appointmentSchema.find({
          DoctorID: id,
          Status: { $in: ['Upcoming', 'Following'] }, // Adjust this condition based on your schema
          PatientID: {$in: patientIds}
        },{PatientID: 1, _id:0});
    
        if (upcomingAppointments.length === 0) {
          return res.status(404).send('No upcoming appointments found for this doctor');
        }
    
        // Find the patients based on the patient IDs from appointments
        const patients = await patientSchema.find(
          { _id: { $in: upcomingAppointments.PatientID}}
          );

          //Types.ObjectId[] patientIdsWithAppointments = {};

          for (const patient of upcomingAppointments){

          }
        

        // Extract patient names and send them as an array
        const patientNames = patients.map(
          (Name, Email) => 
          (Name, Email));
        res.send(patientNames);
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
        Affilation:'Tagamo3',
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
    filterApps,
    viewInfoAndRecords,
    MyPatients,
    PatientByName,
    PatientsUpcoming,
    registerDoctor,
    updateDoctor,
    selectPatientWithHisName,
    addDoctor
};


