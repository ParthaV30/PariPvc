import React, { useEffect, useState } from 'react';
import { ReactSession } from 'react-client-session';
import axios from 'axios';
import numeral from 'numeral';
import left from '../images/handleLeft.png';
import right from '../images/handleRight.png';
import meshimg from '../images/mesh.png';
import Handle from '../images/slideHandle.png';
import Fan from '../images/fan.png';
import { toWords } from 'number-to-words';

 function Downlaod({ quotes, gstNo, date, invoice, discount, filtereditems }) {
    const urlParams = new URLSearchParams(window.location.search);
    const quoteIds = urlParams.get('id');
    const arrayValues = urlParams.get('arrayValues');
    const userId = ReactSession.get('upvcuserId');
    const Number = ReactSession.get('upvcNumber');
    const Address = ReactSession.get('upvcAddress');
    const Name = ReactSession.get('upvcuserName');
    const Image = ReactSession.get('upvcImage');
    const regid = ReactSession.get("upvcregid");
    const userType = ReactSession.get("upvcuserType");
    const Empid = ReactSession.get("upvcempid");let users='';
    // console.log("gstNo",gstNo);

    const [des, setDes] = useState('');
    const [bankName, setBankName] = useState('');
    const [branchName, setBranchName] = useState('');
    const [acHolderName, setAcHolderName] = useState('');
    const [acType, setAcType] = useState('');
    const [acNumber, setAcNumber] = useState('');
    const [ifsc, setIfsc] = useState('');
    const [discountprice, setDiscountprice] = useState(0);
    const [totalaftrdis, setTotalaftrdis]= useState(0);


    if (userType === '3') {
      users =  Empid ;
    } else {
      users = userId ;
    }
    const user = { "userId": users };

    // console.log(user)
    

    const [quoteData, setQuoteData] = useState(null);
    const [filteredArray, setFilteredArray] = useState([]);
  
    const [bottomFrame, setBottomFrame] = useState('yes');
    const [mesh, setMesh] = useState('no');
    const [panelHeights, setpanelHeight] = useState(0); 
    const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
    const [screen, setScreen] = useState(deviceWidth > 700 ? 20 : 20);
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
    const [brandDatas, setBdata] = useState(null);
    
    
    useEffect(() => {
      const updateDeviceWidth = () => {
        setDeviceWidth(window.innerWidth);
        setScreen(window.innerWidth > 700 ? 40 : 40);
      };
  
      window.addEventListener('resize', updateDeviceWidth);
  
      return () => {
        window.removeEventListener('resize', updateDeviceWidth);
      };
    }, []);


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
    const profileImage = filteredQuotes &&  filteredQuotes[0]?.quoteDetails[0]?.quoteData?.selectedProfile || 'profile_logo';
    // console.log(filteredQuotes);
    // console.log(filtereditems);


    // Normalize filtereditems into an array of rowId strings.
    // Handles inputs like ["Ventilator-2122"] or "Ventilator-2122,Other-123"
    const filteredItemsArray = Array.isArray(filtereditems)
      ? filtereditems.map(item => String(item).split('-').pop().trim())
      : typeof filtereditems === 'string'
        ? filtereditems.split(',').map(s => String(s).split('-').pop().trim()).filter(Boolean)
        : [];

    // Filter quoteDetails by numeric rowId and always produce an array
    const filtereditem = (filteredQuotes && filteredQuotes[0]?.quoteDetails?.filter(detail =>
      filteredItemsArray.includes(String(detail.rowId))
    )) || [];

    // console.log(filtereditem);
// ...existing code...


   


    useEffect(() => {
      if (filtereditem && filtereditem.length > 0) {
        let sum = 0;
        let qty = 0;
        let totalframe = 0;
        let average = 0;
       
        filtereditem.forEach(detail => {
            qty +=(detail.quoteData.qty);
            totalframe +=(detail.quoteData.frameArea*detail.quoteData.qty);
            sum += (detail.quoteData.grandTotal*detail.quoteData.qty);
            
           // console.log(sum);
        
        });
        average=(sum/totalframe);
        const discountsAmount=(((sum*discount)/100));
        setDiscountprice(discountsAmount);
        setTotalaftrdis(sum-discountsAmount);
     //    console.log(discount);
       
        setTotal(sum);
        setQty(qty);
        setTotalFramearea(totalframe);
        //setGst((18/100)*sum);
        setGst((totalaftrdis*18)/100);
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
        //console.log(filtered);
      }
    }, [arrayValues, quotes]);
    // console.log(filtereditems);
  
    
    
  
    
  
    return (
  
  <div >

        <div class="modal fade custom-modal" id="onloadModals1" tabindex="-1" aria-labelledby="onloadModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content" align="center">
               <div class="mt-3 mb-3">
                <h5>Preparing Invoice...</h5>
               </div>
                
            </div>
          </div>
        </div>


     
    <div className='hide' id="pdf-content-invoice" style={{ padding:"20px", background: '#fff'}}>        
	    <table width='100%'  id="first-table-1">
        
        <td width='60%' style={{textAlign: 'left', padding: '20px 0px', verticalAlign: 'middle', fontSize:'12px', color:"#000"}}>
          <img 
            src={brandDatas && brandDatas[0]?.companyLogo && brandDatas[0]?.companyLogo !== 'user.png' ? `assets/user/${brandDatas[0].companyLogo}` : "/assets/images/pari-logo.png"} 
            height="55px" 
            alt="Pari and Co Logo" 
            style={{ marginRight: '10px', marginBottom: '5px', objectFit: 'contain' }} 
          /><br />
          <b style={{fontSize:'14px',}}>{brandDatas && brandDatas[0].companyName} </b><br />
          {brandDatas && brandDatas[0].companyAddress} <br />
          {brandDatas && brandDatas[0].companyContact}<br />
          GST : {gstNo !== "" ? gstNo : brandDatas && brandDatas[0]?.companyGst} 
          
        </td>

        <td width='40%' style={{ textAlign: 'right', verticalAlign: 'middle', padding: '20px 0px', fontSize:'12px', color:"#000"}}>
          <b>DATE : {date} </b><br />
          <b>Invoice No : {invoice} </b><br />
          <img 
            src={`assets/images/${profileImage}.jpg`}
            width='90px' 
            alt='Logo' 
            style={{marginTop: '20px'}}
          />
        </td>
	    </table>
      
    <table width='100%' id="first-table-2">
      <tr>
        <th style={{padding: '10px'}}> </th>
      </tr>
      <tr>
        <th  style={{ border: '1px solid #666', textAlign: 'left', padding: '10px', fontSize: '12px',  color:'#333' }}>
          Billing Address
        </th>
        <th style={{ border: '1px solid #666', textAlign: 'left', padding: '10px', fontSize: '12px',  color:'#333' }}>
          Shipping Address
        </th>
      </tr>	

		    <td width='50%' style={{ border: '1px solid #666', textAlign: 'left', padding: '10px', fontSize: '12px',  color: '#000'} }>
          {filteredQuotes?.map((quote, index) => (
          <div key={index}>
            {filteredQuotes[0].client.name} <br />
            {filteredQuotes[0].client.siteLocation} <br />
            {filteredQuotes[0].client.number}
          </div>
          ))}
         </td>
		    <td width='50%'   style={{ border: '1px solid #666', textAlign: 'left', padding: '10px', fontSize: '12px',  color: '#000'} }>
          {filteredQuotes?.map((quote, index) => (
          <div key={index}>
            {filteredQuotes[0].client.name} <br />
            {filteredQuotes[0].client.location} <br />
            {filteredQuotes[0].client.number} 
          </div>
          ))}
		    </td>
	    </table>
     
     
	    <table width='100%' style={{width:"100%", marginTop:'30px', border:'1px solid #666',  borderCollapse: 'collapse'}} id="second-table" >
       
       
        <thead >
          <tr>
            <th style={{border:'1px solid #666', padding:'5px', width:"5%", textAlign:'center',  color:"#000", fontSize:'12px',}}>S.No</th>
            <th width='20%' style={{border:'1px solid #666',  padding:'5px', textAlign:'center',  color:"#000", fontSize:'12px',}}>Description</th>
            <th style={{border:'1px solid #666', padding:'5px', width:"15%", textAlign:'center',  color:"#000", fontSize:'12px',}}>HSN Code</th>
            <th style={{border:'1px solid #666', padding:'5px', width:"15%",textAlign:'center', color:"#000", fontSize:'12px',}}>Rate/sqft</th>
            <th style={{border:'1px solid #666', padding:'5px',width:"15%", textAlign:'center', color:"#000", fontSize:'12px',}}>Total Area</th>
            <th style={{border:'1px solid #666', padding:'5px',width:"15%", textAlign:'center', color:"#000", fontSize:'12px',}}>Amount</th>
          </tr>
        </thead>
       
        <tbody  >
                {filtereditem.map((detail, detailIndex) => (
                  <tr key={detailIndex} >
                    <td style={{border:'1px solid #666', padding:'5px', textAlign:'center', color:"#000", fontSize:'12px'}}>{detailIndex+1}</td>
                    <td style={{border:'1px solid #666', padding:'5px', textAlign:'center', color:"#000", fontSize:'12px'}}>{detail.quoteData.item}</td>
                    <td style={{border:'1px solid #666', padding:'5px', textAlign:'center', color:"#000", fontSize:'12px'}}>39252000</td>
                    <td style={{border:'1px solid #666', padding:'5px', textAlign:'center', color:"#000", fontSize:'12px'}}>₹ {numeral(detail.quoteData.grandTotal/detail.quoteData.frameArea).format('0,0.00')}</td>
                    <td style={{border:'1px solid #666', padding:'5px', textAlign:'center', color:"#000", fontSize:'12px'}}>{numeral(detail.quoteData.frameArea*detail.quoteData.qty).format('0.00')}</td>
                    <td style={{border:'1px solid #666', padding:'5px', textAlign:'right', color:"#000", fontSize:'12px'}}>₹ {numeral(detail.quoteData.grandTotal*detail.quoteData.qty).format('0,0.00')}</td>
                  </tr>
                ))}
          </tbody>
         
          
          <tfoot>
			          <tr>
				          <td colspan="3"></td>
                  <th style={{border:'1px solid #666', textAlign:"center", padding:'5px', fontSize:'12px', color:"#000"}}>Total</th>
                  <td style={{border:'1px solid #666', textAlign:"center", padding:'5px', fontSize:'12px', color:"#000"}}>{numeral(totalframearea).format('0.00')}</td>
				          <td style={{border:'1px solid #666', textAlign:"right", padding:'5px', fontSize:'12px', color:"#000"}}>₹ {numeral(total).format('0,0.00')}</td>
			          </tr>

                <tr >
        <td colspan="4" ></td>
				<th   style={{border:'1px solid #666', textAlign:"left", padding:'10px', fontSize:'12px',  color:"#000"}}>Discount</th>
				<td  style={{border:'1px solid #666', textAlign:"right", padding:'10px',  fontSize:'12px',  color:"#000"}}>₹ {(discountprice).toFixed(2)}</td>
			</tr>
      
      
                <tr>
                  <td colspan="4" ></td>
				          <th  style={{border:'1px solid #666', textAlign:"center", padding:'5px', fontSize:'12px', color:"#000"}}>GST 18%</th>
				          <td  style={{border:'1px solid #666', textAlign:"right", padding:'5px', fontSize:'12px', color:"#000"}}>₹ {numeral(gst).format('0,0.00')}</td>
			          </tr>

                <tr>
                  <td colspan="4" ></td>
				          <th  style={{border:'1px solid #666', textAlign:"center", padding:'5px', fontSize:'12px', color:"#000"}}>Grand Total</th>
				          <th  style={{border:'1px solid #666', textAlign:"right", padding:'5px', fontSize:'12px', color:"#000"}}>₹ {numeral(totalaftrdis+gst).format('0,0.00')}</th>
			          </tr>

                <tr>
			            <td colspan="6" style={{textAlign:"left", padding:'10px', fontSize:'12px', color:"#000"}}>
                    Amount in Words<br />
                  <b>INR {toWords(totalaftrdis+gst).toUpperCase()} ONLY</b>
                  </td>
			          </tr>

                <tr>
                  <th colspan="6" style={{textAlign:"left", padding:'10px', fontSize:'12px', color:"#000"}}>
                    Banking Details
                  </th>
                </tr>

                <tr style={{border: '1px solid #666'}}>
                  <td  width="13%" style={{textAlign:"left", padding:'10px', fontSize:'12px', color:"#000"}}>
                    
                      Bank<br />
                      Branch<br />
                      A/c Type<br />
                      A/C Number<br />
                      IFS Code<br />
                    
                  </td>
                  <td colspan="2" style={{textAlign:"left", padding:'10px', fontSize:'12px', color:"#000"}}>
                      : {brandDatas && brandDatas[0].companyBank}<br />
                      : {brandDatas && brandDatas[0].companyBranch}<br />
                      : {brandDatas && brandDatas[0].companyBankType}<br />
                      : {brandDatas && brandDatas[0].companyAcNum}<br />
                      : {brandDatas && brandDatas[0].companyIfsc}<br />
                   
                  </td>
                  <td colspan="3"></td>
                </tr>

                <tr>
                  <td colspan="4" style={{textAlign:"left", padding:'10px',fontSize:'12px', color:"#000"}}>
                    <b>Declaration : </b>
                      We declare that this invoice shows the actual price of the 
                      goods described and that all particulars are true and 
                      correct.
                  </td>
                  <td colspan="2" style={{border:'1px solid #666', textAlign:"left", padding:'10px',  fontSize:'12px', color:"#000"}}>
                    for {brandDatas && brandDatas[0].companyName}
                    <p style={{padding:'30px'}}> Authorised Signatory</p>
                  </td>
			          </tr>

		        </tfoot>
          </table>
      </div>
     
    </div>
   
  )
}
export default Downlaod;
