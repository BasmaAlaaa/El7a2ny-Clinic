import { useState, useEffect } from "react";
import NavBarAdministrator from "../components/NavBarAdministrator";
import { useNavigate, useParams} from 'react-router-dom';
import axios from "axios";
import NavBarPatient from "../components/NavBarPatient";
import MainBtn from "../components/Button";
import Input from "../components/Input";



function HealthPackageInfo(){
    const {username, type} = useParams();
    const[result, setResult] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
  const response = axios.get(`http://localhost:4000/HealthPackage/view/${type}`)
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
            <h3>Type: {result.Type}</h3>
            <h3>Annual Fee: {result.AnnualFee}</h3>
            <h3>Doctor Session Discount: {result.DoctorSessionDiscount}</h3>
            <h3>Medicine Discount: {result.MedicineDiscount}</h3>
            <h3>Family Subscription Discount: {result.FamilySubscriptionDiscount}</h3>
            {/* <h3>Status: {result.HourlyRate}</h3> */}


        </ul>
        
        <h4>Choose Payment Method</h4>
        <div>
            <input
            type='radio'  value={'wallet'} />
            Pay with wallet
        </div>
        <div>
            <input
            type='radio'  value={'cash'} />
            Cash on delivery
        </div>
        <div>
            <input
            type='radio'  value={'card'} />
            Pay by card
        </div>
        
        <Input
            title='Card Number'
            placeholder='Enter card number'
            type='text'
           // onChange={(e) => setAddress(e.target.value)}
          />
          <Input
            title='Expiry Date'
            type='date'
           // onChange={(e) => setAddress(e.target.value)}
          />
          <Input
            title='CVV'
            placeholder='Enter CVV'
            type='text'
           // onChange={(e) => setAddress(e.target.value)}
          />

          <div className="mt-3">
            <MainBtn
              txt='Add Card'
              style='green-btn'
              //action={handleSubmit(c)}
              
            />
            </div>
        
        
        <div>
            <MainBtn
              txt="Subscribe"
              style="green-btn"
              action={() => navigate(`/healthPackagesList/${username}`)}
              key="navBtn"
            />
             <MainBtn
              txt="Cancel Subscription"
              style="white-btn"
              action={() => navigate(`/healthPackagesList/${username}`)}
              key="navBtn"
            />
          </div>
        </div>
)
}
export default HealthPackageInfo;