import React, { useEffect, useState } from 'react';
import { ReactSession } from 'react-client-session';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from "./navbar";
import Header from "./header";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '../App.css';
ReactSession.setStoreType("localStorage");

const App = () => {

  const userId = ReactSession.get("upvcuserId");
  const userType = ReactSession.get("upvcuserType");
  const userImage = ReactSession.get("upvcImage");
  const empId = ReactSession.get("upvcempid");
  const navigate = useNavigate();
  const indexPath = '/';
  
  const [costData, setCostData] = useState(null);
  const [brandDatas, setBdata] = useState(null);
  const [des, setDes] = useState('');

  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [acHolderName, setAcHolderName] = useState('');
  const [acType, setAcType] = useState('');
  const [acNumber, setAcNumber] = useState('');
  const [ifsc, setIfsc] = useState('');

  let users;
  if(userType === '3'){
    users = empId;
  }else{
    users = userId;
  }

  const user = { "userId": userId };



  
  useEffect(() => {
    if (userId === 0 ) {
      navigate(indexPath);
    }
  }, [userId, navigate]);


  const fetchDatalogterms = async () => {
    const formData ={
      userId: users,
      terms: des
    };
    try {
      const response = await axios.post(`https://upvcapi.sninfoserv.com/log/`, {userId, "Update Terms":formData});
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const fetchDatalogBankdetails= async () => {
    const sendData = {
      bank: bankName,
      branch: branchName,
      name: acHolderName,
      type: acType,
      acNumber: acNumber,
      ifsc: ifsc,
      userId: users 
  }
    try {
      const response = await axios.post(`https://upvcapi.sninfoserv.com/log/`, {userId, "Update Bank Details":sendData});
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };



  const fetchDatalogHardware= async () => {
    const sendData = {user: userId, data: newData};
    try {
      const response = await axios.post(`https://upvcapi.sninfoserv.com/log/`, {userId, "Update Hardware":sendData});
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  
  const fetchcostData = async () => {
    try {
      const response = await axios.post('https://upvcapi.sninfoserv.com/costs/', user);
        //console.log(response.data.data);
        setCostData(response.data.data.costData);
    } catch (error) {
    } 
  };


  useEffect(() => {
    fetchcostData();
  }, []);



  
 
  
  const [meshPrice, setMeshPrice] = useState([]);
  const [bladePrice, setBladePrice] = useState([]);
  const [meshGasketPrice, setMeshGasketPrice] = useState([]);
  const [proGasketPrice, setProGasketPrice] = useState([]);
  const [wastagePrice, setWastagePrice] = useState([]);
  const [screwPrice, setScrewPrice] = useState([]);
  const [marketingPrice, setMarketingPrice] = useState([]);
  const [transportPrice, setTransportPrice] = useState([]);
  const [labourSPrice, setLabourSPrice] = useState([]);
  const [labourFPrice, setLabourFPrice] = useState([]);
  const [glassPrice, setGlassPrice] = useState([]);
  const [marginPrice, setMarginPrice] = useState([]);
  const [alTrackPrice, setAlTrackPrice] = useState([]);
  const [gRollPrice, setGRollPrice] = useState([]);
  const [meshRollPrice, setMeshRollPrice] = useState([]);
  const [wStripPrice, setWStripPrice] = useState([]);
  const [handlePrice, setHandlePrice] = useState([]);
  const [bArrestorPrice, setBArrestorPrice] = useState([]);
  const [dArrestorPrice, setDArrestorPrice] = useState([]);
  const [jStopperPrice, setJStopperPrice] = useState([]);
  const [boardPrice, setBoardPrice] = useState([]);
  const [steelPrice, setSteelPrice] = useState([]);
  const [grillPrice, setGrillPrice] = useState([]);
  const [mJAPrice, setMJAPrice] = useState([]);
  const [adjRollPrice, setAdjRollPrice] = useState([]);
  const [doorStopperPrice, setDoorStopperPrice] = useState([]);
  const [touchLockPrice, setTouchLockPrice] = useState([]);
  const [frictionStayPrice, setFrictionStayPrice] = useState([]);
  const [espagPrice, setEspagPrice] = useState([]);
  const [securityClipPrice, setSecurityClipPrice] = useState([]);
  const [runnerBlockPrice, setRunnerBlockPrice] = useState([]);
  const [mullionClampPrice, setMullionClampPrice] = useState([]);
  const [tdHingesPrice, setTdHingesPrice] = useState([]);
  const [espagmPrice, setEspagmPrice] = useState([]);
  const [casementDoorsetPrice, setCasementDoorsetPrice] = useState([]);
  const [multiPointPrice, setMultiPointPrice] = useState([]);
  const [fanPrice, setFanPrice] = useState([]);

  
useEffect(() => {
  setMeshPrice(costData && costData.mesh);
  setBladePrice(costData && costData.blades);
  setMeshGasketPrice(costData && costData.meshGasket);
  setProGasketPrice(costData && costData.profileGasket);
  setWastagePrice(costData && costData.wastage);
  setScrewPrice(costData && costData.screws);
  setMarketingPrice(costData && costData.marketing);
  setTransportPrice(costData && costData.transport);
  setLabourSPrice(costData && costData.labourSite);
  setLabourFPrice(costData && costData.labourFactory);
  setGlassPrice(costData && costData.glass);
  setMarginPrice(costData && costData.margin);
  setAlTrackPrice(costData && costData.alTrack);
  setGRollPrice(costData && costData.gRoll);
  setMeshRollPrice(costData && costData.meshRoll);
  setWStripPrice(costData && costData.wStrip);
  setHandlePrice(costData && costData.handle);
  setBArrestorPrice(costData && costData.bArrestor);
  setDArrestorPrice(costData && costData.dArrestor);
  setJStopperPrice(costData && costData.jStopper);
  setBoardPrice(costData && costData.board);
  setSteelPrice(costData && costData.steel);
  setGrillPrice(costData && costData.grill);
  setMJAPrice(costData && costData.meshJA);
  setAdjRollPrice(costData && costData.adjRoll);
  setDoorStopperPrice(costData && costData.doorStopper);
  setFrictionStayPrice(costData && costData.frictionStay);
  setEspagPrice(costData && costData.espag);
  setSecurityClipPrice(costData && costData.securityClip);
  setRunnerBlockPrice(costData && costData.runnerBlock);
  setMullionClampPrice(costData && costData.mullionClamp);
  setTdHingesPrice(costData && costData.tdHinges);
  setEspagmPrice(costData && costData.espagm);
  setCasementDoorsetPrice(costData && costData.casementDoorset);
  setMultiPointPrice(costData && costData.mpl);
  setTouchLockPrice(costData && costData.touchLock);
  setFanPrice(costData && costData.fan);
}, [costData]);


//-------Wastage ------//
const wastageValue = (key, newValue) => {
 
 
  setWastagePrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const wastageLabel = (key, newLabel) => {
 
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  // console.log("label", label);
  
  setWastagePrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Steel ------//
const steelValue = (key, newValue) => {
  setSteelPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const steelLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setSteelPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Mesh ------//
const meshValue = (key, newValue) => {
  setMeshPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const meshLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setMeshPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Mesh Gasket------//
const meshGValue = (key, newValue) => {
  setMeshGasketPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const meshGLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setMeshGasketPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Profile Gasket------//
const proGValue = (key, newValue) => {
  setProGasketPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const proGLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setProGasketPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Louver Blades------//
const bladeValue = (key, newValue) => {
  setBladePrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const bladeLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setBladePrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Screws Price------//
const screwValue = (key, newValue) => {
  setScrewPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const screwLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setScrewPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Aluminium Track Price------//
const alTrackValue = (key, newValue) => {
  setAlTrackPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const alTrackLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setAlTrackPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Grove Roller Price------//
const gRollValue = (key, newValue) => {
  setGRollPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const gRollLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setGRollPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------GMesh Roller Price------//
const mRollValue = (key, newValue) => {
  setMeshRollPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const mRollLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setMeshRollPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Weather Strip Price------//
const wStripValue = (key, newValue) => {
  setWStripPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const wStripLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setWStripPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Bump Arrestor Price------//
const bArrestorValue = (key, newValue) => {
  setBArrestorPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const bArrestorLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setBArrestorPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Dust Arrestor Price------//
const dArrestorValue = (key, newValue) => {
  setDArrestorPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const dArrestorLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setDArrestorPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------mesh Jumpt Arrestor Price------//
const mjaValue = (key, newValue) => {
  setMJAPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const mjaLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setMJAPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Adj Roll Price------//
const adjRValue = (key, newValue) => {
  setAdjRollPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const adjRLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setAdjRollPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Door Stopper Price------//
const doorSValue = (key, newValue) => {
  setDoorStopperPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const doorSLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setDoorStopperPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Touch Lock Price------//
const tLValue = (key, newValue) => {
  
  setTouchLockPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const tLLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setTouchLockPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Friction Stay Price------//
const fSValue = (key, newValue) => {
  setFrictionStayPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const fSLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setFrictionStayPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Espag Price------//
const ePValue = (key, newValue) => {
  setEspagPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const ePLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setEspagPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Security Clip Price------//
const sCValue = (key, newValue) => {
  setSecurityClipPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const sCLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setSecurityClipPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Runner Block Price------//
const rBValue = (key, newValue) => {
  setRunnerBlockPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const rBLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setRunnerBlockPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------mullionClamp Price------//
const mCValue = (key, newValue) => {
  setMullionClampPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const mCLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setMullionClampPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------tdHinges Price------//
const tHValue = (key, newValue) => {
  setTdHingesPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const tHLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setTdHingesPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------espagm Price------//
const esMValue = (key, newValue) => {
  setEspagmPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const esMLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setEspagmPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------casementDoorset Price------//
const cdSValue = (key, newValue) => {
  
  setCasementDoorsetPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const cdSLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setCasementDoorsetPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------multiPoint Price------//
const mpLValue = (key, newValue) => {
  setMultiPointPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const mpLLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setMultiPointPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};


//-------j Stopper Price------//
const jSValue = (key, newValue) => {
  setJStopperPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const jSLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setJStopperPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Grill Price------//
const gPValue = (key, newValue) => {
  setGrillPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const gPLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setGrillPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Marketing Price------//
const mPValue = (key, newValue) => {
  setMarketingPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const mPLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setMarketingPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Transportaion Price------//
const tPValue = (key, newValue) => {
  setTransportPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const tPLabel = (key, newLabel) => {

  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setTransportPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Labour Site Price------//
const lSValue = (key, newValue) => {
  setLabourSPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const lSLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setLabourSPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Labour Factory Price------//
const lFValue = (key, newValue) => {
  setLabourFPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const lFLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setLabourFPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Glass Price------//
const glSValue = (key, newValue) => {
  setGlassPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const glSLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setGlassPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Profit Margin Price------//
const mrGValue = (key, newValue) => {
  setMarginPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const mrGLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setMarginPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Handle Price------//
const hValue = (key, newValue) => {
  setHandlePrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const hLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setHandlePrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

//-------Board Price------//
const bValue = (key, newValue) => {
  setBoardPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const bLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setBoardPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};

const fValue = (key, newValue) => {
  setFanPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], value: newValue }
  }));
};

const fLabel = (key, newLabel) => {
  let label ='';
  label = newLabel.replace(/['"]/g, '');
  setFanPrice(prevState => ({
    ...prevState,
    [key]: { ...prevState[key], label: label }
  }));
};


const newData = {
    mesh:meshPrice,
    blades:bladePrice,
    meshGasket:meshGasketPrice,
	  profileGasket:proGasketPrice,
    steel:steelPrice,
    wastage:wastagePrice,
    screws:screwPrice,
    marketing:marketingPrice,
    transport:transportPrice,
    labourSite:labourSPrice,
    labourFactory:labourFPrice,
    glass:glassPrice,
    margin:marginPrice,
    alTrack:alTrackPrice,
    gRoll:gRollPrice,
    meshRoll:meshRollPrice,
    wStrip:wStripPrice,
    handle:handlePrice,
    bArrestor:bArrestorPrice,
    dArrestor:dArrestorPrice,
    jStopper:jStopperPrice,
    board:boardPrice,
    fan:fanPrice,
    grill:grillPrice,
    meshJA:mJAPrice,
    doorStopper:doorStopperPrice,
    adjRoll:adjRollPrice,
    touchLock: touchLockPrice,
    frictionStay: frictionStayPrice,
    espag: espagPrice,
    securityClip: securityClipPrice,
    runnerBlock: runnerBlockPrice,
    mullionClamp: mullionClampPrice,
    tdHinges: tdHingesPrice,
    espagm: espagmPrice,
    casementDoorset: casementDoorsetPrice,
    mpl: multiPointPrice

};
    
  const updateData = async () => {
    fetchDatalogHardware();
    const sendData = {user: userId, data: newData};
    try {
      const response = await axios.post('https://upvcapi.sninfoserv.com/costs-update/', sendData);
      if(response.data.status === 'success'){
        fetchcostData();
        alert('Pricing updated!');
      }else{
        alert('Unable to process your request please try again!');
      }
    } catch (error) {
    } 
  };

  const brandData = async () => {
    try {
      const response = await axios.get('https://upvcapi.sninfoserv.com/company/', {params: { userId: users }});
      
      if(response.data.status === 'success'){
        setBdata(response.data.data);
        setDes(response.data.data[0].companyTerms);
        setBankName(response.data.data[0].companyBank);
        setBranchName(response.data.data[0].companyBranch);
        setAcHolderName(response.data.data[0].companyBankerName);
        setAcType(response.data.data[0].companyBankType);
        setAcNumber(response.data.data[0].companyAcNum);
        setIfsc(response.data.data[0].companyIfsc);
      }
    } catch (error) {
      console.error('Error fetching brand data:', error);
    } 
  };
    
  useEffect(() => {
    brandData();
  },[]);


   
  const handleSubmit = async (event) => {
    fetchDatalogterms();
    event.preventDefault();

    const formData ={
      userId: users,
      terms: des
    };

    try {
      const response = await axios.post('https://upvcapi.sninfoserv.com/quote-terms/', formData);
      if(response.data.status=== 'success'){
        alert('Terms & Conditions is Updated...');
        brandData();
      }
    } catch (error) {
        console.error('There was a problem with login:', error);
    }
  };

  


  const handleDesChange = (event, editor) => {
    const data = editor.getData();
    setDes(data);
  };

  const updateBanking = async (event) => {
    event.preventDefault();

    fetchDatalogBankdetails();
    const sendData = {
        bank: bankName,
        branch: branchName,
        name: acHolderName,
        type: acType,
        acNumber: acNumber,
        ifsc: ifsc,
        userId: users 
    }
    try {
      const response = await axios.post('https://upvcapi.sninfoserv.com/update-bank/', sendData);
      if(response.data.status === 'success'){
        alert('Banking Data updated!');
        brandData();
      }
    } catch (error) {
        console.error('There was a problem with login:', error);
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
                <h4 class="mb-4">Brand Details</h4>
                <div class="row">
                  <div class="col-md-6 col-xxl-2 col-xl-2 mt-4">
                    <img 
                      src={brandDatas && brandDatas[0]?.companyLogo && brandDatas[0]?.companyLogo !== 'user.png' ? `https://upvcapi.sninfoserv.com/user/images/${brandDatas[0].companyLogo}` : "/assets/images/pari-logo.png"} 
                      width="140px" 
                      alt="Pari and Co" 
                      style={{ borderRadius: '8px', objectFit: 'contain' }}
                    />
                  </div>
                  <div class="col-md-6 col-xxl-5 col-xl-5 mt-4">
                    <h5 class="mb-3">{brandDatas && brandDatas[0].companyName}</h5>
                    <p class="text-sm">GSTIN : {brandDatas && brandDatas[0].companyGst}</p>
                    <p class="text-sm">Address : {brandDatas && brandDatas[0].companyAddress}</p>
                    <p class="text-sm">Location : {brandDatas && brandDatas[0].companyLocation}</p>
                    <p class="text-sm">Contact : {brandDatas && brandDatas[0].companyContact}</p>
                  </div>
                  <div class="col-md-6 col-xxl-5 col-xl-5 mt-4">
                    <h5 class="mb-3">Banking Details</h5>
                    <p class="text-sm">Bank : {brandDatas && brandDatas[0].companyBank}</p>
                    <p class="text-sm">Branch : {brandDatas && brandDatas[0].companyBranch}</p>
                    <p class="text-sm">A/c Type : {brandDatas && brandDatas[0].companyBankType}</p>
                    <p class="text-sm">A/C Number : {brandDatas && brandDatas[0].companyAcNum}</p>
                    <p class="text-sm">IFS Code : {brandDatas && brandDatas[0].companyIfsc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-12 col-xxl-12 col-xl-12">
              <div class="card-body pc-component">
                <div class="accordion card" id="accordionExample">

                  <div class="accordion-item">
                    <h2 class="accordion-header" id="headingOne">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                        Terms & Conditions
                      </button>
                    </h2>
                    <div id="collapseOne" class="accordion-collapse collapse mt-4" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                          <form onSubmit={handleSubmit}>
                            <div class="row">
                              <div className="mb-3 col-md-12 col-xxl-12 col-xl-12">
                                <CKEditor
                                  editor={ClassicEditor}
                                  data={des}
                                  onChange={handleDesChange}
                                />
                              </div>
                              <div align='center'>
                                <button type="submit" className="btn btn-primary">Update</button>
                              </div>                         
                            </div>
                          </form>
                        </div>
                    </div>
                  </div>

                  <div class="accordion-item">
                    <h2 class="accordion-header" id="headingTwo">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                         Banking Details
                      </button>
                    </h2>
                    <div id="collapseTwo" class="accordion-collapse collapse mt-4" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                      <div class="accordion-body">
                        <form onSubmit={updateBanking}>
                          <div class="row">
                            <div class="col-md-6 col-xxl-4 col-xl-4 mb-3">
                              <label htmlFor="name">Bank Name</label>
                              <input type="text" id="name" class="form-control mt-1" required value={bankName} onChange={(e) => setBankName(e.target.value)} />
                            </div>

                            <div class="col-md-6 col-xxl-4 col-xl-4 mb-3">
                              <label htmlFor="name">Branch Name</label>
                              <input type="text" id="name"  class="form-control mt-1" required value={branchName} onChange={(e) => setBranchName(e.target.value)} />
                            </div>

                            <div class="col-md-6 col-xxl-4 col-xl-4 mb-3">
                              <label htmlFor="name">A/C Holder Name</label>
                              <input type="text" id="name"  class="form-control mt-1" required value={acHolderName} onChange={(e) => setAcHolderName(e.target.value)} />
                            </div>

                            <div class="col-md-6 col-xxl-4 col-xl-4 mb-3">
                              <label htmlFor="name">A/C Type</label>
                              <input type="text" id="name"  class="form-control mt-1" required value={acType} onChange={(e) => setAcType(e.target.value)} />
                            </div>

                            <div class="col-md-6 col-xxl-4 col-xl-4 mb-3">
                              <label htmlFor="name">A/C Number</label>
                              <input type="text" id="name"  class="form-control mt-1" required value={acNumber} onChange={(e) => setAcNumber(e.target.value)}/>
                            </div>

                            <div class="col-md-6 col-xxl-4 col-xl-4 mb-3">
                              <label htmlFor="name">IFSC Code</label>
                              <input type="text" id="name"  class="form-control mt-1" required value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
                            </div>

                            <div class="col-md-12 col-xxl-12 col-xl-12 mb-3" align='center'>
                              <button type="submit" className="btn btn-primary">Save Data</button>
                            </div>

                          </div>
                        </form>
                      </div>
                    </div>
                  </div>

                  <div class="accordion-item">
                    <h2 class="accordion-header" id="headingThree">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                        Hardware & Pricing
                      </button>
                    </h2>
                    <div id="collapseThree" class="accordion-collapse collapse mt-4" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                      <div class="accordion-body">
                        <div class="row">

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Profile Wastage % </label>
                            <div class="row">
                              {wastagePrice && Object.entries(wastagePrice).map(([key, { label, value }], index) => (
                               
                                <React.Fragment key={index}>
                                   {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                      type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => wastageLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                      type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => wastageValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                             
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Steel Price (Feet)</label>
                            <div class="row">
                              {steelPrice && Object.entries(steelPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => steelLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => steelValue(key, e.target.value)}
                                    />
                                  </div>
                                   </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Mesh Price ( sqft )</label>
                            <div class="row">
                              {meshPrice && Object.entries(meshPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => meshLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => meshValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Mesh Gasket Price ( Meter )</label>
                            <div class="row">
                              {meshGasketPrice && Object.entries(meshGasketPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => meshGLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => meshGValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Profile Gasket Price ( Meter )</label>
                            <div class="row">
                              {proGasketPrice && Object.entries(proGasketPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => proGLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => proGValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Louver Blades Price ( Meter )</label>
                            <div class="row">
                              {bladePrice && Object.entries(bladePrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => bladeLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => bladeValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Screws Price ( Counts )</label>
                            <div class="row">
                              {screwPrice && Object.entries(screwPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => screwLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => screwValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Aluminium Track Price ( Feet )</label>
                            <div class="row">
                              {alTrackPrice && Object.entries(alTrackPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => alTrackLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => alTrackValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Grove Roller Price ( Counts )</label>
                            <div class="row">
                              {gRollPrice && Object.entries(gRollPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => gRollLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => gRollValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Mesh Roller Price ( Counts )</label>
                            <div class="row">
                              {meshRollPrice && Object.entries(meshRollPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => mRollLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => mRollValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Weather Strip Price ( Feet )</label>
                            <div class="row">
                              {wStripPrice && Object.entries(wStripPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => wStripLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => wStripValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Bump Arrestor Price ( Counts )</label>
                            <div class="row">
                              {bArrestorPrice && Object.entries(bArrestorPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => bArrestorLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => bArrestorValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Dust Arrestor Price ( Feet )</label>
                            <div class="row">
                              {dArrestorPrice && Object.entries(dArrestorPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => dArrestorLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => dArrestorValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Mesh Jump Arrestor Price ( Counts )</label>
                            <div class="row">
                              {mJAPrice && Object.entries(mJAPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => mjaLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => mjaValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Adjust Roller Price ( Counts )</label>
                            <div class="row">
                              {adjRollPrice && Object.entries(adjRollPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => adjRLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => adjRValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Door Stopper Price ( Counts )</label>
                            <div class="row">
                              {doorStopperPrice && Object.entries(doorStopperPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => doorSLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => doorSValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Touch Lock Price ( Counts )</label>
                            <div class="row">
                              {touchLockPrice && Object.entries(touchLockPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => tLLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => tLValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Friction Stay Price ( Counts )</label>
                            <div class="row">
                              {frictionStayPrice && Object.entries(frictionStayPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => fSLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => fSValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Espag with SS Receiver ( Counts )</label>
                            <div class="row">
                              {espagPrice && Object.entries(espagPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => ePLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => ePValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Security Clip Price ( Counts )</label>
                            <div class="row">
                              {securityClipPrice && Object.entries(securityClipPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => sCLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => sCValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Runner Block Price ( Counts )</label>
                            <div class="row">
                              {runnerBlockPrice && Object.entries(runnerBlockPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => rBLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => rBValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Mullion Clamp Price ( Counts )</label>
                            <div class="row">
                              {mullionClampPrice && Object.entries(mullionClampPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => mCLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => mCValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">3D/2D/Concealed Hinges Price ( Counts )</label>
                            <div class="row">
                              {tdHingesPrice && Object.entries(tdHingesPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => tHLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => tHValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Espag with Multi-Lock Price ( Counts )</label>
                            <div class="row">
                              {espagmPrice && Object.entries(espagmPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => esMLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => esMValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Casement Door Set Price ( Counts )</label>
                            <div class="row">
                              {casementDoorsetPrice && Object.entries(casementDoorsetPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => cdSLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => cdSValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">MPL Price ( Counts )</label>
                            <div class="row">
                              {multiPointPrice && Object.entries(multiPointPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => mpLLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => mpLValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Jump Stopper Price ( Counts )</label>
                            <div class="row">
                              {jStopperPrice && Object.entries(jStopperPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => jSLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => jSValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Grill Price ( sqft )</label>
                            <div class="row">
                              {grillPrice && Object.entries(grillPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => gPLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => gPValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Marketing Overheads ( sqft )</label>
                            <div class="row">
                              {marketingPrice && Object.entries(marketingPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => mPLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => mPValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Transportation Charges ( KM )</label>
                            <div class="row">
                              {transportPrice && Object.entries(transportPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => tPLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => tPValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Labour (Site) Charges ( sqft )</label>
                            <div class="row">
                              {labourSPrice && Object.entries(labourSPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => lSLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => lSValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Labour (Factory) Charges ( sqft )</label>
                            <div class="row">
                              {labourFPrice && Object.entries(labourFPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => lFLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => lFValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Glass Price ( sqft )</label>
                            <div class="row">
                              {glassPrice && Object.entries(glassPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => glSLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => glSValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Profit Margin ( sqft )</label>
                            <div class="row">
                              {marginPrice && Object.entries(marginPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => mrGLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => mrGValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Handles Charges ( Counts )</label>
                            <div class="row">
                              {handlePrice && Object.entries(handlePrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => hLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => hValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Board Charges ( sqft )</label>
                            <div class="row">
                              {boardPrice && Object.entries(boardPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => bLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => bValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                            <label htmlFor="name">Fan</label>
                            <div class="row">
                              {fanPrice && Object.entries(fanPrice).map(([key, { label, value }], index) => (
                                <React.Fragment key={index}>
                                  {index !== 0 && ( <>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="text"
                                      className="form-control mt-1"
                                      value={label}
                                      onChange={(e) => fLabel(key, e.target.value)} 
                                    />
                                  </div>
                                  <div className="col-6 col-md-3 col-xxl-6 col-xl-6">
                                    <input
                                     type="number"
                                      className="form-control mt-1"
                                      value={value}
                                      onChange={(e) => fValue(key, e.target.value)}
                                    />
                                  </div>
                                  </> )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>


                   

                 {/*   
                   

                    <div class="col-md-6 col-xxl-4 col-xl-4 mt-3">
                    <label htmlFor="name">Board Changes ( sqft )</label>
                    <div class="row">
                    {boardPrice && Object.entries(boardPrice).map(([key, value]) => (
                      <>
                      <div class="col-6 col-md-6 col-xxl-6 col-xl-6">
                        <input type="text" id="name" name="name" class="form-control mt-1" value={key} readOnly />
                      </div>
                      <div class="col-6 col-md-6 col-xxl-6 col-xl-6">
                        <input type="text" id="name" name="name" class="form-control mt-1" value={value} onChange={(e) => boardValue(key, e.target.value)}/>
                      </div>
                     </>
                    ))}
                    </div>
                    </div> */}

                    <div class="col-md-12 col-xxl-12 col-xl-12 mt-5" align="center">
                        <button class="btn btn-success w-25" onClick={updateData}>Update Price</button>
                    </div>

                </div>
                      </div>
                    </div>
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