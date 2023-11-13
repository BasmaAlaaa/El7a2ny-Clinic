import { useNavigate } from 'react-router-dom';
import Form from '../components/Form.jsx';
import Validation from '../validate/validate.js';
import NavBar from '../components/NavBar.jsx';
import { useState } from 'react';
import axios from 'axios';

function RegisterPatient() {
  // let {errors,handleSubmit,register} = Validation('createAccount')
  // const navigate = useNavigate();
  // let c = (data) => {
  //   console.log(data);
  // }
  // let inputArr = [
  //   { title: 'username', placeholder: 'enter your username', type:'text', showErr:errors.username?.message, register: register("username")},
  //   { title: 'name', placeholder: 'enter your name', type:'text', showErr:errors.name?.message, register: register("name") },
  //   { title: 'email', placeholder: 'enter your email', type:'email', showErr:errors.email?.message, register: register("email")},
  //   { title: 'password', placeholder: 'enter password',type:'password', showErr:errors.password?.message, register: register("password") },
  //   { title: 'confirm password', placeholder: 'enter password',type:'password', showErr:errors.confirmPassword?.message, register: register("confirmPassword") },
  //   { title: 'date of birth', placeholder: 'enter your date of birth', type:'date', showErr:errors.dateOfBirth?.message, register: register("dateOfBirth") },
  //   { title: 'gender', placeholder: 'select your gender', type:'text', showErr:errors.gender?.message, register: register("gender") },
  //   { title: 'mobile number', placeholder: 'enter your mobile number', type: 'tel', showErr:errors.mobileNumber?.message, register: register("mobileNumber") },
  //   { title: 'Emergency contact full name', placeholder: 'enter your emergency contact full name', type:'text', showErr:errors.emergencyName?.message, register: register("emergencyName") },
  //   { title: 'Emergency contact mobile number', placeholder: 'enter your emergency contact mobile number', type:'text', showErr:errors.emergencyMobile?.message, register: register("emergencyMobile") },
  //   { title: 'Emergency contact relation to the patient', placeholder: 'enter your emergency contact relation to the patient', type:'text', showErr:errors.emergencyRelation?.message, register: register("emergencyRelation") },



  // ];
  // let btnArr = [
  //   {
  //     title: 'create account',
  //     style: 'green-btn',
  //     action: handleSubmit(c),
  //   },
  // ];
  const [name, setName] = useState('')
  const [nationalID, setNationalID] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyMobile, setEmergencyMobile] = useState('')
  const [emergencyRelation, setEmergencyRelation] = useState('')
  let navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
    const data = { Username: username, 
      Name: name, 
      NationalID: nationalID,
      Email: email,
      Password: password, 
      DateOfBirth: dateOfBirth, 
      Gender: gender, 
      MobileNumber: mobileNumber, 
      EmergencyContactName: emergencyName,
      EmergencyContactMobile: emergencyMobile }
    console.log(data)
    const response = await axios.post('http://localhost:4000/Patient/registerPatient', data)
    
        if (response.status === 200) {
          alert(`Registered successfully`);
          console.log(response.data.message);
          navigate(`/login`);
        } else {
          alert(`Failed to register. Status: ${response.status}`);
        }
      } catch (error) {
        alert(`Failed to update password. Error: ${error.message}`);
        console.error('Error accepting request:', error);
      }
  }
  return (
    <div>
      <NavBar />
      {/* <Form
        title="create account"
        inputArr={inputArr}
        btnArr={btnArr}
        type="register"
      /> */}
      <form onSubmit={handleSubmit}>
        <h3>
          <label>Name</label>
          <input title='name' required placeholder='Name...' type='text' onChange={(e) => setName(e.target.value)} />
        </h3>
        <h3>
          <label>National ID</label>
          <input title='name' required placeholder='National ID...' type='text' onChange={(e) => setNationalID(e.target.value)} />
        </h3>
        <h3>
          <label>Username</label>
          <input type="text" required title="Username" placeholder="Username..." onChange={(e) => setUsername(e.target.value)} />
        </h3>
        <h3>
          <label>Email</label>
          <input type="email" required title="Email" placeholder="Email..." onChange={(e) => setEmail(e.target.value)} />
        </h3>
        <h3>
          <label>Password</label>
          <input type="password" required title="Password" placeholder="Password..." onChange={(e) => setPassword(e.target.value)} />
        </h3>
        <h3>
          <label>Date Of Birth</label>
          <input type="date" required title="Date Of Birth" placeholder="Date Of Birth..." onChange={(e) => setDateOfBirth(e.target.value)} />
        </h3>
        <h3>
          <label>Gender</label>
          <input type="text" required title="Gender" placeholder="Gender..." onChange={(e) => setGender(e.target.value)} />
        </h3>
        <h3>
          <label>Mobile Number</label>
          <input type="text" required title="Mobile Number" placeholder="Mobile Number..." onChange={(e) => setMobileNumber(e.target.value)} />
        </h3>
        <h3>
          <label>Emergency Contact Name</label>
          <input type="text" required title="Emergency Contact Name" placeholder="Emergency Contact Name..." onChange={(e) => setEmergencyName(e.target.value)} />
        </h3>
        <h3>
          <label>Emergency Contact Mobile Number</label>
          <input type="text" required title="Emergency Contact Mobile" placeholder="Emergency Contact Mobile..." onChange={(e) => setEmergencyMobile(e.target.value)} />
        </h3>
        <h3>
          <button type="submit">Submit</button>
        </h3>
      </form>
    </div>
  );
}
export default RegisterPatient;
