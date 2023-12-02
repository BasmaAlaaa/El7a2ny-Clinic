import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import NavBarAdministrator from '../components/NavBarAdministrator';

function ManagePackages(){
    const [type, setType] = useState('')
    const [typeUpdate, setTypeUpdate] = useState('')
    const [typeDelete, setTypeDelete] = useState('')
    const [annualFee, setAnnualFee] = useState(0)
    const [doctorSessionDiscount, setDoctorSessionDiscount] = useState(0)
    const [medicineDiscount, setMedicineDiscount] = useState(0)
    const [familySubscriptionDiscount, setFamilySubscriptionDiscount] = useState(0)
    const {username} = useParams();


    const handleSubmit = () => {

        const data = {Type:type, AnnualFee:annualFee, DoctorSessionDiscount:doctorSessionDiscount, MedicineDiscount:medicineDiscount, FamilySubscriptionDiscount:familySubscriptionDiscount}
        console.log(data)
        const response = axios.post(`http://localhost:4000/HealthPackage/create/${username}`, data,{
          headers: { authorization: "Bearer " + sessionStorage.getItem("token")},
        })
    .then(res =>console.log(res.data)).catch(err => console.log(err.request))
      }

      const handleDelete = () => {

        const response = axios.delete(`http://localhost:4000/HealthPackage/delete/${username}/${typeDelete}`,{
          headers: { authorization: "Bearer " + sessionStorage.getItem("token")},
        })
    .then(res =>console.log(res.data)).catch(err => console.log(err))
      }
    //   const handleUpdate = (e) => {
    //     e.preventDefault();
    //     const data = {type, annualFee, doctorSessionDiscount, medicineDiscount, familySubscriptionDiscount}
    //     console.log(data)
    //     const response = axios.put(`http://localhost:4000//HealthPackage/update/${typeUpdate}`, data)
    // .then(res =>console.log(res.data)).catch(err => console.log(err))
    //   }
    const handleUpdate = () => {
      
      if(annualFee){
      const response = axios.put(`http://localhost:4000/HealthPackage/updateAnnualFee/${username}/${typeUpdate}`,
      {AnnualFee:annualFee}, {
        headers: { authorization: "Bearer " + sessionStorage.getItem("token")},
      })
      .then(res =>console.log(res.data)).catch(err => console.log(err))
      console.log(annualFee)
      }
      if(doctorSessionDiscount){
        const response = axios.put(`http://localhost:4000/HealthPackage/updateDoctorSessionDiscount/${username}/${typeUpdate}`, 
        {DoctorSessionDiscount:doctorSessionDiscount}, {
          headers: { authorization: "Bearer " + sessionStorage.getItem("token")},
        })
        .then(res =>console.log(res.data)).catch(err => console.log(err))
        }
      if(medicineDiscount){
        const response = axios.put(`http://localhost:4000/HealthPackage/updateMedicineDiscount/${username}/${typeUpdate}`,
        {MedicineDiscount:medicineDiscount}, {
          headers: { authorization: "Bearer " + sessionStorage.getItem("token")},
        })
        .then(res =>console.log(res.data)).catch(err => console.log(err))
        }
      if(familySubscriptionDiscount){
        const response = axios.put(`http://localhost:4000/HealthPackage/updateFamilySubscriptionDiscount/${username}/${typeUpdate}`, 
        {FamilySubscriptionDiscount:familySubscriptionDiscount}, {
          headers: { authorization: "Bearer " + sessionStorage.getItem("token")},
        })
        .then(res =>console.log(res.data)).catch(err => console.log(err))
        }
    }
    
    
return(
    <div>
      <NavBarAdministrator username={username} />
        <form onSubmit={handleSubmit}>
        <h3>
        <label>Type</label>
        <input required placeholder= 'enter package type' type= 'text' onChange={(e) => setType(e.target.value)} />
        </h3>
  <h3>
    <label>Annual Fee</label>
  <input type="number" required placeholder="Enter Annual Fee" onChange={(e) => setAnnualFee(e.target.value)}/>
  </h3>
  <h3>
  <label>Doctor Session Discount</label>
  <input type="number" required placeholder="Enter Doctor Session Discount" onChange={(e) => setDoctorSessionDiscount(e.target.value)}/>
  </h3>
  <h3>
  <label>Medicine Discount</label>
  <input type="number" required placeholder="Enter Medicine Discount" onChange={(e) => setMedicineDiscount(e.target.value)}/>
  </h3>
  <h3>
  <label>Family Subscription Discount</label>
  <input type="number" required placeholder="Enter Family Subscription Discount" onChange={(e) => setFamilySubscriptionDiscount(e.target.value)}/>
  </h3>
  <h3>
  <button type="submit">Add Package</button>
  </h3>
</form>
<form onSubmit={handleDelete}>
        <h3>
        <label>Type</label>
        <input required placeholder= 'enter package type' type= 'text' onChange={(e) => setTypeDelete(e.target.value)} />
        </h3>
        <h3>
  <button type="submit">Delete Package</button>
  </h3>
</form>
<form onSubmit={handleUpdate}>
        <h3>
        <label>Type</label>
        <input required placeholder= 'enter package type' type= 'text' onChange={(e) => setTypeUpdate(e.target.value)} />
        </h3>
  <h3>
    <label>Annual Fee</label>
  <input type="number"  placeholder="Enter Annual Fee" onChange={(e) => setAnnualFee(e.target.value)}/>
  </h3>
  <h3>
  <label>Doctor Session Discount</label>
  <input type="number"  placeholder="Enter Doctor Session Discount" onChange={(e) => setDoctorSessionDiscount(e.target.value)}/>
  </h3>
  <h3>
  <label>Medicine Discount</label>
  <input type="number"  placeholder="Enter Medicine Discount" onChange={(e) => setMedicineDiscount(e.target.value)}/>
  </h3>
  <h3>
  <label>Family Subscription Discount</label>
  <input type="number"  placeholder="Enter Family Subscription Discount" onChange={(e) => setFamilySubscriptionDiscount(e.target.value)}/>
  </h3>
  <h3>
  <button type="submit">Update Package</button>
  </h3>
</form>
    </div>
);
};
export default ManagePackages;