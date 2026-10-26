import React, { useEffect, useState } from 'react';
import { ReactSession } from 'react-client-session';
import axios from 'axios';
import { Paginator } from 'primereact/paginator';
import Navbar from "./navbar";
import Header from "./header";
import { getQuotes, deleteQuote, getInvoices } from '../services/dbService';

 function Quote() {
    const userId = ReactSession.get("upvcuserId");
    const userType = ReactSession.get("upvcuserType");
    const [quoteData, setData] = useState({ data: [] });
    const Empid = ReactSession.get("upvcempid");
    const [searchQuery, setSearchQuery] = useState('');
    const [searchQuery2, setSearchQuery2] = useState('');
    const [searchQuery3, setSearchQuery3] = useState('');
    const [searchQuery5, setSearchQuery5] = useState('');
    const [Invoicedata, setInvoicedata] = useState({ data: [] });
    const [matchedQuotes, setMatchedQuotes] = useState([]);

    const handleSearchInputChangeID = (e) => setSearchQuery(e.target.value);
    const handleSearchInputChangeName = (e) => setSearchQuery2(e.target.value);
    const handleSearchInputChangedate = (e) => setSearchQuery3(e.target.value);
    const handleSearchInputChangeLocation = (e) => setSearchQuery5(e.target.value);

    const [first, setFirst] = useState(0); 
    const [rows, setRows] = useState(5);
      
    const onPageChange = (event) => {
      setFirst(event.first);
    };

    let users='';
    if (userType === '3') {
      users =  Empid ;
    } else {
      users = userId ;
    }
    const user = { "userId": users };


    const startDateObj = searchQuery3 ? new Date(searchQuery3) : null;
    if (startDateObj) {
      startDateObj.setHours(0, 0, 0, 0); 
    }
  
    const quoteList = Array.isArray(quoteData?.data) ? quoteData.data : (Array.isArray(quoteData) ? quoteData : []);
    const filteredData = quoteList.filter(item => {
      const name = item.client?.name || item.client_name || '';
      const location = item.client?.location || item.location || '';
      const quoteIdStr = (item.cusQuoteId || item.quoteId || item.quote_id || '').toString();
      
      const matchName = searchQuery2 === '' || name.toLowerCase().includes(searchQuery2.toLowerCase());
      const matchId = searchQuery === '' || quoteIdStr.includes(searchQuery);
      const matchLoc = searchQuery5 === '' || location.toLowerCase().includes(searchQuery5.toLowerCase());
      return matchName && matchId && matchLoc;
    });
    
    const fetchDatalog = async (quoteID) => {
      try {
        await axios.post(`https://upvcapi.sninfoserv.com/log/`, {"removequote":quoteID});
      } catch (error) {
        // offline fallback
      }
    };


    const fetchData = async () => {
      try {
        const list = await getQuotes(users);
        if (Array.isArray(list) && list.length > 0) {
          const mapped = list.map(q => ({
            ...q,
            date: q.created_at ? new Date(q.created_at).toLocaleDateString() : (q.date || ''),
            cusQuoteId: q.cusQuoteId || q.quote_id || '',
            quoteId: q.quote_id || q.id || '',
            items: Array.isArray(q.items) ? q.items.length : (q.items || 0),
            client: {
              name: q.client_name || q.client?.name || 'Customer',
              location: q.location || q.site_location || q.client?.location || 'Chennai'
            }
          }));
          setData({ data: mapped });
          return;
        }
        const response = await axios.post('https://upvcapi.sninfoserv.com/all-quotes/', user);
        if (response.data && Array.isArray(response.data)) {
          setData({ data: response.data });
        } else if (response.data && Array.isArray(response.data.data)) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching quotes:", error);
      }
    };
     
    useEffect(() => {
      fetchData();
    }, []);


    const InvoiceData = async () => {
      try {
        const invs = await getInvoices(userId);
        if (Array.isArray(invs) && invs.length > 0) {
          setInvoicedata({ data: invs.map(i => ({ quoteID: i.quote_id, invoice_id: i.invoice_no })) });
          return;
        }
        const response = await axios.get('https://upvcapi.sninfoserv.com/invoice/', {
          params: { user: userId }
        });
        if (response.data && response.data.data) {
          setInvoicedata(response.data);
        }
      } catch (error) {
        setInvoicedata({ data: [] });
      }
    };

    useEffect(() => {
      InvoiceData();
    }, []);

    useEffect(() => {
      if (!Invoicedata || !Invoicedata.data || !quoteData || !quoteData.data) {
        return;
      }

      const matches = [];

      Invoicedata.data.forEach(invoice => {
        const invoiceQuoteID = invoice.quoteID;
        const matched = (quoteData.data || []).filter(quote => (quote.quoteId === invoiceQuoteID || quote.quote_id === invoiceQuoteID));

        if(matched.length > 0) {
          matched.forEach(matchedQuote => {
            matches.push({ invoiceId: invoice.invoice_id, matchedQuote });
          });
        }
      });

      setMatchedQuotes(matches);
    }, [Invoicedata, quoteData]);

    const removequote = async (quoteID) => {
      try { fetchDatalog(quoteID); } catch(e) {}
      try {
        await deleteQuote(quoteID);
        await fetchData();
      } catch (error) {
        console.error('Error deleting quote:', error);
      }
      try {
        await axios.post(`https://upvcapi.sninfoserv.com/quote-delete/`, {userId, quoteId: quoteID});
      } catch (error) {
        // offline fallback
      }
    };
 
    // console.log(matchedQuotes);

    return (
      <div>
        <Navbar />
        <Header />
          <div class="pc-container">
            <div class="pc-content">
              <div class="row">
                <div class="col-md-12 col-xxl-12 col-xl-12">
                  <div class="card">
                    <div class="card-header ">
                      <h5>Quote</h5>
                    </div>
                    <div class="card-body">
                        <div className="row" >
                          <div className="col-md-6   col-lg-3 ml-2 mt-5">
                            <input
                              type="date"
                              className="form-control"
                              placeholder="Search by user Date..."
                              value={searchQuery3}
                              onChange={handleSearchInputChangedate}
                            />
                          </div>
          
                          <div className="col-md-6  col-lg-3 ml-2 mt-5">
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Search by user ID..."
                              value={searchQuery}
                              onChange={handleSearchInputChangeID}
                            />
                          </div>

                          <div className="col-md-6  col-lg-3 ml-2 mt-5">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search by user name..."
                              value={searchQuery2}
                              onChange={handleSearchInputChangeName}
                            />
                          </div>
                        
                          <div className="col-md-6  col-lg-3 ml-2 mt-5">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search by user location..."
                              value={searchQuery5}
                              onChange={handleSearchInputChangeLocation}
                            />
                          </div>
                       
                          <div className="col-md-12 col-lg-12 mt-5">
                            <div class="table-responsive"> 
                              <table id="left-right-fix" class="table stripe row-border order-column" width="100%">
                                <thead>
                                  <tr>
                                    <th>Date</th>
                                    <th>Quote ID</th>
                                    <th>Items</th>
                                    <th>Client</th>
                                    <th>Location</th>
                                    <th colspan="2">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filteredData?.length > 0 ? filteredData?.slice(first, first + rows).reverse().slice().reverse().map((quotes, index) => 
                                    <tr key={index}>
                                      <td>{quotes.date}</td>
                                      <td>{quotes.cusQuoteId}</td>
                                      <td>{quotes.items}</td>
                                      <td>{quotes.client.name}</td>
                                      <td class="text-wrap">{quotes.client.location}</td>
                                      <td><a href={`quotesdet?id=${quotes.quoteId}`} class="btn btn-primary w-120" >View Quotes</a></td>
                                      <td>
                                        { 
                                          matchedQuotes.some(match => match.matchedQuote.quoteId === quotes.quoteId) ?
                                          <></>
                                          : 
                                          <a onClick={() => removequote(quotes.quoteId)}>
                                            <i className="btn btn-danger ti ti-trash"></i>
                                          </a> 
                                        }

                                      </td>
                                    </tr>
                                  ):(
                                    <tr>
                                      <td class="text-center" colspan='6'>No Data Found</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                              <Paginator className="custom-paginator" first={first} rows={rows} totalRecords={filteredData?.length}  onPageChange={onPageChange} />
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
  )
}
export default Quote;