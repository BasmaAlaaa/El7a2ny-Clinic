import { useState, useEffect } from "react";
import NavBarAdministrator from "../components/NavBarAdministrator";
import { useParams} from 'react-router-dom';
import axios from "axios";


function RequestInfo(){
    const {username} = useParams();
    const[result, setResult] = useState([]);


    useEffect(() => {
  const response = axios.get(`http://localhost:8000/Admin/InfosOfAPharmacistRequest/${username}`)
  .then(res =>setResult(res.data)).catch(err => console.log(err))
    }, [])

  console.log(result)

//   result.map((e) => {
//     console.log(e)
//   })

return (
    <div>
        <NavBarAdministrator/>
        <h1>Pharmacist Request Info</h1>
        <ul>
            <h3>Name: {result.Name}</h3>
            <h3>UserName: {result.Username}</h3>
            <h3>Email: {result.Email}</h3>
            <h3>Date of Birth: {result.DateOfBirth}</h3>
            <h3>Hourly Rate: {result.HourlyRate}</h3>
            <h3>Affiliation: {result.Affiliation}</h3>
            <h3>Educational Background: {result.EducationalBackground}</h3>
            <h3>Request Status: {result.Status}</h3>

        </ul>
        <button>
            Accept Request
        </button>
        <button>
            Reject Request
        </button>
        </div>
)
}
export default RequestInfo;