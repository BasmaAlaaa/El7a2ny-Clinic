import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function CaseTableBody({ data, username }) {
    let navigate = useNavigate();
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:4000/Patient/deleteMedicalHistoryDocument/${username}/${data._id}`);
            // .then(res =>setResult(res)).catch(err => console.log(err))
            if (response.status === 200) {
                alert(response.data.message);
                console.log(response.data.message);
                window.location.reload(true);
            }
        }
        catch (error) {
            alert(`Failed to delete document `);
            console.error('Error deleting document:', error);
        };
        window.location.reload(true);
    }

    return (
        <>
            <th>{data._id}</th>

            <td className="py-3 text-align-center">
                <div className="d-flex flex-row">
                    <button
                        className={`green-txt mx-2 text-decoration-underline text-capitalize border-0 bg-transparent`}
                        onClick={handleDelete}
                    >
                        Delete Document
                    </button>
                </div>
            </td>
        </>
    );
}

function TableMedicalHistoryDocumet({ tHead, data, username }) {
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
                                <CaseTableBody data={e} username={username} />
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default TableMedicalHistoryDocumet;
