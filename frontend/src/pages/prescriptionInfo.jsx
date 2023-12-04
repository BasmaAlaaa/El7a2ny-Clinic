import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import NavBarPatient from "../components/NavBarPatient";


function PrescriptionInfo() {
  const { id } = useParams();
  const [result, setResult] = useState([]);



  useEffect(() => {
    const response = axios.get(`http://localhost:4000/Patient/viewMyPres/${id}`, {
      headers: { authorization: "Bearer " + sessionStorage.getItem("token") },
    })
      .then(res => setResult(res.data)).catch(err => console.log(err))
  }, [])


  //   result.map((e) => {
  //     console.log(e)
  //   })

  return (
    <div>
      <NavBarPatient username={result.PatientUsername} />
      <h1>Prescription Info</h1>
      <ul>
        <h3>Patient Name: {result.PatientName}</h3>
        <h3>Doctor Name: {result.DoctorName}</h3>
        <h3>Prescription Date: {result.Date}</h3>
        <h3>Description: {result.Description}</h3>
        <h3>Status: {result.Filled == true ? "Filled" : "Unfilled"}</h3>


      </ul>
    </div>
  )
}
export default PrescriptionInfo;