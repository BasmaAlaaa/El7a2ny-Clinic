import { useState, useEffect } from "react";
import NavBarAdministrator from "../components/NavBarAdministrator";
import { useParams} from 'react-router-dom';
import axios from "axios";


function PatientInfo(){

    const {username} = useParams();
    const[result, setResult] = useState([]);
    const[resultDelete, setResultDelete] = useState([]);



    useEffect(() => {
  const response = axios.get(`http://localhost:8000/Admin/PatientInfo/${username}`)
  .then(res =>setResult(res.data)).catch(err => console.log(err))
    }, [])

  console.log(result)

  const handleRemove=() => {
    const response = axios.delete(`http://localhost:8000/Admin/RemovePatientOrPharmacist/${username}`)
  .then(res =>setResultDelete(res.data)).catch(err => console.log(err))
  }
  console.log(resultDelete)

//   result.map((e) => {
//     console.log(e)
//   })

    return (
        <div>
        <NavBarAdministrator/>
        <h1>Patient Info</h1>
        <ul>
            <h3>Name: {result.Name}</h3>
            <h3>Username: {result.Username}</h3>
            <h3>Email: {result.Email}</h3>
            <h3>Date of Birth: {result.DateOfBirth}</h3>
            <h3>Gender: {result.Gender}</h3>
            <h3>Mobile Number: {result.MobileNumber}</h3>
        </ul>
        <ul>
            <h2>Emergency Contact: </h2>
            <h3>Name: {result.EmergencyContactName}</h3>
            <h3>Mobile Number: {result.EmergencyContactMobile}</h3>
            <h3>Relation: {result.EmergencyContactRelation}</h3>
        </ul>
        <button onClick={handleRemove}>
            Remove Patient
        </button>
        </div>
    )
    }
    export default PatientInfo;