import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import TableMedicalHistoryDocuments from './TableMedicalHistoryDocuments.jsx';


function MedicalHistoryDocumentsList() {
    const username = useParams().username;
    const [searchText, setSearchText] = useState('');
    const [filterText, setFilterText] = useState('');
    const [result, setResult] = useState([]);


    useEffect(() => {
        const response = axios.get(`http://localhost:4000/Patient/viewMedicalHistoryDocuments/${username}`)
        .then(res => {
            setResult(res.data.MedicalHistoryDocuments);
        })
            .catch(err => console.log(err));
    }, [username]);

    console.log(filterText)
    let navigate = useNavigate()

    let tHead = ['Document'];

    return (
        <div>

            <TableMedicalHistoryDocuments tHead={tHead} data={result} username={username} searchText={searchText} filterText={filterText} />
        </div>
    );
}
export default MedicalHistoryDocumentsList;
