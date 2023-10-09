import { useState, useEffect } from "react";
import NavBarAdministrator from "../components/NavBarAdministrator";
import { useParams} from 'react-router-dom';
import axios from "axios";

function PharmacistInfo(){
    const {username} = useParams();
    const[result, setResult] = useState([]);


    useEffect(() => {
  const response = axios.get(`http://localhost:8000/Admin/PharmacistInfo/${username}`)
  .then(res =>setResult(res.data)).catch(err => console.log(err))
    }, [])

  console.log(result)

return (
    <div>
        <NavBarAdministrator/>
        <h1>Pharmacist Info</h1>
        <ul>
        <h3>Name: {result.Name}</h3>
            <h3>UserName: {result.Username}</h3>
            <h3>Email: {result.Email}</h3>
            <h3>Date of Birth: {result.DateOfBirth}</h3>
            <h3>Hourly Rate: {result.HourlyRate}</h3>
            <h3>Affiliation: {result.Affiliation}</h3>
            <h3>Educational Background: {result.EducationalBackground}</h3>

        </ul>
        <button>
            Remove Pharmacist
        </button>
        </div>
)
}
export default PharmacistInfo;