import { useState, useEffect } from "react";
import NavBarAdministrator from "../components/NavBarAdministrator";
import { useParams} from 'react-router-dom';
import axios from "axios";
import NavBarPatient from "../components/NavBarPatient";


function PrescriptionInfo(){
    const {id} = useParams();
    const[result, setResult] = useState([]);


    useEffect(() => {
  const response = axios.get(`http://localhost:4000/Patient/viewMyPres/${id}`)
  .then(res =>setResult(res.data)).catch(err => console.log(err))
    }, [])

  console.log(result)

//   result.map((e) => {
//     console.log(e)
//   })

return (
    <div>
        <NavBarPatient/>
        <h1>Prescription Info</h1>
        <ul>
            <h3>Prescription ID: {result.PrescriptionID}</h3>
            <h3>Appointment ID: {result.AppointmentID}</h3>
            <h3>Doctor Username: {result.DoctorUsername}</h3>
            <h3>Prescription Date: {result.Date}</h3>
            <h3>Description: {result.Description}</h3>
            <h3>Filled: {result.Filled}</h3>


        </ul>
        </div>
)
}
export default PrescriptionInfo;