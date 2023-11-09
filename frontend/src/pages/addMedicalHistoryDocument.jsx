import { useNavigate, useParams } from 'react-router-dom';
import Form from '../components/Form.jsx';
import { useDispatch } from 'react-redux';
import { loggedIn } from '../features/login.js';
import Validation from '../validate/validate.js';
import NavBarAdministrator from '../components/NavBarAdministrator.jsx';
import { useState } from 'react';
import axios from 'axios'
import NavBarPatient from '../components/NavBarPatient.jsx';

function AddMedicalHistoryDocument() {

  const { username } = useParams()
  const [MedicalHistoryDocuments, setMedicalHistoryDocuments] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('MedicalHistoryDocuments', MedicalHistoryDocuments);

    console.log(data)
    const response = axios.post(`http://localhost:4000/Patient/addMedicalHistoryDocument/${username}`, data)
      .then(res => console.log(res.data)).catch(err => console.log(err))
  }

  return (
    <div>
      <NavBarPatient username={username} />
      <form onSubmit={handleSubmit}>
        <h2>Medical History Document</h2>
        <input type="file" required title="MedicalHistoryDocuments" onChange={(e) => setMedicalHistoryDocuments(e.target.files[0])} />
        <h3><button type="submit">Submit</button></h3>
      </form>

    </div>
  );
}

export default AddMedicalHistoryDocument;