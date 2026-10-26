// src\pages\monthlyreport.js
import React, { useEffect, useState } from "react";
import { ReactSession } from "react-client-session";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./navbar";
import Header from "./header";
import { Paginator } from "primereact/paginator";
import "./box.css";
import * as XLSX from "xlsx";
ReactSession.setStoreType("localStorage");

function Monthlyreport() {
  const userId = ReactSession.get("upvcuserId");
  const userType = ReactSession.get("upvcuserType");
  const Empid = ReactSession.get("upvcempid");
  const [quoteData, setData] = useState("");
  const [Invoicedata, setInvoicedata] = useState("");
  const [matchedQuotes, setMatchedQuotes] = useState([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(15);
  const [button, setButton] = useState(false);

  // Event handlers

  let users = "";
  if (userType === "3") {
    users = Empid;
  } else {
    users = userId;
  }
  const user = { userId: users };
  // console.log(users);

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
      return; // Exit early if the data is not available
    }

    const matches = []; // Array to hold all matched quotes

    Invoicedata.data.forEach((invoice) => {
      const invoiceQuoteID = invoice.quoteID;
      const matchedQuotes = quoteData.data.filter(
        (quote) => quote.quoteId === invoiceQuoteID
      ); // Use filter to find all matches

      if (matchedQuotes.length > 0) {
        matchedQuotes.forEach((matchedQuote) => {
          //  console.log('Matched Quote for Invoice ID:', invoice.invoice_id, '->', matchedQuote);
          matches.push({ invoiceId: invoice.invoice_id, matchedQuote });
        });
      } else {
        //  console.log('No matching quote found for Invoice ID:', invoice.invoice_id);
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
      //  console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
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
            // console.log(detail.quoteData.qty);
          }
        });
      }
    });

    return total;
  };

  const gst = (quoteId) => {
    // Filter quotes based on the provided quoteId
    const filteredQuotes = Invoicedata.data.filter(
      (invoice) => invoice.quoteID === quoteId
    );
    //  console.log(filteredQuotes);

    let gst = 0;

    // Calculate the total from the filtered quotes
    gst += parseFloat(filteredQuotes[0]?.discount) || 0;
    //  console.log(gst);

    return gst;
  };

  const grandtotal = (quoteId) => {
    const filteredQuotes =
      quoteData && quoteData.data.filter((quote) => quote.quoteId === quoteId);
    //   console.log(filteredQuotes);

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
    XLSX.writeFile(wb, `monthly_report.xlsx`);

    setFirst(0);
    setRows(15);
    setButton(false);
  };

  const sqftTotal = (quoteId) => {
    const filteredQuotes =
      quoteData && quoteData.data.filter((quote) => quote.quoteId === quoteId);

    let sqft = 0;

    filteredQuotes.forEach((quote) => {
      if (quote && quote.quoteDetails) {
        quote.quoteDetails.forEach((detail) => {
          if (detail.quoteData?.frameArea) {
            sqft += Number(detail.quoteData.frameArea);
          }
        });
      }
    });

    return sqft;
  };

  const [filterId, setFilterId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredDatas = matchedQuotes?.filter((match) => {
    const itemDate = new Date(
      match.matchedQuote.date.split("-").reverse().join("-")
    ); // Convert 'dd-mm-yyyy' to 'yyyy-mm-dd'

    // console.log(itemDate);
    // console.log(match.matchedQuote.date);

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
        ? match.matchedQuote.cusQuoteId.toString().includes(filterId)
        : true) &&
      (startDateObj ? itemDate >= startDateObj : true) &&
      (endDateObj ? itemDate <= endDateObj : true)
    );
  });
  console.log(filteredDatas);

  let totalCollected = 0;
  let totalprice = 0;
  let totalItems = 0;
  let totalSqft = 0;

  // filteredDatas
  //   ?.slice()
  //   .reverse()
  //   .map((match) => {
  //     const qid = match.matchedQuote.quoteId;
  //     totalCollected += Number(grandtotal(match.matchedQuote.quoteId));
  //     totalprice += Number(total(match.matchedQuote.quoteId));
  //     totalItems += match.matchedQuote.quoteDetails.length;
  //     totalSqft += Number(sqftTotal(qid));
  //   });

  const paginatedData = filteredDatas
    ?.slice()
    .reverse()
    .slice(first, first + rows);

  paginatedData?.forEach((match) => {
    const qid = match.matchedQuote.quoteId;

    totalCollected += Number(grandtotal(qid));
    totalprice += Number(total(qid));
    totalItems += match.matchedQuote.quoteDetails.length;
    totalSqft += Number(sqftTotal(qid));
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
              <h5>Monthly Report</h5>
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
                    <div className="col-lg-4 ml-2 mt-5">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Search by start date..."
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-4 ml-2 mt-5">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Search by End date..."
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-4 ml-2 mt-5">
                      <input
                        type="Number"
                        className="form-control"
                        placeholder="Search by quoteID..."
                        onChange={(e) => setFilterId(e.target.value)}
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
                          <th>Date</th>
                          <th>QuoteID</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>GST</th>
                          <th>SQFT</th>
                          <th>Grandtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDatas?.length > 0 ? (
                          filteredDatas
                            .slice()
                            .reverse()
                            .slice(first, first + rows)
                            .map((match, index) => (
                              <tr key={index}>
                                <td>{match.matchedQuote.date}</td>
                                <td>{match.matchedQuote.cusQuoteId}</td>
                                <td>
                                  {match.matchedQuote.quoteDetails.length}
                                </td>
                                <td>
                                  {total(match.matchedQuote.quoteId).toFixed(2)}
                                </td>
                                <td>
                                  {gst(match.matchedQuote.quoteId).toFixed(2)}
                                </td>
                                <td>
                                  {sqftTotal(
                                    match.matchedQuote.quoteId
                                  ).toFixed(2)}
                                </td>
                                <td>
                                  {grandtotal(
                                    match.matchedQuote.quoteId
                                  ).toFixed(2)}
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan="5">No matching quotes found.</td>
                          </tr>
                        )}
                        <tr>
                          <th></th>
                          <th>Total</th>
                          <th>{totalItems}</th>
                          <th>{totalprice.toFixed(2)}</th>
                          <th></th>
                          <th>{totalSqft.toFixed(2)}</th>
                          <th>{totalCollected.toFixed(2)}</th>
                        </tr>
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
export default Monthlyreport;
