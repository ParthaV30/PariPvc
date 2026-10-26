import React, { useEffect, useState } from 'react';
import { ReactSession } from 'react-client-session';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Paginator } from 'primereact/paginator';
import Navbar from "./navbar";
import Header from "./header";
import { getClients } from '../services/dbService';
import './box.css';
ReactSession.setStoreType("localStorage");

const App = () => {

  const userId = ReactSession.get("upvcuserId");
  const userType = ReactSession.get("upvcuserType");
  const Empid = ReactSession.get("upvcempid");
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [searchQuery3, setSearchQuery3] = useState('');

  const [first, setFirst] = useState(0); 
  const [rows, setRows] = useState(5);
  
  const onPageChange = (event) => {
    setFirst(event.first);
  };

  // Event handlers
  const handleSearchInputChangeName = (e) => setSearchQuery(e.target.value);
  const handleSearchInputChangephone = (e) => setSearchQuery2(e.target.value);
  const handleSearchInputChangenumber = (e) => setSearchQuery3(e.target.value);
 // const [filteredData, setFilteredData] = useState([]);
  //console.log(filteredData);
  let users='';
  if (userType === '3') {
    users =  Empid ;
  } else {
    users = userId ;
  }
  const user = { "userId": users };
 // console.log(users);
  

  const navigate = useNavigate();
  const indexPath = '/';
  
  
  useEffect(() => {
    if (userId === 0 ) {
      navigate(indexPath);
    }
  }, [userId, navigate]);


  const filteredData = clients.filter(item => 
    (searchQuery === '' || (item.clientName || item.name || '').toLowerCase().includes(searchQuery.toLowerCase())) &&
    (searchQuery2 === '' || (item.clientPhone || item.phone || '').toLowerCase().includes(searchQuery2.toLowerCase())) &&
    (searchQuery3 === '' || (item.clientLocation || item.location || '').toLowerCase().includes(searchQuery3.toLowerCase()))
  );


  const fetchDatalog = async (clientId) => {
    try {
      const response = await axios.post(`https://upvcapi.sninfoserv.com/log/`, {userId, "remove Client": clientId});
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  const clietData = async () => {
    try {
      const list = await getClients(users);
      if (Array.isArray(list) && list.length > 0) {
        const mapped = list.map(c => ({
          ...c,
          clientName: c.clientName || c.name || '',
          clientPhone: c.clientPhone || c.phone || '',
          clientLocation: c.clientLocation || c.location || '',
          clientSitelocation: c.clientSitelocation || c.sitelocation || '',
          clientEngineer: c.clientEngineer || c.engineer || '',
          clientRequire: c.clientRequire || c.require || ''
        }));
        setClients(mapped);
        return;
      }
      const response = await axios.post('https://upvcapi.sninfoserv.com/clients/', { user: users });
      if (response.data && response.data.status === 'success') {
        setClients(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  useEffect(() => {
    clietData();
  }, []);

  const removeclient = async (clientId) => {
    fetchDatalog(clientId);
    try {
      const response = await axios.post(`https://upvcapi.sninfoserv.com/remove-clients/`, {clientId: clientId});
      if(response.data.status === 'success'){
        clietData();
      }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  };
  

    return (
    <>
    <Navbar />
    
    <div class="pc-container">
      <div class="pc-content">
        
        <div class="row">
        
    
          
          
          
        

          <div class="col-md-12 col-xxl-12 col-xl-12">
          
            <div class="card">
              <div class="card-body">
              <div className="row mb-3" >
                  <div className="col-lg-4 ml-2 mt-5">
            <input
              type="text"
              className="form-control"
              placeholder="Search by client name..."
               value={searchQuery}
              onChange={handleSearchInputChangeName}
            />
          </div>
          <div className="col-lg-4 ml-2 mt-5">
            <input
              type="text"
              className="form-control"
              placeholder="Search by client phonenumber..."
               value={searchQuery2}
              onChange={handleSearchInputChangephone}
            />
          </div>
          <div className="col-lg-4 ml-2 mt-5">
            <input
              type="text"
              className="form-control"
              placeholder="Search by client location..."
               value={searchQuery3}
              onChange={handleSearchInputChangenumber}
            />
          </div>
            </div>
              
                <table id="left-right-fix" class="table stripe row-border order-column mt-3">
                  
                  <thead>
                    <tr>
                     
                      <th>Client</th>
                      <th>Client Phonenumber</th>
                      <th>Location</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {filteredData.length > 0 ? (
            <>  {filteredData.slice().reverse().slice(first, first + rows).map(client => (

              <tr key={client.clientId}>
                  <td>{client.clientName}</td>
                  <td>{client.clientPhone}</td>
                  <td class="text-wrap">{client.clientLocation}</td>
                  <td><a href={`clientsdetails?id=${client.clientPhone}`} class="btn btn-primary">View</a></td>
                  <td>
                    <a onClick={() => removeclient(client.clientId)} ><i class="btn btn-danger ti ti-trash"></i></a>
                   </td>
                </tr>
                ))} </>
              ) : searchQuery && filteredData.length === 0 ? (
            <tr >
                         <td>No Data Found</td>
                       </tr>
         ) : (<>
                  {clients && clients.slice().reverse().slice(first, first + rows).map((client) =>(
                <tr key={client.clientId}>
                  <td>{client.clientName}</td>
                  <td>{client.clientPhone}</td>
                  <td class="text-wrap">{client.clientLocation}</td>
                  <td><a href={`clientsdetails?id=${client.clientPhone}`} class="btn btn-primary">View</a></td>
                  <td>
                    <a onClick={() => removeclient(client.clientId)} ><i class="btn btn-danger ti ti-trash"></i></a>
                   </td>
                </tr>
              ))}
              </>
         )}
                  </tbody>
                </table>
                <Paginator className="custom-paginator" first={first} rows={rows} totalRecords={clients.length}  onPageChange={onPageChange} />
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