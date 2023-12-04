import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import { useState } from 'react';


function CaseTableBody({ data }) {
  let navigate = useNavigate();
  const[searchDate, setSearchDate] = useState('');


  return (
    <>
      
    {data.Date && <th>{data.Date.substring(0,10)}</th>}
    {data.DoctorUsername && <td>{data.DoctorUsername}</td>}
    {data.PatientUsername && <td>{data.PatientUsername}</td>}
    {data.Name && <td>{data.Name}</td>}
    {data.Status && <td>{data.Status}</td>}

    <td className="py-3 text-align-center">
      <div className="d-flex flex-row">
      <button
        className={`green-txt mx-2 text-decoration-underline text-capitalize border-0 bg-transparent`}
        onClick={()=>navigate(`/rescheduleAppointment/${data.PatientUsername}/${data.DoctorUsername}/${data._id}`)}
      >
        Reschedule
      </button>
      </div>
      </td>

      <td className="py-3 text-align-center">
      <div className="d-flex flex-row">
      <button
        className={`green-txt mx-2 text-decoration-underline text-capitalize border-0 bg-transparent`}
        onClick={()=>axios.post(`http://localhost:4000/Patient/cancelAppointment/${data.PatientUsername}/${data._id}`
        ,"",{headers: { authorization: "Bearer " + sessionStorage.getItem("token")},})
        .then(res =>console.log(res)).catch(err => console.log(err))}
      >
        Cancel
      </button>
      </div>
      </td>

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

function TableAppointments({ tHead, data, searchText, searchDate, filterText }) {
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
          {data
          .filter((e) => {
            return filterText === '' || filterText.toLowerCase() === 'all'?
            e : e.Status.toLowerCase() === filterText.toLowerCase()
          })
          .filter((e) => {
            return searchDate=== ''?
            e: e.Date.substring(0,10) === searchDate
          })
          .map((e) => (
            <tr className="text-capitalize">
                <CaseTableBody data={e} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableAppointments;
