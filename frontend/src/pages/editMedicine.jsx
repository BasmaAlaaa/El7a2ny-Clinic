import { useNavigate, useParams } from 'react-router-dom';
import Form from '../components/Form.jsx';
import { useDispatch } from 'react-redux';
import { loggedIn } from '../features/login.js';
import Validation from '../validate/validate';
import NavBarPharmacist from '../components/NavBarPharmacist.jsx'

function EditMedicine() {
  const {name} = useParams();

  let { errors, handleSubmit, register } = Validation('username')
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let c = (data) => {
    console.log(data);
  }
  let inputArr = [
    { title: 'activeIngredients', placeholder: 'enter active ingredients', type: 'activeIngredients', showErr: errors.activeIngredients?.message, register: register("activeIngredients") },
    { title: 'price', placeholder: 'enter price', type: 'price', showErr: errors.price?.message, register: register("price") },
  ];
  let btnArr = [
    {
      title: 'Edit Medicine',
      style: 'green-btn',
      action: handleSubmit(c),
    },
  ];

  return (
    <div>
        <NavBarPharmacist />
      <Form title="Edit Medicine" inputArr={inputArr} type="editMedicine" btnArr={btnArr} />
    </div>
  );
}
export default EditMedicine;
