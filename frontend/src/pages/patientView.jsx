import FamilyMembersList from "../components/FamilyMembersList";
import NavBar from "../components/NavBar";
import DoctorsList from "../components/doctorsList";
import PrescriptionsList from "../components/prescriptionsList";


function PatientView(){
return (
    <div>
    <NavBar/>
    <div>
            <MainBtn
              txt="View All Appointments"
              style="green-btn"
              action={() => navigate(`/appointmentsList/${id}`)}
              key="navBtn"
            />
            </div>
    <FamilyMembersList/>
    <DoctorsList/>
    <PrescriptionsList/>

    </div>
)
}
export default PatientView;