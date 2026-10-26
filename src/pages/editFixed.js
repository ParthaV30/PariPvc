import { getMergedProfileDetails } from '../services/profileManager';
import React, { useEffect, useState } from 'react';
import { ReactSession } from 'react-client-session';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { saveQuoteItem } from '../services/dbService';
import Navbar from "./navbar";
import Header from "./header";
import Fan from '../images/fan.png';
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
  const item = 'Fixed Window';
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

  const [boxWidth, setBoxWidth] = useState(0); 
  const [boxHeight, setBoxHeight] = useState(0); 
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  const [screen, setScreen] = useState(deviceWidth > 700 ? 5 : 10);

  const [profileDetails, setProfileData] = useState(() => getMergedProfileDetails(null));
  const [qty, setQty] = useState(1);
  const [costData, setCostData] = useState(true);
  const [customProfile, setCustomProfile] = useState(0);
  const [calcBtn, setCalcBtn] = useState(false);
  const [isProfile, setIsProfile] = useState(false);
  const [series, setSeries] = useState(null);

  const [measure, setMeasure] = useState('ft');
  const [mCalc, setMcalc] = useState(1);

  const [verticalMullion, setVertMullion] = useState([{ type: 'glass', size: boxHeight }]);
  const [horizontalMullion, setHoriMullion] = useState([{ type: 'glass', size: boxWidth }]);

  const urlParams = new URLSearchParams(window.location.search);
  const quoteIds = urlParams.get('id');
  const arrayValue = urlParams.get('arrayValues');
  const [state, setState] = useState(null);
  const [rowid, setRowid] = useState('');
  const [quoteData, setQuoteData] = useState(null);

  const newWidth = measure === 'ft' ? boxWidth : (Number(boxWidth) / 304.8).toFixed(2);
  const newHeight = measure === 'ft' ? boxHeight : (Number(boxHeight) / 304.8).toFixed(2);

//  console.log("series",series)

  const fetchDatalog = async () => {
    try {
      const response = await axios.post(`https://upvcapi.sninfoserv.com/log/`, {userId, coreData, profileDatas});
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchOldData = async () => {
    try {
      const response = await axios.post('https://upvcapi.sninfoserv.com/all-quotes/', user);
      if(response.data.status === 'success'){
        const filteredQuotes = response.data.data.filter(quote => quote.quoteId === quoteIds);
        setQuoteData(filteredQuotes);
        setState(filteredQuotes[0].quoteDetails[arrayValue].quoteData)
        setRowid(filteredQuotes[0].quoteDetails[arrayValue].rowId);
      }
    
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => { 
    fetchOldData();
  }, [quoteIds]);

  useEffect(() => {
    setBoxWidth(parseFloat(state?.boxWidth));
    setBoxHeight(parseFloat(state?.boxHeight));
    setQty(parseFloat(state?.qty));
    setHoriMullion(state?.horizontalMullion || []);
    setVertMullion(state?.verticalMullion || []);
    setMeasure(state?.measure || 'ft');
    setMarginCost(state?.data.marginCost || 0);
    setMarketingCost(state?.data.marketingCost || 0);
    setlabourFCost(state?.data.labourFcost || 0);
    setlabourSCost(state?.data.labourScost || 0);
    setTransportCost(state?.data.transportCost || 0);
    setGlassCost(state?.data.glass || 0);
    setSeries(state?.series || '');
    setsteelFramDef(state?.data.steelFrame || 0);
    setsteelMullionDef(state?.data.steelMullion || 0);
    setwastageCost(state?.data.wastage || 0);
    setscrewDef(state?.data.screwsCost || 0);

    setCustomProfile(state?.customProfile || 0);

  },[state]);
  // console.log("data",state)



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
        //console.log(response.data);
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
        //console.log(response.data);
      } catch (error) { setProfileData(getMergedProfileDetails(null)); } 
    };

    fetchData();
  }, []);



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
  

  
  const handleProfileChange = (event) => {
    setCustomProfile(event.target.value);
    setSelectedFrameSeries(null);
    setSelectedFrameId(null);
    setSelectedMullionSeries(null);
    setSelectedMullionId(null);
   
  };


  const handleAddHoriMullion = () => {
    const totalMullions = horizontalMullion.length + 1;
    const newSize = (parseFloat(boxHeight) / totalMullions).toFixed(2);

    const updatedMullions = Array.from({ length: totalMullions }, () => ({
        type: 'glass',
        size: newSize,
    }));

    setHoriMullion(updatedMullions);
};

  const handleAddVertMullion = () => {
    const totalMullions = verticalMullion.length + 1;
    const newSize = (parseFloat(boxWidth) / totalMullions).toFixed(2);

    const updatedMullions = Array.from({ length: totalMullions }, () => ({
        type: 'glass',
        size: newSize,
    }));

    setVertMullion(updatedMullions);
  };


  const handleRemoveVertMullion = (index) => {
    if (verticalMullion.length > 1) {
      const updatedMullions = verticalMullion.filter((_, i) => i !== index);
      const newSize = (parseFloat(boxWidth) / updatedMullions.length).toFixed(2);
  
      const resizedMullions = updatedMullions.map(() => ({
        type: 'glass',
        size: newSize,
      }));
  
      setVertMullion(resizedMullions);
    }
  };

  const handleRemoveHoriMullion = (index) => {
    if (horizontalMullion.length > 1) {
      const updatedMullions = horizontalMullion.filter((_, i) => i !== index);
      const newSize = (parseFloat(boxHeight) / updatedMullions.length).toFixed(2);
  
      const resizedMullions = updatedMullions.map(() => ({
        type: 'glass',
        size: newSize,
      }));
  
      setHoriMullion(resizedMullions);
    }
  };
  



  const handleVMullionSize = (index, value) => {
    setVertMullion(prevLengths => {
      const updated = [...prevLengths];
      const parsedValue = parseFloat(value);
  
      const diff = parseFloat(updated[index].size) - parsedValue;
  
      updated[index] = { ...updated[index], size: parsedValue.toFixed(2) };

      const lastIndex = updated.length - 1;
      if (lastIndex !== index) {
        const lastSize = parseFloat(updated[lastIndex].size) + diff;
        updated[lastIndex] = {
          ...updated[lastIndex],
          size: lastSize.toFixed(2)
        };
      }
      return updated;
    });
  };

  const handleHMullionSize = (index, value) => {
    setHoriMullion(prevLengths => {
      const updated = [...prevLengths];
      const parsedValue = parseFloat(value);
  
      const diff = parseFloat(updated[index].size) - parsedValue;
  
      updated[index] = { ...updated[index], size: parsedValue.toFixed(2) };

      const lastIndex = updated.length - 1;
      if (lastIndex !== index) {
        const lastSize = parseFloat(updated[lastIndex].size) + diff;
        updated[lastIndex] = {
          ...updated[lastIndex],
          size: lastSize.toFixed(2)
        };
      }
      return updated;
    });
  };

  useEffect(() => {
    // Recalculate vertical mullion sizes when box width changes
    if (verticalMullion.length > 0) {
      const newSize = (parseFloat(newWidth) / verticalMullion.length);
      const updatedMullions = verticalMullion.map(() => ({
        type: 'glass',
        size: newSize.toFixed(2),
      }));
      setVertMullion(updatedMullions);
    }
  }, [newWidth]);
  
  useEffect(() => {
    // Recalculate horizontal mullion sizes when box height changes
    if (horizontalMullion.length > 0) {
      const newSize = (parseFloat(newHeight) / horizontalMullion.length);
      const updatedMullions = horizontalMullion.map(() => ({
        type: 'glass',
        size: newSize.toFixed(2),
      }));
      setHoriMullion(updatedMullions);
    }
  }, [newHeight]);
  


  //----------prifile Section-----------//

  const findIndexByProfileName = (profileName) => {
    return profileDetails?.data?.findIndex(item => item.profileName === profileName);
  };

  useEffect(() => {
    if (customProfile === null || customProfile === undefined) {
      if (profileDetails && state?.selectedProfile) {
        const profileIndex = findIndexByProfileName(state.selectedProfile, profileDetails);
        setCustomProfile(profileIndex);
      }
    }
  }, [profileDetails, state?.selectedProfile]);
  // console.log(customProfile);

  const profileData = profileDetails?.data?.[customProfile]?.profileData || [];
  const selectedProfile = profileDetails?.data?.[customProfile]?.profileName;



  const findSeriesAndIdByName = (searchName) => {
    for (const series of profileData) {
      if (Array.isArray(series.items)) {
        for (const item of series.items) {
          if (item.id === searchName) {
            return { series: series.series, id: item.id };
          }
        }
      } else {
        console.error('series.items is not an array');
      }
    }

    return { series: null };
  };

  const frameData = findSeriesAndIdByName(state?.data.frame.id);
  // const shutterData = findSeriesAndIdByName(state?.data.shutter.id);
  const mullionData = findSeriesAndIdByName(state?.data.mullion.id);
  const beedingData = findSeriesAndIdByName(state?.data.beeding.id);
  // const paneldata = findSeriesAndIdByName(state?.data.panelCost.id);
  // const interlockdata = findSeriesAndIdByName(state?.data.interlock.id);
  // const cuplerData = findSeriesAndIdByName(state?.data.cupler.id);


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
    //  console.log(id);
  };

  useEffect(() => {
    if (selectedFrameSeries === null) {
      setSelectedFrameSeries(frameData.series);
      setSelectedFrameId(frameData.id);
    }
  });

  const seriesDataFrame = profileData && profileData.find(serieses => serieses.series === selectedFrameSeries);
  const selectedFramePrice = selectedFrameId ? seriesDataFrame?.items?.find(item => item.id === selectedFrameId)?.price || '0' : '0';
  const selectedFrameLength = selectedFrameId ? seriesDataFrame?.items?.find(item => item.id === selectedFrameId)?.length || '0' : '0';
  const selectedFrameWeight = selectedFrameId ? seriesDataFrame?.items?.find(item => item.id === selectedFrameId)?.weight || '0' : '0';
  const selectedFrameName = selectedFrameId ? seriesDataFrame?.items?.find(item => item.id === selectedFrameId)?.name || 'Loading' : 'Loading';


  const [selectedMullionSeries, setSelectedMullionSeries] = useState(null);
  const [selectedMullionId, setSelectedMullionId] = useState(null);

  const handleMullionChange = (event) => {
    const seriesId = event.target.value;

    setSelectedMullionSeries(seriesId);
    setSelectedMullionId(null);
  };

  const handleMullionIdChange = (event) => {
    const id = event.target.value;
    setSelectedMullionId(id);
  };

  useEffect(() => {
    if (selectedMullionSeries === null) {
      setSelectedMullionSeries(mullionData.series);
      setSelectedMullionId(mullionData.id);
    }
  });

  const seriesDataMullion = profileData && profileData.find(serieses => serieses.series === selectedMullionSeries);
  const selectedMullionPrice = selectedMullionId ? seriesDataMullion?.items?.find(item => item.id === selectedMullionId)?.price || '0' : '0';
  const selectedMullionLength = selectedMullionId ? seriesDataMullion?.items?.find(item => item.id === selectedMullionId)?.length || '0' : '0';
  const selectedMullionWeight = selectedMullionId ? seriesDataMullion?.items?.find(item => item.id === selectedMullionId)?.weight || '0' : '0';
  const selectedMullionName = selectedMullionId ? seriesDataMullion?.items?.find(item => item.id === selectedMullionId)?.name || 'Loading' : "Loading";

 const handleMullionSeriesChange = (event) => {
     const seriesId = event.target.value;
     setSelectedMullionSeries(seriesId);
     setSelectedMullionId(null); 
   };

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

  useEffect(() => {
    if (selectedBeedingSeries === null) {
      setSelectedBeedingSeries(beedingData.series);
      setSelectedBeedingId(beedingData.id);
    }
  });

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

 


  const [glassCost, setGlassCost] = useState(null);
  const glasses = costData?.costData?.glass;
  const glassChange = (event) => {
    const cost = event.target.value;
    setGlassCost(cost);
  };

  const [marginCost, setMarginCost] = useState(null);
  const margin = costData?.costData?.margin;
  const marginChange = (event) => {
    const cost = event.target.value;
    setMarginCost(cost);
  };

  const [marketingCost, setMarketingCost] = useState(null);
  const marketing = costData?.costData?.marketing;
  const marketingChange = (event) => {
    const cost = event.target.value;
    setMarketingCost(cost);
  };

  const [labourFCost, setlabourFCost] = useState(null);
  const labourF = costData?.costData?.labourFactory;
  const labourFChange = (event) => {
    const cost = event.target.value;
    setlabourFCost(cost);
  };

  const [labourSCost, setlabourSCost] = useState(null);
  const labourS = costData?.costData?.labourSite;
  const labourSChange = (event) => {
    const cost = event.target.value;
    setlabourSCost(cost);
  };

  const [transportCost, setTransportCost] = useState(null);
  const transport = costData?.costData?.transport;
  const transportChange = (event) => {
    const cost = event.target.value;
    setTransportCost(cost);
  };

 

  const [wastageCost, setwastageCost] = useState(null);
  const wasteValues = costData?.costData?.wastage;
  const wasteChange = (event) => {
    const cost = event.target.value;
    setwastageCost(cost);
  };

  const [ProfilegasketCost, setProfilegasketDef] = useState(0);
  const ProfilegasketValues = costData?.costData?.profileGasket;
  const ProfilegasketChange = (event) => {
    const cost = event.target.value;
    setProfilegasketDef(cost);

  };
  // console.log("cost data",costData)

 

  const [MulliongasketCost, setMulliongasketDef] = useState(0);
  const MulliongasketValues = costData && costData.costData && costData.costData.profileGasket;
  const MulliongasketChange = (event) => {
    const cost = event.target.value;
    setMulliongasketDef(cost);
  };

  const [BeedinggasketCost, setBeedinggasketDef] = useState(0);
  const BeedinggasketValues = costData && costData.costData && costData.costData.profileGasket;
  const BeedinggasketChange = (event) => {
    const cost = event.target.value;
    setBeedinggasketDef(cost);
  };

  const [screwtCost, setscrewDef] = useState(0);
  const screwValues = costData?.costData?.screws;
  const screwChange = (event) => {
    const cost = event.target.value;
    setscrewDef(cost);
  };

  const [steelFramCost, setsteelFramDef] = useState(null);
  const steelValues = costData?.costData?.steel;
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

  const [mullionClampCost, setmullionClampDef] = useState(0);
  const mullionClampValues = costData && costData.costData && costData.costData.mullionClamp;
  const mullionClampChange = (event) => {
    const cost = event.target.value;
    setmullionClampDef(cost);
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
  const mullionClamp = costData && costData.costData && costData.costData.mullionClamp[0].value;




    const addDef = () => {
    setMarginCost(marginDef);
    setMarketingCost(marketingDef);
    setlabourFCost(labourFactoryDef);
    setlabourSCost(labourSiteDef);
    setTransportCost(transportDef);
    setGlassCost(glassDef);
    setsteelFramDef(steelFramDef);
    setProfilegasketDef(ProfilegasketDef);
    setBeedinggasketDef(ProfilegasketDef);
    setsteelMullionDef(steelMullionDef);
    setwastageCost(wasteDef);
    setLouverBladesDef(bladesDef);
    setscrewDef(screwDef);
    // setmeshgasketDef(meshGasketDef);
    // setmeshDef(meshDef);
    setmullionClampDef(mullionClamp);
    
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
    shutter:{
      length: null,
      weight:null,
      amount:null,
      name : null
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
    mullionGasket:{
      length:'1',
      weight:'1',
      amount: MulliongasketCost || 0
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
    mullionClamp: mullionClampCost,
  }


  const Mullion = () => {
    return (horizontalMullion.length - 1) * parseFloat(newHeight) + (verticalMullion.length - 1) * parseFloat(newWidth);
  };

  const Frame = () => {
    return ( Number(newHeight) + Number(newWidth) )*2;
  };


  const LouverBlades = () => {
    return (4 * (Number(newHeight)));
  };

  const Glass = () => {
    return (Number(newHeight) * Number(newHeight));
  };

  const Beeding = () => {
    return ( ((parseFloat(newHeight) * (horizontalMullion.length )) * 2) + ((parseFloat(newWidth) * (verticalMullion.length)) * 2) ).toFixed(2);
  };

  const louverBeeding = () => {  
    return (2 * (Number(newHeight)-1 + Number(newWidth)-1));
  };

  const frameGasket = () => {
    return Frame();
  };

  const beedingGasket = () => {
    return ( ((parseFloat(newHeight) * (horizontalMullion.length)) * 2) + ((parseFloat(newWidth) * (verticalMullion.length)) * 2) ).toFixed(2);
  };

  const Fixed = () => {
    return (8 * (newHeight));
  };
  const steelFrame = () => {
    return Frame();
  };

  const steelMullion = () => {
    return Mullion();
  };

  const screws = () => {
    const outer = (((parseFloat(newHeight)/2) * 2) + ((parseFloat(newWidth)/2) * 2));
    const sash = (parseFloat(newHeight) -1 ) + (parseFloat(newWidth) -1) * 2;
    const stay = sash + parseFloat(newHeight);
    //const espag = sash;

    return outer + stay;
  };
 

  const frameArea = Number(newHeight) * Number(newWidth);

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
    beeding:{
      rqm: (parseFloat(Beeding()) * 0.3048).toFixed(2) || 0,
      rpm: data.beeding.amount || 0,
      amount: (parseFloat(Beeding()) * 0.3048) * data.beeding.amount || 0,
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
    mullionGasket: {
      rqm: (parseFloat(Mullion()) * 2 * 0.3048).toFixed(2) || 0,
      rpm: data.mullionGasket.amount || 0,
      amount: (parseFloat(Mullion()) * 2 * 0.3048) * data.mullionGasket.amount || 0,
    },
    glass:{
      qty: Glass(),
      price: data.glass,
      amount: data.glass*Glass() || 0
    },
    screws:{
      qty: screws(),
      price: data.screwsCost,
      amount: screws() * data.screwsCost || 0
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
    mullionclamp: {
      qty: (verticalMullion.length + horizontalMullion.length) * 2,
      price: data.mullionClamp,
      amount:  ((verticalMullion.length + horizontalMullion.length) * 2) * data.mullionClamp || 0
    },
  };
  
  

  const frameTotal = Number(
    parseFloat(values.mullionCost.amount) + 
    parseFloat(values.frameCost.amount) + 
    parseFloat(values.beeding.amount) + 
    parseFloat(values.frameGasket.amount) +
    parseFloat(values.mullionGasket.amount) +
    parseFloat(values.beedingGasket.amount)
  );

  const wastage = frameTotal * data.wastage / 100;
  const frps = (frameTotal + wastage) / frameArea;

 const hardTotal =  Number(
    parseFloat(values?.screws?.amount) + 
    parseFloat(values?.glass?.amount) + 
    parseFloat(values?.steelFrame?.amount) + 
    parseFloat(values?.steelMullion?.amount) +
    parseFloat(values?.mullionclamp?.amount)
  );

  const hrps = hardTotal / frameArea;

 const prodTotal = Number(
    parseFloat(values?.marketing?.amount) + 
    parseFloat(values?.transport?.amount) + 
    parseFloat(values?.labourF?.amount) + 
    parseFloat(values?.labourS?.amount)
  );

  const prps = prodTotal / frameArea;

  const marginTotal = values?.margin?.amount;
  const mrps = marginTotal / frameArea;

  const grandTotal = frameTotal + hardTotal + prodTotal + wastage + marginTotal;
  const grandAps = grandTotal / frameArea;


  // const calculatedBoxWidth = measure === 'ft' ? boxWidth : (boxWidth / 304.8);
  // const calculatedBoxHeight = measure === 'ft' ? boxHeight : (boxHeight / 304.8);
  // const calculatednewWidths = newWidths.map(width =>
  //   measure === 'ft' ? parseFloat(width) : parseFloat(width) / 304.8
  // );
  // const calculatedtopnewHeights = measure === 'ft' ? topnewHeights : (topnewHeights / 304.8);

  


 const coreData = { userId,  quoteId,rowId: rowid, data:{item, customProfile, selectedProfile, series, qty, data, boxWidth, boxHeight, frameArea, deviceWidth, screen, values, frameTotal, wastage, hardTotal, prodTotal, marginTotal, grandTotal, horizontalMullion, verticalMullion, measure}
    };



  //console.log(coreData);

  const selectedProfiles = () => {
      let messages = [];
      let allValid = true;
    
      
      if ((selectedFrameId === null || selectedFrameId === "") || (selectedFrameSeries === null|| selectedFrameSeries === "")) {
        messages.push("Casement Outer Frame Profile Not Selected");
        allValid = false;
      }
	  
    //    if(Mullion() > 0){ 
    //   if ((selectedMullionId === null|| selectedMullionId ==="") || (selectedMullionSeries === null|| selectedMullionSeries === "")) {
    //     messages.push("Mullion Profile Not Selected");
    //     allValid = false;
    //   }
	  // }


    if (
      selectedMullionId === null ||
      selectedMullionId === "" ||
      selectedMullionSeries === null ||
      selectedMullionSeries === ""
    ) {
      messages.push("MullionSeries Profile Not Selected");
      allValid = false;
    }

    if (
      selectedBeedingId === null ||
      selectedBeedingId === "" ||
      selectedBeedingSeries === null ||
      selectedBeedingSeries === ""
    ) {
      messages.push("BeedingSeries Profile  Not Selected");
      allValid = false;
    }
    
      
      // if ((selectedBeedingId === null|| selectedBeedingId === "") || (selectedBeedingSeries === null || selectedBeedingSeries === "")) {
      //   messages.push("Beeding Profile Not Selected");
      //   allValid = false;
      // }
      
	  
	  //   if(louverBeeding() > 0){  
    //   if ((selectedLBeedingId === null || selectedLBeedingId === "") || (selectedLBeedingSeries === null|| selectedLBeedingSeries === "")) {
    //     messages.push("BeedingSeries Not selected");
    //     allValid = false;
    //   }
		// }
     
      
      
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


  // const checkSend = () => {

  //   if (cusBoxWidth !== boxWidth) {
  //     openModal2('Shutter size is not fit for the Door. would you like to continue at your own risk?');
  //   } else {
  //     const hasInvalidValue = newWidths.some(value => value < 1 || value > 2.5);

  //     if (hasInvalidValue) {
  //       openModal1();
  //     } else {
  //       // if (boxHeight > 6) {
  //       //   openModal2('The size of the window is more than 6 feet and it should be created in the Casement Door. would you like to continue at your own risk?');
  //       // } else {
  //         sendDataToUrl();
  //       // }
  //     }
  //   }
  // };

  const sendDataToUrl = async () => {
    try { fetchDatalog(); } catch (e) {}
    try {
      await saveQuoteItem(coreData);
    } catch (err) {
      console.warn('saveQuoteItem fallback:', err);
    }
    try {
      await axios.post('https://upvcapi.sninfoserv.com/edit-quote/', { coreData });
    } catch (error) {
      // API fallback
    }
    navigate(`/quotesdet?id=${quoteIds || quoteId || coreData.quoteId}`);
  };


    const profileDatas = {width: boxWidth, height: boxHeight, profileId: selectedProfile,  series, mesh: 'no', shutterCount: 0, type: item}


  const handleSeriesChange = (event) => {
    const id = event.target.value;
    setSeries(id);
    sendprofileDataToUrl();
  };

  const openModal = () => {
    const modal = document.getElementById('onloadModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  };

  const closeModal = () => {
    setCalcBtn(false);
    const modal = document.getElementById('onloadModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  };

  const openModal1 = () => {
    const modal = document.getElementById('onloadModal1');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  };

  const closeModal1 = () => {
    setCalcBtn(false);
    const modal = document.getElementById('onloadModal1');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  };

  const openModal2 = (content) => {
    const modal = document.getElementById('onloadModal2');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
      const contentElement = document.getElementById('resMsg');
      contentElement.textContent = content;
    }
  };

  const closeModal2 = () => {
    setCalcBtn(false);
    const modal = document.getElementById('onloadModal2');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
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




  const sendprofileDataToUrl = () => {
    setCalcBtn(true);
     handleContinueCalc();
     openModal();

    
   
  };

  const continueCalc = () => {
    handleContinueCalc();
    setCalcBtn(false);
    setIsProfile(true);
    addDef();
    closeModal();
  };

  const continueSend = () => {
    if (boxHeight > 10) {
      openModal2();
      closeModal1();
    } else {
      sendDataToUrl();
      closeModal1();
    }
  };

  const continueSendData = () => {
    sendDataToUrl();
    closeModal2();
  };


  const handleContinueCalc = async () => {
    try {
      const response = await axios.post('https://upvcapi.sninfoserv.com/find-default/', profileDatas);
      //  console.log('Response:', response.data);
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
            //setSelectedShutterSeries(response.data.data[0].shutterSeries);
            //setSelectedShutterId(response.data.data[0].shutter);
           }
           if(response.data.data[0].cupler !== ''){
            //setSelectedCuplerSeries(response.data.data[0].cuplerSeries);
            //setSelectedCuplerId(response.data.data[0].cupler);
           }

        }
    } catch (error) {
      console.error('Error sending data:', error);
    }
    closeModal();
    setCalcBtn(false);
    setIsProfile(true);
    addDef();
  };


  function changeMeasure(name) {
    if (name === 'ft'){
      setMeasure('mm');
      setMcalc(304.8);
      setBoxHeight(parseFloat((Number(boxHeight)*304.8).toFixed(2)));
      setBoxWidth(parseFloat((Number(boxWidth)*304.8).toFixed(2)));
     
    }else{
      setMeasure('ft');
      setMcalc(1);
      setBoxHeight(parseFloat((Number(boxHeight)/304.8).toFixed(2)));
      setBoxWidth(parseFloat((Number(boxWidth)/304.8).toFixed(2)));
    }
  };

  // Outer Bottom Line
  const getOuterBottom = (height, screen) => {
    const fullHeightVW = (height) * screen;
    return `calc(${fullHeightVW}vw - 4px)`;
  };
  


    return (
    <div>


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
                    <button className="btn btn-primary w-100" type="button" onClick={() => changeMeasure(measure)}>{measure === 'ft' ? 'Feet': 'MM'}</button>
                  </div>
                    <div class="col-6">
                      <p>Width</p>
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
                    <div class="col-12">
                      <p>No of Fixed Windows</p>
                        <div class="input-group mb-2">
                          <button class="btn btn-danger" type="button" onClick={() =>  handleQty('minus')}>-</button>
                          <input type="text" class="form-control"  value={qty} onChange={handleQtyChange} />
                          <button class="btn btn-success" type="button" onClick={() =>  handleQty('plus')}>+</button>
                        </div>
                    </div>
                    
                    {/* <div class="col-6">
                      <p>Vertival Mullions</p>
                      <div class="input-group mb-2">
                        <button class={`btn ${vertical === 'on' ? 'btn-primary' : 'btn-secondary' } w-100`} type="button" onClick={chnagevertical}>Vertical</button>
                      </div>
                    </div> */}

                    <div class="col-6">
                      <p>Vertical Mullion</p>
                      <div class="input-group mb-2">
                        <button class="btn btn-danger w-50" type="button" onClick={() => handleRemoveVertMullion(0)}>-</button>
                        <button class="btn btn-success w-50" type="button" onClick={handleAddVertMullion}>+</button>
                      </div>
                    </div>

                    {/* <div class="col-6">
                      <p>Horizontal Mullions</p>
                      <div class="input-group mb-2">
                        <button class={`btn ${horizontal === 'on' ? 'btn-primary' : 'btn-secondary' } w-100`} type="button" onClick={chnagehorizontal}>Horizontal</button>
                      </div>
                    </div> */}

                    <div class="col-6">
                      <p>Horizontal Mullion</p>
                      <div class="input-group mb-2">
                        <button class="btn btn-danger w-50" type="button" onClick={() => handleRemoveHoriMullion(0)}>-</button>
                        <button class="btn btn-success w-50" type="button" onClick={handleAddHoriMullion}>+</button>
                      </div>
                    </div>
              </div>
             
             
             <div class="col-12 mb-2 mt-3">
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
                        <option className="form-control" value="50 Series">50 Series</option>
                        <option className="form-control" value="60 Series">60 Series</option>
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

                <div style={{float:'left',boxShadow: '1px 1px 5px grey', width: `calc(${newWidth*screen}vw + 1px)`, height: `calc(${newHeight*screen}vw + 5px)`, border:'1px solid #333', position:'relative'}}>
                  {newHeight && newWidth > 0 ?
                  <>
                      {/* outer corner lines start */}
                      <div style={{ position:'absolute',height: '7px', width: '1px', float: 'left', marginTop: '-1.5px', marginLeft: `calc(${(newWidth)*screen}vw - 3px)`, transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                      <div style={{ position:'absolute',height: '8px', width: '1px', float: 'left', marginTop: '-1.5px', marginLeft: '2px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                      <div style={{ position:'absolute',height: '9px', width: '1px', float: 'right', marginTop: getOuterBottom(newHeight, screen), marginLeft:  `calc(${(newWidth)*screen}vw - 4px)`, transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                      <div style={{ position:'absolute',height: '9px', width: '1px', float: 'left', marginTop: getOuterBottom(newHeight, screen), marginLeft: '2.5px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>
                      {/* outer corner lines end */}
                  </>:<></>
                  }
               
                  {/* {verticalMullion.map((sash, index) => 
                   
                    <div style={{display: 'flex', gap: '1px', height: `calc(${(boxHeight/verticalMullion.length)*screen}vw - 5px)`, width: `calc(${(newWidth)*screen}vw - 10px)`, marginLeft: '5px',  marginRight: '4px', marginTop: index === 0 ?  '4px' : '0px', marginBottom: '5px',position:'relative' }}>
                     
                      {horizontalMullion.map((sashs, innerIndex) =>
                        <div style={{float: 'left', width: `calc(${(boxWidth/horizontalMullion.length)*screen}vw - 0px)`, height: `calc(${( boxHeight/verticalMullion.length)*screen}vw - 5px )`,  marginLeft: innerIndex === 0 ? '0px': '4px', border:'1px solid #333', background:'lightblue',position:'relative' }}>
                         

                          {newHeight&&boxWidth>0?
                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '50px', fontWeight: '100', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                          :<></>
                          }
       
                        </div>
                      
                      )}

                    </div>
                  )} */}

                  
                  {horizontalMullion.map((row, rowIndex) => (
                      <div key={rowIndex} style={{display: 'flex',gap: '1px',height: `calc(${(row?.size) * screen}vw - 5px)`,width: `calc(${newWidth * screen}vw - 10px)`,marginTop: rowIndex === 0 ? '4px' : '0px',marginBottom: '5px',marginLeft: '5px',marginRight: '4px',position: 'relative' }}>
                         {verticalMullion.map((col, colIndex) => (
                            <div key={colIndex} style={{width: `calc(${(col?.size) * screen}vw - 5px)`,height: `100%`,marginLeft: colIndex === 0 ? '0px' : '4px',border: '1px solid #333',background: 'lightblue',position: 'relative'}}>
                                     
                            {newHeight && newWidth > 0 && (
                              <div style={{position: 'absolute',top: '50%',left: '50%',transform: 'translate(-50%, -50%)',fontSize: '50px',fontWeight: '100',cursor: 'pointer',color: '#000',zIndex: 1 }}>+</div>
                            )}
                            </div>
                          ))}
                       </div>
                  ))}


                </div>

            </div>

            
            <div class="card-body mb-5">
              <div class="row">
                {verticalMullion.length > 1 && verticalMullion.map((sash, index) => 
                  <div class="col-md-2 col-xxl-2 mt-2" key={index}>
                      <label><small>Vertical Mullion</small></label>
                      <input type="number" class="form-control" value={parseFloat(sash.size).toFixed(2)} onChange={(e)=> handleVMullionSize(index, e.target.value)} />
                  </div>
                )}
                 <div class="col-md-12 col-xxl-12 mt-2"></div>
                {horizontalMullion.length > 1 && horizontalMullion.map((sash, index) => 
                  <div class="col-md-2 col-xxl-2 mt-2" key={index}>
                      <label><small>Horizontal Mullion</small></label>
                      <input class="form-control" value={parseFloat(sash.size).toFixed(2)} onChange={(e)=> handleHMullionSize(index, e.target.value)} />
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* {isProfile === false ? (<></>):( <> */}
         {profileData && 
         <>
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
                      <td>{numeral(values.frameCost.rpm).format('0,0.00')}</td>
                      <td>{numeral(values.frameCost.amount*qty).format('0,0.00')}</td>
                    </tr>
                    
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
                      <td>{numeral(values.mullionCost.rqm*qty).format('0,0.00')}</td>
                      <td>{numeral(values.mullionCost.rpm).format('0,0.00')}</td>
                      <td>{numeral(values.mullionCost.amount*qty).format('0,0.00')}</td>
                    </tr>
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
              <td>{numeral(values.beeding.rqm*qty).format('0,0.00')}</td>
              <td>{numeral(values.beeding.rpm).format('0,0.00')}</td>
              <td>{numeral(values.beeding.amount*qty).format('0,0.00')}</td>
            </tr>
            {/* {louverBeeding() > 0 &&  
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
              <td>{numeral(values.lovBeeding.wpf*qty).format('0,0.00')}</td>
              <td>{numeral(values.lovBeeding.rw*qty).format('0,0.00')}</td>
              <td>{numeral(values.lovBeeding.rpf*qty).format('0,0.00')}</td>
              <td>{numeral(values.lovBeeding.amount*qty).format('0,0.00')}</td>
            </tr>
            } */}
            <tr>
              <td>Outer Frame Gasket</td>
              <th ><select class="form-select-select item-line w-75" value={ProfilegasketCost} onChange={ProfilegasketChange}>
                  <option value="" hidden>Select Model</option>
                  {ProfilegasketValues &&Object.entries(ProfilegasketValues).map(([key, { label, value }]) => (
                    <option key={key} value={value}>{label+' - ₹ '+value}</option>
                  ))}
                </select>
              </th>
              <td>{numeral(frameGasket()*qty).format('0,0.00')}</td>
              <td>{numeral(values.frameGasket.rqm*qty).format('0,0.00')}</td>
              <td>{numeral(values.frameGasket.rpm).format('0,0.00')}</td>
              <td>{numeral(values.frameGasket.amount*qty).format('0,0.00')}</td>
            </tr>
            {/* <tr>
              <td>Beeding Gasket</td>
              <th ><select class="form-select-select item-line w-75" value={BeedinggasketCost} onChange={BeedinggasketChange}>
                  <option value="" hidden>Select Model</option>
                  {Object.entries(BeedinggasketValues).map(([key, { label, value }]) => (
                    <option key={key} value={value}>{label+' - ₹ '+value}</option>
                  ))}
                </select>
              </th>
              <td>{numeral(beedingGasket()*qty).format('0,0.00')}</td>
              <td>{numeral(values.beedingGasket.wpf*qty).format('0,0.00')}</td>
              <td>{numeral(values.beedingGasket.rw*qty).format('0,0.00')}</td>
              <td>{numeral(values.beedingGasket.rpf*qty).format('0,0.00')}</td>
              <td>{numeral(values.beedingGasket.amount*qty).format('0,0.00')}</td>
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
                                <td>Mullion Clamp</td>
                                <td>
                                  <select class="form-select-select item-line w-75" value={mullionClampCost} onChange={mullionClampChange}>
                                    <option value="" hidden>Select Model</option>
                                    {mullionClampValues && Object.entries(mullionClampValues).map(([key, { label, value }]) => (
                                      <option key={key} value={value}>{label + ' - ₹ ' + value}</option>
                                    ))}
                                  </select>
                                </td>
                                <td>{numeral(values.mullionclamp.qty * qty).format('0,0.00')}</td>
                                <td>{numeral(values.mullionclamp.price * qty).format('0,0.00')}</td>
                                <td>{numeral(values.mullionclamp.amount * qty).format('0,0.00')}</td>
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
                          <option key={key} value={value}>{label+' - ₹ '+ Number(value).toFixed(2)+'/sqft'}</option>
                        ))}
                      </select>
                     </td>
                     <td>{numeral(values.glass.qty*qty).format('0,0.00')}</td>
                     <td>{numeral(values.glass.price*qty).format('0,0.00')}</td>
                     <td>{numeral(values.glass.amount*qty).format('0,0.00')}</td>
                  </tr>
                }
                {/* {louverBeeding() > 0 &&  
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
                } */}
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
                    <option key={key} value={value}>{label+' - ₹ '+ Number(value).toFixed(2)+'/sqft'}</option>
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
                    <option key={key} value={value}>{label+' - ₹ '+ Number(value).toFixed(2)+'/sqft'}</option>
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
                    <option key={key} value={value}>{label+' - ₹ '+ Number(value).toFixed(2)+'/sqft'}</option>
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
                    <option key={key} value={value}>{label+' - ₹ '+ Number(value).toFixed(2)+'/sqft'}</option>
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
                    <option key={key} value={value}>{label+' - ₹ '+ Number(value).toFixed(2)+'/sqft'}</option>
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
          </>} 
        
{/* </>
)} */}


        
        </div>
      </div>
    </div>

    

    </div>
    );
};
    
    export default App;