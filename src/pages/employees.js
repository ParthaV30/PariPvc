import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from "./navbar";
import Header from "./header";
import axios from "axios";
import { getEmployees, deleteEmployee } from '../services/dbService';
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
        await axios.post(`https://upvcapi.sninfoserv.com/log/`, {userId, "remove Employee": empId});
      } catch (error) {
        // offline fallback
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
        } else if (response.data && response.data.data) {
          setEmployeedata(response.data.data.user_employees || response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    
    useEffect(() => {
      fetchData();
    }, []);
    
    const removeEmp = async (empId) => {
      try { fetchDatalog(empId); } catch(e) {}
      try {
        await deleteEmployee(empId);
        await fetchData();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
      try {
        await axios.post(`https://upvcapi.sninfoserv.com/employees/delete-employees/`, {empId: empId});
      } catch (error) {
        // offline fallback
      }
    };

    const empList = Array.isArray(employeedata) 
      ? employeedata 
      : (employeedata?.data?.user_employees || employeedata?.data || []);

    return (
        <div>
            <Navbar />
            <Header />
            <div className="pc-container">
                <div className="pc-content">
                    <div className="row">
                    <div className="col-12 mb-3 d-flex justify-content-between align-items-center">
                      <h4>Company Employees</h4>
                      <a className="btn btn-primary" href="/addemployee">Add New Employee</a>
                    </div>
                    
                  {empList && empList.length > 0 ? (
                     
                    empList.map((emp, index) => {
                      const empName = emp.name || emp.emp_name || 'Staff Member';
                      const empIdVal = emp.id || emp.emp_id || `EMP-${index+1}`;
                      const empPhone = emp.phone || emp.emp_phone || '-';
                      const empEmail = emp.email || emp.emp_email || '-';
                      const empRole = emp.role || emp.emp_role || 'Staff';
                      const empAddress = emp.location || emp.address || emp.emp_address || 'Chennai';
                      const empImage = emp.image || emp.emp_image;

                      return (  
                      <div className="col-md-12 col-xxl-3 col-xl-3" key={empIdVal}>
                          <div className="card">
                          <div align="right" style={{textAlign:'right', float:'right', alignItems: 'right', margin:'15px'}}>
                            <button className='btn btn-outline-danger btn-sm' onClick={() => removeEmp(empIdVal)} title="Delete Employee"><i className="ti ti-trash"></i></button>
                          </div>
                              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                  {empImage ? (
                                    <img src={`https://upvcapi.sninfoserv.com/user/images/${empImage}`} onError={(e) => { e.target.style.display='none'; }} alt={empName} className="user-avtar wid-45 rounded-circle" style={{ marginBottom: '15px' }} />
                                  ) : (
                                    <div style={{ width: 45, height: 45, borderRadius: '50%', background: '#0d6efd', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 18, marginBottom: 15 }}>
                                      {empName.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <div className="pt-3" style={{ textAlign: 'center' }}>
                                      <ul style={{ listStyleType: 'none', padding: 0 }}>
                                          <li><h3>{empName}</h3></li>
                                          <li className='mb-1 text-muted'><h6>{empRole}</h6></li>
                                          <li className='mb-1'><h5>{empPhone}</h5></li>
                                          <li className='mb-1 text-truncate' style={{ maxWidth: '200px' }}><h6>{empEmail}</h6></li>
                                          <li className='mb-4 text-muted' style={{ fontSize: '85%' }}>{empAddress}</li>
                                      </ul>
                                  </div>
                              </div>
                          </div>
                      </div>
                      );
                    })
                     
                  ):(<div align="center" className="w-100">
                      <div className="col-md-12 col-xxl-4 col-xl-4" style={{ marginTop:"15vh"}}>
                        <div className="card">
                          <div className="card-body py-5">
                            <i className="ti ti-users mb-3" style={{ fontSize: '48px', color: '#6c757d' }}></i>
                            <h5>No Employees Found</h5>
                            <p className="text-muted">Start by adding your company engineers and staff members.</p>
                            <a className="btn btn-primary mt-2" href="/addemployee">Add First Employee</a>
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
