import React, { useEffect, useState } from 'react';
import { ReactSession } from 'react-client-session';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Paginator } from 'primereact/paginator';
import Navbar from "./navbar";
import Header from "./header";
import './box.css';
ReactSession.setStoreType("localStorage");

 function User() {
    
  const userId = ReactSession.get("upvcuserId");
  const userType = ReactSession.get("upvcuserType");
  const Empid = ReactSession.get("upvcempid");
  const userImage = ReactSession.get("upvcImage");
  const [mainuser, setmainuser] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [searchQuery3, setSearchQuery3] = useState('');
  const [searchQuery4, setSearchQuery4] = useState('');
  const [searchQuery5, setSearchQuery5] = useState('');

  const [first, setFirst] = useState(0); 
  const [rows, setRows] = useState(5);

  const onPageChange = (event) => {
    setFirst(event.first);
  };

  // Event handlers
  const handleSearchInputChangeID = (e) => setSearchQuery(e.target.value);
  const handleSearchInputChangeName = (e) => setSearchQuery2(e.target.value);
  const handleSearchInputChangephone = (e) => setSearchQuery3(e.target.value);
  const handleSearchInputChangeEmail = (e) => setSearchQuery4(e.target.value);
  const handleSearchInputChangeLocation = (e) => setSearchQuery5(e.target.value);


  let users='';
  if (userType === '3') {
    users =  Empid ;
  } else {
    users = userId ;
  }
  const user = { "userId": users };
  

  const navigate = useNavigate();
  const indexPath = '/';
  
  
  useEffect(() => {
    if (userId === 0 ) {
      navigate(indexPath);
    }
  }, [userId, navigate]);
  
  const filteredData = mainuser.filter(item => 
    (searchQuery === '' || item.user_regId.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (searchQuery2 === '' || item.user_name.toLowerCase().includes(searchQuery2.toLowerCase())) &&
    (searchQuery3 === '' || item.user_mobile.toLowerCase().includes(searchQuery3.toLowerCase())) &&
    (searchQuery4 === '' || item.user_email.includes(searchQuery4)) &&
    (searchQuery5 === '' || item.user_location.toLowerCase().includes(searchQuery5.toLowerCase())) 
  );

  
  const MainuserData = async () =>{
    try {
      const response = await axios.get('https://upvcapi.sninfoserv.com/main-users/');
      // console.log(response.data);
      if(response.data.status === 'success'){
        setmainuser(response.data.data);
      }
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  useEffect(()=>{MainuserData(); },[mainuser]);



  
  return (
    <>
    <Navbar />
    
    <div class="pc-container">
      <div class="pc-content">
        
        <div class="row">
          <div class="col-md-12 col-xxl-12 col-xl-12">
            <div class="card">
              <div class="card-body">
              <div className="row" >
                <div className="col-md-6 col-lg-3 mt-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search by user ID..."
               value={searchQuery}
              onChange={handleSearchInputChangeID}
            />
          </div>
          <div className="col-md-6 col-lg-2 mt-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search by user name..."
               value={searchQuery2}
              onChange={handleSearchInputChangeName}
            />
          </div>
          <div className="col-md-6 col-lg-2 mt-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search by user phonenumber..."
               value={searchQuery3}
              onChange={handleSearchInputChangephone}
            />
          </div>
          <div className="col-md-6 col-lg-2 mt-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search by user email..."
               value={searchQuery4}
              onChange={handleSearchInputChangeEmail}
            />
          </div>
          <div className="col-md-6 col-lg-3 mt-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search by user location..."
               value={searchQuery5}
              onChange={handleSearchInputChangeLocation}
            />
          </div>
            </div>
              
              
                <table id="left-right-fix" class="table stripe row-border order-column mt-3">
                  
                  <thead>
                    <tr>
                    
                      <th>Name</th>
                      {/* <th>Reg ID</th> */}
                      <th>Contact</th>
                      <th>Email</th>
                      <th>Location</th>
                      <th>Profiles</th>
                      <th>Date Created</th>
                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody>
                  {filteredData.length > 0 ? (
            <>  {filteredData.slice().reverse().slice(first, first + rows).map(user => (
                  <tr key={user.user_id}>
                  <td><img src={`https://upvcapi.sninfoserv.com/user/images/${user.user_image}`} alt={user.user_name} className="user-avtar wid-45 rounded-circle" style={{ marginBottom: '15px' }} />
                   &nbsp; &nbsp; {user.user_name}</td>
                  {/* <td>{user.user_regId}</td> */}
                  <td>{user.user_mobile}</td>
                  <td>{user.user_email}</td>
                  <td>{user.user_location}</td>
                  <td>{user.user_profiles}</td>
                  <td>{user.user_Date}</td>
                  <td><a href={`userdetail?id=${user.user_id}`} class="btn btn-primary">View</a></td>
                </tr>
                ))} </>
              ) : searchQuery && filteredData.length === 0 ? (
            <tr >
                         <td>No products found </td>
                       </tr>
         ) : (<>
                  {mainuser && mainuser.slice().reverse().slice(first, first + rows).map((user) =>(
                <tr key={user.user_id}>
                  <td><img src={`https://upvcapi.sninfoserv.com/user/images/${user.user_image}`} alt={user.user_name} className="user-avtar wid-45 rounded-circle" style={{ marginBottom: '15px' }} />
                   &nbsp; &nbsp; {user.user_name}</td>
                  <td>{user.user_regId}</td>
                  <td>{user.user_mobile}</td>
                  <td>{user.user_email}</td>
                  <td>{user.user_location}</td>
                  <td>{user.user_profiles}</td>
                  <td>{user.user_Date}</td>
                  <td><a href={`userdetail?id=${user.user_id}`} class="btn btn-primary">View</a></td>
                </tr>
              ))}
              </>
         )}
             
                  </tbody>
                </table>
                <Paginator className="custom-paginator" first={first} rows={rows} totalRecords={mainuser.length}  onPageChange={onPageChange} />
              </div>
            </div>
          </div>
          
        
        </div>
      </div>
    </div>



    </>
  )
}
export default User;