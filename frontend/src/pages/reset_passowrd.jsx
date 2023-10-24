import { Link } from 'react-router-dom';
import MainBtn from '../components/Button.jsx';
import Form from '../components/Form.jsx';
import Validation from '../validate/validate.js';
import Input from '../components/Input.jsx';
import { useState } from 'react';

function ResetPassword() {


  let {errors,handleSubmit,register} = Validation('changePassword')
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  return (
    <div>
      {/* <Form title="change password" inputArr={inputArr} btnArr={btnArr} /> */}
      <form
      className="d-flex justify-content-center"
    >
      <div className="form-width">
        <p className="text-capitalize fs-4">Reset Password</p>
 
          <Input
            title='New password'
            placeholder='enter new password'
            type='password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            title='confirm Password'
            placeholder='confirm password'
            type='confirmPassword'
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="mt-3">
            <MainBtn
              txt='save'
              style='green-btn'
              // action={handleSubmit(c)}
              
            />
          </div>
      </div>
    </form>
    </div>
  );
}


export default ResetPassword;
