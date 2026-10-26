import { getMergedProfileDetails } from '../services/profileManager';
import React, { useEffect, useState } from "react";
import { ReactSession } from "react-client-session";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { saveQuoteItem } from '../services/dbService';
import Navbar from "./navbar";
import Header from "./header";
import left from "../images/handleLeft.png";
import right from "../images/handleRight.png";
import meshimg from "../images/mesh.png";
import Handle from "../images/slideHandle.png";
import ContentEditable from "react-contenteditable";

import numeral from "numeral";
import "./box.css";
ReactSession.setStoreType("localStorage");

function Editquotees() {
  const userId = ReactSession.get("upvcuserId");
  const userType = ReactSession.get("upvcuserType");
  const urlParams = new URLSearchParams(window.location.search);
  const quoteId = ReactSession.get("upvcquoteId");
  const quoteIds = urlParams.get("id");
  const Empid = ReactSession.get("upvcempid");
  const [modalContent, setModalContent] = useState(null);
  const navigate = useNavigate();
  const indexPath = "/";
  const selectPath = "/select";
  const item = "SlidingWindow";
  let users = "";
  if (userType === "3") {
    users = Empid;
  } else {
    users = userId;
  }
  const user = { userId: users };

  useEffect(() => {
    if (userId === 0) {
      navigate(indexPath);
    }
  }, [userId, navigate]);

  const [quoteData, setquoteData] = useState(null);
  const [state, setState] = useState(null);
  const [measure, setMeasure] = useState("");
  const [mCalc, setMcalc] = useState();
  const [boxWidth, setBoxWidth] = useState();
  const [boxHeight, setBoxHeight] = useState();

  const [numFirstInnerBoxes, setNumFirstInnerBoxes] = useState();
  const [numFrames, setNumFrames] = useState();
  const [numSecondInnerBoxes, setNumSecondInnerBoxes] = useState(0);
  const [newHeights, setNewInnerBoxHeight] = useState();
  const [newWidths, setNewInnerBoxWidth] = useState([]);
  const [boxColors, setBoxColors] = useState([]);
  const [boxNames, setBoxNames] = useState([]);
  const [boxHandle, setBoxHandle] = useState([]);
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  const [boxPosition, setBoxPosition] = useState("");
  const [shutterCount, setShuttercount] = useState();
  const [fixedCount, setFixedCount] = useState();
  const [mesh, setMesh] = useState("");
  const [profileDetails, setProfileData] = useState(() => getMergedProfileDetails(null));
  const [qty, setQty] = useState();
  const [costData, setCostData] = useState(true);
  const [customProfile, setCustomProfile] = useState();
  const arrayvalue = urlParams.get("arrayValues");
  const [calcBtn, setCalcBtn] = useState(false);
  const [isProfile, setIsProfile] = useState(false);
  const [series, setSeries] = useState(null);
  const [rowid, setRowid] = useState("");
  const [grill, setGrill] = useState("");
  const [cusBoxWidth, setCusWidth] = useState(0);
  const [topFixedWidth, settopFixedWidth] = useState([]);
  const [topFixedNum, settopFixedNum] = useState(0);
  const [bottomFixedWidth, setbottomFixedWidth] = useState([]);
  const [bottomFixedNum, setbottomFixedNum] = useState(0);
  const [screen, setScreen] = useState(deviceWidth > 700 ? 3 : 8);
  const [boxTop, setboxTop] = useState("off");
  const [boxBottom, setboxBottom] = useState("off");
  const [topnewHeights, setTopBoxHeight] = useState(0);
  const [bottomnewHeights, setBottomBoxHeight] = useState(0);
  const [numTopBoxes, setnumTopBoxes] = useState(0);
  const [numBottomBoxes, setnumBottomBoxes] = useState(0);
  const [distance, setDistance] = useState(0);

  const [topsash, setTopSash] = useState([{ type: "fixed" }]);
  const [bottomsash, setBottomSash] = useState([{ type: 'fixed' }]);



  useEffect(() => {
    const updateDeviceWidth = () => {
      setDeviceWidth(window.innerWidth);
      setScreen(window.innerWidth > 700 ? 3 : 8);
    };

    window.addEventListener("resize", updateDeviceWidth);

    return () => {
      window.removeEventListener("resize", updateDeviceWidth);
    };
  }, []);

  const fetchDatalog = async () => {
    try {
      const response = await axios.post(`https://upvcapi.sninfoserv.com/log/`, {
        userId,
        "edited coreData": coreData,
        profileDatas,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetcholdData = async () => {
    try {
      const response = await axios.post(
        "https://upvcapi.sninfoserv.com/all-quotes/",
        user
      );
      setquoteData(response.data);
      // console.log("String",response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetcholdData();
  }, []);

  const filteredQuotes =
    quoteData && quoteData.data.filter((quote) => quote.quoteId === quoteIds);

  useEffect(() => {
    if (filteredQuotes) {
      setState(filteredQuotes[0].quoteDetails[arrayvalue].quoteData);

      setRowid(filteredQuotes[0].quoteDetails[arrayvalue].rowId);
    }
  }, [filteredQuotes]);

  useEffect(() => {
    setTopSash(state?.topsash);
    setBottomSash(state?.bottomsash);
    const measure = state?.measure;
    const boxWidth = state?.boxWidths;
    const boxHeight = state?.boxHeights;
    const numFirstInnerBoxes = state?.numFirstInnerBoxes;
    const numFrames = state?.numFrames;
    const numSecondInnerBoxes = state?.numSecondInnerBoxes;
    const topFixedWidth = state?.topFixedWidth ?? [];
    const bottomFixedWidth = state?.bottomFixedWidth ?? [];
    const topnewHeights = state?.topnewHeights;
    const bottomnewHeights = state?.bottomnewHeights;
    const bottomFixedNum = state?.bottomFixedNum;
    const topFixedNum = state?.topFixedNum;
    const boxTop = state?.boxTop;
    const boxBottom = state?.boxBottom;
    const numTopBoxes = state?.numTopBoxes;
    const numBottomBoxes = state?.numBottomBoxes;

    if (measure === "mm") {
      const newHeights = state?.newHeights * 304.8;
      const newWidths = (state?.newWidthss ?? []).map((value) => value * 304.8);
      setNewInnerBoxWidth(newWidths);
      setNewInnerBoxHeight(newHeights);
    } else {
      const newHeights = state?.newHeights;
      const newWidths = state?.newWidthss ?? [];
      setNewInnerBoxWidth(newWidths);
      setNewInnerBoxHeight(newHeights);
    }

    const distance = state?.distance;
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
    const series = state?.series;
    const steelFramCost = state?.data.steelFrame;
    const steelShutterCost = state?.data.steelShutter;
    const steelMullionCost = state?.data.steelMullion;
    const grillCost = state?.data.grillCost;
    const wastageCost = state?.data.wastage;
    const screwtCost = state?.data.screwsCost;
    const ProfilegasketCost = state?.data.frameGasket.amount;
    const meshgasketCost = state?.data.meshGasket.amount;
    const ShuttergasketCost = state?.data.shutterGasket.amount;
    const MulliongasketCost = state?.data.mullionGasket.amount;
    const BeedinggasketCost = state?.data.beedingGasket.amount;
    const meshCost = state?.data.meshCost;
    const alTrackCost = state?.data.aluTrack;
    const gRollCost = state?.data.groRoll;
    const meshRollCost = state?.data.mesRoll;
    const wStripCost = state?.data.wStrip;
    const bArrestorCost = state?.data.bArrest;
    const dArrestorCost = state?.data.dArrest;
    const jStopperCost = state?.data.jStop;
    const steelmeshCost = state?.data.steelMesh;
    const touchlockcost = state?.data.touchLock;
    const securityClipCost = state?.data.securityClip;
    const espagCost = state?.data.espag;
    const mullionClampCost = state?.data.mullionClamp;
    const meshJACost = state?.data.meshJA;
    const frictionStayCost = state?.data.frictionStay;

    setMeasure(measure);
    if (measure === "mm") {
      setBoxWidth(parseFloat(boxWidth) * 304.8);
      setBoxHeight(parseFloat(boxHeight) * 304.8);
      setMcalc(304.8);
    } else {
      setBoxWidth(parseFloat(boxWidth));
      setBoxHeight(parseFloat(boxHeight));
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
    setGlassCost(glassCost);
    setMarginCost(marginCost);
    setMarketingCost(marketingCost);
    setlabourFCost(labourFCost);
    setlabourSCost(labourSCost);
    setTransportCost(transportCost);
    setSeries(series);
    setsteelFramDef(steelFramCost);
    setsteelShutterDef(steelShutterCost);
    setsteelMullionDef(steelMullionCost);
    setGrillDef(grillCost);
    setwastageCost(wastageCost);
    setscrewDef(screwtCost);
    setmeshDef(meshCost);
    setalTrackDef(alTrackCost);
    setgRollDef(gRollCost);
    setmeshRollDef(meshRollCost);
    setwStripDef(wStripCost);
    setbArrestorDef(bArrestorCost);
    setjStopperDef(jStopperCost);
    setdArrestorDef(dArrestorCost);
    setProfilegasketDef(ProfilegasketCost);
    setmeshgasketDef(meshgasketCost);
    setShuttergasketDef(ShuttergasketCost);
    setMulliongasketDef(MulliongasketCost);
    setBeedinggasketDef(BeedinggasketCost);
    setsteelmeshDef(steelmeshCost);

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
    setsecurityClipDef(securityClipCost);
    setespagDef(espagCost);
    setouchlockDef(touchlockcost);
    setmullionClampDef(mullionClampCost);
    setadjRollDef(adjRollCost);
    setmeshJADef(meshJACost);
    setfrictionStayDef(frictionStayCost);
    setDistance(distance);
  }, [state]);
  //console.log(customProfile);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://upvcapi.sninfoserv.com/new-profiles/",
          user
        );
        setProfileData(getMergedProfileDetails(response.data));
        //console.log("profile:", response.data);
      } catch (error) { setProfileData(getMergedProfileDetails(null)); }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchcostData = async () => {
      try {
        const response = await axios.post(
          "https://upvcapi.sninfoserv.com/costs/",
          user
        );
        setCostData(response.data.data);
        console.log("cost", response.data);
      } catch (error) { setProfileData(getMergedProfileDetails(null)); }
    };

    fetchcostData();
  }, []);

  const handleQty = (event) => {
    if (event === "plus") {
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

    setNewInnerBoxWidth(
      newWidthsFormatted.map((num) => parseFloat(num.toFixed(2)))
    );
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

  //console.log(parseFloat(boxHeight));

  const addWindow = (name) => {
    setNumSecondInnerBoxes((prevNum) => prevNum + 1);
    setBoxColors((prevColors) => [...prevColors, "lightblue"]);
    setNewInnerBoxWidth((prevWidths) => {
      const newWidth = boxWidth / (numSecondInnerBoxes + 1) / numFrames;
      const newWidths = newWidth.toFixed(2);
      const updatedWidths = prevWidths.map(() => newWidths);
      return [...updatedWidths, newWidths];
    });
    setBoxNames((prevNames) => [...prevNames, name]);
    const newBoxHandles = [...boxHandle, "left"];
    setBoxHandle(newBoxHandles);
  };

  function addMullion(name) {
    setNumSecondInnerBoxes((prevNum) => prevNum + 1);
    setBoxColors((prevColors) => [...prevColors, "lightgreen"]);
    setNewInnerBoxWidth((prevWidths) => {
      const newWidth = boxWidth / (numSecondInnerBoxes + 1) / numFrames;
      const newWidths = newWidth.toFixed(2);
      const updatedWidths = prevWidths.map(() => newWidths);
      return [...updatedWidths, newWidth];
    });
    setBoxNames((prevNames) => [...prevNames, name]);
    const newBoxHandles = [...boxHandle, "left"];
    setBoxHandle(newBoxHandles);
    setCusWidth(boxWidth);
  }

  /* function addMullion(name) {
     setNumSecondInnerBoxes((prevNum) => prevNum + 1);
     setBoxColors((prevColors) => [...prevColors, 'lightgreen']);
     setNewInnerBoxWidth((prevWidths) => {
       const newWidth = parseFloat(boxWidth) / (numSecondInnerBoxes + 1) / numFrames;
       const newWidths = newWidth.toFixed(2);
       const updatedWidths = prevWidths.map(() => newWidths);
       return [...updatedWidths, newWidth];
     });
     setBoxNames((prevNames) => [...prevNames, name]);
     const newBoxHandles = [...boxHandle, 'left'];
     setBoxHandle(newBoxHandles);
   }
   */

  const deleteInnerBox = (index) => {
    setNumSecondInnerBoxes((prevNum) => prevNum - 1);
    const newBalanceWidth =
      parseFloat(boxWidth) / (numSecondInnerBoxes - 1) / numFrames;
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

  //     const remainingValue = parseFloat(parseFloat(boxWidth)) - value;
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
    if (boxHandle[index] === "left") {
      const updatedBoxHandle = [...boxHandle];
      updatedBoxHandle[index] = "right";
      setBoxHandle(updatedBoxHandle);
    }
    if (boxHandle[index] === "right") {
      const updatedBoxHandle = [...boxHandle];
      updatedBoxHandle[index] = "left";
      setBoxHandle(updatedBoxHandle);
    }
  };

  const handleWidth = (event) => {
    if (event === "plus") {
      setBoxWidth(parseFloat(parseFloat(boxWidth)) + 0.5);
      // Update inner box widths equally
      let newValue = parseFloat((parseFloat(boxWidth) + parseFloat(0.50)) / parseFloat(numSecondInnerBoxes));
      const updatedArray = newWidths.map(() => newValue);
      setNewInnerBoxWidth(updatedArray);
    } else {
      const minValue = 2;
      if (parseFloat(boxWidth) < minValue) {
        setBoxWidth(parseFloat(boxWidth));
      } else {
        setBoxWidth(parseFloat(parseFloat(boxWidth)) - 0.5);
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
    if (event === "plus") {
      setBoxHeight(parseFloat(parseFloat(boxHeight)) + 0.5);
    } else {
      const minValue = 2;
      if (parseFloat(boxHeight) < minValue) {
        setBoxHeight(parseFloat(boxHeight));
      } else {
        setBoxHeight(parseFloat(parseFloat(boxHeight)) - 0.5);
      }
    }
    // setNumSecondInnerBoxes(0);
    // setNewInnerBoxWidth([]);
    // setBoxNames([]);
  };

  if (numFirstInnerBoxes > 0 && newHeights === 0) {
    setNumFirstInnerBoxes(0);
    //console.log(newHeights);
  }

  const handleTopChange = () => {
    setNumFirstInnerBoxes(1);
    setNewInnerBoxHeight((prevHeight) =>
      Math.min(parseFloat(boxHeight) - 1, prevHeight + 1)
    );
  };

  const addFrame = (operation) => {
    if (operation === "minus") {
      setNumFrames((prevFrames) => Math.max(0, prevFrames - 1));
    } else if (operation === "plus") {
      setNumFrames((prevFrames) => Math.min(4, prevFrames + 1));
    }
    setNumSecondInnerBoxes(0);
    setNewInnerBoxWidth([]);
    setBoxNames([]);
  };

  const toggleBoxPosition = () => {
    const newPosition = boxPosition === "Top" ? "Bottom" : "Top";
    setBoxPosition(newPosition);
  };

  function changeMesh(name) {
    if (name === "no") {
      setMesh("yes");
    } else {
      setMesh("no");
    }
  }

  function changeGrill(name) {
    if (name === "no") {
      setGrill("yes");
    } else {
      setGrill("no");
    }
  }

  function changeMeasure(name) {
    if (name === "ft") {
      setMeasure("mm");
      setMcalc(304.8);
      setBoxHeight((parseFloat(parseFloat(boxHeight)) * 304.8).toFixed(2));
      setBoxWidth((parseFloat(parseFloat(boxWidth)) * 304.8).toFixed(2));
      if (newHeights > 0) {
        setNewInnerBoxHeight((parseFloat(newHeights) * 304.8).toFixed(2));
      }
    } else {
      setMeasure("ft");
      setMcalc(1);
      setBoxHeight((parseFloat(parseFloat(boxHeight)) / 304.8).toFixed(2));
      setBoxWidth((parseFloat(parseFloat(boxWidth)) / 304.8).toFixed(2));
      if (newHeights > 0) {
        setNewInnerBoxHeight((parseFloat(newHeights) / 304.8).toFixed(2));
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
    setSelectedMeshSeries(null);
    setSelectedMeshId(null);
    setSelectedCuplerSeries(null);
    setSelectedCuplerId(null);
  };

  const shutterChange = (index) => {
    setBoxNames((prevBoxNames) => {
      const newBoxNames = [...prevBoxNames];
      newBoxNames[index] =
        newBoxNames[index] === "Shutter" ? "Fixed" : "Shutter";
      return newBoxNames;
    });
    setBoxColors((prevboxColors) => {
      const newboxColors = [...prevboxColors];
      newboxColors[index] =
        newboxColors[index] === "lightgreen" ? "lightblue" : "lightgreen";
      return newboxColors;
    });
  };

  // const handleInputChange = (index, value) => {
  //   const newSizes = [...newWidths];
  //   newSizes[index] = parseFloat(value);
  //   setNewInnerBoxWidth(newSizes);

  //   const sum = newSizes.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
  //   setCusWidth(sum);
  //   //alert(sum);
  //   if (sum > boxWidth) {
  //     alert("Shutter Width is larger than Frame size");
  //   }
  //   if (sum < boxWidth) {
  //     alert("Shutter Width is lesser than Frame size");
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
    if(measure ==="ft"){
    if (operation === 'minus') {
      setTopBoxHeight((prevHeight) => Math.max(0, prevHeight - 0.25));
    } else if (operation === 'plus') {
      setTopBoxHeight((prevHeight) => Math.min(boxHeight - 2, prevHeight + 0.25));
    }
  }else{
        if (operation === 'minus') {
      setTopBoxHeight((prevHeight) => Math.max(0, prevHeight - 0.5));
    } else if (operation === 'plus') {
      setTopBoxHeight((prevHeight) => Math.min(boxHeight - 2, prevHeight + 0.5));
    }
  }
  };

  const handleTopHeight = (event) => {
    let newValue = parseFloat(event.target.value);
    newValue = Math.round(newValue * 100) / 100;
    newValue = Math.min(boxHeight - 2, Math.max(0.5, newValue));
    setTopBoxHeight(newValue);
    if (newValue === 0) {
      setnumTopBoxes(0);
      setboxTop("off");
    }
  };

   const toggleboxTop = () => {
    const newPosition = boxTop === 'off' ? 'on' : 'off';
    setboxTop(newPosition);
    setnumTopBoxes(1);
    settopFixedNum(1);
    if(measure ==="ft"){
      setTopBoxHeight(1);
    }else{
      setTopBoxHeight(304.8);
    }
  };

  const handleTopPart = (event) => {
    if (event === "plus") {
      settopFixedNum(parseFloat(topFixedNum) + 1);
      settopFixedWidth(
        Array(topFixedNum + 1).fill(boxWidth / (topFixedNum + 1))
      );
      setTopSash([...topsash, { type: "fixed" }]);
    } else {
      const minValue = 2;
      if (topFixedNum < minValue) {
        settopFixedNum(topFixedNum);
        settopFixedWidth(Array(topFixedNum).fill(boxWidth / topFixedNum));
      } else {
        settopFixedNum(parseFloat(topFixedNum) - 1);
        settopFixedWidth(
          Array(topFixedNum - 1).fill(boxWidth / (topFixedNum - 1))
        );
        const updatedTopSash = topsash?.filter((_, i) => i !== 0);
        setTopSash(updatedTopSash);
      }
    }
  };

  const changeTopSah = (index) => {
    const updatedTopSahs = [...topsash];
    topsash[index].type =
      updatedTopSahs[index].type === "fixed" ? "shutter" : "fixed";
    setTopSash(updatedTopSahs);
  };

  const changeBottomSah = (index) => {
    const updatedBottomSahs = [...bottomsash];
    bottomsash[index].type = updatedBottomSahs[index].type === 'fixed' ? 'shutter' : 'fixed';
    setBottomSash(updatedBottomSahs);
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
   if(measure ==="ft"){
    if (operation === 'minus') {
      setBottomBoxHeight((prevHeight) => Math.max(0, prevHeight - 0.25));
    } else if (operation === 'plus') {
      setBottomBoxHeight((prevHeight) => Math.min(boxHeight - 2, prevHeight + 0.25));
    }
    }else{
    if (operation === 'minus') {
      setBottomBoxHeight((prevHeight) => Math.max(0, prevHeight - 0.5));
    } else if (operation === 'plus') {
      setBottomBoxHeight((prevHeight) => Math.min(boxHeight - 2, prevHeight + 0.5));
    }
    }
  };

  const handleBottomHeight = (event) => {
    let newValue = parseFloat(event.target.value);
    newValue = Math.round(newValue * 100) / 100;
    newValue = Math.min(boxHeight - 2, Math.max(0.5, newValue));
    setBottomBoxHeight(newValue);
    if (newValue === 0) {
      setnumBottomBoxes(0);
      setboxBottom("off");
    }
  };

   const toggleboxBottom = () => {
    const newPosition = boxBottom === 'off' ? 'on' : 'off';
    setboxBottom(newPosition);
    setnumBottomBoxes(1);
    setbottomFixedNum(1);
     if(measure ==="ft"){
    setBottomBoxHeight(1);
     }else{
      setBottomBoxHeight(304.8);
     }
  };

  const handleBottomPart = (event) => {
    if (event === 'plus') {
      setbottomFixedNum(parseFloat(bottomFixedNum) + 1);
      setbottomFixedWidth(Array(bottomFixedNum + 1).fill(boxWidth / (bottomFixedNum + 1)));
      setBottomSash([...bottomsash, { type: 'fixed' }]);
    } else {
      const minValue = 2;
      if (bottomFixedNum < minValue) {
        setbottomFixedNum(bottomFixedNum);
        setbottomFixedWidth(Array(bottomFixedNum).fill(boxWidth / (bottomFixedNum)));
      } else {
        setbottomFixedNum(parseFloat(bottomFixedNum) - 1);
        setbottomFixedWidth(Array(bottomFixedNum - 1).fill(boxWidth / (bottomFixedNum - 1)));
        const updatedBottomSash = bottomsash.filter((_, i) => i !== 0);
        setBottomSash(updatedBottomSash);
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
      setboxTop("off");
      settopFixedWidth([]);
      setTopBoxHeight(0);
      settopFixedNum(0);
    }
    if (bottomnewHeights === 0) {
      setnumBottomBoxes(0);
      setboxBottom("off");
      setbottomFixedWidth([]);
      setBottomBoxHeight(0);
      setbottomFixedNum(0);
    }
  }, [topnewHeights, bottomnewHeights]);

  //----------prifile Section-----------//

  const findIndexByProfileName = (profileName) => {
    return profileDetails?.data?.findIndex(
      (item) => item.profileName === profileName
    );
  };

  useEffect(() => {
    if (customProfile === null || customProfile === undefined) {
      if (profileDetails && state?.selectedProfile) {
        const profileIndex = findIndexByProfileName(
          state.selectedProfile,
          profileDetails
        );
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
        console.error("series.items is not an array");
      }
    }

    return { series: null };
  };

  const frameData = findSeriesAndIdByName(state?.data.frame.id);
  const shutterData = findSeriesAndIdByName(state?.data.shutter.id);
  const mullionData = findSeriesAndIdByName(state?.data.mullion.id);
  const beedingData = findSeriesAndIdByName(state?.data.beeding.id);
  const meshFramedata = findSeriesAndIdByName(state?.data.meshFrame.id);
  const cuplerData = findSeriesAndIdByName(state?.data.cupler.id);
  const interlockdata = findSeriesAndIdByName(state?.data.interlock.id);

  const [selectedFrameSeries, setSelectedFrameSeries] = useState(null);
  const [selectedFrameId, setSelectedFrameId] = useState(null);

  const handleFrameSeriesChange = (event) => {
    const seriesId = event.target.value;

    setSelectedFrameSeries(seriesId);
    setSelectedFrameId(null);
    //  console.log(seriesId);
  };

  const handleFrameIdChange = (event) => {
    const id = event.target.value;
    setSelectedFrameId(id);
    //   console.log(id);
  };

  useEffect(() => {
    if (selectedFrameSeries === null) {
      setSelectedFrameSeries(frameData.series);
      setSelectedFrameId(frameData.id);
    }
  });

  const seriesDataFrame =
    profileData &&
    profileData.find((serieses) => serieses.series === selectedFrameSeries);
  const selectedFramePrice = selectedFrameId
    ? seriesDataFrame?.items?.find((item) => item.id === selectedFrameId)?.price || '0'
    : "0";
  const selectedFrameLength = selectedFrameId
    ? seriesDataFrame?.items?.find((item) => item.id === selectedFrameId)?.length || '0'
    : "0";
  const selectedFrameWeight = selectedFrameId
    ? seriesDataFrame?.items?.find((item) => item.id === selectedFrameId)?.weight || '0'
    : "0";
  const selectedFrameName = selectedFrameId
    ? seriesDataFrame?.items?.find((item) => item.id === selectedFrameId)?.name || 'Loading'
    : "Loading";

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

  const seriesDataShutter =
    profileData &&
    profileData.find((serieses) => serieses.series === selectedShutterSeries);
  const selectedShutterPrice = selectedShutterId
    ? seriesDataShutter.items.find((item) => item.id === selectedShutterId)
      .price
    : "0";
  const selectedShutterLength = selectedShutterId
    ? seriesDataShutter.items.find((item) => item.id === selectedShutterId)
      .length
    : "0";
  const selectedShutterWeight = selectedShutterId
    ? seriesDataShutter.items.find((item) => item.id === selectedShutterId)
      .weight
    : "0";
  const selectedShutterName = selectedShutterId
    ? seriesDataShutter?.items?.find((item) => item.id === selectedShutterId)?.name || 'Loading'
    : "Loading";

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

  useEffect(() => {
    if (selectedMullionSeries === null) {
      setSelectedMullionSeries(mullionData.series);
      setSelectedMullionId(mullionData.id);
    }
  });

  const seriesDataMullion =
    profileData &&
    profileData.find((serieses) => serieses.series === selectedMullionSeries);
  const selectedMullionPrice = selectedMullionId
    ? seriesDataMullion.items.find((item) => item.id === selectedMullionId)
      .price
    : "0";
  const selectedMullionLength = selectedMullionId
    ? seriesDataMullion.items.find((item) => item.id === selectedMullionId)
      .length
    : "0";
  const selectedMullionWeight = selectedMullionId
    ? seriesDataMullion.items.find((item) => item.id === selectedMullionId)
      .weight
    : "0";
  const selectedMullionName = selectedMullionId
    ? seriesDataMullion?.items?.find((item) => item.id === selectedMullionId)?.name || 'Loading'
    : "Loading";

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

  const seriesDataBeeding =
    profileData &&
    profileData.find((serieses) => serieses.series === selectedBeedingSeries);
  const selectedBeedingPrice = selectedBeedingId
    ? seriesDataBeeding.items.find((item) => item.id === selectedBeedingId)
      .price
    : "0";
  const selectedBeedingLength = selectedBeedingId
    ? seriesDataBeeding.items.find((item) => item.id === selectedBeedingId)
      .length
    : "0";
  const selectedBeedingWeight = selectedBeedingId
    ? seriesDataBeeding.items.find((item) => item.id === selectedBeedingId)
      .weight
    : "0";
  const selectedBeedingName = selectedBeedingId
    ? seriesDataBeeding?.items?.find((item) => item.id === selectedBeedingId)?.name || 'Loading'
    : "Loading";

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

  useEffect(() => {
    if (selectedMeshSeries === null) {
      setSelectedMeshSeries(meshFramedata.series);
      setSelectedMeshId(meshFramedata.id);
    }
  });

  const seriesDataMesh =
    profileData &&
    profileData.find((serieses) => serieses.series === selectedMeshSeries);
  const selectedMeshPrice = selectedMeshId
    ? seriesDataMesh?.items?.find((item) => item.id === selectedMeshId)?.price || '0'
    : "0";
  const selectedMeshLength = selectedMeshId
    ? seriesDataMesh?.items?.find((item) => item.id === selectedMeshId)?.length || '0'
    : "0";
  const selectedMeshWeight = selectedMeshId
    ? seriesDataMesh?.items?.find((item) => item.id === selectedMeshId)?.weight || '0'
    : "0";
  const selectedMeshName = selectedMeshId
    ? seriesDataMesh?.items?.find((item) => item.id === selectedMeshId)?.name || 'Loading'
    : "Loading";

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

  const seriesDataCupler =
    profileData &&
    profileData.find((serieses) => serieses.series === selectedCuplerSeries);
  const selectedCuplerPrice = selectedCuplerId
    ? seriesDataCupler?.items?.find((item) => item.id === selectedCuplerId)?.price || '0'
    : "0";
  const selectedCuplerLength = selectedCuplerId
    ? seriesDataCupler?.items?.find((item) => item.id === selectedCuplerId)?.length || '0'
    : "0";
  const selectedCuplerWeight = selectedCuplerId
    ? seriesDataCupler?.items?.find((item) => item.id === selectedCuplerId)?.weight || '0'
    : "0";
  const selectedCuplerName = selectedCuplerId
    ? seriesDataCupler?.items?.find((item) => item.id === selectedCuplerId)?.name || 'Loading'
    : "Loading";

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

  const seriesDataInterLock =
    profileData &&
    profileData.find((serieses) => serieses.series === selectedInterLockSeries);
  const selectedInterLockPrice = selectedInterLockId
    ? seriesDataInterLock.items.find((item) => item.id === selectedInterLockId)
      .price
    : 0;
  const selectedInterLockLength = selectedInterLockId
    ? seriesDataInterLock.items.find((item) => item.id === selectedInterLockId)
      .length
    : 0;
  const selectedInterLockWeight = selectedInterLockId
    ? seriesDataInterLock.items.find((item) => item.id === selectedInterLockId)
      .weight
    : 0;
  const selectedInterLockName = selectedInterLockId
    ? seriesDataInterLock.items.find((item) => item.id === selectedInterLockId)
      .name
    : "Loading";

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

  const [grillCost, setGrillDef] = useState(null);
  const grillValues = costData?.costData?.grill;
  const grillChange = (event) => {
    const cost = event.target.value;
    setGrillDef(cost);
  };

  const [wastageCost, setwastageCost] = useState(0);
  const wasteValues =
    costData && costData.costData && costData.costData.wastage;
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
  const [steelShutterCost, setsteelShutterDef] = useState(0);
  const steelShutterValues =
    costData && costData.costData && costData.costData.steel;
  const steelShutteChange = (event) => {
    const cost = event.target.value;
    setsteelShutterDef(cost);
  };

  const [alTrackCost, setalTrackDef] = useState(0);
  const alTrackValues =
    costData && costData.costData && costData.costData.alTrack;
  const alTrackChange = (event) => {
    const cost = event.target.value;
    setalTrackDef(cost);
  };

  const [gRollCost, setgRollDef] = useState(0);
  const gRollValues = costData && costData.costData && costData.costData.gRoll;
  const gRollChange = (event) => {
    const cost = event.target.value;
    setgRollDef(cost);
  };

  const [meshRollCost, setmeshRollDef] = useState(0);
  const meshRollValues =
    costData && costData.costData && costData.costData.meshRoll;
  const meshRollChange = (event) => {
    const cost = event.target.value;
    setmeshRollDef(cost);
  };

  const [wStripCost, setwStripDef] = useState(0);
  const wStripValues =
    costData && costData.costData && costData.costData.wStrip;
  const wStripChange = (event) => {
    const cost = event.target.value;
    setwStripDef(cost);
  };

  const [bArrestorCost, setbArrestorDef] = useState(0);
  const bArrestorValues =
    costData && costData.costData && costData.costData.bArrestor;
  const bArrestorChange = (event) => {
    const cost = event.target.value;
    setbArrestorDef(cost);
  };

  const [jStopperCost, setjStopperDef] = useState(0);
  const jStopperValues =
    costData && costData.costData && costData.costData.jStopper;
  const jStopperChange = (event) => {
    const cost = event.target.value;
    setjStopperDef(cost);
  };

  const [dArrestorCost, setdArrestorDef] = useState(0);
  const dArrestorValues =
    costData && costData.costData && costData.costData.dArrestor;
  const dArrestorChange = (event) => {
    const cost = event.target.value;
    setdArrestorDef(cost);
  };

  const [meshCost, setmeshDef] = useState(0);
  const meshValues = costData && costData.costData && costData.costData.mesh;
  const meshChange = (event) => {
    const cost = event.target.value;
    setmeshDef(cost);
  };

  const [ShuttergasketCost, setShuttergasketDef] = useState(0);
  const ShuttergasketValues =
    costData && costData.costData && costData.costData.profileGasket;
  const ShuttergasketChange = (event) => {
    const cost = event.target.value;
    setShuttergasketDef(cost);
  };

  const [MulliongasketCost, setMulliongasketDef] = useState(0);
  const MulliongasketValues =
    costData && costData.costData && costData.costData.profileGasket;
  const MulliongasketChange = (event) => {
    const cost = event.target.value;
    setMulliongasketDef(cost);
  };

  const [BeedinggasketCost, setBeedinggasketDef] = useState(0);
  const BeedinggasketValues =
    costData && costData.costData && costData.costData.profileGasket;
  const BeedinggasketChange = (event) => {
    const cost = event.target.value;
    setBeedinggasketDef(cost);
  };

  const [meshgasketCost, setmeshgasketDef] = useState(0);
  const meshgasketValues =
    costData && costData.costData && costData.costData.meshGasket;
  const meshgasketChange = (event) => {
    const cost = event.target.value;
    setmeshgasketDef(cost);
  };

  const [steelMullionCost, setsteelMullionDef] = useState(0);
  const steelMullionValues =
    costData && costData.costData && costData.costData.steel;
  const steelMullionChange = (event) => {
    const cost = event.target.value;
    setsteelMullionDef(cost);
  };

  const [steelmeshCost, setsteelmeshDef] = useState(0);
  const steelmeshValues =
    costData && costData.costData && costData.costData.steel;
  const steelmeshChange = (event) => {
    const cost = event.target.value;
    setsteelmeshDef(cost);
  };

  const [touchlockCost, setouchlockDef] = useState(0);
  const touchLockValues =
    costData && costData.costData && costData.costData.touchLock;
  const touchLockChange = (event) => {
    const cost = event.target.value;
    setouchlockDef(cost);
  };

  const [securityClipCost, setsecurityClipDef] = useState(0);
  const securityClipValues =
    costData && costData.costData && costData.costData.securityClip;
  const securityClipChange = (event) => {
    const cost = event.target.value;
    setsecurityClipDef(cost);
  };

  const [espagCost, setespagDef] = useState(0);
  const espagValues = costData && costData.costData && costData.costData.espag;
  const espagChange = (event) => {
    const cost = event.target.value;
    setespagDef(cost);
  };

  const [frictionStayCost, setfrictionStayDef] = useState(0);
  const frictionStayValues =
    costData && costData.costData && costData.costData.frictionStay;
  const frictionStayChange = (event) => {
    const cost = event.target.value;
    setfrictionStayDef(cost);
  };

  const [runnerblockCost, setrunnerBlockDef] = useState(0);
  const runnerblockValues =
    costData && costData.costData && costData.costData.runnerBlock;
  const runnerblockChange = (event) => {
    const cost = event.target.value;
    setrunnerBlockDef(cost);
  };

  const [mullionClampCost, setmullionClampDef] = useState(0);
  const mullionClampValues =
    costData && costData.costData && costData.costData.mullionClamp;
  const mullionClampChange = (event) => {
    const cost = event.target.value;
    setmullionClampDef(cost);
  };

  const [adjRollCost, setadjRollDef] = useState(0);
  const adjRollValues =
    costData && costData.costData && costData.costData.adjRoll;
  const adjRollChange = (event) => {
    const cost = event.target.value;
    setadjRollDef(cost);
  };

  const [meshJACost, setmeshJADef] = useState(0);
  const meshJAValues =
    costData && costData.costData && costData.costData.meshJA;
  const meshJAChange = (event) => {
    const cost = event.target.value;
    setmeshJADef(cost);
  };

  const handleDef =
    costData && costData.costData && costData.costData.handle[0].value;
  const mplDef =
    costData && costData.costData && costData.costData.mpl[0].value;
  const hingesDef =
    costData && costData.costData && costData.costData.tdHinges[0].value;
  const glassDef =
    costData && costData.costData && costData.costData.glass[0].value;
  const marginDef =
    costData && costData.costData && costData.costData.margin[0].value;
  const marketingDef =
    costData && costData.costData && costData.costData.marketing[0].value;
  const labourFactoryDef =
    costData && costData.costData && costData.costData.labourFactory[0].value;
  const labourSiteDef =
    costData && costData.costData && costData.costData.labourSite[0].value;
  const transportDef =
    costData && costData.costData && costData.costData.transport[0].value;
  const steelFramDef =
    costData && costData.costData && costData.costData.steel[0].value;
  const steelShutterDef =
    costData && costData.costData && costData.costData.steel[0].value;
  const steelMullionDef =
    costData && costData.costData && costData.costData.steel[0].value;
  const grillDef =
    costData && costData.costData && costData.costData.grill[0].value;
  const meshGasketDef =
    costData && costData.costData && costData.costData.meshGasket[0].value;
  const meshDef =
    costData && costData.costData && costData.costData.mesh[0].value;
  const alTrackDef =
    costData && costData.costData && costData.costData.alTrack[0].value;
  const gRollDef =
    costData && costData.costData && costData.costData.gRoll[0].value;
  const meshRollDef =
    costData && costData.costData && costData.costData.meshRoll[0].value;
  const wStripDef =
    costData && costData.costData && costData.costData.wStrip[0].value;
  const bArrestorDef =
    costData && costData.costData && costData.costData.bArrestor[0].value;
  const jStopperDef =
    costData && costData.costData && costData.costData.jStopper[0].value;
  const dArrestorDef =
    costData && costData.costData && costData.costData.dArrestor[0].value;
  const screwDef =
    costData && costData.costData && costData.costData.screws[0].value;
  const wasteDef =
    costData && costData.costData && costData.costData.wastage[0].value;
  const steelmeshDef =
    costData && costData.costData && costData.costData.steel[0].value;
  const ProfilegasketDef =
    costData && costData.costData && costData.costData.profileGasket[0].value;
  const touchLock =
    costData && costData.costData && costData.costData.touchLock[0].value;
  const securityClip =
    costData && costData.costData && costData.costData.securityClip[0].value;
  const runnerBlock =
    costData && costData.costData && costData.costData.runnerBlock[0].value;
  const adjRoll =
    costData && costData.costData && costData.costData.adjRoll[0].value;
  const espag =
    costData && costData.costData && costData.costData.espag[0].value;
  const mullionClamp =
    costData && costData.costData && costData.costData.mullionClamp[0].value;
  const meshJA =
    costData && costData.costData && costData.costData.meshJA[0].value;
  const frictionStay =
    costData && costData.costData && costData.costData.espagm[0].value;

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
    setsteelFramDef(steelFramDef);
    setsteelShutterDef(steelShutterDef);
    setsteelMullionDef(steelMullionDef);
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
    setmeshgasketDef(meshGasketDef);
    setsteelmeshDef(steelmeshDef);
    setProfilegasketDef(ProfilegasketDef);
    setMulliongasketDef(ProfilegasketDef);
    setShuttergasketDef(ProfilegasketDef);
    setBeedinggasketDef(ProfilegasketDef);
    setsecurityClipDef(securityClip);
    setespagDef(espag);
    setmullionClampDef(mullionClamp);
    setadjRollDef(adjRoll);
    setmeshJADef(meshJA);
    setouchlockDef(touchLock);
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
      id: selectedFrameId,
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
      id: selectedBeedingId,
    },
    cupler: {
      length: selectedCuplerLength * 3.28084,
      weight: selectedCuplerWeight,
      amount: selectedCuplerPrice,
      name: selectedCuplerName,
      id: selectedCuplerId,
    },
    meshFrame: {
      length: selectedMeshLength * 3.28084,
      weight: selectedMeshWeight,
      amount: selectedMeshPrice,
      name: selectedMeshName,
      id: selectedMeshId,
    },
    interlock: {
      length: selectedInterLockLength * 3.28084,
      weight: selectedInterLockWeight,
      amount: selectedInterLockPrice,
      name: selectedInterLockName,
      id: selectedInterLockId,
    },
    frameGasket: {
      length: "1",
      weight: "1",
      amount: ProfilegasketCost || 0,
    },
    shutterGasket: {
      length: "1",
      weight: "1",
      amount: ShuttergasketCost || 0,
    },
    mullionGasket: {
      length: "1",
      weight: "1",
      amount: MulliongasketCost || 0,
    },
    beedingGasket: {
      length: "1",
      weight: "1",
      amount: BeedinggasketCost || 0,
    },
    meshGasket: {
      length: "1",
      weight: "1",
      amount: meshgasketCost || 0,
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
    grillCost: grillCost,
    steelMesh: steelmeshCost,
    touchLock: touchlockCost,
    runnerBlock: runnerblockCost,
    espag: espagCost,
    adjRoll: adjRollCost,
    mullionClamp: mullionClampCost,
    meshJA: meshJACost,
    frictionStay: frictionStayCost,
  };

  const Frame = () => {
    if (measure === 'ft') {
      return (2 * (parseFloat(boxWidth) + parseFloat(boxHeight * numFrames))).toFixed(2);
    } else {
      return (2 * (((parseFloat(boxWidth) / 304.8) * numFrames) + (parseFloat(boxHeight) / 304.8))).toFixed(2);
    }
  };

  const Shutter = () => {
    if (measure === 'ft') {
      return (((((parseFloat(boxHeight) - topnewHeights) * shutterCount) * 2) * numFrames) + ((parseFloat(boxWidth) / numSecondInnerBoxes) * shutterCount) * 2).toFixed(2);
    } else {
      return ((((((parseFloat(boxHeight) / 304.8) - (topnewHeights / 304.8)) * shutterCount) * 2) * numFrames) + (((parseFloat(boxWidth) / 304.8) / numSecondInnerBoxes) * shutterCount) * 2).toFixed(2);
    }
  };

  const topShutter = () => {
    const shutterCounts = topsash?.filter(item => item.type === 'shutter').length || 0;
    const shutterSize = (((parseFloat(boxWidth) / parseFloat(topsash?.length)) * 2) + (parseFloat(topnewHeights) * 2)) * parseFloat(shutterCounts);
    return shutterSize;
  };

  const bottomShutter = () => {
    const shutterCounts = bottomsash?.filter(item => item.type === 'shutter').length;
    const shutterSize = (((parseFloat(boxWidth) / parseFloat(bottomsash?.length)) * 2) + (parseFloat(bottomnewHeights) * 2)) * parseFloat(shutterCounts);
    return shutterSize;
  };

  const Mullion = () => {
    if (measure === 'ft') {
      return ((((boxHeight - topnewHeights - bottomnewHeights) * numFrames) * (numSecondInnerBoxes - 1)) + (topnewHeights * boxWidth) + (topnewHeights * (topFixedNum - 1)) + (bottomnewHeights * boxWidth) + (bottomnewHeights * (bottomFixedNum - 1))).toFixed(2);
    } else {
      return ((((boxHeight / 304.8) - topnewHeights - bottomnewHeights) * (numSecondInnerBoxes - 1)) + (topnewHeights * (boxWidth / 304.8)) + (topnewHeights * (topFixedNum - 1)) + (bottomnewHeights * (boxWidth / 304.8)) + (bottomnewHeights * (bottomFixedNum - 1))).toFixed(2);
    }
  };

  const Beeding = () => {
    if (measure === 'ft') {
      if (topnewHeights === 0) {
        return (((parseFloat(boxHeight) * numSecondInnerBoxes * 2) + ((parseFloat(boxWidth) * 2 / numFrames))) * numFrames).toFixed(2);
      } else {
        return (((topnewHeights * 2) + ((parseFloat(boxHeight) - topnewHeights) * (numSecondInnerBoxes * 2)) + ((parseFloat(boxWidth) * 4 / numFrames))) * numFrames).toFixed(2);
      }
    } else {
      if (topnewHeights === 0) {
        return ((((parseFloat(boxHeight) / 304.8) * numSecondInnerBoxes * 2) + (((parseFloat(boxWidth) / 304.8) * 2 / numFrames))) * numFrames).toFixed(2);
      } else {
        return ((((topnewHeights / 304.8) * 2) + (((parseFloat(boxHeight) / 304.8) - (topnewHeights / 304.8)) * (numSecondInnerBoxes * 2)) + (((parseFloat(boxWidth) / 304.8) * 4 / numFrames))) * numFrames).toFixed(2);
      }
    }
  };

  const beedingGasket = () => {
    if (measure === 'ft') {
      if (topnewHeights === 0) {
        return ((((parseFloat(boxHeight) * numSecondInnerBoxes * 2) + ((parseFloat(boxWidth) * 2 / numFrames))) * numFrames) * 1).toFixed(2);
      } else {
        return ((((topnewHeights * 2) + ((parseFloat(boxHeight) - topnewHeights) * (numSecondInnerBoxes * 2)) + ((parseFloat(boxWidth) * 4 / numFrames))) * numFrames) * 1).toFixed(2);
      }
    } else {
      if (topnewHeights === 0) {
        return (((((parseFloat(boxHeight) / 304.8) * numSecondInnerBoxes * 2) + (((parseFloat(boxWidth) / 304.8) * 2 / numFrames))) * numFrames) * 1).toFixed(2);
      } else {
        return (((((topnewHeights / 304.8) * 2) + (((parseFloat(boxHeight) / 304.8) - (topnewHeights / 304.8)) * (numSecondInnerBoxes * 2)) + (((parseFloat(boxWidth) / 304.8) * 4 / numFrames))) * numFrames) * 1).toFixed(2);
      }
    }
  };

  const shutterGasket = () => {
    if (measure === 'ft') {
      return ((((((parseFloat(boxHeight) - topnewHeights) * shutterCount) * 2 * numFrames)) + ((parseFloat(boxWidth) / numSecondInnerBoxes) * shutterCount) * 2) * 1).toFixed(2);
    } else {
      return (((((((parseFloat(boxHeight) / 304.8) - (topnewHeights / 304.8)) * shutterCount) * 2 * numFrames)) + (((parseFloat(boxWidth) / 304.8) / numSecondInnerBoxes) * shutterCount) * 2) * 1).toFixed(2);
    }
  };

  const frameGasket = () => {
    if (measure === 'ft') {
      return ((parseFloat(boxHeight) * 2) + (parseFloat(boxWidth) * 2)).toFixed(2);
    } else {
      return (((parseFloat(boxHeight) / 304.8) * 2) + ((parseFloat(boxWidth) / 304.8) * 2)).toFixed(2);
    }
  };

  const steelFrame = () => {
    if (measure === 'ft') {
      return (((parseFloat(boxHeight) * 2) + (parseFloat(boxWidth) * 2)) * (shutterCount - 1)).toFixed(2);
    } else {
      return ((((parseFloat(boxHeight) / 304.8) * 2) + ((parseFloat(boxWidth) / 304.8) * 2)) * (shutterCount - 1)).toFixed(2);
    }
  };

  const steelMullion = () => {
    if (measure === 'ft') {
      if (topnewHeights === 0) {
        return 0;
      } else {
        return (parseFloat(boxWidth) * 1).toFixed(2);
      }
    } else {
      if (topnewHeights === 0) {
        return 0;
      } else {
        return (parseFloat(boxWidth) / 304.8).toFixed(2);
      }
    }
  };

  const steelShutter = () => {
    if (measure === 'ft') {
      return (((((parseFloat(boxHeight) - topnewHeights) * shutterCount) * 2) + ((parseFloat(boxWidth) / numSecondInnerBoxes) * shutterCount) * 2) * numFrames).toFixed(2);
    } else {
      return ((((((parseFloat(boxHeight) / 304.8) - (topnewHeights / 304.8)) * shutterCount) * 2) + (((parseFloat(boxWidth) / 304.8) / numSecondInnerBoxes) * shutterCount) * 2) * numFrames).toFixed(2);
    }
  };

  const cuplerJoint = () => {
    if (measure === 'ft') {
      return (parseFloat(boxHeight)) * (numFrames - 1).toFixed(2);
    } else {
      return ((parseFloat(boxHeight) / 304.8)) * (numFrames - 1).toFixed(2);
    }
  };

  const interLock = () => {
    if (measure === 'ft') {
      return ((parseFloat(boxHeight) * (shutterCount - 1)) * 2).toFixed(2);
    } else {
      return (((parseFloat(boxHeight) / 304.8) * (shutterCount - 1)) * 2).toFixed(2);
    }
  };

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

  const meshFrame = () => {
    if (measure === 'ft') {
      if (mesh === 'yes') {
        return (((((boxHeight - topnewHeights - bottomnewHeights) * (shutterCount - 1)) * 2) + ((boxWidth / numSecondInnerBoxes) * (shutterCount - 1)) * 2) * numFrames).toFixed(2);
      } else {
        return 0;
      }
    } else {
      if (mesh === 'yes') {
        return ((((((boxHeight / 304.8) - (topnewHeights / 304.8) - (bottomnewHeights / 304.8)) * (shutterCount - 1)) * 2) + (((boxWidth / 304.8) / numSecondInnerBoxes) * (shutterCount - 1)) * 2) * numFrames).toFixed(2);
      } else {
        return 0;
      }
    }
  };



  const meshGasket = () => {
    return meshFrame();
  };


  const steelMesh = () => {
    if (measure === 'ft') {
      if (mesh === 'yes') {
        return (((((boxHeight - topnewHeights - bottomnewHeights) * (shutterCount - 1)) * 2) + ((boxWidth / numSecondInnerBoxes) * (shutterCount - 1)) * 2) * numFrames).toFixed(2);
      } else {
        return 0;
      }
    } else {
      if (mesh === 'yes') {
        return ((((((boxHeight / 304.8) - (topnewHeights / 304.8) - (bottomnewHeights / 304.8)) * (shutterCount - 1)) * 2) + (((boxWidth / 304.8) / numSecondInnerBoxes) * (shutterCount - 1)) * 2) * numFrames).toFixed(2);
      } else {
        return 0;
      }
    }
  };


  const meshArea = () => {
    if (mesh === 'yes') {

      const indices = boxNames
        .map((name, index) => name === 'Shutter' ? index : -1)
        .filter(index => index !== -1);

      const widths = indices.map(index => parseFloat(newWidths[index]));
      const totalWidth = parseFloat(widths.reduce((sum, width) => sum + width, 0));
      const meashsArea = (parseFloat(boxHeight) - topnewHeights - bottomnewHeights) * parseFloat(totalWidth);
      const sash = newWidths[0] * (parseFloat(boxHeight) - topnewHeights - bottomnewHeights);
      const mesh = meashsArea - sash;


      return mesh;

    } else {
      return 0;
    }
  };

  const gillArea = () => {
    if (grill === 'yes') {

      const indices = boxNames.map((name, index) => name === 'Shutter' ? index : -1).filter(index => index !== -1);
      const widths = indices.map(index => newWidths[index]);
      const totalWidth = widths.reduce((sum, width) => sum + width, 0);
      const grillsAreaMain = (parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights)) * parseFloat(totalWidth);

      const shutterCounts = topsash?.filter(item => item.type === 'shutter').length;
      const grillsAreaTop = (((parseFloat(boxWidth) / parseFloat(topsash?.length)) * (parseFloat(topnewHeights)))) * parseFloat(shutterCounts);

      const grillsArea = grillsAreaMain + grillsAreaTop;

      return grillsArea;

    } else {
      return 0;
    }
  };

  const screws = () => {
    const outer = (((parseFloat(boxHeight) / 2) * 2) + ((parseFloat(boxWidth) / 2) * 2));
    const sash = (parseFloat(boxHeight) - 1) + (parseFloat(boxWidth) - 1) * 2;
    const stay = sash + parseFloat(boxHeight);
    const espag = sash;

    return outer + sash + stay + espag;
  };


  let frameArea = null;
  if (measure === 'ft') {
    frameArea = parseFloat(boxHeight) * parseFloat(boxWidth);
  } else {
    frameArea = (parseFloat(boxHeight) / 304.8) * (parseFloat(boxWidth) / 304.8);
  }

  const fixedShutters = (fixedCount + numFirstInnerBoxes) * numFrames;

  const values = {
    frame: {
      rqm: (parseFloat(Frame()) * 0.3048).toFixed(2) || 0,
      rpm: data.frame.amount || 0,
      amount: (parseFloat(Frame()) * 0.3048) * parseFloat(data.frame.amount) || 0
    },
    shutter: {
      rqm: ((parseFloat(Shutter()) + parseFloat(topShutter()) + parseFloat(bottomShutter())) * 0.3048).toFixed(2) || 0,
      rpm: data.shutter.amount || 0,
      amount: (((parseFloat(Shutter()) + parseFloat(topShutter()) + parseFloat(bottomShutter())) * 0.3048) * data.shutter.amount).toFixed(2) || 0
    },
    meshFrame: {
      rqm: (parseFloat(meshFrame()) * 0.3048).toFixed(2) || 0,
      rpm: data.meshFrame.amount || 0,
      amount: (parseFloat(meshFrame()) * 0.3048) * data.meshFrame.amount || 0
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
    cupler: {
      rqm: (parseFloat(cuplerJoint()) * 0.3048).toFixed(2) || 0,
      rpm: data.cupler.amount || 0,
      amount: (parseFloat(cuplerJoint()) * 0.3048) * data.cupler.amount || 0,
    },
    interLock: {
      rqm: (parseFloat(interLock()) * 0.3048).toFixed(2) || 0,
      rpm: data.interlock.amount || 0,
      amount: (parseFloat(interLock()) * 0.3048) * data.interlock.amount || 0,
    },
    meshGasket: {
      rqm: (parseFloat(meshGasket()) * 0.3048).toFixed(2) || 0,
      rpm: data.meshGasket.amount || 0,
      amount: (parseFloat(meshGasket()) * 0.3048) * data.meshGasket.amount || 0,
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
    mullionGasket: {
      rqm: (parseFloat(Mullion() * 2) * 0.3048).toFixed(2) || 0,
      rpm: data.mullionGasket.amount || 0,
      amount: (parseFloat(Mullion() * 2) * 0.3048) * data.mullionGasket.amount || 0,
    },
    wStrip: {
      qty: weatherStrip(),
      price: data.wStrip,
      amount: weatherStrip() * data.wStrip || 0,
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
    steelMesh: {
      qty: steelMesh(),
      price: data.steelMesh,
      amount: steelMesh() * data.steelMesh || 0,
    },
    mpl: {
      qty: ((shutterCount * numFrames) + parseFloat(topsash?.filter(item => item.type === 'shutter').length)),
      price: data.mplCost,
      amount: ((shutterCount * numFrames) + parseFloat(topsash?.filter(item => item.type === 'shutter').length)) * data.mplCost || 0
    },
    frictionstay: {
      qty: ((shutterCount * numFrames) + parseFloat(topsash?.filter(item => item.type === 'shutter').length)),
      price: data.frictionStay,
      amount: ((shutterCount * numFrames) + parseFloat(topsash?.filter(item => item.type === 'shutter').length)) * data.frictionStay || 0
    },
    touchlock: {
      qty: 2,
      price: data.touchLock,
      amount: 2 * data.touchLock || 0
    },
    securityclip: {
      qty: ((shutterCount * numFrames) + parseFloat(topsash?.filter(item => item.type === 'shutter').length)),
      price: data.securityClip,
      amount: ((shutterCount * numFrames) + parseFloat(topsash?.filter(item => item.type === 'shutter').length)) * data.securityClip || 0
    },
    runnerblock: {
      qty: ((shutterCount * numFrames) + parseFloat(topsash?.filter(item => item.type === 'shutter').length)),
      price: data.runnerBlock,
      amount: ((shutterCount * numFrames) + parseFloat(topsash?.filter(item => item.type === 'shutter').length)) * data.runnerBlock || 0
    },
    espag: {
      qty: ((shutterCount * numFrames) + parseFloat(topsash?.filter(item => item.type === 'shutter').length)),
      price: data.espag,
      amount: ((shutterCount * numFrames) + parseFloat(topsash?.filter(item => item.type === 'shutter').length)) * data.espag || 0
    },
    mullionclamp: {
      qty: ((shutterCount * numFrames) + parseFloat(topsash?.filter(item => item.type === 'shutter').length)),
      price: data.mullionClamp,
      amount: ((shutterCount * numFrames) + parseFloat(topsash?.filter(item => item.type === 'shutter').length)) * data.mullionClamp || 0
    },
    meshja: {
      qty: ((shutterCount * numFrames) + parseFloat(topsash?.filter(item => item.type === 'shutter').length)),
      price: data.meshJA,
      amount: ((shutterCount * numFrames) + parseFloat(topsash?.filter(item => item.type === 'shutter').length)) * data.meshJA || 0
    },
    hings: {
      qty: ((shutterCount * numFrames) + parseFloat(topsash?.filter(item => item.type === 'shutter').length)),
      price: data.hingsCost,
      amount: ((shutterCount * numFrames) + parseFloat(topsash?.filter(item => item.type === 'shutter').length)) * data.hingsCost || 0
    },
    screws: {
      qty: screws(),
      price: data.screwsCost,
      amount: screws() * data.screwsCost || 0
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
      qty: frameArea,
      price: data.glassCost,
      amount: frameArea * data.glassCost || 0
    },
    margin: {
      qty: frameArea,
      price: data.marginCost,
      amount: frameArea * data.marginCost || 0
    },

    alTrack: {
      qty: (measure === 'ft' ? parseFloat(boxWidth) * (shutterCount) : (parseFloat(boxWidth) / 304.8) * shutterCount),
      price: data.aluTrack,
      amount: (measure === 'ft' ? parseFloat(boxWidth) * (shutterCount) : ((parseFloat(boxWidth) / 304.8) * shutterCount)) * data.aluTrack || 0
    },
    bArrester: {
      qty: shutterCount + parseFloat(topsash?.filter(item => item.type === 'shutter').length),
      price: data.bArrest,
      amount: shutterCount * data.bArrest || 0
    },
    jStopper: {
      qty: shutterCount + parseFloat(topsash?.filter(item => item.type === 'shutter').length),
      price: data.jStop,
      amount: shutterCount * data.jStop || 0
    },
    dArrester: {
      qty: shutterCount + parseFloat(topsash?.filter(item => item.type === 'shutter').length),
      price: data.dArrest,
      amount: shutterCount * data.dArrest || 0
    },
    gRoller: {
      qty: shutterCount * 2,
      price: data.groRoll,
      amount: shutterCount * 2 * data.groRoll || 0
    },
    mRoller: {
      qty: mesh == 'yes' ? (shutterCount + parseFloat(topsash?.filter(item => item.type === 'shutter').length)) : 0,
      price: data.mesRoll,
      amount: mesh == 'yes' ? (shutterCount + parseFloat(topsash?.filter(item => item.type === 'shutter').length)) * data.mesRoll : 0
    },
    mesh: {
      qty: mesh == 'yes' ? meshArea() : 0,
      price: data.meshCost,
      amount: mesh == 'yes' ? meshArea() * data.meshCost : 0
    },
    grill: {
      qty: grill == 'yes' ? gillArea() : 0,
      price: data.grillCost,
      amount: grill == 'yes' ? gillArea() * data.grillCost : 0
    },
  };

  const frameTotal = parseFloat(
    parseFloat(values.frame.amount) +
    parseFloat(values.shutter.amount) +
    parseFloat(values.meshFrame.amount) +
    parseFloat(values.mullion.amount) +
    parseFloat(values.beeding.amount) +
    parseFloat(values.frameGasket.amount) +
    parseFloat(values.shutterGasket.amount) +
    parseFloat(values.mullionGasket.amount) +
    parseFloat(values.meshGasket.amount) +
    parseFloat(values.beedingGasket.amount) +
    parseFloat(values.interLock.amount) +
    parseFloat(values.cupler.amount)
  );

  const wastage = frameTotal * data.wastage / 100;
  const frps = (frameTotal + wastage) / frameArea;

  const hardTotal = parseFloat(
    // parseFloat(values.grill.amount) + 
    parseFloat(values.steelFrame.amount) +
    parseFloat(values.steelShutter.amount) +
    parseFloat(values.steelMullion.amount) +
    parseFloat(values.steelMesh.amount) +
    parseFloat(values.alTrack.amount) +
    parseFloat(values.bArrester.amount) +
    parseFloat(values.jStopper.amount) +
    parseFloat(values.dArrester.amount) +
    parseFloat(values.gRoller.amount) +
    parseFloat(values.wStrip.amount) +
    parseFloat(values.touchlock.amount) +
    parseFloat(values.mesh.amount) +
    parseFloat(values.mRoller.amount) +
    parseFloat(values.screws.amount) +
    parseFloat(values.mullionclamp.amount) +
    parseFloat(values.meshja.amount) +
    parseFloat(values.frictionstay.amount) +
    parseFloat(values.espag.amount)
  );

  const hrps = hardTotal / frameArea;

  const prodTotal = parseFloat(
    parseFloat(values.marketing.amount) +
    parseFloat(values.transport.amount) +
    parseFloat(values.labourF.amount) +
    parseFloat(values.labourS.amount) +
    parseFloat(values.glass.amount)
  );

  const prps = prodTotal / frameArea;

  const marginTotal = parseFloat(values.margin.amount);
  const mrps = marginTotal / frameArea;

  const grandTotal = frameTotal + hardTotal + prodTotal + wastage + marginTotal;
  const grandAps = grandTotal / frameArea;

  const calculatedBoxWidth = measure === 'ft' ? boxWidth : (parseFloat(boxWidth) / 304.8);
  const calculatedBoxHeight = measure === 'ft' ? boxHeight : (parseFloat(boxHeight) / 304.8);
  const calculatednewWidths = newWidths.map(width =>
    measure === 'ft' ? parseFloat(width) : parseFloat(width) / 304.8
  );
  const calculatedtopnewHeights = measure === 'ft' ? topnewHeights : (topnewHeights / 304.8);

  const coreData = {
    userId, quoteId, rowId: rowid, data: {mCalc, distance, topsash, bottomsash, item, measure, selectedProfile, series, qty, data, boxWidths: calculatedBoxWidth, boxHeights: calculatedBoxHeight, boxWidth: boxWidth, boxHeight: boxHeight, numTopBoxes, numFrames, numSecondInnerBoxes, topnewHeights: topnewHeights, newWidthss: calculatednewWidths, newWidths: newWidths, boxColors, boxNames, boxHandle, deviceWidth, screen, boxTop, shutterCount, fixedCount, mesh, grill, frameArea, values, frameTotal, wastage, hardTotal, prodTotal, marginTotal, grandTotal, topFixedNum, topFixedWidth, numBottomBoxes, bottomnewHeights, boxBottom, bottomFixedNum, bottomFixedWidth }
  };

  //console.log(coreData);
  const selectedProfiles = () => {
    let messages = [];
    let allValid = true;


    if ((selectedFrameId === null || selectedFrameId === "") || (selectedFrameSeries === null || selectedFrameSeries === "")) {
      messages.push("0.5 Track Outer Frame Profile Not Selected");
      allValid = false;
    }


    if ((selectedShutterId === null || selectedShutterId === "") || (selectedShutterSeries === null || selectedShutterSeries === "")) {
      messages.push("Shutter Frame Profile Not Selected");
      allValid = false;
    }


    if (newHeights > 0) {
      if ((selectedMullionId === null || selectedMullionId === "") || (selectedMullionSeries === null || selectedMullionSeries === "")) {
        messages.push("Mullion Profile Not Selected");
        allValid = false;
      }
    }


    if ((selectedBeedingId === null || selectedBeedingId === "") || (selectedBeedingSeries === null || selectedBeedingSeries === "")) {
      messages.push("Beeding Profile Not Selected");
      allValid = false;
    }


    if (mesh === 'yes') {
      if ((selectedMeshId === null || selectedMeshId === "") || (selectedMeshSeries === null || selectedMeshSeries == "")) {
        messages.push("Mesh Sash Profile Not Selected");
        allValid = false;
      }
    }



    if (numFrames > 1) {
      if ((selectedCuplerId === null || selectedCuplerId === "") || (selectedCuplerSeries === null || selectedCuplerSeries === "")) {
        messages.push("Cupler Joint/Square Joint Profile Not Selected");
        allValid = false;
      }
    }

    if ((selectedInterLockId === null || selectedInterLockId === "") || (selectedInterLockSeries === null || selectedInterLockSeries === "")) {
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
      openModal2(
        "Shutter size is not fit for the Door. Would you like to continue at your own risk?"
      );
    } else {
      const hasInvalidValue = newWidths.some(
        (value) => value < 1 || value > 2.5
      );

      if (hasInvalidValue) {
        openModal1();
      } else {
        if (boxHeight > 6) {
          openModal2(
            "The size of the window is more than 6 feet and it should be created in the Casement Door. Would you like to continue at your own risk?"
          );
        } else {
          sendDataToUrl();
        }
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

  const profileDatas = {
    width: calculatedBoxWidth,
    height: calculatedBoxHeight,
    series,
    profileId: selectedProfile,
    mesh,
    shutterCount,
    type: item,
  };

  const handleSeriesChange = (event) => {
    const id = event.target.value;
    setSeries(id);
    sendprofileDataToUrl();
  };

  const openModal = () => {
    const modal = document.getElementById("onloadModal");
    if (modal) {
      modal.classList.add("show");
      modal.style.display = "block";
      document.body.classList.add("modal-open");
    }
  };

  const closeModal = () => {
    setCalcBtn(false);
    const modal = document.getElementById("onloadModal");
    if (modal) {
      modal.classList.remove("show");
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
  };

  const openModal1 = () => {
    const modal = document.getElementById("onloadModal1");
    if (modal) {
      modal.classList.add("show");
      modal.style.display = "block";
      document.body.classList.add("modal-open");
    }
  };

  const closeModal1 = () => {
    setCalcBtn(false);
    const modal = document.getElementById("onloadModal1");
    if (modal) {
      modal.classList.remove("show");
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
  };

  const openModal2 = (content) => {
    const modal = document.getElementById("onloadModal2");
    if (modal) {
      modal.classList.add("show");
      modal.style.display = "block";
      document.body.classList.add("modal-open");
      const contentElement = document.getElementById("resMsg");
      contentElement.textContent = content;
    }
  };

  const closeModal2 = () => {
    setCalcBtn(false);
    const modal = document.getElementById("onloadModal2");
    if (modal) {
      modal.classList.remove("show");
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
  };

  const openModal3 = (content) => {
    const modal = document.getElementById("onloadModal3");
    if (modal) {
      modal.classList.add("show");
      modal.style.display = "block";
      document.body.classList.add("modal-open");
    }
  };

  const closeModal3 = () => {
    setCalcBtn(false);
    const modal = document.getElementById("onloadModal3");
    if (modal) {
      modal.classList.remove("show");
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
  };

  const sendprofileDataToUrl = () => {
    setCalcBtn(true);
    try {
      handleContinueCalc();
    } catch (e) {
      console.warn('handleContinueCalc error:', e);
    }
    setCalcBtn(false);
    setIsProfile(true);
    try {
      addDef();
    } catch (e) {
      console.warn('addDef error:', e);
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
    if (boxHeight > 6) {
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
      const response = await axios.post(
        "https://upvcapi.sninfoserv.com/find-default/",
        profileDatas
      );
      //console.log('Response:', response.data);
      if (response.data.status === "success") {
        if (response.data.data[0].beeding !== "") {
          setSelectedBeedingSeries(response.data.data[0].beedingSeries);
          setSelectedBeedingId(response.data.data[0].beeding);
        }
        if (response.data.data[0].frame !== "") {
          setSelectedFrameSeries(response.data.data[0].frameSeries);
          setSelectedFrameId(response.data.data[0].frame);
        }
        if (response.data.data[0].interlock !== "") {
          //alert('interlock');
        }
        if (response.data.data[0].mesh !== "") {
          setSelectedMeshSeries(response.data.data[0].meshSeries);
          setSelectedMeshId(response.data.data[0].mesh);
        }
        if (response.data.data[0].mullion !== null) {
          setSelectedMullionSeries(response.data.data[0].mullionSeries);
          setSelectedMullionId(response.data.data[0].mullion);
        }
        if (response.data.data[0].panel !== "") {
          //alert('panel');
        }
        if (response.data.data[0].shutter !== "") {
          setSelectedShutterSeries(response.data.data[0].shutterSeries);
          setSelectedShutterId(response.data.data[0].shutter);
        }
        if (response.data.data[0].cupler !== "") {
          setSelectedCuplerSeries(response.data.data[0].cuplerSeries);
          setSelectedCuplerId(response.data.data[0].cupler);
        }
        if (response.data.data[0].interLock !== "") {
          setSelectedInterLockSeries(response.data.data[0].interSeries);
          setSelectedInterLockId(response.data.data[0].interlock);
        }
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
    closeModal();
  };

   const boxes = (height) => {
  const isFeet = measure === "ft";

  // length count
  const count = isFeet ? height * 2 : (height / 304.8) * 2;

  // height of each box
  const boxHeight = isFeet ? "0.20vw" : "19.5px";

  // marginTop formula
  const marginCalc = isFeet
    ? `calc((${height * screen / mCalc}vw - 25px) / ${height * 2.7})`
    : `calc((${(height / 304.8) * screen / mCalc}vw - 12px) / ${(height / 304.8) * 2.7})`;

  return Array.from({ length: count }).map((_, index) => (
    <div
      key={index}
      style={{
        position: "relative",
        width: "100%",
        height: boxHeight,
        border: "1px solid #333",
        // background: "#fff",
        marginTop: marginCalc,
      }}
    />
  ));
};
  const getOuterBottom = (height, screen, mCalc) => {
    const fullHeightVW = (height) * screen / mCalc;
    return `calc(${fullHeightVW}vw - 15px)`;
  };
  // inner Bottom Line
  const getInnerBottom = (height, screen, mCalc) => {
    const fullHeightVW = (height) * screen / mCalc;
    return `calc(${fullHeightVW}vw - ${boxTop === 'on' ? '31px' : '26px'})`;
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



  return (
    <div>
      <div
        class="modal fade custom-modal"
        id="onloadModal"
        tabindex="-1"
        aria-labelledby="onloadModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content" align="center">
            <div class="mt-3 mb-3">
              <h5>Warning</h5>
            </div>
            <div class="mb-3">
              <h6 class="mb-3">
                Shutter size is not standard, would you like to continue at
                your own risk?
              </h6>
              <button class="btn btn-success w-25 me-4" type="button" onClick={closeModal}>Cancel</button>{" "}
              <button class="btn btn-danger w-25" type="button" onClick={continueCalc}>Continue </button>
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
              <h6 class="mb-3">
                Shutter size is not standard, would you like to continue at
                your own risk?
              </h6>
              <button class="btn btn-success w-25 me-4" type="button" onClick={closeModal1}>Cancel </button>{" "}
              <button class="btn btn-danger w-25" type="button" onClick={continueSend} >Continue</button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade custom-modal" id="onloadModal2" tabindex="-1" aria-labelledby="onloadModalLabel" aria-hidden="true" >
        <div class="modal-dialog">
          <div class="modal-content" align="center">
            <div class="mt-3 mb-3">
              <h5>Warning</h5>
            </div>
            <div class="mb-3">
              <h6 class="mb-3" id="resMsg"></h6>
              <button class="btn btn-success w-25 me-4" type="button" onClick={closeModal2}>Cancel</button>{" "}
              <button class="btn btn-danger w-25" type="button" onClick={continueSendData} > Continue </button>
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
              <h6 class="mb-3">
                <ContentEditable html={`${modalContent}`} />
              </h6>
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
                      <button className="btn btn-primary w-100" type="button" onClick={() => changeMeasure(measure)}>
                        {measure === "ft" ? "Feet" : "MM"}
                      </button>
                    </div>
                    <div class="col-6">
                      <p>Width </p>
                      <div class="input-group mb-2">
                        <button class="btn btn-danger" type="button" onClick={() => handleWidth("minus")} > - </button>
                        <input type="parseFloat" step="0.01" class="form-control" value={parseFloat(boxWidth)} onChange={handleWidthChange} />
                        <button class="btn btn-success" type="button" onClick={() => handleWidth("plus")} > + </button>
                      </div>
                    </div>

                    <div class="col-6">
                      <p>Height</p>
                      <div class="input-group mb-2">
                        <button class="btn btn-danger" type="button" onClick={() => handleHeight("minus")}> - </button>
                        <input type="parseFloat" step="0.01" class="form-control" value={parseFloat(boxHeight)} onChange={handleHeightChange} />
                        <button class="btn btn-success" type="button" onClick={() => handleHeight("plus")} > + </button>
                      </div>
                    </div>
                  </div>

                  <div class="mt-3 row align-items-center">
                    <div class="col-6">
                      <p>Outer Frame</p>
                      <div class="input-group mb-2">
                        <button class="btn btn-danger" type="button" onClick={() => addFrame("minus")} > - </button>
                        <input type="parseFloat" step="0.01" class="form-control" value={numFrames} />
                        <button class="btn btn-success" type="button" onClick={() => addFrame("plus")} > + </button>
                      </div>
                    </div>

                    <div class="col-6">
                      <p>No of Windows</p>
                      <div class="input-group mb-2">
                        <button class="btn btn-danger" type="button" onClick={() => handleQty("minus")} > - </button>
                        <input type="parseFloat" step="0.01" class="form-control" value={qty} onChange={handleQtyChange} />
                        <button class="btn btn-success" type="button" onClick={() => handleQty("plus")} > + </button>
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
                      <div class=" row align-items-center">
                        <div class="col-6">
                          <p>Fixed</p>
                          <button className="btn btn-warning w-100" onClick={() => addMullion("Fixed")} >Add Fixed </button>
                        </div>
                        <div class="col-6">
                          <p>Shutter</p>
                          <button className="btn btn-primary w-100" onClick={() => addWindow("Shutter")} > Add Shutter </button>
                        </div>

                        {boxTop === "off" ? (
                          <>
                            <div class="col-12 mt-3">
                              <p>Top Fixed</p>
                              <button className="btn btn-primary w-100" type="button" onClick={() => toggleboxTop()} >Add Top Fixed </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div class="col-6 mt-3">
                              <p>Top Fixed Height</p>
                              <div className="input-group mb-2">
                                <button className="btn btn-danger" type="button" onClick={() => handleTop("minus")} > - </button>
                                <input type="text" className="form-control" value={topnewHeights} onChange={handleTopHeight} />
                                <button className="btn btn-success" type="button" onClick={() => handleTop("plus")} > + </button>
                              </div>
                            </div>

                            <div class="col-6 mt-3">
                              <p>Top partitions </p>
                              <div class="input-group mb-2">
                                <button class="btn btn-danger" type="button" onClick={() => handleTopPart("minus")} > - </button>
                                <input type="parseFloat" step="0.01" class="form-control" value={topFixedNum} onChange={handleTopPartChange} />
                                <button class="btn btn-success" type="button" onClick={() => handleTopPart("plus")} > + </button>
                              </div>
                            </div>
                          </>
                        )}

                        {boxBottom === "off" ? (
                          <>
                            <div class="col-12 mt-3">
                              <p>Bottm Fixed</p>
                              <button className="btn btn-primary w-100" type="button" onClick={() => toggleboxBottom()} > Add Bottom Fixed </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div class="col-6 mt-3">
                              <p>Bottom Fixed Height</p>
                              <div className="input-group mb-2">
                                <button className="btn btn-danger" type="button" onClick={() => handleBottom("minus")} > - </button>
                                <input type="text" className="form-control" value={bottomnewHeights} onChange={handleBottomHeight} />
                                <button className="btn btn-success" type="button" onClick={() => handleBottom("plus")} > + </button>
                              </div>
                            </div>

                            <div class="col-6 mt-3">
                              <p>Bottom partitions </p>
                              <div class="input-group mb-2">
                                <button class="btn btn-danger" type="button" onClick={() => handleBottomPart("minus")} > - </button>
                                <input type="parseFloat" step="0.01" class="form-control" value={bottomFixedNum} onChange={handleBottomPartChange} />
                                <button class="btn btn-success" type="button" onClick={() => handleBottomPart("plus")} > + </button>
                              </div>
                            </div>
                          </>
                        )}

                        <div class="col-6 mt-3">
                          <p>Mesh</p>
                          <button className={mesh === "no" ? "btn btn-success w-100" : "btn btn-info w-100"} onClick={() => changeMesh(mesh)}>Mesh - {mesh} </button>
                        </div>
                        <div class="col-6 mt-3">
                          <p>Grill</p>
                          <button className={grill === "no" ? "btn btn-success w-100" : "btn btn-info w-100"} onClick={() => changeGrill(grill)}>Grill - {grill}</button>
                        </div>

                        <div class="col-12 mb-2 mt-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <p className="mb-0">Select Profile</p>
                            <a href="/uploadprofile" target="_blank" rel="noreferrer" className="text-primary" style={{ fontSize: '12px', fontWeight: 600 }}>
                              + Add Extra Profile
                            </a>
                          </div>
                          <select type="text" className="form-control" value={customProfile} onChange={handleProfileChange}>
                            {profileDetails && profileDetails.data &&
                              profileDetails.data.map((profiles, index) => (
                                <option className="form-control" value={index}>
                                  {profiles.profileName}
                                </option>
                              ))}
                            <option className="form-control text-sm text-center" disabled > Add more Profile contact Administration </option>
                          </select>
                        </div>

                        <div class="col-6 mb-2 mt-2">
                          <select className="form-control" value={series} onChange={handleSeriesChange} >
                            <option value="" hidden>Select Series </option>
                            <option className="form-control" value="50 Series"> 50 Series </option>
                            <option className="form-control" value="60 Series"> 60 Series </option>
                          </select>
                        </div>

                        <div class="col-6 mb-2 mt-2 ">
                          <button class={calcBtn === false ? "btn btn-info w-100" : "btn btn-secondary w-100"} onClick={sendprofileDataToUrl}>
                            {calcBtn === false ? "Load Profile" : "Profile Loading..."}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div class="col-md-12 col-xxl-8 col-xl-8">
              <div class="card" style={{ background: "#fff" }}>
                <div class="card-body mb-5">
                  <div>
                    <div style={{ float: 'left', boxShadow: '1px 1px 5px grey', width: boxWidth * screen / mCalc + 'vw', height: boxHeight * screen / mCalc + 'vw', border: '1px solid #333' }}>
                      {[...Array(numFrames)].map((_, index) => (
                        <div style={{ float: 'left', margin: '5px', border: '1px solid #333', width: `calc(${boxWidth * screen / mCalc / numFrames + 'vw'} - 12px)`, height: `calc(${boxHeight * screen / mCalc + 'vw'} - 12px)`, position: 'relative' }}>
                          {/* outer corner lines start */}
                          <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-6.5px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                          <div style={{ height: '7px', width: '1px', float: 'left', marginTop: '-6.5px', marginLeft: '-4px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                          <div style={{ height: '9px', width: '1px', float: 'right', marginTop: getOuterBottom(boxHeight, screen, mCalc), marginRight: '-4px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop: getOuterBottom(boxHeight, screen, mCalc), marginLeft: '-4px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>
                          {/* outer corner lines end */}

                          {boxTop === 'on' && (

                            [...Array(numTopBoxes)].map((_, index) => (
                              <div style={{ display: 'flex', position: 'relative', width: `calc(${boxWidth * screen / mCalc / numFrames + 'vw'} - 23px)`, height: `calc(${(topnewHeights * screen / mCalc)}vw )`, margin: '5px' }}>
                                {[...Array(topFixedNum)].map((_, index) => (
                                  <div style={{ flex: '1', background: topsash[index].type === 'fixed' ? 'lightgreen' : 'lightblue', width: `calc(${topFixedWidth[index] * screen / mCalc / numFrames + 'vw'} - 18px)`, height: `calc(${(topnewHeights * screen / mCalc)}vw )`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px', position: 'relative' }}>
                                    {/* outer corner lines start for bottom sash*/}
                                    <div style={{ height: '9px', width: '1px', float: 'right', marginTop: '-8px', marginRight: '-4px', transform: 'rotate(45deg)', borderLeft: index === topsash.length - 1 ? '1px solid #333' : 'none' }}></div>
                                    <div style={{ height: '9px', width: '1px', float: 'left', marginTop: '-8px', marginLeft: '-4px', transform: 'rotate(-45deg)', borderLeft: index === 0 ? '1px solid #333' : 'none' }}></div>


                                    {topsash[index].type === 'shutter' ? (
                                      <>
                                        <img
                                          src={left}
                                          style={{
                                            float: 'left',
                                            marginTop: `calc(${(((topnewHeights) * screen / mCalc))}vw - 25px)`,
                                            marginLeft: '45%',
                                            width: screen === 3 ? '13px' : '8px',
                                            transform: 'rotate(-90deg)'
                                          }}
                                          onClick={() => changeHandle(index)}
                                          alt="Left Handle"
                                        />
                                        <div style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' }}>
                                          {/* Left Diagonal Line  */}
                                          <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(${Math.atan((topFixedWidth.length ? topFixedWidth[index] : boxWidth) / (2 * topnewHeights)) * (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>


                                          {/* Right Diagonal Line */}
                                          <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(-${Math.atan((topFixedWidth.length ? topFixedWidth[index] : boxWidth) / (2 * topnewHeights)) * (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>

                                        </div>
                                        {topsash[index].type === 'shutter' && grill === 'yes' && boxes(topnewHeights + 0.3)}
                                      </>
                                    ) : (
                                      <>
                                        {/* fixed plus  */}
                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                      </>
                                    )

                                    }
                                  </div>
                                ))}
                              </div>
                            ))
                          )}

                          <div style={{ display: 'flex' }}>
                            {[...Array(numSecondInnerBoxes)].map((_, index) => (

                              <div key={index} onClick={() => shutterChange(index)} style={{ height: `calc(${(boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc}vw - ${boxTop === 'on' ? '29px' : '24px'})`, width: `calc(${newWidths[index] * screen / mCalc}vw )`, backgroundColor: boxNames[index] === 'Shutter' ? 'lightblue' : "lightgreen", marginTop: boxTop === 'on' ? '0px' : '5px', marginRight: index === numSecondInnerBoxes - 1 ? '5px' : '2.5px', marginLeft: index === 0 ? '5px' : '2.5px', border: '1px solid #333', position: 'relative' }}>
                                {/* Inner corner lines start */}
                                <div key={index} style={{ height: '8px', width: '1px', float: 'left', marginTop: `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen) / mCalc}vw - ${boxTop === 'on' ? '31px' : '27px'})`, marginLeft: '-4px', transform: 'rotate(45deg)', borderLeft: index === 0 ? '1px solid black' : 'none' }}></div>
                                <div key={index} style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen) / mCalc}vw - ${boxTop === 'on' ? '31px' : '27px'})`, marginRight: '-4px', transform: 'rotate(-45deg)', borderRight: '1px solid black' }}></div>
                                <div key={index} style={{ height: '8px', width: '1px', float: 'left', marginTop: '-7px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: index === 0 ? '1px solid #333' : 'none' }}></div>
                                <div style={{ height: '8px', width: '1px', float: 'right', marginTop: '-7px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                                {/* <div style={{ height: '7px', width: '1px', float: 'left', marginTop: getInnerBottom(boxHeight - topnewHeights - bottomnewHeights, screen, mCalc), marginLeft: '-4px', transform: 'rotate(-45deg)', borderLeft: index === 0 ? 'transparent' : '1px solid black' }}></div> */}
                                {/* <div style={{ height: '9px', width: '1px', float: 'right', marginTop: getInnerBottom(boxHeight - topnewHeights - bottomnewHeights, screen, mCalc), marginRight: '-4px', transform: 'rotate(-45deg)', borderLeft: index === 2 ? '1px solid black' : 'none' }}></div> */}
                                <div style={{ height: '7px', width: '1px', float: 'right', marginTop: `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen) / mCalc}vw - ${boxBottom === 'on' ? '33px' : '27px'})`, marginRight: '-4px', transform: 'rotate(-45deg)', borderRight: index === -1 ? '1px solid black' : 'none' }}></div>
                                <div style={{ height: '7px', width: '1px', float: 'left', right: '0px', marginTop: '-6px', marginLeft: '-1px', borderLeft: index === 0 ? 'none' : '1px solid #333' }}></div>
                                {/* Inner corner lines ends */}
                                <div style={{
                                  position: 'absolute',
                                  height: '7px',
                                  width: '1px',
                                  float: 'right',
                                  right: '0px',
                                  marginTop: '-6px',
                                  marginRight: '-1px',
                                  // background: index === numSecondInnerBoxes.length-1 ? 'black' : 'transparent',
                                }}></div>

                                <div style={{
                                  height: '7px',
                                  width: '1px',
                                  float: 'left',
                                  right: '0px',
                                  marginTop: `calc(${(boxHeight - topnewHeights - bottomnewHeights) * screen/mCalc}vw - ${boxTop === 'on' ? '31px' : '27px'} )`,
                                  marginLeft: '-1px',
                                  borderRight: (index === 0 || index === numSecondInnerBoxes.length - 1) ? 'none' : '1px solid #333',
                                }}></div>

                                <div className="expanding-arrow-line" style={{
                                  position: 'absolute',
                                  float: 'left',
                                  width: `calc(${(newWidths[index] * screen / mCalc)}vw - 15px)`,
                                  bottom: '-10px',
                                  top: `calc(${boxHeight * screen / mCalc}vw )`,
                                }}

                                >
                                  <div className="arrow-left"></div>
                                  <div className="line" align="center">
                                    <div style={{ marginTop: '-7px', background: 'white', maxWidth: '60px', textAlign: 'center' }}><p>{parseFloat(newWidths[index] / numFrames).toFixed(2)}</p></div>
                                  </div>
                                  <div className="arrow-right"></div>
                                </div>





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
                                  <img src={meshimg} style={{ position: 'absolute', left: 0, width: screen === 3 ? '40px' : '20px', float: 'left', marginTop: screen === 3 ? `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc)}vw - ${boxTop === 'on' ? '72px' : '67px'} )` : `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc)}vw - 51px)` }} />
                                )}

                                {mesh === 'yes' && boxNames[index] === 'Shutter' && boxHandle[index] === 'right' && (
                                  <img src={meshimg} style={{ width: screen === 3 ? '40px' : '20px', float: 'left', marginLeft: screen === 3 ? boxHandle[index] === 'right' ? '-1px' : '0px' : boxHandle[index] === 'right' ? '0px' : 'px', marginTop: screen === 3 ? `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc)}vw - ${boxTop === 'on' ? '72px' : '67px'} )` : `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc)}vw - 51px)` }} />
                                )}

                                {boxNames[index] === 'Shutter' && grill === 'yes' && boxes(boxHeight - topnewHeights - bottomnewHeights)}

                              </div>

                            ))}

                          </div>


                          {boxBottom === 'on' && (
                            [...Array(numBottomBoxes)].map((_, index) => (
                              <div style={{ display: 'flex', width: `calc(${boxWidth * screen / mCalc / numFrames + 'vw'} - 23px)`, height: `calc(${(bottomnewHeights * screen / mCalc) + 'vw'} -10px)`, margin: '5px' }}>
                                {[...Array(bottomFixedNum)].map((_, index) => (
                                  <div style={{ flex: '1', background: bottomsash[index].type === 'fixed' ? 'lightgreen' : 'lightblue', width: `calc(${bottomFixedWidth[index] * screen / mCalc / numFrames + 'vw'} - 18px)`, height: `calc(${(bottomnewHeights * screen / mCalc) + 'vw'} - 5px)`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px', position: 'relative' }}>
                                    {/* outer corner lines start for bottom sash*/}
                                    <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${bottomnewHeights * screen / mCalc}vw - 8px)`, marginRight: '-4px', transform: 'rotate(-45deg)', borderRight: index === bottomsash.length - 1 ? '1px solid #333' : 'none' }}></div>
                                    <div style={{ height: '8px', width: '1px', float: 'left', marginTop: `calc(${bottomnewHeights * screen / mCalc}vw - 8px)`, marginLeft: '-4px', transform: 'rotate(45deg)', borderLeft: index === 0 ? '1px solid #333' : 'none' }}></div>
                                    {/* outer corner lines end */}
                                    {bottomsash[index].type === 'shutter' ?
                                      <>
                                        <img src={left} style={{ float: 'left', marginTop: `calc(${(((topnewHeights) * screen / mCalc))}vw - 25px)`, marginLeft: '45%', width: screen === 3 ? '13px' : '8px', transform: 'rotate(-90deg)' }} onClick={() => changeHandle(index)} alt="Left Handle" />

                                        {bottomsash[index].type === 'shutter' && grill === 'yes' && boxes(topnewHeights + 0.3)}
                                      </> :
                                      <>
                                        {/* fixed plus  */}
                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                      </>
                                    }
                                  </div>
                                ))}
                              </div>
                            ))
                          )}


                          {numSecondInnerBoxes === 0 ? (
                            <div className="expanding-arrow-line" style={{ float: 'left', marginLeft: '-5px', width: ((parseFloat(boxWidth) / numFrames) * screen / mCalc) + 'vw', top: (parseFloat(boxHeight) - newHeights) * screen / mCalc + 'vw', }} >
                              <div className="arrow-left"></div>
                              <div className="line" align="center">
                                <div style={{ marginTop: '-8px', background: 'white', maxWidth: '60px', textAlign: 'center' }}><p>{typeof (parseFloat(boxWidth) / numFrames) === 'number' ? (parseFloat(boxWidth) / numFrames).toFixed(2) : (parseFloat(boxWidth) / numFrames)}</p></div>
                              </div>
                              <div className="arrow-right"></div>
                            </div>
                          ) : (
                            <div className="expanding-arrow-line" style={{ float: 'left', marginLeft: '-5px', width: ((parseFloat(boxWidth) / numFrames) * screen / mCalc) + 'vw', bottom: '-10px', top: '50px', }} >
                              <div className="arrow-left"></div>
                              <div className="line" align="center">
                                <div style={{ marginTop: '-8px', background: 'white', maxWidth: '60px', textAlign: 'center' }}><p>{typeof (parseFloat(boxWidth) / numFrames) === 'number' ? (parseFloat(boxWidth) / numFrames).toFixed(2) : (parseFloat(boxWidth) / numFrames)}</p></div>
                              </div>
                              <div className="arrow-right"></div>
                            </div>
                          )}

                        </div>
                      ))}
                    </div>
                    <div style={{ width: "45px", float: "left", paddingLeft: "15px", textAlign: "left", }}>
                      {boxTop === "on" && (
                        <>
                          <div className="expanding-arrow-line" style={{ float: "left", height: `calc(${(topnewHeights * screen) / mCalc}vw + 10px)`, top: "0", position: "relative", }}>
                            <div className="arrow-up" style={{ borderBottom: "3px solid black", borderLeft: "5px solid transparent", borderRight: "5px solid transparent", position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)", }}></div>
                            <div className="line" style={{ width: "1px", height: "100%", marginLeft: "0px", position: "absolute", top: "0", }}>
                              <div style={{ marginLeft: "-10px", marginTop: topnewHeights * (screen / mCalc / 2) + "vw", background: "white", maxWidth: "60px", textAlign: "left", }} >
                                <p style={{ width: "50px" }}>{typeof topnewHeights === "parseFloat" ? topnewHeights.toFixed(2) : topnewHeights}</p>
                              </div>
                            </div>
                            <div className="arrow-down" style={{ borderTop: "3px solid black", borderLeft: "5px solid transparent", borderRight: "5px solid transparent", position: "absolute", bottom: "0", left: "50%", transform: "translateX(-50%)", }}></div>
                          </div>
                          <div
                            className="expanding-arrow-line"
                            style={{ float: "left", height: `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen) / mCalc}vw - ${boxTop === "on" ? "30px" : "15px"})`, top: `calc(${(topnewHeights * screen) / mCalc}vw + ${boxTop === "on" ? "15px" : "0px"})`, position: "relative", }}
                          >
                            <div className="arrow-up"
                              style={{ borderBottom: "3px solid black", borderLeft: "5px solid transparent", borderRight: "5px solid transparent", position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)", }}></div>
                            <div className="line" style={{ width: "1px", height: "100%", marginLeft: "0px", position: "absolute", top: "0", }}>
                              <div style={{ marginLeft: "-10px", marginTop: (boxHeight - topnewHeights - bottomnewHeights) * (screen / mCalc / 2 - screen / mCalc / 8) + "vw", background: "white", maxWidth: "60px", textAlign: "left", }}>
                                <p style={{ width: "50px" }}>
                                  {typeof (boxHeight - topnewHeights - bottomnewHeights) === "parseFloat" ? (boxHeight - topnewHeights - bottomnewHeights).toFixed(2) : boxHeight - topnewHeights - bottomnewHeights}
                                </p>
                              </div>
                            </div>
                            <div className="arrow-down" style={{ borderTop: "3px solid black", borderLeft: "5px solid transparent", borderRight: "5px solid transparent", position: "absolute", bottom: "0", left: "50%", transform: "translateX(-50%)", }}></div>
                          </div>
                        </>
                      )}

                      {boxBottom === "on" && (
                        <>
                          <div className="expanding-arrow-line" style={{ float: "left", height: `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen) / mCalc}vw - ${boxTop === "on" ? "30px" : "15px"})`, top: `calc(${(topnewHeights * screen) / mCalc}vw + ${boxTop === "on" ? "15px" : "0px"})`, position: "relative", }}>
                            <div className="arrow-up" style={{ borderBottom: "3px solid black", borderLeft: "5px solid transparent", borderRight: "5px solid transparent", position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)", }}></div>
                            <div className="line" style={{ width: "1px", height: "100%", marginLeft: "0px", position: "absolute", top: "0", }} >
                              <div style={{ marginLeft: "-10px", marginTop: (boxHeight - topnewHeights - bottomnewHeights) * (screen / mCalc / 2 - screen / mCalc / 8) + "vw", background: "white", maxWidth: "60px", textAlign: "left", }}>
                                <p style={{ width: "50px" }}>
                                  {typeof (boxHeight - topnewHeights - bottomnewHeights) === "parseFloat" ? (boxHeight - topnewHeights - bottomnewHeights).toFixed(2) : boxHeight - topnewHeights - bottomnewHeights}
                                </p>
                              </div>
                            </div>
                            <div className="arrow-down" style={{ borderTop: "3px solid black", borderLeft: "5px solid transparent", borderRight: "5px solid transparent", position: "absolute", bottom: "0", left: "50%", transform: "translateX(-50%)", }}></div>
                          </div>
                          <div className="expanding-arrow-line" style={{ float: "left", height: `calc(${(bottomnewHeights * screen) / mCalc}vw + 5px)`, top: `calc(${((boxHeight - bottomnewHeights) * screen) / mCalc}vw - ${boxTop === "on" ? "10px" : "10px"})`, position: "relative", }}>
                            <div className="arrow-up" style={{ borderBottom: "3px solid black", borderLeft: "5px solid transparent", borderRight: "5px solid transparent", position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)", }}></div>
                            <div className="line" style={{ width: "1px", height: "100%", marginLeft: "0px", position: "absolute", top: "0", }}>
                              <div style={{ marginLeft: "-10px", marginTop: bottomnewHeights * (screen / mCalc / 2 - screen / mCalc / 8) + "vw", background: "white", maxWidth: "60px", textAlign: "left", }}>
                                <p style={{ width: "50px" }}>
                                  {typeof bottomnewHeights === "parseFloat" ? bottomnewHeights.toFixed(2) : bottomnewHeights}
                                </p>
                              </div>
                            </div>
                            <div className="arrow-down" style={{ borderTop: "3px solid black", borderLeft: "5px solid transparent", borderRight: "5px solid transparent", position: "absolute", bottom: "0", left: "50%", transform: "translateX(-50%)", }}></div>
                          </div>
                        </>
                      )}
                    </div>

                    <div style={{ width: "30px", float: "left", paddingLeft: boxBottom === "on" || boxTop === "on" ? "0px" : "15px", textAlign: "left", }}>
                      <div className="expanding-arrow-line" style={{ float: "left", height: `calc(${(boxHeight * screen) / mCalc}vw)`, top: "0", position: "relative", }}>
                        <div className="arrow-up" style={{ borderBottom: "3px solid black", borderLeft: "5px solid transparent", borderRight: "5px solid transparent", position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)", }}></div>
                        <div className="line" style={{ width: "1px", height: "100%", marginLeft: "0px", position: "absolute", top: "0", }}>
                          <div style={{ marginLeft: "-10px", marginTop: boxHeight * (screen / mCalc / 2) + "vw", background: "white", maxWidth: "60px", textAlign: "left", }}>
                            <p style={{ width: "50px" }}>
                              {parseFloat(boxHeight).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="arrow-down" style={{ borderTop: "3px solid black", borderLeft: "5px solid transparent", borderRight: "5px solid transparent", position: "absolute", bottom: "0", left: "50%", transform: "translateX(-50%)", }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {shutterCount === 0 ? (
                <></>
              ) : (
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      {[...Array(numSecondInnerBoxes)].map((_, index) => (
                        <div className="col-md-6 col-xxl-4 col-xl-4" key={index}>
                          <p>{boxNames?.[index] || 'N/A'}</p>
                          <div className="input-group mb-2">
                            <input type="parseFloat" step="0.01" className="form-control" value={newWidths?.[index] || ''} onChange={(e) => handleInputChange(index, e.target.value)
                            }
                            />
                            <button
                              className="btn btn-danger"
                              type="button"
                              onClick={() => deleteInnerBox(index)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                            {boxNames?.[index] === "Shutter" &&
                              (boxHandle?.[index] === "left" ? (
                                <button
                                  className="btn btn-outline-secondary"
                                  type="button"
                                  onClick={() => changeHandle(index)}
                                >
                                  <i className="fas fa-angle-left me-2"></i>
                                </button>
                              ) : (
                                <button
                                  className="btn btn-outline-secondary"
                                  type="button"
                                  onClick={() => changeHandle(index)}
                                >
                                  <i className="fas fa-angle-right me-2"></i>
                                </button>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>


                    {boxTop === 'on' &&
                      <div class="row mt-2">
                        <p>Top</p>
                        {topsash?.map((sash, index) =>
                          <div class="col-md-6 col-xxl-3 col-xl-3" key={index}>
                            <button className={`btn ${sash.type === 'fixed' ? 'btn-success' : 'btn-primary'} w-100`} type="button" onClick={() => changeTopSah(index)}>{sash.type === 'fixed' ? 'Fixed' : 'Shutter'}</button>
                          </div>
                        )}
                      </div>
                    }
                    {boxBottom === 'on' &&
                      <div class="row mt-2">
                        <p>Bottom</p>
                        {bottomsash.map((sash, index) =>
                          <div class="col-md-6 col-xxl-3 col-xl-3" key={index}>
                            <button className={`btn ${sash.type === 'fixed' ? 'btn-success' : 'btn-primary'} w-100`} type="button" onClick={() => changeBottomSah(index)}>{sash.type === 'fixed' ? 'Fixed' : 'Shutter'}</button>
                          </div>
                        )}
                      </div>
                    }
                  </div>
                </div>
              )}
            </div>


            {/* Top Sash Functionality */}
            {/* {(topsash) && topsash?.length > 0 && (
              <div className="row mt-2">
                {topsash?.map((sash, index) => (
                  <div
                    className="col-md-6 col-xxl-3 col-xl-3"
                    key={index}
                  >
                    <button
                      className={`btn ${sash.type === "fixed"
                          ? "btn-success"
                          : "btn-primary"
                        } w-100`}
                      type="button"
                      onClick={() => changeTopSah(index)}
                    >
                      {sash.type === "fixed" ? "Fixed" : "Shutter"}
                    </button>
                  </div>
                ))}
              </div>
            )} */}
            {/* </div>
    </div>
  )}
  </div> */}

            {numSecondInnerBoxes === 0 ? (
              <div></div>
            ) : (
              <>
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
                            <td>{shutterCount}{mesh === 'yes' ? '.5' : ''} Track Outer Frame</td>
                            <td class="container-line">
                              <select class="mb-3 form-select-select item-line w-25" value={selectedFrameSeries || ''} onChange={handleFrameSeriesChange}>
                                <option value="">Select Series</option>
                                {profileData && profileData.map(seriesId => (
                                  <option key={seriesId.series} value={seriesId.series}>{seriesId.series}</option>
                                ))}
                              </select>
                              <select class="mb-3 form-select-select item-line w-75" value={selectedFrameId || ''} onChange={handleFrameIdChange}>
                                {selectedFrameSeries ? (<option value="">Select ID</option>) : (<option value="">Select Series First</option>)}
                                {selectedFrameSeries && seriesDataFrame?.items && seriesDataFrame?.items?.map((item) => (
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
                                {seriesDataShutter && seriesDataShutter?.items?.map((item) => (
                                  <option key={item.id} value={item.id}>{item.id + ' - ' + item.name}</option>
                                ))}
                              </select>
                            </td>
                            <td>{numeral((parseFloat(Shutter()) + parseFloat(topShutter()) + parseFloat(bottomShutter())) * qty).format('0,0.00')}</td>
                            <td>{numeral(values.shutter.rqm * qty).format('0,0.00')}</td>
                            <td>{numeral(values.shutter.rpm * qty).format('0,0.00')}</td>
                            <td>{numeral(values.shutter.amount * qty).format('0,0.00')}</td>
                          </tr>
                          {mesh === 'yes' && (

                            <tr>
                              <td>Mesh Sash</td>
                              <td class="container-line">
                                <select class="mb-3 form-select-select item-line w-25" value={selectedMeshSeries || ''} onChange={handleMeshSeriesChange}>
                                  <option value="">Select Series</option>
                                  {profileData && profileData.map(seriesId => (
                                    <option key={seriesId.series} value={seriesId.series}>{seriesId.series}</option>
                                  ))}
                                </select>
                                <select class="mb-3 form-select-select item-line w-75" value={selectedMeshId || ''} onChange={handleMeshIdChange}>
                                  {selectedMeshSeries ? (<option value="">Select ID</option>) : (<option value="">Select Series </option>)}
                                  {seriesDataMesh && seriesDataMesh?.items?.map((item) => (
                                    <option key={item.id} value={item.id}>{item.id + ' - ' + item.name}</option>
                                  ))}
                                </select>
                              </td>
                              <td>{numeral(meshFrame() * qty).format('0,0.00')}</td>
                              <td>{numeral(values.meshFrame.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.meshFrame.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.meshFrame.amount * qty).format('0,0.00')}</td>
                            </tr>

                          )}


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
                                {selectedMullionSeries ? (<option value="">Select ID</option>) : (<option value="">Select Series </option>)}
                                {seriesDataMullion && seriesDataMullion?.items?.map((item) => (
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
                                {seriesDataBeeding && seriesDataBeeding?.items?.map((item) => (
                                  <option key={item.id} value={item.id}>{item.id + ' - ' + item.name}</option>
                                ))}
                              </select>
                            </td>
                            <td>{numeral(Beeding() * qty).format('0,0.00')}</td>
                            <td>{numeral(values.beeding.rqm * qty).format('0,0.00')}</td>
                            <td>{numeral(values.beeding.rpm * qty).format('0,0.00')}</td>
                            <td>{numeral(values.beeding.amount * qty).format('0,0.00')}</td>
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
                                {seriesDataInterLock && seriesDataInterLock?.items?.map((item) => (
                                  <option key={item.id} value={item.id}>{item.id + ' - ' + item.name}</option>
                                ))}
                              </select>
                            </td>
                            <td>{numeral(interLock() * qty).format('0,0.00')}</td>
                            <td>{numeral(values.interLock.rqm * qty).format('0,0.00')}</td>
                            <td>{numeral(values.interLock.rpm * qty).format('0,0.00')}</td>
                            <td>{numeral(values.interLock.amount * qty).format('0,0.00')}</td>
                          </tr>

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
                                  {seriesDataCupler && seriesDataCupler?.items?.map((item) => (
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
                            <th ><select class="form-select-select item-line w-75" value={ProfilegasketCost} onChange={ProfilegasketChange}>
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
                            <th ><select class="form-select-select item-line w-75" value={ShuttergasketCost} onChange={ShuttergasketChange}>
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
                            <td>Mullion Gasket</td>
                            <th ><select class="form-select-select item-line w-75" value={MulliongasketCost} onChange={MulliongasketChange}>
                              <option value="" hidden>Select Model</option>
                              {MulliongasketValues && Object.entries(MulliongasketValues).map(([key, { label, value }]) => (
                                <option key={key} value={value}>{label + ' - ₹ ' + value}</option>
                              ))}
                            </select>
                            </th>
                            <td>{numeral(Mullion() * qty).format('0,0.00')}</td>
                            <td>{numeral(values.mullionGasket.rqm * qty).format('0,0.00')}</td>
                            <td>{numeral(values.mullionGasket.rpm * qty).format('0,0.00')}</td>
                            <td>{numeral(values.mullionGasket.amount * qty).format('0,0.00')}</td>
                          </tr>
                          <tr>
                            <td>Beeding Gasket</td>
                            <th ><select class="form-select-select item-line w-75" value={BeedinggasketCost} onChange={BeedinggasketChange}>
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
                          {mesh === 'yes' && (

                            <tr>
                              <td >Mesh Gasket</td>
                              <th ><select class="form-select-select item-line w-75" value={meshgasketCost} onChange={meshgasketChange}>
                                <option value="" hidden>Select Model</option>
                                {Object.entries(meshgasketValues).map(([key, { label, value }]) => (
                                  <option key={key} value={value}>{label + ' - ₹ ' + value}</option>
                                ))}
                              </select>
                              </th>
                              <td>{numeral(meshGasket() * qty).format('0,0.00')}</td>
                              <td>{numeral(values.meshGasket.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.meshGasket.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.meshGasket.amount * qty).format('0,0.00')}</td>
                            </tr>

                          )}


                          <tr>
                            <td colspan="5">Total</td>
                            <td>{numeral(frameTotal * qty).format('0,0.00')}</td>
                          </tr>
                          <tr>
                            {/* <th colspan="6">Wastage ( {data.wastage}% )</th> */}
                            <th>Wastage( {data.wastage}% )</th>
                            <th ><select class="form-select-select item-line w-75" value={wastageCost} onChange={wasteChange}>
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
                      <table
                        id="left-right-fix"
                        class="table stripe row-border order-column"
                      >
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
                              <select
                                class="form-select-select item-line w-75"
                                value={steelFramCost}
                                onChange={steelframeChange}
                              >
                                <option value="" hidden>
                                  Select Model
                                </option>
                                {steelValues &&
                                  Object.entries(steelValues).map(
                                    ([key, { label, value }]) => (
                                      <option key={key} value={value}>
                                        {label + " - ₹ " + value}
                                      </option>
                                    )
                                  )}
                              </select>
                            </td>
                            <td>
                              {numeral(values.steelFrame.qty * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.steelFrame.price * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.steelFrame.amount * qty).format(
                                "0,0.00"
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>Steel Shutter</td>
                            <td>
                              <select
                                class="form-select-select item-line w-75"
                                value={steelShutterCost}
                                onChange={steelShutteChange}
                              >
                                <option value="" hidden>
                                  Select Model
                                </option>
                                {steelShutterValues &&
                                  Object.entries(steelShutterValues).map(
                                    ([key, { label, value }]) => (
                                      <option key={key} value={value}>
                                        {label + " - ₹ " + value}
                                      </option>
                                    )
                                  )}
                              </select>
                            </td>
                            <td>
                              {numeral(values.steelShutter.qty * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.steelShutter.price * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.steelShutter.amount * qty).format(
                                "0,0.00"
                              )}
                            </td>
                          </tr>

                          <tr>
                            <td>Steel Mullion</td>
                            <td>
                              <select
                                class="form-select-select item-line w-75"
                                value={steelMullionCost}
                                onChange={steelMullionChange}
                              >
                                <option value="" hidden>
                                  Select Model
                                </option>
                                {steelMullionValues &&
                                  Object.entries(steelMullionValues).map(
                                    ([key, { label, value }]) => (
                                      <option key={key} value={value}>
                                        {label + " - ₹ " + value}
                                      </option>
                                    )
                                  )}
                              </select>
                            </td>

                            <td>
                              {numeral(values.steelMullion.qty * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.steelMullion.price * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.steelMullion.amount * qty).format(
                                "0,0.00"
                              )}
                            </td>
                          </tr>

                          <tr>
                            <td>Mullion Clamp</td>
                            <td>
                              <select
                                class="form-select-select item-line w-75"
                                value={mullionClampCost}
                                onChange={mullionClampChange}
                              >
                                <option value="" hidden>
                                  Select Model
                                </option>
                                {mullionClampValues &&
                                  Object.entries(mullionClampValues).map(
                                    ([key, { label, value }]) => (
                                      <option key={key} value={value}>
                                        {label + " - ₹ " + value}
                                      </option>
                                    )
                                  )}
                              </select>
                            </td>

                            <td>
                              {numeral(values.mullionclamp.qty * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.mullionclamp.price * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.mullionclamp.amount * qty).format(
                                "0,0.00"
                              )}
                            </td>
                          </tr>

                          {mesh === "yes" && (
                            <>
                              <tr>
                                <td>Steel Mesh</td>
                                <td>
                                  <select
                                    class="form-select-select item-line w-75"
                                    value={steelmeshCost}
                                    onChange={steelmeshChange}
                                  >
                                    <option value="" hidden>
                                      Select Model
                                    </option>
                                    {steelmeshValues &&
                                      Object.entries(steelmeshValues).map(
                                        ([key, { label, value }]) => (
                                          <option key={key} value={value}>
                                            {label + " - ₹ " + value}
                                          </option>
                                        )
                                      )}
                                  </select>
                                </td>
                                <td>
                                  {numeral(values.steelMesh.qty * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                                <td>
                                  {numeral(values.steelMesh.price * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                                <td>
                                  {numeral(
                                    values.steelMesh.amount * qty
                                  ).format("0,0.00")}
                                </td>
                              </tr>

                              <tr>
                                <td>Mesh Jump Arrester</td>
                                <td>
                                  <select
                                    class="form-select-select item-line w-75"
                                    value={meshJACost}
                                    onChange={meshJAChange}
                                  >
                                    <option value="" hidden>
                                      Select Model
                                    </option>
                                    {meshJAValues &&
                                      Object.entries(meshJAValues).map(
                                        ([key, { label, value }]) => (
                                          <option key={key} value={value}>
                                            {label + " - ₹ " + value}
                                          </option>
                                        )
                                      )}
                                  </select>
                                </td>
                                <td>
                                  {numeral(values.meshja.qty * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                                <td>
                                  {numeral(values.meshja.price * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                                <td>
                                  {numeral(values.meshja.amount * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                              </tr>
                            </>
                          )}
                          {grill === "yes" && (
                            <tr>
                              <td>Grill</td>
                              <td>
                                <select
                                  class="form-select-select item-line w-75"
                                  value={grillCost}
                                  onChange={grillChange}
                                >
                                  <option value="" hidden>
                                    Select Model
                                  </option>
                                  {grillValues &&
                                    Object.entries(grillValues).map(
                                      ([key, { label, value }]) => (
                                        <option key={key} value={value}>
                                          {label + " - ₹ " + value}
                                        </option>
                                      )
                                    )}
                                </select>
                              </td>
                              <td>
                                {numeral(values.grill.qty * qty).format(
                                  "0,0.00"
                                )}
                              </td>
                              <td>
                                {numeral(values.grill.price * qty).format(
                                  "0,0.00"
                                )}
                              </td>
                              <td>
                                {numeral(values.grill.amount * qty).format(
                                  "0,0.00"
                                )}
                              </td>
                            </tr>
                          )}
                          <tr>
                            <td>Friction Stay</td>
                            <td>
                              <select
                                class="form-select-select item-line w-75"
                                value={frictionStayCost}
                                onChange={frictionStayChange}
                              >
                                <option value="">Select Model</option>
                                {frictionStayValues &&
                                  Object.entries(frictionStayValues).map(
                                    ([key, { label, value }]) => (
                                      <option key={key} value={value}>
                                        {label + " - ₹ " + value}
                                      </option>
                                    )
                                  )}
                              </select>
                            </td>
                            <td>
                              {numeral(values.frictionstay.qty * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.frictionstay.price * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.frictionstay.amount * qty).format(
                                "0,0.00"
                              )}
                            </td>
                          </tr>

                          <tr>
                            <td>Espag with SS Receiver</td>
                            <td>
                              <select
                                class="form-select-select item-line w-75"
                                value={espagCost}
                                onChange={espagChange}
                              >
                                <option value="">Select Model</option>
                                {espagValues &&
                                  Object.entries(espagValues).map(
                                    ([key, { label, value }]) => (
                                      <option key={key} value={value}>
                                        {label + " - ₹ " + value}
                                      </option>
                                    )
                                  )}
                              </select>
                            </td>
                            <td>
                              {numeral(values.espag.qty * qty).format("0,0.00")}
                            </td>
                            <td>
                              {numeral(values.espag.price * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.espag.amount * qty).format(
                                "0,0.00"
                              )}
                            </td>
                          </tr>

                          <tr>
                            <td>Aluminium Track</td>
                            <td>
                              <select
                                class="form-select-select item-line w-75"
                                value={alTrackCost}
                                onChange={alTrackChange}
                              >
                                <option value="" hidden>
                                  Select Model
                                </option>
                                {alTrackValues &&
                                  Object.entries(alTrackValues).map(
                                    ([key, { label, value }]) => (
                                      <option key={key} value={value}>
                                        {label + " - ₹ " + value}
                                      </option>
                                    )
                                  )}
                              </select>
                            </td>
                            <td>
                              {numeral(values.alTrack.qty * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.alTrack.price * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.alTrack.amount * qty).format(
                                "0,0.00"
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>Bump Arrester</td>
                            <td>
                              <select
                                class="form-select-select item-line w-75"
                                value={bArrestorCost}
                                onChange={bArrestorChange}
                              >
                                <option value="" hidden>
                                  Select Model
                                </option>
                                {bArrestorValues &&
                                  Object.entries(bArrestorValues).map(
                                    ([key, { label, value }]) => (
                                      <option key={key} value={value}>
                                        {label + " - ₹ " + value}
                                      </option>
                                    )
                                  )}
                              </select>
                            </td>
                            <td>
                              {numeral(values.bArrester.qty * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.bArrester.price * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.bArrester.amount * qty).format(
                                "0,0.00"
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>Jump Stopper</td>
                            <td>
                              <select
                                class="form-select-select item-line w-75"
                                value={jStopperCost}
                                onChange={jStopperChange}
                              >
                                <option value="" hidden>
                                  Select Model
                                </option>
                                {jStopperValues &&
                                  Object.entries(jStopperValues).map(
                                    ([key, { label, value }]) => (
                                      <option key={key} value={value}>
                                        {label + " - ₹ " + value}
                                      </option>
                                    )
                                  )}
                              </select>
                            </td>
                            <td>
                              {numeral(values.jStopper.qty * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.jStopper.price * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.jStopper.amount * qty).format(
                                "0,0.00"
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>Dust Arrester</td>
                            <td>
                              <select
                                class="form-select-select item-line w-75"
                                value={dArrestorCost}
                                onChange={dArrestorChange}
                              >
                                <option value="" hidden>
                                  Select Model
                                </option>
                                {dArrestorValues &&
                                  Object.entries(dArrestorValues).map(
                                    ([key, { label, value }]) => (
                                      <option key={key} value={value}>
                                        {label + " - ₹ " + value}
                                      </option>
                                    )
                                  )}
                              </select>
                            </td>
                            <td>
                              {numeral(values.dArrester.qty * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.dArrester.price * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.dArrester.amount * qty).format(
                                "0,0.00"
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>Grove Roller</td>
                            <td>
                              <select
                                class="form-select-select item-line w-75"
                                value={gRollCost}
                                onChange={gRollChange}
                              >
                                <option value="" hidden>
                                  Select Model
                                </option>
                                {gRollValues &&
                                  Object.entries(gRollValues).map(
                                    ([key, { label, value }]) => (
                                      <option key={key} value={value}>
                                        {label + " - ₹ " + value}
                                      </option>
                                    )
                                  )}
                              </select>
                            </td>
                            <td>
                              {numeral(values.gRoller.qty * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.gRoller.price * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.gRoller.amount * qty).format(
                                "0,0.00"
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>Touch Lock with SS Receiver</td>
                            <td>
                              <select
                                class="form-select-select item-line w-75"
                                value={touchlockCost}
                                onChange={touchLockChange}
                              >
                                <option value="">Select Model</option>
                                {touchLockValues &&
                                  Object.entries(touchLockValues).map(
                                    ([key, { label, value }]) => (
                                      <option key={key} value={value}>
                                        {label + " - ₹ " + value}
                                      </option>
                                    )
                                  )}
                              </select>
                            </td>
                            <td>
                              {numeral(values.touchlock.qty * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.touchlock.price * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.touchlock.amount * qty).format(
                                "0,0.00"
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>Weather Strip</td>
                            <td>
                              <select
                                class="form-select-select item-line w-75"
                                value={wStripCost}
                                onChange={wStripChange}
                              >
                                <option value="" hidden>
                                  Select Model
                                </option>
                                {wStripValues &&
                                  Object.entries(wStripValues).map(
                                    ([key, { label, value }]) => (
                                      <option key={key} value={value}>
                                        {label + " - ₹ " + value}
                                      </option>
                                    )
                                  )}
                              </select>
                            </td>
                            <td>
                              {numeral(values.wStrip.qty * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.wStrip.price * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.wStrip.amount * qty).format(
                                "0,0.00"
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>Screws/Misc</td>
                            <td>
                              <select
                                class="form-select-select item-line w-75"
                                value={screwtCost}
                                onChange={screwChange}
                              >
                                <option value="" hidden>
                                  Select Model
                                </option>
                                {screwValues &&
                                  Object.entries(screwValues).map(
                                    ([key, { label, value }]) => (
                                      <option key={key} value={value}>
                                        {label + " - ₹ " + value}
                                      </option>
                                    )
                                  )}
                              </select>
                            </td>
                            <td>
                              {numeral(values.screws.qty * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.screws.price * qty).format(
                                "0,0.00"
                              )}
                            </td>
                            <td>
                              {numeral(values.screws.amount * qty).format(
                                "0,0.00"
                              )}
                            </td>
                          </tr>
                          {mesh === "yes" && (
                            <>
                              <tr>
                                <td>Mesh 30A Grade</td>
                                <td>
                                  <select
                                    class="form-select-select item-line w-75"
                                    value={meshCost}
                                    onChange={meshChange}
                                  >
                                    <option value="" hidden>
                                      Select Model
                                    </option>
                                    {meshValues &&
                                      Object.entries(meshValues).map(
                                        ([key, { label, value }]) => (
                                          <option key={key} value={value}>
                                            {label + " - ₹ " + value}
                                          </option>
                                        )
                                      )}
                                  </select>
                                </td>
                                <td>
                                  {numeral(values.mesh.qty * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                                <td>
                                  {numeral(values.mesh.price * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                                <td>
                                  {numeral(values.mesh.amount * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td>Mesh Roller</td>
                                <td>
                                  <select
                                    class="form-select-select item-line w-75"
                                    value={meshRollCost}
                                    onChange={meshRollChange}
                                  >
                                    <option value="" hidden>
                                      Select Model
                                    </option>
                                    {meshRollValues &&
                                      Object.entries(meshRollValues).map(
                                        ([key, { label, value }]) => (
                                          <option key={key} value={value}>
                                            {label + " - ₹ " + value}
                                          </option>
                                        )
                                      )}
                                  </select>
                                </td>
                                <td>
                                  {numeral(values.mRoller.qty * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                                <td>
                                  {numeral(values.mRoller.price * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                                <td>
                                  {numeral(values.mRoller.amount * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                              </tr>
                            </>
                          )}
                          <tr>
                            <th colspan="4">Total</th>
                            <th>{numeral(hardTotal * qty).format("0,0.00")}</th>
                          </tr>
                          <tr>
                            <th colspan="4">Hardware Cost/Sqft</th>
                            <th>{numeral(hrps * qty).format("0,0.00")}</th>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {userType != "3" && (
                      <>
                        <hr />

                        <div class="card-header ">
                          <h5>Margin Cost</h5>
                        </div>
                        <div class="card-body">
                          <table
                            id="left-right-fix"
                            class="table stripe row-border order-column"
                          >
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
                                  <select
                                    class="form-select-select item-line w-75"
                                    value={marginCost}
                                    onChange={marginChange}
                                  >
                                    <option value="" hidden>
                                      Select Margin Cost
                                    </option>
                                    {margin &&
                                      Object.entries(margin).map(
                                        ([key, { label, value }]) => (
                                          <option key={key} value={value}>
                                            {label +
                                              " - ₹ " +
                                              parseFloat(value).toFixed(2) +
                                              "/sqft"}
                                          </option>
                                        )
                                      )}
                                  </select>
                                </td>
                                <td>
                                  {numeral(values.margin.qty * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                                <td>
                                  {numeral(values.margin.price * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                                <td>
                                  {numeral(values.margin.amount * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th colspan="4">Total</th>
                                <th>
                                  {numeral(marginTotal * qty).format("0,0.00")}
                                </th>
                              </tr>
                              <tr>
                                <th colspan="4">Margin Cost/Sqft</th>
                                <th>{numeral(mrps * qty).format("0,0.00")}</th>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <hr />

                        <div class="card-header">
                          <h5>Production Cost</h5>
                        </div>
                        <div class="card-body">
                          <table
                            id="left-right-fix"
                            class="table stripe row-border order-column"
                          >
                            <thead>
                              <tr>
                                <th colspan="3">Product Description</th>
                                <th width="10%">Req. Qty </th>
                                <th width="10%">Price</th>
                                <th width="10%">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td colspan="2">
                                  Markting OH <br />
                                  <small>(Site Visit, Messurement)</small>
                                </td>
                                <td>
                                  <select
                                    class="form-select-select item-line w-75"
                                    value={marketingCost}
                                    onChange={marketingChange}
                                  >
                                    <option value="" hidden>
                                      Select Marketing Coast
                                    </option>
                                    {marketing &&
                                      Object.entries(marketing).map(
                                        ([key, { label, value }]) => (
                                          <option key={key} value={value}>
                                            {label +
                                              " - ₹ " +
                                              parseFloat(value).toFixed(2) +
                                              "/sqft"}
                                          </option>
                                        )
                                      )}
                                  </select>
                                </td>
                                <td>
                                  {numeral(values.marketing.qty * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                                <td>
                                  {numeral(values.marketing.price * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                                <td>
                                  {numeral(
                                    values.marketing.amount * qty
                                  ).format("0,0.00")}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  Transport <br />
                                  <small>(Meterial Transportation)</small>
                                </td>
                                <td>
                                  <small>Distance in KM</small>
                                  <input
                                    type="parseFloat"
                                    class="form-control"
                                    value={distance}
                                    onChange={(e) =>
                                      setDistance(e.target.value)
                                    }
                                  />
                                </td>
                                <td>
                                  <select
                                    class="form-select-select item-line w-75"
                                    value={transportCost}
                                    onChange={transportChange}
                                  >
                                    <option value="" hidden>
                                      Select Margin Cost
                                    </option>
                                    {transport &&
                                      Object.entries(transport).map(
                                        ([key, { label, value }]) => (
                                          <option key={key} value={value}>
                                            {label +
                                              " - ₹ " +
                                              parseFloat(value).toFixed(2) +
                                              "/sqft"}
                                          </option>
                                        )
                                      )}
                                  </select>
                                </td>
                                <td>
                                  {numeral(values.transport.qty * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                                <td>
                                  {numeral(values.transport.price * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                                <td>
                                  {numeral(
                                    values.transport.amount * qty
                                  ).format("0,0.00")}
                                </td>
                              </tr>
                              <tr>
                                <td colspan="2">
                                  Labour (Factory)
                                  <br />
                                  <small>(Wages, Electricity, Rent)</small>
                                </td>
                                <td>
                                  <select
                                    class="form-select-select item-line w-75"
                                    value={labourFCost}
                                    onChange={labourFChange}
                                  >
                                    <option value="" hidden>
                                      Select Labour Coast
                                    </option>
                                    {labourF &&
                                      Object.entries(labourF).map(
                                        ([key, { label, value }]) => (
                                          <option key={key} value={value}>
                                            {label +
                                              " - ₹ " +
                                              parseFloat(value).toFixed(2) +
                                              "/sqft"}
                                          </option>
                                        )
                                      )}
                                  </select>
                                </td>
                                <td>
                                  {numeral(values.labourF.qty * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                                <td>
                                  {numeral(values.labourF.price * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                                <td>
                                  {numeral(values.labourF.amount * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td colspan="2">
                                  Labour (Site) <br />
                                  <small>
                                    (Sylicon, Errection Screws, Dummy Caps,
                                    Drain Hole Caps, Wages for Installation)
                                  </small>
                                </td>
                                <td>
                                  <select
                                    class="form-select-select item-line w-75"
                                    value={labourSCost}
                                    onChange={labourSChange}
                                  >
                                    <option value="" hidden>
                                      Select Labour Coast
                                    </option>
                                    {labourS &&
                                      Object.entries(labourS).map(
                                        ([key, { label, value }]) => (
                                          <option key={key} value={value}>
                                            {label +
                                              " - ₹ " +
                                              parseFloat(value).toFixed(2) +
                                              "/sqft"}
                                          </option>
                                        )
                                      )}
                                  </select>
                                </td>
                                <td>
                                  {numeral(values.labourS.qty * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                                <td>
                                  {numeral(values.labourS.price * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                                <td>
                                  {numeral(values.labourS.amount * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td colspan="2">Glass</td>
                                <td>
                                  <select
                                    class="form-select-select item-line w-75"
                                    value={glassCost}
                                    onChange={glassChange}
                                  >
                                    <option value="" hidden>
                                      Select Glass Cost
                                    </option>
                                    {glasses &&
                                      Object.entries(glasses).map(
                                        ([key, { label, value }]) => (
                                          <option key={key} value={value}>
                                            {label +
                                              " - ₹ " +
                                              parseFloat(value).toFixed(2) +
                                              "/sqft"}
                                          </option>
                                        )
                                      )}
                                  </select>
                                </td>
                                <td>
                                  {numeral(values.glass.qty * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                                <td>
                                  {numeral(values.glass.price * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                                <td>
                                  {numeral(values.glass.amount * qty).format(
                                    "0,0.00"
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th colspan="5">Total</th>
                                <th>
                                  {numeral(prodTotal * qty).format("0,0.00")}
                                </th>
                              </tr>
                              <tr>
                                <th colspan="5">Production Cost/Sqft</th>
                                <th>{numeral(prps * qty).format("0,0.00")}</th>
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
                            <h6 class="mb-1">
                              ₹ {numeral(grandTotal * qty).format("0,0.00")}
                            </h6>
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
                            <h6 class="mb-1">
                              ₹ {numeral(grandAps).format("0,0.00")}
                            </h6>
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
                            <button
                              class="btn btn-success w-100"
                              onClick={selectedProfiles}
                            >
                              Update
                            </button>
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
}
export default Editquotees;