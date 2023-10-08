// External variables
const express = require("express");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config();
const patientRoutes = require("./Routes/Patient"); // Require Patient
const adminRoutes = require('./Routes/Admin'); //require admin
const healthPackageRoutes = require('./Routes/HealthPackage'); //require health package
const guestDoctorRoutes = require('./Routes/GuestDoctor'); //require guest doctor
const MongoURI = process.env.MONGO_URI ;


const doctorSchema = require('./Models/Doctor.js'); // 
const patientSchema = require('./Models/Patient.js'); //
const appointmentSchema = require('./Models/Appointment.js');
const { addDoctor,updateDoctor,filterApps ,viewInfoAndRecords,MyPatients,PatientByName,PatientsUpcoming,selectPatientWithHisName} = require('./Controllers/doctorController'); // 
const doctorController = require('./Controllers/doctorController');//


//App variables
const app = express();
app.use(express.json()); 
const port = process.env.PORT || "8000";
const patient = require('./Models/Patient');

const doctorRoutes = require("./Routes/Doctor"); //

// configurations
// Mongo DB
mongoose.connect(MongoURI)
.then(()=>{
  console.log("MongoDB is now connected!")
// Starting server
 app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  })
})
.catch(err => console.log(err));
/*
                                                    Start of your code
*/
app.get("/home", (req, res) => {
    res.status(200).send("You have everything installed!");
  });


// Registering Routes

app.use("/Patient", patientRoutes);

app.use("/Doctor", doctorRoutes);//


// server.js or app.js
//const adminRoutes = require('./Routes/Admin');
app.use('/admin', adminRoutes);
app.use('/healthPackage', healthPackageRoutes);
app.use('/guestDoctor', guestDoctorRoutes);

;
