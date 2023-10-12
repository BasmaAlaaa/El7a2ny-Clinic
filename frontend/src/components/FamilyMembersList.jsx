import Search from './Search.jsx';
import Table from './TableRequests.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import search from '../assets/images/svg/search.svg';
import filter from '../assets/images/svg/filter.svg';
import MedicineView from '../pages/medicineView.jsx';
import NavBar from './NavBar.jsx';
import TableFamilyMembers from './TableFamilyMembers.jsx'
import NavBarPatient from './NavBarPatient.jsx';

function FamilyMembersList() {
  const {username} = useParams();
  const[result, setResult] = useState([]);


  useEffect(() => {
const response = axios.get(`http://localhost:4000/Patient/getFamMembers/${username}`)
.then(res =>setResult(res.data)).catch(err => console.log(err))
  }, [])
console.log(result)
result.map((e) => {
  console.log(e)
})


  let tHead = ['Name', 'Age', 'National ID', 'Gender', 'Relation to Patient'];

  return (
    <div>
      <NavBarPatient username={username}/>
      {/* <Search onChange={(e) => setSearch(e.target.value)}/> */}
      <div className="d-flex justify-content-between flex-row">
      <p className="text-capitalize fs-4 w-25">Family Members</p>
    </div>
      <TableFamilyMembers tHead={tHead} data={result}/>
    </div>
  );
}
export default FamilyMembersList;
