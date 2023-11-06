import NavBarPatient from "../components/NavBarPatient";
import TableHealthPackages from "./TableHealthPackages";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

function HealthPackagesList(){
    const[result, setResult] = useState([]);
    const {username} = useParams();
  
  
    useEffect(() => {
  const response = axios.get(`http://localhost:4000/Patient/allAppointments/${username}`)
  .then(res =>setResult(res.data.filteredAppointments)).catch(err => console.log(err))
    }, [])
  console.log('hayouya', result)
  result.map((e) => {
    console.log(e)
  })
  let navigate = useNavigate()
  let tHead = ['Type', 'Annual Fee', 'View'];
    return (
        <div>
          <NavBarPatient username={username}/>
        <div className="d-flex justify-content-between flex-row">
      <p className="text-capitalize fs-4 w-25">Health Packages</p>
    </div>
    <TableHealthPackages tHead={tHead} data={result}/>
        <h1>Subscribed Health Packages</h1>
        </div>
    )
}
export default HealthPackagesList;