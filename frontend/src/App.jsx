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
import AddPrescription from './pages/addPrescription';

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
import ContractView from './pages/contractView';

import AddMedicalHistoryDocument from './pages/addMedicalHistoryDocument';
import ViewMedicalHistoryDocuments from './components/MedicalHistoryDocumentsList';
import PayAppointment from './pages/payAppointment';
import PayAppointmentFamily from './pages/payAppointmentFamily';
import HealthPackagesListFam from './components/HealthPackagesListFam';
import HealthPackageInfoFam from './pages/healthPackageInfoFam';
import RescheduleAppointment from './pages/rescheduleAppointment';

function App() {
  return (
    <div className='main'>
      {/* <NavBar /> */}
      <main>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/forgotPassword" element={<ForgotPassword />} />
          <Route exact path="/changePassword/:username" element={<ChangePassword />} />
          <Route exact path="/resetPassword" element={<ResetPassword />} />
          <Route exact path="/registerPatient" element={<RegisterPatient />} />
          <Route exact path="/registerDoctor" element={<RegisterDoctor />} />
          <Route exact path="/patientView/:username" element={<PatientView />} />
          <Route exact path="/administratorView/:username" element={<AdministratorView />} />
          <Route exact path="/addAdministrator/:username" element={<AddAdministrator />} />
          <Route exact path="/addFamilyMember/:username" element={<AddFamilyMember />} />
          <Route exact path="/patientInfo/:usernameDoctor/:usernamePatient" element={<PatientInfo />} />
          <Route exact path="/doctorInfo/:usernameDoctor/:usernamePatient" element={<DoctorInfo />} />
          <Route exact path="/requestInfo/:username" element={<RequestInfo />} />
          <Route exact path="/doctorView/:username" element={<DoctorView />} />
          <Route path="/doctor/:username/contract" element={<ContractView />} />
          <Route exact path="/managePackages/:username" element={<ManagePackages />} />
          <Route exact path="/removeUser/:username" element={<RemoveUser />} />
          <Route exact path="/prescriptionInfo/:id" element={<PrescriptionInfo />} />
          <Route exact path="/addMedicalHistoryDocument/:username" element={<AddMedicalHistoryDocument />} />
          <Route exact path="/viewMedicalHistoryDocuments/:username" element={<ViewMedicalHistoryDocuments />} />
          <Route exact path="/addPrescription/:username/:PatientUsername" element={<AddPrescription />} />


          <Route exact path="/doctorsList" element={<DoctorsList />} />
          <Route exact path="/patientsList/:username" element={<PatientsList />} />
          <Route exact path="/appointmentsList/:username" element={<AppointmentsList />} />
          <Route exact path="/appointmentsListDoctor/:username" element={<AppointmentsListDoctor />} />
          <Route exact path="/prescriptionsList/:username" element={<PrescriptionsList />} />
          <Route exact path="/familyMembersList/:username" element={<FamilyMembersList />} />
          <Route exact path="/healthPackagesList/:username" element={<HealthPackagesList />} />
          <Route exact path="/healthPackagesListFam/:username/:id" element={<HealthPackagesListFam />} />
          <Route exact path="/healthPackageInfo/:username/:type" element={<HealthPackageInfo />} />
          <Route exact path="/healthPackageInfoFam/:username/:type/:id" element={<HealthPackageInfoFam />} />
          <Route exact path="/payAppointment/:usernamePatient/:id/:usernameDoctor" element={<PayAppointment />} />
          <Route exact path="/payAppointmentFamily/:usernamePatient/:id/:usernameDoctor" element={<PayAppointmentFamily />} />
          <Route exact path="/rescheduleAppointment/:usernamePatient/:usernameDoctor/:appID" element={<RescheduleAppointment />} />





        </Routes>
      </main>
    </div>
  );
}

export default App;
