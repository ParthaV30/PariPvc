import { getMergedProfileDetails, findLocalDefaultProfile } from "../services/profileManager";
import React, { useEffect, useState } from 'react';
import { ReactSession } from 'react-client-session';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from "./navbar";
import Header from "./header";
import Fan from '../images/fan.png';
import left from '../images/handleLeft.png';
import numeral from 'numeral';
import './box.css';
import ContentEditable from 'react-contenteditable';
ReactSession.setStoreType("localStorage");


const App = () => {

  const userId = ReactSession.get("upvcuserId");
  const userType = ReactSession.get("upvcuserType");
  const Empid = ReactSession.get("upvcempid");
  const quoteId = ReactSession.get("upvcquoteId");
  const navigate = useNavigate();
  const indexPath = '/';
  const selectPath = '/select';
  const item = 'Ventilator';
  const [modalContent, setModalContent] = useState(null);
  let users='';
  if (userType === '3') {
    users =  Empid ;
  } else {
    users = userId ;
  }
  const user = { "userId": users };

  
  useEffect(() => {
    if (userId === 0 ) {
      navigate(indexPath);
    }
  }, [userId, navigate]);

  const [boxWidth, setBoxWidth] = useState(2); 
  const [boxHeight, setBoxHeight] = useState(2); 
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  const [screen, setScreen] = useState(deviceWidth > 700 ? 5 : 10);
  const [fanTop, setfanTop] = useState('Top');
  const [fanLeft, setfanLeft] = useState('Left');
  const [divider, setDevider] = useState('Vertical');
  const [switchs, setSwitch] = useState('on');
  const [switchFixed, setFixed] = useState('off');
  const [fanType, setfanType] = useState(1);
  const [profileDetails, setProfileData] = useState(() => getMergedProfileDetails(null));
  const [qty, setQty] = useState(1);
  const [costData, setCostData] = useState(true);
  const [customProfile, setCustomProfile] = useState(0);
  const [calcBtn, setCalcBtn] = useState(false);
  const [isProfile, setIsProfile] = useState(false);
  const [series, setSeries] = useState(null);
  const [fan, setFan] = useState('on');
  const [topsash, setTopSash] = useState([]);
  const [bottomsash, setBottomSash] = useState([]);
  const [topnewHeights, setTopBoxHeight] = useState(0);
  const [bottomnewHeights, setBottomBoxHeight] = useState(0);
  const [measure, setMeasure] = useState('ft');
    const [mCalc, setMcalc] = useState(1);


  const fetchDatalog = async () => {
    try {
      const response = await axios.post(`https://upvcapi.sninfoserv.com/log/`, {userId, coreData, profileDatas});
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };



  useEffect(() => {
    const updateDeviceWidth = () => {
      setDeviceWidth(window.innerWidth);
      setScreen(window.innerWidth > 700 ? 5 : 10);
    };

    window.addEventListener('resize', updateDeviceWidth);

    return () => {
      window.removeEventListener('resize', updateDeviceWidth);
    };
  }, []);

  useEffect(() => {
    const fetchcostData = async () => {
      try {
        const response = await axios.post('https://upvcapi.sninfoserv.com/costs/', user);
        setCostData(response.data.data);
      } catch (error) { setProfileData(getMergedProfileDetails(null)); } 
    };

    fetchcostData();
  }, []);


  const handleQty = (event) => {
    if(event === 'plus'){
      setQty(qty + 1);
      
    }else{
      const minValue = 2;
      if (qty < minValue) {
        setQty(qty);
      } else {
        setQty(qty - 1);
      }
    }
  };

  const handleQtyChange = (event) => {
    const newValue = event.target.value;
    const minValue = 1;
    if (newValue < minValue) {
      setQty(minValue);
    } else {
      setQty(newValue);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('https://upvcapi.sninfoserv.com/new-profiles/', user);
        setProfileData(getMergedProfileDetails(response.data));
      } catch (error) { setProfileData(getMergedProfileDetails(null)); } 
    };

    fetchData();
  }, []);

  function changeMeasure(name) {
    if (name === 'ft') {
      setMeasure('mm');
      setMcalc(304.8);
      setBoxHeight((parseFloat(boxHeight) * 304.8).toFixed(2));
      setBoxWidth((parseFloat(boxWidth) * 304.8).toFixed(2));
      // if (newHeights > 0) {
      //   setNewInnerBoxHeight((parseFloat(newHeights) * 304.8).toFixed(2));
      // }
      if (topnewHeights > 0) {
        setTopBoxHeight((parseFloat(topnewHeights) * 304.8).toFixed(2));
        
      }
      if( bottomnewHeights > 0){
        setBottomBoxHeight((parseFloat(bottomnewHeights) * 304.8).toFixed(2));
      }
    } else {
      setMeasure('ft');
      setMcalc(1);
      setBoxHeight((parseFloat(boxHeight) / 304.8).toFixed(2));
      setBoxWidth((parseFloat(boxWidth) / 304.8).toFixed(2));
      // if (newHeights > 0) {
      //   setNewInnerBoxHeight((parseFloat(newHeights) / 304.8).toFixed(2));
      // }
       if (topnewHeights > 0) {
        setTopBoxHeight((parseFloat(topnewHeights) / 304.8).toFixed(2));
      }
      if( bottomnewHeights > 0){
        setBottomBoxHeight((parseFloat(bottomnewHeights) / 304.8).toFixed(2));
      }
    }
    // setNumSecondInnerBoxes(0);
    // setNewInnerBoxWidth([]);
    // setBoxNames([]);
  }



  const handleWidthChange = (event) => {
    const newValue = event.target.value;
    const minValue = 2;
    if (newValue < minValue) {
      setBoxWidth(minValue); 
    } else {
      setBoxWidth(newValue);
    }
   
  };

  const handleHeightChange = (event) => {
    const newValue = event.target.value;
    const minValue = 2;
    if (newValue < minValue) {
      setBoxHeight(minValue);
    } else {
      setBoxHeight(newValue);
    }
  };

  const handleWidth = (event) => {
    if(event === 'plus'){
      setBoxWidth(boxWidth + 0.25);
      
    }else{
      const minValue = 1;
      if (boxWidth <= minValue) {
        setBoxWidth(boxWidth);
      } else {
        setBoxWidth(boxWidth - 0.25);
      }
    }
  };

  const handleHeight = (event) => {
    if(event === 'plus'){
      setBoxHeight(boxHeight + 0.25);
    }else{
      const minValue = 1;
      if (boxHeight <= minValue) {
        setBoxHeight(boxHeight);
      } else {
        setBoxHeight(boxHeight-0.25);
      }
    }
  };
  

  const changefanTop = () => {
    setfanTop(fanTop === 'Top' ? 'Bottom' : 'Top');
  };

  const changefanLeft = () => {
    setfanLeft(fanLeft === 'Left' ? 'Right' : 'Left');
  };

  const changeDevider = () => {
    setDevider(divider === 'Vertical' ? 'Horizontal' : 'Vertical');
  };

  const changeSwitch = () => {
    setSwitch(switchs === 'on' ? 'off' : 'on');
  };

  const changeFixed= () => {
    setFixed(switchFixed === 'on' ? 'off' : 'on');
  };

  const handleButtonClick = (buttonName) => {
    setfanType(buttonName);
  };

   const toggleboxTop = () => {
    
    if(measure ==="ft"){
      setTopBoxHeight(0.5);
       setTopSash([...topsash, {type: 'fixed'}]);
    }else{
      setTopBoxHeight(152.40);
       setTopSash([...topsash, {type: 'fixed'}]);
    }
   
  };

   const toggleboxBottom = () => {
     if(measure ==="ft"){
    setBottomBoxHeight(0.5);
    setBottomSash([...bottomsash, {type: 'fixed'}]);
     }else{
      setBottomBoxHeight(152.40);
       setBottomSash([...bottomsash, {type: 'fixed'}]);
     }

  };




  const addTop = (event) => {
    if (event === 'plus') {
      setTopSash([...topsash, {type: 'fixed'}]);
      if(topnewHeights === 0){ setTopBoxHeight(0.5);}
    } else {
      const minValue = 1;
      if (topsash.length < minValue) {
      
      } else {
        const updatedTopSash = topsash.filter((_, i) => i !== 0);
        if(updatedTopSash.length <= 0){ setTopBoxHeight(0);}
        setTopSash(updatedTopSash);
      }
    }
  };

  const addBottom = (event) => {
    if (event === 'plus') {
      setBottomSash([...bottomsash, {type: 'fixed'}]);
      if(bottomnewHeights === 0){ 
        setBottomBoxHeight(0.5);
        if(fan === 'on'){
          setFan('off');
        }
      }
    } else {
      const minValue = 1;
      if (bottomsash.length < minValue) {
      
      } else {
        const updatedBottomSash = bottomsash.filter((_, i) => i !== 0);
        if(updatedBottomSash.length <= 0){ setBottomBoxHeight(0);}
        setBottomSash(updatedBottomSash);
      }
    }
   
  };

  const handleTop = (operation) => {
    
    if (operation === 'minus') {
      setTopBoxHeight((prevHeight) => Math.max(0, prevHeight - 0.25));
    } else if (operation === 'plus') {
      setTopBoxHeight((prevHeight) => Math.min(boxHeight - 1, prevHeight + 0.25));
    }
  };

  const handleBottom = (operation) => {
    if (operation === 'minus') {
      setBottomBoxHeight((prevHeight) => Math.max(0, prevHeight - 0.25));
    } else if (operation === 'plus') {
      setBottomBoxHeight((prevHeight) => Math.min(boxHeight - 1, prevHeight + 0.25));
    }
  };


  const changeTopSah = (index) => {
    const updatedTopSahs = [...topsash];
    topsash[index].type = updatedTopSahs[index].type === 'fixed' ? 'shutter' : 'fixed';
    setTopSash(updatedTopSahs);
  };

  const changeBottomSah = (index) => {
    const updatedBottomSahs = [...bottomsash];
    bottomsash[index].type = updatedBottomSahs[index].type === 'fixed' ? 'shutter' : 'fixed';
    setBottomSash(updatedBottomSahs);
  };




  
  const handleProfileChange = (event) => {
    const pIdx = event.target.value;
    setCustomProfile(pIdx);
    if (profileDetails && profileDetails.data && profileDetails.data[pIdx] && Array.isArray(profileDetails.data[pIdx].profileData) && profileDetails.data[pIdx].profileData.length > 0) {
      setSeries(profileDetails.data[pIdx].profileData[0].series);
    }
    setSelectedFrameSeries(null);
    setSelectedFrameId(null);
    setSelectedMullionSeries(null);
    setSelectedMullionId(null);
    setSelectedShutterSeries(null);
    setSelectedShutterId(null);
    setSelectedBeedingSeries(null);
    setSelectedBeedingId(null);
    setSelectedLBeedingSeries(null);
    setSelectedLBeedingId(null);
  };



   //----------prifile Section-----------//

   const profileData = profileDetails?.data?.[customProfile]?.profileData || [];
   const selectedProfile = profileDetails?.data?.[customProfile]?.profileName || '';

   const [selectedFrameSeries, setSelectedFrameSeries] = useState(null);
   const [selectedFrameId, setSelectedFrameId] = useState(null);
   
 
   const handleFrameSeriesChange = (event) => {
     const seriesId = event.target.value;
     setSelectedFrameSeries(seriesId);
     setSelectedMullionSeries(seriesId);
     setSelectedFrameId(null); 
   };
 
 
   const handleFrameIdChange = (event) => {
     const id = event.target.value;
     setSelectedFrameId(id);
   };
 
   
   const seriesDataFrame = profileData && profileData.find(serieses => serieses.series === selectedFrameSeries);
   const selectedFramePrice = selectedFrameId ? seriesDataFrame?.items?.find(item => item.id === selectedFrameId)?.price || '0' : '0';
   const selectedFrameLength = selectedFrameId ? seriesDataFrame?.items?.find(item => item.id === selectedFrameId)?.length || '0' : '0';
   const selectedFrameWeight = selectedFrameId ? seriesDataFrame?.items?.find(item => item.id === selectedFrameId)?.weight || '0' : '0';
   const selectedFrameName = selectedFrameId ? seriesDataFrame?.items?.find(item => item.id === selectedFrameId)?.name || 'Loading' : 'Loading';
   

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
  const selectedShutterPrice = selectedShutterId ? seriesDataShutter?.items?.find(item => item.id === selectedShutterId)?.price || '0' : '0';
  const selectedShutterLength = selectedShutterId ? seriesDataShutter?.items?.find(item => item.id === selectedShutterId)?.length || '0' : '0';
  const selectedShutterWeight = selectedShutterId ? seriesDataShutter?.items?.find(item => item.id === selectedShutterId)?.weight || '0' : '0';
  const selectedShutterName = selectedShutterId ? seriesDataShutter?.items?.find(item => item.id === selectedShutterId)?.name || 'Loading' : 'Loading';


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
   const selectedMullionPrice = selectedMullionId ? seriesDataMullion?.items?.find(item => item.id === selectedMullionId)?.price || '0' : '0';
   const selectedMullionLength = selectedMullionId ? seriesDataMullion?.items?.find(item => item.id === selectedMullionId)?.length || '0' : '0';
   const selectedMullionWeight = selectedMullionId ? seriesDataMullion?.items?.find(item => item.id === selectedMullionId)?.weight || '0' : '0';
   const selectedMullionName = selectedMullionId ? seriesDataMullion?.items?.find(item => item.id === selectedMullionId)?.name || 'Loading' : 'Loading';
   

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
   const selectedBeedingPrice = selectedBeedingId ? seriesDataBeeding?.items?.find(item => item.id === selectedBeedingId)?.price || '0' : '0';
   const selectedBeedingLength = selectedBeedingId ? seriesDataBeeding?.items?.find(item => item.id === selectedBeedingId)?.length || '0' : '0';
   const selectedBeedingWeight = selectedBeedingId ? seriesDataBeeding?.items?.find(item => item.id === selectedBeedingId)?.weight || '0' : '0';
   const selectedBeedingName = selectedBeedingId ? seriesDataBeeding?.items?.find(item => item.id === selectedBeedingId)?.name || 'Loading' : 'Loading';
   

   const [selectedLBeedingSeries, setSelectedLBeedingSeries] = useState(null);
   const [selectedLBeedingId, setSelectedLBeedingId] = useState(null);
   
   const handleLBeedingSeriesChange = (event) => {
     const seriesId = event.target.value;
     setSelectedLBeedingSeries(seriesId);
     setSelectedLBeedingId(null); 
   };

   const handleLBeedingIdChange = (event) => {
    const id = event.target.value;
    setSelectedLBeedingId(id);
  };

  const seriesDataLBeeding = profileData && profileData.find(serieses => serieses.series === selectedLBeedingSeries);
  const selectedLBeedingPrice = selectedLBeedingId ? seriesDataLBeeding?.items?.find(item => item.id === selectedLBeedingId)?.price || '0' : '0';
  const selectedLBeedingLength = selectedLBeedingId ? seriesDataLBeeding?.items?.find(item => item.id === selectedLBeedingId)?.length || '0' : '0';
  const selectedLBeedingWeight = selectedLBeedingId ? seriesDataLBeeding?.items?.find(item => item.id === selectedLBeedingId)?.weight || '0' : '0';
  const selectedLBeedingName = selectedLBeedingId ? seriesDataLBeeding?.items?.find(item => item.id === selectedLBeedingId)?.name || 'Loading' : 'Loading';

   //-------------------cost--------------------------//

  const [handleCost, sethandleCost] = useState(0);
  const handles = costData && costData.costData && costData.costData.handle;
  const handleChange = (event) => {
    const cost = event.target.value;
    sethandleCost(cost);
  };


   const [glassCost, setGlassCost] = useState(0);
   const glasses = costData && costData.costData && costData.costData.glass;
   const glassChange = (event) => {
     const cost = event.target.value;
     setGlassCost(cost);
   };

   const [marginCost, setMarginCost] = useState(0);
   const margin = costData && costData.costData && costData.costData.margin;
   const marginChange = (event) => {
     const cost = event.target.value;
     setMarginCost(cost);
   };
 
   const [marketingCost, setMarketingCost] = useState(0);
   const marketing= costData && costData.costData && costData.costData.marketing;
   const marketingChange = (event) => {
     const cost = event.target.value;
     setMarketingCost(cost);
   };
 
   const [labourFCost, setlabourFCost] = useState(0);
   const labourF = costData && costData.costData && costData.costData.labourFactory;
   const labourFChange = (event) => {
     const cost = event.target.value;
     setlabourFCost(cost);
   };
 
   const [labourSCost, setlabourSCost] = useState(0);
   const labourS = costData && costData.costData && costData.costData.labourSite;
   const labourSChange = (event) => {
     const cost = event.target.value;
     setlabourSCost(cost);
   };
 
   const [transportCost, setTransportCost] = useState(0);
   const transport = costData && costData.costData && costData.costData.transport;
   const transportChange = (event) => {
     const cost = event.target.value;
     setTransportCost(cost);
   };

   

  const [wastageCost, setwastageCost] = useState(0);
  const wasteValues = costData && costData.costData && costData.costData.wastage;
  const wasteChange = (event) => {
    const cost = event.target.value;
    setwastageCost(cost);
  };
 

  const [meshgasketCost, setmeshgasketDef] = useState(0);
  const meshgasketValues = costData && costData.costData && costData.costData.meshGasket;
  const meshgasketChange = (event) => {
    const cost = event.target.value;
    setmeshgasketDef(cost);
  };

  const [ProfilegasketCost, setProfilegasketDef] = useState(0);
  const ProfilegasketValues = costData && costData.costData && costData.costData.profileGasket;
  const ProfilegasketChange = (event) => {
    const cost = event.target.value;
    setProfilegasketDef(cost);
  };

  const [BeedinggasketCost, setBeedinggasketDef] = useState(0);
  const BeedinggasketValues = costData && costData.costData && costData.costData.profileGasket;
  const BeedinggasketChange = (event) => {
    const cost = event.target.value;
    setBeedinggasketDef(cost);
  };

  const [ShuttergasketCost, setShuttergasketDef] = useState(0);
  const ShuttergasketValues = costData && costData.costData && costData.costData.profileGasket;
  const ShuttergasketChange = (event) => {
    const cost = event.target.value;
    setShuttergasketDef(cost);
  };



  const [meshCost, setmeshDef] = useState(0);
  const meshValues = costData && costData.costData && costData.costData.mesh;
  const meshChange = (event) => {
    const cost = event.target.value;
    setmeshDef(cost);
  };

  const [screwtCost, setscrewDef] = useState(0);
  const screwValues = costData && costData.costData && costData.costData.screws;
  const screwChange = (event) => {
    const cost = event.target.value;
    setscrewDef(cost);
  };
  
  const [steelFramCost, setsteelFramDef] = useState(0);
  const steelValues = costData && costData.costData && costData.costData.steel;
  const steelframeChange = (event) => {
    const cost = event.target.value;
    setsteelFramDef(cost);
  };


  const [steelMullionCost, setsteelMullionDef] = useState(0);
  const steelMullionValues = costData && costData.costData && costData.costData.steel;
  const steelMullionChange = (event) => {
    const cost = event.target.value;
    setsteelMullionDef(cost);
  };
  

  const [LouverBladesCost, setLouverBladesDef] = useState(0);
  const LouverBladesValues = costData && costData.costData && costData.costData.blades;
  const LouverBladesChange = (event) => {
    const cost = event.target.value;
    setLouverBladesDef(cost);
  };

  const [fanCost, setFanCost] = useState(0);
  const fanValues = costData && costData.costData && costData.costData.fan;
  const fanChange = (event) => {
    const cost = event.target.value;
    setFanCost(cost);
  };
   


  const marginDef = costData && costData.costData && costData.costData.margin[0].value;
  const marketingDef = costData && costData.costData && costData.costData.marketing[0].value;
  const labourFactoryDef = costData && costData.costData && costData.costData.labourFactory[0].value;
  const labourSiteDef = costData && costData.costData && costData.costData.labourSite[0].value;
  const transportDef = costData && costData.costData && costData.costData.transport[0].value;
  const glassDef = costData && costData.costData && costData.costData.glass[0].value;
  const steelFramDef = costData && costData.costData && costData.costData.steel[0].value;
  const steelShutterDef = costData && costData.costData && costData.costData.steel[0].value;
  const steelMullionDef = costData && costData.costData && costData.costData.steel[0].value;
  const wasteDef = costData && costData.costData && costData.costData.wastage[0].value;
  const bladesDef = costData && costData.costData && costData.costData.blades[0].value;
  const meshGasketDef = costData && costData.costData && costData.costData.meshGasket[0].value;
  const meshDef = costData && costData.costData && costData.costData.mesh[0].value;
  const screwDef = costData && costData.costData && costData.costData.screws[0].value;
  const ProfilegasketDef = costData && costData.costData && costData.costData.profileGasket[0].value;
  const ShuttergasketDef = costData && costData.costData && costData.costData.profileGasket[0].value;
  const handleDef = costData && costData.costData && costData.costData.handle[0].value;
  const fanDef = costData && costData.costData && costData.costData.fan[0].value;

  const addDef = () => {
    sethandleCost(handleDef);
    setMarginCost(marginDef);
    setMarketingCost(marketingDef);
    setlabourFCost(labourFactoryDef);
    setlabourSCost(labourSiteDef);
    setTransportCost(transportDef);
    setGlassCost(glassDef);
    setsteelFramDef(steelFramDef);
    setProfilegasketDef(ProfilegasketDef);
    setBeedinggasketDef(ProfilegasketDef);
    setShuttergasketDef(ShuttergasketDef);
    setsteelMullionDef(steelMullionDef);
    setwastageCost(wasteDef);
    setLouverBladesDef(bladesDef);
    setscrewDef(screwDef);
    setmeshgasketDef(meshGasketDef);
    setmeshDef(meshDef);
    setFanCost(fanDef);
};

useEffect(() => {
    addDef();
}, []);
  
  const data = {
    mullion:{
      length: selectedMullionLength*3.28084,
      weight: selectedMullionWeight,
      amount: selectedMullionPrice,
      name: selectedMullionName,
      id:selectedMullionId,
    },
    frame:{
      length: selectedFrameLength*3.28084 ,
      weight: selectedFrameWeight,
      amount:selectedFramePrice,
      name : selectedFrameName,
      id:selectedFrameId,
    },
    shutter: {
      length: selectedShutterLength * 3.28084,
      weight: selectedShutterWeight,
      amount: selectedShutterPrice,
      name: selectedShutterName,
      id: selectedShutterId
    },
    beeding:{
      length: selectedBeedingLength*3.28084,
      weight: selectedBeedingWeight,
      amount: selectedBeedingPrice,
      name : selectedBeedingName,
      id:selectedBeedingId
    },
    Lbeeding:{
      length: selectedLBeedingLength*3.28084,
      weight: selectedLBeedingWeight,
      amount: selectedLBeedingPrice,
      name : selectedLBeedingName,
      id:selectedLBeedingId
    },
    cupler:{
      length: null,
      weight:null,
      amount:null,
      name : null
    },
    meshFrame:{
      length: null,
      weight:null,
      amount:null,
      name : null
    },
    fan:{
      type1:'280',
      type2:'230',
      type3:'200',
    },
     frameGasket:{
      length:'1',
      weight:'1',
      amount: ProfilegasketCost || 0
    },
    beedingGasket:{
      length:'1',
      weight:'1',
      amount: BeedinggasketCost || 0
    },
    shutterGasket:{
      length:'1',
      weight:'1',
      amount: ShuttergasketCost || 0
    },
    screwsCost: screwtCost,
    wastage: wastageCost,
    glass: glassCost,
    LouverBlades: LouverBladesCost,
    marketingCost: marketingCost,
    transportCost: transportCost,
    labourFcost: labourFCost,
    labourScost: labourSCost,
    marginCost: marginCost,
    steelFrame: steelFramCost,
    steelMullion: steelMullionCost,
    handle: handleCost,
    fanCost: fanCost,
  }

   
  let fanLength;

  if (fanType === 1) {
    fanLength = 1;
  } else if (fanType === 2) {
    fanLength = 0.75;
  } else if (fanType === 3) {
    fanLength = 0.5833;
  } else {
    fanLength = 0; 
  }

  const Mullion = () => {

    if (measure === 'ft') {
       if(boxHeight > 1 && boxWidth > 1){
      if( fan === 'on'){
        if(divider === 'Vertical'){
          return  parseFloat(boxHeight) + fanLength;
        }else{
          return  parseFloat(boxWidth) + fanLength;
        }
      }else{
        return 0;
      }
    }else{
      if( fan === 'on'){
        if(divider === 'Vertical'){
          return fanLength;
        }else{
          return fanLength;
        }
      }else{
        return 0;
      }
    }
    }else{
       if(boxHeight > 1 && boxWidth > 1){
      if( fan === 'on'){
        if(divider === 'Vertical'){
          return  parseFloat(boxHeight/ 304.8) + fanLength;
        }else{
          return  parseFloat(boxWidth/ 304.8) + fanLength;
        }
      }else{
        return 0;
      }
    }else{
      if( fan === 'on'){
        if(divider === 'Vertical'){
          return fanLength;
        }else{
          return fanLength;
        }
      }else{
        return 0;
      }
    }

    }
   
  };

  const Frame = () => {
     if (measure === 'ft') {
      return ( parseFloat(boxHeight) + parseFloat(boxWidth) )*2;
     }else{
      return ( parseFloat(boxHeight/ 304.8) + parseFloat(boxWidth/ 304.8) )*2;
     }
  };


  const LouverBlades = () => {
      if (measure === 'ft') {
         if(parseFloat(boxHeight) === 1 && parseFloat(boxWidth) > 1){
      if(switchFixed === 'on'){
        return 0;
      }else{
        if(fan === 'on'){
          return 0;
        }else{
          return (parseFloat(boxHeight)*6);
        }
      }
    }else if(parseFloat(boxHeight) > 1 && parseFloat(boxWidth) === 1){
      if(switchFixed === 'on'){
        return 0;
      }else{
        if(fan === 'on'){
          return 0;
        }else{
          return ((parseFloat(boxHeight))*6);
        }
      }
    }else{
      if (divider === 'Vertical' && switchs === 'on'){

        return (6 * parseFloat(boxHeight));
      }
      if (divider === 'Vertical' && switchs === 'off'){
        if(fan === 'on'){
          return (6 * (parseFloat(boxHeight)-1));
        }else{
          return (6 * (parseFloat(boxHeight)));
        }
      }
      if (divider === 'Horizontal' && switchs === 'on'){
        if(fan === 'on'){
          return (6 * (parseFloat(boxHeight) -1));
        }else{
          return (6 * (parseFloat(boxHeight)));
        }
      }
      if (divider === 'Horizontal' && switchs === 'off'){
        if(fan === 'on'){
          return (6 * (parseFloat(boxHeight)-1));
        }else{
          return (6 * (parseFloat(boxHeight)));
        }
      }
    }
      }else{
         if(parseFloat(boxHeight/304.8) === 1 && parseFloat(boxWidth/304.8) > 1){
      if(switchFixed === 'on'){
        return 0;
      }else{
        if(fan === 'on'){
          return 0;
        }else{
          return (parseFloat(boxHeight /304.8)*6);
        }
      }
    }else if(parseFloat(boxHeight/304.8) > 1 && parseFloat(boxWidth/304.8) === 1){
      if(switchFixed === 'on'){
        return 0;
      }else{
        if(fan === 'on'){
          return 0;
        }else{
          return ((parseFloat(boxHeight/304.8))*6);
        }
      }
    }else{
      if (divider === 'Vertical' && switchs === 'on'){

        return (6 * parseFloat(boxHeight/304.8));
      }
      if (divider === 'Vertical' && switchs === 'off'){
        if(fan === 'on'){
          return (6 * (parseFloat(boxHeight/304.8)-1));
        }else{
          return (6 * (parseFloat(boxHeight/304.8)));
        }
      }
      if (divider === 'Horizontal' && switchs === 'on'){
        if(fan === 'on'){
          return (6 * (parseFloat(boxHeight/304.8) -1));
        }else{
          return (6 * (parseFloat(boxHeight/304.8)));
        }
      }
      if (divider === 'Horizontal' && switchs === 'off'){
        if(fan === 'on'){
          return (6 * (parseFloat(boxHeight/304.8)-1));
        }else{
          return (6 * (parseFloat(boxHeight/304.8)));
        }
      }
    }

      }
   
  };

  const Glass = () => {
    if(measure === 'ft'){
      if(parseFloat(boxHeight) === 1 && parseFloat(boxWidth) > 1){
      if(switchFixed === 'on'){
        if(fan === 'on'){
          return ((parseFloat(boxHeight))*parseFloat(boxWidth)-1);
        }else{
          return ((parseFloat(boxHeight))*parseFloat(boxWidth));
        }
      }else{
        return 0;
      }
    }else if(parseFloat(boxHeight) > 1 && parseFloat(boxWidth) === 1){
      if(switchFixed === 'on'){
        if(fan === 'on'){
          return ((parseFloat(boxHeight)-1)*parseFloat(boxWidth));
        }else{
          return ((parseFloat(boxHeight))*parseFloat(boxWidth));
        }
      }else{
        return 0;
      }
    }else if(parseFloat(boxHeight) === 1 && parseFloat(boxWidth) === 1){
      if(switchFixed === 'on'){
        if(fan === 'on'){
          return ((parseFloat(boxHeight)-1)*parseFloat(boxWidth));
        }else{
          return ((parseFloat(boxHeight))*parseFloat(boxWidth));
        }
      }else{
        return 0;
      }
    }else{
      if (divider === 'Vertical' && switchs ==='on'){
        return ((parseFloat(boxHeight)-1)*(parseFloat(boxWidth)-1))+((parseFloat(boxHeight)*4)*(95*0.00328084))*(parseFloat(boxWidth)-1);
      }
      if (divider === 'Vertical' && switchs === 'off'){
        return ((parseFloat(boxHeight))*(parseFloat(boxWidth)-1))+(((parseFloat(boxHeight)-1)*4)*(95*0.00328084))*(parseFloat(boxWidth)-1);
      }
      if (divider === 'Horizontal' && switchs === 'on'){
        return ((parseFloat(boxHeight)-1)*(parseFloat(boxWidth)))+(((parseFloat(boxHeight)-1)*4)*(95*0.00328084))*(parseFloat(boxWidth)-1);
      }
      if (divider === 'Horizontal' && switchs === 'off'){
        return ((parseFloat(boxHeight)-1)*(parseFloat(boxWidth)-1))+(((parseFloat(boxHeight)-1)*4)*(95*0.00328084))*(parseFloat(boxWidth));
      }
    }

    }else{
      if(parseFloat(boxHeight/304.8) === 1 && parseFloat(boxWidth/304.8) > 1){
      if(switchFixed === 'on'){
        if(fan === 'on'){
          return ((parseFloat(boxHeight/304.8))*parseFloat(boxWidth/304.8)-1);
        }else{
          return ((parseFloat(boxHeight/304.8))*parseFloat(boxWidth/304.8));
        }
      }else{
        return 0;
      }
    }else if(parseFloat(boxHeight/304.8) > 1 && parseFloat(boxWidth/304.8) === 1){
      if(switchFixed === 'on'){
        if(fan === 'on'){
          return ((parseFloat(boxHeight/304.8)-1)*parseFloat(boxWidth/304.8));
        }else{
          return ((parseFloat(boxHeight/304.8))*parseFloat(boxWidth/304.8));
        }
      }else{
        return 0;
      }
    }else if(parseFloat(boxHeight/304.8) === 1 && parseFloat(boxWidth/304.8) === 1){
      if(switchFixed === 'on'){
        if(fan === 'on'){
          return ((parseFloat(boxHeight/304.8)-1)*parseFloat(boxWidth/304.8));
        }else{
          return ((parseFloat(boxHeight/304.8))*parseFloat(boxWidth/304.8));
        }
      }else{
        return 0;
      }
    }else{
      if (divider === 'Vertical' && switchs ==='on'){
        return ((parseFloat(boxHeight/304.8)-1)*(parseFloat(boxWidth/304.8)-1))+((parseFloat(boxHeight/304.8)*4)*(95*0.00328084))*(parseFloat(boxWidth/304.8)-1);
      }
      if (divider === 'Vertical' && switchs === 'off'){
        return ((parseFloat(boxHeight/304.8))*(parseFloat(boxWidth/304.8)-1))+(((parseFloat(boxHeight/304.8)-1)*4)*(95*0.00328084))*(parseFloat(boxWidth/304.8)-1);
      }
      if (divider === 'Horizontal' && switchs === 'on'){
        return ((parseFloat(boxHeight/304.8)-1)*(parseFloat(boxWidth/304.8)))+(((parseFloat(boxHeight/304.8)-1)*4)*(95*0.00328084))*(parseFloat(boxWidth/304.8)-1);
      }
      if (divider === 'Horizontal' && switchs === 'off'){
        return ((parseFloat(boxHeight/304.8)-1)*(parseFloat(boxWidth/304.8)-1))+(((parseFloat(boxHeight/304.8)-1)*4)*(95*0.00328084))*(parseFloat(boxWidth/304.8));
      }
    }

    }
    
  };

  const Beeding = () => {
    return Frame();
  };

  const louverBeeding = () => {
    if(measure === 'ft'){
      if(parseFloat(boxHeight) === 1 && parseFloat(boxWidth) > 1){
      if(switchFixed === 'on'){
        return 0;
      }else{
        if(fan === 'on'){
          return ((parseFloat(boxHeight) + parseFloat(boxWidth)-1)*2);
        }else{
          return ( parseFloat(boxWidth)*4);
        }
      }
    }else if(parseFloat(boxHeight) > 1 && parseFloat(boxWidth) === 1){
      if(switchFixed === 'on'){
        return 0;
      }else{
        if(fan === 'on'){
          return ((parseFloat(boxHeight)-1 + parseFloat(boxWidth))*2);
        }else{
          return ((parseFloat(boxHeight) + parseFloat(boxWidth))*2);
        }
      }
    }else if(parseFloat(boxHeight) === 1 && parseFloat(boxWidth) === 1){
      if(switchFixed === 'on'){
        return 0;
      }else{
        if(fan === 'on'){
          return ((parseFloat(boxHeight)-1 + parseFloat(boxWidth))*2);
        }else{
          return ((parseFloat(boxHeight) + parseFloat(boxWidth))*2);
        }
      }
    }else{
      if (divider === 'Vertical' && switchs === 'on'){
        return (2 * (parseFloat(boxHeight)-1 + parseFloat(boxWidth)-1));
      }
      if (divider === 'Vertical' && switchs === 'off'){
        return (2 * (parseFloat(boxHeight) + parseFloat(boxWidth)-1));
      }
      if (divider === 'Horizontal' && switchs === 'on'){
        return (2 * (parseFloat(boxHeight)-1 + parseFloat(boxWidth)));
      }
      if (divider === 'Horizontal' && switchs === 'off'){
        return (2 * (parseFloat(boxHeight)-1 + parseFloat(boxWidth)-1));
      }
    }
    }else{
      if(parseFloat(boxHeight/304.8) === 1 && parseFloat(boxWidth/304.8) > 1){
      if(switchFixed === 'on'){
        return 0;
      }else{
        if(fan === 'on'){
          return ((parseFloat(boxHeight/304.8) + parseFloat(boxWidth/304.8)-1)*2);
        }else{
          return ( parseFloat(boxWidth/304.8)*4);
        }
      }
    }else if(parseFloat(boxHeight/304.8) > 1 && parseFloat(boxWidth/304.8) === 1){
      if(switchFixed === 'on'){
        return 0;
      }else{
        if(fan === 'on'){
          return ((parseFloat(boxHeight/304.8)-1 + parseFloat(boxWidth/304.8))*2);
        }else{
          return ((parseFloat(boxHeight/304.8) + parseFloat(boxWidth/304.8))*2);
        }
      }
    }else if(parseFloat(boxHeight/304.8) === 1 && parseFloat(boxWidth/304.8) === 1){
      if(switchFixed === 'on'){
        return 0;
      }else{
        if(fan === 'on'){
          return ((parseFloat(boxHeight/304.8)-1 + parseFloat(boxWidth/304.8))*2);
        }else{
          return ((parseFloat(boxHeight/304.8) + parseFloat(boxWidth/304.8))*2);
        }
      }
    }else{
      if (divider === 'Vertical' && switchs === 'on'){
        return (2 * (parseFloat(boxHeight/304.8)-1 + parseFloat(boxWidth/304.8)-1));
      }
      if (divider === 'Vertical' && switchs === 'off'){
        return (2 * (parseFloat(boxHeight/304.8) + parseFloat(boxWidth/304.8)-1));
      }
      if (divider === 'Horizontal' && switchs === 'on'){
        return (2 * (parseFloat(boxHeight/304.8)-1 + parseFloat(boxWidth/304.8)));
      }
      if (divider === 'Horizontal' && switchs === 'off'){
        return (2 * (parseFloat(boxHeight/304.8)-1 + parseFloat(boxWidth/304.8)-1));
      }
    }

    }
    
  };

  const frameGasket = () => {
    return Frame();
  };

  const beedingGasket = () => {
    if(measure === 'ft'){
     return Frame()+(boxWidth*2);
    }else{
      return Frame()+((boxWidth/304.8)*2);
    }
  };

  const Fixed = () => {
    if(measure === 'ft'){
     return (8 * (boxHeight - fanLeft));
    }else{
      return (8 * ((boxHeight/304.8) - fanLeft));
    }
  };



  const steelFrame = () => {
    return Frame();
  };

  const steelMullion = () => {
    if(measure === 'ft'){
       if(parseFloat(boxHeight) === 1){
      return  parseFloat(boxHeight);
    }else if(parseFloat(boxWidth)=== 1){
      return  parseFloat(boxWidth);
    }else{
      if(divider === 'Vertical'){
        return  parseFloat(boxHeight) + fanLength;
      }else{
        return  parseFloat(boxWidth) + fanLength;
    }
  }
    }else{
          if(parseFloat(boxHeight/304.8) === 1){
      return  parseFloat(boxHeight/304.8);
    }else if(parseFloat(boxWidth/304.8)=== 1){
      return  parseFloat(boxWidth/304.8);
    }else{
      if(divider === 'Vertical'){
        return  parseFloat(boxHeight/304.8) + fanLength;
      }else{
        return  parseFloat(boxWidth/304.8) + fanLength;
    }
  }
    }
   
  };

  const topShutter = () => {
    if(measure === 'ft'){
        const shutterCounts = topsash.filter(item => item.type === 'shutter').length;
    const shutterSize = (((parseFloat(boxWidth)/parseFloat(topsash.length)) * 2) + (parseFloat(topnewHeights) * 2)) * parseFloat(shutterCounts);
    if(shutterCounts > 0){
      return shutterSize;
    }else{
      return 0;
    }
    }else{
      const shutterCounts = topsash.filter(item => item.type === 'shutter').length;
    const shutterSize = (((parseFloat(boxWidth/304.8)/parseFloat(topsash.length)) * 2) + (parseFloat(topnewHeights/304.8) * 2)) * parseFloat(shutterCounts);
    if(shutterCounts > 0){
      return shutterSize;
    }else{
      return 0;
    }

    }
  
    
  };

  const bottomShutter = () => {
    if(measure === 'ft'){
     const shutterCounts = bottomsash.filter(item => item.type === 'shutter').length;
    const shutterSize = (((parseFloat(boxWidth)/parseFloat(bottomsash.length)) * 2) + (parseFloat(bottomnewHeights) * 2)) * parseFloat(shutterCounts);
    if(shutterCounts > 0){
      return shutterSize;
    }else{
      return 0;
    }
    }else{
       const shutterCounts = bottomsash.filter(item => item.type === 'shutter').length;
    const shutterSize = (((parseFloat(boxWidth/304.8)/parseFloat(bottomsash.length)) * 2) + (parseFloat(bottomnewHeights/304.8) * 2)) * parseFloat(shutterCounts);
    if(shutterCounts > 0){
      return shutterSize;
    }else{
      return 0;
    }

    }
    
  };

  const shutterGasket = () => {
    return parseFloat(topShutter()) + parseFloat(bottomShutter());
  };

  const handle = () => {
    const topshutterCounts = bottomsash.filter(item => item.type === 'shutter').length;
    const bottomshutterCounts = topsash.filter(item => item.type === 'shutter').length;

    return parseFloat(topshutterCounts + bottomshutterCounts);
  };

  const screws = () => {
    if(measure === 'ft'){
         const outer = (((parseFloat(boxHeight)/2) * 3) + ((parseFloat(boxWidth)/2) * 3));
    const sash = (parseFloat(boxHeight) -1 ) + (parseFloat(boxWidth) -1) * 3;
    const stay = sash + parseFloat(boxHeight);
    const espag = sash;

    return outer + sash + stay + espag;
    }else{
      const outer = (((parseFloat(boxHeight/304.8)/2) * 3) + ((parseFloat(boxWidth/304.8)/2) * 3));
    const sash = (parseFloat(boxHeight/304.8) -1 ) + (parseFloat(boxWidth/304.8) -1) * 3;
    const stay = sash + parseFloat(boxHeight/304.8);
    const espag = sash;

    return outer + sash + stay + espag;
    }
    
  };
 

  const frameArea = (measure === 'ft') ? parseFloat(boxHeight) * parseFloat(boxWidth) : (parseFloat(boxHeight/304.8) * parseFloat(boxWidth/304.8));

  const values = {
    mullionCost:{
      rqm: (parseFloat(Mullion()) * 0.3048).toFixed(2) || 0,
      rpm: data.mullion.amount || 0,
      amount: (parseFloat(Mullion()) * 0.3048) * data.mullion.amount || 0,
    },
    frameCost:{
      rqm: (parseFloat(Frame()) * 0.3048).toFixed(2) || 0,
      rpm: data.frame.amount || 0,
      amount: (parseFloat(Frame()) * 0.3048) * parseFloat(data.frame.amount) || 0
    },
    shutter: {
      rqm: ((parseFloat(topShutter()) + parseFloat(bottomShutter())) * 0.3048).toFixed(2) || 0,
      rpm:  data.shutter.amount || 0,
      amount: ( ((parseFloat(topShutter()) + parseFloat(bottomShutter())) * 0.3048) * data.shutter.amount).toFixed(2) || 0,
    },
    beeding:{
      rqm: (parseFloat(Beeding()) * 0.3048).toFixed(2) || 0,
      rpm: data.beeding.amount || 0,
      amount: (parseFloat(Beeding()) * 0.3048) * data.beeding.amount || 0,
    },
    lovBeeding:{
      rqm: (parseFloat(louverBeeding()) * 0.3048).toFixed(2) || 0,
      rpm: data.Lbeeding.amount || 0,
      amount: (parseFloat(louverBeeding()) * 0.3048) * data.Lbeeding.amount || 0,
    },
    shutterGasket: {
      rqm: (parseFloat(shutterGasket()) * 0.3048).toFixed(2) || 0,
      rpm: data.shutterGasket.amount || 0,
      amount: ( (parseFloat(shutterGasket) * 0.3048) * data.shutterGasket.amount).toFixed(2) || 0,
    },
    frameGasket:{
      rqm: (parseFloat(frameGasket()) * 0.3048).toFixed(2) || 0,
      rpm: data.frameGasket.amount || 0,
      amount: (parseFloat(frameGasket()) * 0.3048) * data.frameGasket.amount || 0,
    },
    beedingGasket:{
      rqm: (parseFloat(beedingGasket()) * 0.3048).toFixed(2) || 0,
      rpm: data.beedingGasket.amount || 0,
      amount: (parseFloat(beedingGasket()) * 0.3048) * data.beedingGasket.amount || 0,
    },
    fan:{
      qty: 1,
      price: data.fan.type1,
      amount: data.fan.type1*1
    },
    glass:{
      qty: Glass(),
      price: data.glass,
      amount: data.glass*Glass() || 0
    },
    screws:{
      qty: screws(),
      price:data.screwsCost,
      amount: screws() *data.screwsCost || 0
    },
    LouverBlades:{
      qty: LouverBlades(),
      price: data.LouverBlades,
      amount: data.LouverBlades*LouverBlades() || 0
    },
    marketing:{
      qty: frameArea,
      price: data.marketingCost,
      amount: frameArea*data.marketingCost || 0
    },
    transport:{
      qty: frameArea,
      price: data.transportCost,
      amount:frameArea*data.transportCost || 0
    },
    labourF:{
      qty: frameArea,
      price: data.labourFcost,
      amount:frameArea*data.labourFcost || 0
    },
    labourS:{
      qty: frameArea,
      price: data.labourScost,
      amount:frameArea*data.labourScost || 0
    },
    margin:{
      qty: frameArea,
      price: data.marginCost,
      amount:frameArea*data.marginCost || 0
    },
    steelFrame:{
      qty: steelFrame(),
      price: data.steelFrame,
      amount: steelFrame()*data.steelFrame || 0,
    },
    steelMullion:{
      qty: steelMullion(),
      price: data.steelMullion,
      amount: steelMullion()*data.steelMullion || 0,
    },
    handle:{
      qty: handle(),
      price: data.handle,
      amount: handle()*data.handle || 0,
    },
    fanCost:{
      qty: 1,
      price: fanCost,
      amount: fan === 'on' ? fanCost * 1 || 0 : 0
    }
  };
  

  const frameTotal = parseFloat(
    parseFloat(values.shutter.amount)  + 
    parseFloat(values.mullionCost.amount) + 
    parseFloat(values.frameCost.amount) + 
    parseFloat(values.beeding.amount) + 
    parseFloat(values.beedingGasket.amount) + 
    parseFloat(values.frameGasket.amount) +  
    parseFloat(values.lovBeeding.amount)
  );

  const wastage = frameTotal *data.wastage/100;
  const frps = (frameTotal+wastage) / frameArea;

  const hardTotal =  parseFloat(
    parseFloat(values.handle.amount) + 
    parseFloat(values.screws.amount) + 
    parseFloat(values.glass.amount) + 
    parseFloat(values.LouverBlades.amount) + 
    parseFloat(values.steelFrame.amount) + 
    parseFloat(values.steelMullion.amount) +
    parseFloat(values.fanCost.amount)
  );

  const hrps = hardTotal/frameArea;
   
  const prodTotal = parseFloat(
    parseFloat(values.marketing.amount) + 
    parseFloat(values.transport.amount) + 
    parseFloat(values.labourF.amount) + 
    parseFloat(values.labourS.amount)
  );

  const prps = prodTotal/frameArea;
  
  const marginTotal = values.margin.amount;
  const mrps = marginTotal/frameArea;
  
  const grandTotal = frameTotal + hardTotal + prodTotal + wastage + marginTotal;
  const grandAps = grandTotal/frameArea;

   const calculatedBoxWidth = measure === 'ft' ? boxWidth : (boxWidth / 304.8);
  const calculatedBoxHeight = measure === 'ft' ? boxHeight : (boxHeight / 304.8);
  
  
    
  const coreData = { userId,  quoteId, data:{item, measure,mCalc, topsash, bottomsash, topnewHeights, bottomnewHeights, selectedProfile, series, qty, data, boxWidths: calculatedBoxWidth, boxHeights: calculatedBoxHeight, boxWidth: boxWidth, boxHeight: boxHeight, fan, fanTop, fanLeft, divider, switchs, switchFixed, fanType, frameArea, deviceWidth, screen, values, frameTotal, wastage, hardTotal, prodTotal, marginTotal, grandTotal}
    };

    

    const selectedProfiles = () => {
      let messages = [];
      let allValid = true;
    
      
      if ((selectedFrameId === null || selectedFrameId === "") || (selectedFrameSeries === null|| selectedFrameSeries === "")) {
        messages.push("Casement Outer Frame Profile Not Selected");
        allValid = false;
      }
	  
       if(Mullion() > 0){ 
      if ((selectedMullionId === null|| selectedMullionId ==="") || (selectedMullionSeries === null|| selectedMullionSeries === "")) {
        messages.push("Mullion Profile Not Selected");
        allValid = false;
      }
	  }
    
      
      if ((selectedBeedingId === null|| selectedBeedingId === "") || (selectedBeedingSeries === null || selectedBeedingSeries === "")) {
        messages.push("Beeding Profile Not Selected");
        allValid = false;
      }
      
	  
	    if(louverBeeding() > 0){  
      if ((selectedLBeedingId === null || selectedLBeedingId === "") || (selectedLBeedingSeries === null|| selectedLBeedingSeries === "")) {
        messages.push("BeedingSeries Not selected");
        allValid = false;
      }
		}
     
      
      
      if (messages.length > 0) {
        const formattedMessages = messages.map(message => `<li>${message}</li>`).join(' '); 
        const update = `${formattedMessages}`;
        const replace = update.replace(/, /g, "\t\n"); 
        setModalContent(replace);
        openModal3();
      } else if (allValid) {
        sendDataToUrl(); 
      }
    };

   

    const sendDataToUrl = async () => {
      fetchDatalog();
      try {
        const response = await axios.post('https://upvcapi.sninfoserv.com/quotes/', {
          coreData
        });
        if(response.data.status === 'success'){
          navigate(selectPath);
        }
      } catch (error) {
        console.error('Error sending data:', error);

      }
    };

    const openModal3 = (content) => {
      const modal = document.getElementById('onloadModal3');
      if (modal) {
          modal.classList.add('show');
          modal.style.display = 'block';
          document.body.classList.add('modal-open');
        
      }
    };
  
    const closeModal3 = () => {
      setCalcBtn(false);
      const modal = document.getElementById('onloadModal3');
      if (modal) {
          modal.classList.remove('show');
          modal.style.display = 'none';
          document.body.classList.remove('modal-open');
      }
    };


    const profileDatas = {width: boxWidth, height: boxHeight, profileId: selectedProfile,  series, mesh: 'no', shutterCount: 0, type: item}
  
    const handleSeriesChange = (event) => {
      const id = event.target.value;
      setSeries(id);
      sendprofileDataToUrl();
    };



    const sendprofileDataToUrl = async () => {
      setCalcBtn(true);
      try {
        const response = await axios.post('https://upvcapi.sninfoserv.com/find-default/', profileDatas);
        if(response.data.status === 'success'){
           if(response.data.data[0].beeding !== ''){
            setSelectedBeedingSeries(response.data.data[0].beedingSeries);
            setSelectedBeedingId(response.data.data[0].beeding);
            setSelectedLBeedingSeries(response.data.data[0].beedingSeries);
            setSelectedLBeedingId(response.data.data[0].beeding);
           }
           if(response.data.data[0].frame !== ''){
            setSelectedFrameSeries(response.data.data[0].frameSeries);
            setSelectedFrameId(response.data.data[0].frame);
           }
           if(response.data.data[0].interlock !== ''){
            //alert('interlock');
           }
           if(response.data.data[0].mesh !== ''){
           // setSelectedMeshSeries(response.data.data[0].meshSeries);
           // setSelectedMeshId(response.data.data[0].mesh);
           }
           if(response.data.data[0].mullion !== null){
            setSelectedMullionSeries(response.data.data[0].mullionSeries);
            setSelectedMullionId(response.data.data[0].mullion); 
           }
           if(response.data.data[0].panel !== ''){
            //alert('panel');
           }
           if(response.data.data[0].shutter !== ''){
            setSelectedShutterSeries(response.data.data[0].shutterSeries);
            setSelectedShutterId(response.data.data[0].shutter);
           }
           if(response.data.data[0].cupler !== ''){
            //setSelectedCuplerSeries(response.data.data[0].cuplerSeries);
            //setSelectedCuplerId(response.data.data[0].cupler);
           }

        }
      } catch (error) {
        console.error('Error sending data:', error);
      }
      setCalcBtn(false);
      setIsProfile(true);
      addDef();
    };


  // Outer Bottom Line
  const getOuterBottom = (height, screen) => {
    const fullHeightVW = (height) * screen ;
    return `calc(${fullHeightVW}vw - 8px)`;
  };
   // inner Bottom Line
   const getInnerBottom = (height, screen) => {
    const fullHeightVW = (height) * screen ;
    return `calc(${fullHeightVW}vw - 15px)`;
  };
  // i

    return (
    <div>
<div>
      
    </div>

        <div class="modal fade custom-modal" id="onloadModal3" tabindex="-1" aria-labelledby="onloadModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content" align="center">
               <div class="mt-3 mb-3">
                <h5>Warning</h5>
               </div>
                <div class="mb-3">
                <h6 class="mb-3"><ContentEditable html={`${modalContent}`}/></h6>
                  <button  class="btn btn-success w-25 me-4" type="button" onClick={closeModal3}>Cancel</button> 
                </div>
            </div>
          </div>
        </div>




    <Navbar />
    <Header />
    
    <div class="pc-container">
      <div class="pc-content">
       
        <div class="row">
        
          <div class="col-md-12 col-xxl-4 col-xl-4">
            <div class="card">
              <div class="card-body">
              <div class=" row align-items-center">

                 <div class="col-12 mb-2">
                      <p>Messurements</p>
                      <button className="btn btn-primary w-100" type="button" onClick={() => changeMeasure(measure)}>{measure === 'ft' ? 'Feet' : 'MM'}</button>
                    </div>
                    <div class="col-6">
                      <p>Width </p>
                      <div class="input-group mb-2">
                        <button class="btn btn-danger" type="button" onClick={() =>  handleWidth('minus')}>-</button>
                        <input type="text" class="form-control" value={boxWidth} onChange={handleWidthChange} />
                        <button class="btn btn-success" type="button" onClick={() =>  handleWidth('plus')}>+</button>
                      </div>
                    </div>

                    <div class="col-6">
                      <p>Height</p>
                      <div class="input-group mb-2">
                        <button class="btn btn-danger" type="button" onClick={() =>  handleHeight('minus')}>-</button>
                        <input type="text" class="form-control" value={boxHeight} onChange={handleHeightChange} />
                        <button class="btn btn-success" type="button" onClick={() =>  handleHeight('plus')}>+</button>
                      </div>
                    </div>
                    <div class="col-6">
                      <p>No of Ventilators</p>
                        <div class="input-group mb-2">
                          <button class="btn btn-danger" type="button" onClick={() =>  handleQty('minus')}>-</button>
                          <input type="text" class="form-control"  value={qty} onChange={handleQtyChange} />
                          <button class="btn btn-success" type="button" onClick={() =>  handleQty('plus')}>+</button>
                        </div>
                    </div>
                    <div class="col-6">
                      <p>Fan</p>
                        <div class="input-group mb-2">
                          <button class={`btn ${fan ==='off'? 'btn-danger':'btn-primary'} w-100`} type="button" onClick={() =>  setFan( fan ==='off'? 'on':'off')}>{fan ==='on'? 'On':'Off'}</button>
                        </div>
                    </div>
                    {/* {topsash.length === 0  ? ( */}
                    {topnewHeights === 0  ? (
                          <>
                            <div class="col-12 mb-2">
                              <p>Top Fixed</p>
                              <button className="btn btn-primary w-100" type="button" onClick={() => toggleboxTop()}>Add Top Fixed</button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div class="col-6 mb-2">
                              <p>Top Fixed Height</p>
                              <div className="input-group mb-2">
                                <button className="btn btn-danger" type="button" onClick={() => handleTop('minus')}>-</button>
                                <input type="text" className="form-control" value={topnewHeights}  />
                                <button className="btn btn-success" type="button" onClick={() => handleTop('plus')}>+</button>
                              </div>
                            </div>

                            <div class="col-6 mb-2">
                              <p>Top partitions </p>
                              <div class="input-group mb-2">
                                <button class="btn btn-danger" type="button" onClick={() => addTop('minus')}>-</button>
                                <input type="number" step="0.01" class="form-control" value={topsash.length}  />
                                <button class="btn btn-success" type="button" onClick={() => addTop('plus')}>+</button>
                              </div>
                            </div>

                          </>
                        )}

                        {bottomnewHeights <= 0  ? (
                          <>
                            <div class="col-12 mb-2">
                              <p>Bottm Fixed</p>
                              <button className="btn btn-primary w-100" type="button" onClick={() => toggleboxBottom()}>Add Bottom Fixed</button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div class="col-6 mb-2">
                              <p>Bottom Fixed Height</p>
                              <div className="input-group mb-2">
                                <button className="btn btn-danger" type="button" onClick={() => handleBottom('minus')}>-</button>
                                <input type="text" readOnly className="form-control" value={bottomnewHeights}  />
                                <button className="btn btn-success" type="button" onClick={() => handleBottom('plus')}>+</button>
                              </div>
                            </div>

                            <div class="col-6 mb-2">
                              <p>Bottom partitions </p>
                              <div class="input-group mb-2">
                                <button class="btn btn-danger" type="button" onClick={() => addBottom('minus')}>-</button>
                                <input type="number" readOnly step="0.01" class="form-control" value={bottomsash.length}  />
                                <button class="btn btn-success" type="button" onClick={() => addBottom('plus')}>+</button>
                              </div>
                            </div>

                          </>

                        )}
             
              {boxHeight > 1 && boxWidth > 1 && fan === 'on' ? (  
                <>

                      
               <div class="col-12 mb-2">
              <p>Fan Position</p>
              <div class="input-group mb-2">
                    <button class="btn btn-info w-50" type="button" onClick={changefanTop}>{fanTop}</button>
                    <button class="btn btn-warning w-50" type="button" onClick={changefanLeft}>{fanLeft}</button>
              </div>
              </div>
              <div class="col-12 mb-2">
              <p>Fixed/Louvers</p>
              <div class="input-group mb-2">
                    <button class="btn btn-secondary w-50" type="button" onClick={changeSwitch}>Switch</button>
                    <button class="btn btn-primary w-50" type="button" onClick={changeDevider}>{divider}</button>
              </div>
              </div>
              <div class="col-12 mb-2">
              <p>Fan Type</p>
              <div class="input-group mb-2">
                    <button className={fanType === 1 ? 'btn  w-33 btn-success' : ' btn w-33 btn-secondary'} type="button" onClick={() => handleButtonClick(1)}>12 Inch</button>
                    <button className={fanType === 2 ? 'btn  w-33 btn-success' : ' btn w-33 btn-secondary'} type="button" onClick={() => handleButtonClick(2)}>9 Inch</button>
                    <button className={fanType === 3 ? 'btn  w-33 btn-success' : ' btn w-33 btn-secondary'} type="button" onClick={() => handleButtonClick(3)}>7 Inch</button>
              </div>
              </div> 
              </>
              ):(
                <div class="col-12 mb-2">
                  <p>Type</p>
                  <button className='btn w-100 btn-secondary' type="button" onClick={changeFixed}>{switchFixed === 'on' ? 'Fixed':'Louver'}</button>
                </div>
              )}
               </div>
             
             <div class="col-12 mb-2 mb-2">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                            <p className="mb-0">Select Profile</p>
                            <a href="/uploadprofile" target="_blank" rel="noreferrer" className="text-primary" style={{ fontSize: '12px', fontWeight: 600 }}>
                              + Add Extra Profile
                            </a>
                          </div>
                    <select type="text" className="form-control" value={customProfile} onChange={handleProfileChange}>
                    {profileDetails && profileDetails.data && profileDetails.data.map((profiles, index) => (
                      <option className="form-control" value={index}>{profiles.profileName}</option>
                    ))}
                    <option className="form-control text-sm text-center" disabled>Add more Profile contact Administration</option>
                    </select>
              </div>
              
              <div class="mt-3 row align-items-center">
                  <div class="col-6 mb-2 mt-2">
                 
                      <select className="form-control" value={series} onChange={handleSeriesChange}>
                            <option value="" hidden>Select Series</option>
                            {profileDetails && profileDetails.data && profileDetails.data[customProfile] && Array.isArray(profileDetails.data[customProfile].profileData) && profileDetails.data[customProfile].profileData.length > 0 ? (
                              profileDetails.data[customProfile].profileData.map((pd, pIdx) => (
                                <option key={pIdx} className="form-control" value={pd.series}>{pd.series}</option>
                              ))
                            ) : (
                              <>
                                <option className="form-control" value="50 Series">50 Series</option>
                                <option className="form-control" value="60 Series">60 Series</option>
                              </>
                            )}
                          </select>
                  </div>

                  <div class="col-6 mb-2 mt-2 ">
                      <button class={calcBtn === false ? "btn btn-info w-100" : "btn btn-secondary w-100"} onClick={sendprofileDataToUrl}>{calcBtn === false ? 'Load Profile' : 'Profile Loading...'}</button>
                  </div>
                  </div>
                  
              </div>
            </div>
          </div>

          <div class="col-md-12 col-xxl-8 col-xl-8" >
            <div class="card" style={{background:'#fff'}}>  
              <div class="card-body mb-5">
           {boxHeight > 1 && boxWidth > 1 && (

           fan === 'on' ? (   
            <>

            <div style={{float:'left', width: boxWidth*screen/ mCalc+'vw', height:boxHeight*screen/ mCalc+'vw', border:'1px solid #333',position:'relative'}}>
                         {/* outer corner lines start */}
                      <div style={{ position:'absolute',height: '7px', width: '1px', float: 'left', marginTop: '-1px', marginLeft: `calc(${(boxWidth)*screen/mCalc}vw - 5px)`, transform: 'rotate(45deg)', borderRight: '1px solid grey' }}></div>
                      <div style={{ position:'absolute',height: '8px', width: '1px', float: 'left', marginTop: '-1px', marginLeft: '3px', transform: 'rotate(-45deg)', borderLeft: '1px solid grey' }}></div>
                      <div style={{ position:'absolute',height: '7px', width: '1px', float: 'right', marginTop: getOuterBottom(boxHeight, screen/mCalc), marginLeft:  `calc(${(boxWidth)*screen/mCalc}vw - 4px)`, transform: 'rotate(-45deg)', borderLeft: '1px solid grey' }}></div>
                      <div style={{ position:'absolute',height: '7px', width: '1px', float: 'left', marginTop: getOuterBottom(boxHeight, screen/mCalc), marginLeft: '1px', transform: 'rotate(45deg)', borderLeft: '1px solid grey' }}></div>
                      {/* outer corner lines end */}
                       {/* Inner corner lines start */}
                       <div style={{ position:'absolute',height: '8px', width: '1px', float: 'left', marginTop: `calc(${(topnewHeights)*screen/mCalc}vw + ${topnewHeights>0?'8px':'4px'})`, marginLeft: `calc(${(boxWidth)*screen/mCalc}vw - 10px)`, transform: 'rotate(45deg)', borderRight: '1px solid grey' }}></div>
                      <div style={{ position:'absolute',height: '8px', width: '1px', float: 'left', marginTop: `calc(${(topnewHeights)*screen/mCalc}vw + ${topnewHeights>0?'8px':'4px'})`, marginLeft: '8px', transform: 'rotate(-45deg)', borderLeft: '1px solid grey' }}></div>
                      <div style={{ position:'absolute',height: '7px', width: '1px', float: 'right', marginTop: getInnerBottom(boxHeight-bottomnewHeights, screen/mCalc), marginLeft:  `calc(${(boxWidth)*screen/mCalc}vw - 10px)`, transform: 'rotate(-45deg)', borderLeft: '1px solid grey' }}></div>
                      <div style={{ position:'absolute',height: '7px', width: '1px', float: 'left', marginTop: getInnerBottom(boxHeight-bottomnewHeights, screen/mCalc), marginLeft: '7px', transform: 'rotate(45deg)', borderLeft: '1px solid grey' }}></div>
                      {/* Inner corner lines end */}  
                      
              {topnewHeights > 0 && (
                
                <div style={{ display: 'flex', width: `calc(${boxWidth * screen / mCalc + 'vw'} - 10px)`, height: `calc(${(topnewHeights * screen / mCalc)}vw )`, marginTop: '4px', marginLeft: '4px' }}>
                  {topsash.map((_, index) => (
                    <div style={{ flex: 1, background: topsash[index].type === 'fixed' ? 'lightgreen' : 'lightblue', width: `calc(${(boxWidth/topsash.length) * screen/ mCalc + 'vw'} - 28px)`, height: `calc(${(topnewHeights * screen / mCalc)}vw )`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px',position:'relative' }}>
                      {topsash[index].type === 'shutter' ?(
                        <>
                          <img
                            src={left}
                            style={{
                              float: 'left',
                              marginTop: `calc(${(((topnewHeights) * screen/mCalc))}vw - 15px)`,
                              marginLeft: '45%',
                              width: screen === 3 ? '13px' : '8px',
                              transform: 'rotate(-90deg)'
                            }}
                            alt="Left Handle"
                          />
                          <div style={{ position: 'absolute', width: '100%', height: '100%',overflow:'hidden' }}>
                            {/* Left Diagonal Line  */}
                              <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(${Math.atan((topsash.length>0 ? boxWidth/topsash.length : boxWidth) / (2 * topnewHeights)) * (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>


                            {/* Right Diagonal Line */}
                             <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(-${Math.atan(( topsash.length>0 ? boxWidth/topsash.length : boxWidth) / (2 * topnewHeights))* (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>

                          </div>

                          
                        </>):(
                          <>
                           {/* fixed plus  */}
                           <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                                            
                          </>
                        )
                      }
                    </div>
                  ))}
                </div>
              )}
            
          
                {fanTop === 'Top' && fanLeft === 'Left' && divider === 'Vertical' && switchs === 'on' && (
                  <div style={{float:'left', height: `calc(${(parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights)) * screen/mCalc}vw - ${topnewHeights > 0 && bottomnewHeights > 0 ? '16px' : topnewHeights > 0 ? '16px' : bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${boxWidth * screen/mCalc}vw - 10px)`, margin: '4px', border:'1px solid #333',position:'relative'}}>
                 
                          
                    <img src={Fan} style={{float:'left', width: (parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55) *screen+'vw', marginLeft: '4px', marginTop: '4px'}} />
                    <div style={{float:'left', height: `calc(${((parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights))) * screen/mCalc}vw - ${topnewHeights > 0?'28px':'24px'})`, width: `calc(${(parseFloat(boxWidth/mCalc)-(parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55)) * screen}vw - 26px)`, margin: '5px', border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(6/boxHeight)*screen}%, lightblue ${(6/boxHeight)*screen}%)`}}></div>
                    <div style={{position:'relative',float:'left', height: `calc(${((parseFloat(boxHeight/mCalc) - parseFloat(topnewHeights/mCalc) - parseFloat(bottomnewHeights/mCalc)) - ((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55)) * screen}vw - 30px)`, width: `calc(${((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55) * screen}vw - 0px)`, margin: '4px', marginTop: `calc(-${((parseFloat(boxHeight/mCalc) - parseFloat(topnewHeights/mCalc) - parseFloat(bottomnewHeights/mCalc))-((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55)) * screen}vw + 25px)`, border:'1px solid #333', background: 'lightblue'}}>
                       {/* fixed plus  */}
                       <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                       
                    </div>
                  </div>
                )}
                
                {fanTop === 'Bottom' && fanLeft === 'Left'  && divider === 'Vertical' && switchs === 'on' && (
                    <div style={{float:'left', height: `calc(${(parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights)) * screen/mCalc}vw - ${topnewHeights > 0 && bottomnewHeights > 0 ? '16px' : topnewHeights > 0 ? '16px' : bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${boxWidth * screen/mCalc}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                      <div style={{position:'relative',float:'left', height: `calc(${((parseFloat(boxHeight/mCalc) - parseFloat(topnewHeights/mCalc) - parseFloat(bottomnewHeights/mCalc)) - (parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55))  * screen}vw - 30px)`, width: `calc(${((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55) * screen}vw - 0px)`, margin: '4px', marginTop: '5px', border:'1px solid #333', background: 'lightblue'}}>
                        {/* fixed plus  */}
                       <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                      </div>
                      
                   
                      <div style={{float:'right', height: `calc(${((parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights))) * screen/mCalc}vw - ${topnewHeights > 0?'28px':'24px'})`, width: `calc(${(parseFloat(boxWidth/mCalc)-((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55)) * screen}vw - 26px)`, margin: '4px', marginTop: `calc(-${((parseFloat(boxHeight/mCalc) - parseFloat(topnewHeights/mCalc) - parseFloat(bottomnewHeights/mCalc))-((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55)) * screen}vw + 25px)`, border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(6/boxHeight)*screen}%, lightblue ${(6/boxHeight)*screen}%)`}}></div>
                   
                      <img src={Fan} style={{float:'left',  width: (parseFloat(boxWidth) / mCalc  > 1.25 ? .85 : .55) *screen +'vw', marginLeft: '4px', marginBottom: '4px'}} />
                    </div>
                )}

                {fanTop === 'Top' && fanLeft === 'Right' &&  divider === 'Vertical' && switchs === 'on' && (
                  <div style={{float:'left', height: `calc(${(parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights)) * screen/mCalc}vw - ${topnewHeights > 0 && bottomnewHeights > 0 ? '16px' : topnewHeights > 0 ? '16px' : bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${boxWidth * screen/mCalc}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                    <img src={Fan} style={{float:'right',width: (parseFloat(boxWidth) / mCalc  > 1.25 ? .85 : .55) *screen +'vw', marginRight: '4px', marginTop: '4px'}} />
                    <div style={{float:'left', height: `calc(${((parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights))) * screen/mCalc}vw - ${topnewHeights > 0?'28px':'24px'})`, width:`calc(${(parseFloat(boxWidth/mCalc)-(parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55)) * screen}vw  - 26px)`, margin: '5px', border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(6/boxHeight)*screen}%, lightblue ${(6/boxHeight)*screen}%)`}}></div>
                    <div style={{position:'relative',float:'right', height: `calc(${((parseFloat(boxHeight/mCalc) - parseFloat(topnewHeights/mCalc) - parseFloat(bottomnewHeights/mCalc)) - ((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55)) * screen}vw - 30px)`, width: `calc(${((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55) * screen}vw - 0px)`, margin: '4px', marginTop: `calc(-${((parseFloat(boxHeight/mCalc) - parseFloat(topnewHeights/mCalc) - parseFloat(bottomnewHeights/mCalc))-((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55)) * screen}vw + 25px)`, border:'1px solid #333', background: 'lightblue'}}>
                       <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                    </div>
                  </div>
                )}

                {fanTop === 'Bottom' && fanLeft === 'Right' &&  divider === 'Vertical' && switchs === 'on' && (
                  <div style={{float:'left', height: `calc(${(parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights)) * screen/mCalc}vw - ${topnewHeights > 0 && bottomnewHeights > 0 ? '16px' : topnewHeights > 0 ? '16px' : bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${boxWidth * screen/mCalc}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                    <div style={{position:'relative',float:'right', height: `calc(${((parseFloat(boxHeight/mCalc) - parseFloat(topnewHeights/mCalc) - parseFloat(bottomnewHeights/mCalc)) - (parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55))  * screen}vw - 30px)`, width: `calc(${((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55) * screen}vw - 0px)`, margin: '4px', marginTop: '5px', border:'1px solid #333', background: 'lightblue'}}>
                          {/* fixed plus  */}
                       <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                    </div>
                    <div style={{float:'left', height: `calc(${((parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights))) * screen/mCalc}vw - ${topnewHeights > 0?'28px':'24px'})`, width: `calc(${(parseFloat(boxWidth/mCalc)-((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55)) * screen}vw - 26px)`, margin: '5px', marginTop: `calc(-${((parseFloat(boxHeight/mCalc) - parseFloat(topnewHeights/mCalc) - parseFloat(bottomnewHeights/mCalc))-((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55)) * screen}vw + 25px)`, border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(6/boxHeight)*screen}%, lightblue ${(6/boxHeight)*screen}%)`}}></div>
                    <img src={Fan} style={{float:'right', width: (parseFloat(boxWidth) / mCalc  > 1.25 ? .85 : .55) *screen +'vw', marginRight: '4px', marginBottom: '4px'}} />
                  </div>
                )}

                {fanTop === 'Top' && fanLeft === 'Left' &&  divider === 'Vertical' && switchs === 'off' && (
                  <div style={{float:'left', height: `calc(${(parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights)) * screen/mCalc}vw - ${topnewHeights > 0 && bottomnewHeights > 0 ? '16px' : topnewHeights > 0 ? '16px' : bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${boxWidth * screen/mCalc}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                    <img src={Fan} style={{float:'left', width: (parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55) *screen+'vw', marginLeft: '4px', marginTop: '4px'}} />
                    <div style={{float:'left', height: `calc(${((parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights))) * screen/mCalc}vw - ${topnewHeights > 0?'28px':'24px'})`, width: `calc(${(parseFloat(boxWidth/mCalc)-(parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55)) * screen}vw - 26px)`, margin: '5px', border:'1px solid #333', background: 'lightblue'}}>
                       {/* fixed plus  */}
                       <div style={{ position: 'absolute', top: '50%', left: '70%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                       
                    </div>
                    <div style={{position:'relative', float:'left', height: `calc(${((parseFloat(boxHeight/mCalc) - parseFloat(topnewHeights/mCalc) - parseFloat(bottomnewHeights/mCalc)) - ((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55)) * screen}vw - 30px)`, width: `calc(${((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55) * screen}vw - 0px)`, margin: '4px', marginTop: `calc(-${((parseFloat(boxHeight/mCalc) - parseFloat(topnewHeights/mCalc) - parseFloat(bottomnewHeights/mCalc))-((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55)) * screen}vw  + 25px)`, border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10/boxHeight)*screen}%, lightblue ${(10/boxHeight)*screen}%)`}}></div>
                  </div>
                )}
                
                {fanTop === 'Bottom' && fanLeft === 'Left' && divider === 'Vertical' && switchs === 'off' && (
                    <div style={{float:'left', height: `calc(${(parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights)) * screen/mCalc}vw - ${topnewHeights > 0 && bottomnewHeights > 0 ? '16px' : topnewHeights > 0 ? '16px' : bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${boxWidth * screen/mCalc}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                      <div style={{position:'relative',float:'left', height: `calc(${((parseFloat(boxHeight/mCalc) - parseFloat(topnewHeights/mCalc) - parseFloat(bottomnewHeights/mCalc)) - (parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55))  * screen}vw - 30px)`, width: `calc(${((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55) * screen}vw - 0px)`, margin: '4px', marginTop: '5px', border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10/boxHeight)*screen}%, lightblue ${(10/boxHeight)*screen}%)`}}></div>
                      <div style={{float:'right', height: `calc(${((parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights))) * screen/mCalc}vw - ${topnewHeights > 0?'28px':'24px'})`, width: `calc(${(parseFloat(boxWidth/mCalc)-((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55)) * screen}vw - 26px)`, margin: '5px', marginTop: `calc(-${((parseFloat(boxHeight/mCalc) - parseFloat(topnewHeights/mCalc) - parseFloat(bottomnewHeights/mCalc))-((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55)) * screen}vw + 25px)`, border:'1px solid #333', background: 'lightblue'}}>
                      {/* fixed plus  */}
                       <div style={{ position: 'absolute', top: '50%', left: '70%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                      </div>
                      <img src={Fan} style={{float:'left', width: (parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55) *screen+'vw', marginLeft: '4px', marginBottom: '4px'}} />
                    </div>
                )}

                {fanTop === 'Top' && fanLeft === 'Right' &&  divider === 'Vertical' && switchs === 'off' && (
                  <div style={{float:'left', height: `calc(${(parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights)) * screen/mCalc}vw - ${topnewHeights > 0 && bottomnewHeights > 0 ? '16px' : topnewHeights > 0 ? '16px' : bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${boxWidth * screen/mCalc}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                    <img src={Fan} style={{float:'right', width: (parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55) *screen+'vw', marginRight: '4px', marginTop: '4px'}} />
                    <div style={{float:'left', height: `calc(${((parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights))) * screen/mCalc}vw - ${topnewHeights > 0?'28px':'24px'})`, width: `calc(${(parseFloat(boxWidth/mCalc)-(parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55)) * screen}vw - 26px)`, margin: '5px', border:'1px solid #333', background: 'lightblue'}}>
                     {/* fixed plus  */}
                       <div style={{ position: 'absolute', top: '50%', left: '30%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                    </div>
                    <div style={{position:'relative',float:'right', height: `calc(${((parseFloat(boxHeight/mCalc) - parseFloat(topnewHeights/mCalc) - parseFloat(bottomnewHeights/mCalc)) - ((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55)) * screen}vw - 30px)`, width: `calc(${((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55) * screen}vw - 0px)`, margin: '4px', marginTop: `calc(-${((parseFloat(boxHeight/mCalc) - parseFloat(topnewHeights/mCalc) - parseFloat(bottomnewHeights/mCalc))-((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55)) * screen}vw + 25px)`, border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10/boxHeight)*screen}%, lightblue ${(10/boxHeight)*screen}%)`}}></div>
                  </div>
                )}

                {fanTop === 'Bottom' && fanLeft === 'Right'  && divider === 'Vertical' && switchs === 'off' && (
                  <div style={{float:'left', height: `calc(${(parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights)) * screen/mCalc}vw - ${topnewHeights > 0 && bottomnewHeights > 0 ? '16px' : topnewHeights > 0 ? '16px' : bottomnewHeights > 0 ? '14px' : '11px'})`, margin: '4px', border:'1px solid #333'}}>
                    <div style={{position:'relative',float:'right', height: `calc(${((parseFloat(boxHeight/mCalc) - parseFloat(topnewHeights/mCalc) - parseFloat(bottomnewHeights/mCalc)) - (parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55))  * screen}vw - 30px)`, width: `calc(${((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55) * screen}vw - 0px)`, margin: '4px', marginTop: '5px', border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10/boxHeight)*screen}%, lightblue ${(10/boxHeight)*screen}%)`}}></div>
                    <div style={{float:'left', height: `calc(${((parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights))) * screen/mCalc}vw - ${topnewHeights > 0?'28px':'24px'})`, width: `calc(${(parseFloat(boxWidth/mCalc)-((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55)) * screen}vw - 26px)`, margin: '5px', marginTop: `calc(-${((parseFloat(boxHeight/mCalc) - parseFloat(topnewHeights/mCalc) - parseFloat(bottomnewHeights/mCalc))-((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55)) * screen}vw + 25px)`, border:'1px solid #333', background: 'lightblue'}}>
                     {/* fixed plus  */}
                       <div style={{ position: 'absolute', top: '50%', left: '30%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                    </div>
                    <img src={Fan} style={{float:'right', width: (parseFloat(boxWidth) / mCalc  > 1.25 ? .85 : .55) *screen +'vw', marginRight: '4px', marginBottom: '4px'}} />
                  </div>
                )}
                
                {fanTop === 'Top' && fanLeft === 'Left' && divider === 'Horizontal' && switchs === 'on' && (
                  <div style={{float:'left', height: `calc(${(parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights)) * screen/mCalc}vw - ${topnewHeights > 0 && bottomnewHeights > 0 ? '16px' : topnewHeights > 0 ? '16px' : bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${boxWidth * screen/mCalc}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                    <img src={Fan} style={{float:'left', width: (parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55) *screen+'vw', marginLeft: '4px', marginTop: '4px'}} />
                    <div style={{float:'right', height: `calc(${((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55) * screen}vw - 0px)`, width: `calc(${(parseFloat(boxWidth/mCalc)-(parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55)) * screen}vw - 26px)`, margin: '5px',  border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10/boxHeight)*screen}%, lightblue ${(10/boxHeight)*screen}%)`}}></div>
                    <div style={{position:'relative', float:'left', height: `calc(${((parseFloat(boxHeight/mCalc) - parseFloat(topnewHeights/mCalc) - parseFloat(bottomnewHeights/mCalc)) - ((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55)) * screen}vw - 30px)`, width: `calc(${(boxWidth) * screen/mCalc}vw - 20px)`, margin: '4px', marginTop: '0px', border:'1px solid #333', background: 'lightblue'}}>
                       {/* fixed plus  */}
                       <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                      </div>
                  </div>
                )}
                
                {fanTop === 'Bottom' && fanLeft === 'Left'  && divider === 'Horizontal' && switchs === 'on' && (
                  <div style={{float:'left', height: `calc(${(parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights)) * screen/mCalc}vw - ${topnewHeights > 0 && bottomnewHeights > 0 ? '16px' : topnewHeights > 0 ? '16px' : bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${boxWidth * screen/mCalc}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                    <div style={{position:'relative', float:'left', height: `calc(${((parseFloat(boxHeight/mCalc) - parseFloat(topnewHeights/mCalc) - parseFloat(bottomnewHeights/mCalc)) - ((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55)) * screen}vw - 30px)`, width: `calc(${(boxWidth) * screen/mCalc}vw - 20px)`, margin: '4px', marginTop: '5px', border:'1px solid #333', background: 'lightblue'}}>
                         {/* fixed plus  */}
                       <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                     
                    </div>
                    <div style={{float:'right', height: `calc(${((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55) * screen}vw - 0px)`, width: `calc(${(parseFloat(boxWidth/mCalc)-(parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55)) * screen}vw - 26px)`, marginRight: '5px', marginBottom: '4px',  border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10/boxHeight)*screen}%, lightblue ${(10/boxHeight)*screen}%)`}}></div>
                    <img src={Fan} style={{float:'left', width: (parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55) *screen+'vw', marginLeft: '4px', marginBottom: '4px'}} />
                  </div>
                )}
                
                {fanTop === 'Top' && fanLeft === 'Right'  && divider === 'Horizontal' && switchs === 'on' && (
                  <div style={{float:'left', height: `calc(${(parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights)) * screen/mCalc}vw - ${topnewHeights > 0 && bottomnewHeights > 0 ? '16px' : topnewHeights > 0 ? '16px' : bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${boxWidth * screen/mCalc}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                    <img src={Fan} style={{float:'right', width: (parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55) *screen+'vw', marginRight: '4px', marginTop: '4px'}} />
                    <div style={{float:'left', height: `calc(${((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55) * screen}vw - 0px)`, width: `calc(${(parseFloat(boxWidth/mCalc)-(parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55)) * screen}vw - 26px)`, margin: '5px',  border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10/boxHeight)*screen}%, lightblue ${(10/boxHeight)*screen}%)`}}>
                    </div>
                    <div style={{float:'left', height: `calc(${((parseFloat(boxHeight/mCalc) - parseFloat(topnewHeights/mCalc) - parseFloat(bottomnewHeights/mCalc)) - ((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55)) * screen}vw - 30px)`, width: `calc(${(boxWidth) * screen/mCalc}vw - 20px)`, margin: '4px', marginTop: '0px', border:'1px solid #333', background: 'lightblue'}}>
                        {/* fixed plus  */}
                       <div style={{ position: 'absolute', top: '70%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                     
                    </div>
                  </div>
                )}
                
                {fanTop === 'Bottom' && fanLeft === 'Right'  && divider === 'Horizontal' && switchs === 'on' && (
                  <div style={{float:'left', height: `calc(${(parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights)) * screen/mCalc}vw - ${topnewHeights > 0 && bottomnewHeights > 0 ? '16px' : topnewHeights > 0 ? '16px' : bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${boxWidth * screen/mCalc}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                    <div style={{position:'relative', float:'left', height: `calc(${((parseFloat(boxHeight/mCalc) - parseFloat(topnewHeights/mCalc) - parseFloat(bottomnewHeights/mCalc)) - ((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55)) * screen}vw - 30px)`, width: `calc(${(boxWidth) * screen/mCalc}vw - 20px)`, margin: '4px', marginTop: '5px', border:'1px solid #333', background: 'lightblue'}}>
                        {/* fixed plus  */}
                       <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                     
                    </div>
                    <div style={{float:'left', height: `calc(${((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55) * screen}vw - 0px)`, width: `calc(${(parseFloat(boxWidth/mCalc)-(parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55)) * screen}vw - 26px)`, marginLeft: '5px', marginBottom: '4px',  border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10/boxHeight)*screen}%, lightblue ${(10/boxHeight)*screen}%)`}}></div>
                    <img src={Fan} style={{float:'right', width: (parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55) *screen+'vw', marginRight: '4px', marginBottom: '4px'}} />
                  </div>
                )}

                {fanTop === 'Top' && fanLeft === 'Left'  && divider === 'Horizontal' && switchs === 'off' && (
                  <div style={{float:'left', height: `calc(${(parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights)) * screen/mCalc}vw - ${topnewHeights > 0 && bottomnewHeights > 0 ? '16px' : topnewHeights > 0 ? '16px' : bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${boxWidth * screen/mCalc}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                    <img src={Fan} style={{float:'left', width: (parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55) *screen+'vw', marginLeft: '4px', marginTop: '4px'}} />
                    <div style={{float:'right', height: `calc(${((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55) * screen}vw - 0px)`, width: `calc(${(parseFloat(boxWidth/mCalc)-(parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55)) * screen}vw - 26px)`, margin: '5px',  border:'1px solid #333', background: 'lightblue' }}>
                         {/* fixed plus  */}
                       <div style={{ position: 'absolute', top: '35%', left: '70%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                       
                    </div>
                    <div style={{position:'relative',float:'left', height: `calc(${((parseFloat(boxHeight/mCalc) - parseFloat(topnewHeights/mCalc) - parseFloat(bottomnewHeights/mCalc)) - ((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55)) * screen}vw - 30px)`, width: `calc(${(boxWidth) * screen/mCalc}vw - 20px)`, margin: '4px', marginTop: '0px', border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10/boxHeight)*screen}%, lightblue ${(10/boxHeight)*screen}%)`}}></div>
                  </div>
                )}
                
                {fanTop === 'Top' && fanLeft === 'Right'  && divider === 'Horizontal' && switchs === 'off' && (
                  <div style={{float:'left', height: `calc(${(parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights)) * screen/mCalc}vw - ${topnewHeights > 0 && bottomnewHeights > 0 ? '16px' : topnewHeights > 0 ? '16px' : bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${boxWidth * screen/mCalc}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                    <img src={Fan} style={{float:'right', width: (parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55) *screen+'vw', marginRight: '4px', marginTop: '4px'}} />
                    <div style={{float:'left', height: `calc(${((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55) * screen}vw - 0px)`, width: `calc(${(parseFloat(boxWidth/mCalc)-(parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55)) * screen}vw - 26px)`, margin: '5px',  border:'1px solid #333', background: 'lightblue' }}>
                      {/* fixed plus  */}
                       <div style={{ position: 'absolute', top: '20%', left: '30%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                       
                    </div>
                    <div style={{position:'relative',float:'left', height: `calc(${((parseFloat(boxHeight/mCalc) - parseFloat(topnewHeights/mCalc) - parseFloat(bottomnewHeights/mCalc)) - ((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55)) * screen}vw - 30px)`, width: `calc(${(boxWidth) * screen/mCalc}vw - 20px)`, margin: '4px', marginTop: '0px', border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10/boxHeight)*screen}%, lightblue ${(10/boxHeight)*screen}%)`}}></div>
                  </div>
                )}
                
                {fanTop === 'Bottom' && fanLeft === 'Right'  && divider === 'Horizontal' && switchs === 'off' && (
                  <div style={{float:'left', height: `calc(${(parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights)) * screen/mCalc}vw - ${topnewHeights > 0 && bottomnewHeights > 0 ? '16px' : topnewHeights > 0 ? '16px' : bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${boxWidth * screen/mCalc}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                    <div style={{position:'relative',float:'left', height: `calc(${((parseFloat(boxHeight/mCalc) - parseFloat(topnewHeights/mCalc) - parseFloat(bottomnewHeights/mCalc)) - ((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55)) * screen}vw - 30px)`, width: `calc(${(boxWidth) * screen/mCalc}vw - 20px)`, margin: '4px', marginTop: '5px', border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10/boxHeight)*screen}%, lightblue ${(10/boxHeight)*screen}%)`}}></div>
                    <img src={Fan} style={{float:'right', width: (parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55) *screen+'vw', marginRight: '4px', marginTop: '0px'}} />
                    <div style={{float:'left', height: `calc(${((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55) * screen}vw - 0px)`, width: `calc(${(parseFloat(boxWidth/mCalc)-(parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55)) * screen}vw - 26px)`, marginLeft: '4px',  border:'1px solid #333', background: 'lightblue' }}>
                         {/* fixed plus  */}
                       <div style={{ position: 'absolute', top: '70%', left: '30%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                       
                    </div>
                  </div>
                )}

                {fanTop === 'Bottom' && fanLeft === 'Left'  && divider === 'Horizontal' && switchs === 'off' && (
                  <div style={{float:'left', height: `calc(${(parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights)) * screen/mCalc}vw - ${topnewHeights > 0 && bottomnewHeights > 0 ? '16px' : topnewHeights > 0 ? '16px' : bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${boxWidth * screen/mCalc}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                  <div style={{float:'left', height: `calc(${((parseFloat(boxHeight/mCalc) - parseFloat(topnewHeights/mCalc) - parseFloat(bottomnewHeights/mCalc)) - ((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55)) * screen}vw - 30px)`, width: `calc(${(boxWidth) * screen/mCalc}vw - 20px)`, margin: '4px', marginTop: '5px', border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10/boxHeight)*screen}%, lightblue ${(10/boxHeight)*screen}%)`}}></div>
                    <img src={Fan} style={{float:'left', width: (parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55) *screen+'vw', marginLeft: '4px', marginRight: '4px'}} />
                    <div style={{float:'right', height: `calc(${((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55) * screen}vw - 0px)`, width: `calc(${(parseFloat(boxWidth/mCalc)-(parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55)) * screen}vw - 26px)`, marginRight: '5px',  border:'1px solid #333', background: 'lightblue' }}>
                        {/* fixed plus  */}
                       <div style={{ position: 'absolute', top: '70%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                       
                    </div>
                  </div>
                )}
             

             
              {bottomnewHeights > 0 && (
               
                <div style={{ display: 'flex', width: `calc(${boxWidth * screen/ mCalc + 'vw'} - 10px)`, height: `calc(${bottomnewHeights * screen/mCalc}vw - 10px)`, marginTop: '5px', marginLeft: '4px' }}>
                  {bottomsash.map((_, index) => (
                    <div style={{ flex: 1, background: bottomsash[index].type === 'fixed' ? 'lightgreen' : 'lightblue', width: `calc(${(boxWidth/topsash.length) * screen / mCalc+ 'vw'} - 28px)`, height: `calc(${(bottomnewHeights * screen/mCalc)}vw - 2px )`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px', position:'relative'}}>
                      {bottomsash[index].type === 'shutter' ?(
                        <>
                          <img
                            src={left}
                            style={{
                              float: 'left',
                              marginTop: `calc(${(((bottomnewHeights) * screen/mCalc))}vw - 15px)`,
                              marginLeft: '45%',
                              width: screen === 3 ? '13px' : '8px',
                              transform: 'rotate(-90deg)'
                            }}
                            alt="Left Handle"
                          />
                          <div style={{ position: 'absolute', width: '100%', height: '100%',overflow:'hidden' }}>
                            {/* Left Diagonal Line  */}
                            <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(${Math.atan((bottomsash.length>0 ? boxWidth/bottomsash.length : boxWidth) / (2 * bottomnewHeights)) * (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>
                                         
                                         
                            {/* Right Diagonal Line */}
                            <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(-${Math.atan((bottomsash.length>0 ? boxWidth/bottomsash.length : boxWidth) / (2 * bottomnewHeights)) * (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>
                                         
                          </div> 

                          
                        </>):(
                          <>
                           {/* fixed plus  */}
                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                                                  
                          </>
                        )
                      }
                    </div>
                  ))}
                </div>
              )}
              

            </div>
                
            </>
            
          ):(
            <>
              <div style={{float:'left',width: boxWidth * screen / mCalc + 'vw', height:boxHeight*screen/ mCalc+'vw', border:'1px solid #333',position:'relative'}}>
                {/* outer corner lines start */}
                <div style={{ position:'absolute',height: '8px', width: '1px', float: 'left', marginTop: '-1.5px', marginLeft: `calc(${(boxWidth)*screen/mCalc}vw - 4px)`, transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                <div style={{ position:'absolute',height: '8px', width: '1px', float: 'left', marginTop: '-1px', marginLeft: '3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                <div style={{ position:'absolute',height: '8px', width: '1px', float: 'right', marginTop: getOuterBottom(boxHeight, screen/mCalc), marginLeft:  `calc(${(boxWidth)*screen/mCalc}vw - 4px)`, transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                <div style={{ position:'absolute',height: '8px', width: '1px', float: 'left', marginTop: getOuterBottom(boxHeight, screen/mCalc), marginLeft: '1px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>
                {/* outer corner lines end */}
              {topnewHeights > 0 && (
                <div style={{ display: 'flex', width: `calc(${boxWidth * screen/ mCalc + 'vw'} - 12px)`, height: `calc(${(topnewHeights * screen/mCalc)}vw )`, marginTop: '5px', marginLeft: '5px' }}>
                  {topsash.map((_, index) => (
                    <div style={{ flex: 1, background: topsash[index].type === 'fixed' ? 'lightgreen' : 'lightblue', width: `calc(${(boxWidth/topsash.length) * screen / mCalc+ 'vw'} - 28px)`, height: `calc(${(topnewHeights * screen/mCalc)}vw )`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px', position:"relative" }}>
                      {topsash[index].type === 'shutter' ?(
                        <>
                          <img
                            src={left}
                            style={{
                              float: 'left',
                              marginTop: `calc(${(((topnewHeights) * screen/mCalc))}vw - 15px)`,
                              marginLeft: '45%',
                              width: screen === 3 ? '13px' : '8px',
                              transform: 'rotate(-90deg)'
                            }}
                            alt="Left Handle"
                          />
                            <div style={{ position: 'absolute', width: '100%', height: '100%',overflow:'hidden' }}>
                            {/* Left Diagonal Line  */}
                              <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(${Math.atan((topsash.length>0 ? boxWidth/topsash.length : boxWidth) / (2 * topnewHeights)) * (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>


                            {/* Right Diagonal Line */}
                             <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(-${Math.atan(( topsash.length>0 ? boxWidth/topsash.length : boxWidth) / (2 * topnewHeights))* (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>

                          </div>

                          
                        </>):(
                          <>
                           {/* fixed plus  */}
                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                                                  
                          </>
                        )
                      }
                    </div>
                  ))}
                </div>
              )}
              {switchFixed === 'on' ? ( <>
                <div style={{ height: `calc(${(boxHeight-topnewHeights-bottomnewHeights)*screen/mCalc}vw - ${bottomsash.length > 0 && bottomsash.length > 0 ? '22px' : topnewHeights > 0 ? '17px' : bottomsash.length > 0 ? '17px ' : '12px'})`, width: `calc(${(boxWidth)*screen/mCalc}vw - 12px)`, marginLeft: '5px', marginTop: '5px', marginBottom: bottomsash.length > 0 ? '5px' : '0px', background:'lightblue', border:'1px solid #333',position:'relative'}}>
                   {/* fixed plus  */}
                   <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                             
                </div>
                </>
              ):(<>
                  <div style={{ height: `calc(${(boxHeight-topnewHeights-bottomnewHeights)*screen/mCalc}vw - ${bottomsash.length > 0 && bottomsash.length > 0 ? '22px' : topnewHeights > 0 ? '17px' : bottomsash.length > 0 ? '17px ' : '12px'})`, width: `calc(${(boxWidth)*screen/mCalc}vw - 12px)`, marginLeft: '5px', marginTop: '5px', marginBottom: bottomsash.length > 0 ? '5px' : '0px',  backgroundImage: `repeating-linear-gradient(lightblue, white ${(6/(boxHeight-topnewHeights-bottomnewHeights))*screen}%, lightblue ${(6/(boxHeight-topnewHeights-bottomnewHeights))*screen}%)`, border:'1px solid #333'}}></div>
                </>
              )}<>
              {bottomnewHeights > 0 && (
                <div style={{ display: 'flex', width: `calc(${boxWidth * screen / mCalc + 'vw'} - 12px)`, height: `calc(${(bottomnewHeights * screen/mCalc)}vw )`, marginTop: '5px', marginLeft: '5px' }}>
                  {bottomsash.map((_, index) => (
                    <div style={{ flex: 1, background: bottomsash[index].type === 'fixed' ? 'lightgreen' : 'lightblue', width: `calc(${(boxWidth/topsash.length) * screen / mCalc+ 'vw'} - 28px)`, height: `calc(${(bottomnewHeights * screen/mCalc)}vw )`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px', position:'relative' }}>
                      {bottomsash[index].type === 'shutter' ?(
                        <>
                          <img
                            src={left}
                            style={{
                              float: 'left',
                              marginTop: `calc(${(((bottomnewHeights) * screen/mCalc))}vw - 15px)`,
                              marginLeft: '45%',
                              width: screen === 3 ? '13px' : '8px',
                              transform: 'rotate(-90deg)'
                            }}
                            alt="Left Handle"
                          />
                          <div style={{ position: 'absolute', width: '100%', height: '100%',overflow:'hidden' }}>
                            {/* Left Diagonal Line  */}
                            <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(${Math.atan((bottomsash.length>0 ? boxWidth/bottomsash.length : boxWidth) / (2 * bottomnewHeights)) * (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>
                                         
                                         
                            {/* Right Diagonal Line */}
                            <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(-${Math.atan((bottomsash.length>0 ? boxWidth/bottomsash.length : boxWidth) / (2 * bottomnewHeights)) * (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>
                                         
                          </div> 
                          
                        </>):(
                          <>
                           {/* fixed plus  */}
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                                                  
                          </>
                        )
                      }
                    </div>
                  ))}
                </div>
              )}</>

                </div>
            </>
          )
        )}

          {boxHeight === 1 && boxWidth > 1 && (

          fan === 'on' ? (
            <>
           {switchFixed === 'on' && (  
            
              <div style={{float:'left', width: boxWidth*screen/ mCalc+'vw', height:boxHeight*screen/ mCalc+'vw', border:'1px solid #333'}}>
                <div style={{float:'left', height: `calc(${boxHeight * screen/ mCalc}vw - 10px)`, width: `calc(${boxWidth * screen/ mCalc}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                  <img src={Fan} style={{float:'left', width: .75*screen/ mCalc+'vw', margin: '4px', }} />
                  <div style={{float: 'right', height: `calc(${(boxHeight)*screen/ mCalc}vw - 22px)`, width: `calc(${(boxWidth- .94)*screen/ mCalc}vw - 10px)`, marginRight: '5px', marginTop: '5px', background:'lightblue', border:'1px solid #333'}}></div>
                </div>
              </div>
            )}

            {switchFixed === 'off' && (  
            
            <div style={{float:'left', width: boxWidth*screen/ mCalc+'vw', height:boxHeight*screen/ mCalc+'vw', border:'1px solid #333'}}>
              <div style={{float:'left', height: `calc(${boxHeight * screen/ mCalc}vw - 10px)`, width: `calc(${boxWidth * screen/ mCalc}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                <img src={Fan} style={{float:'left', width: .75*screen/ mCalc+'vw', margin: '4px', }} />
                <div style={{float: 'right', height: `calc(${(boxHeight)*screen/ mCalc}vw - 22px)`, width: `calc(${(boxWidth- .94)*screen/ mCalc}vw - 10px)`, marginRight: '5px', marginTop: '5px',  backgroundImage: `repeating-linear-gradient(lightblue, white ${(6/boxHeight)*screen/ mCalc}%, lightblue ${(6/boxHeight)*screen/ mCalc}%)`, border:'1px solid #333'}}></div>
              </div>
            </div>
          )}
            </>
          ):(
            
              <div style={{float:'left', width: boxWidth*screen/ mCalc+'vw', height:boxHeight*screen/ mCalc+'vw', border:'1px solid #333'}}>
              { switchFixed === 'off' ?   
                <div style={{float: 'right', height: `calc(${(boxHeight)*screen/ mCalc}vw - 12px)`, width: `calc(${(boxWidth)*screen/ mCalc}vw - 10px)`, marginRight: '5px', marginTop: '5px',  backgroundImage: `repeating-linear-gradient(lightblue, white ${(6/boxHeight)*screen/ mCalc}%, lightblue ${(6/boxHeight)*screen/ mCalc}%)`, border:'1px solid #333'}}></div>
              :
                <div style={{float: 'right', height: `calc(${(boxHeight)*screen/ mCalc}vw - 12px)`, width: `calc(${(boxWidth)*screen/ mCalc}vw - 10px)`, marginRight: '5px', marginTop: '5px', background:'lightblue', border:'1px solid #333'}}></div>
              }
              </div>
          
          )
          
          )}

          {boxHeight >= 1 && boxWidth == 1 && (
            fan === 'on' ? (
            <>
             {switchFixed === 'on' && (  
              <div style={{float:'left', width: boxWidth*screen/ mCalc+'vw', height:boxHeight*screen/ mCalc+'vw', border:'1px solid #333'}}>
                  <div style={{float:'left', height: `calc(${boxHeight * screen/ mCalc}vw - 10px)`, width: `calc(${boxWidth * screen/ mCalc}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                  <img src={Fan} style={{float:'left', width: .75*screen/ mCalc+'vw', margin: '4px', }} />
                  <div style={{float: 'right', height: `calc(${(boxHeight-.75)*screen/ mCalc}vw - 25px)`, width: `calc(${(boxWidth)*screen/ mCalc}vw - 20px)`, marginRight: '5px', background:'lightblue', border:'1px solid #333'}}></div>
                </div>
              </div>
             )}
             
             {switchFixed === 'off' && (
              <div style={{float:'left', width: boxWidth*screen/ mCalc+'vw', height:boxHeight*screen/ mCalc+'vw', border:'1px solid #333'}}>
                <div style={{float:'left', height: `calc(${boxHeight * screen/ mCalc}vw - 10px)`, width: `calc(${boxWidth * screen/ mCalc}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                <img src={Fan} style={{float:'left', width: .75*screen/ mCalc+'vw', margin: '4px', }} />
                <div style={{float: 'right', height: `calc(${(boxHeight-.75)*screen/ mCalc}vw - 25px)`, width: `calc(${(boxWidth)*screen/ mCalc}vw - 20px)`, marginRight: '5px',  backgroundImage: `repeating-linear-gradient(lightblue, white ${(6/boxHeight)*screen/ mCalc}%, lightblue ${(6/boxHeight)*screen/ mCalc}%)`, border:'1px solid #333'}}></div>
                </div>
              </div>
             )}
            </>
            ):(
              <div style={{float:'left', width: boxWidth*screen/ mCalc+'vw', height:boxHeight*screen/ mCalc+'vw', border:'1px solid #333'}}>
                { switchFixed === 'off' ?   
                <div style={{float: 'right', height: `calc(${(boxHeight)*screen/mCalc}vw - 12px)`, width: `calc(${(boxWidth)*screen/mCalc}vw - 12px)`, marginRight: '5px', marginTop: '5px',  backgroundImage: `repeating-linear-gradient(lightblue, white ${(6/boxHeight)*screen/mCalc}%, lightblue ${(6/boxHeight)*screen/mCalc}%)`, border:'1px solid #333'}}></div>
              :
                <div style={{float: 'right', height: `calc(${(boxHeight)*screen/mCalc}vw - 12px)`, width: `calc(${(boxWidth)*screen/mCalc}vw - 12px)`, marginRight: '5px', marginTop: '5px', background:'lightblue', border:'1px solid #333'}}></div>
              }
              </div>
            )
          )}
          
          {(boxWidth > 1 || boxHeight > 1) && (
            <>
              <div className="expanding-arrow-line" style={{ 
                  position: 'absolute',
                  float:'left', 
                  width: `calc(${boxWidth * screen/mCalc}vw )`,
                  bottom:'-10px', 
                  top: `calc(${boxHeight* screen/mCalc}vw - 25px)`,
                  }}> 
                <div className="arrow-left"></div>
                  <div className="line" align="center">
                    <div style={{marginTop:'-7px',background:'white',maxWidth:'20px',textAlign:'center'}}><p>{typeof boxWidth === 'number' ? boxWidth.toFixed(2) : boxWidth}</p></div>
                  </div>
                  <div className="arrow-right"></div>
                </div>

            <div style={{ width: '30px', float: 'left', paddingLeft: '15px', textAlign: 'left' }}>
              <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${boxHeight * screen/ mCalc}vw)`, top: '0', position: 'relative' }}>
                <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                  <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                    <div style={{ marginLeft: '-10px', marginTop: boxHeight * (screen/mCalc/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof boxHeight === 'number' ? boxHeight.toFixed(2) : boxHeight}</p></div>
                  </div>
                <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
              </div>
            </div>  
            </>
          )}


             </div>
            </div>
            <div class="card">
              <div class="card-body">
                    {topsash.length > 0 && 
                      <div class="row mt-2">
                        <p>Top</p>
                        {topsash.map((sash, index) => 
                          <div class="col-md-6 col-xxl-3 col-xl-3" key={index}>
                            <button className= {`btn ${sash.type === 'fixed' ? 'btn-success' : 'btn-primary'} w-100`} type="button" onClick={() => changeTopSah(index)}>{sash.type === 'fixed' ? 'Fixed' : 'Shutter'}</button>
                          </div>
                        )}
                      </div>
                    }
                    {bottomsash.length > 0 && 
                      <div class="row mt-2">
                        <p>Bottom</p>
                        {bottomsash.map((sash, index) => 
                          <div class="col-md-6 col-xxl-3 col-xl-3" key={index}>
                            <button className= {`btn ${sash.type === 'fixed' ? 'btn-success' : 'btn-primary'} w-100`} type="button" onClick={() => changeBottomSah(index)}>{sash.type === 'fixed' ? 'Fixed' : 'Shutter'}</button>
                          </div>
                        )}
                      </div>
                    }
              </div>
            </div>
          </div>

        {isProfile === false ? (<></>):( <>
          <div class="col-md-12 col-xxl-12">
            <div class="card">
              <div class="card-header">
                <h5>Profile Cost</h5>
              </div>
              <div class="card-body">
              <table id="left-right-fix" class="table stripe row-border order-column">
                  <thead>
                    <tr>
                      <th>Product Description</th>
                      <th>Required Profile</th>
                      <th width="10%">Req. Qty (Feet)</th>
                      <th width="10%">Req. Qty (Mtr)</th>
                      <th width="10%">Rate/Mtr</th>
                      <th width="10%">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Outer Frame</td>
                      <td class="container-line">
                        <select class="mb-3 form-select-select item-line w-25" value={selectedFrameSeries || ''} onChange={handleFrameSeriesChange}>
                          <option value="">Select Series</option>
                          {profileData && profileData.map(seriesId => (
                            <option key={seriesId.series} value={seriesId.series}>{seriesId.series}</option>
                          ))}
                        </select>
                        <select class="mb-3 form-select-select item-line w-75" value={selectedFrameId || ''} onChange={handleFrameIdChange}>
                          {selectedFrameSeries ? (<option value="">Select ID</option>):(<option value="">Select Series First</option>)}
                            {selectedFrameSeries && seriesDataFrame?.items && seriesDataFrame.items.map((item) => (
                              <option key={item.id} value={item.id}>{item.id+' - '+ item.name}</option>
                          ))}
                        </select>
                      </td>
                      <td>{numeral(Frame()*qty).format('0,0.00')}</td>
                      <td>{numeral(values.frameCost.rqm *qty).format('0,0.00')}</td>
                      <td>{numeral(values.frameCost.rpm *qty).format('0,0.00')}</td>
                      <td>{numeral(values.frameCost.amount *qty).format('0,0.00')}</td>
                    </tr>
                    {(topsash.length > 0 || bottomsash.length > 0) &&
                      <tr>
                            <td>Shutter</td>
                            <td class="container-line">
                              <select class="form-select-select item-line w-25" value={selectedShutterSeries || ''} onChange={handleShutterSeriesChange}>
                                <option value="">Select Series</option>
                                {profileData && profileData.map(seriesId => (
                                  <option key={seriesId.series} value={seriesId.series}>{seriesId.series}</option>
                                ))}
                              </select>
                              <select class="form-select-select item-line w-75" value={selectedShutterId || ''} onChange={handleShutterIdChange}>
                                {selectedShutterSeries ? (<option value="">Select ID</option>) : (<option value="">Select Series First</option>)}
                                {seriesDataShutter && seriesDataShutter.items.map((item) => (
                                  <option key={item.id} value={item.id}>{item.id + ' - ' + item.name}</option>
                                ))}
                              </select>
                            </td>
                            <td>{numeral((parseFloat(topShutter()) + parseFloat(bottomShutter()) ) * qty).format('0,0.00')}</td>
                            <td>{numeral(values.shutter.rqm * qty).format('0,0.00')}</td>
                            <td>{numeral(values.shutter.rpm * qty).format('0,0.00')}</td>
                            <td>{numeral(values.shutter.amount * qty).format('0,0.00')}</td>
                      </tr>
                    }
                    {Mullion() > 0 &&  
                    <tr>
                      <td>Mullion</td>
                      <td class="container-line">
                        <select class="mb-3 form-select-select item-line w-25" value={selectedMullionSeries || ''} onChange={handleMullionSeriesChange}>
                          <option value="">Select Series</option>
                            {profileData && profileData.map(seriesId => (
                              <option key={seriesId.series} value={seriesId.series}>{seriesId.series}</option>
                            ))}
                        </select>
                        <select class="mb-3 form-select-select item-line w-75" value={selectedMullionId || ''} onChange={handleMullionIdChange}>
                          {selectedMullionSeries ? (<option value="">Select ID</option>):(<option value="">Select Series </option>)}
                            {seriesDataMullion && seriesDataMullion.items.map((item) => (
                              <option key={item.id} value={item.id}>{item.id+' - '+ item.name}</option>
                            ))}
                        </select>
                      </td>
                      <td>{numeral(Mullion()*qty).format('0,0.00')}</td>
                      <td>{numeral(values.mullionCost.rqm *qty).format('0,0.00')}</td>
                      <td>{numeral(values.mullionCost.rpm *qty).format('0,0.00')}</td>
                      <td>{numeral(values.mullionCost.amount*qty).format('0,0.00')}</td>
                    </tr>
                    }
                  <tr>
              <td>Outer Frame Beeding</td>
              <td class="container-line">
                  <select class="mb-3 form-select-select item-line w-25" value={selectedBeedingSeries || ''} onChange={handleBeedingSeriesChange}>
                    <option value="">Select Series</option>
                      {profileData && profileData.map(seriesId => (
                        <option key={seriesId.series} value={seriesId.series}>{seriesId.series}</option>
                      ))}
                  </select>
                    <select class="mb-3 form-select-select item-line w-75" value={selectedBeedingId || ''} onChange={handleBeedingIdChange}>
                      {selectedBeedingSeries ? (<option value="">Select ID</option>):(<option value="">Select Series First</option>)}
                      {seriesDataBeeding && seriesDataBeeding.items.map((item) => (
                        <option key={item.id} value={item.id}>{item.id+' - '+ item.name}</option>
                      ))}
                    </select>
                </td>
              <td>{numeral(Beeding()*qty).format('0,0.00')}</td>
              <td>{numeral(values.beeding.rqm *qty).format('0,0.00')}</td>
              <td>{numeral(values.beeding.rpm *qty).format('0,0.00')}</td>
              <td>{numeral(values.beeding.amount*qty).format('0,0.00')}</td>
            </tr>
            {louverBeeding() > 0 &&  
            <tr>
              <td>Louver Beeding</td>
              <td class="container-line">
                  <select class="mb-3 form-select-select item-line w-25" value={selectedLBeedingSeries || ''} onChange={handleLBeedingSeriesChange}>
                    <option value="">Select Series</option>
                      {profileData && profileData.map(seriesId => (
                        <option key={seriesId.series} value={seriesId.series}>{seriesId.series}</option>
                      ))}
                  </select>
                    <select class="mb-3 form-select-select item-line w-75" value={selectedLBeedingId || ''} onChange={handleLBeedingIdChange}>
                      {selectedLBeedingSeries ? (<option value="">Select ID</option>):(<option value="">Select Series First</option>)}
                      {seriesDataLBeeding && seriesDataLBeeding.items.map((item) => (
                        <option key={item.id} value={item.id}>{item.id+' - '+ item.name}</option>
                      ))}
                    </select>
                </td>
              <td>{numeral(louverBeeding()*qty).format('0,0.00')}</td>
              <td>{numeral(values.lovBeeding.rqm *qty).format('0,0.00')}</td>
              <td>{numeral(values.lovBeeding.rpm *qty).format('0,0.00')}</td>
              <td>{numeral(values.lovBeeding.amount *qty).format('0,0.00')}</td>
            </tr>
            }
            <tr>
              <td>Outer Frame Gasket</td>
              <th>
                <select class="form-select-select item-line w-75" value={ProfilegasketCost} onChange={ProfilegasketChange}>
                  <option value="" hidden>Select Model</option>
                  {Object.entries(ProfilegasketValues).map(([key, { label, value }]) => (
                    <option key={key} value={value}>{label+' - ₹ '+value}</option>
                  ))}
                </select>
              </th>
              <td>{numeral(frameGasket()*qty).format('0,0.00')}</td>
              <td>{numeral(values.frameGasket.rqm *qty).format('0,0.00')}</td>
              <td>{numeral(values.frameGasket.rpm *qty).format('0,0.00')}</td>
              <td>{numeral(values.frameGasket.amount *qty).format('0,0.00')}</td>
            </tr>
            <tr>
              <td>Beeding Gasket</td>
              <th ><select class="form-select-select item-line w-75" value={BeedinggasketCost} onChange={BeedinggasketChange}>
                  <option value="" hidden>Select Model</option>
                  {Object.entries(BeedinggasketValues).map(([key, { label, value }]) => (
                    <option key={key} value={value}>{label+' - ₹ '+value}</option>
                  ))}
                </select>
              </th>
              <td>{numeral(beedingGasket()*qty).format('0,0.00')}</td>
              <td>{numeral(values.beedingGasket.rqm *qty).format('0,0.00')}</td>
              <td>{numeral(values.beedingGasket.rpm *qty).format('0,0.00')}</td>
              <td>{numeral(values.beedingGasket.amount *qty).format('0,0.00')}</td>
            </tr>
              {/* <tr>
                <td>Shutter Gasket</td>
                <th ><select class="form-select-select item-line w-75" value={ShuttergasketCost} onChange={ShuttergasketChange}>
                    <option value="" hidden>Select Model</option>
                    {Object.entries(ShuttergasketValues).map(([key, { label, value }]) => (
                      <option key={key} value={value}>{label+' - ₹ '+value}</option>
                    ))}
                  </select>
                </th>
                <td>{numeral(shutterGasket()*qty).format('0,0.00')}</td>
                <td>{numeral(values.shutterGasket.rqm *qty).format('0,0.00')}</td>
                <td>{numeral(values.shutterGasket.rpm *qty).format('0,0.00')}</td>
                <td>{numeral(values.shutterGasket.amount *qty).format('0,0.00')}</td>
              </tr> */}
                    <tr>
                      <td colspan="5">Total</td>
                      <td>{numeral(frameTotal*qty).format('0,0.00')}</td>
                    </tr>
                    <tr>
                    <th>Wastage( {data.wastage}% )</th>
              <th ><select class="form-select-select item-line w-75" value={wastageCost} onChange={wasteChange}>
                  <option value="" hidden>Select Model</option>
                  {wasteValues && Object.entries(wasteValues).map(([key, {label, value}]) => (
                    <option key={key} value={value}>{label+' -  '+value+ '% '}</option>
                  ))}
                </select>
                </th>
                <th colspan="3"></th>
                      <th >{numeral((frameTotal + wastage) * qty).format('0,0.00')}</th>
                    </tr>
                    <tr>
                      <th colspan="5">Profile Cost/Sqft</th>
                      <th>{numeral(frps*qty).format('0,0.00')}</th>
                    </tr>


                  </tbody>
                </table>
            </div>   
            <hr />

              <div class="card-header">
                <h5>Hardware Cost</h5>
              </div>
              <div class="card-body">
                <table id="left-right-fix" class="table stripe row-border order-column">
                  <thead>
                    <tr>
                      <th colspan="2">Product Description</th>
                      <th width="10%">Req. Qty </th>
                      <th width="10%">Price</th>
                      <th width="10%">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr>
              <td>Steel Frame</td>
              <td>
              <select class="form-select-select item-line w-75" value={steelFramCost} onChange={steelframeChange}>
                  <option value="" hidden>Select Model</option>
                  {steelValues && Object.entries(steelValues).map(([key, {label, value}]) => (
                    <option key={key} value={value}>{label+' - ₹ '+value}</option>
                  ))}
                </select>
              </td>
              <td>{numeral(values.steelFrame.qty*qty).format('0,0.00')}</td>
              <td>{numeral(values.steelFrame.price*qty).format('0,0.00')}</td>
              <td>{numeral(values.steelFrame.amount*qty).format('0,0.00')}</td>
            </tr>
          {Mullion() > 0 &&  
            <tr>
              <td>Steel Mullion</td>
              <td>
                <select class="form-select-select item-line w-75" value={steelMullionCost} onChange={steelMullionChange}>
                  <option value="" hidden>Select Model</option>
                  {steelMullionValues && Object.entries(steelMullionValues).map(([key, {label, value}]) => (
                    <option key={key} value={value}>{label+' - ₹ '+value}</option>
                  ))}
                </select>
              </td>
              <td>{numeral(values.steelMullion.qty*qty).format('0,0.00')}</td>
              <td>{numeral(values.steelMullion.price*qty).format('0,0.00')}</td>
              <td>{numeral(values.steelMullion.amount*qty).format('0,0.00')}</td>
            </tr>
          }
                  <tr>
                            <td>Handle</td>
                            <td>
                              <select class="form-select-select item-line w-75" value={handleCost} onChange={handleChange}>
                                <option value="">Select Model</option>
                                {handles && Object.entries(handles).map(([key, { label, value }]) => (
                                  <option key={key} value={value}>{label + ' - ₹ ' + value}</option>
                                ))}
                              </select>
                            </td>
                            <td>{numeral(values.handle.qty * qty).format('0,0.00')}</td>
                            <td>{numeral(values.handle.price * qty).format('0,0.00')}</td>
                            <td>{numeral(values.handle.amount * qty).format('0,0.00')}</td>
                          </tr>
                  <tr>
                
                     <td >Screws</td>
                     <td>
                      <select class="form-select-select item-line w-75" value={screwtCost} onChange={screwChange}>
                        <option value="" hidden>Select Model</option>
                        {screwValues && Object.entries(screwValues).map(([key, {label, value}]) => (
                          <option key={key} value={value}>{label+' - ₹ '+value}</option>
                        ))}
                      </select>
                     </td>
                     <td>{numeral(values.screws.qty*qty).format('0,0.00')}</td>
                     <td>{numeral(values.screws.price*qty).format('0,0.00')}</td>
                     <td>{numeral(values.screws.amount*qty).format('0,0.00')}</td>
                  </tr>
                {Glass() > 0 &&  
                  <tr>
                     <td>Glass</td>
                     <td>
                       <select class="form-select-select item-line w-75" value={glassCost} onChange={glassChange}>
                        <option value="" hidden>Select Glass Cost</option>
                        {glasses && Object.entries(glasses).map(([key, {label, value}]) => (
                          <option key={key} value={value}>{label+' - ₹ '+ parseFloat(value).toFixed(2)+'/sqft'}</option>
                        ))}
                      </select>
                     </td>
                     <td>{numeral(values.glass.qty*qty).format('0,0.00')}</td>
                     <td>{numeral(values.glass.price*qty).format('0,0.00')}</td>
                     <td>{numeral(values.glass.amount*qty).format('0,0.00')}</td>
                  </tr>
                }
                {louverBeeding() > 0 &&  
                  <tr>
                     <td >Louver Blades</td>
                     <td>
                       <select class="form-select-select item-line w-75" value={LouverBladesCost} onChange={LouverBladesChange}>
                         <option value="" hidden>Select Model</option>
                          {LouverBladesValues && Object.entries(LouverBladesValues).map(([key, {label, value}]) => (
                            <option key={key} value={value}>{label+' - ₹ '+value}</option>
                          ))}
                      </select>
                     </td>
                     <td>{numeral(values.LouverBlades.qty*qty).format('0,0.00')}</td>
                     <td>{numeral(values.LouverBlades.price*qty).format('0,0.00')}</td>
                     <td>{numeral(values.LouverBlades.amount*qty).format('0,0.00')}</td>
                  </tr>
                }
                {fan === 'on' &&  
                  <tr>
                     <td >Fan </td>
                     <td>
                       <select class="form-select-select item-line w-75" value={fanCost} onChange={fanChange}>
                         <option value="" hidden>Select Model</option>
                          {fanValues && Object.entries(fanValues).map(([key, {label, value}]) => (
                            <option key={key} value={value}>{label+' - ₹ '+value}</option>
                          ))}
                      </select>
                     </td>
                     <td>{numeral(values.fan.qty*qty).format('0,0.00')}</td>
                     <td>{numeral(values.fan.price*qty).format('0,0.00')}</td>
                     <td>{numeral(values.fan.amount*qty).format('0,0.00')}</td>
                  </tr>
                }
                  <tr>
                    <th colspan="4">Total</th>
                    <th>{numeral(hardTotal*qty).format('0,0.00')}</th>
                  </tr>
                  <tr>
                    <th colspan="4">Hardware Cost/Sqft</th>
                    <th>{numeral(hrps*qty).format('0,0.00')}</th>
                  </tr>
                  </tbody>
                </table>
              </div>


              {userType != '3' && (<>
              <hr />

              <div class="card-header ">
                <h5>Margin Cost</h5>
              </div>
              <div class="card-body">
              <table id="left-right-fix" class="table stripe row-border order-column">
                  <thead>
                    <tr>
                      <th colspan="2">Product Description</th>
                      <th width="10%">Req. Qty </th>
                      <th width="10%">Price</th>
                      <th width="10%">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr>
              <td>Margin</td>
              <td>
                <select class="form-select-select item-line w-75" value={marginCost} onChange={marginChange}>
                  <option value="" hidden>Select Margin Cost</option>
                  {margin && Object.entries(margin).map(([key, {label, value}]) => (
                    <option key={key} value={value}>{label+' - ₹ '+ parseFloat(value).toFixed(2)+'/sqft'}</option>
                  ))}
                </select>
              </td>
              <td>{numeral(values.margin.qty*qty).format('0,0.00')}</td>
              <td>{numeral(values.margin.price*qty).format('0,0.00')}</td>
              <td>{numeral(values.margin.amount*qty).format('0,0.00')}</td>
            </tr>
            <tr>
              <th colspan="4">Total</th>
              <th>{numeral(marginTotal*qty).format('0,0.00')}</th>
            </tr>
            <tr>
              <th colspan="4">Margin Cost/Sqft</th>
              <th>{numeral(mrps*qty).format('0,0.00')}</th>
            </tr>
            </tbody>
                </table>
              </div>
              <hr />

              <div class="card-header">
                <h5>Production Cost</h5>
              </div>
              <div class="card-body">
              <table id="left-right-fix" class="table stripe row-border order-column">
                  <thead>
                    <tr>
                      <th colspan="2">Product Description</th>
                      <th width="10%">Req. Qty </th>
                      <th width="10%">Price</th>
                      <th width="10%">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr>
              <td>Markting OH</td>
              <td>
              <select class="form-select-select item-line w-75" value={marketingCost} onChange={marketingChange}>
                  <option value="" hidden>Select Marketing Coast</option>
                  {marketing && Object.entries(marketing).map(([key, {label, value}]) => (
                    <option key={key} value={value}>{label+' - ₹ '+ parseFloat(value).toFixed(2)+'/sqft'}</option>
                  ))}
                </select>
              </td>
              <td>{numeral(values.marketing.qty*qty).format('0,0.00')}</td>
              <td>{numeral(values.marketing.price*qty).format('0,0.00')}</td>
              <td>{numeral(values.marketing.amount*qty).format('0,0.00')}</td>
            </tr>
            <tr>
              <td>Transport</td>
              <td>
                <select class="form-select-select item-line w-75" value={transportCost} onChange={transportChange}>
                  <option value="" hidden>Select Margin Cost</option>
                  {transport && Object.entries(transport).map(([key, {label, value}]) => (
                    <option key={key} value={value}>{label+' - ₹ '+ parseFloat(value).toFixed(2)+'/sqft'}</option>
                  ))}
                </select>
              </td>
              <td>{numeral(values.transport.qty*qty).format('0,0.00')}</td>
              <td>{numeral(values.transport.price*qty).format('0,0.00')}</td>
              <td>{numeral(values.transport.amount*qty).format('0,0.00')}</td>
            </tr>
            <tr>
              <td>Labour (Factory)</td>
              <td>
              <select class="form-select-select item-line w-75" value={labourFCost} onChange={labourFChange}>
                  <option value="" hidden>Select Labour Coast</option>
                  {labourF && Object.entries(labourF).map(([key, {label, value}]) => (
                    <option key={key} value={value}>{label+' - ₹ '+ parseFloat(value).toFixed(2)+'/sqft'}</option>
                  ))}
                </select>
              </td>
              <td>{numeral(values.labourF.qty*qty).format('0,0.00')}</td>
              <td>{numeral(values.labourF.price*qty).format('0,0.00')}</td>
              <td>{numeral(values.labourF.amount*qty).format('0,0.00')}</td>
            </tr>
            <tr>
              <td>Labour (Site)</td>
              <td>
              <select class="form-select-select item-line w-75" value={labourSCost} onChange={labourSChange}>
                  <option value="" hidden>Select Labour Coast</option>
                  {labourS && Object.entries(labourS).map(([key, {label, value}]) => (
                    <option key={key} value={value}>{label+' - ₹ '+ parseFloat(value).toFixed(2)+'/sqft'}</option>
                  ))}
                </select>
              </td>
              <td>{numeral(values.labourS.qty*qty).format('0,0.00')}</td>
              <td>{numeral(values.labourS.price*qty).format('0,0.00')}</td>
              <td>{numeral(values.labourS.amount*qty).format('0,0.00')}</td>
            </tr>
            
            <tr>
              <th colspan="4">Total</th>
              <th>{numeral(prodTotal*qty).format('0,0.00')}</th>
            </tr>
            <tr>
              <th colspan="4">Production Cost/Sqft</th>
              <th>{numeral(prps*qty).format('0,0.00')}</th>
            </tr>

            </tbody>
                </table>
              </div>
              </>
            )}



          </div>
        </div>

        <div class="col-md-12 col-xxl-3 col-xl-3">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-grow-1 ms-3">
                    <h6 class="mb-0">Area</h6>
                  </div>
                </div>
                <div class="bg-body p-3 mt-3 rounded">
                  <div class="mt-3 row align-items-center">
                    <div class="col-12">
                      <h6 class="mb-1">{frameArea*qty} sqft</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-12 col-xxl-3 col-xl-3">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-grow-1 ms-3">
                    <h6 class="mb-0">Total</h6>
                  </div>
                </div>
                <div class="bg-body p-3 mt-3 rounded">
                  <div class="mt-3 row align-items-center">
                    <div class="col-12">
                      <h6 class="mb-1">₹ {numeral(grandTotal*qty).format('0,0.00')}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-12 col-xxl-3 col-xl-3">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-grow-1 ms-3">
                    <h6 class="mb-0">Rate/Sqft</h6>
                  </div>
                </div>
                <div class="bg-body p-3 mt-3 rounded">
                  <div class="mt-3 row align-items-center">
                    <div class="col-12">
                      <h6 class="mb-1">₹ {numeral(grandAps).format('0,0.00')}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-12 col-xxl-3 col-xl-3">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-grow-1 ms-3">
                    <h6 class="mb-0">Save Quote</h6>
                  </div>
                </div>
                <div class="bg-body p-3 mt-2 rounded">
                  <div class="row align-items-center">
                    <div class="col-12">
                    <button class="btn btn-success w-100" onClick={selectedProfiles}>Save</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
</>
)}


        
        </div>
      </div>
    </div>

    

    </div>
    );
};
    
    export default App;