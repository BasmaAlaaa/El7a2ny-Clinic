import { Navigate, useNavigate } from "react-router-dom";
import MainBtn from "../components/Button";
import NavBarPharmacist from "../components/NavBarPharmacist";
import MedicineListPharmacist from "../components/medicineListPharmacist";


function PharmacistView(){
    const navigate = useNavigate();
return (
    <div>
    <NavBarPharmacist/>
    <MainBtn
              txt="Add Medicine"
              style="green-btn"
              action={() => navigate('/addMedicine')}
              key="navBtn"
            />
    <MedicineListPharmacist/>
    </div>
)
}
export default PharmacistView;