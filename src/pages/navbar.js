import React, { useEffect, useState } from 'react';
import { ReactSession } from 'react-client-session';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import left from '../images/handleLeft.png';
import right from '../images/handleRight.png';
import meshimg from '../images/mesh.png';
import Handle from '../images/slideHandle.png';
import Fan from '../images/fan.png';
ReactSession.setStoreType("localStorage");

const Navbar = () => {

  const location = useLocation();
  const lastSegment = location.pathname.split('/').pop();

  const userId = ReactSession.get("upvcuserId");
  const urlParams = new URLSearchParams(window.location.search);
  const quoteIds = ReactSession.get("upvcquoteId");
  const [quoteData, setQuoteData] = useState(null);
  const userType = ReactSession.get("upvcuserType");
  const userName = ReactSession.get("upvcuserName");
  const userImage = ReactSession.get("upvcImage");
  const userLimit = ReactSession.get("upvclimit");
  const usersub = ReactSession.get("upvcsubUsers");


  const [isMobileSidebarActive, setIsMobileSidebarActive] = useState(false);
  const [SidebarActive, setSidebarActive] = useState(false);
  const Empid = ReactSession.get("upvcempid");

  const [bottomFrame, setBottomFrame] = useState('yes');
  const [mesh, setMesh] = useState('no');
  const [panelHeights, setpanelHeight] = useState(0);
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  const [screen, setScreen] = useState(deviceWidth > 700 ? 2 : 4);
  const [divider, setDevider] = useState('Vertical');
  const [switchs, setSwitch] = useState('on');
  const [mCalc, setMcalc] = useState(1);
  const [url, setUrl] = useState('no_url');
  const [isOpen, setIsOpen] = useState(ReactSession.get("upvcreport"));
  
  useEffect(() => {
    const path = window.location.pathname;
    const url = path.split('/')[1];
    setUrl(url);
    const validUrls = ['ventilators', 'casement-window', 'sliding-window', 'casement-door', 'sliding-door', 'fixed-windows', 'select'];
    if (validUrls.includes(url)){
      ReactSession.set("sidebar", 'pc-sidebar-hide');
      setSidebar('pc-sidebar-hide');
    }else{
      ReactSession.set("sidebar", 'pc-sidebar');
      setSidebar('pc-sidebar');
    }
  }, []);

  useEffect(() => {
    setIsMobileSidebarActive(false);
  }, [location.pathname]);

  //console.log(userLimit, usersub);

  let users = '';
  if (userType === '3') {
    users = Empid;
  } else {
    users = userId;
  }
  const user = { "userId": users };


  useEffect(() => {
    const updateDeviceWidth = () => {
      setDeviceWidth(window.innerWidth);
      setScreen(window.innerWidth > 700 ? 2 : 4);
    };

    window.addEventListener('resize', updateDeviceWidth);

    return () => {
      window.removeEventListener('resize', updateDeviceWidth);
    };
  }, []);

  const toggleDropdown = () => {
    if(isOpen){
      ReactSession.set("upvcreport", false);
    }else{
      ReactSession.set("upvcreport", true);
    }
    setIsOpen(prevIsOpen => !prevIsOpen);
    
  };

  const handleSidebarClick = () => {
    setIsMobileSidebarActive(!isMobileSidebarActive);
  };

  const savedTheme = ReactSession.get("theme") || 'light';
  const [theme, setTheme] = useState(savedTheme);

  const savedSideBar = ReactSession.get("sidebar") || 'pc-sidebar';
  const [sidebar, setSidebar] = useState(savedSideBar);

  const sibeBar = () => {
    setSidebar(prevSidebar => {
      const newSidebar = prevSidebar === 'pc-sidebar' ? 'pc-sidebar-hide' : 'pc-sidebar';
      ReactSession.set("sidebar", newSidebar); // Save the new theme to the session
      return newSidebar;
    });
  };

  useEffect(() => {
    document.body.setAttribute('data-pc-theme', theme);
    ReactSession.set("theme", theme); // Save the theme to the session
    ReactSession.set("siebar", sidebar);
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#131920' : '#fff');
    }
  }, [theme, sidebar]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
      ReactSession.set("theme", newTheme); // Save the new theme to the session
      return newTheme;
    });
  };


  const fetchData = async () => {
    try {
      const response = await axios.post(`https://upvcapi.sninfoserv.com/all-quotes/`, user);
      setQuoteData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredQuotes = quoteData && quoteData.data.filter(quote => quote.quoteId === quoteIds);
  // console.log(filteredQuotes);


  const createGrill = (boxHeight, topnewHeights, bottomnewHeights, mCalc) => {

    const boxes = Array.from({ length: (boxHeight - topnewHeights - bottomnewHeights) * 1.3 }).map((_, index) => (
      <div
        key={index}
        style={{
          position: 'relative',
          width: '100%',
          height: '0.26vw',
          border: '1px solid #333',
          background: '#fff',
          marginTop: `calc((${boxHeight * screen + 'vw'} - 25px) / ${boxHeight * screen}) `,
        }}
      ></div>
    ));

    return boxes;

  };


  return (
    <>
      {isMobileSidebarActive && (
        <div
          className="pc-menu-overlay"
          onClick={handleSidebarClick}
          aria-hidden="true"
        />
      )}
      <nav className={`pc-sidebar ${savedSideBar} ${isMobileSidebarActive ? 'mob-sidebar-active' : ''}`}>
        {isMobileSidebarActive && (
          <div className="d-flex d-lg-none justify-content-between align-items-center px-4 py-3 border-bottom">
            <span className="fw-bold fs-6">Pari & Co UPVC</span>
            <button
              type="button"
              className="btn-close"
              onClick={handleSidebarClick}
              aria-label="Close"
            ></button>
          </div>
        )}
        <div className="navbar-wrapper">

          <div class="navbar-content">
            <div class="card pc-user-card">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-shrink-0">
                    <img src="/assets/images/pari-logo.png" alt={userName} class="user-avtar wid-45 rounded-circle shadow-sm" style={{ objectFit: 'cover', border: '1.5px solid #E2E8F0' }} />
                  </div>
                  <div class="flex-grow-1 ms-3 me-2">
                    <h6 class="mb-0">{userName}</h6><small>{userType === '1' ? 'Super Admin' : userType === '2' ? 'Admin' : 'User'}</small></div>
                  <a class="btn btn-icon btn-link-secondary avtar" data-bs-toggle="collapse" href="#pc_sidebar_userlink">
                    <svg class="pc-icon">
                      <use href="#custom-sort-outline"></use>
                    </svg>
                  </a>
                </div>
                <div class="collapse pc-user-links" id="pc_sidebar_userlink">
                  <div class="pt-3">
                    <a href="/account"><i class="ti ti-user"></i> <span>My Account</span> </a>
                    {userType === '2' && usersub <= userLimit && (

                      <a href="/addemployee"><i class="ti ti-user-plus"></i> <span>Add Employee</span> </a>
                    )}
                    {userType != '3' && (
                      <a href="/settings"><i class="ti ti-settings"></i> <span>Settings</span> </a>
                    )}

                    <a href="/logout"><i class="ti ti-power"></i> <span>Logout</span></a>
                  </div>
                </div>
              </div>
            </div>
            <ul class="pc-navbar">
              <li class="pc-item pc-caption">
                <label>Navigation</label>
              </li>
              <li class="pc-item">
                <a href="/dashboard" class="pc-link">
                  <span class="pc-micon">
                    <svg class="pc-icon">
                      <use href="#custom-status-up"></use>
                    </svg>
                  </span>
                  <span class="pc-mtext">Dashboard</span>
                </a>

              </li>

              <li class="pc-item">
                <a href="/create-quotation" class="pc-link">
                  <span class="pc-micon">
                    <svg class="pc-icon">
                      <use href="#custom-document"></use>
                    </svg>
                  </span>
                  <span class="pc-mtext">New Quotation</span>
                </a>
              </li>

              {userType === '1' && (
                <>
                  <li class="pc-item">
                    <a href="/default" class="pc-link">
                      <span class="pc-micon">
                        <svg class="pc-icon">
                          <use href="#custom-add-item"></use>
                        </svg>
                      </span>
                      <span class="pc-mtext">Add Default Profiles</span>
                    </a>
                  </li>
                    <li class="pc-item">
                    <a href="/uploadprofile" class="pc-link">
                      <span class="pc-micon">
                        <svg class="pc-icon">
                          <use href="#custom-add-item"></use>
                        </svg>
                      </span>
                      <span class="pc-mtext">Upload Profiles</span>
                    </a>
                  </li>

                  <li class="pc-item">
                    <a href="/add-user" class="pc-link">
                      <span class="pc-micon">
                        <svg class="pc-icon">
                          <use href="#custom-user"></use>
                        </svg>
                      </span>
                      <span class="pc-mtext">Add User</span>
                    </a>
                  </li>

                  <li class="pc-item">
                    <a href="/user" class="pc-link">
                      <span class="pc-micon">
                        <svg class="pc-icon">
                          <use href="#custom-user"></use>
                        </svg>
                      </span>
                      <span class="pc-mtext">View User</span>
                    </a>
                  </li>
                </>
              )}


              <li class="pc-item">
                <a href="/quote" class="pc-link">
                  <span class="pc-micon">
                    <svg class="pc-icon">
                      <use href="#custom-document-filter"></use>
                    </svg>

                  </span>
                  <span class="pc-mtext">View Quotes</span>
                </a>
              </li>

              <li class="pc-item">
                <a href="/client" class="pc-link">
                  <span class="pc-micon">
                    <svg class="pc-icon">
                      <use href="#custom-user"></use>
                    </svg>

                  </span>
                  <span class="pc-mtext">Clients</span>
                </a>
              </li>



              {userType === '2' && (
                <>
                  <li class="pc-item">
                    <a href="/employees" class="pc-link">
                      <span class="pc-micon">
                        <svg class="pc-icon">
                          <use href="#custom-user-square"></use>
                        </svg>

                      </span>
                      <span class="pc-mtext">Employees</span>
                    </a>
                  </li>

                  

                  <li class={`pc-item pc-hasmenu ${isOpen ? 'pc-trigger' : ''}`}>
                    <a onClick={toggleDropdown} class="pc-link">
                      <span class="pc-micon">
                        <svg class="pc-icon"><use href="#custom-document"></use></svg>
                          </span><span class="pc-mtext">Reports</span> 
                            <span class="pc-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></span><div></div>
                            </a>
                    <ul class="pc-submenu" style={{display: isOpen ? 'block' : 'none', boxSizing: 'border-box'}}>
                        <li class={`pc-item ${lastSegment === 'monthlyreport' ? 'active' : ''}`}><a class="pc-link" href="/monthlyreport">Monthly Report</a></li>
                        <li class={`pc-item ${lastSegment === 'itemreport' ? 'active' : ''}`}><a class="pc-link" href="/itemreport">Item Report</a></li>
                        <li class={`pc-item ${lastSegment === 'clientreport' ? 'active' : ''}`}><a class="pc-link" href="/clientreport">Client Report</a></li>
                        <li class={`pc-item ${lastSegment === 'hardwarereport' ? 'active' : ''}`}><a class="pc-link" href="/hardwarereport">Hardware Report</a></li>
                        <li class={`pc-item ${lastSegment === 'quotationreport' ? 'active' : ''}`}><a class="pc-link" href="/quotationreport">Quotation Report</a></li>
                    </ul>
                  </li>

               
                 
                </>


              )}
            </ul>
          </div>
          

        </div>
       
      </nav>

      <header class="pc-header">
        <div class="header-wrapper">
          <div class="me-auto pc-mob-drp">
            <ul class="list-unstyled">
              <li class="pc-h-item pc-sidebar-collapse"><a onClick={sibeBar} class="pc-head-link ms-0" id="sidebar-hide"><i class="ti ti-menu-2"></i></a></li>
              <li class="pc-h-item pc-sidebar-popup"><a onClick={handleSidebarClick} class="pc-head-link ms-0" id="mobile-collapse"><i class="ti ti-menu-2"></i></a></li>

            </ul>
          </div>

          <div class="ms-auto">
            <ul class="list-unstyled">
              <li class="dropdown pc-h-item">
                <a class="pc-head-link dropdown-toggle arrow-none me-0" onClick={toggleTheme}>
                  <svg class="pc-icon">
                    {theme === 'dark' ? (<use href="#custom-sun-1"></use>) : (<use href="#custom-moon"></use>)}
                  </svg>
                </a>
              </li>

              <li class="pc-h-item">
                <a href="#" class="pc-head-link me-0" data-bs-toggle="offcanvas" data-bs-target="#announcement" aria-controls="announcement">
                  <svg class="pc-icon">
                    <use href="#custom-flash"></use>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <div class="offcanvas pc-announcement-offcanvas offcanvas-end" tabindex="-1" id="announcement" aria-labelledby="announcementLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="announcementLabel">Quotes</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          {/* <p class="text-span">{quoteIds}</p> */}
          {quoteIds !== "" ? (<>
            {filteredQuotes?.map((quote, index) => (

              <div class="card mb-3" key={index}>
                {quote.quoteDetails.map((detail, detailIndex) => (
                  <div class="card-body" key={detailIndex}>
                    <div class="align-items-center d-flex flex-wrap gap-2 mb-3">
                      <h5 style={{ marginLeft: '10px' }}>{detail.quoteData.item} X {detail.quoteData.qty}</h5>

                    </div>
                     


                    {detail.quoteData.item === 'CasementDoor' && (
                                    <div class="col-md-12 col-xxl-12 col-xl-12" >
                                      <div class="card" style={{ background: '#fff' }}>
                                        <div class="card-body mb-5">

                                          <div>

                                            <div style={{ float: 'left', width: detail.quoteData.boxWidth * screen / mCalc + 'vw', height: detail.quoteData.boxHeight * screen / mCalc + 'vw', border: '1px solid #333' }}>



                                              {[...Array(detail.quoteData.numFrames)].map((_, index) => (
                                                <div style={{ float: 'left', margin: '5px', border: '1px solid #333', width: `calc(${Number(detail.quoteData.boxWidth) * screen / mCalc / detail.quoteData.numFrames + 'vw'} - 12px)`, height: detail.quoteData.bottomFrame === 'no' ? `calc(${Number(detail.quoteData.boxHeight) * screen / mCalc + 'vw'} - 6px)` : `calc(${Number(detail.quoteData.boxHeight) * screen / mCalc + 'vw'} - 12px)`, }}>


                                                  {detail.quoteData.boxTop === 'on' && (

                                                    [...Array(detail.quoteData.numTopBoxes)].map((_, index) => (
                                                      <div style={{ display: 'flex', width: `calc(${detail.quoteData.boxWidth * screen / mCalc / detail.quoteData.numFrames + 'vw'} - 23px)`, height: `calc(${(detail.quoteData.topnewHeights * screen / mCalc)}vw )`, margin: '5px' }}>
                                                        {[...Array(detail.quoteData.topFixedNum)].map((_, index) => (
                                                          <div style={{ flex: '1', background: 'lightgreen', width: `calc(${detail.quoteData.topFixedWidth[index] * screen / mCalc / detail.quoteData.numFrames + 'vw'} - 18px)`, height: `calc(${(detail.quoteData.topnewHeights * screen / mCalc)}vw )`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px', }}>

                                                          </div>
                                                        ))}
                                                      </div>
                                                    ))
                                                  )}


                                                  <div style={{ display: 'flex' }}>
                                                    {[...Array(detail.quoteData.numSecondInnerBoxes)].map((_, index) => (

                                                      <div key={index} style={{ flex: '1', height: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc}vw - ${detail.quoteData.boxTop === 'on' ? '30px' : '25px'})`, width: `calc(${detail.quoteData.newWidths[index] * screen / mCalc}vw - 5px - 19px)`, backgroundColor: detail.quoteData.boxColors[index] || 'lightblue', marginTop: detail.quoteData.boxTop === 'on' ? '0px' : '5px', marginRight: index === detail.quoteData.numSecondInnerBoxes - 1 ? '5px' : '2.5px', marginLeft: index === 0 ? '5px' : '2.5px', border: '1px solid #333' }}>


                                                        <div className="expanding-arrow-line" style={{
                                                          position: 'absolute',
                                                          float: 'left',
                                                          width: `calc(${detail.quoteData.newWidths[index] * screen / mCalc}vw - 15px)`,
                                                          bottom: '-10px',
                                                          top: `calc(${detail.quoteData.boxHeight * screen / mCalc}vw - 25px)`,
                                                        }}

                                                        >
                                                          <div className="arrow-left"></div>
                                                          <div className="line" align="center">
                                                            <div style={{ marginTop: '-7px', background: 'white', maxWidth: '60px', textAlign: 'center' }}><p>{typeof detail.quoteData.newWidths[index] === 'number' ? detail.quoteData.newWidths[index].toFixed(2) : detail.quoteData.newWidths[index]}</p></div>
                                                          </div>
                                                          <div className="arrow-right"></div>
                                                        </div>



                                                        {detail.quoteData.boxNames[index] === 'Shutter' && (detail.quoteData.boxHandle[index] === 'left' ? (
                                                          <img
                                                            src={left}
                                                            style={{
                                                              float: 'left',
                                                              marginTop: `calc(${(((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc) / 2)}vw - 15px`,
                                                              marginLeft: '2px',
                                                              width: screen === 3 ? '13px' : '8px'
                                                            }}

                                                            alt="Left Handle"
                                                          />
                                                        ) : (
                                                          <img
                                                            src={right}
                                                            style={{
                                                              float: 'right',
                                                              marginTop: `calc(${(((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc) / 2)}vw - 15px`,
                                                              marginRight: '2px',
                                                              width: screen === 3 ? '13px' : '8px'
                                                            }}

                                                            alt="Right Handle"
                                                          />

                                                        ))}

                                                        {detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.grill === 'yes' && createGrill(detail.quoteData.boxHeight, detail.quoteData.topnewHeights, detail.quoteData.bottomnewHeights, mCalc)}


                                                      </div>

                                                    ))}

                                                  </div>






                                                  {detail.quoteData.numSecondInnerBoxes === 0 ? (
                                                    <div className="expanding-arrow-line" style={{ float: 'left', marginLeft: '-5px', width: ((Number(detail.quoteData.boxWidth) / detail.quoteData.numFrames) * screen / mCalc) + 'vw', top: (Number(detail.quoteData.boxHeight) - detail.quoteData.newHeights) * screen / mCalc + 'vw', }} >
                                                      <div className="arrow-left"></div>
                                                      <div className="line" align="center">
                                                        <div style={{ marginTop: '-8px', background: 'white', maxWidth: '60px', textAlign: 'center' }}><p>{typeof (Number(detail.quoteData.boxWidth) / detail.quoteData.numFrames) === 'number' ? (Number(detail.quoteData.boxWidth) / detail.quoteData.numFrames).toFixed(2) : (Number(detail.quoteData.boxWidth) / detail.quoteData.numFrames)}</p></div>
                                                      </div>
                                                      <div className="arrow-right"></div>
                                                    </div>
                                                  ) : (
                                                    <div className="expanding-arrow-line" style={{ float: 'left', marginLeft: '-5px', width: ((Number(detail.quoteData.boxWidth) / detail.quoteData.numFrames) * screen / mCalc) + 'vw', bottom: '-10px', top: '50px', }} >
                                                      <div className="arrow-left"></div>
                                                      <div className="line" align="center">
                                                        <div style={{ marginTop: '-8px', background: 'white', maxWidth: '60px', textAlign: 'center' }}><p>{typeof (Number(detail.quoteData.boxWidth) / detail.quoteData.numFrames) === 'number' ? (Number(detail.quoteData.boxWidth) / detail.quoteData.numFrames).toFixed(2) : (Number(detail.quoteData.boxWidth) / detail.quoteData.numFrames)}</p></div>
                                                      </div>
                                                      <div className="arrow-right"></div>
                                                    </div>
                                                  )}

                                                </div>
                                              ))}
                                            </div>

                                            <div style={{ width: '45px', float: 'left', paddingLeft: '15px', textAlign: 'left' }}>
                      {detail.quoteData.boxTop === 'on' &&
                      <>
                        <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.topnewHeights * screen / mCalc}vw + 10px)`, top: '0', position: 'relative' }}>
                          <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                          <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                            <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.topnewHeights * (screen / mCalc / 2) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{typeof detail.quoteData.topnewHeights === 'number' ? detail.quoteData.topnewHeights.toFixed(2) : detail.quoteData.topnewHeights}</p></div>
                          </div>
                          <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        </div>
                      
                      <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc}vw - ${detail.quoteData.boxTop === 'on' ? '30px' : '15px'})`, top: `calc(${detail.quoteData.topnewHeights * screen / mCalc}vw + ${detail.quoteData.boxTop === 'on' ? '15px' : '0px'})`, position: 'relative' }}>
                        <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                          <div style={{ marginLeft: '-10px', marginTop: (detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{ Number(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights).toFixed(2)}</p></div>
                        </div>
                        <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                      </div>
                      </>
                     }
                      {detail.quoteData.boxBottom === 'on' &&
                      <>
                        <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc}vw - ${detail.quoteData.boxTop === 'on' ? '30px' : '15px'})`, top: `calc(${detail.quoteData.topnewHeights * screen / mCalc}vw + ${detail.quoteData.boxTop === 'on' ? '15px' : '0px'})`, position: 'relative' }}>
                        <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                          <div style={{ marginLeft: '-10px', marginTop: (detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{ Number(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights).toFixed(2)}</p></div>
                        </div>
                        <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                      </div>
                        <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(detail.quoteData.bottomnewHeights) * screen / mCalc}vw + 5px)`, top: `calc(${(detail.quoteData.boxHeight - detail.quoteData.bottomnewHeights) * screen / mCalc}vw - ${detail.quoteData.boxTop === 'on' ? '10px' : '10px'})`, position: 'relative' }}>
                          <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                          <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                            <div style={{ marginLeft: '-10px', marginTop: (detail.quoteData.bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{ Number(detail.quoteData.bottomnewHeights).toFixed(2)}</p></div>
                          </div>
                          <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        </div>
                        </>
                      }

                    </div>

                    <div style={{ width: '30px', float: 'left', paddingLeft: detail.quoteData.boxBottom === 'on' || detail.quoteData.boxTop === 'on' ?'0px' : '15px', textAlign: 'left' }}>
                      <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen / mCalc}vw)`, top: '0', position: 'relative' }}>
                        <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                          <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.boxHeight * (screen / mCalc / 2) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{ Number(detail.quoteData.boxHeight).toFixed(2)}</p></div>
                        </div>
                        <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                      </div>
                    </div>

                                          </div>

                                        </div>
                                      </div>


                                    </div>
                                  )}
                     {detail.quoteData.item === 'CasementWindow' && (
                                    <div class="col-md-12 col-xxl-12 col-xl-12">
                                      <div class="card" style={{ background: '#fff' }}>
                                        <div class="card-body mb-5">

                                          <div>

                                            <div style={{ float: 'left', width: detail.quoteData.boxWidth * screen / mCalc + 'vw', height: detail.quoteData.boxHeight * screen / mCalc + 'vw', border: '1px solid #333' }}>



                                              {[...Array(detail.quoteData.numFrames)].map((_, index) => (
                                                <div style={{ float: 'left', margin: '5px', border: '1px solid #333', width: `calc(${detail.quoteData.boxWidth * screen / mCalc / detail.quoteData.numFrames + 'vw'} - 12px)`, height: `calc(${detail.quoteData.boxHeight * screen / mCalc + 'vw'} - 12px)` }}>


                                                  {detail.quoteData.boxTop === 'on' && (

                                                    [...Array(detail.quoteData.numTopBoxes)].map((_, index) => (
                                                      <div style={{ display: 'flex', width: `calc(${detail.quoteData.boxWidth * screen / mCalc / detail.quoteData.numFrames + 'vw'} - 23px)`, height: `calc(${(detail.quoteData.topnewHeights * screen / mCalc)}vw )`, margin: '5px' }}>
                                                        {[...Array(detail.quoteData.topFixedNum)].map((_, index) => (
                                                          <div style={{ flex: '1', background: 'lightgreen', width: `calc(${detail.quoteData.topFixedWidth[index] * screen / mCalc / detail.quoteData.numFrames + 'vw'} - 18px)`, height: `calc(${(detail.quoteData.topnewHeights * screen / mCalc)}vw )`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px', }}>

                                                          </div>
                                                        ))}
                                                      </div>
                                                    ))
                                                  )}

                                                  <div style={{ display: 'flex' }}>
                                                    {[...Array(detail.quoteData.numSecondInnerBoxes)].map((_, index) => (

                                                      <div key={index} style={{ flex: '1', height: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc}vw - ${detail.quoteData.boxTop === 'on' ? '30px' : '25px'})`, width: `calc(${detail.quoteData.newWidths[index] * screen / mCalc}vw - 5px - 19px)`, backgroundColor: detail.quoteData.boxColors[index] || 'lightblue', marginTop: detail.quoteData.boxTop === 'on' ? '0px' : '5px', marginRight: index === detail.quoteData.numSecondInnerBoxes - 1 ? '5px' : '2.5px', marginLeft: index === 0 ? '5px' : '2.5px', border: '1px solid #333' }}>


                                                        <div className="expanding-arrow-line" style={{
                                                          position: 'absolute',
                                                          float: 'left',
                                                          width: `calc(${detail.quoteData.newWidths[index] * screen / mCalc}vw - 15px)`,
                                                          bottom: '-10px',
                                                          top: `calc(${detail.quoteData.boxHeight * screen / mCalc}vw - 25px)`,
                                                        }}

                                                        >
                                                          <div className="arrow-left"></div>
                                                          <div className="line" align="center">
                                                            <div style={{ marginTop: '-7px', background: 'white', maxWidth: '60px', textAlign: 'center' }}><p>{typeof detail.quoteData.newWidths[index] === 'number' ? detail.quoteData.newWidths[index].toFixed(2) : detail.quoteData.newWidths[index]}</p></div>
                                                          </div>
                                                          <div className="arrow-right"></div>
                                                        </div>



                                                        {detail.quoteData.boxNames[index] === 'Shutter' && (detail.quoteData.boxHandle[index] === 'left' ? (
                                                          <img
                                                            src={left}
                                                            style={{
                                                              float: 'left',
                                                              marginTop: `calc(${(((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc) / 2)}vw - 15px`,
                                                              marginLeft: '2px',
                                                              width: screen === 3 ? '13px' : '8px'
                                                            }}

                                                            alt="Left Handle"
                                                          />
                                                        ) : (
                                                          <img
                                                            src={right}
                                                            style={{
                                                              float: 'right',
                                                              marginTop: `calc(${(((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc) / 2)}vw - 15px`,
                                                              marginRight: '2px',
                                                              width: screen === 3 ? '13px' : '8px'
                                                            }}

                                                            alt="Right Handle"
                                                          />

                                                        ))}

                                                        {detail.quoteData.mesh === 'yes' && detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.boxHandle[index] === 'left' && (
                                                          <img src={meshimg} style={{ width: screen === 3 ? '40px' : '20px', float: 'left', marginLeft: screen === 3 ? detail.quoteData.boxHandle[index] === 'left' ? '-15px' : '0px' : detail.quoteData.boxHandle[index] === 'left' ? '-10px' : 'px', marginTop: screen === 3 ? `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc)}vw - ${detail.quoteData.boxTop === 'on' ? '72px' : '67px'} )` : `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc)}vw - 50px)` }} />
                                                        )}

                                                        {detail.quoteData.mesh === 'yes' && detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.boxHandle[index] === 'right' && (
                                                          <img src={meshimg} style={{ width: screen === 3 ? '40px' : '20px', float: 'left', marginLeft: screen === 3 ? detail.quoteData.boxHandle[index] === 'right' ? '-1px' : '0px' : detail.quoteData.boxHandle[index] === 'right' ? '0px' : 'px', marginTop: screen === 3 ? `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc)}vw - ${detail.quoteData.boxTop === 'on' ? '72px' : '67px'} )` : `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc)}vw - 50px)` }} />
                                                        )}

                                                        {detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.grill === 'yes' && createGrill(detail.quoteData.boxHeight, detail.quoteData.topnewHeights, detail.quoteData.bottomnewHeights, mCalc)}

                                                      </div>

                                                    ))}

                                                  </div>

                                                  {detail.quoteData.boxBottom === 'on' && (
                                                    [...Array(detail.quoteData.numBottomBoxes)].map((_, index) => (
                                                      <div style={{ display: 'flex', width: `calc(${detail.quoteData.boxWidth * screen / mCalc / detail.quoteData.numFrames + 'vw'} - 23px)`, height: `calc(${(detail.quoteData.bottomnewHeights * screen / mCalc) + 'vw'} -10px)`, margin: '5px' }}>
                                                        {[...Array(detail.quoteData.bottomFixedNum)].map((_, index) => (
                                                          <div style={{ flex: '1', background: 'lightgreen', width: `calc(${detail.quoteData.bottomFixedWidth[index] * screen / mCalc / detail.quoteData.numFrames + 'vw'} - 18px)`, height: `calc(${(detail.quoteData.bottomnewHeights * screen / mCalc) + 'vw'} - 5px)`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px', }}>

                                                          </div>
                                                        ))}
                                                      </div>
                                                    ))
                                                  )}

                                                  {detail.quoteData.numSecondInnerBoxes === 0 ? (
                                                    <div className="expanding-arrow-line" style={{ float: 'left', marginLeft: '-5px', width: ((detail.quoteData.boxWidth / detail.quoteData.numFrames) * screen / mCalc) + 'vw', top: (detail.quoteData.boxHeight - detail.quoteData.topnewHeights) * screen / mCalc + 'vw', }} >
                                                      <div className="arrow-left"></div>
                                                      <div className="line" align="center">
                                                        <div style={{ marginTop: '-8px', background: 'white', maxWidth: '60px', textAlign: 'center' }}><p>{typeof (detail.quoteData.boxWidth / detail.quoteData.numFrames) === 'number' ? (detail.quoteData.boxWidth / detail.quoteData.numFrames).toFixed(2) : (detail.quoteData.boxWidth / detail.quoteData.numFrames)}</p></div>
                                                      </div>
                                                      <div className="arrow-right"></div>
                                                    </div>
                                                  ) : (
                                                    <div className="expanding-arrow-line" style={{ float: 'left', marginLeft: '-5px', width: ((detail.quoteData.boxWidth / detail.quoteData.numFrames) * screen / mCalc) + 'vw', bottom: '-10px', top: '50px', }} >
                                                      <div className="arrow-left"></div>
                                                      <div className="line" align="center">
                                                        <div style={{ marginTop: '-8px', background: 'white', maxWidth: '60px', textAlign: 'center' }}><p>{typeof (detail.quoteData.boxWidth / detail.quoteData.numFrames) === 'number' ? (detail.quoteData.boxWidth / detail.quoteData.numFrames).toFixed(2) : (detail.quoteData.boxWidth / detail.quoteData.numFrames)}</p></div>
                                                      </div>
                                                      <div className="arrow-right"></div>
                                                    </div>
                                                  )}

                                                </div>
                                              ))}
                                            </div>


                                            <div style={{ width: '45px', float: 'left', paddingLeft: '15px', textAlign: 'left' }}>
                      {detail.quoteData.boxTop === 'on' &&
                      <>
                        <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.topnewHeights * screen / mCalc}vw + 10px)`, top: '0', position: 'relative' }}>
                          <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                          <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                            <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.topnewHeights * (screen / mCalc / 2) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{typeof detail.quoteData.topnewHeights === 'number' ? detail.quoteData.topnewHeights.toFixed(2) : detail.quoteData.topnewHeights}</p></div>
                          </div>
                          <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        </div>
                      
                      <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc}vw - ${detail.quoteData.boxTop === 'on' ? '30px' : '15px'})`, top: `calc(${detail.quoteData.topnewHeights * screen / mCalc}vw + ${detail.quoteData.boxTop === 'on' ? '15px' : '0px'})`, position: 'relative' }}>
                        <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                          <div style={{ marginLeft: '-10px', marginTop: (detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{ Number(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights).toFixed(2)}</p></div>
                        </div>
                        <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                      </div>
                      </>
                     }
                      {detail.quoteData.boxBottom === 'on' &&
                      <>
                        <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc}vw - ${detail.quoteData.boxTop === 'on' ? '30px' : '15px'})`, top: `calc(${detail.quoteData.topnewHeights * screen / mCalc}vw + ${detail.quoteData.boxTop === 'on' ? '15px' : '0px'})`, position: 'relative' }}>
                        <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                          <div style={{ marginLeft: '-10px', marginTop: (detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{ Number(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights).toFixed(2)}</p></div>
                        </div>
                        <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                      </div>
                        <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(detail.quoteData.bottomnewHeights) * screen / mCalc}vw + 5px)`, top: `calc(${(detail.quoteData.boxHeight - detail.quoteData.bottomnewHeights) * screen / mCalc}vw - ${detail.quoteData.boxTop === 'on' ? '10px' : '10px'})`, position: 'relative' }}>
                          <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                          <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                            <div style={{ marginLeft: '-10px', marginTop: (detail.quoteData.bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{ Number(detail.quoteData.bottomnewHeights).toFixed(2)}</p></div>
                          </div>
                          <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        </div>
                        </>
                      }

                    </div>

                    <div style={{ width: '30px', float: 'left', paddingLeft: detail.quoteData.boxBottom === 'on' || detail.quoteData.boxTop === 'on' ?'0px' : '15px', textAlign: 'left' }}>
                      <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen / mCalc}vw)`, top: '0', position: 'relative' }}>
                        <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                          <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.boxHeight * (screen / mCalc / 2) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{ Number(detail.quoteData.boxHeight).toFixed(2)}</p></div>
                        </div>
                        <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                      </div>
                    </div>


                                          </div>

                                        </div>
                                      </div>




                                    </div>
                                  )}
                   {detail.quoteData.item === 'SlidingDoor' && (
                                    <div class="col-md-12 col-xxl-12 col-xl-12" >
                                      <div class="card" style={{ background: '#fff' }}>
                                        <div class="card-body mb-5">

                                          <div>

                                            <div style={{ float: 'left', width: detail.quoteData.boxWidth * screen / mCalc + 'vw', height: detail.quoteData.boxHeight * screen / mCalc + 'vw', border: '1px solid #333' }}>


                                              {[...Array(detail.quoteData.numFrames)].map((_, index) => (
                                                <div style={{ float: 'left', margin: '5px', border: '1px solid #333', width: `calc(${detail.quoteData.boxWidth * screen / mCalc / detail.quoteData.numFrames + 'vw'} - 12px)`, height: `calc(${detail.quoteData.boxHeight * screen / mCalc + 'vw'} - 12px)` }}>





                                                  {detail.quoteData.boxTop === 'on' && (

                                                    [...Array(detail.quoteData.numTopBoxes)].map((_, index) => (
                                                      <div style={{ display: 'flex', width: `calc(${detail.quoteData.boxWidth * screen / mCalc / detail.quoteData.numFrames + 'vw'} - 23px)`, height: `calc(${(detail.quoteData.topnewHeights * screen / mCalc)}vw )`, margin: '5px' }}>
                                                        {[...Array(detail.quoteData.topFixedNum)].map((_, index) => (
                                                          <div style={{ flex: '1', background: 'lightgreen', width: `calc(${detail.quoteData.topFixedWidth[index] * screen / mCalc / detail.quoteData.numFrames + 'vw'} - 18px)`, height: `calc(${(detail.quoteData.topnewHeights * screen / mCalc)}vw )`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px', }}>

                                                          </div>
                                                        ))}
                                                      </div>
                                                    ))
                                                  )}

                                                  <div style={{ display: 'flex' }}>
                                                    {[...Array(detail.quoteData.numSecondInnerBoxes)].map((_, index) => (

                                                      <div key={index} style={{ flex: '1', height: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc}vw - ${detail.quoteData.boxTop === 'on' ? '30px' : '25px'})`, width: `calc(${detail.quoteData.newWidths[index] * screen / mCalc}vw - 5px - 19px)`, backgroundColor: detail.quoteData.panelType === 1 ? 'lightgray' : detail.quoteData.panelType === 2 ? 'lightyellow' : 'lightblue', marginTop: detail.quoteData.boxTop === 'on' ? '0px' : '5px', marginRight: index === detail.quoteData.numSecondInnerBoxes - 1 ? '5px' : '2.5px', marginLeft: index === 0 ? '5px' : '2.5px', border: '1px solid #333' }}>


                                                        <div className="expanding-arrow-line" style={{
                                                          position: 'absolute',
                                                          float: 'left',
                                                          width: `calc(${detail.quoteData.newWidths[index] * screen / mCalc}vw - 15px)`,
                                                          bottom: '-10px',
                                                          top: `calc(${detail.quoteData.boxHeight * screen / mCalc}vw - 25px)`,
                                                        }}

                                                        >
                                                          <div className="arrow-left"></div>
                                                          <div className="line" align="center">
                                                            <div style={{ marginTop: '-7px', background: 'white', maxWidth: '60px', textAlign: 'center' }}><p>{typeof detail.quoteData.newWidths[index] === 'number' ? detail.quoteData.newWidths[index].toFixed(2) : detail.quoteData.newWidths[index]}</p></div>
                                                          </div>
                                                          <div className="arrow-right"></div>
                                                        </div>



                                                        {detail.quoteData.boxNames[index] === 'Shutter' && (detail.quoteData.boxHandle[index] === 'left' ? (
                                                          <img
                                                            src={Handle}
                                                            style={{
                                                              float: 'left',
                                                              marginTop: `calc(${(((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc) / 2)}vw - 15px`,
                                                              marginLeft: '2px',
                                                              width: screen === 3 ? '5px' : '4px'
                                                            }}

                                                            alt="Left Handle"
                                                          />
                                                        ) : (
                                                          <img
                                                            src={Handle}
                                                            style={{
                                                              float: 'right',
                                                              marginTop: `calc(${(((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc) / 2)}vw - 15px`,
                                                              marginRight: '2px',
                                                              width: screen === 3 ? '5px' : '4px'
                                                            }}

                                                            alt="Right Handle"
                                                          />

                                                        ))}

                                                        {detail.quoteData.mesh === 'yes' && detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.boxHandle[index] === 'left' && (
                                                          <img src={detail.quoteData.meshimg} style={{ width: screen === 3 ? '40px' : '20px', float: 'left', marginLeft: screen === 3 ? detail.quoteData.boxHandle[index] === 'left' ? '-15px' : '0px' : detail.quoteData.boxHandle[index] === 'left' ? '-10px' : 'px', marginTop: screen === 3 ? `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc)}vw - ${detail.quoteData.boxTop === 'on' ? '72px' : '67px'} )` : `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc)}vw - 45px)` }} />
                                                        )}

                                                        {detail.quoteData.mesh === 'yes' && detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.boxHandle[index] === 'right' && (
                                                          <img src={detail.quoteData.meshimg} style={{ width: screen === 3 ? '40px' : '20px', float: 'left', marginLeft: screen === 3 ? detail.quoteData.boxHandle[index] === 'right' ? '-1px' : '0px' : detail.quoteData.boxHandle[index] === 'right' ? '0px' : 'px', marginTop: screen === 3 ? `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc)}vw - ${detail.quoteData.boxTop === 'on' ? '72px' : '67px'} )` : `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc)}vw - 45px)` }} />
                                                        )}

                                                        {detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.grill === 'yes' && createGrill(detail.quoteData.boxHeight, detail.quoteData.topnewHeights, detail.quoteData.bottomnewHeights, mCalc)}


                                                      </div>

                                                    ))}

                                                  </div>






                                                  {detail.quoteData.numSecondInnerBoxes === 0 ? (
                                                    <div className="expanding-arrow-line" style={{ float: 'left', marginLeft: '-5px', width: ((detail.quoteData.boxWidth / detail.quoteData.numFrames) * screen / mCalc) + 'vw', top: detail.quoteData.boxHeight * screen / mCalc + 'vw', }} >
                                                      <div className="arrow-left"></div>
                                                      <div className="line" align="center">
                                                        <div style={{ marginTop: '-8px', background: 'white', maxWidth: '60px', textAlign: 'center' }}><p>{typeof (detail.quoteData.boxWidth / detail.quoteData.numFrames) === 'number' ? (detail.quoteData.boxWidth / detail.quoteData.numFrames).toFixed(2) : (detail.quoteData.boxWidth / detail.quoteData.numFrames)}</p></div>
                                                      </div>
                                                      <div className="arrow-right"></div>
                                                    </div>
                                                  ) : (
                                                    <div className="expanding-arrow-line" style={{ float: 'left', marginLeft: '-5px', width: ((detail.quoteData.boxWidth / detail.quoteData.numFrames) * screen / mCalc) + 'vw', bottom: '-10px', top: '40px', }} >
                                                      <div className="arrow-left"></div>
                                                      <div className="line" align="center">
                                                        <div style={{ marginTop: '-8px', background: 'white', maxWidth: '60px', textAlign: 'center' }}><p>{typeof (detail.quoteData.boxWidth / detail.quoteData.numFrames) === 'number' ? (detail.quoteData.boxWidth / detail.quoteData.numFrames).toFixed(2) : (detail.quoteData.boxWidth / detail.quoteData.numFrames)}</p></div>
                                                      </div>
                                                      <div className="arrow-right"></div>
                                                    </div>
                                                  )}


                                                </div>
                                              ))}
                                            </div>

                                            <div style={{ width: '45px', float: 'left', paddingLeft: '15px', textAlign: 'left' }}>
                      {detail.quoteData.boxTop === 'on' &&
                      <>
                        <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.topnewHeights * screen / mCalc}vw + 10px)`, top: '0', position: 'relative' }}>
                          <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                          <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                            <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.topnewHeights * (screen / mCalc / 2) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{typeof detail.quoteData.topnewHeights === 'number' ? detail.quoteData.topnewHeights.toFixed(2) : detail.quoteData.topnewHeights}</p></div>
                          </div>
                          <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        </div>
                      
                      <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc}vw - ${detail.quoteData.boxTop === 'on' ? '30px' : '15px'})`, top: `calc(${detail.quoteData.topnewHeights * screen / mCalc}vw + ${detail.quoteData.boxTop === 'on' ? '15px' : '0px'})`, position: 'relative' }}>
                        <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                          <div style={{ marginLeft: '-10px', marginTop: (detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{ Number(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights).toFixed(2)}</p></div>
                        </div>
                        <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                      </div>
                      </>
                     }
                      {detail.quoteData.boxBottom === 'on' &&
                      <>
                        <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc}vw - ${detail.quoteData.boxTop === 'on' ? '30px' : '15px'})`, top: `calc(${detail.quoteData.topnewHeights * screen / mCalc}vw + ${detail.quoteData.boxTop === 'on' ? '15px' : '0px'})`, position: 'relative' }}>
                        <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                          <div style={{ marginLeft: '-10px', marginTop: (detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{ Number(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights).toFixed(2)}</p></div>
                        </div>
                        <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                      </div>
                        <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(detail.quoteData.bottomnewHeights) * screen / mCalc}vw + 5px)`, top: `calc(${(detail.quoteData.boxHeight - detail.quoteData.bottomnewHeights) * screen / mCalc}vw - ${detail.quoteData.boxTop === 'on' ? '10px' : '10px'})`, position: 'relative' }}>
                          <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                          <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                            <div style={{ marginLeft: '-10px', marginTop: (detail.quoteData.bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{ Number(detail.quoteData.bottomnewHeights).toFixed(2)}</p></div>
                          </div>
                          <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        </div>
                        </>
                      }

                    </div>

                    <div style={{ width: '30px', float: 'left', paddingLeft: detail.quoteData.boxBottom === 'on' || detail.quoteData.boxTop === 'on' ?'0px' : '15px', textAlign: 'left' }}>
                      <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen / mCalc}vw)`, top: '0', position: 'relative' }}>
                        <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                          <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.boxHeight * (screen / mCalc / 2) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{ Number(detail.quoteData.boxHeight).toFixed(2)}</p></div>
                        </div>
                        <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                      </div>
                    </div>

                                          </div>

                                        </div>
                                      </div>

                                    </div>
                                  )}
                     {detail.quoteData.item === 'SlidingWindow' && (
                                    <div class="col-md-12 col-xxl-12 col-xl-12" >
                                      <div class="card" style={{ background: '#fff' }}>
                                        <div class="card-body mb-5">

                                          <div>
                                            <div style={{ float: 'left', width: detail.quoteData.boxWidth * screen / mCalc + 'vw', height: detail.quoteData.boxHeight * screen / mCalc + 'vw', border: '1px solid #333' }}>



                                              {[...Array(detail.quoteData.numFrames)].map((_, index) => (
                                                <div style={{ float: 'left', margin: '5px', border: '1px solid #333', width: `calc(${detail.quoteData.boxWidth * screen / mCalc / detail.quoteData.numFrames + 'vw'} - 12px)`, height: `calc(${detail.quoteData.boxHeight * screen / mCalc + 'vw'} - 12px)` }}>


                                                  {detail.quoteData.boxTop === 'on' && (

                                                    [...Array(detail.quoteData.numTopBoxes)].map((_, index) => (
                                                      <div style={{ display: 'flex', width: `calc(${detail.quoteData.boxWidth * screen / mCalc / detail.quoteData.numFrames + 'vw'} - 23px)`, height: `calc(${(detail.quoteData.topnewHeights * screen / mCalc)}vw )`, margin: '5px' }}>
                                                        {[...Array(detail.quoteData.topFixedNum)].map((_, index) => (
                                                          <div style={{ flex: '1', background: 'lightgreen', width: `calc(${detail.quoteData.topFixedWidth[index] * screen / mCalc / detail.quoteData.numFrames + 'vw'} - 18px)`, height: `calc(${(detail.quoteData.topnewHeights * screen / mCalc)}vw )`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px', }}>

                                                          </div>
                                                        ))}
                                                      </div>
                                                    ))
                                                  )}

                                                  <div style={{ display: 'flex' }}>
                                                    {[...Array(detail.quoteData.numSecondInnerBoxes)].map((_, index) => (

                                                      <div key={index} style={{ flex: '1', height: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc}vw - ${detail.quoteData.boxTop === 'on' ? '30px' : '25px'})`, width: `calc(${detail.quoteData.newWidths[index] * screen / mCalc}vw - 5px - 19px)`, backgroundColor: detail.quoteData.boxColors[index] || 'lightblue', marginTop: detail.quoteData.boxTop === 'on' ? '0px' : '5px', marginRight: index === detail.quoteData.numSecondInnerBoxes - 1 ? '5px' : '2.5px', marginLeft: index === 0 ? '5px' : '2.5px', border: '1px solid #333' }}>


                                                        <div className="expanding-arrow-line" style={{
                                                          position: 'absolute',
                                                          float: 'left',
                                                          width: `calc(${detail.quoteData.newWidths[index] * screen / mCalc}vw - 15px)`,
                                                          bottom: '-10px',
                                                          top: `calc(${detail.quoteData.boxHeight * screen / mCalc}vw - 25px)`,
                                                        }}

                                                        >
                                                          <div className="arrow-left"></div>
                                                          <div className="line" align="center">
                                                            <div style={{ marginTop: '-7px', background: 'white', maxWidth: '60px', textAlign: 'center' }}><p>{typeof detail.quoteData.newWidths[index] === 'number' ? detail.quoteData.newWidths[index].toFixed(2) : detail.quoteData.newWidths[index]}</p></div>
                                                          </div>
                                                          <div className="arrow-right"></div>
                                                        </div>



                                                        <div style={{
                                  height:'7px',
                                  width: '1px',
                                  float: 'right',
                                  right: '0px',
                                  marginTop: `calc(${(detail.quoteData.boxHeight-detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen}vw - ${detail.quoteData.boxTop === 'on' ? '31px' : '26px' } )`,
                                  marginRight: '-1px',
                                  background: index === (detail.quoteData.numSecondInnerBoxes-1) ? 'transparent' : 'black',
                                  }}></div>


                                                        {detail.quoteData.boxNames[index] === 'Shutter' && (detail.quoteData.boxHandle[index] === 'left' ? (
                                                          <img
                                                            src={Handle}
                                                            style={{
                                                              float: 'left',
                                                              marginTop: `calc(${(((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc) / 2)}vw - 20px`,
                                                              marginRight: '2px',
                                                              width: screen === 3 ? '5px' : '4px'
                                                            }}

                                                            alt="Left Handle"
                                                          />
                                                        ) : (
                                                          <img
                                                            src={Handle}
                                                            style={{
                                                              float: 'right',
                                                              marginTop: `calc(${(((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc) / 2)}vw - 20px`,
                                                              marginRight: '2px',
                                                              width: screen === 3 ? '5px' : '4px'
                                                            }}

                                                            alt="Right Handle"
                                                          />

                                                        ))}

                                                        {detail.quoteData.mesh === 'yes' && detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.boxHandle[index] === 'left' && (
                                                          <img src={meshimg} style={{ width: screen === 3 ? '40px' : '20px', float: 'left', marginLeft: screen === 3 ? detail.quoteData.boxHandle[index] === 'left' ? '-8px' : '0px' : detail.quoteData.boxHandle[index] === 'left' ? '-8px' : 'px', marginTop: screen === 3 ? `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc)}vw - ${detail.quoteData.boxTop === 'on' ? '72px' : '67px'} )` : `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc)}vw - 50px)` }} />
                                                        )}

                                                        {detail.quoteData.mesh === 'yes' && detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.boxHandle[index] === 'right' && (
                                                          <img src={meshimg} style={{ width: screen === 3 ? '40px' : '20px', float: 'left', marginLeft: screen === 3 ? detail.quoteData.boxHandle[index] === 'right' ? '-1px' : '0px' : detail.quoteData.boxHandle[index] === 'right' ? '0px' : 'px', marginTop: screen === 3 ? `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc)}vw - ${detail.quoteData.boxTop === 'on' ? '72px' : '67px'} )` : `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc)}vw - 50px)` }} />
                                                        )}

                                                        {detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.grill === 'yes' && createGrill(detail.quoteData.boxHeight, detail.quoteData.topnewHeights, detail.quoteData.bottomnewHeights, mCalc)}

                                                      </div>

                                                    ))}

                                                  </div>


                                                  {detail.quoteData.boxBottom === 'on' && (
                                                    [...Array(detail.quoteData.numBottomBoxes)].map((_, index) => (
                                                      <div style={{ display: 'flex', width: `calc(${detail.quoteData.boxWidth * screen / mCalc / detail.quoteData.numFrames + 'vw'} - 23px)`, height: `calc(${(detail.quoteData.bottomnewHeights * screen / mCalc) + 'vw'} -10px)`, margin: '5px' }}>
                                                        {[...Array(detail.quoteData.bottomFixedNum)].map((_, index) => (
                                                          <div style={{ flex: '1', background: 'lightgreen', width: `calc(${detail.quoteData.bottomFixedNum[index] * screen / mCalc / detail.quoteData.numFrames + 'vw'} - 18px)`, height: `calc(${(detail.quoteData.bottomnewHeights * screen / mCalc) + 'vw'} - 5px)`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px', }}>

                                                          </div>
                                                        ))}
                                                      </div>
                                                    ))
                                                  )}







                                                  {detail.quoteData.numSecondInnerBoxes === 0 ? (
                                                    <div className="expanding-arrow-line" style={{ float: 'left', marginLeft: '-5px', width: ((detail.quoteData.boxWidth / detail.quoteData.numFrames) * screen / mCalc) + 'vw', top: (detail.quoteData.boxHeight - detail.quoteData.topnewHeights) * screen / mCalc + 'vw', }} >
                                                      <div className="arrow-left"></div>
                                                      <div className="line" align="center">
                                                        <div style={{ marginTop: '-8px', background: 'white', maxWidth: '60px', textAlign: 'center' }}><p>{typeof (detail.quoteData.boxWidth / detail.quoteData.numFrames) === 'number' ? (detail.quoteData.boxWidth / detail.quoteData.numFrames).toFixed(2) : (detail.quoteData.boxWidth / detail.quoteData.numFrames)}</p></div>
                                                      </div>
                                                      <div className="arrow-right"></div>
                                                    </div>
                                                  ) : (
                                                    <div className="expanding-arrow-line" style={{ float: 'left', marginLeft: '-5px', width: ((detail.quoteData.boxWidth / detail.quoteData.numFrames) * screen / mCalc) + 'vw', bottom: '-10px', top: '50px', }} >
                                                      <div className="arrow-left"></div>
                                                      <div className="line" align="center">
                                                        <div style={{ marginTop: '-8px', background: 'white', maxWidth: '60px', textAlign: 'center' }}><p>{typeof (detail.quoteData.boxWidth / detail.quoteData.numFrames) === 'number' ? (detail.quoteData.boxWidth / detail.quoteData.numFrames).toFixed(2) : (detail.quoteData.boxWidth / detail.quoteData.numFrames)}</p></div>
                                                      </div>
                                                      <div className="arrow-right"></div>
                                                    </div>
                                                  )}

                                                </div>
                                              ))}
                                            </div>





                                            <div style={{ width: '45px', float: 'left', paddingLeft: '15px', textAlign: 'left' }}>
                      {detail.quoteData.boxTop === 'on' &&
                      <>
                        <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.topnewHeights * screen / mCalc}vw + 10px)`, top: '0', position: 'relative' }}>
                          <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                          <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                            <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.topnewHeights * (screen / mCalc / 2) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{typeof detail.quoteData.topnewHeights === 'number' ? detail.quoteData.topnewHeights.toFixed(2) : detail.quoteData.topnewHeights}</p></div>
                          </div>
                          <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        </div>
                      
                      <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc}vw - ${detail.quoteData.boxTop === 'on' ? '30px' : '15px'})`, top: `calc(${detail.quoteData.topnewHeights * screen / mCalc}vw + ${detail.quoteData.boxTop === 'on' ? '15px' : '0px'})`, position: 'relative' }}>
                        <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                          <div style={{ marginLeft: '-10px', marginTop: (detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{ Number(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights).toFixed(2)}</p></div>
                        </div>
                        <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                      </div>
                      </>
                     }
                      {detail.quoteData.boxBottom === 'on' &&
                      <>
                        <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / mCalc}vw - ${detail.quoteData.boxTop === 'on' ? '30px' : '15px'})`, top: `calc(${detail.quoteData.topnewHeights * screen / mCalc}vw + ${detail.quoteData.boxTop === 'on' ? '15px' : '0px'})`, position: 'relative' }}>
                        <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                          <div style={{ marginLeft: '-10px', marginTop: (detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{ Number(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights).toFixed(2)}</p></div>
                        </div>
                        <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                      </div>
                        <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(detail.quoteData.bottomnewHeights) * screen / mCalc}vw + 5px)`, top: `calc(${(detail.quoteData.boxHeight - detail.quoteData.bottomnewHeights) * screen / mCalc}vw - ${detail.quoteData.boxTop === 'on' ? '10px' : '10px'})`, position: 'relative' }}>
                          <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                          <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                            <div style={{ marginLeft: '-10px', marginTop: (detail.quoteData.bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{ Number(detail.quoteData.bottomnewHeights).toFixed(2)}</p></div>
                          </div>
                          <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        </div>
                        </>
                      }

                    </div>

                    <div style={{ width: '30px', float: 'left', paddingLeft: detail.quoteData.boxBottom === 'on' || detail.quoteData.boxTop === 'on' ?'0px' : '15px', textAlign: 'left' }}>
                      <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen / mCalc}vw)`, top: '0', position: 'relative' }}>
                        <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                          <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.boxHeight * (screen / mCalc / 2) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{ Number(detail.quoteData.boxHeight).toFixed(2)}</p></div>
                        </div>
                        <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                      </div>
                    </div>

                                          </div>






                                        </div>
                                      </div>
                                    </div>
                                  )}

{detail.quoteData.item === 'Ventilator' && (
                                    <div class="col-md-12 col-xxl-12 col-xl-12" >
                                      <div class="card" style={{ background: '#fff' }}>
                                        <div class="card-body mb-5">
                                          {detail.quoteData.boxHeight > 1 && detail.quoteData.boxWidth > 1 && (

                                            detail.quoteData.fan === 'on' ? (
                                              <>

                                                <div style={{ float: 'left', width: detail.quoteData.boxWidth * screen + 'vw', height: detail.quoteData.boxHeight * screen + 'vw', border: '1px solid #333' }}>

                                                  {detail.quoteData.fanTop === 'Top' && detail.quoteData.fanLeft === 'Left' && divider === 'Vertical' && switchs === 'on' && (
                                                    <div style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border: '1px solid #333' }}>
                                                      <img src={Fan} style={{ float: 'left', width: (detail.quoteData.boxWidth > 1.25 ? .75 : .45) * screen + 'vw', marginLeft: '4px', marginTop: '4px' }} />
                                                      <div style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 20px)`, width: `calc(${(detail.quoteData.boxWidth - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 26px)`, margin: '5px', border: '1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(6 / detail.quoteData.boxHeight) * screen}%, lightblue ${(6 / detail.quoteData.boxHeight) * screen}%)` }}></div>
                                                      <div style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth > 1.25 ? .85 : .55) * screen}vw - 0px)`, margin: '4px', marginTop: `calc(-${(detail.quoteData.boxHeight - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw + 20px)`, border: '1px solid #333', background: 'lightblue' }}></div>
                                                    </div>
                                                  )}

                                                  {detail.quoteData.fanTop === 'Bottom' && detail.quoteData.fanLeft === 'Left' && divider === 'Vertical' && switchs === 'on' && (
                                                    <div style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border: '1px solid #333' }}>
                                                      <div style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth > 1.25 ? .85 : .55) * screen}vw - 0px)`, margin: '4px', marginTop: '5px', border: '1px solid #333', background: 'lightblue' }}></div>
                                                      <div style={{ float: 'right', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 20px)`, width: `calc(${(detail.quoteData.boxWidth - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 26px)`, margin: '5px', marginTop: `calc(-${(detail.quoteData.boxHeight - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw + 20px)`, border: '1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(6 / detail.quoteData.boxHeight) * screen}%, lightblue ${(6 / detail.quoteData.boxHeight) * screen}%)` }}></div>
                                                      <img src={Fan} style={{ float: 'left', width: (detail.quoteData.boxWidth > 1.25 ? .75 : .45) * screen + 'vw', marginLeft: '4px', marginBottom: '4px' }} />
                                                    </div>
                                                  )}

                                                  {detail.quoteData.fanTop === 'Top' && detail.quoteData.fanLeft === 'Right' && divider === 'Vertical' && switchs === 'on' && (
                                                    <div style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border: '1px solid #333' }}>
                                                      <img src={Fan} style={{ float: 'right', width: (detail.quoteData.boxWidth > 1.25 ? .75 : .45) * screen + 'vw', marginRight: '4px', marginTop: '4px' }} />
                                                      <div style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 20px)`, width: `calc(${(detail.quoteData.boxWidth - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 26px)`, margin: '5px', border: '1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(6 / detail.quoteData.boxHeight) * screen}%, lightblue ${(6 / detail.quoteData.boxHeight) * screen}%)` }}></div>
                                                      <div style={{ float: 'right', height: `calc(${(detail.quoteData.boxHeight - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth > 1.25 ? .85 : .55) * screen}vw - 0px)`, margin: '4px', marginTop: `calc(-${(detail.quoteData.boxHeight - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw + 20px)`, border: '1px solid #333', background: 'lightblue' }}></div>
                                                    </div>
                                                  )}

                                                  {detail.quoteData.fanTop === 'Bottom' && detail.quoteData.fanLeft === 'Right' && divider === 'Vertical' && switchs === 'on' && (
                                                    <div style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border: '1px solid #333' }}>
                                                      <div style={{ float: 'right', height: `calc(${(detail.quoteData.boxHeight - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth > 1.25 ? .85 : .55) * screen}vw - 0px)`, margin: '4px', marginTop: '5px', border: '1px solid #333', background: 'lightblue' }}></div>
                                                      <div style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 20px)`, width: `calc(${(detail.quoteData.boxWidth - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 26px)`, margin: '5px', marginTop: `calc(-${(detail.quoteData.boxHeight - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw + 20px)`, border: '1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(6 / detail.quoteData.boxHeight) * screen}%, lightblue ${(6 / detail.quoteData.boxHeight) * screen}%)` }}></div>
                                                      <img src={Fan} style={{ float: 'right', width: (detail.quoteData.boxWidth > 1.25 ? .75 : .45) * screen + 'vw', marginRight: '4px', marginBottom: '4px' }} />
                                                    </div>
                                                  )}

                                                  {detail.quoteData.fanTop === 'Top' && detail.quoteData.fanLeft === 'Left' && divider === 'Vertical' && switchs === 'off' && (
                                                    <div style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border: '1px solid #333' }}>
                                                      <img src={Fan} style={{ float: 'left', width: (detail.quoteData.boxWidth > 1.25 ? .75 : .45) * screen + 'vw', marginLeft: '4px', marginTop: '4px' }} />
                                                      <div style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 20px)`, width: `calc(${(detail.quoteData.boxWidth - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 26px)`, margin: '5px', border: '1px solid #333', background: 'lightblue' }}></div>
                                                      <div style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth > 1.25 ? .85 : .55) * screen}vw - 0px)`, margin: '4px', marginTop: `calc(-${(detail.quoteData.boxHeight - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw + 20px)`, border: '1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10 / detail.quoteData.boxHeight) * screen}%, lightblue ${(10 / detail.quoteData.boxHeight) * screen}%)` }}></div>
                                                    </div>
                                                  )}

                                                  {detail.quoteData.fanTop === 'Bottom' && detail.quoteData.fanLeft === 'Left' && divider === 'Vertical' && switchs === 'off' && (
                                                    <div style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border: '1px solid #333' }}>
                                                      <div style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth > 1.25 ? .85 : .55) * screen}vw - 0px)`, margin: '4px', marginTop: '5px', border: '1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10 / detail.quoteData.boxHeight) * screen}%, lightblue ${(10 / detail.quoteData.boxHeight) * screen}%)` }}></div>
                                                      <div style={{ float: 'right', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 20px)`, width: `calc(${(detail.quoteData.boxWidth - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 26px)`, margin: '5px', marginTop: `calc(-${(detail.quoteData.boxHeight - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw + 20px)`, border: '1px solid #333', background: 'lightblue' }}></div>
                                                      <img src={Fan} style={{ float: 'left', width: (detail.quoteData.boxWidth > 1.25 ? .75 : .45) * screen + 'vw', marginLeft: '4px', marginBottom: '4px' }} />
                                                    </div>
                                                  )}

                                                  {detail.quoteData.fanTop === 'Top' && detail.quoteData.fanLeft === 'Right' && divider === 'Vertical' && switchs === 'off' && (
                                                    <div style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border: '1px solid #333' }}>
                                                      <img src={Fan} style={{ float: 'right', width: (detail.quoteData.boxWidth > 1.25 ? .75 : .45) * screen + 'vw', marginRight: '4px', marginTop: '4px' }} />
                                                      <div style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 20px)`, width: `calc(${(detail.quoteData.boxWidth - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 26px)`, margin: '5px', border: '1px solid #333', background: 'lightblue' }}></div>
                                                      <div style={{ float: 'right', height: `calc(${(detail.quoteData.boxHeight - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth > 1.25 ? .85 : .55) * screen}vw - 0px)`, margin: '4px', marginTop: `calc(-${(detail.quoteData.boxHeight - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw + 20px)`, border: '1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10 / detail.quoteData.boxHeight) * screen}%, lightblue ${(10 / detail.quoteData.boxHeight) * screen}%)` }}></div>
                                                    </div>
                                                  )}

                                                  {detail.quoteData.fanTop === 'Bottom' && detail.quoteData.fanLeft === 'Right' && divider === 'Vertical' && switchs === 'off' && (
                                                    <div style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border: '1px solid #333' }}>
                                                      <div style={{ float: 'right', height: `calc(${(detail.quoteData.boxHeight - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth > 1.25 ? .85 : .55) * screen}vw - 0px)`, margin: '4px', marginTop: '5px', border: '1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10 / detail.quoteData.boxHeight) * screen}%, lightblue ${(10 / detail.quoteData.boxHeight) * screen}%)` }}></div>
                                                      <div style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 20px)`, width: `calc(${(detail.quoteData.boxWidth - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 26px)`, margin: '5px', marginTop: `calc(-${(detail.quoteData.boxHeight - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw + 20px)`, border: '1px solid #333', background: 'lightblue' }}></div>
                                                      <img src={Fan} style={{ float: 'right', width: (detail.quoteData.boxWidth > 1.25 ? .75 : .45) * screen + 'vw', marginRight: '4px', marginBottom: '4px' }} />
                                                    </div>
                                                  )}

                                                  {detail.quoteData.fanTop === 'Top' && detail.quoteData.fanLeft === 'Left' && divider === 'Horizontal' && switchs === 'on' && (
                                                    <div style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border: '1px solid #333' }}>
                                                      <img src={Fan} style={{ float: 'left', width: (detail.quoteData.boxWidth > 1.25 ? .75 : .45) * screen + 'vw', marginLeft: '4px', marginTop: '4px' }} />
                                                      <div style={{ float: 'right', height: `calc(${(detail.quoteData.boxWidth > 1.25 ? .85 : .55) * screen}vw - 0px)`, width: `calc(${(detail.quoteData.boxWidth - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 26px)`, margin: '5px', border: '1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10 / detail.quoteData.boxHeight) * screen}%, lightblue ${(10 / detail.quoteData.boxHeight) * screen}%)` }}></div>
                                                      <div style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth) * screen}vw - 20px)`, margin: '4px', marginTop: '0px', border: '1px solid #333', background: 'lightblue' }}></div>
                                                    </div>
                                                  )}

                                                  {detail.quoteData.fanTop === 'Bottom' && detail.quoteData.fanLeft === 'Left' && divider === 'Horizontal' && switchs === 'on' && (
                                                    <div style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border: '1px solid #333' }}>
                                                      <div style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth) * screen}vw - 20px)`, margin: '4px', marginTop: '5px', border: '1px solid #333', background: 'lightblue' }}></div>
                                                      <div style={{ float: 'right', height: `calc(${(detail.quoteData.boxWidth > 1.25 ? .85 : .55) * screen}vw - 0px)`, width: `calc(${(detail.quoteData.boxWidth - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 26px)`, marginRight: '5px', marginBottom: '4px', border: '1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10 / detail.quoteData.boxHeight) * screen}%, lightblue ${(10 / detail.quoteData.boxHeight) * screen}%)` }}></div>
                                                      <img src={Fan} style={{ float: 'left', width: (detail.quoteData.boxWidth > 1.25 ? .75 : .45) * screen + 'vw', marginLeft: '4px', marginBottom: '4px' }} />
                                                    </div>
                                                  )}

                                                  {detail.quoteData.fanTop === 'Top' && detail.quoteData.fanLeft === 'Right' && divider === 'Horizontal' && switchs === 'on' && (
                                                    <div style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border: '1px solid #333' }}>
                                                      <img src={Fan} style={{ float: 'right', width: (detail.quoteData.boxWidth > 1.25 ? .75 : .45) * screen + 'vw', marginRight: '4px', marginTop: '4px' }} />
                                                      <div style={{ float: 'left', height: `calc(${(detail.quoteData.boxWidth > 1.25 ? .85 : .55) * screen}vw - 0px)`, width: `calc(${(detail.quoteData.boxWidth - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 26px)`, margin: '5px', border: '1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10 / detail.quoteData.boxHeight) * screen}%, lightblue ${(10 / detail.quoteData.boxHeight) * screen}%)` }}></div>
                                                      <div style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth) * screen}vw - 20px)`, margin: '4px', marginTop: '0px', border: '1px solid #333', background: 'lightblue' }}></div>
                                                    </div>
                                                  )}

                                                  {detail.quoteData.fanTop === 'Bottom' && detail.quoteData.fanLeft === 'Right' && divider === 'Horizontal' && switchs === 'on' && (
                                                    <div style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border: '1px solid #333' }}>
                                                      <div style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth) * screen}vw - 20px)`, margin: '4px', marginTop: '5px', border: '1px solid #333', background: 'lightblue' }}></div>
                                                      <div style={{ float: 'left', height: `calc(${(detail.quoteData.boxWidth > 1.25 ? .85 : .55) * screen}vw - 0px)`, width: `calc(${(detail.quoteData.boxWidth - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 26px)`, marginLeft: '5px', marginBottom: '4px', border: '1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10 / detail.quoteData.boxHeight) * screen}%, lightblue ${(10 / detail.quoteData.boxHeight) * screen}%)` }}></div>
                                                      <img src={Fan} style={{ float: 'right', width: (detail.quoteData.boxWidth > 1.25 ? .75 : .45) * screen + 'vw', marginRight: '4px', marginBottom: '4px' }} />
                                                    </div>
                                                  )}

                                                  {detail.quoteData.fanTop === 'Top' && detail.quoteData.fanLeft === 'Left' && divider === 'Horizontal' && switchs === 'off' && (
                                                    <div style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border: '1px solid #333' }}>
                                                      <img src={Fan} style={{ float: 'left', width: (detail.quoteData.boxWidth > 1.25 ? .75 : .45) * screen + 'vw', marginLeft: '4px', marginTop: '4px' }} />
                                                      <div style={{ float: 'right', height: `calc(${(detail.quoteData.boxWidth > 1.25 ? .85 : .55) * screen}vw - 0px)`, width: `calc(${(detail.quoteData.boxWidth - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 26px)`, margin: '5px', border: '1px solid #333', background: 'lightblue' }}></div>
                                                      <div style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth) * screen}vw - 20px)`, margin: '4px', marginTop: '0px', border: '1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10 / detail.quoteData.boxHeight) * screen}%, lightblue ${(10 / detail.quoteData.boxHeight) * screen}%)` }}></div>
                                                    </div>
                                                  )}

                                                  {detail.quoteData.fanTop === 'Top' && detail.quoteData.fanLeft === 'Right' && divider === 'Horizontal' && switchs === 'off' && (
                                                    <div style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border: '1px solid #333' }}>
                                                      <img src={Fan} style={{ float: 'right', width: (detail.quoteData.boxWidth > 1.25 ? .75 : .45) * screen + 'vw', marginRight: '4px', marginTop: '4px' }} />
                                                      <div style={{ float: 'left', height: `calc(${(detail.quoteData.boxWidth > 1.25 ? .85 : .55) * screen}vw - 0px)`, width: `calc(${(detail.quoteData.boxWidth - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 26px)`, margin: '5px', border: '1px solid #333', background: 'lightblue' }}></div>
                                                      <div style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth) * screen}vw - 20px)`, margin: '4px', marginTop: '0px', border: '1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10 / detail.quoteData.boxHeight) * screen}%, lightblue ${(10 / detail.quoteData.boxHeight) * screen}%)` }}></div>
                                                    </div>
                                                  )}

                                                  {detail.quoteData.fanTop === 'Bottom' && detail.quoteData.fanLeft === 'Right' && divider === 'Horizontal' && switchs === 'off' && (
                                                    <div style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border: '1px solid #333' }}>
                                                      <div style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth) * screen}vw - 20px)`, margin: '4px', marginTop: '5px', border: '1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10 / detail.quoteData.boxHeight) * screen}%, lightblue ${(10 / detail.quoteData.boxHeight) * screen}%)` }}></div>
                                                      <img src={Fan} style={{ float: 'right', width: (detail.quoteData.boxWidth > 1.25 ? .75 : .45) * screen + 'vw', marginRight: '4px', marginTop: '0px' }} />
                                                      <div style={{ float: 'left', height: `calc(${(detail.quoteData.boxWidth > 1.25 ? .85 : .55) * screen}vw - 0px)`, width: `calc(${(detail.quoteData.boxWidth - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 26px)`, marginLeft: '4px', border: '1px solid #333', background: 'lightblue' }}></div>
                                                    </div>
                                                  )}

                                                  {detail.quoteData.fanTop === 'Bottom' && detail.quoteData.fanLeft === 'Left' && divider === 'Horizontal' && switchs === 'off' && (
                                                    <div style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border: '1px solid #333' }}>
                                                      <div style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth) * screen}vw - 20px)`, margin: '4px', marginTop: '5px', border: '1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10 / detail.quoteData.boxHeight) * screen}%, lightblue ${(10 / detail.quoteData.boxHeight) * screen}%)` }}></div>
                                                      <img src={Fan} style={{ float: 'left', width: (detail.quoteData.boxWidth > 1.25 ? .75 : .45) * screen + 'vw', marginLeft: '4px', marginRight: '4px' }} />
                                                      <div style={{ float: 'right', height: `calc(${(detail.quoteData.boxWidth > 1.25 ? .85 : .55) * screen}vw - 0px)`, width: `calc(${(detail.quoteData.boxWidth - (detail.quoteData.boxWidth > 1.25 ? .85 : .55)) * screen}vw - 26px)`, marginRight: '5px', border: '1px solid #333', background: 'lightblue' }}></div>
                                                    </div>
                                                  )}

                                                </div>

                                              </>

                                            ) : (
                                              <>
                                                <div style={{ float: 'left', width: detail.quoteData.boxWidth * screen + 'vw', height: detail.quoteData.boxHeight * screen + 'vw', border: '1px solid #333' }}>
                                                  {detail.quoteData.switchFixed === 'on' ? (
                                                    <div style={{ float: 'right', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 12px)`, width: `calc(${(detail.quoteData.boxWidth) * screen}vw - 12px)`, marginRight: '5px', marginTop: '5px', background: 'lightblue', border: '1px solid #333' }}></div>
                                                  ) : (
                                                    <>
                                                      <div style={{ float: 'right', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 12px)`, width: `calc(${(detail.quoteData.boxWidth) * screen}vw - 12px)`, marginRight: '5px', marginTop: '5px', backgroundImage: `repeating-linear-gradient(lightblue, white ${(6 / detail.quoteData.boxHeight) * screen}%, lightblue ${(6 / detail.quoteData.boxHeight) * screen}%)`, border: '1px solid #333' }}></div>
                                                    </>
                                                  )}

                                                </div>
                                              </>
                                            )
                                          )}

                                          {detail.quoteData.boxHeight === 1 && detail.quoteData.boxWidth > 1 && (

                                            detail.quoteData.fan === 'on' ? (
                                              <>
                                                {detail.quoteData.switchFixed === 'on' && (

                                                  <div style={{ float: 'left', width: detail.quoteData.boxWidth * screen + 'vw', height: detail.quoteData.boxHeight * screen + 'vw', border: '1px solid #333' }}>
                                                    <div style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border: '1px solid #333' }}>
                                                      <img src={Fan} style={{ float: 'left', width: .75 * screen + 'vw', margin: '4px', }} />
                                                      <div style={{ float: 'right', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 22px)`, width: `calc(${(detail.quoteData.boxWidth - .94) * screen}vw - 10px)`, marginRight: '5px', marginTop: '5px', background: 'lightblue', border: '1px solid #333' }}></div>
                                                    </div>
                                                  </div>
                                                )}

                                                {detail.quoteData.switchFixed === 'off' && (

                                                  <div style={{ float: 'left', width: detail.quoteData.boxWidth * screen + 'vw', height: detail.quoteData.boxHeight * screen + 'vw', border: '1px solid #333' }}>
                                                    <div style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border: '1px solid #333' }}>
                                                      <img src={Fan} style={{ float: 'left', width: .75 * screen + 'vw', margin: '4px', }} />
                                                      <div style={{ float: 'right', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 22px)`, width: `calc(${(detail.quoteData.boxWidth - .94) * screen}vw - 10px)`, marginRight: '5px', marginTop: '5px', backgroundImage: `repeating-linear-gradient(lightblue, white ${(6 / detail.quoteData.boxHeight) * screen}%, lightblue ${(6 / detail.quoteData.boxHeight) * screen}%)`, border: '1px solid #333' }}></div>
                                                    </div>
                                                  </div>
                                                )}
                                              </>
                                            ) : (

                                              <div style={{ float: 'left', width: detail.quoteData.boxWidth * screen + 'vw', height: detail.quoteData.boxHeight * screen + 'vw', border: '1px solid #333' }}>
                                                {detail.quoteData.switchFixed === 'off' ?
                                                  <div style={{ float: 'right', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 12px)`, width: `calc(${(detail.quoteData.boxWidth) * screen}vw - 10px)`, marginRight: '5px', marginTop: '5px', backgroundImage: `repeating-linear-gradient(lightblue, white ${(6 / detail.quoteData.boxHeight) * screen}%, lightblue ${(6 / detail.quoteData.boxHeight) * screen}%)`, border: '1px solid #333' }}></div>
                                                  :
                                                  <div style={{ float: 'right', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 12px)`, width: `calc(${(detail.quoteData.boxWidth) * screen}vw - 10px)`, marginRight: '5px', marginTop: '5px', background: 'lightblue', border: '1px solid #333' }}></div>
                                                }
                                              </div>

                                            )

                                          )}

                                          {detail.quoteData.boxHeight >= 1 && detail.quoteData.boxWidth == 1 && (
                                            detail.quoteData.fan === 'on' ? (
                                              <>
                                                {detail.quoteData.switchFixed === 'on' && (
                                                  <div style={{ float: 'left', width: detail.quoteData.boxWidth * screen + 'vw', height: detail.quoteData.boxHeight * screen + 'vw', border: '1px solid #333' }}>
                                                    <div style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border: '1px solid #333' }}>
                                                      <img src={Fan} style={{ float: 'left', width: .75 * screen + 'vw', margin: '4px', }} />
                                                      <div style={{ float: 'right', height: `calc(${(detail.quoteData.boxHeight - .75) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth) * screen}vw - 20px)`, marginRight: '5px', background: 'lightblue', border: '1px solid #333' }}></div>
                                                    </div>
                                                  </div>
                                                )}

                                                {detail.quoteData.switchFixed === 'off' && (
                                                  <div style={{ float: 'left', width: detail.quoteData.boxWidth * screen + 'vw', height: detail.quoteData.boxHeight * screen + 'vw', border: '1px solid #333' }}>
                                                    <div style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border: '1px solid #333' }}>
                                                      <img src={Fan} style={{ float: 'left', width: .75 * screen + 'vw', margin: '4px', }} />
                                                      <div style={{ float: 'right', height: `calc(${(detail.quoteData.boxHeight - .75) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth) * screen}vw - 20px)`, marginRight: '5px', backgroundImage: `repeating-linear-gradient(lightblue, white ${(6 / detail.quoteData.boxHeight) * screen}%, lightblue ${(6 / detail.quoteData.boxHeight) * screen}%)`, border: '1px solid #333' }}></div>
                                                    </div>
                                                  </div>
                                                )}
                                              </>
                                            ) : (
                                              <div style={{ float: 'left', width: detail.quoteData.boxWidth * screen + 'vw', height: detail.quoteData.boxHeight * screen + 'vw', border: '1px solid #333' }}>
                                                {detail.quoteData.switchFixed === 'off' ?
                                                  <div style={{ float: 'right', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 12px)`, width: `calc(${(detail.quoteData.boxWidth) * screen}vw - 12px)`, marginRight: '5px', marginTop: '5px', backgroundImage: `repeating-linear-gradient(lightblue, white ${(6 / detail.quoteData.boxHeight) * screen}%, lightblue ${(6 / detail.quoteData.boxHeight) * screen}%)`, border: '1px solid #333' }}></div>
                                                  :
                                                  <div style={{ float: 'right', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 12px)`, width: `calc(${(detail.quoteData.boxWidth) * screen}vw - 12px)`, marginRight: '5px', marginTop: '5px', background: 'lightblue', border: '1px solid #333' }}></div>
                                                }
                                              </div>
                                            )
                                          )}

                                          {(detail.quoteData.boxWidth > 1 || detail.quoteData.boxHeight > 1) && (
                                            <>
                                              <div className="expanding-arrow-line" style={{
                                                position: 'absolute',
                                                float: 'left',
                                                width: `calc(${detail.quoteData.boxWidth * screen}vw )`,
                                                bottom: '-10px',
                                                top: `calc(${detail.quoteData.boxHeight * screen}vw - 25px)`,
                                              }}>
                                                <div className="arrow-left"></div>
                                                <div className="line" align="center">
                                                  <div style={{ marginTop: '-7px', background: 'white', maxWidth: '20px', textAlign: 'center' }}><p>{typeof detail.quoteData.boxWidth === 'number' ? detail.quoteData.boxWidth.toFixed(2) : detail.quoteData.boxWidth}</p></div>
                                                </div>
                                                <div className="arrow-right"></div>
                                              </div>

                                              <div style={{ width: '30px', float: 'left', paddingLeft: '15px', textAlign: 'left' }}>
                                                <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw)`, top: '0', position: 'relative' }}>
                                                  <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                                                  <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                                                    <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.boxHeight * (screen / 2) + 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{ width: '20px' }}>{typeof detail.quoteData.boxHeight === 'number' ? detail.quoteData.boxHeight.toFixed(2) : detail.quoteData.boxHeight}</p></div>
                                                  </div>
                                                  <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                                                </div>
                                              </div>
                                            </>
                                          )}


                                        </div>
                                      </div>
                                    </div>

                                  )}

                  </div>
                ))}
              </div>
            ))}


            <div class="card mb-3">
              <div class="card-body">

                <div class="row">
                  <div class="col-12">
                    <div class="d-grid" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    ><a
                      class="btn btn-outline-secondary"
                      href="/select"

                    ><i class="ti ti-plus"></i> Add</a ></div>
                  </div>
                </div>
              </div>
            </div>
          </>) : (<>
            <div class="card mb-3">
              <div class="card-body">

                <div class="row">
                  <div class="col-12">
                    <div class="d-grid" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    ><a
                      class="btn btn-outline-secondary"
                      href="/create-quotation"
                    ><i class="ti ti-plus"></i> Quote</a ></div>
                  </div>
                </div>
              </div>
            </div>
          </>)}


        </div>
      </div>

    </>

  );
};

export default Navbar;