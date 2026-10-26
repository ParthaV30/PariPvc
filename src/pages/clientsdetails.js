import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from "./navbar";
import Header from "./header";
import axios from "axios";
import { ReactSession } from 'react-client-session';
import numeral from 'numeral';

ReactSession.setStoreType("localStorage");

function Account() {
    const userId = ReactSession.get("upvcuserId");
    const userType = ReactSession.get("upvcuserType");
    const Empid = ReactSession.get("upvcempid");
    const urlParams = new URLSearchParams(window.location.search);
    const quoteIds = urlParams.get('id');
    const arrayValues = urlParams.get('arrayValues');
    const [quoteData, setQuoteData] = useState(null);
    const [total, setTotal] = useState(0);
    const [gst, setGst] = useState(0);
    const [clients, setClients] = useState([]);
    let users='';
  if (userType === '3') {
    users =  Empid ;
  } else {
    users = userId ;
  }
  const user = { "userId": users };


    const navigate = useNavigate();
    const indexPath = '/';

   
    const fetchDatalog = async (quoteID) => {
      
      try {
        const response = await axios.post(`https://upvcapi.sninfoserv.com/log/`, {userId, "removequote":quoteID});
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
   
  
 
    const fetchData = async () => {
        try {
          const response = await axios.post(`https://upvcapi.sninfoserv.com/all-quotes/`, user);
          setQuoteData(response.data);
        //  console.log(response.data);
         
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      const clietData = async () =>{
        try {
          const response = await axios.post('https://upvcapi.sninfoserv.com/clients/', 
            {user:users});
          //  console.log(response.data);
          if(response.data.status === 'success'){
           const filteredclientsdetail = response.data.data.filter(client => client.clientPhone === quoteIds);
          //  console.log(filteredclientsdetail);
           setClients(filteredclientsdetail);
           // console.log(response.data);
          }
        } catch (error) {
          console.error('Error sending data:', error);
        }
      };
      useEffect(()=>{clietData(); },[clients]);



      const removequote = async (quoteID) => {
        fetchDatalog(quoteID);
        try {
          const response = await axios.post(`https://upvcapi.sninfoserv.com/quote-delete/`, {quoteId: quoteID});
          if(response.data.status === 'success'){
            fetchData();
          }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, []);
  const filteredclients = quoteData && quoteData.data.filter(quote => quote.client.number === quoteIds);
  //console.log(filteredclients);

  
  useEffect(() => {
    if (filteredclients && filteredclients.length > 0) {
      let sum = 0;
      filteredclients.forEach(quote => {
        quote &&  quote.quoteDetails && quote.quoteDetails.forEach(detail => {
          sum += (detail.quoteData.grandTotal * detail.quoteData.qty);
          // console.log(detail.quoteData.qty);
          // console.log(sum);
        });
        
      });
      setTotal(sum);
      setGst((18/100)*sum);
    }
  }, [filteredclients]);

  const getTotal=(quotedetails)=>{
    let gTotal =0;
    quotedetails.forEach(clientdetails=>{
        gTotal+= (clientdetails.quoteData.grandTotal * clientdetails.quoteData.qty) + (((clientdetails.quoteData.grandTotal * clientdetails.quoteData.qty)*18)/100);

    });
    return gTotal;
  }

  
 

    return (
        <div>
            <Navbar />
            <Header />
            <div className="pc-container">
                <div className="pc-content">
                    <div className="row">
                    
                    <div className="col-md-12 col-xxl-12 col-xl-12">
                          <div className="card">
                              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              {/* <h3>Client Details</h3> */}
                                  <div className="pt-3" style={{ textAlign: 'center' }}>
                                 
                                      <ul style={{ listStyleType: 'none', padding: 0 }} >
                                        
                                          <li><h3>{clients[0]?.clientName}</h3></li>
                                          <li class='mb-4'><h5>{clients[0]?.clientPhone}</h5></li>
                                          <li class='mb-4'><h5>{clients[0]?.clientLocation}</h5></li>
                                         
                                           </ul>
                                            
                                  </div>
                              </div>
                          </div>
                      </div>
                      

                    
                        
                      <div class="col-md-12 col-xxl-12 col-xl-12">
                        <div class="card">
                          <div class="card-body">
                          <table id="left-right-fix" class="table stripe row-border order-column">
                            <thead>
                              <tr>
                     
                                <th>QuoteID</th>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Amount</th>
                                <th>View</th>
                              </tr>
                            </thead>
                            <tbody>
                            {filteredclients?.length > 0 ?(
                                <>
                            {filteredclients?.map((quote, index) => (
                          <tr key={index}>
                            <td>{quote.cusQuoteId}</td>
                            <td>{quote.date}</td>
                            <td>{quote.items} Items</td>
                            <td>₹ {numeral(getTotal(quote.quoteDetails)).format('0,0.00')}</td>
                            <td><a href={`quotesdet?id=${quote.quoteId}`} class="btn btn-primary">View Quote</a></td>
                            <td>
                   
                             <a onClick={() => removequote(quote.quoteId)} ><i class="btn btn-danger ti ti-trash"></i></a>
                            </td>
                          </tr>
                        ))}
                        </>):(<>
                                <div className="pt-3" style={{ textAlign: 'center' }}>
                   
                            <h3>No Data Found</h3>
                         
                         </div>
                         </>
                         )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>


                    </div>
                   
                </div>
            </div>
        </div>
    );
}

export default Account;
