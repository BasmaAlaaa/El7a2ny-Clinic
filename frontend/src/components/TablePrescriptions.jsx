import { useNavigate } from 'react-router-dom';

function CaseTableBody({ data }) {
  let navigate = useNavigate()
  console.log("pres id", data.prescriptionID)
  return (
    <>

      {data.DoctorUsername && <th>{data.DoctorUsername}</th>}
      {data.Date && <td>{data.Date.substring(0, 10)}</td>}
      {data.Description && <td>{data.Description}</td>}
      {data.Filled && (
        <td>{data.Filled === "true" ? "Filled" : "Unfilled"}</td>
      )}


      <td className="py-3 text-align-center">
        <div className="d-flex flex-row">
          <button
            className={`green-txt mx-2 text-decoration-underline text-capitalize border-0 bg-transparent`}
            onClick={() => navigate(`/prescriptionInfo/${data.prescriptionID}`)}
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

function TablePrescriptions({ tHead, data, searchText, filterText, searchDate }) {
  console.log("fff", filterText.toLowerCase())
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
              return filterText === '' || filterText.toLowerCase() === 'all' ?
                e : filterText.toLowerCase() === 'filled' ? e.Filled : !e.Filled
            })
            .filter((e) => {
              return searchText === '' ?
                e : e.DoctorUsername.toLowerCase().includes(searchText.toLowerCase())
            })
            .filter((e) => {
              return searchDate === '' ?
                e : e.Date.substring(0, 10) === searchDate
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

export default TablePrescriptions;
