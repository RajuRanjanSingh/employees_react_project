import React, { useState} from 'react';
import axios from 'axios';
import './User.css';
import './Table.js';
import'./App.js';
function LeaveForm() {
    const [name, setName] = useState('');
    const [leaveType, setLeaveType] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [team, setTeam] = useState('');
    const [file, setFile] = useState(null);
    const [reporter, setReporter] = useState('');
    

 
    const handleNameChange = (e) => {
      
        const enteredName = e.target.value.trim();
        const namePattern = /^[A-Za-z\s]+$/; // Regular expression pattern for name validation
      
        if (!enteredName) {
            setName('')
          
        } else if (!namePattern.test(enteredName)) {
          alert('Name should only contain letters and spaces.');
        } else {
        
          setName(e.target.value);
        }
        
        
    };

    const handleLeaveTypeChange = (e) => {
       
        setLeaveType(e.target.value);
    };

   
    const handleFromDateChange = (e) => {
        if (!leaveType) {
            alert('Please select a Leave Type.');
            return;
          }
        const selectedDate = new Date(e.target.value);
        const currentDate = new Date();
       if(leaveType==='casualleave'||leaveType==='earnedleave')
       { 
        if (selectedDate < currentDate) {
          setFromDate('');
        } else {
          setFromDate(e.target.value);
        }
       }
       else{
        setFromDate(e.target.value);
       }
      };

    const handleToDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const currentDate = new Date();
        if (!leaveType) {
            alert('Please select a Leave Type.');
            return;
          }
       if(leaveType==='casualleave'||leaveType==='earnedleave')
       { 
        if (selectedDate < currentDate){
        
          setToDate('');

        } else {
          setToDate(e.target.value);
        }
       }
       else{
        setToDate(e.target.value);
       }
    };

    const handleTeamChange = (e) => {
       
        setTeam(e.target.value);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            alert('file successfully summited');
    
          }
    };

    const handleReporterChange = (e) => {
        if (!team) {
            alert('Please select a Team Name');
            return;
          }
        setReporter(e.target.value);
    };

    const handleSubmit =async(e) => {
        e.preventDefault();
       
        if (leaveType === 'Sick Leave' && (!file || file.size > 15 * 1024 * 1024 || !file.type.includes('pdf') )) {
            console.log('Please upload a valid PDF file (max size: 15MB)');
            return;
        }
         if (toDate<fromDate){
          setToDate('');
          setFromDate('');
          alert('Please select a date correctly');
            return;
        }
      
    

        console.log('Name:', name);
        console.log('Leave Type:', leaveType);
        console.log('From Date:', fromDate);
        console.log('To Date:', toDate);
        console.log('Team:', team);
        console.log('File:', file);
        console.log('Reporter:', reporter);
       
        const formData = new FormData();
        formData.append('name', name);
        formData.append('leave_type', leaveType);
        formData.append('fromdate', fromDate);
        formData.append('todate', toDate);
        formData.append('team_name', team);
        formData.append('file_upload', file);
        formData.append('reporter', reporter);
        

       
        let fileData = null;
        if (file) {
          // Read the file content
          const reader = new FileReader();
          fileData = await new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result);
            reader.readAsArrayBuffer(file);
          });
        }
        const byteCharacters = new Uint8Array(fileData);
        const byteNumbers = Array.from(byteCharacters);
        const byteString = byteNumbers.join(',');
        
        const requestData = {
            name,
            leave_type: leaveType,
            fromdate: fromDate,
            todate: toDate,
            team_name: team,
            file_upload: byteString,
            reporter,
          };
    
        

        try {
          // POST api 
         const response = await axios.post('http://localhost:4747/post', requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Form submitted successfully:', response.data.message);
          // Reset the fill value
          setName('');
          setLeaveType('');
          setFromDate('');
          setToDate('');
          setTeam('');
          setFile(null);
          setReporter('');
      
        } catch (error) {
          console.error('Error submitting form:', error);
        }




      };
    

    return (
        <form onSubmit={handleSubmit} className="leave-form"> 

           <h2 id="header">Leave Form</h2>
            <div>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" value={name} onChange={handleNameChange}  required />
            </div>
            <div>
              <br></br>
                <label>Leave_Type:</label>
                <div>
                    <label htmlFor="casualLeave">
                    <input type="radio" id="casualLeave" value="casualleave" checked={leaveType === 'casualleave'} onChange={handleLeaveTypeChange} /> casualleave </label>
                </div>
                <div>
                    <label htmlFor="earnedLeave">
                    <input type="radio" id="earnedLeave" value="earnedleave" checked={leaveType === 'earnedleave'} onChange={handleLeaveTypeChange} />earnedleave</label>
                </div>
                <div>
                    <label htmlFor="sickLeave">
                    <input type="radio" id="sickLeave" value="sickleave" checked={leaveType === 'sickleave'} onChange={handleLeaveTypeChange} />sickleave</label>
                </div>
            </div><br></br>
                <div>
                    <label htmlFor="fromDate">From:</label>
                    <input type="date" id="fromDate" value={fromDate} onChange={handleFromDateChange} required />
    
            
                    <label htmlFor="toDate">To:</label>
                    <input type="date" id="toDate" value={toDate} onChange={handleToDateChange} required />
            </div><br></br>
            <div>
                    <label>Team_Name:</label>
                <div>
                    <label htmlFor="team_name1">
                    <input type="radio" id="team_name1" value="Designops" checked={team === 'Designops'} onChange={handleTeamChange}required/>Designops
                    </label>
                </div>
                <div>
                    <label htmlFor="team_name2">
                        <input type="radio" id="team_name2" value="Secops" checked={team === 'Secops'} onChange={handleTeamChange} required/>Secops
                    </label>
                </div>
                <div>
                    <label htmlFor="team_name3">
                    <input type="radio" id="team_name3" value="cloudops" checked={team === 'cloudops'}onChange={handleTeamChange} required/> cloudops
                    </label>
                </div>
            </div>
            {leaveType === 'sickleave' && (
                <div><br></br>
                    <label htmlFor="file">File (PDF, max size: 15MB):</label>
                    <input type="file" id="file" accept=".pdf" onChange={handleFileChange} required />
                </div>
            )}<br></br>
            <div>
                <label htmlFor="reporter">Reporter:</label>
                <select id="reporter" value={reporter} onChange={handleReporterChange} required>
                    <option value="">Select Manager</option>
                    <option value="Sandeep sir">Sandeep sir</option>
                    <option value="Suraj sir">Suraj sir</option>
                    <option value="Sahil sir">Sahil sir</option>
                </select>
            </div><br></br>
            <button type="submit">Submit</button>
        </form>
    );
}

export default LeaveForm;
