import Search from './Search.jsx';
import Table from './TableRequests.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import search from '../assets/images/svg/search.svg';
import filter from '../assets/images/svg/filter.svg';
import MedicineView from '../pages/medicineView.jsx';
import NavBar from './NavBar.jsx';
import TableAppointments from './TableAppointments.jsx';
import NavBarPatient from './NavBarPatient.jsx';


function AppointmentsList() {
  const[filterText, setFilterText] = useState('');
  const[result, setResult] = useState([]);
  const {username} = useParams();
  const[searchDate, setSearchDate] = useState('');


  useEffect(() => {
const response = axios.get(`http://localhost:4000/Patient/allAppointments/${username}`)
.then(res =>setResult(res.data.filteredAppointments)).catch(err => console.log(err))
  }, [])
console.log(result)
result.map((e) => {
  console.log(e)
})

const onFilterValueChanged=(event)=>{
  setFilterText(event.target.value);
}
console.log("filter",filterText)
let navigate = useNavigate()

  let tHead = ['Date', 'Doctor Username', 'Status'];

  return (
    <div>
      <NavBarPatient username={username}/>
      {/* <Search onChange={(e) => setSearch(e.target.value)}/> */}
      <div className="d-flex justify-content-between flex-row">
      <p className="text-capitalize fs-4 w-25">Appointments</p>
      <div className="d-flex flex-row w-75 justify-content-end">
        <div className="input-group w-50">
        
        <input
            type="date"
            className="form-control border-start-0 search ps-0"
            placeholder="Filter by date"
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </div>

        
        {/* <button className="filter-btn ms-2 d-flex flex-row align-items-center">
          <img src={filter} className="me-2" alt="filter" />
          Filter
        </button> */}
        <select name='medicalUse' onChange={onFilterValueChanged}>
        <option value='all'>All</option>
        <option value='upcoming'>Upcoming</option>
        <option value='finished'>Finished</option>
        </select>
      </div>
    </div>
      <TableAppointments tHead={tHead} data={result} searchDate={searchDate} filterText={filterText}/>
    </div>
  );
}
export default AppointmentsList;
