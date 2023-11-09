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
    const [cardNumber, setCardNumber] = useState('');
    const [cardDate, setCardDate] = useState('');
    const [cardCVV, setCardCVV] = useState('');
    const [typePay, setTypePay] = useState('');


    useEffect(() => {
  const response = axios.get(`http://localhost:4000/Patient/viewHealthCarePackageStatus/${username}/${type}`)
  .then(res =>setResult(res.data)).catch(err => console.log(err))
    }, [])

  console.log(result)

  const handleSubscribe = () =>{
    const response = axios.post(`http://localhost:4000/Patient/subscribeToAHealthPackage/${username}/${type}`)
  .then(res =>alert('subscribed')).catch(err => alert(err.message))
  window.location.reload(true);

  }
  const handleCancel = () =>{
    const response = axios.post(`http://localhost:4000/Patient/cancelHealthCarePackageSubscription/${username}/${type}`)
  .then(res =>alert('Cancelled')).catch(err => alert(err))
  window.location.reload(true);
  }
 


  const handleAdd = (e) => {
    if(cardCVV && cardDate && cardNumber){
    alert('Card added successfully')
    }
    else{
      alert('Missing fields')
    }
    e.preventDefault();
  }

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
            <h3>Status: {result.Status}</h3>


        </ul>
        
        <div>
        <h4>Choose Payment Method</h4>
        <div>
            <input
            type='radio' name='payment' checked={typePay==='wallet'} value={'wallet'} onChange={(e) => {setTypePay(e.target.value)}}/>
            Pay with wallet
        </div>
        <div>
            <input
            type='radio' name='payment' checked={typePay==='card'} value={'card'} onChange={(e) => {setTypePay(e.target.value)}}/>
            Pay by card
        </div>
        </div>
        
        {typePay==='card' &&
        <div>
        <Input
            title='Card Number'
            placeholder='Enter card number'
            type='text'
            required={true}

           onChange={(e) => setCardNumber(e.target.value)}
          />
          <Input
            title='Expiry Date'
            type='date'
            required={true}

           onChange={(e) => setCardDate(e.target.value)}
          />
          <Input
            title='CVV'
            placeholder='Enter CVV'
            type='text'
            required={true}
           onChange={(e) => setCardCVV(e.target.value)}
          />

          <div className="mt-3">
            <MainBtn
              txt='Add Card'
              style='green-btn'
              action={handleAdd}
              
            />
            </div>

            </div>
}       
        
        <div>
          {result.Status !='Subscribed' && (typePay==='wallet' || (typePay==='card' && cardCVV && cardDate && cardNumber)) &&
            <MainBtn
              txt="Subscribe"
              style="green-btn"
              action={handleSubscribe}
              key="navBtn"
            />
          }
          {result.Status === 'Subscribed' &&
             <MainBtn
              txt="Cancel Subscription"
              style="white-btn"
              action={handleCancel}
              key="navBtn"
            />
          }
          </div>
        </div>
)
}
export default HealthPackageInfo;