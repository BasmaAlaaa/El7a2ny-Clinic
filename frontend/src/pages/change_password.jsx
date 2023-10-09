import Form from '../components/Form.jsx';
import Validation from '../validate/validate';

function ChangePassword() {
  let {errors,handleSubmit,register} = Validation('changePassword')
  let c = (data) => {
    console.log(data);
  }
  let inputArr = [
    { title: 'old password', placeholder: 'enter password',type:'password', showErr:errors.oldPassword?.message, register: register("oldPassword") },
    { title: 'new password', placeholder: 'enter password',type:'password', showErr:errors.password?.message, register: register("password") },
    { title: 'confirm password', placeholder: 'enter password',type:'password', showErr:errors.confirmPassword?.message, register: register("confirmPassword") },
  ];

  let btnArr = [{ title: 'save', style: 'green-btn', action: handleSubmit(c), }];

  return (
    <div>
      <Form title="change password" inputArr={inputArr} btnArr={btnArr} />
    </div>
  );
}
export default ChangePassword;
