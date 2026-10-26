import React, { useEffect, useState } from 'react';
import { ReactSession } from 'react-client-session';
import axios from 'axios';
import Navbar from './navbar';
import Header from './header';
import numeral from 'numeral';
import left from '../images/handleLeft.png';
import right from '../images/handleRight.png';
import meshimg from '../images/mesh.png';
import Handle from '../images/slideHandle.png';
import Fan from '../images/fan.png';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, Page, Text, View, StyleSheet, PDFViewer, BlobProvider, Image, Line } from '@react-pdf/renderer';
import casementDoorImage from '../images/casement-door.png';
import logo from '../images/favicon.svg';
import './box.css';



const styles = StyleSheet.create({
  
  arrowUp: {
    color: 'red',
    fontSize: 20,
  },
  arrowDown: {
    color: 'blue',
    fontSize: 20,
  },
  expandingArrowLine: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    top: -300,
    float: 'left',
  },
  line: {
    flexGrow: 1,
    height: 1, // Adjust this value as needed
    backgroundColor: 'black', // Adjust line color
  },
  arrowLeft: {
    width: 0,
    height: 0,
    borderTopWidth: 5, // Adjust arrow size
    borderBottomWidth: 5, // Adjust arrow size
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRightWidth: 3, // Adjust arrow color and size
    position: 'absolute',
    left: 0,
  },
  arrowRight: {
    width: 0,
    height: 0,
    borderTopWidth: 5, // Adjust arrow size
    borderBottomWidth: 5, // Adjust arrow size
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderLeftWidth: 3, // Adjust arrow color and size
    position: 'absolute',
    right: 0,
  },

  diagonalLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    borderRightWidth: 1, // Adjust the line color and thickness
    borderRightColor: '#333', // Adjust the line color and thickness
    transformOrigin: 'top left',
    transform: 'translateY(100%) rotate(-45deg)',
  },
  text: {
    fontSize: 10,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginVertical: 5,
  },
  page: {
    flexDirection: 'column',
    padding: 10,
  },
  section: {
    marginBottom: 10,
  },
  table: {
    border: '1px solid black',
    borderCollapse: 'collapse',
    width: '100%', // Make sure the table spans the entire width
  },
  th: {
      border: '1px solid black',
      backgroundColor: '#f2f2f2',
      padding: '8px',
      textAlign: 'center', // Correct the typo: 'centre' -> 'center'
      fontSize: 12,
      flexWrap: 'wrap',
      wordBreak: 'break-all',
  },
 
});


function Quotesdet({ quotes })  {
  const urlParams = new URLSearchParams(window.location.search);
  const quoteIds = urlParams.get('id');
  const arrayValues = urlParams.get('arrayValues');
  console.log(arrayValues);
  const userId = ReactSession.get('upvcuserId');
  const [quoteData, setQuoteData] = useState(null);
  const [filteredArray, setFilteredArray] = useState([]);

  const [bottomFrame, setBottomFrame] = useState('yes');
  const [mesh, setMesh] = useState('no');
  const [panelHeights, setpanelHeight] = useState(0); 
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  const [screen, setScreen] = useState(deviceWidth > 700 ? 2 : 4);
  const [fanTop, setfanTop] = useState('Top');
  const [fanLeft, setfanLeft] = useState('Left');
  const [divider, setDevider] = useState('Vertical');
  const [switchs, setSwitch] = useState('on');
  const [switchFixed, setFixed] = useState('on');
  const [fanType, setfanType] = useState(1);
  
 
  
  
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

  const fetchData = async () => {
    try {
      const response = await axios.post(`https://upvcapi.sninfoserv.com/all-quotes/`, { user: userId });
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
  console.log(filteredQuotes);

  useEffect(() => {
    if (arrayValues) {
      // Split arrayValues string into an array of values
      const valuesArray = arrayValues.split(',');

      // Filter quotes based on valuesArray
      const filtered = quotes.filter(quote =>
        valuesArray.every(value => quote.details.includes(value))
      );

      setFilteredArray(filtered);
      console.log(filtered);
    }
  }, [arrayValues, quotes]);

  
  // const handleDownloadPDF = async () => {
  //   const input = document.getElementById('pdf-content');
  //   input.classList.remove('hide');
  
  //   const pdf = new jsPDF({
  //     orientation: 'portrait', // Use 'portrait' or 'landscape' as per your requirement
  //     unit: 'pt', // Set unit to millimeters
  //     format: 'a4', // Set format to A4
  //   });
  //   const inputHeight = input.clientHeight;
  //   const pageHeight = pdf.internal.pageSize.getHeight();
  //   let currentPosition = 0;
  
  //   while (currentPosition < inputHeight) {
  //     const canvas = await html2canvas(input, {
  //       height: Math.min(pageHeight, inputHeight - currentPosition),
  //       y: currentPosition,
  //       scrollY: -currentPosition
  //     });
      
  //     const imgData = canvas.toDataURL('image/png');
  //     pdf.addImage(imgData, 'PNG', 5, 20, 550, pdf.internal.pageSize.getHeight());
  //     currentPosition += pageHeight;
  //     if (currentPosition < inputHeight) {
  //       pdf.addPage();
  //     }
     
  //   }
  //   pdf.save('downloaded-file.pdf');
    
  //   input.classList.add('hide');
  // };
  
  
  

  return (
    <div>
      <Navbar />
      <Header />
      <div className="pc-container">
        <div className="pc-content">
          <div className="row">
            <div className="col-md-12 col-xxl-12 col-xl-12">
              <div className="card">
                <div className="card-header">
                  <h5>Quotes</h5>
                  {/* <div class="col-md-12 col-xxl-12 col-xl-12"  >
                 
                 
                <HomeComponent id="pdf-content"/>
         
                <button class={`btn btn-primary ${deviceWidth > 700 ? 'large-screen' : 'small-screen'}`} onClick={handleDownloadPDF}>Download</button>

                    </div> */}


<BlobProvider document={<MyDocument />}>
  {({ blob, url, loading, error }) => (
    <div>
      {/* Your download button */}

      <PDFViewer style={{ width: '100%', height: '100vh' }}>
            <MyDocument />
          </PDFViewer>

      <a href={url} download="document.pdf">
      <button class={`btn btn-primary ${deviceWidth > 700 ? 'large-screen' : 'small-screen'}`}>Download</button>
          </a>
    </div>
  )}
</BlobProvider>
                    

                  
         
                </div>
                <div className="card-body">
                <div class="table-responsive"> 
                  <table id="left-right-fix" className="table stripe row-border order-column">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th width="10%">Short Content</th>
                      </tr>
                    </thead>
                    
                    {filteredQuotes?.map((quote, index) => (
  <tbody key={index}>
    {quote.quoteDetails.map((detail, detailIndex) => (
      <tr key={detailIndex}>
       
        <td>
        <h4 style={{ marginLeft: '10px' }}>{detail.quoteData.item}</h4>
        {detail.quoteData.item === 'CasementDoor' && (
          <div class="col-md-12 col-xxl-9 col-xl-9">
          <div class="card">
            <div class="card-body mb-5">
            
            <div>

<div style={{float:'left', width: detail.quoteData.boxWidth*screen+'vw',  height:detail.quoteData.boxHeight*screen+'vw', border:'1px solid #333', borderBottom: bottomFrame === 'no' ? '1px solid #33333350' : '1px solid #333'  }}>
{[...Array(detail.quoteData.numFrames)].map((_, index) => (
<div style={{float:'left', margin:'5px', border:'1px solid #333',width:`calc(${detail.quoteData.boxWidth*screen/detail.quoteData.numFrames+'vw'} - 12px)`, height: bottomFrame === 'no' ? `calc(${detail.quoteData.boxHeight*screen+'vw'} - 6px)` : `calc(${detail.quoteData.boxHeight*screen+'vw'} - 12px)`, } }> 
{detail.quoteData.newHeights !== 0 ? (
<>

{ detail.quoteData.boxPosition === 'Top' ? (
    <div></div>
  ) : (
    [...Array(detail.quoteData.numFirstInnerBoxes)].map((_, index) => (
<div style={{width: `calc(${detail.quoteData.boxWidth*screen/detail.quoteData.numFrames+'vw'} - 23px)`, height:`calc(${(detail.quoteData.newHeights * screen)}vw )`, background: 'lightblue', margin:'5px', border:'1px solid #333'}}></div>
))
)}

<div style={{ display: 'flex' }}>
  {[...Array(detail.quoteData.numSecondInnerBoxes)].map((_, index) => (
    <div key={index} style={{ flex: '1', height: bottomFrame === 'no' ? `calc(${(detail.quoteData.boxHeight - detail.quoteData.newHeights) * screen}vw - 23px)` : `calc(${(detail.quoteData.boxHeight - detail.quoteData.newHeights) * screen}vw - 30px)`, width: `calc(${detail.quoteData.newWidths[index] * screen}vw - 5px - 19px)`, backgroundColor: detail.quoteData.panelType === 1 ? 'lightgray' : detail.quoteData.panelType === 2 ? 'lightyellow' : 'lightblue', marginTop: detail.quoteData.boxPosition === 'Top' ? '5px' : '0px', marginRight: index === detail.quoteData.numSecondInnerBoxes - 1 ? '5px' : '2.5px', marginLeft: index === 0 ? '5px' : '2.5px', border: '1px solid #333' }}>
     
            <div className="expanding-arrow-line" style={{ 
              position: 'absolute',
              float:'left', 
              width: `calc(${detail.quoteData.newWidths[index] * screen}vw - 15px)`,
              bottom:'-10px', 
              top: `calc(${detail.quoteData.boxHeight* screen}vw - 25px)`,
              
             }}>
              <div className="arrow-left"></div>
                <div className="line" align="center">
                  <div style={{marginTop:'-7px',background:'white',maxWidth:'20px',textAlign:'center'}}><p>{typeof detail.quoteData.newWidths[index] === 'number' ? detail.quoteData.newWidths[index].toFixed(2) : detail.quoteData.newWidths[index]}</p></div>
                </div>
              <div className="arrow-right"></div>
            </div>
     
     
      { index === 0 && ( detail.quoteData.boxHandle[index] === 'left' ? (
           <img
           src={left}
           width='15'
           style={{
             float: 'left',
             marginTop: (detail.quoteData.boxHeight) * ((screen/2)-(screen/15))+'vw',
             marginLeft: '2px',
             width: screen === 4 ? '13px' : '8px'
           }}
           
           alt="Left Handle"
         />
       ) : (
         <img
           src={right}
           width='15'
           style={{
             float: 'right',
             marginTop: (detail.quoteData.boxHeight) * ((screen/2)-(screen/15))+'vw',
             marginRight: '2px',
             width: screen === 4 ? '13px' : '8px'
           }}
           
           alt="Right Handle"
         />
       ) )}


            { mesh === 'yes' ? (
              <img src={meshimg} style={{width:'50px', float:'left', marginLeft: detail.quoteData.boxHandle[index] === 'left' ? '-15px' : '0px', marginTop: `calc(${((detail.quoteData.boxHeight-detail.quoteData.newHeights)*screen)}vw - ${bottomFrame === 'no' ? '76px' : '80px' })`}} />
              ):(<></>)
            }
      
            

    </div>

  ))}
  
</div>
{ detail.quoteData.boxPosition === 'Bottom' ? (
    <div></div>
  ) : (
    [...Array(detail.quoteData.numFirstInnerBoxes)].map((_, index) => (
<div style={{width: `calc(${detail.quoteData.boxWidth*screen/detail.quoteData.numFrames+'vw'} - 23px)`, height:`calc(${(detail.quoteData.newHeights * screen)}vw )`, background: 'lightgreen', margin:'5px', border:'1px solid #333'}}></div>
))
)}

{ detail.quoteData.numSecondInnerBoxes === 0 ? (
      <div className="expanding-arrow-line" style={{ float:'left', marginLeft:'-5px', width:((detail.quoteData.boxWidth/detail.quoteData.numFrames)* screen)+'vw',top:(detail.quoteData.boxHeight-detail.quoteData.newHeights)*screen+'vw', }} >
      <div className="arrow-left"></div>
      <div className="line" align="center">
        <div style={{marginTop:'-8px',background:'white',maxWidth:'40px',textAlign:'center'}}><p>{typeof (detail.quoteData.boxWidth/detail.quoteData.numFrames) === 'number' ? (detail.quoteData.boxWidth/detail.quoteData.numFrames).toFixed(2) : (detail.quoteData.boxWidth/detail.quoteData.numFrames)}</p></div>
      </div>
      <div className="arrow-right"></div>
    </div>
    ) : (
      <div className="expanding-arrow-line" style={{ float:'left', marginLeft:'-5px', width:((detail.quoteData.boxWidth/detail.quoteData.numFrames)* screen)+'vw',bottom:'-10px',top:'50px', }} >
        <div className="arrow-left"></div>
        <div className="line" align="center">
          <div style={{marginTop:'-8px',background:'white',maxWidth:'40px',textAlign:'center'}}><p>{typeof (detail.quoteData.boxWidth/detail.quoteData.numFrames) === 'number' ? (detail.quoteData.boxWidth/detail.quoteData.numFrames).toFixed(2) : (detail.quoteData.boxWidth/detail.quoteData.numFrames)}</p></div>
        </div>
        <div className="arrow-right"></div>
      </div>
    )}
</>
) : (
<>
<div style={{ display: 'flex' }}>
{[...Array(detail.quoteData.numSecondInnerBoxes)].map((_, index) => (
  panelHeights === 0 ? (
  <div key={index} style={{ flex: '1', height: bottomFrame === 'no' ? `calc(${(detail.quoteData.boxHeight) * screen}vw - 18px )` : `calc(${(detail.quoteData.boxHeight) * screen}vw - 23px )`, width: `calc(${detail.quoteData.newWidths[index] * screen}vw - 5px - 19px)`, backgroundColor: detail.quoteData.panelType === 1 ? 'lightgray' : detail.quoteData.panelType === 2 ? 'lightyellow' : 'lightblue', marginRight: index === detail.quoteData.numSecondInnerBoxes - 1 ? '5px' : '2.5px', marginLeft: index === 0 ? '5px' : '2.5px', border: '1px solid #333',marginTop:'5px' }}>
   
   <div className="expanding-arrow-line" style={{ 
              float:'left', 
              width: `calc(${detail.quoteData.newWidths[index] * screen}vw - 20px)`,
              bottom:'-10px', 
              top: detail.quoteData.boxHeight * screen + 'vw',
             
             }}>
              <div className="arrow-left"></div>
                <div className="line" align="center">
                  <div style={{marginTop:'-7px',background:'white',maxWidth:'20px',textAlign:'center'}}><p>{typeof detail.quoteData.newWidths[index] === 'number' ? detail.quoteData.newWidths[index].toFixed(2) : detail.quoteData.newWidths[index]}</p></div>
                </div>
              <div className="arrow-right"></div>
            </div>
   
    { index === 0 &&  detail.quoteData.boxHandle[index] === 'left' && (
    
            <img
              src={right}
              width='15'
              style={{
                float: 'right',
                marginTop: (detail.quoteData.boxHeight) * ((screen/2)-(screen/15))+'vw',
                marginRight: '2px',
                width: screen === 4 ? '13px' : '8px'
              }}
              
              alt="Left Handle"
            />
            

          )}  
          { index === 1 &&  detail.quoteData.boxHandle[index] === 'right' &&(
         
            <img
              src={left}
              width='15'
              style={{
                float: 'left',
                marginTop: (detail.quoteData.boxHeight) * ((screen/2)-(screen/15))+'vw',
                marginLeft: '2px',
                width: screen === 4 ? '13px' : '8px'
              }}
              
              alt="Right Handle"
            />
            
          )}


           { mesh === 'yes' ? (
              <img src={meshimg} style={{width:'50px', float:'left', marginLeft: detail.quoteData.boxHandle[index] === 'left' ? '-15px' : '0px', marginTop: `calc(${((detail.quoteData.boxHeight-detail.quoteData.newHeights)*screen)}vw - ${bottomFrame === 'no' ? '71px' : '75px' })`}} />
              ):(<></>)
            }
           
            
            
         
  </div>
  ) : (
    <div key={index} style={{  height: panelHeights*screen+'vw', minWidth:`calc(${detail.quoteData.newWidths[index] * screen}vw - 5px - 19px)`, backgroundColor: 'lightblue', border: '1px solid #333',margin:'5px 5px 5px'}}>
  
    <div key={index} style={{ height: bottomFrame === 'no' ? `calc(${(detail.quoteData.boxHeight-panelHeights) * screen}vw - 18px )` : `calc(${(detail.quoteData.boxHeight-panelHeights) * screen}vw - 30px )`, width: `calc(${detail.quoteData.newWidths[index] * screen}vw - 5px - 19px)`, backgroundColor: detail.quoteData.boxColors[index] || 'lightblue',  border: '1px solid #333',marginTop: `calc(${panelHeights * screen}vw + 5px )` }}>
      {  index === 0 && ( detail.quoteData.boxHandle[index] === 'left' ? (
        <>
              <img
                src={left}
                width='15'
                style={{
                  float: 'left',
                  marginTop: (detail.quoteData.boxHeight) * ((screen/2)-(screen/15))+'vw',
                  marginLeft: '2px',
                  width: screen === 4 ? '13px' : '8px'
                }}
                
                alt="Left Handle"
              />
              
              </>
            ) : (
              <>
              <img
                src={right}
                width='15'
                style={{
                  float: 'right',
                  marginTop: (detail.quoteData.boxHeight) * ((screen/2)-(screen/15))+'vw',
                  marginRight: '2px',
                  width: screen === 4 ? '13px' : '8px'
                }}
                
                alt="Right Handle"
              />
              
              </>
            ) )}
             { mesh === 'yes' ? (
              <img src={meshimg} style={{width:'50px', float:'left',  bottom:'0px', marginTop:`calc(${(detail.quoteData.boxHeight) * screen}vw - 75px )` }} />
             ):(<></>)}
             
              
              <div className="expanding-arrow-line" style={{ 
                float:'left', 
                width: `calc(${detail.quoteData.newWidths[index] * screen}vw - 25px)`,
                 
                ...(index === 0 && mesh === 'yes' && { top: detail.quoteData.boxHeight * ((screen/2)-(screen*0.43)) + 'vw' }),
                ...(index === 0 && mesh === 'no' && { top: detail.quoteData.boxHeight * (1.3) + 'vw' }),
                ...(index !== 0 && mesh === 'yes' &&  { top: detail.quoteData.boxHeight * (0.27) + 'vw' }),
                ...(index !== 0 && mesh === 'no' &&  { top: detail.quoteData.boxHeight * ((screen/2)+(screen/2.02)) + 'vw' }),
               }}>
                <div className="arrow-left"></div>
                  <div className="line" align="center">
                    <div style={{marginTop:'-7px',background:'white',maxWidth:'20px',textAlign:'center'}}><p>{typeof detail.quoteData.newWidths[index] === 'number' ? detail.quoteData.newWidths[index].toFixed(2) : detail.quoteData.newWidths[index]}</p></div>
                  </div>
                <div className="arrow-right"></div>
              </div>
           
    </div>
    </div>
  )
))}
</div> 
    { detail.quoteData.numSecondInnerBoxes === 0 ? (
      <div className="expanding-arrow-line" style={{ float:'left', marginLeft:'-5px', width:((detail.quoteData.boxWidth/detail.quoteData.numFrames)* screen)+'vw', top:detail.quoteData.boxHeight*screen+'vw',  }} >
      <div className="arrow-left"></div>
      <div className="line" align="center">
        <div style={{marginTop:'-8px',background:'white',maxWidth:'40px',textAlign:'center'}}><p>{typeof (detail.quoteData.boxWidth/detail.quoteData.numFrames) === 'number' ? (detail.quoteData.boxWidth/detail.quoteData.numFrames).toFixed(2) : (detail.quoteData.boxWidth/detail.quoteData.numFrames)}</p></div>
      </div>
      <div className="arrow-right"></div>
    </div>
    ) : (
      <div className="expanding-arrow-line" style={{ float:'left', marginLeft:'-5px', width:((detail.quoteData.boxWidth/detail.quoteData.numFrames)* screen)+'vw', bottom:'-10px',top:'40px', }} >
        <div className="arrow-left"></div>
        <div className="line" align="center">
          <div style={{marginTop:'-8px',background:'white',maxWidth:'40px',textAlign:'center'}}><p>{typeof (detail.quoteData.boxWidth/detail.quoteData.numFrames) === 'number' ? (detail.quoteData.boxWidth/detail.quoteData.numFrames).toFixed(2) : (detail.quoteData.boxWidth/detail.quoteData.numFrames)}</p></div>
        </div>
        <div className="arrow-right"></div>
      </div>
    )}
</>
)}
</div>
 ))}
</div>

{ detail.quoteData.boxPosition === 'Top' ? (
detail.quoteData.newHeights === 0 ? (

  <div style={{ width: '30px', float: 'left', paddingLeft: '15px', textAlign: 'left' }}>
    <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw)`, top: '0', position: 'relative' }}>
     <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
     <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
       <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.boxHeight * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof detail.quoteData.boxHeight === 'number' ? detail.quoteData.boxHeight.toFixed(2) : detail.quoteData.boxHeight}</p></div>
     </div>
     <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
    </div>
  </div>
) : (  
    <>
      <div style={{ width: '30px', float: 'left', paddingLeft: '15px', textAlign: 'left' }}>

        <div className="expanding-arrow-line" style={{order: 1, flex:1, float: 'left', height: `calc(${(detail.quoteData.boxHeight-detail.quoteData.newHeights) * screen}vw - 20px)`, top: '0', position: 'relative' }}>
          <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
          <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
            <div style={{ marginLeft: '-10px', marginTop: (detail.quoteData.boxHeight-detail.quoteData.newHeights) * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof (detail.quoteData.boxHeight-detail.quoteData.newHeights) === 'number' ? (detail.quoteData.boxHeight-detail.quoteData.newHeights).toFixed(2) : (detail.quoteData.boxHeight-detail.quoteData.newHeights)}</p></div>
          </div>
          <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
        </div>
         <div className="expanding-arrow-line" style={{order: 2, flex:2, float: 'left', height: `calc(${detail.quoteData.newHeights * screen}vw `, top: `calc(${(detail.quoteData.boxHeight-detail.quoteData.newHeights) * screen}vw - 10px)`, position: 'relative' }}>
          <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
          <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
            <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.newHeights * (((screen/2)-(screen/5)))+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof detail.quoteData.newHeights === 'number' ? detail.quoteData.newHeights.toFixed(2) : detail.quoteData.newHeights}</p></div>
          </div>
          <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
        </div>

      </div>

      <div style={{ width: '30px', float: 'left', paddingLeft: '0px', textAlign: 'left' }}>
      <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw)`, top: '0', position: 'relative' }}>
       <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
       <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
         <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.boxHeight * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof detail.quoteData.boxHeight === 'number' ? detail.quoteData.boxHeight.toFixed(2) : detail.quoteData.boxHeight}</p></div>
       </div>
       <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
      </div>
    </div>
    </>
)
) : (
detail.quoteData.newHeights === 0 ? (

  <div style={{ width: '30px', float: 'left', paddingLeft: '15px', textAlign: 'left' }}>
    <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw)`, top: '0', position: 'relative' }}>
     <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
     <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
       <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.boxHeight * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof detail.quoteData.boxHeight === 'number' ? detail.quoteData.boxHeight.toFixed(2) : detail.quoteData.boxHeight}</p></div>
     </div>
     <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
    </div>
  </div>
) : (  
    <>
      <div style={{ width: '30px', float: 'left', paddingLeft: '15px', textAlign: 'left' }}>
        <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.newHeights * screen}vw + 10px)`, top: '0', position: 'relative' }}>
          <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
          <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
            <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.newHeights * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof detail.quoteData.newHeights === 'number' ? detail.quoteData.newHeights.toFixed(2) : detail.quoteData.newHeights}</p></div>
          </div>
          <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
        </div>
        <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight-detail.quoteData.newHeights) * screen}vw - 20px)`, top: `calc(${detail.quoteData.newHeights * screen}vw + 20px)`, position: 'relative' }}>
          <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
          <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
            <div style={{ marginLeft: '-10px', marginTop: (detail.quoteData.boxHeight-detail.quoteData.newHeights) * ((screen/2)-(screen/8))+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof (detail.quoteData.boxHeight-detail.quoteData.newHeights) === 'number' ? (detail.quoteData.boxHeight-detail.quoteData.newHeights).toFixed(2) : (detail.quoteData.boxHeight-detail.quoteData.newHeights)}</p></div>
          </div>
          <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
        </div>
      </div>
      <div style={{ width: '30px', float: 'left', paddingLeft: '0px', textAlign: 'left' }}>
      <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw)`, top: '0', position: 'relative' }}>
       <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
       <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
         <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.boxHeight * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof detail.quoteData.boxHeight === 'number' ? detail.quoteData.boxHeight.toFixed(2) : detail.quoteData.boxHeight}</p></div>
       </div>
       <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
      </div>
    </div>
    </>
)
)}
  
</div>
              
            </div>
          </div>
        </div>
        )}
         {detail.quoteData.item === 'CasementWindow' && (
         <div class="col-md-12 col-xxl-9 col-xl-9">
         <div class="card">
           <div class="card-body mb-5">
           
           <div>

<div style={{float:'left', width: detail.quoteData.boxWidth*screen+'vw', height:detail.quoteData.boxHeight*screen+'vw', border:'1px solid #333'}}>
{[...Array(detail.quoteData.numFrames)].map((_, index) => (
<div style={{float:'left', margin:'5px', border:'1px solid #333',width:`calc(${detail.quoteData.boxWidth*screen/detail.quoteData.numFrames+'vw'} - 12px)`, height:`calc(${detail.quoteData.boxHeight*screen+'vw'} - 12px)`}}> 
{detail.quoteData.newHeights !== 0 ? (
<>

{ detail.quoteData.boxPosition === 'Top' ? (
   <div></div>
 ) : (
   [...Array(detail.quoteData.numFirstInnerBoxes)].map((_, index) => (
<div style={{width: `calc(${detail.quoteData.boxWidth*screen/detail.quoteData.numFrames+'vw'} - 23px)`, height:`calc(${(detail.quoteData.newHeights * screen)}vw )`, background: 'lightgreen', margin:'5px', border:'1px solid #333'}}></div>
))
)}

<div style={{ display: 'flex' }}>
 {[...Array(detail.quoteData.numSecondInnerBoxes)].map((_, index) => (
   <div key={index} style={{ flex: '1', height: `calc(${(detail.quoteData.boxHeight - detail.quoteData.newHeights) * screen}vw - 30px)`, width: `calc(${detail.quoteData.newWidths[index] * screen}vw - 5px - 19px)`, backgroundColor: detail.quoteData.boxColors[index] || 'lightblue', marginTop: detail.quoteData.boxPosition === 'Top' ? '5px' : '0px', marginRight: index === detail.quoteData.numSecondInnerBoxes - 1 ? '5px' : '2.5px', marginLeft: index === 0 ? '5px' : '2.5px', border: '1px solid #333' }}>
    
           <div className="expanding-arrow-line" style={{ 
             position: 'absolute',
             float:'left', 
             width: `calc(${detail.quoteData.newWidths[index] * screen}vw - 15px)`,
             bottom:'-10px', 
             top: `calc(${detail.quoteData.boxHeight * screen}vw - 25px)` ,
            
            }}>
             <div className="arrow-left"></div>
               <div className="line" align="center">
                 <div style={{marginTop:'-7px',background:'white',maxWidth:'20px',textAlign:'center'}}><p>{typeof detail.quoteData.newWidths[index] === 'number' ? detail.quoteData.newWidths[index].toFixed(2) : detail.quoteData.newWidths[index]}</p></div>
               </div>
             <div className="arrow-right"></div>
           </div>

    
    
     { detail.quoteData.boxNames[index] === 'Shutter' && ( detail.quoteData.boxHandle[index] === 'left' ? (
           <img
             src={left}
             style={{
               float: 'left',
               marginTop: `calc(${(((detail.quoteData.boxHeight-detail.quoteData.newHeights)*screen)/2)}vw - 15px`,
               marginLeft: '2px',
               width: screen === 4 ? '13px' : '8px'
             }}
             
             alt="Left Handle"
           />
         ) : (
           <img
             src={right}
             style={{
               float: 'right',
               marginTop: `calc(${(((detail.quoteData.boxHeight-detail.quoteData.newHeights)*screen)/2)}vw - 15px`,
               marginRight: '2px',
               width: screen === 4 ? '13px' : '8px'
             }}
             
             alt="Right Handle"
           />
           
         ) )}

           {mesh === 'yes' && detail.quoteData.boxNames[index] === 'Shutter' && (
             <img src={meshimg} style={{width:'50px', float:'left', marginLeft: detail.quoteData.boxHandle[index] === 'left' ? '-15px' : '0px', marginTop: `calc(${((detail.quoteData.boxHeight-detail.quoteData.newHeights)*screen)}vw - 82px)`}} />
             )
           }
         
           
   </div>

 ))}
 
</div>
{ detail.quoteData.boxPosition === 'Bottom' ? (
   <div></div>
 ) : (
   [...Array(detail.quoteData.numFirstInnerBoxes)].map((_, index) => (
<div style={{width: `calc(${detail.quoteData.boxWidth*screen/detail.quoteData.numFrames+'vw'} - 23px)`, height:`calc(${(detail.quoteData.newHeights * screen)}vw )`, background: 'lightgreen', margin:'5px', border:'1px solid #333'}}></div>
))
)}

{ detail.quoteData.numSecondInnerBoxes === 0 ? (
     <div className="expanding-arrow-line" style={{ float:'left', marginLeft:'-5px', width:((detail.quoteData.boxWidth/detail.quoteData.numFrames)* screen)+'vw',top:(detail.quoteData.boxHeight-detail.quoteData.newHeights)*screen+'vw', }} >
     <div className="arrow-left"></div>
     <div className="line" align="center">
       <div style={{marginTop:'-8px',background:'white',maxWidth:'40px',textAlign:'center'}}><p>{typeof (detail.quoteData.boxWidth/detail.quoteData.numFrames) === 'number' ? (detail.quoteData.boxWidth/detail.quoteData.numFrames).toFixed(2) : (detail.quoteData.boxWidth/detail.quoteData.numFrames)}</p></div>
     </div>
     <div className="arrow-right"></div>
   </div>
   ) : (
     <div className="expanding-arrow-line" style={{ float:'left', marginLeft:'-5px', width:((detail.quoteData.boxWidth/detail.quoteData.numFrames)* screen)+'vw',bottom:'-10px',top:'50px', }} >
       <div className="arrow-left"></div>
       <div className="line" align="center">
         <div style={{marginTop:'-8px',background:'white',maxWidth:'40px',textAlign:'center'}}><p>{typeof (detail.quoteData.boxWidth/detail.quoteData.numFrames) === 'number' ? (detail.quoteData.boxWidth/detail.quoteData.numFrames).toFixed(2) : (detail.quoteData.boxWidth/detail.quoteData.numFrames)}</p></div>
       </div>
       <div className="arrow-right"></div>
     </div>
   )}
</>
) : (
<>
<div style={{ display: 'flex' }}>
{[...Array(detail.quoteData.numSecondInnerBoxes)].map((_, index) => (
 <div key={index} style={{ flex: '1', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 23px)`, width: `calc(${detail.quoteData.newWidths[index] * screen}vw - 5px - 19px)`, backgroundColor: detail.quoteData.boxColors[index] || 'lightblue', marginRight: index === detail.quoteData.numSecondInnerBoxes - 1 ? '5px' : '2.5px', marginLeft: index === 0 ? '5px' : '2.5px', border: '1px solid #333',marginTop:'5px' }}>
   
           <div className="expanding-arrow-line" style={{ 
             float:'left', 
             width: `calc(${detail.quoteData.newWidths[index] * screen}vw - 15px)`,
             bottom:'-10px', 
             top: detail.quoteData.boxHeight *screen + 'vw',
            
            }}>
             <div className="arrow-left"></div>
               <div className="line" align="center">
                 <div style={{marginTop:'-7px',background:'white',maxWidth:'20px',textAlign:'center'}}><p>{typeof detail.quoteData.newWidths[index] === 'number' ? detail.quoteData.newWidths[index].toFixed(2) : detail.quoteData.newWidths[index]}</p></div>
               </div>
             <div className="arrow-right"></div>
           </div>
   
           
   
   { detail.quoteData.boxNames[index] === 'Shutter' && ( detail.quoteData.boxHandle[index] === 'left' ? (
           <img
             src={left}
             width='15px'
             style={{
               float: 'left',
               marginTop: `calc(${((detail.quoteData.boxHeight*screen)/2)}vw - 15px`,
               marginLeft: '2px',
               width: screen === 4 ? '13px' : '8px'
             }}
             
             alt="Left Handle"
           />
         ) : (
           <img
             src={right}
             width='15px'
             style={{
               float: 'right',
               marginTop: `calc(${((detail.quoteData.boxHeight*screen)/2)}vw - 15px`,
               marginRight: '2px',
               width: screen === 4 ? '13px' : '8px',
               verticalAlign: 'bottom'
             }}
             
             alt="Right Handle"
           />
         ) )}

        
           {mesh === 'yes' && detail.quoteData.boxNames[index] === 'Shutter' && (
             <img src={meshimg} style={{width:'50px', float:'left', marginLeft: detail.quoteData.boxHandle[index] === 'left' ? '-15px' : '0px', marginTop: `calc(${(detail.quoteData.boxHeight*screen)}vw - 75px)`}} />
           )}
          

           
        
 </div>
))}
</div> 
   { detail.quoteData.numSecondInnerBoxes === 0 ? (
     <div className="expanding-arrow-line" style={{ float:'left', marginLeft:'-5px', width:((detail.quoteData.boxWidth/detail.quoteData.numFrames)* screen)+'vw', top:detail.quoteData.boxHeight*screen+'vw',  }} >
     <div className="arrow-left"></div>
     <div className="line" align="center">
       <div style={{marginTop:'-8px',background:'white',maxWidth:'40px',textAlign:'center'}}><p>{typeof (detail.quoteData.boxWidth/detail.quoteData.numFrames) === 'number' ? (detail.quoteData.boxWidth/detail.quoteData.numFrames).toFixed(2) : (detail.quoteData.boxWidth/detail.quoteData.numFrames)}</p></div>
     </div>
     <div className="arrow-right"></div>
   </div>
   ) : (
     <div className="expanding-arrow-line" style={{ float:'left', marginLeft:'-5px', width:((detail.quoteData.boxWidth/detail.quoteData.numFrames)* screen)+'vw', bottom:'-10px',top:'40px', }} >
       <div className="arrow-left"></div>
       <div className="line" align="center">
         <div style={{marginTop:'-8px',background:'white',maxWidth:'40px',textAlign:'center'}}><p>{typeof (detail.quoteData.boxWidth/detail.quoteData.numFrames) === 'number' ? (detail.quoteData.boxWidth/detail.quoteData.numFrames).toFixed(2) : (detail.quoteData.boxWidth/detail.quoteData.numFrames)}</p></div>
       </div>
       <div className="arrow-right"></div>
     </div>
   )}
</>
)}
</div>
))}
</div>

{ detail.quoteData.boxPosition === 'Top' ? (
detail.quoteData.newHeights === 0 ? (

 <div style={{ width: '30px', float: 'left', paddingLeft: '15px', textAlign: 'left' }}>
   <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw)`, top: '0', position: 'relative' }}>
    <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
    <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
      <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.boxHeight * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof detail.quoteData.boxHeight === 'number' ? detail.quoteData.boxHeight.toFixed(2) : detail.quoteData.boxHeight}</p></div>
    </div>
    <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
   </div>
 </div>
) : (  
   <>
     <div style={{ width: '30px', float: 'left', paddingLeft: '15px', textAlign: 'left' }}>

       <div className="expanding-arrow-line" style={{order: 1, flex:1, float: 'left', height: `calc(${(detail.quoteData.boxHeight-detail.quoteData.newHeights) * screen}vw - 20px)`, top: '0', position: 'relative' }}>
         <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
         <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
           <div style={{ marginLeft: '-10px', marginTop: (detail.quoteData.boxHeight-detail.quoteData.newHeights) * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof (detail.quoteData.boxHeight-detail.quoteData.newHeights) === 'number' ? (detail.quoteData.boxHeight-detail.quoteData.newHeights).toFixed(2) : (detail.quoteData.boxHeight-detail.quoteData.newHeights)}</p></div>
         </div>
         <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
       </div>
        <div className="expanding-arrow-line" style={{order: 2, flex:2, float: 'left', height: `calc(${detail.quoteData.newHeights * screen}vw `, top: `calc(${(detail.quoteData.boxHeight-detail.quoteData.newHeights) * screen}vw - 10px)`, position: 'relative' }}>
         <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
         <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
           <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.newHeights * (((screen/2)-(screen/5)))+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof detail.quoteData.newHeights === 'number' ? detail.quoteData.newHeights.toFixed(2) : detail.quoteData.newHeights}</p></div>
         </div>
         <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
       </div>

     </div>

     <div style={{ width: '30px', float: 'left', paddingLeft: '0px', textAlign: 'left' }}>
     <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw)`, top: '0', position: 'relative' }}>
      <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
      <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
        <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.boxHeight * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof detail.quoteData.boxHeight === 'number' ? detail.quoteData.boxHeight.toFixed(2) : detail.quoteData.boxHeight}</p></div>
      </div>
      <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
     </div>
   </div>
   </>
)
) : (
detail.quoteData.newHeights === 0 ? (

 <div style={{ width: '30px', float: 'left', paddingLeft: '15px', textAlign: 'left' }}>
   <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw)`, top: '0', position: 'relative' }}>
    <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
    <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
      <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.boxHeight * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof detail.quoteData.boxHeight === 'number' ? detail.quoteData.boxHeight.toFixed(2) : detail.quoteData.boxHeight}</p></div>
    </div>
    <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
   </div>
 </div>
) : (  
   <>
     <div style={{ width: '30px', float: 'left', paddingLeft: '15px', textAlign: 'left' }}>
       <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.newHeights * screen}vw + 10px)`, top: '0', position: 'relative' }}>
         <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
         <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
           <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.newHeights * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof detail.quoteData.newHeights === 'number' ? detail.quoteData.newHeights.toFixed(2) : detail.quoteData.newHeights}</p></div>
         </div>
         <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
       </div>
       <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight-detail.quoteData.newHeights) * screen}vw - 20px)`, top: `calc(${detail.quoteData.newHeights * screen}vw + 20px)`, position: 'relative' }}>
         <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
         <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
           <div style={{ marginLeft: '-10px', marginTop: (detail.quoteData.boxHeight-detail.quoteData.newHeights) * ((screen/2)-(screen/8))+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof (detail.quoteData.boxHeight-detail.quoteData.newHeights) === 'number' ? (detail.quoteData.boxHeight-detail.quoteData.newHeights).toFixed(2) : (detail.quoteData.boxHeight-detail.quoteData.newHeights)}</p></div>
         </div>
         <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
       </div>
     </div>
     <div style={{ width: '30px', float: 'left', paddingLeft: '0px', textAlign: 'left' }}>
     <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw)`, top: '0', position: 'relative' }}>
      <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
      <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
        <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.boxHeight * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof detail.quoteData.boxHeight === 'number' ? detail.quoteData.boxHeight.toFixed(2) : detail.quoteData.boxHeight}</p></div>
      </div>
      <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
     </div>
   </div>
   </>
)
)}
 
</div>
             
           </div>
         </div>
       </div>
        )}
         {detail.quoteData.item === 'SlidingDoor' && (
           <div class="col-md-12 col-xxl-9 col-xl-9">
           <div class="card">
             <div class="card-body mb-5">
             
             <div>

<div style={{float:'left', width: detail.quoteData.boxWidth*screen+'vw', height:detail.quoteData.boxHeight*screen+'vw', border:'1px solid #333'}}>
{[...Array(detail.quoteData.numFrames)].map((_, index) => (
 <div style={{float:'left', margin:'5px', border:'1px solid #333',width:`calc(${detail.quoteData.boxWidth*screen/detail.quoteData.numFrames+'vw'} - 12px)`, height:`calc(${detail.quoteData.boxHeight*screen+'vw'} - 12px)`}}> 
 {detail.quoteData.newHeights !== 0 ? (
<>
 
 { detail.quoteData.boxPosition === 'Top' ? (
     <div></div>
   ) : (
     [...Array(detail.quoteData.numFirstInnerBoxes)].map((_, index) => (
 <div style={{width: `calc(${detail.quoteData.boxWidth*screen/detail.quoteData.numFrames+'vw'} - 23px)`, height:`calc(${(detail.quoteData.newHeights * screen)}vw )`, background: 'lightgreen', margin:'5px', border:'1px solid #333'}}></div>
 ))
 )}

 <div style={{ display: 'flex' }}>
   {[...Array(detail.quoteData.numSecondInnerBoxes)].map((_, index) => (
     
     <div key={index} style={{ flex: '1', height: `calc(${(detail.quoteData.boxHeight - detail.quoteData.newHeights) * screen}vw - 30px)`, width: `calc(${detail.quoteData.newWidths[index] * screen}vw - 5px - 19px)`, backgroundColor: detail.quoteData.panelType === 1 ? 'lightgray' : detail.quoteData.panelType === 2 ? 'lightyellow' : 'lightblue', marginTop: detail.quoteData.boxPosition === 'Top' ? '5px' : '0px', marginRight: index === detail.quoteData.numSecondInnerBoxes - 1 ? '5px' : '2.5px', marginLeft: index === 0 ? '5px' : '2.5px', border: '1px solid #333' }}>
     
             <div className="expanding-arrow-line" style={{ 
               position: 'absolute',
               float:'left', 
               width: `calc(${detail.quoteData.newWidths[index] * screen}vw - 15px)`,
               bottom:'-10px', 
               top: `calc(${detail.quoteData.boxHeight * screen}vw - 25px)`,
              }}>
               <div className="arrow-left"></div>
                 <div className="line" align="center">
                   <div style={{marginTop:'-7px',background:'white',maxWidth:'20px',textAlign:'center'}}><p>{typeof detail.quoteData.newWidths[index] === 'number' ? detail.quoteData.newWidths[index].toFixed(2) : detail.quoteData.newWidths[index]}</p></div>
                 </div>
               <div className="arrow-right"></div>
             </div> 


      <div style={{
       height:'5px',
       width: '1px',
       float: 'right',
       right: '0px',
       marginTop: '-6px',
       marginRight: '-1px',
       background: index === (detail.quoteData.numSecondInnerBoxes-1) ? 'transparent' : 'black',
    }}></div>

   <div style={{
       height:'7px',
       width: '1px',
       float: 'right',
       right: '0px',
       marginTop: `calc(${(detail.quoteData.boxHeight-detail.quoteData.newHeights) * screen}vw - 31px)`,
       marginRight: '-1px',
       background: index === (detail.quoteData.numSecondInnerBoxes-1) ? 'transparent' : 'black',
    }}></div>
      
      
           { detail.quoteData.boxNames[index] !== 'Shutter' ? (<></>) : (
             <img
               src={Handle}
               height = {screen === 8 ? '15px' : '26px'}
               style={{
                 float: detail.quoteData.boxHandle[index] === 'left' ? 'left' : 'right',
                 marginTop: ((detail.quoteData.boxHeight-detail.quoteData.newHeights) * ((screen/2)-(screen/8)))+'vw',
                 marginLeft: detail.quoteData.boxHandle[index] === 'left' ? '2px' : '0px',
                 marginRight: detail.quoteData.boxHandle[index] === 'left' ? '0px' : '4px',
                 width: 'auto'
               }}
               
               alt="Handle"
             />
           )}

           {mesh === 'yes' && detail.quoteData.boxNames[index] === 'Shutter' && index % 2 === 0 && (
               <img src={meshimg} style={{width:'50px', float:'left', marginLeft: detail.quoteData.boxHandle[index] === 'left' ? '-6px' : '0px', marginTop: `calc(${((detail.quoteData.boxHeight-detail.quoteData.newHeights)*screen)}vw - 80px)`}} />
               )
           }
           
             

     </div>

   ))}
   
 </div>
 { detail.quoteData.boxPosition === 'Bottom' ? (
     <div></div>
   ) : (
     [...Array(detail.quoteData.numFirstInnerBoxes)].map((_, index) => (
 <div style={{width: `calc(${detail.quoteData.boxWidth*screen/detail.quoteData.numFrames+'vw'} - 23px)`, height:`calc(${(detail.quoteData.newHeights * screen)}vw )`, background: 'lightgreen', margin:'5px', border:'1px solid #333'}}></div>
 ))
 )}

 { detail.quoteData.numSecondInnerBoxes === 0 ? (
       <div className="expanding-arrow-line" style={{ float:'left', marginLeft:'-5px', width:((detail.quoteData.boxWidth/detail.quoteData.numFrames)* screen)+'vw',top:(detail.quoteData.boxHeight-detail.quoteData.newHeights)*screen+'vw', }} >
       <div className="arrow-left"></div>
       <div className="line" align="center">
         <div style={{marginTop:'-8px',background:'white',maxWidth:'40px',textAlign:'center'}}><p>{typeof (detail.quoteData.boxWidth/detail.quoteData.numFrames) === 'number' ? (detail.quoteData.boxWidth/detail.quoteData.numFrames).toFixed(2) : (detail.quoteData.boxWidth/detail.quoteData.numFrames)}</p></div>
       </div>
       <div className="arrow-right"></div>
     </div>
     ) : (
       <div className="expanding-arrow-line" style={{ float:'left', marginLeft:'-5px', width:((detail.quoteData.boxWidth/detail.quoteData.numFrames)* screen)+'vw',bottom:'-10px',top:'50px', }} >
         <div className="arrow-left"></div>
         <div className="line" align="center">
           <div style={{marginTop:'-8px',background:'white',maxWidth:'40px',textAlign:'center'}}><p>{typeof (detail.quoteData.boxWidth/detail.quoteData.numFrames) === 'number' ? (detail.quoteData.boxWidth/detail.quoteData.numFrames).toFixed(2) : (detail.quoteData.boxWidth/detail.quoteData.numFrames)}</p></div>
         </div>
         <div className="arrow-right"></div>
       </div>
     )}
</>
) : (
<>
<div style={{ display: 'flex' }}>
 {[...Array(detail.quoteData.numSecondInnerBoxes)].map((_, index) => (
   <>
   
   <div key={index} style={{ flex: '1', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 23px)`, width: `calc(${detail.quoteData.newWidths[index] * screen}vw - 5px - 19px)`, backgroundColor: detail.quoteData.panelType === 1 ? 'lightgray' : detail.quoteData.panelType === 2 ? 'lightyellow' : 'lightblue', marginRight: index === detail.quoteData.numSecondInnerBoxes - 1 ? '5px' : '2.5px', marginLeft: index === 0 ? '5px' : '2.5px', border: '1px solid #333',marginTop:'5px' }}>
           
            <div className="expanding-arrow-line" style={{ 
               position: 'absolute',
               float:'left', 
               width: `calc(${detail.quoteData.newWidths[index] * screen}vw - 15px)`,
               bottom:'-10px', 
               top: `calc(${detail.quoteData.boxHeight * screen}vw - 35px)`,
              }}>
               <div className="arrow-left"></div>
                 <div className="line" align="center">
                   <div style={{marginTop:'-7px',background:'white',maxWidth:'20px',textAlign:'center'}}><p>{typeof detail.quoteData.newWidths[index] === 'number' ? detail.quoteData.newWidths[index].toFixed(2) : detail.quoteData.newWidths[index]}</p></div>
                 </div>
               <div className="arrow-right"></div>
             </div> 


   <div style={{
       height:'5px',
       width: '1px',
       float: 'right',
       right: '0px',
       marginTop: '-6px',
       marginRight: '-1px',
       background: index === (detail.quoteData.numSecondInnerBoxes-1) ? 'transparent' : 'black',
    }}></div>

   <div style={{
       height:'5px',
       width: '1px',
       float: 'right',
       right: '0px',
       marginTop: `calc(${(detail.quoteData.boxHeight) * screen}vw - 24px)`,
       marginRight: '-1px',
       background: index === (detail.quoteData.numSecondInnerBoxes-1) ? 'transparent' : 'black',
    }}></div>
        
        
          { detail.quoteData.boxNames[index] !== 'Shutter' ? (<></>) : (
             <img
               src={Handle}
               height = {screen === 8 ? '15px' : '26px'}
               style={{
                 float: detail.quoteData.boxHandle[index] === 'left' ? 'left' : 'right',
                 marginTop: (detail.quoteData.boxHeight) * ((screen/2)-(screen/13))+'vw',
                 marginLeft: detail.quoteData.boxHandle[index] === 'left' ? '2px' : '0px',
                 marginRight: detail.quoteData.boxHandle[index] === 'left' ? '0px' : '4px',
                 width: 'auto'
               }}
               
               alt="Handle"
             />
           )}
            
           {mesh === 'yes' && detail.quoteData.boxNames[index] === 'Shutter' && index % 2 === 0 && (
               <img src={meshimg} style={{width:'50px', float:'left', marginLeft: detail.quoteData.boxHandle[index] === 'left' ? '-6px' : '0px', marginTop: `calc(${((detail.quoteData.boxHeight-detail.quoteData.newHeights)*screen)}vw - 75px)`}} />
               )
           }
          
   </div>
   </>
 ))}
</div> 
     { detail.quoteData.numSecondInnerBoxes === 0 ? (
       <div className="expanding-arrow-line" style={{ float:'left', marginLeft:'-5px', width:((detail.quoteData.boxWidth/detail.quoteData.numFrames)* screen)+'vw', top:detail.quoteData.boxHeight*screen+'vw',  }} >
       <div className="arrow-left"></div>
       <div className="line" align="center">
         <div style={{marginTop:'-8px',background:'white',maxWidth:'40px',textAlign:'center'}}><p>{typeof (detail.quoteData.boxWidth/detail.quoteData.numFrames) === 'number' ? (detail.quoteData.boxWidth/detail.quoteData.numFrames).toFixed(2) : (detail.quoteData.boxWidth/detail.quoteData.numFrames)}</p></div>
       </div>
       <div className="arrow-right"></div>
     </div>
     ) : (
       <div className="expanding-arrow-line" style={{ float:'left', marginLeft:'-5px', width:((detail.quoteData.boxWidth/detail.quoteData.numFrames)* screen)+'vw', bottom:'-10px',top:'40px', }} >
         <div className="arrow-left"></div>
         <div className="line" align="center">
           <div style={{marginTop:'-8px',background:'white',maxWidth:'40px',textAlign:'center'}}><p>{typeof (detail.quoteData.boxWidth/detail.quoteData.numFrames) === 'number' ? (detail.quoteData.boxWidth/detail.quoteData.numFrames).toFixed(2) : (detail.quoteData.boxWidth/detail.quoteData.numFrames)}</p></div>
         </div>
         <div className="arrow-right"></div>
       </div>
     )}
</>
 )}
 </div>
  ))}
</div>

{ detail.quoteData.boxPosition === 'Top' ? (
 detail.quoteData.newHeights === 0 ? (

   <div style={{ width: '30px', float: 'left', paddingLeft: '15px', textAlign: 'left' }}>
     <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw)`, top: '0', position: 'relative' }}>
      <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
      <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
        <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.boxHeight * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof detail.quoteData.boxHeight === 'number' ? detail.quoteData.boxHeight.toFixed(2) : detail.quoteData.boxHeight}</p></div>
      </div>
      <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
     </div>
   </div>
) : (  
     <>
       <div style={{ width: '30px', float: 'left', paddingLeft: '15px', textAlign: 'left' }}>

         <div className="expanding-arrow-line" style={{order: 1, flex:1, float: 'left', height: `calc(${(detail.quoteData.boxHeight-detail.quoteData.newHeights) * screen}vw - 20px)`, top: '0', position: 'relative' }}>
           <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
           <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
             <div style={{ marginLeft: '-10px', marginTop: (detail.quoteData.boxHeight-detail.quoteData.newHeights) * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof (detail.quoteData.boxHeight-detail.quoteData.newHeights) === 'number' ? (detail.quoteData.boxHeight-detail.quoteData.newHeights).toFixed(2) : (detail.quoteData.boxHeight-detail.quoteData.newHeights)}</p></div>
           </div>
           <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
         </div>
          <div className="expanding-arrow-line" style={{order: 2, flex:2, float: 'left', height: `calc(${detail.quoteData.newHeights * screen}vw `, top: `calc(${(detail.quoteData.boxHeight-detail.quoteData.newHeights) * screen}vw - 10px)`, position: 'relative' }}>
           <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
           <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
             <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.newHeights * (((screen/2)-(screen/5)))+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof detail.quoteData.newHeights === 'number' ? detail.quoteData.newHeights.toFixed(2) : detail.quoteData.newHeights}</p></div>
           </div>
           <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
         </div>

       </div>

       <div style={{ width: '30px', float: 'left', paddingLeft: '0px', textAlign: 'left' }}>
       <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw)`, top: '0', position: 'relative' }}>
        <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
        <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
          <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.boxHeight * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof detail.quoteData.boxHeight === 'number' ? detail.quoteData.boxHeight.toFixed(2) : detail.quoteData.boxHeight}</p></div>
        </div>
        <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
       </div>
     </div>
     </>
)
) : (
detail.quoteData.newHeights === 0 ? (

   <div style={{ width: '30px', float: 'left', paddingLeft: '15px', textAlign: 'left' }}>
     <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw)`, top: '0', position: 'relative' }}>
      <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
      <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
        <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.boxHeight * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof detail.quoteData.boxHeight === 'number' ? detail.quoteData.boxHeight.toFixed(2) : detail.quoteData.boxHeight}</p></div>
      </div>
      <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
     </div>
   </div>
) : (  
     <>
       <div style={{ width: '30px', float: 'left', paddingLeft: '15px', textAlign: 'left' }}>
         <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.newHeights * screen}vw + 10px)`, top: '0', position: 'relative' }}>
           <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
           <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
             <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.newHeights * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof detail.quoteData.newHeights === 'number' ? detail.quoteData.newHeights.toFixed(2) : detail.quoteData.newHeights}</p></div>
           </div>
           <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
         </div>
         <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight-detail.quoteData.newHeights) * screen}vw - 20px)`, top: `calc(${detail.quoteData.newHeights * screen}vw + 20px)`, position: 'relative' }}>
           <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
           <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
             <div style={{ marginLeft: '-10px', marginTop: (detail.quoteData.boxHeight-detail.quoteData.newHeights) * ((screen/2)-(screen/8))+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof (detail.quoteData.boxHeight-detail.quoteData.newHeights) === 'number' ? (detail.quoteData.boxHeight-detail.quoteData.newHeights).toFixed(2) : (detail.quoteData.boxHeight-detail.quoteData.newHeights)}</p></div>
           </div>
           <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
         </div>
       </div>
       <div style={{ width: '30px', float: 'left', paddingLeft: '0px', textAlign: 'left' }}>
       <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw)`, top: '0', position: 'relative' }}>
        <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
        <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
          <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.boxHeight * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof detail.quoteData.boxHeight === 'number' ? detail.quoteData.boxHeight.toFixed(2) : detail.quoteData.boxHeight}</p></div>
        </div>
        <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
       </div>
     </div>
     </>
)
)}
   
</div>
               
             </div>
           </div>
         </div>
        )}
        {detail.quoteData.item === 'SlidingWindow' && (
           <div class="col-md-12 col-xxl-9 col-xl-9">
           <div class="card">
             <div class="card-body mb-5">
             
             <div>

<div style={{float:'left', width: detail.quoteData.boxWidth*screen+'vw', height:detail.quoteData.boxHeight*screen+'vw', border:'1px solid #333'}}>
{[...Array(detail.quoteData.numFrames)].map((_, index) => (
 <div style={{float:'left', margin:'5px', border:'1px solid #333',width:`calc(${detail.quoteData.boxWidth*screen/detail.quoteData.numFrames+'vw'} - 12px)`, height:`calc(${detail.quoteData.boxHeight*screen+'vw'} - 12px)`}}> 
 {detail.quoteData.newHeights !== 0 ? (
<>
 
 { detail.quoteData.boxPosition === 'Top' ? (
     <div></div>
   ) : (
     [...Array(detail.quoteData.numFirstInnerBoxes)].map((_, index) => (
 <div style={{width: `calc(${detail.quoteData.boxWidth*screen/detail.quoteData.numFrames+'vw'} - 23px)`, height:`calc(${(detail.quoteData.newHeights * screen)}vw )`, background: 'lightgreen', margin:'5px', border:'1px solid #333'}}></div>
 ))
 )}

 <div style={{ display: 'flex' }}>
   {[...Array(detail.quoteData.numSecondInnerBoxes)].map((_, index) => (
     <div key={index} style={{ flex: '1', height: `calc(${(detail.quoteData.boxHeight - detail.quoteData.newHeights) * screen}vw - 30px)`, width: `calc(${detail.quoteData.newWidths[index] * screen}vw - 5px - 19px)`, backgroundColor: detail.quoteData.boxColors[index] || 'lightblue', marginTop: detail.quoteData.boxPosition === 'Top' ? '5px' : '0px', marginRight: index === detail.quoteData.numSecondInnerBoxes - 1 ? '5px' : '2.5px', marginLeft: index === 0 ? '5px' : '2.5px', border: '1px solid #333' }}>
     
             <div className="expanding-arrow-line" style={{ 
               position: 'absolute',
               float:'left', 
               width: `calc(${detail.quoteData.newWidths[index] * screen}vw - 15px)`,
               bottom:'-10px', 
               top: `calc(${detail.quoteData.boxHeight * screen}vw - 25px)`,
              }}>
               <div className="arrow-left"></div>
                 <div className="line" align="center">
                   <div style={{marginTop:'-7px',background:'white',maxWidth:'20px',textAlign:'center'}}><p>{typeof detail.quoteData.newWidths[index] === 'number' ? detail.quoteData.newWidths[index].toFixed(2) : detail.quoteData.newWidths[index]}</p></div>
                 </div>
               <div className="arrow-right"></div>
             </div>
     
      <div style={{
       height:'5px',
       width: '1px',
       float: 'right',
       right: '0px',
       marginTop: '-6px',
       marginRight: '-1px',
       background: index === (detail.quoteData.numSecondInnerBoxes-1) ? 'transparent' : 'black',
    }}></div>

   <div style={{
       height:'7px',
       width: '1px',
       float: 'right',
       right: '0px',
       marginTop: `calc(${(detail.quoteData.boxHeight-detail.quoteData.newHeights) * screen}vw - 31px)`,
       marginRight: '-1px',
       background: index === (detail.quoteData.numSecondInnerBoxes-1) ? 'transparent' : 'black',
    }}></div>
      
      
           { detail.quoteData.boxNames[index] !== 'Shutter' ? (<></>) : (
             <img
               src={Handle}
               height = {screen === 8 ? '15px' : '26px'}
               style={{
                 float: detail.quoteData.boxHandle[index] === 'left' ? 'left' : 'right',
                 marginTop: ((detail.quoteData.boxHeight-detail.quoteData.newHeights) * ((screen/2)-(screen/8)))+'vw',
                 marginLeft: detail.quoteData.boxHandle[index] === 'left' ? '2px' : '0px',
                 marginRight: detail.quoteData.boxHandle[index] === 'left' ? '0px' : '4px',
                 width: 'auto'
               }}
               
               alt="Handle"
             />
           )}
           
           {mesh === 'yes' && detail.quoteData.boxNames[index] === 'Shutter' && index % 2 === 0 && (
               <img src={meshimg} style={{width:'50px', float:'left', marginLeft: detail.quoteData.boxHandle[index] === 'left' ? '-6px' : '0px', marginTop: `calc(${((detail.quoteData.boxHeight-detail.quoteData.newHeights)*screen)}vw - 82px)`}} />
               )
           }

     </div>

   ))}
   
 </div>
 { detail.quoteData.boxPosition === 'Bottom' ? (
     <div></div>
   ) : (
     [...Array(detail.quoteData.numFirstInnerBoxes)].map((_, index) => (
 <div style={{width: `calc(${detail.quoteData.boxWidth*screen/detail.quoteData.numFrames+'vw'} - 23px)`, height:`calc(${(detail.quoteData.newHeights * screen)}vw )`, background: 'lightgreen', margin:'5px', border:'1px solid #333'}}></div>
 ))
 )}

 { detail.quoteData.numSecondInnerBoxes === 0 ? (
       <div className="expanding-arrow-line" style={{ float:'left', marginLeft:'-5px', width:((detail.quoteData.boxWidth/detail.quoteData.numFrames)* screen)+'vw',top:(detail.quoteData.boxHeight-detail.quoteData.newHeights)*screen+'vw', }} >
       <div className="arrow-left"></div>
       <div className="line" align="center">
         <div style={{marginTop:'-8px',background:'white',maxWidth:'40px',textAlign:'center'}}><p>{typeof (detail.quoteData.boxWidth/detail.quoteData.numFrames) === 'number' ? (detail.quoteData.boxWidth/detail.quoteData.numFrames).toFixed(2) : (detail.quoteData.boxWidth/detail.quoteData.numFrames)}</p></div>
       </div>
       <div className="arrow-right"></div>
     </div>
     ) : (
       <div className="expanding-arrow-line" style={{ float:'left', marginLeft:'-5px', width:((detail.quoteData.boxWidth/detail.quoteData.numFrames)* screen)+'vw',bottom:'-10px',top:'50px', }} >
         <div className="arrow-left"></div>
         <div className="line" align="center">
           <div style={{marginTop:'-8px',background:'white',maxWidth:'40px',textAlign:'center'}}><p>{typeof (detail.quoteData.boxWidth/detail.quoteData.numFrames) === 'number' ? (detail.quoteData.boxWidth/detail.quoteData.numFrames).toFixed(2) : (detail.quoteData.boxWidth/detail.quoteData.numFrames)}</p></div>
         </div>
         <div className="arrow-right"></div>
       </div>
     )}
</>
) : (
<>
<div style={{ display: 'flex' }}>
 {[...Array(detail.quoteData.numSecondInnerBoxes)].map((_, index) => (
   <>
   
   <div key={index} style={{ flex: '1', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 24px)`, width: `calc(${detail.quoteData.newWidths[index] * screen}vw - 5px - 19px)`, backgroundColor: detail.quoteData.boxColors[index] || 'lightblue', marginRight: index === detail.quoteData.numSecondInnerBoxes - 1 ? '5px' : '2.5px', marginLeft: index === 0 ? '5px' : '2.5px', border: '1px solid #333',marginTop:'5px' }}>
        

             <div className="expanding-arrow-line" style={{ 
               position: 'absolute',
               float:'left', 
               width: `calc(${detail.quoteData.newWidths[index] * screen}vw - 15px)`,
               bottom:'-10px', 
               top: `calc(${detail.quoteData.boxHeight * screen}vw - 35px)`,
              }}>
               <div className="arrow-left"></div>
                 <div className="line" align="center">
                   <div style={{marginTop:'-7px',background:'white',maxWidth:'20px',textAlign:'center'}}><p>{typeof detail.quoteData.newWidths[index] === 'number' ? detail.quoteData.newWidths[index].toFixed(2) : detail.quoteData.newWidths[index]}</p></div>
                 </div>
               <div className="arrow-right"></div>
             </div>


   <div style={{
       height:'5px',
       width: '1px',
       float: 'right',
       right: '0px',
       marginTop: '-6px',
       marginRight: '-1px',
       background: index === (detail.quoteData.numSecondInnerBoxes-1) ? 'transparent' : 'black',
    }}></div>

   <div style={{
       height:'5px',
       width: '1px',
       float: 'right',
       right: '0px',
       marginTop: `calc(${(detail.quoteData.boxHeight) * screen}vw - 24px)`,
       marginRight: '-1px',
       background: index === (detail.quoteData.numSecondInnerBoxes-1) ? 'transparent' : 'black',
    }}></div>
        
        
          { detail.quoteData.boxNames[index] !== 'Shutter' ? (<></>) : (
             <img
               src={Handle}
               height = {screen === 8 ? '15px' : '26px'}
               style={{
                 float: detail.quoteData.boxHandle[index] === 'left' ? 'left' : 'right',
                 marginTop: (detail.quoteData.boxHeight) * ((screen/2)-(screen/13))+'vw',
                 marginLeft: detail.quoteData.boxHandle[index] === 'left' ? '2px' : '0px',
                 marginRight: detail.quoteData.boxHandle[index] === 'left' ? '0px' : '4px',
                 width: 'auto'
               }}
               
               alt="Handle"
             />
           )}
             
           {mesh === 'yes' && detail.quoteData.boxNames[index] === 'Shutter' && index % 2 === 0 && (
               <img src={meshimg} style={{width:'50px', float:'left', marginLeft: detail.quoteData.boxHandle[index] === 'left' ? '-6px' : '0px', marginTop: `calc(${((detail.quoteData.boxHeight-detail.quoteData.newHeights)*screen)}vw - 75px)`}} />
               )
           }
          
   </div>
   </>
 ))}
</div> 
     { detail.quoteData.numSecondInnerBoxes === 0 ? (
       <div className="expanding-arrow-line" style={{ float:'left', marginLeft:'-5px', width:((detail.quoteData.boxWidth/detail.quoteData.numFrames)* screen)+'vw', top:detail.quoteData.boxHeight*screen+'vw',  }} >
       <div className="arrow-left"></div>
       <div className="line" align="center">
         <div style={{marginTop:'-8px',background:'white',maxWidth:'40px',textAlign:'center'}}><p>{typeof (detail.quoteData.boxWidth/detail.quoteData.numFrames) === 'number' ? (detail.quoteData.boxWidth/detail.quoteData.numFrames).toFixed(2) : (detail.quoteData.boxWidth/detail.quoteData.numFrames)}</p></div>
       </div>
       <div className="arrow-right"></div>
     </div>
     ) : (
       <div className="expanding-arrow-line" style={{ float:'left', marginLeft:'-5px', width:((detail.quoteData.boxWidth/detail.quoteData.numFrames)* screen)+'vw', bottom:'-10px',top:'40px', }} >
         <div className="arrow-left"></div>
         <div className="line" align="center">
           <div style={{marginTop:'-8px',background:'white',maxWidth:'40px',textAlign:'center'}}><p>{typeof (detail.quoteData.boxWidth/detail.quoteData.numFrames) === 'number' ? (detail.quoteData.boxWidth/detail.quoteData.numFrames).toFixed(2) : (detail.quoteData.boxWidth/detail.quoteData.numFrames)}</p></div>
         </div>
         <div className="arrow-right"></div>
       </div>
     )}
</>
 )}
 </div>
  ))}
</div>

{ detail.quoteData.boxPosition === 'Top' ? (
 detail.quoteData.newHeights === 0 ? (

   <div style={{ width: '30px', float: 'left', paddingLeft: '15px', textAlign: 'left' }}>
     <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw)`, top: '0', position: 'relative' }}>
      <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
      <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
        <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.boxHeight * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof detail.quoteData.boxHeight === 'number' ? detail.quoteData.boxHeight.toFixed(2) : detail.quoteData.boxHeight}</p></div>
      </div>
      <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
     </div>
   </div>
) : (  
     <>
       <div style={{ width: '30px', float: 'left', paddingLeft: '15px', textAlign: 'left' }}>

         <div className="expanding-arrow-line" style={{order: 1, flex:1, float: 'left', height: `calc(${(detail.quoteData.boxHeight-detail.quoteData.newHeights) * screen}vw - 20px)`, top: '0', position: 'relative' }}>
           <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
           <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
             <div style={{ marginLeft: '-10px', marginTop: (detail.quoteData.boxHeight-detail.quoteData.newHeights) * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof (detail.quoteData.boxHeight-detail.quoteData.newHeights) === 'number' ? (detail.quoteData.boxHeight-detail.quoteData.newHeights).toFixed(2) : (detail.quoteData.boxHeight-detail.quoteData.newHeights)}</p></div>
           </div>
           <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
         </div>
          <div className="expanding-arrow-line" style={{order: 2, flex:2, float: 'left', height: `calc(${detail.quoteData.newHeights * screen}vw `, top: `calc(${(detail.quoteData.boxHeight-detail.quoteData.newHeights) * screen}vw - 10px)`, position: 'relative' }}>
           <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
           <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
             <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.newHeights * (((screen/2)-(screen/5)))+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof detail.quoteData.newHeights === 'number' ? detail.quoteData.newHeights.toFixed(2) : detail.quoteData.newHeights}</p></div>
           </div>
           <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
         </div>

       </div>

       <div style={{ width: '30px', float: 'left', paddingLeft: '0px', textAlign: 'left' }}>
       <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw)`, top: '0', position: 'relative' }}>
        <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
        <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
          <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.boxHeight * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof detail.quoteData.boxHeight === 'number' ? detail.quoteData.boxHeight.toFixed(2) : detail.quoteData.boxHeight}</p></div>
        </div>
        <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
       </div>
     </div>
     </>
)
) : (
detail.quoteData.newHeights === 0 ? (

   <div style={{ width: '30px', float: 'left', paddingLeft: '15px', textAlign: 'left' }}>
     <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw)`, top: '0', position: 'relative' }}>
      <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
      <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
        <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.boxHeight * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof detail.quoteData.boxHeight === 'number' ? detail.quoteData.boxHeight.toFixed(2) : detail.quoteData.boxHeight}</p></div>
      </div>
      <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
     </div>
   </div>
) : (  
     <>
       <div style={{ width: '30px', float: 'left', paddingLeft: '15px', textAlign: 'left' }}>
         <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.newHeights * screen}vw + 10px)`, top: '0', position: 'relative' }}>
           <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
           <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
             <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.newHeights * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof detail.quoteData.newHeights === 'number' ? detail.quoteData.newHeights.toFixed(2) : detail.quoteData.newHeights}</p></div>
           </div>
           <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
         </div>
         <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${(detail.quoteData.boxHeight-detail.quoteData.newHeights) * screen}vw - 20px)`, top: `calc(${detail.quoteData.newHeights * screen}vw + 20px)`, position: 'relative' }}>
           <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
           <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
             <div style={{ marginLeft: '-10px', marginTop: (detail.quoteData.boxHeight-detail.quoteData.newHeights) * ((screen/2)-(screen/8))+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof (detail.quoteData.boxHeight-detail.quoteData.newHeights) === 'number' ? (detail.quoteData.boxHeight-detail.quoteData.newHeights).toFixed(2) : (detail.quoteData.boxHeight-detail.quoteData.newHeights)}</p></div>
           </div>
           <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
         </div>
       </div>
       <div style={{ width: '30px', float: 'left', paddingLeft: '0px', textAlign: 'left' }}>
       <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw)`, top: '0', position: 'relative' }}>
        <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
        <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
          <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.boxHeight * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof detail.quoteData.boxHeight === 'number' ? detail.quoteData.boxHeight.toFixed(2) : detail.quoteData.boxHeight}</p></div>
        </div>
        <div className="arrow-down" style={{ borderTop: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
       </div>
     </div>
     </>
)
)}
   
</div>
               
             </div>
           </div>
         </div>
        )}
  
  {detail.quoteData.item === 'Ventilator' && (
           <div class="col-md-12 col-xxl-9">
           <div class="card">
             <div class="card-body mb-5">
          {detail.quoteData.boxHeight > 1 && detail.quoteData.boxWidth > 1 && (  
           <>

           <div style={{float:'left', width: detail.quoteData.boxWidth*screen+'vw', height:detail.quoteData.boxHeight*screen+'vw', border:'1px solid #333'}}>
          
               {detail.quoteData.fanTop === 'Top' && detail.quoteData.fanLeft === 'Left' && divider === 'Vertical' && switchs === 'on' && (
                 <div style={{float:'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                   <img src={Fan} style={{float:'left', width: .85*screen+'vw', marginLeft: '4px', marginTop: '4px'}} />
                   <div style={{float:'left', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 20px)`, width: `calc(${(detail.quoteData.boxWidth-.85) * screen}vw - 26px)`, margin: '5px', border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(6/detail.quoteData.boxHeight)*screen}%, lightblue ${(6/detail.quoteData.boxHeight)*screen}%)`}}></div>
                   <div style={{float:'left', height: `calc(${(detail.quoteData.boxHeight-.85) * screen}vw - 25px)`, width: `calc(${(.85) * screen}vw - 0px)`, margin: '4px', marginTop: `calc(-${(detail.quoteData.boxHeight-.85) * screen}vw + 20px)`, border:'1px solid #333', background: 'lightblue'}}></div>
                 </div>
               )}
               
               {detail.quoteData.fanTop === 'Bottom' && detail.quoteData.fanLeft === 'Left'  && divider === 'Vertical' && switchs === 'on' && (
                   <div style={{float:'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                     <div style={{float:'left', height: `calc(${(detail.quoteData.boxHeight-.85) * screen}vw - 25px)`, width: `calc(${(.85) * screen}vw - 0px)`, margin: '4px', marginTop: '5px', border:'1px solid #333', background: 'lightblue'}}></div>
                     <div style={{float:'right', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 20px)`, width: `calc(${(detail.quoteData.boxWidth-.85) * screen}vw - 26px)`, margin: '5px', marginTop: `calc(-${(detail.quoteData.boxHeight-.85) * screen}vw + 20px)`, border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(6/detail.quoteData.boxHeight)*screen}%, lightblue ${(6/detail.quoteData.boxHeight)*screen}%)`}}></div>
                     <img src={Fan} style={{float:'left', width: .85*screen+'vw', marginLeft: '4px', marginBottom: '4px'}} />
                   </div>
               )}

               {detail.quoteData.fanTop === 'Top' && detail.quoteData.fanLeft === 'Right' &&  divider === 'Vertical' && switchs === 'on' && (
                 <div style={{float:'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                   <img src={Fan} style={{float:'right', width: .85*screen+'vw', marginRight: '4px', marginTop: '4px'}} />
                   <div style={{float:'left', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 20px)`, width: `calc(${(detail.quoteData.boxWidth-.85) * screen}vw - 26px)`, margin: '5px', border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(6/detail.quoteData.boxHeight)*screen}%, lightblue ${(6/detail.quoteData.boxHeight)*screen}%)`}}></div>
                   <div style={{float:'right', height: `calc(${(detail.quoteData.boxHeight-.85) * screen}vw - 25px)`, width: `calc(${(.85) * screen}vw - 0px)`, margin: '4px', marginTop: `calc(-${(detail.quoteData.boxHeight-.85) * screen}vw + 20px)`, border:'1px solid #333', background: 'lightblue'}}></div>
                 </div>
               )}

               {detail.quoteData.fanTop === 'Bottom' && detail.quoteData.fanLeft === 'Right' &&  divider === 'Vertical' && switchs === 'on' && (
                 <div style={{float:'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                   <div style={{float:'right', height: `calc(${(detail.quoteData.boxHeight-.85) * screen}vw - 25px)`, width: `calc(${(.85) * screen}vw - 0px)`, margin: '4px', marginTop: '5px', border:'1px solid #333', background: 'lightblue'}}></div>
                   <div style={{float:'left', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 20px)`, width: `calc(${(detail.quoteData.boxWidth-.85) * screen}vw - 26px)`, margin: '5px', marginTop: `calc(-${(detail.quoteData.boxHeight-.85) * screen}vw + 20px)`, border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(6/detail.quoteData.boxHeight)*screen}%, lightblue ${(6/detail.quoteData.boxHeight)*screen}%)`}}></div>
                   <img src={Fan} style={{float:'right', width: .85*screen+'vw', marginRight: '4px', marginBottom: '4px'}} />
                 </div>
               )}

               {detail.quoteData.fanTop === 'Top' && detail.quoteData.fanLeft === 'Left' &&  divider === 'Vertical' && switchs === 'off' && (
                 <div style={{float:'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                   <img src={Fan} style={{float:'left', width: .85*screen+'vw', marginLeft: '4px', marginTop: '4px'}} />
                   <div style={{float:'left', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 20px)`, width: `calc(${(detail.quoteData.boxWidth-.85) * screen}vw - 26px)`, margin: '5px', border:'1px solid #333', background: 'lightblue'}}></div>
                   <div style={{float:'left', height: `calc(${(detail.quoteData.boxHeight-.85) * screen}vw - 25px)`, width: `calc(${(.85) * screen}vw - 0px)`, margin: '4px', marginTop: `calc(-${(detail.quoteData.boxHeight-.85) * screen}vw + 20px)`, border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10/detail.quoteData.boxHeight)*screen}%, lightblue ${(10/detail.quoteData.boxHeight)*screen}%)`}}></div>
                 </div>
               )}
               
               {detail.quoteData.fanTop === 'Bottom' && detail.quoteData.fanLeft === 'Left' && divider === 'Vertical' && switchs === 'off' && (
                   <div style={{float:'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                     <div style={{float:'left', height: `calc(${(detail.quoteData.boxHeight-.85) * screen}vw - 25px)`, width: `calc(${(.85) * screen}vw - 0px)`, margin: '4px', marginTop: '5px', border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10/detail.quoteData.boxHeight)*screen}%, lightblue ${(10/detail.quoteData.boxHeight)*screen}%)`}}></div>
                     <div style={{float:'right', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 20px)`, width: `calc(${(detail.quoteData.boxWidth-.85) * screen}vw - 26px)`, margin: '5px', marginTop: `calc(-${(detail.quoteData.boxHeight-.85) * screen}vw + 20px)`, border:'1px solid #333', background: 'lightblue'}}></div>
                     <img src={Fan} style={{float:'left', width: .85*screen+'vw', marginLeft: '4px', marginBottom: '4px'}} />
                   </div>
               )}

               {detail.quoteData.fanTop === 'Top' && detail.quoteData.fanLeft === 'Right' &&  divider === 'Vertical' && switchs === 'off' && (
                 <div style={{float:'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                   <img src={Fan} style={{float:'right', width: .85*screen+'vw', marginRight: '4px', marginTop: '4px'}} />
                   <div style={{float:'left', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 20px)`, width: `calc(${(detail.quoteData.boxWidth-.85) * screen}vw - 26px)`, margin: '5px', border:'1px solid #333', background: 'lightblue'}}></div>
                   <div style={{float:'right', height: `calc(${(detail.quoteData.boxHeight-.85) * screen}vw - 25px)`, width: `calc(${(.85) * screen}vw - 0px)`, margin: '4px', marginTop: `calc(-${(detail.quoteData.boxHeight-.85) * screen}vw + 20px)`, border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10/detail.quoteData.boxHeight)*screen}%, lightblue ${(10/detail.quoteData.boxHeight)*screen}%)`}}></div>
                 </div>
               )}

               {detail.quoteData.fanTop === 'Bottom' && detail.quoteData.fanLeft === 'Right'  && divider === 'Vertical' && switchs === 'off' && (
                 <div style={{float:'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                   <div style={{float:'right', height: `calc(${(detail.quoteData.boxHeight-.85) * screen}vw - 25px)`, width: `calc(${(.85) * screen}vw - 0px)`, margin: '4px', marginTop: '5px', border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10/detail.quoteData.boxHeight)*screen}%, lightblue ${(10/detail.quoteData.boxHeight)*screen}%)`}}></div>
                   <div style={{float:'left', height: `calc(${(detail.quoteData.boxHeight) * screen}vw - 20px)`, width: `calc(${(detail.quoteData.boxWidth-.85) * screen}vw - 26px)`, margin: '5px', marginTop: `calc(-${(detail.quoteData.boxHeight-.85) * screen}vw + 20px)`, border:'1px solid #333', background: 'lightblue'}}></div>
                   <img src={Fan} style={{float:'right', width: .85*screen+'vw', marginRight: '4px', marginBottom: '4px'}} />
                 </div>
               )}
               
               {detail.quoteData.fanTop === 'Top' && detail.quoteData.fanLeft === 'Left' && divider === 'Horizontal' && switchs === 'on' && (
                 <div style={{float:'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                   <img src={Fan} style={{float:'left', width: .85*screen+'vw', marginLeft: '4px', marginTop: '4px'}} />
                   <div style={{float:'right', height: `calc(${(.85) * screen}vw - 0px)`, width: `calc(${(detail.quoteData.boxWidth-.85) * screen}vw - 26px)`, margin: '5px',  border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10/detail.quoteData.boxHeight)*screen}%, lightblue ${(10/detail.quoteData.boxHeight)*screen}%)`}}></div>
                   <div style={{float:'left', height: `calc(${(detail.quoteData.boxHeight-.85) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth) * screen}vw - 20px)`, margin: '4px', marginTop: '0px', border:'1px solid #333', background: 'lightblue'}}></div>
                 </div>
               )}
               
               {detail.quoteData.fanTop === 'Bottom' && detail.quoteData.fanLeft === 'Left'  && divider === 'Horizontal' && switchs === 'on' && (
                 <div style={{float:'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                   <div style={{float:'left', height: `calc(${(detail.quoteData.boxHeight-.85) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth) * screen}vw - 20px)`, margin: '4px', marginTop: '5px', border:'1px solid #333', background: 'lightblue'}}></div>
                   <div style={{float:'right', height: `calc(${(.85) * screen}vw - 0px)`, width: `calc(${(detail.quoteData.boxWidth-.85) * screen}vw - 26px)`, marginRight: '5px', marginBottom: '4px',  border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10/detail.quoteData.boxHeight)*screen}%, lightblue ${(10/detail.quoteData.boxHeight)*screen}%)`}}></div>
                   <img src={Fan} style={{float:'left', width: .85*screen+'vw', marginLeft: '4px', marginBottom: '4px'}} />
                 </div>
               )}
               
               {detail.quoteData.fanTop === 'Top' && detail.quoteData.fanLeft === 'Right'  && divider === 'Horizontal' && switchs === 'on' && (
                 <div style={{float:'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                   <img src={Fan} style={{float:'right', width: .85*screen+'vw', marginRight: '4px', marginTop: '4px'}} />
                   <div style={{float:'left', height: `calc(${(.85) * screen}vw - 0px)`, width: `calc(${(detail.quoteData.boxWidth-.85) * screen}vw - 26px)`, margin: '5px',  border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10/detail.quoteData.boxHeight)*screen}%, lightblue ${(10/detail.quoteData.boxHeight)*screen}%)`}}></div>
                   <div style={{float:'left', height: `calc(${(detail.quoteData.boxHeight-.85) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth) * screen}vw - 20px)`, margin: '4px', marginTop: '0px', border:'1px solid #333', background: 'lightblue'}}></div>
                 </div>
               )}
               
               {detail.quoteData.fanTop === 'Bottom' && detail.quoteData.fanLeft === 'Right'  && divider === 'Horizontal' && switchs === 'on' && (
                 <div style={{float:'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                   <div style={{float:'left', height: `calc(${(detail.quoteData.boxHeight-.85) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth) * screen}vw - 20px)`, margin: '4px', marginTop: '5px', border:'1px solid #333', background: 'lightblue'}}></div>
                   <div style={{float:'left', height: `calc(${(.85) * screen}vw - 0px)`, width: `calc(${(detail.quoteData.boxWidth-.85) * screen}vw - 26px)`, marginLeft: '5px', marginBottom: '4px',  border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10/detail.quoteData.boxHeight)*screen}%, lightblue ${(10/detail.quoteData.boxHeight)*screen}%)`}}></div>
                   <img src={Fan} style={{float:'right', width: .85*screen+'vw', marginRight: '4px', marginBottom: '4px'}} />
                 </div>
               )}

               {detail.quoteData.fanTop === 'Top' && detail.quoteData.fanLeft === 'Left'  && divider === 'Horizontal' && switchs === 'off' && (
                 <div style={{float:'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                   <img src={Fan} style={{float:'left', width: .85*screen+'vw', marginLeft: '4px', marginTop: '4px'}} />
                   <div style={{float:'right', height: `calc(${(.85) * screen}vw - 0px)`, width: `calc(${(detail.quoteData.boxWidth-.85) * screen}vw - 26px)`, margin: '5px',  border:'1px solid #333', background: 'lightblue' }}></div>
                   <div style={{float:'left', height: `calc(${(detail.quoteData.boxHeight-.85) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth) * screen}vw - 20px)`, margin: '4px', marginTop: '0px', border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10/detail.quoteData.boxHeight)*screen}%, lightblue ${(10/detail.quoteData.boxHeight)*screen}%)`}}></div>
                 </div>
               )}
               
               {detail.quoteData.fanTop === 'Top' && detail.quoteData.fanLeft === 'Right'  && divider === 'Horizontal' && switchs === 'off' && (
                 <div style={{float:'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                   <img src={Fan} style={{float:'right', width: .85*screen+'vw', marginRight: '4px', marginTop: '4px'}} />
                   <div style={{float:'left', height: `calc(${(.85) * screen}vw - 0px)`, width: `calc(${(detail.quoteData.boxWidth-.85) * screen}vw - 26px)`, margin: '5px',  border:'1px solid #333', background: 'lightblue' }}></div>
                   <div style={{float:'left', height: `calc(${(detail.quoteData.boxHeight-.85) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth) * screen}vw - 20px)`, margin: '4px', marginTop: '0px', border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10/detail.quoteData.boxHeight)*screen}%, lightblue ${(10/detail.quoteData.boxHeight)*screen}%)`}}></div>
                 </div>
               )}
               
               {detail.quoteData.fanTop === 'Bottom' && detail.quoteData.fanLeft === 'Right'  && divider === 'Horizontal' && switchs === 'off' && (
                 <div style={{float:'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                   <div style={{float:'left', height: `calc(${(detail.quoteData.boxHeight-.85) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth) * screen}vw - 20px)`, margin: '4px', marginTop: '5px', border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10/detail.quoteData.boxHeight)*screen}%, lightblue ${(10/detail.quoteData.boxHeight)*screen}%)`}}></div>
                   <img src={Fan} style={{float:'right', width: .85*screen+'vw', marginRight: '4px', marginTop: '0px'}} />
                   <div style={{float:'left', height: `calc(${(.85) * screen}vw - 0px)`, width: `calc(${(detail.quoteData.boxWidth-.85) * screen}vw - 26px)`, marginLeft: '4px',  border:'1px solid #333', background: 'lightblue' }}></div>
                 </div>
               )}

               {detail.quoteData.fanTop === 'Bottom' && detail.quoteData.fanLeft === 'Left'  && divider === 'Horizontal' && switchs === 'off' && (
                 <div style={{float:'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                 <div style={{float:'left', height: `calc(${(detail.quoteData.boxHeight-.85) * screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth) * screen}vw - 20px)`, margin: '4px', marginTop: '5px', border:'1px solid #333', backgroundImage: `repeating-linear-gradient(lightblue, white ${(10/detail.quoteData.boxHeight)*screen}%, lightblue ${(10/detail.quoteData.boxHeight)*screen}%)`}}></div>
                   <img src={Fan} style={{float:'left', width: .85*screen+'vw', marginLeft: '4px', marginRight: '4px'}} />
                   <div style={{float:'right', height: `calc(${(.85) * screen}vw - 0px)`, width: `calc(${(detail.quoteData.boxWidth-.85) * screen}vw - 26px)`, marginRight: '5px',  border:'1px solid #333', background: 'lightblue' }}></div>
                 </div>
               )}

           </div>
               
           </>
           
         )} 

         {detail.quoteData.boxHeight == 1 && detail.quoteData.boxWidth > 1 && (
           <>
          {detail.quoteData.switchFixed === 'on' && (  
           
             <div style={{float:'left', width: detail.quoteData.boxWidth*screen+'vw', height:detail.quoteData.boxHeight*screen+'vw', border:'1px solid #333'}}>
               <div style={{float:'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                 <img src={Fan} style={{float:'left', width: .75*screen+'vw', margin: '4px', }} />
                 <div style={{float: 'right', height: `calc(${(detail.quoteData.boxHeight)*screen}vw - 22px)`, width: `calc(${(detail.quoteData.boxWidth- .94)*screen}vw - 10px)`, marginRight: '5px', marginTop: '5px', background:'lightblue', border:'1px solid #333'}}></div>
               </div>
             </div>
           )}

           {detail.quoteData.switchFixed === 'off' && (  
           
           <div style={{float:'left', width: detail.quoteData.boxWidth*screen+'vw', height:detail.quoteData.boxHeight*screen+'vw', border:'1px solid #333'}}>
             <div style={{float:'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
               <img src={Fan} style={{float:'left', width: .75*screen+'vw', margin: '4px', }} />
               <div style={{float: 'right', height: `calc(${(detail.quoteData.boxHeight)*screen}vw - 22px)`, width: `calc(${(detail.quoteData.boxWidth- .94)*screen}vw - 10px)`, marginRight: '5px', marginTop: '5px',  backgroundImage: `repeating-linear-gradient(lightblue, white ${(6/detail.quoteData.boxHeight)*screen}%, lightblue ${(6/detail.quoteData.boxHeight)*screen}%)`, border:'1px solid #333'}}></div>
             </div>
           </div>
         )}
           </>
         )}

         {detail.quoteData.boxHeight > 1 && detail.quoteData.boxWidth == 1 && (
           <>
            {detail.quoteData.switchFixed === 'on' && (  
             <div style={{float:'left', width: detail.quoteData.boxWidth*screen+'vw', height:detail.quoteData.boxHeight*screen+'vw', border:'1px solid #333'}}>
                 <div style={{float:'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
                 <img src={Fan} style={{float:'left', width: .75*screen+'vw', margin: '4px', }} />
                 <div style={{float: 'right', height: `calc(${(detail.quoteData.boxHeight-.75)*screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth)*screen}vw - 20px)`, marginRight: '5px', background:'lightblue', border:'1px solid #333'}}></div>
               </div>
             </div>
            )}
            
            {detail.quoteData.switchFixed === 'off' && (
             <div style={{float:'left', width: detail.quoteData.boxWidth*screen+'vw', height:detail.quoteData.boxHeight*screen+'vw', border:'1px solid #333'}}>
               <div style={{float:'left', height: `calc(${detail.quoteData.boxHeight * screen}vw - 10px)`, width: `calc(${detail.quoteData.boxWidth * screen}vw - 10px)`, margin: '4px', border:'1px solid #333'}}>
               <img src={Fan} style={{float:'left', width: .75*screen+'vw', margin: '4px', }} />
               <div style={{float: 'right', height: `calc(${(detail.quoteData.boxHeight-.75)*screen}vw - 25px)`, width: `calc(${(detail.quoteData.boxWidth)*screen}vw - 20px)`, marginRight: '5px',  backgroundImage: `repeating-linear-gradient(lightblue, white ${(6/detail.quoteData.boxHeight)*screen}%, lightblue ${(6/detail.quoteData.boxHeight)*screen}%)`, border:'1px solid #333'}}></div>
               </div>
             </div>
            )}
           </>
         )}
         
         {(detail.quoteData.boxWidth > 1 || detail.quoteData.boxHeight > 1) && (
           <>
             <div className="expanding-arrow-line" style={{ 
                 position: 'absolute',
                 float:'left', 
                 width: `calc(${detail.quoteData.boxWidth * screen}vw )`,
                 bottom:'-10px', 
                 top: `calc(${detail.quoteData.boxHeight* screen}vw - 25px)`,
                 }}> 
               <div className="arrow-left"></div>
                 <div className="line" align="center">
                   <div style={{marginTop:'-7px',background:'white',maxWidth:'20px',textAlign:'center'}}><p>{typeof detail.quoteData.boxWidth === 'number' ? detail.quoteData.boxWidth.toFixed(2) : detail.quoteData.boxWidth}</p></div>
                 </div>
                 <div className="arrow-right"></div>
               </div>

           <div style={{ width: '30px', float: 'left', paddingLeft: '15px', textAlign: 'left' }}>
             <div className="expanding-arrow-line" style={{ float: 'left', height: `calc(${detail.quoteData.boxHeight * screen}vw)`, top: '0', position: 'relative' }}>
               <div className="arrow-up" style={{ borderBottom: '3px solid black', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
                 <div className="line" style={{ width: '1px', height: '100%', marginLeft: '0px', position: 'absolute', top: '0' }}>
                   <div style={{ marginLeft: '-10px', marginTop: detail.quoteData.boxHeight * (screen/2)+ 'vw', background: 'white', maxWidth: '50px', textAlign: 'center' }}><p style={{width:'20px'}}>{typeof detail.quoteData.boxHeight === 'number' ? detail.quoteData.boxHeight.toFixed(2) : detail.quoteData.boxHeight}</p></div>
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
  
  
 
        </td>
        <table>
             
             
             <tr>
               <td>
               
              
                 <div class="bg-body p-3 mt-5 rounded">
                   <div class="mt-3 row align-items-center">
                     <div class="col-10">
                       <h5 class="mb-1">Area</h5>
                       <div class="col-2">{detail.quoteData.frameArea} sqft</div>
                     </div>
                   </div>
                 </div>
           
                 
               </td>
           
               <td>
               
               <div class="bg-body p-3 mt-5 rounded">
                   <div class="mt-3 row align-items-center">
                     <div class="col-10">
                       <h5 class="mb-1">Total</h5>
                       <div class="col-2">₹ {numeral(detail.quoteData.grandTotal).format('0,0.00')}</div>
                     </div>
                   </div>
                 </div>
               </td>
           
               <td>
                 
                 
           
                
                 <div class="bg-body p-3 mt-5 rounded">
                   <div class="mt-3 row align-items-center">
                     <div class="col-10">
                       <h5 class="mb-1">Rate/sqft</h5>
                       <div class="col-2">₹ {numeral(detail.quoteData.grandTotal/detail.quoteData.frameArea).format('0,0.00')}</div>
                     </div>
                   </div>
                 </div>
               </td>
             </tr>
           </table>
           <div class="col-3">
                    <a href={`quotees?id=${quoteIds}&arrayValues=${detailIndex}`} class="btn btn-success w-100" >view</a>
                 
                    </div>
      </tr>
    ))}

  </tbody>
))}
                  </table>
                </div>
                <hr />
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const MyDocument = ({ quotes  }) => {
  const urlParams = new URLSearchParams(window.location.search);
    const quoteIds = urlParams.get('id');
    const arrayValues = urlParams.get('arrayValues');
    console.log(arrayValues);
    const userId = ReactSession.get('upvcuserId');
    const [quoteData, setQuoteData] = useState(null);
    const [filteredArray, setFilteredArray] = useState([]);
  
    const [bottomFrame, setBottomFrame] = useState('yes');
    const [mesh, setMesh] = useState('no');
    const [panelHeights, setpanelHeight] = useState(0); 
    const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
    const [screen, setScreen] = useState(deviceWidth > 700 ? 2 : 4);
    const [fanTop, setfanTop] = useState('Top');
    const [fanLeft, setfanLeft] = useState('Left');
    const [divider, setDevider] = useState('Vertical');
    const [switchs, setSwitch] = useState('on');
    const [switchFixed, setFixed] = useState('on');
    const [fanType, setfanType] = useState(1);
    
   
  
    
    
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
  
    const fetchData = async () => {
      try {
        const response = await axios.post(`https://upvcapi.sninfoserv.com/all-quotes/`, { user: userId });
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
    console.log(filteredQuotes);
  
    useEffect(() => {
      if (arrayValues) {
        // Split arrayValues string into an array of values
        const valuesArray = arrayValues.split(',');
  
        // Filter quotes based on valuesArray
        const filtered = quotes.filter(quote =>
          valuesArray.every(value => quote.details.includes(value))
        );
  
        setFilteredArray(filtered);
        console.log(filtered);
      }
    }, [arrayValues, quotes]);
  return (
    <Document>
  <Page size="A4" style={styles.page}>
    <View style={styles.section}>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <View style={{ width: '50%', textAlign: 'left' }}>
          <Image src={casementDoorImage} style={{ width: 50 }} />
          <Text style={{fontSize: '12'}}>Addess : 356/1-A, Ramanna Nagar, Thadagam Main Rd, Edayarpalayam, Coimbatore, Tamil Nadu 641025</Text>
          <Text style={{fontSize: '12'}}>+91 7708505559</Text>
        </View>
        <View style={{ width: '50%', textAlign: 'right' }}>
          <Image src={casementDoorImage} style={{ width: 50,  marginLeft:'250px' }} />
          <Text style={{fontSize: '12'}}>Name : Nandhini</Text>
          <Text style={{fontSize: '12'}}>Addess : 356/1-A, Ramanna Nagar, Thadagam Main Rd, Edayarpalayam, Coimbatore, Tamil Nadu 641025</Text>
          <Text style={{fontSize: '12'}}>+91 7708505559</Text>
        </View>
      </View>

      <View style={styles.line} />
       
      {filteredQuotes?.map((quote, index) => (
        <View style={{ flexDirection: 'row', marginBottom: 10}} key={index}>
          <View style={{ width: '50%', textAlign: 'left' }} >
            <Text style={{fontSize: '12'}}>Client: {quote.client.name}</Text>
            <Text style={{fontSize: '12'}}>Location: {quote.client.location}</Text>
            <Text style={{fontSize: '12'}}>Number: {quote.client.number}</Text>
          </View>
          <View style={{ width: '50%', textAlign: 'right' }}>
            <Text style={{fontSize: '12'}}>Date: {quote.date}</Text>
            <Text style={{fontSize: '12'}}>Id: {quote.quoteId}</Text>
          </View>
        </View>
      ))}

      <View>
        <View style={styles.table}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.th, { width: '5%' }]}>SI NO</Text>
            <Text style={[styles.th, { width: '15%' }]}>Description</Text>
            <Text style={[styles.th, { width: '10%' }]}>Design</Text>
            <Text style={[styles.th, { width: '10%' }]}>Series</Text>
            <Text style={[styles.th, { width: '20%' }]}>Hardware</Text>
            <Text style={[styles.th, { width: '5%' }]}>Wt</Text>
            <Text style={[styles.th, { width: '5%' }]}>Ht</Text>
            <Text style={[styles.th, { width: '8%' }]}>Area</Text>
            <Text style={[styles.th, { width: '5%' }]}>Qty</Text>
            <Text style={[styles.th, { width: '10%' }]}>Total Area</Text>
            <Text style={[styles.th, { width: '10%' }]}>Amount</Text>
          </View>
          <View>
            {filteredQuotes?.map((quote, index) => (
              <View key={index}>
                {quote.quoteDetails.map((detail, detailIndex) => (
                  <View style={{ flexDirection: 'row' }} key={detailIndex}>
                    <Text style={[styles.th, { width: '5%' }]}>1</Text>
                    <Text style={[styles.th, { width: '15%' }]}> {detail.quoteData.item}</Text>
                    <Text  style={[styles.th, { width: '10%' }]}>
                    {detail.quoteData.item === 'CasementDoor' && (
    <Text>
        {[...Array(detail.quoteData.numFrames)].map((_, index) => (
            <Text key={index} style={{ float: 'left', width: detail.quoteData.boxWidth * screen + 'vw', height: detail.quoteData.boxHeight * screen + 'vw', border: '1px solid #333', borderBottom: bottomFrame === 'no' ? '1px solid #33333350' : '1px solid #333' }}>
                {detail.quoteData.newHeights !== 0 ? (
                    <>
                        {detail.quoteData.boxPosition === 'Top' && (
                            <Text>
                                {[...Array(detail.quoteData.numFirstInnerBoxes)].map((_, index) => (
                                    <Text key={index} style={{ width: `calc(${detail.quoteData.boxWidth * screen / detail.quoteData.numFrames + 'vw'} - 23px)`, height: `calc(${(detail.quoteData.newHeights * screen)}vw )`, background: 'lightblue', margin: '5px', border: '1px solid #333' }}></Text>
                                ))}
                                <Text style={{ display: 'flex' }}>
                                    {[...Array(detail.quoteData.numSecondInnerBoxes)].map((_, index) => (
                                        <Text key={index} style={{ flex: '1', height: bottomFrame === 'no' ? `calc(${(detail.quoteData.boxHeight - detail.quoteData.newHeights) * screen}vw - 23px)` : `calc(${(detail.quoteData.boxHeight - detail.quoteData.newHeights) * screen}vw - 30px)`, width: `calc(${detail.quoteData.newWidths[index] * screen}vw - 5px - 19px)`, backgroundColor: detail.quoteData.panelType === 1 ? 'lightgray' : detail.quoteData.panelType === 2 ? 'lightyellow' : 'lightblue', marginTop: detail.quoteData.boxPosition === 'Top' ? '5px' : '0px', marginRight: index === detail.quoteData.numSecondInnerBoxes - 1 ? '5px' : '2.5px', marginLeft: index === 0 ? '5px' : '2.5px', border: '1px solid #333' }}>
                                            <Text style={[styles.expandingArrowLine, { position: 'absolute', float: 'left', width: `calc(${detail.quoteData.newWidths[index] * screen}vw - 15px)`, bottom: '-10px', top: `calc(${detail.quoteData.boxHeight * screen}vw - 25px)` }]}>
                                                <Text style={styles.arrowLeft}></Text>
                                                <Text style={styles.line} align="center">
                                                    <Text style={{ marginTop: '-7px', background: 'white', maxWidth: '20px', textAlign: 'center' }}><p>{typeof detail.quoteData.newWidths[index] === 'number' ? detail.quoteData.newWidths[index].toFixed(2) : detail.quoteData.newWidths[index]}</p></Text>
                                                </Text>
                                                <Text style={styles.arrowRight}></Text>
                                            </Text>
                                            {index === 0 && (detail.quoteData.boxHandle[index] === 'left' ? (
                                                <img
                                                    src={left}
                                                    width='15'
                                                    style={{
                                                        float: 'left',
                                                        marginTop: (detail.quoteData.boxHeight) * ((screen / 2) - (screen / 15)) + 'vw',
                                                        marginLeft: '2px',
                                                        width: screen === 4 ? '13px' : '8px'
                                                    }}
                                                    alt="Left Handle"
                                                />
                                            ) : (
                                                <img
                                                    src={right}
                                                    width='15'
                                                    style={{
                                                        float: 'right',
                                                        marginTop: (detail.quoteData.boxHeight) * ((screen / 2) - (screen / 15)) + 'vw',
                                                        marginRight: '2px',
                                                        width: screen === 4 ? '13px' : '8px'
                                                    }}
                                                    alt="Right Handle"
                                                />
                                            ))}
                                            {mesh === 'yes' ? (
                                                <img src={meshimg} style={{ width: '50px', float: 'left', marginLeft: detail.quoteData.boxHandle[index] === 'left' ? '-15px' : '0px', marginTop: `calc(${((detail.quoteData.boxHeight - detail.quoteData.newHeights) * screen)}vw - ${bottomFrame === 'no' ? '76px' : '80px'})` }} />
                                            ) : (<></>)}
                                        </Text>
                                    ))}
                                </Text>
                            </Text>
                        )}
                        {detail.quoteData.boxPosition === 'Bottom' && (
                            <Text>
                                {[...Array(detail.quoteData.numFirstInnerBoxes)].map((_, index) => (
                                    <Text key={index} style={{ width: `calc(${detail.quoteData.boxWidth * screen / detail.quoteData.numFrames + 'vw'} - 23px)`, height: `calc(${(detail.quoteData.newHeights * screen)}vw )`, background: 'lightgreen', margin: '5px', border: '1px solid #333' }}></Text>
                                ))}
                                {detail.quoteData.numSecondInnerBoxes === 0 ? (
                                    <Text style={[styles.expandingArrowLine, { float: 'left', marginLeft: '-5px', width: ((detail.quoteData.boxWidth / detail.quoteData.numFrames) * screen) + 'vw', top: detail.quoteData.boxHeight * screen + 'vw', }]}>
                                        <Text style={styles.arrowLeft}></Text>
                                        <Text style={styles.line} align="center">
                                            <Text style={{ marginTop: '-8px', background: 'white', maxWidth: '40px', textAlign: 'center' }}><p>{typeof (detail.quoteData.boxWidth / detail.quoteData.numFrames) === 'number' ? (detail.quoteData.boxWidth / detail.quoteData.numFrames).toFixed(2) : detail.quoteData.boxWidth / detail.quoteData.numFrames}</p></Text>
                                        </Text>
                                        <Text style={styles.arrowRight}></Text>
                                    </Text>
                                ) : (
                                    <Text style={{ display: 'flex' }}>
                                        {[...Array(detail.quoteData.numSecondInnerBoxes)].map((_, index) => (
                                            <Text key={index} style={{ flex: '1', height: bottomFrame === 'no' ? `calc(${(detail.quoteData.boxHeight - detail.quoteData.newHeights) * screen}vw - 23px)` : `calc(${(detail.quoteData.boxHeight - detail.quoteData.newHeights) * screen}vw - 30px)`, width: `calc(${detail.quoteData.newWidths[index] * screen}vw - 5px - 19px)`, backgroundColor: detail.quoteData.panelType === 1 ? 'lightgray' : detail.quoteData.panelType === 2 ? 'lightyellow' : 'lightblue', marginTop: '5px', marginRight: index === detail.quoteData.numSecondInnerBoxes - 1 ? '5px' : '2.5px', marginLeft: index === 0 ? '5px' : '2.5px', border: '1px solid #333' }}>
                                                <Text style={[styles.expandingArrowLine, { position: 'absolute', float: 'left', width: `calc(${detail.quoteData.newWidths[index] * screen}vw - 15px)`, bottom: '-10px', top: `calc(${detail.quoteData.boxHeight * screen}vw - 25px)` }]}>
                                                    <Text style={styles.arrowLeft}></Text>
                                                    <Text style={styles.line} align="center">
                                                        <Text style={{ marginTop: '-7px', background: 'white', maxWidth: '20px', textAlign: 'center' }}><p>{typeof detail.quoteData.newWidths[index] === 'number' ? detail.quoteData.newWidths[index].toFixed(2) : detail.quoteData.newWidths[index]}</p></Text>
                                                    </Text>
                                                    <Text style={styles.arrowRight}></Text>
                                                </Text>
                                                {index === 0 && (detail.quoteData.boxHandle[index] === 'left' ? (
                                                    <img
                                                        src={left}
                                                        width='15'
                                                        style={{
                                                            float: 'left',
                                                            marginTop: (detail.quoteData.boxHeight) * ((screen / 2) - (screen / 15)) + 'vw',
                                                            marginLeft: '2px',
                                                            width: screen === 4 ? '13px' : '8px'
                                                        }}
                                                        alt="Left Handle"
                                                    />
                                                ) : (
                                                    <img
                                                        src={right}
                                                        width='15'
                                                        style={{
                                                            float: 'right',
                                                            marginTop: (detail.quoteData.boxHeight) * ((screen / 2) - (screen / 15)) + 'vw',
                                                            marginRight: '2px',
                                                            width: screen === 4 ? '13px' : '8px'
                                                        }}
                                                        alt="Right Handle"
                                                    />
                                                ))}
                                                {mesh === 'yes' ? (
                                                    <img src={meshimg} style={{ width: '50px', float: 'left', marginLeft: detail.quoteData.boxHandle[index] === 'left' ? '-15px' : '0px', marginTop: `calc(${((detail.quoteData.boxHeight - detail.quoteData.newHeights) * screen)}vw - ${bottomFrame === 'no' ? '76px' : '80px'})` }} />
                                                ) : (<></>)}
                                            </Text>
                                        ))}
                                    </Text>
                                )}
                            </Text>
                        )}
                    </>
                ) : (
                    <>
                        {[...Array(detail.quoteData.numFirstInnerBoxes)].map((_, index) => (
                            <Text key={index} style={{ width: `calc(${detail.quoteData.boxWidth * screen / detail.quoteData.numFrames + 'vw'} - 23px)`, height: detail.quoteData.boxHeight * screen + 'vw', background: 'lightblue', margin: '5px', border: '1px solid #333' }}></Text>
                        ))}
                        {detail.quoteData.numSecondInnerBoxes === 0 ? (
                            <Text style={[styles.expandingArrowLine, { float: 'left', marginLeft: '-5px', width: ((detail.quoteData.boxWidth / detail.quoteData.numFrames) * screen) + 'vw', top: detail.quoteData.boxHeight * screen + 'vw', }]}>
                                <Text style={styles.arrowLeft}></Text>
                                <Text style={styles.line} align="center">
                                    <Text style={{ marginTop: '-8px', background: 'white', maxWidth: '40px', textAlign: 'center' }}><p>{typeof (detail.quoteData.boxWidth / detail.quoteData.numFrames) === 'number' ? (detail.quoteData.boxWidth / detail.quoteData.numFrames).toFixed(2) : detail.quoteData.boxWidth / detail.quoteData.numFrames}</p></Text>
                                </Text>
                                <Text style={styles.arrowRight}></Text>
                            </Text>
                        ) : (
                            <Text style={{ display: 'flex' }}>
                                {[...Array(detail.quoteData.numSecondInnerBoxes)].map((_, index) => (
                                    <Text key={index} style={{ flex: '1', height: detail.quoteData.boxHeight * screen + 'vw', width: `calc(${detail.quoteData.newWidths[index] * screen}vw - 5px - 19px)`, backgroundColor: detail.quoteData.panelType === 1 ? 'lightgray' : detail.quoteData.panelType === 2 ? 'lightyellow' : 'lightblue', marginTop: '5px', marginRight: index === detail.quoteData.numSecondInnerBoxes - 1 ? '5px' : '2.5px', marginLeft: index === 0 ? '5px' : '2.5px', border: '1px solid #333' }}>
                                        <Text style={[styles.expandingArrowLine, { position: 'absolute', float: 'left', width: `calc(${detail.quoteData.newWidths[index] * screen}vw - 15px)`, bottom: '-10px', top: detail.quoteData.boxHeight * screen + 'vw' }]}>
                                            <Text style={styles.arrowLeft}></Text>
                                            <Text style={styles.line} align="center">
                                                <Text style={{ marginTop: '-7px', background: 'white', maxWidth: '20px', textAlign: 'center' }}><p>{typeof detail.quoteData.newWidths[index] === 'number' ? detail.quoteData.newWidths[index].toFixed(2) : detail.quoteData.newWidths[index]}</p></Text>
                                            </Text>
                                            <Text style={styles.arrowRight}></Text>
                                        </Text>
                                        {index === 0 && (detail.quoteData.boxHandle[index] === 'left' ? (
                                            <img
                                                src={left}
                                                width='15'
                                                style={{
                                                    float: 'left',
                                                    marginTop: (detail.quoteData.boxHeight) * ((screen / 2) - (screen / 15)) + 'vw',
                                                    marginLeft: '2px',
                                                    width: screen === 4 ? '13px' : '8px'
                                                }}
                                                alt="Left Handle"
                                            />
                                        ) : (
                                            <img
                                                src={right}
                                                width='15'
                                                style={{
                                                    float: 'right',
                                                    marginTop: (detail.quoteData.boxHeight) * ((screen / 2) - (screen / 15)) + 'vw',
                                                    marginRight: '2px',
                                                    width: screen === 4 ? '13px' : '8px'
                                                }}
                                                alt="Right Handle"
                                            />
                                        ))}
                                        {mesh === 'yes' ? (
                                            <img src={meshimg} style={{ width: '50px', float: 'left', marginLeft: detail.quoteData.boxHandle[index] === 'left' ? '-15px' : '0px', marginTop: 'calc(' + ((detail.quoteData.boxHeight) * (screen - 1) / 2) + 'vw - ' + (screen === 4 ? '76px' : '80px') + ')' }} />
                                        ) : (<></>)}
                                    </Text>
                                ))}
                            </Text>
                        )}
                    </>
                )}
            </Text>
        ))}
    </Text>
)}

                    </Text>
                    <Text style={[styles.th, { width: '10%' }]}>200</Text>
                    <Text style={[styles.th, { width: '20%' }]}> </Text>
                    <Text style={[styles.th, { width: '5%' }]}>{detail.quoteData.boxHeight}</Text>
                    <Text style={[styles.th, { width: '5%' }]}>{detail.quoteData.boxWidth}</Text>
                    <Text style={[styles.th, { width: '8%' }]}>{detail.quoteData.frameArea}</Text>
                    <Text style={[styles.th, { width: '5%' }]}>5</Text>
                    <Text style={[styles.th, { width: '10%' }]}>₹ {numeral(detail.quoteData.grandTotal/detail.quoteData.frameArea).format('0,0.00')}</Text>
                    <Text style={[styles.th, { width: '10%' }]}>₹ {numeral(detail.quoteData.grandTotal).format('0,0.00')}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  </Page>
</Document>

  );
};


export default Quotesdet;







