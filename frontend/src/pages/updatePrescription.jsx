import MainBtn from '../components/Button.jsx';
import { useEffect, useState } from 'react';
import NavBarDoctor from '../components/NavBarDoctor.jsx';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import TableCart from '../components/TableCart.jsx';

function UpdatePrescription() {
    const { DoctorUsername, PatientUsername, prescriptionId } = useParams();
    const [updatedDescription, setUpdatedDescription] = useState("");
    const [updatedDose, setUpdatedDose] = useState(0);
    const [result, setResult] = useState('');
    const navigate = useNavigate();
    let tHead = ['Medicine', 'Dosage', 'Remove'];

    useEffect(() => {
        const response = axios.get(`http://localhost:4000/Doctor/viewPresDetails/${DoctorUsername}/${prescriptionId}`, {
          headers: { authorization: "Bearer " + sessionStorage.getItem("token") },
        })
          .then(res => setResult(res.data)).catch(err => console.log(err))
      }, [])
      console.log("el pres" , result);
      console.log("el meds", result.Medicines);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = {};

            if (updatedDescription !== "" && updatedDescription.trim() !== "") {
                data.updatedDescription = updatedDescription;
            }

            if (updatedDose !== 0) {
                data.updatedDose = updatedDose;
            }

            const response = await axios.put(`http://localhost:4000/Doctor/updatePrescription/${DoctorUsername}/${PatientUsername}/${prescriptionId}`, data, {
                headers: { authorization: 'Bearer ' + sessionStorage.getItem('token') },
            });

            if (response.status === 200) {
                alert(`Prescription updated successfully.`);
                navigate(`/presDoctorsList/${DoctorUsername}/${PatientUsername}`);
                console.log(response.data.message);
            } else {
                alert(`Failed to update prescription. Status: ${response.status}`);
            }
        } catch (error) {
            alert(`Failed to update prescription. Error: ${error.message}`);
            console.error('Error accepting request:', error.response);
        }
    };

    return (
        <div>
            <NavBarDoctor username={DoctorUsername}/>
            <h1>Update Prescription</h1>
            <form className="d-flex justify-content-center">
                <div style={{width: "30%"}} className="form-width">
                    <p className="text-capitalize fs-4 mb-3"></p>
                    <div className="mb-3">
                        <label className="form-label">Updated Description</label>
                        <textarea
                            rows={3}
                            className="form-control"
                            placeholder='Updated Description'
                            value={updatedDescription}
                            onChange={(e) => setUpdatedDescription(e.target.value)}
                        />
                    </div>

                    {/* <div className="mb-3">
                        <label className="form-label">Updated Dose</label>
                        <input
                            className="form-control"
                            title='Updated Dose'
                            placeholder='Enter Updated Dose'
                            type='number'
                            value={updatedDose}
                            onChange={(e) => setUpdatedDose(e.target.value)}
                        />
                    </div> */}
                    <div className="mt-3">
                        <MainBtn
                            txt='Save'
                            style='green-btn'
                            action={handleSubmit}
                        />
                    </div>
                </div>
            </form>
            <h2>Prescription Medicines</h2>
            <TableCart tHead={tHead} data={result.Medicines} username={DoctorUsername}/>

        </div>
    );
}

export default UpdatePrescription;
