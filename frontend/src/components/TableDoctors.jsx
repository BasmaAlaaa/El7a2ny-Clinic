import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function CaseTableBody({ data , user}) {
  let navigate = useNavigate();

  return (
    <>
      
    {data.Name && <th>{data.Name}</th>}
    {data.Email&&<td>{data.Email}</td>}
    {data.Speciality&&<td>{data.Speciality}</td>}
    {data.sessionPrice&&<td>{data.sessionPrice}</td>}
    
      <td className="py-3 text-align-center">
      <div className="d-flex flex-row">
      <button
        className={`green-txt mx-2 text-decoration-underline text-capitalize border-0 bg-transparent`}
        onClick={()=>navigate(`/doctorInfo/${data.Username}/${user}`)}
      >
        View
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

function TableDoctors({ tHead, data, searchText, searchDate, searchTime, filterText, user }) {
  console.log(searchDate)
  console.log(searchTime)
//    const[result, setResult] = useState('')
//    axios.get(`http://localhost:4000/Patient/findDocByAvailability/${searchDate}/${searchTime}`)
//    .then(res =>setResult(res.data)).catch(err => console.log(err))
//  console.log(result)
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
            console.log(e.Schedule)
            return filterText.toLowerCase() === '' || filterText.toLowerCase() === 'all'?
            e : e.Speciality.toLowerCase() === filterText.toLowerCase()
          })
          .filter((e) => {
            return searchText.toLowerCase() === '' ? 
            e: (e.Name.toLowerCase().includes(searchText.toLowerCase()) || e.Speciality.toLowerCase().includes(searchText.toLowerCase()))
          })
          .map((e) => (
            <tr className="text-capitalize">
                <CaseTableBody data={e} user={user}/>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableDoctors;
