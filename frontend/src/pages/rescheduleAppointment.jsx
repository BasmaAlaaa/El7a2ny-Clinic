import { useState, useEffect } from "react";
import { useParams} from 'react-router-dom';
import axios from "axios";
import NavBarPatient from "../components/NavBarPatient";
import TableSchedule from "../components/TableSchedule";
import TableScheduleReschedule from "../components/TableScheduleReschedule";


function RescheduleAppointment(){

    const {usernamePatient, usernameDoctor, appID} = useParams();
    const[result, setResult] = useState('');


    useEffect(() => {
  const response = axios.get(`http://localhost:4000/Patient/viewDoctorInfo/${usernameDoctor}/${usernamePatient}`,{
    headers: { authorization: "Bearer " + sessionStorage.getItem("token")},
  })
  .then(res =>setResult(res.data)).catch(err => console.log(err))
    }, [])

  console.log('aaaaaa',result)

  // const handleRemove=() => {
  //   const response = axios.delete(`http://localhost:8000/Admin/RemovePatientOrPharmacist/${username}`)
  // .then(res =>setResultDelete(res.data)).catch(err => console.log(err))
  // }
  // console.log(resultDelete)

//   result.map((e) => {
//     console.log(e)
//   })
let tHead = ['Date', 'Time', 'Status', 'Book'];

    return (
        <div>
        <NavBarPatient username={usernamePatient}/>
        <h1>Available Appointments: </h1>
            <TableScheduleReschedule tHead={tHead} data={result.AvailableTimeSlots} appID={appID} patientUsername={usernamePatient}/>
        </div>
    )
    }
    export default RescheduleAppointment;