import Form from '../components/Form.jsx';
import Validation from '../validate/validate';

function ResetPassword() {
  let {errors,handleSubmit,register} = Validation('resetPassword')
  let c = (data) => {
    console.log(data);
  }
  let inputArr = [
    { title: 'password', placeholder: 'enter password',type:'password', showErr:errors.password?.message, register: register("password") },
    { title: 'confirm password', placeholder: 'enter password',type:'password', showErr:errors.confirmPassword?.message, register: register("confirmPassword") },
  ];

  let btnArr = [{ title: 'reset password', style: 'green-btn', action: handleSubmit(c),type:'submit' }];

  return (
    <div>
      <Form title="reset password" inputArr={inputArr} btnArr={btnArr} />
    </div>
  );
}

export default ResetPassword;
