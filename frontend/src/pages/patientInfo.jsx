import { useState, useEffect } from "react";
import NavBarAdministrator from "../components/NavBarAdministrator";
import { useParams} from 'react-router-dom';
import axios from "axios";
import NavBar from "../components/NavBar";
import TableHealthRecords from "../components/TableHealthRecords";


function PatientInfo(){

    const {usernameDoctor, usernamePatient} = useParams();
    const[result, setResult] = useState([]);
    const[resultAdd, setResultAdd] = useState([]);
    const [date, setDate] = useState('');
    const [time, setTime] = useState(0);
    const [healthRecord, setHealthRecord] = useState([]);
    const [healthRecordDate, setHealthRecordDate] = useState('');
    const [healthRecordDescription, setHealthRecordDescription] = useState('');
    const [healthRecordDiagnosis, setHealthRecordDiagnosis] = useState('');
    const [healthRecordMedication, setHealthRecordMedication] = useState('');

    const handleSubmit = () => {
      const data = {Date:healthRecordDate, Description:healthRecordDescription, Diagnosis:healthRecordDiagnosis, Medication:healthRecordMedication}
      console.log(data)
      const response = axios.post(`http://localhost:4000/Doctor/addHealthRecord/${usernameDoctor}/${usernamePatient}`, data)
      .then(res =>setResultAdd(res)).catch(err => console.log(err))
    }

    const handleSubmit1 = () => {
      const data = {date:date, time:time}
      console.log(data)
      const response = axios.post(`http://localhost:4000/Doctor/scheduleFollowUp/${usernameDoctor}/${usernamePatient}`, data)
      .then(res =>setResultAdd(res)).catch(err => console.log(err))
    }

    useEffect(() => {
  const response = axios.get(`http://localhost:4000/Doctor/viewInfoAndRecords/${usernameDoctor}/${usernamePatient}`)
  .then(res =>setResult(res.data)).catch(err => console.log(err))
    }, [])
    console.log(result);
    useEffect(() => {
      const response = axios.get(`http://localhost:4000/Doctor/viewHealthRecords/${usernameDoctor}/${usernamePatient}`)
      .then(res =>setHealthRecord(res.data.healthRecords)).catch(err => console.log(err))
        }, [])
    console.log(healthRecord);
   // console.log('heeeee', healthRecord);
    
    //console.log('resultttt adddd', resultAdd)


  // console.log('recordssss',result.PatientPrescriptions);
  // if(result.HealthRecords){
  //   console.log('hhhhhhh')
  // }
  // {result.HealthRecords.map((e) => {
  //   setDate(e.Date)

  //   })} 
    let tHead = ['Date', 'Description', 'Diagnosis', 'Medication'];

  // const handleRemove=() => {
  //   const response = axios.delete(`http://localhost:4000/Admin/RemovePatientOrPharmacist/${username}`)
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
         <TableHealthRecords tHead={tHead} data={healthRecord} /> 
          {/* <h3>Description: {result.HealthRecords[0].Description}</h3> 
          <h3>Diagnosis: {result.HealthRecords[0].Diagnosis}</h3> 
          <h3>Medication: {result.HealthRecords[0].Medication}</h3>  */}
    <form>
    <h1>
      Add new health records
    </h1>
    {/* {healthRecord && healthRecord.map((e) => {
      <h3>{e.Date}</h3>
    })} */}
    
    <h3><input  type= 'date' placeholder="Date" onChange={(e) => setHealthRecordDate(e.target.value)} /> </h3>
    <h3><input  type= 'text' placeholder="Description" onChange={(e) => setHealthRecordDescription(e.target.value)} /></h3>
    <h3><input  type= 'text' placeholder="Diagnosis" onChange={(e) => setHealthRecordDiagnosis(e.target.value)} /></h3>
    <h3><input  type= 'text' placeholder="Medication" onChange={(e) => setHealthRecordMedication(e.target.value)} /></h3>
    <button onClick={handleSubmit}>Add Health Records</button>

    <h1>
      Schedule Follow-up
    </h1>
    <h3>
    <input  type= 'date'  onChange={(e) => setDate(e.target.value)} />
    </h3>
    <h3>
    <input  type= 'number' placeholder="Time" onChange={(e) => setTime(e.target.value)} />
    </h3>
    <button onClick={handleSubmit}>Add Appointment</button>
  </form>
        </div>
    )
    }
    export default PatientInfo;