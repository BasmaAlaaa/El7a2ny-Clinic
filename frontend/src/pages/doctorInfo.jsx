import { useState, useEffect } from "react";
import NavBarAdministrator from "../components/NavBarAdministrator";
import { useParams} from 'react-router-dom';
import axios from "axios";
import NavBar from "../components/NavBar";
import NavBarPatient from "../components/NavBarPatient";


function DoctorInfo(){

    const {usernameDoctor, usernamePatient} = useParams();
    const[result, setResult] = useState([]);
    const[resultDelete, setResultDelete] = useState([]);



    useEffect(() => {
  const response = axios.get(`http://localhost:4000/Patient/viewDoctorInfo/${usernameDoctor}/${usernamePatient}`)
  .then(res =>setResult(res.data)).catch(err => console.log(err))
    }, [])

  console.log(result)

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
        <NavBarPatient username={usernamePatient}/>
        <h1>Doctor Info</h1>
        <ul>
            <h3>Name: {result.Name}</h3>
            <h3>Username: {result.Username}</h3>
            <h3>Email: {result.Email}</h3>
            <h3>Date of Birth: {result.DateOfBirth}</h3>
            <h3>Hourly Rate: {result.HourlyRate}</h3>
            <h3>Affiliation: {result.Affiliation}</h3>
            <h3>Educational Background: {result.EDB}</h3>

        </ul>
        </div>
    )
    }
    export default DoctorInfo;