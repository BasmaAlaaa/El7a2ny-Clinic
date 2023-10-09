import { useNavigate } from 'react-router-dom';
import Form from '../components/Form.jsx';
import { useDispatch } from 'react-redux';
import { loggedIn } from '../features/login.js';
import Validation from '../validate/validate';

function Login() {
  let { errors, handleSubmit, register } = Validation('login')
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let c = (data) => {
    console.log(data);
  }
  let inputArr = [
    { title: 'email', placeholder: 'enter your email', type: 'email', showErr: errors.email?.message, register: register("email") },
    { title: 'password', placeholder: 'enter your password', type: 'password', showErr: errors.password?.message, register: register("password") },
  ];
  let btnArr = [
    {
      title: 'login',
      style: 'green-btn',
      action: handleSubmit(c),
    },
  ];

  return (
    <div>
      <Form title="login" inputArr={inputArr} type="login" btnArr={btnArr} />
    </div>
  );
}
export default Login;
