import { useNavigate } from 'react-router-dom';


function CaseTableBody({ data }) {
  let navigate = useNavigate()

  return (
    <>
      
    {data.Date && <th>{data.Date}</th>}
    {data.DoctorUsername && <td>{data.DoctorUsername}</td>}
    {data.Status && <td>{data.Status}</td>}
    
      

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
            return filterText.toLowerCase() === '' || filterText.toLowerCase() === 'all'?
            e : e.Status.toLowerCase() === filterText.toLowerCase()
          })
          .filter((e) => {
            return filterText.toLowerCase() === ''?
            e : e.Date === searchDate
          })
          .filter((e) => {
            return searchText.toLowerCase() === '' ? 
            e: e.Name.toLowerCase().includes(searchText.toLowerCase())
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
