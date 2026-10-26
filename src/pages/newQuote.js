import React, { useEffect, useState } from 'react';
import { ReactSession } from 'react-client-session';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import Navbar from "./navbar";
import Header from "./header";
import './box.css';
ReactSession.setStoreType("localStorage");


const App = () => {

  const userId = ReactSession.get("upvcuserId");
  const userType = ReactSession.get("upvcuserType");
  const navigate = useNavigate();
  const indexPath = '/';
  const selectpath ='/select';
  const [values, setValues] = useState({ name: '', phone:'', location: "", sitelocation: "", engineer: '', require: '',}); 
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newEngineerData, setNewEngineerData] = useState({ name: '', phone: '', email: '', location: '',});
  const [engDetails, setengData] = useState(true);

  const [clients, setClients] = useState([]);
  const Empid = ReactSession.get("upvcempid");
  let users='';
  if (userType === '3') {
    users =  Empid ;
  } else {
    users = userId ;
  }
  const user = { "userId": users };
//  console.log(users);
//  console.log(userType);

  useEffect(() => {
    if (userId == 0 ) {
      navigate(indexPath);
    }
  }, [userId, navigate]);

  function generateUniqueId() {
    const now = new Date();
    const year = now.getFullYear().toString().padStart(4, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');
    const id = `${userId}-${year}${month}${day}-${hour}${minute}${second}`;
    return id;
  }

  const fetchDatalog = async () => {
    const uniqueId = generateUniqueId();
    try {
      const response = await axios.post(`https://upvcapi.sninfoserv.com/log/`,{ 
        userId, userIds: users, uniqueId, values, newEngineerData
       });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const clietData = async () =>{
    try {
      const response = await axios.post('https://upvcapi.sninfoserv.com/clients/', {user: users} );
      //console.log(response.data);
      if(response.data.status === 'success'){
        setClients(response.data.data);
      }
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  useEffect(()=>{clietData(); },[clients]);

  const handleSubmit = async (e) => {
    fetchDatalog();
    const uniqueId = generateUniqueId();
    ReactSession.set("upvcquoteId",uniqueId);
    e.preventDefault();
    try {
      const response = await axios.post('https://upvcapi.sninfoserv.com/new-quotes/',{ 
       userId: users, uniqueId, values
      });
     // console.log('Response:', response.data);
      if(response.data.status === 'success'){
        navigate(selectpath);
      }
    } catch (error) {
      console.error('Error sending data:', error);
      // Handle error as needed, such as showing an error message to the user
    }
  };
  

  const handleEngChange = (e) => {
    const { name, value } = e.target;
    setNewEngineerData((prevData) => ({ ...prevData, [name]: value }));
  };
  

  const handleAddEngineer = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://upvcapi.sninfoserv.com/new-engineer/', { 
        userId: users, newEngineerData
      });
     // console.log('Response:', response.data);
      if(response.data.status === 'success'){
        setModalIsOpen(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error sending data:', error);
      // Handle error as needed, such as showing an error message to the user
    }
   // console.log('Adding new engineer:', newEngineerData);
    setModalIsOpen(false); // Close the modal after adding engineer
  };
  
  
  const fetchData = async () => {
    try {
      const response = await axios.post('https://upvcapi.sninfoserv.com/engineers/', user);
      setengData(response.data);
      //console.log(response.data);
    } catch (error) {
    } 
};

useEffect(() => {
  fetchData();
}, [engDetails]);
  
const handleChange = (event) => {
  const { name, value } = event.target;

  if (name === 'name') {
    const selectedClient = clients.find((client) => client.clientName === value);
    if (selectedClient) {
      setValues({
        name: selectedClient.clientName,
        location: selectedClient.clientLocation,
        phone: selectedClient.clientPhone,
      });
    } else {
     
      setValues((prevValues) => ({
        ...prevValues,
        name: value,
      }));
    }
  } else {
    
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }
};



    return (
    <div>
    <Navbar />

    
    <div class="pc-container">
      <div class="pc-content">
        
        <div class="row">
          <div class="col-md-12 col-xxl-12 col-xl-12">
          <div class="card">
            <div class="card-header">
              <h5>Create New Quatation</h5>
            </div>
            <div class="card-body">
              <form onSubmit={handleSubmit}>
              <div class="row">

                <div class="col-md-4 col-xl-4 col-xxl-4 col-12 mt-2">
                      <label class="form-label" for="exampleInputEmail1">Client Name</label>
                      <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                        placeholder="Enter name..." list="clients" name="name" value={values.name} onChange={handleChange} required />
                        <datalist id="clients">
                          {clients && clients.map((client) =>(
	                          <option
                              key={client.clientId}
                              value={client.clientName}
                            >
                              {client.clientName}-{client.clientLocation}-{client.clientPhone}
                            </option>
                          ))}
                        </datalist>
                </div>
                <div class="col-md-3 col-xl-3 col-xxl-3 col-12 mt-2">
                      <label class="form-label">Phone</label>
                      <input type="text" class="form-control" placeholder="Enter phone..." name="phone" value={values.phone} onChange={handleChange} required />
                </div>

                <div class="col-md-3 col-xl-3 col-xxl-3 col-12 mt-2">    
                      <label class="form-label" for="exampleFormControlSelect1">Select Engineers</label>
                      <select class="form-select" id="exampleFormControlSelect1" name="engineer" value={values.engineer} onChange={handleChange} required >
                      <option value="" disabled hidden>Select an Engineer</option>
                      <option class="btn btn-success text-center" value="" onClick={() => setModalIsOpen(true)}>Add Engineer</option>
                         {engDetails && engDetails.data ? 
                           ( engDetails.data.slice().reverse().map(engineer => (<>
                             <option key={engineer.engineerId} value={engineer.engineerId}>
                               {engineer.engineerName}
                             </option>
                            </>
                           ))
                         ) : (
                           <option value="" disabled>Loading Engineers...</option>
                         )}
                         
                      </select>
                </div>  
                <div class="col-md-2 col-xl-2 col-xxl-2 col-12 mt-4">
                       <button type='button' class="btn btn-primary mt-3" onClick={() => setModalIsOpen(true)}>Add Engineer</button>
                </div>
  
                <div class="col-md-12 col-xl-12 col-xxl-12 col-12 mt-2"> 
                      <label class="form-label" for="exampleInputPassword1">Client Address</label>
                      <input type="text"  class="form-control" id="exampleInputPassword1" placeholder="Enter client address..."
                      name="location" value={values.location} onChange={handleChange} required />
                </div>

                <div class="col-md-12 col-xl-12 col-xxl-12 col-12 mt-2"> 
                      <label class="form-label" for="exampleInputPassword1">Site Address</label>
                      <input type="text"  class="form-control" id="exampleInputPassword1" placeholder="Enter site address..."
                      name="sitelocation" value={values.sitelocation} onChange={handleChange} required />
                </div>
                
                <div class="col-md-12 col-xl-12 col-xxl-12 col-12 mt-2">
                      <label class="form-label" for="exampleFormControlTextarea1">Enter client requirements</label>
                      <textarea class="form-control" id="exampleFormControlTextarea1" rows="2" name='require' value={values.require} onChange={handleChange}></textarea>
                </div>

                
                
              
                <div class="col-md-12 col-xl-12 col-xxl-12 col-12 mt-4" align="center">   
                    <button type="submit" class="btn btn-primary mb-4 w-50" >Create Quote</button>
                </div>
                
               
                
                
              </div>
              </form>
              <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="modal1">
        <h2>Add New Engineer</h2>
      
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={newEngineerData.name} onChange={handleEngChange} />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input type="text" id="phone" name="phone" value={newEngineerData.phone} onChange={handleEngChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={newEngineerData.email} onChange={handleEngChange} />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input type="text" id="location" name="location" value={newEngineerData.location} onChange={handleEngChange} />
          </div>
          <button type="button" className="btn btn-primary" onClick={handleAddEngineer}>
            Add Engineer
          </button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => setModalIsOpen(false)}>
            Cancel
          </button>
       
      </Modal>
            </div>
          </div>
          </div>
          
        </div>
      </div>
    </div>



    </div>
    );
};
    
    export default App;