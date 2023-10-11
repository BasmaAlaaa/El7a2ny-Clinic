import { useNavigate } from 'react-router-dom';


function CaseTableBody({ data , user}) {
  let navigate = useNavigate()

  return (
    <>
      
    {data.Name && <th>{data.Name}</th>}
    {data.Email&&<td>{data.Email}</td>}
    {data.Speciality&&<td>{data.Speciality}</td>}
    {data.sessionPrice&&<td>{data.sessionPrice}</td>}
    {data.ActiveIngredients &&
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

function TableDoctors({ tHead, data, searchText, filterText, user }) {
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
            e : e.MedicalUse.toLowerCase() === filterText.toLowerCase()
          })
          .filter((e) => {
            return searchText.toLowerCase() === '' ? 
            e: (e.Name.toLowerCase().includes(searchText.toLowerCase()) || e.Speciality.toLowerCase().includes(searchText.toLowerCase()))
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

export default TableDoctors;
