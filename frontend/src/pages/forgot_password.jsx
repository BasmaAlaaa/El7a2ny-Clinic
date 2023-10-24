import { useNavigate } from 'react-router-dom';
import Form from '../components/Form.jsx';
import Validation from '../validate/validate.js';
import { useState } from 'react';
import Input from '../components/Input.jsx';
import MainBtn from '../components/Button.jsx';

function ForgotPassword() {
  let { errors, handleSubmit, register } = Validation('forgotPassword')
  const[email, setEmail] = useState("");
  const navigate = useNavigate();
  

  return (
    <div>
      {/* <Form title="forget password" inputArr={inputArr} btnArr={btnArr} /> */}
      <form
      className="d-flex justify-content-center"
    >
      <div className="form-width">
        <p className="text-capitalize fs-4">Forgot Password</p>
 
          <Input
            title='email'
            placeholder='enter your email'
            type='email'
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="mt-3">
            <MainBtn
              txt='reset password'
              style='green-btn'
              // action={handleSubmit(c)}
              
            />
             <MainBtn
              txt='back to login'
              style='grey-btn'
              action={() => navigate('/login')}
              
            />
          </div>

      </div>
    </form>
    </div>
  );
}

export default ForgotPassword;
