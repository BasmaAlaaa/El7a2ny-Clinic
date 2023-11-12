import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../components/Input.jsx';
import MainBtn from '../components/Button.jsx';

function ResetPassword() {
  const [Email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  console.log(Email);
  const navigate = useNavigate();

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:4000/UpdatePassword`, {
        Email: Email,
        otp: otp,
        newPassword: newPassword,
      });


      alert('Password updated successfully');
      navigate('/login');
    } catch (error) {
      console.error('Failed to update password', error);
      alert('Failed to update password');
    }
  }

  return (
    <div>
      <form className="d-flex justify-content-center" onSubmit={handlePasswordChange}>
        <div className="form-width">
          <p className="text-capitalize fs-4">Reset Password</p>

          <Input
            title="Email"
            placeholder="Enter Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            title="OTP"
            placeholder="Enter OTP"
            type="password"
            onChange={(e) => setOTP(e.target.value)}
          />
          <Input
            title="New password"
            placeholder="Enter New Password"
            type="password"
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <div className="mt-3">
            <MainBtn txt="Save" style="green-btn" type="submit" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
