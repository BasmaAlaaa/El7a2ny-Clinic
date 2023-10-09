import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap/dist/css/bootstrap.css';
import './assets/all.css';
import Login from './pages/login';
import NavBar from './components/NavBar';
import RegisterPatient from './pages/registerPatient';
import RegisterDoctor from './pages/registerDoctor';
import AdministratorView from './pages/administratorView';
import PatientView from './pages/patientView';
import PharmacistView from './pages/pharmacistView';
import MedicineList from './components/medicineList';
import MedicineView from './pages/medicineView';
import AddAdministrator from './pages/addAdministrator';
import PatientInfo from './pages/patientInfo';
import PharmacistInfo from './pages/pharmacistInfo';
import RequestInfo from './pages/requestInfo';
import AddMedicine from './pages/addMedicine';
import EditMedicine from './pages/editMedicine';
import DoctorView from './pages/doctorView';
import ManagePackages from './pages/managePackages';
import RemoveUser from './pages/removeUser';




function App() {
  return (
    <div className='main'>
      {/* <NavBar /> */}
      <main>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/registerPatient" element={<RegisterPatient />} />
          <Route exact path="/registerDoctor" element={<RegisterDoctor />} />
          <Route exact path="/patientView" element={<PatientView />} />
          <Route exact path="/pharmacistView" element={<PharmacistView />} />
          <Route exact path="/administratorView" element={<AdministratorView />} />
          <Route exact path="/medicineView/:name" element={<MedicineView />} />
          <Route exact path="/medicineList" element={<MedicineList />} />
          <Route exact path="/addAdministrator" element={<AddAdministrator />} />
          <Route exact path="/addMedicine" element={<AddMedicine />} />
          <Route exact path="/editMedicine/:name" element={<EditMedicine />} />
          <Route exact path="/patientInfo/:username" element={<PatientInfo />} />
          <Route exact path="/pharmacistInfo/:username" element={<PharmacistInfo />} />
          <Route exact path="/requestInfo/:username" element={<RequestInfo />} />
          <Route exact path="/doctorView" element={<DoctorView />} />
          <Route exact path="/managePackages" element={<ManagePackages />} />
          <Route exact path="/removeUser" element={<RemoveUser />} />









        </Routes>
      </main>
    </div>
  );
}

export default App;
