import { useState, useEffect } from "react";
import NavBarAdministrator from "../components/NavBarAdministrator";
import { useParams} from 'react-router-dom';
import axios from "axios";
import NavBarDoctor from "../components/NavBarDoctor";
import MainBtn from "../components/Button";
import Contract from '../components/Contract'; 

import { useNavigate } from 'react-router-dom';


function DoctorView(){

    const {username} = useParams();
    const[result, setResult] = useState([]);
    const [email, setEmail] = useState('');
    const [hourlyrate, setHourlyRate] = useState(0);
    const [affiliation, setAffiliation] = useState('');
    const [date, setDate] = useState('');
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(0);
    const [contractInfo, setContractInfo] = useState(null);
    const [showContract, setShowContract] = useState(false);
    const[wallet, setWallet] = useState('');



    let navigate = useNavigate()


    const viewContract = async (DoctorUsername) => {
      try {
        const response = await axios.get(`http://localhost:4000/Doctor/viewContract/${DoctorUsername}`);
        setContractInfo(response.data.contract, () => {
          console.log("Contract info set:", contractInfo);
          setShowContract(true);
        });
      } catch (error) {
        console.error("Failed to fetch contract details:", error);
      }
    };
    
    // const handleViewContract = async () => {
    //   try {
    //     const response = await axios.get(`http://localhost:4000/Doctor/viewContract/${username}`);
    //     setContractInfo(response.data.contract);
    //     setShowContract(true); // This will display the contract component
    //   } catch (error) {
    //     console.error("Failed to fetch contract details:", error);
    //     setShowContract(false); // In case of error, do not show the contract component
    //   }
    // };
    console.log('date format', date)
const handleAddAppointment = (e) => {
  if(date && from){
  const data = {date: date, time:from}
 // try{
    const response = axios.post(`http://localhost:4000/Doctor/addAvailableTimeSlots/${username}`, data)
    .then(res =>alert('added')).catch(err => alert('error'))
  }
      // if (response.status === 200) {
      //       alert(response.data.message);
      //         console.log(response.data.message);
      //     }}
      //     catch(error ){
      //       alert(`Failed to add appointment `);
      //       console.error('Error:', error);
      //     };
         // window.location.reload(true); 
         e.preventDefault();
}

    const handleViewContract = () => {
      navigate(`/doctor/${username}/contract`);
    };

    
  const updateEmail=() => {
    const response = axios.put(`http://localhost:4000/Doctor/updateDoctorByEmail/${username}`, {Email:email})
  .then(res =>setResult(res.data)).catch(err => console.log(err))
  console.log(result)
  }
  const updateHourlyRate=() => {
    const response = axios.put(`http://localhost:4000/Doctor/updateDoctorByHourlyRate/${username}`, {HourlyRate:hourlyrate})
  .then(res =>setResult(res.data)).catch(err => console.log(err))
  console.log(result)
  }
  const updateAffiliation=() => {
    const response = axios.put(`http://localhost:4000/Doctor/updateDoctorByAffiliation/${username}`, {Affiliation:affiliation})
  .then(res =>setResult(res.data)).catch(err => console.log(err))
  console.log(result)
  }
  useEffect(() => {
    if (contractInfo) {
      console.log("Contract info set:", contractInfo);
      setShowContract(true);
    }
  }, [contractInfo]); 

  useEffect(() => {
    const response = axios.get(`http://localhost:4000/Doctor/viewWalletAmountByDoc/${username}`)
    .then(res =>setWallet(res.data)).catch(err => console.log(err))
    console.log('w',wallet)
  }, []); 
  

    return (
        <div>
        <NavBarDoctor username={username}/>
        <div>
            <MainBtn
              txt="View All Patients"
              style="green-btn"
              action={() => navigate(`/patientsList/${username}`)}
              key="navBtn"
            />
          </div>
          <div>
            <MainBtn
              txt="View All Appointments"
              style="green-btn"
              action={() => navigate(`/appointmentsListDoctor/${username}`)}
              key="navBtn"
            />
            </div>
            <div>
            <MainBtn
              txt="View Contract"
              style="green-btn"
              action={handleViewContract}
              key="navBtn"
            />
            </div>
            {showContract && contractInfo && (
              <Contract contract={contractInfo} />
            )}
            
              
  <h3><input  type= 'email'  placeholder= 'Enter New Email'  onChange={(e) => setEmail(e.target.value)} />
  <button onClick={updateEmail}>Update Email</button></h3>
  <h3><input type="number"  placeholder="Enter New Hourly Rate" onChange={(e) => setHourlyRate(e.target.value)}/>
  <button onClick={updateHourlyRate}>Update Hourly Rate</button></h3>
  <h3><input type="text"  placeholder="Enter New Affiliation" onChange={(e) => setAffiliation(e.target.value)}/>
  <button onClick={updateAffiliation}>Update Affiliation</button></h3>
  <form>
    <h3>
      Add Appointment
    </h3>
    <h3>
    <input  type= 'date' required onChange={(e) => setDate(e.target.value)} />
    </h3>
    <h3>
    <input  type= 'number' placeholder="Time" required onChange={(e) => setFrom(e.target.value)} />
    </h3>
    <button onClick={handleAddAppointment}>Add Appointment</button>
  </form>
  {wallet &&
  <div>
  <h1>Wallet Amount: {wallet}</h1>
  </div>
  }
          
      
        </div>
    )
    }
    export default DoctorView;