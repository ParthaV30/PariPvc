// src\pages\viewclientreport.js
import React, { useEffect, useState } from "react";
import { ReactSession } from "react-client-session";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./navbar";
import { Paginator } from "primereact/paginator";
import Header from "./header";
import "./box.css";
import * as XLSX from "xlsx";
ReactSession.setStoreType("localStorage");

function ViewClientreport() {
  const userId = ReactSession.get("upvcuserId");
  const userType = ReactSession.get("upvcuserType");
  const Empid = ReactSession.get("upvcempid");
  const [searchParams] = useSearchParams();
  const clientPhone = searchParams.get("phone");
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
    filteredQuotes.forEach((quote) => {
      if (quote && quote.quoteDetails) {
        quote.quoteDetails.forEach((detail) => {
          if (detail.quoteData) {
            total += detail.quoteData.grandTotal * detail.quoteData.qty;
          }
        });
      }
    });
    const gst = (18 / 100) * total;
    let grandtotal = total + gst;

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
    if (!filteredDatas || filteredDatas.length === 0) {
      alert("No Data Available to Download");
      return;
    }

    let excelRows = [];
    let itemsGrandTotalSum = 0;
    let finalQuoteGrandTotalSum = 0;

    filteredDatas.forEach((item, index) => {
      const quote = item.matchedQuote;

      quote.quoteDetails.forEach((detail, i) => {
        const qd = detail.quoteData || {};

        const itemGrandTotal = qd.grandTotal ? Number(qd.grandTotal) : 0;

        const finalQuoteTotal = item.calculatedGrandTotal
          ? Number(item.calculatedGrandTotal)
          : 0;
        itemsGrandTotalSum += itemGrandTotal;
        finalQuoteGrandTotalSum += finalQuoteTotal;
        excelRows.push({
          "S.No": index + 1,
          "Quote ID": quote.quoteId,
          "Invoice ID": item.invoiceId,
          "Quote Date": quote.date,
          "Client Name": quote.client?.name || "",
          "Client Phone": quote.client?.number || "",
          "Client Location": quote.client?.location || "",
          "Item Name": qd.item || "",
          Width: qd.boxWidth || "",
          Height: qd.boxHeight || "",
          Sqft: qd.frameArea ? Number(qd.frameArea).toFixed(2) : "0.00",
          "Item Grand Total": Number(itemGrandTotal).toFixed(2),
          "Final Quote Total": finalQuoteTotal.toFixed(2),
        });
      });
    });

    excelRows.push({
      "S.No": "",
      "Quote ID": "",
      "Invoice ID": "",
      "Quote Date": "",
      "Client Name": "",
      "Client Phone": "",
      "Client Location": "",
      "Item Name": "TOTAL",
      Width: "",
      Height: "",
      Sqft: "",
      "Item Grand Total": itemsGrandTotalSum.toFixed(2),
      "Final Quote Total": finalQuoteGrandTotalSum.toFixed(2),
    });

    const ws = XLSX.utils.json_to_sheet(excelRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Client Report");

    XLSX.writeFile(wb, "Client_Report.xlsx");

    setButton(false);
  };

  const sqftTotal = (quoteId) => {
    const filteredQuotes =
      quoteData && quoteData.data.filter((quote) => quote.quoteId === quoteId);

    let sqft = 0;

    filteredQuotes?.forEach((quote) => {
      quote?.quoteDetails?.forEach((detail) => {
        if (detail.quoteData?.frameArea) {
          sqft += Number(detail.quoteData.frameArea);
        }
      });
    });

    return sqft;
  };

  const [filterId, setFilterId] = useState("");
  const [filterName, setFilterName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredDatas = matchedQuotes
    ?.filter((match) => {
      return match.matchedQuote.client?.number === clientPhone;
    })
    ?.map((match) => {
      let total = 0;
      const itemNames = match.matchedQuote.quoteDetails
        .map((detail) => detail.quoteData?.item)
        .filter(Boolean)
        .join(", ");

      match.matchedQuote.quoteDetails.forEach((detail) => {
        const gt = Number(detail.quoteData?.grandTotal || 0);
        const qty = Number(detail.quoteData?.qty || 1);
        total += gt * qty;
      });

      return {
        ...match,
        calculatedGrandTotal: total.toFixed(2),
        itemNames: itemNames,
      };
    });

  console.log(filteredDatas);

  let totalCollected = 0;
  let totalItems = 0;
  let totalSqft = 0;

  const paginatedData = filteredDatas
    ?.slice()
    .reverse()
    .slice(first, first + rows);

  paginatedData?.forEach((match) => {
    const qid = match.matchedQuote.quoteId;

    totalCollected += Number(grandtotal(qid));
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
              <h5>View Client Report</h5>
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
                          <th>S.NO</th>
                          <th>Date</th>
                          <th>Invoice ID</th>
                          <th>Client Name</th>
                          <th>Client Phone</th>
                          <th>Items</th>
                          <th>SQFT</th>
                          <th>Grandtotal</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDatas?.length > 0 ? (
                          filteredDatas.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.matchedQuote.date}</td>
                              <td>{item.invoiceId}</td>
                              <td>{item.matchedQuote.client?.name}</td>
                              <td>{item.matchedQuote.client?.number}</td>
                              <td>{item.matchedQuote?.items}</td>
                              <td>
                                {sqftTotal(item.matchedQuote?.quoteId).toFixed(
                                  2
                                )}
                              </td>
                              <td>{item.calculatedGrandTotal}</td>
                              <td>
                                <a
                                  href={`quotesdet?id=${item.matchedQuote?.quoteId}`}
                                  class="btn btn-primary w-120"
                                >
                                  View Quotes
                                </a>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6">No Invoices Found</td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th>Total</th>
                          <th>{totalItems}</th>
                          <th>{totalSqft.toFixed(2)}</th>
                          <th>{totalCollected.toFixed(2)}</th>
                          <th></th>
                        </tr>
                      </tfoot>
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
export default ViewClientreport;
