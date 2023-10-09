import { useNavigate } from 'react-router-dom';
import Form from '../components/Form.jsx';
import Validation from '../validate/validate';

function ForgetPassword() {
  let { errors, handleSubmit, register } = Validation('forgotPassword')
  const navigate = useNavigate();
  let c = (data) => {
    console.log(data);
  }
  let inputArr = [
    { title: 'email', placeholder: 'enter your email', type: 'email', showErr: errors.email?.message, register: register("email") },
  ];

  let btnArr = [
    {
      title: 'reset password', style: 'green-btn', action: handleSubmit(c),
      type: 'submit'
    },
    {
      title: 'back to login',
      style: 'grey-btn',

    },
  ];

  return (
    <div>
      <Form title="forget password" inputArr={inputArr} btnArr={btnArr} />
    </div>
  );
}

export default ForgetPassword;
