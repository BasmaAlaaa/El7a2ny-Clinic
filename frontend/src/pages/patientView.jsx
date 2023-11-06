import FamilyMembersList from "../components/FamilyMembersList";
import NavBarPatient from "../components/NavBarPatient";
import DoctorsList from "../components/DoctorsList";
import PrescriptionsList from "../components/PrescriptionsList";
import MainBtn from "../components/Button";
import { Navigate, useNavigate, useParams } from "react-router-dom";


function PatientView(){
  const navigate = useNavigate();
  const {username} = useParams();
return (
    <div>
    <NavBarPatient username={username}/>
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
              action={() => navigate(`/healthPackages/${username}`)}
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
          </div>
    <DoctorsList/>

    </div>
)
}
export default PatientView;