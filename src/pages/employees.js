import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from "./navbar";
import Header from "./header";
import axios from "axios";
import { getEmployees } from '../services/dbService';
import { ReactSession } from 'react-client-session';
ReactSession.setStoreType("localStorage");

function Employees() {
    const userId = ReactSession.get("upvcuserId");
    const userType = ReactSession.get("upvcuserType");
    const Empid = ReactSession.get("upvcempid");
   
    const [employeedata, setEmployeedata] = useState([]);
    const [total, setTotal] = useState(0);
    const [gst, setGst] = useState(0);

    let users='';
    if (userType === '3') {
      users =  Empid ;
    } else {
      users = userId ;
    }
    const user = { "userId": users };
    const navigate = useNavigate();
    const indexPath = '/';

    const fetchDatalog = async (empId) => {
      try {
        const response = await axios.post(`https://upvcapi.sninfoserv.com/log/`, {userId, "remove Employee": empId});
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchData = async () => {
      try {
        const list = await getEmployees(users);
        if (Array.isArray(list) && list.length > 0) {
          setEmployeedata(list);
          return;
        }
        const response = await axios.post(`https://upvcapi.sninfoserv.com/employees/`, user);
        if (response.data && Array.isArray(response.data)) {
          setEmployeedata(response.data);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    
    useEffect(() => {
      fetchData();
    }, []);
    
    const removeEmp = async (empId) => {
      fetchDatalog(empId);
      try {
        const response = await axios.post(`https://upvcapi.sninfoserv.com/employees/delete-employees/`, {empId: empId});
        if(response.data.status === 'success'){
          fetchData();
        }
      } catch (error) {
          console.error('Error fetching data:', error);
      }
    };

    return (
        <div>
            <Navbar />
            <Header />
            <div className="pc-container">
                <div className="pc-content">
                    <div className="row">
                    
                  {employeedata && employeedata.data && employeedata.data.user_employees ? (
                     
                    employeedata && employeedata.data && employeedata.data.user_employees.map((employees, index) => (  
                      <div className="col-md-12 col-xxl-3 col-xl-3">
                          <div className="card">
                          <div align="right" style={{textAlign:'right', float:'right', alignItems: 'right', margin:'15px'}}>
                            <button class='btn btn-out-line' onClick={() => removeEmp(employees.user_id)} style={{float: 'right'}}><i class="ti ti-trash"></i></button>
                          </div>
                              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              
                                  <img src={`https://upvcapi.sninfoserv.com/user/images/${employees.emp_image}`} alt={employees.emp_name} className="user-avtar wid-45 rounded-circle" style={{ marginBottom: '15px' }} />
                                  <div className="pt-3" style={{ textAlign: 'center' }}>
                                      <ul style={{ listStyleType: 'none', padding: 0 }}>
                                        
                                          <li><h3>{employees.emp_name}</h3></li>
                                          <li class='mb-1'><h5>{employees.emp_id}</h5></li>
                                          <li class='mb-1'><h5>{employees.emp_phone}</h5></li>
                                          <li class='mb-1'><h5>{employees.emp_email}</h5></li>
                                         
    <li class='mb-4' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

        <span style={{ fontSize: '80%', color: 'gray',marginLeft:'10px' }}>{employees.emp_address}</span>
    </li>
   
                                           </ul>
                                  </div>
                              </div>
                          </div>
                      </div>

                                          ))
                    
                    
                                        ):(<div align="center" >
                                            <div className="col-md-12 col-xxl-4 col-xl-4" style={{ marginTop:"30vh"}}>
                                            <div className="card">
                                            <div className="card-body">
                                        <a class="btn btn-primary" href="/addemployee">Add Employees</a>
                                        </div>
                                        </div>
                                        </div>
                                        </div>)}
                     







                    </div>
                </div>
            </div>
        </div>
    );
}

export default Employees;
