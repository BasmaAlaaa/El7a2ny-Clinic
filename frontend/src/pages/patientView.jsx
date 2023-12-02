import NavBarPatient from "../components/NavBarPatient";
import DoctorsList from "../components/DoctorsList";
import MainBtn from "../components/Button";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import TableHealthRecords from "../components/TableHealthRecords";

function PatientView() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [healthRecord, setHealthRecord] = useState([]);
  const [wallet, setWallet] = useState('');


  let tHead = ['Date', 'Description', 'Diagnosis', 'Medication'];

  useEffect(() => {
    const response = axios.get(`http://localhost:4000/Patient/viewHealthRecords/${username}`,{
      headers: { authorization: "Bearer " + sessionStorage.getItem("token")},
    })
      .then(res => setHealthRecord(res.data.healthRecords)).catch(err => console.log(err))
  }, [])
  console.log(healthRecord);

  useEffect(() => {
    const response = axios.get(`http://localhost:4000/Patient/viewWalletAmountByPatient/${username}`,{
      headers: { authorization: "Bearer " + sessionStorage.getItem("token")},
    })
      .then(res => setWallet(res.data)).catch(err => console.log(err))
    console.log('w', wallet)
  }, []);

  return (
    <div>
      <NavBarPatient username={username} />
      <div>
        <MainBtn
          txt="View All Appointments"
          style="green-btn"
          action={() => navigate(`/appointmentsList/${username}`)}
          key="navBtn"
        />
        <MainBtn
          txt="View Health Packages"
          style="green-btn"
          action={() => navigate(`/healthPackagesList/${username}`)}
          key="navBtn"
        />
        <MainBtn
          txt="View All Registered Family Members"
          style="green-btn"
          action={() => navigate(`/familyMembersList/${username}`)}
          key="navBtn"
        />
        <MainBtn
          txt="View All of my Prescriptions"
          style="green-btn"
          action={() => navigate(`/prescriptionsList/${username}`)}
          key="navBtn"
        />
        <MainBtn
          txt="Add Family Member"
          style="green-btn"
          action={() => navigate(`/addFamilyMember/${username}`)}
          key="navBtn"
        />
        <MainBtn
          txt="Add Medical History Document"
          style="green-btn"
          action={() => navigate(`/addMedicalHistoryDocument/${username}`)}
          key="navBtn"
        />
        <MainBtn
          txt="View/Delete Medical History Documents"
          style="green-btn"
          action={() => navigate(`/viewMedicalHistoryDocuments/${username}`)}
          key="navBtn"
        />
      </div>
      <DoctorsList />
      <h1>Health Records</h1>
      <TableHealthRecords tHead={tHead} data={healthRecord} />
      {wallet &&
        <div>
          <h1>Wallet Amount: {wallet}</h1>
        </div>
      }


    </div>
  );
}

export default PatientView;
