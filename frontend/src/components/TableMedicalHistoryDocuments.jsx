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
    };

    return (
        <>
            <td>
                {data.contentType.startsWith('image/') ? (
                    <img
                        src={`http://localhost:4000/Patient/viewMedicalHistoryDocuments/${username}`}
                        alt="Document"
                        style={{ maxWidth: '100px', maxHeight: '100px' }}
                    />
                ) : (
                    <p>{/* Display a link or appropriate component for non-image documents */}</p>
                )}
            </td>
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


function TableMedicalHistoryDocument({ tHead, data, username }) {
    console.log(username, data._id);
    return (
        <div className="case-table card mt-4">
            <table className="table table-striped m-0">
                <thead>
                    <tr className="text-capitalize">
                        {tHead.map((e) => (
                            <th key={e} scope="col">
                                {e}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((e) => (
                        <tr key={e._id} className="text-capitalize">
                            <CaseTableBody data={e} username={username} />
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TableMedicalHistoryDocument;
