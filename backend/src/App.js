// External variables
const express = require("express");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config();
const cors = require("cors")
const patientRoutes = require("../src/Routes/Patient"); // Require Patient
const adminRoutes = require('../src/Routes/Administrator'); //require admin
const healthPackageRoutes = require('../src/Routes/HealthPackage'); //require health package
const guestDoctorRoutes = require('../src/Routes/GuestDoctor'); //require guest doctor
const appointmentRoutes = require('../src/Routes/Appointment');
const familyMemberRoutes = require('../src/Routes/FamilyMember');
const prescriptionRoutes = require('../src/Routes/Prescription');
const doctorRoutes = require('../src/Routes/Doctor'); //
const MongoURI = process.env.MONGO_URI ;


//App variables
const app = express();
app.use(express.json()); 
app.use(cors());
const port = process.env.PORT || "4000";


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

app.use('/Admin', adminRoutes);

app.use("/Appointment", appointmentRoutes);

app.use("/Doctor", doctorRoutes);//

app.use("/FamilyMember", familyMemberRoutes);

app.use('/GuestDoctor', guestDoctorRoutes);

app.use('/HealthPackage', healthPackageRoutes);

app.use("/Patient", patientRoutes);

app.use("/Prescription", prescriptionRoutes);
;
