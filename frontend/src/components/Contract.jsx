import React from 'react';


const Contract = ({ contract ,onAccept}) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };
  const handleAccept = () => {
      onAccept();
    
  };

  return (
    <div className="case-table card mt-4">
      <h3>Contract Information</h3>
      <p>Doctor Username: {contract.DoctorUsername}</p>
      <p>MarkUp: {contract.MarkUp}</p>
      <p>Start Date: {formatDate(contract.StartDate)}</p>
      <p>End Date: {formatDate(contract.EndDate)}</p>
      <p>Doctor Specialty: {contract.DoctorSpecialty}</p>
      <p>Salary: {contract.Salary}</p>
      <p>Compensation: {contract.compensation}</p>
      <p>Working Hours: {contract.workingHours}</p>
      <p>Working Days: {contract.workingDays}</p>
      <p>Type: {contract.Type}</p>
      <p>Status: {contract.Status}</p>
      <button 
      className={`green-txt mx-2 text-decoration-underline text-capitalize border-0 bg-transparent`}
      type="button" onClick={handleAccept}>Accept Contract</button>
    </div>
  );
};

export default Contract;
