import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CaseTableBody({ data, appID, patientUsername, doctorUsername }) {
  let navigate = useNavigate();
  console.log('app id', appID);
  console.log('time slot', data._id);

  const sendNotificationDoctor = () =>{
    axios.post(`http://localhost:4000/Doctor/sendAppointmentDoctorRescheduleNotificationEmail/${doctorUsername}/${appID}`, "", {
     headers: { authorization: "Bearer " + sessionStorage.getItem("token")},
   })
    .then(res =>navigate(`/appointmentsList/${data.PatientUsername}`)).catch(err => alert('error sending doctor notification'))
   }
  const sendNotification = () =>{
    axios.post(`http://localhost:4000/Patient/sendAppointmentPatientRescheduleNotificationEmail/${patientUsername}/${appID}`, "", {
     headers: { authorization: "Bearer " + sessionStorage.getItem("token")},
   })
    .then(res =>sendNotificationDoctor).catch(err => alert('error sending notification'))
   }
  const createNotification = () =>{
   axios.post(`http://localhost:4000/Patient/createAppointmentNotifications/${patientUsername}`, "", {
  headers: { authorization: "Bearer " + sessionStorage.getItem("token")},
})
 .then(res =>sendNotification).catch(err => alert('error creating notification'))
}
const rescheduleAppointment = () =>{
  axios.post(`http://localhost:4000/Patient/rescheduleAppointment/${patientUsername}/${appID}/${data._id}`
  ,"",{headers: { authorization: "Bearer " + sessionStorage.getItem("token")},})
  .then(res =>alert('appointment rescheduled')).catch(err => alert('error rescheduling appointment'));
  createNotification();
}

  return (
    <>
      
    {data.Date && <th>{data.Date.substring(0,10)}</th>}
    {data.Time && <td>{data.Time}</td>}
    {data.Status && <td>{data.Status}</td>}
    {data.Status==='available' &&
    <td className="py-3 text-align-center">
      <div className="d-flex flex-row">
      <button
        className={`green-txt mx-2 text-decoration-underline text-capitalize border-0 bg-transparent`}
        onClick={()=>rescheduleAppointment}
      >
        Book
      </button>
      </div>
      </td>
}    

    </>
  );
}

// function NoramlTableBody({ data }) {
//   let arr = [];
//   for (let key in data) arr.push(data[key]);

//   return (
//     <>
//       {arr.map((e) => (
//         <td>{e}</td>
//       ))}
//     </>
//   );
// }

function TableScheduleReschedule({ tHead, data, appID, patientUsername, doctorUsername }) {
  console.log('haayaa', data)

  return (
    <div className="case-table card mt-4">
      <table className="table table-striped m-0">
        <thead>
          <tr className="text-capitalize">
            {tHead.map((e) => (
              <th scope="col">{e}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data && data
          .map((e) => (
            <tr className="text-capitalize">
                <CaseTableBody data={e} appID={appID} patientUsername={patientUsername} doctorUsername={doctorUsername}/>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableScheduleReschedule;
