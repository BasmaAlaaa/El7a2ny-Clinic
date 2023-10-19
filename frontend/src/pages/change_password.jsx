import { Link } from 'react-router-dom';
import MainBtn from '../components/Button.jsx';
import Form from '../components/Form.jsx';
import Validation from '../validate/validate';
import Input from '../components/Input.jsx';
import { useState } from 'react';

function ChangePassword() {
  let {errors,handleSubmit,register} = Validation('changePassword')
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  return (
    <div>
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
            type='confirmPassword'
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
              // action={handleSubmit(c)}
              
            />
          </div>
      </div>
    </form>
    </div>
  );
}
export default ChangePassword;
