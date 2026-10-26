import { getMergedProfileDetails } from '../services/profileManager';
import React, { useEffect, useState } from 'react';
import { ReactSession } from 'react-client-session';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { saveQuoteItem } from '../services/dbService';
import Navbar from "./navbar";
import Header from "./header";
import left from '../images/handleLeft.png';
import right from '../images/handleRight.png';
import meshimg from '../images/mesh.png';
import Handle from '../images/slideHandle.png';
import ContentEditable from 'react-contenteditable';

import numeral from 'numeral';
import './box.css';
ReactSession.setStoreType("localStorage");

function Editquotees() {

  const userId = ReactSession.get("upvcuserId");
  const userType = ReactSession.get("upvcuserType");
  const urlParams = new URLSearchParams(window.location.search);
  const quoteId = ReactSession.get("upvcquoteId");
  const quoteIds = urlParams.get('id');
  const Empid = ReactSession.get("upvcempid");
  const [modalContent, setModalContent] = useState(null);
  //console.log(quoteIds);
  const navigate = useNavigate();
  const indexPath = '/';
  const selectPath = '/select';
  const item = 'SlidingDoor';
  let users = '';
  if (userType === '3') {
    users = Empid;
  } else {
    users = userId;
  }
  const user = { "userId": users };


  useEffect(() => {
    if (userId === 0) {
      navigate(indexPath);
    }
  }, [userId, navigate]);

  const [quoteData, setquoteData] = useState(null);
  const [state, setState] = useState(null);
  const [measure, setMeasure] = useState('');
  // console.log(measure);
  const [mCalc, setMcalc] = useState();
  const [boxWidth, setBoxWidth] = useState();
  const [boxHeight, setBoxHeight] = useState();
  const [panelHeights, setpanelHeight] = useState();
  const [numFirstInnerBoxes, setNumFirstInnerBoxes] = useState();
  const [numFrames, setNumFrames] = useState(0);
  const [numSecondInnerBoxes, setNumSecondInnerBoxes] = useState(0);
  const [newHeights, setNewInnerBoxHeight] = useState();
  const [newWidths, setNewInnerBoxWidth] = useState([]);
  const [boxColors, setBoxColors] = useState([]);
  const [boxNames, setBoxNames] = useState([]);
  const [boxHandle, setBoxHandle] = useState([]);
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  const [boxPosition, setBoxPosition] = useState('');
  const [shutterCount, setShuttercount] = useState();
  const [fixedCount, setFixedCount] = useState();
  const [bottomFrame, setBottomFrame] = useState('');
  const [mesh, setMesh] = useState('');
  const [panelType, setPanelType] = useState(1);
  const [profileDetails, setProfileData] = useState(() => getMergedProfileDetails(null));
  const [qty, setQty] = useState();
  const [costData, setCostData] = useState(true);
  const [customProfile, setCustomProfile] = useState();
  const arrayvalue = urlParams.get('arrayValues');
  const [calcBtn, setCalcBtn] = useState(false);
  const [isProfile, setIsProfile] = useState(false);
  const [series, setSeries] = useState(null);
  const [rowid, setRowid] = useState('');
  const [grill, setGrill] = useState('');
  const [cusBoxWidth, setCusWidth] = useState(0);
  const [topFixedWidth, settopFixedWidth] = useState([]);
  const [topFixedNum, settopFixedNum] = useState(0);
  const [bottomFixedWidth, setbottomFixedWidth] = useState([]);
  const [bottomFixedNum, setbottomFixedNum] = useState(0);
  const [screen, setScreen] = useState(deviceWidth > 700 ? 3 : 8);
  const [boxTop, setboxTop] = useState('off');
  const [boxBottom, setboxBottom] = useState('off');
  const [topnewHeights, setTopBoxHeight] = useState(0);
  const [bottomnewHeights, setBottomBoxHeight] = useState(0);
  const [numTopBoxes, setnumTopBoxes] = useState(0);
  const [numBottomBoxes, setnumBottomBoxes] = useState(0);
  const [distance, setDistance] = useState(0);
  const [shutterHeight, setShutterHeight] = useState([]);
  const [split, setSplit] = useState('');
  // console.log(shutterHeight);



  useEffect(() => {
    const updateDeviceWidth = () => {
      setDeviceWidth(window.innerWidth);
      setScreen(window.innerWidth > 700 ? 3 : 8);
    };

    window.addEventListener('resize', updateDeviceWidth);

    return () => {
      window.removeEventListener('resize', updateDeviceWidth);
    };
  }, []);


  const fetchDatalog = async () => {
    try {
      const response = await axios.post(`https://upvcapi.sninfoserv.com/log/`, { userId, "edited coreData": coreData, profileDatas });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };




  const fetcholdData = async () => {
    try {
      const response = await axios.post('https://upvcapi.sninfoserv.com/all-quotes/', user);
      setquoteData(response.data);
      // console.log("String",response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetcholdData();
  }, []);

  const filteredQuotes = quoteData && quoteData.data.filter(quote => quote.quoteId === quoteIds);
  // console.log(filteredQuotes);



  useEffect(() => {
    if (filteredQuotes) {
      setState(filteredQuotes[0].quoteDetails[arrayvalue].quoteData)

      setRowid(filteredQuotes[0].quoteDetails[arrayvalue].rowId);
    }


  }
    , [filteredQuotes])
  //console.log(state);



  useEffect(() => {
    const distance = state?.distance;
    const measure = state?.measure;
    const boxWidth = state?.boxWidths;
    const boxHeight = state?.boxHeights;
    const numFirstInnerBoxes = state?.numFirstInnerBoxes;
    const numFrames = state?.numFrames;
    const numSecondInnerBoxes = state?.numSecondInnerBoxes;
    const topFixedWidth = state?.topFixedWidth ?? [];
    const bottomFixedWidth = state?.bottomFixedWidth ?? [];
    const shutterHeight = state?.shutterHeight ?? [];
    const topnewHeights = state?.topnewHeights;
    const bottomnewHeights = state?.bottomnewHeights;
    const bottomFixedNum = state?.bottomFixedNum;
    const topFixedNum = state?.topFixedNum;
    const boxTop = state?.boxTop;
    const boxBottom = state?.boxBottom;
    const numTopBoxes = state?.numTopBoxes;
    const split = state?.split;
    const numBottomBoxes = state?.numBottomBoxes;

    if (measure === 'mm') {
      const newHeights = state?.newHeights * 304.8;
      const newWidths = (state?.newWidthss ?? []).map(value => value * 304.8);
      setNewInnerBoxWidth(newWidths);
      setNewInnerBoxHeight(newHeights);
    } else {
      const newHeights = state?.newHeights;
      const newWidths = state?.newWidthss ?? [];
      setNewInnerBoxWidth(newWidths);
      setNewInnerBoxHeight(newHeights);
    }

    const bottomFrame = state?.bottomFrame;
    const panelType = state?.panelType;
    const panelHeights = state?.panelHeights;
    const boxColors = state?.boxColors ?? [];
    const boxNames = state?.boxNames ?? [];
    const boxHandle = state?.boxHandle ?? [];
    const boxPosition = state?.boxPosition;
    const mesh = state?.mesh;
    const grill = state?.grill;
    const qty = state?.qty;
    const shutterCount = state?.shutterCount;
    const fixedCount = state?.fixedCount;
    const handleCost = state?.data.tLock;
    const lockCost = state?.data.mplCost;
    const hingesCost = state?.data.hingsCost;
    const glassCost = state?.data.glassCost;
    const marginCost = state?.data.marginCost;
    const marketingCost = state?.data.marketingCost;
    const labourFCost = state?.data.labourFcost;
    const labourSCost = state?.data.labourScost;
    const transportCost = state?.data.transportCost;
    const boardCost = state?.data.boardCost;
    const series = state?.series;
    const steelFramCost = state?.data.steelFrame;
    const steelShutterCost = state?.data.steelShutter;
    const steelMullionCost = state?.data.steelMullion;
    const grillCost = state?.data.grillCost;
    const wastageCost = state?.data.wastage;
    const screwtCost = state?.data.screwsCost;
    const meshCost = state?.data.meshCost;
    const alTrackCost = state?.data.aluTrack;
    const gRollCost = state?.data.groRoll;
    const meshRollCost = state?.data.mesRoll;
    const wStripCost = state?.data.wStrip;
    const bArrestorCost = state?.data.bArrest;
    const dArrestorCost = state?.data.dArrest;
    const jStopperCost = state?.data.jStop;
    const ProfilegasketCost = state?.data?.frameGasket?.amount || 0;
    const ShuttergasketCost = state?.data?.shutterGasket?.amount || 0;
    const MulliongasketCost = state?.data?.mullionGasket?.amount || 0;
    const BeedinggasketCost = state?.data?.beedingGasket?.amount || 0;
    const touchlockcost = state?.data.touchLock;
    const espagCost = state?.data.espag;
    const espagmCost = state?.data.espagm;
    const mullionClampCost = state?.data.mullionClamp;
    const adjRollCost = state?.data.adjRoll;
    const frictionStayCost = state?.data.frictionStay;



    setMeasure(measure);
    if (measure === 'mm') {
      setBoxWidth(Number(boxWidth) * 304.8);
      setBoxHeight(Number(boxHeight) * 304.8);
      setMcalc(304.8);
    } else {
      setBoxWidth(Number(boxWidth));
      setBoxHeight(Number(boxHeight));
      setMcalc(1);
    }
    setNumFirstInnerBoxes(numFirstInnerBoxes);
    setNumFrames(numFrames);
    setNumSecondInnerBoxes(numSecondInnerBoxes);

    setBoxColors(boxColors);
    setBoxNames(boxNames);
    setBoxHandle(boxHandle);
    setBoxPosition(boxPosition);
    setMesh(mesh);
    setGrill(grill);
    setQty(qty);
    setFixedCount(fixedCount);
    setShuttercount(shutterCount);
    sethandleCost(handleCost);
    setlockCost(lockCost);
    sethingesCost(hingesCost);
    setBottomFrame(bottomFrame);
    setPanelType(panelType);
    setpanelHeight(panelHeights);
    setBoardCost(boardCost);
    setGlassCost(glassCost);
    setMarginCost(marginCost);
    setMarketingCost(marketingCost);
    setlabourFCost(labourFCost);
    setlabourSCost(labourSCost);
    setTransportCost(transportCost);
    setSeries(series);
    setsteelFramDef(steelFramCost);
    setsteelShutterDef(steelShutterCost);
    setGrillDef(grillCost);
    setwastageCost(wastageCost);
    setscrewDef(screwtCost);
    setProfilegasketDef(ProfilegasketCost);
    setShuttergasketDef(ShuttergasketCost);
    setMulliongasketDef(MulliongasketCost);
    setBeedinggasketDef(BeedinggasketCost);
    setmeshDef(meshCost);
    setalTrackDef(alTrackCost);
    setgRollDef(gRollCost);
    setmeshRollDef(meshRollCost);
    setwStripDef(wStripCost);
    setbArrestorDef(bArrestorCost);
    setjStopperDef(jStopperCost);
    setdArrestorDef(dArrestorCost);

    settopFixedWidth(topFixedWidth);
    setbottomFixedWidth(bottomFixedWidth);
    setTopBoxHeight(topnewHeights);
    setbottomFixedNum(bottomFixedNum);
    settopFixedNum(topFixedNum);
    setBottomBoxHeight(bottomnewHeights);
    setboxTop(boxTop);
    setboxBottom(boxBottom);
    setnumTopBoxes(numTopBoxes);
    setnumBottomBoxes(numBottomBoxes);
    setespagDef(espagCost);
    setespagmDef(espagmCost);
    setmullionClampDef(mullionClampCost);
    setouchlockDef(touchlockcost);
    setadjRollDef(adjRollCost);
    setfrictionStayDef(frictionStayCost);
    setDistance(distance);
    setSplit(split);
    setShutterHeight(shutterHeight);



  }, [state]);
  //console.log(customProfile);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('https://upvcapi.sninfoserv.com/new-profiles/', user);
        setProfileData(getMergedProfileDetails(response.data));
        //console.log("profile:", response.data);
      } catch (error) { setProfileData(getMergedProfileDetails(null)); }
    };

    fetchData();
  }, []);




  useEffect(() => {
    const fetchcostData = async () => {
      try {
        const response = await axios.post('https://upvcapi.sninfoserv.com/costs/', user);
        setCostData(response.data.data);
        //   console.log("cost", response.data);
      } catch (error) { setProfileData(getMergedProfileDetails(null)); }
    };

    fetchcostData();
  }, []);


  const handleQty = (event) => {
    if (event === 'plus') {
      setQty(qty + 1);

    } else {
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

  const handleWidthChange = (event) => {
    const newValue = event.target.value;
    const minValue = 1;
    if (newValue < minValue) {
      setBoxWidth(minValue);
    } else {
      setBoxWidth(newValue);
    }
    const updatedWidths = [...newWidths];
    const remainingValue = newValue;
    const otherCount = newWidths.length;
    const newWidth = remainingValue / otherCount;

    const newWidthsFormatted = updatedWidths.map((width, i) => {

      return newWidth;

    });

    setNewInnerBoxWidth(newWidthsFormatted.map((num) => parseFloat(num.toFixed(2))));
  };

  const handleHeightChange = (event) => {
    const newValue = event.target.value;
    const minValue = 1;
    if (newValue < minValue) {
      setBoxHeight(minValue);
    } else {
      setBoxHeight(newValue);
    }
  };

  //console.log(Number(boxHeight));

  const addWindow = (name) => {
    setNumSecondInnerBoxes((prevNum) => prevNum + 1);
    setBoxColors((prevColors) => [...prevColors, 'lightblue']);
    setNewInnerBoxWidth((prevWidths) => {
      const newWidth = boxWidth / (numSecondInnerBoxes + 1) / numFrames;
      const newWidths = newWidth.toFixed(2)
      const updatedWidths = prevWidths.map(() => newWidths);
      return [...updatedWidths, newWidths];
    });
    setBoxNames((prevNames) => [...prevNames, name]);
    const newBoxHandles = [...boxHandle, 'left'];
    setBoxHandle(newBoxHandles);
    setShutterHeight([...shutterHeight, { height: 2, top: 'glass', bottom: 'panel' }]);
  };

  const changeShutterHeight = (event, index) => {
    const updatedShutterheights = [...shutterHeight];
    updatedShutterheights[index].height = event.target.value;
    setShutterHeight(updatedShutterheights);
  };

  const shutterTypeTop = (e, index) => {
    const updatedShutterTypes = [...shutterHeight];
    updatedShutterTypes[index].top = e.target.value;
    setShutterHeight(updatedShutterTypes);
  };

  const shutterTypeBottom = (e, index) => {
    const updatedShutterTypes = [...shutterHeight];
    updatedShutterTypes[index].bottom = e.target.value;
    setShutterHeight(updatedShutterTypes);
  };

  const changeSplit = () => {
    if (split === 'off') {
      setSplit('on');
    } else {
      setSplit('off');
    }
  };


  function addMullion(name) {
    setNumSecondInnerBoxes((prevNum) => prevNum + 1);
    setBoxColors((prevColors) => [...prevColors, 'lightgreen']);
    setNewInnerBoxWidth((prevWidths) => {
      const newWidth = boxWidth / (numSecondInnerBoxes + 1) / numFrames;
      const newWidths = newWidth.toFixed(2);
      const updatedWidths = prevWidths.map(() => newWidths);
      return [...updatedWidths, newWidth];
    });
    setBoxNames((prevNames) => [...prevNames, name]);
    const newBoxHandles = [...boxHandle, 'left'];
    setBoxHandle(newBoxHandles);
    setCusWidth(boxWidth);
    setShutterHeight([...shutterHeight, {height: 2, top: 'glass', bottom: 'panel'} ]);
  }

  const deleteInnerBox = (index) => {

    setNumSecondInnerBoxes((prevNum) => prevNum - 1);
    const newBalanceWidth = Number(boxWidth) / (numSecondInnerBoxes - 1) / numFrames;
    const updatedWidths = [...newWidths];
    updatedWidths.splice(index, 1);
    const updateWidths = updatedWidths.map(() => newBalanceWidth);
    setNewInnerBoxWidth(updateWidths);

    setBoxColors((prevColors) => {
      const updatedColors = [...prevColors];
      updatedColors.splice(index, 1);
      return updatedColors;
    });
    setBoxNames((prevNames) => {
      const updatedNames = [...prevNames];
      updatedNames.splice(index, 1);
      return updatedNames;
    });

  };



  // const handleNewWidthChange = (index, event) => {
  //   const value = parseFloat(event.target.value);
  //   if (isNaN(value)) return;


  //     const updatedWidths = [...newWidths];
  //     updatedWidths[index] = value;

  //     const remainingValue = Number(boxWidth) - value;
  //     const otherCount = newWidths.length - 1;
  //     const newWidth = remainingValue / otherCount;

  //     const newWidthsFormatted = updatedWidths.map((width, i) => {
  //       if (i === index) {
  //         return value;
  //       } else {
  //         return newWidth;
  //       }
  //     });

  //     setNewInnerBoxWidth(newWidthsFormatted.map((num) => parseFloat(num.toFixed(2))));

  // };


  const changeHandle = (index) => {
    if (boxHandle[index] === 'left') {
      const updatedBoxHandle = [...boxHandle];
      updatedBoxHandle[index] = 'right';
      setBoxHandle(updatedBoxHandle);
    }
    if (boxHandle[index] === 'right') {
      const updatedBoxHandle = [...boxHandle];
      updatedBoxHandle[index] = 'left';
      setBoxHandle(updatedBoxHandle);
    }
  };


  const handleWidth = (event) => {
    if (event === 'plus') {
      setBoxWidth(Number(Number(boxWidth)) + 0.5);
      // Update inner box widths equally
      let newValue = parseFloat((parseFloat(boxWidth) + parseFloat(0.50)) / parseFloat(numSecondInnerBoxes));
      const updatedArray = newWidths.map(() => newValue);
      setNewInnerBoxWidth(updatedArray);

    } else {
      const minValue = 2;
      if (Number(boxWidth) < minValue) {
        setBoxWidth(Number(boxWidth));
      } else {
        setBoxWidth(Number(Number(boxWidth)) - 0.5);
        // Update inner box widths equally
        let newValue = parseFloat((boxWidth - 0.50) / numSecondInnerBoxes);
        const updatedArray = newWidths.map(() => newValue);
        setNewInnerBoxWidth(updatedArray);
      }
    }
    // setNumSecondInnerBoxes(0);
    // setNewInnerBoxWidth([]);
    // setBoxNames([]);
  };

  const handleHeight = (event) => {
    if (event === 'plus') {
      setBoxHeight(Number(Number(boxHeight)) + 0.5);
    } else {
      const minValue = 2;
      if (Number(boxHeight) < minValue) {
        setBoxHeight(Number(boxHeight));
      } else {
        setBoxHeight(Number(Number(boxHeight)) - 0.5);
      }
    }
    // setNumSecondInnerBoxes(0);
    // setNewInnerBoxWidth([]);
    // setBoxNames([]);
  };



  if (numFirstInnerBoxes > 0 && newHeights === 0) {
    setNumFirstInnerBoxes(0);
    // console.log(newHeights);
  }

  const handleTopChange = () => {
    setNumFirstInnerBoxes(1);
    setNewInnerBoxHeight((prevHeight) => Math.min(Number(boxHeight) - 1, prevHeight + 1));
  };



  const addFrame = (operation) => {
    if (operation === 'minus') {
      setNumFrames((prevFrames) => Math.max(0, prevFrames - 1));


    } else if (operation === 'plus') {
      setNumFrames((prevFrames) => Math.min(4, prevFrames + 1));

    }
    setNumSecondInnerBoxes(0);
    setNewInnerBoxWidth([]);
    setBoxNames([]);
  };

  const toggleBoxPosition = () => {
    const newPosition = boxPosition === 'Top' ? 'Bottom' : 'Top';
    setBoxPosition(newPosition);
  };

  function changeMesh(name) {
    if (name === 'no') {
      setMesh('yes');
    } else {
      setMesh('no');
    }
  }


  function changeGrill(name) {
    if (name === 'no') {
      setGrill('yes');
    } else {
      setGrill('no');
    }
  }

  const handleButtonClick = (buttonName) => {
    setPanelType(buttonName);
  };


  function changeMeasure(name) {
    if (name === 'ft') {
      setMeasure('mm');
      setMcalc(304.8);
      setBoxHeight((Number(Number(boxHeight)) * 304.8).toFixed(2));
      setBoxWidth((Number(Number(boxWidth)) * 304.8).toFixed(2));
      if (newHeights > 0) {
        setNewInnerBoxHeight((Number(newHeights) * 304.8).toFixed(2));
      }
    } else {
      setMeasure('ft');
      setMcalc(1);
      setBoxHeight((Number(Number(boxHeight)) / 304.8).toFixed(2));
      setBoxWidth((Number(Number(boxWidth)) / 304.8).toFixed(2));
      if (newHeights > 0) {
        setNewInnerBoxHeight((Number(newHeights) / 304.8).toFixed(2));
      }
    }
    setNumSecondInnerBoxes(0);
    setNewInnerBoxWidth([]);
    setBoxNames([]);
  }

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
  };



  const shutterChange = (index) => {
    setBoxNames((prevBoxNames) => {
      const newBoxNames = [...prevBoxNames];
      newBoxNames[index] = newBoxNames[index] === 'Shutter' ? 'Fixed' : 'Shutter';
      return newBoxNames;
    });
    setBoxColors((prevboxColors) => {
      const newboxColors = [...prevboxColors];
      newboxColors[index] = newboxColors[index] === 'lightgreen' ? 'lightblue' : 'lightgreen';
      return newboxColors;
    });
  };


  // const handleInputChange = (index, value) => {
  //   const newSizes = [...newWidths];
  //   newSizes[index] = parseFloat(value);
  //   setNewInnerBoxWidth(newSizes);

  //   const sum = newSizes.reduce((a, b) => Number(a) + Number(b), 0);
  //   setCusWidth(sum);
  //   //alert(sum);
  //   if (sum > boxWidth) {
  //     alert('Shutter Width is larger than Frame size');
  //   }
  //   if (sum < boxWidth) {
  //     alert('Shutter Width is lesser than Frame size');
  //   }
  //   if (sum === boxWidth) {

  //   }
  // };

  const handleInputChange = (index, value) => {
    const newValue = parseFloat(value);
    // const total = newWidths.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);

    const remainingCount = newWidths.length - 1;
    const remainingValue = boxWidth - newValue;

    if (remainingValue < 0) {
      alert('Shutter Width is larger than Frame size');
      return;
    }

    const adjustedValues = newWidths.map((item, i) => {
      if (i === index) return newValue;
      return remainingValue / remainingCount;
    });

    setNewInnerBoxWidth(adjustedValues);

    const newSum = adjustedValues.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
    setCusWidth(newSum);

    if (newSum > boxWidth) {
      alert('Shutter Width is larger than Frame size');
    } else if (newSum < boxWidth) {
      alert('Shutter Width is lesser than Frame size');
    } else {

    }
  };


  const handleTop = (operation) => {
    if (operation === 'minus') {
      setTopBoxHeight((prevHeight) => Math.max(0, prevHeight - 0.25));
    } else if (operation === 'plus') {
      setTopBoxHeight((prevHeight) => Math.min(boxHeight - 2, prevHeight + 0.25));
    }
  };

  const handleTopHeight = (event) => {
    let newValue = parseFloat(event.target.value);
    newValue = Math.round(newValue * 100) / 100;
    newValue = Math.min(boxHeight - 2, Math.max(0.50, newValue));
    setTopBoxHeight(newValue);
    if (newValue === 0) {
      setnumTopBoxes(0);
      setboxTop('off');
    }
  };

  const toggleboxTop = () => {
    const newPosition = boxTop === 'off' ? 'on' : 'off';
    setboxTop(newPosition);
    setnumTopBoxes(1);
    setTopBoxHeight(1);
    settopFixedNum(1);
  };

  const handleTopPart = (event) => {
    if (event === 'plus') {
      settopFixedNum(Number(topFixedNum) + 1);
      settopFixedWidth(Array(topFixedNum + 1).fill(boxWidth / (topFixedNum + 1)));
    } else {
      const minValue = 2;
      if (topFixedNum < minValue) {
        settopFixedNum(topFixedNum);
        settopFixedWidth(Array(topFixedNum).fill(boxWidth / (topFixedNum)));
      } else {
        settopFixedNum(Number(topFixedNum) - 1);
        settopFixedWidth(Array(topFixedNum - 1).fill(boxWidth / (topFixedNum - 1)));
      }
    }
  };

  const handleTopPartChange = (event) => {
    const newValue = event.target.value;
    const minValue = 1;
    if (newValue < minValue) {
      settopFixedNum(minValue);
    } else {
      settopFixedNum(newValue);
    }
  };

  const handleBottom = (operation) => {
    if (operation === 'minus') {
      setBottomBoxHeight((prevHeight) => Math.max(0, prevHeight - 0.25));
    } else if (operation === 'plus') {
      setBottomBoxHeight((prevHeight) => Math.min(boxHeight - 2, prevHeight + 0.25));
    }
  };


  const handleBottomHeight = (event) => {
    let newValue = parseFloat(event.target.value);
    newValue = Math.round(newValue * 100) / 100;
    newValue = Math.min(boxHeight - 2, Math.max(0.50, newValue));
    setBottomBoxHeight(newValue);
    if (newValue === 0) {
      setnumBottomBoxes(0);
      setboxBottom('off');
    }
  };

  const toggleboxBottom = () => {
    const newPosition = boxBottom === 'off' ? 'on' : 'off';
    setboxBottom(newPosition);
    setnumBottomBoxes(1);
    setBottomBoxHeight(1);
    setbottomFixedNum(1);
  };

  const handleBottomPart = (event) => {
    if (event === 'plus') {
      setbottomFixedNum(Number(bottomFixedNum) + 1);
      setbottomFixedWidth(Array(bottomFixedNum + 1).fill(boxWidth / (bottomFixedNum + 1)));
    } else {
      const minValue = 2;
      if (bottomFixedNum < minValue) {
        setbottomFixedNum(bottomFixedNum);
        setbottomFixedWidth(Array(bottomFixedNum).fill(boxWidth / (bottomFixedNum)));
      } else {
        setbottomFixedNum(Number(bottomFixedNum) - 1);
        setbottomFixedWidth(Array(bottomFixedNum - 1).fill(boxWidth / (bottomFixedNum - 1)));
      }
    }
  };

  const handleBottomPartChange = (event) => {
    const newValue = event.target.value;
    const minValue = 1;
    if (newValue < minValue) {
      setbottomFixedNum(minValue);
    } else {
      setbottomFixedNum(newValue);
    }
  };


  useEffect(() => {
    if (topnewHeights === 0) {
      setnumTopBoxes(0);
      setboxTop('off');
      settopFixedWidth([]);
      setTopBoxHeight(0);
      settopFixedNum(0);
    }
    if (bottomnewHeights === 0) {
      setnumBottomBoxes(0);
      setboxBottom('off');
      setbottomFixedWidth([]);
      setBottomBoxHeight(0);
      setbottomFixedNum(0);
    }
  }, [topnewHeights, bottomnewHeights]);




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
  const shutterData = findSeriesAndIdByName(state?.data.shutter.id);
  const mullionData = findSeriesAndIdByName(state?.data.mullion.id);
  const beedingData = findSeriesAndIdByName(state?.data.beeding.id);
  const paneldata = findSeriesAndIdByName(state?.data.panelCost.id);
  const interlockdata = findSeriesAndIdByName(state?.data.interlock.id);
  const cuplerData = findSeriesAndIdByName(state?.data.cupler.id);


  const [selectedFrameSeries, setSelectedFrameSeries] = useState(null);
  const [selectedFrameId, setSelectedFrameId] = useState(null);

  const handleFrameSeriesChange = (event) => {
    const seriesId = event.target.value;

    setSelectedFrameSeries(seriesId);
    setSelectedFrameId(null);
    //console.log(seriesId);
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

  useEffect(() => {
    if (selectedShutterSeries === null) {
      setSelectedShutterSeries(shutterData.series);
      setSelectedShutterId(shutterData.id);
    }
  });

  const seriesDataShutter = profileData && profileData.find(serieses => serieses.series === selectedShutterSeries);
  const selectedShutterPrice = selectedShutterId ? seriesDataShutter?.items?.find(item => item.id === selectedShutterId)?.price || '0' : '0';
  const selectedShutterLength = selectedShutterId ? seriesDataShutter?.items?.find(item => item.id === selectedShutterId)?.length || '0' : '0';
  const selectedShutterWeight = selectedShutterId ? seriesDataShutter?.items?.find(item => item.id === selectedShutterId)?.weight || '0' : '0';
  const selectedShutterName = selectedShutterId ? seriesDataShutter?.items?.find(item => item.id === selectedShutterId)?.name || 'Loading' : 'Loading';



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


  const [selectedPanelSeries, setSelectedPanelSeries] = useState(null);
  const [selectedPanelId, setSelectedPanelId] = useState(null);



  const handlePanelChange = (event) => {
    const seriesId = event.target.value;
    //const seriesDataPanel = profileData && profileData.find(serieses => serieses.series === seriesId);
    setSelectedPanelSeries(seriesId);
    setSelectedPanelId(null);
  };

  const handlePanelIdChange = (event) => {
    const id = event.target.value;
    setSelectedPanelId(id);
  };
  useEffect(() => {
    if (selectedPanelSeries === null) {
      setSelectedPanelSeries(paneldata.series);
      setSelectedPanelId(paneldata.id);
    }
  });

  const seriesDataPanel = profileData && profileData.find(serieses => serieses.series === selectedPanelSeries);
  const selectedPanelPrice = selectedPanelId ? seriesDataPanel?.items?.find(item => item.id === selectedPanelId)?.price || '0' : 0;
  const selectedPanelLength = selectedPanelId ? seriesDataPanel?.items?.find(item => item.id === selectedPanelId)?.length || '0' : 0;
  const selectedPanelWeight = selectedPanelId ? seriesDataPanel?.items?.find(item => item.id === selectedPanelId)?.weight || '0' : 0;
  const selectedPanelName = selectedPanelId ? seriesDataPanel?.items?.find(item => item.id === selectedPanelId)?.name || 'Loading' : 'Loading';



  const [selectedInterLockSeries, setSelectedInterLockSeries] = useState(null);
  const [selectedInterLockId, setSelectedInterLockId] = useState(null);


  const handleInterLockSeriesChange = (event) => {
    const seriesId = event.target.value;
    setSelectedInterLockSeries(seriesId);
    setSelectedInterLockId(null);
  };
  useEffect(() => {
    if (selectedInterLockSeries === null) {
      setSelectedInterLockSeries(interlockdata.series);
      setSelectedInterLockId(interlockdata.id);
    }
  });

  const handleInterLockIdChange = (event) => {
    const id = event.target.value;
    setSelectedInterLockId(id);
  };
  //console.log(interlockdata.id);

  const seriesDataInterLock = profileData && profileData.find(serieses => serieses.series === selectedInterLockSeries);
  const selectedInterLockPrice = selectedInterLockId ? seriesDataInterLock?.items?.find(item => item.id === selectedInterLockId)?.price || '0' : 0;
  const selectedInterLockLength = selectedInterLockId ? seriesDataInterLock?.items?.find(item => item.id === selectedInterLockId)?.length || '0' : 0;
  const selectedInterLockWeight = selectedInterLockId ? seriesDataInterLock?.items?.find(item => item.id === selectedInterLockId)?.weight || '0' : 0;
  const selectedInterLockName = selectedInterLockId ? seriesDataInterLock?.items?.find(item => item.id === selectedInterLockId)?.name || 'Loading' : 'Loading';




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

  useEffect(() => {
    if (selectedCuplerSeries === null) {
      setSelectedCuplerSeries(cuplerData.series);
      setSelectedCuplerId(cuplerData.id);
    }
  });

  const seriesDataCupler = profileData && profileData.find(serieses => serieses.series === selectedCuplerSeries);
  const selectedCuplerPrice = selectedCuplerId ? seriesDataCupler?.items?.find(item => item.id === selectedCuplerId)?.price || '0' : "0";
  const selectedCuplerLength = selectedCuplerId ? seriesDataCupler?.items?.find(item => item.id === selectedCuplerId)?.length || '0' : "0";
  const selectedCuplerWeight = selectedCuplerId ? seriesDataCupler?.items?.find(item => item.id === selectedCuplerId)?.weight || '0' : "0";
  const selectedCuplerName = selectedCuplerId ? seriesDataCupler?.items?.find(item => item.id === selectedCuplerId)?.name || 'Loading' : "Loading";



  //-------------------cost--------------------------//

  const [handleCost, sethandleCost] = useState(null);
  const handles = costData?.costData?.handle || {};
  const handleChange = (event) => {
    const cost = event.target.value;
    sethandleCost(cost);
  };

  const [lockCost, setlockCost] = useState(null);
  // console.log(lockCost);
  const lockes = costData?.costData?.mpl || {};
  const lockChange = (event) => {
    const cost = event.target.value;
    setlockCost(cost);
  };


  const [hingesCost, sethingesCost] = useState(null);
  const hinges = costData?.costData?.tdHinges || {};
  const hingesChange = (event) => {
    const cost = event.target.value;
    sethingesCost(cost);
  };




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

  const [boardCost, setBoardCost] = useState(null);
  const board = costData?.costData?.board;
  const boardChange = (event) => {
    const cost = event.target.value;
    setBoardCost(cost);
  };

  const [grillCost, setGrillDef] = useState(null);
  const grillValues = costData?.costData?.grill;
  const grillChange = (event) => {
    const cost = event.target.value;
    setGrillDef(cost);
  };



  const [wastageCost, setwastageCost] = useState(null);
  const wasteValues = costData?.costData?.wastage;
  const wasteChange = (event) => {
    const cost = event.target.value;
    setwastageCost(cost);
  };

  const [ProfilegasketCost, setProfilegasketDef] = useState(0);
  const ProfilegasketValues = costData && costData.costData && costData.costData.profileGasket;
  const ProfilegasketChange = (event) => {
    const cost = event.target.value;
    setProfilegasketDef(cost);
  };

  const [ShuttergasketCost, setShuttergasketDef] = useState(0);
  const ShuttergasketValues = costData && costData.costData && costData.costData.profileGasket;
  const ShuttergasketChange = (event) => {
    const cost = event.target.value;
    setShuttergasketDef(cost);
  };

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
  const [steelShutterCost, setsteelShutterDef] = useState(null);
  const steelShutterValues = costData?.costData?.steel;
  const steelShutteChange = (event) => {
    const cost = event.target.value;
    setsteelShutterDef(cost);
  };

  const [alTrackCost, setalTrackDef] = useState(null);
  const alTrackValues = costData?.costData?.alTrack;
  const alTrackChange = (event) => {
    const cost = event.target.value;
    setalTrackDef(cost);
  };

  const [gRollCost, setgRollDef] = useState(null);
  const gRollValues = costData?.costData?.gRoll;
  const gRollChange = (event) => {
    const cost = event.target.value;
    setgRollDef(cost);
  };


  const [meshRollCost, setmeshRollDef] = useState(null);
  const meshRollValues = costData?.costData?.meshRoll;
  const meshRollChange = (event) => {
    const cost = event.target.value;
    setmeshRollDef(cost);
  };


  const [wStripCost, setwStripDef] = useState(null);
  const wStripValues = costData?.costData?.wStrip;
  const wStripChange = (event) => {
    const cost = event.target.value;
    setwStripDef(cost);
  };

  const [bArrestorCost, setbArrestorDef] = useState(null);
  const bArrestorValues = costData?.costData?.bArrestor;
  const bArrestorChange = (event) => {
    const cost = event.target.value;
    setbArrestorDef(cost);
  };

  const [jStopperCost, setjStopperDef] = useState(null);
  const jStopperValues = costData?.costData?.jStopper;
  const jStopperChange = (event) => {
    const cost = event.target.value;
    setjStopperDef(cost);
  };

  const [dArrestorCost, setdArrestorDef] = useState(null);
  const dArrestorValues = costData?.costData?.dArrestor;
  const dArrestorChange = (event) => {
    const cost = event.target.value;
    setdArrestorDef(cost);
  };

  const [meshCost, setmeshDef] = useState(null);
  const meshValues = costData?.costData?.mesh;
  const meshChange = (event) => {
    const cost = event.target.value;
    setmeshDef(cost);
  };


  const [touchlockCost, setouchlockDef] = useState(0);
  const touchLockValues = costData && costData.costData && costData.costData.touchLock;
  const touchLockChange = (event) => {
    const cost = event.target.value;
    setouchlockDef(cost);
  };


  const [espagCost, setespagDef] = useState(0);
  const espagValues = costData && costData.costData && costData.costData.espag;
  const espagChange = (event) => {
    const cost = event.target.value;
    setespagDef(cost);
  };

  const [runnerblockCost, setrunnerBlockDef] = useState(0);
  const runnerblockValues = costData && costData.costData && costData.costData.runnerBlock;
  const runnerblockChange = (event) => {
    const cost = event.target.value;
    setrunnerBlockDef(cost);
  };

  const [frictionStayCost, setfrictionStayDef] = useState(0);
  const frictionStayValues = costData && costData.costData && costData.costData.frictionStay;
  const frictionStayChange = (event) => {
    const cost = event.target.value;
    setfrictionStayDef(cost);
  };

  const [steelMullionCost, setsteelMullionDef] = useState(0);
  const steelMullionValues = costData && costData.costData && costData.costData.steel;
  const steelMullionChange = (event) => {
    const cost = event.target.value;
    setsteelMullionDef(cost);
  };

  const [espagmCost, setespagmDef] = useState(0);
  const espagmValues = costData && costData.costData && costData.costData.espagm;
  const espagmChange = (event) => {
    const cost = event.target.value;
    setespagmDef(cost);
  };

  const [mullionClampCost, setmullionClampDef] = useState(0);
  const mullionClampValues = costData && costData.costData && costData.costData.mullionClamp;
  const mullionClampChange = (event) => {
    const cost = event.target.value;
    setmullionClampDef(cost);
  };


  const [adjRollCost, setadjRollDef] = useState(0);
  const adjRollValues = costData && costData.costData && costData.costData.adjRoll;
  const adjRollChange = (event) => {
    const cost = event.target.value;
    setadjRollDef(cost);
  };




  const handleDef = costData && costData.costData && costData.costData.handle[0].value;
  const mplDef = costData && costData.costData && costData.costData.mpl[0].value;
  const hingesDef = costData && costData.costData && costData.costData.tdHinges[0].value;
  const glassDef = costData && costData.costData && costData.costData.glass[0].value;
  const marginDef = costData && costData.costData && costData.costData.margin[0].value;
  const marketingDef = costData && costData.costData && costData.costData.marketing[0].value;
  const labourFactoryDef = costData && costData.costData && costData.costData.labourFactory[0].value;
  const labourSiteDef = costData && costData.costData && costData.costData.labourSite[0].value;
  const transportDef = costData && costData.costData && costData.costData.transport[0].value;
  const boarddDef = costData && costData.costData && costData.costData.board[0].value;
  const steelFramDef = costData && costData.costData && costData.costData.steel[0].value;
  const steelShutterDef = costData && costData.costData && costData.costData.steel[0].value;
  const steelMullionDef = costData && costData.costData && costData.costData.steel[0].value;
  const grillDef = costData && costData.costData && costData.costData.grill[0].value;
  const meshGasketDef = costData && costData.costData && costData.costData.meshGasket[0].value;
  const meshDef = costData && costData.costData && costData.costData.mesh[0].value;
  const alTrackDef = costData && costData.costData && costData.costData.alTrack[0].value;
  const gRollDef = costData && costData.costData && costData.costData.gRoll[0].value;
  const meshRollDef = costData && costData.costData && costData.costData.meshRoll[0].value;
  const wStripDef = costData && costData.costData && costData.costData.wStrip[0].value;
  const bArrestorDef = costData && costData.costData && costData.costData.bArrestor[0].value;
  const jStopperDef = costData && costData.costData && costData.costData.jStopper[0].value;
  const dArrestorDef = costData && costData.costData && costData.costData.dArrestor[0].value;
  const screwDef = costData && costData.costData && costData.costData.screws[0].value;
  const wasteDef = costData && costData.costData && costData.costData.wastage[0].value;
  const ProfilegasketDef = costData && costData.costData && costData.costData.profileGasket[0].value;
  const touchLock = costData && costData.costData && costData.costData.touchLock[0].value;
  const adjRoll = costData && costData.costData && costData.costData.adjRoll[0].value;
  const espag = costData && costData.costData && costData.costData.espag[0].value;
  const espagm = costData && costData.costData && costData.costData.screws[0].espagm;
  const mullionClamp = costData && costData.costData && costData.costData.mullionClamp[0].value;
  const frictionStay = costData && costData.costData && costData.costData.espagm[0].value;
  const runnerBlock = costData && costData.costData && costData.costData.runnerBlock[0].value;




  const addDef = () => {
    sethandleCost(handleDef);
    setlockCost(mplDef);
    sethingesCost(hingesDef);
    setGlassCost(glassDef);
    setMarginCost(marginDef);
    setMarketingCost(marketingDef);
    setlabourFCost(labourFactoryDef);
    setlabourSCost(labourSiteDef);
    setTransportCost(transportDef);
    setBoardCost(boarddDef);
    setsteelFramDef(steelFramDef);
    setsteelShutterDef(steelShutterDef);
    setGrillDef(grillDef);
    setmeshDef(meshDef);
    setscrewDef(screwDef);
    setwastageCost(wasteDef);
    setalTrackDef(alTrackDef);
    setgRollDef(gRollDef);
    setmeshRollDef(meshRollDef);
    setwStripDef(wStripDef);
    setbArrestorDef(bArrestorDef);
    setjStopperDef(jStopperDef);
    setdArrestorDef(dArrestorDef);
    setProfilegasketDef(ProfilegasketDef);
    setMulliongasketDef(ProfilegasketDef);
    setShuttergasketDef(ProfilegasketDef);
    setBeedinggasketDef(ProfilegasketDef);
    setespagDef(espag);
    setespagmDef(espagm);
    setmullionClampDef(mullionClamp);
    setadjRollDef(adjRoll);
    setouchlockDef(touchLock);
    setrunnerBlockDef(runnerBlock);
    setfrictionStayDef(frictionStay);

  };

  useEffect(() => {
    addDef();
  }, []);


  const data = {
    frame: {
      length: selectedFrameLength * 3.28084,
      weight: selectedFrameWeight,
      amount: selectedFramePrice,
      name: selectedFrameName,
      id: selectedFrameId
    },

    shutter: {
      length: selectedShutterLength * 3.28084,
      weight: selectedShutterWeight,
      amount: selectedShutterPrice,
      name: selectedShutterName,
      id: selectedShutterId,

    },

    mullion: {
      length: selectedMullionLength * 3.28084,
      weight: selectedMullionWeight,
      amount: selectedMullionPrice,
      name: selectedMullionName,
      id: selectedMullionId,
    },

    beeding: {
      length: selectedBeedingLength * 3.28084,
      weight: selectedBeedingWeight,
      amount: selectedBeedingPrice,
      name: selectedBeedingName,
      id: selectedBeedingId
    },

    cupler: {
      length: selectedCuplerLength * 3.28084,
      weight: selectedCuplerWeight,
      amount: selectedCuplerPrice,
      name: selectedCuplerName,
      id: selectedCuplerId
    },

    interlock: {
      length: selectedInterLockLength * 3.28084,
      weight: selectedInterLockWeight,
      amount: selectedInterLockPrice,
      name: selectedInterLockName,
      id: selectedInterLockId
    },

    panelCost: {
      length: selectedPanelLength * 3.28084,
      weight: selectedPanelWeight,
      amount: selectedPanelPrice,
      name: selectedPanelName,
      id: selectedPanelId
    },


    frameGasket: {
      length: '1',
      weight: '1',
      amount: ProfilegasketCost || 0
    },
    shutterGasket: {
      length: '1',
      weight: '1',
      amount: ShuttergasketCost || 0
    },

    beedingGasket: {
      length: '1',
      weight: '1',
      amount: BeedinggasketCost || 0
    },

    steelFrame: steelFramCost,
    steelShutter: steelShutterCost,
    steelMullion: steelMullionCost,
    wastage: wastageCost,
    mplCost: lockCost,
    hingsCost: hingesCost,
    screwsCost: screwtCost,
    marketingCost: marketingCost,
    transportCost: transportCost,
    labourFcost: labourFCost,
    labourScost: labourSCost,
    glassCost: glassCost,
    marginCost: marginCost,
    handleCost: handleCost,
    boardCost: boardCost,
    grillCost: grillCost,
    aluTrack: alTrackCost,
    groRoll: gRollCost,
    mesRoll: meshRollCost,
    wStrip: wStripCost,
    tLock: handleCost,
    bArrest: bArrestorCost,
    jStop: jStopperCost,
    dArrest: dArrestorCost,
    meshCost: meshCost,
    espag: espagCost,
    frictionStay: frictionStayCost,
    espagm: espagmCost,
    mullionClamp: mullionClampCost,
    touchLock: touchlockCost,
    adjRoll: adjRollCost,



  }


  const Frame = () => {
    if (measure === 'ft') {
      return (2 * (Number(boxWidth) + Number(boxHeight))).toFixed(2);
    } else {
      return (2 * ((boxWidth / 304.8) + (boxHeight / 304.8))).toFixed(2);
    }
  };

  const Shutter = () => {
    if (measure === 'ft') {
      return (((((boxHeight - topnewHeights) * shutterCount) * 2) + ((boxWidth / numSecondInnerBoxes) * shutterCount) * 2) * numFrames).toFixed(2);
    } else {
      return ((((((boxHeight / 304.8) - (topnewHeights / 304.8)) * shutterCount) * 2) + (((boxWidth / 304.8) / numSecondInnerBoxes) * shutterCount) * 2) * numFrames).toFixed(2);
    }
  };

  const Panel = () => {
    if (measure === 'ft') {

      if (split === 'on') {
        let panelSizeTop = 0;
        let panelSizeBottom = 0;
        shutterHeight && shutterHeight.map((item, index) => {
          if (item.top === 'panel') {
            panelSizeTop += (Number(item.height) / (150 * 0.00328084)) * Number(newWidths[index]);
          }
          if (item.bottom === 'panel') {
            panelSizeBottom += (Number(Number(boxHeight) - Number(item.height)) / (150 * 0.00328084)) * Number(newWidths[index]);
          }
        })

        return Number(panelSizeTop + panelSizeBottom).toFixed(2);

      } else {
        if (panelType === 1) {
          return ((Number(boxHeight) / (150 * 0.00328084)) * Number(boxWidth)).toFixed(2);
        } else {
          return 0;
        }
      }
    } else {
      if (split === 'on') {
        let panelSizeTop = 0;
        let panelSizeBottom = 0;
        shutterHeight && shutterHeight.map((item, index) => {
          if (item.top === 'panel') {
            panelSizeTop += Number(item.height) * Number(newWidths[index]);
          }
          if (item.bottom === 'panel') {
            panelSizeBottom += Number((Number(boxHeight) / 304.8) - Number(item.height)) * Number(newWidths[index]);
          }
        })

        return Number(panelSizeTop + panelSizeBottom).toFixed(2);

      } else {
        if (panelType === 1) {
          return (((Number(boxHeight) / 304.8) / (150 * 0.00328084)) * (Number(boxWidth) / 304.8)).toFixed(2);
        } else {
          return 0;
        }
      }
    }

  };

  const glass = () => {
    if (split === 'on') {
      let glassSizeTop = 0;
      let glassSizeBottom = 0;
      shutterHeight && shutterHeight.map((item, index) => {
        if (item.top === 'glass') {
          glassSizeTop += parseFloat(item.height) * parseFloat(newWidths[index]);
        }
        if (item.bottom === 'glass') {
          glassSizeBottom += parseFloat(parseFloat(boxHeight) - parseFloat(item.height)) * parseFloat(newWidths[index]);
        }
      })

      return parseFloat(glassSizeTop + glassSizeBottom).toFixed(2);

    } else {
      if (panelType === 3) {
        return (parseFloat(boxHeight) * parseFloat(boxWidth)).toFixed(2);
      } else {
        return 0;
      }
    }
  };

  const boards = () => {
    if (split === 'on') {
      let boardSizeTop = 0;
      let boardSizeBottom = 0;
      shutterHeight && shutterHeight.map((item, index) => {
        if (item.top === 'board') {
          boardSizeTop += parseFloat(item.height) * parseFloat(newWidths[index]);
        }
        if (item.bottom === 'board') {
          boardSizeBottom += parseFloat(parseFloat(boxHeight) - parseFloat(item.height)) * parseFloat(newWidths[index]);
        }
      })

      return parseFloat(boardSizeTop + boardSizeBottom).toFixed(2);

    } else {
      if (panelType === 2) {
        return (parseFloat(boxHeight) * parseFloat(boxWidth)).toFixed(2);
      } else {
        return 0;
      }
    }
  };

  const Mullion = () => {
    if (measure === 'ft') {
      return ((((boxHeight - topnewHeights - bottomnewHeights) * (numSecondInnerBoxes - 1)) + (topnewHeights * boxWidth) + (topnewHeights * (topFixedNum - 1)) + (bottomnewHeights * boxWidth) + (bottomnewHeights * (bottomFixedNum - 1))) + (split === 'on' ? parseFloat(boxWidth) : 0)).toFixed(2);
    } else {
      return (((((boxHeight / 304.8) - topnewHeights - bottomnewHeights) * (numSecondInnerBoxes - 1)) + (topnewHeights * (boxWidth / 304.8)) + (topnewHeights * (topFixedNum - 1)) + (bottomnewHeights * (boxWidth / 304.8)) + (bottomnewHeights * (bottomFixedNum - 1))) + (split === 'on' ? parseFloat(boxWidth) : 0)).toFixed(2);
    }
  };

  const Beeding = () => {
    if (measure === 'ft') {
      if (topnewHeights === 0) {
        return (((Number(boxHeight) * numSecondInnerBoxes * 2) + ((Number(boxWidth) * 2 / numFrames))) * numFrames).toFixed(2);
      } else {
        return (((topnewHeights * 2) + ((Number(boxHeight) - topnewHeights) * (numSecondInnerBoxes * 2)) + ((Number(boxWidth) * 4 / numFrames))) * numFrames).toFixed(2);
      }
    } else {
      if (topnewHeights === 0) {
        return ((((Number(boxHeight) / 304.8) * numSecondInnerBoxes * 2) + (((Number(boxWidth) / 304.8) * 2 / numFrames))) * numFrames).toFixed(2);
      } else {
        return ((((topnewHeights / 304.8) * 2) + (((Number(boxHeight) / 304.8) - (topnewHeights / 304.8)) * (numSecondInnerBoxes * 2)) + (((Number(boxWidth) / 304.8) * 4 / numFrames))) * numFrames).toFixed(2);
      }
    }
  };



  const beedingGasket = () => {
    if (measure === 'ft') {
      if (topnewHeights === 0) {
        return ((((Number(boxHeight) * numSecondInnerBoxes * 2) + ((Number(boxWidth) * 2 / numFrames))) * numFrames) * 1).toFixed(2);
      } else {
        return ((((topnewHeights * 2) + ((Number(boxHeight) - topnewHeights) * (numSecondInnerBoxes * 2)) + ((Number(boxWidth) * 4 / numFrames))) * numFrames) * 1).toFixed(2);
      }
    } else {
      if (topnewHeights === 0) {
        return (((((Number(boxHeight) / 304.8) * numSecondInnerBoxes * 2) + (((Number(boxWidth) / 304.8) * 2 / numFrames))) * numFrames) * 1).toFixed(2);
      } else {
        return (((((topnewHeights / 304.8) * 2) + (((Number(boxHeight) / 304.8) - (topnewHeights / 304.8)) * (numSecondInnerBoxes * 2)) + (((Number(boxWidth) / 304.8) * 4 / numFrames))) * numFrames) * 1).toFixed(2);
      }
    }
  };

  const shutterGasket = () => {
    if (measure === 'ft') {
      return ((((((Number(boxHeight) - topnewHeights) * shutterCount) * 2 * numFrames)) + ((Number(boxWidth) / numSecondInnerBoxes) * shutterCount) * 2) * 1).toFixed(2);
    } else {
      return (((((((Number(boxHeight) / 304.8) - (topnewHeights / 304.8)) * shutterCount) * 2 * numFrames)) + (((Number(boxWidth) / 304.8) / numSecondInnerBoxes) * shutterCount) * 2) * 1).toFixed(2);
    }
  };

  const frameGasket = () => {
    if (measure === 'ft') {
      return ((Number(boxHeight) * 2) + (Number(boxWidth) * 2)).toFixed(2);
    } else {
      return (((Number(boxHeight) / 304.8) * 2) + ((Number(boxWidth) / 304.8) * 2)).toFixed(2);
    }
  };



  const steelFrame = () => {
    if (measure === 'ft') {
      return ((Number(boxHeight) * 2) + (Number(boxWidth) * 2)).toFixed(2);
    } else {
      return (((Number(boxHeight) / 304.8) * 2) + ((Number(boxWidth) / 304.8) * 2)).toFixed(2);
    }
  };

  const steelMullion = () => {
    if (measure === 'ft') {
      if (topnewHeights === 0) {
        return 0;
      } else {
        return ((Number(boxWidth) * 1) + (split === 'on' ? parseFloat(boxWidth) : 0)).toFixed(2);
      }
    } else {
      if (topnewHeights === 0) {
        return 0;
      } else {
        return ((Number(boxWidth) / 304.8) + (split === 'on' ? parseFloat(boxWidth) : 0)).toFixed(2);
      }
    }
  };

  const steelShutter = () => {
    if (measure === 'ft') {
      return (((((Number(boxHeight) - topnewHeights) * shutterCount) * 2) + ((Number(boxWidth) / numSecondInnerBoxes) * shutterCount) * 2) * numFrames).toFixed(2);
    } else {
      return ((((((Number(boxHeight) / 304.8) - (topnewHeights / 304.8)) * shutterCount) * 2) + (((Number(boxWidth) / 304.8) / numSecondInnerBoxes) * shutterCount) * 2) * numFrames).toFixed(2);
    }
  };

  const cuplerJoint = () => {
    if (measure === 'ft') {
      return (Number(boxHeight)) * (numFrames - 1).toFixed(2);
    } else {
      return ((Number(boxHeight) / 304.8)) * (numFrames - 1).toFixed(2);
    }
  };

  const interLock = () => {
    if (measure === 'ft') {
      return (((Number(boxHeight)) * (numSecondInnerBoxes - 1)) * 2).toFixed(2);
    } else {
      return ((((Number(boxHeight) / 304.8)) * (numSecondInnerBoxes - 1)) * 2).toFixed(2);
    }
  };

  let frameArea = null;
  if (measure === 'ft') {
    frameArea = boxHeight * boxWidth;
  } else {
    frameArea = (boxHeight / 304.8) * (boxWidth / 304.8);
  }

  const weatherStrip = () => {
    if (measure === 'ft') {
      if (mesh === 'yes') {
        return ((parseFloat(boxWidth) * 5) + ((parseFloat(boxHeight) * 4) * shutterCount)).toFixed(2);
      } else {
        return ((parseFloat(boxWidth) * 4) + ((parseFloat(boxHeight) * 3) * shutterCount)).toFixed(2);
      }

    } else {
      if (mesh === 'yes') {
        return ((((parseFloat(boxWidth) / 304.8) * 5)) + (((parseFloat(boxHeight) / 304.8) * 4))).toFixed(2);
      } else {
        return ((((parseFloat(boxWidth) / 304.8) * 4)) + (((parseFloat(boxHeight) / 304.8) * 3))).toFixed(2);
      }
    }
  };


  const gillArea = () => {
    if (grill === 'yes') {

      const indices = boxNames
        .map((name, index) => name === 'Shutter' ? index : -1)
        .filter(index => index !== -1);

      const widths = indices.map(index => Number(newWidths[index]));
      const totalWidth = Number(widths.reduce((sum, width) => sum + width, 0));// Adjust the number of decimal places as needed

      const grillsArea = (Number(boxHeight) - topnewHeights - bottomnewHeights) * Number(totalWidth);
      return grillsArea;
    } else {
      return 0;
    }
  };

  const values = {
    frame: {
      rqm: (parseFloat(Frame()) * 0.3048).toFixed(2) || 0,
      rpm: data.frame.amount || 0,
      amount: (parseFloat(Frame()) * 0.3048) * parseFloat(data.frame.amount) || 0
    },
    shutter: {
      rqm: (parseFloat(Shutter()) * 0.3048).toFixed(2) || 0,
      rpm: data.shutter.amount || 0,
      amount: ((parseFloat(Shutter()) * 0.3048) * data.shutter.amount).toFixed(2) || 0
    },
    mullion: {
      rqm: (parseFloat(Mullion()) * 0.3048).toFixed(2) || 0,
      rpm: data.mullion.amount || 0,
      amount: (parseFloat(Mullion()) * 0.3048) * data.mullion.amount || 0,
    },
    beeding: {
      rqm: (parseFloat(Beeding()) * 0.3048).toFixed(2) || 0,
      rpm: data.beeding.amount || 0,
      amount: (parseFloat(Beeding()) * 0.3048) * data.beeding.amount || 0,
    },
    shutterGasket: {
      rqm: (parseFloat(shutterGasket()) * 0.3048).toFixed(2) || 0,
      rpm: data.shutterGasket.amount || 0,
      amount: (parseFloat(shutterGasket()) * 0.3048) * data.shutterGasket.amount || 0,
    },
    frameGasket: {
      rqm: (parseFloat(frameGasket()) * 0.3048).toFixed(2) || 0,
      rpm: data.frameGasket.amount || 0,
      amount: (parseFloat(frameGasket()) * 0.3048) * data.frameGasket.amount || 0,
    },
    beedingGasket: {
      rqm: (parseFloat(beedingGasket()) * 0.3048).toFixed(2) || 0,
      rpm: data.beedingGasket.amount || 0,
      amount: (parseFloat(beedingGasket()) * 0.3048) * data.beedingGasket.amount || 0,
    },
    interLock: {
      rqm: (parseFloat(interLock()) * 0.3048).toFixed(2) || 0,
      rpm: data.interlock.amount || 0,
      amount: (parseFloat(interLock()) * 0.3048) * data.interlock.amount || 0,
    },
    panel: {
      rqm: (parseFloat(Panel()) * 0.3048).toFixed(2) || 0,
      rpm: data.panelCost.amount || 0,
      amount: (parseFloat(Panel()) * 0.3048) * data.panelCost.amount || 0,
    },
    cupler: {
      rqm: (parseFloat(cuplerJoint()) * 0.3048).toFixed(2) || 0,
      rpm: data.cupler.amount || 0,
      amount: (parseFloat(cuplerJoint()) * 0.3048) * data.cupler.amount || 0,
    },
    steelFrame: {
      qty: steelFrame(),
      price: data.steelFrame,
      amount: steelFrame() * data.steelFrame || 0,
    },
    steelShutter: {
      qty: steelShutter(),
      price: data.steelShutter,
      amount: steelShutter() * data.steelShutter || 0,
    },
    steelMullion: {
      qty: steelMullion(),
      price: data.steelMullion,
      amount: steelMullion() * data.steelMullion || 0,
    },
    mpl: {
      qty: shutterCount * numFrames,
      price: data.mplCost,
      amount: shutterCount * numFrames * data.mplCost || 0
    },
    touchlock: {
      qty: shutterCount * numFrames,
      price: data.touchLock,
      amount: shutterCount * numFrames * data.touchLock || 0
    },
    espag: {
      qty: shutterCount * numFrames,
      price: data.espag,
      amount: shutterCount * numFrames * data.espag || 0
    },
    frictionstay: {
      qty: shutterCount * numFrames,
      price: data.frictionStay,
      amount: shutterCount * numFrames * data.frictionStay || 0
    },

    runnerblock: {
      qty: shutterCount * numFrames,
      price: data.runnerBlock,
      amount: shutterCount * numFrames * data.runnerBlock || 0
    },
    espagm: {
      qty: shutterCount * numFrames,
      price: data.espagm,
      amount: shutterCount * numFrames * data.espagm || 0
    },
    mullionclamp: {
      qty: shutterCount * numFrames,
      price: data.mullionClamp,
      amount: shutterCount * numFrames * data.mullionClamp || 0
    },
    adjroll: {
      qty: shutterCount * numFrames,
      price: data.adjRoll,
      amount: shutterCount * numFrames * data.adjRoll || 0
    },
    hings: {
      qty: shutterCount * numFrames,
      price: data.hingsCost,
      amount: shutterCount * numFrames * data.hingsCost || 0
    },
    screws: {
      qty: Math.ceil(frameArea + ((measure === 'ft' ? parseFloat(boxHeight) : (parseFloat(boxHeight) / 304.8) + (measure === 'ft' ? parseFloat(boxWidth) : (parseFloat(boxWidth) / 304.8)) * numSecondInnerBoxes * numFrames)) * 1.6),
      price: data.screwsCost,
      amount: Math.ceil(frameArea + ((measure === 'ft' ? parseFloat(boxHeight) : (parseFloat(boxHeight) / 304.8) + (measure === 'ft' ? parseFloat(boxWidth) : (parseFloat(boxWidth) / 304.8)) * numSecondInnerBoxes * numFrames)) * 1.6) * data.screwsCost || 0
    },
    marketing: {
      qty: frameArea,
      price: data.marketingCost,
      amount: frameArea * data.marketingCost || 0
    },
    transport: {
      qty: distance,
      price: data.transportCost,
      amount: distance * data.transportCost || 0
    },
    labourF: {
      qty: frameArea,
      price: data.labourFcost,
      amount: frameArea * data.labourFcost || 0
    },
    labourS: {
      qty: frameArea,
      price: data.labourScost,
      amount: frameArea * data.labourScost || 0
    },
    glass: {
      qty: glass(),
      price: data.glassCost,
      amount: glass() * data.glassCost || 0
    },
    board: {
      qty: boards() || 0,
      price: data.boardCost,
      amount: boards() * data.boardCost || 0
    },
    margin: {
      qty: frameArea,
      price: data.marginCost,
      amount: frameArea * data.marginCost || 0
    },
    alTrack: {
      qty: (measure === 'ft' ? boxWidth : (boxWidth / 304.8) * shutterCount),
      price: data.aluTrack,
      amount: (measure === 'ft' ? boxWidth : (boxWidth / 304.8) * shutterCount) * data.aluTrack || 0
    },
    bArrester: {
      qty: shutterCount,
      price: data.bArrest,
      amount: shutterCount * data.bArrest || 0
    },
    jStopper: {
      qty: shutterCount,
      price: data.jStop,
      amount: shutterCount * data.jStop || 0
    },
    dArrester: {
      qty: shutterCount,
      price: data.dArrest,
      amount: shutterCount * data.dArrest || 0
    },
    gRoller: {
      qty: shutterCount * 2,
      price: data.groRoll,
      amount: shutterCount * 2 * data.groRoll || 0
    },
    mRoller: {
      qty: shutterCount,
      price: data.mesRoll,
      amount: shutterCount * data.mesRoll || 0
    },
    touchLock: {
      qty: shutterCount,
      price: data.tLock,
      amount: shutterCount * data.tLock || 0
    },

    grill: {
      qty: grill == 'yes' ? gillArea() : 0,
      price: data.grillCost,
      amount: grill == 'yes' ? gillArea() * data.grillCost : 0
    },
    wStrip: {
      qty: weatherStrip(),
      price: data.wStrip,
      amount: weatherStrip() * data.wStrip || 0,
    }
  };

  const frameTotal = parseFloat(
    parseFloat(values.panel.amount) +
    parseFloat(values.interLock.amount) +
    parseFloat(values.frame.amount) +
    parseFloat(values.cupler.amount) +
    parseFloat(values.shutter.amount) +
    parseFloat(values.beeding.amount) +
    parseFloat(values.shutterGasket.amount) +
    parseFloat(values.frameGasket.amount) +
    parseFloat(values.beedingGasket.amount) +
    parseFloat(values.mullion.amount)
  );

  const wastage = frameTotal * data.wastage / 100;
  const frps = (frameTotal + wastage) / frameArea;

  const hardTotal = parseFloat(
    parseFloat(values.grill.amount) +
    parseFloat(values.screws.amount) +
    parseFloat(values.steelFrame.amount) +
    parseFloat(values.steelShutter.amount) +
    parseFloat(values.alTrack.amount) +
    parseFloat(values.bArrester.amount) +
    parseFloat(values.jStopper.amount) +
    parseFloat(values.dArrester.amount) +
    parseFloat(values.touchlock.amount) +
    parseFloat(values.gRoller.amount) +
    parseFloat(values.steelMullion.amount) +
    parseFloat(values.mullionclamp.amount) +
    parseFloat(values.frictionstay.amount) +
    parseFloat(values.espag.amount) +
    parseFloat(values.espagm.amount) +
    parseFloat(values.wStrip.amount) +
    parseFloat(values.adjroll.amount)
  );

  const hrps = hardTotal / frameArea;

  const prodTotal = parseFloat(
    parseFloat(values.marketing.amount) +
    parseFloat(values.transport.amount) +
    parseFloat(values.labourF.amount) +
    parseFloat(values.labourS.amount) +
    parseFloat(values.glass.amount) +
    parseFloat(values.board.amount)
  );

  const prps = prodTotal / frameArea;

  const marginTotal = values.margin.amount;
  const mrps = marginTotal / frameArea;

  const grandTotal = frameTotal + hardTotal + prodTotal + wastage + marginTotal;
  const grandAps = grandTotal / frameArea;


  const calculatedBoxWidth = measure === 'ft' ? boxWidth : (boxWidth / 304.8);
  const calculatedBoxHeight = measure === 'ft' ? boxHeight : (boxHeight / 304.8);
  const calculatednewWidths = newWidths.map(width =>
    measure === 'ft' ? parseFloat(width) : parseFloat(width) / 304.8
  );
  const calculatedtopnewHeights = measure === 'ft' ? topnewHeights : (topnewHeights / 304.8);




  const coreData = {
    userId, quoteId, rowId: rowid, data: { distance, shutterHeight, split, item, measure, selectedProfile, qty, series, data, boxWidth: calculatedBoxWidth, boxHeight: calculatedBoxHeight, panelType, numTopBoxes, numFrames, numSecondInnerBoxes, topnewHeights: calculatedtopnewHeights, newWidths: calculatednewWidths, boxColors, boxNames, boxHandle, deviceWidth, screen, boxTop, shutterCount, fixedCount, mesh, grill, frameArea, values, frameTotal, wastage, hardTotal, prodTotal, marginTotal, grandTotal, topFixedNum, topFixedWidth, numBottomBoxes, bottomnewHeights, boxBottom, bottomFixedNum, bottomFixedWidth }
  };




  //console.log(coreData);

  const selectedProfiles = () => {
    let messages = [];
    let allValid = true;


    if ((selectedFrameId === null || selectedFrameId === '') || (selectedFrameSeries === null || selectedFrameSeries === '')) {
      messages.push("Track Outer Frame Profile Not Selected");
      allValid = false;
    }


    if ((selectedShutterId === null || selectedShutterId === '') || (selectedShutterSeries === null || selectedShutterSeries === '')) {
      messages.push("Shutter Frame Profile Not Selected");
      allValid = false;
    }

    if (Mullion() < 0) {
      if ((selectedMullionId === null || selectedMullionId === '') || (selectedMullionSeries === null || selectedMullionSeries === '')) {
        messages.push("Mullion Profile Not Selected");
        allValid = false;
      }
    }

     if ((selectedMullionId === null || selectedMullionId === '') || (selectedMullionSeries === null || selectedMullionSeries === '')) {
        messages.push("Mullion Profile Not Selected");
        allValid = false;
      }


    if ((selectedBeedingId === null || selectedBeedingId === '') || (selectedBeedingSeries === null || selectedBeedingSeries === '')) {
      messages.push("Beeding Profile Not Selected");
      allValid = false;
    }


    if (panelType === 1) {
      if ((selectedPanelId === null || selectedPanelId === '') || (selectedPanelSeries === null || selectedPanelSeries === '')) {
        messages.push("Panel Profile Not Selected");
        allValid = false;
      }
    }

    if (numFrames > 1) {
      if ((selectedCuplerId === null || selectedCuplerId === '') || (selectedCuplerSeries === null || selectedCuplerSeries === '')) {
        messages.push("Cupler Joint/Square Joint Profile Not Selected");
        allValid = false;
      }
    }

    if ((selectedInterLockId === null || selectedInterLockId === '') || (selectedInterLockSeries === null || selectedInterLockSeries === '')) {
      messages.push("InterLock Profile Not Selected");
      allValid = false;
    }





    if (messages.length > 0) {
      const formattedMessages = messages.map(message => `<li>${message}</li>`).join(' ');
      const update = `${formattedMessages}`;
      const replace = update.replace(/, /g, "\t\n");
      setModalContent(replace);
      openModal3();
    } else if (allValid) {
      checkSend();
    }
  };

  const checkSend = () => {

    if (cusBoxWidth !== boxWidth) {
      openModal2('Shutter size is not fit for the Door. would you like to continue at your own risk?');
    } else {
      const hasInvalidValue = newWidths.some(value => value < 1 || value > 2.5);

      if (hasInvalidValue) {
        openModal1();
      } else {
        // if (boxHeight > 6) {
        //   openModal2('The size of the window is more than 6 feet and it should be created in the Casement Door. would you like to continue at your own risk?');
        // } else {
        sendDataToUrl();
        // }
      }
    }
  };

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


  const profileDatas = { width: calculatedBoxWidth, height: calculatedBoxHeight, series, profileId: selectedProfile, mesh, shutterCount, type: item }


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

    const hasInvalidValue = newWidths.some(value => value < 1 || value > 3);

    if (hasInvalidValue) {
      openModal();
    } else {
      handleContinueCalc();
      setCalcBtn(false);
      setIsProfile(true);
      addDef();
    }
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
      if (response.data.status === 'success') {
        if (response.data.data[0].beeding !== '') {
          setSelectedBeedingSeries(response.data.data[0].beedingSeries);
          setSelectedBeedingId(response.data.data[0].beeding);
        }
        if (response.data.data[0].frame !== '') {
          setSelectedFrameSeries(response.data.data[0].frameSeries);
          setSelectedFrameId(response.data.data[0].frame);
        }
        if (response.data.data[0].interlock !== '') {
          setSelectedInterLockSeries(response.data.data[0].interSeries);
          setSelectedInterLockId(response.data.data[0].interlock);
        }
        if (response.data.data[0].mesh !== '') {
          //setSelectedMeshSeries(response.data.data[0].meshSeries);
          //setSelectedMeshId(response.data.data[0].mesh);
        }
        if (response.data.data[0].mullion !== null) {
          setSelectedMullionSeries(response.data.data[0].mullionSeries);
          setSelectedMullionId(response.data.data[0].mullion);
        }
        if (response.data.data[0].panel !== '') {

          setSelectedPanelSeries(response.data.data[0].panelSeries);
          setSelectedPanelId(response.data.data[0].panel);

        }
        if (response.data.data[0].shutter !== '') {
          setSelectedShutterSeries(response.data.data[0].shutterSeries);
          setSelectedShutterId(response.data.data[0].shutter);
        }
        if (response.data.data[0].cupler !== '') {
          setSelectedCuplerSeries(response.data.data[0].cuplerSeries);
          setSelectedCuplerId(response.data.data[0].cupler);
        }

      }
    } catch (error) {
      console.error('Error sending data:', error);
    }
    closeModal();
  };



  useEffect(() => {
    const updatedHandles = [];

    if (numSecondInnerBoxes === 1) {
      updatedHandles[0] = 'left';
    } else {
      for (let i = 0; i < numSecondInnerBoxes; i++) {
        updatedHandles[i] = (i === numSecondInnerBoxes - 1) ? 'right' : 'left';
      }
    }

    setBoxHandle(updatedHandles);
  }, [numSecondInnerBoxes]);


  //   useEffect(() => {
  //   const updatedHandles = [];

  //   if (boxNames === 'Shutter') {
  //     if (numSecondInnerBoxes === 1) {
  //       updatedHandles[0] = 'left';
  //     } else {
  //       for (let i = 0; i < numSecondInnerBoxes; i++) {
  //         updatedHandles[i] = (i === numSecondInnerBoxes - 1) ? 'right' : 'left';
  //       }
  //     }
  //   }

  //   setBoxHandle(updatedHandles);
  // }, [numSecondInnerBoxes, boxNames]);


  // const boxes = Array.from({ length: (boxHeight - topnewHeights - bottomnewHeights) * 2 }).map((_, index) => (
  //   <div
  //     key={index}
  //     style={{
  //       float:'left',
  //       position: 'relative',
  //       width: '100%',
  //       height: '0.26vw',
  //       border: '1px solid #333',
  //       background: '#fff',
  //       marginTop: `calc((${boxHeight * screen / mCalc + 'vw'} - 25px) / ${calculatedBoxHeight * 2.6}) `,
  //     }}
  //   ></div> 
  // ));

   const boxes = Array.from({
  length:
    measure === "ft"
      ? (boxHeight - topnewHeights - bottomnewHeights) * 1.95
      : ((boxHeight / 304.8) - (topnewHeights / 304.8) - (bottomnewHeights / 304.8)) * 1.95,
}).map((_, index) => (
  <div
    key={index}
    style={{
      float: "left",
      position: "relative",
      width: "100%",
      height: "0.26vw",
      border: "1px solid #333",
      background: "#fff",
      marginTop: `calc((${(boxHeight * screen) / mCalc}vw - 25px) / ${
        calculatedBoxHeight * 2.6
      })`,
    }}
  ></div>
));
  // Outer Bottom Line
  const getOuterBottom = (height, screen, mCalc) => {
    const fullHeightVW = (height) * screen / mCalc;
    return `calc(${fullHeightVW}vw - 14px)`;
  };
  // inner Bottom Line
  const getInnerBottom = (height, screen, mCalc) => {
    const fullHeightVW = (height) * screen / mCalc;
    return `calc(${fullHeightVW}vw - ${boxTop === 'on' ? '31px' : '27px'})`;
  };

  const getInnerLeftBottom = (height, screen, mCalc) => {
    const fullHeightVW = (height) * screen / mCalc;
    return `calc(${fullHeightVW}vw - ${boxBottom === 'on' ? '33px' : '15px'})`;
  };

  //console.log(newWidths);
  // console.log(numSecondInnerBoxes);
  return (
    <div>


      <div class="modal fade custom-modal" id="onloadModal" tabindex="-1" aria-labelledby="onloadModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content" align="center">
            <div class="mt-3 mb-3">
              <h5>Warning</h5>
            </div>
            <div class="mb-3">
              <h6 class="mb-3">Shutter size is not standard, would you like to continue at your own risk?</h6>
              <button class="btn btn-success w-25 me-4" type="button" onClick={closeModal}>Cancel</button> <button class="btn btn-danger w-25" type="button" onClick={continueCalc}>Continue</button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade custom-modal" id="onloadModal1" tabindex="-1" aria-labelledby="onloadModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content" align="center">
            <div class="mt-3 mb-3">
              <h5>Warning</h5>
            </div>
            <div class="mb-3">
              <h6 class="mb-3">Shutter size is not standard, would you like to continue at your own risk?</h6>
              <button class="btn btn-success w-25 me-4" type="button" onClick={closeModal1}>Cancel</button> <button class="btn btn-danger w-25" type="button" onClick={continueSend}>Continue</button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade custom-modal" id="onloadModal2" tabindex="-1" aria-labelledby="onloadModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content" align="center">
            <div class="mt-3 mb-3">
              <h5>Warning</h5>
            </div>
            <div class="mb-3">
              <h6 class="mb-3" id="resMsg"></h6>
              <button class="btn btn-success w-25 me-4" type="button" onClick={closeModal2}>Cancel</button> <button class="btn btn-danger w-25" type="button" onClick={continueSendData}>Continue</button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade custom-modal" id="onloadModal3" tabindex="-1" aria-labelledby="onloadModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content" align="center">
            <div class="mt-3 mb-3">
              <h5>Warning</h5>
            </div>
            <div class="mb-3">
              <h6 class="mb-3"><ContentEditable html={`${modalContent}`} /></h6>
              <button class="btn btn-success w-25 me-4" type="button" onClick={closeModal3}>Cancel</button>
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
                        <button class="btn btn-danger" type="button" onClick={() => handleWidth('minus')}>-</button>
                        <input type="number" step="0.01" class="form-control" value={boxWidth} onChange={handleWidthChange} />
                        <button class="btn btn-success" type="button" onClick={() => handleWidth('plus')}>+</button>
                      </div>
                    </div>

                    <div class="col-6">
                      <p>Height</p>
                      <div class="input-group mb-2">
                        <button class="btn btn-danger" type="button" onClick={() => handleHeight('minus')}>-</button>
                        <input type="number" step="0.01" class="form-control" value={boxHeight} onChange={handleHeightChange} />
                        <button class="btn btn-success" type="button" onClick={() => handleHeight('plus')}>+</button>
                      </div>
                    </div>

                  </div>

                  <div class="mt-3 row align-items-center">
                    <div class="col-6">
                      <p>Outer Frame</p>
                      <div class="input-group mb-2">
                        <button class="btn btn-danger" type="button" onClick={() => addFrame('minus')}>-</button>
                        <input type="number" step="0.01" class="form-control" value={numFrames} />
                        <button class="btn btn-success" type="button" onClick={() => addFrame('plus')}>+</button>
                      </div>
                    </div>

                    <div class="col-6">
                      <p>No of Doors</p>
                      <div class="input-group mb-2">
                        <button class="btn btn-danger" type="button" onClick={() => handleQty('minus')}>-</button>
                        <input type="number" step="0.01" class="form-control" value={qty} onChange={handleQtyChange} />
                        <button class="btn btn-success" type="button" onClick={() => handleQty('plus')}>+</button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {boxHeight === 0 || boxWidth === 0 ? (
                <></>
              ) : (
                <>
                  <div class="card">
                    <div class="card-body">

                      <div class="mt-3 row align-items-center">

                        <div class="col-6">
                          <p>Fixed</p>
                          <button className="btn btn-warning w-100" onClick={() => addMullion('Fixed')}>Add Fixed</button>
                        </div>
                        <div class="col-6">
                          <p>Shutter</p>
                          <button className="btn btn-primary w-100" onClick={() => addWindow('Shutter')}>Add Shutter</button>
                        </div>
                        <div class="col-12 mt-3">
                          <p>Shutter Split</p>
                          <button className={`btn ${split === 'off' ? 'btn-secondary' : 'btn-success'} w-100`} onClick={changeSplit}>Split Shutter ( H )</button>
                        </div>

                        {boxTop === 'off' ? (
                          <>
                            <div class="col-12 mt-3">
                              <p>Top Fixed</p>
                              <button className="btn btn-primary w-100" type="button" onClick={() => toggleboxTop()}>Add Top Fixed</button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div class="col-6 mt-3">
                              <p>Top Fixed Height</p>
                              <div className="input-group mb-2">
                                <button className="btn btn-danger" type="button" onClick={() => handleTop('minus')}>-</button>
                                <input type="text" className="form-control" value={topnewHeights} onChange={handleTopHeight} />
                                <button className="btn btn-success" type="button" onClick={() => handleTop('plus')}>+</button>
                              </div>
                            </div>

                            <div class="col-6 mt-3">
                              <p>Top partitions </p>
                              <div class="input-group mb-2">
                                <button class="btn btn-danger" type="button" onClick={() => handleTopPart('minus')}>-</button>
                                <input type="number" step="0.01" class="form-control" value={topFixedNum} onChange={handleTopPartChange} />
                                <button class="btn btn-success" type="button" onClick={() => handleTopPart('plus')}>+</button>
                              </div>
                            </div>

                          </>
                        )}

                        <div class="col-12 mt-3">
                          <p>Grill</p>
                          <button className={grill === 'no' ? "btn btn-success w-100" : "btn btn-info w-100"} onClick={() => changeGrill(grill)}>Grill - {grill}</button>
                        </div>

                        <div class="col-12 mt-3">
                          <p>Panel Type</p>
                          <div class="input-group mb-2">
                            <button className={panelType === 1 ? 'btn  w-33 btn-success' : ' btn w-33 btn-secondary'} type="button" onClick={() => handleButtonClick(1)}>Panel</button>
                            <button className={panelType === 2 ? 'btn  w-33 btn-success' : ' btn w-33 btn-secondary'} type="button" onClick={() => handleButtonClick(2)}>Board</button>
                            <button className={panelType === 3 ? 'btn  w-33 btn-success' : ' btn w-33 btn-secondary'} type="button" onClick={() => handleButtonClick(3)}>Glass</button>
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
                </>
              )}
            </div>





            <div class="col-md-12 col-xxl-8 col-xl-8" >
              <div class="card" style={{ background: '#fff' }}>
                <div class="card-body mb-5">

                  <div>

                    <div style={{ float: 'left', width: boxWidth * screen / mCalc + 'vw', height: boxHeight * screen / mCalc + 'vw', border: '1px solid #333', position: 'relative' }}>


                      {[...Array(numFrames)].map((_, index) => (
                        <div style={{ float: 'left', margin: '5px', border: '1px solid #333', width: `calc(${boxWidth * screen / mCalc / numFrames + 'vw'} - 12px)`, height: `calc(${boxHeight * screen / mCalc + 'vw'} - 12px)`, position: 'relative' }}>
                          {/* outer corner lines start */}
                          {/* <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-6.5px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-6px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'right', marginTop: getOuterBottom(boxHeight, screen, mCalc), marginRight: '-4px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop: getOuterBottom(boxHeight, screen, mCalc), marginLeft: '-3px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div> */}
                          {/* outer corner lines end */}
                          {/* outer corner lines start */}
                          <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-6.5px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-6px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'right', marginTop: getOuterBottom(boxHeight, screen, mCalc), marginRight: '-4px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop: getOuterBottom(boxHeight, screen, mCalc), marginLeft: '-3px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>
                          {/* outer corner lines end */}

                          {boxTop === 'on' && (

                            [...Array(numTopBoxes)].map((_, index) => (
                              <div style={{ display: 'flex', width: `calc(${boxWidth * screen / mCalc / numFrames + 'vw'} - 23px)`, height: `calc(${(topnewHeights * screen / mCalc)}vw )`, margin: '5px', position: 'relative' }}>
                                {[...Array(topFixedNum)].map((_, index) => (
                                  <div style={{ flex: '1', background: 'lightgreen', width: `calc(${topFixedWidth[index] * screen / mCalc / numFrames + 'vw'} - 18px)`, height: `calc(${(topnewHeights * screen / mCalc)}vw )`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px', position: 'relative' }}>
                                    {/* outer corner lines start for bottom sash*/}
                                    <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-7px', marginRight: '-4px', transform: 'rotate(45deg)', borderRight: (topFixedWidth.length === 0 && boxTop === 'on') || index === topFixedWidth.length - 1 ? '1px solid #333' : 'none' }}></div>
                                    <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-7px', marginLeft: '-4px', transform: 'rotate(-45deg)', borderLeft: index === 0 ? '1px solid #333' : 'none' }}></div>

                                    {/* fixed plus  */}
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>

                                  </div>
                                ))}
                              </div>
                            ))
                          )}

                          <div style={{ display: 'flex' }}>
                            {[...Array(numSecondInnerBoxes)].map((_, index) => (

                              <div key={index} style={{ background: split === 'on' ? 'transparent' : panelType === 1 ? 'lightgray' : panelType === 2 ? 'lightyellow' : 'lightblue', border: split === 'on' ? '0px' : '1px solid #333', height: `calc(${(boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc}vw - ${boxTop === 'on' ? '30px' : '25px'})`, width: `calc(${newWidths[index] * screen / mCalc}vw)`, marginTop: boxTop === 'on' ? '0px' : '5px', marginRight: index === numSecondInnerBoxes - 1 ? '5px' : '2.5px', marginLeft: index === 0 ? '5px' : '2.5px', position: 'relative' }}>

                                {/* {boxNames[index] === 'Shutter' && grill === 'yes' && <div style={{position: 'absolute', width: `calc(${(boxWidth/(shutterCount + fixedCount))*screen}vw - ${(shutterCount + fixedCount) === 1 ? '24px' : (shutterCount + fixedCount) === 2 ? '14px' : (shutterCount + fixedCount) === 3 ? '11px' : '10px'})`}}> {boxes} </div>} */}
                                {/* {boxNames[index] === 'Shutter' && grill === 'yes' && <div style={{ position: 'absolute', width: '100%' }}>{boxes(boxHeight - topnewHeights - bottomnewHeights)}</div>} */}
                                {boxNames[index] === 'Shutter' && grill === 'yes' && <div style={{ position: 'absolute', width: '100%' }}> {boxes} </div>}
                                <div className="expanding-arrow-line" style={{
                                  position: 'absolute',
                                  float: 'left',
                                  width: `calc(${newWidths[index] * screen / mCalc}vw - 15px)`,
                                  bottom: '-10px',
                                  top: `calc(${boxHeight * screen / mCalc}vw )`,
                                }}

                                >
                                  <div className="arrow-left"></div>
                                  <div className="line" align="center">
                                    <div style={{ marginTop: '-7px', background: 'white', maxWidth: '60px', textAlign: 'center' }}><p>{parseFloat(newWidths[index]).toFixed(2)}</p></div>
                                  </div>
                                  <div className="arrow-right"></div>
                                </div>

                                {/* Inner corner lines start */}
                                {/* bottom left inner second box */}
                                <div style={{ height: '9px', width: '1px', float: 'left', marginTop: `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen) / mCalc}vw - ${boxTop === 'on' ? '31px' : '27px'})`, marginLeft: '-2px', transform: 'rotate(45deg)', borderLeft: index === 0 ? '1px solid black' : 'none' }}></div>
                                {/* top left inner(sub ) box */}
                                <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-7px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: index === 0 ? '1px solid black' : 'none' }}></div>
                                {/* center right inner box(sub) */}
                                <div style={{ height: '9px', width: '1px', float: 'right', marginTop: '-7px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                                 {/* center left inner box(sub) */}
                                <div style={{ height: '9px', width: '1px', float: 'left', marginTop: getInnerBottom(boxHeight - topnewHeights - bottomnewHeights, screen, mCalc), marginLeft: '-4px', transform: 'rotate(-45deg)', borderLeft: index === 0 ? 'transparent' : '1px solid black' }}></div>
                                {/* right coner second inner box */}
                                <div style={{ height: '9px', width: '1px', float: 'right', marginTop: getInnerBottom(boxHeight - topnewHeights - bottomnewHeights, screen, mCalc), marginRight: '-2px', transform: 'rotate(-45deg)', borderLeft: index === numSecondInnerBoxes - 1 ? '1px solid black' : 'transparent' }}></div>
                                
                                <div style={{ height: '7px', width: '1px', float: 'left', right: '0px', marginTop: '-6px', marginRight: '-1px', background: index === 0 ? 'transparent' : 'black' }}></div>
                                {/* Inner corner lines ends */}
                                {/* <div style={{
                                  position:'absolute',
                                  height:'7px',
                                  width: '1px',
                                  float: 'right',
                                  right: '0px',
                                  marginTop: '-6px',
                                  marginRight: '-1px',
                                  background: index === numSecondInnerBoxes -1 ? 'black' : 'transparent',
                                  }}></div> */}

                                <div style={{
                                  height: '8px',
                                  width: '1px',
                                  float: 'left',
                                  right: '0px',
                                  marginTop: `calc(${(boxHeight - topnewHeights - bottomnewHeights) * screen/ mCalc}vw - ${boxTop === 'on' ? '31px' : '26px'} )`,
                                  marginRight: '-1px',
                                  background: (index === 0) ? 'transparent' : 'black',
                                }}></div>


                                {boxNames[index] === 'Shutter' ? (

                                  boxHandle[index] === 'left' ? (
                                    <>

                                      {/* Show left handle only for first box */}
                                      {index === 0 && (
                                        <img
                                          src={Handle}
                                          style={{
                                            float: 'left',
                                            marginTop: `calc(${(((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc) / 2)}vw - 15px`,
                                            marginLeft: '-6px',
                                            width: screen === 3 ? '5px' : '4px',
                                          }}
                                          onClick={() => changeHandle(index)}
                                          alt="Left Handle"
                                        />
                                      )}

                                      {/* Always show right arrow from this box */}
                                      <div
                                        className="expanding-arrow-line"
                                        style={{
                                          paddingLeft: `calc(${(newWidths[index] / 8 * screen / mCalc)}vw)`,
                                          position: 'relative',
                                          float: 'left',
                                          width: `calc(${(newWidths[index] / 2 * screen / mCalc)}vw)`,
                                          top: `calc(${(boxHeight - topnewHeights - bottomnewHeights) / 2 * screen / mCalc}vw)`,
                                        }}
                                      >
                                        <div className="line" align="center">
                                          <div style={{ marginTop: '-7px', color: '#333' }}></div>
                                        </div>
                                        <div className="arrow-right"></div>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      {/* If it's the last box, show right handle */}
                                      {index === numSecondInnerBoxes - 1 && (
                                        <img
                                          src={Handle}
                                          style={{
                                            float: 'right',
                                            marginTop: `calc(${(((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc) / 2)}vw - 15px`,
                                            marginRight: '-6px',
                                            width: screen === 3 ? '5px' : '4px',
                                          }}
                                          onClick={() => changeHandle(index)}
                                          alt="Right Handle"
                                        />
                                      )}

                                      {/* Always show left arrow pointing to this box */}
                                      <div
                                        className="expanding-arrow-line"
                                        style={{
                                          paddingRight: `calc(${(newWidths[index] / 8 * screen / mCalc)}vw)`,
                                          position: 'relative',
                                          float: 'right',
                                          width: `calc(${(newWidths[index] / 2 * screen / mCalc)}vw)`,
                                          top: `calc(${(boxHeight - topnewHeights - bottomnewHeights) / 2 * screen / mCalc}vw)`,
                                        }}
                                      >
                                        <div className="line" align="center">
                                          <div style={{ marginTop: '-7px', color: '#333' }}></div>
                                        </div>
                                        <div className="arrow-left"></div>
                                      </div>
                                    </>
                                  )
                                ) : (
                                  // Default view for boxes not marked as 'Shutter'
                                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '50px', fontWeight: '100', cursor: 'pointer', color: '#000', zIndex: 1, }}> + </div>
                                )}
                                {mesh === 'yes' && boxNames[index] === 'Shutter' && boxHandle[index] === 'left' && (
                                  <img src={meshimg} style={{ width: screen === 3 ? '40px' : '20px', float: 'left', marginLeft: screen === 3 ? boxHandle[index] === 'left' ? '-15px' : '0px' : boxHandle[index] === 'left' ? '-10px' : 'px', marginTop: screen === 3 ? `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc)}vw - ${boxTop === 'on' ? '72px' : '67px'} )` : `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc)}vw - 45px)` }} />
                                )}

                                {mesh === 'yes' && boxNames[index] === 'Shutter' && boxHandle[index] === 'right' && (
                                  <img src={meshimg} style={{ width: screen === 3 ? '40px' : '20px', float: 'left', marginLeft: screen === 3 ? boxHandle[index] === 'right' ? '-1px' : '0px' : boxHandle[index] === 'right' ? '0px' : 'px', marginTop: screen === 3 ? `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc)}vw - ${boxTop === 'on' ? '72px' : '67px'} )` : `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc)}vw - 45px)` }} />
                                )}


                                {/* 
                                {split === 'on' && 
                                  <>
                                    <div style={{background: shutterHeight[index].top === 'glass' ? 'lightblue' : shutterHeight[index].top === 'panel' ? 'lightgrey' : 'lightyellow', width: `calc(${newWidths[index] * screen / mCalc}vw - 16 px)`, height: `calc(${(shutterHeight[index].height ) * screen / mCalc}vw - 15px`, border: '1px solid #333' }}></div>
                                    <div style={{background: shutterHeight[index].bottom === 'glass' ? 'lightblue' : shutterHeight[index].bottom === 'panel' ? 'lightgrey' : 'lightyellow', width: `calc(${newWidths[index] * screen / mCalc}vw - 16 px)`, height: `calc(${(boxHeight - shutterHeight[index].height-topnewHeights) * screen / mCalc}vw - ${boxTop==='on'?'19px':'15px'})`, border: '1px solid #333', marginTop: '5px' }}></div>
                                  </>
                                } */}


                                {split === 'on' &&
                                  <>
                                    <div style={{ background: shutterHeight[index].top === 'glass' ? 'lightblue' : shutterHeight[index].top === 'panel' ? 'lightgrey' : 'lightyellow', width: `calc(${newWidths[index] * screen / mCalc}vw - 16 px)`, height: `calc(${(shutterHeight[index].height) * screen / mCalc}vw - 15px`, border: '1px solid #333' }}></div>
                                    <div style={{ background: shutterHeight[index].bottom === 'glass' ? 'lightblue' : shutterHeight[index].bottom === 'panel' ? 'lightgrey' : 'lightyellow', width: `calc(${newWidths[index] * screen / mCalc}vw - 16 px)`, height: `calc(${(boxHeight - shutterHeight[index].height - topnewHeights) * screen / mCalc}vw - ${boxTop === 'on' ? '19px' : '15px'})`, border: '1px solid #333', marginTop: '5px' }}></div>
                                  </>
                                }

                              </div>

                            ))}

                          </div>


                          {numSecondInnerBoxes === 0 ? (
                            <div className="expanding-arrow-line" style={{ float: 'left', marginLeft: '-5px', width: ((boxWidth / numFrames) * screen / mCalc) + 'vw', top: boxHeight * screen / mCalc + 'vw', }} >
                              <div className="arrow-left"></div>
                              <div className="line" align="center">
                                <div style={{ marginTop: '-8px', background: 'white', maxWidth: '60px', textAlign: 'center' }}><p>{parseFloat(boxWidth / numFrames).toFixed(2)}</p></div>
                              </div>
                              <div className="arrow-right"></div>
                            </div>
                          ) : (
                            <div className="expanding-arrow-line" style={{ float: 'left', marginLeft: '-5px', width: ((boxWidth / numFrames) * screen / mCalc) + 'vw', bottom: '-10px', top: '40px', }} >
                              <div className="arrow-left"></div>
                              <div className="line" align="center">
                                <div style={{ marginTop: '-8px', background: 'white', maxWidth: '60px', textAlign: 'center' }}><p>{parseFloat(boxWidth / numFrames).toFixed(2)}</p></div>
                              </div>
                              <div className="arrow-right"></div>
                            </div>
                          )}


                        </div>
                      ))}
                    </div>

                    <div style={{ width: '45px', float: 'left', paddingLeft: '15px', textAlign: 'left' }}>
                      {boxTop === 'on' &&
                        <>
                          <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${topnewHeights * screen / mCalc}vw + 10px)`, top: '0', position: 'relative' }}>
                            <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                            <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                              <div style={{ marginLeft: '-10px', marginTop: topnewHeights * (screen / mCalc / 2) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{Number(topnewHeights).toFixed(2)}</p></div>
                            </div>
                            <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                          </div>

                          <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc}vw - ${boxTop === 'on' ? '30px' : '15px'})`, top: `calc(${topnewHeights * screen / mCalc}vw + ${boxTop === 'on' ? '15px' : '0px'})`, position: 'relative' }}>
                            <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                            <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                              <div style={{ marginLeft: '-10px', marginTop: (boxHeight - topnewHeights - bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{Number(boxHeight - topnewHeights - bottomnewHeights).toFixed(2)}</p></div>
                            </div>
                            <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                          </div>
                        </>
                      }

                      {boxBottom === 'on' &&
                        <>
                          <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc}vw - ${boxTop === 'on' ? '30px' : '15px'})`, top: `calc(${topnewHeights * screen / mCalc}vw + ${boxTop === 'on' ? '15px' : '0px'})`, position: 'relative' }}>
                            <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                            <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                              <div style={{ marginLeft: '-10px', marginTop: (boxHeight - topnewHeights - bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{Number(boxHeight - topnewHeights - bottomnewHeights).toFixed(2)}</p></div>
                            </div>
                            <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                          </div>

                          <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(bottomnewHeights) * screen / mCalc}vw + 5px)`, top: `calc(${(boxHeight - bottomnewHeights) * screen / mCalc}vw - ${boxTop === 'on' ? '10px' : '10px'})`, position: 'relative' }}>
                            <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                            <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                              <div style={{ marginLeft: '-10px', marginTop: (bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{Number(bottomnewHeights).toFixed(2)}</p></div>
                            </div>
                            <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                          </div>
                        </>
                      }

                    </div>

                    <div style={{ width: '30px', float: 'left', paddingLeft: boxBottom === 'on' || boxTop === 'on' ? '0px' : '15px', textAlign: 'left' }}>
                      <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${boxHeight * screen / mCalc}vw)`, top: '0', position: 'relative' }}>
                        <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                          <div style={{ marginLeft: '-10px', marginTop: boxHeight * (screen / mCalc / 2) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{Number(boxHeight).toFixed(2)}</p></div>
                        </div>
                        <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
              {shutterCount === 0 ? (
                <></>
              ) : (
                <div class="card">
                  <div class="card-body">
                    <div class="row">

                      <>
                        {[...Array(numSecondInnerBoxes)].map((_, index) => (
                          split === 'on' ?
                            <div class="col-md-3 col-xxl-3 col-xl-3" key={index}>
                              <label>Sash {index + 1}</label><br />
                              <small>Shutter Width</small>
                              <input type="number" step="0.01" className="form-control mb-2" value={newWidths[index]} onChange={(e) => handleInputChange(index, e.target.value)} />
                              <small>Top Fill Height</small>
                              <input type="number" step="0.01" className="form-control mb-2" value={shutterHeight[index].height} onChange={(event) => changeShutterHeight(event, index)} />
                              <small>Top Fill</small>
                              <select className="form-control mb-2" value={shutterHeight[index].top} onChange={(e) => shutterTypeTop(e, index)}>
                                <option value="glass">Glass</option>
                                <option value="panel">Panel</option>
                                <option value="board">Board</option>
                              </select>
                              <small>Bottom Fill</small>
                              <select className="form-control mb-2" value={shutterHeight[index].bottom} onChange={(e) => shutterTypeBottom(e, index)}>
                                <option value="glass">Glass</option>
                                <option value="panel">Panel</option>
                                <option value="board">Board</option>
                              </select>
                              <div className="input-group mb-4">
                                {boxNames[index] === 'Shutter' && (
                                  <button className="btn btn-outline-secondary w-50 mb-2" type="button" onClick={() => changeHandle(index)}><i class={boxHandle[index] === 'left' ? 'fas fa-angle-left' : 'fas fa-angle-right'}></i> </button>
                                )}
                                <button className="btn btn-danger w-50 mb-2" type="button" onClick={() => deleteInnerBox(index)}><i class="fas fa-trash" style={{ fontSize: '12px' }}></i></button>
                              </div>
                            </div>
                            :
                            <div class="col-md-4 col-xxl-4 col-xl-4" key={index}>
                              <div className="input-group mb-4">
                                <input type="number" step="0.01" className="form-control" value={newWidths[index]} onChange={(e) => handleInputChange(index, e.target.value)} />
                                {boxNames[index] === 'Shutter' && (
                                  <button className="btn btn-outline-secondary" type="button" onClick={() => changeHandle(index)}><i class={boxHandle[index] === 'left' ? 'fas fa-angle-left' : 'fas fa-angle-right'}></i> </button>
                                )}
                                <button className="btn btn-danger" type="button" onClick={() => deleteInnerBox(index)}><i class="fas fa-trash" style={{ fontSize: '12px' }}></i></button>
                              </div>
                            </div>
                        ))}

                      </>

                    </div>
                  </div>
                </div>
              )}
            </div>


            <div class="col-md-12 col-xxl-12 col-xl-12">
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
                        <td>Track Outer Frame</td>
                        <td class="container-line">
                          <select class="mb-3 form-select-select item-line w-25" value={selectedFrameSeries || ''} onChange={handleFrameSeriesChange}>
                            <option value="">Select Series</option>
                            {profileData && profileData.map(seriesId => (
                              <option key={seriesId.series} value={seriesId.series}>{seriesId.series}</option>
                            ))}
                          </select>
                          <select class="mb-3 form-select-select item-line w-75" value={selectedFrameId || ''} onChange={handleFrameIdChange}>
                            {selectedFrameSeries ? (<option value="">Select ID</option>) : (<option value="">Select Series First</option>)}
                            {selectedFrameSeries && seriesDataFrame?.items && seriesDataFrame.items.map((item) => (
                              <option key={item.id} value={item.id}>{item.id + ' - ' + item.name}</option>
                            ))}
                          </select>
                        </td>
                        <td>{numeral(Frame() * qty).format('0,0.00')}</td>
                        <td>{numeral(values.frame.rqm * qty).format('0,0.00')}</td>
                        <td>{numeral(values.frame.rpm * qty).format('0,0.00')}</td>
                        <td>{numeral(values.frame.amount * qty).format('0,0.00')}</td>
                      </tr>
                      <tr>
                        <td>Shutter Frame</td>
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
                        <td>{numeral(Shutter() * qty).format('0,0.00')}</td>
                        <td>{numeral(values.shutter.rqm * qty).format('0,0.00')}</td>
                        <td>{numeral(values.shutter.rpm * qty).format('0,0.00')}</td>
                        <td>{numeral(values.shutter.amount * qty).format('0,0.00')}</td>
                      </tr>

                      <tr>
                        <td>Mullion</td>
                        <td class="container-line">
                          <select class="mb-3 form-select-select item-line w-25" value={selectedMullionSeries || ''} onChange={handleMullionChange}>
                            <option value="">Select Series</option>
                            {profileData && profileData.map(seriesId => (
                              <option key={seriesId.series} value={seriesId.series}>{seriesId.series}</option>
                            ))}
                          </select>
                          <select class="mb-3 form-select-select item-line w-75" value={selectedMullionId || ''} onChange={handleMullionIdChange}>
                            {setSelectedMullionSeries ? (<option value="">Select ID</option>) : (<option value="">Select Series </option>)}
                            {seriesDataMullion && seriesDataMullion.items.map((item) => (
                              <option key={item.id} value={item.id}>{item.id + ' - ' + item.name}</option>
                            ))}
                          </select>
                        </td>
                        <td>{numeral(Mullion() * qty).format('0,0.00')}</td>
                        <td>{numeral(values.mullion.rqm * qty).format('0,0.00')}</td>
                        <td>{numeral(values.mullion.rpm * qty).format('0,0.00')}</td>
                        <td>{numeral(values.mullion.amount * qty).format('0,0.00')}</td>
                      </tr>

                      <tr>
                        <td>InterLock</td>
                        <td class="container-line">
                          <select class="mb-3 form-select-select item-line w-25" value={selectedInterLockSeries || ''} onChange={handleInterLockSeriesChange}>
                            <option value="">Select Series</option>
                            {profileData && profileData.map(seriesId => (
                              <option key={seriesId.series} value={seriesId.series}>{seriesId.series}</option>
                            ))}
                          </select>
                          <select class="mb-3 form-select-select item-line w-75" value={selectedInterLockId || ''} onChange={handleInterLockIdChange}>
                            {selectedInterLockSeries ? (<option value="">Select ID</option>) : (<option value="">Select Series </option>)}
                            {seriesDataInterLock && seriesDataInterLock.items.map((item) => (
                              <option key={item.id} value={item.id}>{item.id + ' - ' + item.name}</option>
                            ))}
                          </select>
                        </td>
                        <td>{numeral(interLock() * qty).format('0,0.00')}</td>
                        <td>{numeral(values.interLock.rqm * qty).format('0,0.00')}</td>
                        <td>{numeral(values.interLock.rpm * qty).format('0,0.00')}</td>
                        <td>{numeral(values.interLock.amount * qty).format('0,0.00')}</td>
                      </tr>
                      <tr>
                        <td>Beeding</td>
                        <td class="container-line">
                          <select class="mb-3 form-select-select item-line w-25" value={selectedBeedingSeries || ''} onChange={handleBeedingSeriesChange}>
                            <option value="">Select Series</option>
                            {profileData && profileData.map(seriesId => (
                              <option key={seriesId.series} value={seriesId.series}>{seriesId.series}</option>
                            ))}
                          </select>
                          <select class="mb-3 form-select-select item-line w-75" value={selectedBeedingId || ''} onChange={handleBeedingIdChange}>
                            {selectedBeedingSeries ? (<option value="">Select ID</option>) : (<option value="">Select Series </option>)}
                            {seriesDataBeeding && seriesDataBeeding.items.map((item) => (
                              <option key={item.id} value={item.id}>{item.id + ' - ' + item.name}</option>
                            ))}
                          </select>
                        </td>
                        <td>{numeral(Beeding() * qty).format('0,0.00')}</td>
                        <td>{numeral(values.beeding.rqm * qty).format('0,0.00')}</td>
                        <td>{numeral(values.beeding.rpm * qty).format('0,0.00')}</td>
                        <td>{numeral(values.beeding.amount * qty).format('0,0.00')}</td>
                      </tr>
                      {panelType === 1 && (
                        <tr>
                          <td>Panel</td>
                          <td class="container-line">
                            <select class="mb-3 form-select-select item-line w-25" value={selectedPanelSeries || ''} onChange={handlePanelChange}>
                              <option value="">Select Series</option>
                              {profileData && profileData.map(seriesId => (
                                <option key={seriesId.series} value={seriesId.series}>{seriesId.series}</option>
                              ))}
                            </select>
                            <select class="mb-3 form-select-select item-line w-75" value={selectedPanelId || ''} onChange={handlePanelIdChange}>
                              {setSelectedPanelSeries ? (<option value="">Select ID</option>) : (<option value="">Select Series </option>)}
                              {seriesDataPanel && seriesDataPanel.items.map((item) => (
                                <option key={item.id} value={item.id}>{item.id + ' - ' + item.name}</option>
                              ))}
                            </select>
                          </td>
                          <td>{numeral(Panel() * qty).format('0,0.00')}</td>
                          <td>{numeral(values.panel.rqm * qty).format('0,0.00')}</td>
                          <td>{numeral(values.panel.rpm * qty).format('0,0.00')}</td>
                          <td>{numeral(values.panel.amount * qty).format('0,0.00')}</td>
                        </tr>
                      )}

                      {numFrames === 1 ? (<></>) : (
                        <tr>
                          <td>Cupler Joint/Square Joint </td>
                          <td class="container-line">
                            <select class="mb-3 form-select-select item-line w-25" value={selectedCuplerSeries || ''} onChange={handleCuplerSeriesChange}>
                              <option value="">Select Series</option>
                              {profileData && profileData.map(seriesId => (
                                <option key={seriesId.series} value={seriesId.series}>{seriesId.series}</option>
                              ))}
                            </select>
                            <select class="mb-3 form-select-select item-line w-75" value={selectedCuplerId || ''} onChange={handleCuplerIdChange}>
                              {selectedCuplerSeries ? (<option value="">Select ID</option>) : (<option value="">Select Series </option>)}
                              {seriesDataCupler && seriesDataCupler.items.map((item) => (
                                <option key={item.id} value={item.id}>{item.id + ' - ' + item.name}</option>
                              ))}
                            </select>
                          </td>
                          <td>{numeral(cuplerJoint() * qty).format('0,0.00')}</td>
                          <td>{numeral(values.cupler.rqm * qty).format('0,0.00')}</td>
                          <td>{numeral(values.cupler.rpm * qty).format('0,0.00')}</td>
                          <td>{numeral(values.cupler.amount * qty).format('0,0.00')}</td>
                        </tr>
                      )}
                      <tr>
                        <td>Frame Gasket</td>
                        <th >
                          <select class="form-select-select item-line w-75" value={ProfilegasketCost} onChange={ProfilegasketChange}>
                            <option value="" hidden>Select Model</option>
                            {ProfilegasketValues && Object.entries(ProfilegasketValues).map(([key, { label, value }]) => (
                              <option key={key} value={value}>{label + ' - ₹ ' + value}</option>
                            ))}
                          </select>
                        </th>
                        <td>{numeral(frameGasket() * qty).format('0,0.00')}</td>
                        <td>{numeral(values.frameGasket.rqm * qty).format('0,0.00')}</td>
                        <td>{numeral(values.frameGasket.rpm * qty).format('0,0.00')}</td>
                        <td>{numeral(values.frameGasket.amount * qty).format('0,0.00')}</td>
                      </tr>
                      <tr>
                        <td>Shutter Gasket</td>
                        <th >
                          <select class="form-select-select item-line w-75" value={ShuttergasketCost} onChange={ShuttergasketChange}>
                            <option value="" hidden>Select Model</option>
                            {ShuttergasketValues && Object.entries(ShuttergasketValues).map(([key, { label, value }]) => (
                              <option key={key} value={value}>{label + ' - ₹ ' + value}</option>
                            ))}
                          </select>
                        </th>
                        <td>{numeral(shutterGasket() * qty).format('0,0.00')}</td>
                        <td>{numeral(values.shutterGasket.rqm * qty).format('0,0.00')}</td>
                        <td>{numeral(values.shutterGasket.rpm * qty).format('0,0.00')}</td>
                        <td>{numeral(values.shutterGasket.amount * qty).format('0,0.00')}</td>
                      </tr>
                      <tr>
                        <td>Beeding Gasket</td>
                        <th >
                          <select class="form-select-select item-line w-75" value={BeedinggasketCost} onChange={BeedinggasketChange}>
                            <option value="" hidden>Select Model</option>
                            {BeedinggasketValues && Object.entries(BeedinggasketValues).map(([key, { label, value }]) => (
                              <option key={key} value={value}>{label + ' - ₹ ' + value}</option>
                            ))}
                          </select>
                        </th>
                        <td>{numeral(beedingGasket() * qty).format('0,0.00')}</td>
                        <td>{numeral(values.beedingGasket.rqm * qty).format('0,0.00')}</td>
                        <td>{numeral(values.beedingGasket.rpm * qty).format('0,0.00')}</td>
                        <td>{numeral(values.beedingGasket.amount * qty).format('0,0.00')}</td>
                      </tr>
                      <tr>
                        <td colspan="5">Total</td>
                        <td>{numeral(frameTotal * qty).format('0,0.00')}</td>
                      </tr>
                      <tr>
                        {/* <th colspan="6">Wastage ( {data.wastage}% )</th> */}
                        <th>Wastage( {data.wastage}% )</th>
                        <th >
                          <select class="form-select-select item-line w-75" value={wastageCost} onChange={wasteChange}>
                            <option value="" hidden>Select Model</option>
                            {wasteValues && Object.entries(wasteValues).map(([key, { label, value }]) => (
                              <option key={key} value={value}>{label + ' ' + value + '%'}</option>
                            ))}
                          </select>
                        </th>
                        <th colspan="3"></th>
                        <th >{numeral((frameTotal + wastage) * qty).format('0,0.00')}</th>
                      </tr>
                      <tr>
                        <th colspan="5">Profile Cost/Sqft</th>
                        <th>{numeral(frps * qty).format('0,0.00')}</th>
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
                        <th colspan='2'>Product Description</th>
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
                            {steelValues && Object.entries(steelValues).map(([key, { label, value }]) => (
                              <option key={key} value={value}>{label + ' - ₹ ' + value}</option>
                            ))}
                          </select>
                        </td>
                        <td>{numeral(values.steelFrame.qty * qty).format('0,0.00')}</td>
                        <td>{numeral(values.steelFrame.price * qty).format('0,0.00')}</td>
                        <td>{numeral(values.steelFrame.amount * qty).format('0,0.00')}</td>
                      </tr>
                      <tr>
                        <td>Steel Shutter</td>
                        <td>
                          <select class="form-select-select item-line w-75" value={steelShutterCost} onChange={steelShutteChange}>
                            <option value="" hidden>Select Model</option>
                            {steelShutterValues && Object.entries(steelShutterValues).map(([key, { label, value }]) => (
                              <option key={key} value={value}>{label + ' - ₹ ' + value}</option>
                            ))}
                          </select>
                        </td>
                        <td>{numeral(values.steelShutter.qty * qty).format('0,0.00')}</td>
                        <td>{numeral(values.steelShutter.price * qty).format('0,0.00')}</td>
                        <td>{numeral(values.steelShutter.amount * qty).format('0,0.00')}</td>
                      </tr>
                      <tr>
                        <td>Steel Mullion</td>
                        <td>
                          <select class="form-select-select item-line w-75" value={steelMullionCost} onChange={steelMullionChange}>
                            <option value="" hidden>Select Model</option>
                            {steelMullionValues && Object.entries(steelMullionValues).map(([key, { label, value }]) => (
                              <option key={key} value={value}>{label + ' - ₹ ' + value}</option>
                            ))}
                          </select>
                        </td>

                        <td>{numeral(values.steelMullion.qty * qty).format('0,0.00')}</td>
                        <td>{numeral(values.steelMullion.price * qty).format('0,0.00')}</td>
                        <td>{numeral(values.steelMullion.amount * qty).format('0,0.00')}</td>
                      </tr>

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
                      {grill === 'yes' && (
                        <tr>
                          <td>Grill</td>
                          <td>
                            <select class="form-select-select item-line w-75" value={grillCost} onChange={grillChange}>
                              <option value="" hidden>Select Model</option>
                              {grillValues && Object.entries(grillValues).map(([key, { label, value }]) => (
                                <option key={key} value={value}>{label + ' - ₹ ' + value}</option>
                              ))}
                            </select>
                          </td>
                          <td>{numeral(values.grill.qty * qty).format('0,0.00')}</td>
                          <td>{numeral(values.grill.price * qty).format('0,0.00')}</td>
                          <td>{numeral(values.grill.amount * qty).format('0,0.00')}</td>
                        </tr>
                      )}
                      <tr>
                        <td>Friction Stay</td>
                        <td>
                          <select class="form-select-select item-line w-75" value={frictionStayCost} onChange={frictionStayChange}>
                            <option value="">Select Model</option>
                            {frictionStayValues && Object.entries(frictionStayValues).map(([key, { label, value }]) => (
                              <option key={key} value={value}>{label + ' - ₹ ' + value}</option>
                            ))}
                          </select>
                        </td>
                        <td>{numeral(values.frictionstay.qty * qty).format('0,0.00')}</td>
                        <td>{numeral(values.frictionstay.price * qty).format('0,0.00')}</td>
                        <td>{numeral(values.frictionstay.amount * qty).format('0,0.00')}</td>
                      </tr>

                      <tr>
                        <td>Espag with SS Receiver</td>
                        <td>
                          <select class="form-select-select item-line w-75" value={espagCost} onChange={espagChange}>
                            <option value="">Select Model</option>
                            {espagValues && Object.entries(espagValues).map(([key, { label, value }]) => (
                              <option key={key} value={value}>{label + ' - ₹ ' + value}</option>
                            ))}
                          </select>
                        </td>
                        <td>{numeral(values.espag.qty * qty).format('0,0.00')}</td>
                        <td>{numeral(values.espag.price * qty).format('0,0.00')}</td>
                        <td>{numeral(values.espag.amount * qty).format('0,0.00')}</td>
                      </tr>
                      <tr>
                        <td>Espag with Multi Lock</td>
                        <td>
                          <select class="form-select-select item-line w-75" value={espagmCost} onChange={espagmChange}>
                            <option value="">Select Model</option>
                            {espagmValues && Object.entries(espagmValues).map(([key, { label, value }]) => (
                              <option key={key} value={value}>{label + ' - ₹ ' + value}</option>
                            ))}
                          </select>
                        </td>
                        <td>{numeral(values.espagm.qty * qty).format('0,0.00')}</td>
                        <td>{numeral(values.espagm.price * qty).format('0,0.00')}</td>
                        <td>{numeral(values.espagm.amount * qty).format('0,0.00')}</td>
                      </tr>
                      <tr>
                        <td>Adjust Roller</td>
                        <td>
                          <select class="form-select-select item-line w-75" value={adjRollCost} onChange={adjRollChange}>
                            <option value="">Select Model</option>
                            {adjRollValues && Object.entries(adjRollValues).map(([key, { label, value }]) => (
                              <option key={key} value={value}>{label + ' - ₹ ' + value}</option>
                            ))}
                          </select>
                        </td>
                        <td>{numeral(values.adjroll.qty * qty).format('0,0.00')}</td>
                        <td>{numeral(values.adjroll.price * qty).format('0,0.00')}</td>
                        <td>{numeral(values.adjroll.amount * qty).format('0,0.00')}</td>
                      </tr>
                      <tr>
                        <td>Aluminium Track</td>
                        <td>
                          <select class="form-select-select item-line w-75" value={alTrackCost} onChange={alTrackChange}>
                            <option value="" hidden>Select Model</option>
                            {alTrackValues && Object.entries(alTrackValues).map(([key, { label, value }]) => (
                              <option key={key} value={value}>{label + ' - ₹ ' + value}</option>
                            ))}
                          </select>
                        </td>
                        <td>{numeral(values.alTrack.qty * qty).format('0,0.00')}</td>
                        <td>{numeral(values.alTrack.price * qty).format('0,0.00')}</td>
                        <td>{numeral(values.alTrack.amount * qty).format('0,0.00')}</td>
                      </tr>
                      <tr>
                        <td>Bump Arrester</td>
                        <td>
                          <select class="form-select-select item-line w-75" value={bArrestorCost} onChange={bArrestorChange}>
                            <option value="" hidden>Select Model</option>
                            {bArrestorValues && Object.entries(bArrestorValues).map(([key, { label, value }]) => (
                              <option key={key} value={value}>{label + ' - ₹ ' + value}</option>
                            ))}
                          </select>
                        </td>
                        <td>{numeral(values.bArrester.qty * qty).format('0,0.00')}</td>
                        <td>{numeral(values.bArrester.price * qty).format('0,0.00')}</td>
                        <td>{numeral(values.bArrester.amount * qty).format('0,0.00')}</td>
                      </tr>
                      <tr>
                        <td>Jump Stopper</td>
                        <td>
                          <select class="form-select-select item-line w-75" value={jStopperCost} onChange={jStopperChange}>
                            <option value="" hidden>Select Model</option>
                            {jStopperValues && Object.entries(jStopperValues).map(([key, { label, value }]) => (
                              <option key={key} value={value}>{label + ' - ₹ ' + value}</option>
                            ))}
                          </select>
                        </td>
                        <td>{numeral(values.jStopper.qty * qty).format('0,0.00')}</td>
                        <td>{numeral(values.jStopper.price * qty).format('0,0.00')}</td>
                        <td>{numeral(values.jStopper.amount * qty).format('0,0.00')}</td>
                      </tr>
                      <tr>
                        <td>Dust Arrester</td>
                        <td>
                          <select class="form-select-select item-line w-75" value={dArrestorCost} onChange={dArrestorChange}>
                            <option value="" hidden>Select Model</option>
                            {dArrestorValues && Object.entries(dArrestorValues).map(([key, { label, value }]) => (
                              <option key={key} value={value}>{label + ' - ₹ ' + value}</option>
                            ))}
                          </select>
                        </td>
                        <td>{numeral(values.dArrester.qty * qty).format('0,0.00')}</td>
                        <td>{numeral(values.dArrester.price * qty).format('0,0.00')}</td>
                        <td>{numeral(values.dArrester.amount * qty).format('0,0.00')}</td>
                      </tr>
                      <tr>
                        <td>Grove Roller</td>
                        <td>
                          <select class="form-select-select item-line w-75" value={wStripCost} onChange={wStripChange}>
                            <option value="" hidden>Select Model</option>
                            {wStripValues && Object.entries(wStripValues).map(([key, { label, value }]) => (
                              <option key={key} value={value}>{label + ' - ₹ ' + value}</option>
                            ))}
                          </select>
                        </td>
                        <td>{numeral(values.gRoller.qty * qty).format('0,0.00')}</td>
                        <td>{numeral(values.gRoller.price * qty).format('0,0.00')}</td>
                        <td>{numeral(values.gRoller.amount * qty).format('0,0.00')}</td>
                      </tr>
                      <tr>
                        <td>Weather Strip</td>
                        <td>
                          <select class="form-select-select item-line w-75" value={wStripCost} onChange={wStripChange}>
                            <option value="" hidden>Select Model</option>
                            {wStripValues && Object.entries(wStripValues).map(([key, { label, value }]) => (
                              <option key={key} value={value}>{label + ' - ₹ ' + value}</option>
                            ))}
                          </select>
                        </td>
                        <td>{numeral(values.wStrip.qty * qty).format('0,0.00')}</td>
                        <td>{numeral(values.wStrip.price * qty).format('0,0.00')}</td>
                        <td>{numeral(values.wStrip.amount * qty).format('0,0.00')}</td>
                      </tr>
                      <tr>
                        <td>Touch Lock</td>
                        <td>
                          <select class="form-select-select item-line w-75" value={touchlockCost} onChange={touchLockChange}>
                            <option value="">Select Model</option>
                            {touchLockValues && Object.entries(touchLockValues).map(([key, { label, value }]) => (
                              <option key={key} value={value}>{label + ' - ₹ ' + value}</option>
                            ))}
                          </select>
                        </td>
                        <td>{numeral(values.touchlock.qty * qty).format('0,0.00')}</td>
                        <td>{numeral(values.touchlock.price * qty).format('0,0.00')}</td>
                        <td>{numeral(values.touchlock.amount * qty).format('0,0.00')}</td>
                      </tr>
                      <tr>
                        <td>Screws/Misc</td>
                        <td>
                          <select class="form-select-select item-line w-75" value={screwtCost} onChange={screwChange}>
                            <option value="" hidden>Select Model</option>
                            {screwValues && Object.entries(screwValues).map(([key, { label, value }]) => (
                              <option key={key} value={value}>{label + ' - ₹ ' + value}</option>
                            ))}
                          </select>
                        </td>
                        <td>{numeral(values.screws.qty * qty).format('0,0.00')}</td>
                        <td>{numeral(values.screws.price * qty).format('0,0.00')}</td>
                        <td>{numeral(values.screws.amount * qty).format('0,0.00')}</td>
                      </tr>
                      <tr>
                        <th colspan="4">Total</th>
                        <th>{numeral(hardTotal * qty).format('0,0.00')}</th>
                      </tr>
                      <tr>
                        <th colspan="4">Hardware Cost/Sqft</th>
                        <th>{numeral(hrps * qty).format('0,0.00')}</th>
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
                          <th colspan='2'>Product Description</th>
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
                              {margin && Object.entries(margin).map(([key, { label, value }]) => (
                                <option key={key} value={value}>{label + ' - ₹ ' + Number(value).toFixed(2) + '/sqft'}</option>
                              ))}
                            </select>
                          </td>
                          <td>{numeral(values.margin.qty * qty).format('0,0.00')}</td>
                          <td>{numeral(values.margin.price * qty).format('0,0.00')}</td>
                          <td>{numeral(values.margin.amount * qty).format('0,0.00')}</td>
                        </tr>
                        <tr>
                          <th colspan="4">Total</th>
                          <th>{numeral(marginTotal * qty).format('0,0.00')}</th>
                        </tr>
                        <tr>
                          <th colspan="4">Margin Cost/Sqft</th>
                          <th>{numeral(mrps * qty).format('0,0.00')}</th>
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
                          <th colspan='3'>Product Description</th>
                          <th width="10%">Req. Qty </th>
                          <th width="10%">Price</th>
                          <th width="10%">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colspan='2' >Markting OH <br /><small>(Site Visit, Messurement)</small></td>
                          <td>
                            <select class="form-select-select item-line w-75" value={marketingCost} onChange={marketingChange}>
                              <option value="" hidden>Select Marketing Coast</option>
                              {marketing && Object.entries(marketing).map(([key, { label, value }]) => (
                                <option key={key} value={value}>{label + ' - ₹ ' + Number(value).toFixed(2) + '/sqft'}</option>
                              ))}
                            </select>
                          </td>
                          <td>{numeral(values.marketing.qty * qty).format('0,0.00')}</td>
                          <td>{numeral(values.marketing.price * qty).format('0,0.00')}</td>
                          <td>{numeral(values.marketing.amount * qty).format('0,0.00')}</td>
                        </tr>
                        <tr>
                          <td>Transport <br /><small>(Meterial Transportation)</small></td>
                          <td>
                            <small>Distance in KM</small>
                            <input type='number' class='form-control' value={distance} onChange={(e) => setDistance(e.target.value)} />
                          </td>
                          <td>
                            <select class="form-select-select item-line w-75" value={transportCost} onChange={transportChange}>
                              <option value="" hidden>Select Margin Cost</option>
                              {transport && Object.entries(transport).map(([key, { label, value }]) => (
                                <option key={key} value={value}>{label + ' - ₹ ' + Number(value).toFixed(2) + '/sqft'}</option>
                              ))}
                            </select>
                          </td>
                          <td>{numeral(values.transport.qty * qty).format('0,0.00')}</td>
                          <td>{numeral(values.transport.price * qty).format('0,0.00')}</td>
                          <td>{numeral(values.transport.amount * qty).format('0,0.00')}</td>
                        </tr>
                        <tr>
                          <td colspan='2' >Labour (Factory)<br /><small>(Wages, Electricity, Rent)</small></td>
                          <td>
                            <select class="form-select-select item-line w-75" value={labourFCost} onChange={labourFChange}>
                              <option value="" hidden>Select Labour Coast</option>
                              {labourF && Object.entries(labourF).map(([key, { label, value }]) => (
                                <option key={key} value={value}>{label + ' - ₹ ' + Number(value).toFixed(2) + '/sqft'}</option>
                              ))}
                            </select>
                          </td>
                          <td>{numeral(values.labourF.qty * qty).format('0,0.00')}</td>
                          <td>{numeral(values.labourF.price * qty).format('0,0.00')}</td>
                          <td>{numeral(values.labourF.amount * qty).format('0,0.00')}</td>
                        </tr>
                        <tr>
                          <td colspan='2' >Labour (Site) <br /><small>(Sylicon, Errection Screws, Dummy Caps, Drain Hole Caps, Wages for Installation)</small></td>
                          <td>
                            <select class="form-select-select item-line w-75" value={labourSCost} onChange={labourSChange}>
                              <option value="" hidden>Select Labour Coast</option>
                              {labourS && Object.entries(labourS).map(([key, { label, value }]) => (
                                <option key={key} value={value}>{label + ' - ₹ ' + Number(value).toFixed(2) + '/sqft'}</option>
                              ))}
                            </select>
                          </td>
                          <td>{numeral(values.labourS.qty * qty).format('0,0.00')}</td>
                          <td>{numeral(values.labourS.price * qty).format('0,0.00')}</td>
                          <td>{numeral(values.labourS.amount * qty).format('0,0.00')}</td>
                        </tr>
                        {parseFloat(values.glass.qty) > 0 &&
                          <tr>
                            <td colspan='2' >Glass</td>
                            <td>
                              <select class="form-select-select item-line w-75" value={glassCost} onChange={glassChange}>
                                <option value="" hidden>Select Glass Cost</option>
                                {glasses && Object.entries(glasses).map(([key, { label, value }]) => (
                                  <option key={key} value={value}>{label + ' - ₹ ' + parseFloat(value).toFixed(2) + '/sqft'}</option>
                                ))}
                              </select>
                            </td>
                            <td>{numeral(values.glass.qty * qty).format('0,0.00')}</td>
                            <td>{numeral(values.glass.price * qty).format('0,0.00')}</td>
                            <td>{numeral(values.glass.amount * qty).format('0,0.00')}</td>
                          </tr>
                        }
                        {parseFloat(values.board.qty) > 0 &&
                          <tr>
                            <td colspan='2'>Board</td>
                            <td>
                              <select class="form-select-select item-line w-75" value={boardCost} onChange={boardChange}>
                                <option value="" hidden>Select Board Cost</option>
                                {board && Object.entries(board).map(([key, { label, value }]) => (
                                  <option key={key} value={value}>{label + ' - ₹ ' + parseFloat(value).toFixed(2) + '/sqft'}</option>
                                ))}
                              </select>
                            </td>
                            <td>{numeral(values.board.qty * qty).format('0,0.00')}</td>
                            <td>{numeral(values.board.price * qty).format('0,0.00')}</td>
                            <td>{numeral(values.board.amount * qty).format('0,0.00')}</td>
                          </tr>
                        }
                        <tr>
                          <th colspan="5">Total</th>
                          <th>{numeral(prodTotal * qty).format('0,0.00')}</th>
                        </tr>
                        <tr>
                          <th colspan="5">Production Cost/Sqft</th>
                          <th>{numeral(prps * qty).format('0,0.00')}</th>
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
                        <h6 class="mb-1">{frameArea * qty} sqft</h6>
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
                        <h6 class="mb-1">₹ {numeral(grandTotal * qty).format('0,0.00')}</h6>
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
                      <h6 class="mb-0">Update Quote</h6>
                    </div>
                  </div>
                  <div class="bg-body p-3 mt-2 rounded">
                    <div class="row align-items-center">
                      <div class="col-12">
                        <button class="btn btn-success w-100" onClick={selectedProfiles}>Update</button>
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
  );
}
export default Editquotees
