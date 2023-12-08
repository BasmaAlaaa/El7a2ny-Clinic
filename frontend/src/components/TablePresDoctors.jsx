import { useNavigate, useParams } from 'react-router-dom';

function CaseTableBody({ data }) {
  const navigate = useNavigate();
  console.log("pres id", data._id);
  console.log("Data object:", data);

  const updateLink = data.Filled === 'false' ? (
    <span
      style={{ color: 'blue', cursor: 'pointer' }}
      onClick={() =>
        navigate(`/updatePrescription/${data.DoctorUsername}/${data.PatientUsername}/${data._id}`)
      }
    >
      Update
    </span>
  ) : (
    <span style={{ color: 'gray' }}>Update (Filled)</span>
  );

  return (
    <>
      {data.PatientUsername && <th>{data.PatientUsername}</th>}
      {data.Date && <td>{data.Date.substring(0, 10)}</td>}
      {data.Description && <td>{data.Description}</td>}
      {data.Filled && <td>{data.Filled === 'true' ? 'Filled' : 'Unfilled'}</td>}
      <td>{updateLink}</td>
    </>
  );
}

function TablePresDoctors({ tHead, data, searchText, filterText, searchDate }) {
  return (
    <div className="case-table card mt-4">
      <table className="table table-striped m-0">
        <thead>
          <tr className="text-capitalize">
            {tHead.map((e) => (
              <th scope="col" key={e}>
                {e}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data
            .filter((e) => {
              return (
                filterText === "" ||
                  filterText.toLowerCase() === "all" ?
                  e :
                  filterText.toLowerCase() === "filled" ? e.Filled : !e.Filled
              );
            })
            .filter((e) => {
              return searchText === "" ?
                e :
                e.PatientUsername.toLowerCase().includes(searchText.toLowerCase());
            })
            .filter((e) => {
              return searchDate === "" ?
                e :
                e.Date.substring(0, 10) === searchDate;
            })
            .map((e) => (
              <tr className="text-capitalize" key={e.prescriptionID}>
                <CaseTableBody data={e} />
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablePresDoctors;
