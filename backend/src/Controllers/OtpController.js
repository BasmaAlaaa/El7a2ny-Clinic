const nodemailer = require ('nodemailer');
const Patient = require('../Models/Patient');
const Doctor = require('../Models/Doctor');
const OTP = require('../Models/OTP');

// Function to generate a random OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'SuicideSquadGUC@gmail.com',
    pass: 'wryq ofjx rybi hpom'
  }
});

const sendOTP = async ({ body }, res) => {
    const {Email} = body
  const isPatient = await Patient.findOne({ Email : Email});
  const isDoctor = await Doctor.findOne({ Email : Email });
  console.log('isPatient:', isPatient);
  console.log('isDoctor:', isDoctor);
  if (!isPatient && !isDoctor ) {
    console.log('Invalid Email');
    res.status(400).json({ error: 'Invalid Email' });
    return;
  }

  try {
    // Generate OTP
    const otp = generateOTP();

    // Store the OTP in MongoDB
    const otpDocument = await new OTP({ Email, otp });
    await otpDocument.save();

    // Define the email options
    const mailOptions = {
      from: 'SuicideSquadGUC@gmail.com',
      to: Email,
      subject: 'Your OTP for Verification',
      text: `Dear User,

      We hope this email finds you well. It seems like you've requested to reset your password for Suicide Squad Clinic, and we're here to assist you with that.

      To proceed with resetting your password,

      Your OTP is: ${otp}

      If you didn't request this password reset, please ignore this email. Your account security is our top priority, and no changes will be made without your confirmation.

      If you encounter any issues or have further questions, feel free to reach out to our support team at SuicideSquadGUC@gmail.com .

      Thank you for choosing Suicide Squad Clinic. We appreciate your trust in us.

      Best regards,

      Suicide Squad Support Team `
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ');

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};


// Async function to update the user's password in MongoDB
const updatePassword = async ({ body }, res) => {
  const { Email, otp, newPassword } = body;
  try {
    // Find the OTP document in the database
    const otpDocument = await OTP.findOneAndDelete({ Email: Email, otp: otp });

    if (!otpDocument) {
      console.log(`Invalid OTP`);
      res.status(400).json({ error: 'Invalid OTP' });
      return;
    }

    // Update the user's password in MongoDB
    const updateQuery = { Email: Email };
    const updateField = { Password: newPassword };

    const updatedPatient = await Patient.findOneAndUpdate(updateQuery, updateField, { new: true });
    const updatedDoctor = await Doctor.findOneAndUpdate(updateQuery, updateField, { new: true });

    if (updatedPatient || updatedDoctor) {
      console.log(`Password updated for user with email: ${Email}`);
      res.status(200).json({ message: 'Password updated successfully' });
    } else {
      console.log('User not found');
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update password' });
  }
};

const changePassword = async ({ body }, res) => {
  const { Email, oldPassword, newPassword } = body;
  try {
    // Find and update the password for patient or Doctor
    const updateQuery = { Email: Email, Password: oldPassword };
    const updateField = { Password: newPassword };

    const updatedPatient = await Patient.findOneAndUpdate(updateQuery, updateField, { new: true });
    const updatedDoctor = await Doctor.findOneAndUpdate(updateQuery, updateField, { new: true });

    if (updatedPatient || updatedDoctor) {
      res.status(200).json({ message: 'Password updated successfully' });
    } else {
      console.log('Invalid email or password');
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};





module.exports = {
  sendOTP,
  updatePassword,
  changePassword
};