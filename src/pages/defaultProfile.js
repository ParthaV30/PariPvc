import { getMergedProfileDetails } from '../services/profileManager';
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
    const [defaultProfile, setDefaultProfile] = useState(null);
    const [profileDetails, setProfileData] = useState(() => getMergedProfileDetails(null));
    const [series, setSeries] = useState(null);
    const [customProfile, setCustomProfile] = useState(0);
    const [boxWidth, setBoxWidth] = useState(0);
    const [boxHeight, setBoxHeight] = useState(0);
    const [design, setDesign] = useState(0);
    const [shutterCount, setShutter] = useState(0);
    const [mesh, setMesh] = useState('no');


    const fetchDatalog = async () => {
      try {
        const response = await axios.post(`https://upvcapi.sninfoserv.com/log/`, {userId, coreData});
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    
        const fetchData = async () => {
          try {
            const response = await axios.get('https://upvcapi.sninfoserv.com/default-profile/');
            if(response.data.status === 'success'){
              setDefaultProfile(response.data.data);
            }
            
          } catch (error) { setProfileData(getMergedProfileDetails(null)); } 
        };

      useEffect(() => {
        fetchData();
      }, []);

      useEffect(() => {
        const fetchProfileData = async () => {
          try {
            const response = await axios.post('https://upvcapi.sninfoserv.com/profiles/', user);
            setProfileData(getMergedProfileDetails(response.data));
            //console.log(response.data);
          } catch (error) { setProfileData(getMergedProfileDetails(null)); } 
        };
    
        fetchProfileData();
      }, []);
      

      const handleWidthChange = (event) => {
        const id = event.target.value;
        setBoxWidth(id);
      };

      const handleShutterChange = (event) => {
        const id = event.target.value;
        setShutter(id);
      };

      const handleHeightChange = (event) => {
        const id = event.target.value;
        setBoxHeight(id);
      };
      
      const handleDesignChange = (event) => {
        const id = event.target.value;
        setDesign(id);
      };

      const handleSeriesChange = (event) => {
        const id = event.target.value;
        setSeries(id);
      };

      const meshChange = (mesh) =>{
        if(mesh === 'yes'){
            setMesh('no');
        }else{
            setMesh('yes');
        }
      };


      const handleProfileChange = (event) => {
        setCustomProfile(event.target.value);
        setSelectedFrameSeries(null);
        setSelectedFrameId(null);
        setSelectedShutterSeries(null);
        setSelectedShutterId(null);
        setSelectedMullionSeries(null);
        setSelectedMullionId(null);
        setSelectedBeedingSeries(null);
        setSelectedBeedingId(null);
        setSelectedMeshSeries(null);
        setSelectedMeshId(null);
        setSelectedCuplerSeries(null);
        setSelectedCuplerId(null);
        setSelectedInterLockSeries(null);
        setSelectedInterLockId(null); 
        setSelectedPanelSeries(null);
        setSelectedPanelId(null);
      };

      const profileData = profileDetails?.data?.[customProfile]?.profileData || [];
      const selectedProfile = profileDetails?.data?.[customProfile]?.profileName || '';

      const [selectedFrameSeries, setSelectedFrameSeries] = useState(null);
      const [selectedFrameId, setSelectedFrameId] = useState(null);

      const handleFrameIdChange = (event) => {
        const id = event.target.value;
        setSelectedFrameId(id);
      };

      const handleFrameSeriesChange = (event) => {
        const seriesId = event.target.value;
        setSelectedFrameSeries(seriesId);
        setSelectedFrameId();
      };

      const seriesDataFrame = profileData && profileData.find(serieses => serieses.series === selectedFrameSeries);

      const [selectedShutterSeries, setSelectedShutterSeries] = useState(null);
      const [selectedShutterId, setSelectedShutterId] = useState(null);
  
      const handleShutterSeriesChange = (event) => {
        const seriesId = event.target.value;
        setSelectedShutterSeries(seriesId);
        setSelectedShutterId(null); 
      };

      const handleShutterIdChange = (event) => {
        const id = event.target.value;
        setSelectedShutterId(id);
      };

      const seriesDataShutter = profileData && profileData.find(serieses => serieses.series === selectedShutterSeries);

      const [selectedMullionSeries, setSelectedMullionSeries] = useState(null);
      const [selectedMullionId, setSelectedMullionId] = useState(null);
  
      const handleMullionSeriesChange = (event) => {
        const seriesId = event.target.value;
        setSelectedMullionSeries(seriesId);
        setSelectedMullionId(null); 
      };

      const handleMullionIdChange = (event) => {
        const id = event.target.value;
        setSelectedMullionId(id);
      };

      const seriesDataMullion = profileData && profileData.find(serieses => serieses.series === selectedMullionSeries);

      const [selectedBeedingSeries, setSelectedBeedingSeries] = useState(null);
      const [selectedBeedingId, setSelectedBeedingId] = useState(null);
  
      const handleBeedingSeriesChange = (event) => {
        const seriesId = event.target.value;
        setSelectedBeedingSeries(seriesId);
        setSelectedBeedingId(null); 
      };

      const handleBeedingIdChange = (event) => {
        const id = event.target.value;
        setSelectedBeedingId(id);
      };

      const seriesDataBeeding = profileData && profileData.find(serieses => serieses.series === selectedBeedingSeries);

      const [selectedCuplerSeries, setSelectedCuplerSeries] = useState(null);
      const [selectedCuplerId, setSelectedCuplerId] = useState(null);
  
      const handleCuplerSeriesChange = (event) => {
        const seriesId = event.target.value;
        setSelectedCuplerSeries(seriesId);
        setSelectedCuplerId(null); 
      };

      const handleCuplerIdChange = (event) => {
        const id = event.target.value;
        setSelectedCuplerId(id);
      };

      const seriesDataCupler = profileData && profileData.find(serieses => serieses.series === selectedCuplerSeries);

      const [selectedMeshSeries, setSelectedMeshSeries] = useState(null);
      const [selectedMeshId, setSelectedMeshId] = useState(null);
  
      const handleMeshSeriesChange = (event) => {
        const seriesId = event.target.value;
        setSelectedMeshSeries(seriesId);
        setSelectedMeshId(null); 
      };

      const handleMeshIdChange = (event) => {
        const id = event.target.value;
        setSelectedMeshId(id);
      };

      const seriesDataMesh = profileData && profileData.find(serieses => serieses.series === selectedMeshSeries);

      const [selectedInterLockSeries, setSelectedInterLockSeries] = useState(null);
      const [selectedInterLockId, setSelectedInterLockId] = useState(null);
  
      const handleInterLockSeriesChange = (event) => {
        const seriesId = event.target.value;
        setSelectedInterLockSeries(seriesId);
        setSelectedInterLockId(null); 
      };

      const handleInterLockIdChange = (event) => {
        const id = event.target.value;
        setSelectedInterLockId(id);
      };

      const seriesDataInterLock = profileData && profileData.find(serieses => serieses.series === selectedInterLockSeries);

      const [selectedPanelSeries, setSelectedPanelSeries] = useState(null);
      const [selectedPanelId, setSelectedPanelId] = useState(null);
  
      const handlePanelChange = (event) => {
        const seriesId = event.target.value;
        setSelectedPanelSeries(seriesId);
        setSelectedPanelId(null); 
      };

      const handlePanelIdChange = (event) => {
        const id = event.target.value;
        setSelectedPanelId(id);
      };

      const seriesDataPanel = profileData && profileData.find(serieses => serieses.series === selectedPanelSeries);


      const coreData = {
        boxWidth,
        boxHeight,
        design,
        series,
        selectedProfile,
        selectedFrameId,
        selectedShutterId,
        selectedMullionId,
        selectedBeedingId,
        selectedCuplerId,
        selectedMeshId,
        selectedInterLockId,
        selectedPanelId,
        shutterCount,
        mesh,
        selectedFrameSeries,
        selectedShutterSeries,
        selectedMullionSeries,
        selectedBeedingSeries,
        selectedCuplerSeries,
        selectedMeshSeries,
        selectedInterLockSeries,
        selectedPanelSeries
      }
      
      //console.log(coreData);
    
      const uploadData = async () => {
        fetchDatalog();
        alert('Data Uploading...');
        try {
            const response = await axios.post('https://upvcapi.sninfoserv.com/default-profile/', coreData);
            if(response.data.status === 'success'){
              fetchData();
            }
            
        } catch (error) { setProfileData(getMergedProfileDetails(null)); } 
        
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
                    <div class="col-2 mb-2 mt-3">
                      <p>Width in Feet</p>
                      <input type="text" class="form-control" value={boxWidth} onChange={handleWidthChange} />
                    </div>
                    <div class="col-2 mb-2 mt-3">
                      <p>Height in Feet</p>
                      <input type="text" class="form-control" value={boxHeight} onChange={handleHeightChange} />
                    </div>
                    <div class="col-2 mb-2 mt-3">
                    <p>Select Series</p>
                      <select className="form-control" value={series} onChange={handleSeriesChange}>
                      <option value="" hidden>Select Series</option>
                      <option className="form-control" value="50 Series">50 Series</option>
                      <option className="form-control" value="60 Series">60 Series</option>

                      </select>
                    </div>
                    <div class="col-1 mb-2 mt-3">
                      <p>Shutter Count</p>
                      <input type="text" class="form-control" value={shutterCount} onChange={handleShutterChange} />
                    </div>
                    <div class="col-1 mb-2 mt-3">
                      <p>Mesh</p>
                      <button className={mesh === 'YES' ? "btn btn-success w-100" : "btn btn-danger w-100"} type="button" onClick={() => meshChange(mesh)}>{mesh}</button>
                    </div>

                    <div class="col-2 mb-2 mt-3">
                      <p>Select Design</p>
                      <select className="form-control" value={design} onChange={handleDesignChange}>
                      <option value="" hidden>Select Design</option>
                        <option className="form-control" value="CasementWindow">CasementWindow</option>
                        <option className="form-control" value="CasementDoor">CasementDoor</option>
                        <option className="form-control" value="SlidingWindow">SlidingWindow</option>
                        <option className="form-control" value="SlidingDoor">SlidingDoor</option>
                        <option className="form-control" value="Ventilator">Ventilator</option>
                        <option className="form-control" value="Fixed Window">Fixed Window</option>
                        <option className="form-control" value="TopHung">Top Hung</option>

                      </select>
                     </div>

                     <div class="col-2 mb-2 mt-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                            <p className="mb-0">Select Profile</p>
                            <a href="/uploadprofile" target="_blank" rel="noreferrer" className="text-primary" style={{ fontSize: '12px', fontWeight: 600 }}>
                              + Add Extra Profile
                            </a>
                          </div>
                      <select className="form-control" value={customProfile} onChange={handleProfileChange}>
                        {profileDetails && profileDetails.data && profileDetails.data.map((profiles, index) => (
                        <option className="form-control" value={index}>{profiles.profileName}</option>
                        ))}
                        <option className="form-control text-sm text-center" disabled>Add more Profile contact Administration</option>
                      </select>
                     </div>
                     
                     <div class="col-2 mb-2 mt-3">
                      <p>Select Outer Frame Series</p>
                          <select class="form-control text-sm" value={selectedFrameSeries || ''} onChange={handleFrameSeriesChange}>
                            <option value="" hidden>Select Series</option>
                            {profileData && profileData.map(seriesId => (
                              <option key={seriesId.series} value={seriesId.series}>{seriesId.series}</option>
                            ))}
                          </select>
                      </div>    
                      <div class="col-4 mb-2 mt-3">
                      <p>Select Outer Frame Profile</p>
                            <select class="form-control text-sm" value={selectedFrameId || ''} onChange={handleFrameIdChange}>
                            {selectedFrameSeries ? (<option value="">Select ID</option>):(<option value="">Select Series First</option>)}
                              {selectedFrameSeries && seriesDataFrame?.items && seriesDataFrame.items.map((item) => (
                                <option key={item.id} value={item.id}>{item.id+' - '+ item.name}</option>
                              ))}
                            </select>
                      </div>


                      <div class="col-2 mb-2 mt-3">
                        <p>Select Shutter Series</p>
                        <select class="form-control text-sm" value={selectedShutterSeries || ''} onChange={handleShutterSeriesChange}>
                          <option value="" hidden>Select Series</option>
                          {profileData && profileData.map(seriesId => (
                            <option key={seriesId.series} value={seriesId.series}>{seriesId.series}</option>
                          ))}
                        </select>
                      </div>    
                      <div class="col-4 mb-2 mt-3">
                        <p>Select Shutter Profile</p>
                        <select class="form-control text-sm" value={selectedShutterId || ''} onChange={handleShutterIdChange}>
                          {selectedShutterSeries ? (<option value="">Select ID</option>):(<option value="">Select Series First</option>)}
                            {seriesDataShutter && seriesDataShutter.items.map((item) => (
                             <option key={item.id} value={item.id}>{item.id+' - '+ item.name}</option>
                           ))}
                        </select>
                      </div>

                      <div class="col-2 mb-2 mt-3">
                        <p>Select InterLock Series</p>
                        <select class="form-control text-sm" value={selectedInterLockSeries || ''} onChange={handleInterLockSeriesChange}>
                          <option value="" hidden>Select Series</option>
                            {profileData && profileData.map(seriesId => (
                              <option key={seriesId.series} value={seriesId.series}>{seriesId.series}</option>
                            ))}
                        </select>
                      </div>    
                      <div class="col-4 mb-2 mt-3">
                        <p>Select InterLock Profile</p>
                        <select class="form-control text-sm" value={selectedInterLockId || ''} onChange={handleInterLockIdChange}>
                          {selectedInterLockSeries ? (<option value="">Select ID</option>):(<option value="">Select Series </option>)}
                          {seriesDataInterLock && seriesDataInterLock.items.map((item) => (
                            <option key={item.id} value={item.id}>{item.id+' - '+ item.name}</option>
                          ))}
                        </select>
                      </div>

                      <div class="col-2 mb-2 mt-3">
                        <p>Select Mullion Series</p>
                        <select class="form-control text-sm" value={selectedMullionSeries || ''} onChange={handleMullionSeriesChange}>
                          <option value="" hidden>Select Series</option>
                            {profileData && profileData.map(seriesId => (
                             <option key={seriesId.series} value={seriesId.series}>{seriesId.series}</option>
                            ))}
                        </select>
                      </div>    
                      <div class="col-4 mb-2 mt-3">
                        <p>Select Mullion Profile</p>
                        <select class="form-control text-sm" value={selectedMullionId || ''} onChange={handleMullionIdChange}>
                          {selectedMullionSeries ? (<option value="">Select ID</option>):(<option value="">Select Series First</option>)}
                            {seriesDataMullion && seriesDataMullion.items.map((item) => (
                              <option key={item.id} value={item.id}>{item.id+' - '+ item.name}</option>
                            ))}
                        </select>
                      </div>

                      <div class="col-2 mb-2 mt-3">
                        <p>Select Beading Series</p>
                        <select class="form-control text-sm" value={selectedBeedingSeries || ''} onChange={handleBeedingSeriesChange}>
                            <option value="" hidden>Select Series</option>
                            {profileData && profileData.map(seriesId => (
                              <option key={seriesId.series} value={seriesId.series}>{seriesId.series}</option>
                            ))}
                        </select>
                      </div>    
                      <div class="col-4 mb-2 mt-3">
                        <p>Select Beading Profile</p>
                        <select class="form-control text-sm" value={selectedBeedingId || ''} onChange={handleBeedingIdChange}>
                          {selectedBeedingSeries ? (<option value="">Select ID</option>):(<option value="">Select Series First</option>)}
                            {seriesDataBeeding && seriesDataBeeding.items.map((item) => (
                              <option key={item.id} value={item.id}>{item.id+' - '+ item.name}</option>
                            ))}
                        </select>
                      </div>

                      <div class="col-2 mb-2 mt-3">
                        <p>Select Cupler Joint Series</p>
                        <select class="form-control text-sm" value={selectedCuplerSeries || ''} onChange={handleCuplerSeriesChange}>
                          <option value="" hidden>Select Series</option>
                          {profileData && profileData.map(seriesId => (
                            <option key={seriesId.series} value={seriesId.series}>{seriesId.series}</option>
                          ))}
                        </select>
                      </div>    
                      <div class="col-4 mb-2 mt-3">
                        <p>Select Cupler Joint Profile</p>
                        <select class="form-control text-sm" value={selectedCuplerId || ''} onChange={handleCuplerIdChange}>
                          {selectedCuplerSeries ? (<option value="">Select ID</option>):(<option value="">Select Series First</option>)}
                          {seriesDataCupler && seriesDataCupler.items.map((item) => (
                             <option key={item.id} value={item.id}>{item.id+' - '+ item.name}</option>
                          ))}
                        </select>
                      </div>

                      <div class="col-2 mb-2 mt-3">
                        <p>Select Mesh Series</p>
                        <select class="form-control text-sm" value={selectedMeshSeries || ''} onChange={handleMeshSeriesChange}>
                          <option value="" hidden>Select Series</option>
                          {profileData && profileData.map(seriesId => (
                            <option key={seriesId.series} value={seriesId.series}>{seriesId.series}</option>
                          ))}
                        </select>
                      </div>    
                      <div class="col-4 mb-2 mt-3">
                        <p>Select Mesh Profile</p>
                        <select class="form-control text-sm" value={selectedMeshId || ''} onChange={handleMeshIdChange}>
                          {selectedMeshSeries ? (<option value="">Select ID</option>):(<option value="">Select Series First</option>)}
                          {seriesDataMesh && seriesDataMesh.items.map((item) => (
                            <option key={item.id} value={item.id}>{item.id+' - '+ item.name}</option>
                          ))}
                        </select>
                      </div>

                      <div class="col-2 mb-2 mt-3">
                        <p>Select Panel Series</p>
                        <select class="form-control text-sm" value={selectedPanelSeries || ''} onChange={handlePanelChange}>
                          <option value="" hidden>Select Series</option>
                            {profileData && profileData.map(seriesId => (
                              <option key={seriesId.series} value={seriesId.series}>{seriesId.series}</option>
                            ))}
                        </select>
                      </div>    
                      <div class="col-4 mb-2 mt-3">
                        <p>Select Panel Profile</p>
                        <select class="form-control text-sm" value={selectedPanelId || ''} onChange={handlePanelIdChange}>
                          {setSelectedPanelSeries ? (<option value="">Select ID</option>):(<option value="">Select Series </option>)}
                            {seriesDataPanel && seriesDataPanel.items.map((item) => (
                              <option key={item.id} value={item.id}>{item.id+' - '+ item.name}</option>
                           ))}
                        </select>
                      </div>

                      <div class="col-12 mb-4 mt-4 align-items-center" align="center">
                        <button className="btn btn-primary" type="button" onClick={() => uploadData()}>Save Data</button>
                      </div>


                     </div>
                    </div>
                  </div>
                </div>
            </div>


             <div class="row">
                <div class="col-md-12 col-xxl-12 col-xl-12">
                  <div class="card">
                    <div class="card-body">
                      <div class=" row align-items-center">
                        <table class="table stripe row-border order-column">
                         
                        <tr>
                            <th>No.</th>
                            <th>Profile</th>
                            <th>Design</th>
                            <th>Width</th>
                            <th>Height</th>
                            <th>Shutter Count</th>
                            <th>Mesh-Type</th>
                            <th>Frame</th>
                            <th>Shutter</th>
                            <th>Mullion</th>
                            <th>InterLock</th>
                            <th>Beading</th>
                            <th>Panel</th>
                            <th>Mesh</th>
                        </tr>
                      {defaultProfile && defaultProfile.map((profiles, index) =>(
                       <tr>
                       <td>{profiles.Id}</td>
                       <td>{profiles.profileId}</td>
                       <td>{profiles.type}</td>
                       <td>{profiles.width}"</td>
                       <td>{profiles.height}"</td>
                       <td>{profiles.shutterCount} shutters</td>
                       <td>{profiles.meshType}</td>
                       <td>{profiles.frame}</td>
                       <td>{profiles.shutter}</td>
                       <td>{profiles.mullion}</td>
                       <td>{profiles.interlock}</td>
                       <td>{profiles.beading}</td>
                       <td>{profiles.panel}</td>
                       <td>{profiles.mesh}</td>
                       
                       
                        </tr>
                      ))}
                      </table>
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