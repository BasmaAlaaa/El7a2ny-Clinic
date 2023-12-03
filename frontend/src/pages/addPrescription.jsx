import { useNavigate, useParams } from 'react-router-dom';
import Form from '../components/Form.jsx';
import { useDispatch } from 'react-redux';
import { loggedIn } from '../features/login.js';
import Validation from '../validate/validate';
import NavBarAdministrator from '../components/NavBarAdministrator.jsx';
import { useEffect, useState } from 'react';
import axios from 'axios'
import NavBarPatient from '../components/NavBarPatient.jsx';
// import Patient from '../../../backend/src/Models/Patient.js';

function AddPrescription() {

    const { username } = useParams();
    const { PatientUsername } = useParams();
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [appointmentID, setAppointmentID] = useState('');
    const [dose, setDose] = useState(0);
    const [appointments, setAppointments] = useState([]);

    const navigate = useNavigate();

    console.log(username);
    console.log(PatientUsername);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:4000/Doctor/docFilterAppsByStatus/${username}/Upcoming`,
                    {
                        headers: { authorization: 'Bearer ' + sessionStorage.getItem('token') },
                    }
                );
                setAppointments(response.data.filteredAppointments);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchData();
    }, [username]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { description, date, dose, appointmentID };
        console.log(data);
    
        try {
            const response = await axios.post(
                `http://localhost:4000/Doctor/addPatientPrescription/${username}/${PatientUsername}`,
                data,
                {
                    headers: { authorization: 'Bearer ' + sessionStorage.getItem('token') },
                }
            );
    
            alert('Prescription added successfully.');
            navigate(`/patientsList/${username}`);
            console.log(response.data);
        } catch (error) {
            console.error('Error adding prescription:', error.response?.data || error.message);
            alert('Error adding prescription. Please check console for details.');
        }
    };

    return (
        <div>
            <NavBarPatient username={username} />
            {/* <Form title="Add Administrator" inputArr={inputArr} type="addAdministrator" btnArr={btnArr} /> */}
            <form onSubmit={handleSubmit}>
                <h2>Add Prescription</h2>
                <h3><input required placeholder='Description' type='text' onChange={(e) => setDescription(e.target.value)} /></h3>
                <h3><input required placeholder='Dose' type='number' onChange={(e) => setDose(e.target.value)} /></h3>
                <h3><input required placeholder='Date' type='date' onChange={(e) => setDate(e.target.value)} /></h3>

                {/* Dropdown list of appointments */}
                <h3>
                    <select value={appointmentID} onChange={(e) => setAppointmentID(e.target.value)}>
                        <option value="">Select an appointment</option>
                        {appointments.map((appointment) => (
                            <option key={appointment._id} value={appointment._id}>
                                {appointment.Name} / {appointment.Date}
                            </option>
                        ))}
                    </select>
                </h3>

                <h3><button type="submit">Submit</button></h3>
            </form>

        </div>
    );
}
export default AddPrescription;
