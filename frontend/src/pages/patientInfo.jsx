import { useState, useEffect } from "react";
import NavBarAdministrator from "../components/NavBarAdministrator";
import { useParams} from 'react-router-dom';
import axios from "axios";
import NavBar from "../components/NavBar";
import TableHealthRecords from "../components/TableHealthRecords";


function PatientInfo(){

    const {usernameDoctor, usernamePatient} = useParams();
    const[result, setResult] = useState([]);
    const[resultDelete, setResultDelete] = useState([]);
    const [date, setDate] = useState('');
    const [time, setTime] = useState(0);
    const [healthRecord, setHealthRecord] = useState('');



    useEffect(() => {
  const response = axios.get(`http://localhost:4000/Doctor/viewInfoAndRecords/${usernameDoctor}/${usernamePatient}`)
  .then(res =>setResult(res)).catch(err => console.log(err))
    }, [])

  // console.log('recordssss',result.PatientPrescriptions);
  // if(result.HealthRecords){
  //   console.log('hhhhhhh')
  // }
  // {result.HealthRecords.map((e) => {
  //   setDate(e.Date)

  //   })} 
    let tHead = ['Name', 'Age', 'National ID', 'Gender', 'Relation to Patient'];

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
        </ul>
        {/* <button onClick={handleRemove}>
            Remove Patient
        </button> */}
        <h1>Health Records </h1>
        {/* <TableHealthRecords tHead={tHead} data={result.HealthRecords} /> */}
          {/* <h3>Description: {result.HealthRecords[0].Description}</h3> 
          <h3>Diagnosis: {result.HealthRecords[0].Diagnosis}</h3> 
          <h3>Medication: {result.HealthRecords[0].Medication}</h3>  */}
    <form>
    <h1>
      Add new health records
    </h1>
    <h3>
    <input  type= 'text' required onChange={(e) => setHealthRecord(e.target.value)} />
    </h3>
    <h1>
      Schedule Follow-up
    </h1>
    <h3>
    <input  type= 'date' required onChange={(e) => setDate(e.target.value)} />
    </h3>
    <h3>
    <input  type= 'number' placeholder="Time" required onChange={(e) => setTime(e.target.value)} />
    </h3>
    <button>Add Appointment</button>
  </form>
        </div>
    )
    }
    export default PatientInfo;