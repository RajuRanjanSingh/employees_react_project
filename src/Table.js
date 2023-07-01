import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './User.css';

function convertByteStringToUint8Array(byteString) {
  const byteNumbers = byteString.split(',').map(Number);
  return new Uint8Array(byteNumbers);
}

function UserTable() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4747/get');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const convertByteStringToFile = (byteString, fileName) => {
    const byteCharacters = convertByteStringToUint8Array(byteString);
    const blob = new Blob([byteCharacters], { type: 'application/octet-stream' });
    return new File([blob], fileName);
  };

  return (
    <div className='table-container'>
      <h1>Leave Table</h1>
      
      <h2>Fetch Your fill Data<button onClick={fetchUsers}>click me</button></h2>
      <br></br>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Leave_Type</th>
            <th>From_Date</th>
            <th>TO_DATE</th>
            <th>Team</th>
            <th>Upload_File</th>
            <th>Reporter</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.leave_type}</td>
              <td>{user.fromdate}</td>
              <td>{user.todate}</td>
              <td>{user.team_name}</td>
              <td>
                {user.file_upload && (
                  <a
                    href={URL.createObjectURL(
                      convertByteStringToFile(user.file_upload, 'file.pdf')
                    )}
                    download="file.pdf"
                  >
                    Download File
                  </a>
                )}
              </td>
              <td>{user.reporter}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
