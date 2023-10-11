import { useState, useEffect } from "react";
import NavBarAdministrator from "../components/NavBarAdministrator";
import { useParams} from 'react-router-dom';
import axios from "axios";
import NavBarDoctor from "../components/NavBarDoctor";
import MainBtn from "../components/Button";
import { useNavigate } from 'react-router-dom';


function DoctorView(){

    const {username} = useParams();
    const[result, setResult] = useState([]);
    const [email, setEmail] = useState('');
    const [hourlyrate, setHourlyRate] = useState(0);
    const [affiliation, setAffiliation] = useState('');
    let navigate = useNavigate()



  const updateEmail=() => {
    const response = axios.put(`http://localhost:4000/Doctor/updateDoctorByEmail/${username}`, email)
  .then(res =>setResult(res.data)).catch(err => console.log(err))
  console.log(result)
  }
  const updateHourlyRate=() => {
    const response = axios.put(`http://localhost:4000/Doctor/updateDoctorByHourlyRate/${username}`, hourlyrate)
  .then(res =>setResult(res.data)).catch(err => console.log(err))
  console.log(result)
  }
  const updateAffiliation=() => {
    const response = axios.put(`http://localhost:4000/Doctor/updateDoctorByAffiliation/${username}`, affiliation)
  .then(res =>setResult(res.data)).catch(err => console.log(err))
  console.log(result)
  }


    return (
        <div>
        <NavBarDoctor username={username}/>
        <div>
            <MainBtn
              txt="View All Patients"
              style="green-btn"
              action={() => navigate(`/patientsList/${username}`)}
              key="navBtn"
            />
          </div>
          <div>
            <MainBtn
              txt="View All Appointments"
              style="green-btn"
              action={() => navigate(`/appointmentsList/${username}`)}
              key="navBtn"
            />
            </div>
              <form >
  <h3><input  type= 'email'  placeholder= 'Enter New Email'  onChange={(e) => setEmail(e.target.value)} />
  <button onClick={updateEmail}>Update Email</button></h3>
  <h3><input type="number"  placeholder="Enter New Hourly Rate" onChange={(e) => setHourlyRate(e.target.value)}/>
  <button onClick={updateHourlyRate}>Update Hourly Rate</button></h3>
  <h3><input type="text"  placeholder="Enter New Affiliation" onChange={(e) => setAffiliation(e.target.value)}/>
  <button onClick={updateAffiliation}>Update Affiliation</button></h3>
</form>
          
      
        </div>
    )
    }
    export default DoctorView;