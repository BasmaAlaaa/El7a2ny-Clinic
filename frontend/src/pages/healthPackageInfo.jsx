import { useState, useEffect } from "react";
import NavBarAdministrator from "../components/NavBarAdministrator";
import { useParams} from 'react-router-dom';
import axios from "axios";
import NavBarPatient from "../components/NavBarPatient";


function HealthPackageInfo(){
    const {username, type} = useParams();
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
        <NavBarPatient username={username}/>
        <h1>Package Info</h1>
        <ul>
            <h3>Type: {result.Name}</h3>
            <h3>Annual Fee: {result.Username}</h3>
            <h3>Doctor Session Discount: {result.Email}</h3>
            <h3>Medicine Discount: {result.DateOfBirth}</h3>
            <h3>Family Subscription Discount: {result.HourlyRate}</h3>

        </ul>
       
        </div>
)
}
export default HealthPackageInfo;