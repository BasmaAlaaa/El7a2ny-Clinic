const jwt = require ('jsonwebtoken');
const Admin = require("../Models/Administrator");
const Doctor = require("../Models/Doctor");
const Patient = require("../Models/Patient");

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (name, email) => {
    return jwt.sign({ name, email }, 'supersecret', {
        expiresIn: maxAge
    });
};

const login = async (req, res) => {
    const { Username, password } = req.body;
    try {
      const userDoctor = await Doctor.findOne({ Username: Username });
      const userPatient = await Patient.findOne({ Username: Username });
      const userAdmin = await Admin.findOne({ Username: Username });
      if (userDoctor && !userPatient && !userAdmin) {
        if (password===userDoctor.Password) {
          const token = createToken(userDoctor.Username,userDoctor.Email);
          res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
          res.status(200).json({ userDoctor, token });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      } else if (!userDoctor && userPatient && !userAdmin) {
          if (password===userPatient.Password) {
            const token = createToken(userPatient.Username,userPatient.Email);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.status(200).json({ userPatient, token });
          }
          else {
            res.status(401).json({ error: 'Invalid credentials' });
          }
        }
      else if (!userDoctor && !userPatient&& userAdmin) {
        if (password===userAdmin.Password) {
            const token = createToken(userAdmin.Username,userAdmin.Email);
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
    login,
    logout
  };