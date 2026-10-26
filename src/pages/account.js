import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from "./navbar";
import Header from "./header";
import axios from "axios";
import { ReactSession } from 'react-client-session';

ReactSession.setStoreType("localStorage");

function Account() {
    const userId = ReactSession.get("upvcuserId");
    const userType = ReactSession.get("upvcuserType");
    const userName = ReactSession.get("upvcuserName");
    const address = ReactSession.get("upvcAddress");
    const number = ReactSession.get("upvcNumber");
    const image = ReactSession.get("upvcImage");
    const location = ReactSession.get("upvclocation");
    const email = ReactSession.get("upvcemail");
    const regid = ReactSession.get("upvcregid");
    const userQuotes = ReactSession.get("upvcuserQuotes");
    const userEngineers = ReactSession.get("upvcuserEngineers");
    const userClients = ReactSession.get("upvcuserClients");
    const userProfiles = ReactSession.get("upvcuserProfiles");


    const navigate = useNavigate();

    const fetchDatalog = async () => {
        try {
          const response = await axios.post(`https://upvcapi.sninfoserv.com/log/`, {userId, "Edit user": formvalue});
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

    const [formvalue, setFormValue] = useState({
        id:userId,
        name: userName,
        location: location,
        phone: number,
        address: address,
        image: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValue(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChangeFile = (e) => {
        const { name, files } = e.target;
        setFormValue(prevState => ({
            ...prevState,
            [name]: files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in formvalue) {
            formData.append(key, formvalue[key]);
        }

        try {
            const response = await axios.post('https://upvcapi.sninfoserv.com/edit-user/', formData);
            if(response.data.status === 'success' ){
                fetchDatalog();
                ReactSession.set("Address",'');
                ReactSession.set("upvcNumber",formvalue.phone);
                ReactSession.set("upvcImage", response.data.image);
                ReactSession.set("upvcuserName",formvalue.name);
                ReactSession.set("upvclocation", formvalue.location);
                ReactSession.set("upvcAddress", formvalue.address);
                navigate("/account");
            }

           
        } catch (error) {
            console.error('Update failed!', error);
        }
    };

    return (
        <div>
            <Navbar />
            <Header />
            <div className="pc-container">
                <div className="pc-content">
                    <div className="row">
                    <div className="col-md-12 col-xxl-4 col-xl-4">
                          <div className="card">
                              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                  <img
                                      src="/assets/images/pari-logo.png"
                                      alt={userName}
                                      className="user-avtar rounded-circle shadow"
                                      style={{ width: '100px', height: '100px', objectFit: 'cover', marginBottom: '15px', border: '3px solid #2563EB' }}
                                  />
                                  <div className="pt-3" style={{ textAlign: 'left' }}>
                                      <ul style={{ listStyleType: 'none', padding: 0 }}>
                                        
                                          <li class="text-center"><h3>{userName}</h3></li>
                                          <li class='mb-4 text-center'><h5>{regid}</h5></li>
                                          <li class='mb-4'><p style={{fontSize: '12px', fontWeight: 'bold'}}><i class="ti ti-mail"></i> {email}</p></li>
                                          <li class='mb-4'><p style={{fontSize: '12px', fontWeight: 'bold'}}><i class="ti ti-phone"></i> {number}</p></li><br />
                                         
                                          <li class='mb-4' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                            <h6 style={{ margin: 0 }}>All Quotes:</h6>
                                            <span style={{ fontSize: '80%', color: 'gray',marginLeft:'10px' }}>{userQuotes}</span>
                                          </li>
                                          <li class='mb-4' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                            <h6 style={{ margin: 0 }}>Engineers:</h6>
                                            <span style={{ fontSize: '80%', color: 'gray' }}>{userEngineers}</span>
                                          </li>
                                          <li class='mb-4' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                            <h6 style={{ margin: 0 }}>Clients:</h6>
                                            <span style={{ fontSize: '80%', color: 'gray' }}>{userClients}</span>
                                          </li>
                                          <li class='mb-4' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                            <h6 style={{ margin: 0 }}>Profiles:</h6>
                                            <span style={{ fontSize: '80%', color: 'gray' }}>{userProfiles}</span>
                                          </li>
                                      </ul>
                                  </div>
                              </div>
                          </div>
                      </div>


                        <div className="col-md-12 col-xxl-8 col-xl-8">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Edit Profile</h5>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label" htmlFor="name">Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="name"
                                                        placeholder="Enter name..."
                                                        name="name"
                                                        required
                                                        value={formvalue.name || ''}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label" htmlFor="location">Location</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="location"
                                                        placeholder="Enter location..."
                                                        name="location"
                                                        required
                                                        value={formvalue.location || ''}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label" htmlFor="image">Image</label>
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        id="image"
                                                        name="image"
                                                        accept="image/*"
                                                        onChange={handleChangeFile}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label" htmlFor="phone">Phone</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="phone"
                                                        placeholder="Enter phone..."
                                                        name="phone"
                                                        required
                                                        value={formvalue.phone || ''}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label className="form-label" htmlFor="address">Address</label>
                                                    <textarea
                                                        className="form-control"
                                                        id="address"
                                                        rows="3"
                                                        name="address"
                                                        value={formvalue.address || ''}
                                                        onChange={handleChange}
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className="col-md-12" align="center">
                                                <button type="submit" className="btn btn-primary mb-4 w-25">Update</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Account;
