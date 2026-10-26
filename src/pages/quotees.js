import React, { useEffect, useState } from 'react';
import { ReactSession } from 'react-client-session';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from "./navbar";
import Header from "./header";
import left from '../images/handleLeft.png';
import right from '../images/handleRight.png';
import meshimg from '../images/mesh.png';
import numeral from 'numeral';
import Handle from '../images/slideHandle.png';
import Fan from '../images/fan.png';
import './box.css';
ReactSession.setStoreType("localStorage");

function Quotees() {
  const urlParams = new URLSearchParams(window.location.search);
  const quoteIds = urlParams.get('id');
  const arrayvalue = urlParams.get('arrayValues');
  // console.log("url",arrayvalue);
  const [quoteData, setquoteData] = useState(null);
  const [state, setState] = useState(null);

  const [updatedData, setUpdatedData] = useState(null);

  const userId = ReactSession.get("upvcuserId");
  const userType = ReactSession.get("upvcuserType");
  const quoteId = ReactSession.get("upvcquoteId");
  const navigate = useNavigate();
  const indexPath = '/';
  const selectPath = '/select';


  useEffect(() => {
    if (userId === 0) {
      navigate(indexPath);
    }
  }, [userId, navigate]);


  const [measure, setMeasure] = useState('ft');
  const [mCalc, setMcalc] = useState(1);
  const [boxWidth, setBoxWidth] = useState(3);
 
  const [boxHeight, setBoxHeight] = useState(6);
  const [numFirstInnerBoxes, setNumFirstInnerBoxes] = useState(0);
  const [numFrames, setNumFrames] = useState(0);
  const [numSecondInnerBoxes, setNumSecondInnerBoxes] = useState(0);
  const [newHeights, setNewInnerBoxHeight] = useState(0);
  const [panelHeights, setpanelHeight] = useState(0);
  const [panelType, setpanelType] = useState(0);
  const [newWidths, setNewInnerBoxWidth] = useState([]);
  const [boxColors, setBoxColors] = useState([]);
  const [boxNames, setBoxNames] = useState([]);
  const [boxHandle, setBoxHandle] = useState([]);
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  const [screen, setScreen] = useState(deviceWidth > 700 ? 4 : 8);
  const [boxPosition, setBoxPosition] = useState('Bottom');
  const [shutterCount, setshutterCount] = useState(0);
  const [fixedCount, setfixedCount] = useState(0);
  const [bottomFrame, setBottomFrame] = useState('yes');
  const [mesh, setMesh] = useState('no');
  const [grill, setGrill] = useState('no');
  const [data, setData] = useState([]);
  const [values, setValues] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [frameTotal, setframeTotal] = useState(0);
  const [frameArea, setframeArea] = useState(0);
  const [hardTotal, sethardTotal] = useState(0);
  const [marginTotal, setmarginTotal] = useState(0);
  const [prodTotal, setprodTotal] = useState(0);
  const [wastage, setWastage] = useState([]);
  const [fanTop, setfanTop] = useState('Top');
  const [fanLeft, setfanLeft] = useState('Left');
  const [divider, setDevider] = useState('Vertical');
  const [switchs, setSwitch] = useState('on');
  const [switchFixed, setFixed] = useState('on');
  const [fanType, setfanType] = useState(1);
  const [item, setItem] = useState('');
  const [qty, setQty] = useState(0);
  const [topFixedWidth, settopFixedWidth] = useState([]);
  const [topFixedNum, settopFixedNum] = useState(0);
  const [bottomFixedWidth, setbottomFixedWidth] = useState([]);
  const [bottomFixedNum, setbottomFixedNum] = useState(0);
  const [boxTop, setboxTop] = useState('off');
  const [boxBottom, setboxBottom] = useState('off');
  const [numTopBoxes, setnumTopBoxes] = useState(0);
  const [numBottomBoxes, setnumBottomBoxes] = useState(0);
  const [topnewHeights, setTopBoxHeight] = useState(0);
  const [bottomnewHeights, setBottomBoxHeight] = useState(0);
  console.log("boxPosition",boxHeight);
  const [fan, setFan] = useState('on');
  const [topsash, setTopSash] = useState([]);
  const [bottomsash,setBottomsash]=useState([]);
  const[split,setSplit]=useState();
  const[shutterHeight,setShutterHeight]=useState();

  const [verticalMullion, setVertMullion] = useState([{ type: 'glass', size: boxHeight }]);
  const [horizontalMullion, setHoriMullion] = useState([{ type: 'glass', size: boxWidth }]);
  
  const [distance, setDistance] = useState(0);


  console.log(boxWidth, boxHeight);




  const Empid = ReactSession.get("upvcempid");
  let users = '';
  if (userType === '3') {
    users = Empid;
  } else {
    users = userId;
  }
  const user = { "userId": users };




  const fetchData = async () => {
    try {
      const response = await axios.post('https://upvcapi.sninfoserv.com/all-quotes/', user);
      setquoteData(response.data);
      // console.log("String",response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };




  useEffect(() => {
    fetchData();
  }, []);

  const filteredQuotes = quoteData && quoteData.data.filter(quote => quote.quoteId === quoteIds);


  useEffect(() => {
    if (filteredQuotes) {
      setState(filteredQuotes[0].quoteDetails[arrayvalue].quoteData)


    }


  }
    , [filteredQuotes])
  console.log(filteredQuotes) 






  useEffect(() => {
    if (state) {
      setTopSash(state?.topsash);
      setBottomsash(state?.bottomsash);
      setSplit(state?.split);
      setShutterHeight(state?.shutterHeight);
      setMeasure(state.measure)
      // setBoxHeight(state.boxHeight);

      if (measure === 'mm') {
       setBoxWidth(state.boxWidths * 304.8);
      setBoxHeight(state.boxHeights * 304.8);
      setMcalc(304.8);
    } else {
      setBoxHeight(state.boxHeights);
       setBoxWidth(state.boxWidths);
       setMcalc(1);
    }

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
     
      setNumFirstInnerBoxes(state.numFirstInnerBoxes);
      setNumFrames(state.numFrames);
      setNumSecondInnerBoxes(state.numSecondInnerBoxes);
      // setNewInnerBoxHeight(state.newHeights);
      // setNewInnerBoxWidth(state.newWidths);
      setBoxColors(state.boxColors);
      setBoxNames(state.boxNames);
      setBoxHandle(state.boxHandle);
      setDeviceWidth(state.deviceWidth);
      setScreen(state.screen);
      setBoxPosition(state.boxPosition);
      setMesh(state.mesh);
      setGrill(state.grill);
      setData(state.data);
      setValues(state.values);
      setGrandTotal(state.grandTotal);
      setframeTotal(state.frameTotal);
      sethardTotal(state.hardTotal);
      setmarginTotal(state.marginTotal);
      setprodTotal(state.prodTotal);
      setWastage(state.wastage);
      setfanTop(state.fanTop);
      setfanLeft(state.fanLeft);
      setDevider(state.divider);
      setSwitch(state.switchs);
      setFixed(state.switchFixed);
      setFan(state.fan);
      setfanType(state.fanType);
      setshutterCount(state.shutterCount);
      setfixedCount(state.fixedCount);
      setItem(state.item);
      setpanelHeight(state.panelHeight);
      setpanelType(state.panelType);
      setframeArea(state.frameArea);
      setframeTotal(state.frameTotal);
      setQty(state.qty);
      settopFixedWidth(state.topFixedWidth);
      setbottomFixedWidth(state.bottomFixedWidth);
      setTopBoxHeight(state.topnewHeights);
      setbottomFixedNum(state.bottomFixedNum);
      settopFixedNum(state.topFixedNum);
      setBottomBoxHeight(state.bottomnewHeights);
      setboxTop(state.boxTop);
      setboxBottom(state.boxBottom);
      setnumTopBoxes(state.numTopBoxes);
      setnumBottomBoxes(state.numBottomBoxes);
      setBottomFrame(state.bottomFrame);
      setVertMullion(state.verticalMullion);
      setHoriMullion(state.horizontalMullion);
      setDistance(state.distance)







    }

  }, [state])
  useEffect(() => {

   

    const updateDeviceWidth = () => {
      setDeviceWidth(window.innerWidth);
      setScreen(window.innerWidth > 700 ? 4 : 8);
    };

    window.addEventListener('resize', updateDeviceWidth);

    return () => {
      window.removeEventListener('resize', updateDeviceWidth);
    };
  }, []);





  const Frame = () => {
    if (item === 'Ventilator') {
      return (Number(boxHeight) + Number(boxWidth)) * 2;
    }
    else {
      if (measure === 'ft') {
        return 2 * (Number(boxWidth) + Number(boxHeight)).toFixed(2);
      } else {
        return 2 * (Number(boxWidth / 304.8) + Number(boxHeight / 304.8)).toFixed(2);
      }
    }
  };




  const Shutter = () => {
    if (measure === 'ft') {
      return (((((boxHeight - topnewHeights) * shutterCount) * 2) * numFrames) + ((boxWidth / numSecondInnerBoxes) * shutterCount) * 2).toFixed(2);
    } else {
      return ((((((boxHeight / 304.8) - (topnewHeights / 304.8)) * shutterCount) * 2) * numFrames) + (((boxWidth / 304.8) / numSecondInnerBoxes) * shutterCount) * 2).toFixed(2);
    }
  };

  const Panel = () => {
    if (measure === 'ft') {
      if (panelType === 1) {
        return ((boxHeight / (150 * 0.00328084)) * boxWidth).toFixed(2);
      } else {
        return 0;
      }
    } else {
      if (panelType === 1) {
        return (((boxHeight / 304.8) / (150 * 0.00328084)) * (boxWidth / 304.8)).toFixed(2);
      } else {
        return 0;
      }
    }
  };


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
    if (item === 'Ventilator') {
      if (boxHeight > 1 && boxWidth > 1) {
        if (fan === 'on') {
          if (divider === 'Vertical') {
            return Number(boxHeight) + fanLength;
          } else {
            return Number(boxWidth) + fanLength;
          }
        } else {
          return 0;
        }
      } else {
        if (fan === 'on') {
          if (divider === 'Vertical') {
            return fanLength;
          } else {
            return fanLength;
          }
        } else {
          return 0;
        }
      }
    }
    else {

      if (measure === 'ft') {
        return (((boxHeight - topnewHeights - bottomnewHeights) * (numSecondInnerBoxes - 1)) + (topnewHeights * boxWidth) + (topnewHeights * (topFixedNum - 1)) + (bottomnewHeights * boxWidth) + (bottomnewHeights * (bottomFixedNum - 1))).toFixed(2);
      } else {
        return ((((boxHeight / 304.8) - topnewHeights - bottomnewHeights) * (numSecondInnerBoxes - 1)) + (topnewHeights * (boxWidth / 304.8)) + (topnewHeights * (topFixedNum - 1)) + (bottomnewHeights * (boxWidth / 304.8)) + (bottomnewHeights * (bottomFixedNum - 1))).toFixed(2);
      }

    }

  };





  const LouverBlades = () => {
    if (Number(boxHeight) === 1 && Number(boxWidth) > 1) {
      if (switchFixed === 'on') {
        return 0;
      } else {
        if (fan === 'on') {
          return 0;
        } else {
          return (Number(boxHeight) * 4);
        }
      }
    } else if (Number(boxHeight) > 1 && Number(boxWidth) === 1) {
      if (switchFixed === 'on') {
        return 0;
      } else {
        if (fan === 'on') {
          return 0;
        } else {
          return ((Number(boxHeight)) * 4);
        }
      }
    } else {
      if (divider === 'Vertical' && switchs === 'on') {

        return (4 * Number(boxHeight));
      }
      if (divider === 'Vertical' && switchs === 'off') {
        if (fan === 'on') {
          return (4 * (Number(boxHeight) - 1));
        } else {
          return (4 * (Number(boxHeight)));
        }
      }
      if (divider === 'Horizontal' && switchs === 'on') {
        if (fan === 'on') {
          return (4 * (Number(boxHeight) - 1));
        } else {
          return (4 * (Number(boxHeight)));
        }
      }
      if (divider === 'Horizontal' && switchs === 'off') {
        if (fan === 'on') {
          return (4 * (Number(boxHeight) - 1));
        } else {
          return (4 * (Number(boxHeight)));
        }
      }
    }
  };


  const Glass = () => {
    if (Number(boxHeight) === 1 && Number(boxWidth) > 1) {
      if (switchFixed === 'on') {
        if (fan === 'on') {
          return ((Number(boxHeight)) * Number(boxWidth) - 1);
        } else {
          return ((Number(boxHeight)) * Number(boxWidth));
        }
      } else {
        return 0;
      }
    } else if (Number(boxHeight) > 1 && Number(boxWidth) === 1) {
      if (switchFixed === 'on') {
        if (fan === 'on') {
          return ((Number(boxHeight) - 1) * Number(boxWidth));
        } else {
          return ((Number(boxHeight)) * Number(boxWidth));
        }
      } else {
        return 0;
      }
    } else if (Number(boxHeight) === 1 && Number(boxWidth) === 1) {
      if (switchFixed === 'on') {
        if (fan === 'on') {
          return ((Number(boxHeight) - 1) * Number(boxWidth));
        } else {
          return ((Number(boxHeight)) * Number(boxWidth));
        }
      } else {
        return 0;
      }
    } else {
      if (divider === 'Vertical' && switchs === 'on') {
        return ((Number(boxHeight) - 1) * (Number(boxWidth) - 1)) + ((Number(boxHeight) * 4) * (95 * 0.00328084)) * (Number(boxWidth) - 1);
      }
      if (divider === 'Vertical' && switchs === 'off') {
        return ((Number(boxHeight)) * (Number(boxWidth) - 1)) + (((Number(boxHeight) - 1) * 4) * (95 * 0.00328084)) * (Number(boxWidth) - 1);
      }
      if (divider === 'Horizontal' && switchs === 'on') {
        return ((Number(boxHeight) - 1) * (Number(boxWidth))) + (((Number(boxHeight) - 1) * 4) * (95 * 0.00328084)) * (Number(boxWidth) - 1);
      }
      if (divider === 'Horizontal' && switchs === 'off') {
        return ((Number(boxHeight) - 1) * (Number(boxWidth) - 1)) + (((Number(boxHeight) - 1) * 4) * (95 * 0.00328084)) * (Number(boxWidth));
      }
    }
  };

  const louverBeeding = () => {
    if (Number(boxHeight) === 1 && Number(boxWidth) > 1) {
      if (switchFixed === 'on') {
        return 0;
      } else {
        if (fan === 'on') {
          return ((Number(boxHeight) + Number(boxWidth) - 1) * 2);
        } else {
          return (Number(boxWidth) * 4);
        }
      }
    } else if (Number(boxHeight) > 1 && Number(boxWidth) === 1) {
      if (switchFixed === 'on') {
        return 0;
      } else {
        if (fan === 'on') {
          return ((Number(boxHeight) - 1 + Number(boxWidth)) * 2);
        } else {
          return ((Number(boxHeight) + Number(boxWidth)) * 2);
        }
      }
    } else if (Number(boxHeight) === 1 && Number(boxWidth) === 1) {
      if (switchFixed === 'on') {
        return 0;
      } else {
        if (fan === 'on') {
          return ((Number(boxHeight) - 1 + Number(boxWidth)) * 2);
        } else {
          return ((Number(boxHeight) + Number(boxWidth)) * 2);
        }
      }
    } else {
      if (divider === 'Vertical' && switchs === 'on') {
        return (2 * (Number(boxHeight) - 1 + Number(boxWidth) - 1));
      }
      if (divider === 'Vertical' && switchs === 'off') {
        return (2 * (Number(boxHeight) + Number(boxWidth) - 1));
      }
      if (divider === 'Horizontal' && switchs === 'on') {
        return (2 * (Number(boxHeight) - 1 + Number(boxWidth)));
      }
      if (divider === 'Horizontal' && switchs === 'off') {
        return (2 * (Number(boxHeight) - 1 + Number(boxWidth) - 1));
      }
    }
  };

  const Beeding = () => {
    if (item === 'Ventilator') {
      return Frame();
    }
    else {

      if (measure === 'ft') {
        if (topnewHeights === 0) {
          return (((boxHeight * numSecondInnerBoxes * 2) + ((boxWidth * 2 / numFrames))) * numFrames).toFixed(2);
        } else {
          return (((topnewHeights * 2) + ((boxHeight - topnewHeights) * (numSecondInnerBoxes * 2)) + ((boxWidth * 4 / numFrames))) * numFrames).toFixed(2);
        }
      } else {
        if (topnewHeights === 0) {
          return ((((boxHeight / 304.8) * numSecondInnerBoxes * 2) + (((boxWidth / 304.8) * 2 / numFrames))) * numFrames).toFixed(2);
        } else {
          return ((((topnewHeights / 304.8) * 2) + (((boxHeight / 304.8) - (topnewHeights / 304.8)) * (numSecondInnerBoxes * 2)) + (((boxWidth / 304.8) * 4 / numFrames))) * numFrames).toFixed(2);
        }
      }

    }

  };

  const beedingGasket = () => {
    if (item === 'Ventilator') {
      return Frame() + (boxWidth * 2);
    } else {
      if (measure === 'ft') {
        if (topnewHeights === 0) {
          return ((((boxHeight * numSecondInnerBoxes * 2) + ((boxWidth * 2 / numFrames))) * numFrames) * 1).toFixed(2);
        } else {
          return ((((topnewHeights * 2) + ((boxHeight - topnewHeights) * (numSecondInnerBoxes * 2)) + ((boxWidth * 4 / numFrames))) * numFrames) * 1).toFixed(2);
        }
      } else {
        if (topnewHeights === 0) {
          return (((((boxHeight / 304.8) * numSecondInnerBoxes * 2) + (((boxWidth / 304.8) * 2 / numFrames))) * numFrames) * 1).toFixed(2);
        } else {
          return (((((topnewHeights / 304.8) * 2) + (((boxHeight / 304.8) - (topnewHeights / 304.8)) * (numSecondInnerBoxes * 2)) + (((boxWidth / 304.8) * 4 / numFrames))) * numFrames) * 1).toFixed(2);
        }
      }
    }

  };

  const shutterGasket = () => {
    if (measure === 'ft') {
      return ((((((boxHeight - topnewHeights) * shutterCount) * 2 * numFrames)) + ((boxWidth / numSecondInnerBoxes) * shutterCount) * 2) * 2).toFixed(2);
    } else {
      return (((((((boxHeight / 304.8) - (topnewHeights / 304.8)) * shutterCount) * 2 * numFrames)) + (((boxWidth / 304.8) / numSecondInnerBoxes) * shutterCount) * 2) * 2).toFixed(2);
    }
  };


  const frameGasket = () => {
    if (item === 'Ventilator') {
      return Frame();
    } else {
      if (measure === 'ft') {
        return ((boxHeight * 2) + (boxWidth * 2)).toFixed(2);
      } else {
        return (((boxHeight / 304.8) * 2) + ((boxWidth / 304.8) * 2)).toFixed(2);
      }
    }

  };

  const steelFrame = () => {
    if (item === 'Ventilator') {
      return Frame();
    } else {
      if (measure === 'ft') {
        return ((boxHeight * 2) + (boxWidth * 2)).toFixed(2);
      } else {
        return (((boxHeight / 304.8) * 2) + ((boxWidth / 304.8) * 2)).toFixed(2);
      }
    }
  };

  const steelMullion = () => {
    return Mullion();
  };

  const steelShutter = () => {
    if (measure === 'ft') {
      return (((((boxHeight - topnewHeights) * shutterCount) * 2) + ((boxWidth / numSecondInnerBoxes) * shutterCount) * 2) * numFrames).toFixed(2);
    } else {
      return ((((((boxHeight / 304.8) - (topnewHeights / 304.8)) * shutterCount) * 2) + (((boxWidth / 304.8) / numSecondInnerBoxes) * shutterCount) * 2) * numFrames).toFixed(2);
    }
  };

  const cuplerJoint = () => {
    if (measure === 'ft') {
      return ((boxHeight) * (numFrames - 1)).toFixed(2);
    } else {
      return ((boxHeight / 304.8) * (numFrames - 1)).toFixed(2);
    }
  };

  const meshFrame = () => {
    if (item === 'SlidingWindow') {
      if (measure === 'ft') {
        if (mesh === 'yes') {
          return (((((Number(boxHeight) - newHeights) * (shutterCount - 1)) * 2) + ((Number(boxWidth) / shutterCount) * (shutterCount - 1)) * 2) * numFrames).toFixed(2);
        } else {
          return 0;
        }
      } else {
        if (mesh === 'yes') {
          return ((((((Number(boxHeight) / 304.8) - (newHeights / 304.8)) * (shutterCount - 1)) * 2) + (((Number(boxWidth) / 304.8) / shutterCount) * (shutterCount - 1)) * 2) * numFrames).toFixed(2);
        } else {
          return 0;
        }
      }
    } else {
      if (measure === 'ft') {
        if (mesh === 'yes') {
          return (((((boxHeight - topnewHeights - bottomnewHeights) * shutterCount) * 2) + ((boxWidth / numSecondInnerBoxes) * shutterCount) * 2) * numFrames).toFixed(2);
        } else {
          return 0;
        }
      } else {
        if (mesh === 'yes') {
          return ((((((boxHeight / 304.8) - (topnewHeights / 304.8) - (bottomnewHeights / 304.8)) * shutterCount) * 2) + (((boxWidth / 304.8) / numSecondInnerBoxes) * shutterCount) * 2) * numFrames).toFixed(2);
        } else {
          return 0;
        }
      }
    }

  };

  const meshGasket = () => {
    if (item === 'SlidingWindow') {
      if (measure === 'ft') {
        if (mesh === 'yes') {
          return (((((Number(boxHeight) - newHeights) * (shutterCount - 1)) * 2) + ((Number(boxWidth) / shutterCount) * (shutterCount - 1)) * 2) * numFrames).toFixed(2);
        } else {
          return 0;
        }
      } else {
        if (mesh === 'yes') {
          return ((((((Number(boxHeight) / 304.8) - (newHeights / 304.8)) * (shutterCount - 1)) * 2) + (((Number(boxWidth) / 304.8) / shutterCount) * (shutterCount - 1)) * 2) * numFrames).toFixed(2);
        } else {
          return 0;
        }
      }
    } else {
      return meshFrame();
    }
  };


  const interLock = () => {
    return ((boxHeight) * (numSecondInnerBoxes - 1)) * 2;
  };
  const meshArea = () => {
    if (mesh === 'yes') {

      const indices = boxNames
        .map((name, index) => name === 'Shutter' ? index : -1)
        .filter(index => index !== -1);

      const widths = indices.map(index => newWidths[index]);
      const totalWidth = widths.reduce((sum, width) => sum + width, 0);
      const meashsArea = (boxHeight - topnewHeights - bottomnewHeights) * totalWidth;

      return meashsArea;

    } else {
      return 0;
    }
  };

  const gillArea = () => {
    if (grill === 'yes') {

      const indices = boxNames
        .map((name, index) => name === 'Shutter' ? index : -1)
        .filter(index => index !== -1);

      const widths = indices.map(index => Number(newWidths[index]));
      const totalWidth = Number(widths.reduce((sum, width) => sum + width, 0).toFixed(2)); // Adjust the number of decimal places as needed

      const grillsArea = (Number(boxHeight) - topnewHeights - bottomnewHeights) * Number(totalWidth);

      return grillsArea;

    } else {
      return 0;
    }
  };

  // const fixedShutters = (parseFloat(fixedCount) + parseFloat(numFirstInnerBoxes)) * parseFloat(numFrames);
   const fixedShutters = parseFloat(fixedCount) * parseFloat(numFrames);
  // console.log("fixedshutter",numFirstInnerBoxes);

  const calculatedBoxWidth = measure === 'ft' ? boxWidth : (boxWidth / 304.8);
  const calculatedBoxHeight = measure === 'ft' ? boxHeight : (boxHeight / 304.8);
  // const calculatednewWidths = newWidths.map(width => 
  //   measure === 'ft' ? parseFloat(width) : parseFloat(width) / 304.8
  // );
  const calculatednewHeights = measure === 'ft' ? newHeights : (newHeights / 304.8);


  
  // const boxes = Array.from({ length: (boxHeight - topnewHeights - bottomnewHeights) * 1.95 }).map((_, index) => (
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
 
//   const boxes = (height, measure) => {
//   // convert height into "feet equivalent" units
//   const unitHeight = measure === "ft" ? height : height / 304.8;

//   return Array.from({ length: unitHeight * 2 }).map((_, index) => (
//     <div
//       key={index}
//       style={{
//         position: "relative",
//         width: "100%",
//         height: measure === "ft" ? "0.20vw" : "20px",
//         border: "1px solid #333",
//         background: measure === "ft" ? "#fff" : "transparent",
//         marginTop: `calc((${unitHeight * screen / mCalc + "vw"} - 25px) / ${unitHeight * 2.7})`,
//       }}
//     ></div>
//   ));
// };


 const boxes = (height, measure) => {
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


    // inner Bottom Line
  const getInnerBottom = (height, screen, mCalc) => {
    const fullHeightVW = (height) * screen / mCalc;
    return `calc(${fullHeightVW}vw - ${boxTop === 'on' ? '40px' : '34px'})`;
  };

    // Outer Bottom Line
  const getOuterBottom = (height, screen, mCalc) => {
    const fullHeightVW = (height) * screen / mCalc;
    return `calc(${fullHeightVW}vw - 15  px)`;
  };

// console.log("screen",screen)
// console.log('item',item)

  // console.log(newWidths);
  //   console.log(numSecondInnerBoxes);
  return (
    <div>
      <Navbar />
      <Header />



      {item === 'CasementDoor' && (
        <div class="pc-container">
          <div class="pc-content">

            <div class="row">


              <div class="col-md-12 col-xxl-12 col-xl-12" >
                <div class="card" style={{ background: '#fff' }}>
                  <div class="card-body mb-5">

                    <div>

                   <div style={{ float: 'left',boxShadow: '1px 1px 5px grey', width: boxWidth * screen / mCalc + 'vw', height: boxHeight * screen / mCalc + 'vw', border: '1px solid #333' }}>
                  
                  
                  
                                        {[...Array(numFrames)].map((_, index) => (
                                          <div style={{ float: 'left', margin: '2px', border: '1px solid #333', width: `calc(${parseFloat(boxWidth) * screen / mCalc / numFrames + 'vw'} - 6px)`, height: bottomFrame === 'yes' ? `calc(${parseFloat(boxHeight) * screen / mCalc + 'vw'} - 6px)` : `calc(${parseFloat(boxHeight) * screen / mCalc + 'vw'} - 6px)`,position:'relative' }}>
                                            {/* {boxHeight && boxWidth>0?
                                            <> */}
                                            {/* outer corner lines start */}
                                            {/* <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-6.5px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                                            <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-6px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                                            <div style={{ height: '8px', width: '1px', float: 'right', marginTop: getOuterBottom(boxHeight, screen, mCalc), marginRight: '-4px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                                            <div style={{ height: '8px', width: '1px', float: 'left', marginTop: getOuterBottom(boxHeight, screen, mCalc), marginLeft: '-3px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div> */}
                                            {/* outer corner lines end */}
                                            {/* </>:<></>
                                            }                       */}
                  
                                            {boxTop === 'on' && (
                  
                                              [...Array(numTopBoxes)].map((_, index) => (
                                                <div style={{ display: 'flex', width: `calc(${boxWidth * screen / mCalc / numFrames + 'vw'} - 18px)`,position:'relative', height: `calc(${(topnewHeights * screen / mCalc)}vw )`, margin: '5px' }}>
                                                  {[...Array(topFixedNum)].map((_, index) => (
                                                    <div style={{ flex: '1', backgroundColor: 'white',padding:'4px',boxSizing:'border-box', width: `calc(${topFixedWidth[index] * screen / mCalc / numFrames + 'vw'} - 18px)`, height: `calc(${(topnewHeights * screen / mCalc)}vw )`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px', position:'relative'}}>
                                                       <div style={{
                                                          width: '100%',
                                                          height: '100%',
                                                          border: '1px solid #333',
                                                          backgroundColor:'lightgreen',
                                                          position:'relative'
                                                     }}>
                  
                                              {/* Inner corner lines start */}
                                            <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-6.5px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                                            <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-6px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                                            <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${topnewHeights*screen/mCalc}vw - 12px)`, marginRight: '-4px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                                            <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${topnewHeights*screen/mCalc}vw - 12px)`, marginLeft: '-3px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>
                                            {/* Inner corner lines end */}
                                              {/* outer corner lines start for bottom sash*/}
                                              <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-12px', marginRight: '-9px', transform: 'rotate(45deg)',  background: index === topFixedWidth.length -1  ? 'black' : 'transparent'}}></div>
                                            <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-12px', marginLeft: '-9px', transform: 'rotate(-45deg)', background: index === 0 ? 'black' : 'transparent'}}></div>
                                            {/* <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${bottomnewHeights*screen/mCalc}vw - 12px)`, marginRight: '-11px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                                            <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${bottomnewHeights*screen/mCalc}vw - 12px)`, marginLeft: '-9px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>  */}
                                            {/* outer corner lines end */}
                                            <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${topnewHeights*screen/mCalc}vw - 8px)`, marginRight: '-6px', transform: 'rotate(180deg)', background:(topFixedWidth.length === 0 && boxTop === 'on') || index === topFixedWidth.length - 1 ? 'black' : 'transparent' }}></div>
                                            <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${topnewHeights*screen/mCalc}vw - 8px)`, marginLeft: '-6px', transform: 'rotate(180deg)', background: index === 0 ? 'black' : 'transparent' }}></div>
                                             
                                                      {/* fixed plus  */}
                                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                                    </div>
                                                    </div>
                                                  ))}
                                                  
                                                </div>
                                              ))
                                            )}
                  
                                           
                  
                  
                                            <div style={{ display: 'flex' }}>
                                              {[...Array(numSecondInnerBoxes)].map((_, index) => (
                  
                                                
                  
                                                <div key={index}  style={{ backgroundColor: 'white',boxSizing: 'border-box' ,  height: `calc(${(boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc}vw - ${bottomFrame === 'no' ? '18px' : '23px'} - ${boxTop === 'on' ? '0px' : '-5px'})`,position:'relative' , width: `calc(${newWidths[index] * screen / mCalc}vw )`,  marginTop: boxTop === 'on' ? '0px' : '5px', marginRight: index === numSecondInnerBoxes - 1 ? '5px' : '2.5px', marginLeft: index === 0 ? '5px' : '4.5px',padding:'5px',border: '1px solid #333' }}>
                                                 
                                                    <div style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    border: '1px solid #333',
                                                    backgroundColor: split === 'on' ? 'transparent': panelType === 1 ? 'lightgray' : panelType === 2 ? 'lightyellow' : 'lightblue',
                                                    position:'relative'
                                                  }}>
                                                    {/* Inner corner lines start */} 
                                                    <div key={index} style={{ height: bottomFrame === 'no'?'11px':'15px', width: '1px', float: 'left', marginTop: `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen) / mCalc}vw - ${boxTop === 'on' ? bottomFrame==='no'?'33px':'39px' : bottomFrame==='no'?'28px':'34px'})`, marginLeft:boxBottom === 'on'?'-4px':'-6px', transform: 'rotate(45deg)', borderLeft: '1px solid grey' }}></div>
                                                   <div key={index} style={{ height:boxTop === 'on'?'11px':'15px', width: '1px', float: 'left', marginTop:boxTop === 'on'?'-9px':'-14px', marginLeft:boxTop === 'on'?'-4px':'-6px', transform: 'rotate(-45deg)', borderLeft: '1px solid grey' }}></div>
                                                   <div style={{ height: boxTop === 'on'?'11px':'15px', width: '1px', float: 'right', marginTop:boxTop === 'on'?'-9px':'-14px', marginRight:boxTop === 'on'?'-4px':'-6px', transform: 'rotate(45deg)', borderRight: '1px solid grey' }}></div>
                                                   {/* <div style={{ height: '15px', width: '1px', float: 'left', marginTop: getInnerBottom(boxHeight - topnewHeights - bottomnewHeights, screen, mCalc), marginLeft: '-4px', transform: 'rotate(-45deg)', borderLeft: index === 0 ? 'transparent' : '1px solid black' }}></div> */}
                                                   <div style={{ height: bottomFrame === 'no'?'11px':'15px', width: '1px', float: 'right', marginTop: `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen) / mCalc}vw - ${boxTop === 'on' ? bottomFrame==='no'?'33px':'39px' : bottomFrame==='no'?'28px':'34px'})`, marginRight:boxBottom==='on'?'-4px':'-6px', transform: 'rotate(-45deg)', borderLeft: '1px solid grey' }}></div>
                                                   <div style={{ height: '10px', width: '1px', float: 'right', marginTop: `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen) / mCalc}vw - ${boxBottom === 'on' ? '33px' : '27px'})`, marginRight: '-4px', transform: 'rotate(-45deg)', borderRight: index === -1 ? '1px solid grey' : 'none' }}></div>
                                                   {/* <div style={{ height: '7px', width: '1px', float: 'left', right: '0px', marginTop: '-6px', marginRight: '-1px', background: index === 0 ? 'transparent' : 'black' }}></div> */}
                                                  {/* Inner corner lines ends */}  
                                                   {/* {boxNames[index] === 'Shutter' && grill === 'yes' && <div style={{position: 'absolute', width: `calc(${(boxWidth/(shutterCount + fixedCount))*screen}vw - ${(shutterCount + fixedCount) === 1 ? '32px' : (shutterCount + fixedCount) === 2 ? '28px' : (shutterCount + fixedCount) === 3 ? '24px' : '23px'})`}}> {boxes} </div>} */}
                                                  {/* {boxNames[index] === 'Shutter' && grill === 'yes' && <div style={{position:'absolute',width:'100%'}}>{boxes((parseFloat(boxHeight)+0.25), topnewHeights, bottomnewHeights, mCalc)}</div>} */}
                                                   {boxNames[index] === 'Shutter' && grill === 'yes' && <div style={{position:"absolute",width:'100%'}}>{boxes(boxHeight -topnewHeights - bottomnewHeights)}</div>}
                                    
                                                  <div className="expanding-arrow-line" style={{
                                                    position: 'absolute',
                                                    float: 'left',
                                                    width: `calc(${(newWidths[index] * screen / mCalc)}vw - 15px)`,
                                                    bottom: '-10px',
                                                    top: `calc(${boxHeight * screen / mCalc}vw)`,
                                                  }}
                  
                                                  >
                                                    <div className="arrow-left"></div>
                                                    <div className="line" align="center">
                                                      <div style={{ marginTop: '-7px', background: 'white', maxWidth: '60px', textAlign: 'center' }}><p>{ parseFloat(newWidths[index]).toFixed(2)}</p></div>
                                                    </div>
                                                    <div className="arrow-right"></div>
                                                  </div>
                  
                  
                                                  {
                                                    boxNames[index] === 'Shutter' ? (
                                                      boxHandle[index] === 'left' ? (
                                                        <>
                                                          {/* Left Handle and Right Arrow */}
                                                          <img
                                                            src={left}
                                                            style={{
                                                              float: 'left',
                                                              marginTop: `calc(${(((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc) / 2)}vw - 15px`,
                                                              marginLeft: '-4px',
                                                              width: screen === 3 ? '13px' : '8px'
                                                            }}
                                                           
                                                            alt="Left Handle"
                                                          />
                                                         {/* dotted line start */}
                                                         <div style={{ position: 'absolute', top:split=='on'?`calc(${(topnewHeights>0?((shutterHeight[index].height-0.5) * screen / mCalc):shutterHeight[index].height * screen / mCalc) }vw + ${topnewHeights>0?'12px':'-8px'})`:'0', right: 0, width: '100%', height: split=='on'?`calc(${(boxHeight - shutterHeight[index].height - topnewHeights) * screen / mCalc}vw - 21px  - ${bottomFrame==='no'?'-4px':'1px'} - ${split==='on'?'5px':'1px'})`:'100%', zIndex: 1, overflow: 'hidden' }}>
                  
                                                             {/* Line from center to top-right */}
                                                             <div style={{position: 'absolute',top: '50%',right: '0',width: '2px',height: '2000%',borderLeft: '1px dashed gray',transform: `rotate(${(boxTop === 'on' || boxBottom === 'on' ? -1 : 0) + 90 + Math.acos((2 * (newWidths[index]/2)) / Math.sqrt(4 * (newWidths[index]/2) * (newWidths[index]/2) + (boxHeight - topnewHeights - bottomnewHeights- (split === 'on' ? shutterHeight[index].height : 0))/2 * (boxHeight - topnewHeights - bottomnewHeights- (split === 'on' ? shutterHeight[index].height : 0))/2)) * (180 / Math.PI)+numSecondInnerBoxes}deg)`,transformOrigin: 'top right',}}></div>
                  
                                                             {/* Line from center to bottom-right */}
                                                             <div style={{position: 'absolute',bottom: '50%',right: '0',width: '2px',height: '2000%',borderLeft: '1px dashed gray',transform: `rotate(-${(boxTop === 'on' || boxBottom === 'on' ? -1 : 0) + 90 + Math.acos((2 * (newWidths[index]/2)) / Math.sqrt(4 * (newWidths[index]/2) * (newWidths[index]/2) + (boxHeight - topnewHeights - bottomnewHeights- (split === 'on' ? shutterHeight[index].height : 0))/2 * (boxHeight - topnewHeights - bottomnewHeights- (split === 'on' ? shutterHeight[index].height : 0))/2)) * (180 / Math.PI)+numSecondInnerBoxes}deg)`,transformOrigin: 'bottom right',}}></div>
                    
                                                         </div>
                                                         {/* dotted line end */}
                  
                                                        </>
                                                      ) : (
                                                        <>
                                                          <img
                                                            src={right}
                                                            style={{
                                                              float: 'right',
                                                              marginTop: `calc(${(((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc) / 2)}vw - 15px`,
                                                              marginRight: '-4px',
                                                              width: screen === 3 ? '13px' : '8px'
                                                            }}
                                                         
                                                            alt="Right Handle"
                                                          />
                                                         
                                                         <div style={{ position: 'absolute', top:split=='on'?`calc(${(topnewHeights>0?((shutterHeight[index].height-0.5) * screen / mCalc):shutterHeight[index].height * screen / mCalc) }vw + ${topnewHeights>0?'12px':'-8px'})`:'0', right: 0, width: '100%', height: split=='on'?`calc(${(boxHeight - shutterHeight[index].height - topnewHeights) * screen / mCalc}vw - 21px  - ${bottomFrame==='no'?'-4px':'1px'} - ${split==='on'?'5px':'1px'})`:'100%', zIndex: 1, overflow: 'hidden' }}>
                  
                                                            {/* Line from center to top-left */}
                                                            <div style={{ position: 'absolute', top: '50%', left: '0', width: '2px', height: '150%', borderLeft: '1px dashed gray', transform: `rotate(-${(boxTop === 'on' || boxBottom === 'on' ? -1 : 0) + 90 + Math.acos((2 * (newWidths[index]/2)) / Math.sqrt(4 * (newWidths[index]/2) * (newWidths[index]/2) + (boxHeight - topnewHeights - bottomnewHeights- (split === 'on' ? shutterHeight[index].height : 0))/2 * (boxHeight - topnewHeights - bottomnewHeights- (split === 'on' ? shutterHeight[index].height : 0))/2)) * (180 / Math.PI)+numSecondInnerBoxes}deg)`, transformOrigin: 'top left' }}></div>
                  
                                                            {/* Line from center to bottom-left */}
                                                            <div style={{ position: 'absolute', bottom: '50%', left: '0', width: '2px', height: '150%', borderLeft: '1px dashed gray', transform: `rotate(${(boxTop === 'on' || boxBottom === 'on' ? -1 : 0) + 90 + Math.acos((2 * (newWidths[index]/2)) / Math.sqrt(4 * (newWidths[index]/2) * (newWidths[index]/2) + (boxHeight - topnewHeights - bottomnewHeights- (split === 'on' ? shutterHeight[index].height : 0))/2 * (boxHeight - topnewHeights - bottomnewHeights- (split === 'on' ? shutterHeight[index].height : 0))/2)) * (180 / Math.PI)+numSecondInnerBoxes}deg)`, transformOrigin: 'bottom left' }}></div></div>
                  
                                                        </>
                                                      )
                                                    ) : (
                                                      <>
                                                        {/* Plus Icon in Center */}
                                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '50px', fontWeight: '100', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                  
                                                      </>
                                                    )
                                                  }
                  
                                                  
                  
                                                  {split === 'on' && 
                                                    <>
                                                  
                                                      <div style={{background: shutterHeight[index].top === 'glass' ? 'lightblue' : shutterHeight[index].top === 'panel' ? 'lightgrey' : 'lightyellow', width: `calc(${newWidths[index] * screen / mCalc}vw - 16 px)`, height: `calc(${(shutterHeight[index].height) * screen / mCalc}vw - 15px`, border: '1px solid #333' }}></div>
                                                      {/* <div style={{background: shutterHeight[index].bottom === 'glass' ? 'lightblue' : shutterHeight[index].bottom === 'panel' ? 'lightgrey' : 'lightyellow', width: `calc(${newWidths[index] * screen / mCalc}vw - 16 px)`, height: `calc(${(boxHeight - shutterHeight[index].height) * screen / mCalc}vw - ${topnewHeights > 0 ? '21px' : '15px'} - ${bottomFrame==='no'?'-4px':'1px'} - ${split==='on'?'5px':'1px'})`, border: '1px solid #333', marginTop: '5px' }}></div> */}
                                                      <div style={{background: shutterHeight[index].bottom === 'glass' ? 'lightblue' : shutterHeight[index].bottom === 'panel' ? 'lightgrey' : 'lightyellow', width: `calc(${newWidths[index] * screen / mCalc}vw - 16 px)`, height: `calc(${((boxHeight - shutterHeight[index].height - topnewHeights) * screen / mCalc)}vw - 21px - ${bottomFrame === 'no' ? '-4px' : '1px'} - ${boxTop === 'on' ? '5px' : '-1px'})`, border: '1px solid #333', marginTop: '5px' }}></div>
                  
                                                    </>
                                                  }
                  
                                                 
                  
                                                </div>
                                                </div>
                  
                                              ))}
                  
                                            </div>
                  
                  
                                            {numSecondInnerBoxes === 0 ? (
                                              <div className="expanding-arrow-line" style={{ float: 'left', marginLeft: '-5px', width: ((parseFloat(boxWidth) / numFrames) * screen / mCalc) + 'vw', top: (parseFloat(boxHeight) - newHeights) * screen / mCalc + 'vw', }} >
                                                <div className="arrow-left"></div>
                                                <div className="line" align="center">
                                                  <div style={{ marginTop: '-8px', background: 'white', maxWidth: '60px', textAlign: 'center' }}><p>{typeof (parseFloat(boxWidth) / numFrames) === 'number' ? (parseFloat(boxWidth) / numFrames).toFixed(2) : (parseFloat(boxWidth) / numFrames)}</p></div>
                                                </div>
                                                <div className="arrow-right"></div>
                                              </div>
                                            ) : (
                                              <div className="expanding-arrow-line" style={{ float: 'left', marginLeft: '-5px', width: ((parseFloat(boxWidth) / numFrames) * screen / mCalc) + 'vw', bottom: '-10px', top: bottomFrame === 'yes' ? '50px' : '45px', }} >
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
                            <div style={{ marginLeft: '-10px', marginTop: (boxHeight - topnewHeights - bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{Number(boxHeight - topnewHeights - bottomnewHeights).toFixed(2) }</p></div>
                            </div>
                          <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        </div>
                      </>
                      }
                    
                      {boxBottom === 'on' &&
                      <>
                        <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(bottomnewHeights) * screen / mCalc}vw + 5px)`, top: `calc(${(boxHeight - bottomnewHeights) * screen / mCalc}vw - ${boxTop === 'on' ? '10px' : '10px'})`, position: 'relative' }}>
                          <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                          <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                            <div style={{ marginLeft: '-10px', marginTop: (bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{Number(bottomnewHeights).toFixed(2)}</p></div>
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

                    </div>

                    <div style={{ width: '30px', float: 'left', paddingLeft: boxBottom === 'on' || boxTop === 'on' ?'0px' : '15px', textAlign: 'left' }}>
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


              </div>

              {numSecondInnerBoxes === 0 ? (<div></div>) : (
                <>
                  <div class="col-md-12 col-xxl-2 col-xl-2">
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

                  <div class="col-md-12 col-xxl-2 col-xl-2">
                    <div class="card">
                      <div class="card-body">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 ms-3">
                            <h6 class="mb-0">Shutters</h6>
                          </div>
                        </div>
                        <div class="bg-body p-3 mt-3 rounded">
                          <div class="mt-3 row align-items-center">
                            <div class="col-12">
                              <h6 class="mb-1">{shutterCount * numFrames}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-12 col-xxl-2 col-xl-2">
                    <div class="card">
                      <div class="card-body">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 ms-3">
                            <h6 class="mb-0">Fixed</h6>
                          </div>
                        </div>
                        <div class="bg-body p-3 mt-3 rounded">
                          <div class="mt-3 row align-items-center">
                            <div class="col-12">
                              <h6 class="mb-1">{fixedShutters}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-12 col-xxl-2 col-xl-2">
                    <div class="card">
                      <div class="card-body">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 ms-3">
                            <h6 class="mb-0">Mullions</h6>
                          </div>
                        </div>
                        <div class="bg-body p-3 mt-3 rounded">
                          <div class="mt-3 row align-items-center">
                            <div class="col-12">
                              <h6 class="mb-1">{newHeights === 0 ? ((numSecondInnerBoxes - 1) * numFrames) : ((numSecondInnerBoxes) * numFrames)}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-12 col-xxl-2 col-xl-2">
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

                  <div class="col-md-12 col-xxl-2 col-xl-2">
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
                              <h6 class="mb-1">₹ {numeral(grandTotal / frameArea).format('0,0.00')}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
                            <th width="10%">Req. Qty (Feet)</th>
                            <th width="10%">Req. Qty (Mtr)</th>
                            <th width="10%">Rate/Mtr</th>
                            <th width="10%">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Casement Frame</td>
                              <td>{numeral(Frame()).format('0,0.00')}</td>
                              <td>{numeral(values.frame.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frame.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frame.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Casement Shutter</td>
                              <td>{numeral(Shutter()).format('0,0.00')}</td>
                              <td>{numeral(values.shutter.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.shutter.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.shutter.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Mullion</td>
                              <td>{numeral(Mullion()).format('0,0.00')}</td>
                              <td>{numeral(values.mullion.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.mullion.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.mullion.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Beeding</td>
                              <td>{numeral(Beeding()).format('0,0.00')}</td>
                              <td>{numeral(values.beeding.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.beeding.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.beeding.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Frame Gasket</td>
                              <td>{numeral(frameGasket()).format('0,0.00')}</td>
                              <td>{numeral(values.frameGasket.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frameGasket.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frameGasket.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Shutter Gasket</td>
                              <td>{numeral(shutterGasket()).format('0,0.00')}</td>
                               <td>{numeral(values.shutterGasket.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.shutterGasket.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.shutterGasket.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Beeding Gasket</td>
                              <td>{numeral(beedingGasket()).format('0,0.00')}</td>
                              <td>{numeral(values.beedingGasket.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.beedingGasket.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.beedingGasket.amount * qty).format('0,0.00')}</td>
                            </tr>

                            {panelType === 1 && (
                              <tr>
                                <td>Panel</td>
                                <td>{numeral(Panel()).format('0,0.00')}</td>
                                <td>{numeral(values.panel.rqm * qty).format('0,0.00')}</td>
                                <td>{numeral(values.panel.rpm * qty).format('0,0.00')}</td>
                                <td>{numeral(values.panel.amount * qty).format('0,0.00')}</td>
                              </tr>
                            )}


                            <tr>
                              <td colspan="4">Total</td>
                              <td>{numeral(frameTotal).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <th colspan="4">Wastage ( {data.wastage}% )</th>
                              <th>{numeral(frameTotal + wastage).format('0,0.00')}</th>
                            </tr>
                            <tr>
                              <th colspan="4">Profile Cost/Sqft</th>
                              <th>{numeral((frameTotal + wastage) / frameArea).format('0,0.00')}</th>
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
                              <th>Product Description</th>
                              <th width="10%">Req. Qty </th>
                              <th width="10%">Price</th>
                              <th width="10%">Amount</th>
                            </tr>
                          </thead>
                          <tbody>

                            <tr>
                              <td>Steel Frame</td>
                              <td>{numeral(values.steelFrame.qty).format('0,0.00')}</td>
                              <td>{numeral(values.steelFrame.price).format('0,0.00')}</td>
                              <td>{numeral(values.steelFrame.amount).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Steel Mullion</td>
                              <td>{numeral(values.steelMullion.qty).format('0,0.00')}</td>
                              <td>{numeral(values.steelMullion.price).format('0,0.00')}</td>
                              <td>{numeral(values.steelMullion.amount).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Steel Shutter</td>
                              <td>{numeral(values.steelShutter.qty).format('0,0.00')}</td>
                              <td>{numeral(values.steelShutter.price).format('0,0.00')}</td>
                              <td>{numeral(values.steelShutter.amount).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Multipoint Lock</td>
                              <td>{numeral(values.mpl.qty * qty).format('0,0.00')}</td>
                              <td>{numeral(values.mpl.price * qty).format('0,0.00')}</td>
                              <td>{numeral(values.mpl.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Friction Stay</td>
                              <td>{numeral(values.frictionstay.qty * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frictionstay.price * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frictionstay.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Door Stopper</td>
                              <td>{numeral(values.doorstopper.qty * qty).format('0,0.00')}</td>
                              <td>{numeral(values.doorstopper.price * qty).format('0,0.00')}</td>
                              <td>{numeral(values.doorstopper.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Casement Door Set</td>
                              <td>{numeral(values.casementdoorset.qty * qty).format('0,0.00')}</td>
                              <td>{numeral(values.casementdoorset.price * qty).format('0,0.00')}</td>
                              <td>{numeral(values.casementdoorset.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Espag with SS Receiver</td>
                              <td>{numeral(values.espag.qty * qty).format('0,0.00')}</td>
                              <td>{numeral(values.espag.price * qty).format('0,0.00')}</td>
                              <td>{numeral(values.espag.amount * qty).format('0,0.00')}</td>
                            </tr>

                            <tr>
                              <td>Espag with MUlti Lock</td>
                              <td>{numeral(values.espagm.qty * qty).format('0,0.00')}</td>
                              <td>{numeral(values.espagm.price * qty).format('0,0.00')}</td>
                              <td>{numeral(values.espagm.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>3D Hinges</td>
                              <td>{numeral(values.hings.qty).format('0,0.00')}</td>
                              <td>{numeral(values.hings.price).format('0,0.00')}</td>
                              <td>{numeral(values.hings.amount).format('0,0.00')}</td>
                            </tr>
                            {grill === 'yes' && (
                              <tr>
                                <td>Grill</td>
                                <td>{numeral(values.grill.qty * qty).format('0,0.00')}</td>
                                <td>{numeral(values.grill.price * qty).format('0,0.00')}</td>
                                <td>{numeral(values.grill.amount * qty).format('0,0.00')}</td>
                              </tr>
                            )}
                            <tr>
                              <td>Screws/Misc</td>
                              <td>{numeral(values.screws.qty).format('0,0.00')}</td>
                              <td>{numeral(values.screws.price).format('0,0.00')}</td>
                              <td>{numeral(values.screws.amount).format('0,0.00')}</td>
                            </tr>

                            <tr>
                              <th colspan="3">Total</th>
                              <th>{numeral(hardTotal).format('0,0.00')}</th>
                            </tr>
                            <tr>
                              <th colspan="3">Hardware Cost/Sqft</th>
                              <th>{numeral(hardTotal / frameArea).format('0,0.00')}</th>
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
                                <th>Product Description</th>
                                <th width="10%">Req. Qty </th>
                                <th width="10%">Price</th>
                                <th width="10%">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Margin</td>
                                <td>{numeral(values.margin.qty).format('0,0.00')}</td>
                                <td>{numeral(values.margin.price).format('0,0.00')}</td>
                                <td>{numeral(values.margin.amount).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <th colspan="3">Total</th>
                                <th>{numeral(marginTotal).format('0,0.00')}</th>
                              </tr>
                              <tr>
                                <th colspan="3">Margin Cost/Sqft</th>
                                <th>{numeral(marginTotal / frameArea).format('0,0.00')}</th>
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
                                <th>Product Description</th>
                                <th width="10%">Req. Qty </th>
                                <th width="10%">Price</th>
                                <th width="10%">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Markting OH</td>
                                <td>{numeral(values.marketing.qty).format('0,0.00')}</td>
                                <td>{numeral(values.marketing.price).format('0,0.00')}</td>
                                <td>{numeral(values.marketing.amount).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <td>Transport</td>
                                <td>{numeral(values.transport.qty).format('0,0.00')}</td>
                                <td>{numeral(values.transport.price).format('0,0.00')}</td>
                                <td>{numeral(values.transport.amount).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <td>Labour (Factory)</td>
                                <td>{numeral(values.labourF.qty).format('0,0.00')}</td>
                                <td>{numeral(values.labourF.price).format('0,0.00')}</td>
                                <td>{numeral(values.labourF.amount).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <td>Labour (Site)</td>
                                <td>{numeral(values.labourS.qty).format('0,0.00')}</td>
                                <td>{numeral(values.labourS.price).format('0,0.00')}</td>
                                <td>{numeral(values.labourS.amount).format('0,0.00')}</td>
                              </tr>
                              {panelType === 2 && (
                                <tr>
                                  <td>Board</td>
                                  <td>{numeral(values.board.qty).format('0,0.00')}</td>
                                  <td>{numeral(values.board.price).format('0,0.00')}</td>
                                  <td>{numeral(values.board.amount).format('0,0.00')}</td>
                                </tr>
                              )}
                              {panelType === 3 && (
                                <tr>
                                  <td>Glass</td>
                                  <td>{numeral(values.glass.qty).format('0,0.00')}</td>
                                  <td>{numeral(values.glass.price).format('0,0.00')}</td>
                                  <td>{numeral(values.glass.amount).format('0,0.00')}</td>
                                </tr>
                              )}
                              <tr>
                                <th colspan="3">Total</th>
                                <th>{numeral(prodTotal).format('0,0.00')}</th>
                              </tr>
                              <tr>
                                <th colspan="3">Production Cost/Sqft</th>
                                <th>{numeral(prodTotal / frameArea).format('0,0.00')}</th>
                              </tr>

                            </tbody>
                          </table>
                        </div>
                      </>
                      )}


                    </div>
                  </div>





                </>
              )}


            </div>
          </div>
        </div>



      )}

      {item === 'CasementWindow' && (
        <div class="pc-container">
          <div class="pc-content">

            <div class="row">





              <div class="col-md-12 col-xxl-12 col-xl-12">
                <div class="card" style={{ background: '#fff' }}>
                  <div class="card-body mb-5">

                    <div>

                    <div style={{ float: 'left',boxShadow: '1px 1px 5px grey' , width: boxWidth * screen / mCalc + 'vw', height: boxHeight * screen / mCalc + 'vw', border: '1px solid #333' }}>



                      {[...Array(numFrames)].map((_, index) => (
                        <div style={{ float: 'left', margin: '2px', border: '1px solid #333', width: `calc(${boxWidth * screen / mCalc / numFrames + 'vw'} - 7px)`, height: `calc(${boxHeight * screen / mCalc + 'vw'} - 7px)` }}>
                        {/* outer corner lines start topsash*/}
                          {/* <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-6.5px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-6px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'right', marginTop: getOuterBottom(boxHeight, screen, mCalc), marginRight: '-4px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop: getOuterBottom(boxHeight, screen, mCalc), marginLeft: '-3px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div> */}
                          {/* outer corner lines end */}

                        {boxTop === 'on' && (
                          [...Array(numTopBoxes)].map((_, index) => (
                            <div style={{ display: 'flex', width: `calc(${boxWidth * screen / mCalc / numFrames + 'vw'} - 19px)`, height: `calc(${(topnewHeights * screen / mCalc)}vw )`, margin: '5px' }}>
                              {[...Array(topFixedNum)].map((_, index) => (
                                <div style={{ flex: '1', backgroundColor:'white',padding:'4px',boxSizing:'border-box',width: `calc(${topFixedWidth[index] * screen / mCalc / numFrames + 'vw'} - 18px)`, height: `calc(${(topnewHeights * screen / mCalc)}vw )`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px', position: 'relative' }}>
                                  <div style={{
                                        width: '100%',
                                        height: '100%',
                                        border: '1px solid #333',
                                        backgroundColor:topsash[index].type === 'fixed' ? 'lightgreen' : 'lightblue', // Main content color
                                        position:'relative'
                                   }}>
                          {/* Inner corner lines start */}
                          <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-6.5px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-6px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${topnewHeights*screen/mCalc}vw - 12px)`, marginRight: '-4px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${topnewHeights*screen/mCalc}vw - 12px)`, marginLeft: '-3px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>
                          {/* Inner corner lines end */}
                            {/* outer corner lines start for bottom sash*/}
                           <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-12px', marginRight: '-9px', transform: 'rotate(45deg)',  background: index === topsash.length -1  ? 'black' : 'transparent'}}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-12px', marginLeft: '-9px', transform: 'rotate(-45deg)', background: index === 0 ? 'black' : 'transparent'}}></div>
                          {/* <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${bottomnewHeights*screen/mCalc}vw - 12px)`, marginRight: '-11px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${bottomnewHeights*screen/mCalc}vw - 12px)`, marginLeft: '-9px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>  */}
                          {/* outer corner lines end */}
                          <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${topnewHeights*screen/mCalc}vw - 8px)`, marginRight: '-6px', transform: 'rotate(180deg)', background: index === topsash.length -1  ? 'black' : 'transparent' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${topnewHeights*screen/mCalc}vw - 8px)`, marginLeft: '-6px', transform: 'rotate(180deg)', background: index === 0 ? 'black' : 'transparent' }}></div>
                                  {topsash[index].type === 'shutter' ?(
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
                                     
                                        alt="Left Handle"
                                      />
                                      <div style={{ position: 'absolute', width: '100%', height: '100%',overflow:'hidden' }}>
                                        {/* Left Diagonal Line  */}
                                        <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(${Math.atan((topFixedWidth.length ? topFixedWidth[index] : boxWidth) / (2 * topnewHeights)) * (180 / Math.PI)+2.5}deg)`, transformOrigin: 'top left' }}></div>


                                        {/* Right Diagonal Line */}
                                        <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(-${Math.atan((topFixedWidth.length ? topFixedWidth[index] : boxWidth) / (2 * topnewHeights))* (180 / Math.PI)+2.5}deg)`, transformOrigin: 'top left' }}></div>

                                      </div>
                                      {topsash[index].type === 'shutter' && grill === 'yes' && boxes(topnewHeights + 0.3)}
                                    </>
                                  ):(
                                    <>
                                    {/* fixed plus  */}
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                  </>
                                  )

                                  }
                                </div>
                                </div>
                              ))}
                            </div>
                          ))
                        )}

                          <div style={{ display: 'flex' }}>
                            {[...Array(numSecondInnerBoxes)].map((_, index) => (

                             <div key={index} style={{ height: `calc(${(boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc}vw - ${boxTop === 'on' ? '24px' : '19px'})`, width: `calc(${newWidths[index] * screen / mCalc}vw )`, backgroundColor: 'white', padding: '5px',marginTop: boxTop === 'on' ? '0px' : '5px', marginRight: index === numSecondInnerBoxes - 1 ? '5px' : '3.5px',marginLeft: index === 0 ? '5px' : '3.5px', border: '1px solid #333',position: 'relative',boxSizing: 'border-box',}}>
                                <div style={{
                                  width: '100%',
                                  height: '100%',
                                  border: '1px solid #333',
                                  backgroundColor: boxColors[index],
                                  position:'relative'
                                }}>
                                {/* Inner corner lines start */} 
                                 <div key={index} style={{ height: boxBottom === 'on'?'11px':'15px', width: '1px', float: 'left', marginTop: `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen) / mCalc}vw - ${boxTop === 'on' ? '40px' : '34px'})`, marginLeft:boxBottom === 'on'?'-4px':'-6px', transform: 'rotate(45deg)', borderLeft: '1px solid grey' }}></div>
                                 <div key={index} style={{ height:boxTop === 'on'?'11px':'15px', width: '1px', float: 'left', marginTop:boxTop === 'on'?'-9px':'-14px', marginLeft:boxTop === 'on'?'-4px':'-6px', transform: 'rotate(-45deg)', borderLeft: '1px solid grey' }}></div>
                                 <div style={{ height: boxTop === 'on'?'11px':'15px', width: '1px', float: 'right', marginTop:boxTop === 'on'?'-9px':'-14px', marginRight:boxTop === 'on'?'-4px':'-6px', transform: 'rotate(45deg)', borderRight: '1px solid grey' }}></div>
                                 {/* <div style={{ height: '15px', width: '1px', float: 'left', marginTop: getInnerBottom(boxHeight - topnewHeights - bottomnewHeights, screen, mCalc), marginLeft: '-4px', transform: 'rotate(-45deg)', borderLeft: index === 0 ? 'transparent' : '1px solid black' }}></div> */}
                                 <div style={{ height: boxBottom === 'on'?'11px':'15px', width: '1px', float: 'right', marginTop: getInnerBottom(boxHeight - topnewHeights - bottomnewHeights, screen, mCalc), marginRight:boxBottom==='on'?'-4px':'-6px', transform: 'rotate(-45deg)', borderLeft: '1px solid grey' }}></div>
                                 <div style={{ height: '10px', width: '1px', float: 'right', marginTop: `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen) / mCalc}vw - ${boxBottom === 'on' ? '33px' : '27px'})`, marginRight: '-4px', transform: 'rotate(-45deg)', borderRight: index === -1 ? '1px solid grey' : 'none' }}></div>
                                 {/* <div style={{ height: '7px', width: '1px', float: 'left', right: '0px', marginTop: '-6px', marginRight: '-1px', background: index === 0 ? 'transparent' : 'black' }}></div> */}
                                {/* Inner corner lines ends */} 
                                {boxBottom==='on'?      
                                <>
                                 <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen) / mCalc}vw - ${boxBottom === 'on' ? '33px' : '27px'})`, marginRight: '-7px', transform: 'rotate(180deg)', background: index === newWidths.length -1  ? 'black' : 'transparent' }}></div>
                                 <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen) / mCalc}vw - ${boxBottom === 'on' ? '33px' : '27px'})`, marginLeft: '-7px', transform: 'rotate(180deg)', background: index === 0 ? 'black' : 'transparent' }}></div>
                                 </>:
                                <></>}
                                
                                <div className="expanding-arrow-line" style={{
                                  position: 'absolute',
                                  float: 'left',
                                  width: `calc(${((newWidths[index] * screen) / mCalc)}vw - 15px)`,
                                  bottom: '-10px',
                                  top: `calc(${boxHeight * screen / mCalc}vw )`,
                                }}

                                >
                                  <div className="arrow-left"></div>
                                  <div className="line" align="center">
                                    <div style={{ marginTop: '-7px', background: 'white', maxWidth: '60px', textAlign: 'center' }}><p>{ parseFloat(newWidths[index]).toFixed(2)}</p></div>
                                  </div>
                                  <div className="arrow-right"></div>
                                </div>


                                {
                                  boxNames[index] === 'Shutter' ? (
                                    boxHandle[index] === 'left' ? (
                                      <>
                                        {/* Left Handle and Right Arrow */}
                                        <img
                                          src={left}
                                          style={{
                                            float: 'left',
                                            marginTop: `calc(${(((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc) / 2)}vw - ${screen === 3 ? '28px':'25px'}`,
                                            marginLeft: '-5px',
                                            width: screen === 3 ? '13px' : '8px'
                                          }}
                                         
                                          alt="Left Handle"
                                        />
                                        {/* dotted line start */}
                                        <div style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', zIndex: 1, overflow: 'hidden' }}>

                                          {/* Line from center to top-right */}
                                          <div style={{ position: 'absolute', top: '50%', right: '0', width: '2px', height: '200%', borderLeft: '1px dashed gray', transform: `rotate(${(boxTop === 'on' || boxBottom === 'on' ? -1 : 0) + 90 + Math.acos((2 * ((newWidths[index]* screen / mCalc)/2)) / Math.sqrt(4 * ((newWidths[index]* screen / mCalc)/2) * ((newWidths[index]* screen / mCalc)/2) + ((boxHeight - topnewHeights - bottomnewHeights)* screen / mCalc)/2 * ((boxHeight - topnewHeights - bottomnewHeights)* screen / mCalc)/2)) * (180 / Math.PI)+((numSecondInnerBoxes===1)?0:numSecondInnerBoxes)}deg)`, transformOrigin: 'top right' }}></div>
                                          {/* Line from center to bottom-right */}
                                          <div style={{ position: 'absolute', bottom: '50%', right: '0', width: '2px', height: '200%', borderLeft: '1px dashed gray', transform: `rotate(-${(boxTop === 'on' || boxBottom === 'on' ? -1 : 0) + 90 + Math.acos((2 * ((newWidths[index]* screen / mCalc)/2)) / Math.sqrt(4 * ((newWidths[index]* screen / mCalc)/2) * ((newWidths[index]* screen / mCalc)/2) + (((boxHeight - topnewHeights - bottomnewHeights)* screen / mCalc)/2) * (((boxHeight - topnewHeights - bottomnewHeights)* screen / mCalc)/2))) * (180 / Math.PI)+((numSecondInnerBoxes===1)?0:numSecondInnerBoxes)}deg)`, transformOrigin: 'bottom right' }}></div>
                                        </div>
                                        {/* dotted line end */}
                                      </>
                                    ) : (
                                      <>
                                        <img
                                          src={right}
                                          style={{
                                            float: 'right',
                                            marginTop: `calc(${(((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc) / 2)}vw - ${screen === 3 ? '28px':'25px'}`,
                                            marginRight: '-5px',
                                            width: screen === 3 ? '13px' : '8px'
                                          }}
                                   
                                          alt="Right Handle"
                                        />
                                        <div style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', zIndex: 1, overflow: 'hidden' }}>

                                          {/* Line from center to top-left */}
                                          <div style={{ position: 'absolute', top: '50%', left: '0', width: '2px', height: '150%', borderLeft: '1px dashed gray', transform: `rotate(-${(boxTop === 'on' || boxBottom === 'on' ? -1 : 0) + 90 + Math.acos((2 * (newWidths[index] / 2)) / Math.sqrt(4 * (newWidths[index] / 2) * (newWidths[index] / 2) + ((boxHeight - topnewHeights - bottomnewHeights) / 2) * ((boxHeight - topnewHeights - bottomnewHeights) / 2))) * (180 / Math.PI)+((numSecondInnerBoxes===1)?0:numSecondInnerBoxes)}deg)`, transformOrigin: 'top left' }}></div>


                                          {/* Line from center to bottom-left */}
                                          <div style={{ position: 'absolute', bottom: '50%', left: '0', width: '2px', height: '150%', borderLeft: '1px dashed gray', transform: `rotate(${(boxTop === 'on' || boxBottom === 'on' ? -1 : 0) + 90 + Math.acos((2 * (newWidths[index]/2)) / Math.sqrt(4 * (newWidths[index]/2) * (newWidths[index]/2) + ((boxHeight - topnewHeights - bottomnewHeights)/2) * ((boxHeight - topnewHeights - bottomnewHeights)/2))) * (180 / Math.PI)+((numSecondInnerBoxes===1)?0:numSecondInnerBoxes)}deg)`, transformOrigin: 'bottom left' }}></div></div>

                                      </>
                                    )
                                  ) : (
                                    <>
                                      {/* Plus Icon in Center */}
                                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '50px', fontWeight: '100', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>

                                    </>
                                  )
                                }



                                {mesh === 'yes' && boxNames[index] === 'Shutter' && boxHandle[index] === 'left' && (
                                  <img src={meshimg} style={{ width: screen === 3 ? '40px' : '20px', float: 'left', marginLeft: screen === 3 ? boxHandle[index] === 'left' ? '-8px' : '0px' : boxHandle[index] === 'left' ? '-4px' : 'px', marginTop: screen === 3 ? `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc)}vw - ${boxTop === 'on' ? '76px' : '72px'} )` : `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc)}vw - 54px)` }} />
                                )}

                                {mesh === 'yes' && boxNames[index] === 'Shutter' && boxHandle[index] === 'right' && (
                                  <img src={meshimg} style={{ width: screen === 3 ? '40px' : '20px', float: 'left', marginLeft: screen === 3 ? boxHandle[index] === 'right' ? '-1px' : '0px' : boxHandle[index] === 'right' ? '0px' : 'px', marginTop: screen === 3 ? `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc)}vw - ${boxTop === 'on' ? '76px' : '72px'} )` : `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc)}vw - 54px)` }} />
                                )}

                                {boxNames[index] === 'Shutter' && grill === 'yes' && boxes(boxHeight - topnewHeights - bottomnewHeights)}

                              </div>
                               </div> 

                            ))}

                          </div>

                           {boxBottom === 'on' && (
                              [...Array(numBottomBoxes)].map((_, index) => (
                                <div style={{ display: 'flex', width: `calc(${boxWidth * screen / mCalc / numFrames + 'vw'} - 19px)`, height: `calc(${(bottomnewHeights * screen / mCalc) + 'vw'} -10px)`, margin: '5px',position:'relative' }}>
                                  {[...Array(bottomFixedNum)].map((_, index) => (
                                    <div style={{ flex: '1', backgroundColor:'white',padding:'4px',boxSizing:'border-box', width: `calc(${bottomFixedWidth[index] * screen / mCalc / numFrames + 'vw'} - 18px)`, height: `calc(${(bottomnewHeights * screen / mCalc) + 'vw'} - 5px)`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px',position:'relative' }}>
                                      <div style={{
                                        height:'100%',
                                        width:'100%',
                                        position:'relative',
                                        backgroundColor:bottomsash[index].type === 'fixed' ? 'lightgreen' : 'lightblue',
                                        border:'1px solid black'
                                      }}>
                          {/* inner corner lines start for bottom sash*/}
                          <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-6.5px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-6px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${bottomnewHeights*screen/mCalc}vw - 18px)`, marginRight: '-4px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${bottomnewHeights*screen/mCalc}vw - 18px)`, marginLeft: '-3px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>
                          {/* inner corner lines end */}
                           {/* outer corner lines start for bottom sash*/}
                           {/* <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-13px', marginRight: '-9px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-12px', marginLeft: '-9px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>*/}
                          <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${bottomnewHeights*screen/mCalc}vw - 12px)`, marginRight: '-11px', transform: 'rotate(-45deg)',background: index === bottomsash.length -1 ? 'black' : 'transparent' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${bottomnewHeights*screen/mCalc}vw - 12px)`, marginLeft: '-9px', transform: 'rotate(45deg)', background: index === 0 ? 'black' : 'transparent'  }}></div> 
                          {/* outer corner lines end */}
                          {/* <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${boxHeight-topnewHeights*screen/mCalc}vw - ${screen === 3 ? '28px':'24px'})`, marginRight: '-6px', transform: 'rotate(180deg)', background: index === bottomsash.length -1  ? 'black' : 'transparent' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${boxHeight-topnewHeights*screen/mCalc}vw - ${screen === 3 ? '28px':'24px'})`, marginLeft: '-6px', transform: 'rotate(180deg)', background: index === 0 ? 'black' : 'transparent' }}></div> */}

                                      {bottomsash[index].type === 'shutter' ?(
                                        <>
                                        <img
                                          src={left}
                                          style={{
                                          float: 'left',
                                          marginTop: `calc(${(((bottomnewHeights) * screen / mCalc))}vw - ${screen === 3 ? '28px':'25px'})`,
                                          marginLeft: '45%',
                                          width: screen === 3 ? '13px' : '8px',
                                          transform: 'rotate(-90deg)'
                                          }}
                                   
                                          alt="Left Handle"
                                        />
                                          <div style={{ position: 'absolute', width: '100%', height: '100%',overflow:'hidden' }}>
                                             {/* Left Diagonal Line  */}
                                             <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(${Math.atan((bottomFixedWidth.length ? bottomFixedWidth[index] : boxWidth) / (2 * bottomnewHeights)) * (180 / Math.PI)+2.5}deg)`, transformOrigin: 'top left' }}></div>
                                         
                                         
                                             {/* Right Diagonal Line */}
                                             <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(-${Math.atan((bottomFixedWidth.length ? bottomFixedWidth[index] : boxWidth) / (2 * bottomnewHeights)) * (180 / Math.PI)+2.5}deg)`, transformOrigin: 'top left' }}></div>
                                         
                                          </div>  
  
                                        {bottomsash[index].type === 'shutter' && grill === 'yes' && boxes(topnewHeights+0.3)}
                                      </>
                                      ):(
                                        <>
                                         {/* fixed plus  */}
                                         <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                        </>
                                      )
                                      
                                      }
                           
                                    </div>
                                    </div>
                                 
                                  ))}
                                </div>
                                
                              ))
                            )}                     

                          {numSecondInnerBoxes === 0 ? (
                            <div className="expanding-arrow-line" style={{ float: 'left', marginLeft: '-5px', width: ((boxWidth / numFrames) * screen / mCalc) + 'vw', top: (boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc + 'vw', }} >
                              <div className="arrow-left"></div>
                              <div className="line" align="center">
                                <div style={{ marginTop: '-8px', background: 'white', maxWidth: '60px', textAlign: 'center' }}><p>{ parseFloat(boxWidth / numFrames).toFixed(2)}</p></div>
                              </div>
                              <div className="arrow-right"></div>
                            </div>
                          ) : (
                            <div className="expanding-arrow-line" style={{ float: 'left', marginLeft: '-5px', width: ((boxWidth / numFrames) * screen / mCalc) + 'vw', bottom: '-10px', top: '50px', }} >
                              <div className="arrow-left"></div>
                              <div className="line" align="center">
                                <div style={{ marginTop: '-8px', background: 'white', maxWidth: '60px', textAlign: 'center' }}><p>{ parseFloat(boxWidth / numFrames).toFixed(2)}</p></div>
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
                            <div style={{ marginLeft: '-10px', marginTop: topnewHeights * (screen / mCalc / 2) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{typeof topnewHeights === 'number' ? topnewHeights.toFixed(2) : topnewHeights}</p></div>
                          </div>
                          <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        </div>
                      
                      <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc}vw - ${boxTop === 'on' ? '30px' : '15px'})`, top: `calc(${topnewHeights * screen / mCalc}vw + ${boxTop === 'on' ? '15px' : '0px'})`, position: 'relative' }}>
                        <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                          <div style={{ marginLeft: '-10px', marginTop: (boxHeight - topnewHeights - bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{ Number(boxHeight - topnewHeights - bottomnewHeights).toFixed(2)}</p></div>
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
                          <div style={{ marginLeft: '-10px', marginTop: (boxHeight - topnewHeights - bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{ Number(boxHeight - topnewHeights - bottomnewHeights).toFixed(2)}</p></div>
                        </div>
                        <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                      </div>
                        <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(bottomnewHeights) * screen / mCalc}vw + 5px)`, top: `calc(${(boxHeight - bottomnewHeights) * screen / mCalc}vw - ${boxTop === 'on' ? '10px' : '10px'})`, position: 'relative' }}>
                          <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                          <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                            <div style={{ marginLeft: '-10px', marginTop: (bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{ Number(bottomnewHeights).toFixed(2)}</p></div>
                          </div>
                          <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        </div>
                        </>
                      }

                    </div>

                    <div style={{ width: '30px', float: 'left', paddingLeft: boxBottom === 'on' || boxTop === 'on' ?'0px' : '15px', textAlign: 'left' }}>
                      <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${boxHeight * screen / mCalc}vw)`, top: '0', position: 'relative' }}>
                        <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                          <div style={{ marginLeft: '-10px', marginTop: boxHeight * (screen / mCalc / 2) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{ Number(boxHeight).toFixed(2)}</p></div>
                        </div>
                        <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                      </div>
                    </div>


                    </div>

                  </div>
                </div>




              </div>


              {numSecondInnerBoxes === 0 ? (<div></div>) : (
                <>
                  <div class="col-md-12 col-xxl-2 col-xl-2">
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

                  <div class="col-md-12 col-xxl-2 col-xl-2">
                    <div class="card">
                      <div class="card-body">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 ms-3">
                            <h6 class="mb-0">Shutters</h6>
                          </div>
                        </div>
                        <div class="bg-body p-3 mt-3 rounded">
                          <div class="mt-3 row align-items-center">
                            <div class="col-12">
                              <h6 class="mb-1">{shutterCount * numFrames}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-12 col-xxl-2 col-xl-2">
                    <div class="card">
                      <div class="card-body">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 ms-3">
                            <h6 class="mb-0">Fixed</h6>
                          </div>
                        </div>
                        <div class="bg-body p-3 mt-3 rounded">
                          <div class="mt-3 row align-items-center">
                            <div class="col-12">
                              <h6 class="mb-1">{fixedShutters}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-12 col-xxl-2 col-xl-2">
                    <div class="card">
                      <div class="card-body">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 ms-3">
                            <h6 class="mb-0">Mullions</h6>
                          </div>
                        </div>
                        <div class="bg-body p-3 mt-3 rounded">
                          <div class="mt-3 row align-items-center">
                            <div class="col-12">
                              <h6 class="mb-1">{newHeights === 0 ? ((numSecondInnerBoxes - 1) * numFrames) : ((numSecondInnerBoxes) * numFrames)}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-12 col-xxl-2 col-xl-2">
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

                  <div class="col-md-12 col-xxl-2 col-xl-2">
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
                              <h6 class="mb-1">₹ {numeral(grandTotal / frameArea).format('0,0.00')}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
                              <th width="10%">Req. Qty (Feet)</th>
                              <th width="10%">Req. Qty (Mtr)</th>
                              <th width="10%">Rate/Mtr</th>
                              <th width="10%">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Casement Outer Frame</td>
                              <td>{numeral(Frame()).format('0,0.00')}</td>
                              <td>{numeral(values.frame.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frame.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frame.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Casement Shutter</td>
                              <td>{numeral(Shutter()).format('0,0.00')}</td>
                              <td>{numeral(values.shutter.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.shutter.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.shutter.amount * qty).format('0,0.00')}</td>
                            </tr>

                            {mesh === 'yes' && (

                              <tr>
                                <td>Mesh Frame</td>
                                <td>{numeral(meshFrame()).format('0,0.00')}</td>
                                <td>{numeral(values.meshFrame.rqm * qty).format('0,0.00')}</td>
                                <td>{numeral(values.meshFrame.rpm * qty).format('0,0.00')}</td>
                                <td>{numeral(values.meshFrame.amount * qty).format('0,0.00')}</td>
                              </tr>

                            )}

                            <tr>
                              <td>Beeding</td>
                              <td>{numeral(Beeding()).format('0,0.00')}</td>
                              <td>{numeral(values.beeding.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.beeding.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.beeding.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Mullion</td>
                              <td>{numeral(Mullion()).format('0,0.00')}</td>
                              <td>{numeral(values.mullion.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.mullion.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.mullion.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Frame Gasket</td>
                              <td>{numeral(frameGasket()).format('0,0.00')}</td>
                              <td>{numeral(values.frameGasket.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frameGasket.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frameGasket.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Shutter Gasket</td>
                              <td>{numeral(shutterGasket()).format('0,0.00')}</td>
                              <td>{numeral(values.shutterGasket.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.shutterGasket.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.shutterGasket.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Mullion Gasket</td>
                              <td>{numeral(Mullion()).format('0,0.00')}</td>
                              <td>{numeral(values.mullionGasket.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.mullionGasket.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.mullionGasket.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Beeding Gasket</td>
                              <td>{numeral(beedingGasket()).format('0,0.00')}</td>
                              <td>{numeral(values.beedingGasket.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.beedingGasket.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.beedingGasket.amount * qty).format('0,0.00')}</td>
                            </tr>
                            {mesh === 'yes' && (

                              <tr>
                                <td>Mesh Gasket</td>
                                <td>{numeral(meshGasket()).format('0,0.00')}</td>
                                {/* <td>{numeral(values.meshGasket.rqm * qty).format('0,0.00')}</td> */}
                                <td>{numeral(values.meshGasket.rpm * qty).format('0,0.00')}</td>
                                <td>{numeral(values.meshGasket.amount * qty).format('0,0.00')}</td>
                              </tr>

                            )}
                            {numFrames === 1 ? (<></>) : (
                              <tr>
                                <td>Cupler Joint/Square Joint </td>
                                <td>{numeral(cuplerJoint()).format('0,0.00')}</td>
                                <td>{numeral(values.cupler.rqm * qty).format('0,0.00')}</td>
                                <td>{numeral(values.cupler.rpm * qty).format('0,0.00')}</td>
                                <td>{numeral(values.cupler.amount * qty).format('0,0.00')}</td>
                             </tr>
                            )}

                            <tr>
                              <td colspan="4">Total</td>
                              <td>{numeral(frameTotal).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <th colspan="4">Wastage ( {data.wastage}% )</th>
                              <th>{numeral(frameTotal + wastage).format('0,0.00')}</th>
                            </tr>
                            <tr>
                              <th colspan="4">Profile Cost/Sqft</th>
                              <th>{numeral((frameTotal + wastage) / frameArea).format('0,0.00')}</th>
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
                              <th>Product Description</th>
                              <th width="10%">Req. Qty </th>
                              <th width="10%">Price</th>
                              <th width="10%">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mesh === 'yes' && (
                              <>
                                <tr>
                                  <td>Mesh 3.4 SS</td>
                                  <td>{numeral(values.mesh.qty).format('0,0.00')}</td>
                                  <td>{numeral(values.mesh.price).format('0,0.00')}</td>
                                  <td>{numeral(values.mesh.amount).format('0,0.00')}</td>
                                </tr>
                                <tr>
                                  <td>Steel Mesh</td>
                                  <td>{numeral(values.steelMesh.qty).format('0,0.00')}</td>
                                  <td>{numeral(values.steelMesh.price).format('0,0.00')}</td>
                                  <td>{numeral(values.steelMesh.amount).format('0,0.00')}</td>
                                </tr>

                                <tr>
                                  <td>Mesh Jump Arrester</td>
                                  <td>{numeral(values.meshja.qty * qty).format('0,0.00')}</td>
                                  <td>{numeral(values.meshja.price * qty).format('0,0.00')}</td>
                                  <td>{numeral(values.meshja.amount * qty).format('0,0.00')}</td>
                                </tr>
                              </>
                            )}
                            <tr>
                              <td>Steel Frame</td>
                              <td>{numeral(values.steelFrame.qty).format('0,0.00')}</td>
                              <td>{numeral(values.steelFrame.price).format('0,0.00')}</td>
                              <td>{numeral(values.steelFrame.amount).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Steel Mullion</td>
                              <td>{numeral(values.steelMullion.qty).format('0,0.00')}</td>
                              <td>{numeral(values.steelMullion.price).format('0,0.00')}</td>
                              <td>{numeral(values.steelMullion.amount).format('0,0.00')}</td>
                            </tr>

                            <tr>
                              <td>Mullion Clamp</td>
                              <td>{numeral(values.mullionclamp.qty * qty).format('0,0.00')}</td>
                              <td>{numeral(values.mullionclamp.price * qty).format('0,0.00')}</td>
                              <td>{numeral(values.mullionclamp.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Steel Shutter</td>
                              <td>{numeral(values.steelShutter.qty).format('0,0.00')}</td>
                              <td>{numeral(values.steelShutter.price).format('0,0.00')}</td>
                              <td>{numeral(values.steelShutter.amount).format('0,0.00')}</td>
                            </tr>
                            {/* <tr>
                              <td>Multi Point Lock ( MPL )</td>
                              <td>{numeral(values.mpl.qty).format('0,0.00')}</td>
                              <td>{numeral(values.mpl.price).format('0,0.00')}</td>
                              <td>{numeral(values.mpl.amount).format('0,0.00')}</td>
                            </tr> */}
                            <tr>
                              <td>Handle</td>
                              <td>{numeral(values.handle.qty).format('0,0.00')}</td>
                              <td>{numeral(values.handle.price).format('0,0.00')}</td>
                              <td>{numeral(values.handle.amount).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Friction Stay</td>
                              <td>{numeral(values.frictionstay.qty * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frictionstay.price * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frictionstay.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Runner Block</td>
                              <td>{numeral(values.runnerblock.qty * qty).format('0,0.00')}</td>
                              <td>{numeral(values.runnerblock.price * qty).format('0,0.00')}</td>
                              <td>{numeral(values.runnerblock.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>SecurityClip</td>
                              <td>{numeral(values.securityclip.qty * qty).format('0,0.00')}</td>
                              <td>{numeral(values.securityclip.price * qty).format('0,0.00')}</td>
                              <td>{numeral(values.securityclip.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Espag with SS Receiver</td>
                              <td>{numeral(values.espag.qty * qty).format('0,0.00')}</td>
                              <td>{numeral(values.espag.price * qty).format('0,0.00')}</td>
                              <td>{numeral(values.espag.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Espag with Multi Lock</td>
                              <td>{numeral(values.espagm.qty * qty).format('0,0.00')}</td>
                              <td>{numeral(values.espagm.price * qty).format('0,0.00')}</td>
                              <td>{numeral(values.espagm.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Adjust Roller</td>
                              <td>{numeral(values.adjroll.qty * qty).format('0,0.00')}</td>
                              <td>{numeral(values.adjroll.price * qty).format('0,0.00')}</td>
                              <td>{numeral(values.adjroll.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Hings Set</td>
                              <td>{numeral(values.hings.qty).format('0,0.00')}</td>
                              <td>{numeral(values.hings.price).format('0,0.00')}</td>
                              <td>{numeral(values.hings.amount).format('0,0.00')}</td>
                            </tr>
                            {grill === 'yes' && (
                              <tr>
                                <td>Grill</td>
                                <td>{numeral(values.grill.qty * qty).format('0,0.00')}</td>
                                <td>{numeral(values.grill.price * qty).format('0,0.00')}</td>
                                <td>{numeral(values.grill.amount * qty).format('0,0.00')}</td>
                              </tr>
                            )}
                            <tr>
                              <td>Screws/Misc</td>
                              <td>{numeral(values.screws.qty).format('0,0.00')}</td>
                              <td>{numeral(values.screws.price).format('0,0.00')}</td>
                              <td>{numeral(values.screws.amount).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <th colspan="3">Total</th>
                              <th>{numeral(hardTotal).format('0,0.00')}</th>
                            </tr>
                            <tr>
                              <th colspan="3">Hardware Cost/Sqft</th>
                              <th>{numeral(hardTotal / frameArea).format('0,0.00')}</th>
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
                                <th>Product Description</th>
                                <th width="10%">Req. Qty </th>
                                <th width="10%">Price</th>
                                <th width="10%">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Margin</td>
                                <td>{numeral(values.margin.qty).format('0,0.00')}</td>
                                <td>{numeral(values.margin.price).format('0,0.00')}</td>
                                <td>{numeral(values.margin.amount).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <th colspan="3">Total</th>
                                <th>{numeral(marginTotal).format('0,0.00')}</th>
                              </tr>
                              <tr>
                                <th colspan="3">Margin Cost/Sqft</th>
                                <th>{numeral(marginTotal / frameArea).format('0,0.00')}</th>
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
                                <th>Product Description</th>
                                <th width="10%">Req. Qty </th>
                                <th width="10%">Price</th>
                                <th width="10%">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Markting OH</td>
                                <td>{numeral(values.marketing.qty).format('0,0.00')}</td>
                                <td>{numeral(values.marketing.price).format('0,0.00')}</td>
                                <td>{numeral(values.marketing.amount).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <td>Transport</td>
                                <td>{numeral(values.transport.qty).format('0,0.00')}</td>
                                <td>{numeral(values.transport.price).format('0,0.00')}</td>
                                <td>{numeral(values.transport.amount).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <td>Labour (Factory)</td>
                                <td>{numeral(values.labourF.qty).format('0,0.00')}</td>
                                <td>{numeral(values.labourF.price).format('0,0.00')}</td>
                                <td>{numeral(values.labourF.amount).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <td>Labour (Site)</td>
                                <td>{numeral(values.labourS.qty).format('0,0.00')}</td>
                                <td>{numeral(values.labourS.price).format('0,0.00')}</td>
                                <td>{numeral(values.labourS.amount).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <td>Glass</td>
                                <td>{numeral(values.glass.qty).format('0,0.00')}</td>
                                <td>{numeral(values.glass.price).format('0,0.00')}</td>
                                <td>{numeral(values.glass.amount).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <th colspan="3">Total</th>
                                <th>{numeral(prodTotal).format('0,0.00')}</th>
                              </tr>
                              <tr>
                                <th colspan="3">Production Cost/Sqft</th>
                                <th>{numeral(prodTotal / frameArea).format('0,0.00')}</th>
                              </tr>

                            </tbody>
                          </table>
                        </div>
                      </>
                      )}

                    </div>
                  </div>





                </>
              )}


            </div>
          </div>
        </div>



      )}

       {item === 'SlidingWindow' && (
        <div class="pc-container">
          <div class="pc-content">

            <div class="row">

              <div class="col-md-12 col-xxl-12 col-xl-12" >
                <div class="card" style={{ background: '#fff' }}>
                  <div class="card-body mb-5">

                    <div>
                      <div style={{ float: 'left', boxShadow: '1px 1px 5px grey', width: boxWidth * screen / mCalc + 'vw', height: boxHeight * screen / mCalc + 'vw', border: '1px solid #333' }}>

                        {[...Array(numFrames)].map((_, index) => (
                          <div style={{ float: 'left', margin: '5px', border: '1px solid #333', width: `calc(${boxWidth * screen / mCalc / numFrames + 'vw'} - 12px)`, height: `calc(${boxHeight * screen / mCalc + 'vw'} - 12px)`, position: 'relative' }}>
                            {/* outer corner lines start */}
                            <div style={{ height: '8px', width: '1px', float: 'right', marginTop: '-7px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid #333' }}></div>
                            {/* outer corner top left */}
                            <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-7px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: '1px solid #333' }}></div>
                           {/* outer corner  bottom right */}
                            <div style={{ height: '9px', width: '1px', float: 'right', marginTop: `calc(${boxHeight * screen/ mCalc}vw - 15px)`, marginRight: '-4px', transform: 'rotate(-45deg)', borderRight: '1px solid #333' }}></div>
                            {/* outer corner bottom left */}
                            <div style={{ height: '9px', width: '1px', float: 'left', marginTop: `calc(${boxHeight * screen/ mCalc}vw - 15px)`, marginLeft: '-4px', transform: 'rotate(45deg)', borderRight: '1px solid #333' }}></div>
                            {/* outer corner lines end */}

                            {boxTop === 'on' && (

                              [...Array(numTopBoxes)].map((_, index) => (
                                <div style={{ display: 'flex', position: 'relative', width: `calc(${boxWidth * screen / mCalc / numFrames + 'vw'} - 23px)`, height: `calc(${(topnewHeights * screen / mCalc)}vw )`, margin: '5px' }}>
                                  {[...Array(topFixedNum)].map((_, index) => (
                                    <div style={{ flex: '1', background: topsash[index].type === 'fixed' ? 'lightgreen' : 'lightblue', width: `calc(${topFixedWidth[index] * screen / mCalc / numFrames + 'vw'} - 18px)`, height: `calc(${(topnewHeights * screen / mCalc)}vw )`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px', position: 'relative' }}>
                                      {/* outer corner lines start for bottom sash*/}
                                      <div style={{ height: '8px', width: '1px', float: 'right', marginTop: '-7px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: index === topsash.length - 1 ? '1px solid #333' : 'none' }}></div>
                                      <div style={{ height: '9px', width: '1px', float: 'left', marginTop: '-7px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: index === 0 ? '1px solid #333' : 'none' }}></div>


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


                                <div key={index} style={{ height: `calc(${(boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc}vw - ${boxTop === 'on' ? '29px' : '24px'})`, width: `calc(${newWidths[index] * screen / mCalc}vw)`, backgroundColor: boxColors[index] || 'lightblue', marginTop: boxTop === 'on' ? '0px' : '5px', marginRight: index === numSecondInnerBoxes - 1 ? '5px' : '2.5px', marginLeft: index === 0 ? '5px' : '2.5px', border: '1px solid #333', position: 'relative' }}>
                                  {/* Inner corner lines start */}
                                  {/* bottom left corner  */}
                                  <div key={index} style={{ height: '9px', width: '1px', float: 'left', marginTop: `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen) / mCalc}vw - ${boxTop === 'on' ? '33px' : '27px'})`, marginLeft: '-3px', transform: 'rotate(45deg)', borderLeft: index === 0 ? '1px solid black' : 'none' }}></div>
                                  {/* top left corner sub */}
                                  <div key={index} style={{ height: '9px', width: '1px', float: 'left', marginTop: '-7px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: index === 0 ? '1px solid black' : 'none' }}></div>
                                  {/* right corner sub inner box */}
                                  <div style={{ height: '8px', width: '1px', float: 'right', marginTop: '-7px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                                  {/* right corner inner box (sub) */}
                                  <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${(boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc}vw - ${boxTop === 'on' ? '33px' : '27px'})`, marginRight: '-3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                                  {/* <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen) / mCalc}vw - ${boxBottom === 'on' ? '33px' : '27px'})`, marginRight: '-4px', transform: 'rotate(-45deg)', borderRight: index === -1 ? '1px solid black' : 'none' }}></div> */}
                                  {/* center top center stright line code */}
                                  <div style={{ height: '7px', width: '1px', float: 'left', right: '0px', marginTop: '-6px', marginLeft: '-1px', borderRight: index === 0 ? 'none' : '1px solid #333' }}></div>
                                  {/* Inner corner lines ends */}
                                  <div style={{
                                    position: 'absolute',
                                    height: '7px',
                                    width: '1px',
                                    float: 'right',
                                    right: '0px',
                                    marginTop: '-6px',
                                    marginRight: '-1px',
                                    borderRight: index === numSecondInnerBoxes.length - 1 ? '1px solid #333' : 'none',
                                  }}></div>

                                  <div style={{
                                    height: '7px',
                                    width: '1px',
                                    float: 'left',
                                    right: '0px',
                                    marginTop: `calc(${(boxHeight - topnewHeights - bottomnewHeights) * screen/ mCalc}vw - ${boxTop === 'on' ? '31px' : '26px'} )`,
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
                                    <div
                                      style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        fontSize: '50px',
                                        fontWeight: '100',
                                        cursor: 'pointer',
                                        color: '#000',
                                        zIndex: 1,
                                      }}
                                    >
                                      +
                                    </div>
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
                                      <div style={{ height: '9px', width: '1px', float: 'right', marginTop: `calc(${bottomnewHeights * screen / mCalc}vw - 8px)`, marginRight: '-3px', transform: 'rotate(-45deg)', borderRight: index === bottomsash.length - 1 ? '1px solid #333' : 'none' }}></div>
                                      <div style={{ height: '9px', width: '1px', float: 'left', marginTop: `calc(${bottomnewHeights * screen / mCalc}vw - 8px)`, marginLeft: '-3px', transform: 'rotate(45deg)', borderLeft: index === 0 ? '1px solid #333' : 'none' }}></div>
                                      {/* outer corner lines end */}
                                      {bottomsash[index].type === 'shutter' ?
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

                                            alt="Left Handle"
                                          />
                                          <div style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' }}>
                                            {/* Left Diagonal Line  */}
                                            <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(${Math.atan((bottomFixedWidth.length ? bottomFixedWidth[index] : boxWidth) / (2 * bottomnewHeights)) * (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>


                                            {/* Right Diagonal Line */}
                                            <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(-${Math.atan((bottomFixedWidth.length ? bottomFixedWidth[index] : boxWidth) / (2 * bottomnewHeights)) * (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>

                                          </div>

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

                      <div style={{ width: '45px', float: 'left', paddingLeft: '15px', textAlign: 'left' }}>
                        {boxTop === 'on' &&
                          <>
                            <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${topnewHeights * screen / mCalc}vw + 10px)`, top: '0', position: 'relative' }}>
                              <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                              <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                                <div style={{ marginLeft: '-10px', marginTop: topnewHeights * (screen / mCalc / 2) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{typeof topnewHeights === 'number' ? topnewHeights.toFixed(2) : topnewHeights}</p></div>
                              </div>
                              <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                            </div>
                            <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc}vw - ${boxTop === 'on' ? '30px' : '15px'})`, top: `calc(${topnewHeights * screen / mCalc}vw + ${boxTop === 'on' ? '15px' : '0px'})`, position: 'relative' }}>
                              <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                              <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                                <div style={{ marginLeft: '-10px', marginTop: (boxHeight - topnewHeights - bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{typeof (boxHeight - topnewHeights - bottomnewHeights) === 'number' ? (boxHeight - topnewHeights - bottomnewHeights).toFixed(2) : (boxHeight - topnewHeights - bottomnewHeights)}</p></div>
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
                                <div style={{ marginLeft: '-10px', marginTop: (boxHeight - topnewHeights - bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{typeof (boxHeight - topnewHeights - bottomnewHeights) === 'number' ? (boxHeight - topnewHeights - bottomnewHeights).toFixed(2) : (boxHeight - topnewHeights - bottomnewHeights)}</p></div>
                              </div>
                              <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                            </div>
                            <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(bottomnewHeights) * screen / mCalc}vw + 5px)`, top: `calc(${(boxHeight - bottomnewHeights) * screen / mCalc}vw - ${boxTop === 'on' ? '10px' : '10px'})`, position: 'relative' }}>
                              <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                              <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                                <div style={{ marginLeft: '-10px', marginTop: (bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{typeof (bottomnewHeights) === 'number' ? (bottomnewHeights).toFixed(2) : (bottomnewHeights)}</p></div>
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

              </div>

              {numSecondInnerBoxes === 0 ? (<div></div>) : (
                <>
                  <div class="col-md-12 col-xxl-2 col-xl-2">
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

                  <div class="col-md-12 col-xxl-2 col-xl-2">
                    <div class="card">
                      <div class="card-body">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 ms-3">
                            <h6 class="mb-0">Shutters</h6>
                          </div>
                        </div>
                        <div class="bg-body p-3 mt-3 rounded">
                          <div class="mt-3 row align-items-center">
                            <div class="col-12">
                              <h6 class="mb-1">{shutterCount * numFrames}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-12 col-xxl-2 col-xl-2">
                    <div class="card">
                      <div class="card-body">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 ms-3">
                            <h6 class="mb-0">Fixed</h6>
                          </div>
                        </div>
                        <div class="bg-body p-3 mt-3 rounded">
                          <div class="mt-3 row align-items-center">
                            <div class="col-12">
                              <h6 class="mb-1">{fixedShutters}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-12 col-xxl-2 col-xl-2">
                    <div class="card">
                      <div class="card-body">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 ms-3">
                            <h6 class="mb-0">Mullions</h6>
                          </div>
                        </div>
                        <div class="bg-body p-3 mt-3 rounded">
                          <div class="mt-3 row align-items-center">
                            <div class="col-12">
                              <h6 class="mb-1">{newHeights === 0 ? 0 : 1}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-12 col-xxl-2 col-xl-2">
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

                  <div class="col-md-12 col-xxl-2 col-xl-2">
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
                              <h6 class="mb-1">₹ {numeral(grandTotal / frameArea).format('0,0.00')}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
                              <th width="10%">Req. Qty (Feet)</th>
                              <th width="10%">Req. Qty (Mtr)</th>
                              <th width="10%">Rate/Mtr</th>
                              <th width="10%">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{shutterCount}{mesh === 'yes' ? '.5' : ''} Track Outer Frame</td>
                              <td>{numeral(Frame()).format('0,0.00')}</td>
                              <td>{numeral(values.frame.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frame.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frame.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Shutter Frame</td>
                              <td>{numeral(Shutter()).format('0,0.00')}</td>
                              <td>{numeral(values.shutter.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.shutter.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.shutter.amount * qty).format('0,0.00')}</td>
                            </tr>
                            {mesh === 'yes' && (

                              <tr>
                                <td>Mesh Frame</td>
                                <td>{numeral(meshFrame()).format('0,0.00')}</td>
                                <td>{numeral(values.meshFrame.rqm * qty).format('0,0.00')}</td>
                                <td>{numeral(values.meshFrame.rpm * qty).format('0,0.00')}</td>
                                <td>{numeral(values.meshFrame.amount * qty).format('0,0.00')}</td>
                              </tr>

                            )}


                            <tr>
                              <td>Mullion</td>
                              <td>{numeral(Mullion()).format('0,0.00')}</td>
                              <td>{numeral(values.mullion.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.mullion.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.mullion.amount * qty).format('0,0.00')}</td>
                            </tr>


                            <tr>
                              <td>Beeding</td>
                              <td>{numeral(Beeding()).format('0,0.00')}</td>
                              <td>{numeral(values.beeding.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.beeding.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.beeding.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>InterLock</td>
                              <td>{numeral(interLock()).format('0,0.00')}</td>
                              <td>{numeral(values.interLock.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.interLock.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.interLock.amount * qty).format('0,0.00')}</td>
                            </tr>

                            {numFrames === 1 ? (<></>) : (
                              <tr>
                                <td>Cupler Joint/Square Joint </td>
                                <td>{numeral(cuplerJoint()).format('0,0.00')}</td>
                                <td>{numeral(values.cupler.rqm * qty).format('0,0.00')}</td>
                                <td>{numeral(values.cupler.rpm * qty).format('0,0.00')}</td>
                                <td>{numeral(values.cupler.amount * qty).format('0,0.00')}</td>
                              </tr>
                            )}
                            <tr>
                              <td>Frame Gasket</td>
                              <td>{numeral(frameGasket()).format('0,0.00')}</td>
                              <td>{numeral(values.frameGasket.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frameGasket.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frameGasket.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Shutter Gasket</td>
                              <td>{numeral(shutterGasket()).format('0,0.00')}</td>
                              <td>{numeral(values.shutterGasket.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.shutterGasket.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.shutterGasket.amount * qty).format('0,0.00')}</td>
                            </tr>

                            {newHeights > 0 && (
                              <tr>
                                <td>Mullion Gasket</td>
                                <td>{numeral(Mullion()).format('0,0.00')}</td>
                                <td>{numeral(values.mullionGasket.rqm * qty).format('0,0.00')}</td>
                                <td>{numeral(values.mullionGasket.rpm * qty).format('0,0.00')}</td>
                                <td>{numeral(values.mullionGasket.amount * qty).format('0,0.00')}</td>
                              </tr>
                            )}

                            <tr>
                              <td>Beeding Gasket</td>
                              <td>{numeral(beedingGasket()).format('0,0.00')}</td>
                              <td>{numeral(values.beedingGasket.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.beedingGasket.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.beedingGasket.amount * qty).format('0,0.00')}</td>
                            </tr>
                            {mesh === 'yes' && (

                              <tr>
                                <td>Mesh Gasket</td>
                                <td>{numeral(meshGasket()).format('0,0.00')}</td>
                                <td>{numeral(values.meshGasket.rqm * qty).format('0,0.00')}</td>
                                <td>{numeral(values.meshGasket.rpm * qty).format('0,0.00')}</td>
                                <td>{numeral(values.meshGasket.amount * qty).format('0,0.00')}</td>
                              </tr>

                            )}


                            <tr>
                              <td colspan="4">Total</td>
                              <td>{numeral(frameTotal).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <th colspan="4">Wastage ( {data.wastage}% )</th>
                              <th>{numeral(frameTotal + wastage).format('0,0.00')}</th>
                            </tr>
                            <tr>
                              <th colspan="4">Profile Cost/Sqft</th>
                              <th>{numeral((frameTotal + wastage) / frameArea).format('0,0.00')}</th>
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
                              <th>Product Description</th>
                              <th width="10%">Req. Qty </th>
                              <th width="10%">Price</th>
                              <th width="10%">Amount</th>
                            </tr>
                          </thead>
                          <tbody>

                            <tr>
                              <td>Steel Frame</td>
                              <td>{numeral(values.steelFrame.qty).format('0,0.00')}</td>
                              <td>{numeral(values.steelFrame.price).format('0,0.00')}</td>
                              <td>{numeral(values.steelFrame.amount).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Steel Shutter</td>
                              <td>{numeral(values.steelShutter.qty).format('0,0.00')}</td>
                              <td>{numeral(values.steelShutter.price).format('0,0.00')}</td>
                              <td>{numeral(values.steelShutter.amount).format('0,0.00')}</td>
                            </tr>

                            <tr>
                              <td>Steel Mullion</td>
                              <td>{numeral(values.steelMullion.qty).format('0,0.00')}</td>
                              <td>{numeral(values.steelMullion.price).format('0,0.00')}</td>
                              <td>{numeral(values.steelMullion.amount).format('0,0.00')}</td>
                            </tr>

                            <tr>
                              <td>Mullion Clamp</td>
                              <td>{numeral(values.mullionclamp.qty * qty).format('0,0.00')}</td>
                              <td>{numeral(values.mullionclamp.price * qty).format('0,0.00')}</td>
                              <td>{numeral(values.mullionclamp.amount * qty).format('0,0.00')}</td>
                            </tr>


                            {mesh === 'yes' && (
                              <>
                                <tr>
                                  <td>Steel Mesh</td>
                                  <td>{numeral(values.steelMesh.qty).format('0,0.00')}</td>
                                  <td>{numeral(values.steelMesh.price).format('0,0.00')}</td>
                                  <td>{numeral(values.steelMesh.amount).format('0,0.00')}</td>
                                </tr>
                                <tr>
                                  <td>Mesh Jump Arrester</td>
                                  <td>{numeral(values.meshja.qty * qty).format('0,0.00')}</td>
                                  <td>{numeral(values.meshja.price * qty).format('0,0.00')}</td>
                                  <td>{numeral(values.meshja.amount * qty).format('0,0.00')}</td>
                                </tr>
                              </>
                            )}

                            <tr>
                              <td>Friction Stay</td>
                              <td>{numeral(values.frictionstay.qty * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frictionstay.price * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frictionstay.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Espag with SS Receiver</td>
                              <td>{numeral(values.espag.qty * qty).format('0,0.00')}</td>
                              <td>{numeral(values.espag.price * qty).format('0,0.00')}</td>
                              <td>{numeral(values.espag.amount * qty).format('0,0.00')}</td>
                            </tr>

                            <tr>
                              <td>Aluminium Track</td>
                              <td>{numeral(values.alTrack.qty).format('0,0.00')}</td>
                              <td>{numeral(values.alTrack.price).format('0,0.00')}</td>
                              <td>{numeral(values.alTrack.amount).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Bump Arrester</td>
                              <td>{numeral(values.bArrester.qty).format('0,0.00')}</td>
                              <td>{numeral(values.bArrester.price).format('0,0.00')}</td>
                              <td>{numeral(values.bArrester.amount).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Jump Stopper</td>
                              <td>{numeral(values.jStopper.qty).format('0,0.00')}</td>
                              <td>{numeral(values.jStopper.price).format('0,0.00')}</td>
                              <td>{numeral(values.jStopper.amount).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Dust Arrester</td>
                              <td>{numeral(values.dArrester.qty).format('0,0.00')}</td>
                              <td>{numeral(values.dArrester.price).format('0,0.00')}</td>
                              <td>{numeral(values.dArrester.amount).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Grove Roller</td>
                              <td>{numeral(values.gRoller.qty).format('0,0.00')}</td>
                              <td>{numeral(values.gRoller.price).format('0,0.00')}</td>
                              <td>{numeral(values.gRoller.amount).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Touch Lock with SS Receiver</td>
                              <td>{numeral(values.touchlock.qty * qty).format('0,0.00')}</td>
                              <td>{numeral(values.touchlock.price * qty).format('0,0.00')}</td>
                              <td>{numeral(values.touchlock.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Weather Strip</td>
                              <td>{numeral(values.wStrip.qty).format('0,0.00')}</td>
                              <td>{numeral(values.wStrip.price).format('0,0.00')}</td>
                              <td>{numeral(values.wStrip.amount).format('0,0.00')}</td>
                            </tr>
                            {grill === 'yes' && (
                              <tr>
                                <td>Grill</td>
                                <td>{numeral(values.grill.qty * qty).format('0,0.00')}</td>
                                <td>{numeral(values.grill.price * qty).format('0,0.00')}</td>
                                <td>{numeral(values.grill.amount * qty).format('0,0.00')}</td>
                              </tr>
                            )}
                            <tr>
                              <td>Screws/Misc</td>
                              <td>{numeral(values.screws.qty).format('0,0.00')}</td>
                              <td>{numeral(values.screws.price).format('0,0.00')}</td>
                              <td>{numeral(values.screws.amount).format('0,0.00')}</td>
                            </tr>
                            {mesh === 'yes' && (
                              <>
                                <tr>
                                  <td>Mesh 30A Grade</td>
                                  <td>{numeral(values.mesh.qty).format('0,0.00')}</td>
                                  <td>{numeral(values.mesh.price).format('0,0.00')}</td>
                                  <td>{numeral(values.mesh.amount).format('0,0.00')}</td>
                                </tr>
                                <tr>
                                  <td>Mesh Roller</td>
                                  <td>{numeral(values.mRoller.qty).format('0,0.00')}</td>
                                  <td>{numeral(values.mRoller.price).format('0,0.00')}</td>
                                  <td>{numeral(values.mRoller.amount).format('0,0.00')}</td>
                                </tr>
                              </>
                            )}
                            <tr>
                              <th colspan="3">Total</th>
                              <th>{numeral(hardTotal).format('0,0.00')}</th>
                            </tr>
                            <tr>
                              <th colspan="3">Hardware Cost/Sqft</th>
                              <th>{numeral(hardTotal / frameArea).format('0,0.00')}</th>
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
                                <th>Product Description</th>
                                <th width="10%">Req. Qty </th>
                                <th width="10%">Price</th>
                                <th width="10%">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Margin</td>
                                <td>{numeral(values.margin.qty).format('0,0.00')}</td>
                                <td>{numeral(values.margin.price).format('0,0.00')}</td>
                                <td>{numeral(values.margin.amount).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <th colspan="3">Total</th>
                                <th>{numeral(marginTotal).format('0,0.00')}</th>
                              </tr>
                              <tr>
                                <th colspan="3">Margin Cost/Sqft</th>
                                <th>{numeral(marginTotal / frameArea).format('0,0.00')}</th>
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
                                <th>Product Description</th>
                                <th width="10%">Req. Qty </th>
                                <th width="10%">Price</th>
                                <th width="10%">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Markting OH</td>
                                <td>{numeral(values.marketing.qty).format('0,0.00')}</td>
                                <td>{numeral(values.marketing.price).format('0,0.00')}</td>
                                <td>{numeral(values.marketing.amount).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <td>Transport</td>
                                <td>{numeral(values.transport.qty).format('0,0.00')}</td>
                                <td>{numeral(values.transport.price).format('0,0.00')}</td>
                                <td>{numeral(values.transport.amount).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <td>Labour (Factory)</td>
                                <td>{numeral(values.labourF.qty).format('0,0.00')}</td>
                                <td>{numeral(values.labourF.price).format('0,0.00')}</td>
                                <td>{numeral(values.labourF.amount).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <td>Labour (Site)</td>
                                <td>{numeral(values.labourS.qty).format('0,0.00')}</td>
                                <td>{numeral(values.labourS.price).format('0,0.00')}</td>
                                <td>{numeral(values.labourS.amount).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <td>Glass</td>
                                <td>{numeral(values.glass.qty).format('0,0.00')}</td>
                                <td>{numeral(values.glass.price).format('0,0.00')}</td>
                                <td>{numeral(values.glass.amount).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <th colspan="3">Total</th>
                                <th>{numeral(prodTotal).format('0,0.00')}</th>
                              </tr>
                              <tr>
                                <th colspan="3">Production Cost/Sqft</th>
                                <th>{numeral(prodTotal / frameArea).format('0,0.00')}</th>
                              </tr>

                            </tbody>
                          </table>
                        </div>
                      </>
                      )}


                    </div>
                  </div>


                </>
              )}


            </div>
          </div>
        </div>


      )}

      {item === 'SlidingDoor' && (

        <div class="pc-container">
          <div class="pc-content">

            <div class="row">
              <div class="col-md-12 col-xxl-12 col-xl-12" >
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
                            <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${boxHeight * screen / mCalc}vw - 14px)`, marginRight: '-4px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                            <div style={{ height: '8px', width: '1px', float: 'left', marginTop: `calc(${boxHeight * screen / mCalc}vw - 14px)`, marginLeft: '-3px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>
                            {/* outer corner lines end */}

                            {boxTop === 'on' && (

                              [...Array(numTopBoxes)].map((_, index) => (
                                <div style={{ display: 'flex', width: `calc(${boxWidth * screen / mCalc / numFrames + 'vw'} - 23px)`, height: `calc(${(topnewHeights * screen / mCalc)}vw )`, margin: '5px', position: 'relative' }}>
                                  {[...Array(topFixedNum)].map((_, index) => (
                                    <div style={{ flex: '1', background: 'lightgreen', width: `calc(${topFixedWidth[index] * screen / mCalc / numFrames + 'vw'} - 18px)`, height: `calc(${(topnewHeights * screen / mCalc)}vw )`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px', position: 'relative' }}>
                                      {/* outer corner lines start for bottom sash*/}
                                      {/* inner box - sub top right */}
                                      <div style={{ height: '8px', width: '1px', float: 'right', marginTop: '-7px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: (topFixedWidth.length === 0 && boxTop === 'on') || index === topFixedWidth.length - 1 ? '1px solid #333' : 'none' }}></div>
                                      {/* left corner */}
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

                                <div key={index} style={{ background: split === 'on' ? 'transparent' : panelType === 1 ? 'lightgray' : panelType === 2 ? 'lightyellow' : 'lightblue', border: split === 'on' ? '0px' : '1px solid #333', height: `calc(${(boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc}vw - ${boxTop === 'on' ? '30px' : '25px'})`, width: `calc(${newWidths[index] * screen / mCalc}vw )`, marginTop: boxTop === 'on' ? '0px' : '5px', marginRight: index === numSecondInnerBoxes - 1 ? '5px' : '2.5px', marginLeft: index === 0 ? '5px' : '2.5px', position: 'relative' }}>

                                  {boxNames[index] === 'Shutter' && grill === 'yes' && <div style={{ position: 'absolute', width: '100%' }}>{boxes(boxHeight -topnewHeights - bottomnewHeights)}</div>}
                                   

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
                                  <div style={{ height: '9px', width: '1px', float: 'left', marginTop: `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen) / mCalc}vw - ${boxTop === 'on' ? '31px' : '27px'})`, marginLeft: '-2px', transform: 'rotate(45deg)', borderLeft: index === 0 ? '1px solid black' : 'none' }}></div>
                                  {/* left corner top sash */}
                                  <div style={{ height: '9px', width: '1px', float: 'left', marginTop: '-7px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: index === 0 ? '1px solid black' : 'none' }}></div>
                                  {/* center top sash sub corner  */}
                                  <div style={{ height: '8px', width: '1px', float: 'right', marginTop: '-7px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                                  {/* center left corner bottom  */}
                                  <div style={{ height: '9px', width: '1px', float: 'left', marginTop: `calc(${(boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc}vw - ${boxTop === 'on' ? '31px' : '27px'})`, marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: index === 0 ? 'none' : '1px solid black' }}></div>
                                  {/* inner sub right corner */}
                                  <div style={{ height: '9px', width: '1px', float: 'right', marginTop: `calc(${(boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc}vw - ${boxTop === 'on' ? '31px' : '27px'})`, marginRight: '-3px', transform: 'rotate(-45deg)', borderLeft: index === numSecondInnerBoxes - 1 ? '1px solid black' : 'none' }}></div>
                                  {/* straight line for bottom */}
                                  <div style={{ height: '7px', width: '1px', float: 'left', right: '0px', marginTop: '-6px', marginRightss: '-1px', borderLeft: index === 0 ? 'none' : '1px solid #333' }}></div>
                                  {/* Inner corner lines ends */}
                                  {/* stright line */}
                                  <div style={{ position: 'absolute', height: '7px', width: '1px', float: 'right', right: '0px', marginTop: '-6px', marginRight: '-1px', borderRight: index === numSecondInnerBoxes.length - 1 ? '1px solid #333' : 'none' }}></div>

                                  <div style={{ height: '7px', width: '1px', float: 'left', right: '0px', marginTop: `calc(${(boxHeight - topnewHeights - bottomnewHeights) * screen/ mCalc}vw - ${boxTop === 'on' ? '30px' : '26px'} )`, marginLeft: '-1px', borderRight: (index === 0 || index === numSecondInnerBoxes.length - 1) ? 'none' : '1px solid #333' }}></div>


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
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '50px', fontWeight: '100', cursor: 'pointer', color: '#000', zIndex: 1, }}>+</div>
                                  )}
                                  {mesh === 'yes' && boxNames[index] === 'Shutter' && boxHandle[index] === 'left' && (
                                    <img src={meshimg} style={{ width: screen === 3 ? '40px' : '20px', float: 'left', marginLeft: screen === 3 ? boxHandle[index] === 'left' ? '-15px' : '0px' : boxHandle[index] === 'left' ? '-10px' : 'px', marginTop: screen === 3 ? `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc)}vw - ${boxTop === 'on' ? '72px' : '67px'} )` : `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc)}vw - 45px)` }} />
                                  )}

                                  {mesh === 'yes' && boxNames[index] === 'Shutter' && boxHandle[index] === 'right' && (
                                    <img src={meshimg} style={{ width: screen === 3 ? '40px' : '20px', float: 'left', marginLeft: screen === 3 ? boxHandle[index] === 'right' ? '-1px' : '0px' : boxHandle[index] === 'right' ? '0px' : 'px', marginTop: screen === 3 ? `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc)}vw - ${boxTop === 'on' ? '72px' : '67px'} )` : `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc)}vw - 45px)` }} />
                                  )}



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

              </div>

              {numSecondInnerBoxes === 0 ? (<div></div>) : (
                <>
                  <div class="col-md-12 col-xxl-2 col-xl-2">
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

                  <div class="col-md-12 col-xxl-2 col-xl-2">
                    <div class="card">
                      <div class="card-body">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 ms-3">
                            <h6 class="mb-0">Shutters</h6>
                          </div>
                        </div>
                        <div class="bg-body p-3 mt-3 rounded">
                          <div class="mt-3 row align-items-center">
                            <div class="col-12">
                              <h6 class="mb-1">{shutterCount * numFrames}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-12 col-xxl-2 col-xl-2">
                    <div class="card">
                      <div class="card-body">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 ms-3">
                            <h6 class="mb-0">Fixed</h6>
                          </div>
                        </div>
                        <div class="bg-body p-3 mt-3 rounded">
                          <div class="mt-3 row align-items-center">
                            <div class="col-12">
                              <h6 class="mb-1">{fixedShutters}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-12 col-xxl-2 col-xl-2">
                    <div class="card">
                      <div class="card-body">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 ms-3">
                            <h6 class="mb-0">Mullions</h6>
                          </div>
                        </div>
                        <div class="bg-body p-3 mt-3 rounded">
                          <div class="mt-3 row align-items-center">
                            <div class="col-12">
                              <h6 class="mb-1">{newHeights === 0 ? 0 : 1}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-12 col-xxl-2 col-xl-2">
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

                  <div class="col-md-12 col-xxl-2 col-xl-2">
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
                              <h6 class="mb-1">₹ {numeral(grandTotal / frameArea).format('0,0.00')}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
                              <th width="10%">Req. Qty (Feet)</th>
                              <th width="10%">Req. Qty (Mtr)</th>
                              <th width="10%">Rate/Mtr</th>
                              <th width="10%">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Track Outer Frame</td>
                              <td>{numeral(Frame()).format('0,0.00')}</td>
                              <td>{numeral(values.frame.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frame.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frame.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Shutter Frame</td>
                              <td>{numeral(Shutter()).format('0,0.00')}</td>
                              <td>{numeral(values.shutter.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.shutter.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.shutter.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>InterLock</td>
                              <td>{numeral(interLock()).format('0,0.00')}</td>
                              <td>{numeral(values.interLock.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.interLock.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.interLock.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Beeding</td>
                              <td>{numeral(Beeding()).format('0,0.00')}</td>
                              <td>{numeral(values.beeding.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.beeding.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.beeding.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Frame Gasket</td>
                              <td>{numeral(frameGasket()).format('0,0.00')}</td>
                              <td>{numeral(values.frameGasket.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frameGasket.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frameGasket.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Shutter Gasket</td>
                              <td>{numeral(shutterGasket()).format('0,0.00')}</td>
                              <td>{numeral(values.shutterGasket.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.shutterGasket.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.shutterGasket.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Beeding Gasket</td>
                              <td>{numeral(beedingGasket()).format('0,0.00')}</td>
                              <td>{numeral(values.beedingGasket.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.beedingGasket.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.beedingGasket.amount * qty).format('0,0.00')}</td>
                            </tr>

                            {panelType === 1 && (
                              <tr>
                                <td>Panel</td>
                                <td>{numeral(Panel()).format('0,0.00')}</td>
                                <td>{numeral(values.panel.rqm * qty).format('0,0.00')}</td>
                                <td>{numeral(values.panel.rpm * qty).format('0,0.00')}</td>
                                <td>{numeral(values.panel.amount * qty).format('0,0.00')}</td>
                              </tr>
                            )}

                            {numFrames === 1 ? (<></>) : (
                              <tr>
                                <td>Cupler Joint/Square Joint </td>
                                <td>{numeral(cuplerJoint()).format('0,0.00')}</td>
                                <td>{numeral(values.cupler.rqm * qty).format('0,0.00')}</td>
                                <td>{numeral(values.cupler.rpm * qty).format('0,0.00')}</td>
                                <td>{numeral(values.cupler.amount * qty).format('0,0.00')}</td>
                              </tr>
                            )}

                            <tr>
                              <td colspan="4">Total</td>
                              <td>{numeral(frameTotal).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <th colspan="4">Wastage ( {data.wastage}% )</th>
                              <th>{numeral(frameTotal + wastage).format('0,0.00')}</th>
                            </tr>
                            <tr>
                              <th colspan="4">Profile Cost/Sqft</th>
                              <th>{numeral((frameTotal + wastage) / frameArea).format('0,0.00')}</th>
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
                              <th>Product Description</th>
                              <th width="10%">Req. Qty </th>
                              <th width="10%">Price</th>
                              <th width="10%">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Steel Frame</td>
                              <td>{numeral(values.steelFrame.qty).format('0,0.00')}</td>
                              <td>{numeral(values.steelFrame.price).format('0,0.00')}</td>
                              <td>{numeral(values.steelFrame.amount).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Steel Shutter</td>
                              <td>{numeral(values.steelShutter.qty).format('0,0.00')}</td>
                              <td>{numeral(values.steelShutter.price).format('0,0.00')}</td>
                              <td>{numeral(values.steelShutter.amount).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Steel Mullion</td>
                              <td>{numeral(values.steelMullion.qty * qty).format('0,0.00')}</td>
                              <td>{numeral(values.steelMullion.price * qty).format('0,0.00')}</td>
                              <td>{numeral(values.steelMullion.amount * qty).format('0,0.00')}</td>
                            </tr>

                            <tr>
                              <td>Mullion Clamp</td>

                              <td>{numeral(values.mullionclamp.qty * qty).format('0,0.00')}</td>
                              <td>{numeral(values.mullionclamp.price * qty).format('0,0.00')}</td>
                              <td>{numeral(values.mullionclamp.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Espag with SS Receiver</td>
                              <td>{numeral(values.espag.qty * qty).format('0,0.00')}</td>
                              <td>{numeral(values.espag.price * qty).format('0,0.00')}</td>
                              <td>{numeral(values.espag.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Espag with Multi Lock</td>
                              <td>{numeral(values.espagm.qty * qty).format('0,0.00')}</td>
                              <td>{numeral(values.espagm.price * qty).format('0,0.00')}</td>
                              <td>{numeral(values.espagm.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Friction Stay</td>

                              <td>{numeral(values.frictionstay.qty * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frictionstay.price * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frictionstay.amount * qty).format('0,0.00')}</td>
                            </tr>

                            <tr>
                              <td>Adjust Roller</td>
                              <td>{numeral(values.adjroll.qty * qty).format('0,0.00')}</td>
                              <td>{numeral(values.adjroll.price * qty).format('0,0.00')}</td>
                              <td>{numeral(values.adjroll.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Aluminium Track</td>
                              <td>{numeral(values.alTrack.qty).format('0,0.00')}</td>
                              <td>{numeral(values.alTrack.price).format('0,0.00')}</td>
                              <td>{numeral(values.alTrack.amount).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Bump Arrester</td>
                              <td>{numeral(values.bArrester.qty).format('0,0.00')}</td>
                              <td>{numeral(values.bArrester.price).format('0,0.00')}</td>
                              <td>{numeral(values.bArrester.amount).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Jump Stopper</td>
                              <td>{numeral(values.jStopper.qty).format('0,0.00')}</td>
                              <td>{numeral(values.jStopper.price).format('0,0.00')}</td>
                              <td>{numeral(values.jStopper.amount).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Dust Arrester</td>
                              <td>{numeral(values.dArrester.qty).format('0,0.00')}</td>
                              <td>{numeral(values.dArrester.price).format('0,0.00')}</td>
                              <td>{numeral(values.dArrester.amount).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Grove Roller</td>
                              <td>{numeral(values.gRoller.qty).format('0,0.00')}</td>
                              <td>{numeral(values.gRoller.price).format('0,0.00')}</td>
                              <td>{numeral(values.gRoller.amount).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Touch Lock</td>
                              <td>{numeral(values.touchLock.qty).format('0,0.00')}</td>
                              <td>{numeral(values.touchLock.price).format('0,0.00')}</td>
                              <td>{numeral(values.touchLock.amount).format('0,0.00')}</td>
                            </tr>
                            {grill === 'yes' && (
                              <tr>
                                <td>Grill</td>
                                <td>{numeral(values.grill.qty * qty).format('0,0.00')}</td>
                                <td>{numeral(values.grill.price * qty).format('0,0.00')}</td>
                                <td>{numeral(values.grill.amount * qty).format('0,0.00')}</td>
                              </tr>
                            )}
                            <tr>
                              <td>Screws/Misc</td>
                              <td>{numeral(values.screws.qty).format('0,0.00')}</td>
                              <td>{numeral(values.screws.price).format('0,0.00')}</td>
                              <td>{numeral(values.screws.amount).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <th colspan="3">Total</th>
                              <th>{numeral(hardTotal).format('0,0.00')}</th>
                            </tr>
                            <tr>
                              <th colspan="3">Hardware Cost/Sqft</th>
                              <th>{numeral(hardTotal / frameArea).format('0,0.00')}</th>
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
                                <th>Product Description</th>
                                <th width="10%">Req. Qty </th>
                                <th width="10%">Price</th>
                                <th width="10%">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Margin</td>
                                <td>{numeral(values.margin.qty).format('0,0.00')}</td>
                                <td>{numeral(values.margin.price).format('0,0.00')}</td>
                                <td>{numeral(values.margin.amount).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <th colspan="3">Total</th>
                                <th>{numeral(marginTotal).format('0,0.00')}</th>
                              </tr>
                              <tr>
                                <th colspan="3">Margin Cost/Sqft</th>
                                <th>{numeral(marginTotal / frameArea).format('0,0.00')}</th>
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
                                <th>Product Description</th>
                                <th width="10%">Req. Qty </th>
                                <th width="10%">Price</th>
                                <th width="10%">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Markting OH</td>
                                <td>{numeral(values.marketing.qty).format('0,0.00')}</td>
                                <td>{numeral(values.marketing.price).format('0,0.00')}</td>
                                <td>{numeral(values.marketing.amount).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <td>Transport</td>
                                <td>{numeral(values.transport.qty).format('0,0.00')}</td>
                                <td>{numeral(values.transport.price).format('0,0.00')}</td>
                                <td>{numeral(values.transport.amount).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <td>Labour (Factory)</td>
                                <td>{numeral(values.labourF.qty).format('0,0.00')}</td>
                                <td>{numeral(values.labourF.price).format('0,0.00')}</td>
                                <td>{numeral(values.labourF.amount).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <td>Labour (Site)</td>
                                <td>{numeral(values.labourS.qty).format('0,0.00')}</td>
                                <td>{numeral(values.labourS.price).format('0,0.00')}</td>
                                <td>{numeral(values.labourS.amount).format('0,0.00')}</td>
                              </tr>
                              {panelType === 2 && (
                                <tr>
                                  <td>Board</td>
                                  <td>{numeral(values.board.qty).format('0,0.00')}</td>
                                  <td>{numeral(values.board.price).format('0,0.00')}</td>
                                  <td>{numeral(values.board.amount).format('0,0.00')}</td>
                                </tr>
                              )}
                              {panelType === 3 && (
                                <tr>
                                  <td>Glass</td>
                                  <td>{numeral(values.glass.qty).format('0,0.00')}</td>
                                  <td>{numeral(values.glass.price).format('0,0.00')}</td>
                                  <td>{numeral(values.glass.amount).format('0,0.00')}</td>
                                </tr>
                              )}
                              <tr>
                                <th colspan="3">Total</th>
                                <th>{numeral(prodTotal).format('0,0.00')}</th>
                              </tr>
                              <tr>
                                <th colspan="3">Production Cost/Sqft</th>
                                <th>{numeral(prodTotal / frameArea).format('0,0.00')}</th>
                              </tr>

                            </tbody>
                          </table>
                        </div>
                      </>
                      )}
                    </div>
                  </div>




                </>
              )}


            </div>
          </div>
        </div>


      )}

      {item === 'Ventilator' && (
        <div class="pc-container">
          <div class="pc-content">

            <div class="row">

                 
                     <div class="col-md-12 col-xxl-12 col-xl-12" >
                       <div class="card" style={{background:'#fff'}}>  
                         <div class="card-body mb-5">
                      {boxHeight > 1 && boxWidth > 1 && (
           
                      fan === 'on' ? (   
                       <>
           
                       <div style={{float:'left', width: boxWidth*screen/ mCalc+'vw', height:boxHeight*screen/ mCalc+'vw', border:'1px solid #333',position:'relative'}}>
                                    {/* outer corner lines start */}
                                 <div style={{ position:'absolute',height: '7px', width: '1px', float: 'left', marginTop: '-1px', marginLeft: `calc(${(boxWidth)*screen/mCalc}vw - 5px)`, transform: 'rotate(45deg)', borderRight: '1px solid grey' }}></div>
                                 <div style={{ position:'absolute',height: '8px', width: '1px', float: 'left', marginTop: '-1px', marginLeft: '3px', transform: 'rotate(-45deg)', borderLeft: '1px solid grey' }}></div>
                                 <div style={{ position:'absolute',height: '7px', width: '1px', float: 'right', marginTop: getOuterBottom(boxHeight, screen), marginLeft:  `calc(${(boxWidth)*screen/mCalc}vw - 4px)`, transform: 'rotate(-45deg)', borderLeft: '1px solid grey' }}></div>
                                 <div style={{ position:'absolute',height: '7px', width: '1px', float: 'left', marginTop: getOuterBottom(boxHeight, screen), marginLeft: '1px', transform: 'rotate(45deg)', borderLeft: '1px solid grey' }}></div>
                                 {/* outer corner lines end */}
                                  {/* Inner corner lines start */}
                                  <div style={{ position:'absolute',height: '8px', width: '1px', float: 'left', marginTop: `calc(${(topnewHeights)*screen/mCalc}vw + ${topnewHeights>0?'8px':'4px'})`, marginLeft: `calc(${(boxWidth)*screen/mCalc}vw - 10px)`, transform: 'rotate(45deg)', borderRight: '1px solid grey' }}></div>
                                 <div style={{ position:'absolute',height: '8px', width: '1px', float: 'left', marginTop: `calc(${(topnewHeights)*screen/mCalc}vw + ${topnewHeights>0?'8px':'4px'})`, marginLeft: '8px', transform: 'rotate(-45deg)', borderLeft: '1px solid grey' }}></div>
                                 <div style={{ position:'absolute',height: '7px', width: '1px', float: 'right', marginTop: getInnerBottom(boxHeight-bottomnewHeights, screen), marginLeft:  `calc(${(boxWidth)*screen/mCalc}vw - 10px)`, transform: 'rotate(-45deg)', borderLeft: '1px solid grey' }}></div>
                                 <div style={{ position:'absolute',height: '7px', width: '1px', float: 'left', marginTop: getInnerBottom(boxHeight-bottomnewHeights, screen), marginLeft: '7px', transform: 'rotate(45deg)', borderLeft: '1px solid grey' }}></div>
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
                                                 <div style={{ position: 'absolute', top: '65%', left: '30%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                                 
                                              </div>
                                            </div>
                                          )}
                          
                                          {fanTop === 'Bottom' && fanLeft === 'Left'  && divider === 'Horizontal' && switchs === 'off' && (
                                            <div style={{float:'left', height: `calc(${(parseFloat(boxHeight) - parseFloat(topnewHeights) - parseFloat(bottomnewHeights)) * screen/mCalc}vw - ${topnewHeights > 0 && bottomnewHeights > 0 ? '16px' : topnewHeights > 0 ? '16px' : bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${boxWidth * screen/mCalc}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                                            <div style={{float:'left', height: `calc(${((parseFloat(boxHeight/mCalc) - parseFloat(topnewHeights/mCalc) - parseFloat(bottomnewHeights/mCalc)) - ((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55)) * screen}vw - 30px)`, width: `calc(${(boxWidth) * screen/mCalc}vw - 20px)`, margin: '4px', marginTop: '5px', border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10/boxHeight)*screen}%, lightblue ${(10/boxHeight)*screen}%)`}}></div>
                                              <img src={Fan} style={{float:'left', width: (parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55) *screen+'vw', marginLeft: '4px', marginRight: '4px'}} />
                                              <div style={{float:'right', height: `calc(${((parseFloat(boxWidth)/ mCalc) > 1.25 ? .85 : .55) * screen}vw - 0px)`, width: `calc(${(parseFloat(boxWidth/mCalc)-(parseFloat(boxWidth) / mCalc > 1.25 ? .85 : .55)) * screen}vw - 26px)`, marginRight: '5px',  border:'1px solid #333', background: 'lightblue' }}>
                                                  {/* fixed plus  */}
                                                 <div style={{ position: 'absolute', top: '70%', left: '65%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                                 
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
                           <div style={{ position:'absolute',height: '8px', width: '1px', float: 'right', marginTop: getOuterBottom(boxHeight, screen), marginLeft:  `calc(${(boxWidth)*screen/mCalc}vw - 4px)`, transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                           <div style={{ position:'absolute',height: '8px', width: '1px', float: 'left', marginTop: getOuterBottom(boxHeight, screen), marginLeft: '1px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>
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
                               <div style={{ marginLeft: '-10px', marginTop: boxHeight * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof boxHeight === 'number' ? boxHeight.toFixed(2) : boxHeight}</p></div>
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
                                       <button className= {`btn ${sash.type === 'fixed' ? 'btn-success' : 'btn-primary'} w-100`} type="button" >{sash.type === 'fixed' ? 'Fixed' : 'Shutter'}</button>
                                     </div>
                                   )}
                                 </div>
                               }
                               {bottomsash.length > 0 && 
                                 <div class="row mt-2">
                                   <p>Bottom</p>
                                   {bottomsash.map((sash, index) => 
                                     <div class="col-md-6 col-xxl-3 col-xl-3" key={index}>
                                       <button className= {`btn ${sash.type === 'fixed' ? 'btn-success' : 'btn-primary'} w-100`} type="button">{sash.type === 'fixed' ? 'Fixed' : 'Shutter'}</button>
                                     </div>
                                   )}
                                 </div>
                               }
                         </div>
                       </div>
                     </div>

              {numSecondInnerBoxes === 0 ? (<div></div>) : (
                <>
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



                  <div class="col-md-12  col-xxl-3 col-xl-3">
                    <div class="card">
                      <div class="card-body">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 ms-3">
                            <h6 class="mb-0">Mullions</h6>
                          </div>
                        </div>
                        <div class="bg-body p-3 mt-3 rounded">
                          <div class="mt-3 row align-items-center">
                            <div class="col-12">
                              <h6 class="mb-1">{newHeights === 0 ? 0 : 1}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-12  col-xxl-3 col-xl-3">
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

                  <div class="col-md-12 c col-xxl-3 col-xl-3">
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
                              <h6 class="mb-1">₹ {numeral(grandTotal / frameArea).format('0,0.00')}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


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
                              <th width="10%">Req. Qty (Feet)</th>
                              <th width="10%">Req. Qty (Mtr)</th>
                              <th width="10%">Rate/Mtr</th>
                              <th width="10%">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Outer Frame</td>
                              <td>{numeral(Frame()).format('0,0.00')}</td>
                              <td>{numeral(values.frameCost.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frameCost.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frameCost.amount * qty).format('0,0.00')}</td>
                            </tr>
                            {Mullion() > 0 &&
                              <tr>
                                <td>Mullion</td>
                                <td>{numeral(Mullion() * qty).format('0,0.00')}</td>
                                <td>{numeral(values.mullionCost.rqm * qty).format('0,0.00')}</td>
                                <td>{numeral(values.mullionCost.rpm * qty).format('0,0.00')}</td>
                                <td>{numeral(values.mullionCost.amount * qty).format('0,0.00')}</td>
                              </tr>
                            }
                            <tr>
                              <td>Beeding</td>

                              <td>{numeral(Beeding() * qty).format('0,0.00')}</td>
                              <td>{numeral(values.beeding.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.beeding.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.beeding.amount * qty).format('0,0.00')}</td>
                            </tr>
                            {louverBeeding() > 0 &&
                              <tr>
                                <td>Louver Beeding</td>

                                <td>{numeral(louverBeeding() * qty).format('0,0.00')}</td>
                                <td>{numeral(values.lovBeeding.rqm * qty).format('0,0.00')}</td>
                                <td>{numeral(values.lovBeeding.rpm * qty).format('0,0.00')}</td>
                                <td>{numeral(values.lovBeeding.amount * qty).format('0,0.00')}</td>
                              </tr>
                            }
                            <tr>
                              <td>Frame Gasket</td>
                              <td>{numeral(frameGasket() * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frameGasket.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frameGasket.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.frameGasket.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td>Beeding Gasket</td>
                              <td>{numeral(beedingGasket() * qty).format('0,0.00')}</td>
                              <td>{numeral(values.beedingGasket.rqm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.beedingGasket.rpm * qty).format('0,0.00')}</td>
                              <td>{numeral(values.beedingGasket.amount * qty).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <td colspan="4">Total</td>
                              <td>{numeral(frameTotal).format('0,0.00')}</td>
                            </tr>
                            <tr>
                              <th colspan="4">Wastage ( {data.wastage}% )</th>
                              <th>{numeral(frameTotal + wastage).format('0,0.00')}</th>
                            </tr>
                            <tr>
                              <th colspan="4">Profile Cost/Sqft</th>
                              <th>{numeral(frameTotal + wastage).format('0,0.00')}</th>
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
                              <th>Product Description</th>
                              <th width="10%">Req. Qty </th>
                              <th width="10%">Price</th>
                              <th width="10%">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Steel Frame</td>

                              <td>{numeral(values.steelFrame.qty * qty).format('0,0.00')}</td>
                              <td>{numeral(values.steelFrame.price * qty).format('0,0.00')}</td>
                              <td>{numeral(values.steelFrame.amount * qty).format('0,0.00')}</td>
                            </tr>
                            {Mullion() > 0 &&
                              <tr>
                                <td>Steel Mullion</td>
                                <td>{numeral(values.steelMullion.qty * qty).format('0,0.00')}</td>
                                <td>{numeral(values.steelMullion.price * qty).format('0,0.00')}</td>
                                <td>{numeral(values.steelMullion.amount * qty).format('0,0.00')}</td>
                              </tr>
                            }

                            <tr>
                              <td>Screws</td>
                              <td>{numeral(values.screws.qty).format('0,0.00')}</td>
                              <td>{numeral(values.screws.price).format('0,0.00')}</td>
                              <td>{numeral(values.screws.amount).format('0,0.00')}</td>
                            </tr>
                            {Glass() > 0 &&
                              <tr>
                                <td>Glass</td>
                                <td>{numeral(values.glass.qty).format('0,0.00')}</td>
                                <td>{numeral(values.glass.price).format('0,0.00')}</td>
                                <td>{numeral(values.glass.amount).format('0,0.00')}</td>
                              </tr>
                            }
                            {louverBeeding() > 0 &&

                              <tr>
                                <td>Louver Blades</td>
                                <td>{numeral(values.LouverBlades.qty).format('0,0.00')}</td>
                                <td>{numeral(values.LouverBlades.price).format('0,0.00')}</td>
                                <td>{numeral(values.LouverBlades.amount).format('0,0.00')}</td>
                              </tr>
                            }
                            <tr>
                              <th colspan="3">Total</th>
                              <th>{numeral(hardTotal).format('0,0.00')}</th>
                            </tr>
                            <tr>
                              <th colspan="3">Hardware Cost/Sqft</th>
                              <th>{numeral(hardTotal / frameArea).format('0,0.00')}</th>
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
                                <th>Product Description</th>
                                <th width="10%">Req. Qty </th>
                                <th width="10%">Price</th>
                                <th width="10%">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Margin</td>
                                <td>{numeral(values.margin.qty).format('0,0.00')}</td>
                                <td>{numeral(values.margin.price).format('0,0.00')}</td>
                                <td>{numeral(values.margin.amount).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <th colspan="3">Total</th>
                                <th>{numeral(marginTotal).format('0,0.00')}</th>
                              </tr>
                              <tr>
                                <th colspan="3">Margin Cost/Sqft</th>
                                <th>{numeral(marginTotal / frameArea).format('0,0.00')}</th>
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
                                <th>Product Description</th>
                                <th width="10%">Req. Qty </th>
                                <th width="10%">Price</th>
                                <th width="10%">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Markting OH</td>
                                <td>{numeral(values.marketing.qty).format('0,0.00')}</td>
                                <td>{numeral(values.marketing.price).format('0,0.00')}</td>
                                <td>{numeral(values.marketing.amount).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <td>Transport</td>
                                <td>{numeral(values.transport.qty).format('0,0.00')}</td>
                                <td>{numeral(values.transport.price).format('0,0.00')}</td>
                                <td>{numeral(values.transport.amount).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <td>Labour (Factory)</td>
                                <td>{numeral(values.labourF.qty).format('0,0.00')}</td>
                                <td>{numeral(values.labourF.price).format('0,0.00')}</td>
                                <td>{numeral(values.labourF.amount).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <td>Labour (Site)</td>
                                <td>{numeral(values.labourS.qty).format('0,0.00')}</td>
                                <td>{numeral(values.labourS.price).format('0,0.00')}</td>
                                <td>{numeral(values.labourS.amount).format('0,0.00')}</td>
                              </tr>

                              <tr>
                                <th colspan="3">Total</th>
                                <th>{numeral(prodTotal).format('0,0.00')}</th>
                              </tr>
                              <tr>
                                <th colspan="3">Production Cost/Sqft</th>
                                <th>{numeral(prodTotal / frameArea).format('0,0.00')}</th>
                              </tr>

                            </tbody>
                          </table>
                        </div>
                      </>
                      )}



                    </div>
                  </div>


                </>
              )}



            </div>
          </div>
        </div>


      )}

         {item === 'Fixed Window' && (
        <div class="pc-container">
          <div class="pc-content">

            <div class="row">

              <div class="col-md-12 col-xxl-12 col-xl-12" >
                <div class="card" style={{ background: '#fff' }}>
                  <div class="card-body mb-5">

                    <div>
                     <div style={{float:'left',boxShadow: '1px 1px 5px grey', width: `calc(${boxWidth*screen}vw + 2px)`, height: `calc(${boxHeight*screen}vw + 5px)`, border:'1px solid #333', position:'relative'}}>
                  {boxHeight&&boxWidth>0?
                  <>
                      {/* outer corner lines start */}
                      <div style={{ position:'absolute',height: '7px', width: '1px', float: 'left', marginTop: '-1.5px', marginLeft: `calc(${(boxWidth)*screen}vw - 3px)`, transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                      <div style={{ position:'absolute',height: '8px', width: '1px', float: 'left', marginTop: '-1px', marginLeft: '3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                      <div style={{ position:'absolute',height: '8px', width: '1px', float: 'right', marginTop:`calc(${boxHeight*screen}vw - 3px)`, marginLeft:  `calc(${(boxWidth)*screen}vw - 4px)`, transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                      <div style={{ position:'absolute',height: '8px', width: '1px', float: 'left', marginTop: `calc(${boxHeight*screen}vw - 3px)`, marginLeft: '3px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>
                      {/* outer corner lines end */}
                  </>:<></>
                  }
               
                   {horizontalMullion.map((row, rowIndex) => (
                      <div key={rowIndex} style={{display: 'flex',gap: '1px',height: `calc(${(row?.size) * screen}vw - 5px)`,width: `calc(${boxWidth * screen}vw - 10px)`,marginTop: rowIndex === 0 ? '4px' : '0px',marginBottom: '5px',marginLeft: '5px',marginRight: '4px',position: 'relative' }}>
                         {verticalMullion.map((col, colIndex) => (
                            <div key={colIndex} style={{width: `calc(${(col?.size) * screen}vw - 5px)`,height: `100%`,marginLeft: colIndex === 0 ? '0px' : '4px',border: '1px solid #333',background: 'lightblue',position: 'relative'}}>       
                            {boxHeight && boxWidth > 0 && (
                              <div style={{position: 'absolute',top: '50%',left: '50%',transform: 'translate(-50%, -50%)',fontSize: '50px',fontWeight: '100',cursor: 'pointer',color: '#000',zIndex: 1 }}>+</div>
                            )}
                            </div>
                          ))}
                       </div>
                  ))}

                </div>

                    </div>

                  </div>
          
                </div>

              </div>

              <div class="col-md-12 col-xxl-2 col-xl-2">
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
                  <div class="col-md-12 col-xxl-2 col-xl-2">
                    <div class="card">
                      <div class="card-body">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 ms-3">
                            <h6 class="mb-0">Shutters</h6>
                          </div>
                        </div>
                        <div class="bg-body p-3 mt-3 rounded">
                          <div class="mt-3 row align-items-center">
                            <div class="col-12">
                              <h6 class="mb-1">{shutterCount * numFrames}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12 col-xxl-2 col-xl-2">
                    <div class="card">
                      <div class="card-body">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 ms-3">
                            <h6 class="mb-0">Fixed</h6>
                          </div>
                        </div>
                        <div class="bg-body p-3 mt-3 rounded">
                          <div class="mt-3 row align-items-center">
                            <div class="col-12">
                              <h6 class="mb-1">{fixedShutters}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                   <div class="col-md-12 col-xxl-2 col-xl-2">
                    <div class="card">
                      <div class="card-body">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 ms-3">
                            <h6 class="mb-0">Mullions</h6>
                          </div>
                        </div>
                        <div class="bg-body p-3 mt-3 rounded">
                          <div class="mt-3 row align-items-center">
                            <div class="col-12">
                              <h6 class="mb-1">{newHeights === 0 ? ((numSecondInnerBoxes - 1) * numFrames) : ((numSecondInnerBoxes) * numFrames)}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                    <div class="col-md-12 col-xxl-2 col-xl-2">
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

                  <div class="col-md-12 col-xxl-2 col-xl-2">
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
                              <h6 class="mb-1">₹ {numeral(grandTotal / frameArea).format('0,0.00')}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  
                   <div class="col-md-12 col-xxl-12">
                              <div class="card">
                                <div class="card-header">
                                  <h5>Profile Cost</h5>
                                </div>
                                <div class="card-body">
                                <table id="left-right-fix" class="table stripe row-border order-column">
                                    <thead>
                                      <tr>
                                        <th width="60%">Product Description</th>
                                       
                                        <th width="10%">Req. Qty (Feet)</th>
                                        <th width="10%">Req. Qty (Mtr)</th>
                                        <th width="10%">Rate/Mtr</th>
                                        <th width="10%">Amount</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>Outer Frame</td>
                                       
                                        <td>{numeral(Frame()*qty).format('0,0.00')}</td>
                                        <td>{numeral(values.frameCost.rqm *qty).format('0,0.00')}</td>
                                        <td>{numeral(values.frameCost.rpm).format('0,0.00')}</td>
                                        <td>{numeral(values.frameCost.amount*qty).format('0,0.00')}</td>
                                      </tr>
                                      
                                      <tr>
                                        <td>Mullion</td>
                                       
                                        <td>{numeral(Mullion()*qty).format('0,0.00')}</td>
                                        <td>{numeral(values.mullionCost.rqm*qty).format('0,0.00')}</td>
                                        <td>{numeral(values.mullionCost.rpm).format('0,0.00')}</td>
                                        <td>{numeral(values.mullionCost.amount*qty).format('0,0.00')}</td>
                                      </tr>
                              <tr>
                                <td>Outer Frame Beeding</td>
                                
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
                                        {seriesDataLBeeding && seriesDataLBeeding?.items?.map((item) => (
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
                                        <td colspan="4">Total</td>
                                        <td>{numeral(frameTotal*qty).format('0,0.00')}</td>
                                      </tr>
                                      <tr>
                                      <th>Wastage( {data.wastage}% )</th>
                                
                                  <th colspan="3"></th>
                                        <th >{numeral(frameTotal+wastage*qty).format('0,0.00')}</th>
                                      </tr>
                                      <tr>
                                        <th colspan="4">Profile Cost/Sqft</th>
                                         <th>{numeral((frameTotal + wastage) / frameArea).format('0,0.00')}</th>
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
                                        <th >Product Description</th>
                                        <th width="10%">Req. Qty </th>
                                        <th width="10%">Price</th>
                                        <th width="10%">Amount</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                <td>Steel Frame</td>
                             
                                <td>{numeral(values.steelFrame.qty*qty).format('0,0.00')}</td>
                                <td>{numeral(values.steelFrame.price*qty).format('0,0.00')}</td>
                                <td>{numeral(values.steelFrame.amount*qty).format('0,0.00')}</td>
                              </tr>
                            {Mullion() > 0 &&  
                              <tr>
                                <td>Steel Mullion</td>
                               
                                <td>{numeral(values.steelMullion.qty*qty).format('0,0.00')}</td>
                                <td>{numeral(values.steelMullion.price*qty).format('0,0.00')}</td>
                                <td>{numeral(values.steelMullion.amount*qty).format('0,0.00')}</td>
                              </tr>
                            }
                  
                            <tr>
                                                  <td>Mullion Clamp</td>
                                                  
                                                  <td>{numeral(values.mullionclamp.qty * qty).format('0,0.00')}</td>
                                                  <td>{numeral(values.mullionclamp.price * qty).format('0,0.00')}</td>
                                                  <td>{numeral(values.mullionclamp.amount * qty).format('0,0.00')}</td>
                                              </tr>
                                    <tr>
                                  
                                       <td >Screws</td>
                                       
                                       <td>{numeral(values.screws.qty*qty).format('0,0.00')}</td>
                                       <td>{numeral(values.screws.price*qty).format('0,0.00')}</td>
                                       <td>{numeral(values.screws.amount*qty).format('0,0.00')}</td>
                                    </tr>
                                  {Glass() > 0 &&  
                                    <tr>
                                       <td>Glass</td>
                                      
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
                                      <th colspan="3">Total</th>
                                      <th>{numeral(hardTotal*qty).format('0,0.00')}</th>
                                    </tr>
                                    <tr>
                                      <th colspan="3">Hardware Cost/Sqft</th>
                                      <th>{numeral(hardTotal / frameArea).format('0,0.00')}</th>
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
                                        <th >Product Description</th>
                                        <th width="10%">Req. Qty </th>
                                        <th width="10%">Price</th>
                                        <th width="10%">Amount</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                <td>Margin</td>
                               
                                <td>{numeral(values.margin.qty*qty).format('0,0.00')}</td>
                                <td>{numeral(values.margin.price*qty).format('0,0.00')}</td>
                                <td>{numeral(values.margin.amount*qty).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <th colspan="3">Total</th>
                                <th>{numeral(marginTotal*qty).format('0,0.00')}</th>
                              </tr>
                              <tr>
                                <th colspan="3">Margin Cost/Sqft</th>
                                <th>{numeral(marginTotal / frameArea).format('0,0.00')}</th>
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
                                        <th >Product Description</th>
                                        <th width="10%">Req. Qty </th>
                                        <th width="10%">Price</th>
                                        <th width="10%">Amount</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                <td>Markting OH</td>
                               
                                <td>{numeral(values.marketing.qty*qty).format('0,0.00')}</td>
                                <td>{numeral(values.marketing.price*qty).format('0,0.00')}</td>
                                <td>{numeral(values.marketing.amount*qty).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <td>Transport</td>
                               
                                <td>{numeral(values.transport.qty*qty).format('0,0.00')}</td>
                                <td>{numeral(values.transport.price*qty).format('0,0.00')}</td>
                                <td>{numeral(values.transport.amount*qty).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <td>Labour (Factory)</td>
                             
                                <td>{numeral(values.labourF.qty*qty).format('0,0.00')}</td>
                                <td>{numeral(values.labourF.price*qty).format('0,0.00')}</td>
                                <td>{numeral(values.labourF.amount*qty).format('0,0.00')}</td>
                              </tr>
                              <tr>
                                <td>Labour (Site)</td>
                                
                                <td>{numeral(values.labourS.qty*qty).format('0,0.00')}</td>
                                <td>{numeral(values.labourS.price*qty).format('0,0.00')}</td>
                                <td>{numeral(values.labourS.amount*qty).format('0,0.00')}</td>
                              </tr>
                              
                              <tr>
                                <th colspan="3">Total</th>
                                <th>{numeral(prodTotal*qty).format('0,0.00')}</th>
                              </tr>
                              <tr>
                                <th colspan="3">Production Cost/Sqft</th>
                                <th>{numeral(prodTotal / frameArea).format('0,0.00')}</th>
                              </tr>
                  
                              </tbody>
                                  </table>
                                </div>
                                </>
                              )}
                  
                  
                  
                            </div>
                          </div>


             


            </div>
          </div>
        </div>



      )}

      
         {item === 'TopHung' && (
        <div class="pc-container">
          <div class="pc-content">

            <div class="row">





              <div class="col-md-12 col-xxl-12 col-xl-12" >
                <div class="card" style={{ background: '#fff' }}>
                  <div class="card-body mb-5">
<div>

                    <div style={{ float: 'left',boxShadow: '1px 1px 5px grey' , width: boxWidth * screen / mCalc + 'vw', height: boxHeight * screen / mCalc + 'vw', border: '1px solid #333' }}>



                      {[...Array(numFrames)].map((_, index) => (
                        <div style={{ float: 'left', margin: '2px', border: '1px solid #333', width: `calc(${boxWidth * screen / mCalc / numFrames + 'vw'} - 6px)`, height: `calc(${boxHeight * screen / mCalc + 'vw'} - 6px)`,position:'relative' }}>
                          {/* outer corner lines start */}
                          {/* <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-6.5px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-6px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'right', marginTop: getOuterBottom(boxHeight, screen, mCalc), marginRight: '-4px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop: getOuterBottom(boxHeight, screen, mCalc), marginLeft: '-3px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div> */}
                          {/* outer corner lines end */}

                          {boxTop === 'on' && (

                            [...Array(numTopBoxes)].map((_, index) => (
                              <div style={{ display: 'flex', width: `calc(${boxWidth * screen / mCalc / numFrames + 'vw'} - 18px)`, height: `calc(${(topnewHeights * screen / mCalc)}vw )`, margin: '5px',position:'relative' }}>
                                {[...Array(topFixedNum)].map((_, index) => (
                                  <div style={{ flex: '1',  backgroundColor:'white',padding:'4px',boxSizing:'border-box', width: `calc(${topFixedWidth[index] * screen / mCalc / numFrames + 'vw'} - 18px)`, height: `calc(${(topnewHeights * screen / mCalc)}vw )`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px',position:'relative' }}>
                                     <div style={{
                                        width: '100%',
                                        height: '100%',
                                        border: '1px solid #333',
                                        backgroundColor:topsash[index].type === 'fixed' ? 'lightgreen' : 'lightblue', 
                                        position:'relative'
                                   }}>
                                      {/* Inner corner lines start */}
                          <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-6.5px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-6px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${topnewHeights*screen/mCalc}vw - 13px)`, marginRight: '-3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${topnewHeights*screen/mCalc}vw - 12px)`, marginLeft: '-3px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>
                          {/* Inner corner lines end */}
                            {/* outer corner lines start for bottom sash*/}
                           <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-12px', marginRight: '-9px', transform: 'rotate(45deg)',  background: index === topsash.length -1  ? 'black' : 'transparent'}}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-12px', marginLeft: '-9px', transform: 'rotate(-45deg)', background: index === 0 ? 'black' : 'transparent'}}></div>
                          {/* <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${bottomnewHeights*screen/mCalc}vw - 12px)`, marginRight: '-11px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${bottomnewHeights*screen/mCalc}vw - 12px)`, marginLeft: '-9px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>  */}
                          {/* outer corner lines end */}
                          <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${topnewHeights*screen/mCalc}vw - 8px)`, marginRight: '-6px', transform: 'rotate(180deg)', background: index === topsash.length -1  ? 'black' : 'transparent' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${topnewHeights*screen/mCalc}vw - 8px)`, marginLeft: '-6px', transform: 'rotate(180deg)', background: index === 0 ? 'black' : 'transparent' }}></div>
                          
                                     {topsash[index].type === 'shutter' ?(
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
                                        
                                        alt="Left Handle"
                                      />
                                      <div style={{ position: 'absolute', width: '100%', height: '100%',overflow:'hidden' }}>
                                        {/* Left Diagonal Line  */}
                                        <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(${Math.atan((topFixedWidth.length ? topFixedWidth[index] : boxWidth) / (2 * topnewHeights)) * (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>


                                        {/* Right Diagonal Line */}
                                        <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(-${Math.atan((topFixedWidth.length ? topFixedWidth[index] : boxWidth) / (2 * topnewHeights))* (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>

                                      </div>
                                      {topsash[index].type === 'shutter' && grill === 'yes' && boxes(topnewHeights +0.3)}
                                    </>
                                  ):(
                                    <>
                                    {/* fixed plus  */}
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                  </>
                                  )

                                  }
                                  </div>
                                  </div>
                                  
                                ))}
                              </div>
                            ))
                          )}

                          <div style={{ display: 'flex' }}>
                            {[...Array(numSecondInnerBoxes)].map((_, index) => (
 

                              <div key={index}  style={{padding:'3px', height: `calc(${(boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc}vw - ${boxTop === 'on' ? '22px' : '18px'})`, width: `calc(${newWidths[index] * screen / mCalc}vw)`, backgroundColor: 'white', marginTop: boxTop === 'on' ? '0px' : '5px', marginRight: index === numSecondInnerBoxes - 1 ? '5px' : '3.5px', marginLeft: index === 0 ? '5px' : '3.5px', border: '1px solid #333',position:'relative' }}>
                                  <div style={{
                                  width: '100%',
                                  height: '100%',
                                  border: '1px solid #333',
                                  backgroundColor: boxColors[index] || 'lightblue',
                                  position:'relative'
                                }}>
                                   {/* Inner corner lines start */} 
                                 <div key={index} style={{ height: boxBottom === 'on'?'11px':'15px', width: '1px', float: 'left', marginTop: `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen) / mCalc}vw - ${boxTop === 'on' ? '39px' : '33px'})`, marginLeft:boxBottom === 'on'?'-4px':'-6px', transform: 'rotate(45deg)', borderLeft: '1px solid grey' }}></div>
                                 <div key={index} style={{ height:boxTop === 'on'?'11px':'15px', width: '1px', float: 'left', marginTop:boxTop === 'on'?'-9px':'-14px', marginLeft:boxTop === 'on'?'-4px':'-6px', transform: 'rotate(-45deg)', borderLeft: '1px solid grey' }}></div>
                                 <div style={{ height: boxTop === 'on'?'11px':'15px', width: '1px', float: 'right', marginTop:boxTop === 'on'?'-9px':'-14px', marginRight:boxTop === 'on'?'-4px':'-6px', transform: 'rotate(45deg)', borderRight: '1px solid grey' }}></div>
                                 {/* <div style={{ height: '15px', width: '1px', float: 'left', marginTop: getInnerBottom(boxHeight - topnewHeights - bottomnewHeights, screen, mCalc), marginLeft: '-4px', transform: 'rotate(-45deg)', borderLeft: index === 0 ? 'transparent' : '1px solid black' }}></div> */}
                                 <div style={{ height: boxBottom === 'on'?'11px':'15px', width: '1px', float: 'right', marginTop:`calc(${(boxHeight - topnewHeights - bottomnewHeights)*screen/mCalc}vw - ${boxTop === 'on' ? '38px' : '33px'})`, marginRight:boxBottom==='on'?'-4px':'-6px', transform: 'rotate(-45deg)', borderLeft: '1px solid grey' }}></div>
                                 <div style={{ height: '10px', width: '1px', float: 'right', marginTop: `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen) / mCalc}vw - ${boxBottom === 'on' ? '33px' : '27px'})`, marginRight: '-4px', transform: 'rotate(-45deg)', borderRight: index === -1 ? '1px solid grey' : 'none' }}></div>
                                 {/* <div style={{ height: '7px', width: '1px', float: 'left', right: '0px', marginTop: '-6px', marginRight: '-1px', background: index === 0 ? 'transparent' : 'black' }}></div> */}
                                {/* Inner corner lines ends */} 

                                {boxBottom==='on'?      
                                <>
                                 <div style={{ height: '10px', width: '1px', float: 'right', marginTop: `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen) / mCalc}vw - ${boxBottom === 'on' ? '29px' : '27px'})`, marginRight: '-7px', transform: 'rotate(180deg)', background: index === newWidths.length -1  ? 'black' : 'transparent' }}></div>
                                 <div style={{ height: '10px', width: '1px', float: 'left', marginTop:  `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen) / mCalc}vw - ${boxBottom === 'on' ? '29px' : '27px'})`, marginLeft: '-7px', transform: 'rotate(180deg)', background: index === 0 ? 'black' : 'transparent' }}></div>
                                 </>:
                                <></>}

                               {
                                 (numSecondInnerBoxes === 1) ? (
                                   <></>
                                 ) : (
                                   <>
                                     <div
                                       className="expanding-arrow-line"
                                       style={{
                                         position: 'absolute',
                                         float: 'left',
                                         width: `calc(${(newWidths[index] * screen) / mCalc}vw - 15px)`,
                                         bottom: '0px',
                                         top: `calc(${(boxHeight - bottomnewHeights - topnewHeights) * screen / mCalc}vw + 55px)`
                                       }}
                                     >
                                       <div className="arrow-left"></div>
                                       <div className="line" align="center">
                                         <div
                                           style={{
                                             marginTop: '-7px',
                                             background: 'white',
                                             maxWidth: '60px',
                                             textAlign: 'center'
                                           }}
                                         >
                                           <p>{parseFloat(newWidths[index]).toFixed(2)}</p>
                                         </div>
                                       </div>
                                       <div className="arrow-right"></div>
                                     </div>
                                   </>
                                 )
                               }

                   
                                {boxNames[index] === 'Shutter' ? (boxHandle[index] === 'left' ? (
                                  <>
                                  <img
                                    src={left}
                                    style={{
                                      position: 'absolute',
                                        transform: 'rotate(-90deg)',
                                        width: screen === 3 ? '13px' : '8px',
                                        cursor: 'pointer',
                                        marginBottom: '1px',
                                        marginTop: `calc(${(boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc}vw - ${boxTop === 'on' ? '42px' : '38px'} - ${screen===3 ? '5px':'0px'})`,
                                        marginLeft:`calc(${(((numSecondInnerBoxes === 1 ? boxWidth:newWidths[index] ) * screen) / mCalc)/2}vw - 15px)`
                                    }}
                                    alt="Left Handle"
                                  />
                                      <div style={{ position: 'absolute', width: '100%', height: '100%',overflow:'hidden' }}>
                                        {/* Left Diagonal Line  */}
                                        <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(${Math.atan((numSecondInnerBoxes === 1 ? boxWidth:newWidths[index] ) / (2 * (boxHeight-topnewHeights-bottomnewHeights))) * (180 / Math.PI)+((boxTop === 'on' && boxBottom === 'on') ? 1.5 : 0)}deg)`, transformOrigin: 'top left' }}></div>


                                        {/* Right Diagonal Line */}
                                        <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(-${Math.atan((numSecondInnerBoxes === 1 ? boxWidth:newWidths[index] ) / (2 * (boxHeight-topnewHeights-bottomnewHeights)))* (180 / Math.PI)+((boxTop === 'on' && boxBottom === 'on') ? 1.5 : 0)}deg)`, transformOrigin: 'top left' }}></div>

                                      </div>                                 
                                  </>
                                ) : (
                                  <>
                                  <img
                                    src={right}
                                    style={{
                                      position: 'absolute',
                                        transform: 'rotate(-90deg)',
                                        width: screen === 3 ? '13px' : '8px',
                                        cursor: 'pointer',
                                        marginBottom: '1px',
                                         marginTop: `calc(${(boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc}vw - ${boxTop === 'on' ? '34px' : '30px'} - ${screen===3 ? '5px':'0px'})`,
                                        marginLeft:`calc(${(((numSecondInnerBoxes === 1 ? boxWidth:newWidths[index] ) * screen) / mCalc)/2}vw - 15px)`
                                    }}
                                    alt="Right Handle"
                                  />
                                      <div style={{ position: 'absolute', width: '100%', height: '100%',overflow:'hidden' }}>
                                        {/* Left Diagonal Line  */}
                                        <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(${Math.atan((numSecondInnerBoxes === 1 ? boxWidth:newWidths[index] ) / (2 * (boxHeight-topnewHeights-bottomnewHeights))) * (180 / Math.PI)+((boxTop === 'on' && boxBottom === 'on') ? 1.5 : 0)}deg)`, transformOrigin: 'top left' }}></div>


                                        {/* Right Diagonal Line */}
                                        <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(-${Math.atan((numSecondInnerBoxes === 1 ? boxWidth:newWidths[index] ) / (2 * (boxHeight-topnewHeights-bottomnewHeights)))* (180 / Math.PI)+((boxTop === 'on' && boxBottom === 'on') ? 1.5 : 0)}deg)`, transformOrigin: 'top left' }}></div>

                                      </div> 
                                  </>

                                )):(
                                  <>
                                  {/* Plus Icon in Center */}
                                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '50px', fontWeight: '100', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                  
                                  </>
                                )
                              }

                                {mesh === 'yes' && boxNames[index] === 'Shutter' && boxHandle[index] === 'left' && (
                                  <img src={meshimg} style={{  position: 'absolute', left: 0, width: screen === 3 ? '40px' : '20px', float: 'left', marginTop: screen === 3 ? `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc)}vw - ${boxTop === 'on' ? '72px' : '70px'} )` : `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc)}vw - 55px)` }} />
                                )}

                                {mesh === 'yes' && boxNames[index] === 'Shutter' && boxHandle[index] === 'right' && (
                                  <img src={meshimg} style={{ width: screen === 3 ? '40px' : '20px', float: 'left', marginLeft: screen === 3 ? boxHandle[index] === 'right' ? '-1px' : '0px' : boxHandle[index] === 'right' ? '0px' : 'px', marginTop: screen === 3 ? `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc)}vw - ${boxTop === 'on' ? '72px' : '70px'} )` : `calc(${((boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc)}vw - 55px)` }} />
                                )}

                                {boxNames[index] === 'Shutter' && grill === 'yes' && boxes(boxHeight - topnewHeights - bottomnewHeights -0.1)}

                              </div>
                             </div>
                            ))}

                          </div>

                          {boxBottom === 'on' && (
                            [...Array(numBottomBoxes)].map((_, index) => (
                              <div style={{ display: 'flex', width: `calc(${boxWidth * screen / mCalc / numFrames + 'vw'} - 18px)`, height: `calc(${(bottomnewHeights * screen / mCalc) + 'vw'} -10px)`, margin: '5px' }}>
                                {[...Array(bottomFixedNum)].map((_, index) => (
                                  <div style={{ flex: '1', backgroundColor:'white',padding:'4px', width: `calc(${bottomFixedWidth[index] * screen / mCalc / numFrames + 'vw'} - 18px)`, height: `calc(${(bottomnewHeights * screen / mCalc) + 'vw'} - 5px)`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px',position:'relative' }}>
                                   <div style={{
                                        height:'100%',
                                        width:'100%',
                                        position:'relative',
                                        backgroundColor:bottomsash[index].type === 'fixed' ? 'lightgreen' : 'lightblue',
                                        border:'1px solid black'
                                      }}>
                                    {/* inner corner lines start for bottom sash*/}
                          <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-6.5px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-6px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${bottomnewHeights*screen/mCalc}vw - 18px)`, marginRight: '-4px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${bottomnewHeights*screen/mCalc}vw - 18px)`, marginLeft: '-3px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>
                          {/* inner corner lines end */}
                           {/* outer corner lines start for bottom sash*/}
                           {/* <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-13px', marginRight: '-9px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-12px', marginLeft: '-9px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>*/}
                          <div style={{ height: '7px', width: '1px', float: 'right', marginTop: `calc(${bottomnewHeights*screen/mCalc}vw - 13px)`, marginRight: '-9px', transform: 'rotate(-45deg)',background: index === bottomsash.length -1 ? 'black' : 'transparent' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${bottomnewHeights*screen/mCalc}vw - 12px)`, marginLeft: '-9px', transform: 'rotate(45deg)', background: index === 0 ? 'black' : 'transparent'  }}></div> 
                          {/* outer corner lines end */}
                          {/* <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${boxHeight-topnewHeights*screen/mCalc}vw - ${screen === 3 ? '28px':'24px'})`, marginRight: '-6px', transform: 'rotate(180deg)', background: index === bottomsash.length -1  ? 'black' : 'transparent' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${boxHeight-topnewHeights*screen/mCalc}vw - ${screen === 3 ? '28px':'24px'})`, marginLeft: '-6px', transform: 'rotate(180deg)', background: index === 0 ? 'black' : 'transparent' }}></div> */}

                                   {bottomsash[index].type === 'shutter' ?(
                                        <>
                                        <img
                                          src={left}
                                          style={{
                                          float: 'left',
                                          marginTop: `calc(${(((bottomnewHeights) * screen / mCalc))}vw - 25px)`,
                                          marginLeft: '45%',
                                          width: screen === 3 ? '13px' : '8px',
                                          transform: 'rotate(-90deg)'
                                          }}
                                          alt="Left Handle"
                                        />
                                          <div style={{ position: 'absolute', width: '100%', height: '100%',overflow:'hidden' }}>
                                             {/* Left Diagonal Line  */}
                                             <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(${Math.atan((bottomFixedWidth.length ? bottomFixedWidth[index] : boxWidth) / (2 * bottomnewHeights)) * (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>
                                         
                                         
                                             {/* Right Diagonal Line */}
                                             <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(-${Math.atan((bottomFixedWidth.length ? bottomFixedWidth[index] : boxWidth) / (2 * bottomnewHeights)) * (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>
                                         
                                          </div>  
  
                                        {bottomsash[index].type === 'shutter' && grill === 'yes' && boxes(bottomnewHeights+0.3)}
                                      </>
                                      ):(
                                        <>
                                         {/* fixed plus  */}
                                         <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                        </>
                                      )
                                      
                                      }
                                  </div>
                                  </div>
                                ))}
                              </div>
                            ))
                          )}

                          {numSecondInnerBoxes === 0 ? (
                            <div className="expanding-arrow-line" style={{ float: 'left', marginLeft: '-5px', width: ((boxWidth / numFrames) * screen / mCalc) + 'vw', top: (boxHeight - topnewHeights) * screen / mCalc + 'vw', }} >
                              <div className="arrow-left"></div>
                              <div className="line" align="center">
                                <div style={{ marginTop: '-8px', background: 'white', maxWidth: '60px', textAlign: 'center' }}><p>{ parseFloat(boxWidth / numFrames).toFixed(2)}</p></div>
                              </div>
                              <div className="arrow-right"></div>
                            </div>
                          ) : (
                            <div className="expanding-arrow-line" style={{ float: 'left', marginLeft: '-5px', width: ((boxWidth / numFrames) * screen / mCalc) + 'vw', bottom: '-10px', top: '45px', }} >
                              <div className="arrow-left"></div>
                              <div className="line" align="center">
                                <div style={{ marginTop: '-8px', background: 'white', maxWidth: '60px', textAlign: 'center' }}><p>{ parseFloat(boxWidth / numFrames).toFixed(2)}</p></div>
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
                            <div style={{ marginLeft: '-10px', marginTop: topnewHeights * (screen / mCalc / 2) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{typeof topnewHeights === 'parseFloat' ? topnewHeights.toFixed(2) : topnewHeights}</p></div>
                          </div>
                          <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        </div>
                      
                      <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(boxHeight - topnewHeights - bottomnewHeights) * screen / mCalc}vw - ${boxTop === 'on' ? '30px' : '15px'})`, top: `calc(${topnewHeights * screen / mCalc}vw + ${boxTop === 'on' ? '15px' : '0px'})`, position: 'relative' }}>
                        <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                          <div style={{ marginLeft: '-10px', marginTop: (boxHeight - topnewHeights - bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{ parseFloat(boxHeight - topnewHeights - bottomnewHeights).toFixed(2)}</p></div>
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
                          <div style={{ marginLeft: '-10px', marginTop: (boxHeight - topnewHeights - bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{ parseFloat(boxHeight - topnewHeights - bottomnewHeights).toFixed(2)}</p></div>
                        </div>
                        <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                      </div>
                        <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(bottomnewHeights) * screen / mCalc}vw + 5px)`, top: `calc(${(boxHeight - bottomnewHeights) * screen / mCalc}vw - ${boxTop === 'on' ? '10px' : '10px'})`, position: 'relative' }}>
                          <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                          <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                            <div style={{ marginLeft: '-10px', marginTop: (bottomnewHeights) * ((screen / mCalc / 2) - (screen / mCalc / 8)) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{ parseFloat(bottomnewHeights).toFixed(2)}</p></div>
                          </div>
                          <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        </div>
                        </>
                      }

                    </div>

                    <div style={{ width: '30px', float: 'left', paddingLeft: boxBottom === 'on' || boxTop === 'on' ?'0px' : '15px', textAlign: 'left' }}>
                      <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${boxHeight * screen / mCalc}vw)`, top: '0', position: 'relative' }}>
                        <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                        <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                          <div style={{ marginLeft: '-10px', marginTop: boxHeight * (screen / mCalc / 2) + 'vw', background: 'white', maxWidth: '60px', textAlign: 'left' }}><p style={{ width: '50px' }}>{ parseFloat(boxHeight).toFixed(2)}</p></div>
                        </div>
                        <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                      </div>
                    </div>


                  </div>

                  </div>
                   
                  
                  

                </div>


              </div>

              <div class="col-md-12 col-xxl-2 col-xl-2">
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
                  <div class="col-md-12 col-xxl-2 col-xl-2">
                    <div class="card">
                      <div class="card-body">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 ms-3">
                            <h6 class="mb-0">Shutters</h6>
                          </div>
                        </div>
                        <div class="bg-body p-3 mt-3 rounded">
                          <div class="mt-3 row align-items-center">
                            <div class="col-12">
                              <h6 class="mb-1">{shutterCount * numFrames}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12 col-xxl-2 col-xl-2">
                    <div class="card">
                      <div class="card-body">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 ms-3">
                            <h6 class="mb-0">Fixed</h6>
                          </div>
                        </div>
                        <div class="bg-body p-3 mt-3 rounded">
                          <div class="mt-3 row align-items-center">
                            <div class="col-12">
                              <h6 class="mb-1">{fixedShutters}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                   <div class="col-md-12 col-xxl-2 col-xl-2">
                    <div class="card">
                      <div class="card-body">
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1 ms-3">
                            <h6 class="mb-0">Mullions</h6>
                          </div>
                        </div>
                        <div class="bg-body p-3 mt-3 rounded">
                          <div class="mt-3 row align-items-center">
                            <div class="col-12">
                              <h6 class="mb-1">{newHeights === 0 ? ((numSecondInnerBoxes - 1) * numFrames) : ((numSecondInnerBoxes) * numFrames)}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                    <div class="col-md-12 col-xxl-2 col-xl-2">
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

                  <div class="col-md-12 col-xxl-2 col-xl-2">
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
                              <h6 class="mb-1">₹ {numeral(grandTotal / frameArea).format('0,0.00')}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  
                      <div class="col-md-12 col-xxl-12 col-xl-12" id="calculations">
                                 <div class="card">
                                   <div class="card-header">
                                     <h5>Profile Cost</h5>
                                   </div>
               
                                   <div class="card-body">
                                     <table id="left-right-fix" class="table stripe row-border order-column">
                                       <thead>
                                         <tr>
                                           <th>Product Description</th>
                                   
                                           <th width="10%">Req. Qty (Feet)</th>
                                           <th width="10%">Req. Qty (Mtr)</th>
                                           <th width="10%">Rate/Mtr</th>
                                           <th width="10%">Amount</th>
                                         </tr>
                                       </thead>
                                       <tbody>
                                         <tr>
                                           <td>Casement Outer Frame</td>
                               
                                           <td>{numeral(Frame() * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.frame.rqm * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.frame.rpm * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.frame.amount * qty).format('0,0.00')}</td>
                                         </tr>
                                         <tr>
                                           <td>Casement Shutter</td>
                                           
                                           <td>{numeral(( parseFloat(Shutter()) ) * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.shutter.rqm * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.shutter.rpm * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.shutter.amount * qty).format('0,0.00')}</td>
                                         </tr>
               
                                         {mesh === 'yes' && (
               
                                           <tr>
                                             <td>Mesh Sash</td>
                                             
                                             <td>{numeral(meshFrame() * qty).format('0,0.00')}</td>
                                             <td>{numeral(values.meshFrame.rqm * qty).format('0,0.00')}</td>
                                             <td>{numeral(values.meshFrame.rpm * qty).format('0,0.00')}</td>
                                             <td>{numeral(values.meshFrame.amount * qty).format('0,0.00')}</td>
                                           </tr>
               
                                         )}
               
                                         <tr>
                                           <td>Beeding</td>
                                          
                                           <td>{numeral(Beeding() * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.beeding.rqm * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.beeding.rpm * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.beeding.amount * qty).format('0,0.00')}</td>
                                         </tr>
                                         <tr>
                                           <td>Mullion</td>
                                           
                                           <td>{numeral(Mullion() * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.mullion.rqm * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.mullion.rpm * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.mullion.amount * qty).format('0,0.00')}</td>
                                         </tr>
                                         {numFrames === 1 ? (<></>) : (
                                           <tr>
                                             <td>Cupler Joint/Square Joint </td>
                                            
                                             <td>{numeral(cuplerJoint() * qty).format('0,0.00')}</td>
                                             <td>{numeral(values.cupler.rqm * qty).format('0,0.00')}</td>
                                             <td>{numeral(values.cupler.rpm * qty).format('0,0.00')}</td>
                                             <td>{numeral(values.cupler.amount * qty).format('0,0.00')}</td>
                                           </tr>
                                         )}
                                         <tr>
                                           <td>Outer Frame Gasket</td>
                                          
                                           <td>{numeral(frameGasket() * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.frameGasket.rqm * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.frameGasket.rpm * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.frameGasket.amount * qty).format('0,0.00')}</td>
                                         </tr>
                                         <tr>
                                           <td>Shutter Gasket</td>
                                          
                                           <td>{numeral(shutterGasket() * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.shutterGasket.rqm * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.shutterGasket.rpm * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.shutterGasket.amount * qty).format('0,0.00')}</td>
                                         </tr>
                                         <tr>
                                           <td>Mullion Gasket</td>
                                           
                                           <td>{numeral(Mullion() * 2 * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.mullionGasket.rqm * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.mullionGasket.rpm * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.mullionGasket.amount * qty).format('0,0.00')}</td>
                                         </tr>
                                         <tr>
                                           <td>Beeding Gasket</td>
                                           
                                           <td>{numeral(beedingGasket() * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.beedingGasket.rqm * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.beedingGasket.rpm * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.beedingGasket.amount * qty).format('0,0.00')}</td>
                                         </tr>
                                         {mesh === 'yes' && (
               
                                           <tr>
                                             <td >Mesh Gasket</td>
                                            
                                             <td>{numeral(meshGasket() * qty).format('0,0.00')}</td>
                                             <td>{numeral(values.meshGasket.rqm * qty).format('0,0.00')}</td>
                                             <td>{numeral(values.meshGasket.rpm * qty).format('0,0.00')}</td>
                                             <td>{numeral(values.meshGasket.amount * qty).format('0,0.00')}</td>
                                           </tr>
               
                                         )}
               
               
                                         <tr>
                                           <td colspan="4">Total</td>
                                           <td>{numeral(frameTotal * qty).format('0,0.00')}</td>
                                         </tr>
                                         <tr>
                                           {/* <th colspan="6">Wastage ( {data.wastage}% )</th> */}
                                           <th>Wastage( {data.wastage}% )</th>
                                        
                                           <th colspan="3"></th>
                                           <th >{numeral(frameTotal + wastage * qty).format('0,0.00')}</th>
                                         </tr>
                                         <tr>
                                           <th colspan="4">Profile Cost/Sqft</th>
                                           <th>{numeral((frameTotal + wastage) / frameArea).format('0,0.00')}</th>
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
                                           <th>Product Description</th>
                                           <th width="10%">Req. Qty </th>
                                           <th width="10%">Price</th>
                                           <th width="10%">Amount</th>
                                         </tr>
                                       </thead>
                                       <tbody>
                                         {mesh === 'yes' && (
                                           <>
                                             <tr>
                                               <td>Mesh 3.4 SS</td>
                                               
                                               <td>{numeral(values.mesh.qty * qty).format('0,0.00')}</td>
                                               <td>{numeral(values.mesh.price * qty).format('0,0.00')}</td>
                                               <td>{numeral(values.mesh.amount * qty).format('0,0.00')}</td>
                                             </tr>
                                             <tr>
                                               <td>Steel Mesh</td>
                                              
                                               <td>{numeral(values.steelMesh.qty * qty).format('0,0.00')}</td>
                                               <td>{numeral(values.steelMesh.price * qty).format('0,0.00')}</td>
                                               <td>{numeral(values.steelMesh.amount * qty).format('0,0.00')}</td>
                                             </tr>
                                             <tr>
                                               <td>Mesh Handle</td>
                                             
                                               <td>{numeral(values.meshHandle.qty * qty).format('0,0.00')}</td>
                                               <td>{numeral(values.meshHandle.price * qty).format('0,0.00')}</td>
                                               <td>{numeral(values.meshHandle.amount * qty).format('0,0.00')}</td>
                                             </tr>
                                             <tr>
                                               <td>Mesh Weather Strip</td>
                                               
                                               <td>{numeral(values.meshWS.qty * qty).format('0,0.00')}</td>
                                               <td>{numeral(values.meshWS.price * qty).format('0,0.00')}</td>
                                               <td>{numeral(values.meshWS.amount * qty).format('0,0.00')}</td>
                                             </tr>
                                             <tr>
                                               <td>Mesh Hinges</td>
                                             
                                               <td>{numeral(values.meshHinges.qty * qty).format('0,0.00')}</td>
                                               <td>{numeral(values.meshHinges.price * qty).format('0,0.00')}</td>
                                               <td>{numeral(values.meshHinges.amount * qty).format('0,0.00')}</td>
                                             </tr>
                                             <tr>
                                               <td>Mesh Locks</td>
                                               
                                               <td>{numeral(values.meshLock.qty * qty).format('0,0.00')}</td>
                                               <td>{numeral(values.meshLock.price * qty).format('0,0.00')}</td>
                                               <td>{numeral(values.meshLock.amount * qty).format('0,0.00')}</td>
                                             </tr>
                                           </>
                                         )}
               
                                         <tr>
                                           <td>Steel Frame</td>
                                          
                                           <td>{numeral(values.steelFrame.qty * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.steelFrame.price * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.steelFrame.amount * qty).format('0,0.00')}</td>
                                         </tr>
                                         <tr>
                                           <td>Steel Mullion</td>
                                           
               
                                           <td>{numeral(values.steelMullion.qty * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.steelMullion.price * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.steelMullion.amount * qty).format('0,0.00')}</td>
                                         </tr>
                                         <tr>
                                           <td>Mullion Clamp</td>
                                         
               
                                           <td>{numeral(values.mullionclamp.qty * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.mullionclamp.price * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.mullionclamp.amount * qty).format('0,0.00')}</td>
                                         </tr>
                                         <tr>
                                           <td>Steel Shutter</td>
                                          
                                           <td>{numeral(values.steelShutter.qty * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.steelShutter.price * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.steelShutter.amount * qty).format('0,0.00')}</td>
                                         </tr>
                                         {/* <tr>
                                           <td>Multi Point Lock ( MPL )</td>
                                           <td>
                                             <select class="form-select-select item-line w-75" value={lockCost} onChange={lockChange}>
                                               <option value="">Select Model</option>
                                               {lockes && Object.entries(lockes).map(([key, { label, value }]) => (
                                                 <option key={key} value={value}>{label + ' - ₹ ' + value}</option>
                                               ))}
                                             </select>
                                           </td>
                                           <td>{numeral(values.mpl.qty * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.mpl.price * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.mpl.amount * qty).format('0,0.00')}</td>
                                         </tr> */}
                                         <tr>
                                           <td>Handle</td>
                                          
                                           <td>{numeral(values.handle.qty * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.handle.price * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.handle.amount * qty).format('0,0.00')}</td>
                                         </tr>
                                         <tr>
                                           <td>Espag with SS Receiver</td>
                                          
                                           <td>{numeral(values.espag.qty * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.espag.price * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.espag.amount * qty).format('0,0.00')}</td>
                                         </tr>
                                         <tr>
                                           <td>Espag with Multi Lock</td>
                                         
                                           <td>{numeral(values.espagm.qty * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.espagm.price * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.espagm.amount * qty).format('0,0.00')}</td>
                                         </tr>
                                         <tr>
                                           <td>Friction Stay</td>
                                         
                                           <td>{numeral(values.frictionstay.qty * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.frictionstay.price * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.frictionstay.amount * qty).format('0,0.00')}</td>
                                         </tr>
                                         <tr>
                                           <td>Hinges</td>
                                           
                                           <td>{numeral(values.hings.qty * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.hings.price * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.hings.amount * qty).format('0,0.00')}</td>
                                         </tr>
                                         <tr>
                                           <td>Runner Block</td>
                                         
                                           <td>{numeral(values.runnerblock.qty * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.runnerblock.price * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.runnerblock.amount * qty).format('0,0.00')}</td>
                                         </tr>
                                         <tr>
                                           <td>SecurityClip</td>
                                          
                                           <td>{numeral(values.securityclip.qty * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.securityclip.price * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.securityclip.amount * qty).format('0,0.00')}</td>
                                         </tr>
                                         
                                         {grill === 'yes' && (
                                           <tr>
                                             <td>Grill</td>
                                            
                                             <td>{numeral(values.grill.qty * qty).format('0,0.00')}</td>
                                             <td>{numeral(values.grill.price * qty).format('0,0.00')}</td>
                                             <td>{numeral(values.grill.amount * qty).format('0,0.00')}</td>
                                           </tr>
                                         )}
                                         <tr>
                                           <td>Screws/Misc</td>
                                         
                                           <td>{numeral(values.screws.qty * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.screws.price * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.screws.amount * qty).format('0,0.00')}</td>
                                         </tr>
                                         <tr>
                                           <th colspan="3">Total</th>
                                           <th>{numeral(hardTotal * qty).format('0,0.00')}</th>
                                         </tr>
                                         <tr>
                                           <th colspan="3">Hardware Cost/Sqft</th>
                                          <th>{numeral(hardTotal / frameArea).format('0,0.00')}</th>
                                         </tr>
                                       </tbody>
                                     </table>
                                   </div>
                                   <hr />
               
                                   <div class="card-header ">
                                     <h5>Margin Cost</h5>
                                   </div>
                                   <div class="card-body">
                                     <table id="left-right-fix" class="table stripe row-border order-column">
                                       <thead>
                                         <tr>
                                           <th>Product Description</th>
                                           <th width="10%">Req. Qty </th>
                                           <th width="10%">Price</th>
                                           <th width="10%">Amount</th>
                                         </tr>
                                       </thead>
                                       <tbody>
                                         <tr>
                                           <td>Margin</td>
                                        
                                           <td>{numeral(values.margin.qty * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.margin.price * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.margin.amount * qty).format('0,0.00')}</td>
                                         </tr>
                                         <tr>
                                           <th colspan="3">Total</th>
                                           <th>{numeral(marginTotal * qty).format('0,0.00')}</th>
                                         </tr>
                                         <tr>
                                           <th colspan="3">Margin Cost/Sqft</th>
                                           <th>{numeral(marginTotal / frameArea).format('0,0.00')}</th>
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
                                           <th colspan='2'>Product Description</th>
                                           <th width="10%">Req. Qty </th>
                                           <th width="10%">Price</th>
                                           <th width="10%">Amount</th>
                                         </tr>
                                       </thead>
                                       <tbody>
                                         <tr>
                                           <td colspan='2' >Markting OH <br /><small>(Site Visit, Messurement)</small></td>
                                         
                                           <td>{numeral(values.marketing.qty * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.marketing.price * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.marketing.amount * qty).format('0,0.00')}</td>
                                         </tr>
                                         <tr>
                                           <td>Transport <br /><small>(Meterial Transportation)</small></td>
                                           <td>
                                             <small>Distance in KM</small>
                                             <p> {distance} </p>
                                           </td>
                                         
                                           <td>{numeral(values.transport.qty * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.transport.price * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.transport.amount * qty).format('0,0.00')}</td>
                                         </tr>
                                         <tr>
                                           <td colspan='2'>Labour (Factory)<br /><small>(Wages, Electricity, Rent)</small></td>
                                          
                                           <td>{numeral(values.labourF.qty * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.labourF.price * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.labourF.amount * qty).format('0,0.00')}</td>
                                         </tr>
                                         <tr>
                                           <td colspan='2'>Labour (Site) <br /><small>(Sylicon, Errection Screws, Dummy Caps, Drain Hole Caps, Wages for Installation)</small></td>
                                           
                                           <td>{numeral(values.labourS.qty * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.labourS.price * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.labourS.amount * qty).format('0,0.00')}</td>
                                         </tr>
                                         <tr>
                                           <td colspan='2' >Glass</td>
                                           
                                           <td>{numeral(values.glass.qty * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.glass.price * qty).format('0,0.00')}</td>
                                           <td>{numeral(values.glass.amount * qty).format('0,0.00')}</td>
                                         </tr>
                                         <tr>
                                           <th colspan="4">Total</th>
                                           <th>{numeral(prodTotal * qty).format('0,0.00')}</th>
                                         </tr>
                                         <tr>
                                           <th colspan="4">Production Cost/Sqft</th>
                                           <th>{numeral(prodTotal / frameArea).format('0,0.00')}</th>
                                         </tr>
               
                                       </tbody>
                                     </table>
                                   </div>
               
               
                                 </div>
                               </div>


             


            </div>
          </div>
        </div>



      )}

    

    </div>

  )
}
export default Quotees;
