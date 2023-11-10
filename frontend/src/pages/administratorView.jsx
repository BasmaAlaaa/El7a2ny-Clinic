
import TableRequests from '../components/TableRequests.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import NavBarAdministrator from '../components/NavBarAdministrator.jsx';
import MainBtn from '../components/Button.jsx';

function AdministratorView() {
  const[searchText, setSearchText] = useState('');
  const[filterText, setFilterText] = useState('');
  const {username} = useParams();



  const[resultRequest, setResultRequest] = useState([]);

  const acceptOrRejectDoctorRequest = async (Username, action) => {
    try {
      
      const response = await axios.post(`http://localhost:4000/Admin/acceptOrRejectDoctorRequest/${Username}`, { action });
      if (response.status === 200) {
        console.log(response.data.message);
        setResultRequest(prevRequests => prevRequests.filter(doctor => doctor.Username !== Username));
        alert(`Doctor ${action === 'accept' ? 'accepted' : 'rejected'} successfully`);

      }
    } catch (error) {
      console.error('Error object:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response);
      }
      console.error(error.response?.data?.error || error.message);
      alert(`Failed to ${action === 'accept' ? 'accept' : 'reject'} doctor`);
      
    }
  };

  useEffect(() => {
    const response = axios.get('http://localhost:4000/Admin/viewUnapprovedDoctors')
    .then(res =>setResultRequest(res.data.doctors)).catch(err => console.log(err))
      }, [])
    console.log(resultRequest)
    console.log(resultRequest[0])
    resultRequest.map((e) => {
      console.log(e)
    })

const onFilterValueChanged=(event)=>{
  setFilterText(event.target.value);
}
console.log(filterText)
let navigate = useNavigate()

  let tHeadRequests = ['Name', 'Username', 'Email', 'Affiliation', 'Hourly Rate', 'EducationalBackground', 'Accept', 'Reject'];
  let dataRequests = [{
    name: 'Ahmed',
    affiliation: 'Y Hospital',
    hourlyRate: 1000,
    educationalBackground: 'pharmacy',
    username: 'ahmed123'

  }
];

  return (
    <div>
        <NavBarAdministrator/>
        <div>
            <MainBtn
              txt="Add Administrator"
              style="green-btn"
              action={() => navigate(`/addAdministrator/${username}`)}
              key="navBtn"
            />
          </div>
          <div>
            <MainBtn
              txt="Manage Health Packages"
              style="green-btn"
              action={() => navigate(`/managePackages/${username}`)}
              key="navBtn"
            />
          </div>
          <div>
            <MainBtn
              txt="Remove User"
              style="green-btn"
              action={() => navigate(`/removeUser/${username}`)}
              key="navBtn"
            />
            
          </div>

    <div className="d-flex justify-content-between flex-row">
      <p className="text-capitalize fs-4 w-25">Doctors Requests</p>
      <div className="d-flex flex-row w-75 justify-content-end">
        <div className="input-group w-50"></div> 
      </div>
    </div>
     <TableRequests
     tHead={tHeadRequests}
     data={resultRequest}
     filterText={filterText}
     searchText={searchText}
     onAcceptOrReject={acceptOrRejectDoctorRequest} />
    </div>
  );
}
export default AdministratorView;
