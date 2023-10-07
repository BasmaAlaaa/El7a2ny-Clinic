// External variables
const express = require("express");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config();
const patientRoutes = require("./Routes/Patient"); // Require Patient
const adminRoutes = require('./Routes/Admin'); //require admin
const healthPackageRoutes = require('./Routes/HealthPackage'); //require health package

const MongoURI = process.env.MONGO_URI ;


//App variables
const app = express();
app.use(express.json()); 
const port = process.env.PORT || "8000";
const patient = require('./Models/Patient');

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
// server.js or app.js
//const adminRoutes = require('./Routes/Admin');
app.use('/admin', adminRoutes);
app.use('/healthPackage', healthPackageRoutes);
;
