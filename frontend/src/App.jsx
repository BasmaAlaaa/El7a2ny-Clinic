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
import AddAdministrator from './pages/addAdministrator';
import PatientInfo from './pages/patientInfo';
import DoctorInfo from './pages/doctorInfo';
import RequestInfo from './pages/requestInfo';
import PrescriptionInfo from './pages/prescriptionInfo';

import DoctorView from './pages/doctorView';
import ManagePackages from './pages/managePackages';
import RemoveUser from './pages/removeUser';

import DoctorsList from './components/DoctorsList';
import AppointmentsList from './components/AppointmentsList';
import PrescriptionsList from './components/PrescriptionsList';
import FamilyMembersList from './components/FamilyMembersList';
import PatientsList from './components/PatientsList';
import AddFamilyMember from './pages/addFamilyMember';
import AppointmentsListDoctor from './components/AppointmentsListDoctor';
import ForgotPassword from './pages/forgot_password';
import ChangePassword from './pages/change_password';
import ResetPassword from './pages/reset_passowrd'
import HealthPackagesList from './components/HealthPackagesList';
import HealthPackageInfo from './pages/healthPackageInfo';




function App() {
  return (
    <div className='main'>
      {/* <NavBar /> */}
      <main>
        <Routes>
        <Route exact path="/login" element={<Login />} />
          <Route exact path="/forgotPassword" element={<ForgotPassword />} />
          <Route exact path="/changePassword" element={<ChangePassword />} />
          <Route exact path="/resetPassword" element={<ResetPassword />} />
          <Route exact path="/registerPatient" element={<RegisterPatient />} />
          <Route exact path="/registerDoctor" element={<RegisterDoctor />} />
          <Route exact path="/patientView/:username" element={<PatientView />} />
          <Route exact path="/administratorView" element={<AdministratorView />} />
          <Route exact path="/addAdministrator" element={<AddAdministrator />} />
          <Route exact path="/addFamilyMember/:username" element={<AddFamilyMember />} />
          <Route exact path="/patientInfo/:usernameDoctor/:usernamePatient" element={<PatientInfo />} />
          <Route exact path="/doctorInfo/:usernameDoctor/:usernamePatient" element={<DoctorInfo />} />
          <Route exact path="/requestInfo/:username" element={<RequestInfo />} />
          <Route exact path="/doctorView/:username" element={<DoctorView />} />
          <Route exact path="/managePackages" element={<ManagePackages />} />
          <Route exact path="/removeUser" element={<RemoveUser />} />
          <Route exact path="/prescriptionInfo/:id" element={<PrescriptionInfo />} />


          <Route exact path="/doctorsList" element={<DoctorsList />} />
          <Route exact path="/patientsList/:username" element={<PatientsList />} />
          <Route exact path="/appointmentsList/:username" element={<AppointmentsList />} />
          <Route exact path="/appointmentsListDoctor/:username" element={<AppointmentsListDoctor />} />
          <Route exact path="/prescriptionsList/:username" element={<PrescriptionsList />} />
          <Route exact path="/familyMembersList/:username" element={<FamilyMembersList />} />
          <Route exact path="/healthPackagesList/:username" element={<HealthPackagesList />} />
          <Route exact path="/healthPackageInfo/:username/:type" element={<HealthPackageInfo />} />













        </Routes>
      </main>
    </div>
  );
}

export default App;
