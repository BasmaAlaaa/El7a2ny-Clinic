import { useNavigate } from 'react-router-dom';
import Form from '../components/Form.jsx';
import { useDispatch } from 'react-redux';
import { loggedIn } from '../features/login.js';
import Validation from '../validate/validate';
import Input from '../components/Input.jsx';
import MainBtn from '../components/Button.jsx';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from "axios";


function Login() {
  let { errors, handleSubmit, register } = Validation('login')
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); 
  
  const handleLogin = async (event) => {
    event.preventDefault(); 
    try {
      const response = await axios.post('http://localhost:4000/login', { Username: username, password: password });
      localStorage.setItem('token', response.data.token); 
      if (response.data.userDoctor) {
        navigate('/doctorView/${username}');
      } else if (response.data.userPatient) {
        navigate('/patientView/${username}');
      } else if (response.data.userAdmin) {
        navigate('/administratorView/${username}');
      } else {
        console.error('User role not recognized');
      }
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      alert(error.response ? error.response.data.error : error.message);
    }
  };

  return (
    <div>
      {/* <Form title="login" inputArr={inputArr} type="login" btnArr={btnArr} /> */}
      <form
      className="d-flex justify-content-center"
    >
      <div className="form-width">
        <p className="text-capitalize fs-4">Login</p>
 
        <Input
        title='username' 
        placeholder='enter your username'
        type='text'
        onChange={(e) => setUsername(e.target.value)}
      />
          <Input
            title='password'
            placeholder='enter your password'
            type='password'
            onChange={(e) => setPassword(e.target.value)}
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
              txt='login'
              style='green-btn'
              action={handleLogin}
              
            />
          </div>

        <p className="text-center mt-3 small-txt">
          {/* {type == 'register' ? (
            <>
              Have an account?
              <Link to="/" className="green-txt">
                {' '}
                Login
              </Link>
            </>
          ) : type == 'login' ? ( */}
            <>
              Forgot Password?
              <Link to="/forgotpassword" className="green-txt">
                {' '}
                Reset Password
              </Link>
            </>
          {/* ) : (
            ''
          )} */}
        </p>
      </div>
    </form>
    </div>
    
  );
}
export default Login;

