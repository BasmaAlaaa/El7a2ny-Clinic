import { useNavigate } from 'react-router-dom';
import moment from 'moment';


function CaseTableBody({ data }) {
  let navigate = useNavigate()

  return (
    <>
      
    {data.Date && <th>{data.Date.substring(0,10)}</th>}
    {data.DoctorUsername && <td>{data.DoctorUsername}</td>}
    {data.PatientUsername && <td>{data.PatientUsername}</td>}
    {data.Status && <td>{data.Status}</td>}

    <td className="py-3 text-align-center">
      <div className="d-flex flex-row">
      <button
        className={`green-txt mx-2 text-decoration-underline text-capitalize border-0 bg-transparent`}
        //onClick={()=>navigate(`/healthPackageInfo/${username}/${data.type}`)}
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

function TableHealthPackages({ tHead, data }) {
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

export default TableHealthPackages;
