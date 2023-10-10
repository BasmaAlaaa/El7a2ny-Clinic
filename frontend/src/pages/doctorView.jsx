import { useState, useEffect } from "react";
import NavBarAdministrator from "../components/NavBarAdministrator";
import { useParams} from 'react-router-dom';
import axios from "axios";
import NavBar from "../components/NavBar";
import MainBtn from "../components/Button";
import { useNavigate } from 'react-router-dom';


function DoctorView(){

    const {id} = useParams();
    const[result, setResult] = useState([]);
    const[resultDelete, setResultDelete] = useState([]);
    const [email, setEmail] = useState('');
    const [hourlyrate, setHourlyRate] = useState(0);
    const [affiliation, setAffiliation] = useState('');
    let navigate = useNavigate()



  // const handleRemove=() => {
  //   const response = axios.delete(`http://localhost:8000/Admin/RemovePatientOrPharmacist/${username}`)
  // .then(res =>setResultDelete(res.data)).catch(err => console.log(err))
  // }
  // console.log(resultDelete)

//   result.map((e) => {
//     console.log(e)
//   })

    return (
        <div>
        <NavBar/>
        <div>
            <MainBtn
              txt="View All Patients"
              style="green-btn"
              action={() => navigate(`/patientsList/${id}`)}
              key="navBtn"
            />
          </div>
          <div>
            <MainBtn
              txt="View All Appointments"
              style="green-btn"
              action={() => navigate(`/appointmentsList/${id}`)}
              key="navBtn"
            />
            </div>
              <form >
  <h3><input  type= 'email'  placeholder= 'Enter New Email'  onChange={(e) => setEmail(e.target.value)} />
  <button>Update Email</button></h3>
  <h3><input type="number"  placeholder="Enter New Hourly Rate" onChange={(e) => setHourlyRate(e.target.value)}/>
  <button >Update Hourly Rate</button></h3>
  <h3><input type="text"  placeholder="Enter New Affiliation" onChange={(e) => setAffiliation(e.target.value)}/>
  <button >Update Affiliation</button></h3>
</form>
          
      
        </div>
    )
    }
    export default DoctorView;