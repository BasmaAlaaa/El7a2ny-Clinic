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
const Admin = require("../src/Models/Administrator");

const MongoURI = process.env.MONGO_URI ;


//App variables
const app = express();
app.use(express.json()); 
app.use(cors());
const port = process.env.PORT || "4000";
/////////////////////////////////////////////////////////
//A method to create an admin at the begginning of the server "3shan mainf3shanesh n-create admin "
const createInitialAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ Username: "admin" });

    if (!adminExists) {
      // Createnew admin
      const initialAdmin = new Admin({
        Username: "admin",
        Password: "basma" 
      });
      await initialAdmin.save();
      console.log("Admin initialized with username: admin and password: basma");
    } else {
      console.log("Admin already exists");
    }
  } catch (error) {
    console.error("Error initializing admin:", error);
  }
};
////////////////////////////////////////////////////////

// configurations
// Mongo DB
mongoose.connect(MongoURI)
.then(()=>{
  console.log("MongoDB is now connected!")
  createInitialAdmin();
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
