import React, { useEffect, useState } from 'react';
import { ReactSession } from 'react-client-session';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from "./navbar";
import Header from "./header";
import './box.css';
ReactSession.setStoreType("localStorage");

const App = () => {

  const userId = ReactSession.get("upvcuserId");
  const userType = ReactSession.get("upvcuserType");
  const userImage = ReactSession.get("upvcImage");
  const Empid = ReactSession.get("upvcempid");
  const cLogo = ReactSession.get("upvccompanyLogo");
  const [brandDatas, setBdata] = useState(null);
 
  
  
  let users='';
  if (userType === '3') {
    users =  Empid ;
  } else {
    users = userId ;
  }
  const user = { "userId": users };

 // console.log(userId);
 

  const navigate = useNavigate();
  const indexPath = '/';
  const [quotesDetails, setQuotesData] = useState('');
  
  
  useEffect(() => {
    if (userId === 0 ) {
      navigate(indexPath);
    }
  }, [userId, navigate]);

  
 


  useEffect(() => {

  const fetchData = async () => {
    
    try {
      const response = await axios.post('https://upvcapi.sninfoserv.com/all-quotes/', user );
      setQuotesData(response.data);
     
    } catch (error) {
    } 
  };

  fetchData();

  }, []);

 

  const brandData = async () => {
    try {
      const response = await axios.get('https://upvcapi.sninfoserv.com/company/', {params: { userId: users }});
     
      if(response.data.status === 'success'){
        setBdata(response.data.data);
        // setDes(response.data.data[0].companyTerms);
        // setBankName(response.data.data[0].companyBank);
        // setBranchName(response.data.data[0].companyBranch);
        // setAcHolderName(response.data.data[0].companyBankerName);
        // setAcType(response.data.data[0].companyBankType);
        // setAcNumber(response.data.data[0].companyAcNum);
        // setIfsc(response.data.data[0].companyIfsc);
      }
    } catch (error) {
      console.error('Error fetching brand data:', error);
    } 
  };
  useEffect(() => {
    brandData();
  },[]);

  
  

    const businessName = localStorage.getItem("businessName") || ReactSession.get("companyname") || "Pari and Co";
  const businessTagline = localStorage.getItem("businessTagline") || "UPVC Manufacturing Suite";
  const businessSub = localStorage.getItem("businessSub") || "Interior & Exterior Designers";
  const businessDesc = localStorage.getItem("businessDesc") || "Automate window & door cutting schedules, generate precision GST quotations, track client orders, and manage inventory with high-precision engineering.";
  const businessBadge = localStorage.getItem("businessBadge") || "";

  return (
    <>
    <Navbar />
    
    <div class="pc-container">
      <div class="pc-content">
        
        <div class="row">
        <div class="col-12 mb-4">
          <div class="card welcome-banner pari-hero-banner bg-blue-800">
            <div class="card-body p-4 p-md-5">
              <div class="row align-items-center">
                <div class="col-md-7">
                  {businessBadge && (
                    <div class="pari-hero-badge mb-2">
                      <i class="ti ti-shield-check"></i> {businessBadge}
                    </div>
                  )}
                  <h2 class="text-white pari-hero-title mb-2">{businessName}</h2>
                  <h5 class="text-white-50 mb-3">{businessSub} &bull; {businessTagline}</h5>
                  <p class="text-white pari-hero-desc mb-4">{businessDesc}</p>
                  <div class="d-flex flex-wrap gap-2">
                    <a href="/create-quotation" class="btn btn-hero-primary">
                      <i class="ti ti-plus"></i> Create New Quote
                    </a>
                    <a href="/account" class="btn btn-hero-ghost">
                      <i class="ti ti-settings"></i> Business Profile
                    </a>
                  </div>
                </div>
                <div class="col-md-5 text-center mt-3 mt-md-0">
                  <div class="p-1 d-inline-block rounded-circle bg-white shadow-lg" style={{ width: '130px', height: '130px', overflow: 'hidden' }}>
                    <img
                      src="/assets/images/pari-logo.png"
                      alt={businessName}
                      class="img-fluid rounded-circle"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </div>
            </div>
          </div>
        </div>
        </div>
        <div class="col-md-6 col-xxl-3 col-xl-3">
            <div class="card">
              <a href="/quote">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <a href="/quote">
                  <div class="flex-shrink-0">
                    <div class="avtar avtar-s bg-light-primary">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          opacity="0.4"
                          d="M13 9H7"
                          stroke="#4680FF"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M22.0002 10.9702V13.0302C22.0002 13.5802 21.5602 14.0302 21.0002 14.0502H19.0402C17.9602 14.0502 16.9702 13.2602 16.8802 12.1802C16.8202 11.5502 17.0602 10.9602 17.4802 10.5502C17.8502 10.1702 18.3602 9.9502 18.9202 9.9502H21.0002C21.5602 9.9702 22.0002 10.4202 22.0002 10.9702Z"
                          stroke="#4680FF"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M17.48 10.55C17.06 10.96 16.82 11.55 16.88 12.18C16.97 13.26 17.96 14.05 19.04 14.05H21V15.5C21 18.5 19 20.5 16 20.5H7C4 20.5 2 18.5 2 15.5V8.5C2 5.78 3.64 3.88 6.19 3.56C6.45 3.52 6.72 3.5 7 3.5H16C16.26 3.5 16.51 3.50999 16.75 3.54999C19.33 3.84999 21 5.76 21 8.5V9.95001H18.92C18.36 9.95001 17.85 10.17 17.48 10.55Z"
                          stroke="#4680FF"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <h6 class="mb-0">All Quotes</h6>
                  </div>
                  </a>
                </div>
                <div class="bg-body p-3 mt-3 rounded">
                  <div class="mt-3 row align-items-center">
                    <div class="col-2">
                    <i class="ti ti-receipt fs-15"></i>
                    </div>
                    <div class="col-10">
                      <h5 class="mb-1">{ReactSession.get('upvcuserQuotes')}</h5>
                      </div>
                  </div>
                </div>
              </div>
              </a>
            </div>
          </div>
          
          <div class="col-md-6 col-xxl-3 col-xl-3">
            <div class="card">
            <a href="/dashboard">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <a href="/dashboard">
                  <div class="flex-shrink-0">
                    <div class="avtar avtar-s bg-light-warning">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z"
                          stroke="#E58A00"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          opacity="0.6"
                          d="M14.5 4.5V6.5C14.5 7.6 15.4 8.5 16.5 8.5H18.5"
                          stroke="#E58A00"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          opacity="0.6"
                          d="M8 13H12"
                          stroke="#E58A00"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          opacity="0.6"
                          d="M8 17H16"
                          stroke="#E58A00"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <h6 class="mb-0">Clients</h6>
                  </div>
                  </a>
                </div>
                <div class="bg-body p-3 mt-3 rounded">
                  <div class="mt-3 row align-items-center">
                    <div class="col-2">
                    <i class="ti ti-user"></i>
                    </div>
                    <div class="col-10">
                      <h5 class="mb-1">{ReactSession.get('upvcuserClients')}</h5>
                     
                    </div>
                  </div>
                </div>
              </div>
              </a>
            </div>
          </div>
          <div class="col-md-6 col-xxl-3 col-xl-3">
            <div class="card">
            <a href="/dashboard">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <a href="/dashboard">
                  <div class="flex-shrink-0">
                    <div class="avtar avtar-s bg-light-success">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M8 2V5"
                          stroke="#2ca87f"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M16 2V5"
                          stroke="#2ca87f"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          opacity="0.4"
                          d="M3.5 9.08984H20.5"
                          stroke="#2ca87f"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                          stroke="#2ca87f"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          opacity="0.4"
                          d="M15.6947 13.7002H15.7037"
                          stroke="#2ca87f"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          opacity="0.4"
                          d="M15.6947 16.7002H15.7037"
                          stroke="#2ca87f"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          opacity="0.4"
                          d="M11.9955 13.7002H12.0045"
                          stroke="#2ca87f"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          opacity="0.4"
                          d="M11.9955 16.7002H12.0045"
                          stroke="#2ca87f"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          opacity="0.4"
                          d="M8.29431 13.7002H8.30329"
                          stroke="#2ca87f"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          opacity="0.4"
                          d="M8.29395 16.7002H8.30293"
                          stroke="#2ca87f"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <h6 class="mb-0">Engineers</h6>
                  </div>
                  </a>
                </div>
                <div class="bg-body p-3 mt-3 rounded">
                  <div class="mt-3 row align-items-center">
                    <div class="col-2">
                    <i class="ti ti-user"></i>
                    </div>
                    <div class="col-10">
                      <h5 class="mb-1">{ReactSession.get('upvcuserEngineers')}</h5>
                    </div>
                  </div>
                </div>
              </div>
              </a>
            </div>
          </div>
          <div class="col-md-6 col-xxl-3 col-xl-3">
            <div class="card">
            <a href="/dashboard">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <a href="/dashboard">
                  <div class="flex-shrink-0">
                    <div class="avtar avtar-s bg-light-warning">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          stroke="#DC2626"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          opacity="0.4"
                          d="M8.4707 10.7402L12.0007 14.2602L15.5307 10.7402"
                          stroke="#DC2626"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <h6 class="mb-0">Profiles</h6>
                  </div>
                  </a>
                </div>
                <div class="bg-body p-3 mt-3 rounded">
                  <div class="mt-3 row align-items-center">
                    <div class="col-2">
                    <i class="ti ti-arrow-up-right"></i>
                    </div>
                    <div class="col-10">
                      <h5 class="mb-1">{ReactSession.get('upvcuserProfiles')}</h5>
                    </div>
                  </div>
                </div>
              </div>
              </a>
            </div>
          </div>

          <div class="col-md-12 col-xxl-12 col-xl-12">
            <div class="card">
              <div class="card-body">
                <table id="left-right-fix" class="table stripe row-border order-column">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Quote ID</th>
                      <th>Items</th>
                      <th>Client</th>
                      <th>Location</th>
                      <th>Engineer</th>
                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody>
              {quotesDetails && quotesDetails.data && quotesDetails.data?.slice().reverse().slice(-5).reverse().map((quotes, index) => (
                <tr key={index}>
                  <td>{quotes.date}</td>
                  <td>{quotes.cusQuoteId}</td>
                  <td>{quotes.items}</td>
                  <td>{quotes.client.name}</td>
                  <td class="text-wrap">{quotes.client.location}</td>
                  <td>{quotes.engineer.name}</td>
                  <td><a href={`quotesdet?id=${quotes.quoteId}`} class="btn btn-primary">View Quote</a></td>
                  
                </tr>
              ))}
                  </tbody>
                </table>
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