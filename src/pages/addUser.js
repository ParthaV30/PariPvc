import React, { useEffect, useState } from 'react';
import { ReactSession } from 'react-client-session';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from "./navbar";
import Header from "./header";
import numeral from 'numeral';
import './box.css';
ReactSession.setStoreType("localStorage");


const App = () => {
    
    const userId = ReactSession.get("upvcuserId");
    const userType = ReactSession.get("upvcuserType");
    const navigate = useNavigate();
    const indexPath = '/dashboard';

    useEffect(() => {
      if (userType !== '1' ) {
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
    const [profiles, setProfiles] = useState([]);
    const [regid, setregid] = useState([]);

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
        regid:regid,
        profiles: {} // Initialize as an empty object
      };
      
      // Populate the profiles object with indexed keys
      profiles.forEach((profile, index) => {
        formData.profiles[`profile_${index}`] = profile; // Use a custom key
      });

      
      
      try {
        const response = await axios.post(`https://upvcapi.sninfoserv.com/log/`, {userId, formData});
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.post('https://upvcapi.sninfoserv.com/profiles/', user);
          setProfileData(response.data);
        } catch (error) {
        } 
      };
  
      fetchData();
    }, [profileDetails]);


    const handleProfileChange = (event) => {
      const newValue = event.target.value;
      setProfiles((prevValues) => {
          if (prevValues.includes(newValue)) {
              return prevValues.filter(value => value !== newValue);
          } else {
              const updatedValues = [...prevValues, newValue];
              return updatedValues;
          }
      });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        fetchDatalog();

        const formData = new FormData();
        formData.append('file', image);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('pass', pass);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('location', location);
        formData.append('regid', regid);
        profiles.forEach((profile, index) => {
          formData.append(`profiles[${index}]`, profile);
        });
        try {
            const response = await axios.post('https://upvcapi.sninfoserv.com/add-user/', formData);
            if(response.data.status === 'success'){
              alert('User added successfully!');
              setName('');
              setEmail('');
              setPass('');
              setPhone('');
              setAddress('');
              setImage('');
              setLoc('');
              setProfiles([]);
            }else{
              alert('Unable to process your request. Please try again!');
            }
        } catch (error) {
            console.error('Error:', error);
        }
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
                      <div class="row align-items-center ">


                      <div class="col-4 mb-2 mt-3">
                          <p>Register ID</p>
                          <input type="text" class="form-control" value={regid} onChange={(event) => setregid(event.target.value)} />
                        </div>

                        <div class="col-4 mb-2 mt-3">
                          <p>Name</p>
                          <input type="text" class="form-control" value={name} onChange={(event) => setName(event.target.value)} />
                        </div>

                        <div class="col-4 mb-2 mt-3">
                          <p>Phone</p>
                          <input type="text" class="form-control" value={phone} onChange={(event) => setPhone(event.target.value)} />
                        </div>

                        <div class="col-3 mb-2 mt-3">
                          <p>Email</p>
                          <input type="email" class="form-control" value={email} onChange={(event) => setEmail(event.target.value)} />
                        </div>

                        <div class="col-3 mb-2 mt-3">
                          <p>Password</p>
                          <input type="password" class="form-control" value={pass} onChange={(event) => setPass(event.target.value)} />
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
                        <div class="col-12 mb-2 mt-3">
                        <p>Select Profiles</p>
                          <div class="row">
                        {profileDetails && profileDetails.data && profileDetails.data.map((profile) => (
                         <div class="col-2 mb-2">
                           <button className={profiles.includes(profile.profileId) ? "btn btn-primary w-100" : "btn btn-secondary w-100"} value={profile.profileId} onClick={(e) => handleProfileChange(e)}>{profile.profileName}</button>
                          </div>
                        ))}
                        </div>
                        </div>

                        <div class="col-12 mb-2 mt-3" align="center">
                          <button onClick={handleSubmit} class=" btn btn-success mt-2 w-25">Add User</button>
                        </div>

                      </div>
                 
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