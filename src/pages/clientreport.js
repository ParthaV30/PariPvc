// src\pages\clientreport.js
import React, { useEffect, useState } from "react";
import { ReactSession } from "react-client-session";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./navbar";
import { Paginator } from "primereact/paginator";
import Header from "./header";
import "./box.css";
import * as XLSX from "xlsx";
ReactSession.setStoreType("localStorage");

function Clientreport() {
  const userId = ReactSession.get("upvcuserId");
  const userType = ReactSession.get("upvcuserType");
  const Empid = ReactSession.get("upvcempid");
  const [quoteData, setData] = useState("");
  const [Invoicedata, setInvoicedata] = useState("");
  const [filteredquotee, setfilteredquotee] = useState("");
  const [matchedQuotes, setMatchedQuotes] = useState([]);
  const [button, setButton] = useState(false);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(15);

  // console.log(Invoicedata);

  // Event handlers

  let users = "";
  if (userType === "3") {
    users = Empid;
  } else {
    users = userId;
  }
  const user = { userId: users };
  //  console.log(users);

  const navigate = useNavigate();
  const indexPath = "/";

  useEffect(() => {
    if (userId === 0) {
      navigate(indexPath);
    }
  }, [userId, navigate]);

  const InvoiceData = async () => {
    try {
      const response = await axios.get(
        "https://upvcapi.sninfoserv.com/invoice/",
        {
          params: { user: userId },
        }
      );
      //  console.log("invoice", response.data);
      setInvoicedata(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    InvoiceData();
  }, []);

  useEffect(() => {
    if (!Invoicedata || !Invoicedata.data || !quoteData || !quoteData.data) {
      console.error("Invoicedata or quoteData is undefined.");
      return;
    }

    const matches = [];

    Invoicedata.data.forEach((invoice) => {
      const invoiceQuoteID = invoice.quoteID;
      const matchedQuotes = quoteData.data.filter(
        (quote) => quote.quoteId === invoiceQuoteID
      ); // Use filter to find all matches

      if (matchedQuotes.length > 0) {
        matchedQuotes.forEach((matchedQuote) => {
          //   console.log('Matched Quote for Invoice ID:', invoice.invoice_id, '->', matchedQuote);
          matches.push({ invoiceId: invoice.invoice_id, matchedQuote });
        });
      } else {
        // console.log('No matching quote found for Invoice ID:', invoice.invoice_id);
      }
    });

    setMatchedQuotes(matches); // Store all matched quotes in state
  }, [Invoicedata, quoteData]); // Add dependencies to re-run effect when data changes

  const fetchData = async () => {
    try {
      const response = await axios.post(
        "https://upvcapi.sninfoserv.com/all-quotes/",
        user
      );
      setData(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const filteredQuotes =
      quoteData &&
      quoteData.data.filter((quote) => quote.quoteId === Invoicedata);
    setfilteredquotee(filteredQuotes);
    // console.log(filteredQuotes);
  }, []);

  const total = (quoteId) => {
    // Filter quotes based on the provided quoteId
    const filteredQuotes =
      quoteData && quoteData.data.filter((quote) => quote.quoteId === quoteId);
    // console.log(filteredQuotes);

    let total = 0;

    // Calculate the total from the filtered quotes
    filteredQuotes.forEach((quote) => {
      if (quote && quote.quoteDetails) {
        quote.quoteDetails.forEach((detail) => {
          if (detail.quoteData) {
            total += detail.quoteData.grandTotal * detail.quoteData.qty;
            //   console.log(detail.quoteData.qty);
          }
        });
      }
    });

    return total;
  };

  const grandtotal = (quoteId) => {
    const filteredQuotes =
      quoteData && quoteData.data.filter((quote) => quote.quoteId === quoteId);
    // console.log(filteredQuotes);

    let total = 0;

    // Calculate the total from the filtered quotes
    filteredQuotes.forEach((quote) => {
      if (quote && quote.quoteDetails) {
        quote.quoteDetails.forEach((detail) => {
          if (detail.quoteData) {
            total += detail.quoteData.grandTotal * detail.quoteData.qty;

            // console.log(detail.quoteData.qty);
          }
        });
      }
    });
    const gst = (18 / 100) * total; // Calculate GST based on the total
    let grandtotal = total + gst; // Total including GST

    return grandtotal;
  };

  const handleDownloadExcel = () => {
    setFirst(0);
    setRows(filteredDatas.length);
    setButton(true);
    setTimeout(() => {
      downloadExcel();
    }, 1000);
  };

  const downloadExcel = () => {
    const input = document.getElementById("order");
    const table = input.querySelector("table");
    if (!table) {
      console.error("No table found inside the specified element");
      return;
    }

    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `Client_report.xlsx`);

    setFirst(0);
    setRows(15);
    setButton(false);
  };

  const [filterId, setFilterId] = useState("");
  const [filterName, setFilterName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredDatas = matchedQuotes?.filter((match) => {
    const itemDate = new Date(
      match.matchedQuote.date.split("-").reverse().join("-")
    ); 

    const startDateObj = startDate ? new Date(startDate) : null;
    if (startDateObj) {
      startDateObj.setHours(0, 0, 0, 0);
    }

    const endDateObj = endDate ? new Date(endDate) : null;
    if (endDateObj) {
      endDateObj.setHours(23, 59, 59, 999);
    }

    return (
      (filterId
        ? match.matchedQuote.client?.number.includes(filterId)
        : true) &&
      (filterName
        ? match.matchedQuote &&
          match.matchedQuote.quoteDetails.some((detail) =>
            detail.quoteData.item
              .toLowerCase()
              .includes(filterName.toLowerCase())
          )
        : true) &&
      (startDateObj ? itemDate >= startDateObj : true) &&
      (endDateObj ? itemDate <= endDateObj : true)
    );
  });

  // console.log(filteredDatas);

  const groupedClientsArray = Object.values(
  filteredDatas?.reduce((acc, match) => {
    const clientKey = match.matchedQuote.client?.number; 

    if (!acc[clientKey]) {
      acc[clientKey] = {
        clientName: match.matchedQuote.client?.name,
        clientPhone: match.matchedQuote.client?.number,
        itemCount: 0,       
        totalAmount: 0,      
        quoteIds: [],       
      };
    }

    acc[clientKey].itemCount += 1;
    acc[clientKey].totalAmount += Number(
      grandtotal(match.matchedQuote.quoteId)
    );
    acc[clientKey].quoteIds.push(match.matchedQuote.quoteId);

    return acc;
  }, {})
);



  let totalCollected = 0;

  let totalItems = 0;
  filteredDatas
    ?.slice()
    .reverse()
    .map((match) => {
      totalCollected += Number(grandtotal(match.matchedQuote.quoteId));

      totalItems += match.matchedQuote.quoteDetails.length;
    });

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(15);
  };

  return (
    <>
      <Navbar />

      <div class="pc-container">
        <div class="pc-content">
          <div class="row">
            <div class="col-md-12 col-xxl-12 col-xl-12">
              <h5>Client Report</h5>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={handleDownloadExcel}
                  className={`btn ${
                    button === false ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  {" "}
                  <i class="fa fa-download me-2"></i>{" "}
                  {button === false ? "Download" : "Downloading"}
                </button>
              </div>
              <div class="card mt-2">
                <div class="card-body">
                  <div className="row mb-3">
                    <div className="col-lg-3 ml-2 mt-5">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Search by start date..."
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-3 ml-2 mt-5">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Search by End date..."
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-3 ml-2 mt-5">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Client Phonenumber..."
                        onChange={(e) => setFilterId(e.target.value)}
                      />
                    </div>

                    <div className="col-lg-3 ml-2 mt-5">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Item..."
                        onChange={(e) => setFilterName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="table-responsive text-nowrap mt-2" id="order">
                    <table
                      id="left-right-fix"
                      class="table stripe row-border order-column mt-3"
                    >
                      <thead>
                        <tr>
                          {/* <th>Date</th> */}
                          <th>S.NO</th>
                          <th>Invoice Count</th>
                          <th>Client Name</th>
                          {/* <th>Items Count</th> */}
                          <th>Client Phone</th>
                          {/* <th>Items</th> */}
                          {/* <th>Grandtotal</th> */}
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedClientsArray?.length > 0 ? (
                          groupedClientsArray.slice().reverse()
                            .slice(first, first + rows)
                            .map((quotes, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                {/* <td>{quotes.date}</td> */}
                                <td>{quotes.itemCount}</td> 
                                <td>{quotes.clientName}</td>
                                <td>{quotes.clientPhone}</td>
                                <td><a href={`/viewclient-report?phone=${quotes.clientPhone}`} class="btn btn-primary w-120" >View Client Report</a></td>
                                {/* <td>{quotes.items}</td> 
                                <td>{quotes.totalAmount.toFixed(2)}</td> */}
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan={7}>No matching quotes found.</td>
                          </tr>
                        )}
                        {/* <tr>
                          <th colSpan="3"></th>
                          <th>Total</th>
                          <th>{totalItems}</th>
                          <th></th>
                          <th>{totalCollected.toFixed(2)}</th>
                        </tr> */}
                      </tbody>
                    </table>

                    <Paginator
                      className="custom-paginator"
                      first={first}
                      rows={rows}
                      totalRecords={filteredDatas ? filteredDatas.length : 0}
                      onPageChange={onPageChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Clientreport;
