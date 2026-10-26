import React, { useEffect, useState } from 'react';
import { ReactSession } from 'react-client-session';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from "./navbar";
import Header from "./header";
import numeral from 'numeral';
import { addEmployee } from '../services/dbService';
import './box.css';
ReactSession.setStoreType("localStorage");


const App = () => {
    
    const userId = ReactSession.get("upvcuserId");
    const userType = ReactSession.get("upvcuserType");
    const navigate = useNavigate();
    const indexPath = '/dashboard';


    useEffect(() => {
      if (userType === '0') {
        navigate(indexPath);
      }
    }, [userType, navigate]);

    const user = { "userId": userId };
    
    const [profileDetails, setProfileData] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [image, setImage] = useState('');
    const [location, setLoc] = useState('');
    const [empid, setempid] = useState('');


    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setImage(file); 
      }
    };


    const fetchDatalog = async () => {
      const formData={
        file: image,
        name: name,
        email:email,
        pass:pass,
        phone:phone,
        address:address,
        location:location,
        empid:empid,
        userId:userId

      }

      try {
        await axios.post(`https://upvcapi.sninfoserv.com/log/`, {userId, "Add Employee": formData});
      } catch (error) {
        // offline fallback
      }
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.post('https://upvcapi.sninfoserv.com/profiles/', user);
          if (response.data) setProfileData(response.data);
        } catch (error) {
        } 
      };
  
      fetchData();
    }, []);


   

    const handleSubmit = async () => {
      try {
        await addEmployee({
          id: empid || `EMP-${Date.now()}`,
          name,
          email,
          phone,
          address,
          location,
          userId
        });
        alert('Employee added successfully!');
        setName('');
        setEmail('');
        setPass('');
        setPhone('');
        setAddress('');
        setImage('');
        setLoc('');
        setempid('');
        navigate('/employees');
      } catch (err) {
        console.warn('Error saving employee:', err);
      }

      try { fetchDatalog(); } catch (e) {}
      try {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('pass', pass);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('location', location);
        formData.append('empid', empid);
        formData.append('userId', userId);
        axios.post('https://upvcapi.sninfoserv.com/employees/add-employees/', formData).catch(() => {});
      } catch (error) {}
    };

    
    return (
        <>
        <Navbar />
        <Header />

        <div class="pc-container">
          <div class="pc-content">

             <div class="row">
                <div class="col-md-12 col-xxl-12 col-xl-12">
                  <div class="card">
                    <div class="card-body">
                      

                       <form class="row align-items-center" onSubmit={handleSubmit}>
                      <div class="col-4 mb-2 mt-3">
                          <p>Employee ID</p>
                          <input type="text" class="form-control" value={empid} onChange={(event) => setempid(event.target.value)} />
                        </div>

                        <div class="col-4 mb-2 mt-3">
                          <p>Name</p>
                          <input type="text" class="form-control" value={name} onChange={(event) => setName(event.target.value)} required/>
                        </div>

                        <div class="col-4 mb-2 mt-3">
                          <p>Phone</p>
                          <input type="text" class="form-control" value={phone} onChange={(event) => setPhone(event.target.value)} required/>
                        </div>

                        <div class="col-3 mb-2 mt-3">
                          <p>Email</p>
                          <input type="email" class="form-control" value={email} onChange={(event) => setEmail(event.target.value)} required/>
                        </div>

                        <div class="col-3 mb-2 mt-3">
                          <p>Password</p>
                          <input type="password" class="form-control" value={pass} onChange={(event) => setPass(event.target.value)} required/>
                        </div>

                        <div class="col-3 mb-2 mt-3">
                          <p>Image</p>
                          <input type="file" class="form-control" onChange={handleFileChange}  />
                        </div>

                        <div class="col-3 mb-2 mt-3">
                          <p>Location</p>
                          <input type="text" class="form-control" value={location} onChange={(event) => setLoc(event.target.value)} />
                        </div>

                        <div class="col-12 mb-2 mt-3">
                          <p>Address</p>
                          <textarea class="form-control" value={address} onChange={(event) => setAddress(event.target.value)} >{address}</textarea>
                        </div>
                       

                        <div class="col-12 mb-2 mt-3" align="center">
                          <button typr="submit" class=" btn btn-success mt-2 w-25">Add Employee</button>
                        </div>
                        </form>

                    
                 
                    </div>
                  </div>
                </div>
            </div>
             
          </div>
        </div>

        </>
    );
};
    
export default App;