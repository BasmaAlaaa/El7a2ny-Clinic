import { useNavigate, useParams } from 'react-router-dom';
import Form from '../components/Form.jsx';
import { useDispatch } from 'react-redux';
import { loggedIn } from '../features/login.js';
import Validation from '../validate/validate';
import NavBarAdministrator from '../components/NavBarAdministrator.jsx';
import { useState } from 'react';
import axios from 'axios'
import NavBarPatient from '../components/NavBarPatient.jsx';

function AddFamilyMember() {
  // let { errors, handleSubmit, register } = Validation('username')
  // let c = (data) => {
  //   console.log(data);
  // }
  // let inputArr = [
  //   { title: 'username', placeholder: 'enter username', type: 'username', showErr: errors.username?.message, register: register("username"),  },
  //   { title: 'password', placeholder: 'enter password', type: 'password', showErr: errors.password?.message, register: register("password") },
  // ];
  // let btnArr = [
  //   {
  //     title: 'Add Administrator',
  //     style: 'green-btn',
  //     action: handleSubmit(),
  //   },
  // ];

  const {username} = useParams()

  const [name, setName] = useState('');
  const [nationalID, setNationalID] = useState('');
  const [age, setAge] = useState(0)
  const [gender, setGender] = useState('')
  const [relationToPatient, setRelationToPatient] = useState('');
  const [relationToPatientLink, setRelationToPatientLink] = useState('');
  const [email, setEmail] = useState('')




  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {Name:name, NationalID:nationalID, Age:age, Gender:gender, RelationToPatient:relationToPatient}
    console.log(data)
    const response = axios.post(`http://localhost:4000/Patient/addFamMember/${username}`, data)
.then(res =>console.log(res.data)).catch(err => console.log(err))
  }
  const handleSubmitLink = (e) => {
    e.preventDefault();
    const data = {Email:email, RelationToPatient:relationToPatientLink}
    console.log(data)
    const response = axios.post(`http://localhost:4000/Patient/linkPatientAccountAsFam/${username}`, data)
.then(res =>alert('Added successfully')).catch(err => alert(err))
  }

  return (
    <div>
      <NavBarPatient username={username}/>
      {/* <Form title="Add Administrator" inputArr={inputArr} type="addAdministrator" btnArr={btnArr} /> */}
      <form onSubmit={handleSubmit}>
        <h2>Add Family Member</h2>
        <h3><input  required placeholder= 'enter Name' type= 'text' onChange={(e) => setName(e.target.value)} /></h3>
        <h3><input  required placeholder= 'enter National ID' type= 'text' onChange={(e) => setNationalID(e.target.value)} /></h3>
        <h3><input  required placeholder= 'enter Age' type= 'number' onChange={(e) => setAge(e.target.value)} /></h3>
        <h3><input  required placeholder= 'enter Gender' type= 'text' onChange={(e) => setGender(e.target.value)} /></h3>
        <h3><input  required placeholder= 'enter relation to patient' type= 'text' onChange={(e) => setRelationToPatient(e.target.value)} /></h3>

        <h3><button type="submit">Submit</button></h3>
    </form>
    <form onSubmit={handleSubmitLink}>
        <h2>Link Patient as Family Member</h2>
        <h3><input  required placeholder= 'enter Email' type= 'email' onChange={(e) => setEmail(e.target.value)} /></h3>
        <h3><input  required placeholder= 'enter relation to patient' type= 'text' onChange={(e) => setRelationToPatientLink(e.target.value)} /></h3>

        <h3><button type="submit">Submit</button></h3>
    </form>

    </div>
  );
}
export default AddFamilyMember;
