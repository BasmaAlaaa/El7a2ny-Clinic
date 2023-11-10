import MainBtn from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import { useState } from 'react';
import NavBar from '../components/NavBar.jsx';
import axios from 'axios';
import { useParams } from 'react-router';


function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const {username} = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {oldPassword:oldPassword, newPassword:password, confirmPassword:confirmPassword}
    console.log(data)
    const response = axios.post(`http://localhost:4000/ChangePassword/${username}`, data)
    .then(res =>console.log(res.data)).catch(err => console.log(err.request))
  }
  return (
    <div>
      <NavBar />
      {/* <Form title="change password" inputArr={inputArr} btnArr={btnArr} /> */}
      <form
      className="d-flex justify-content-center"
    >
      <div className="form-width">
        <p className="text-capitalize fs-4">Change Password</p>
 
          <Input
            title='old password'
            placeholder='enter old password'
            type='password'
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <Input
            title='New password'
            placeholder='enter new password'
            type='password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            title='confirm Password'
            placeholder='confirm password'
            type='password'
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
      

        {/* {type == 'register' && (
          <p className="text-center mt-3 small-txt">
            By Creating an account you agree to our
            <a className="green-txt"> Terms of use </a>
            and
            <a className="green-txt"> Privacy Policy</a>
          </p>
        )} */}

          <div className="mt-3">
            <MainBtn
              txt='save'
              style='green-btn'
              action={handleSubmit}
              
            />
          </div>
      </div>
    </form>
    </div>
  );
}
export default ChangePassword;
