import React, { useEffect, useState } from 'react';
import { ReactSession } from 'react-client-session';
import axios from 'axios';
import numeral from 'numeral';
import left from '../images/handleLeft.png';
import right from '../images/handleRight.png';
import meshimg from '../images/mesh.png';
import Handle from '../images/slideHandle.png';
import Fan from '../images/fan.png';
import Louver from '../images/louverss.png';
import ContentEditable from 'react-contenteditable';


function Downlaod({ quotes, discount, toggle}) {
  const urlParams = new URLSearchParams(window.location.search);
  const quoteIds = urlParams.get('id');
  const arrayValues = urlParams.get('arrayValues');
  const userType = ReactSession.get("upvcuserType");
  const Empid = ReactSession.get("upvcempid");
  const userId = ReactSession.get('upvcuserId');
  const Number = ReactSession.get('upvcNumber');
  const Address = ReactSession.get('upvcAddress');
  const Name = ReactSession.get('upvcuserName');
  const Image = ReactSession.get('upvcImage');
  const regid = ReactSession.get("upvcregid");
  const [brandDatas, setBdata] = useState(null);

  const [quoteData, setQuoteData] = useState(null);
  const [filteredArray, setFilteredArray] = useState([]);
  const [des, setDes] = useState("");

  const [measure, setMeasure] = useState('ft');
  const [mCalc, setMcalc] = useState(1);
  const [bottomFrame, setBottomFrame] = useState('yes');
  const [mesh, setMesh] = useState('no');
  const [panelHeights, setpanelHeight] = useState(0);
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  const [screen, setScreen] = useState(deviceWidth > 700 ? 28 : 28);
  const [fanTop, setfanTop] = useState('Top');
  const [fanLeft, setfanLeft] = useState('Left');
  const [divider, setDevider] = useState('Vertical');
  const [switchs, setSwitch] = useState('on');
  const [switchFixed, setFixed] = useState('on');
  const [fanType, setfanType] = useState(1);
  const [total, setTotal] = useState(0);
  const [qty, setQty] = useState(0);
  const [totalframearea, setTotalFramearea] = useState(0);
  const [gst, setGst] = useState(0);
  const [average, setAverage] = useState(0);
  const [discountprice, setDiscountprice] = useState(0);
  const [totalaftrdis, setTotalaftrdis]= useState(0);
  const [splitter, setSplitter] = useState([]);
  const [customCost, setCustomCost] = useState([]);

  //console.log(toggle);


  let users = '';
  if (userType === '3') {
    users = Empid;
  } else {
    users = userId;
  }
  const user = { "userId": users };

  const getCustomCost = async () => {
    try{
      const customCost = await axios.post('https://upvcapi.sninfoserv.com/get-value/', user);
      setCustomCost(customCost?.data?.data || []);
    }catch (error){
      console.error('unable to get data for values');
    }
  };

  useEffect(() => {
    const updateDeviceWidth = () => {
      setDeviceWidth(window.innerWidth);
      setScreen(window.innerWidth > 700 ? 28 : 28);
    };

    window.addEventListener('resize', updateDeviceWidth);

    return () => {
      window.removeEventListener('resize', updateDeviceWidth);
    };
  }, []);

  const brandData = async () => {
    try {
      const response = await axios.get('https://upvcapi.sninfoserv.com/company/', { params: { userId: users } });
      //console.log(response.data);
      if (response.data.status === 'success') {
        setBdata(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching brand data:', error);
    }
  };

  useEffect(() => {
    brandData();
    getCustomCost();
  }, []);


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

  // Ensure quoteData is valid before using filter method
  const filteredQuotes = quoteData && quoteData.data.filter(quote => quote.quoteId === quoteIds);
  const profileImage = filteredQuotes && filteredQuotes[0]?.quoteDetails[0]?.quoteData?.selectedProfile || 'profile_logo';


  // console.log(filteredQuotes);

  useEffect(() => {
    if (filteredQuotes && filteredQuotes.length > 0) {
      let sum = 0;
      let qty = 0;
      let totalframe = 0;
      let average = 0;
      filteredQuotes.forEach(quote => {
        quote.quoteDetails.forEach(detail => {
          qty += parseFloat(detail.quoteData.qty);
          totalframe += (detail.quoteData.frameArea * detail.quoteData.qty);
          sum += parseFloat( parseFloat(detail.quoteData.grandTotal) * parseFloat(detail.quoteData.qty));

          // console.log(sum);
        });
      });
      average = (sum / totalframe);

    


      const discountsAmount = (((sum * parseFloat(discount))/100)) || 0;
      setDiscountprice(discountsAmount);
      setTotalaftrdis( sum - parseFloat(discountsAmount));
      setTotal(sum);
      setQty(qty);
      setTotalFramearea(totalframe);
      setGst((18 / 100) * sum);
      setAverage(average);
    }
  }, [filteredQuotes]);


  useEffect(() => {
    if (arrayValues) {
      // Split arrayValues string into an array of values
      const valuesArray = arrayValues.split(',');

      // Filter quotes based on valuesArray
      const filtered = quotes.filter(quote =>
        valuesArray.every(value => quote.details.includes(value))
      );

      setFilteredArray(filtered);
    }
  }, [arrayValues, quotes]);


  // const createGrill = (boxHeight, topnewHeights, bottomnewHeights, mCalc) => {

  //   const boxes = 
  //   Array.from({ length: (boxHeight - topnewHeights - bottomnewHeights) * 3 }).map((_, index) => (
  //     <div
  //       key={index}
  //       style={{
  //         float:'left',
  //         position: 'relative',
  //         width: '100%',
  //         height: '3px',
  //         border: '1px solid #333',
  //         background: '#fff',
  //         marginTop: `5px`,
  //       }}
  //     ></div>
  //   ));

  //   return boxes;

  // };

  
  const fetchterms = async () => {
    try {

      const response = await axios.get('https://upvcapi.sninfoserv.com/quote-terms/', { params: { userId: users } });

      setDes(response.data.companyTerms)
    } catch (error) {
      // Handle error
      console.error('There was a problem with login:', error);

    }
  }
  useEffect(() => {
    fetchterms();
  }, [])

  const getInitials = (str) => {
    return str
      .split(' ')  // Split the string into words
      .map(word => word[0]?.toUpperCase())  // Get the first character of each word and convert it to uppercase
      .filter(char => /[A-Za-z]/.test(char))  // Filter out non-alphabetic characters
      .join('');  // Join them together to form the initials
  };
  

  // console.log(filteredQuotes);

  const getOuterBottom = (height, screen, mCalc) => {
    const fullHeightpx = (height) * screen / mCalc;
    return `calc(${fullHeightpx}px - 15px)`; 
  };

  // const boxes = (height) => {
  //   const box = Array.from({ length: height * 2 }).map((_, index) => (
  //     <div
  //       key={index}
  //       style={{
  //         position: "relative",
  //         width: "100%",
  //         // height: "0.26vw",
  //         height:'3px',
  //         border: "1px solid #333",
  //         background: "#fff",
  //         marginTop: `calc((${(height * screen) / mCalc + "px"} - 25px) / ${
  //         height * 2.7
  //         }) `,
  //       }}
  //     ></div>
  //   ));
  //   return box;
  // };

  const createGrill = (boxHeight, topnewHeights, bottomnewHeights, mCalc) => {

    const boxes = 
    Array.from({ length: (boxHeight - topnewHeights - bottomnewHeights) * (screen === 40 ? 4.2 : 2) }).map((_, index) => (
      <div
        key={index}
        style={{
          float:'left',
          position: 'relative',
          width: '100%',
          height: '2.5px',
          border: '1px solid #333',
          background: '#fff',
          marginTop: `4.5px`,
        }}
      ></div>
    ));

    return boxes;

  };


  // const boxes = (height) => {
  //   const box = Array.from({ length: height * 2 }).map((_, index) => (
  //     <div
  //       key={index}
  //       style={{
  //         position: "relative",
  //         width: "100%",
  //         height: "0.21vw",
  //         // height:'3px',
  //         border: "1px solid #333",
  //         background: "#fff",
  //         marginTop: `calc((${(height * screen) / mCalc + "px"} - 25px) / ${
  //         height * 2.7
  //         }) `,
         
  //       }}
  //     ></div>
  //   ));
  //   return box;
  // };

  const boxes = (mcalc, measures, height) => {
  const isFeet = measures === "ft";
  const totalBoxes = isFeet ? height * 2 : (height / 304.8) * 2;
  const unitHeight = isFeet ? "0.21vw" : "12px";
  const marginExpr = isFeet
    ? `calc((${(height * screen) / mcalc}px - 25px) / ${height * 2.7})`
    : `calc((${(height / 304.8) * screen / mcalc}vw - 11px) / ${(height / 304.8) * 2.7})`;

  return Array.from({ length: totalBoxes }).map((_, index) => (
    <div
      key={index}
      style={{
        position: "relative",
        width: "100%",
        height: unitHeight,
        border: "1px solid #333",
        background: isFeet ? "#fff" : undefined,
        marginTop: marginExpr,
      }}
    />
  ));
};
  
  // useEffect(() => {
  //   let height = 0;
  //   let size = 0
  //   filteredQuotes && filteredQuotes[0]?.quoteDetails?.forEach(items => {
  //     if(height <= 30){
  //       height += parseFloat(items?.quoteData?.boxHeight);
  //       size += 1;
  //     }
  //   });

  //   // console.log(height);
  //   // console.log(size);

  //   const itemCount = filteredQuotes ? filteredQuotes[0]?.quoteDetails?.length : 0;
  //   const chunkSize = 4;
  //   const chunks = [];
    
  //   for (let i = 0; i < itemCount; i += chunkSize) {
  //     chunks.push({
  //       start: i,
  //       end: Math.min(i + chunkSize, itemCount) // inclusive end
  //     });
  //   }

  //   console.log(chunks);

  //   setSplitter(chunks);

  // },[totalaftrdis]);

  useEffect(() => {  

    const maxHeight = 23;
    const maxBoxesPerRow = 4;

    const details = filteredQuotes?.[0]?.quoteDetails || [];
    const result = [];

    let start = 0;
    let currentHeight = 0;
    let count = 0;

    details.forEach((item, i) => {
      const boxHeight = parseFloat(item?.quoteData?.boxHeight) || 0;
      const measure = item?.quoteData?.measure;

      const height =
        measure === 'mm'
          ? parseFloat((boxHeight / 304.8).toFixed(2))
          : boxHeight;

      const exceedsHeight = currentHeight + height > maxHeight;
      const exceedsCount = count >= maxBoxesPerRow;

      if (count > 0 && (exceedsHeight || exceedsCount)) {
        // close current group
        result.push({
          start,
          end: i, // end is exclusive for slice()
          height: currentHeight,
        });

        // start new group
        start = i;
        currentHeight = height;
        count = 1;
      } else {
        currentHeight += height;
        count++;
      }
    });

    // push last group
    if (count > 0) {
      result.push({
        start,
        end: details.length, // end is exclusive
        height: currentHeight,
      });
    }

    console.log(result);
    setSplitter(result);

  },[totalaftrdis]);

  


  // const splitters = splitter &&  splitter[splitter?.length -1]?.end - splitter[splitter?.length -1]?.start
  // console.log(filteredQuotes);
  // console.log(customCost);

  const getItem = (item, height, width, amount) => {
    const area = parseFloat(height) * parseFloat(width);
    const itemValue = parseFloat(amount) / area;
    const itemData = customCost[item] || [];
    const name = itemData?.filter(item => parseFloat(item?.value) === parseFloat(itemValue));
    if(name){
      return name[0]?.label ?? null;
    }else{
      return null;
    }
    return null;
  };

  return (

    <div >
      <div class="modal fade custom-modal" id="onloadModal" tabindex="-1" aria-labelledby="onloadModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content" align="center">
            <div class="mt-3 mb-3">
              <h5>Preparing Quote...</h5>
            </div>
          </div>
        </div>
      </div>

      <div className='hide' id="pdf-content" style={{ maxWidth: '207mm', minWidth: '207mm', padding: "20px", background: '#fff' }}>
       
       <div>
       
        <table width='100%'  style={{ marginTop: '10px' }} id="first-table" >
          <tr>
            <th colspan='4' width='100%' style={{ textAlign: 'center', padding: '2px 10px', verticalAlign: 'middle' }}>
              <img 
                src={brandDatas && brandDatas[0]?.companyLogo && brandDatas[0]?.companyLogo !== 'user.png' ? `assets/user/${brandDatas[0].companyLogo}` : "/assets/images/pari-logo.png"} 
                height='60px' 
                alt="Pari & Co"
                style={{ marginRight: '10px', marginBottom: '5px', objectFit: 'contain' }}
              />
            </th>
          </tr>
          <tr>
            <th width='20%' style={{ textAlign: 'left', verticalAlign: 'middle', padding: '0px 20px 20px 0px', border: 'none' }}>
              {userId === '87' ?
                <img
                  style={{ color: '#000', marginRight: '5px', marginTop: '-40px' }}
                  src="assets/images/gpay.png"
                  width='65px'
                  alt='Logo'
                  class='mb-2'
                />
              :
              userId === '88' ?
                <></>
              :
                <img
                  style={{ color: '#000', marginRight: '25px' }}
                  src="assets/images/pari-logo.png"
                  width='90px'
                  alt='Logo'
                  class='mb-2'
                />
              }
            </th>

            <th colspan="2" width='60%' style={{ textAlign: 'center', verticalAlign: 'middle', padding: '0px 20px 20px 0px', border: 'none' }}>
              <p style={{ fontSize: '13px', margin: 0, color: '#000' }}> { (brandDatas && brandDatas[0]?.companyName) || localStorage.getItem("businessName") || "Pari and Co" }  </p>
              <p style={{ fontSize: '10px', margin: 0, color: '#000' }}>
                {brandDatas && brandDatas[0].companyAddress}<br /> Phone : {brandDatas && brandDatas[0].companyContact} , GST : {brandDatas && brandDatas[0].companyGst}
              </p>

            </th>

            <th width='20%' style={{ textAlign: 'right', verticalAlign: 'middle', padding: '0px 20px 20px 0px', border: 'none'}}>
              <img
                src={`assets/images/${profileImage}.jpg`}
                width='90px'
                alt={profileImage}
                style={{ marginRight: '12px' }}
              />
            </th>
          </tr>

    
          <tr>
            <th colspan="2" width='50%' style={{ textAlign: 'left', padding: "20px 20px", color: '#000', border: '1px solid #333', borderRight: 'none' }}>
                <div>
                  <h6 style={{ color: '#000', fontSize: '12px' }}>
                    Quotation No : {brandDatas && brandDatas[0]?.companyName.length > 0 && getInitials(brandDatas && brandDatas[0]?.companyName)}000{filteredQuotes && filteredQuotes[0]?.cusQuoteId}
                  </h6>
                </div>
            </th>
            <th colspan="2" width='50%' style={{ textAlign: 'right', padding: "20px 20px", color: '#000', border: '1px solid #333' }}>
                <div>
                  <h6 style={{ color: '#000', fontSize: '12px'}}>
                    Date : {filteredQuotes && filteredQuotes[0]?.date}
                  </h6>
                </div>
            </th>
          </tr>

          <tr>
            <th colspan="2" width='50%' style={{ textAlign: 'centre', padding: "20px 20px", color: '#000', border: '1px solid #333', borderTop: 'none', borderRight: 'none' }}>      
                <div>
                  <h6 style={{ color: '#000', fontSize: '12px' }}>
                    To
                    <ul style={{ listStyleType: 'none', fontSize: '10px' }}>
                      <li> {filteredQuotes && filteredQuotes[0]?.client?.name}</li>
                      <li> {filteredQuotes && filteredQuotes[0]?.client?.location}</li>
                      <li> {filteredQuotes && filteredQuotes[0]?.client?.number}</li>
                    </ul>
                  </h6>
                </div>  
            </th>
            <th colspan="2" width='50%' style={{ textAlign: 'right', padding: "20px 20px", color: "#000", border: 'none', border: '1px solid #333', borderTop: 'none' }}>
                <div>
                  <h6 style={{ color: '#000', fontSize: '12px', textAlign: 'left', }}>
                    Site
                    <ul style={{ listStyleType: 'none', fontSize: '10px' }}>
                      <li> {filteredQuotes && filteredQuotes[0]?.client?.name}</li>
                      <li> {filteredQuotes && filteredQuotes[0]?.client?.siteLocation}</li>
                      <li> {filteredQuotes && filteredQuotes[0]?.client?.number}</li>
                    </ul>
                  </h6>
                </div>
            </th>
          </tr>

          <tr>
            <td  colspan={4}  style={{ textAlign: "left", padding: '20px 0px', fontSize: '12px', color: "#000" }}>
                <p style={{ color: "#333", fontSize: '12px' }}>With reference to the above, We are pleased to submit our best possible quote and we hope this would be up to your expectations, We assure you our best services at all times and for any further clarifications kinldy feel free to call us at any time.</p>
                {des !== '' && <h5 style={{ color: '#333' }}>Terms & Conditions</h5>}
                <ContentEditable id="terms" html={`${des}`} style={{fontSize: '10px'}} />
            </td>
          </tr>

          <tr>
            <td colspan="4" style={{ textAlign: 'right', padding: '0px 0px 10px 0px', color: "#000", fontSize: '12px' }}>for { (brandDatas && brandDatas[0]?.companyName) || localStorage.getItem("businessName") || "Pari and Co" } </td>
          </tr>

          <tr><td></td></tr>
          <tr><td></td></tr>

          <tr>
            <td colspan="4" style={{ textAlign: 'right', color: "#000", fontSize: '12px' }}> {Name}, {Number} </td>
          </tr>
        </table>

      </div>


    {splitter?.map(splits =>
      <div className='pageCutting' style={{borderTop: '2px solid #ffffff'}}>
        <table className='force-break' style={{tableLayout: "fixed", width: "100%", border: '1px solid #666', borderCollapse: 'collapse', marginTop:'40px'}} width="100%" id="second-table" >
          
          <thead>
            <tr>
              <th style={{ border: '1px solid #666', width: "5%", padding: '2px', textAlign: 'center', color: "#000", fontSize: '12px' }}>S.No</th>
              <th colSpan={3} style={{ border: '1px solid #666', width: "45%", padding: '2px', textAlign: 'center', color: "#000", fontSize: '12px' }}>Item</th>
              <th colSpan={4} style={{ border: '1px solid #666',  padding: '2px', textAlign: 'center', color: "#000", fontSize: '12px' }}>Description</th>
            </tr>
          </thead>

          {filteredQuotes?.map((quote, index) => (
            <tbody key={index}>
              {quote?.quoteDetails?.slice(splits?.start, splits?.end)?.map((detail, detailIndex) => (
              <>
                <tr key={detailIndex}>
                  <td rowSpan={3}  style={{ border: '1px solid #666', padding: '2px 10px', alignContent: 'center', alignItems: 'center', textAlign: 'center', color: "#000" }}>{detailIndex + splits?.start + 1}</td>

                  <td rowSpan={3} colSpan={3} height="255px" style={{ minHeight: '200px', maxHeight: '255px', border: '1px solid #666', padding: '5px', alignContent: 'center', alignItems: 'center', textAlign: 'center', color: "#000" }}>
                    <h5 style={{ color: '#000', fontSize: '13px' }} align="center">{detail.quoteData.item}</h5>
                   
                    <div style={{ marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>

                    {detail.quoteData.item === 'CasementDoor' && (
                      <>
                        <div align="center" style={{ alignContent: 'center', alignItems: 'center', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                    
                          <div style={{ float: 'left',boxShadow: '1px 1px 5px grey', width: detail.quoteData.boxWidth * screen / detail.quoteData.mCalc + 'px', height: detail.quoteData.boxHeight * screen / detail.quoteData.mCalc + 'px', border: '1px solid #333' }}>



                          {[...Array(detail.quoteData.numFrames)].map((_, index) => (
                            <div style={{ float: 'left', margin: '2px', border: '1px solid #333', width: `calc(${parseFloat(detail.quoteData.boxWidth) * screen / detail.quoteData.mCalc / detail.quoteData.numFrames + 'px'} - 6px)`, height: bottomFrame === 'yes' ? `calc(${parseFloat(detail.quoteData.boxHeight) * screen / detail.quoteData.mCalc + 'px'} - 6px)` : `calc(${parseFloat(detail.quoteData.boxHeight) * screen / detail.quoteData.mCalc + 'px'} - 6px)`,position:'relative' }}>
                              {/* {detail.quoteData.boxHeight && detail.quoteData.boxWidth>0?
                              <> */}
                              {/* outer corner lines start */}
                              {/* <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-6.5px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                              <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-6px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                              <div style={{ height: '8px', width: '1px', float: 'right', marginTop: getOuterBottom(detail.quoteData.boxHeight, screen, detail.quoteData.mCalc), marginRight: '-4px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                              <div style={{ height: '8px', width: '1px', float: 'left', marginTop: getOuterBottom(detail.quoteData.boxHeight, screen, detail.quoteData.mCalc), marginLeft: '-3px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div> */}
                              {/* outer corner lines end */}
                              {/* </>:<></>
                              }                       */}

                              {detail.quoteData.boxTop === 'on' && (

                                [...Array(detail.quoteData.numTopBoxes)].map((_, index) => (
                                  <div style={{ display: 'flex', width: `calc(${detail.quoteData.boxWidth * screen / detail.quoteData.mCalc / detail.quoteData.numFrames + 'px'} - 18px)`,position:'relative', height: `calc(${(detail.quoteData.topnewHeights * screen / detail.quoteData.mCalc)}px )`, margin: '5px',position:'relative' }}>
                                    {[...Array(detail.quoteData.topFixedNum)].map((_, index) => (
                                      <div style={{ flex: '1', backgroundColor: 'white',padding:'4px',boxSizing:'border-box', width: `calc(${detail.quoteData.topFixedWidth[index] * screen / detail.quoteData.mCalc / detail.quoteData.numFrames + 'px'} - 18px)`, height: `calc(${(detail.quoteData.topnewHeights * screen / detail.quoteData.mCalc)}px )`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px', position:'relative'}}>
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
                                       <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${detail.quoteData.topnewHeights*screen/detail.quoteData.mCalc}px - 12px)`, marginRight: '-4px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                                       <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${detail.quoteData.topnewHeights*screen/detail.quoteData.mCalc}px - 12px)`, marginLeft: '-3px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>
                                       {/* Inner corner lines end */}
                                       {/* outer corner lines start for bottom sash*/}
                                       <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-12px', marginRight: '-9px', transform: 'rotate(45deg)',  background: index === detail.quoteData.topFixedWidth.length -1  ? 'black' : 'transparent'}}></div>
                                       <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-12px', marginLeft: '-9px', transform: 'rotate(-45deg)', background: index === 0 ? 'black' : 'transparent'}}></div>
                                       {/* <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${bottomnewHeights*screen/detail.quoteData.mCalc}px - 12px)`, marginRight: '-11px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                                       <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${bottomnewHeights*screen/detail.quoteData.mCalc}px - 12px)`, marginLeft: '-9px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>  */}
                                       {/* outer corner lines end */}
                                       <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${detail.quoteData.topnewHeights*screen/detail.quoteData.mCalc}px - 8px)`, marginRight: '-6px', transform: 'rotate(180deg)', background:(detail.quoteData.topFixedWidth.length === 0 && detail.quoteData.boxTop === 'on') || index === detail.quoteData.topFixedWidth.length - 1 ? 'black' : 'transparent' }}></div>
                                       <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${detail.quoteData.topnewHeights*screen/detail.quoteData.mCalc}px - 8px)`, marginLeft: '-6px', transform: 'rotate(180deg)', background: index === 0 ? 'black' : 'transparent' }}></div>
     
                                        {/* fixed plus  */}
                                       <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                      </div>
                                      </div>
                                    ))}
          
                                  </div>
                                ))
                              )}

   
                              <div style={{ display: 'flex' }}>
                                {[...Array(detail.quoteData.numSecondInnerBoxes)].map((_, index) => (

                                  <div key={index}  style={{ backgroundColor: 'white',boxSizing: 'border-box' ,  height: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc}px - ${bottomFrame === 'no' ? '18px' : '23px'} - ${detail.quoteData.boxTop === 'on' ? '0px' : '-5px'})`,position:'relative' , width: `calc(${detail.quoteData.newWidths[index] * screen / detail.quoteData.mCalc}px)`,  marginTop: detail.quoteData.boxTop === 'on' ? '0px' : '5px', marginRight: index === detail.quoteData.numSecondInnerBoxes - 1 ? '5px' : '2.5px', marginLeft: index === 0 ? '5px' : '4.5px',padding:'5px',border: '1px solid #333' }}>
         
                                      <div style={{
                                      width: '100%',
                                      height: '100%',
                                      border: '1px solid #333',
                                      backgroundColor: detail.quoteData.split === 'on' ? 'transparent': detail.quoteData.panelType === 1 ? 'lightgray' : detail.quoteData.panelType === 2 ? 'lightyellow' : 'lightblue',
                                      position:'relative'
                                    }}>
                                      {/* Inner corner lines start */} 
                                      <div key={index} style={{ height: detail.quoteData.bottomFrame === 'no'?'11px':'15px', width: '1px', float: 'left', marginTop: `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen) / detail.quoteData.mCalc}px - ${detail.quoteData.boxTop === 'on' ?detail.quoteData. bottomFrame==='no'?'33px':'39px' : detail.quoteData.bottomFrame==='no'?'28px':'34px'})`, marginLeft:detail.quoteData.boxBottom === 'on'?'-4px':'-6px', transform: 'rotate(45deg)', borderLeft: '1px solid grey' }}></div>
                                      <div key={index} style={{ height:detail.quoteData.boxTop === 'on'?'11px':'15px', width: '1px', float: 'left', marginTop:detail.quoteData.boxTop === 'on'?'-9px':'-14px', marginLeft:detail.quoteData.boxTop === 'on'?'-4px':'-6px', transform: 'rotate(-45deg)', borderLeft: '1px solid grey' }}></div>
                                      <div style={{ height: detail.quoteData.boxTop === 'on'?'11px':'15px', width: '1px', float: 'right', marginTop:detail.quoteData.boxTop === 'on'?'-9px':'-14px', marginRight:detail.quoteData.boxTop === 'on'?'-4px':'-6px', transform: 'rotate(45deg)', borderRight: '1px solid grey' }}></div>
                                      {/* <div style={{ height: '15px', width: '1px', float: 'left', marginTop: getInnerBottom(detail.quoteData.boxHeight - topnewHeights - bottomnewHeights, screen, detail.quoteData.mCalc), marginLeft: '-4px', transform: 'rotate(-45deg)', borderLeft: index === 0 ? 'transparent' : '1px solid black' }}></div> */}
                                      <div style={{ height: detail.quoteData.bottomFrame === 'no'?'11px':'15px', width: '1px', float: 'right', marginTop: `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen) / detail.quoteData.mCalc}px - ${detail.quoteData.boxTop === 'on' ? detail.quoteData.bottomFrame==='no'?'33px':'39px' : detail.quoteData.bottomFrame==='no'?'28px':'34px'})`, marginRight:detail.quoteData.boxBottom==='on'?'-4px':'-6px', transform: 'rotate(-45deg)', borderLeft: '1px solid grey' }}></div>
                                      <div style={{ height: '10px', width: '1px', float: 'right', marginTop: `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen) / detail.quoteData.mCalc}px - ${detail.quoteData.boxBottom === 'on' ? '33px' : '27px'})`, marginRight: '-4px', transform: 'rotate(-45deg)', borderRight: index === -1 ? '1px solid grey' : 'none' }}></div>
                                      {/* <div style={{ height: '7px', width: '1px', float: 'left', right: '0px', marginTop: '-6px', marginRight: '-1px', background: index === 0 ? 'transparent' : 'black' }}></div> */}
                                      {/* Inner corner lines ends */}   

                                       {detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.grill === 'yes' && <div style={{position:"absolute",width:'100%'}}>{boxes(detail.quoteData.mCalc, detail.quoteData.measure, detail.quoteData.boxHeight -detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights -0.2)}</div>}
                                                          

                                    {
                                      detail.quoteData.boxNames[index] === 'Shutter' ? (
                                        detail.quoteData.boxHandle[index] === 'left' ? (
                                          <>
                                            <img
                                              src={left}
                                              style={{
                                                float: 'left',
                                                marginTop: `calc(${(((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc) / 2)}px - ${screen === 40 ? '28px':'25px'}`,
                                                marginLeft: '-5px',
                                                width: screen === 40 ? '13px' : '8px'
                                              }}                   
                                              alt="Left Handle"
                                            />
                                           {/* dotted line start */}
                                           <div style={{ position: 'absolute', top: detail.quoteData.split === 'on' ? `calc(${detail.quoteData.topnewHeights > 0 ? ((detail.quoteData.shutterHeight[index].height-0.5) * screen / detail.quoteData.mCalc) : (detail.quoteData.shutterHeight[index].height * screen / detail.quoteData.mCalc)}px + ${detail.quoteData.topnewHeights > 0 ? '12px' : '-8px'} - ${screen === 20 ? '10px' : '0px'})` : '0', right: 0, width: '100%', height: detail.quoteData.split=='on'?`calc(${(detail.quoteData.boxHeight - detail.quoteData.shutterHeight[index].height - detail.quoteData.topnewHeights) * screen / detail.quoteData.mCalc}px - 21px  - ${detail.quoteData.bottomFrame==='no'?'-4px':'1px'} - ${detail.quoteData.split === 'on'?'5px':'1px'})`:'100%', zIndex: 1, overflow: 'hidden' }}>

                                              {/* Line from center to top-right */}
                                               <div style={{position: 'absolute',top: '50%',right: '0',width: '2px',height: '2000%',borderLeft: '1px dashed gray',transform: `rotate(${(detail.quoteData.boxTop === 'on' || detail.quoteData.boxBottom === 'on' ? -1 : 0) + 90 + Math.acos((2 * (detail.quoteData.newWidths[index]/2)) / Math.sqrt(4 * (detail.quoteData.newWidths[index]/2) * (detail.quoteData.newWidths[index]/2) + (detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights- (detail.quoteData.split === 'on' ? detail.quoteData.shutterHeight[index].height : 0))/2 * (detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights- (detail.quoteData.split === 'on' ? detail.quoteData.shutterHeight[index].height : 0))/2)) * (180 / Math.PI)+detail.quoteData.numSecondInnerBoxes}deg)`,transformOrigin: 'top right',}}></div>

                                               {/* Line from center to bottom-right */}
                                               <div style={{position: 'absolute',bottom: '50%',right: '0',width: '2px',height: '2000%',borderLeft: '1px dashed gray',transform: `rotate(-${(detail.quoteData.boxTop === 'on' || detail.quoteData.boxBottom === 'on' ? -1 : 0) + 90 + Math.acos((2 * (detail.quoteData.newWidths[index]/2)) / Math.sqrt(4 * (detail.quoteData.newWidths[index]/2) * (detail.quoteData.newWidths[index]/2) + (detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights- (detail.quoteData.split === 'on' ? detail.quoteData.shutterHeight[index].height : 0))/2 * (detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights- (detail.quoteData.split === 'on' ? detail.quoteData.shutterHeight[index].height : 0))/2)) * (180 / Math.PI)+detail.quoteData.numSecondInnerBoxes}deg)`,transformOrigin: 'bottom right',}}></div>

                                            </div>
                                           {/* dotted line end */}

                                          </>
                                        ) : (
                                          <>

                                            <img
                                              src={right}
                                              style={{
                                                float: 'right',
                                                marginTop: `calc(${(((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc) / 2)}px - ${screen === 40 ? '28px':'25px'}`,
                                                marginRight: '-5px',
                                                width: screen === 40 ? '13px' : '8px'
                                              }}                  
                                              alt="Right Handle"
                                            />                  
                 
                                           <div style={{ position: 'absolute', top: detail.quoteData.split === 'on' ? `calc(${detail.quoteData.topnewHeights > 0 ? ((detail.quoteData.shutterHeight[index].height-0.5) * screen / detail.quoteData.mCalc) : (detail.quoteData.shutterHeight[index].height * screen / detail.quoteData.mCalc)}px + ${detail.quoteData.topnewHeights > 0 ? '12px' : '-8px'} - ${screen === 20 ? '10px' : '0px'})` : '0', right: 0, width: '100%', height: detail.quoteData.split=='on'?`calc(${(detail.quoteData.boxHeight - detail.quoteData.shutterHeight[index].height - detail.quoteData.topnewHeights) * screen / detail.quoteData.mCalc}px - 21px  - ${detail.quoteData.bottomFrame==='no'?'-4px':'1px'} - ${detail.quoteData.split==='on'?'5px':'1px'})`:'100%', zIndex: 1, overflow: 'hidden' }}>

                                              {/* Line from center to top-left */}
                                              <div style={{ position: 'absolute', top: '50%', left: '0', width: '2px', height: '150%', borderLeft: '1px dashed gray', transform: `rotate(-${(detail.quoteData.boxTop === 'on' || detail.quoteData.boxBottom === 'on' ? -1 : 0) + 90 + Math.acos((2 * (detail.quoteData.newWidths[index]/2)) / Math.sqrt(4 * (detail.quoteData.newWidths[index]/2) * (detail.quoteData.newWidths[index]/2) + (detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights- (detail.quoteData.split === 'on' ? detail.quoteData.shutterHeight[index].height : 0))/2 * (detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights- (detail.quoteData.split === 'on' ? detail.quoteData.shutterHeight[index].height : 0))/2)) * (180 / Math.PI)+detail.quoteData.numSecondInnerBoxes}deg)`, transformOrigin: 'top left' }}></div>

                                              {/* Line from center to bottom-left */}
                                              <div style={{ position: 'absolute', bottom: '50%', left: '0', width: '2px', height: '150%', borderLeft: '1px dashed gray', transform: `rotate(${(detail.quoteData.boxTop === 'on' || detail.quoteData.boxBottom === 'on' ? -1 : 0) + 90 + Math.acos((2 * (detail.quoteData.newWidths[index]/2)) / Math.sqrt(4 * (detail.quoteData.newWidths[index]/2) * (detail.quoteData.newWidths[index]/2) + (detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights- (detail.quoteData.split === 'on' ? detail.quoteData.shutterHeight[index].height : 0))/2 * (detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights- (detail.quoteData.split === 'on' ? detail.quoteData.shutterHeight[index].height : 0))/2)) * (180 / Math.PI)+detail.quoteData.numSecondInnerBoxes}deg)`, transformOrigin: 'bottom left' }}></div></div>

                                          </>
                                        )
                                      ) : (
                                        <>
                                          {/* Plus Icon in Center */}
                                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '50px', fontWeight: '100', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>

                                        </>
                                      )
                                    }

          

                                    {detail.quoteData.split === 'on' && 
                                      <>
          
                                        <div style={{background: detail.quoteData.shutterHeight[index].top === 'glass' ? 'lightblue' : detail.quoteData.shutterHeight[index].top === 'panel' ? 'lightgrey' : 'lightyellow', width: `calc(${detail.quoteData.newWidths[index] * screen / detail.quoteData.mCalc}px - 16 px)`, height: `calc(${(detail.quoteData.shutterHeight[index].height) * screen / detail.quoteData.mCalc}px - 15px`, border: '1px solid #333' }}></div>
                                        {/* <div style={{background: shutterHeight[index].bottom === 'glass' ? 'lightblue' : shutterHeight[index].bottom === 'panel' ? 'lightgrey' : 'lightyellow', width: `calc(${newWidths[index] * screen / detail.quoteData.mCalc}px - 16 px)`, height: `calc(${(detail.quoteData.boxHeight - shutterHeight[index].height) * screen / detail.quoteData.mCalc}px - ${topnewHeights > 0 ? '21px' : '15px'} - ${bottomFrame==='no'?'-4px':'1px'} - ${split==='on'?'5px':'1px'})`, border: '1px solid #333', marginTop: '5px' }}></div> */}
                                        <div style={{background: detail.quoteData.shutterHeight[index].bottom === 'glass' ? 'lightblue' : detail.quoteData.shutterHeight[index].bottom === 'panel' ? 'lightgrey' : 'lightyellow', width: `calc(${detail.quoteData.newWidths[index] * screen / detail.quoteData.mCalc}px - 16 px)`, height: `calc(${((detail.quoteData.boxHeight - detail.quoteData.shutterHeight[index].height - detail.quoteData.topnewHeights) * screen / detail.quoteData.mCalc)}px - 21px - ${detail.quoteData.bottomFrame === 'no' ? '-4px' : '1px'} - ${detail.quoteData.boxTop === 'on' ? '5px' : '-1px'})`, border: '1px solid #333', marginTop: '5px' }}></div>

                                      </>
                                    }
                                  
                                  </div>
                                  </div>

                                ))}

                              </div>


                            </div>
                          ))}
                          </div>

                        </div>
                     
                        
                       </>
                    )}


                   {detail?.quoteData?.item === 'CasementWindow' && (

                     <>
                       <div align="center" style={{ alignContent: 'center', alignItems: 'center', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>

                       <div style={{ float: 'left',boxShadow: '1px 1px 5px grey' , width: detail.quoteData.boxWidth * screen / detail.quoteData.mCalc + 'px', height: detail.quoteData.boxHeight * screen / detail.quoteData.mCalc + 'px', border: '1px solid #333' }}>

                       {[...Array(detail.quoteData.numFrames)].map((_, index) => (
                         <div style={{ float: 'left', margin: '2px', border: '1px solid #333', width: `calc(${detail.quoteData.boxWidth * screen / detail.quoteData.mCalc / detail.quoteData.numFrames + 'px'} - 7px)`, height: `calc(${detail.quoteData.boxHeight * screen / detail.quoteData.mCalc + 'px'} - 7px)` }}>
                         {/* outer corner lines start topsash*/}
                           {/* <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-6.5px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                           <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-6px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                           <div style={{ height: '8px', width: '1px', float: 'right', marginTop: getOuterBottom(detail.quoteData.boxHeight, screen, detail.quoteData.mCalc), marginRight: '-4px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                           <div style={{ height: '8px', width: '1px', float: 'left', marginTop: getOuterBottom(detail.quoteData.boxHeight, screen, detail.quoteData.mCalc), marginLeft: '-3px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div> */}
                           {/* outer corner lines end */}

                         {detail.quoteData.boxTop === 'on' && (
                           [...Array(detail.quoteData.numTopBoxes)].map((_, index) => (
                             <div style={{ display: 'flex', width: `calc(${detail.quoteData.boxWidth * screen / detail.quoteData.mCalc / detail.quoteData.numFrames + 'px'} - 20px)`, height: `calc(${(detail.quoteData.topnewHeights * screen / detail.quoteData.mCalc)}px )`, margin: '5px' }}>
                               {[...Array(detail.quoteData.topFixedNum)].map((_, index) => (
                                 <div style={{ flex: '1', backgroundColor:'white',padding:'4px',boxSizing:'border-box',width: `calc(${detail.quoteData.topFixedWidth[index] * screen / detail.quoteData.mCalc / detail.quoteData.numFrames + 'px'} - 18px)`, height: `calc(${(detail.quoteData.topnewHeights * screen / detail.quoteData.mCalc)}px )`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px', position: 'relative' }}>
                                   <div style={{
                                         width: '100%',
                                         height: '100%',
                                         border: '1px solid #333',
                                         backgroundColor:detail.quoteData.topsash[index].type === 'fixed' ? 'lightgreen' : 'lightblue', // Main content color
                                         position:'relative'
                                    }}>
                           {/* Inner corner lines start */}
                           <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-6.5px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                           <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-6px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                           <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${detail.quoteData.topnewHeights*screen/detail.quoteData.mCalc}px - 12px)`, marginRight: '-4px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                           <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${detail.quoteData.topnewHeights*screen/detail.quoteData.mCalc}px - 12px)`, marginLeft: '-3px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>
                           {/* Inner corner lines end */}
                             {/* outer corner lines start for bottom sash*/}
                            <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-12px', marginRight: '-9px', transform: 'rotate(45deg)',  background: index === detail.quoteData.topsash.length -1  ? 'black' : 'transparent'}}></div>
                           <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-12px', marginLeft: '-9px', transform: 'rotate(-45deg)', background: index === 0 ? 'black' : 'transparent'}}></div>
                           {/* <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${bottomnewHeights*screen/detail.quoteData.mCalc}px - 12px)`, marginRight: '-11px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                           <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${bottomnewHeights*screen/detail.quoteData.mCalc}px - 12px)`, marginLeft: '-9px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>  */}
                           {/* outer corner lines end */}
                           <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${detail.quoteData.topnewHeights*screen/detail.quoteData.mCalc}px - 8px)`, marginRight: '-6px', transform: 'rotate(180deg)', background: index === detail.quoteData.topsash.length -1  ? 'black' : 'transparent' }}></div>
                           <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${detail.quoteData.topnewHeights*screen/detail.quoteData.mCalc}px - 8px)`, marginLeft: '-6px', transform: 'rotate(180deg)', background: index === 0 ? 'black' : 'transparent' }}></div>
                                   {detail.quoteData.topsash[index].type === 'shutter' ?(
                                     <>
                                       <img
                                         src={left}
                                         style={{
                                           float: 'left',
                                           marginTop: `calc(${(((detail.quoteData.topnewHeights) * screen / detail.quoteData.mCalc))}px - 25px)`,
                                           marginLeft: '45%',
                                           width: screen === 40 ? '13px' : '8px',
                                           transform: 'rotate(-90deg)'
                                         }}
                  
                                         alt="Left Handle"
                                       />
                                       <div style={{ position: 'absolute', width: '100%', height: '100%',overflow:'hidden' }}>
                                         {/* Left Diagonal Line  */}
                                         <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(${Math.atan((detail.quoteData.topFixedWidth.length ? detail.quoteData.topFixedWidth[index] : detail.quoteData.boxWidth) / (2 * detail.quoteData.topnewHeights)) * (180 / Math.PI)+2.5}deg)`, transformOrigin: 'top left' }}></div>


                                         {/* Right Diagonal Line */}
                                         <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(-${Math.atan((detail.quoteData.topFixedWidth.length ? detail.quoteData.topFixedWidth[index] : detail.quoteData.boxWidth) / (2 * detail.quoteData.topnewHeights))* (180 / Math.PI)+2.5}deg)`, transformOrigin: 'top left' }}></div>

                                       </div>
                                       {/* {detail.quoteData.topsash[index].type === 'shutter' && grill === 'yes' && boxes(detail.quoteData.topnewHeights + 0.5)} */}
                                      {detail.quoteData.topsash[index].type === 'shutter' && detail.quoteData.grill === 'yes' && boxes(detail.quoteData.mCalc, detail.quoteData.measure, detail.quoteData.topnewHeights+0.1)}
               

                                     </>
                                   ):(
                                     <>
                                     {/* fixed plus  */}
                                     <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
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
                             {[...Array(detail.quoteData.numSecondInnerBoxes)].map((_, index) => (

                              <div key={index}  style={{  height: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc}px - ${detail.quoteData.boxTop === 'on' ? '26px' : '21px'})`, width: `calc(${detail.quoteData.newWidths[index] * screen / detail.quoteData.mCalc}px )`, backgroundColor: 'white', padding: '3px',marginTop: detail.quoteData.boxTop === 'on' ? '0px' : '5px', marginRight: index === detail.quoteData.numSecondInnerBoxes - 1 ? '5px' : '2.5px',marginLeft: index === 0 ? '5px' : '2.5px', border: '1px solid #333',position: 'relative',boxSizing: 'border-box',}}>
                                 <div style={{
                                   width: '100%',
                                   height: '100%',
                                   border: '1px solid #333',
                                   backgroundColor: detail.quoteData.boxColors[index],
                                   position:'relative'
                                 }}>
                                 {/* Inner corner lines start */} 
                                  <div key={index} style={{ height: detail.quoteData.boxBottom === 'on'?'11px':'15px', width: '1px', float: 'left', marginTop: `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen) / detail.quoteData.mCalc}px - ${detail.quoteData.boxTop === 'on' ? '42px' : '36px'})`, marginLeft:detail.quoteData.boxBottom === 'on'?'-4px':'-6px', transform: 'rotate(45deg)', borderLeft: '1px solid grey' }}></div>
                                  <div key={index} style={{ height:detail.quoteData.boxTop === 'on'?'11px':'15px', width: '1px', float: 'left', marginTop:detail.quoteData.boxTop === 'on'?'-9px':'-14px', marginLeft:detail.quoteData.boxTop === 'on'?'-4px':'-6px', transform: 'rotate(-45deg)', borderLeft: '1px solid grey' }}></div>
                                  <div style={{ height: detail.quoteData.boxTop === 'on'?'11px':'15px', width: '1px', float: 'right', marginTop:detail.quoteData.boxTop === 'on'?'-9px':'-14px', marginRight:detail.quoteData.boxTop === 'on'?'-4px':'-6px', transform: 'rotate(45deg)', borderRight: '1px solid grey' }}></div>
                                  {/* <div style={{ height: '15px', width: '1px', float: 'left', marginTop: getInnerBottom(detail.quoteData.boxHeight - topnewHeights - bottomnewHeights, screen, detail.quoteData.mCalc), marginLeft: '-4px', transform: 'rotate(-45deg)', borderLeft: index === 0 ? 'transparent' : '1px solid black' }}></div> */}
                                  <div style={{ height: detail.quoteData.boxBottom === 'on'?'11px':'15px', width: '1px', float: 'right', marginTop: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc}px - ${detail.quoteData.boxTop === 'on' ? '43px' : '37px'})`, marginRight:detail.quoteData.boxBottom==='on'?'-4px':'-6px', transform: 'rotate(-45deg)', borderLeft: '1px solid grey' }}></div>
                                  <div style={{ height: '10px', width: '1px', float: 'right', marginTop: `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen) / detail.quoteData.mCalc}px - ${detail.quoteData.boxBottom === 'on' ? '33px' : '27px'})`, marginRight: '-4px', transform: 'rotate(-45deg)', borderRight: index === -1 ? '1px solid grey' : 'none' }}></div>
                                  {/* <div style={{ height: '7px', width: '1px', float: 'left', right: '0px', marginTop: '-6px', marginRight: '-1px', background: index === 0 ? 'transparent' : 'black' }}></div> */}
                                 {/* Inner corner lines ends */} 
                                 {detail.quoteData.boxBottom==='on'?      
                                 <>
                                  <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen) / detail.quoteData.mCalc}px - ${detail.quoteData.boxBottom === 'on' ? '33px' : '27px'})`, marginRight: '-7px', transform: 'rotate(180deg)', background: index === detail.quoteData.newWidths.length -1  ? 'black' : 'transparent' }}></div>
                                  <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen) / detail.quoteData.mCalc}px - ${detail.quoteData.boxBottom === 'on' ? '33px' : '27px'})`, marginLeft: '-7px', transform: 'rotate(180deg)', background: index === 0 ? 'black' : 'transparent' }}></div>
                                  </>:
                                 <></>}
                                 
                                 
                                   {/* {detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.grill === 'yes' && <div style={{ position:"absolute",width:'100%'}}>{ createGrill(detail.quoteData.boxHeight, detail.quoteData.topnewHeights, detail.quoteData.bottomnewHeights, detail.quoteData.mCalc)}</div>} */}

        

                                 {
                                   detail.quoteData.boxNames[index] === 'Shutter' ? (
                                     detail.quoteData.boxHandle[index] === 'left' ? (
                                       <>
                                         {/* Left Handle and Right Arrow */}
                                          <img
                                           src={left}
                                           style={{
                                             float: 'left',
                                             marginTop: `calc(${(((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc) / 2)}px - ${screen === 40 ? '28px':'25px'}`,
                                             marginLeft: '-5px',
                                             width: screen === 40 ? '13px' : '8px'
                                           }}
                                          
                                           alt="Left Handle"
                                         />
                                         {/* dotted line start */}
                                         <div style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', zIndex: 1, overflow: 'hidden' }}>
                       
                                            {/* Line from center to top-right */}
                                            <div style={{ position: 'absolute', top: '50%', right: '0', width: '2px', height: '200%', borderLeft: '1px dashed gray', transform: `rotate(${(detail.quoteData.boxTop === 'on' || detail.quoteData.boxBottom === 'on' ? -1 : 0) + 90 + Math.acos((2 * (detail.quoteData.newWidths[index]/2)) / Math.sqrt(4 * (detail.quoteData.newWidths[index]/2) * (detail.quoteData.newWidths[index]/2) + (detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights)/2 * (detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights)/2)) * (180 / Math.PI)+detail.quoteData.numSecondInnerBoxes}deg)`, transformOrigin: 'top right' }}></div>
                                            {/* Line from center to bottom-right */}
                                            <div style={{ position: 'absolute', bottom: '50%', right: '0', width: '2px', height: '200%', borderLeft: '1px dashed gray', transform: `rotate(-${(detail.quoteData.boxTop === 'on' || detail.quoteData.boxBottom === 'on' ? -1 : 0) + 90 + Math.acos((2 * (detail.quoteData.newWidths[index]/2)) / Math.sqrt(4 * (detail.quoteData.newWidths[index]/2) * (detail.quoteData.newWidths[index]/2) + ((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights)/2) * ((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights)/2))) * (180 / Math.PI)+detail.quoteData.numSecondInnerBoxes}deg)`, transformOrigin: 'bottom right' }}></div>
                                          </div>
                                          {/* dotted line end */}
                                        </>
                                      ) : (
                                        <>
                                           <img
                                            src={right}
                                            style={{
                                              float: 'right',
                                              marginTop: `calc(${(((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc) / 2)}px - ${screen === 40 ? '28px':'25px'}`,
                                              marginRight: '-5px',
                                              width: screen === 40 ? '13px' : '8px'
                                            }}
                  
                                            alt="Right Handle"
                                          /> 
                                          <div style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', zIndex: 1, overflow: 'hidden' }}>

                                            {/* Line from center to top-left */}
                                            <div style={{ position: 'absolute', top: '50%', left: '0', width: '2px', height: '150%', borderLeft: '1px dashed gray', transform: `rotate(-${(detail.quoteData.boxTop === 'on' || detail.quoteData.boxBottom === 'on' ? -1 : 0) + 90 + Math.acos((2 * (detail.quoteData.newWidths[index] / 2)) / Math.sqrt(4 * (detail.quoteData.newWidths[index] / 2) * (detail.quoteData.newWidths[index] / 2) + ((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) / 2) * ((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) / 2))) * (180 / Math.PI)+detail.quoteData.numSecondInnerBoxes}deg)`, transformOrigin: 'top left' }}></div>


                                            {/* Line from center to bottom-left */}
                                            <div style={{ position: 'absolute', bottom: '50%', left: '0', width: '2px', height: '150%', borderLeft: '1px dashed gray', transform: `rotate(${(detail.quoteData.boxTop === 'on' || detail.quoteData.boxBottom === 'on' ? -1 : 0) + 90 + Math.acos((2 * (detail.quoteData.newWidths[index]/2)) / Math.sqrt(4 * (detail.quoteData.newWidths[index]/2) * (detail.quoteData.newWidths[index]/2) + ((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights)/2) * ((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights)/2))) * (180 / Math.PI)+detail.quoteData.numSecondInnerBoxes}deg)`, transformOrigin: 'bottom left' }}></div></div>

                                        </>
                                      )
                                    ) : (
                                      <>
                                        {/* Plus Icon in Center */}
                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '50px', fontWeight: '100', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>

                                      </>
                                    )
                                  }



                                  {detail.quoteData.mesh === 'yes' && detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.boxHandle[index] === 'left' && (
                                    <img src={meshimg} style={{ position: 'absolute', left: 0,width: screen === 3 ? '40px' : '15px', float: 'left',  marginTop: screen === 3 ? `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc)}px - ${detail.quoteData.boxTop === 'on' ? '72px' : '57px'} )` : `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc)}px - 50px)` }} />
                                           
                                  )}

                                  {detail.quoteData.mesh === 'yes' && detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.boxHandle[index] === 'right' && (
                                     <img src={meshimg} style={{ width: screen === 3 ? '40px' : '15px', float: 'left', marginLeft: screen === 3 ? detail.quoteData.boxHandle[index] === 'right' ? '-1px' : '0px' : detail.quoteData.boxHandle[index] === 'right' ? '0px' : 'px', marginTop: screen === 3 ? `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc)}px - ${detail.quoteData.boxTop === 'on' ? '72px' : '67px'} )` : `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc)}px - 50px)` }} />
                                             )}
                                      {detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.grill === 'yes' && boxes(detail.quoteData.mCalc, detail.quoteData.measure, detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights -0.5)}

                                    {/* {detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.grill === 'yes' && <div style={{position:'absolute',width: `calc(${(detail.quoteData.boxWidth/(detail.quoteData.shutterCount + detail.quoteData.fixedCount))*screen}px - ${(detail.quoteData.shutterCount + detail.quoteData.fixedCount) === 1 ? '32px' : (detail.quoteData.shutterCount + detail.quoteData.fixedCount) === 2 ? '28px' : (detail.quoteData.shutterCount + detail.quoteData.fixedCount) === 3 ? '24px' : '23px'})`}}>{createGrill((parseFloat(detail.quoteData.boxHeight)), detail.quoteData.topnewHeights, detail.quoteData.bottomnewHeights, detail.quoteData.mCalc)}</div>} */}
          
                                </div>
                                 </div> 

                              ))}

                            </div>

                             {detail.quoteData.boxBottom === 'on' && (
                                [...Array(detail.quoteData.numBottomBoxes)].map((_, index) => (
                                  <div style={{ display: 'flex', width: `calc(${detail.quoteData.boxWidth * screen / detail.quoteData.mCalc / detail.quoteData.numFrames + 'px'} - 20px)`, height: `calc(${(detail.quoteData.bottomnewHeights * screen / detail.quoteData.mCalc) + 'px'} -10px)`, margin: '5px',position:'relative' }}>
                                    {[...Array(detail.quoteData.bottomFixedNum)].map((_, index) => (
                                      <div style={{ flex: '1', backgroundColor:'white',padding:'4px',boxSizing:'border-box', width: `calc(${detail.quoteData.bottomFixedWidth[index] * screen / detail.quoteData.mCalc / detail.quoteData.numFrames + 'px'} - 18px)`, height: `calc(${(detail.quoteData.bottomnewHeights * screen / detail.quoteData.mCalc) + 'px'} - 5px)`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px',position:'relative' }}>
                                        <div style={{
                                          height:'100%',
                                          width:'100%',
                                          position:'relative',
                                          backgroundColor:detail.quoteData.bottomsash[index].type === 'fixed' ? 'lightgreen' : 'lightblue',
                                          border:'1px solid black'
                                        }}>
                            {/* inner corner lines start for bottom sash*/}
                            <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-6.5px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                            <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-6px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                            <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${detail.quoteData.bottomnewHeights*screen/detail.quoteData.mCalc}px - 18px)`, marginRight: '-4px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                            <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${detail.quoteData.bottomnewHeights*screen/detail.quoteData.mCalc}px - 18px)`, marginLeft: '-3px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>
                            {/* inner corner lines end */}
                             {/* outer corner lines start for bottom sash*/}
                             {/* <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-13px', marginRight: '-9px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                            <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-12px', marginLeft: '-9px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>*/}
                            <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${detail.quoteData.bottomnewHeights*screen/detail.quoteData.mCalc}px - 12px)`, marginRight: '-11px', transform: 'rotate(-45deg)',background: index === detail.quoteData.bottomsash.length -1 ? 'black' : 'transparent' }}></div>
                            <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${detail.quoteData.bottomnewHeights*screen/detail.quoteData.mCalc}px - 12px)`, marginLeft: '-9px', transform: 'rotate(45deg)', background: index === 0 ? 'black' : 'transparent'  }}></div> 
                            {/* outer corner lines end */}
                            {/* <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${detail.quoteData.boxHeight-topnewHeights*screen/detail.quoteData.mCalc}px - ${screen === 3 ? '28px':'24px'})`, marginRight: '-6px', transform: 'rotate(180deg)', background: index === bottomsash.length -1  ? 'black' : 'transparent' }}></div>
                            <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${detail.quoteData.boxHeight-topnewHeights*screen/detail.quoteData.mCalc}px - ${screen === 3 ? '28px':'24px'})`, marginLeft: '-6px', transform: 'rotate(180deg)', background: index === 0 ? 'black' : 'transparent' }}></div> */}
                        
                                        {detail.quoteData.bottomsash[index].type === 'shutter' ?(
                                          <>
                                          <img
                                            src={left}
                                            style={{
                                            float: 'left',
                                            marginTop: `calc(${(((detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc))}px - ${screen === 3 ? '28px':'25px'})`,
                                            marginLeft: '45%',
                                            width: screen === 40 ? '13px' : '8px',
                                            transform: 'rotate(-90deg)'
                                            }}
                    
                                            alt="Left Handle"
                                          />
                                            <div style={{ position: 'absolute', width: '100%', height: '100%',overflow:'hidden' }}>
                                               {/* Left Diagonal Line  */}
                                               <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(${Math.atan((detail.quoteData.bottomFixedWidth.length ? detail.quoteData.bottomFixedWidth[index] : detail.quoteData.boxWidth) / (2 * detail.quoteData.bottomnewHeights)) * (180 / Math.PI)+2.5}deg)`, transformOrigin: 'top left' }}></div>
                   
                   
                                               {/* Right Diagonal Line */}
                                               <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(-${Math.atan((detail.quoteData.bottomFixedWidth.length ? detail.quoteData.bottomFixedWidth[index] : detail.quoteData.boxWidth) / (2 * detail.quoteData.bottomnewHeights)) * (180 / Math.PI)+2.5}deg)`, transformOrigin: 'top left' }}></div>
                   
                                            </div>  

                                          {detail.quoteData.bottomsash[index].type === 'shutter' && detail.quoteData.grill === 'yes' && boxes(detail.quoteData.mCalc, detail.quoteData.measure, detail.quoteData.topnewHeights+0.1)}
                                        </>
                                        ):(
                                          <>
                                           {/* fixed plus  */}
                                           <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                          </>
                                        )                
                                        }     
                                      </div>
                                      </div>
           
                                    ))}
                                  </div>
          
                                ))
                              )}                     

                          </div>  
                        ))}
                        </div>
                       </div>


                     
                     </>


                   )}
                    {detail.quoteData.item === 'SlidingDoor' && (
                     <>
                       <div align="center" style={{ alignContent: 'center', alignItems: 'center', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>


                         <div style={{ float: 'left', width:( detail.quoteData.boxWidth) * screen /detail.quoteData.mCalc + 'px', height: detail.quoteData.boxHeight * screen /detail.quoteData.mCalc + 'px', border: '1px solid #333' }}>



                           {[...Array(detail.quoteData.numFrames)].map((_, index) => (
                             <div style={{ float: 'left', margin: '5px', border: '1px solid #333', width: `calc(${detail.quoteData.boxWidth * screen / detail.quoteData.mCalc / detail.quoteData.numFrames + 'px'} - 12px)`, height: `calc(${detail.quoteData.boxHeight * screen / detail.quoteData.mCalc + 'px'} - 12px)`, position:'relative' }}>
                                {/* outer corner lines start */}
                                <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-6.5px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                                <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-6px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                                <div style={{ height: '8px', width: '1px', float: 'right', marginTop: getOuterBottom(detail.quoteData.boxHeight, screen, detail.quoteData.mCalc), marginRight: '-4px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                                <div style={{ height: '8px', width: '1px', float: 'left', marginTop: getOuterBottom(detail.quoteData.boxHeight, screen, detail.quoteData.mCalc), marginLeft: '-3px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>
                                {/* outer corner lines end */} 

                               {detail.quoteData.boxTop === 'on' && (

                                 [...Array(detail.quoteData.numTopBoxes)].map((_, index) => (
                                   <div style={{ display: 'flex', width: `calc(${ detail.quoteData.boxWidth * screen  /detail.quoteData.mCalc/ detail.quoteData.numFrames + 'px'} - 23px)`, height: `calc(${(detail.quoteData.topnewHeights * screen/detail.quoteData.mCalc)}px )`, margin: '5px',position:'relative' }}>

                                     {[...Array(detail.quoteData.topFixedNum)].map((_, index) => (
                                       <div style={{ flex: '1', background: 'lightgreen', width: `calc(${detail.quoteData.topFixedWidth[index] * screen /detail.quoteData.mCalc/ detail.quoteData.numFrames + 'px'} - 18px)`, height: `calc(${(detail.quoteData.topnewHeights * screen/detail.quoteData.mCalc)}px )`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px',position:'relative' }}>
                                       {/* outer corner lines start for bottom sash*/}
                                       <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-7px', marginRight: '-4px', transform: 'rotate(45deg)',  background: (detail.quoteData.topFixedWidth.length === 0 && detail.quoteData.boxTop === 'on') || index === detail.quoteData.topFixedWidth.length - 1  ? 'black' : 'transparent'}}></div>
                                       <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-7px', marginLeft: '-4px', transform: 'rotate(-45deg)', background: index === 0 ? 'black' : 'transparent'}}></div>  
                                           
                                       {/* fixed plus  */}
                                       <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>

                                       </div>
                                     ))}
                                   </div>
                                 ))
                               )}

                               <div style={{ display: 'flex' }}>
                                 {[...Array(detail.quoteData.numSecondInnerBoxes)].map((_, index) => (

                              <div key={index} style={{ background: detail.quoteData.split === 'on' ? 'transparent': detail.quoteData.panelType === 1 ? 'lightgray' : detail.quoteData.panelType === 2 ? 'lightyellow' : 'lightblue', border: detail.quoteData.split === 'on' ? '0px' : '1px solid #333', height: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc}px - ${detail.quoteData.boxTop === 'on' ? '30px' : '25px'})`, width: `calc(${detail.quoteData.newWidths[index] * screen / detail.quoteData.mCalc}px )`, marginTop: detail.quoteData.boxTop === 'on' ? '0px' : '5px', marginRight: index === detail.quoteData.numSecondInnerBoxes - 1 ? '5px' : '2.5px', marginLeft: index === 0 ? '5px' : '2.5px', position:'relative' }}>

                                {/* Inner corner lines start */} 
                                <div style={{ height: '10px', width: '1px', float: 'left', marginTop: `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen) / detail.quoteData.mCalc}px - ${detail.quoteData.boxTop === 'on' ? '31px' : '27px'})`, marginLeft: '-4px', transform: 'rotate(45deg)', borderLeft: index === 0 ? '1px solid black' : 'none' }}></div>
                               <div style={{ height: '10px', width: '1px', float: 'left', marginTop: '-7px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: index === 0 ? '1px solid black' : 'none' }}></div>
                                <div style={{ height: '8px', width: '1px', float: 'right', marginTop: '-7px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                                <div style={{ height: '9px', width: '1px', float: 'left', marginTop: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc}px - ${detail.quoteData.boxTop === 'on' ? '33px' : '27px'})`, marginLeft: '-4px', transform: 'rotate(-45deg)', borderLeft: index === 0 ? 'transparent' : '1px solid black' }}></div>
                                <div style={{ height: '9px', width: '1px', float: 'right', marginTop: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc}px - ${detail.quoteData.boxTop === 'on' ? '33px' : '27px'})`, marginRight: '-2px', transform: 'rotate(-45deg)', borderLeft: index === detail.quoteData.numSecondInnerBoxes - 1 ? '1px solid black' : 'transparent' }}></div>
                                 <div style={{ height: '7px', width: '1px', float: 'left', right: '0px', marginTop: '-6px', marginRight: '-1px', background: index === 0 ? 'transparent' : 'black' }}></div>
                                 {/* Inner corner lines ends */}   
                                 <div style={{
                                  position:'absolute',
                                  height:'7px',
                                  width: '1px',
                                  float: 'right',
                                  right: '0px',
                                  marginTop: '-6px',
                                  marginRight: '-1px',
                                  background: index === detail.quoteData.numSecondInnerBoxes.length-1 ? 'black' : 'transparent',
                                  }}></div>

                                <div style={{
                                  height:'7px',
                                  width: '1px',
                                  float: 'left',
                                  right: '0px',
                                  marginTop: `calc(${(detail.quoteData.boxHeight-detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.boxTop === 'on' ? '31px' : '26px' } )`,
                                  marginRight: '-1px',
                                  background: (index === 0 || index === detail.quoteData.numSecondInnerBoxes.length - 1) ? 'transparent' : 'black',
                                  }}></div>  
                                  


                           {/* {detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.grill === 'yes' && createGrill((parseFloat(detail.quoteData.boxHeight)+0.7), detail.quoteData.topnewHeights, detail.quoteData.bottomnewHeights, detail.quoteData.mCalc)} */}
 
                                {detail.quoteData.boxNames[index] === 'Shutter' ? (
                                
                                  detail.quoteData.boxHandle[index] === 'left' ? (
                                    <>
                                   
                                      {/* Show left handle only for first box */}
                                      {index === 0 && (
                                        <img
                                          src={Handle}
                                          style={{
                                            float: 'left',
                                            marginTop: `calc(${(((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc) / 2)}px - 15px`,
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
                                          paddingLeft: `calc(${(detail.quoteData.newWidths[index] / 8 * screen / detail.quoteData.mCalc)}px)`,
                                          position: 'relative',
                                          float: 'left',
                                          width: `calc(${(detail.quoteData.newWidths[index] / 2 * screen / detail.quoteData.mCalc)}px)`,
                                          top: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) / 2 * screen / detail.quoteData.mCalc}px)`,
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
                                      {index === detail.quoteData.numSecondInnerBoxes - 1 && (
                                        <img
                                          src={Handle}
                                          style={{
                                            float: 'right',
                                            marginTop: `calc(${(((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc) / 2)}px - 15px`,
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
                                          paddingRight: `calc(${(detail.quoteData.newWidths[index] / 8 * screen / detail.quoteData.mCalc)}px)`,
                                          position: 'relative',
                                          float: 'right',
                                          width: `calc(${(detail.quoteData.newWidths[index] / 2 * screen / detail.quoteData.mCalc)}px)`,
                                          top: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) / 2 * screen / detail.quoteData.mCalc}px)`,
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

                              {detail.quoteData.mesh === 'yes' && detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.boxHandle[index] === 'left' && (
                                  <img src={meshimg} style={{ width: screen === 3 ? '40px' : '20px', float: 'left', marginLeft: screen === 3 ? detail.quoteData.boxHandle[index] === 'left' ? '-15px' : '0px' : detail.quoteData.boxHandle[index] === 'left' ? '-10px' : 'px', marginTop: screen === 3 ? `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc)}px - ${detail.quoteData.boxTop === 'on' ? '72px' : '67px'} )` : `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc)}px - 45px)` }} />
                                )}

                                {detail.quoteData.mesh === 'yes' && detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.boxHandle[index] === 'right' && (
                                  <img src={meshimg} style={{ width: screen === 3 ? '40px' : '20px', float: 'left', marginLeft: screen === 3 ? detail.quoteData.boxHandle[index] === 'right' ? '-1px' : '0px' : detail.quoteData.boxHandle[index] === 'right' ? '0px' : 'px', marginTop: screen === 3 ? `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc)}px - ${detail.quoteData.boxTop === 'on' ? '72px' : '67px'} )` : `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc)}px - 45px)` }} />
                                )}
                                {detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.grill === 'yes' && <div style={{position:"absolute",width:'100%'}}>{boxes(detail.quoteData.mCalc, detail.quoteData.measure, detail.quoteData.boxHeight -detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights -0.5)}</div>}
                                    


                                   

                                     
                               {detail.quoteData.split === 'on' && 
                                  <>
                                    <div style={{background: detail.quoteData.shutterHeight[index].top === 'glass' ? 'lightblue' : detail.quoteData.shutterHeight[index].top === 'panel' ? 'lightgrey' : 'lightyellow', width: `calc(${detail.quoteData.newWidths[index] * screen / detail.quoteData.mCalc}px - 16 px)`, height: `calc(${(detail.quoteData.shutterHeight[index].height ) * screen / detail.quoteData.mCalc}px - 15px`, border: '1px solid #333' }}></div>
                                    <div style={{background: detail.quoteData.shutterHeight[index].bottom === 'glass' ? 'lightblue' : detail.quoteData.shutterHeight[index].bottom === 'panel' ? 'lightgrey' : 'lightyellow', width: `calc(${detail.quoteData.newWidths[index] * screen / detail.quoteData.mCalc}px - 16 px)`, height: `calc(${(detail.quoteData.boxHeight - detail.quoteData.shutterHeight[index].height-detail.quoteData.topnewHeights) * screen / detail.quoteData.mCalc}px - ${detail.quoteData.boxTop==='on'?'19px':'15px'})`, border: '1px solid #333', marginTop: '5px' }}></div>
                                  </>
                                }
                              {/* {detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.grill === 'yes' && boxes(detail.quoteData.boxHeight-detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights + 0.5)} */}

                               

                              

                                   </div>

                                 ))}

                               </div>





                             </div>
                           ))}
                         </div>


                       </div>
                      
                     </>


                   )}
                 {detail.quoteData.item === 'SlidingWindow' && (
               
                                    <>
                                      <div align="center" style={{ alignContent: 'center', alignItems: 'center', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
               
                                     <div style={{ float: 'left',boxShadow: '1px 1px 5px grey', width: detail.quoteData.boxWidth * screen / detail.quoteData.mCalc + 'px', height: detail.quoteData.boxHeight * screen / detail.quoteData.mCalc + 'px', border: '1px solid #333' }}>
               
               
               
                                          {[...Array(detail.quoteData.numFrames)].map((_, index) => (
                                           <div style={{ float: 'left', margin: '5px', border: '1px solid #333', width: `calc(${detail.quoteData.boxWidth * screen / detail.quoteData.mCalc / detail.quoteData.numFrames + 'px'} - 12px)`, height: `calc(${detail.quoteData.boxHeight * screen / detail.quoteData.mCalc + 'px'} - 12px)` , position:'relative' }}>
                                             {/* outer corner lines start */}
                                             <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-6.5px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                                             <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-6px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                                             <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${detail.quoteData.boxHeight * screen/detail.quoteData.mCalc}px - 15px)`, marginRight: '-4px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                                             <div style={{ height: '8px', width: '1px', float: 'left', marginTop: `calc(${detail.quoteData.boxHeight * screen/detail.quoteData.mCalc}px - 15px)`, marginLeft: '-3px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>
                                             {/* outer corner lines end */}
               
               
                                              {detail.quoteData.boxTop === 'on' && (
               
                                                [...Array(detail.quoteData.numTopBoxes)].map((_, index) => (
                                                  <div style={{ display: 'flex',position:'relative', width: `calc(${ detail.quoteData.boxWidth * screen / detail.quoteData.mCalc/ detail.quoteData.numFrames + 'px'} - 23px)`, height: `calc(${(detail.quoteData.topnewHeights * screen/detail.quoteData.mCalc)}px )`, margin: '5px' }}>
                                                    {[...Array(detail.quoteData.topFixedNum)].map((_, index) => (
                                                     <div style={{ flex: '1', background: detail.quoteData.topsash[index].type === 'fixed' ? 'lightgreen' : 'lightblue', width: `calc(${detail.quoteData.topFixedWidth[index] * screen / detail.quoteData.mCalc / detail.quoteData.numFrames + 'px'} - 18px)`, height: `calc(${(detail.quoteData.topnewHeights * screen / detail.quoteData.mCalc)}px )`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px',position:'relative' }}>
                                                       {/* outer corner lines start for bottom sash*/}
                                                       <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-7px', marginRight: '-4px', transform: 'rotate(45deg)',  background: index === detail.quoteData.topsash.length -1  ? 'black' : 'transparent'}}></div>
                                                       <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-7px', marginLeft: '-4px', transform: 'rotate(-45deg)', background: index === 0 ? 'black' : 'transparent'}}></div>
                                                      
                                                       
                                                        {detail.quoteData.topsash[index].type ==="shutter" ? (
                                                         <>
                                                        <img
                                                      src={left}
                                                      style={{
                                                      float: 'left',
                                                      marginTop: `calc(${detail.quoteData.topnewHeights * screen / detail.quoteData.mCalc}px - 25px)`,
                                                      marginLeft: '45%',
                                                      width: screen === 3 ? '13px' : '8px',
                                                      transform: 'rotate(-90deg)'
                                                      }}
                                                      
                                                      
                                                    />
                                                     <div style={{ position: 'absolute', width: '100%', height: '100%',overflow:'hidden' }}>
                                                        {/* Left Diagonal Line  */}
                                                          <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(${Math.atan((detail.quoteData.topFixedWidth.length ? detail.quoteData.topFixedWidth[index] : detail.quoteData.boxWidth) / (2 * detail.quoteData.topnewHeights)) * (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>
                                                       
                                                       
                                                        {/* Right Diagonal Line */}
                                                        <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(-${Math.atan((detail.quoteData.topFixedWidth.length ? detail.quoteData.topFixedWidth[index] : detail.quoteData.boxWidth) / (2 * detail.quoteData.topnewHeights))* (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>
                                                       
                                                        </div>
                                             
                                                         {/* {detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.grill === 'yes' && <div style={{ position:'absolute',width:'100%'}}>{createGrill(detail.quoteData.topnewHeights,  detail.quoteData.mCalc)}</div>} */}
                                                       {detail.quoteData.topsash[index].type === 'shutter' && detail.quoteData.grill === 'yes' && boxes(detail.quoteData.mCalc, detail.quoteData.measure, detail.quoteData.topnewHeights + 0.3)}
s
                                                          </>
                                                           )
                                                           :(
                                                            <>
                                                           {/* fixed plus  */}
                                                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                                             </>
                                                             )}
               
                                                      </div>
                                                    ))}
                                                  </div>
                                                ))
                                              )}
               
                                              <div style={{ display: 'flex' }}>
                                                {[...Array(detail.quoteData.numSecondInnerBoxes)].map((_, index) => (
               
                                                  <div key={index} style={{ position: 'relative', height: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.boxTop === 'on' ? '30px' : '25px'})`, width: `calc(${detail.quoteData.newWidths[index] * screen/detail.quoteData.mCalc}px )`, backgroundColor: detail.quoteData.boxColors[index] || 'lightblue', marginTop: detail.quoteData.boxTop === 'on' ? '0px' : '3px', marginRight: index === detail.quoteData.numSecondInnerBoxes - 1 ? '5px' : '2.5px', marginLeft: index === 0 ? '5px' : '2.5px', border: '1px solid #333' }}>
                                                     {/* Inner corner lines start */} 
                                                     <div key={index} style={{ height: '10px', width: '1px', float: 'left', marginTop: `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen) / detail.quoteData.mCalc}px - ${detail.quoteData.boxTop === 'on' ? '33px' : '27px'})`, marginLeft: '-5px', transform: 'rotate(45deg)', borderLeft: index === 0 ? '1px solid black' : 'none' }}></div>
                                                      <div key={index} style={{ height: '10px', width: '1px', float: 'left', marginTop: '-7px', marginLeft: '-4px', transform: 'rotate(-45deg)', borderLeft: index === 0 ? '1px solid black' : 'none' }}></div>
                                                      <div style={{ height: '8px', width: '1px', float: 'right', marginTop: '-7px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                                                      <div style={{ height: '9px', width: '1px', float: 'left', marginTop: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc}px - ${detail.quoteData.boxTop === 'on' ? '33px' : '27px'})`, marginLeft: '-4px', transform: 'rotate(-45deg)', borderLeft: index === 0 ? 'transparent' : '1px solid black' }}></div>
                                                      <div style={{ height: '9px', width: '1px', float: 'right', marginTop: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc}px - ${detail.quoteData.boxTop === 'on' ? '33px' : '27px'})`, marginRight: '-4px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                                                      <div style={{ height: '10px', width: '1px', float: 'right', marginTop: `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen) / detail.quoteData.mCalc}px - ${detail.quoteData.boxBottom === 'on' ? '33px' : '27px'})`, marginRight: '-4px', transform: 'rotate(-45deg)', borderRight: index === -1 ? '1px solid black' : 'none' }}></div>
                                                      <div style={{ height: '7px', width: '1px', float: 'left', right: '0px', marginTop: '-6px', marginRight: '-1px', background: index === 0 ? 'transparent' : 'black' }}></div>
                                                      {/* Inner corner lines ends */} 
                                                <div style={{
                                                 position:'absolute',
                                                 height:'7px',
                                                 width: '1px',
                                                 float: 'right',
                                                 right: '0px',
                                                 marginTop: '-6px',
                                                 marginRight: '-1px',
                                                 background: index === detail.quoteData.numSecondInnerBoxes.length - 1 ? 'black' : 'transparent',
                                                 }}></div>
               
                                               <div style={{
                                                 height:'7px',
                                                 width: '1px',
                                                 float: 'left',
                                                 right: '0px',
                                                 marginTop: `calc(${(detail.quoteData.boxHeight-detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.boxTop === 'on' ? '31px' : '26px' } )`,
                                                 marginRight: '-1px',
                                                 background: (index === 0 || index === detail.quoteData.numSecondInnerBoxes.length - 1) ? 'transparent' : 'black',
                                                 }}></div> 
               
               
                                                {/* {detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.grill === 'yes' && <div style={{position:'absolute',width:'100%'}}>{createGrill(detail.quoteData.boxHeight, detail.quoteData.topnewHeights, detail.quoteData.bottomnewHeights, detail.quoteData.mCalc)}</div>} */}
               
                                              {detail.quoteData.boxNames[index] === 'Shutter' ? (
                                               
                                                  detail.quoteData.boxHandle[index] === 'left' ? (
                                                    <>
                                                      {/* Show left handle only for first box */}
                                                      {index === 0 && (
                                                        <img
                                                          src={Handle}
                                                          style={{
                                                            float: 'left',
                                                            marginTop: `calc(${(((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc) / 2)}px - 15px`,
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
                                                          paddingLeft: `calc(${(detail.quoteData.newWidths[index] / 8 * screen / detail.quoteData.mCalc)}px)`,
                                                          position: 'relative',
                                                          float: 'left',
                                                          width: `calc(${(detail.quoteData.newWidths[index] / 2 * screen / detail.quoteData.mCalc)}px)`,
                                                          top: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) / 2 * screen / detail.quoteData.mCalc}px)`,
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
                                                      {index === detail.quoteData.numSecondInnerBoxes - 1 && (
                                                        <img
                                                          src={Handle}
                                                          style={{
                                                            float: 'right',
                                                            marginTop: `calc(${(((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc) / 2)}px - 15px`,
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
                                                          paddingRight: `calc(${(detail.quoteData.newWidths[index] / 8 * screen / detail.quoteData.mCalc)}px)`,
                                                          position: 'relative',
                                                          float: 'right',
                                                          width: `calc(${(detail.quoteData.newWidths[index] / 2 * screen / detail.quoteData.mCalc)}px)`,
                                                          top: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) / 2 * screen / detail.quoteData.mCalc}px)`,
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
               
                                                {detail.quoteData.mesh === 'yes' && detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.boxHandle[index] === 'left' && (
                                                  <img src={meshimg} style={{position:'absolute',left:0, width: screen === 3 ? '40px' : '20px', float: 'left',  marginTop: screen === 3 ? `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc)}px - ${detail.quoteData.boxTop === 'on' ? '72px' : '67px'} )` : `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc)}px - 51px)` }} />
                                                   )}
                                                
                                                 {detail.quoteData.mesh === 'yes' && detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.boxHandle[index] === 'right' && (
                                                   <img src={meshimg} style={{ width: screen === 3 ? '40px' : '20px', float: 'left', marginLeft: screen === 3 ? detail.quoteData.boxHandle[index] === 'right' ? '-1px' : '0px' : detail.quoteData.boxHandle[index] === 'right' ? '0px' : 'px', marginTop: screen === 3 ? `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc)}px - ${detail.quoteData.boxTop === 'on' ? '72px' : '67px'} )` : `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc)}px - 51px)` }} />
                                                  )}
               
                                                 {detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.grill === 'yes' && boxes(detail.quoteData.mCalc, detail.quoteData.measure, detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights -0.5)}

                                                  </div>
               
                                                ))}
               
                                              </div>
               
               
                                              {detail.quoteData.boxBottom === 'on' && (
                                                [...Array(detail.quoteData.numBottomBoxes)].map((_, index) => (
                                                  <div style={{ display: 'flex', width: `calc(${ detail.quoteData.boxWidth * screen /detail.quoteData.mCalc/ detail.quoteData.numFrames + 'px'} - 23px)`, height: `calc(${(detail.quoteData.bottomnewHeights * screen/ detail.quoteData.mCalc) + 'px'} -10px)`, margin: '5px' }}>
                                                    {[...Array(detail.quoteData.bottomFixedNum)].map((_, index) => (
                                                      <div style={{ flex: '1', background: detail.quoteData.bottomsash[index].type === 'fixed' ? 'lightgreen' : 'lightblue', width: `calc(${detail.quoteData.bottomFixedWidth[index] * screen /detail.quoteData.mCalc/ detail.quoteData.numFrames + 'px'} - 18px)`, height: `calc(${(detail.quoteData.bottomnewHeights * screen/detail.quoteData.mCalc) + 'px'} - 5px)`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '3px',position:'relative' }}>
                                                         {/* outer corner lines start for bottom sash*/}
                                                         <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${detail.quoteData.bottomnewHeights*screen/detail.quoteData.mCalc}px - 7px)`, marginRight: '-3px', transform: 'rotate(-45deg)',background: index === detail.quoteData.bottomsash.length -1 ? 'black' : 'transparent' }}></div>
                                                         <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${detail.quoteData.bottomnewHeights*screen/detail.quoteData.mCalc}px - 7px)`, marginLeft: '-3px', transform: 'rotate(45deg)', background: index === 0 ? 'black' : 'transparent'  }}></div> 
                                                         {/* outer corner lines end */}
                                                        {detail.quoteData.bottomsash[index].type === 'shutter' ?
                                                  <>
                                                    <img
                                                      src={left}
                                                      style={{
                                                      float: 'left',
                                                      marginTop: `calc(${detail.quoteData.topnewHeights * screen / detail.quoteData.mCalc}px - 18px)`,
                                                      marginLeft: '45%',
                                                      width: '5px',
                                                      transform: 'rotate(-90deg)'
                                                      }}
                                                      
                                                    />
                                                      <div style={{ position: 'absolute', width: '100%', height: '100%',overflow:'hidden' }}>
                                                        {/* Left Diagonal Line  */}
                                                          <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(${Math.atan((detail.quoteData.bottomFixedWidth.length ? detail.quoteData.bottomFixedWidth[index] : detail.quoteData.boxWidth) / (2 * detail.quoteData.bottomnewHeights)) * (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>
                                                       
                                                       
                                                        {/* Right Diagonal Line */}
                                                        <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(-${Math.atan((detail.quoteData.bottomFixedWidth.length ? detail.quoteData.bottomFixedWidth[index] : detail.quoteData.boxWidth) / (2 * detail.quoteData.bottomnewHeights))* (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>
                                                       
                                                        </div>
                                                         {/* {detail.quoteData.topsash[index].type === 'shutter' && detail.quoteData.grill === 'yes' && boxes(detail.quoteData.bottomnewHeights + 0.5)} */}
               
                                                   {detail.quoteData.bottomsash[index].type === 'shutter' && detail.quoteData.grill === 'yes' && boxes(detail.quoteData.mCalc, detail.quoteData.measure, detail.quoteData.bottomnewHeights + 0.3)}

                                                  </>:
                                                  <>
                                                   {/* fixed plus  */}
                                                   <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                                    </>                
                                                  }               
                                                      </div>
                                                    ))}
                                                  </div>
                                                ))
                                              )}             
               
                                            </div>
                                          ))}
                                        </div>
                             
                                      </div>                                     
                                    </>               
                                  )}

                 {detail.quoteData.item === 'Ventilator' && (
                      <>                         
                         {detail.quoteData.boxHeight > 1 && detail.quoteData.boxWidth > 1 && (

                         detail.quoteData.fan === 'on' ? (  
                          <>

                         <div style={{float:'left',boxShadow: '1px 1px 5px grey', width: detail.quoteData.boxWidth*screen/detail.quoteData.mCalc+'px', height:detail.quoteData.boxHeight*screen/detail.quoteData.mCalc+'px', border:'1px solid #333',position:'relative'}}>
                           {/* outer corner lines start */}
                             <div style={{ position:'absolute',height: '7px', width: '1px', float: 'left', marginTop: '-1.5px', marginLeft: `calc(${(detail.quoteData.boxWidth)*screen}px - 4px)`, transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                             <div style={{ position:'absolute',height: '8px', width: '1px', float: 'left', marginTop: '-1px', marginLeft: '3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                             <div style={{ position:'absolute',height: '7px', width: '1px', float: 'right', marginTop: `calc(${detail.quoteData.boxHeight*screen}px - 8px)`, marginLeft:  `calc(${(detail.quoteData.boxWidth)*screen}px - 4px)`, transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                             <div style={{ position:'absolute',height: '7px', width: '1px', float: 'left', marginTop: `calc(${detail.quoteData.boxHeight*screen}px - 8px)`, marginLeft: '1px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>
                             {/* outer corner lines end */}
                              {/* Inner corner lines start */}
                              {/* <div style={{ position:'absolute',height: '7px', width: '1px', float: 'left', marginTop: '3.5px', marginLeft: `calc(${(detail.quoteData.boxWidth)*screen}px - 10px)`, transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                             <div style={{ position:'absolute',height: '8px', width: '1px', float: 'left', marginTop: '4.5px', marginLeft: '10px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                             <div style={{ position:'absolute',height: '7px', width: '1px', float: 'right', marginTop: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc}px - ${detail.quoteData.boxTop === 'on' ? '33px' : '27px'})`, transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                             <div style={{ position:'absolute',height: '7px', width: '1px', float: 'left', marginTop: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc}px - ${detail.quoteData.boxTop === 'on' ? '33px' : '27px'})`, marginLeft: '7px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div> */}
                             {/* Inner corner lines end */}
                            {detail.quoteData.topsash  && detail.quoteData.topsash?.length > 0 && (
     
                           <div style={{ display: 'flex', width: `calc(${detail.quoteData.boxWidth * screen/detail.quoteData.mCalc + 'px'} - 10px)`, height: `calc(${(detail.quoteData.topnewHeights * screen/detail.quoteData.mCalc)}px )`, marginTop: '4px', marginLeft: '4px' }}>
                                {detail.quoteData.topsash?.map((_, index) => (
                                 <div style={{ flex: 1, background: detail.quoteData.topsash[index].type === 'fixed' ? 'lightgreen' : 'lightblue', width: `calc(${(detail.quoteData.boxWidth/detail.quoteData.topsash.length) * screen/detail.quoteData.mCalc + 'px'} - 28px)`, height: `calc(${(detail.quoteData.topnewHeights * screen/detail.quoteData.mCalc)}px )`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px',position:'relative' }}>
                                 {detail.quoteData.topsash[index].type === 'shutter' ?(
                                 <>
                                   <img
                                     src={left}
                                     style={{
                                       float: 'left',
                                       marginTop: `calc(${(((detail.quoteData.topnewHeights) * screen/detail.quoteData.mCalc))}px - 15px)`,
                                       marginLeft: '45%',
                                       width: screen === 3 ? '13px' : '8px',
                                       transform: 'rotate(-90deg)'
                                     }}
                                     alt="Left Handle"
                                   />
                                   <div style={{ position: 'absolute', width: '100%', height: '100%',overflow:'hidden' }}>
                                     {/* Left Diagonal Line  */}
                                       <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(${Math.atan((detail.quoteData.topsash.length>0 ? detail.quoteData.boxWidth/detail.quoteData.topsash.length : detail.quoteData.boxWidth) / (2 * detail.quoteData.topnewHeights)) * (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>
         
         
                                     {/* Right Diagonal Line */}
                                      <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(-${Math.atan(( detail.quoteData.topsash.length>0 ? detail.quoteData.boxWidth/detail.quoteData.topsash.length : detail.quoteData.boxWidth) / (2 * detail.quoteData.topnewHeights))* (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>
         
                                   </div>
         
                                   
                                 </>):(
                                   <>
                                    {/* fixed plus  */}
                              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                                                     
                                   </>
                                 )
                               }                                                      </div>
                                ))}
                              </div>
                            )}
 

                       {detail.quoteData.fanTop === 'Top' && detail.quoteData.fanLeft === 'Left' && detail.quoteData.divider === 'Vertical' && detail.quoteData.switchs === 'on' && (
                                        <div style={{float:'left', height: `calc(${(parseFloat(detail.quoteData.boxHeight) - parseFloat(detail.quoteData.topnewHeights) - parseFloat(detail.quoteData.bottomnewHeights)) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.topnewHeights > 0 && detail.quoteData.bottomnewHeights > 0 ? '16px' : detail.quoteData.topnewHeights > 0 ? '16px' : detail.quoteData.bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${detail.quoteData.boxWidth * screen/detail.quoteData.mCalc}px - 10px)`, margin: '4px', border:'1px solid #333',position:'relative'}}>
                                       
                                                
                                          <img src={Fan} style={{float:'left', width: (parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35) *screen+'px', marginLeft: '4px', marginTop: '4px'}} />
                                          <div style={{float:'left', height: `calc(${((parseFloat(detail.quoteData.boxHeight) - parseFloat(detail.quoteData.topnewHeights) - parseFloat(detail.quoteData.bottomnewHeights))) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.topnewHeights > 0?'28px':'24px'})`, width: `calc(${(parseFloat(detail.quoteData.boxWidth/detail.quoteData.mCalc)-(parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35)) * screen}px - 26px)`, margin: '5px', border:'1px solid #333',  backgroundImage:`repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`, backgroundSize:'150% auto', backgroundRepeat:'repeat'}}></div>
                                          <div style={{position:'relative',float:'left', height: `calc(${((parseFloat(detail.quoteData.boxHeight/detail.quoteData.mCalc) - parseFloat(detail.quoteData.topnewHeights/detail.quoteData.mCalc) - parseFloat(detail.quoteData.bottomnewHeights/detail.quoteData.mCalc)) - ((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35)) * screen}px - 30px)`, width: `calc(${((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35) * screen}px - 0px)`, margin: '4px', marginTop: `calc(-${((parseFloat(detail.quoteData.boxHeight/detail.quoteData.mCalc) - parseFloat(detail.quoteData.topnewHeights/detail.quoteData.mCalc) - parseFloat(detail.quoteData.bottomnewHeights/detail.quoteData.mCalc))-((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35)) * screen}px + 25px)`, border:'1px solid #333', background: 'lightblue'}}>
                                             {/* fixed plus  */}
                                             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                             
                                          </div>
                                        </div>
                                      )}
                                      
                                      {detail.quoteData.fanTop === 'Bottom' && detail.quoteData.fanLeft === 'Left'  && detail.quoteData.divider === 'Vertical' && detail.quoteData.switchs === 'on' && (
                                          <div style={{float:'left', height: `calc(${(parseFloat(detail.quoteData.boxHeight) - parseFloat(detail.quoteData.topnewHeights) - parseFloat(detail.quoteData.bottomnewHeights)) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.topnewHeights > 0 && detail.quoteData.bottomnewHeights > 0 ? '16px' : detail.quoteData.topnewHeights > 0 ? '16px' : detail.quoteData.bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${detail.quoteData.boxWidth * screen/detail.quoteData.mCalc}px - 10px)`, margin: '4px', border:'1px solid #333'}}>
                                            <div style={{position:'relative',float:'left', height: `calc(${((parseFloat(detail.quoteData.boxHeight/detail.quoteData.mCalc) - parseFloat(detail.quoteData.topnewHeights/detail.quoteData.mCalc) - parseFloat(detail.quoteData.bottomnewHeights/detail.quoteData.mCalc)) - (parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35))  * screen}px - 30px)`, width: `calc(${((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35) * screen}px - 0px)`, margin: '4px', marginTop: '5px', border:'1px solid #333', background: 'lightblue'}}>
                                              {/* fixed plus  */}
                                             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                            </div>
                                            
                                         
                                            <div style={{float:'right', height: `calc(${((parseFloat(detail.quoteData.boxHeight) - parseFloat(detail.quoteData.topnewHeights) - parseFloat(detail.quoteData.bottomnewHeights))) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.topnewHeights > 0?'28px':'24px'})`, width: `calc(${(parseFloat(detail.quoteData.boxWidth/detail.quoteData.mCalc)-((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35)) * screen}px - 26px)`, margin: '4px', marginTop: `calc(-${((parseFloat(detail.quoteData.boxHeight/detail.quoteData.mCalc) - parseFloat(detail.quoteData.topnewHeights/detail.quoteData.mCalc) - parseFloat(detail.quoteData.bottomnewHeights/detail.quoteData.mCalc))-((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35)) * screen}px + 25px)`, border:'1px solid #333',  backgroundImage:`repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`, backgroundSize:'150% auto', backgroundRepeat:'repeat'}}></div>
                                         
                                            <img src={Fan} style={{float:'left',  width: (parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc  > 1.25 ? .55 : .35) *screen +'px', marginLeft: '4px', marginBottom: '4px'}} />
                                          </div>
                                      )}
                      
                                      {detail.quoteData.fanTop === 'Top' && detail.quoteData.fanLeft === 'Right' &&  detail.quoteData.divider === 'Vertical' && detail.quoteData.switchs === 'on' && (
                                        <div style={{float:'left', height: `calc(${(parseFloat(detail.quoteData.boxHeight) - parseFloat(detail.quoteData.topnewHeights) - parseFloat(detail.quoteData.bottomnewHeights)) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.topnewHeights > 0 && detail.quoteData.bottomnewHeights > 0 ? '16px' : detail.quoteData.topnewHeights > 0 ? '16px' : detail.quoteData.bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${detail.quoteData.boxWidth * screen/detail.quoteData.mCalc}px - 10px)`, margin: '4px', border:'1px solid #333'}}>
                                          <img src={Fan} style={{float:'right',width: (parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc  > 1.25 ? .55 : .35) *screen +'px', marginRight: '4px', marginTop: '4px'}} />
                                          <div style={{float:'left', height: `calc(${((parseFloat(detail.quoteData.boxHeight) - parseFloat(detail.quoteData.topnewHeights) - parseFloat(detail.quoteData.bottomnewHeights))) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.topnewHeights > 0?'28px':'24px'})`, width:`calc(${(parseFloat(detail.quoteData.boxWidth/detail.quoteData.mCalc)-(parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35)) * screen}px  - 26px)`, margin: '5px', border:'1px solid #333',  backgroundImage:`repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`, backgroundSize:'150% auto', backgroundRepeat:'repeat'}}></div>
                                          <div style={{position:'relative',float:'right', height: `calc(${((parseFloat(detail.quoteData.boxHeight/detail.quoteData.mCalc) - parseFloat(detail.quoteData.topnewHeights/detail.quoteData.mCalc) - parseFloat(detail.quoteData.bottomnewHeights/detail.quoteData.mCalc)) - ((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35)) * screen}px - 30px)`, width: `calc(${((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35) * screen}px - 0px)`, margin: '4px', marginTop: `calc(-${((parseFloat(detail.quoteData.boxHeight/detail.quoteData.mCalc) - parseFloat(detail.quoteData.topnewHeights/detail.quoteData.mCalc) - parseFloat(detail.quoteData.bottomnewHeights/detail.quoteData.mCalc))-((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35)) * screen}px + 25px)`, border:'1px solid #333', background: 'lightblue'}}>
                                             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                          </div>
                                        </div>
                                      )}
                      
                                      {detail.quoteData.fanTop === 'Bottom' && detail.quoteData.fanLeft === 'Right' &&  detail.quoteData.divider === 'Vertical' && detail.quoteData.switchs === 'on' && (
                                        <div style={{float:'left', height: `calc(${(parseFloat(detail.quoteData.boxHeight) - parseFloat(detail.quoteData.topnewHeights) - parseFloat(detail.quoteData.bottomnewHeights)) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.topnewHeights > 0 && detail.quoteData.bottomnewHeights > 0 ? '16px' : detail.quoteData.topnewHeights > 0 ? '16px' : detail.quoteData.bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${detail.quoteData.boxWidth * screen/detail.quoteData.mCalc}px - 10px)`, margin: '4px', border:'1px solid #333'}}>
                                          <div style={{position:'relative',float:'right', height: `calc(${((parseFloat(detail.quoteData.boxHeight/detail.quoteData.mCalc) - parseFloat(detail.quoteData.topnewHeights/detail.quoteData.mCalc) - parseFloat(detail.quoteData.bottomnewHeights/detail.quoteData.mCalc)) - (parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35))  * screen}px - 30px)`, width: `calc(${((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35) * screen}px - 0px)`, margin: '4px', marginTop: '5px', border:'1px solid #333', background: 'lightblue'}}>
                                                {/* fixed plus  */}
                                             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                          </div>
                                          <div style={{float:'left', height: `calc(${((parseFloat(detail.quoteData.boxHeight) - parseFloat(detail.quoteData.topnewHeights) - parseFloat(detail.quoteData.bottomnewHeights))) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.topnewHeights > 0?'28px':'24px'})`, width: `calc(${(parseFloat(detail.quoteData.boxWidth/detail.quoteData.mCalc)-((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35)) * screen}px - 26px)`, margin: '5px', marginTop: `calc(-${((parseFloat(detail.quoteData.boxHeight/detail.quoteData.mCalc) - parseFloat(detail.quoteData.topnewHeights/detail.quoteData.mCalc) - parseFloat(detail.quoteData.bottomnewHeights/detail.quoteData.mCalc))-((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35)) * screen}px + 25px)`, border:'1px solid #333',  backgroundImage:`repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`, backgroundSize:'150% auto', backgroundRepeat:'repeat'}}></div>
                                          <img src={Fan} style={{float:'right', width: (parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc  > 1.25 ? .55 : .35) *screen +'px', marginRight: '4px', marginBottom: '4px'}} />
                                        </div>
                                      )}
                      
                                      {detail.quoteData.fanTop === 'Top' && detail.quoteData.fanLeft === 'Left' &&  detail.quoteData.divider === 'Vertical' && detail.quoteData.switchs === 'off' && (
                                        <div style={{float:'left', height: `calc(${(parseFloat(detail.quoteData.boxHeight) - parseFloat(detail.quoteData.topnewHeights) - parseFloat(detail.quoteData.bottomnewHeights)) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.topnewHeights > 0 && detail.quoteData.bottomnewHeights > 0 ? '16px' : detail.quoteData.topnewHeights > 0 ? '16px' : detail.quoteData.bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${detail.quoteData.boxWidth * screen/detail.quoteData.mCalc}px - 10px)`, margin: '4px', border:'1px solid #333'}}>
                                          <img src={Fan} style={{float:'left', width: (parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35) *screen+'px', marginLeft: '4px', marginTop: '4px'}} />
                                          <div style={{float:'left', height: `calc(${((parseFloat(detail.quoteData.boxHeight) - parseFloat(detail.quoteData.topnewHeights) - parseFloat(detail.quoteData.bottomnewHeights))) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.topnewHeights > 0?'28px':'24px'})`, width: `calc(${(parseFloat(detail.quoteData.boxWidth/detail.quoteData.mCalc)-(parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35)) * screen}px - 26px)`, margin: '5px', border:'1px solid #333', background: 'lightblue'}}>
                                             {/* fixed plus  */}
                                             <div style={{ position: 'absolute', top: '50%', left: '70%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                             
                                          </div>
                                          <div style={{position:'relative', float:'left', height: `calc(${((parseFloat(detail.quoteData.boxHeight/detail.quoteData.mCalc) - parseFloat(detail.quoteData.topnewHeights/detail.quoteData.mCalc) - parseFloat(detail.quoteData.bottomnewHeights/detail.quoteData.mCalc)) - ((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35)) * screen}px - 30px)`, width: `calc(${((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35) * screen}px - 0px)`, margin: '4px', marginTop: `calc(-${((parseFloat(detail.quoteData.boxHeight/detail.quoteData.mCalc) - parseFloat(detail.quoteData.topnewHeights/detail.quoteData.mCalc) - parseFloat(detail.quoteData.bottomnewHeights/detail.quoteData.mCalc))-((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35)) * screen}px  + 25px)`, border:'1px solid #333', backgroundImage:`repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`, backgroundSize:'150% auto', backgroundRepeat:'repeat'}}></div>
                                        </div>
                                      )}
                                      
                                      {detail.quoteData.fanTop === 'Bottom' && detail.quoteData.fanLeft === 'Left' && detail.quoteData.divider === 'Vertical' && detail.quoteData.switchs === 'off' && (
                                          <div style={{float:'left', height: `calc(${(parseFloat(detail.quoteData.boxHeight) - parseFloat(detail.quoteData.topnewHeights) - parseFloat(detail.quoteData.bottomnewHeights)) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.topnewHeights > 0 && detail.quoteData.bottomnewHeights > 0 ? '16px' : detail.quoteData.topnewHeights > 0 ? '16px' : detail.quoteData.bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${detail.quoteData.boxWidth * screen/detail.quoteData.mCalc}px - 10px)`, margin: '4px', border:'1px solid #333'}}>
                                            <div style={{position:'relative',float:'left', height: `calc(${((parseFloat(detail.quoteData.boxHeight/detail.quoteData.mCalc) - parseFloat(detail.quoteData.topnewHeights/detail.quoteData.mCalc) - parseFloat(detail.quoteData.bottomnewHeights/detail.quoteData.mCalc)) - (parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35))  * screen}px - 30px)`, width: `calc(${((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35) * screen}px - 0px)`, margin: '4px', marginTop: '5px', border:'1px solid #333', backgroundImage:`repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`, backgroundSize:'150% auto', backgroundRepeat:'repeat'}}></div>
                                            <div style={{float:'right', height: `calc(${((parseFloat(detail.quoteData.boxHeight) - parseFloat(detail.quoteData.topnewHeights) - parseFloat(detail.quoteData.bottomnewHeights))) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.topnewHeights > 0?'28px':'24px'})`, width: `calc(${(parseFloat(detail.quoteData.boxWidth/detail.quoteData.mCalc)-((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35)) * screen}px - 26px)`, margin: '5px', marginTop: `calc(-${((parseFloat(detail.quoteData.boxHeight/detail.quoteData.mCalc) - parseFloat(detail.quoteData.topnewHeights/detail.quoteData.mCalc) - parseFloat(detail.quoteData.bottomnewHeights/detail.quoteData.mCalc))-((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35)) * screen}px + 25px)`, border:'1px solid #333', background: 'lightblue'}}>
                                            {/* fixed plus  */}
                                             <div style={{ position: 'absolute', top: '50%', left: '70%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                            </div>
                                            <img src={Fan} style={{float:'left', width: (parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35) *screen+'px', marginLeft: '4px', marginBottom: '4px'}} />
                                          </div>
                                      )}
                      
                                      {detail.quoteData.fanTop === 'Top' && detail.quoteData.fanLeft === 'Right' &&  detail.quoteData.divider === 'Vertical' && detail.quoteData.switchs === 'off' && (
                                        <div style={{float:'left', height: `calc(${(parseFloat(detail.quoteData.boxHeight) - parseFloat(detail.quoteData.topnewHeights) - parseFloat(detail.quoteData.bottomnewHeights)) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.topnewHeights > 0 && detail.quoteData.bottomnewHeights > 0 ? '16px' : detail.quoteData.topnewHeights > 0 ? '16px' : detail.quoteData.bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${detail.quoteData.boxWidth * screen/detail.quoteData.mCalc}px - 10px)`, margin: '4px', border:'1px solid #333'}}>
                                          <img src={Fan} style={{float:'right', width: (parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35) *screen+'px', marginRight: '4px', marginTop: '4px'}} />
                                          <div style={{float:'left', height: `calc(${((parseFloat(detail.quoteData.boxHeight) - parseFloat(detail.quoteData.topnewHeights) - parseFloat(detail.quoteData.bottomnewHeights))) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.topnewHeights > 0?'28px':'24px'})`, width: `calc(${(parseFloat(detail.quoteData.boxWidth/detail.quoteData.mCalc)-(parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35)) * screen}px - 26px)`, margin: '5px', border:'1px solid #333', background: 'lightblue'}}>
                                           {/* fixed plus  */}
                                             <div style={{ position: 'absolute', top: '50%', left: '30%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                          </div>
                                          <div style={{position:'relative',float:'right', height: `calc(${((parseFloat(detail.quoteData.boxHeight/detail.quoteData.mCalc) - parseFloat(detail.quoteData.topnewHeights/detail.quoteData.mCalc) - parseFloat(detail.quoteData.bottomnewHeights/detail.quoteData.mCalc)) - ((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35)) * screen}px - 30px)`, width: `calc(${((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35) * screen}px - 0px)`, margin: '4px', marginTop: `calc(-${((parseFloat(detail.quoteData.boxHeight/detail.quoteData.mCalc) - parseFloat(detail.quoteData.topnewHeights/detail.quoteData.mCalc) - parseFloat(detail.quoteData.bottomnewHeights/detail.quoteData.mCalc))-((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35)) * screen}px + 25px)`, border:'1px solid #333', backgroundImage:`repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`, backgroundSize:'150% auto', backgroundRepeat:'repeat'}}></div>
                                        </div>
                                      )}
                      
                                      {detail.quoteData.fanTop === 'Bottom' && detail.quoteData.fanLeft === 'Right'  && detail.quoteData.divider === 'Vertical' && detail.quoteData.switchs === 'off' && (
                                        <div style={{float:'left', height: `calc(${(parseFloat(detail.quoteData.boxHeight) - parseFloat(detail.quoteData.topnewHeights) - parseFloat(detail.quoteData.bottomnewHeights)) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.topnewHeights > 0 && detail.quoteData.bottomnewHeights > 0 ? '16px' : detail.quoteData.topnewHeights > 0 ? '16px' : detail.quoteData.bottomnewHeights > 0 ? '14px' : '11px'})`, margin: '4px', border:'1px solid #333'}}>
                                          <div style={{position:'relative',float:'right', height: `calc(${((parseFloat(detail.quoteData.boxHeight/detail.quoteData.mCalc) - parseFloat(detail.quoteData.topnewHeights/detail.quoteData.mCalc) - parseFloat(detail.quoteData.bottomnewHeights/detail.quoteData.mCalc)) - (parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35))  * screen}px - 30px)`, width: `calc(${((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35) * screen}px - 0px)`, margin: '4px', marginTop: '5px', border:'1px solid #333', backgroundImage:`repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`, backgroundSize:'150% auto', backgroundRepeat:'repeat'}}></div>
                                          <div style={{float:'left', height: `calc(${((parseFloat(detail.quoteData.boxHeight) - parseFloat(detail.quoteData.topnewHeights) - parseFloat(detail.quoteData.bottomnewHeights))) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.topnewHeights > 0?'28px':'24px'})`, width: `calc(${(parseFloat(detail.quoteData.boxWidth/detail.quoteData.mCalc)-((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35)) * screen}px - 26px)`, margin: '5px', marginTop: `calc(-${((parseFloat(detail.quoteData.boxHeight/detail.quoteData.mCalc) - parseFloat(detail.quoteData.topnewHeights/detail.quoteData.mCalc) - parseFloat(detail.quoteData.bottomnewHeights/detail.quoteData.mCalc))-((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35)) * screen}px + 25px)`, border:'1px solid #333', background: 'lightblue'}}>
                                           {/* fixed plus  */}
                                             <div style={{ position: 'absolute', top: '50%', left: '30%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                          </div>
                                          <img src={Fan} style={{float:'right', width: (parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc  > 1.25 ? .55 : .35) *screen +'px', marginRight: '4px', marginBottom: '4px'}} />
                                        </div>
                                      )}
                                      
                                      {detail.quoteData.fanTop === 'Top' && detail.quoteData.fanLeft === 'Left' && detail.quoteData.divider === 'Horizontal' && detail.quoteData.switchs === 'on' && (
                                        <div style={{float:'left', height: `calc(${(parseFloat(detail.quoteData.boxHeight) - parseFloat(detail.quoteData.topnewHeights) - parseFloat(detail.quoteData.bottomnewHeights)) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.topnewHeights > 0 && detail.quoteData.bottomnewHeights > 0 ? '16px' : detail.quoteData.topnewHeights > 0 ? '16px' : detail.quoteData.bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${detail.quoteData.boxWidth * screen/detail.quoteData.mCalc}px - 10px)`, margin: '4px', border:'1px solid #333'}}>
                                          <img src={Fan} style={{float:'left', width: (parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35) *screen+'px', marginLeft: '4px', marginTop: '4px'}} />
                                          <div style={{float:'right', height: `calc(${((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35) * screen}px - 0px)`, width: `calc(${(parseFloat(detail.quoteData.boxWidth/detail.quoteData.mCalc)-(parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35)) * screen}px - 26px)`, margin: '5px',  border:'1px solid #333', backgroundImage:`repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`, backgroundSize:'150% auto', backgroundRepeat:'repeat'}}></div>
                                          <div style={{position:'relative', float:'left', height: `calc(${((parseFloat(detail.quoteData.boxHeight/detail.quoteData.mCalc) - parseFloat(detail.quoteData.topnewHeights/detail.quoteData.mCalc) - parseFloat(detail.quoteData.bottomnewHeights/detail.quoteData.mCalc)) - ((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35)) * screen}px - 30px)`, width: `calc(${(detail.quoteData.boxWidth) * screen/detail.quoteData.mCalc}px - 20px)`, margin: '4px', marginTop: '0px', border:'1px solid #333', background: 'lightblue'}}>
                                             {/* fixed plus  */}
                                             <div style={{ position: 'absolute', top: '70%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                            </div>
                                        </div>
                                      )}
                                      
                                      {detail.quoteData.fanTop === 'Bottom' && detail.quoteData.fanLeft === 'Left'  && detail.quoteData.divider === 'Horizontal' && detail.quoteData.switchs === 'on' && (
                                        <div style={{float:'left', height: `calc(${(parseFloat(detail.quoteData.boxHeight) - parseFloat(detail.quoteData.topnewHeights) - parseFloat(detail.quoteData.bottomnewHeights)) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.topnewHeights > 0 && detail.quoteData.bottomnewHeights > 0 ? '16px' : detail.quoteData.topnewHeights > 0 ? '16px' : detail.quoteData.bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${detail.quoteData.boxWidth * screen/detail.quoteData.mCalc}px - 10px)`, margin: '4px', border:'1px solid #333'}}>
                                          <div style={{position:'relative', float:'left', height: `calc(${((parseFloat(detail.quoteData.boxHeight/detail.quoteData.mCalc) - parseFloat(detail.quoteData.topnewHeights/detail.quoteData.mCalc) - parseFloat(detail.quoteData.bottomnewHeights/detail.quoteData.mCalc)) - ((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35)) * screen}px - 30px)`, width: `calc(${(detail.quoteData.boxWidth) * screen/detail.quoteData.mCalc}px - 20px)`, margin: '4px', marginTop: '5px', border:'1px solid #333', background: 'lightblue'}}>
                                               {/* fixed plus  */}
                                             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                           
                                          </div>
                                          <div style={{float:'right', height: `calc(${((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35) * screen}px - 0px)`, width: `calc(${(parseFloat(detail.quoteData.boxWidth/detail.quoteData.mCalc)-(parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35)) * screen}px - 26px)`, marginRight: '5px', marginBottom: '4px',  border:'1px solid #333', backgroundImage:`repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`, backgroundSize:'150% auto', backgroundRepeat:'repeat'}}></div>
                                          <img src={Fan} style={{float:'left', width: (parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35) *screen+'px', marginLeft: '4px', marginBottom: '4px'}} />
                                        </div>
                                      )}
                                      
                                      {detail.quoteData.fanTop === 'Top' && detail.quoteData.fanLeft === 'Right'  && detail.quoteData.divider === 'Horizontal' && detail.quoteData.switchs === 'on' && (
                                        <div style={{float:'left', height: `calc(${(parseFloat(detail.quoteData.boxHeight) - parseFloat(detail.quoteData.topnewHeights) - parseFloat(detail.quoteData.bottomnewHeights)) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.topnewHeights > 0 && detail.quoteData.bottomnewHeights > 0 ? '16px' : detail.quoteData.topnewHeights > 0 ? '16px' : detail.quoteData.bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${detail.quoteData.boxWidth * screen/detail.quoteData.mCalc}px - 10px)`, margin: '4px', border:'1px solid #333'}}>
                                          <img src={Fan} style={{float:'right', width: (parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35) *screen+'px', marginRight: '4px', marginTop: '4px'}} />
                                          <div style={{float:'left', height: `calc(${((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35) * screen}px - 0px)`, width: `calc(${(parseFloat(detail.quoteData.boxWidth/detail.quoteData.mCalc)-(parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35)) * screen}px - 26px)`, margin: '5px',  border:'1px solid #333', backgroundImage:`repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`, backgroundSize:'150% auto', backgroundRepeat:'repeat'}}>
                                          </div>
                                          <div style={{float:'left', height: `calc(${((parseFloat(detail.quoteData.boxHeight/detail.quoteData.mCalc) - parseFloat(detail.quoteData.topnewHeights/detail.quoteData.mCalc) - parseFloat(detail.quoteData.bottomnewHeights/detail.quoteData.mCalc)) - ((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35)) * screen}px - 30px)`, width: `calc(${(detail.quoteData.boxWidth) * screen/detail.quoteData.mCalc}px - 20px)`, margin: '4px', marginTop: '0px', border:'1px solid #333', background: 'lightblue'}}>
                                              {/* fixed plus  */}
                                             <div style={{ position: 'absolute', top: '70%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                           
                                          </div>
                                        </div>
                                      )}
                                      
                                      {detail.quoteData.fanTop === 'Bottom' && detail.quoteData.fanLeft === 'Right'  && detail.quoteData.divider === 'Horizontal' && detail.quoteData.switchs === 'on' && (
                                        <div style={{float:'left', height: `calc(${(parseFloat(detail.quoteData.boxHeight) - parseFloat(detail.quoteData.topnewHeights) - parseFloat(detail.quoteData.bottomnewHeights)) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.topnewHeights > 0 && detail.quoteData.bottomnewHeights > 0 ? '16px' : detail.quoteData.topnewHeights > 0 ? '16px' : detail.quoteData.bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${detail.quoteData.boxWidth * screen/detail.quoteData.mCalc}px - 10px)`, margin: '4px', border:'1px solid #333'}}>
                                          <div style={{position:'relative', float:'left', height: `calc(${((parseFloat(detail.quoteData.boxHeight/detail.quoteData.mCalc) - parseFloat(detail.quoteData.topnewHeights/detail.quoteData.mCalc) - parseFloat(detail.quoteData.bottomnewHeights/detail.quoteData.mCalc)) - ((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35)) * screen}px - 30px)`, width: `calc(${(detail.quoteData.boxWidth) * screen/detail.quoteData.mCalc}px - 20px)`, margin: '4px', marginTop: '5px', border:'1px solid #333', background: 'lightblue'}}>
                                              {/* fixed plus  */}
                                             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                           
                                          </div>
                                          <div style={{float:'left', height: `calc(${((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35) * screen}px - 0px)`, width: `calc(${(parseFloat(detail.quoteData.boxWidth/detail.quoteData.mCalc)-(parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35)) * screen}px - 26px)`, marginLeft: '5px', marginBottom: '4px',  border:'1px solid #333', backgroundImage:`repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`, backgroundSize:'150% auto', backgroundRepeat:'repeat'}}></div>
                                          <img src={Fan} style={{float:'right', width: (parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35) *screen+'px', marginRight: '4px', marginBottom: '4px'}} />
                                        </div>
                                      )}
                      
                                      {detail.quoteData.fanTop === 'Top' && detail.quoteData.fanLeft === 'Left'  && detail.quoteData.divider === 'Horizontal' && detail.quoteData.switchs === 'off' && (
                                        <div style={{float:'left', height: `calc(${(parseFloat(detail.quoteData.boxHeight) - parseFloat(detail.quoteData.topnewHeights) - parseFloat(detail.quoteData.bottomnewHeights)) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.topnewHeights > 0 && detail.quoteData.bottomnewHeights > 0 ? '16px' : detail.quoteData.topnewHeights > 0 ? '16px' : detail.quoteData.bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${detail.quoteData.boxWidth * screen/detail.quoteData.mCalc}px - 10px)`, margin: '4px', border:'1px solid #333'}}>
                                          <img src={Fan} style={{float:'left', width: (parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35) *screen+'px', marginLeft: '4px', marginTop: '4px'}} />
                                          <div style={{float:'right', height: `calc(${((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35) * screen}px - 0px)`, width: `calc(${(parseFloat(detail.quoteData.boxWidth/detail.quoteData.mCalc)-(parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35)) * screen}px - 26px)`, margin: '5px',  border:'1px solid #333', background: 'lightblue' }}>
                                               {/* fixed plus  */}
                                             <div style={{ position: 'absolute', top: '30%', left: '70%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                             
                                          </div>
                                          <div style={{position:'relative',float:'left', height: `calc(${((parseFloat(detail.quoteData.boxHeight/detail.quoteData.mCalc) - parseFloat(detail.quoteData.topnewHeights/detail.quoteData.mCalc) - parseFloat(detail.quoteData.bottomnewHeights/detail.quoteData.mCalc)) - ((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35)) * screen}px - 30px)`, width: `calc(${(detail.quoteData.boxWidth) * screen/detail.quoteData.mCalc}px - 20px)`, margin: '4px', marginTop: '0px', border:'1px solid #333', backgroundImage:`repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`, backgroundSize:'150% auto', backgroundRepeat:'repeat'}}></div>
                                        </div>
                                      )}
                                      
                                      {detail.quoteData.fanTop === 'Top' && detail.quoteData.fanLeft === 'Right'  && detail.quoteData.divider === 'Horizontal' && detail.quoteData.switchs === 'off' && (
                                        <div style={{float:'left', height: `calc(${(parseFloat(detail.quoteData.boxHeight) - parseFloat(detail.quoteData.topnewHeights) - parseFloat(detail.quoteData.bottomnewHeights)) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.topnewHeights > 0 && detail.quoteData.bottomnewHeights > 0 ? '16px' : detail.quoteData.topnewHeights > 0 ? '16px' : detail.quoteData.bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${detail.quoteData.boxWidth * screen/detail.quoteData.mCalc}px - 10px)`, margin: '4px', border:'1px solid #333'}}>
                                          <img src={Fan} style={{float:'right', width: (parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35) *screen+'px', marginRight: '4px', marginTop: '4px'}} />
                                          <div style={{float:'left', height: `calc(${((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35) * screen}px - 0px)`, width: `calc(${(parseFloat(detail.quoteData.boxWidth/detail.quoteData.mCalc)-(parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35)) * screen}px - 26px)`, margin: '5px',  border:'1px solid #333', background: 'lightblue' }}>
                                            {/* fixed plus  */}
                                             <div style={{ position: 'absolute', top: '25%', left: '30%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                             
                                          </div>
                                          <div style={{position:'relative',float:'left', height: `calc(${((parseFloat(detail.quoteData.boxHeight/detail.quoteData.mCalc) - parseFloat(detail.quoteData.topnewHeights/detail.quoteData.mCalc) - parseFloat(detail.quoteData.bottomnewHeights/detail.quoteData.mCalc)) - ((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35)) * screen}px - 30px)`, width: `calc(${(detail.quoteData.boxWidth) * screen/detail.quoteData.mCalc}px - 20px)`, margin: '4px', marginTop: '0px', border:'1px solid #333', backgroundImage:`repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`, backgroundSize:'150% auto', backgroundRepeat:'repeat'}}></div>
                                        </div>
                                      )}
                                      
                                      {detail.quoteData.fanTop === 'Bottom' && detail.quoteData.fanLeft === 'Right'  && detail.quoteData.divider === 'Horizontal' && detail.quoteData.switchs === 'off' && (
                                        <div style={{float:'left', height: `calc(${(parseFloat(detail.quoteData.boxHeight) - parseFloat(detail.quoteData.topnewHeights) - parseFloat(detail.quoteData.bottomnewHeights)) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.topnewHeights > 0 && detail.quoteData.bottomnewHeights > 0 ? '16px' : detail.quoteData.topnewHeights > 0 ? '16px' : detail.quoteData.bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${detail.quoteData.boxWidth * screen/detail.quoteData.mCalc}px - 10px)`, margin: '4px', border:'1px solid #333'}}>
                                          <div style={{position:'relative',float:'left', height: `calc(${((parseFloat(detail.quoteData.boxHeight/detail.quoteData.mCalc) - parseFloat(detail.quoteData.topnewHeights/detail.quoteData.mCalc) - parseFloat(detail.quoteData.bottomnewHeights/detail.quoteData.mCalc)) - ((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35)) * screen}px - 30px)`, width: `calc(${(detail.quoteData.boxWidth) * screen/detail.quoteData.mCalc}px - 20px)`, margin: '4px', marginTop: '5px', border:'1px solid #333', backgroundImage:`repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`, backgroundSize:'150% auto', backgroundRepeat:'repeat'}}></div>
                                          <img src={Fan} style={{float:'right', width: (parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35) *screen+'px', marginRight: '4px', marginTop: '0px'}} />
                                          <div style={{float:'left', height: `calc(${((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35) * screen}px - 0px)`, width: `calc(${(parseFloat(detail.quoteData.boxWidth/detail.quoteData.mCalc)-(parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35)) * screen}px - 26px)`, marginLeft: '4px',  border:'1px solid #333', background: 'lightblue' }}>
                                               {/* fixed plus  */}
                                             <div style={{ position: 'absolute', top: '70%', left: '30%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                             
                                          </div>
                                        </div>
                                      )}
                      
                                      {detail.quoteData.fanTop === 'Bottom' && detail.quoteData.fanLeft === 'Left'  && detail.quoteData.divider === 'Horizontal' && detail.quoteData.switchs === 'off' && (
                                        <div style={{float:'left', height: `calc(${(parseFloat(detail.quoteData.boxHeight) - parseFloat(detail.quoteData.topnewHeights) - parseFloat(detail.quoteData.bottomnewHeights)) * screen/detail.quoteData.mCalc}px - ${detail.quoteData.topnewHeights > 0 && detail.quoteData.bottomnewHeights > 0 ? '16px' : detail.quoteData.topnewHeights > 0 ? '16px' : detail.quoteData.bottomnewHeights > 0 ? '14px' : '11px'})`, width: `calc(${detail.quoteData.boxWidth * screen/detail.quoteData.mCalc}px - 10px)`, margin: '4px', border:'1px solid #333'}}>
                                        <div style={{float:'left', height: `calc(${((parseFloat(detail.quoteData.boxHeight/detail.quoteData.mCalc) - parseFloat(detail.quoteData.topnewHeights/detail.quoteData.mCalc) - parseFloat(detail.quoteData.bottomnewHeights/detail.quoteData.mCalc)) - ((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35)) * screen}px - 30px)`, width: `calc(${(detail.quoteData.boxWidth) * screen/detail.quoteData.mCalc}px - 20px)`, margin: '4px', marginTop: '5px', border:'1px solid #333', backgroundImage:`repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`, backgroundSize:'150% auto', backgroundRepeat:'repeat'}}></div>
                                          <img src={Fan} style={{float:'left', width: (parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35) *screen+'px', marginLeft: '4px', marginRight: '4px'}} />
                                          <div style={{float:'right', height: `calc(${((parseFloat(detail.quoteData.boxWidth)/ detail.quoteData.mCalc) > 1.25 ? .55 : .35) * screen}px - 0px)`, width: `calc(${(parseFloat(detail.quoteData.boxWidth/detail.quoteData.mCalc)-(parseFloat(detail.quoteData.boxWidth) / detail.quoteData.mCalc > 1.25 ? .55 : .35)) * screen}px - 26px)`, marginRight: '5px',  border:'1px solid #333', background: 'lightblue' }}>
                                              {/* fixed plus  */}
                                             <div style={{ position: 'absolute', top: '65%', left: '65%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                             
                                          </div>
                                        </div>
                                      )}
    
                     {detail.quoteData.bottomsash.length > 0 && (
    
                     <div style={{ display: 'flex', width: `calc(${detail.quoteData.boxWidth * screen/detail.quoteData.mCalc + 'px'} - 10px)`, height: `calc(${(detail.quoteData.bottomnewHeights * screen/detail.quoteData.mCalc)}px )`, marginTop: '5px', marginLeft: '4px' }}>
                         {detail.quoteData.bottomsash.map((_, index) => (
                           <div style={{ flex: 1, position: 'relative', background: detail.quoteData.bottomsash[index].type === 'fixed' ? 'lightgreen' : 'lightblue', width: `calc(${(detail.quoteData.boxWidth/detail.quoteData.topsash?.length) * screen/detail.quoteData.mCalc + 'px'} - 14px)`, height: `calc(${(detail.quoteData.bottomnewHeights * screen/detail.quoteData.mCalc + 'px')} - 0px )`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '2px', }}>
                           {detail.quoteData.bottomsash[index].type === 'shutter' ?(
                            <>
                              <img
                                src={left}
                                style={{
                                  float: 'left',
                                  marginTop: `calc(${(((detail.quoteData.bottomnewHeights) * screen/detail.quoteData.mCalc))}px - 15px)`,
                                  marginLeft: '45%',
                                  width: screen === 40 ? '13px' : '8px',
                                  transform: 'rotate(-90deg)'
                                }}
                                alt="Left Handle"
                              />
                              <div style={{ position: 'absolute', width: '100%', height: '100%',overflow:'hidden' }}>
                                {/* Left Diagonal Line  */}
                                <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(${Math.atan((detail.quoteData.bottomsash.length>0 ? detail.quoteData.boxWidth/detail.quoteData.bottomsash.length : detail.quoteData.boxWidth) / (2 * detail.quoteData.bottomnewHeights)) * (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>
                                             
                                             
                                {/* Right Diagonal Line */}
                                <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(-${Math.atan((detail.quoteData.bottomsash.length>0 ? detail.quoteData.boxWidth/detail.quoteData.bottomsash.length : detail.quoteData.boxWidth) / (2 * detail.quoteData.bottomnewHeights)) * (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>
                                             
                              </div> 
    
                              
                            </>):(
                              <>
                               {/* fixed plus  */}
                              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: `${screen === 20 ? '15px' : '20px'}`, fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                                                      
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
                                 <div style={{float:'left', width: detail.quoteData.boxWidth*screen/detail.quoteData.mCalc+'px', height:detail.quoteData.boxHeight*screen/detail.quoteData.mCalc+'px', border:'1px solid #333',position:'relative'}}>
                                     {/* outer corner lines start */}
                                         <div style={{ position:'absolute',height: '7px', width: '1px', float: 'left', marginTop: '-1.5px', marginLeft: `calc(${(detail.quoteData.boxWidth)*screen/detail.quoteData.mCalc}px - 4px)`, transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                                         <div style={{ position:'absolute',height: '8px', width: '1px', float: 'left', marginTop: '-1px', marginLeft: '3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                                         <div style={{ position:'absolute',height: '7px', width: '1px', float: 'right', marginTop: `calc(${detail.quoteData.boxHeight*screen/detail.quoteData.mCalc}px - 8px)`, marginLeft:  `calc(${(detail.quoteData.boxWidth)*screen/detail.quoteData.mCalc}px - 4px)`, transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                                         <div style={{ position:'absolute',height: '7px', width: '1px', float: 'left', marginTop: `calc(${detail.quoteData.boxHeight*screen/detail.quoteData.mCalc}px - 8px)`, marginLeft: '1px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>
                                         {/* outer corner lines end */}
                                 {detail.quoteData.topnewHeights > 0 && (
                                   <div style={{ display: 'flex', width: `calc(${detail.quoteData.boxWidth * screen/detail.quoteData.mCalc + 'px'} - 12px)`, height: `calc(${(detail.quoteData.topnewHeights * screen/detail.quoteData.mCalc)}px )`, marginTop: '5px', marginLeft: '5px' }}>
                                     {detail.quoteData.topsash.map((_, index) => (
                                       <div style={{ flex: 1, background: detail.quoteData.topsash[index].type === 'fixed' ? 'lightgreen' : 'lightblue', width: `calc(${(detail.quoteData.boxWidth/detail.quoteData.topsash.length) * screen/detail.quoteData.mCalc + 'px'} - 28px)`, height: `calc(${(detail.quoteData.topnewHeights * screen/detail.quoteData.mCalc)}px )`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px', position:"relative" }}>
                                         {detail.quoteData.topsash[index].type === 'shutter' ?(
                                           <>
                                             <img
                                               src={left}
                                               style={{
                                                 float: 'left',
                                                 marginTop: `calc(${(((detail.quoteData.topnewHeights) * screen/detail.quoteData.mCalc))}px - 15px)`,
                                                 marginLeft: '45%',
                                                 width: screen === 40 ? '13px' : '8px',
                                                 transform: 'rotate(-90deg)'
                                               }}
                                               alt="Left Handle"
                                             />
                                               <div style={{ position: 'absolute', width: '100%', height: '100%',overflow:'hidden' }}>
                                               {/* Left Diagonal Line  */}
                                                 <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(${Math.atan((detail.quoteData.topsash.length>0 ? detail.quoteData.boxWidth/detail.quoteData.topsash.length : detail.quoteData.boxWidth) / (2 * detail.quoteData.topnewHeights)) * (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>
                   
                   
                                               {/* Right Diagonal Line */}
                                                <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(-${Math.atan(( detail.quoteData.topsash.length>0 ? detail.quoteData.boxWidth/detail.quoteData.topsash.length : detail.quoteData.boxWidth) / (2 * detail.quoteData.topnewHeights))* (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>
                   
                                             </div>
                   
                                             
                                           </>):(
                                             <>
                                              {/* fixed plus  */}
                                             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: `${screen === 20 ? '15px' : '30px'}`, fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                                                                     
                                             </>
                                           )
                                         }
                                       </div>
                                     ))}
                                   </div>
                                 )}
                                 {detail.quoteData.switchFixed === 'on' ? ( <>
                                   <div style={{ height: `calc(${(detail.quoteData.boxHeight-detail.quoteData.topnewHeights-detail.quoteData.bottomnewHeights)*screen/detail.quoteData.mCalc}px - ${detail.quoteData.bottomsash.length > 0 && detail.quoteData.bottomsash.length > 0 ? '22px' : detail.quoteData.topnewHeights > 0 ? '17px' : detail.quoteData.bottomsash.length > 0 ? '17px ' : '12px'})`, width: `calc(${(detail.quoteData.boxWidth)*screen/detail.quoteData.mCalc}px - 12px)`, marginLeft: '5px', marginTop: '5px', marginBottom: detail.quoteData.bottomsash.length > 0 ? '5px' : '0px', background:'lightblue', border:'1px solid #333',position:'relative'}}>
                                      {/* fixed plus  */}
                                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                                
                                   </div>
                                   </>
                                 ):(<>
                                     <div style={{ height: `calc(${(detail.quoteData.boxHeight-detail.quoteData.topnewHeights-detail.quoteData.bottomnewHeights)*screen/detail.quoteData.mCalc}px - ${detail.quoteData.bottomsash.length > 0 && detail.quoteData.bottomsash.length > 0 ? '22px' : detail.quoteData.topnewHeights > 0 ? '17px' : detail.quoteData.bottomsash.length > 0 ? '17px ' : '12px'})`, width: `calc(${(detail.quoteData.boxWidth)*screen/detail.quoteData.mCalc}px - 12px)`, marginLeft: '5px', marginTop: '5px', marginBottom: detail.quoteData.bottomsash.length > 0 ? '5px' : '0px',  backgroundImage:`repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`, backgroundSize: '150% auto', backgroundRepeat: 'repeat', border:'1px solid #333'}}></div>
                                   </>
                                 )}<>
                                 {detail.quoteData.bottomsash.length > 0 && (
                                   <div style={{ display: 'flex', width: `calc(${detail.quoteData.boxWidth * screen/detail.quoteData.mCalc + 'px'} - 12px)`, height: `calc(${(detail.quoteData.bottomnewHeights * screen/detail.quoteData.mCalc)}px )`, marginTop: '5px', marginLeft: '5px' }}>
                                     {detail.quoteData.bottomsash.map((_, index) => (
                                       <div style={{ flex: 1, background: detail.quoteData.bottomsash[index].type === 'fixed' ? 'lightgreen' : 'lightblue', width: `calc(${(detail.quoteData.boxWidth/detail.quoteData.topsash.length) * screen/detail.quoteData.mCalc + 'px'} - 28px)`, height: `calc(${(detail.quoteData.bottomnewHeights * screen/detail.quoteData.mCalc)}px )`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px', position:'relative' }}>
                                         {detail.quoteData.bottomsash[index].type === 'shutter' ?(
                                           <>
                                             <img
                                               src={left}
                                               style={{
                                                 float: 'left',
                                                 marginTop: `calc(${(((detail.quoteData.bottomnewHeights) * screen/detail.quoteData.mCalc))}px - 15px)`,
                                                 marginLeft: '45%',
                                                 width: screen === 40 ? '13px' : '8px',
                                                 transform: 'rotate(-90deg)'
                                               }}
                                               alt="Left Handle"
                                             />
                                             <div style={{ position: 'absolute', width: '100%', height: '100%',overflow:'hidden' }}>
                                               {/* Left Diagonal Line  */}
                                               <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(${Math.atan((detail.quoteData.bottomsash.length>0 ? detail.quoteData.boxWidth/detail.quoteData.bottomsash.length : detail.quoteData.boxWidth) / (2 * detail.quoteData.bottomnewHeights)) * (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>
                                                            
                                                            
                                               {/* Right Diagonal Line */}
                                               <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(-${Math.atan((detail.quoteData.bottomsash.length>0 ? detail.quoteData.boxWidth/detail.quoteData.bottomsash.length : detail.quoteData.boxWidth) / (2 * detail.quoteData.bottomnewHeights)) * (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>
                                                            
                                             </div> 
                                             
                                           </>):(
                                             <>
                                              {/* fixed plus  */}
                                               <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                                                                     
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
                   
                                     {detail.quoteData.boxHeight === 1 && detail.quoteData.boxWidth > 1 && (
                   
                                     detail.quoteData.fan === 'on' ? (
                                      <>
                                     {detail.quoteData.switchFixed === 'on' && (  
                    
                                        <div style={{float:'left', width: detail.quoteData.boxWidth*screen/detail.quoteData.mCalc+'px', height:detail.quoteData.boxHeight*screen/detail.quoteData.mCalc+'px', border:'1px solid #333'}}>
                        <div style={{float:'left', height: `calc(${detail.quoteData.boxHeight * screen/detail.quoteData.mCalc}px - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen/detail.quoteData.mCalc}px - 10px)`, margin: '4px', border:'1px solid #333'}}>
                          <img src={Fan} style={{float:'left', width: .75*screen+'px', margin: '4px', }} />
                          <div style={{float: 'right', height: `calc(${(detail.quoteData.boxHeight)*screen/detail.quoteData.mCalc}px - 22px)`, width: `calc(${(detail.quoteData.boxWidth- .94)*screen/detail.quoteData.mCalc}px - 10px)`, marginRight: '5px', marginTop: '5px', background:'lightblue', border:'1px solid #333'}}></div>
                        </div>
                      </div>
                    )}
                   
                    {detail.quoteData.switchFixed === 'off' && (  
                    
                    <div style={{float:'left', width: detail.quoteData.boxWidth*screen/detail.quoteData.mCalc+'px', height:detail.quoteData.boxHeight*screen/detail.quoteData.mCalc+'px', border:'1px solid #333'}}>
                      <div style={{float:'left', height: `calc(${detail.quoteData.boxHeight * screen/detail.quoteData.mCalc}px - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen/detail.quoteData.mCalc}px - 10px)`, margin: '4px', border:'1px solid #333'}}>
                        <img src={Fan} style={{float:'left', width: .75*screen/detail.quoteData.mCalc+'px', margin: '4px', }} />
                        <div style={{float: 'right', height: `calc(${(detail.quoteData.boxHeight)*screen/detail.quoteData.mCalc}px - 22px)`, width: `calc(${(detail.quoteData.boxWidth- .94)*screen/detail.quoteData.mCalc}px - 10px)`, marginRight: '5px', marginTop: '5px',  backgroundImage:`repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`, backgroundSize: '150% auto', backgroundRepeat: 'repeat', border:'1px solid #333'}}></div>
                      </div>
                    </div>
                   )}
                    </>
                   ):(
                    
                      <div style={{float:'left', width: detail.quoteData.boxWidth*screen/detail.quoteData.mCalc+'px', height:detail.quoteData.boxHeight*screen/detail.quoteData.mCalc+'px', border:'1px solid #333'}}>
                      { detail.quoteData.switchFixed === 'off' ?   
                        <div style={{float: 'right', height: `calc(${(detail.quoteData.boxHeight)*screen}px - 12px)`, width: `calc(${(detail.quoteData.boxWidth)*screen/detail.quoteData.mCalc}px - 10px)`, marginRight: '5px', marginTop: '5px',  backgroundImage:`repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`, backgroundSize: '150% auto', backgroundRepeat: 'repeat', border:'1px solid #333'}}></div>
                      :
                        <div style={{float: 'right', height: `calc(${(detail.quoteData.boxHeight)*screen}px - 12px)`, width: `calc(${(detail.quoteData.boxWidth)*screen/detail.quoteData.mCalc}px - 10px)`, marginRight: '5px', marginTop: '5px', background:'lightblue', border:'1px solid #333'}}></div>
                      }
                      </div>
                   
                   )
                   
                   )}
                   
                   {detail.quoteData.boxHeight >= 1 && detail.quoteData.boxWidth === 1 && (
                    detail.quoteData.fan === 'on' ? (
                    <>
                     {detail.quoteData.switchFixed === 'on' && (  
                      <div style={{float:'left', width: detail.quoteData.boxWidth*screen/detail.quoteData.mCalc+'px', height:detail.quoteData.boxHeight*screen/detail.quoteData.mCalc+'px', border:'1px solid #333'}}>
                          <div style={{float:'left', height: `calc(${detail.quoteData.boxHeight *screen/detail.quoteData.mCalc}px - 10px)`, width: `calc(${detail.quoteData.boxWidth *screen/detail.quoteData.mCalc}px - 10px)`, margin: '4px', border:'1px solid #333'}}>
                          <img src={Fan} style={{float:'left', width: .75*screen/detail.quoteData.mCalc+'px', margin: '4px', }} />
                          <div style={{float: 'right', height: `calc(${(detail.quoteData.boxHeight-.75)*screen/detail.quoteData.mCalc}px - 25px)`, width: `calc(${(detail.quoteData.boxWidth)*screen/detail.quoteData.mCalc}px - 20px)`, marginRight: '5px', background:'lightblue', border:'1px solid #333'}}></div>
                        </div>
                      </div>
                     )}
                     
                     {detail.quoteData.switchFixed === 'off' && (
                      <div style={{float:'left', width: detail.quoteData.boxWidth*screen/detail.quoteData.mCalc+'px', height:detail.quoteData.boxHeight*screen/detail.quoteData.mCalc+'px', border:'1px solid #333'}}>
                        <div style={{float:'left', height: `calc(${detail.quoteData.boxHeight *screen/detail.quoteData.mCalc}px - 10px)`, width: `calc(${detail.quoteData.boxWidth *screen/detail.quoteData.mCalc}px - 10px)`, margin: '4px', border:'1px solid #333'}}>
                        <img src={Fan} style={{float:'left', width: .75*screen/detail.quoteData.mCalc+'px', margin: '4px', }} />
                        <div style={{float: 'right', height: `calc(${(detail.quoteData.boxHeight-.75)*screen/detail.quoteData.mCalc}px - 25px)`, width: `calc(${(detail.quoteData.boxWidth)*screen/detail.quoteData.mCalc}px - 20px)`, marginRight: '5px',  backgroundImage:`repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`, backgroundSize: '150% auto', backgroundRepeat: 'repeat', border:'1px solid #333'}}></div>
                        </div>
                      </div>
                     )}
                    </>
                    ):(
                      <div style={{float:'left', width: detail.quoteData.boxWidth*screen/detail.quoteData.mCalc+'px', height:detail.quoteData.boxHeight*screen/detail.quoteData.mCalc+'px', border:'1px solid #333'}}>
                        { detail.quoteData.switchFixed === 'off' ?   
                        <div style={{float: 'right', height: `calc(${(detail.quoteData.boxHeight)*screen/detail.quoteData.mCalc}px - 12px)`, width: `calc(${(detail.quoteData.boxWidth)*screen/detail.quoteData.mCalc}px - 12px)`, marginRight: '5px', marginTop: '5px',  backgroundImage:`repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`, backgroundSize: '150% auto', backgroundRepeat: 'repeat', border:'1px solid #333'}}></div>
                      :
                        <div style={{float: 'right', height: `calc(${(detail.quoteData.boxHeight)*screen/detail.quoteData.mCalc}px - 12px)`, width: `calc(${(detail.quoteData.boxWidth)*screen/detail.quoteData.mCalc}px - 12px)`, marginRight: '5px', marginTop: '5px', background:'lightblue', border:'1px solid #333'}}></div>
                      }
                      </div>
                    )
                   )}
                    </>
                   )}

           {detail.quoteData.item === 'Fixed Window' && ( 

              <div style={{float:'left',boxShadow: '1px 1px 5px grey', width: `calc(${(detail.quoteData.measure === 'ft' ? detail.quoteData.boxWidth : detail.quoteData.boxWidth  / 304.8)*screen}px ${detail.quoteData.measure === 'ft' ? '+ 1px' : '+ 6px'})`, height: `calc(${(detail.quoteData.measure === 'ft' ? detail.quoteData.boxHeight : detail.quoteData.boxHeight / 304.8) * screen}px + 5px)`, border:'1px solid #333', position:'relative'}}>
                  {detail.quoteData.boxHeight&&detail.quoteData.boxWidth>0?
                  <>
                         {/* outer corner lines start */}
                      <div style={{ position:'absolute',height: '7px', width: '1px', float: 'left', marginTop: '-1.5px', marginLeft: `calc(${(detail.quoteData.measure === 'ft' ? detail.quoteData.boxWidth : detail.quoteData.boxWidth  / 304.8)*screen}px ${detail.quoteData.measure === 'ft' ? '- 3px' : '+ 2px'})`, transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                      <div style={{ position:'absolute',height: '8px', width: '1px', float: 'left', marginTop: '-1px', marginLeft: '2px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                      <div style={{ position:'absolute',height: '7px', width: '1px', float: 'right', marginTop: `calc(${(detail.quoteData.measure === 'ft' ? detail.quoteData.boxHeight : detail.quoteData.boxHeight / 304.8)*screen}px - 3px)`, marginLeft:  `calc(${(detail.quoteData.measure === 'ft' ? detail.quoteData.boxWidth : detail.quoteData.boxWidth  / 304.8)*screen}px ${detail.quoteData.measure === 'ft' ? '- 3px' : '+ 2px'})`, transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                      <div style={{ position:'absolute',height: '7px', width: '1px', float: 'left', marginTop: `calc(${(detail.quoteData.measure === 'ft' ? detail.quoteData.boxHeight : detail.quoteData.boxHeight / 304.8)*screen}px - 3px)`, marginLeft: '2px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>
                      {/* outer corner lines end */}
                  </>:<></>
                  }
                  {detail.quoteData.horizontalMullion.map((row, rowIndex) => (
                      <div key={rowIndex} style={{display: 'flex',gap: '1px',height: `calc(${(row?.size) * screen}px - 5px)`,width: `calc(${detail.quoteData.boxWidth * screen}px - 10px)`,marginTop: rowIndex === 0 ? '4px' : '0px',marginBottom: '5px',marginLeft: '5px',marginRight: '4px',position: 'relative' }}>
                         {detail.quoteData.verticalMullion.map((col, colIndex) => (
                            <div key={colIndex} style={{width: `calc(${(col?.size) * screen}px - 5px)`,height: `100%`,marginLeft: colIndex === 0 ? '0px' : '4px',border: '1px solid #333',background: 'lightblue',position: 'relative'}}>       
                            {detail.quoteData.boxHeight && detail.quoteData.boxWidth > 0 && (
                              <div style={{position: 'absolute',top: '50%',left: '50%',transform: 'translate(-50%, -50%)',fontSize: '20px',fontWeight: '100',cursor: 'pointer',color: '#000',zIndex: 1 }}>+</div>
                            )}
                            </div>
                          ))}
                       </div>
                  ))}                                    
                </div>

           )}

           {detail?.quoteData?.item === 'TopHung' && (

           <>
             <div align="center" style={{ alignContent: 'center', alignItems: 'center', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>


                <div style={{ float: 'left',boxShadow: '1px 1px 5px grey' , width: detail.quoteData.boxWidth * screen / detail.quoteData.mCalc + 'px', height: detail.quoteData.boxHeight * screen / detail.quoteData.mCalc + 'px', border: '1px solid #333' }}>

                      {[...Array(detail.quoteData.numFrames)].map((_, index) => (
                        <div style={{ float: 'left', margin: '2px', border: '1px solid #333', width: `calc(${detail.quoteData.boxWidth * screen / detail.quoteData.mCalc / detail.quoteData.numFrames + 'px'} - 6px)`, height: `calc(${detail.quoteData.boxHeight * screen / detail.quoteData.mCalc + 'px'} - 6px)`,position:'relative' }}>
                        

                          {detail.quoteData.boxTop === 'on' && (

                            [...Array(detail.quoteData.numTopBoxes)].map((_, index) => (
                              <div style={{ display: 'flex', width: `calc(${detail.quoteData.boxWidth * screen / detail.quoteData.mCalc / detail.quoteData.numFrames + 'px'} - 18px)`, height: `calc(${(detail.quoteData.topnewHeights * screen / detail.quoteData.mCalc)}px )`, margin: '5px',position:'relative' }}>
                                {[...Array(detail.quoteData.topFixedNum)].map((_, index) => (
                                  <div style={{ flex: '1',  backgroundColor:'white',padding:'4px',boxSizing:'border-box', width: `calc(${detail.quoteData.topFixedWidth[index] * screen / detail.quoteData.mCalc / detail.quoteData.numFrames + 'px'} - 18px)`, height: `calc(${(detail.quoteData.topnewHeights * screen / detail.quoteData.mCalc)}px )`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px',position:'relative' }}>
                                     <div style={{
                                        width: '100%',
                                        height: '100%',
                                        border: '1px solid #333',
                                        backgroundColor:detail.quoteData.topsash[index].type === 'fixed' ? 'lightgreen' : 'lightblue', 
                                        position:'relative'
                                   }}>
                                      {/* Inner corner lines start */}
                                      <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-6.5px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                                      <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-6px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                                      <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${detail.quoteData.topnewHeights*screen/detail.quoteData.mCalc}px - 12px)`, marginRight: '-4px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                                      <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${detail.quoteData.topnewHeights*screen/detail.quoteData.mCalc}px - 12px)`, marginLeft: '-3px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>
                                      {/* Inner corner lines end */}
                                        {/* outer corner lines start for bottom sash*/}
                                       <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-12px', marginRight: '-9px', transform: 'rotate(45deg)',  background: index === detail.quoteData.topsash.length -1  ? 'black' : 'transparent'}}></div>
                                      <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-12px', marginLeft: '-9px', transform: 'rotate(-45deg)', background: index === 0 ? 'black' : 'transparent'}}></div>
                                      {/* <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${bottomnewHeights*screen/detail.quoteData.mCalc}px - 12px)`, marginRight: '-11px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                                      <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${bottomnewHeights*screen/detail.quoteData.mCalc}px - 12px)`, marginLeft: '-9px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>  */}
                                      {/* outer corner lines end */}
                                      <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${detail.quoteData.topnewHeights*screen/detail.quoteData.mCalc}px - 8px)`, marginRight: '-6px', transform: 'rotate(180deg)', background: index === detail.quoteData.topsash.length -1  ? 'black' : 'transparent' }}></div>
                                      <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${detail.quoteData.topnewHeights*screen/detail.quoteData.mCalc}px - 8px)`, marginLeft: '-6px', transform: 'rotate(180deg)', background: index === 0 ? 'black' : 'transparent' }}></div>
                          
                                     {detail.quoteData.topsash[index].type === 'shutter' ?(
                                    <>
                                      <img
                                        src={left}
                                        style={{
                                          float: 'left',
                                          marginTop: `calc(${(((detail.quoteData.topnewHeights) * screen / detail.quoteData.mCalc))}px - 25px)`,
                                          marginLeft: '45%',
                                          width: screen === 40 ? '13px' : '8px',
                                          transform: 'rotate(-90deg)'
                                        }}
                                       
                                        alt="Left Handle"
                                      />
                                      <div style={{ position: 'absolute', width: '100%', height: '100%',overflow:'hidden' }}>
                                        {/* Left Diagonal Line  */}
                                        <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(${Math.atan((detail.quoteData.topFixedWidth.length ? detail.quoteData.topFixedWidth[index] : detail.quoteData.boxWidth) / (2 * detail.quoteData.topnewHeights)) * (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>


                                        {/* Right Diagonal Line */}
                                        <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(-${Math.atan((detail.quoteData.topFixedWidth.length ? detail.quoteData.topFixedWidth[index] : detail.quoteData.boxWidth) / (2 * detail.quoteData.topnewHeights))* (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>

                                      </div>
                                      {detail.quoteData.topsash[index].type === 'shutter' && detail.quoteData.grill === 'yes' && boxes(detail.quoteData.mCalc, detail.quoteData.measure, detail.quoteData.topnewHeights + 0.5)}
                                   
                                    </>
                                  ):(
                                    <>
                                    {/* fixed plus  */}
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
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
                            {[...Array(detail.quoteData.numSecondInnerBoxes)].map((_, index) => (
 

                              <div key={index}  style={{padding:'3px', height: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc}px - ${detail.quoteData.boxTop === 'on' ? '22px' : '18px'})`, width: `calc(${detail.quoteData.newWidths[index] * screen / detail.quoteData.mCalc}px )`, backgroundColor: 'white', marginTop: detail.quoteData.boxTop === 'on' ? '0px' : '5px', marginRight: index === detail.quoteData.numSecondInnerBoxes - 1 ? '5px' : '2.5px', marginLeft: index === 0 ? '5px' : '2.5px', border: '1px solid #333',position:'relative' }}>
                                  <div style={{
                                  width: '100%',
                                  height: '100%',
                                  border: '1px solid #333',
                                  backgroundColor: detail.quoteData.boxColors[index] || 'lightblue',
                                  position:'relative'
                                }}>
                                   {/* Inner corner lines start */} 
                                 <div style={{ height: detail.quoteData.boxBottom === 'on'?'11px':'15px', width: '1px', float: 'left', marginTop: `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen) / detail.quoteData.mCalc}px - ${detail.quoteData.boxTop === 'on' ? '39px' : '35px'})`, marginLeft:detail.quoteData.boxBottom === 'on'?'-4px':'-6px', transform: 'rotate(45deg)', borderLeft: '1px solid grey' }}></div>
                                 <div  style={{ height:detail.quoteData.boxTop === 'on'?'11px':'15px', width: '1px', float: 'left', marginTop:detail.quoteData.boxTop === 'on'?'-9px':'-14px', marginLeft:detail.quoteData.boxTop === 'on'?'-4px':'-6px', transform: 'rotate(-45deg)', borderLeft: '1px solid grey' }}></div>
                                 <div style={{ height: detail.quoteData.boxTop === 'on'?'11px':'15px', width: '1px', float: 'right', marginTop:detail.quoteData.boxTop === 'on'?'-9px':'-14px', marginRight:detail.quoteData.boxTop === 'on'?'-4px':'-6px', transform: 'rotate(45deg)', borderRight: '1px solid grey' }}></div>
                                 {/* <div style={{ height: '15px', width: '1px', float: 'left', marginTop: getInnerBottom(boxHeight - topnewHeights - bottomnewHeights, screen, detail.quoteData.mCalc), marginLeft: '-4px', transform: 'rotate(-45deg)', borderLeft: index === 0 ? 'transparent' : '1px solid black' }}></div> */}
                                 <div style={{ height: detail.quoteData.boxBottom === 'on'?'11px':'15px', width: '1px', float: 'right', marginTop:`calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc}px - ${detail.quoteData.boxTop === 'on' ? '39px' : '35px'})`, marginRight:detail.quoteData.boxBottom==='on'?'-4px':'-6px', transform: 'rotate(-45deg)', borderLeft: '1px solid grey' }}></div>
                                 <div style={{ height: '10px', width: '1px', float: 'right', marginTop: `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen) / detail.quoteData.mCalc}px - ${detail.quoteData.boxBottom === 'on' ? '33px' : '27px'})`, marginRight: '-4px', transform: 'rotate(-45deg)', borderRight: index === -1 ? '1px solid grey' : 'none' }}></div>
                                 {/* <div style={{ height: '7px', width: '1px', float: 'left', right: '0px', marginTop: '-6px', marginRight: '-1px', background: index === 0 ? 'transparent' : 'black' }}></div> */}
                                {/* Inner corner lines ends */} 

                                {detail.quoteData.boxBottom==='on'?      
                                <>
                                 <div style={{ height: '10px', width: '1px', float: 'right', marginTop: `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen) / detail.quoteData.mCalc}px - ${detail.quoteData.boxBottom === 'on' ? '29px' : '27px'})`, marginRight: '-7px', transform: 'rotate(180deg)', background: index === detail.quoteData.newWidths.length -1  ? 'black' : 'transparent' }}></div>
                                 <div style={{ height: '10px', width: '1px', float: 'left', marginTop:  `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen) / detail.quoteData.mCalc}px - ${detail.quoteData.boxBottom === 'on' ? '29px' : '27px'})`, marginLeft: '-7px', transform: 'rotate(180deg)', background: index === 0 ? 'black' : 'transparent' }}></div>
                                 </>:
                                <></>}
                               
                               



                                {detail.quoteData.boxNames[index] === 'Shutter' ? (detail.quoteData.boxHandle[index] === 'left' ? (
                                  <>
                                  <img
                                    src={left}
                                    style={{
                                      position: 'absolute',
                                        transform: 'rotate(-90deg)',
                                        width: screen === 40 ? '13px' : '8px',
                                        cursor: 'pointer',
                                        marginBottom: '1px',
                                        marginTop: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc}px - ${detail.quoteData.boxTop === 'on' ? '42px' : '38px'} - ${screen===40 ? '5px':'0px'})`,
                                        marginLeft:`calc(${((detail.quoteData.numSecondInnerBoxes === 1 ? detail.quoteData.boxWidth:detail.quoteData.newWidths[index] ) )/2}px - 15px)`
                                    }}
                                   
                                    alt="Left Handle"
                                  />
                                      <div style={{ position: 'absolute', width: '100%', height: '100%',overflow:'hidden' }}>
                                        {/* Left Diagonal Line  */}
                                        <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(${Math.atan((detail.quoteData.numSecondInnerBoxes === 1 ? detail.quoteData.boxWidth:detail.quoteData.newWidths[index] )  / (2 * (detail.quoteData.boxHeight-detail.quoteData.topnewHeights-detail.quoteData.bottomnewHeights))) * (180 / Math.PI)+((detail.quoteData.boxTop === 'on' && detail.quoteData.boxBottom === 'on') ? 1.5 : 0)}deg)`, transformOrigin: 'top left' }}></div>


                                        {/* Right Diagonal Line */}
                                        <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(-${Math.atan((detail.quoteData.numSecondInnerBoxes === 1 ? detail.quoteData.boxWidth:detail.quoteData.newWidths[index] )  / (2 * (detail.quoteData.boxHeight-detail.quoteData.topnewHeights-detail.quoteData.bottomnewHeights)))* (180 / Math.PI)+((detail.quoteData.boxTop === 'on' && detail.quoteData.boxBottom === 'on') ? 1.5 : 0)}deg)`, transformOrigin: 'top left' }}></div>

                                      </div>                                 
                                  </>
                                ) : (
                                  <>
                                  <img
                                    src={right}
                                    style={{
                                      position: 'absolute',
                                        transform: 'rotate(-90deg)',
                                        width: screen === 40 ? '13px' : '8px',
                                        cursor: 'pointer',
                                        marginBottom: '1px',
                                         marginTop: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc}px - ${detail.quoteData.boxTop === 'on' ? '34px' : '30px'} - ${screen===40 ? '5px':'0px'})`,
                                        marginLeft:`calc(${((detail.quoteData.numSecondInnerBoxes === 1 ? detail.quoteData.boxWidth:detail.quoteData.newWidths[index] )  )/2}px - 15px)`
                                    }}
                                    
                                    alt="Right Handle"
                                  />
                                      <div style={{ position: 'absolute', width: '100%', height: '100%',overflow:'hidden' }}>
                                        {/* Left Diagonal Line  */}
                                        <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(${Math.atan((detail.quoteData.numSecondInnerBoxes === 1 ? detail.quoteData.boxWidth:detail.quoteData.newWidths[index] )  / (2 * (detail.quoteData.boxHeight-detail.quoteData.topnewHeights-detail.quoteData.bottomnewHeights))) * (180 / Math.PI)+((detail.quoteData.boxTop === 'on' && detail.quoteData.boxBottom === 'on') ? 1.5 : 0)}deg)`, transformOrigin: 'top left' }}></div>


                                        {/* Right Diagonal Line */}
                                        <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(-${Math.atan((detail.quoteData.numSecondInnerBoxes === 1 ? detail.quoteData.boxWidth:detail.quoteData.newWidths[index] )  / (2 * (detail.quoteData.boxHeight-detail.quoteData.topnewHeights-detail.quoteData.bottomnewHeights)))* (180 / Math.PI)+((detail.quoteData.boxTop === 'on' && detail.quoteData.boxBottom === 'on') ? 1.5 : 0)}deg)`, transformOrigin: 'top left' }}></div>

                                      </div> 
                                  </>

                                )):(
                                  <>
                                  {/* Plus Icon in Center */}
                                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '50px', fontWeight: '100', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                  
                                  </>
                                )
                              }

                                {detail.quoteData.mesh === 'yes' && detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.boxHandle[index] === 'left' && (
                                  <img src={meshimg} style={{  position: 'absolute', left: 0, width: screen === 40 ? '40px' : '15px', float: 'left',  marginTop: screen === 40 ? `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc)}px - ${detail.quoteData.boxTop === 'on' ? '75px' : '70px'} )` : `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc)}px - 50px)` }} />
                                )}

                                {detail.quoteData.mesh === 'yes' && detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.boxHandle[index] === 'right' && (
                                  <img src={meshimg} style={{width: screen === 40 ? '40px' : '20px', float: 'left', marginLeft: screen === 40 ? detail.quoteData.boxHandle[index] === 'right' ? '-1px' : '0px' : detail.quoteData.boxHandle[index] === 'right' ? '0px' : 'px', marginTop: screen === 40 ? `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc)}px - ${detail.quoteData.boxTop === 'on' ? '75px' : '70px'} )` : `calc(${((detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc)}px - 50px)` }} />
                                )}

                                 {detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.grill === 'yes' && boxes(detail.quoteData.mCalc, detail.quoteData.measure, detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights - 0.5)}

                              </div>
                           </div>
                            ))}

                          </div>

                          {detail.quoteData.boxBottom === 'on' && (
                            [...Array(detail.quoteData.numBottomBoxes)].map((_, index) => (
                              <div style={{ display: 'flex', width: `calc(${detail.quoteData.boxWidth * screen / detail.quoteData.mCalc / detail.quoteData.numFrames + 'px'} - 18px)`, height: `calc(${(detail.quoteData.bottomnewHeights * screen / detail.quoteData.mCalc) + 'px'} -10px)`, margin: '5px' }}>
                                {[...Array(detail.quoteData.bottomFixedNum)].map((_, index) => (
                                  <div style={{ flex: '1', backgroundColor:'white',padding:'4px', width: `calc(${detail.quoteData.bottomFixedWidth[index] * screen / detail.quoteData.mCalc / detail.quoteData.numFrames + 'px'} - 18px)`, height: `calc(${(detail.quoteData.bottomnewHeights * screen / detail.quoteData.mCalc) + 'px'} - 5px)`, border: 'solid 1px #000', marginLeft: index === 0 ? '0px' : '5px',position:'relative' }}>
                                   <div style={{
                                        height:'100%',
                                        width:'100%',
                                        position:'relative',
                                        backgroundColor:detail.quoteData.bottomsash[index].type === 'fixed' ? 'lightgreen' : 'lightblue',
                                        border:'1px solid black'
                                      }}>
                                     {/* inner corner lines start for bottom sash*/}
                                     <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-6.5px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                                     <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-6px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                                     <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${detail.quoteData.bottomnewHeights*screen/detail.quoteData.mCalc}px - 18px)`, marginRight: '-4px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                                     <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${detail.quoteData.bottomnewHeights*screen/detail.quoteData.mCalc}px - 18px)`, marginLeft: '-3px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>
                                     {/* inner corner lines end */}
                                      {/* outer corner lines start for bottom sash*/}
                                      {/* <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-13px', marginRight: '-9px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                                     <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-12px', marginLeft: '-9px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>*/}
                                     <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${detail.quoteData.bottomnewHeights*screen/detail.quoteData.mCalc}px - 12px)`, marginRight: '-11px', transform: 'rotate(-45deg)',background: index === detail.quoteData.bottomsash.length -1 ? 'black' : 'transparent' }}></div>
                                     <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${detail.quoteData.bottomnewHeights*screen/detail.quoteData.mCalc}px - 12px)`, marginLeft: '-9px', transform: 'rotate(45deg)', background: index === 0 ? 'black' : 'transparent'  }}></div> 
                                     {/* outer corner lines end */}
                                     {/* <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${boxHeight-topnewHeights*screen/detail.quoteData.mCalc}px - ${screen === 3 ? '28px':'24px'})`, marginRight: '-6px', transform: 'rotate(180deg)', background: index === bottomsash.length -1  ? 'black' : 'transparent' }}></div>
                                     <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${boxHeight-topnewHeights*screen/detail.quoteData.mCalc}px - ${screen === 3 ? '28px':'24px'})`, marginLeft: '-6px', transform: 'rotate(180deg)', background: index === 0 ? 'black' : 'transparent' }}></div> */}

                                   {detail.quoteData.bottomsash[index].type === 'shutter' ?(
                                        <>
                                        <img
                                          src={left}
                                          style={{
                                          float: 'left',
                                          marginTop: `calc(${(((detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc))}px - 25px)`,
                                          marginLeft: '45%',
                                          width: screen === 40 ? '13px' : '8px',
                                          transform: 'rotate(-90deg)'
                                          }}
                                          
                                          alt="Left Handle"
                                        />
                                          <div style={{ position: 'absolute', width: '100%', height: '100%',overflow:'hidden' }}>
                                             {/* Left Diagonal Line  */}
                                             <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(${Math.atan((detail.quoteData.bottomFixedWidth.length ? detail.quoteData.bottomFixedWidth[index] : detail.quoteData.boxWidth) / (2 * detail.quoteData.bottomnewHeights)) * (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>
                                         
                                         
                                             {/* Right Diagonal Line */}
                                             <div style={{ position: 'absolute', top: '0', left: '50%', width: '2px', height: '1000%', borderLeft: '1px dashed gray', transform: `rotate(-${Math.atan((detail.quoteData.bottomFixedWidth.length ? detail.quoteData.bottomFixedWidth[index] : detail.quoteData.boxWidth) / (2 * detail.quoteData.bottomnewHeights)) * (180 / Math.PI)}deg)`, transformOrigin: 'top left' }}></div>
                                         
                                          </div>  
  
                                        {detail.quoteData.bottomsash[index].type === 'shutter' && detail.quoteData.grill === 'yes' && boxes(detail.quoteData.mCalc, detail.quoteData.measure, detail.quoteData.bottomnewHeights)}
                                      </>
                                      ):(
                                        <>
                                         {/* fixed plus  */}
                                         <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: '200', cursor: 'pointer', color: '#000', zIndex: 1 }}>+</div>
                                        </>
                                      )
                                      
                                      }
                                  </div>
                                  </div>
                                ))}
                              </div>
                            ))
                          )}

                        
                                        </div>
                                      ))}
                                    </div>
                                </div>
                          </>
                          )}
                    </div>


                  </td>
                 
                  <td colSpan={4} style={{border: '1px solid #666', padding: '2px 10px', textAlign: 'left', color: "#000", fontSize: '12px', wordWrap: 'break-word' }}>
                    <p style={{fontSize: '12px'}}>
                      {detail.quoteData?.series} ,
                      Width : {numeral(detail.quoteData.boxWidth * 1).format('0.00')} {detail?.quoteData?.measure} ,
                      Height : {numeral(detail.quoteData.boxHeight * 1).format('0.00')} {detail?.quoteData?.measure} ,
                      Area : {numeral(detail.quoteData.frameArea).format('0.00')} sqft
                    </p>
                    <p style={{fontSize: '12px'}}>
                        {(detail?.quoteData?.values?.steelFrame?.amount > 0 || 
                          detail?.quoteData?.values?.steelShutter?.amount > 0 ||
                          detail?.quoteData?.values?.steelMullion?.amount > 0) && <> GI Steel,  </>}  
                        {detail?.quoteData?.values?.mpl?.amount > 0 && (<> MPL, </>)}  
                        {detail?.quoteData?.values?.touchlock?.amount > 0 && (<> Touch Lock,  </>)}  
                        {detail?.quoteData?.values?.espag?.amount > 0 && (<> Espag,  </>)}  
                        {detail?.quoteData?.values?.frictionstay?.amount > 0 && (<> Friction Stay,  </>)}  
                        {detail?.quoteData?.values?.runnerblock?.amount > 0 && (<> Runner Block  </>)}  
                        {detail?.quoteData?.values?.espagm?.amount > 0 && (<> Espag with MPL, </>)}  
                        {detail?.quoteData?.values?.mullionclamp?.amount > 0 && (<> Mullion Clamp  </>)}  
                        {detail?.quoteData?.values?.adjroll?.amount > 0 && (<> Adjust Roller,  </>)}  
                        {detail?.quoteData?.values?.hings?.amount > 0 && (<> 3D Hinges,  </>)}     
                        {detail?.quoteData?.values?.glass?.amount > 0 && (<> 
                          {getItem('glass', detail?.quoteData?.boxHeight, detail?.quoteData?.boxWidth, detail?.quoteData?.values?.glass?.amount)} Glass,  
                        </>)}  
                        {detail?.quoteData?.values?.board?.amount > 0 && (<> Board,  </>)}  
                        {detail?.quoteData?.values?.alTrack?.amount > 0 && (<> Aluminium Track,  </>)}  
                        {detail?.quoteData?.values?.bArrester?.amount > 0 && (<> Bump Arrestor  </>)}  
                        {detail?.quoteData?.values?.jStopper?.amount > 0 && (<> Jump Stopper,  </>)}  
                        {detail?.quoteData?.values?.dArrester?.amount > 0 && (<> Dust Arrestor  </>)}  
                        {detail?.quoteData?.values?.gRoller?.amount > 0 && (<> Grove Roller,  </>)}  
                        {detail?.quoteData?.values?.mRoller?.amount > 0 && (<> Mesh Roller,  </>)}  
                        {detail?.quoteData?.values?.touchLock?.amount > 0 && (<> Touch Lock,  </>)}  
                        {detail?.quoteData?.values?.handle?.amount > 0 && ( <> Handle, </> )}
                        {detail?.quoteData?.values?.screws?.amount > 0 && (<> Screws/Misc  </>)}
                    </p>
                        
                  </td>
                </tr>
                <tr style={{ height: "10px" }} >
                  <th  style={{ width: '10%', border: '1px solid #666', padding: '2px 10px', textAlign: 'center', color: "#000", fontSize: '12px'}}>Price</th>
                  <th  style={{ width: '5%',  border: '1px solid #666', padding: '2px 10px', textAlign: 'center', color: "#000", fontSize: '12px'}}>Qty</th>
                  <th  style={{ width: '12%', border: '1px solid #666', padding: '2px 10px', textAlign: 'center', color: "#000", fontSize: '12px'}}>Total Sqft</th>
                  <th  style={{ width: '15%', border: '1px solid #666', padding: '2px 10px', textAlign: 'right',  color: "#000", fontSize: '12px'}}>Sub Total</th>
                </tr>
                <tr style={{ height: "25px" }}>
                  <td  style={{ border: '1px solid #666', padding: '2px 10px', textAlign: 'center', color: "#000", fontSize: '12px'}}>{numeral(parseFloat(detail.quoteData.grandTotal)).format('0.00')}</td>
                  <td  style={{ border: '1px solid #666', padding: '2px 10px', textAlign: 'center', color: "#000", fontSize: '12px'}}>{detail.quoteData.qty}</td>
                  <td  style={{ border: '1px solid #666', padding: '2px 10px', textAlign: 'center', color: "#000", fontSize: '12px'}}>{numeral(detail.quoteData.frameArea * detail.quoteData.qty).format('0.00')}</td>
                  <td  style={{ border: '1px solid #666', padding: '2px 10px', textAlign: 'right',  color: "#000", fontSize: '12px'}}>₹ {numeral(parseFloat(detail.quoteData.grandTotal) * parseFloat(detail.quoteData.qty)).format('0,0.00')}</td>
                </tr>
              </>
              ))}

              {(splits?.height <= 10 && (splits?.end - splits?.start <= 2))  && 
              <>
              <tr style={{ height: "20px" }}>
                <th rowSpan={2} colSpan={4} style={{ border: '1px solid #666', textAlign: "left", padding: '2px 10px', fontSize: '12px', color: "#000" }}>Total</th>
                <th style={{ border: '1px solid #666', textAlign: "center", padding: '2px 10px', fontSize: '12px', color: "#000" }}>Price/sqft</th>
                <th style={{width: '6%', border: '1px solid #666', textAlign: "center", padding: '2px 10px', color: "#000", fontSize: '12px', }}>Qty</th>
                <th style={{width: '15%', border: '1px solid #666', textAlign: "center", padding: '2px 10px', color: "#000", fontSize: '12px', }}>Total Area</th>
                <th style={{width: '20%', border: '1px solid #666', textAlign: "right", padding: '2px 10px', fontSize: '12px', color: "#000" }}>Amount</th>
            </tr>

            <tr style={{ height: "40px" }}>
              <th style={{ border: '1px solid #666', textAlign: "center", padding: '2px 10px', fontSize: '12px', color: "#000" }}>{numeral(average).format('0.00')}</th>
              <th style={{ border: '1px solid #666', textAlign: "center", padding: '2px 10px', color: "#000", fontSize: '12px', }}>{qty}</th>
              <th style={{ border: '1px solid #666', textAlign: "center", padding: '2px 10px', color: "#000", fontSize: '12px', }}>{numeral(totalframearea).format('0.00')}</th>
              <th style={{ border: '1px solid #666', textAlign: "right", padding: '2px 10px', fontSize: '12px', color: "#000" }}>₹ {numeral(total).format('0,0.00')}</th>
            </tr>

            <tr>
              <td colSpan={2} rowSpan={discountprice> 0 ? 3 : 2} width="13%" className='bank-info' style={{ textAlign: "left", padding: '5px 10px', fontSize: '12px', color: "#000", borderBottom: '1px solid #333' }}>
                <b>Bank<br />
                  Branch<br />
                  A/c Type<br />
                  A/C Number<br />
                  IFS Code<br /></b>

              </td>
              <td colSpan={2} rowSpan={discountprice> 0 ? 3 : 2}  width="40.2%" className='bank-info'  style={{ textAlign: "left", padding:'5px 10px', fontSize: '12px', color: "#000", borderBottom: '1px solid #333' }}>
                :  {brandDatas && brandDatas[0].companyBank}<br />
                :  {brandDatas && brandDatas[0].companyBranch}<br />
                :  {brandDatas && brandDatas[0].companyBankType}<br />
                :  {brandDatas && brandDatas[0].companyAcNum}<br />
                :  {brandDatas && brandDatas[0].companyIfsc}<br />

              </td>
              {toggle === false &&
                <> 
                  <td colSpan={2} style={{ border: '1px solid #666', textAlign: "left", padding: '2px 10px', fontSize: '12px', color: "#000" }}>GST 18%</td>
                  <td colSpan={2} style={{ border: '1px solid #666', textAlign: "right", padding: '2px 10px', fontSize: '12px', color: "#000" }}>₹ {numeral(gst).format('0,0.00')}</td>
                </>
              }
            </tr>

             {discountprice > 0 && 
                <tr>
                  <td colSpan={2} style={{ border: '1px solid #666', textAlign: "left", padding: '2px 10px', fontSize: '12px', color: "#000" }}>Discount</td>
                  <td colSpan={2} style={{ border: '1px solid #666', textAlign: "right", padding: '2px 10px', fontSize: '12px', color: "#000" }}>- ₹{parseFloat(discountprice).toFixed(2)} ({discount}%)</td>
                </tr>
              }

            <tr>
              <th colSpan={2} style={{ border: '1px solid #666', textAlign: "left", padding: '2px 10px', fontSize: '12px', color: "#000" }}>Grand Total</th>
              {toggle === false ? 
                <th colSpan={2} style={{ border: '1px solid #666', textAlign: "right", padding: '2px 10px', fontSize: '12px', color: "#000" }}>₹ {numeral(totalaftrdis + gst).format('0,0.00')}</th>
              :
                <th colSpan={2} style={{ border: '1px solid #666', textAlign: "right", padding: '2px 10px', fontSize: '12px', color: "#000" }}>₹  {numeral(totalaftrdis).format('0,0.00')}</th>
              }
            </tr>
       
            <tr>
              <td colSpan={4} width="50%" className='text-left' style={{ textAlign: 'left', padding: '100px 0px 0px 8px', color: "#000", fontSize: '12px' }}>  for <b>{filteredQuotes && filteredQuotes[0]?.client?.name}</b> </td>
              <td colSpan={4} width="50%" className='text-right' style={{ textAlign: 'right', padding: '100px 8px 0px 0px', color: "#000", fontSize: '12px' }}>for <b>{ (brandDatas && brandDatas[0]?.companyName) || localStorage.getItem("businessName") || "Pari and Co" }</b></td>
            </tr>
            <tr>
              <td colSpan={4} width="50%" className='text-left' style={{ textAlign: 'left', color: "#000", fontSize: '12px' }}> &nbsp; </td>
              <td colSpan={4} width="50%" className='text-right' style={{ textAlign: 'right', color: "#000", fontSize: '12px' }}> {Name} </td>
            </tr>
            <tr>
              <td colSpan={4} width="50%" className='text-left' style={{ textAlign: 'left', color: "#000", fontSize: '12px', borderBottom: '1px solid #000' }}> {filteredQuotes && filteredQuotes[0]?.client?.number} </td>
              <td colSpan={4} width="50%" className='text-right' style={{ textAlign: 'right', color: "#000", fontSize: '12px', borderBottom: '1px solid #000' }}> {Number} </td>
            </tr>

            <tr>
              <td colSpan={4} width="50%" className='text-right' style={{ textAlign: 'left' }}>
                <p className='mt-2 mb-2'> www.pariandco.com</p>
              </td>
              <td colSpan={4} width="50%" className='text-right' style={{ textAlign: 'right' }}>
                
              </td>
            </tr>
            </>
            }

            </tbody>
          ))}
        </table>
      </div>
    )}

    {(splitter[splitter?.length -1]?.height > 10 || ( splitter[splitter?.length -1]?.end - splitter[splitter?.length -1]?.start > 2))  &&  

    <div className='pageCutting' style={{borderTop: '2px solid #ffffff'}}>
        <table className='force-break' style={{ width: "100%", border: '1px solid #666', borderCollapse: 'collapse', marginTop: '60px'}} width="100%" id="third-table" >
            <tr style={{ height: "20px" }}>
                <th rowSpan={2} colSpan={2} style={{ border: '1px solid #666', textAlign: "left", padding: '2px 10px', fontSize: '12px', color: "#000" }}>Total</th>
                <th style={{ border: '1px solid #666', textAlign: "center", padding: '2px 10px', fontSize: '12px', color: "#000" }}>Price/sqft</th>
                <th style={{width: '6%', border: '1px solid #666', textAlign: "center", padding: '2px 10px', color: "#000", fontSize: '12px', }}>Qty</th>
                <th style={{width: '15%', border: '1px solid #666', textAlign: "center", padding: '2px 10px', color: "#000", fontSize: '12px', }}>Total Area</th>
                <th style={{width: '20%', border: '1px solid #666', textAlign: "right", padding: '2px 10px', fontSize: '12px', color: "#000" }}>Amount</th>
            </tr>

            <tr style={{ height: "40px" }}>
              <th style={{ border: '1px solid #666', textAlign: "center", padding: '2px 10px', fontSize: '12px', color: "#000" }}>{numeral(average).format('0.00')}</th>
              <th style={{ border: '1px solid #666', textAlign: "center", padding: '2px 10px', color: "#000", fontSize: '12px', }}>{qty}</th>
              <th style={{ border: '1px solid #666', textAlign: "center", padding: '2px 10px', color: "#000", fontSize: '12px', }}>{numeral(totalframearea).format('0.00')}</th>
              <th style={{ border: '1px solid #666', textAlign: "right", padding: '2px 10px', fontSize: '12px', color: "#000" }}>₹ {numeral(total).format('0,0.00')}</th>
            </tr>

            <tr>
              <td  rowSpan={discountprice> 0 ? 3 : 2} width="13%" className='bank-info' style={{ textAlign: "left", padding: '5px 10px', fontSize: '12px', color: "#000", borderBottom: '1px solid #333' }}>
                <b>Bank<br />
                  Branch<br />
                  A/c Type<br />
                  A/C Number<br />
                  IFS Code<br /></b>

              </td>
              <td  rowSpan={discountprice> 0 ? 3 : 2}  width="40.2%" className='bank-info'  style={{ textAlign: "left", padding:'5px 10px', fontSize: '12px', color: "#000", borderBottom: '1px solid #333' }}>
                :  {brandDatas && brandDatas[0].companyBank}<br />
                :  {brandDatas && brandDatas[0].companyBranch}<br />
                :  {brandDatas && brandDatas[0].companyBankType}<br />
                :  {brandDatas && brandDatas[0].companyAcNum}<br />
                :  {brandDatas && brandDatas[0].companyIfsc}<br />

              </td>
              {toggle !== false &&
                <> 
                  <th colSpan={2} style={{ border: '1px solid #666', textAlign: "left", padding: '2px 10px', fontSize: '12px', color: "#000" }}>GST 18%</th>
                  <td colSpan={2} style={{ border: '1px solid #666', textAlign: "right", padding: '2px 10px', fontSize: '12px', color: "#000" }}>₹ {numeral(gst).format('0,0.00')}</td>
                </>
              }
            </tr>

             {discountprice > 0 && 
                <tr>
                  <td colSpan={2} style={{ border: '1px solid #666', textAlign: "left", padding: '2px 10px', fontSize: '12px', color: "#000" }}>Discount</td>
                  <td colSpan={2} style={{ border: '1px solid #666', textAlign: "right", padding: '2px 10px', fontSize: '12px', color: "#000" }}> - ₹ {parseFloat(discountprice).toFixed(2)} ({discount}%)</td>
                </tr>
              }

            <tr>
              <th colSpan={2} style={{ border: '1px solid #666', textAlign: "left", padding: '2px 10px', fontSize: '12px', color: "#000" }}>Grand Total</th>
              {toggle === false ? 
                <th colSpan={2} style={{ border: '1px solid #666', textAlign: "right", padding: '2px 10px', fontSize: '12px', color: "#000" }}>₹ {numeral(totalaftrdis).format('0,0.00')}</th>
              :
                <th colSpan={2} style={{ border: '1px solid #666', textAlign: "right", padding: '2px 10px', fontSize: '12px', color: "#000" }}>₹ {numeral(totalaftrdis+gst).format('0,0.00')}</th>
              }
            </tr>
       
            <tr>
              <td colSpan={3} width="50%" className='text-left' style={{ textAlign: 'left', padding: '100px 0px 0px 8px', color: "#000", fontSize: '12px' }}>  for <b>{filteredQuotes && filteredQuotes[0]?.client?.name}</b> </td>
              <td colSpan={3} width="50%" className='text-right' style={{ textAlign: 'right', padding: '100px 8px 0px 0px', color: "#000", fontSize: '12px' }}>for <b>{ (brandDatas && brandDatas[0]?.companyName) || localStorage.getItem("businessName") || "Pari and Co" }</b></td>
            </tr>
            <tr>
              <td colSpan={3} width="50%" className='text-left' style={{ textAlign: 'left', color: "#000", fontSize: '12px' }}> &nbsp; </td>
              <td colSpan={3} width="50%" className='text-right' style={{ textAlign: 'right', color: "#000", fontSize: '12px' }}> {Name} </td>
            </tr>
            <tr>
              <td colSpan={3} width="50%" className='text-left' style={{ textAlign: 'left', color: "#000", fontSize: '12px', borderBottom: '1px solid #000' }}> {filteredQuotes && filteredQuotes[0]?.client?.number} </td>
              <td colSpan={3} width="50%" className='text-right' style={{ textAlign: 'right', color: "#000", fontSize: '12px', borderBottom: '1px solid #000' }}> {Number} </td>
            </tr>

            <tr>
              <td colSpan={3} width="50%" className='text-right' style={{ textAlign: 'left' }}>
                <p className='mt-2 mb-2'> www.pariandco.com</p>
              </td>
              <td colSpan={3} width="50%" className='text-right' style={{ textAlign: 'right' }}>
                
              </td>
            </tr>
        </table>
       </div>
      }
      </div>

    </div>

  )
}
export default Downlaod;
