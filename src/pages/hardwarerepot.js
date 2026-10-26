// src\pages\hardwarerepot.js
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

function Hardwarereport() {
  const userId = ReactSession.get("upvcuserId");
  const userType = ReactSession.get("upvcuserType");
  const Empid = ReactSession.get("upvcempid");
  const [quoteData, setData] = useState("");
  const [Invoicedata, setInvoicedata] = useState("");
  const [filteredquotee, setfilteredquotee] = useState("");
  const [matchedQuotes, setMatchedQuotes] = useState([]);
  // console.log(matchedQuotes);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(15);
  const [button, setButton] = useState(false);

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
      //   console.log("invoice", response.data);
      setInvoicedata(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    InvoiceData();
  }, []);

  // useEffect(() => {
  //   const matches = []; // Array to hold all matched quotes

  //   Invoicedata.data.forEach(invoice => {
  //     const invoiceQuoteID = invoice.quoteID;
  //     const matchedQuote = quoteData.data.find(quote => quote.quoteId === invoiceQuoteID);

  //     if (matchedQuote) {
  //       console.log('Matched Quote for Invoice ID:', invoice.invoice_id, '->', matchedQuote);
  //       matches.push({ invoiceId: invoice.invoice_id, matchedQuote });
  //     } else {
  //       console.log('No matching quote found for Invoice ID:', invoice.invoice_id);
  //     }
  //   });

  //   setMatchedQuotes(matches); // Store all matched quotes in state

  // }, []);

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
          // console.log('Matched Quote for Invoice ID:', invoice.invoice_id, '->', matchedQuote);
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

            //  console.log(detail.quoteData.qty);
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
    const input = document.getElementById("order");
    const table = input.querySelector("table");
    if (!table) {
      console.error("No table found inside the specified element");
      return;
    }

    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `Hardware_report.xlsx`);

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
        ? match.matchedQuote.cusQuoteId.toString().includes(filterId)
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
  console.log("Filtered Datas", filteredDatas);

  const groupedByQuote = filteredDatas?.reduce((acc, curr) => {
    const quoteId = curr.matchedQuote.cusQuoteId;
    if (!acc[quoteId]) {
      acc[quoteId] = {
        date: curr.matchedQuote.date,
        quoteId: curr.matchedQuote.cusQuoteId,
        quoteDetails: [],
      };
    }
    acc[quoteId].quoteDetails.push(...curr.matchedQuote.quoteDetails);
    return acc;
  }, {});

  const groupedData = Object.values(groupedByQuote || {});

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
              <h5>Hardware Report</h5>
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
                        type="Number"
                        className="form-control"
                        placeholder="Search by quoteID..."
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
                          <th>Date</th>
                          <th>QuoteID</th>
                          <th>Items</th>
                          <th>SQFT</th>
                          <th>Hardware cost</th>
                          <th>profile cost</th>
                          <th>margin cost</th>
                          <th>Production cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedData?.length > 0 ? (
                          groupedData
                            .slice()
                            .reverse()
                            .slice(first, first + rows)
                            .map((group, index) => (
                              <tr key={index}>
                                <td>{group.date}</td>
                                <td>{group.quoteId}</td>{" "}
                                <td>
                                  {group.quoteDetails.map((q, i) => (
                                    <div key={i}>{q.quoteData?.item}</div>
                                  ))}
                                </td>
                                <td>
                                  {group.quoteDetails
                                    .reduce(
                                      (sum, q) =>
                                        sum +
                                        Number(q.quoteData?.frameArea || 0),
                                      0
                                    )
                                    .toFixed(2)}
                                </td>
                                <td>
                                  {group.quoteDetails.map((q, i) => (
                                    <div key={i}>
                                      {q.quoteData?.data?.frame?.amount &&
                                        `Frame: ${q.quoteData.data.frame.amount}, `}
                                      {q.quoteData?.data?.shutter?.amount &&
                                        `Shutter: ${q.quoteData.data.shutter.amount}, `}
                                      {q.quoteData?.data?.mullion?.amount &&
                                        `Mullion: ${q.quoteData.data.mullion.amount}, `}
                                      {q.quoteData?.data?.beeding?.amount &&
                                        `beeding: ${q.quoteData.data.beeding.amount}, `}
                                      {q.quoteData?.data?.frameGasket?.amount &&
                                        `frameGasket: ${q.quoteData.data.frameGasket.amount}, `}
                                      {q.quoteData?.data?.meshGasket?.amount &&
                                        `meshGasket: ${q.quoteData.data.meshGasket.amount}, `}
                                      {q.quoteData?.data?.beedingGasket
                                        ?.amount &&
                                        `beedingGasket: ${q.quoteData.data.beedingGasket.amount}, `}
                                      {q.quoteData?.data?.shutterGasket
                                        ?.amount &&
                                        `shutterGasket: ${q.quoteData.data.shutterGasket.amount}, `}
                                      {q.quoteData?.data?.mullionGasket
                                        ?.amount &&
                                        `mullionGasket: ${q.quoteData.data.mullionGasket.amount}, `}
                                      {q.quoteData?.data?.meshFrame?.amount &&
                                        `meshFrame: ${q.quoteData.data.meshFrame.amount}, `}
                                      {q.quoteData?.data?.panelCost?.amount &&
                                        `panelCost: ${q.quoteData.data.panelCost.amount}, `}
                                      {q.quoteData?.data?.interlock?.amount &&
                                        `interlock: ${q.quoteData.data.interlock.amount}, `}
                                      {q.quoteData?.data?.wastage?.amount &&
                                        `wastage: ${q.quoteData.data.wastage.amount}, `}
                                      {q.quoteData?.data?.Lbeeding?.amount &&
                                        `Louver Beeding: ${q.quoteData.data.Lbeeding.amount}, `}
                                    </div>
                                  ))}
                                </td>
                                <td>
                                  {group.quoteDetails.map((q, i) => {
                                    const d = q.quoteData?.data;
                                    return (
                                      <div key={i}>
                                        {d?.meshCost > 0 &&
                                          `Mesh: ${d.meshCost}, `}
                                        {d?.steelFrame > 0 &&
                                          `SteelFrame: ${d.steelFrame}, `}
                                        {d?.steelShutter > 0 &&
                                          `SteelShutter: ${d.steelShutter}, `}
                                        {d?.steelMullion > 0 &&
                                          `SteelMullion: ${d.steelMullion}, `}
                                        {d?.steelMesh > 0 &&
                                          `SteelMesh: ${d.steelMesh}, `}
                                        {d?.mplCost > 0 &&
                                          `MPL: ${d.mplCost}, `}
                                        {d?.handleCost > 0 &&
                                          `Handle: ${d.handleCost}, `}
                                        {d?.hingsCost > 0 &&
                                          `Hinges: ${d.hingsCost}, `}
                                        {d?.screwsCost > 0 &&
                                          `Screw: ${d.screwsCost}, `}
                                        {d?.grillCost > 0 &&
                                          `Grill: ${d.grillCost}, `}
                                        {d?.boardCost > 0 &&
                                          `Board: ${d.boardCost}, `}
                                        {d?.aluTrack > 0 &&
                                          `AluTrack: ${d.aluTrack}, `}
                                        {d?.groRoll > 0 &&
                                          `GroRoll: ${d.groRoll}, `}
                                        {d?.mesRoll > 0 &&
                                          `MeshRoll: ${d.mesRoll}, `}
                                        {d?.wStrip > 0 &&
                                          `WStrip: ${d.wStrip}, `}
                                        {d?.tLock > 0 && `TLock: ${d.tLock}, `}
                                        {d?.bArrest > 0 &&
                                          `BArrest: ${d.bArrest}, `}
                                        {d?.jStop > 0 && `JStop: ${d.jStop}, `}
                                        {d?.dArrest > 0 &&
                                          `DArrest: ${d.dArrest}, `}
                                        {d?.LouverBlades > 0 &&
                                          `LouverBlades: ${d.LouverBlades}`}
                                      </div>
                                    );
                                  })}
                                </td>
                                <td>
                                  {group.quoteDetails.reduce(
                                    (sum, q) =>
                                      sum +
                                      Number(
                                        q.quoteData?.data?.marginCost || 0
                                      ),
                                    0
                                  )}
                                </td>
                                <td>
                                  {group.quoteDetails.reduce(
                                    (sum, q) =>
                                      sum +
                                      Number(q.quoteData?.data?.marketingCost || 0 ) +
                                      Number( q.quoteData?.data?.transportCost || 0 ) +
                                      Number( q.quoteData?.data?.labourFCost || 0 ) +
                                      Number( q.quoteData?.data?.labourScost || 0 ) +
                                      Number(q.quoteData?.data?.glassCost || 0),
                                    0
                                  )}
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan={8}>No matching quotes found.</td>
                          </tr>
                        )}
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
export default Hardwarereport;
