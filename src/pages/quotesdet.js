// src\pages\quotesdet.js
import React, { useEffect, useState } from "react";
import { ReactSession } from "react-client-session";
import axios from "axios";
import Navbar from "./navbar";
import Header from "./header";
import numeral from "numeral";
import left from "../images/handleLeft.png";
import right from "../images/handleRight.png";
import meshimg from "../images/mesh.png";
import Handle from "../images/slideHandle.png";
import Fan from "../images/fan.png";
import Louver from "../images/louvers.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import HomeComponent from "./download";
import ScheduleComponent from "./cuttingSchedule";
import Invoice from "./invoice";
import html2pdf from "html2pdf.js";
import { getQuoteById, deleteQuoteItem, getInvoices } from "../services/dbService";
import "./box.css";

function Quotesdet({ quotes }) {
  const urlParams = new URLSearchParams(window.location.search);
  const quoteIds = urlParams.get("id");
  const arrayValues = urlParams.get("arrayValues");
  const userId = ReactSession.get("upvcuserId");
  const Empid = ReactSession.get("upvcempid");
  const userType = ReactSession.get("upvcuserType");

  const [quoteData, setQuoteData] = useState(null);
  const [filteredArray, setFilteredArray] = useState([]);
  const [bottomFrame, setBottomFrame] = useState("yes");
  const [mesh, setMesh] = useState("no");
  const [panelHeights, setpanelHeight] = useState(0);
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  const [screen, setScreen] = useState(deviceWidth > 700 ? 40 : 20);
  const [divider, setDevider] = useState("Vertical");
  const [switchs, setSwitch] = useState("on");
  const [mCalc, setMcalc] = useState(1);
  const [total, setTotal] = useState(0);
  const [gst, setGst] = useState(0);
  const [Invoicedata, setInvoicedata] = useState(false);
  const [downloadData, setDownloadData] = useState(0);
  const [matchedQuotes, setMatchedQuotes] = useState([]);
  const [isToggled, setIsToggled] = useState(false);
  // const [topsash, setTopSash] = useState([{ type: "fixed" }]);
  const [numFrames, setNumFrames] = useState(1);
  const [grill, setGrill] = useState("no");
  const [boxHandle, setBoxHandle] = useState([]);
  const [measure, setMeasure] = useState("");
  const [invoicedatadownload, setInvoicedatadownload] = useState([]);
  // console.log("invoicedatadownload", invoicedatadownload);

  let users = "";
  if (userType === "3") {
    users = Empid;
  } else {
    users = userId;
  }
  const user = { userId: users };

  // Function to handle the toggle action
  const toggleButton = () => {
    setIsToggled((prevState) => !prevState);
  };

  useEffect(() => {
    const updateDeviceWidth = () => {
      setDeviceWidth(window.innerWidth);
      setScreen(window.innerWidth > 700 ? 40 : 20);
    };

    window.addEventListener("resize", updateDeviceWidth);

    return () => {
      window.removeEventListener("resize", updateDeviceWidth);
    };
  }, []);

  const fetchDatalog = async (quoteIds, detailIndex) => {
    const formData = {
      quoteId: quoteIds,
      rowId: detailIndex,
    };
    try {
      const response = await axios.post(`https://upvcapi.sninfoserv.com/log/`, {
        userId,
        removequote: formData,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const InvoiceData = async () => {
    try {
      const invs = await getInvoices(userId);
      if (Array.isArray(invs) && invs.length > 0) {
        setInvoicedata({ data: invs.map(i => ({ quoteID: i.quote_id, invoice_id: i.invoice_no })) });
        return;
      }
      const response = await axios.get(
        "https://upvcapi.sninfoserv.com/invoice/",
        {
          params: { user: userId },
        }
      );
      if (response.data && response.data.status === "success") {
        setInvoicedata(response.data);
      }
    } catch (error) {
      setInvoicedata({ data: [] });
    }
  };

  const DownloadData = async () => {
    try {
      const response = await axios.get(
        "https://upvcapi.sninfoserv.com/download/",
        {
          params: { quoteID: quoteIds },
        }
      );
      if (response.data && response.data.status === "success") {
        setDownloadData(response?.data?.data[0]?.discount || 0);
      }
    } catch (error) {
      setDownloadData(0);
    }
  };

  useEffect(() => {
    DownloadData();
    InvoiceData();
  }, []);

  useEffect(() => {
    const singleInvoice =
      Invoicedata &&
      Invoicedata.data &&
      Invoicedata.data.filter((invoice) => invoice.quoteID === quoteIds);

    setMatchedQuotes(singleInvoice || []);
  }, [Invoicedata]);

  const removequote = async (quoteIds, detailIndex) => {
    try { fetchDatalog(quoteIds, detailIndex); } catch (e) {}
    try {
      await deleteQuoteItem(quoteIds, detailIndex);
      alert("Item deleted successfully");
      await fetchData();
    } catch (err) {
      console.warn("deleteQuoteItem error:", err);
    }
    try {
      const formData = {
        quoteId: quoteIds,
        rowId: detailIndex,
      };
      await axios.post(
        `https://upvcapi.sninfoserv.com/item-delete/`,
        formData
      );
    } catch (error) {
      // offline fallback
    }
  };

  const fetchData = async () => {
    try {
      const quote = await getQuoteById(quoteIds);
      if (quote) {
        const quoteObj = {
          quoteId: quote.quote_id || quoteIds,
          client: {
            name: quote.client_name || 'Customer',
            phone: quote.phone || '',
            location: quote.location || '',
            siteLocation: quote.site_location || ''
          },
          quoteDetails: (quote.items || []).map((it, idx) => ({
            id: it.id || idx,
            quoteData: it.quoteData || it.data || it
          }))
        };
        setQuoteData({ data: [quoteObj] });
        return;
      }

      const response = await axios.post(
        `https://upvcapi.sninfoserv.com/all-quotes/`,
        user
      );
      if (response.data) {
        setQuoteData(response.data);
      }
    } catch (error) {
      console.error("Error fetching quote details:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Ensure quoteData is valid before using filter method
  const filteredQuotes =
    quoteData && quoteData.data.filter((quote) => quote.quoteId === quoteIds);
  // console.log(filteredQuotes);

  useEffect(() => {
    if (arrayValues) {
      // Split arrayValues string into an array of values
      const valuesArray = arrayValues.split(",");

      // Filter quotes based on valuesArray
      const filtered = quotes.filter((quote) =>
        valuesArray.every((value) => quote.details.includes(value))
      );

      setFilteredArray(filtered);
      //console.log(filtered);
    }
  }, [arrayValues, quotes]);

  useEffect(() => {
    if (filteredQuotes && filteredQuotes.length > 0) {
      let sum = 0;
      filteredQuotes.forEach((quote) => {
        quote &&
          quote.quoteDetails &&
          quote.quoteDetails.forEach((detail) => {
            sum += Number(detail.quoteData.grandTotal) * Number(detail.quoteData.qty);
            //  console.log(detail.quoteData.qty);
          });
      });
      setTotal(sum);
      setGst((18 / 100) * sum);
    }
  }, [filteredQuotes]);

  const openModal = () => {
    const modal = document.getElementById("onloadModal");
    if (modal) {
      modal.classList.add("show");
      modal.style.display = "block";
      document.body.classList.add("modal-open");
    }
  };

  const closeModal = () => {
    const modal = document.getElementById("onloadModal");
    if (modal) {
      modal.classList.remove("show");
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
  };

  const openModals = () => {
    const modal = document.getElementById("onloadModals");
    if (modal) {
      modal.classList.add("show");
      modal.style.display = "block";
      document.body.classList.add("modal-open");
    }
  };

  const closeModals = () => {
    const modal = document.getElementById("onloadModals");
    if (modal) {
      modal.classList.remove("show");
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
  };

  const openModals1 = () => {
    const modal = document.getElementById("onloadModals1");
    if (modal) {
      modal.classList.add("show");
      modal.style.display = "block";
      document.body.classList.add("modal-open");
    }
  };

  const closeModals1 = () => {
    const modal = document.getElementById("onloadModals1");
    if (modal) {
      modal.classList.remove("show");
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
  };

  const submitDownload = async (option) => {
    closeModaldownload();

    const fromData = {
      user: users,
      client:
        filteredQuotes &&
        filteredQuotes[0].client &&
        filteredQuotes[0].client.number,
      quoteID: quoteIds,
      Discount: downloadData,
    };
    // console.log(fromData);
    try {
      const response = await axios.post(
        `https://upvcapi.sninfoserv.com/download/`,
        fromData
      );
      // console.log(response.data);
      if (response.data.status === "success") {
        handleDownloadPDF(option);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDownloadPDF = (option) => {
    if (!option){
      downloadPDF2026('download');
    }
    if (option === "print") {
      openModal();
      handleDownload(option);
    } else {
      openModal();
      setTimeout(() => {
        downloadPDF2026(option);
      }, 5000);
    }
  };




  const downloadPDF2026 = async () => {
    const element = document.getElementById("pdf-content");
    element.classList.remove("hide");

    const opt = {
      margin: 2,
      filename:
        filteredQuotes &&
        filteredQuotes[0]?.client?.name
          ? `Quote-${filteredQuotes[0].client.name}-${quoteIds}.pdf`
          : "document.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css"] } 
    };

    await html2pdf().set(opt).from(element).save();

    element.classList.add("hide");
    closeModal();
  };

  const downloadCutting2026 = async () => {
    openModals();

    const element = document.getElementById("pdf-cutting-schedule");
    element.classList.remove("hide");

    const opt = {
      margin: 2,
      filename:
        filteredQuotes?.[0]?.client?.name
          ? `Cutting-Schedule-${filteredQuotes[0].client.name}-${quoteIds}.pdf`
          : "document.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css"] }   // 🔥 important
    };

    await html2pdf().set(opt).from(element).save();

    element.classList.add("hide");
    closeModals();
  };





  const handleDownload = async (option) => {
    const input = document.getElementById("pdf-content");
    if (!input) return;

    // Show content temporarily
    input.classList.remove("hide");

    if (option === "print") {
      const printWindow = window.open("", "_blank");
      printWindow.document.body.appendChild(input.cloneNode(true));
      printWindow.print();
      printWindow.close();

      input.classList.add("hide");
    } else {
      const style = document.createElement("style");
      style.innerHTML = `
  
    
    #terms {
        min-height: 300px !important;
        white-space: nowrap !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        line-height: 1.4 !important;
        margin: 5px 0 !important;
        padding-left: 8px !important;
        padding-right: 8px !important;
        padding-top: 0px !important;
        padding-bottom: 0px !important;
        font-size: 12px !important;
    }

    #terms p {
        margin: 0 0 6px 0 !important;
        line-height: 1.3 !important;
    }

    #terms p:empty {
        display: none !important;
    }

    
    #second-table {
        width: auto !important;
        min-width: 100% !important;
        border-collapse: collapse !important;
        border-spacing: 0 !important;
    }

    #second-table, 
    #second-table tr, 
    #second-table td, 
    #second-table th {
        white-space: nowrap !important;
        margin: 0 !important;
        padding: 0 !important;
    }

     

    #second-table td, 
    #second-table th {
        font-size: 12px !important;
        line-height: 1 !important;
    }

     #second-table tfoot tr th {
    padding-left:10px !important;
    padding-right:10px !important;
    padding-top:5px !important;
    
  }

   #second-table tfoot tr th#discountRow,
   #second-table tfoot tr td#discountRow{
     padding-left: 10px !important;
     padding-right: 10px !important;
     padding-top: 5px !important;
     padding-bottom: 5px !important;
   }

   #second-table thead tr th#headerrow{
    padding-bottom: 5px !important;
  }

   #second-table tfoot tr td {
    padding-left:10px !important;
    padding-right:10px !important;
    padding-top:5px !important;
  }


  #second-table tfoot .bank-info {
    padding-bottom: 5px !important;
  }

    body {
        width: 100% !important;
        overflow: visible !important;
    }
`;
      document.head.appendChild(style);

      // const pdf = new jsPDF("p", "mm", "a4");

      const options = {
        margin: 0,
        filename:
          filteredQuotes &&
          filteredQuotes[0].client &&
          filteredQuotes[0].client.name
            ? `Quote-${filteredQuotes[0].client.name}-${quoteIds}.pdf`
            : "document.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          windowWidth: input.scrollWidth,
          windowHeight: input.scrollHeight,
        },
        // html2canvas: { scale: 10},
        // html2canvas: { scale: 4, useCORS: true },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
        // pagebreak: { avoid: ['tr', 'td'] }
        // pagebreak: {
        //   mode: ["avoid-all", "css", "legacy"],
        // },
        pagebreak: {
          // avoid: ['#terms', 'tr', 'td'],
          mode: ["avoid-all", "css", "legacy"],
        },
        // pagebreak: { avoid: ['tr', '#terms'], mode: ["avoid-all", "css", "legacy"] },
      };
      // Convert HTML to PDF
      if (option === "download") {
        html2pdf().from(input).set(options).save();
      }

      setTimeout(() => {
        if (input) input.classList.add("hide");
      }, 1000);
    }

    closeModal();
  };

  //   const handleDownload = async (option) => {
  //    let input = [];

  // if (option === "print" || option === "download") {
  //     input = document.getElementById("pdf-content");
  // }
  //     if (input) input.classList.remove("hide");

  //     // Configuration for html2pdf

  //   //    const style = document.createElement("style");
  //   //  style.innerHTML = `
  //   //    table tr td, table tr th {
  //   //     white-space: nowrap !important;
  //   // }
  //   //   `;
  //   //   document.head.appendChild(style);

  //   const style = document.createElement("style");
  // style.innerHTML = `

  //     #pdf-content {
  //         margin: 0 !important;
  //         box-sizing: border-box !important;
  //         background: #ffffff !important;
  //         font-size: 12px !important;
  //         width: 794px !important;
  //         max-width: 100% !important;
  //         padding:20px !important;
  //     }

  //     /* First table styles for A4 sheet */
  //     #first-table-1 {
  //         width: 100% !important;
  //         max-width: 100% !important;
  //         table-layout: fixed !important;
  //         border-collapse: collapse !important;
  //         margin-bottom: 20px !important;
  //         font-size: 12px !important;
  //     }

  //     #first-table-1,
  //     #first-table-1 tr,
  //     #first-table-1 td,
  //     #first-table-1 th {
  //         box-sizing: border-box !important;
  //     }

  //     #first-table-1 td,
  //     #first-table-1 th {
  //         padding: 4px 6px !important;
  //         font-size: 12px !important;
  //         line-height: 1.2 !important;
  //         vertical-align: top !important;
  //         word-wrap: break-word !important;
  //         overflow: hidden !important;
  //     }

  //     #first-table-1 th[width='20%'] {
  //         width: 20% !important;
  //         max-width: 20% !important;
  //     }

  //     #first-table-1 th[width='60%'] {
  //         width: 60% !important;
  //         max-width: 60% !important;
  //     }

  //     #first-table-1 th[width='50%'] {
  //         width: 50% !important;
  //         max-width: 50% !important;
  //     }

  //     #first-table-1 img {
  //         max-width: 100% !important;
  //         height: auto !important;
  //     }

  //     #first-table-1 th img {
  //         max-height: 50px !important;
  //         object-fit: contain !important;
  //     }

  //     #first-table-1 p {
  //         margin: 2px 0 !important;
  //         line-height: 1.3 !important;
  //         font-size: 12px !important;
  //     }

  //     #first-table-1 h6 {
  //         margin: 3px 0 !important;
  //         font-size: 12px !important;
  //         line-height: 1.3 !important;
  //     }

  //     #first-table-1 ul {
  //         margin: 3px 0 !important;
  //         padding-left: 15px !important;
  //     }

  //     #first-table-1 li {
  //         line-height: 1.3 !important;
  //         margin-bottom: 1px !important;
  //     }

  //     #terms {
  //         min-height: 300px !important;
  //         white-space: nowrap !important;
  //         word-wrap: break-word !important;
  //         overflow-wrap: break-word !important;
  //         line-height: 1.4 !important;
  //         margin: 5px 0 !important;
  //         padding-left: 8px !important;
  //         padding-right: 8px !important;
  //         padding-top: 0px !important;
  //         padding-bottom: 0px !important;
  //         font-size: 12px !important;
  //     }

  //     #terms p {
  //         margin: 0 0 6px 0 !important;
  //         line-height: 1.3 !important;
  //     }

  //     #terms p:empty {
  //         display: none !important;
  //     }

  //     #second-table {
  //         width: auto !important;
  //         min-width: 100% !important;
  //         border-collapse: collapse !important;
  //         border-spacing: 0 !important;
  //     }

  //     #second-table,
  //     #second-table tr,
  //     #second-table td,
  //     #second-table th {
  //         white-space: nowrap !important;
  //         margin: 0 !important;
  //         padding: 0 !important;
  //     }

  //     #second-table td,
  //     #second-table th {
  //         font-size: 12px !important;
  //         line-height: 1 !important;
  //     }

  //      #second-table tfoot tr th {
  //     padding-left:10px !important;
  //     padding-right:10px !important;
  //     padding-top:5px !important;

  //   }

  //    #second-table tfoot tr th#discountRow,
  //    #second-table tfoot tr td#discountRow{
  //      padding-left: 10px !important;
  //      padding-right: 10px !important;
  //      padding-top: 5px !important;
  //      padding-bottom: 5px !important;
  //    }

  //    #second-table thead tr th#headerrow{
  //     padding-bottom: 5px !important;
  //   }

  //    #second-table tfoot tr td {
  //     padding-left:10px !important;
  //     padding-right:10px !important;
  //     padding-top:5px !important;
  //   }

  //   #second-table tfoot .bank-info {
  //     padding-bottom: 5px !important;
  //   }

  //     body {
  //         width: 100% !important;
  //         overflow: visible !important;
  //     }
  // `;
  // document.head.appendChild(style);

  // // const pdf = new jsPDF("p", "mm", "a4");

  //     const options = {
  //        margin: 0,
  //       filename:
  //         filteredQuotes &&
  //         filteredQuotes[0].client &&
  //         filteredQuotes[0].client.name
  //           ? `Quote-${filteredQuotes[0].client.name}-${quoteIds}.pdf`
  //           : "document.pdf",
  //       image: { type: "jpeg", quality: 0.98 },
  //        html2canvas: {
  //             scale: 2,
  //             useCORS: true,
  //             backgroundColor: "#ffffff",
  //             windowWidth: input.scrollWidth,
  //             windowHeight: input.scrollHeight,
  //         },
  //       // html2canvas: { scale: 10},
  //       // html2canvas: { scale: 4, useCORS: true },
  //       jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
  //       // pagebreak: { avoid: ['tr', 'td'] }
  //       // pagebreak: {
  //       //   mode: ["avoid-all", "css", "legacy"],
  //       // },
  //        pagebreak: {
  //         // avoid: ['#terms', 'tr', 'td'],
  //         mode: ["avoid-all", "css", "legacy"],
  //       },
  //       // pagebreak: { avoid: ['tr', '#terms'], mode: ["avoid-all", "css", "legacy"] },
  //     };
  //     // Convert HTML to PDF
  //       if(option === 'download'){
  //             html2pdf().from(input).set(options).save();
  //         }
  //         if (option === "print") {
  //     html2pdf()
  //       .from(input)
  //       .set(options)
  //       .outputPdf('blob')  // generate blob
  //       .then((pdfBlob) => {
  //           const blobUrl = URL.createObjectURL(pdfBlob);
  //           const printWindow = window.open(blobUrl);
  //           printWindow.addEventListener('load', () => {
  //               printWindow.focus();
  //               printWindow.print();
  //           });
  //       });
  // }

  //           //  if (option === "print") {
  //     // Show the content

  //    // input.classList.remove("hide");

  //     // Give browser a moment to render
  //    // setTimeout(() => {
  //         // window.print();
  //           //  pdf.autoPrint();
  //             // window.open(pdf.output("bloburl"), '_blank');

  //         // After print, hide it again
  //       //  input.classList.add("hide");
  //    // }, 200);
  // // }

  //     setTimeout(() => {
  //       if (input) input.classList.add("hide");
  //     }, 1000);

  //     closeModal();
  //   };

  const submitinvoice = async () => {
    let selectedItems = invoicedatadownload;

    if (!invoicedatadownload || invoicedatadownload.length === 0) {
      selectedItems =
        filteredQuotes?.flatMap(
          (quote, quoteIndex) =>
            quote.quoteDetails?.map(
              (detail, detailIndex) =>
                `${detail.quoteData.item}-${detail.rowId}`
            ) || []
        ) || [];
      setInvoicedatadownload(selectedItems);
    }

    if (selectedItems.length === 0) {
      alert("Please select the windows and then proceed");
      return;
    }

    closeModalInvoice();

    const fromData = {
      user: users,
      client:
        filteredQuotes &&
        filteredQuotes[0].client &&
        filteredQuotes[0].client.number,
      quoteID: quoteIds,
      Invoicenumber: inputs.invoice,
      gstno: inputs.gst,
      date: inputs.date,
      Discount: downloadData,
      Filtereditems: invoicedatadownload,
    };
    console.log(fromData);
    try {
      const response = await axios.post(
        `https://upvcapi.sninfoserv.com/invoice/`,
        fromData
      );
      // console.log(response.data);
      if (response.data.status === "success") {
        handleInvoiceDownloadPDF();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInvoiceDownloadPDF = async () => {
    openModals1();
    const input = document.getElementById("pdf-content-invoice");
    input.classList.remove("hide");
    // Configuration for html2pdf
    const options = {
      margin: 0,
      filename:
        filteredQuotes &&
        filteredQuotes[0].client &&
        filteredQuotes[0].client.name
          ? `invoice-${filteredQuotes[0].client.name}-${quoteIds}.pdf`
          : "document.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 4 },
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      // pagebreak: { avoid: ['tr', 'td'] }
      pagebreak: {
        mode: ["avoid-all", "css", "legacy"],
      },
    };

    // Convert HTML to PDF
    html2pdf().from(input).set(options).save();
    setTimeout(() => {
      input.classList.add("hide");
    }, 1000);
    closeModals1();
  };

  const handleSchedulePDF = async () => {
    openModals();
    const inputs = document.getElementById("pdf-schedule");
    inputs.classList.remove("hide");

    const pdfs = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
    const inputHeight = inputs.clientHeight;
    const pageHeight = pdfs.internal.pageSize.getHeight() + 600;
    let currentPosition = 0;
    const scaleFactor = 4;

    // Increase this value for higher resolution and better quality

    while (currentPosition < inputHeight) {
      const canvas = await html2canvas(inputs, {
        height: Math.min(pageHeight),

        y: currentPosition,
        scrollY: -currentPosition,
        scale: scaleFactor,
      });

      const imgData = canvas.toDataURL("image/png", 4);
      pdfs.addImage(
        imgData,
        "PNG",
        5,
        5,
        580,
        pdfs.internal.pageSize.getHeight(),
        "",
        "FAST"
      );
      //currentPosition +=canvas.height;
      currentPosition += pageHeight;
      if (currentPosition < inputHeight) {
        pdfs.addPage();
      }
    }
    pdfs.save(
      "Cutting-Schedule-" + filteredQuotes &&
        filteredQuotes[0].client &&
        filteredQuotes[0].client.name + "-" + quoteIds + ".pdf"
    );
    setTimeout(() => {
      inputs.classList.add("hide");
    }, 1000);

    closeModals();
  };

  const openModalInvoice = () => {
    const modal = document.getElementById("onloadModalInvoice");
    if (modal) {
      modal.classList.add("show");
      modal.style.display = "block";
      document.body.classList.add("modal-open");
    }
  };

  const closeModalInvoice = () => {
    const modal = document.getElementById("onloadModalInvoice");
    if (modal) {
      modal.classList.remove("show");
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
  };

  const openModaldownload = () => {
    const modal = document.getElementById("onloadModalDownload");

    if (modal) {
      modal.classList.add("show");
      modal.style.display = "block";
      document.body.classList.add("modal-open");
    }
  };

  const closeModaldownload = () => {
    const modal = document.getElementById("onloadModalDownload");

    if (modal) {
      modal.classList.remove("show");
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
  };

  const [inputs, setInputs] = useState({ gst: "", date: "", invoice: "" });
  const [input, setInput] = useState({ discount: "" });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleChangediscount = (event) => {
    const newValue = event.target.value;
    setDownloadData(newValue);
  };

  // const createGrill = (boxHeight, topnewHeights, bottomnewHeights, detail.quoteData.mCalc) => {

  //   const boxes =
  //   Array.from({ length: (boxHeight - topnewHeights - bottomnewHeights) * (screen === 40 ? 4.2 : 2) }).map((_, index) => (
  //     <div
  //       key={index}
  //       style={{
  //         float:'left',
  //         position:'absolute',
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
  const createGrill = (boxHeight, topnewHeights, bottomnewHeights, mCalc) => {
    const boxes = Array.from({
      length:
        (boxHeight - topnewHeights - bottomnewHeights) *
        (screen === 40 ? 4.2 : 2),
    }).map((_, index) => (
      <div
        key={index}
        style={{
          float: "left",
          position: "relative",
          width: "100%",
          height: "2.5px",
          border: "1px solid #333",
          background: "#fff",
          marginTop: `4.5px`,
        }}
      ></div>
    ));

    return boxes;
  };
  const handleAddClick = (event) => {
    event.preventDefault();

    ReactSession.set("upvcquoteId", quoteIds);

    window.location.href = "/select";
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
  //         marginTop: `calc((${(height * screen) / detail.quoteData.mCalc + "px"} - 25px) / ${
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
    const unitHeight = isFeet ? "0.21vw" : "20px";
    const marginExpr = isFeet
      ? `calc((${(height * screen) / mcalc}px - 25px) / ${height * 2.7})`
      : `calc((${((height / 304.8) * screen) / mcalc}vw - 9px) / ${
          (height / 304.8) * 2.7
        })`;

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

  // Change Handle

  const changeHandle = (index) => {
    if (boxHandle[index] === "left") {
      const updatedBoxHandle = [...boxHandle];
      updatedBoxHandle[index] = "right";
      setBoxHandle(updatedBoxHandle);
    }
    if (boxHandle[index] === "right") {
      const updatedBoxHandle = [...boxHandle];
      updatedBoxHandle[index] = "left";
      setBoxHandle(updatedBoxHandle);
    }
  };

  // Outer Bottom Line
  const getOuterBottom = (height, screen, mCalc) => {
    const fullHeightpx = (height * screen) / mCalc;
    return `calc(${fullHeightpx}px - 15px)`;
  };

  //  useEffect(() => {
  //     if (filteredQuotes) {
  //       // Example: store the first CasementDoor measure
  //       filteredQuotes.forEach((quote) => {
  //         quote.quoteDetails.forEach((detail) => {
  //           if (detail.quoteData.measure === "mm") {
  //            setMeasure('mm');
  //            setdetail.quoteData.mCalc(304.8);
  //           }else{
  //             setMeasure('ft');
  //            setdetail.quoteData.mCalc(1);
  //           }
  //         });

  //       });
  //     }
  //     setMeasure('ft');
  //     setdetail.quoteData.mCalc(1);
  //   }, [filteredQuotes]);

  //  console.log("screen",measure);

  const handleInvoice = (event) => {
    const newValue = event.target.value;

    // Check if value already exists in array
    if (invoicedatadownload.includes(newValue)) {
      // Remove if exists
      setInvoicedatadownload(
        invoicedatadownload.filter((item) => item !== newValue)
      );
    } else {
      // Add if doesn't exist
      setInvoicedatadownload([...invoicedatadownload, newValue]);
    }
  };

  return (
    <div>
      <Navbar />
      <Header />

      <div
        class="modal fade custom-modal"
        id="onloadModalInvoice"
        tabindex="-1"
        aria-labelledby="onloadModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content" align="center">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={closeModalInvoice}
              style={{ position: "absolute", right: "10px" }}
            ></button>
            <div className="col-md-12 col-xxl-12 col-xl-12 mt-5">
              <div className="card">
                <div className="card-header">
                  <h5>Invoice Details</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="discount">
                          Select the windows, door and Ventilator to download
                          the invoice
                        </label>
                        <div
                          style={{
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            padding: "10px",
                            maxHeight: "200px",
                            overflowY: "auto",
                          }}
                        >
                          {filteredQuotes?.map((quote, quoteIndex) =>
                            quote.quoteDetails?.map((detail, detailIndex) => (
                              <div
                                key={`${quoteIndex}-${detailIndex}`}
                                style={{ marginBottom: "8px" }}
                              >
                                <label
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    value={`${detail.quoteData.item}-${detail.rowId}`}
                                    checked={invoicedatadownload.includes(
                                      `${detail.quoteData.item}-${detail.rowId}`
                                    )}
                                    onChange={handleInvoice}
                                    style={{
                                      width: "18px",
                                      height: "18px",
                                      cursor: "pointer",
                                      marginRight: "8px",
                                      accentColor: "#0d6efd",
                                    }}
                                  />
                                  <span style={{ fontSize: "14px" }}>
                                    {detail.quoteData.item}
                                  </span>
                                </label>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {invoicedatadownload.length > 0 && (
                        <div className="col-md-12 mt-3">
                          <div
                            className="alert alert-info"
                            style={{ marginBottom: "10px" }}
                          >
                            <strong>Selected Items:</strong>{" "}
                            {invoicedatadownload.join(", ")}
                          </div>
                        </div>
                      )}
                    </div>
                    {matchedQuotes[0]?.quoteID !== quoteIds && (
                      <>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="name">
                              GST Number
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="Gst"
                              placeholder="Enter GST Number..."
                              name="gst"
                              required
                              value={inputs.gst || ""}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="location">
                              Date
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              id="date"
                              placeholder="Enter location..."
                              name="date"
                              required
                              value={inputs.date || ""}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="phone">
                              Invoice Number
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="invoice Number"
                              placeholder="Enter Invoice Number..."
                              name="invoice"
                              required
                              value={inputs.invoice || ""}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </>
                    )}
                    <div className="col-md-12" align="center">
                      <button
                        onClick={submitinvoice}
                        className="btn btn-primary mb-4 w-25"
                      >
                        Download Invoice{" "}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal fade custom-modal"
        id="onloadModalDownload"
        tabindex="-1"
        aria-labelledby="onloadModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content" align="center">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={closeModaldownload}
              style={{ position: "absolute", right: "10px" }}
            ></button>
            <div className="col-md-12 col-xxl-12  col-xl-12 mt-5">
              <div className="card">
                <div className="card-header">
                  <h5>Download Details</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="name">
                          Discount is {downloadData}%. You can Update the
                          Discount
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="Gst"
                          placeholder="Enter Discount..."
                          name="discount"
                          required
                          value={downloadData}
                          onChange={handleChangediscount}
                        />
                      </div>
                    </div>
                    <div className="col-md-12 text-center">
                      <button
                        onClick={toggleButton}
                        className={`btn ${
                          isToggled ? "btn-success" : "btn-danger"
                        } mb-4 btn-width`}
                      >
                        {isToggled ? "With Gst" : "Without Gst"}
                      </button>

                      <button
                        onClick={() => submitDownload("download")}
                        className="btn btn-primary mb-4 btn-width"
                      >
                        Download Quotes
                      </button>

                      <button
                        onClick={() => submitDownload("print")}
                        className="btn btn-secondary mb-4 btn-width"
                      >
                        Print Quotes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pc-container">
        <div className="pc-content">
          <div className="row">
            <div className="col-md-12 col-xxl-12 col-xl-12">
              <div className="card">
                <div className="card-header">
                  <h5>Quotes</h5>

                  <div class="row mt-5">
                    <div class="col-md-6 col-xxl-3 col-xl-3 ">
                      <div class="card">
                        <div class="card-body">
                          <h4 class="mb-3">Quote</h4>
                          {filteredQuotes?.map((quote, index) => (
                            <>
                              <h6 class="mb-3">{quote.date}</h6>
                              <h6 class="mb-3">{quote.cusQuoteId}</h6>
                              <h6 class="mb-3">{quote.items} Items</h6>
                            </>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 col-xxl-6 col-xl-6">
                      <div class="card">
                        <div class="card-body">
                          <h4 class="mb-3">Client</h4>
                          {filteredQuotes?.map((quote, index) => (
                            <>
                              <h6 class="mb-3">{quote.client.name}</h6>
                              <h6 class="mb-3">{quote.client.location}</h6>
                              <h6 class="mb-3">{quote.client.number}</h6>
                            </>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 col-xxl-3 col-xl-3">
                      <div class="card">
                        <div class="card-body">
                          <h4 class="mb-3">Amount</h4>
                          <h6 class="mb-3">
                            <span style={{ fontWeight: "bold" }}>Total :</span>{" "}
                            ₹ {numeral(total).format("0,0.00")}
                          </h6>
                          <h6 class="mb-3">
                            <span style={{ fontWeight: "bold" }}>
                              GST 18% :
                            </span>{" "}
                            ₹ {numeral(gst).format("0,0.00")}
                          </h6>
                          <h6 class="mb-3">
                            <span style={{ fontWeight: "bold" }}>
                              Grand Total :
                            </span>{" "}
                            ₹ {numeral(total + gst).format("0,0.00")}
                          </h6>
                        </div>
                      </div>
                    </div>
                    {filteredQuotes &&
                      filteredQuotes[0].quoteDetails.length > 0 && (
                        <>
                          <div class="col-md-6 col-xxl-12 col-xl-12">
                            <div class="card">
                              <div class="card-body">
                                <div class="d-flex align-items-center">
                                  <div class="flex-grow-1 ms-3">
                                    <h6 class="mb-2">Download</h6>
                                  </div>
                                </div>

                                <div class="bg-body p-3 mt-1 rounded">
                                  <div class="mt-1 row align-items-center">
                                    <div class="col-12">
                                      <div class="col-md-12 col-xxl-12 col-xl-12">
                                        <div class="row">
                                          {/* <!-- Home Component and Quote Section --> */}

                                          <div class="col-md-4 col-xxl-4 col-xl-4">
                                            {/* <HomeComponent
                                              discount={downloadData}
                                              toggle={isToggled}
                                              id="pdf-content"
                                            /> */}

                                            {matchedQuotes[0]?.quoteID ===
                                            quoteIds ? (
                                              <button
                                                class="btn btn-primary p-3 mb-1 w-100"
                                                onClick={()=>handleDownloadPDF('download')}
                                              >
                                                Quote{" "}
                                              </button>
                                            ) : (
                                              <button
                                                class="btn btn-primary p-3 mb-1 w-100"
                                                onClick={openModaldownload}
                                              >
                                                {" "}
                                                Quote{" "}
                                              </button>
                                            )}
                                          </div>

                                          {/* <!-- Cutting Schedule Section --> */}
                                          
                                          <div className="col-md-4 col-xxl-4 col-xl-4">
                                              <button className="btn btn-warning p-3 mb-1 w-100" onClick={ downloadCutting2026 } >
                                                Cutting Schedule
                                              </button>
                                          </div>

                                          {/* <!-- Invoice Section --> */}
                                          <div class="col-md-4 col-xxl-4 col-xl-4">
                                            {/* <Invoice
                                              gstNo={matchedQuotes[0]?.gst}
                                              date={matchedQuotes[0]?.date}
                                              invoice={
                                                matchedQuotes[0]?.invoiceNumber
                                              }
                                              discount={downloadData}
                                              id="pdf-content-invoice"
                                            /> */}
                                            <Invoice
                                              gstNo={
                                                matchedQuotes[0]?.gst ||
                                                inputs.gst
                                              }
                                              date={
                                                matchedQuotes[0]?.date ||
                                                inputs.date
                                              }
                                              invoice={
                                                matchedQuotes[0]
                                                  ?.invoiceNumber ||
                                                inputs.invoice
                                              }
                                              discount={downloadData}
                                              filtereditems={
                                                invoicedatadownload
                                              }
                                              id="pdf-content-invoice"
                                            />
                                            <button
                                              class="btn btn-success p-3 mb-1 w-100"
                                              onClick={openModalInvoice}
                                            >
                                              Invoice
                                            </button>
                                            {/* {matchedQuotes[0]?.quoteID ===quoteIds ? (
                                              <button class="btn btn-success p-3 mb-1 w-100" onClick={handleInvoiceDownloadPDF}>Invoice</button>
                                            ) : (
                                              <button class="btn btn-success p-3 mb-1 w-100" onClick={openModalInvoice}>Invoice</button>
                                            )} */}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                  </div>
                </div>
                {filteredQuotes &&
                  filteredQuotes[0].quoteDetails?.length === 0 && (
                    <>
                      <div class="card-body">
                        <div class="row">
                          <div class="col-12">
                            <h4 align="center">No Quotess Are Available...</h4>
                            <div
                              class="d-grid"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <a
                                class="btn btn-outline-secondary"
                                href="/select"
                                onClick={handleAddClick}
                              >
                                <i class="ti ti-plus"></i> Add
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
              </div>
            </div>

            {filteredQuotes?.map((quote, index) =>
              quote.quoteDetails.map((detail, detailIndex) => (
                <>
                  <div class="col-md-12 col-xxl-12 col-xl-12">
                    <div class="card" style={{ background: "#fff" }}>
                      <div class="card-body">
                        <h6
                          class="mb-4"
                          style={{ color: "#000", fontSize: "12px" }}
                          align="left"
                        >
                          {detail.quoteData.item}
                        </h6>

                        <div class="row">
                          <div class="col-md-10 col-xxl-10 col-xl-10">
                            <div
                              style={{
                                marginLeft: "auto",
                                marginRight: "auto",
                                textAlign: "center",
                                alignItems: "center",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                gap: "10px",
                              }}
                            >
                              {detail.quoteData.item === "CasementDoor" && (
                                <>
                                  <div
                                    align="center"
                                    style={{
                                      alignContent: "center",
                                      alignItems: "center",
                                      textAlign: "center",
                                      marginLeft: "auto",
                                      marginRight: "auto",
                                    }}
                                  >
                                    <div
                                      style={{
                                        float: "left",
                                        boxShadow: "1px 1px 5px grey",
                                        width:
                                          (detail.quoteData.boxWidth * screen) /
                                            detail.quoteData.mCalc +
                                          "px",
                                        height:
                                          (detail.quoteData.boxHeight *
                                            screen) /
                                            detail.quoteData.mCalc +
                                          "px",
                                        border: "1px solid #333",
                                      }}
                                    >
                                      {[
                                        ...Array(detail.quoteData.numFrames),
                                      ].map((_, index) => (
                                        <div
                                          style={{
                                            float: "left",
                                            margin: "2px",
                                            border: "1px solid #333",
                                            width: `calc(${
                                              (parseFloat(
                                                detail.quoteData.boxWidth
                                              ) *
                                                screen) /
                                                detail.quoteData.mCalc /
                                                detail.quoteData.numFrames +
                                              "px"
                                            } - 6px)`,
                                            height:
                                              bottomFrame === "yes"
                                                ? `calc(${
                                                    (parseFloat(
                                                      detail.quoteData.boxHeight
                                                    ) *
                                                      screen) /
                                                      detail.quoteData.mCalc +
                                                    "px"
                                                  } - 6px)`
                                                : `calc(${
                                                    (parseFloat(
                                                      detail.quoteData.boxHeight
                                                    ) *
                                                      screen) /
                                                      detail.quoteData.mCalc +
                                                    "px"
                                                  } - 6px)`,
                                            position: "relative",
                                          }}
                                        >
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

                                          {detail.quoteData.boxTop === "on" &&
                                            [
                                              ...Array(
                                                detail.quoteData.numTopBoxes
                                              ),
                                            ].map((_, index) => (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                      detail.quoteData.mCalc /
                                                      detail.quoteData
                                                        .numFrames +
                                                    "px"
                                                  } - 18px)`,
                                                  position: "relative",
                                                  height: `calc(${
                                                    (detail.quoteData
                                                      .topnewHeights *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px )`,
                                                  margin: "5px",
                                                  position: "relative",
                                                }}
                                              >
                                                {[
                                                  ...Array(
                                                    detail.quoteData.topFixedNum
                                                  ),
                                                ].map((_, index) => (
                                                  <div
                                                    style={{
                                                      flex: "1",
                                                      backgroundColor: "white",
                                                      padding: "4px",
                                                      boxSizing: "border-box",
                                                      width: `calc(${
                                                        (detail.quoteData
                                                          .topFixedWidth[
                                                          index
                                                        ] *
                                                          screen) /
                                                          detail.quoteData
                                                            .mCalc /
                                                          detail.quoteData
                                                            .numFrames +
                                                        "px"
                                                      } - 18px)`,
                                                      height: `calc(${
                                                        (detail.quoteData
                                                          .topnewHeights *
                                                          screen) /
                                                        detail.quoteData.mCalc
                                                      }px )`,
                                                      border: "solid 1px #000",
                                                      marginLeft:
                                                        index === 0
                                                          ? "0px"
                                                          : "5px",
                                                      position: "relative",
                                                    }}
                                                  >
                                                    <div
                                                      style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        border:
                                                          "1px solid #333",
                                                        backgroundColor:
                                                          "lightgreen",
                                                        position: "relative",
                                                      }}
                                                    >
                                                      {/* Inner corner lines start */}
                                                      <div
                                                        style={{
                                                          height: "7px",
                                                          width: "1px",
                                                          float: "right",
                                                          marginTop: "-6.5px",
                                                          marginRight: "-3px",
                                                          transform:
                                                            "rotate(45deg)",
                                                          borderRight:
                                                            "1px solid black",
                                                        }}
                                                      ></div>
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "left",
                                                          marginTop: "-6px",
                                                          marginLeft: "-3px",
                                                          transform:
                                                            "rotate(-45deg)",
                                                          borderLeft:
                                                            "1px solid black",
                                                        }}
                                                      ></div>
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "right",
                                                          marginTop: `calc(${
                                                            (detail.quoteData
                                                              .topnewHeights *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - 12px)`,
                                                          marginRight: "-4px",
                                                          transform:
                                                            "rotate(-45deg)",
                                                          borderLeft:
                                                            "1px solid black",
                                                        }}
                                                      ></div>
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "left",
                                                          marginTop: `calc(${
                                                            (detail.quoteData
                                                              .topnewHeights *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - 12px)`,
                                                          marginLeft: "-3px",
                                                          transform:
                                                            "rotate(45deg)",
                                                          borderLeft:
                                                            "1px solid black",
                                                        }}
                                                      ></div>
                                                      {/* Inner corner lines end */}
                                                      {/* outer corner lines start for bottom sash*/}
                                                      <div
                                                        style={{
                                                          height: "7px",
                                                          width: "1px",
                                                          float: "right",
                                                          marginTop: "-12px",
                                                          marginRight: "-9px",
                                                          transform:
                                                            "rotate(45deg)",
                                                          background:
                                                            index ===
                                                            detail.quoteData
                                                              .topFixedWidth
                                                              .length -
                                                              1
                                                              ? "black"
                                                              : "transparent",
                                                        }}
                                                      ></div>
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "left",
                                                          marginTop: "-12px",
                                                          marginLeft: "-9px",
                                                          transform:
                                                            "rotate(-45deg)",
                                                          background:
                                                            index === 0
                                                              ? "black"
                                                              : "transparent",
                                                        }}
                                                      ></div>
                                                      {/* <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${bottomnewHeights*screen/detail.quoteData.mCalc}px - 12px)`, marginRight: '-11px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                                                                 <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${bottomnewHeights*screen/detail.quoteData.mCalc}px - 12px)`, marginLeft: '-9px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>  */}
                                                      {/* outer corner lines end */}
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "right",
                                                          marginTop: `calc(${
                                                            (detail.quoteData
                                                              .topnewHeights *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - 8px)`,
                                                          marginRight: "-6px",
                                                          transform:
                                                            "rotate(180deg)",
                                                          background:
                                                            (detail.quoteData
                                                              .topFixedWidth
                                                              .length === 0 &&
                                                              detail.quoteData
                                                                .boxTop ===
                                                                "on") ||
                                                            index ===
                                                              detail.quoteData
                                                                .topFixedWidth
                                                                .length -
                                                                1
                                                              ? "black"
                                                              : "transparent",
                                                        }}
                                                      ></div>
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "left",
                                                          marginTop: `calc(${
                                                            (detail.quoteData
                                                              .topnewHeights *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - 8px)`,
                                                          marginLeft: "-6px",
                                                          transform:
                                                            "rotate(180deg)",
                                                          background:
                                                            index === 0
                                                              ? "black"
                                                              : "transparent",
                                                        }}
                                                      ></div>

                                                      {/* fixed plus  */}
                                                      <div
                                                        style={{
                                                          position: "absolute",
                                                          top: "50%",
                                                          left: "50%",
                                                          transform:
                                                            "translate(-50%, -50%)",
                                                          fontSize: "30px",
                                                          fontWeight: "200",
                                                          cursor: "pointer",
                                                          color: "#000",
                                                          zIndex: 1,
                                                        }}
                                                      >
                                                        +
                                                      </div>
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            ))}

                                          <div style={{ display: "flex" }}>
                                            {[
                                              ...Array(
                                                detail.quoteData
                                                  .numSecondInnerBoxes
                                              ),
                                            ].map((_, index) => (
                                              <div
                                                key={index}
                                                style={{
                                                  backgroundColor: "white",
                                                  boxSizing: "border-box",
                                                  height: `calc(${
                                                    ((detail.quoteData
                                                      .boxHeight -
                                                      detail.quoteData
                                                        .topnewHeights -
                                                      detail.quoteData
                                                        .bottomnewHeights) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - ${
                                                    detail.quoteData
                                                      .bottomFrame === "no"
                                                      ? "18px"
                                                      : "23px"
                                                  } - ${
                                                    detail.quoteData.boxTop ===
                                                    "on"
                                                      ? "0px"
                                                      : "-5px"
                                                  })`,
                                                  position: "relative",
                                                  width: `calc(${
                                                    (detail.quoteData.newWidths[
                                                      index
                                                    ] *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px )`,
                                                  marginTop:
                                                    detail.quoteData.boxTop ===
                                                    "on"
                                                      ? "0px"
                                                      : "5px",
                                                  marginRight:
                                                    index ===
                                                    detail.quoteData
                                                      .numSecondInnerBoxes -
                                                      1
                                                      ? "5px"
                                                      : "2.5px",
                                                  marginLeft:
                                                    index === 0
                                                      ? "5px"
                                                      : "4.5px",
                                                  padding: "0px",
                                                  border: "1px solid #333",
                                                }}
                                              >
                                                {/* //  <div key={index}  style={{ backgroundColor: 'white',boxSizing: 'border-box' ,  height: `calc(${(boxHeight - topnewHeights - bottomnewHeights) * screen / detail.quoteData.mCalc}vw - ${bottomFrame === 'no' ? '18px' : '23px'} - ${boxTop === 'on' ? '0px' : '-5px'})`,position:'relative' , width: `calc(${newWidths[index] * screen / detail.quoteData.mCalc}vw )`,  marginTop: boxTop === 'on' ? '0px' : '5px', marginRight: index === numSecondInnerBoxes - 1 ? '5px' : '2.5px', marginLeft: index === 0 ? '5px' : '4.5px',padding:'5px',border: '1px solid #333' }}> */}

                                                <div
                                                  style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    border: "1px solid #333",
                                                    backgroundColor:
                                                      detail.quoteData.split ===
                                                      "on"
                                                        ? "transparent"
                                                        : detail.quoteData
                                                            .panelType === 1
                                                        ? "lightgray"
                                                        : detail.quoteData
                                                            .panelType === 2
                                                        ? "lightyellow"
                                                        : "lightblue",
                                                    position: "relative",
                                                  }}
                                                >
                                                  {/* Inner corner lines start */}
                                                  <div
                                                    key={index}
                                                    style={{
                                                      height:
                                                        detail.quoteData
                                                          .bottomFrame === "no"
                                                          ? "11px"
                                                          : "15px",
                                                      width: "1px",
                                                      float: "left",
                                                      marginTop: `calc(${
                                                        ((detail.quoteData
                                                          .boxHeight -
                                                          detail.quoteData
                                                            .topnewHeights -
                                                          detail.quoteData
                                                            .bottomnewHeights) *
                                                          screen) /
                                                        detail.quoteData.mCalc
                                                      }px - ${
                                                        detail.quoteData
                                                          .boxTop === "on"
                                                          ? detail.quoteData
                                                              .bottomFrame ===
                                                            "no"
                                                            ? "33px"
                                                            : "39px"
                                                          : detail.quoteData
                                                              .bottomFrame ===
                                                            "no"
                                                          ? "28px"
                                                          : "34px"
                                                      })`,
                                                      marginLeft:
                                                        detail.quoteData
                                                          .boxBottom === "on"
                                                          ? "-8px"
                                                          : "-6px",
                                                      transform:
                                                        "rotate(45deg)",
                                                      borderLeft:
                                                        "1px solid grey",
                                                    }}
                                                  ></div>
                                                  <div
                                                    key={index}
                                                    style={{
                                                      height:
                                                        detail.quoteData
                                                          .boxTop === "on"
                                                          ? "11px"
                                                          : "15px",
                                                      width: "1px",
                                                      float: "left",
                                                      marginTop:
                                                        detail.quoteData
                                                          .boxTop === "on"
                                                          ? "-9px"
                                                          : "-14px",
                                                      marginLeft:
                                                        detail.quoteData
                                                          .boxTop === "on"
                                                          ? "-4px"
                                                          : "-6px",
                                                      transform:
                                                        "rotate(-45deg)",
                                                      borderLeft:
                                                        "1px solid grey",
                                                    }}
                                                  ></div>
                                                  <div
                                                    style={{
                                                      height:
                                                        detail.quoteData
                                                          .boxTop === "on"
                                                          ? "11px"
                                                          : "15px",
                                                      width: "1px",
                                                      float: "right",
                                                      marginTop:
                                                        detail.quoteData
                                                          .boxTop === "on"
                                                          ? "-9px"
                                                          : "-14px",
                                                      marginRight:
                                                        detail.quoteData
                                                          .boxTop === "on"
                                                          ? "-4px"
                                                          : "-6px",
                                                      transform:
                                                        "rotate(45deg)",
                                                      borderRight:
                                                        "1px solid grey",
                                                    }}
                                                  ></div>
                                                  {/* <div style={{ height: '15px', width: '1px', float: 'left', marginTop: getInnerBottom(detail.quoteData.boxHeight - topnewHeights - bottomnewHeights, screen, detail.quoteData.mCalc), marginLeft: '-4px', transform: 'rotate(-45deg)', borderLeft: index === 0 ? 'transparent' : '1px solid black' }}></div> */}
                                                  <div
                                                    style={{
                                                      height:
                                                        detail.quoteData
                                                          .bottomFrame === "no"
                                                          ? "11px"
                                                          : "15px",
                                                      width: "1px",
                                                      float: "right",
                                                      marginTop: `calc(${
                                                        ((detail.quoteData
                                                          .boxHeight -
                                                          detail.quoteData
                                                            .topnewHeights -
                                                          detail.quoteData
                                                            .bottomnewHeights) *
                                                          screen) /
                                                        detail.quoteData.mCalc
                                                      }px - ${
                                                        detail.quoteData
                                                          .boxTop === "on"
                                                          ? detail.quoteData
                                                              .bottomFrame ===
                                                            "no"
                                                            ? "33px"
                                                            : "39px"
                                                          : detail.quoteData
                                                              .bottomFrame ===
                                                            "no"
                                                          ? "28px"
                                                          : "34px"
                                                      })`,
                                                      marginRight:
                                                        detail.quoteData
                                                          .boxBottom === "on"
                                                          ? "-4px"
                                                          : "-6px",
                                                      transform:
                                                        "rotate(-45deg)",
                                                      borderLeft:
                                                        "1px solid grey",
                                                    }}
                                                  ></div>
                                                  <div
                                                    style={{
                                                      height: "10px",
                                                      width: "1px",
                                                      float: "right",
                                                      marginTop: `calc(${
                                                        ((detail.quoteData
                                                          .boxHeight -
                                                          detail.quoteData
                                                            .topnewHeights -
                                                          detail.quoteData
                                                            .bottomnewHeights) *
                                                          screen) /
                                                        detail.quoteData.mCalc
                                                      }px - ${
                                                        detail.quoteData
                                                          .boxBottom === "on"
                                                          ? "33px"
                                                          : "27px"
                                                      })`,
                                                      marginRight: "-4px",
                                                      transform:
                                                        "rotate(-45deg)",
                                                      borderRight:
                                                        index === -1
                                                          ? "1px solid grey"
                                                          : "none",
                                                    }}
                                                  ></div>
                                                  {/* <div style={{ height: '7px', width: '1px', float: 'left', right: '0px', marginTop: '-6px', marginRight: '-1px', background: index === 0 ? 'transparent' : 'black' }}></div> */}
                                                  {/* Inner corner lines ends */}

                                                  {/* {detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.grill === 'yes' && <div style={{position: 'absolute', width: `calc(${(detail.quoteData.boxWidth/(detail.quoteData.shutterCount + detail.quoteData.fixedCount))*screen}px - ${(detail.quoteData.shutterCount + detail.quoteData.fixedCount) === 1 ? '32px' : (detail.quoteData.shutterCount + detail.quoteData.fixedCount) === 2 ? '28px' : (detail.quoteData.shutterCount + detail.quoteData.fixedCount) === 3 ? '24px' : '23px'})`}}> {boxes} </div>} */}

                                                  {detail.quoteData.boxNames[
                                                    index
                                                  ] === "Shutter" &&
                                                    detail.quoteData.grill ===
                                                      "yes" && (
                                                      <div
                                                        style={{
                                                          position: "absolute",
                                                          width: "100%",
                                                        }}
                                                      >
                                                        {boxes(
                                                          detail.quoteData
                                                            .mCalc,
                                                          detail.quoteData
                                                            .measure,
                                                          detail.quoteData
                                                            .boxHeight -
                                                            detail.quoteData
                                                              .topnewHeights -
                                                            detail.quoteData
                                                              .bottomnewHeights
                                                        )}
                                                      </div>
                                                    )}
                                                  {detail.quoteData.boxNames[
                                                    index
                                                  ] === "Shutter" ? (
                                                    detail.quoteData.boxHandle[
                                                      index
                                                    ] === "left" ? (
                                                      <>
                                                        <img
                                                          src={left}
                                                          style={{
                                                            float: "left",
                                                            marginTop: `calc(${
                                                              ((detail.quoteData
                                                                .boxHeight -
                                                                detail.quoteData
                                                                  .topnewHeights -
                                                                detail.quoteData
                                                                  .bottomnewHeights) *
                                                                screen) /
                                                              detail.quoteData
                                                                .mCalc /
                                                              2
                                                            }px - ${
                                                              screen === 40
                                                                ? "28px"
                                                                : "25px"
                                                            }`,
                                                            marginLeft: "-5px",
                                                            width:
                                                              screen === 40
                                                                ? "13px"
                                                                : "8px",
                                                          }}
                                                          alt="Left Handle"
                                                        />
                                                        {/* dotted line start */}
                                                        <div
                                                          style={{
                                                            position:
                                                              "absolute",
                                                            top:
                                                              detail.quoteData
                                                                .split === "on"
                                                                ? `calc(${
                                                                    detail
                                                                      .quoteData
                                                                      .topnewHeights >
                                                                    0
                                                                      ? ((detail
                                                                          .quoteData
                                                                          .shutterHeight[
                                                                          index
                                                                        ]
                                                                          .height -
                                                                          0.5) *
                                                                          screen) /
                                                                        detail
                                                                          .quoteData
                                                                          .mCalc
                                                                      : (detail
                                                                          .quoteData
                                                                          .shutterHeight[
                                                                          index
                                                                        ]
                                                                          .height *
                                                                          screen) /
                                                                        detail
                                                                          .quoteData
                                                                          .mCalc
                                                                  }px + ${
                                                                    detail
                                                                      .quoteData
                                                                      .topnewHeights >
                                                                    0
                                                                      ? "12px"
                                                                      : "-8px"
                                                                  } - ${
                                                                    screen ===
                                                                    20
                                                                      ? "10px"
                                                                      : "0px"
                                                                  })`
                                                                : "0",
                                                            right: 0,
                                                            width: "100%",
                                                            height:
                                                              detail.quoteData
                                                                .split == "on"
                                                                ? `calc(${
                                                                    ((detail
                                                                      .quoteData
                                                                      .boxHeight -
                                                                      detail
                                                                        .quoteData
                                                                        .shutterHeight[
                                                                        index
                                                                      ].height -
                                                                      detail
                                                                        .quoteData
                                                                        .topnewHeights) *
                                                                      screen) /
                                                                    detail
                                                                      .quoteData
                                                                      .mCalc
                                                                  }px - 21px  - ${
                                                                    detail
                                                                      .quoteData
                                                                      .bottomFrame ===
                                                                    "no"
                                                                      ? "-4px"
                                                                      : "1px"
                                                                  } - ${
                                                                    detail
                                                                      .quoteData
                                                                      .split ===
                                                                    "on"
                                                                      ? "5px"
                                                                      : "1px"
                                                                  })`
                                                                : "100%",
                                                            zIndex: 1,
                                                            overflow: "hidden",
                                                          }}
                                                        >
                                                          {/* Line from center to top-right */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              top: "50%",
                                                              right: "0",
                                                              width: "2px",
                                                              height: "2000%",
                                                              borderLeft:
                                                                "1px dashed gray",
                                                              transform: `rotate(${
                                                                (detail
                                                                  .quoteData
                                                                  .boxTop ===
                                                                  "on" ||
                                                                detail.quoteData
                                                                  .boxBottom ===
                                                                  "on"
                                                                  ? -1
                                                                  : 0) +
                                                                90 +
                                                                Math.acos(
                                                                  (2 *
                                                                    (detail
                                                                      .quoteData
                                                                      .newWidths[
                                                                      index
                                                                    ] /
                                                                      2)) /
                                                                    Math.sqrt(
                                                                      4 *
                                                                        (detail
                                                                          .quoteData
                                                                          .newWidths[
                                                                          index
                                                                        ] /
                                                                          2) *
                                                                        (detail
                                                                          .quoteData
                                                                          .newWidths[
                                                                          index
                                                                        ] /
                                                                          2) +
                                                                        (((detail
                                                                          .quoteData
                                                                          .boxHeight -
                                                                          detail
                                                                            .quoteData
                                                                            .topnewHeights -
                                                                          detail
                                                                            .quoteData
                                                                            .bottomnewHeights -
                                                                          (detail
                                                                            .quoteData
                                                                            .split ===
                                                                          "on"
                                                                            ? detail
                                                                                .quoteData
                                                                                .shutterHeight[
                                                                                index
                                                                              ]
                                                                                .height
                                                                            : 0)) /
                                                                          2) *
                                                                          (detail
                                                                            .quoteData
                                                                            .boxHeight -
                                                                            detail
                                                                              .quoteData
                                                                              .topnewHeights -
                                                                            detail
                                                                              .quoteData
                                                                              .bottomnewHeights -
                                                                            (detail
                                                                              .quoteData
                                                                              .split ===
                                                                            "on"
                                                                              ? detail
                                                                                  .quoteData
                                                                                  .shutterHeight[
                                                                                  index
                                                                                ]
                                                                                  .height
                                                                              : 0))) /
                                                                          2
                                                                    )
                                                                ) *
                                                                  (180 /
                                                                    Math.PI) +
                                                                (detail
                                                                  .quoteData
                                                                  .numSecondInnerBoxes ===
                                                                1
                                                                  ? 0
                                                                  : detail
                                                                      .quoteData
                                                                      .numSecondInnerBoxes)
                                                              }deg)`,
                                                              transformOrigin:
                                                                "top right",
                                                            }}
                                                          ></div>

                                                          {/* Line from center to bottom-right */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              bottom: "50%",
                                                              right: "0",
                                                              width: "2px",
                                                              height: "2000%",
                                                              borderLeft:
                                                                "1px dashed gray",
                                                              transform: `rotate(-${
                                                                (detail
                                                                  .quoteData
                                                                  .boxTop ===
                                                                  "on" ||
                                                                detail.quoteData
                                                                  .boxBottom ===
                                                                  "on"
                                                                  ? -1
                                                                  : 0) +
                                                                90 +
                                                                Math.acos(
                                                                  (2 *
                                                                    (detail
                                                                      .quoteData
                                                                      .newWidths[
                                                                      index
                                                                    ] /
                                                                      2)) /
                                                                    Math.sqrt(
                                                                      4 *
                                                                        (detail
                                                                          .quoteData
                                                                          .newWidths[
                                                                          index
                                                                        ] /
                                                                          2) *
                                                                        (detail
                                                                          .quoteData
                                                                          .newWidths[
                                                                          index
                                                                        ] /
                                                                          2) +
                                                                        (((detail
                                                                          .quoteData
                                                                          .boxHeight -
                                                                          detail
                                                                            .quoteData
                                                                            .topnewHeights -
                                                                          detail
                                                                            .quoteData
                                                                            .bottomnewHeights -
                                                                          (detail
                                                                            .quoteData
                                                                            .split ===
                                                                          "on"
                                                                            ? detail
                                                                                .quoteData
                                                                                .shutterHeight[
                                                                                index
                                                                              ]
                                                                                .height
                                                                            : 0)) /
                                                                          2) *
                                                                          (detail
                                                                            .quoteData
                                                                            .boxHeight -
                                                                            detail
                                                                              .quoteData
                                                                              .topnewHeights -
                                                                            detail
                                                                              .quoteData
                                                                              .bottomnewHeights -
                                                                            (detail
                                                                              .quoteData
                                                                              .split ===
                                                                            "on"
                                                                              ? detail
                                                                                  .quoteData
                                                                                  .shutterHeight[
                                                                                  index
                                                                                ]
                                                                                  .height
                                                                              : 0))) /
                                                                          2
                                                                    )
                                                                ) *
                                                                  (180 /
                                                                    Math.PI) +
                                                                (detail
                                                                  .quoteData
                                                                  .numSecondInnerBoxes ===
                                                                1
                                                                  ? 0
                                                                  : detail
                                                                      .quoteData
                                                                      .numSecondInnerBoxes)
                                                              }deg)`,
                                                              transformOrigin:
                                                                "bottom right",
                                                            }}
                                                          ></div>
                                                        </div>
                                                        {/* dotted line end */}
                                                      </>
                                                    ) : (
                                                      <>
                                                        <img
                                                          src={right}
                                                          style={{
                                                            float: "right",
                                                            marginTop: `calc(${
                                                              ((detail.quoteData
                                                                .boxHeight -
                                                                detail.quoteData
                                                                  .topnewHeights -
                                                                detail.quoteData
                                                                  .bottomnewHeights) *
                                                                screen) /
                                                              detail.quoteData
                                                                .mCalc /
                                                              2
                                                            }px - ${
                                                              screen === 40
                                                                ? "28px"
                                                                : "25px"
                                                            }`,
                                                            marginRight: "-5px",
                                                            width:
                                                              screen === 40
                                                                ? "13px"
                                                                : "8px",
                                                          }}
                                                          alt="Right Handle"
                                                        />

                                                        <div
                                                          style={{
                                                            position:
                                                              "absolute",
                                                            top:
                                                              detail.quoteData
                                                                .split === "on"
                                                                ? `calc(${
                                                                    detail
                                                                      .quoteData
                                                                      .topnewHeights >
                                                                    0
                                                                      ? ((detail
                                                                          .quoteData
                                                                          .shutterHeight[
                                                                          index
                                                                        ]
                                                                          .height -
                                                                          0.5) *
                                                                          screen) /
                                                                        detail
                                                                          .quoteData
                                                                          .mCalc
                                                                      : (detail
                                                                          .quoteData
                                                                          .shutterHeight[
                                                                          index
                                                                        ]
                                                                          .height *
                                                                          screen) /
                                                                        detail
                                                                          .quoteData
                                                                          .mCalc
                                                                  }px + ${
                                                                    detail
                                                                      .quoteData
                                                                      .topnewHeights >
                                                                    0
                                                                      ? "12px"
                                                                      : "-8px"
                                                                  } - ${
                                                                    screen ===
                                                                    20
                                                                      ? "10px"
                                                                      : "0px"
                                                                  })`
                                                                : "0",
                                                            right: 0,
                                                            width: "100%",
                                                            height:
                                                              detail.quoteData
                                                                .split == "on"
                                                                ? `calc(${
                                                                    ((detail
                                                                      .quoteData
                                                                      .boxHeight -
                                                                      detail
                                                                        .quoteData
                                                                        .shutterHeight[
                                                                        index
                                                                      ].height -
                                                                      detail
                                                                        .quoteData
                                                                        .topnewHeights) *
                                                                      screen) /
                                                                    detail
                                                                      .quoteData
                                                                      .mCalc
                                                                  }px - 21px  - ${
                                                                    detail
                                                                      .quoteData
                                                                      .bottomFrame ===
                                                                    "no"
                                                                      ? "-4px"
                                                                      : "1px"
                                                                  } - ${
                                                                    detail
                                                                      .quoteData
                                                                      .split ===
                                                                    "on"
                                                                      ? "5px"
                                                                      : "1px"
                                                                  })`
                                                                : "100%",
                                                            zIndex: 1,
                                                            overflow: "hidden",
                                                          }}
                                                        >
                                                          {/* Line from center to top-left */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              top: "50%",
                                                              left: "0",
                                                              width: "2px",
                                                              height: "150%",
                                                              borderLeft:
                                                                "1px dashed gray",
                                                              transform: `rotate(-${
                                                                (detail
                                                                  .quoteData
                                                                  .boxTop ===
                                                                  "on" ||
                                                                detail.quoteData
                                                                  .boxBottom ===
                                                                  "on"
                                                                  ? -1
                                                                  : 0) +
                                                                90 +
                                                                Math.acos(
                                                                  (2 *
                                                                    (detail
                                                                      .quoteData
                                                                      .newWidths[
                                                                      index
                                                                    ] /
                                                                      2)) /
                                                                    Math.sqrt(
                                                                      4 *
                                                                        (detail
                                                                          .quoteData
                                                                          .newWidths[
                                                                          index
                                                                        ] /
                                                                          2) *
                                                                        (detail
                                                                          .quoteData
                                                                          .newWidths[
                                                                          index
                                                                        ] /
                                                                          2) +
                                                                        (((detail
                                                                          .quoteData
                                                                          .boxHeight -
                                                                          detail
                                                                            .quoteData
                                                                            .topnewHeights -
                                                                          detail
                                                                            .quoteData
                                                                            .bottomnewHeights -
                                                                          (detail
                                                                            .quoteData
                                                                            .split ===
                                                                          "on"
                                                                            ? detail
                                                                                .quoteData
                                                                                .shutterHeight[
                                                                                index
                                                                              ]
                                                                                .height
                                                                            : 0)) /
                                                                          2) *
                                                                          (detail
                                                                            .quoteData
                                                                            .boxHeight -
                                                                            detail
                                                                              .quoteData
                                                                              .topnewHeights -
                                                                            detail
                                                                              .quoteData
                                                                              .bottomnewHeights -
                                                                            (detail
                                                                              .quoteData
                                                                              .split ===
                                                                            "on"
                                                                              ? detail
                                                                                  .quoteData
                                                                                  .shutterHeight[
                                                                                  index
                                                                                ]
                                                                                  .height
                                                                              : 0))) /
                                                                          2
                                                                    )
                                                                ) *
                                                                  (180 /
                                                                    Math.PI) +
                                                                (detail
                                                                  .quoteData
                                                                  .numSecondInnerBoxes ===
                                                                1
                                                                  ? 0
                                                                  : detail
                                                                      .quoteData
                                                                      .numSecondInnerBoxes)
                                                              }deg)`,
                                                              transformOrigin:
                                                                "top left",
                                                            }}
                                                          ></div>

                                                          {/* Line from center to bottom-left */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              bottom: "50%",
                                                              left: "0",
                                                              width: "2px",
                                                              height: "150%",
                                                              borderLeft:
                                                                "1px dashed gray",
                                                              transform: `rotate(${
                                                                (detail
                                                                  .quoteData
                                                                  .boxTop ===
                                                                  "on" ||
                                                                detail.quoteData
                                                                  .boxBottom ===
                                                                  "on"
                                                                  ? -1
                                                                  : 0) +
                                                                90 +
                                                                Math.acos(
                                                                  (2 *
                                                                    (detail
                                                                      .quoteData
                                                                      .newWidths[
                                                                      index
                                                                    ] /
                                                                      2)) /
                                                                    Math.sqrt(
                                                                      4 *
                                                                        (detail
                                                                          .quoteData
                                                                          .newWidths[
                                                                          index
                                                                        ] /
                                                                          2) *
                                                                        (detail
                                                                          .quoteData
                                                                          .newWidths[
                                                                          index
                                                                        ] /
                                                                          2) +
                                                                        (((detail
                                                                          .quoteData
                                                                          .boxHeight -
                                                                          detail
                                                                            .quoteData
                                                                            .topnewHeights -
                                                                          detail
                                                                            .quoteData
                                                                            .bottomnewHeights -
                                                                          (detail
                                                                            .quoteData
                                                                            .split ===
                                                                          "on"
                                                                            ? detail
                                                                                .quoteData
                                                                                .shutterHeight[
                                                                                index
                                                                              ]
                                                                                .height
                                                                            : 0)) /
                                                                          2) *
                                                                          (detail
                                                                            .quoteData
                                                                            .boxHeight -
                                                                            detail
                                                                              .quoteData
                                                                              .topnewHeights -
                                                                            detail
                                                                              .quoteData
                                                                              .bottomnewHeights -
                                                                            (detail
                                                                              .quoteData
                                                                              .split ===
                                                                            "on"
                                                                              ? detail
                                                                                  .quoteData
                                                                                  .shutterHeight[
                                                                                  index
                                                                                ]
                                                                                  .height
                                                                              : 0))) /
                                                                          2
                                                                    )
                                                                ) *
                                                                  (180 /
                                                                    Math.PI) +
                                                                (detail
                                                                  .quoteData
                                                                  .numSecondInnerBoxes ===
                                                                1
                                                                  ? 0
                                                                  : detail
                                                                      .quoteData
                                                                      .numSecondInnerBoxes)
                                                              }deg)`,
                                                              transformOrigin:
                                                                "bottom left",
                                                            }}
                                                          ></div>
                                                        </div>
                                                      </>
                                                    )
                                                  ) : (
                                                    <>
                                                      {/* Plus Icon in Center */}
                                                      <div
                                                        style={{
                                                          position: "absolute",
                                                          top: "50%",
                                                          left: "50%",
                                                          transform:
                                                            "translate(-50%, -50%)",
                                                          fontSize: "50px",
                                                          fontWeight: "100",
                                                          cursor: "pointer",
                                                          color: "#000",
                                                          zIndex: 1,
                                                        }}
                                                      >
                                                        +
                                                      </div>
                                                    </>
                                                  )}
                                                  {detail.quoteData.split ===
                                                    "on" && (
                                                    <>
                                                      <div
                                                        style={{
                                                          background:
                                                            detail.quoteData
                                                              .shutterHeight[
                                                              index
                                                            ].top === "glass"
                                                              ? "lightblue"
                                                              : detail.quoteData
                                                                  .shutterHeight[
                                                                  index
                                                                ].top ===
                                                                "panel"
                                                              ? "lightgrey"
                                                              : "lightyellow",
                                                          width: `calc(${
                                                            (detail.quoteData
                                                              .newWidths[
                                                              index
                                                            ] *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - 16 px)`,
                                                          height: `calc(${
                                                            (detail.quoteData
                                                              .shutterHeight[
                                                              index
                                                            ].height *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - 15px`,
                                                          border:
                                                            "1px solid #333",
                                                        }}
                                                      ></div>
                                                      {/* <div style={{background: shutterHeight[index].bottom === 'glass' ? 'lightblue' : shutterHeight[index].bottom === 'panel' ? 'lightgrey' : 'lightyellow', width: `calc(${newWidths[index] * screen / detail.quoteData.mCalc}px - 16 px)`, height: `calc(${(detail.quoteData.boxHeight - shutterHeight[index].height) * screen / detail.quoteData.mCalc}px - ${topnewHeights > 0 ? '21px' : '15px'} - ${bottomFrame==='no'?'-4px':'1px'} - ${split==='on'?'5px':'1px'})`, border: '1px solid #333', marginTop: '5px' }}></div> */}
                                                      <div
                                                        style={{
                                                          background:
                                                            detail.quoteData
                                                              .shutterHeight[
                                                              index
                                                            ].bottom === "glass"
                                                              ? "lightblue"
                                                              : detail.quoteData
                                                                  .shutterHeight[
                                                                  index
                                                                ].bottom ===
                                                                "panel"
                                                              ? "lightgrey"
                                                              : "lightyellow",
                                                          width: `calc(${
                                                            (detail.quoteData
                                                              .newWidths[
                                                              index
                                                            ] *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - 16 px)`,
                                                          height: `calc(${
                                                            ((detail.quoteData
                                                              .boxHeight -
                                                              detail.quoteData
                                                                .shutterHeight[
                                                                index
                                                              ].height -
                                                              detail.quoteData
                                                                .topnewHeights) *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - 21px - ${
                                                            detail.quoteData
                                                              .bottomFrame ===
                                                            "no"
                                                              ? "-4px"
                                                              : "1px"
                                                          } - ${
                                                            detail.quoteData
                                                              .boxTop === "on"
                                                              ? "5px"
                                                              : "-1px"
                                                          })`,
                                                          border:
                                                            "1px solid #333",
                                                          marginTop: "5px",
                                                        }}
                                                      ></div>
                                                    </>
                                                  )}
                                                  {/* {detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.grill === 'yes' && <div style={{position:'absolute',width: `calc(${(detail.quoteData.boxWidth/(detail.quoteData.shutterCount + detail.quoteData.fixedCount))*screen}px - ${(detail.quoteData.shutterCount + detail.quoteData.fixedCount) === 1 ? '32px' : (detail.quoteData.shutterCount + detail.quoteData.fixedCount) === 2 ? '28px' : (detail.quoteData.shutterCount + detail.quoteData.fixedCount) === 3 ? '24px' : '23px'})`}}>{createGrill((parseFloat(detail.quoteData.boxHeight)+0.7), detail.quoteData.topnewHeights, detail.quoteData.bottomnewHeights, detail.quoteData.mCalc)}</div>} */}
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

                              {detail?.quoteData?.item === "CasementWindow" && (
                                <>
                                  <div
                                    align="center"
                                    style={{
                                      alignContent: "center",
                                      alignItems: "center",
                                      textAlign: "center",
                                      marginLeft: "auto",
                                      marginRight: "auto",
                                    }}
                                  >
                                    <div
                                      style={{
                                        float: "left",
                                        boxShadow: "1px 1px 5px grey",
                                        width:
                                          (detail.quoteData.boxWidth * screen) /
                                            detail.quoteData.mCalc +
                                          "px",
                                        height:
                                          (detail.quoteData.boxHeight *
                                            screen) /
                                            detail.quoteData.mCalc +
                                          "px",
                                        border: "1px solid #333",
                                      }}
                                    >
                                      {[
                                        ...Array(detail.quoteData.numFrames),
                                      ].map((_, index) => (
                                        <div
                                          style={{
                                            float: "left",
                                            margin: "2px",
                                            border: "1px solid #333",
                                            width: `calc(${
                                              (detail.quoteData.boxWidth *
                                                screen) /
                                                detail.quoteData.mCalc /
                                                detail.quoteData.numFrames +
                                              "px"
                                            } - 7px)`,
                                            height: `calc(${
                                              (detail.quoteData.boxHeight *
                                                screen) /
                                                detail.quoteData.mCalc +
                                              "px"
                                            } - 7px)`,
                                          }}
                                        >
                                          {/* outer corner lines start topsash*/}
                                          {/* <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-6.5px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
    <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-6px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
    <div style={{ height: '8px', width: '1px', float: 'right', marginTop: getOuterBottom(detail.quoteData.boxHeight, screen, detail.quoteData.mCalc), marginRight: '-4px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
    <div style={{ height: '8px', width: '1px', float: 'left', marginTop: getOuterBottom(detail.quoteData.boxHeight, screen, detail.quoteData.mCalc), marginLeft: '-3px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div> */}
                                          {/* outer corner lines end */}

                                          {/* {<div style={{display:'none'}}>{Measurements(detail.quoteData.measure)}</div>} */}

                                          {detail.quoteData.boxTop === "on" &&
                                            [
                                              ...Array(
                                                detail.quoteData.numTopBoxes
                                              ),
                                            ].map((_, index) => (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                      detail.quoteData.mCalc /
                                                      detail.quoteData
                                                        .numFrames +
                                                    "px"
                                                  } - 20px)`,
                                                  height: `calc(${
                                                    (detail.quoteData
                                                      .topnewHeights *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px )`,
                                                  margin: "5px",
                                                }}
                                              >
                                                {[
                                                  ...Array(
                                                    detail.quoteData.topFixedNum
                                                  ),
                                                ].map((_, index) => (
                                                  <div
                                                    style={{
                                                      flex: "1",
                                                      backgroundColor: "white",
                                                      padding: "4px",
                                                      boxSizing: "border-box",
                                                      width: `calc(${
                                                        (detail.quoteData
                                                          .topFixedWidth[
                                                          index
                                                        ] *
                                                          screen) /
                                                          detail.quoteData
                                                            .mCalc /
                                                          detail.quoteData
                                                            .numFrames +
                                                        "px"
                                                      } - 18px)`,
                                                      height: `calc(${
                                                        (detail.quoteData
                                                          .topnewHeights *
                                                          screen) /
                                                        detail.quoteData.mCalc
                                                      }px )`,
                                                      border: "solid 1px #000",
                                                      marginLeft:
                                                        index === 0
                                                          ? "0px"
                                                          : "5px",
                                                      position: "relative",
                                                    }}
                                                  >
                                                    <div
                                                      style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        border:
                                                          "1px solid #333",
                                                        backgroundColor:
                                                          detail.quoteData
                                                            .topsash[index]
                                                            .type === "fixed"
                                                            ? "lightgreen"
                                                            : "lightblue", // Main content color
                                                        position: "relative",
                                                      }}
                                                    >
                                                      {/* Inner corner lines start */}
                                                      <div
                                                        style={{
                                                          height: "7px",
                                                          width: "1px",
                                                          float: "right",
                                                          marginTop: "-6.5px",
                                                          marginRight: "-3px",
                                                          transform:
                                                            "rotate(45deg)",
                                                          borderRight:
                                                            "1px solid black",
                                                        }}
                                                      ></div>
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "left",
                                                          marginTop: "-6px",
                                                          marginLeft: "-3px",
                                                          transform:
                                                            "rotate(-45deg)",
                                                          borderLeft:
                                                            "1px solid black",
                                                        }}
                                                      ></div>
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "right",
                                                          marginTop: `calc(${
                                                            (detail.quoteData
                                                              .topnewHeights *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - 12px)`,
                                                          marginRight: "-4px",
                                                          transform:
                                                            "rotate(-45deg)",
                                                          borderLeft:
                                                            "1px solid black",
                                                        }}
                                                      ></div>
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "left",
                                                          marginTop: `calc(${
                                                            (detail.quoteData
                                                              .topnewHeights *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - 12px)`,
                                                          marginLeft: "-3px",
                                                          transform:
                                                            "rotate(45deg)",
                                                          borderLeft:
                                                            "1px solid black",
                                                        }}
                                                      ></div>
                                                      {/* Inner corner lines end */}
                                                      {/* outer corner lines start for bottom sash*/}
                                                      <div
                                                        style={{
                                                          height: "7px",
                                                          width: "1px",
                                                          float: "right",
                                                          marginTop: "-12px",
                                                          marginRight: "-9px",
                                                          transform:
                                                            "rotate(45deg)",
                                                          background:
                                                            index ===
                                                            detail.quoteData
                                                              .topsash.length -
                                                              1
                                                              ? "black"
                                                              : "transparent",
                                                        }}
                                                      ></div>
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "left",
                                                          marginTop: "-12px",
                                                          marginLeft: "-9px",
                                                          transform:
                                                            "rotate(-45deg)",
                                                          background:
                                                            index === 0
                                                              ? "black"
                                                              : "transparent",
                                                        }}
                                                      ></div>
                                                      {/* <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${bottomnewHeights*screen/detail.quoteData.mCalc}px - 12px)`, marginRight: '-11px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                           <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${bottomnewHeights*screen/detail.quoteData.mCalc}px - 12px)`, marginLeft: '-9px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>  */}
                                                      {/* outer corner lines end */}
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "right",
                                                          marginTop: `calc(${
                                                            (detail.quoteData
                                                              .topnewHeights *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - 8px)`,
                                                          marginRight: "-6px",
                                                          transform:
                                                            "rotate(180deg)",
                                                          background:
                                                            index ===
                                                            detail.quoteData
                                                              .topsash.length -
                                                              1
                                                              ? "black"
                                                              : "transparent",
                                                        }}
                                                      ></div>
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "left",
                                                          marginTop: `calc(${
                                                            (detail.quoteData
                                                              .topnewHeights *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - 8px)`,
                                                          marginLeft: "-6px",
                                                          transform:
                                                            "rotate(180deg)",
                                                          background:
                                                            index === 0
                                                              ? "black"
                                                              : "transparent",
                                                        }}
                                                      ></div>
                                                      {detail.quoteData.topsash[
                                                        index
                                                      ].type === "shutter" ? (
                                                        <>
                                                          <img
                                                            src={left}
                                                            style={{
                                                              float: "left",
                                                              marginTop: `calc(${
                                                                (detail
                                                                  .quoteData
                                                                  .topnewHeights *
                                                                  screen) /
                                                                detail.quoteData
                                                                  .mCalc
                                                              }px - 25px)`,
                                                              marginLeft: "45%",
                                                              width:
                                                                screen === 40
                                                                  ? "13px"
                                                                  : "8px",
                                                              transform:
                                                                "rotate(-90deg)",
                                                            }}
                                                            alt="Left Handle"
                                                          />
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              width: "100%",
                                                              height: "100%",
                                                              overflow:
                                                                "hidden",
                                                            }}
                                                          >
                                                            {/* Left Diagonal Line  */}
                                                            <div
                                                              style={{
                                                                position:
                                                                  "absolute",
                                                                top: "0",
                                                                left: "50%",
                                                                width: "2px",
                                                                height: "1000%",
                                                                borderLeft:
                                                                  "1px dashed gray",
                                                                transform: `rotate(${
                                                                  Math.atan(
                                                                    (detail
                                                                      .quoteData
                                                                      .topFixedWidth
                                                                      .length
                                                                      ? detail
                                                                          .quoteData
                                                                          .topFixedWidth[
                                                                          index
                                                                        ]
                                                                      : detail
                                                                          .quoteData
                                                                          .boxWidth) /
                                                                      (2 *
                                                                        detail
                                                                          .quoteData
                                                                          .topnewHeights)
                                                                  ) *
                                                                    (180 /
                                                                      Math.PI) +
                                                                  2.5
                                                                }deg)`,
                                                                transformOrigin:
                                                                  "top left",
                                                              }}
                                                            ></div>

                                                            {/* Right Diagonal Line */}
                                                            <div
                                                              style={{
                                                                position:
                                                                  "absolute",
                                                                top: "0",
                                                                left: "50%",
                                                                width: "2px",
                                                                height: "1000%",
                                                                borderLeft:
                                                                  "1px dashed gray",
                                                                transform: `rotate(-${
                                                                  Math.atan(
                                                                    (detail
                                                                      .quoteData
                                                                      .topFixedWidth
                                                                      .length
                                                                      ? detail
                                                                          .quoteData
                                                                          .topFixedWidth[
                                                                          index
                                                                        ]
                                                                      : detail
                                                                          .quoteData
                                                                          .boxWidth) /
                                                                      (2 *
                                                                        detail
                                                                          .quoteData
                                                                          .topnewHeights)
                                                                  ) *
                                                                    (180 /
                                                                      Math.PI) +
                                                                  2.5
                                                                }deg)`,
                                                                transformOrigin:
                                                                  "top left",
                                                              }}
                                                            ></div>
                                                          </div>
                                                          {/* {detail.quoteData.topsash[index].type === 'shutter' && grill === 'yes' && boxes(detail.quoteData.topnewHeights + 0.5)} */}
                                                          {detail.quoteData
                                                            .topsash[index]
                                                            .type ===
                                                            "shutter" &&
                                                            detail.quoteData
                                                              .grill ===
                                                              "yes" &&
                                                            boxes(
                                                              detail.quoteData
                                                                .mCalc,
                                                              detail.quoteData
                                                                .measure,
                                                              detail.quoteData
                                                                .topnewHeights +
                                                                0.1
                                                            )}
                                                        </>
                                                      ) : (
                                                        <>
                                                          {/* fixed plus  */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              top: "50%",
                                                              left: "50%",
                                                              transform:
                                                                "translate(-50%, -50%)",
                                                              fontSize: "30px",
                                                              fontWeight: "200",
                                                              cursor: "pointer",
                                                              color: "#000",
                                                              zIndex: 1,
                                                            }}
                                                          >
                                                            +
                                                          </div>
                                                        </>
                                                      )}
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            ))}

                                          <div style={{ display: "flex" }}>
                                            {[
                                              ...Array(
                                                detail.quoteData
                                                  .numSecondInnerBoxes
                                              ),
                                            ].map((_, index) => (
                                              <div
                                                key={index}
                                                style={{
                                                  height: `calc(${
                                                    ((detail.quoteData
                                                      .boxHeight -
                                                      detail.quoteData
                                                        .topnewHeights -
                                                      detail.quoteData
                                                        .bottomnewHeights) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - ${
                                                    detail.quoteData.boxTop ===
                                                    "on"
                                                      ? "24px"
                                                      : "19px"
                                                  })`,
                                                  width: `calc(${
                                                    (detail.quoteData.newWidths[
                                                      index
                                                    ] *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px )`,
                                                  backgroundColor: "white",
                                                  padding: "0px",
                                                  marginTop:
                                                    detail.quoteData.boxTop ===
                                                    "on"
                                                      ? "0px"
                                                      : "5px",
                                                  marginRight:
                                                    index ===
                                                    detail.quoteData
                                                      .numSecondInnerBoxes -
                                                      1
                                                      ? "5px"
                                                      : "3.5px",
                                                  marginLeft:
                                                    index === 0
                                                      ? "5px"
                                                      : "3.5px",
                                                  border: "1px solid #333",
                                                  position: "relative",
                                                  boxSizing: "border-box",
                                                }}
                                              >
                                                <div
                                                  style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    border: "1px solid #333",
                                                    backgroundColor:
                                                      detail.quoteData
                                                        .boxColors[index],
                                                    position: "relative",
                                                  }}
                                                >
                                                  {/* Inner corner lines start */}
                                                  <div
                                                    key={index}
                                                    style={{
                                                      height:
                                                        detail.quoteData
                                                          .boxBottom === "on"
                                                          ? "11px"
                                                          : "15px",
                                                      width: "1px",
                                                      float: "left",
                                                      marginTop: `calc(${
                                                        ((detail.quoteData
                                                          .boxHeight -
                                                          detail.quoteData
                                                            .topnewHeights -
                                                          detail.quoteData
                                                            .bottomnewHeights) *
                                                          screen) /
                                                        detail.quoteData.mCalc
                                                      }px - ${
                                                        detail.quoteData
                                                          .boxTop === "on"
                                                          ? "40px"
                                                          : "34px"
                                                      })`,
                                                      marginLeft:
                                                        detail.quoteData
                                                          .boxBottom === "on"
                                                          ? "-4px"
                                                          : "-6px",
                                                      transform:
                                                        "rotate(45deg)",
                                                      borderLeft:
                                                        "1px solid grey",
                                                    }}
                                                  ></div>
                                                  <div
                                                    key={index}
                                                    style={{
                                                      height:
                                                        detail.quoteData
                                                          .boxTop === "on"
                                                          ? "11px"
                                                          : "15px",
                                                      width: "1px",
                                                      float: "left",
                                                      marginTop:
                                                        detail.quoteData
                                                          .boxTop === "on"
                                                          ? "-9px"
                                                          : "-14px",
                                                      marginLeft:
                                                        detail.quoteData
                                                          .boxTop === "on"
                                                          ? "-4px"
                                                          : "-6px",
                                                      transform:
                                                        "rotate(-45deg)",
                                                      borderLeft:
                                                        "1px solid grey",
                                                    }}
                                                  ></div>
                                                  <div
                                                    style={{
                                                      height:
                                                        detail.quoteData
                                                          .boxTop === "on"
                                                          ? "11px"
                                                          : "15px",
                                                      width: "1px",
                                                      float: "right",
                                                      marginTop:
                                                        detail.quoteData
                                                          .boxTop === "on"
                                                          ? "-9px"
                                                          : "-14px",
                                                      marginRight:
                                                        detail.quoteData
                                                          .boxTop === "on"
                                                          ? "-4px"
                                                          : "-6px",
                                                      transform:
                                                        "rotate(45deg)",
                                                      borderRight:
                                                        "1px solid grey",
                                                    }}
                                                  ></div>
                                                  {/* <div style={{ height: '15px', width: '1px', float: 'left', marginTop: getInnerBottom(detail.quoteData.boxHeight - topnewHeights - bottomnewHeights, screen, detail.quoteData.mCalc), marginLeft: '-4px', transform: 'rotate(-45deg)', borderLeft: index === 0 ? 'transparent' : '1px solid black' }}></div> */}
                                                  <div
                                                    style={{
                                                      height:
                                                        detail.quoteData
                                                          .boxBottom === "on"
                                                          ? "11px"
                                                          : "15px",
                                                      width: "1px",
                                                      float: "right",
                                                      marginTop: `calc(${
                                                        ((detail.quoteData
                                                          .boxHeight -
                                                          detail.quoteData
                                                            .topnewHeights -
                                                          detail.quoteData
                                                            .bottomnewHeights) *
                                                          screen) /
                                                        detail.quoteData.mCalc
                                                      }px - ${
                                                        detail.quoteData
                                                          .boxTop === "on"
                                                          ? "40px"
                                                          : "34px"
                                                      })`,
                                                      marginRight:
                                                        detail.quoteData
                                                          .boxBottom === "on"
                                                          ? "-4px"
                                                          : "-6px",
                                                      transform:
                                                        "rotate(-45deg)",
                                                      borderLeft:
                                                        "1px solid grey",
                                                    }}
                                                  ></div>
                                                  <div
                                                    style={{
                                                      height: "10px",
                                                      width: "1px",
                                                      float: "right",
                                                      marginTop: `calc(${
                                                        ((detail.quoteData
                                                          .boxHeight -
                                                          detail.quoteData
                                                            .topnewHeights -
                                                          detail.quoteData
                                                            .bottomnewHeights) *
                                                          screen) /
                                                        detail.quoteData.mCalc
                                                      }px - ${
                                                        detail.quoteData
                                                          .boxBottom === "on"
                                                          ? "33px"
                                                          : "27px"
                                                      })`,
                                                      marginRight: "-4px",
                                                      transform:
                                                        "rotate(-45deg)",
                                                      borderRight:
                                                        index === -1
                                                          ? "1px solid grey"
                                                          : "none",
                                                    }}
                                                  ></div>
                                                  {/* <div style={{ height: '7px', width: '1px', float: 'left', right: '0px', marginTop: '-6px', marginRight: '-1px', background: index === 0 ? 'transparent' : 'black' }}></div> */}
                                                  {/* Inner corner lines ends */}
                                                  {detail.quoteData
                                                    .boxBottom === "on" ? (
                                                    <>
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "right",
                                                          marginTop: `calc(${
                                                            ((detail.quoteData
                                                              .boxHeight -
                                                              detail.quoteData
                                                                .topnewHeights -
                                                              detail.quoteData
                                                                .bottomnewHeights) *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - ${
                                                            detail.quoteData
                                                              .boxBottom ===
                                                            "on"
                                                              ? "33px"
                                                              : "27px"
                                                          })`,
                                                          marginRight: "-7px",
                                                          transform:
                                                            "rotate(180deg)",
                                                          background:
                                                            index ===
                                                            detail.quoteData
                                                              .newWidths
                                                              .length -
                                                              1
                                                              ? "black"
                                                              : "transparent",
                                                        }}
                                                      ></div>
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "left",
                                                          marginTop: `calc(${
                                                            ((detail.quoteData
                                                              .boxHeight -
                                                              detail.quoteData
                                                                .topnewHeights -
                                                              detail.quoteData
                                                                .bottomnewHeights) *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - ${
                                                            detail.quoteData
                                                              .boxBottom ===
                                                            "on"
                                                              ? "33px"
                                                              : "27px"
                                                          })`,
                                                          marginLeft: "-7px",
                                                          transform:
                                                            "rotate(180deg)",
                                                          background:
                                                            index === 0
                                                              ? "black"
                                                              : "transparent",
                                                        }}
                                                      ></div>
                                                    </>
                                                  ) : (
                                                    <></>
                                                  )}

                                                  {/* {detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.grill === 'yes' && <div style={{ position:"absolute",width:'100%'}}>{ createGrill(detail.quoteData.boxHeight, detail.quoteData.topnewHeights, detail.quoteData.bottomnewHeights, detail.quoteData.mCalc)}</div>} */}

                                                  {detail.quoteData.boxNames[
                                                    index
                                                  ] === "Shutter" ? (
                                                    detail.quoteData.boxHandle[
                                                      index
                                                    ] === "left" ? (
                                                      <>
                                                        {/* Left Handle and Right Arrow */}
                                                        <img
                                                          src={left}
                                                          style={{
                                                            float: "left",
                                                            marginTop: `calc(${
                                                              ((detail.quoteData
                                                                .boxHeight -
                                                                detail.quoteData
                                                                  .topnewHeights -
                                                                detail.quoteData
                                                                  .bottomnewHeights) *
                                                                screen) /
                                                              detail.quoteData
                                                                .mCalc /
                                                              2
                                                            }px - ${
                                                              screen === 40
                                                                ? "28px"
                                                                : "25px"
                                                            }`,
                                                            marginLeft: "-5px",
                                                            width:
                                                              screen === 40
                                                                ? "13px"
                                                                : "8px",
                                                          }}
                                                          alt="Left Handle"
                                                        />
                                                        {/* dotted line start */}
                                                        <div
                                                          style={{
                                                            position:
                                                              "absolute",
                                                            top: 0,
                                                            right: 0,
                                                            width: "100%",
                                                            height: "100%",
                                                            zIndex: 1,
                                                            overflow: "hidden",
                                                          }}
                                                        >
                                                          {/* Line from center to top-right */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              top: "50%",
                                                              right: "0",
                                                              width: "2px",
                                                              height: "200%",
                                                              borderLeft:
                                                                "1px dashed gray",
                                                              transform: `rotate(${
                                                                (detail
                                                                  .quoteData
                                                                  .boxTop ===
                                                                  "on" ||
                                                                detail.quoteData
                                                                  .boxBottom ===
                                                                  "on"
                                                                  ? -1
                                                                  : 0) +
                                                                90 +
                                                                Math.acos(
                                                                  (2 *
                                                                    (detail
                                                                      .quoteData
                                                                      .newWidths[
                                                                      index
                                                                    ] /
                                                                      2)) /
                                                                    Math.sqrt(
                                                                      4 *
                                                                        (detail
                                                                          .quoteData
                                                                          .newWidths[
                                                                          index
                                                                        ] /
                                                                          2) *
                                                                        (detail
                                                                          .quoteData
                                                                          .newWidths[
                                                                          index
                                                                        ] /
                                                                          2) +
                                                                        (((detail
                                                                          .quoteData
                                                                          .boxHeight -
                                                                          detail
                                                                            .quoteData
                                                                            .topnewHeights -
                                                                          detail
                                                                            .quoteData
                                                                            .bottomnewHeights) /
                                                                          2) *
                                                                          (detail
                                                                            .quoteData
                                                                            .boxHeight -
                                                                            detail
                                                                              .quoteData
                                                                              .topnewHeights -
                                                                            detail
                                                                              .quoteData
                                                                              .bottomnewHeights)) /
                                                                          2
                                                                    )
                                                                ) *
                                                                  (180 /
                                                                    Math.PI) +
                                                                (detail
                                                                  .quoteData
                                                                  .numSecondInnerBoxes ===
                                                                1
                                                                  ? 0
                                                                  : detail
                                                                      .quoteData
                                                                      .numSecondInnerBoxes)
                                                              }deg)`,
                                                              transformOrigin:
                                                                "top right",
                                                            }}
                                                          ></div>
                                                          {/* Line from center to bottom-right */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              bottom: "50%",
                                                              right: "0",
                                                              width: "2px",
                                                              height: "200%",
                                                              borderLeft:
                                                                "1px dashed gray",
                                                              transform: `rotate(-${
                                                                (detail
                                                                  .quoteData
                                                                  .boxTop ===
                                                                  "on" ||
                                                                detail.quoteData
                                                                  .boxBottom ===
                                                                  "on"
                                                                  ? -1
                                                                  : 0) +
                                                                90 +
                                                                Math.acos(
                                                                  (2 *
                                                                    (detail
                                                                      .quoteData
                                                                      .newWidths[
                                                                      index
                                                                    ] /
                                                                      2)) /
                                                                    Math.sqrt(
                                                                      4 *
                                                                        (detail
                                                                          .quoteData
                                                                          .newWidths[
                                                                          index
                                                                        ] /
                                                                          2) *
                                                                        (detail
                                                                          .quoteData
                                                                          .newWidths[
                                                                          index
                                                                        ] /
                                                                          2) +
                                                                        ((detail
                                                                          .quoteData
                                                                          .boxHeight -
                                                                          detail
                                                                            .quoteData
                                                                            .topnewHeights -
                                                                          detail
                                                                            .quoteData
                                                                            .bottomnewHeights) /
                                                                          2) *
                                                                          ((detail
                                                                            .quoteData
                                                                            .boxHeight -
                                                                            detail
                                                                              .quoteData
                                                                              .topnewHeights -
                                                                            detail
                                                                              .quoteData
                                                                              .bottomnewHeights) /
                                                                            2)
                                                                    )
                                                                ) *
                                                                  (180 /
                                                                    Math.PI) +
                                                                (detail
                                                                  .quoteData
                                                                  .numSecondInnerBoxes ===
                                                                1
                                                                  ? 0
                                                                  : detail
                                                                      .quoteData
                                                                      .numSecondInnerBoxes)
                                                              }deg)`,
                                                              transformOrigin:
                                                                "bottom right",
                                                            }}
                                                          ></div>
                                                        </div>
                                                        {/* dotted line end */}
                                                      </>
                                                    ) : (
                                                      <>
                                                        <img
                                                          src={right}
                                                          style={{
                                                            float: "right",
                                                            marginTop: `calc(${
                                                              ((detail.quoteData
                                                                .boxHeight -
                                                                detail.quoteData
                                                                  .topnewHeights -
                                                                detail.quoteData
                                                                  .bottomnewHeights) *
                                                                screen) /
                                                              detail.quoteData
                                                                .mCalc /
                                                              2
                                                            }px - ${
                                                              screen === 40
                                                                ? "28px"
                                                                : "25px"
                                                            }`,
                                                            marginRight: "-5px",
                                                            width:
                                                              screen === 40
                                                                ? "13px"
                                                                : "8px",
                                                          }}
                                                          alt="Right Handle"
                                                        />
                                                        <div
                                                          style={{
                                                            position:
                                                              "absolute",
                                                            top: 0,
                                                            right: 0,
                                                            width: "100%",
                                                            height: "100%",
                                                            zIndex: 1,
                                                            overflow: "hidden",
                                                          }}
                                                        >
                                                          {/* Line from center to top-left */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              top: "50%",
                                                              left: "0",
                                                              width: "2px",
                                                              height: "150%",
                                                              borderLeft:
                                                                "1px dashed gray",
                                                              transform: `rotate(-${
                                                                (detail
                                                                  .quoteData
                                                                  .boxTop ===
                                                                  "on" ||
                                                                detail.quoteData
                                                                  .boxBottom ===
                                                                  "on"
                                                                  ? -1
                                                                  : 0) +
                                                                90 +
                                                                Math.acos(
                                                                  (2 *
                                                                    (detail
                                                                      .quoteData
                                                                      .newWidths[
                                                                      index
                                                                    ] /
                                                                      2)) /
                                                                    Math.sqrt(
                                                                      4 *
                                                                        (detail
                                                                          .quoteData
                                                                          .newWidths[
                                                                          index
                                                                        ] /
                                                                          2) *
                                                                        (detail
                                                                          .quoteData
                                                                          .newWidths[
                                                                          index
                                                                        ] /
                                                                          2) +
                                                                        ((detail
                                                                          .quoteData
                                                                          .boxHeight -
                                                                          detail
                                                                            .quoteData
                                                                            .topnewHeights -
                                                                          detail
                                                                            .quoteData
                                                                            .bottomnewHeights) /
                                                                          2) *
                                                                          ((detail
                                                                            .quoteData
                                                                            .boxHeight -
                                                                            detail
                                                                              .quoteData
                                                                              .topnewHeights -
                                                                            detail
                                                                              .quoteData
                                                                              .bottomnewHeights) /
                                                                            2)
                                                                    )
                                                                ) *
                                                                  (180 /
                                                                    Math.PI) +
                                                                detail.quoteData
                                                                  .numSecondInnerBoxes
                                                              }deg)`,
                                                              transformOrigin:
                                                                "top left",
                                                            }}
                                                          ></div>

                                                          {/* Line from center to bottom-left */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              bottom: "50%",
                                                              left: "0",
                                                              width: "2px",
                                                              height: "150%",
                                                              borderLeft:
                                                                "1px dashed gray",
                                                              transform: `rotate(${
                                                                (detail
                                                                  .quoteData
                                                                  .boxTop ===
                                                                  "on" ||
                                                                detail.quoteData
                                                                  .boxBottom ===
                                                                  "on"
                                                                  ? -1
                                                                  : 0) +
                                                                90 +
                                                                Math.acos(
                                                                  (2 *
                                                                    (detail
                                                                      .quoteData
                                                                      .newWidths[
                                                                      index
                                                                    ] /
                                                                      2)) /
                                                                    Math.sqrt(
                                                                      4 *
                                                                        (detail
                                                                          .quoteData
                                                                          .newWidths[
                                                                          index
                                                                        ] /
                                                                          2) *
                                                                        (detail
                                                                          .quoteData
                                                                          .newWidths[
                                                                          index
                                                                        ] /
                                                                          2) +
                                                                        ((detail
                                                                          .quoteData
                                                                          .boxHeight -
                                                                          detail
                                                                            .quoteData
                                                                            .topnewHeights -
                                                                          detail
                                                                            .quoteData
                                                                            .bottomnewHeights) /
                                                                          2) *
                                                                          ((detail
                                                                            .quoteData
                                                                            .boxHeight -
                                                                            detail
                                                                              .quoteData
                                                                              .topnewHeights -
                                                                            detail
                                                                              .quoteData
                                                                              .bottomnewHeights) /
                                                                            2)
                                                                    )
                                                                ) *
                                                                  (180 /
                                                                    Math.PI) +
                                                                detail.quoteData
                                                                  .numSecondInnerBoxes
                                                              }deg)`,
                                                              transformOrigin:
                                                                "bottom left",
                                                            }}
                                                          ></div>
                                                        </div>
                                                      </>
                                                    )
                                                  ) : (
                                                    <>
                                                      {/* Plus Icon in Center */}
                                                      <div
                                                        style={{
                                                          position: "absolute",
                                                          top: "50%",
                                                          left: "50%",
                                                          transform:
                                                            "translate(-50%, -50%)",
                                                          fontSize: "50px",
                                                          fontWeight: "100",
                                                          cursor: "pointer",
                                                          color: "#000",
                                                          zIndex: 1,
                                                        }}
                                                      >
                                                        +
                                                      </div>
                                                    </>
                                                  )}

                                                  {detail.quoteData.mesh ===
                                                    "yes" &&
                                                    detail.quoteData.boxNames[
                                                      index
                                                    ] === "Shutter" &&
                                                    detail.quoteData.boxHandle[
                                                      index
                                                    ] === "left" && (
                                                      <img
                                                        src={meshimg}
                                                        style={{
                                                          position: "absolute",
                                                          left: 0,
                                                          width:
                                                            screen === 3
                                                              ? "40px"
                                                              : "15px",
                                                          float: "left",
                                                          marginTop:
                                                            screen === 3
                                                              ? `calc(${
                                                                  ((detail
                                                                    .quoteData
                                                                    .boxHeight -
                                                                    detail
                                                                      .quoteData
                                                                      .topnewHeights -
                                                                    detail
                                                                      .quoteData
                                                                      .bottomnewHeights) *
                                                                    screen) /
                                                                  detail
                                                                    .quoteData
                                                                    .mCalc
                                                                }px - ${
                                                                  detail
                                                                    .quoteData
                                                                    .boxTop ===
                                                                  "on"
                                                                    ? "70px"
                                                                    : "57px"
                                                                } )`
                                                              : `calc(${
                                                                  ((detail
                                                                    .quoteData
                                                                    .boxHeight -
                                                                    detail
                                                                      .quoteData
                                                                      .topnewHeights -
                                                                    detail
                                                                      .quoteData
                                                                      .bottomnewHeights) *
                                                                    screen) /
                                                                  detail
                                                                    .quoteData
                                                                    .mCalc
                                                                }px - 43px)`,
                                                        }}
                                                      />
                                                    )}

                                                  {detail.quoteData.mesh ===
                                                    "yes" &&
                                                    detail.quoteData.boxNames[
                                                      index
                                                    ] === "Shutter" &&
                                                    detail.quoteData.boxHandle[
                                                      index
                                                    ] === "right" && (
                                                      <img
                                                        src={meshimg}
                                                        style={{
                                                          width:
                                                            screen === 3
                                                              ? "40px"
                                                              : "15px",
                                                          float: "left",
                                                          marginLeft:
                                                            screen === 3
                                                              ? detail.quoteData
                                                                  .boxHandle[
                                                                  index
                                                                ] === "right"
                                                                ? "-1px"
                                                                : "0px"
                                                              : detail.quoteData
                                                                  .boxHandle[
                                                                  index
                                                                ] === "right"
                                                              ? "0px"
                                                              : "px",
                                                          marginTop:
                                                            screen === 3
                                                              ? `calc(${
                                                                  ((detail
                                                                    .quoteData
                                                                    .boxHeight -
                                                                    detail
                                                                      .quoteData
                                                                      .topnewHeights -
                                                                    detail
                                                                      .quoteData
                                                                      .bottomnewHeights) *
                                                                    screen) /
                                                                  detail
                                                                    .quoteData
                                                                    .mCalc
                                                                }px - ${
                                                                  detail
                                                                    .quoteData
                                                                    .boxTop ===
                                                                  "on"
                                                                    ? "70px"
                                                                    : "67px"
                                                                } )`
                                                              : `calc(${
                                                                  ((detail
                                                                    .quoteData
                                                                    .boxHeight -
                                                                    detail
                                                                      .quoteData
                                                                      .topnewHeights -
                                                                    detail
                                                                      .quoteData
                                                                      .bottomnewHeights) *
                                                                    screen) /
                                                                  detail
                                                                    .quoteData
                                                                    .mCalc
                                                                }px - 43px)`,
                                                        }}
                                                      />
                                                    )}

                                                  {detail.quoteData.boxNames[
                                                    index
                                                  ] === "Shutter" &&
                                                    detail.quoteData.grill ===
                                                      "yes" &&
                                                    boxes(
                                                      detail.quoteData.mCalc,
                                                      detail.quoteData.measure,
                                                      detail.quoteData
                                                        .boxHeight -
                                                        detail.quoteData
                                                          .topnewHeights -
                                                        detail.quoteData
                                                          .bottomnewHeights +
                                                        0.5
                                                    )}
                                                  {/* {detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.grill === 'yes' && <div style={{position:'absolute',width: `calc(${(detail.quoteData.boxWidth/(detail.quoteData.shutterCount + detail.quoteData.fixedCount))*screen}px - ${(detail.quoteData.shutterCount + detail.quoteData.fixedCount) === 1 ? '32px' : (detail.quoteData.shutterCount + detail.quoteData.fixedCount) === 2 ? '28px' : (detail.quoteData.shutterCount + detail.quoteData.fixedCount) === 3 ? '24px' : '23px'})`}}>{createGrill((parseFloat(detail.quoteData.boxHeight)), detail.quoteData.topnewHeights, detail.quoteData.bottomnewHeights, detail.quoteData.mCalc)}</div>} */}
                                                </div>
                                              </div>
                                            ))}
                                          </div>

                                          {detail.quoteData.boxBottom ===
                                            "on" &&
                                            [
                                              ...Array(
                                                detail.quoteData.numBottomBoxes
                                              ),
                                            ].map((_, index) => (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                      detail.quoteData.mCalc /
                                                      detail.quoteData
                                                        .numFrames +
                                                    "px"
                                                  } - 20px)`,
                                                  height: `calc(${
                                                    (detail.quoteData
                                                      .bottomnewHeights *
                                                      screen) /
                                                      detail.quoteData.mCalc +
                                                    "px"
                                                  } -10px)`,
                                                  margin: "5px",
                                                  position: "relative",
                                                }}
                                              >
                                                {[
                                                  ...Array(
                                                    detail.quoteData
                                                      .bottomFixedNum
                                                  ),
                                                ].map((_, index) => (
                                                  <div
                                                    style={{
                                                      flex: "1",
                                                      backgroundColor: "white",
                                                      padding: "4px",
                                                      boxSizing: "border-box",
                                                      width: `calc(${
                                                        (detail.quoteData
                                                          .bottomFixedWidth[
                                                          index
                                                        ] *
                                                          screen) /
                                                          detail.quoteData
                                                            .mCalc /
                                                          detail.quoteData
                                                            .numFrames +
                                                        "px"
                                                      } - 18px)`,
                                                      height: `calc(${
                                                        (detail.quoteData
                                                          .bottomnewHeights *
                                                          screen) /
                                                          detail.quoteData
                                                            .mCalc +
                                                        "px"
                                                      } - 5px)`,
                                                      border: "solid 1px #000",
                                                      marginLeft:
                                                        index === 0
                                                          ? "0px"
                                                          : "5px",
                                                      position: "relative",
                                                    }}
                                                  >
                                                    <div
                                                      style={{
                                                        height: "100%",
                                                        width: "100%",
                                                        position: "relative",
                                                        backgroundColor:
                                                          detail.quoteData
                                                            .bottomsash[index]
                                                            .type === "fixed"
                                                            ? "lightgreen"
                                                            : "lightblue",
                                                        border:
                                                          "1px solid black",
                                                      }}
                                                    >
                                                      {/* inner corner lines start for bottom sash*/}
                                                      <div
                                                        style={{
                                                          height: "7px",
                                                          width: "1px",
                                                          float: "right",
                                                          marginTop: "-6.5px",
                                                          marginRight: "-3px",
                                                          transform:
                                                            "rotate(45deg)",
                                                          borderRight:
                                                            "1px solid black",
                                                        }}
                                                      ></div>
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "left",
                                                          marginTop: "-6px",
                                                          marginLeft: "-3px",
                                                          transform:
                                                            "rotate(-45deg)",
                                                          borderLeft:
                                                            "1px solid black",
                                                        }}
                                                      ></div>
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "right",
                                                          marginTop: `calc(${
                                                            (detail.quoteData
                                                              .bottomnewHeights *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - 18px)`,
                                                          marginRight: "-4px",
                                                          transform:
                                                            "rotate(-45deg)",
                                                          borderLeft:
                                                            "1px solid black",
                                                        }}
                                                      ></div>
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "left",
                                                          marginTop: `calc(${
                                                            (detail.quoteData
                                                              .bottomnewHeights *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - 18px)`,
                                                          marginLeft: "-3px",
                                                          transform:
                                                            "rotate(45deg)",
                                                          borderLeft:
                                                            "1px solid black",
                                                        }}
                                                      ></div>
                                                      {/* inner corner lines end */}
                                                      {/* outer corner lines start for bottom sash*/}
                                                      {/* <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-13px', marginRight: '-9px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                                <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-12px', marginLeft: '-9px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>*/}
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "right",
                                                          marginTop: `calc(${
                                                            (detail.quoteData
                                                              .bottomnewHeights *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - 12px)`,
                                                          marginRight: "-11px",
                                                          transform:
                                                            "rotate(-45deg)",
                                                          background:
                                                            index ===
                                                            detail.quoteData
                                                              .bottomsash
                                                              .length -
                                                              1
                                                              ? "black"
                                                              : "transparent",
                                                        }}
                                                      ></div>
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "left",
                                                          marginTop: `calc(${
                                                            (detail.quoteData
                                                              .bottomnewHeights *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - 12px)`,
                                                          marginLeft: "-9px",
                                                          transform:
                                                            "rotate(45deg)",
                                                          background:
                                                            index === 0
                                                              ? "black"
                                                              : "transparent",
                                                        }}
                                                      ></div>
                                                      {/* outer corner lines end */}
                                                      {/* <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${detail.quoteData.boxHeight-topnewHeights*screen/detail.quoteData.mCalc}px - ${screen === 3 ? '28px':'24px'})`, marginRight: '-6px', transform: 'rotate(180deg)', background: index === bottomsash.length -1  ? 'black' : 'transparent' }}></div>
                                <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${detail.quoteData.boxHeight-topnewHeights*screen/detail.quoteData.mCalc}px - ${screen === 3 ? '28px':'24px'})`, marginLeft: '-6px', transform: 'rotate(180deg)', background: index === 0 ? 'black' : 'transparent' }}></div> */}

                                                      {detail.quoteData
                                                        .bottomsash[index]
                                                        .type === "shutter" ? (
                                                        <>
                                                          <img
                                                            src={left}
                                                            style={{
                                                              float: "left",
                                                              marginTop: `calc(${
                                                                (detail
                                                                  .quoteData
                                                                  .bottomnewHeights *
                                                                  screen) /
                                                                detail.quoteData
                                                                  .mCalc
                                                              }px - ${
                                                                screen === 3
                                                                  ? "28px"
                                                                  : "25px"
                                                              })`,
                                                              marginLeft: "45%",
                                                              width:
                                                                screen === 40
                                                                  ? "13px"
                                                                  : "8px",
                                                              transform:
                                                                "rotate(-90deg)",
                                                            }}
                                                            alt="Left Handle"
                                                          />
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              width: "100%",
                                                              height: "100%",
                                                              overflow:
                                                                "hidden",
                                                            }}
                                                          >
                                                            {/* Left Diagonal Line  */}
                                                            <div
                                                              style={{
                                                                position:
                                                                  "absolute",
                                                                top: "0",
                                                                left: "50%",
                                                                width: "2px",
                                                                height: "1000%",
                                                                borderLeft:
                                                                  "1px dashed gray",
                                                                transform: `rotate(${
                                                                  Math.atan(
                                                                    (detail
                                                                      .quoteData
                                                                      .bottomFixedWidth
                                                                      .length
                                                                      ? detail
                                                                          .quoteData
                                                                          .bottomFixedWidth[
                                                                          index
                                                                        ]
                                                                      : detail
                                                                          .quoteData
                                                                          .boxWidth) /
                                                                      (2 *
                                                                        detail
                                                                          .quoteData
                                                                          .bottomnewHeights)
                                                                  ) *
                                                                    (180 /
                                                                      Math.PI) +
                                                                  2.5
                                                                }deg)`,
                                                                transformOrigin:
                                                                  "top left",
                                                              }}
                                                            ></div>

                                                            {/* Right Diagonal Line */}
                                                            <div
                                                              style={{
                                                                position:
                                                                  "absolute",
                                                                top: "0",
                                                                left: "50%",
                                                                width: "2px",
                                                                height: "1000%",
                                                                borderLeft:
                                                                  "1px dashed gray",
                                                                transform: `rotate(-${
                                                                  Math.atan(
                                                                    (detail
                                                                      .quoteData
                                                                      .bottomFixedWidth
                                                                      .length
                                                                      ? detail
                                                                          .quoteData
                                                                          .bottomFixedWidth[
                                                                          index
                                                                        ]
                                                                      : detail
                                                                          .quoteData
                                                                          .boxWidth) /
                                                                      (2 *
                                                                        detail
                                                                          .quoteData
                                                                          .bottomnewHeights)
                                                                  ) *
                                                                    (180 /
                                                                      Math.PI) +
                                                                  2.5
                                                                }deg)`,
                                                                transformOrigin:
                                                                  "top left",
                                                              }}
                                                            ></div>
                                                          </div>

                                                          {detail.quoteData
                                                            .bottomsash[index]
                                                            .type ===
                                                            "shutter" &&
                                                            detail.quoteData
                                                              .grill ===
                                                              "yes" &&
                                                            boxes(
                                                              detail.quoteData
                                                                .mCalc,
                                                              detail.quoteData
                                                                .measure,
                                                              detail.quoteData
                                                                .topnewHeights +
                                                                0.1
                                                            )}
                                                        </>
                                                      ) : (
                                                        <>
                                                          {/* fixed plus  */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              top: "50%",
                                                              left: "50%",
                                                              transform:
                                                                "translate(-50%, -50%)",
                                                              fontSize: "30px",
                                                              fontWeight: "200",
                                                              cursor: "pointer",
                                                              color: "#000",
                                                              zIndex: 1,
                                                            }}
                                                          >
                                                            +
                                                          </div>
                                                        </>
                                                      )}
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            ))}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              )}

                              {detail.quoteData.item === "SlidingDoor" && (
                                <>
                                  <div
                                    align="center"
                                    style={{
                                      alignContent: "center",
                                      alignItems: "center",
                                      textAlign: "center",
                                      marginLeft: "auto",
                                      marginRight: "auto",
                                    }}
                                  >
                                    <div
                                      style={{
                                        float: "left",
                                        width:
                                          (detail.quoteData.boxWidth * screen) /
                                            detail.quoteData.mCalc +
                                          "px",
                                        height:
                                          (detail.quoteData.boxHeight *
                                            screen) /
                                            detail.quoteData.mCalc +
                                          "px",
                                        border: "1px solid #333",
                                      }}
                                    >
                                      {[
                                        ...Array(detail.quoteData.numFrames),
                                      ].map((_, index) => (
                                        <div
                                          style={{
                                            float: "left",
                                            margin: "5px",
                                            border: "1px solid #333",
                                            width: `calc(${
                                              (detail.quoteData.boxWidth *
                                                screen) /
                                                detail.quoteData.mCalc /
                                                detail.quoteData.numFrames +
                                              "px"
                                            } - 12px)`,
                                            height: `calc(${
                                              (detail.quoteData.boxHeight *
                                                screen) /
                                                detail.quoteData.mCalc +
                                              "px"
                                            } - 12px)`,
                                            position: "relative",
                                          }}
                                        >
                                          {/* outer corner lines start */}
                                          <div
                                            style={{
                                              height: "7px",
                                              width: "1px",
                                              float: "right",
                                              marginTop: "-6.5px",
                                              marginRight: "-3px",
                                              transform: "rotate(45deg)",
                                              borderRight: "1px solid black",
                                            }}
                                          ></div>
                                          <div
                                            style={{
                                              height: "8px",
                                              width: "1px",
                                              float: "left",
                                              marginTop: "-6px",
                                              marginLeft: "-3px",
                                              transform: "rotate(-45deg)",
                                              borderLeft: "1px solid black",
                                            }}
                                          ></div>
                                          <div
                                            style={{
                                              height: "8px",
                                              width: "1px",
                                              float: "right",
                                              marginTop: getOuterBottom(
                                                detail.quoteData.boxHeight,
                                                screen,
                                                detail.quoteData.mCalc
                                              ),
                                              marginRight: "-4px",
                                              transform: "rotate(-45deg)",
                                              borderLeft: "1px solid black",
                                            }}
                                          ></div>
                                          <div
                                            style={{
                                              height: "8px",
                                              width: "1px",
                                              float: "left",
                                              marginTop: getOuterBottom(
                                                detail.quoteData.boxHeight,
                                                screen,
                                                detail.quoteData.mCalc
                                              ),
                                              marginLeft: "-3px",
                                              transform: "rotate(45deg)",
                                              borderLeft: "1px solid black",
                                            }}
                                          ></div>
                                          {/* outer corner lines end */}

                                          {detail.quoteData.boxTop === "on" &&
                                            [
                                              ...Array(
                                                detail.quoteData.numTopBoxes
                                              ),
                                            ].map((_, index) => (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                      detail.quoteData.mCalc /
                                                      detail.quoteData
                                                        .numFrames +
                                                    "px"
                                                  } - 23px)`,
                                                  height: `calc(${
                                                    (detail.quoteData
                                                      .topnewHeights *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px )`,
                                                  margin: "5px",
                                                  position: "relative",
                                                }}
                                              >
                                                {[
                                                  ...Array(
                                                    detail.quoteData.topFixedNum
                                                  ),
                                                ].map((_, index) => (
                                                  <div
                                                    style={{
                                                      flex: "1",
                                                      background: "lightgreen",
                                                      width: `calc(${
                                                        (detail.quoteData
                                                          .topFixedWidth[
                                                          index
                                                        ] *
                                                          screen) /
                                                          detail.quoteData
                                                            .mCalc /
                                                          detail.quoteData
                                                            .numFrames +
                                                        "px"
                                                      } - 18px)`,
                                                      height: `calc(${
                                                        (detail.quoteData
                                                          .topnewHeights *
                                                          screen) /
                                                        detail.quoteData.mCalc
                                                      }px )`,
                                                      border: "solid 1px #000",
                                                      marginLeft:
                                                        index === 0
                                                          ? "0px"
                                                          : "5px",
                                                      position: "relative",
                                                    }}
                                                  >
                                                    {/* outer corner lines start for bottom sash*/}
                                                    <div
                                                      style={{
                                                        height: "7px",
                                                        width: "1px",
                                                        float: "right",
                                                        marginTop: "-7px",
                                                        marginRight: "-4px",
                                                        transform:
                                                          "rotate(45deg)",
                                                        background:
                                                          (detail.quoteData
                                                            .topFixedWidth
                                                            .length === 0 &&
                                                            detail.quoteData
                                                              .boxTop ===
                                                              "on") ||
                                                          index ===
                                                            detail.quoteData
                                                              .topFixedWidth
                                                              .length -
                                                              1
                                                            ? "black"
                                                            : "transparent",
                                                      }}
                                                    ></div>
                                                    <div
                                                      style={{
                                                        height: "8px",
                                                        width: "1px",
                                                        float: "left",
                                                        marginTop: "-7px",
                                                        marginLeft: "-4px",
                                                        transform:
                                                          "rotate(-45deg)",
                                                        background:
                                                          index === 0
                                                            ? "black"
                                                            : "transparent",
                                                      }}
                                                    ></div>

                                                    {/* fixed plus  */}
                                                    <div
                                                      style={{
                                                        position: "absolute",
                                                        top: "50%",
                                                        left: "50%",
                                                        transform:
                                                          "translate(-50%, -50%)",
                                                        fontSize: "30px",
                                                        fontWeight: "200",
                                                        cursor: "pointer",
                                                        color: "#000",
                                                        zIndex: 1,
                                                      }}
                                                    >
                                                      +
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            ))}

                                          <div style={{ display: "flex" }}>
                                            {[
                                              ...Array(
                                                detail.quoteData
                                                  .numSecondInnerBoxes
                                              ),
                                            ].map((_, index) => (
                                              <div
                                                key={index}
                                                style={{
                                                  background:
                                                    detail.quoteData.split ===
                                                    "on"
                                                      ? "transparent"
                                                      : detail.quoteData
                                                          .panelType === 1
                                                      ? "lightgray"
                                                      : detail.quoteData
                                                          .panelType === 2
                                                      ? "lightyellow"
                                                      : "lightblue",
                                                  border:
                                                    detail.quoteData.split ===
                                                    "on"
                                                      ? "0px"
                                                      : "1px solid #333",
                                                  height: `calc(${
                                                    ((detail.quoteData
                                                      .boxHeight -
                                                      detail.quoteData
                                                        .topnewHeights -
                                                      detail.quoteData
                                                        .bottomnewHeights) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - ${
                                                    detail.quoteData.boxTop ===
                                                    "on"
                                                      ? "30px"
                                                      : "25px"
                                                  })`,
                                                  width: `calc(${
                                                    (detail.quoteData.newWidths[
                                                      index
                                                    ] *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px )`,
                                                  marginTop:
                                                    detail.quoteData.boxTop ===
                                                    "on"
                                                      ? "0px"
                                                      : "5px",
                                                  marginRight:
                                                    index ===
                                                    detail.quoteData
                                                      .numSecondInnerBoxes -
                                                      1
                                                      ? "5px"
                                                      : "2.5px",
                                                  marginLeft:
                                                    index === 0
                                                      ? "5px"
                                                      : "2.5px",
                                                  position: "relative",
                                                }}
                                              >
                                                {/* Inner corner lines start */}
                                                <div
                                                  style={{
                                                    height: "10px",
                                                    width: "1px",
                                                    float: "left",
                                                    marginTop: `calc(${
                                                      ((detail.quoteData
                                                        .boxHeight -
                                                        detail.quoteData
                                                          .topnewHeights -
                                                        detail.quoteData
                                                          .bottomnewHeights) *
                                                        screen) /
                                                      detail.quoteData.mCalc
                                                    }px - ${
                                                      detail.quoteData
                                                        .boxTop === "on"
                                                        ? "31px"
                                                        : "27px"
                                                    })`,
                                                    marginLeft: "-4px",
                                                    transform: "rotate(45deg)",
                                                    borderLeft:
                                                      index === 0
                                                        ? "1px solid black"
                                                        : "none",
                                                  }}
                                                ></div>
                                                <div
                                                  style={{
                                                    height: "10px",
                                                    width: "1px",
                                                    float: "left",
                                                    marginTop: "-7px",
                                                    marginLeft: "-3px",
                                                    transform: "rotate(-45deg)",
                                                    borderLeft:
                                                      index === 0
                                                        ? "1px solid black"
                                                        : "none",
                                                  }}
                                                ></div>
                                                <div
                                                  style={{
                                                    height: "8px",
                                                    width: "1px",
                                                    float: "right",
                                                    marginTop: "-7px",
                                                    marginRight: "-3px",
                                                    transform: "rotate(45deg)",
                                                    borderRight:
                                                      "1px solid black",
                                                  }}
                                                ></div>
                                                <div
                                                  style={{
                                                    height: "9px",
                                                    width: "1px",
                                                    float: "left",
                                                    marginTop: `calc(${
                                                      ((detail.quoteData
                                                        .boxHeight -
                                                        detail.quoteData
                                                          .topnewHeights -
                                                        detail.quoteData
                                                          .bottomnewHeights) *
                                                        screen) /
                                                      detail.quoteData.mCalc
                                                    }px - ${
                                                      detail.quoteData
                                                        .boxTop === "on"
                                                        ? "32px"
                                                        : "27px"
                                                    })`,
                                                    marginLeft: "-4px",
                                                    transform: "rotate(-45deg)",
                                                    borderLeft:
                                                      index === 0
                                                        ? "transparent"
                                                        : "1px solid black",
                                                  }}
                                                ></div>
                                                <div
                                                  style={{
                                                    height: "9px",
                                                    width: "1px",
                                                    float: "right",
                                                    marginTop: `calc(${
                                                      ((detail.quoteData
                                                        .boxHeight -
                                                        detail.quoteData
                                                          .topnewHeights -
                                                        detail.quoteData
                                                          .bottomnewHeights) *
                                                        screen) /
                                                      detail.quoteData.mCalc
                                                    }px - ${
                                                      detail.quoteData
                                                        .boxTop === "on"
                                                        ? "33px"
                                                        : "27px"
                                                    })`,
                                                    marginRight: "-2px",
                                                    transform: "rotate(-45deg)",
                                                    borderLeft:
                                                      index ===
                                                      detail.quoteData
                                                        .numSecondInnerBoxes -
                                                        1
                                                        ? "1px solid black"
                                                        : "transparent",
                                                  }}
                                                ></div>
                                                <div
                                                  style={{
                                                    height: "7px",
                                                    width: "1px",
                                                    float: "left",
                                                    right: "0px",
                                                    marginTop: "-6px",
                                                    marginRight: "-1px",
                                                    background:
                                                      index === 0
                                                        ? "transparent"
                                                        : "black",
                                                  }}
                                                ></div>
                                                {/* Inner corner lines ends */}

                                                <div
                                                  style={{
                                                    height: "7px",
                                                    width: "1px",
                                                    float: "left",
                                                    right: "0px",
                                                    marginTop: `calc(${
                                                      ((detail.quoteData
                                                        .boxHeight -
                                                        detail.quoteData
                                                          .topnewHeights -
                                                        detail.quoteData
                                                          .bottomnewHeights) *
                                                        screen) /
                                                      detail.quoteData.mCalc
                                                    }px - ${
                                                      detail.quoteData
                                                        .boxTop === "on"
                                                        ? "31px"
                                                        : "26px"
                                                    } )`,
                                                    marginRight: "-1px",
                                                    background:
                                                      index === 0 ||
                                                      index ===
                                                        detail.quoteData
                                                          .numSecondInnerBoxes
                                                          .length -
                                                          1
                                                        ? "transparent"
                                                        : "black",
                                                  }}
                                                ></div>

                                                {/* {detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.grill === 'yes' && createGrill((parseFloat(detail.quoteData.boxHeight)+0.7), detail.quoteData.topnewHeights, detail.quoteData.bottomnewHeights, detail.quoteData.mCalc)} */}

                                                {detail.quoteData.boxNames[
                                                  index
                                                ] === "Shutter" ? (
                                                  detail.quoteData.boxHandle[
                                                    index
                                                  ] === "left" ? (
                                                    <>
                                                      {/* Show left handle only for first box */}
                                                      {index === 0 && (
                                                        <img
                                                          src={Handle}
                                                          style={{
                                                            float: "left",
                                                            marginTop: `calc(${
                                                              ((detail.quoteData
                                                                .boxHeight -
                                                                detail.quoteData
                                                                  .topnewHeights -
                                                                detail.quoteData
                                                                  .bottomnewHeights) *
                                                                screen) /
                                                              detail.quoteData
                                                                .mCalc /
                                                              2
                                                            }px - 15px`,
                                                            marginLeft: "-6px",
                                                            width:
                                                              screen === 3
                                                                ? "5px"
                                                                : "4px",
                                                          }}
                                                          alt="Left Handle"
                                                        />
                                                      )}

                                                      {/* Always show right arrow from this box */}
                                                      <div
                                                        className="expanding-arrow-line"
                                                        style={{
                                                          paddingLeft: `calc(${
                                                            ((detail.quoteData
                                                              .newWidths[
                                                              index
                                                            ] /
                                                              8) *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px)`,
                                                          position: "relative",
                                                          float: "left",
                                                          width: `calc(${
                                                            ((detail.quoteData
                                                              .newWidths[
                                                              index
                                                            ] /
                                                              2) *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px)`,
                                                          top: `calc(${
                                                            (((detail.quoteData
                                                              .boxHeight -
                                                              detail.quoteData
                                                                .topnewHeights -
                                                              detail.quoteData
                                                                .bottomnewHeights) /
                                                              2) *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px)`,
                                                        }}
                                                      >
                                                        <div
                                                          className="line"
                                                          align="center"
                                                        >
                                                          <div
                                                            style={{
                                                              marginTop: "-7px",
                                                              color: "#333",
                                                            }}
                                                          ></div>
                                                        </div>
                                                        <div className="arrow-right"></div>
                                                      </div>
                                                    </>
                                                  ) : (
                                                    <>
                                                      {/* If it's the last box, show right handle */}
                                                      {index ===
                                                        detail.quoteData
                                                          .numSecondInnerBoxes -
                                                          1 && (
                                                        <img
                                                          src={Handle}
                                                          style={{
                                                            float: "right",
                                                            marginTop: `calc(${
                                                              ((detail.quoteData
                                                                .boxHeight -
                                                                detail.quoteData
                                                                  .topnewHeights -
                                                                detail.quoteData
                                                                  .bottomnewHeights) *
                                                                screen) /
                                                              detail.quoteData
                                                                .mCalc /
                                                              2
                                                            }px - 15px`,
                                                            marginRight: "-6px",
                                                            width:
                                                              screen === 3
                                                                ? "5px"
                                                                : "4px",
                                                          }}
                                                          alt="Right Handle"
                                                        />
                                                      )}

                                                      {/* Always show left arrow pointing to this box */}
                                                      <div
                                                        className="expanding-arrow-line"
                                                        style={{
                                                          paddingRight: `calc(${
                                                            ((detail.quoteData
                                                              .newWidths[
                                                              index
                                                            ] /
                                                              8) *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px)`,
                                                          position: "relative",
                                                          float: "right",
                                                          width: `calc(${
                                                            ((detail.quoteData
                                                              .newWidths[
                                                              index
                                                            ] /
                                                              2) *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px)`,
                                                          top: `calc(${
                                                            (((detail.quoteData
                                                              .boxHeight -
                                                              detail.quoteData
                                                                .topnewHeights -
                                                              detail.quoteData
                                                                .bottomnewHeights) /
                                                              2) *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px)`,
                                                        }}
                                                      >
                                                        <div
                                                          className="line"
                                                          align="center"
                                                        >
                                                          <div
                                                            style={{
                                                              marginTop: "-7px",
                                                              color: "#333",
                                                            }}
                                                          ></div>
                                                        </div>
                                                        <div className="arrow-left"></div>
                                                      </div>
                                                    </>
                                                  )
                                                ) : (
                                                  // Default view for boxes not marked as 'Shutter'
                                                  <div
                                                    style={{
                                                      position: "absolute",
                                                      top: "50%",
                                                      left: "50%",
                                                      transform:
                                                        "translate(-50%, -50%)",
                                                      fontSize: "50px",
                                                      fontWeight: "100",
                                                      cursor: "pointer",
                                                      color: "#000",
                                                      zIndex: 1,
                                                    }}
                                                  >
                                                    +
                                                  </div>
                                                )}

                                                {detail.quoteData.mesh ===
                                                  "yes" &&
                                                  detail.quoteData.boxNames[
                                                    index
                                                  ] === "Shutter" &&
                                                  detail.quoteData.boxHandle[
                                                    index
                                                  ] === "left" && (
                                                    <img
                                                      src={meshimg}
                                                      style={{
                                                        width:
                                                          screen === 3
                                                            ? "40px"
                                                            : "20px",
                                                        float: "left",
                                                        marginLeft:
                                                          screen === 3
                                                            ? detail.quoteData
                                                                .boxHandle[
                                                                index
                                                              ] === "left"
                                                              ? "-15px"
                                                              : "0px"
                                                            : detail.quoteData
                                                                .boxHandle[
                                                                index
                                                              ] === "left"
                                                            ? "-10px"
                                                            : "px",
                                                        marginTop:
                                                          screen === 3
                                                            ? `calc(${
                                                                ((detail
                                                                  .quoteData
                                                                  .boxHeight -
                                                                  detail
                                                                    .quoteData
                                                                    .topnewHeights -
                                                                  detail
                                                                    .quoteData
                                                                    .bottomnewHeights) *
                                                                  screen) /
                                                                detail.quoteData
                                                                  .mCalc
                                                              }px - ${
                                                                detail.quoteData
                                                                  .boxTop ===
                                                                "on"
                                                                  ? "72px"
                                                                  : "67px"
                                                              } )`
                                                            : `calc(${
                                                                ((detail
                                                                  .quoteData
                                                                  .boxHeight -
                                                                  detail
                                                                    .quoteData
                                                                    .topnewHeights -
                                                                  detail
                                                                    .quoteData
                                                                    .bottomnewHeights) *
                                                                  screen) /
                                                                detail.quoteData
                                                                  .mCalc
                                                              }px - 45px)`,
                                                      }}
                                                    />
                                                  )}

                                                {detail.quoteData.mesh ===
                                                  "yes" &&
                                                  detail.quoteData.boxNames[
                                                    index
                                                  ] === "Shutter" &&
                                                  detail.quoteData.boxHandle[
                                                    index
                                                  ] === "right" && (
                                                    <img
                                                      src={meshimg}
                                                      style={{
                                                        width:
                                                          screen === 3
                                                            ? "40px"
                                                            : "20px",
                                                        float: "left",
                                                        marginLeft:
                                                          screen === 3
                                                            ? detail.quoteData
                                                                .boxHandle[
                                                                index
                                                              ] === "right"
                                                              ? "-1px"
                                                              : "0px"
                                                            : detail.quoteData
                                                                .boxHandle[
                                                                index
                                                              ] === "right"
                                                            ? "0px"
                                                            : "px",
                                                        marginTop:
                                                          screen === 3
                                                            ? `calc(${
                                                                ((detail
                                                                  .quoteData
                                                                  .boxHeight -
                                                                  detail
                                                                    .quoteData
                                                                    .topnewHeights -
                                                                  detail
                                                                    .quoteData
                                                                    .bottomnewHeights) *
                                                                  screen) /
                                                                detail.quoteData
                                                                  .mCalc
                                                              }px - ${
                                                                detail.quoteData
                                                                  .boxTop ===
                                                                "on"
                                                                  ? "72px"
                                                                  : "67px"
                                                              } )`
                                                            : `calc(${
                                                                ((detail
                                                                  .quoteData
                                                                  .boxHeight -
                                                                  detail
                                                                    .quoteData
                                                                    .topnewHeights -
                                                                  detail
                                                                    .quoteData
                                                                    .bottomnewHeights) *
                                                                  screen) /
                                                                detail.quoteData
                                                                  .mCalc
                                                              }px - 45px)`,
                                                      }}
                                                    />
                                                  )}
                                                {/* {detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.grill === 'yes' && createGrill((parseFloat(detail.quoteData.boxHeight)), detail.quoteData.topnewHeights, detail.quoteData.bottomnewHeights, detail.quoteData.mCalc)} */}
                                                {detail.quoteData.boxNames[
                                                  index
                                                ] === "Shutter" &&
                                                  detail.quoteData.grill ===
                                                    "yes" && (
                                                    <div
                                                      style={{
                                                        position: "absolute",
                                                        width: "100%",
                                                      }}
                                                    >
                                                      {boxes(
                                                        detail.quoteData.mCalc,
                                                        detail.quoteData
                                                          .measure,
                                                        detail.quoteData
                                                          .boxHeight -
                                                          detail.quoteData
                                                            .topnewHeights -
                                                          detail.quoteData
                                                            .bottomnewHeights
                                                      )}
                                                    </div>
                                                  )}

                                                {detail.quoteData.split ===
                                                  "on" && (
                                                  <>
                                                    <div
                                                      style={{
                                                        background:
                                                          detail.quoteData
                                                            .shutterHeight[
                                                            index
                                                          ].top === "glass"
                                                            ? "lightblue"
                                                            : detail.quoteData
                                                                .shutterHeight[
                                                                index
                                                              ].top === "panel"
                                                            ? "lightgrey"
                                                            : "lightyellow",
                                                        width: `calc(${
                                                          (detail.quoteData
                                                            .newWidths[index] *
                                                            screen) /
                                                          detail.quoteData.mCalc
                                                        }px - 16 px)`,
                                                        height: `calc(${
                                                          (detail.quoteData
                                                            .shutterHeight[
                                                            index
                                                          ].height *
                                                            screen) /
                                                          detail.quoteData.mCalc
                                                        }px - 15px`,
                                                        border:
                                                          "1px solid #333",
                                                      }}
                                                    ></div>
                                                    <div
                                                      style={{
                                                        background:
                                                          detail.quoteData
                                                            .shutterHeight[
                                                            index
                                                          ].bottom === "glass"
                                                            ? "lightblue"
                                                            : detail.quoteData
                                                                .shutterHeight[
                                                                index
                                                              ].bottom ===
                                                              "panel"
                                                            ? "lightgrey"
                                                            : "lightyellow",
                                                        width: `calc(${
                                                          (detail.quoteData
                                                            .newWidths[index] *
                                                            screen) /
                                                          detail.quoteData.mCalc
                                                        }px - 16 px)`,
                                                        height: `calc(${
                                                          ((detail.quoteData
                                                            .boxHeight -
                                                            detail.quoteData
                                                              .shutterHeight[
                                                              index
                                                            ].height -
                                                            detail.quoteData
                                                              .topnewHeights) *
                                                            screen) /
                                                          detail.quoteData.mCalc
                                                        }px - ${
                                                          detail.quoteData
                                                            .boxTop === "on"
                                                            ? "19px"
                                                            : "15px"
                                                        })`,
                                                        border:
                                                          "1px solid #333",
                                                        marginTop: "5px",
                                                      }}
                                                    ></div>
                                                  </>
                                                )}
                                                {/* {detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.grill === 'yes' && boxes(detail.quoteData.mCalc, detail.quoteData.measure, detail.quoteData.boxHeight-detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights + 0.5)} */}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              )}

                              {detail.quoteData.item === "SlidingWindow" && (
                                <>
                                  <div
                                    align="center"
                                    style={{
                                      alignContent: "center",
                                      alignItems: "center",
                                      textAlign: "center",
                                      marginLeft: "auto",
                                      marginRight: "auto",
                                    }}
                                  >
                                    <div
                                      style={{
                                        float: "left",
                                        boxShadow: "1px 1px 5px grey",
                                        width:
                                          (detail.quoteData.boxWidth * screen) /
                                            detail.quoteData.mCalc +
                                          "px",
                                        height:
                                          (detail.quoteData.boxHeight *
                                            screen) /
                                            detail.quoteData.mCalc +
                                          "px",
                                        border: "1px solid #333",
                                      }}
                                    >
                                      {[
                                        ...Array(detail.quoteData.numFrames),
                                      ].map((_, index) => (
                                        <div
                                          style={{
                                            float: "left",
                                            margin: "5px",
                                            border: "1px solid #333",
                                            width: `calc(${
                                              (detail.quoteData.boxWidth *
                                                screen) /
                                                detail.quoteData.mCalc /
                                                detail.quoteData.numFrames +
                                              "px"
                                            } - 12px)`,
                                            height: `calc(${
                                              (detail.quoteData.boxHeight *
                                                screen) /
                                                detail.quoteData.mCalc +
                                              "px"
                                            } - 12px)`,
                                            position: "relative",
                                          }}
                                        >
                                          {/* outer corner lines start */}
                                          <div
                                            style={{
                                              height: "8px",
                                              width: "1px",
                                              float: "right",
                                              marginTop: "-7px",
                                              marginRight: "-3.5px",
                                              transform: "rotate(45deg)",
                                              borderRight: "1px solid black",
                                            }}
                                          ></div>
                                          <div
                                            style={{
                                              height: "8px",
                                              width: "1px",
                                              float: "left",
                                              marginTop: "-7px",
                                              marginLeft: "-3.5px",
                                              transform: "rotate(-45deg)",
                                              borderLeft: "1px solid black",
                                            }}
                                          ></div>
                                          <div
                                            style={{
                                              height: "8px",
                                              width: "1px",
                                              float: "right",
                                              marginTop: `calc(${
                                                (detail.quoteData.boxHeight *
                                                  screen) /
                                                detail.quoteData.mCalc
                                              }px - 14px)`,
                                              marginRight: "-4px",
                                              transform: "rotate(-45deg)",
                                              borderLeft: "1px solid black",
                                            }}
                                          ></div>
                                          <div
                                            style={{
                                              height: "8px",
                                              width: "1px",
                                              float: "left",
                                              marginTop: `calc(${
                                                (detail.quoteData.boxHeight *
                                                  screen) /
                                                detail.quoteData.mCalc
                                              }px - 15px)`,
                                              marginLeft: "-3px",
                                              transform: "rotate(45deg)",
                                              borderLeft: "1px solid black",
                                            }}
                                          ></div>
                                          {/* outer corner lines end */}

                                          {detail.quoteData.boxTop === "on" &&
                                            [
                                              ...Array(
                                                detail.quoteData.numTopBoxes
                                              ),
                                            ].map((_, index) => (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  position: "relative",
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                      detail.quoteData.mCalc /
                                                      detail.quoteData
                                                        .numFrames +
                                                    "px"
                                                  } - 23px)`,
                                                  height: `calc(${
                                                    (detail.quoteData
                                                      .topnewHeights *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px )`,
                                                  margin: "5px",
                                                }}
                                              >
                                                {[
                                                  ...Array(
                                                    detail.quoteData.topFixedNum
                                                  ),
                                                ].map((_, index) => (
                                                  <div
                                                    style={{
                                                      flex: "1",
                                                      background:
                                                        detail.quoteData
                                                          .topsash[index]
                                                          .type === "fixed"
                                                          ? "lightgreen"
                                                          : "lightblue",
                                                      width: `calc(${
                                                        (detail.quoteData
                                                          .topFixedWidth[
                                                          index
                                                        ] *
                                                          screen) /
                                                          detail.quoteData
                                                            .mCalc /
                                                          numFrames +
                                                        "px"
                                                      } - 18px)`,
                                                      height: `calc(${
                                                        (detail.quoteData
                                                          .topnewHeights *
                                                          screen) /
                                                        detail.quoteData.mCalc
                                                      }px )`,
                                                      border: "solid 1px #000",
                                                      marginLeft:
                                                        index === 0
                                                          ? "0px"
                                                          : "5px",
                                                      position: "relative",
                                                    }}
                                                  >
                                                    {/* outer corner lines start for bottom sash*/}
                                                    <div
                                                      style={{
                                                        height: "8px",
                                                        width: "1px",
                                                        float: "right",
                                                        marginTop: "-7px",
                                                        marginRight: "-3px",
                                                        transform:
                                                          "rotate(45deg)",
                                                        borderRight:
                                                          index ===
                                                          detail.quoteData
                                                            .topsash.length -
                                                            1
                                                            ? "1px solid #333"
                                                            : "none",
                                                      }}
                                                    ></div>
                                                    <div
                                                      style={{
                                                        height: "8px",
                                                        width: "1px",
                                                        float: "left",
                                                        marginTop: "-7px",
                                                        marginLeft: "-3px",
                                                        transform:
                                                          "rotate(-45deg)",
                                                        borderLeft:
                                                          index === 0
                                                            ? "1px solid #333"
                                                            : "none",
                                                      }}
                                                    ></div>

                                                    {detail.quoteData.topsash[
                                                      index
                                                    ].type === "shutter" ? (
                                                      <>
                                                        <img
                                                          src={left}
                                                          style={{
                                                            float: "left",
                                                            marginTop: `calc(${
                                                              (detail.quoteData
                                                                .topnewHeights *
                                                                screen) /
                                                              detail.quoteData
                                                                .mCalc
                                                            }px - 25px)`,
                                                            marginLeft: "45%",
                                                            width:
                                                              screen === 3
                                                                ? "13px"
                                                                : "8px",
                                                            transform:
                                                              "rotate(-90deg)",
                                                          }}
                                                        />
                                                        <div
                                                          style={{
                                                            position:
                                                              "absolute",
                                                            width: "100%",
                                                            height: "100%",
                                                            overflow: "hidden",
                                                          }}
                                                        >
                                                          {/* Left Diagonal Line  */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              top: "0",
                                                              left: "50%",
                                                              width: "2px",
                                                              height: "1000%",
                                                              borderLeft:
                                                                "1px dashed gray",
                                                              transform: `rotate(${
                                                                Math.atan(
                                                                  (detail
                                                                    .quoteData
                                                                    .topFixedWidth
                                                                    .length
                                                                    ? detail
                                                                        .quoteData
                                                                        .topFixedWidth[
                                                                        index
                                                                      ]
                                                                    : detail
                                                                        .quoteData
                                                                        .boxWidth) /
                                                                    (2 *
                                                                      detail
                                                                        .quoteData
                                                                        .topnewHeights)
                                                                ) *
                                                                (180 / Math.PI)
                                                              }deg)`,
                                                              transformOrigin:
                                                                "top left",
                                                            }}
                                                          ></div>

                                                          {/* Right Diagonal Line */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              top: "0",
                                                              left: "50%",
                                                              width: "2px",
                                                              height: "1000%",
                                                              borderLeft:
                                                                "1px dashed gray",
                                                              transform: `rotate(-${
                                                                Math.atan(
                                                                  (detail
                                                                    .quoteData
                                                                    .topFixedWidth
                                                                    .length
                                                                    ? detail
                                                                        .quoteData
                                                                        .topFixedWidth[
                                                                        index
                                                                      ]
                                                                    : detail
                                                                        .quoteData
                                                                        .boxWidth) /
                                                                    (2 *
                                                                      detail
                                                                        .quoteData
                                                                        .topnewHeights)
                                                                ) *
                                                                (180 / Math.PI)
                                                              }deg)`,
                                                              transformOrigin:
                                                                "top left",
                                                            }}
                                                          ></div>
                                                        </div>
                                                        {detail.quoteData
                                                          .topsash[index]
                                                          .type === "shutter" &&
                                                          detail.quoteData
                                                            .grill === "yes" &&
                                                          boxes(
                                                            detail.quoteData
                                                              .mCalc,
                                                            detail.quoteData
                                                              .measure,
                                                            detail.quoteData
                                                              .topnewHeights +
                                                              0.3
                                                          )}

                                                        {/* {detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.grill === 'yes' && createGrill(detail.quoteData.boxHeight, detail.quoteData.topnewHeights, detail.quoteData.bottomnewHeights, detail.quoteData.mCalc)} */}
                                                      </>
                                                    ) : (
                                                      <>
                                                        {/* fixed plus  */}
                                                        <div
                                                          style={{
                                                            position:
                                                              "absolute",
                                                            top: "50%",
                                                            left: "50%",
                                                            transform:
                                                              "translate(-50%, -50%)",
                                                            fontSize: "30px",
                                                            fontWeight: "200",
                                                            cursor: "pointer",
                                                            color: "#000",
                                                            zIndex: 1,
                                                          }}
                                                        >
                                                          +
                                                        </div>
                                                      </>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            ))}

                                          <div style={{ display: "flex" }}>
                                            {[
                                              ...Array(
                                                detail.quoteData
                                                  .numSecondInnerBoxes
                                              ),
                                            ].map((_, index) => (
                                              <div
                                                key={index}
                                                style={{
                                                  position: "relative",
                                                  height: `calc(${
                                                    ((detail.quoteData
                                                      .boxHeight -
                                                      detail.quoteData
                                                        .topnewHeights -
                                                      detail.quoteData
                                                        .bottomnewHeights) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - ${
                                                    detail.quoteData.boxTop ===
                                                    "on"
                                                      ? "29px"
                                                      : "24px"
                                                  })`,
                                                  width: `calc(${
                                                    (detail.quoteData.newWidths[
                                                      index
                                                    ] *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px )`,
                                                  backgroundColor:
                                                    detail.quoteData.boxColors[
                                                      index
                                                    ] || "lightblue",
                                                  marginTop:
                                                    detail.quoteData.boxTop ===
                                                    "on"
                                                      ? "0px"
                                                      : "3px",
                                                  marginRight:
                                                    index ===
                                                    detail.quoteData
                                                      .numSecondInnerBoxes -
                                                      1
                                                      ? "5px"
                                                      : "2.5px",
                                                  marginLeft:
                                                    index === 0
                                                      ? "5px"
                                                      : "2.5px",
                                                  border: "1px solid #333",
                                                }}
                                              >
                                                {/* Inner corner lines start */}
                                                <div
                                                  key={index}
                                                  style={{
                                                    height: "7px",
                                                    width: "1px",
                                                    float: "left",
                                                    marginTop: `calc(${
                                                      ((detail.quoteData
                                                        .boxHeight -
                                                        detail.quoteData
                                                          .topnewHeights -
                                                        detail.quoteData
                                                          .bottomnewHeights) *
                                                        screen) /
                                                      detail.quoteData.mCalc
                                                    }px - ${
                                                      detail.quoteData
                                                        .boxTop === "on"
                                                        ? "31px"
                                                        : "26px"
                                                    })`,
                                                    marginLeft: "-3px",
                                                    transform: "rotate(45deg)",
                                                    borderLeft:
                                                      index === 0
                                                        ? "1px solid black"
                                                        : "none",
                                                  }}
                                                ></div>
                                                <div
                                                  key={index}
                                                  style={{
                                                    height: "8px",
                                                    width: "1px",
                                                    float: "left",
                                                    marginTop: `calc(${
                                                      ((detail.quoteData
                                                        .boxHeight -
                                                        detail.quoteData
                                                          .topnewHeights -
                                                        detail.quoteData
                                                          .bottomnewHeights) *
                                                        screen) /
                                                      detail.quoteData.mCalc
                                                    }px - ${
                                                      detail.quoteData
                                                        .boxTop === "on"
                                                        ? "31px"
                                                        : "26px"
                                                    })`,
                                                    marginLeft: "-4px",
                                                    transform: "rotate(-45deg)",
                                                    borderLeft:
                                                      index === 0
                                                        ? "1px solid black"
                                                        : "none",
                                                  }}
                                                ></div>
                                                <div
                                                  style={{
                                                    height: "8px",
                                                    width: "1px",
                                                    float: "right",
                                                    marginTop: "-7px",
                                                    marginRight: "-3px",
                                                    transform: "rotate(45deg)",
                                                    borderRight:
                                                      "1px solid black",
                                                  }}
                                                ></div>
                                                <div
                                                  style={{
                                                    height: "8px",
                                                    width: "1px",
                                                    float: "right",
                                                    marginTop: `calc(${
                                                      ((detail.quoteData
                                                        .boxHeight -
                                                        detail.quoteData
                                                          .topnewHeights -
                                                        detail.quoteData
                                                          .bottomnewHeights) *
                                                        screen) /
                                                      detail.quoteData.mCalc
                                                    }px - ${
                                                      detail.quoteData
                                                        .boxTop === "on"
                                                        ? "31px"
                                                        : "27px"
                                                    })`,
                                                    marginRight: "-4px",
                                                    transform: "rotate(-45deg)",
                                                    borderLeft:
                                                      "1px solid black",
                                                  }}
                                                ></div>
                                                <div
                                                  style={{
                                                    height: "9px",
                                                    width: "1px",
                                                    float: "right",
                                                    marginTop: `calc(${
                                                      ((detail.quoteData
                                                        .boxHeight -
                                                        detail.quoteData
                                                          .topnewHeights -
                                                        detail.quoteData
                                                          .bottomnewHeights) *
                                                        screen) /
                                                      detail.quoteData.mCalc
                                                    }px - ${
                                                      detail.quoteData
                                                        .boxBottom === "on"
                                                        ? "33px"
                                                        : "27px"
                                                    })`,
                                                    marginRight: "-4px",
                                                    transform: "rotate(-45deg)",
                                                    borderRight:
                                                      index === -1
                                                        ? "1px solid black"
                                                        : "none",
                                                  }}
                                                ></div>
                                                <div
                                                  style={{
                                                    height: "7px",
                                                    width: "1px",
                                                    float: "left",
                                                    right: "0px",
                                                    marginTop: "-6px",
                                                    marginLeft: "-1px",
                                                    borderRight:
                                                      index === 0
                                                        ? "none"
                                                        : "1px solid #333",
                                                  }}
                                                ></div>
                                                {/* Inner corner lines ends */}
                                                {/* <div style={{
                                                // position: 'absolute',
                                                height: '7px',
                                                width: '1px',
                                                float: 'right',
                                                right: '0px',
                                                marginTop: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen}vw - ${detail.quoteData.boxTop === 'on' ? '31px' : '26px'})`,
                                 
                                                // marginTop: '-6px',
                                                marginRight: '-1px',
                                                borderRight: index === detail.quoteData.numSecondInnerBoxes.length - 1 ? '1px solid #333' : 'none',
                                              }}></div> */}

                                                <div
                                                  style={{
                                                    height: "7px",
                                                    width: "1px",
                                                    float: "left",
                                                    right: "0px",
                                                    marginTop: `calc(${
                                                      ((detail.quoteData
                                                        .boxHeight -
                                                        detail.quoteData
                                                          .topnewHeights -
                                                        detail.quoteData
                                                          .bottomnewHeights) *
                                                        screen) /
                                                      detail.quoteData.mCalc
                                                    }px - ${
                                                      detail.quoteData
                                                        .boxTop === "on"
                                                        ? "31px"
                                                        : "26px"
                                                    } )`,
                                                    marginLeft: "-1px",
                                                    borderRight:
                                                      index === 0 ||
                                                      index ===
                                                        detail.quoteData
                                                          .numSecondInnerBoxes
                                                          .length -
                                                          1
                                                        ? "none"
                                                        : "1px solid #333",
                                                  }}
                                                ></div>

                                                {/* {detail.quoteData.boxNames[index] === 'Shutter' && detail.quoteData.grill === 'yes' && createGrill(detail.quoteData.boxHeight, detail.quoteData.topnewHeights, detail.quoteData.bottomnewHeights, detail.quoteData.mCalc)} */}

                                                {detail.quoteData.boxNames[
                                                  index
                                                ] === "Shutter" ? (
                                                  detail.quoteData.boxHandle[
                                                    index
                                                  ] === "left" ? (
                                                    <>
                                                      {/* Show left handle only for first box */}
                                                      {index === 0 && (
                                                        <img
                                                          src={Handle}
                                                          style={{
                                                            float: "left",
                                                            marginTop: `calc(${
                                                              ((detail.quoteData
                                                                .boxHeight -
                                                                detail.quoteData
                                                                  .topnewHeights -
                                                                detail.quoteData
                                                                  .bottomnewHeights) *
                                                                screen) /
                                                              detail.quoteData
                                                                .mCalc /
                                                              2
                                                            }px - 15px`,
                                                            marginLeft: "-6px",
                                                            width:
                                                              screen === 3
                                                                ? "5px"
                                                                : "4px",
                                                          }}
                                                          alt="Left Handle"
                                                        />
                                                      )}

                                                      {/* Always show right arrow from this box */}
                                                      <div
                                                        className="expanding-arrow-line"
                                                        style={{
                                                          paddingLeft: `calc(${
                                                            ((detail.quoteData
                                                              .newWidths[
                                                              index
                                                            ] /
                                                              8) *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px)`,
                                                          position: "relative",
                                                          float: "left",
                                                          width: `calc(${
                                                            ((detail.quoteData
                                                              .newWidths[
                                                              index
                                                            ] /
                                                              2) *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px)`,
                                                          top: `calc(${
                                                            (((detail.quoteData
                                                              .boxHeight -
                                                              detail.quoteData
                                                                .topnewHeights -
                                                              detail.quoteData
                                                                .bottomnewHeights) /
                                                              2) *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px)`,
                                                        }}
                                                      >
                                                        <div
                                                          className="line"
                                                          align="center"
                                                        >
                                                          <div
                                                            style={{
                                                              marginTop: "-7px",
                                                              color: "#333",
                                                            }}
                                                          ></div>
                                                        </div>
                                                        <div className="arrow-right"></div>
                                                      </div>
                                                    </>
                                                  ) : (
                                                    <>
                                                      {/* If it's the last box, show right handle */}
                                                      {index ===
                                                        detail.quoteData
                                                          .numSecondInnerBoxes -
                                                          1 && (
                                                        <img
                                                          src={Handle}
                                                          style={{
                                                            float: "right",
                                                            marginTop: `calc(${
                                                              ((detail.quoteData
                                                                .boxHeight -
                                                                detail.quoteData
                                                                  .topnewHeights -
                                                                detail.quoteData
                                                                  .bottomnewHeights) *
                                                                screen) /
                                                              detail.quoteData
                                                                .mCalc /
                                                              2
                                                            }px - 15px`,
                                                            marginRight: "-6px",
                                                            width:
                                                              screen === 3
                                                                ? "5px"
                                                                : "4px",
                                                          }}
                                                          alt="Right Handle"
                                                        />
                                                      )}

                                                      {/* Always show left arrow pointing to this box */}
                                                      <div
                                                        className="expanding-arrow-line"
                                                        style={{
                                                          paddingRight: `calc(${
                                                            ((detail.quoteData
                                                              .newWidths[
                                                              index
                                                            ] /
                                                              8) *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px)`,
                                                          position: "relative",
                                                          float: "right",
                                                          width: `calc(${
                                                            ((detail.quoteData
                                                              .newWidths[
                                                              index
                                                            ] /
                                                              2) *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px)`,
                                                          top: `calc(${
                                                            (((detail.quoteData
                                                              .boxHeight -
                                                              detail.quoteData
                                                                .topnewHeights -
                                                              detail.quoteData
                                                                .bottomnewHeights) /
                                                              2) *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px)`,
                                                        }}
                                                      >
                                                        <div
                                                          className="line"
                                                          align="center"
                                                        >
                                                          <div
                                                            style={{
                                                              marginTop: "-7px",
                                                              color: "#333",
                                                            }}
                                                          ></div>
                                                        </div>
                                                        <div className="arrow-left"></div>
                                                      </div>
                                                    </>
                                                  )
                                                ) : (
                                                  // Default view for boxes not marked as 'Shutter'
                                                  <div
                                                    style={{
                                                      position: "absolute",
                                                      top: "50%",
                                                      left: "50%",
                                                      transform:
                                                        "translate(-50%, -50%)",
                                                      fontSize: "50px",
                                                      fontWeight: "100",
                                                      cursor: "pointer",
                                                      color: "#000",
                                                      zIndex: 1,
                                                    }}
                                                  >
                                                    +
                                                  </div>
                                                )}

                                                {detail.quoteData.mesh ===
                                                  "yes" &&
                                                  detail.quoteData.boxNames[
                                                    index
                                                  ] === "Shutter" &&
                                                  detail.quoteData.boxHandle[
                                                    index
                                                  ] === "left" && (
                                                    <img
                                                      src={meshimg}
                                                      style={{
                                                        position: "absolute",
                                                        left: 0,
                                                        width:
                                                          screen === 3
                                                            ? "40px"
                                                            : "20px",
                                                        float: "left",
                                                        marginTop:
                                                          screen === 3
                                                            ? `calc(${
                                                                ((detail
                                                                  .quoteData
                                                                  .boxHeight -
                                                                  detail
                                                                    .quoteData
                                                                    .topnewHeights -
                                                                  detail
                                                                    .quoteData
                                                                    .bottomnewHeights) *
                                                                  screen) /
                                                                detail.quoteData
                                                                  .mCalc
                                                              }px - ${
                                                                detail.quoteData
                                                                  .boxTop ===
                                                                "on"
                                                                  ? "72px"
                                                                  : "67px"
                                                              } )`
                                                            : `calc(${
                                                                ((detail
                                                                  .quoteData
                                                                  .boxHeight -
                                                                  detail
                                                                    .quoteData
                                                                    .topnewHeights -
                                                                  detail
                                                                    .quoteData
                                                                    .bottomnewHeights) *
                                                                  screen) /
                                                                detail.quoteData
                                                                  .mCalc
                                                              }px - 51px)`,
                                                      }}
                                                    />
                                                  )}

                                                {detail.quoteData.mesh ===
                                                  "yes" &&
                                                  detail.quoteData.boxNames[
                                                    index
                                                  ] === "Shutter" &&
                                                  detail.quoteData.boxHandle[
                                                    index
                                                  ] === "right" && (
                                                    <img
                                                      src={meshimg}
                                                      style={{
                                                        width:
                                                          screen === 3
                                                            ? "40px"
                                                            : "20px",
                                                        float: "left",
                                                        marginLeft:
                                                          screen === 3
                                                            ? detail.quoteData
                                                                .boxHandle[
                                                                index
                                                              ] === "right"
                                                              ? "-1px"
                                                              : "0px"
                                                            : detail.quoteData
                                                                .boxHandle[
                                                                index
                                                              ] === "right"
                                                            ? "0px"
                                                            : "px",
                                                        marginTop:
                                                          screen === 3
                                                            ? `calc(${
                                                                ((detail
                                                                  .quoteData
                                                                  .boxHeight -
                                                                  detail
                                                                    .quoteData
                                                                    .topnewHeights -
                                                                  detail
                                                                    .quoteData
                                                                    .bottomnewHeights) *
                                                                  screen) /
                                                                detail.quoteData
                                                                  .mCalc
                                                              }px - ${
                                                                detail.quoteData
                                                                  .boxTop ===
                                                                "on"
                                                                  ? "72px"
                                                                  : "67px"
                                                              } )`
                                                            : `calc(${
                                                                ((detail
                                                                  .quoteData
                                                                  .boxHeight -
                                                                  detail
                                                                    .quoteData
                                                                    .topnewHeights -
                                                                  detail
                                                                    .quoteData
                                                                    .bottomnewHeights) *
                                                                  screen) /
                                                                detail.quoteData
                                                                  .mCalc
                                                              }px - 51px)`,
                                                      }}
                                                    />
                                                  )}

                                                {detail.quoteData.boxNames[
                                                  index
                                                ] === "Shutter" &&
                                                  detail.quoteData.grill ===
                                                    "yes" &&
                                                  boxes(
                                                    detail.quoteData.mCalc,
                                                    detail.quoteData.measure,
                                                    detail.quoteData.boxHeight -
                                                      detail.quoteData
                                                        .topnewHeights -
                                                      detail.quoteData
                                                        .bottomnewHeights
                                                  )}
                                              </div>
                                            ))}
                                          </div>

                                          {detail.quoteData.boxBottom ===
                                            "on" &&
                                            [
                                              ...Array(
                                                detail.quoteData.numBottomBoxes
                                              ),
                                            ].map((_, index) => (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                      detail.quoteData.mCalc /
                                                      detail.quoteData
                                                        .numFrames +
                                                    "px"
                                                  } - 23px)`,
                                                  height: `calc(${
                                                    (detail.quoteData
                                                      .bottomnewHeights *
                                                      screen) /
                                                      detail.quoteData.mCalc +
                                                    "px"
                                                  } -10px)`,
                                                  margin: "5px",
                                                }}
                                              >
                                                {[
                                                  ...Array(
                                                    detail.quoteData
                                                      .bottomFixedNum
                                                  ),
                                                ].map((_, index) => (
                                                  <div
                                                    style={{
                                                      flex: "1",
                                                      background:
                                                        detail.quoteData
                                                          .bottomsash[index]
                                                          .type === "fixed"
                                                          ? "lightgreen"
                                                          : "lightblue",
                                                      width: `calc(${
                                                        (detail.quoteData
                                                          .bottomFixedWidth[
                                                          index
                                                        ] *
                                                          screen) /
                                                          detail.quoteData
                                                            .mCalc /
                                                          detail.quoteData
                                                            .numFrames +
                                                        "px"
                                                      } - 18px)`,
                                                      height: `calc(${
                                                        (detail.quoteData
                                                          .bottomnewHeights *
                                                          screen) /
                                                          detail.quoteData
                                                            .mCalc +
                                                        "px"
                                                      } - 5px)`,
                                                      border: "solid 1px #000",
                                                      marginLeft:
                                                        index === 0
                                                          ? "0px"
                                                          : "3px",
                                                      position: "relative",
                                                    }}
                                                  >
                                                    {/* outer corner lines start for bottom sash*/}
                                                    <div
                                                      style={{
                                                        height: "8px",
                                                        width: "1px",
                                                        float: "right",
                                                        marginTop: `calc(${
                                                          (detail.quoteData
                                                            .bottomnewHeights *
                                                            screen) /
                                                          detail.quoteData.mCalc
                                                        }px - 7px)`,
                                                        marginRight: "-3px",
                                                        transform:
                                                          "rotate(-45deg)",
                                                        borderRight:
                                                          index ===
                                                          detail.quoteData
                                                            .bottomsash.length -
                                                            1
                                                            ? "1px solid #333"
                                                            : "none",
                                                      }}
                                                    ></div>
                                                    <div
                                                      style={{
                                                        height: "8px",
                                                        width: "1px",
                                                        float: "left",
                                                        marginTop: `calc(${
                                                          (detail.quoteData
                                                            .bottomnewHeights *
                                                            screen) /
                                                          detail.quoteData.mCalc
                                                        }px - 7px)`,
                                                        marginLeft: "-3px",
                                                        transform:
                                                          "rotate(45deg)",
                                                        borderLeft:
                                                          index === 0
                                                            ? "1px solid #333"
                                                            : "none",
                                                      }}
                                                    ></div>
                                                    {/* outer corner lines end */}
                                                    {detail.quoteData
                                                      .bottomsash[index]
                                                      .type === "shutter" ? (
                                                      <>
                                                        <img
                                                          src={left}
                                                          style={{
                                                            float: "left",
                                                            marginTop: `calc(${
                                                              (detail.quoteData
                                                                .topnewHeights *
                                                                screen) /
                                                              detail.quoteData
                                                                .mCalc
                                                            }px - 18px)`,
                                                            marginLeft: "45%",
                                                            width: "5px",
                                                            transform:
                                                              "rotate(-90deg)",
                                                          }}
                                                        />
                                                        <div
                                                          style={{
                                                            position:
                                                              "absolute",
                                                            width: "100%",
                                                            height: "100%",
                                                            overflow: "hidden",
                                                          }}
                                                        >
                                                          {/* Left Diagonal Line  */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              top: "0",
                                                              left: "50%",
                                                              width: "2px",
                                                              height: "1000%",
                                                              borderLeft:
                                                                "1px dashed gray",
                                                              transform: `rotate(${
                                                                Math.atan(
                                                                  (detail
                                                                    .quoteData
                                                                    .bottomFixedWidth
                                                                    .length
                                                                    ? detail
                                                                        .quoteData
                                                                        .bottomFixedWidth[
                                                                        index
                                                                      ]
                                                                    : detail
                                                                        .quoteData
                                                                        .boxWidth) /
                                                                    (2 *
                                                                      detail
                                                                        .quoteData
                                                                        .bottomnewHeights)
                                                                ) *
                                                                (180 / Math.PI)
                                                              }deg)`,
                                                              transformOrigin:
                                                                "top left",
                                                            }}
                                                          ></div>

                                                          {/* Right Diagonal Line */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              top: "0",
                                                              left: "50%",
                                                              width: "2px",
                                                              height: "1000%",
                                                              borderLeft:
                                                                "1px dashed gray",
                                                              transform: `rotate(-${
                                                                Math.atan(
                                                                  (detail
                                                                    .quoteData
                                                                    .bottomFixedWidth
                                                                    .length
                                                                    ? detail
                                                                        .quoteData
                                                                        .bottomFixedWidth[
                                                                        index
                                                                      ]
                                                                    : detail
                                                                        .quoteData
                                                                        .boxWidth) /
                                                                    (2 *
                                                                      detail
                                                                        .quoteData
                                                                        .bottomnewHeights)
                                                                ) *
                                                                (180 / Math.PI)
                                                              }deg)`,
                                                              transformOrigin:
                                                                "top left",
                                                            }}
                                                          ></div>
                                                        </div>
                                                        {detail.quoteData
                                                          .bottomsash[index]
                                                          .type === "shutter" &&
                                                          detail.quoteData
                                                            .grill === "yes" &&
                                                          boxes(
                                                            detail.quoteData
                                                              .mCalc,
                                                            detail.quoteData
                                                              .measure,
                                                            detail.quoteData
                                                              .bottomnewHeights +
                                                              0.3
                                                          )}

                                                        {/* {detail.quoteData.bottomsash[index].type === 'shutter' && detail.quoteData.grill === 'yes' && createGrill(detail.quoteData.topnewHeights+.5)} */}
                                                      </>
                                                    ) : (
                                                      <>
                                                        {/* fixed plus  */}
                                                        <div
                                                          style={{
                                                            position:
                                                              "absolute",
                                                            top: "50%",
                                                            left: "50%",
                                                            transform:
                                                              "translate(-50%, -50%)",
                                                            fontSize: "30px",
                                                            fontWeight: "200",
                                                            cursor: "pointer",
                                                            color: "#000",
                                                            zIndex: 1,
                                                          }}
                                                        >
                                                          +
                                                        </div>
                                                      </>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            ))}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              )}

                              {detail.quoteData.item === "Ventilator" && (
                                <>
                                  {detail.quoteData.boxHeight > 1 &&
                                    detail.quoteData.boxWidth > 1 &&
                                    (detail.quoteData.fan === "on" ? (
                                      <>
                                        <div
                                          style={{
                                            float: "left",
                                            boxShadow: "1px 1px 5px grey",
                                            width:
                                              (detail.quoteData.boxWidth *
                                                screen) /
                                                detail.quoteData.mCalc +
                                              "px",
                                            height:
                                              (detail.quoteData.boxHeight *
                                                screen) /
                                                detail.quoteData.mCalc +
                                              "px",
                                            border: "1px solid #333",
                                            position: "relative",
                                          }}
                                        >
                                          {/* outer corner lines start */}
                                          <div
                                            style={{
                                              position: "absolute",
                                              height: "7px",
                                              width: "1px",
                                              float: "left",
                                              marginTop: "-1.5px",
                                              marginLeft: `calc(${
                                                detail.quoteData.boxWidth *
                                                screen
                                              }px - 4px)`,
                                              transform: "rotate(45deg)",
                                              borderRight: "1px solid black",
                                            }}
                                          ></div>
                                          <div
                                            style={{
                                              position: "absolute",
                                              height: "8px",
                                              width: "1px",
                                              float: "left",
                                              marginTop: "-1px",
                                              marginLeft: "3px",
                                              transform: "rotate(-45deg)",
                                              borderLeft: "1px solid black",
                                            }}
                                          ></div>
                                          <div
                                            style={{
                                              position: "absolute",
                                              height: "7px",
                                              width: "1px",
                                              float: "right",
                                              marginTop: `calc(${
                                                (detail.quoteData.boxHeight *
                                                  screen) /
                                                detail.quoteData.mCalc
                                              }px - 8px)`,
                                              marginLeft: `calc(${
                                                detail.quoteData.boxWidth *
                                                screen
                                              }px - 4px)`,
                                              transform: "rotate(-45deg)",
                                              borderLeft: "1px solid black",
                                            }}
                                          ></div>
                                          <div
                                            style={{
                                              position: "absolute",
                                              height: "7px",
                                              width: "1px",
                                              float: "left",
                                              marginTop: `calc(${
                                                (detail.quoteData.boxHeight *
                                                  screen) /
                                                detail.quoteData.mCalc
                                              }px - 8px)`,
                                              marginLeft: "1px",
                                              transform: "rotate(45deg)",
                                              borderLeft: "1px solid black",
                                            }}
                                          ></div>
                                          {/* outer corner lines end */}
                                          {/* Inner corner lines start */}
                                          {/* <div style={{ position:'absolute',height: '7px', width: '1px', float: 'left', marginTop: '3.5px', marginLeft: `calc(${(detail.quoteData.boxWidth)*screen}px - 10px)`, transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                      <div style={{ position:'absolute',height: '8px', width: '1px', float: 'left', marginTop: '4.5px', marginLeft: '10px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                      <div style={{ position:'absolute',height: '7px', width: '1px', float: 'right', marginTop: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc}px - ${detail.quoteData.boxTop === 'on' ? '33px' : '27px'})`, transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                      <div style={{ position:'absolute',height: '7px', width: '1px', float: 'left', marginTop: `calc(${(detail.quoteData.boxHeight - detail.quoteData.topnewHeights - detail.quoteData.bottomnewHeights) * screen / detail.quoteData.mCalc}px - ${detail.quoteData.boxTop === 'on' ? '33px' : '27px'})`, marginLeft: '7px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div> */}
                                          {/* Inner corner lines end */}
                                          {detail.quoteData.topsash &&
                                            detail.quoteData.topnewHeights >
                                              0 && (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                      detail.quoteData.mCalc +
                                                    "px"
                                                  } - 10px)`,
                                                  height: `calc(${
                                                    (detail.quoteData
                                                      .topnewHeights *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px )`,
                                                  marginTop: "4px",
                                                  marginLeft: "4px",
                                                }}
                                              >
                                                {detail.quoteData.topsash?.map(
                                                  (_, index) => (
                                                    <div
                                                      style={{
                                                        flex: 1,
                                                        background:
                                                          detail.quoteData
                                                            .topsash[index]
                                                            .type === "fixed"
                                                            ? "lightgreen"
                                                            : "lightblue",
                                                        width: `calc(${
                                                          ((detail.quoteData
                                                            .boxWidth /
                                                            detail.quoteData
                                                              .topsash.length) *
                                                            screen) /
                                                            detail.quoteData
                                                              .mCalc +
                                                          "px"
                                                        } - 28px)`,
                                                        height: `calc(${
                                                          (detail.quoteData
                                                            .topnewHeights *
                                                            screen) /
                                                          detail.quoteData.mCalc
                                                        }px )`,
                                                        border:
                                                          "solid 1px #000",
                                                        marginLeft:
                                                          index === 0
                                                            ? "0px"
                                                            : "5px",
                                                        position: "relative",
                                                      }}
                                                    >
                                                      {detail.quoteData.topsash[
                                                        index
                                                      ].type === "shutter" ? (
                                                        <>
                                                          <img
                                                            src={left}
                                                            style={{
                                                              float: "left",
                                                              marginTop: `calc(${
                                                                (detail
                                                                  .quoteData
                                                                  .topnewHeights *
                                                                  screen) /
                                                                detail.quoteData
                                                                  .mCalc
                                                              }px - 15px)`,
                                                              marginLeft: "45%",
                                                              width:
                                                                screen === 3
                                                                  ? "13px"
                                                                  : "8px",
                                                              transform:
                                                                "rotate(-90deg)",
                                                            }}
                                                            alt="Left Handle"
                                                          />
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              width: "100%",
                                                              height: "100%",
                                                              overflow:
                                                                "hidden",
                                                            }}
                                                          >
                                                            {/* Left Diagonal Line  */}
                                                            <div
                                                              style={{
                                                                position:
                                                                  "absolute",
                                                                top: "0",
                                                                left: "50%",
                                                                width: "2px",
                                                                height: "1000%",
                                                                borderLeft:
                                                                  "1px dashed gray",
                                                                transform: `rotate(${
                                                                  Math.atan(
                                                                    (detail
                                                                      .quoteData
                                                                      .topsash
                                                                      .length >
                                                                    0
                                                                      ? detail
                                                                          .quoteData
                                                                          .boxWidth /
                                                                        detail
                                                                          .quoteData
                                                                          .topsash
                                                                          .length
                                                                      : detail
                                                                          .quoteData
                                                                          .boxWidth) /
                                                                      (2 *
                                                                        detail
                                                                          .quoteData
                                                                          .topnewHeights)
                                                                  ) *
                                                                  (180 /
                                                                    Math.PI)
                                                                }deg)`,
                                                                transformOrigin:
                                                                  "top left",
                                                              }}
                                                            ></div>

                                                            {/* Right Diagonal Line */}
                                                            <div
                                                              style={{
                                                                position:
                                                                  "absolute",
                                                                top: "0",
                                                                left: "50%",
                                                                width: "2px",
                                                                height: "1000%",
                                                                borderLeft:
                                                                  "1px dashed gray",
                                                                transform: `rotate(-${
                                                                  Math.atan(
                                                                    (detail
                                                                      .quoteData
                                                                      .topsash
                                                                      .length >
                                                                    0
                                                                      ? detail
                                                                          .quoteData
                                                                          .boxWidth /
                                                                        detail
                                                                          .quoteData
                                                                          .topsash
                                                                          .length
                                                                      : detail
                                                                          .quoteData
                                                                          .boxWidth) /
                                                                      (2 *
                                                                        detail
                                                                          .quoteData
                                                                          .topnewHeights)
                                                                  ) *
                                                                  (180 /
                                                                    Math.PI)
                                                                }deg)`,
                                                                transformOrigin:
                                                                  "top left",
                                                              }}
                                                            ></div>
                                                          </div>
                                                        </>
                                                      ) : (
                                                        <>
                                                          {/* fixed plus  */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              top: "50%",
                                                              left: "50%",
                                                              transform:
                                                                "translate(-50%, -50%)",
                                                              fontSize: `${
                                                                screen === 20
                                                                  ? "15px"
                                                                  : "30px"
                                                              }`,
                                                              fontWeight: "200",
                                                              cursor: "pointer",
                                                              color: "#000",
                                                              zIndex: 1,
                                                            }}
                                                          >
                                                            +
                                                          </div>
                                                        </>
                                                      )}{" "}
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            )}

                                          {detail.quoteData.fanTop === "Top" &&
                                            detail.quoteData.fanLeft ===
                                              "Left" &&
                                            detail.quoteData.divider ===
                                              "Vertical" &&
                                            detail.quoteData.switchs ===
                                              "on" && (
                                              <div
                                                style={{
                                                  float: "left",
                                                  height: `calc(${
                                                    ((parseFloat(
                                                      detail.quoteData.boxHeight
                                                    ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .topnewHeights
                                                      ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .bottomnewHeights
                                                      )) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - ${
                                                    detail.quoteData
                                                      .topnewHeights > 0 &&
                                                    detail.quoteData
                                                      .bottomnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .topnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .bottomnewHeights > 0
                                                      ? "14px"
                                                      : "11px"
                                                  })`,
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - 10px)`,
                                                  margin: "4px",
                                                  border: "1px solid #333",
                                                  position: "relative",
                                                }}
                                              >
                                                <img
                                                  src={Fan}
                                                  style={{
                                                    float: "left",
                                                    width:
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) *
                                                        screen +
                                                      "px",
                                                    marginLeft: "4px",
                                                    marginTop: "4px",
                                                  }}
                                                />
                                                <div
                                                  style={{
                                                    float: "left",
                                                    height: `calc(${
                                                      ((parseFloat(
                                                        detail.quoteData
                                                          .boxHeight
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights
                                                        )) *
                                                        screen) /
                                                      detail.quoteData.mCalc
                                                    }px - ${
                                                      detail.quoteData
                                                        .topnewHeights > 0
                                                        ? "28px"
                                                        : "24px"
                                                    })`,
                                                    width: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 26px)`,
                                                    margin: "5px",
                                                    border: "1px solid #333",
                                                    backgroundImage: `repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`,
                                                    backgroundSize: "150% auto",
                                                    backgroundRepeat: "repeat",
                                                  }}
                                                ></div>
                                                <div
                                                  style={{
                                                    position: "relative",
                                                    float: "left",
                                                    height: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxHeight /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 30px)`,
                                                    width: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) * screen
                                                    }px - 0px)`,
                                                    margin: "4px",
                                                    marginTop: `calc(-${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxHeight /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px + 25px)`,
                                                    border: "1px solid #333",
                                                    background: "lightblue",
                                                  }}
                                                >
                                                  {/* fixed plus  */}
                                                  <div
                                                    style={{
                                                      position: "absolute",
                                                      top: "50%",
                                                      left: "50%",
                                                      transform:
                                                        "translate(-50%, -50%)",
                                                      fontSize: "30px",
                                                      fontWeight: "200",
                                                      cursor: "pointer",
                                                      color: "#000",
                                                      zIndex: 1,
                                                    }}
                                                  >
                                                    +
                                                  </div>
                                                </div>
                                              </div>
                                            )}

                                          {detail.quoteData.fanTop ===
                                            "Bottom" &&
                                            detail.quoteData.fanLeft ===
                                              "Left" &&
                                            detail.quoteData.divider ===
                                              "Vertical" &&
                                            detail.quoteData.switchs ===
                                              "on" && (
                                              <div
                                                style={{
                                                  float: "left",
                                                  height: `calc(${
                                                    ((parseFloat(
                                                      detail.quoteData.boxHeight
                                                    ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .topnewHeights
                                                      ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .bottomnewHeights
                                                      )) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - ${
                                                    detail.quoteData
                                                      .topnewHeights > 0 &&
                                                    detail.quoteData
                                                      .bottomnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .topnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .bottomnewHeights > 0
                                                      ? "14px"
                                                      : "11px"
                                                  })`,
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - 10px)`,
                                                  margin: "4px",
                                                  border: "1px solid #333",
                                                }}
                                              >
                                                <div
                                                  style={{
                                                    position: "relative",
                                                    float: "left",
                                                    height: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxHeight /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 30px)`,
                                                    width: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) * screen
                                                    }px - 0px)`,
                                                    margin: "4px",
                                                    marginTop: "5px",
                                                    border: "1px solid #333",
                                                    background: "lightblue",
                                                  }}
                                                >
                                                  {/* fixed plus  */}
                                                  <div
                                                    style={{
                                                      position: "absolute",
                                                      top: "50%",
                                                      left: "50%",
                                                      transform:
                                                        "translate(-50%, -50%)",
                                                      fontSize: "30px",
                                                      fontWeight: "200",
                                                      cursor: "pointer",
                                                      color: "#000",
                                                      zIndex: 1,
                                                    }}
                                                  >
                                                    +
                                                  </div>
                                                </div>

                                                <div
                                                  style={{
                                                    float: "right",
                                                    height: `calc(${
                                                      ((parseFloat(
                                                        detail.quoteData
                                                          .boxHeight
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights
                                                        )) *
                                                        screen) /
                                                      detail.quoteData.mCalc
                                                    }px - ${
                                                      detail.quoteData
                                                        .topnewHeights > 0
                                                        ? "28px"
                                                        : "24px"
                                                    })`,
                                                    width: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 26px)`,
                                                    margin: "4px",
                                                    marginTop: `calc(-${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxHeight /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px + 25px)`,
                                                    border: "1px solid #333",
                                                    backgroundImage: `repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`,
                                                    backgroundSize: "150% auto",
                                                    backgroundRepeat: "repeat",
                                                  }}
                                                ></div>

                                                <img
                                                  src={Fan}
                                                  style={{
                                                    float: "left",
                                                    width:
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) *
                                                        screen +
                                                      "px",
                                                    marginLeft: "4px",
                                                    marginBottom: "4px",
                                                  }}
                                                />
                                              </div>
                                            )}

                                          {detail.quoteData.fanTop === "Top" &&
                                            detail.quoteData.fanLeft ===
                                              "Right" &&
                                            detail.quoteData.divider ===
                                              "Vertical" &&
                                            detail.quoteData.switchs ===
                                              "on" && (
                                              <div
                                                style={{
                                                  float: "left",
                                                  height: `calc(${
                                                    ((parseFloat(
                                                      detail.quoteData.boxHeight
                                                    ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .topnewHeights
                                                      ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .bottomnewHeights
                                                      )) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - ${
                                                    detail.quoteData
                                                      .topnewHeights > 0 &&
                                                    detail.quoteData
                                                      .bottomnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .topnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .bottomnewHeights > 0
                                                      ? "14px"
                                                      : "11px"
                                                  })`,
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - 10px)`,
                                                  margin: "4px",
                                                  border: "1px solid #333",
                                                }}
                                              >
                                                <img
                                                  src={Fan}
                                                  style={{
                                                    float: "right",
                                                    width:
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) *
                                                        screen +
                                                      "px",
                                                    marginRight: "4px",
                                                    marginTop: "4px",
                                                  }}
                                                />
                                                <div
                                                  style={{
                                                    float: "left",
                                                    height: `calc(${
                                                      ((parseFloat(
                                                        detail.quoteData
                                                          .boxHeight
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights
                                                        )) *
                                                        screen) /
                                                      detail.quoteData.mCalc
                                                    }px - ${
                                                      detail.quoteData
                                                        .topnewHeights > 0
                                                        ? "28px"
                                                        : "24px"
                                                    })`,
                                                    width: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px  - 26px)`,
                                                    margin: "5px",
                                                    border: "1px solid #333",
                                                    backgroundImage: `repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`,
                                                    backgroundSize: "150% auto",
                                                    backgroundRepeat: "repeat",
                                                  }}
                                                ></div>
                                                <div
                                                  style={{
                                                    position: "relative",
                                                    float: "right",
                                                    height: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxHeight /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 30px)`,
                                                    width: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) * screen
                                                    }px - 0px)`,
                                                    margin: "4px",
                                                    marginTop: `calc(-${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxHeight /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px + 25px)`,
                                                    border: "1px solid #333",
                                                    background: "lightblue",
                                                  }}
                                                >
                                                  <div
                                                    style={{
                                                      position: "absolute",
                                                      top: "50%",
                                                      left: "50%",
                                                      transform:
                                                        "translate(-50%, -50%)",
                                                      fontSize: "30px",
                                                      fontWeight: "200",
                                                      cursor: "pointer",
                                                      color: "#000",
                                                      zIndex: 1,
                                                    }}
                                                  >
                                                    +
                                                  </div>
                                                </div>
                                              </div>
                                            )}

                                          {detail.quoteData.fanTop ===
                                            "Bottom" &&
                                            detail.quoteData.fanLeft ===
                                              "Right" &&
                                            detail.quoteData.divider ===
                                              "Vertical" &&
                                            detail.quoteData.switchs ===
                                              "on" && (
                                              <div
                                                style={{
                                                  float: "left",
                                                  height: `calc(${
                                                    ((parseFloat(
                                                      detail.quoteData.boxHeight
                                                    ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .topnewHeights
                                                      ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .bottomnewHeights
                                                      )) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - ${
                                                    detail.quoteData
                                                      .topnewHeights > 0 &&
                                                    detail.quoteData
                                                      .bottomnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .topnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .bottomnewHeights > 0
                                                      ? "14px"
                                                      : "11px"
                                                  })`,
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - 10px)`,
                                                  margin: "4px",
                                                  border: "1px solid #333",
                                                }}
                                              >
                                                <div
                                                  style={{
                                                    position: "relative",
                                                    float: "right",
                                                    height: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxHeight /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 30px)`,
                                                    width: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) * screen
                                                    }px - 0px)`,
                                                    margin: "4px",
                                                    marginTop: "5px",
                                                    border: "1px solid #333",
                                                    background: "lightblue",
                                                  }}
                                                >
                                                  {/* fixed plus  */}
                                                  <div
                                                    style={{
                                                      position: "absolute",
                                                      top: "50%",
                                                      left: "50%",
                                                      transform:
                                                        "translate(-50%, -50%)",
                                                      fontSize: "30px",
                                                      fontWeight: "200",
                                                      cursor: "pointer",
                                                      color: "#000",
                                                      zIndex: 1,
                                                    }}
                                                  >
                                                    +
                                                  </div>
                                                </div>
                                                <div
                                                  style={{
                                                    float: "left",
                                                    height: `calc(${
                                                      ((parseFloat(
                                                        detail.quoteData
                                                          .boxHeight
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights
                                                        )) *
                                                        screen) /
                                                      detail.quoteData.mCalc
                                                    }px - ${
                                                      detail.quoteData
                                                        .topnewHeights > 0
                                                        ? "28px"
                                                        : "24px"
                                                    })`,
                                                    width: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 26px)`,
                                                    margin: "5px",
                                                    marginTop: `calc(-${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxHeight /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px + 25px)`,
                                                    border: "1px solid #333",
                                                    backgroundImage: `repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`,
                                                    backgroundSize: "150% auto",
                                                    backgroundRepeat: "repeat",
                                                  }}
                                                ></div>
                                                <img
                                                  src={Fan}
                                                  style={{
                                                    float: "right",
                                                    width:
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) *
                                                        screen +
                                                      "px",
                                                    marginRight: "4px",
                                                    marginBottom: "4px",
                                                  }}
                                                />
                                              </div>
                                            )}

                                          {detail.quoteData.fanTop === "Top" &&
                                            detail.quoteData.fanLeft ===
                                              "Left" &&
                                            detail.quoteData.divider ===
                                              "Vertical" &&
                                            detail.quoteData.switchs ===
                                              "off" && (
                                              <div
                                                style={{
                                                  float: "left",
                                                  height: `calc(${
                                                    ((parseFloat(
                                                      detail.quoteData.boxHeight
                                                    ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .topnewHeights
                                                      ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .bottomnewHeights
                                                      )) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - ${
                                                    detail.quoteData
                                                      .topnewHeights > 0 &&
                                                    detail.quoteData
                                                      .bottomnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .topnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .bottomnewHeights > 0
                                                      ? "14px"
                                                      : "11px"
                                                  })`,
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - 10px)`,
                                                  margin: "4px",
                                                  border: "1px solid #333",
                                                }}
                                              >
                                                <img
                                                  src={Fan}
                                                  style={{
                                                    float: "left",
                                                    width:
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) *
                                                        screen +
                                                      "px",
                                                    marginLeft: "4px",
                                                    marginTop: "4px",
                                                  }}
                                                />
                                                <div
                                                  style={{
                                                    float: "left",
                                                    height: `calc(${
                                                      ((parseFloat(
                                                        detail.quoteData
                                                          .boxHeight
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights
                                                        )) *
                                                        screen) /
                                                      detail.quoteData.mCalc
                                                    }px - ${
                                                      detail.quoteData
                                                        .topnewHeights > 0
                                                        ? "28px"
                                                        : "24px"
                                                    })`,
                                                    width: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 26px)`,
                                                    margin: "5px",
                                                    border: "1px solid #333",
                                                    background: "lightblue",
                                                  }}
                                                >
                                                  {/* fixed plus  */}
                                                  <div
                                                    style={{
                                                      position: "absolute",
                                                      top: "50%",
                                                      left: "70%",
                                                      transform:
                                                        "translate(-50%, -50%)",
                                                      fontSize: "30px",
                                                      fontWeight: "200",
                                                      cursor: "pointer",
                                                      color: "#000",
                                                      zIndex: 1,
                                                    }}
                                                  >
                                                    +
                                                  </div>
                                                </div>
                                                <div
                                                  style={{
                                                    position: "relative",
                                                    float: "left",
                                                    height: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxHeight /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 30px)`,
                                                    width: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) * screen
                                                    }px - 0px)`,
                                                    margin: "4px",
                                                    marginTop: `calc(-${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxHeight /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px  + 25px)`,
                                                    border: "1px solid #333",
                                                    backgroundImage: `repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`,
                                                    backgroundSize: "150% auto",
                                                    backgroundRepeat: "repeat",
                                                  }}
                                                ></div>
                                              </div>
                                            )}

                                          {detail.quoteData.fanTop ===
                                            "Bottom" &&
                                            detail.quoteData.fanLeft ===
                                              "Left" &&
                                            detail.quoteData.divider ===
                                              "Vertical" &&
                                            detail.quoteData.switchs ===
                                              "off" && (
                                              <div
                                                style={{
                                                  float: "left",
                                                  height: `calc(${
                                                    ((parseFloat(
                                                      detail.quoteData.boxHeight
                                                    ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .topnewHeights
                                                      ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .bottomnewHeights
                                                      )) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - ${
                                                    detail.quoteData
                                                      .topnewHeights > 0 &&
                                                    detail.quoteData
                                                      .bottomnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .topnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .bottomnewHeights > 0
                                                      ? "14px"
                                                      : "11px"
                                                  })`,
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - 10px)`,
                                                  margin: "4px",
                                                  border: "1px solid #333",
                                                }}
                                              >
                                                <div
                                                  style={{
                                                    position: "relative",
                                                    float: "left",
                                                    height: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxHeight /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 30px)`,
                                                    width: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) * screen
                                                    }px - 0px)`,
                                                    margin: "4px",
                                                    marginTop: "5px",
                                                    border: "1px solid #333",
                                                    backgroundImage: `repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`,
                                                    backgroundSize: "150% auto",
                                                    backgroundRepeat: "repeat",
                                                  }}
                                                ></div>
                                                <div
                                                  style={{
                                                    float: "right",
                                                    height: `calc(${
                                                      ((parseFloat(
                                                        detail.quoteData
                                                          .boxHeight
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights
                                                        )) *
                                                        screen) /
                                                      detail.quoteData.mCalc
                                                    }px - ${
                                                      detail.quoteData
                                                        .topnewHeights > 0
                                                        ? "28px"
                                                        : "24px"
                                                    })`,
                                                    width: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 26px)`,
                                                    margin: "5px",
                                                    marginTop: `calc(-${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxHeight /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px + 25px)`,
                                                    border: "1px solid #333",
                                                    background: "lightblue",
                                                  }}
                                                >
                                                  {/* fixed plus  */}
                                                  <div
                                                    style={{
                                                      position: "absolute",
                                                      top: "50%",
                                                      left: "70%",
                                                      transform:
                                                        "translate(-50%, -50%)",
                                                      fontSize: "30px",
                                                      fontWeight: "200",
                                                      cursor: "pointer",
                                                      color: "#000",
                                                      zIndex: 1,
                                                    }}
                                                  >
                                                    +
                                                  </div>
                                                </div>
                                                <img
                                                  src={Fan}
                                                  style={{
                                                    float: "left",
                                                    width:
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) *
                                                        screen +
                                                      "px",
                                                    marginLeft: "4px",
                                                    marginBottom: "4px",
                                                  }}
                                                />
                                              </div>
                                            )}

                                          {detail.quoteData.fanTop === "Top" &&
                                            detail.quoteData.fanLeft ===
                                              "Right" &&
                                            detail.quoteData.divider ===
                                              "Vertical" &&
                                            detail.quoteData.switchs ===
                                              "off" && (
                                              <div
                                                style={{
                                                  float: "left",
                                                  height: `calc(${
                                                    ((parseFloat(
                                                      detail.quoteData.boxHeight
                                                    ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .topnewHeights
                                                      ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .bottomnewHeights
                                                      )) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - ${
                                                    detail.quoteData
                                                      .topnewHeights > 0 &&
                                                    detail.quoteData
                                                      .bottomnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .topnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .bottomnewHeights > 0
                                                      ? "14px"
                                                      : "11px"
                                                  })`,
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - 10px)`,
                                                  margin: "4px",
                                                  border: "1px solid #333",
                                                }}
                                              >
                                                <img
                                                  src={Fan}
                                                  style={{
                                                    float: "right",
                                                    width:
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) *
                                                        screen +
                                                      "px",
                                                    marginRight: "4px",
                                                    marginTop: "4px",
                                                  }}
                                                />
                                                <div
                                                  style={{
                                                    float: "left",
                                                    height: `calc(${
                                                      ((parseFloat(
                                                        detail.quoteData
                                                          .boxHeight
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights
                                                        )) *
                                                        screen) /
                                                      detail.quoteData.mCalc
                                                    }px - ${
                                                      detail.quoteData
                                                        .topnewHeights > 0
                                                        ? "28px"
                                                        : "24px"
                                                    })`,
                                                    width: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 26px)`,
                                                    margin: "5px",
                                                    border: "1px solid #333",
                                                    background: "lightblue",
                                                  }}
                                                >
                                                  {/* fixed plus  */}
                                                  <div
                                                    style={{
                                                      position: "absolute",
                                                      top: "50%",
                                                      left: "30%",
                                                      transform:
                                                        "translate(-50%, -50%)",
                                                      fontSize: "30px",
                                                      fontWeight: "200",
                                                      cursor: "pointer",
                                                      color: "#000",
                                                      zIndex: 1,
                                                    }}
                                                  >
                                                    +
                                                  </div>
                                                </div>
                                                <div
                                                  style={{
                                                    position: "relative",
                                                    float: "right",
                                                    height: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxHeight /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 30px)`,
                                                    width: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) * screen
                                                    }px - 0px)`,
                                                    margin: "4px",
                                                    marginTop: `calc(-${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxHeight /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px + 25px)`,
                                                    border: "1px solid #333",
                                                    backgroundImage: `repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`,
                                                    backgroundSize: "150% auto",
                                                    backgroundRepeat: "repeat",
                                                  }}
                                                ></div>
                                              </div>
                                            )}

                                          {detail.quoteData.fanTop ===
                                            "Bottom" &&
                                            detail.quoteData.fanLeft ===
                                              "Right" &&
                                            detail.quoteData.divider ===
                                              "Vertical" &&
                                            detail.quoteData.switchs ===
                                              "off" && (
                                              <div
                                                style={{
                                                  float: "left",
                                                  height: `calc(${
                                                    ((parseFloat(
                                                      detail.quoteData.boxHeight
                                                    ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .topnewHeights
                                                      ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .bottomnewHeights
                                                      )) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - ${
                                                    detail.quoteData
                                                      .topnewHeights > 0 &&
                                                    detail.quoteData
                                                      .bottomnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .topnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .bottomnewHeights > 0
                                                      ? "14px"
                                                      : "11px"
                                                  })`,
                                                  margin: "4px",
                                                  border: "1px solid #333",
                                                }}
                                              >
                                                <div
                                                  style={{
                                                    position: "relative",
                                                    float: "right",
                                                    height: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxHeight /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 30px)`,
                                                    width: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) * screen
                                                    }px - 0px)`,
                                                    margin: "4px",
                                                    marginTop: "5px",
                                                    border: "1px solid #333",
                                                    backgroundImage: `repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`,
                                                    backgroundSize: "150% auto",
                                                    backgroundRepeat: "repeat",
                                                  }}
                                                ></div>
                                                <div
                                                  style={{
                                                    float: "left",
                                                    height: `calc(${
                                                      ((parseFloat(
                                                        detail.quoteData
                                                          .boxHeight
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights
                                                        )) *
                                                        screen) /
                                                      detail.quoteData.mCalc
                                                    }px - ${
                                                      detail.quoteData
                                                        .topnewHeights > 0
                                                        ? "28px"
                                                        : "24px"
                                                    })`,
                                                    width: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 26px)`,
                                                    margin: "5px",
                                                    marginTop: `calc(-${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxHeight /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px + 25px)`,
                                                    border: "1px solid #333",
                                                    background: "lightblue",
                                                  }}
                                                >
                                                  {/* fixed plus  */}
                                                  <div
                                                    style={{
                                                      position: "absolute",
                                                      top: "50%",
                                                      left: "30%",
                                                      transform:
                                                        "translate(-50%, -50%)",
                                                      fontSize: "30px",
                                                      fontWeight: "200",
                                                      cursor: "pointer",
                                                      color: "#000",
                                                      zIndex: 1,
                                                    }}
                                                  >
                                                    +
                                                  </div>
                                                </div>
                                                <img
                                                  src={Fan}
                                                  style={{
                                                    float: "right",
                                                    width:
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) *
                                                        screen +
                                                      "px",
                                                    marginRight: "4px",
                                                    marginBottom: "4px",
                                                  }}
                                                />
                                              </div>
                                            )}

                                          {detail.quoteData.fanTop === "Top" &&
                                            detail.quoteData.fanLeft ===
                                              "Left" &&
                                            detail.quoteData.divider ===
                                              "Horizontal" &&
                                            detail.quoteData.switchs ===
                                              "on" && (
                                              <div
                                                style={{
                                                  float: "left",
                                                  height: `calc(${
                                                    ((parseFloat(
                                                      detail.quoteData.boxHeight
                                                    ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .topnewHeights
                                                      ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .bottomnewHeights
                                                      )) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - ${
                                                    detail.quoteData
                                                      .topnewHeights > 0 &&
                                                    detail.quoteData
                                                      .bottomnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .topnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .bottomnewHeights > 0
                                                      ? "14px"
                                                      : "11px"
                                                  })`,
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - 10px)`,
                                                  margin: "4px",
                                                  border: "1px solid #333",
                                                }}
                                              >
                                                <img
                                                  src={Fan}
                                                  style={{
                                                    float: "left",
                                                    width:
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) *
                                                        screen +
                                                      "px",
                                                    marginLeft: "4px",
                                                    marginTop: "4px",
                                                  }}
                                                />
                                                <div
                                                  style={{
                                                    float: "right",
                                                    height: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) * screen
                                                    }px - 0px)`,
                                                    width: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 26px)`,
                                                    margin: "5px",
                                                    border: "1px solid #333",
                                                    backgroundImage: `repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`,
                                                    backgroundSize: "150% auto",
                                                    backgroundRepeat: "repeat",
                                                  }}
                                                ></div>
                                                <div
                                                  style={{
                                                    position: "relative",
                                                    float: "left",
                                                    height: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxHeight /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 30px)`,
                                                    width: `calc(${
                                                      (detail.quoteData
                                                        .boxWidth *
                                                        screen) /
                                                      detail.quoteData.mCalc
                                                    }px - 20px)`,
                                                    margin: "4px",
                                                    marginTop: "0px",
                                                    border: "1px solid #333",
                                                    background: "lightblue",
                                                  }}
                                                >
                                                  {/* fixed plus  */}
                                                  <div
                                                    style={{
                                                      position: "absolute",
                                                      top: "70%",
                                                      left: "50%",
                                                      transform:
                                                        "translate(-50%, -50%)",
                                                      fontSize: "30px",
                                                      fontWeight: "200",
                                                      cursor: "pointer",
                                                      color: "#000",
                                                      zIndex: 1,
                                                    }}
                                                  >
                                                    +
                                                  </div>
                                                </div>
                                              </div>
                                            )}

                                          {detail.quoteData.fanTop ===
                                            "Bottom" &&
                                            detail.quoteData.fanLeft ===
                                              "Left" &&
                                            detail.quoteData.divider ===
                                              "Horizontal" &&
                                            detail.quoteData.switchs ===
                                              "on" && (
                                              <div
                                                style={{
                                                  float: "left",
                                                  height: `calc(${
                                                    ((parseFloat(
                                                      detail.quoteData.boxHeight
                                                    ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .topnewHeights
                                                      ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .bottomnewHeights
                                                      )) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - ${
                                                    detail.quoteData
                                                      .topnewHeights > 0 &&
                                                    detail.quoteData
                                                      .bottomnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .topnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .bottomnewHeights > 0
                                                      ? "14px"
                                                      : "11px"
                                                  })`,
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - 10px)`,
                                                  margin: "4px",
                                                  border: "1px solid #333",
                                                }}
                                              >
                                                <div
                                                  style={{
                                                    position: "relative",
                                                    float: "left",
                                                    height: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxHeight /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 30px)`,
                                                    width: `calc(${
                                                      (detail.quoteData
                                                        .boxWidth *
                                                        screen) /
                                                      detail.quoteData.mCalc
                                                    }px - 20px)`,
                                                    margin: "4px",
                                                    marginTop: "5px",
                                                    border: "1px solid #333",
                                                    background: "lightblue",
                                                  }}
                                                >
                                                  {/* fixed plus  */}
                                                  <div
                                                    style={{
                                                      position: "absolute",
                                                      top: "50%",
                                                      left: "50%",
                                                      transform:
                                                        "translate(-50%, -50%)",
                                                      fontSize: "30px",
                                                      fontWeight: "200",
                                                      cursor: "pointer",
                                                      color: "#000",
                                                      zIndex: 1,
                                                    }}
                                                  >
                                                    +
                                                  </div>
                                                </div>
                                                <div
                                                  style={{
                                                    float: "right",
                                                    height: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) * screen
                                                    }px - 0px)`,
                                                    width: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 26px)`,
                                                    marginRight: "5px",
                                                    marginBottom: "4px",
                                                    border: "1px solid #333",
                                                    backgroundImage: `repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`,
                                                    backgroundSize: "150% auto",
                                                    backgroundRepeat: "repeat",
                                                  }}
                                                ></div>
                                                <img
                                                  src={Fan}
                                                  style={{
                                                    float: "left",
                                                    width:
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) *
                                                        screen +
                                                      "px",
                                                    marginLeft: "4px",
                                                    marginBottom: "4px",
                                                  }}
                                                />
                                              </div>
                                            )}

                                          {detail.quoteData.fanTop === "Top" &&
                                            detail.quoteData.fanLeft ===
                                              "Right" &&
                                            detail.quoteData.divider ===
                                              "Horizontal" &&
                                            detail.quoteData.switchs ===
                                              "on" && (
                                              <div
                                                style={{
                                                  float: "left",
                                                  height: `calc(${
                                                    ((parseFloat(
                                                      detail.quoteData.boxHeight
                                                    ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .topnewHeights
                                                      ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .bottomnewHeights
                                                      )) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - ${
                                                    detail.quoteData
                                                      .topnewHeights > 0 &&
                                                    detail.quoteData
                                                      .bottomnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .topnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .bottomnewHeights > 0
                                                      ? "14px"
                                                      : "11px"
                                                  })`,
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - 10px)`,
                                                  margin: "4px",
                                                  border: "1px solid #333",
                                                }}
                                              >
                                                <img
                                                  src={Fan}
                                                  style={{
                                                    float: "right",
                                                    width:
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) *
                                                        screen +
                                                      "px",
                                                    marginRight: "4px",
                                                    marginTop: "4px",
                                                  }}
                                                />
                                                <div
                                                  style={{
                                                    float: "left",
                                                    height: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) * screen
                                                    }px - 0px)`,
                                                    width: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 26px)`,
                                                    margin: "5px",
                                                    border: "1px solid #333",
                                                    backgroundImage: `repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`,
                                                    backgroundSize: "150% auto",
                                                    backgroundRepeat: "repeat",
                                                  }}
                                                ></div>
                                                <div
                                                  style={{
                                                    float: "left",
                                                    height: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxHeight /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 30px)`,
                                                    width: `calc(${
                                                      (detail.quoteData
                                                        .boxWidth *
                                                        screen) /
                                                      detail.quoteData.mCalc
                                                    }px - 20px)`,
                                                    margin: "4px",
                                                    marginTop: "0px",
                                                    border: "1px solid #333",
                                                    background: "lightblue",
                                                  }}
                                                >
                                                  {/* fixed plus  */}
                                                  <div
                                                    style={{
                                                      position: "absolute",
                                                      top: "70%",
                                                      left: "50%",
                                                      transform:
                                                        "translate(-50%, -50%)",
                                                      fontSize: "30px",
                                                      fontWeight: "200",
                                                      cursor: "pointer",
                                                      color: "#000",
                                                      zIndex: 1,
                                                    }}
                                                  >
                                                    +
                                                  </div>
                                                </div>
                                              </div>
                                            )}

                                          {detail.quoteData.fanTop ===
                                            "Bottom" &&
                                            detail.quoteData.fanLeft ===
                                              "Right" &&
                                            detail.quoteData.divider ===
                                              "Horizontal" &&
                                            detail.quoteData.switchs ===
                                              "on" && (
                                              <div
                                                style={{
                                                  float: "left",
                                                  height: `calc(${
                                                    ((parseFloat(
                                                      detail.quoteData.boxHeight
                                                    ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .topnewHeights
                                                      ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .bottomnewHeights
                                                      )) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - ${
                                                    detail.quoteData
                                                      .topnewHeights > 0 &&
                                                    detail.quoteData
                                                      .bottomnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .topnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .bottomnewHeights > 0
                                                      ? "14px"
                                                      : "11px"
                                                  })`,
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - 10px)`,
                                                  margin: "4px",
                                                  border: "1px solid #333",
                                                }}
                                              >
                                                <div
                                                  style={{
                                                    position: "relative",
                                                    float: "left",
                                                    height: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxHeight /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 30px)`,
                                                    width: `calc(${
                                                      (detail.quoteData
                                                        .boxWidth *
                                                        screen) /
                                                      detail.quoteData.mCalc
                                                    }px - 20px)`,
                                                    margin: "4px",
                                                    marginTop: "5px",
                                                    border: "1px solid #333",
                                                    background: "lightblue",
                                                  }}
                                                >
                                                  {/* fixed plus  */}
                                                  <div
                                                    style={{
                                                      position: "absolute",
                                                      top: "50%",
                                                      left: "50%",
                                                      transform:
                                                        "translate(-50%, -50%)",
                                                      fontSize: "30px",
                                                      fontWeight: "200",
                                                      cursor: "pointer",
                                                      color: "#000",
                                                      zIndex: 1,
                                                    }}
                                                  >
                                                    +
                                                  </div>
                                                </div>
                                                <div
                                                  style={{
                                                    float: "left",
                                                    height: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) * screen
                                                    }px - 0px)`,
                                                    width: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 26px)`,
                                                    marginLeft: "5px",
                                                    marginBottom: "4px",
                                                    border: "1px solid #333",
                                                    backgroundImage: `repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`,
                                                    backgroundSize: "150% auto",
                                                    backgroundRepeat: "repeat",
                                                  }}
                                                ></div>
                                                <img
                                                  src={Fan}
                                                  style={{
                                                    float: "right",
                                                    width:
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) *
                                                        screen +
                                                      "px",
                                                    marginRight: "4px",
                                                    marginBottom: "4px",
                                                  }}
                                                />
                                              </div>
                                            )}

                                          {detail.quoteData.fanTop === "Top" &&
                                            detail.quoteData.fanLeft ===
                                              "Left" &&
                                            detail.quoteData.divider ===
                                              "Horizontal" &&
                                            detail.quoteData.switchs ===
                                              "off" && (
                                              <div
                                                style={{
                                                  float: "left",
                                                  height: `calc(${
                                                    ((parseFloat(
                                                      detail.quoteData.boxHeight
                                                    ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .topnewHeights
                                                      ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .bottomnewHeights
                                                      )) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - ${
                                                    detail.quoteData
                                                      .topnewHeights > 0 &&
                                                    detail.quoteData
                                                      .bottomnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .topnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .bottomnewHeights > 0
                                                      ? "14px"
                                                      : "11px"
                                                  })`,
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - 10px)`,
                                                  margin: "4px",
                                                  border: "1px solid #333",
                                                }}
                                              >
                                                <img
                                                  src={Fan}
                                                  style={{
                                                    float: "left",
                                                    width:
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) *
                                                        screen +
                                                      "px",
                                                    marginLeft: "4px",
                                                    marginTop: "4px",
                                                  }}
                                                />
                                                <div
                                                  style={{
                                                    float: "right",
                                                    height: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) * screen
                                                    }px - 0px)`,
                                                    width: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 26px)`,
                                                    margin: "5px",
                                                    border: "1px solid #333",
                                                    background: "lightblue",
                                                  }}
                                                >
                                                  {/* fixed plus  */}
                                                  <div
                                                    style={{
                                                      position: "absolute",
                                                      top: "30%",
                                                      left: "70%",
                                                      transform:
                                                        "translate(-50%, -50%)",
                                                      fontSize: "30px",
                                                      fontWeight: "200",
                                                      cursor: "pointer",
                                                      color: "#000",
                                                      zIndex: 1,
                                                    }}
                                                  >
                                                    +
                                                  </div>
                                                </div>
                                                <div
                                                  style={{
                                                    position: "relative",
                                                    float: "left",
                                                    height: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxHeight /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 30px)`,
                                                    width: `calc(${
                                                      (detail.quoteData
                                                        .boxWidth *
                                                        screen) /
                                                      detail.quoteData.mCalc
                                                    }px - 20px)`,
                                                    margin: "4px",
                                                    marginTop: "0px",
                                                    border: "1px solid #333",
                                                    backgroundImage: `repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`,
                                                    backgroundSize: "150% auto",
                                                    backgroundRepeat: "repeat",
                                                  }}
                                                ></div>
                                              </div>
                                            )}

                                          {detail.quoteData.fanTop === "Top" &&
                                            detail.quoteData.fanLeft ===
                                              "Right" &&
                                            detail.quoteData.divider ===
                                              "Horizontal" &&
                                            detail.quoteData.switchs ===
                                              "off" && (
                                              <div
                                                style={{
                                                  float: "left",
                                                  height: `calc(${
                                                    ((parseFloat(
                                                      detail.quoteData.boxHeight
                                                    ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .topnewHeights
                                                      ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .bottomnewHeights
                                                      )) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - ${
                                                    detail.quoteData
                                                      .topnewHeights > 0 &&
                                                    detail.quoteData
                                                      .bottomnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .topnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .bottomnewHeights > 0
                                                      ? "14px"
                                                      : "11px"
                                                  })`,
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - 10px)`,
                                                  margin: "4px",
                                                  border: "1px solid #333",
                                                }}
                                              >
                                                <img
                                                  src={Fan}
                                                  style={{
                                                    float: "right",
                                                    width:
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) *
                                                        screen +
                                                      "px",
                                                    marginRight: "4px",
                                                    marginTop: "4px",
                                                  }}
                                                />
                                                <div
                                                  style={{
                                                    float: "left",
                                                    height: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) * screen
                                                    }px - 0px)`,
                                                    width: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 26px)`,
                                                    margin: "5px",
                                                    border: "1px solid #333",
                                                    background: "lightblue",
                                                  }}
                                                >
                                                  {/* fixed plus  */}
                                                  <div
                                                    style={{
                                                      position: "absolute",
                                                      top: "25%",
                                                      left: "30%",
                                                      transform:
                                                        "translate(-50%, -50%)",
                                                      fontSize: "30px",
                                                      fontWeight: "200",
                                                      cursor: "pointer",
                                                      color: "#000",
                                                      zIndex: 1,
                                                    }}
                                                  >
                                                    +
                                                  </div>
                                                </div>
                                                <div
                                                  style={{
                                                    position: "relative",
                                                    float: "left",
                                                    height: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxHeight /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 30px)`,
                                                    width: `calc(${
                                                      (detail.quoteData
                                                        .boxWidth *
                                                        screen) /
                                                      detail.quoteData.mCalc
                                                    }px - 20px)`,
                                                    margin: "4px",
                                                    marginTop: "0px",
                                                    border: "1px solid #333",
                                                    backgroundImage: `repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`,
                                                    backgroundSize: "150% auto",
                                                    backgroundRepeat: "repeat",
                                                  }}
                                                ></div>
                                              </div>
                                            )}

                                          {detail.quoteData.fanTop ===
                                            "Bottom" &&
                                            detail.quoteData.fanLeft ===
                                              "Right" &&
                                            detail.quoteData.divider ===
                                              "Horizontal" &&
                                            detail.quoteData.switchs ===
                                              "off" && (
                                              <div
                                                style={{
                                                  float: "left",
                                                  height: `calc(${
                                                    ((parseFloat(
                                                      detail.quoteData.boxHeight
                                                    ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .topnewHeights
                                                      ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .bottomnewHeights
                                                      )) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - ${
                                                    detail.quoteData
                                                      .topnewHeights > 0 &&
                                                    detail.quoteData
                                                      .bottomnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .topnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .bottomnewHeights > 0
                                                      ? "14px"
                                                      : "11px"
                                                  })`,
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - 10px)`,
                                                  margin: "4px",
                                                  border: "1px solid #333",
                                                }}
                                              >
                                                <div
                                                  style={{
                                                    position: "relative",
                                                    float: "left",
                                                    height: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxHeight /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 30px)`,
                                                    width: `calc(${
                                                      (detail.quoteData
                                                        .boxWidth *
                                                        screen) /
                                                      detail.quoteData.mCalc
                                                    }px - 20px)`,
                                                    margin: "4px",
                                                    marginTop: "5px",
                                                    border: "1px solid #333",
                                                    backgroundImage: `repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`,
                                                    backgroundSize: "150% auto",
                                                    backgroundRepeat: "repeat",
                                                  }}
                                                ></div>
                                                <img
                                                  src={Fan}
                                                  style={{
                                                    float: "right",
                                                    width:
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) *
                                                        screen +
                                                      "px",
                                                    marginRight: "4px",
                                                    marginTop: "0px",
                                                  }}
                                                />
                                                <div
                                                  style={{
                                                    float: "left",
                                                    height: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) * screen
                                                    }px - 0px)`,
                                                    width: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 26px)`,
                                                    marginLeft: "4px",
                                                    border: "1px solid #333",
                                                    background: "lightblue",
                                                  }}
                                                >
                                                  {/* fixed plus  */}
                                                  <div
                                                    style={{
                                                      position: "absolute",
                                                      top: "70%",
                                                      left: "30%",
                                                      transform:
                                                        "translate(-50%, -50%)",
                                                      fontSize: "30px",
                                                      fontWeight: "200",
                                                      cursor: "pointer",
                                                      color: "#000",
                                                      zIndex: 1,
                                                    }}
                                                  >
                                                    +
                                                  </div>
                                                </div>
                                              </div>
                                            )}

                                          {detail.quoteData.fanTop ===
                                            "Bottom" &&
                                            detail.quoteData.fanLeft ===
                                              "Left" &&
                                            detail.quoteData.divider ===
                                              "Horizontal" &&
                                            detail.quoteData.switchs ===
                                              "off" && (
                                              <div
                                                style={{
                                                  float: "left",
                                                  height: `calc(${
                                                    ((parseFloat(
                                                      detail.quoteData.boxHeight
                                                    ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .topnewHeights
                                                      ) -
                                                      parseFloat(
                                                        detail.quoteData
                                                          .bottomnewHeights
                                                      )) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - ${
                                                    detail.quoteData
                                                      .topnewHeights > 0 &&
                                                    detail.quoteData
                                                      .bottomnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .topnewHeights > 0
                                                      ? "16px"
                                                      : detail.quoteData
                                                          .bottomnewHeights > 0
                                                      ? "14px"
                                                      : "11px"
                                                  })`,
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - 10px)`,
                                                  margin: "4px",
                                                  border: "1px solid #333",
                                                }}
                                              >
                                                <div
                                                  style={{
                                                    float: "left",
                                                    height: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxHeight /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .topnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        parseFloat(
                                                          detail.quoteData
                                                            .bottomnewHeights /
                                                            detail.quoteData
                                                              .mCalc
                                                        ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 30px)`,
                                                    width: `calc(${
                                                      (detail.quoteData
                                                        .boxWidth *
                                                        screen) /
                                                      detail.quoteData.mCalc
                                                    }px - 20px)`,
                                                    margin: "4px",
                                                    marginTop: "5px",
                                                    border: "1px solid #333",
                                                    backgroundImage: `repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`,
                                                    backgroundSize: "150% auto",
                                                    backgroundRepeat: "repeat",
                                                  }}
                                                ></div>
                                                <img
                                                  src={Fan}
                                                  style={{
                                                    float: "left",
                                                    width:
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) *
                                                        screen +
                                                      "px",
                                                    marginLeft: "4px",
                                                    marginRight: "4px",
                                                  }}
                                                />
                                                <div
                                                  style={{
                                                    float: "right",
                                                    height: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth
                                                      ) /
                                                        detail.quoteData.mCalc >
                                                      1.25
                                                        ? 0.85
                                                        : 0.55) * screen
                                                    }px - 0px)`,
                                                    width: `calc(${
                                                      (parseFloat(
                                                        detail.quoteData
                                                          .boxWidth /
                                                          detail.quoteData.mCalc
                                                      ) -
                                                        (parseFloat(
                                                          detail.quoteData
                                                            .boxWidth
                                                        ) /
                                                          detail.quoteData
                                                            .mCalc >
                                                        1.25
                                                          ? 0.85
                                                          : 0.55)) *
                                                      screen
                                                    }px - 26px)`,
                                                    marginRight: "5px",
                                                    border: "1px solid #333",
                                                    background: "lightblue",
                                                  }}
                                                >
                                                  {/* fixed plus  */}
                                                  <div
                                                    style={{
                                                      position: "absolute",
                                                      top: "65%",
                                                      left: "65%",
                                                      transform:
                                                        "translate(-50%, -50%)",
                                                      fontSize: "30px",
                                                      fontWeight: "200",
                                                      cursor: "pointer",
                                                      color: "#000",
                                                      zIndex: 1,
                                                    }}
                                                  >
                                                    +
                                                  </div>
                                                </div>
                                              </div>
                                            )}

                                          {detail.quoteData.bottomnewHeights >
                                            0 && (
                                            <div
                                              style={{
                                                display: "flex",
                                                width: `calc(${
                                                  (detail.quoteData.boxWidth *
                                                    screen) /
                                                    detail.quoteData.mCalc +
                                                  "px"
                                                } - 10px)`,
                                                height: `calc(${
                                                  (detail.quoteData
                                                    .bottomnewHeights *
                                                    screen) /
                                                  detail.quoteData.mCalc
                                                }px )`,
                                                marginTop: "5px",
                                                marginLeft: "4px",
                                              }}
                                            >
                                              {detail.quoteData.bottomsash.map(
                                                (_, index) => (
                                                  <div
                                                    style={{
                                                      flex: 1,
                                                      position: "relative",
                                                      background:
                                                        detail.quoteData
                                                          .bottomsash[index]
                                                          .type === "fixed"
                                                          ? "lightgreen"
                                                          : "lightblue",
                                                      width: `calc(${
                                                        ((detail.quoteData
                                                          .boxWidth /
                                                          detail.quoteData
                                                            .topsash?.length) *
                                                          screen) /
                                                          detail.quoteData
                                                            .mCalc +
                                                        "px"
                                                      } - 14px)`,
                                                      height: `calc(${
                                                        (detail.quoteData
                                                          .bottomnewHeights *
                                                          screen) /
                                                          detail.quoteData
                                                            .mCalc +
                                                        "px"
                                                      } - 0px )`,
                                                      border: "solid 1px #000",
                                                      marginLeft:
                                                        index === 0
                                                          ? "0px"
                                                          : "2px",
                                                    }}
                                                  >
                                                    {detail.quoteData
                                                      .bottomsash[index]
                                                      .type === "shutter" ? (
                                                      <>
                                                        <img
                                                          src={left}
                                                          style={{
                                                            float: "left",
                                                            marginTop: `calc(${
                                                              (detail.quoteData
                                                                .bottomnewHeights *
                                                                screen) /
                                                              detail.quoteData
                                                                .mCalc
                                                            }px - 15px)`,
                                                            marginLeft: "45%",
                                                            width:
                                                              screen === 40
                                                                ? "13px"
                                                                : "8px",
                                                            transform:
                                                              "rotate(-90deg)",
                                                          }}
                                                          alt="Left Handle"
                                                        />
                                                        <div
                                                          style={{
                                                            position:
                                                              "absolute",
                                                            width: "100%",
                                                            height: "100%",
                                                            overflow: "hidden",
                                                          }}
                                                        >
                                                          {/* Left Diagonal Line  */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              top: "0",
                                                              left: "50%",
                                                              width: "2px",
                                                              height: "1000%",
                                                              borderLeft:
                                                                "1px dashed gray",
                                                              transform: `rotate(${
                                                                Math.atan(
                                                                  (detail
                                                                    .quoteData
                                                                    .bottomsash
                                                                    .length > 0
                                                                    ? detail
                                                                        .quoteData
                                                                        .boxWidth /
                                                                      detail
                                                                        .quoteData
                                                                        .bottomsash
                                                                        .length
                                                                    : detail
                                                                        .quoteData
                                                                        .boxWidth) /
                                                                    (2 *
                                                                      detail
                                                                        .quoteData
                                                                        .bottomnewHeights)
                                                                ) *
                                                                (180 / Math.PI)
                                                              }deg)`,
                                                              transformOrigin:
                                                                "top left",
                                                            }}
                                                          ></div>

                                                          {/* Right Diagonal Line */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              top: "0",
                                                              left: "50%",
                                                              width: "2px",
                                                              height: "1000%",
                                                              borderLeft:
                                                                "1px dashed gray",
                                                              transform: `rotate(-${
                                                                Math.atan(
                                                                  (detail
                                                                    .quoteData
                                                                    .bottomsash
                                                                    .length > 0
                                                                    ? detail
                                                                        .quoteData
                                                                        .boxWidth /
                                                                      detail
                                                                        .quoteData
                                                                        .bottomsash
                                                                        .length
                                                                    : detail
                                                                        .quoteData
                                                                        .boxWidth) /
                                                                    (2 *
                                                                      detail
                                                                        .quoteData
                                                                        .bottomnewHeights)
                                                                ) *
                                                                (180 / Math.PI)
                                                              }deg)`,
                                                              transformOrigin:
                                                                "top left",
                                                            }}
                                                          ></div>
                                                        </div>
                                                      </>
                                                    ) : (
                                                      <>
                                                        {/* fixed plus  */}
                                                        <div
                                                          style={{
                                                            position:
                                                              "absolute",
                                                            top: "50%",
                                                            left: "50%",
                                                            transform:
                                                              "translate(-50%, -50%)",
                                                            fontSize: `${
                                                              screen === 20
                                                                ? "15px"
                                                                : "30px"
                                                            }`,
                                                            fontWeight: "200",
                                                            cursor: "pointer",
                                                            color: "#000",
                                                            zIndex: 1,
                                                          }}
                                                        >
                                                          +
                                                        </div>
                                                      </>
                                                    )}
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div
                                          style={{
                                            float: "left",
                                            width:
                                              (detail.quoteData.boxWidth *
                                                screen) /
                                                detail.quoteData.mCalc +
                                              "px",
                                            height:
                                              (detail.quoteData.boxHeight *
                                                screen) /
                                                detail.quoteData.mCalc +
                                              "px",
                                            border: "1px solid #333",
                                            position: "relative",
                                          }}
                                        >
                                          {/* outer corner lines start */}
                                          <div
                                            style={{
                                              position: "absolute",
                                              height: "7px",
                                              width: "1px",
                                              float: "left",
                                              marginTop: "-1.5px",
                                              marginLeft: `calc(${
                                                (detail.quoteData.boxWidth *
                                                  screen) /
                                                detail.quoteData.mCalc
                                              }px - 4px)`,
                                              transform: "rotate(45deg)",
                                              borderRight: "1px solid black",
                                            }}
                                          ></div>
                                          <div
                                            style={{
                                              position: "absolute",
                                              height: "8px",
                                              width: "1px",
                                              float: "left",
                                              marginTop: "-1px",
                                              marginLeft: "3px",
                                              transform: "rotate(-45deg)",
                                              borderLeft: "1px solid black",
                                            }}
                                          ></div>
                                          <div
                                            style={{
                                              position: "absolute",
                                              height: "7px",
                                              width: "1px",
                                              float: "right",
                                              marginTop: `calc(${
                                                (detail.quoteData.boxHeight *
                                                  screen) /
                                                detail.quoteData.mCalc
                                              }px - 8px)`,
                                              marginLeft: `calc(${
                                                (detail.quoteData.boxWidth *
                                                  screen) /
                                                detail.quoteData.mCalc
                                              }px - 4px)`,
                                              transform: "rotate(-45deg)",
                                              borderLeft: "1px solid black",
                                            }}
                                          ></div>
                                          <div
                                            style={{
                                              position: "absolute",
                                              height: "7px",
                                              width: "1px",
                                              float: "left",
                                              marginTop: `calc(${
                                                (detail.quoteData.boxHeight *
                                                  screen) /
                                                detail.quoteData.mCalc
                                              }px - 8px)`,
                                              marginLeft: "1px",
                                              transform: "rotate(45deg)",
                                              borderLeft: "1px solid black",
                                            }}
                                          ></div>
                                          {/* outer corner lines end */}
                                          {detail.quoteData.topnewHeights >
                                            0 && (
                                            <div
                                              style={{
                                                display: "flex",
                                                width: `calc(${
                                                  (detail.quoteData.boxWidth *
                                                    screen) /
                                                    detail.quoteData.mCalc +
                                                  "px"
                                                } - 12px)`,
                                                height: `calc(${
                                                  (detail.quoteData
                                                    .topnewHeights *
                                                    screen) /
                                                  detail.quoteData.mCalc
                                                }px )`,
                                                marginTop: "5px",
                                                marginLeft: "5px",
                                              }}
                                            >
                                              {detail.quoteData.topsash.map(
                                                (_, index) => (
                                                  <div
                                                    style={{
                                                      flex: 1,
                                                      background:
                                                        detail.quoteData
                                                          .topsash[index]
                                                          .type === "fixed"
                                                          ? "lightgreen"
                                                          : "lightblue",
                                                      width: `calc(${
                                                        ((detail.quoteData
                                                          .boxWidth /
                                                          detail.quoteData
                                                            .topsash.length) *
                                                          screen) /
                                                          detail.quoteData
                                                            .mCalc +
                                                        "px"
                                                      } - 28px)`,
                                                      height: `calc(${
                                                        (detail.quoteData
                                                          .topnewHeights *
                                                          screen) /
                                                        detail.quoteData.mCalc
                                                      }px )`,
                                                      border: "solid 1px #000",
                                                      marginLeft:
                                                        index === 0
                                                          ? "0px"
                                                          : "5px",
                                                      position: "relative",
                                                    }}
                                                  >
                                                    {detail.quoteData.topsash[
                                                      index
                                                    ].type === "shutter" ? (
                                                      <>
                                                        <img
                                                          src={left}
                                                          style={{
                                                            float: "left",
                                                            marginTop: `calc(${
                                                              (detail.quoteData
                                                                .topnewHeights *
                                                                screen) /
                                                              detail.quoteData
                                                                .mCalc
                                                            }px - 15px)`,
                                                            marginLeft: "45%",
                                                            width:
                                                              screen === 40
                                                                ? "13px"
                                                                : "8px",
                                                            transform:
                                                              "rotate(-90deg)",
                                                          }}
                                                          alt="Left Handle"
                                                        />
                                                        <div
                                                          style={{
                                                            position:
                                                              "absolute",
                                                            width: "100%",
                                                            height: "100%",
                                                            overflow: "hidden",
                                                          }}
                                                        >
                                                          {/* Left Diagonal Line  */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              top: "0",
                                                              left: "50%",
                                                              width: "2px",
                                                              height: "1000%",
                                                              borderLeft:
                                                                "1px dashed gray",
                                                              transform: `rotate(${
                                                                Math.atan(
                                                                  (detail
                                                                    .quoteData
                                                                    .topsash
                                                                    .length > 0
                                                                    ? detail
                                                                        .quoteData
                                                                        .boxWidth /
                                                                      detail
                                                                        .quoteData
                                                                        .topsash
                                                                        .length
                                                                    : detail
                                                                        .quoteData
                                                                        .boxWidth) /
                                                                    (2 *
                                                                      detail
                                                                        .quoteData
                                                                        .topnewHeights)
                                                                ) *
                                                                (180 / Math.PI)
                                                              }deg)`,
                                                              transformOrigin:
                                                                "top left",
                                                            }}
                                                          ></div>

                                                          {/* Right Diagonal Line */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              top: "0",
                                                              left: "50%",
                                                              width: "2px",
                                                              height: "1000%",
                                                              borderLeft:
                                                                "1px dashed gray",
                                                              transform: `rotate(-${
                                                                Math.atan(
                                                                  (detail
                                                                    .quoteData
                                                                    .topsash
                                                                    .length > 0
                                                                    ? detail
                                                                        .quoteData
                                                                        .boxWidth /
                                                                      detail
                                                                        .quoteData
                                                                        .topsash
                                                                        .length
                                                                    : detail
                                                                        .quoteData
                                                                        .boxWidth) /
                                                                    (2 *
                                                                      detail
                                                                        .quoteData
                                                                        .topnewHeights)
                                                                ) *
                                                                (180 / Math.PI)
                                                              }deg)`,
                                                              transformOrigin:
                                                                "top left",
                                                            }}
                                                          ></div>
                                                        </div>
                                                      </>
                                                    ) : (
                                                      <>
                                                        {/* fixed plus  */}
                                                        <div
                                                          style={{
                                                            position:
                                                              "absolute",
                                                            top: "50%",
                                                            left: "50%",
                                                            transform:
                                                              "translate(-50%, -50%)",
                                                            fontSize: `${
                                                              screen === 20
                                                                ? "15px"
                                                                : "30px"
                                                            }`,
                                                            fontWeight: "200",
                                                            cursor: "pointer",
                                                            color: "#000",
                                                            zIndex: 1,
                                                          }}
                                                        >
                                                          +
                                                        </div>
                                                      </>
                                                    )}
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          )}
                                          {detail.quoteData.switchFixed ===
                                          "on" ? (
                                            <>
                                              <div
                                                style={{
                                                  height: `calc(${
                                                    ((detail.quoteData
                                                      .boxHeight -
                                                      detail.quoteData
                                                        .topnewHeights -
                                                      detail.quoteData
                                                        .bottomnewHeights) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - ${
                                                    detail.quoteData.bottomsash
                                                      .length > 0 &&
                                                    detail.quoteData.bottomsash
                                                      .length > 0
                                                      ? "22px"
                                                      : detail.quoteData
                                                          .topnewHeights > 0
                                                      ? "17px"
                                                      : detail.quoteData
                                                          .bottomsash.length > 0
                                                      ? "17px "
                                                      : "12px"
                                                  })`,
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - 12px)`,
                                                  marginLeft: "5px",
                                                  marginTop: "5px",
                                                  marginBottom:
                                                    detail.quoteData.bottomsash
                                                      .length > 0
                                                      ? "5px"
                                                      : "0px",
                                                  background: "lightblue",
                                                  border: "1px solid #333",
                                                  position: "relative",
                                                }}
                                              >
                                                {/* fixed plus  */}
                                                <div
                                                  style={{
                                                    position: "absolute",
                                                    top: "50%",
                                                    left: "50%",
                                                    transform:
                                                      "translate(-50%, -50%)",
                                                    fontSize: "30px",
                                                    fontWeight: "200",
                                                    cursor: "pointer",
                                                    color: "#000",
                                                    zIndex: 1,
                                                  }}
                                                >
                                                  +
                                                </div>
                                              </div>
                                            </>
                                          ) : (
                                            <>
                                              <div
                                                style={{
                                                  height: `calc(${
                                                    ((detail.quoteData
                                                      .boxHeight -
                                                      detail.quoteData
                                                        .topnewHeights -
                                                      detail.quoteData
                                                        .bottomnewHeights) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - ${
                                                    detail.quoteData.bottomsash
                                                      .length > 0 &&
                                                    detail.quoteData.bottomsash
                                                      .length > 0
                                                      ? "22px"
                                                      : detail.quoteData
                                                          .topnewHeights > 0
                                                      ? "17px"
                                                      : detail.quoteData
                                                          .bottomsash.length > 0
                                                      ? "17px "
                                                      : "12px"
                                                  })`,
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - 12px)`,
                                                  marginLeft: "5px",
                                                  marginTop: "5px",
                                                  marginBottom:
                                                    detail.quoteData.bottomsash
                                                      .length > 0
                                                      ? "5px"
                                                      : "0px",
                                                  backgroundImage: `repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`,
                                                  backgroundSize: "150% auto",
                                                  backgroundRepeat: "repeat",
                                                  border: "1px solid #333",
                                                }}
                                              ></div>
                                            </>
                                          )}
                                          <>
                                            {detail.quoteData.bottomsash
                                              .length > 0 && (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                      detail.quoteData.mCalc +
                                                    "px"
                                                  } - 12px)`,
                                                  height: `calc(${
                                                    (detail.quoteData
                                                      .bottomnewHeights *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px )`,
                                                  marginTop: "5px",
                                                  marginLeft: "5px",
                                                }}
                                              >
                                                {detail.quoteData.bottomsash.map(
                                                  (_, index) => (
                                                    <div
                                                      style={{
                                                        flex: 1,
                                                        background:
                                                          detail.quoteData
                                                            .bottomsash[index]
                                                            .type === "fixed"
                                                            ? "lightgreen"
                                                            : "lightblue",
                                                        width: `calc(${
                                                          ((detail.quoteData
                                                            .boxWidth /
                                                            detail.quoteData
                                                              .topsash.length) *
                                                            screen) /
                                                            detail.quoteData
                                                              .mCalc +
                                                          "px"
                                                        } - 28px)`,
                                                        height: `calc(${
                                                          (detail.quoteData
                                                            .bottomnewHeights *
                                                            screen) /
                                                          detail.quoteData.mCalc
                                                        }px )`,
                                                        border:
                                                          "solid 1px #000",
                                                        marginLeft:
                                                          index === 0
                                                            ? "0px"
                                                            : "5px",
                                                        position: "relative",
                                                      }}
                                                    >
                                                      {detail.quoteData
                                                        .bottomsash[index]
                                                        .type === "shutter" ? (
                                                        <>
                                                          <img
                                                            src={left}
                                                            style={{
                                                              float: "left",
                                                              marginTop: `calc(${
                                                                (detail
                                                                  .quoteData
                                                                  .bottomnewHeights *
                                                                  screen) /
                                                                detail.quoteData
                                                                  .mCalc
                                                              }px - 15px)`,
                                                              marginLeft: "45%",
                                                              width:
                                                                screen === 40
                                                                  ? "13px"
                                                                  : "8px",
                                                              transform:
                                                                "rotate(-90deg)",
                                                            }}
                                                            alt="Left Handle"
                                                          />
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              width: "100%",
                                                              height: "100%",
                                                              overflow:
                                                                "hidden",
                                                            }}
                                                          >
                                                            {/* Left Diagonal Line  */}
                                                            <div
                                                              style={{
                                                                position:
                                                                  "absolute",
                                                                top: "0",
                                                                left: "50%",
                                                                width: "2px",
                                                                height: "1000%",
                                                                borderLeft:
                                                                  "1px dashed gray",
                                                                transform: `rotate(${
                                                                  Math.atan(
                                                                    (detail
                                                                      .quoteData
                                                                      .bottomsash
                                                                      .length >
                                                                    0
                                                                      ? detail
                                                                          .quoteData
                                                                          .boxWidth /
                                                                        detail
                                                                          .quoteData
                                                                          .bottomsash
                                                                          .length
                                                                      : detail
                                                                          .quoteData
                                                                          .boxWidth) /
                                                                      (2 *
                                                                        detail
                                                                          .quoteData
                                                                          .bottomnewHeights)
                                                                  ) *
                                                                  (180 /
                                                                    Math.PI)
                                                                }deg)`,
                                                                transformOrigin:
                                                                  "top left",
                                                              }}
                                                            ></div>

                                                            {/* Right Diagonal Line */}
                                                            <div
                                                              style={{
                                                                position:
                                                                  "absolute",
                                                                top: "0",
                                                                left: "50%",
                                                                width: "2px",
                                                                height: "1000%",
                                                                borderLeft:
                                                                  "1px dashed gray",
                                                                transform: `rotate(-${
                                                                  Math.atan(
                                                                    (detail
                                                                      .quoteData
                                                                      .bottomsash
                                                                      .length >
                                                                    0
                                                                      ? detail
                                                                          .quoteData
                                                                          .boxWidth /
                                                                        detail
                                                                          .quoteData
                                                                          .bottomsash
                                                                          .length
                                                                      : detail
                                                                          .quoteData
                                                                          .boxWidth) /
                                                                      (2 *
                                                                        detail
                                                                          .quoteData
                                                                          .bottomnewHeights)
                                                                  ) *
                                                                  (180 /
                                                                    Math.PI)
                                                                }deg)`,
                                                                transformOrigin:
                                                                  "top left",
                                                              }}
                                                            ></div>
                                                          </div>
                                                        </>
                                                      ) : (
                                                        <>
                                                          {/* fixed plus  */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              top: "50%",
                                                              left: "50%",
                                                              transform:
                                                                "translate(-50%, -50%)",
                                                              fontSize: "30px",
                                                              fontWeight: "200",
                                                              cursor: "pointer",
                                                              color: "#000",
                                                              zIndex: 1,
                                                            }}
                                                          >
                                                            +
                                                          </div>
                                                        </>
                                                      )}
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            )}
                                          </>
                                        </div>
                                      </>
                                    ))}

                                  {detail.quoteData.boxHeight === 1 &&
                                    detail.quoteData.boxWidth > 1 &&
                                    (detail.quoteData.fan === "on" ? (
                                      <>
                                        {detail.quoteData.switchFixed ===
                                          "on" && (
                                          <div
                                            style={{
                                              float: "left",
                                              width:
                                                (detail.quoteData.boxWidth *
                                                  screen) /
                                                  detail.quoteData.mCalc +
                                                "px",
                                              height:
                                                (detail.quoteData.boxHeight *
                                                  screen) /
                                                  detail.quoteData.mCalc +
                                                "px",
                                              border: "1px solid #333",
                                            }}
                                          >
                                            <div
                                              style={{
                                                float: "left",
                                                height: `calc(${
                                                  (detail.quoteData.boxHeight *
                                                    screen) /
                                                  detail.quoteData.mCalc
                                                }px - 10px)`,
                                                width: `calc(${
                                                  (detail.quoteData.boxWidth *
                                                    screen) /
                                                  detail.quoteData.mCalc
                                                }px - 10px)`,
                                                margin: "4px",
                                                border: "1px solid #333",
                                              }}
                                            >
                                              <img
                                                src={Fan}
                                                style={{
                                                  float: "left",
                                                  width: 0.75 * screen + "px",
                                                  margin: "4px",
                                                }}
                                              />
                                              <div
                                                style={{
                                                  float: "right",
                                                  height: `calc(${
                                                    (detail.quoteData
                                                      .boxHeight *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - 22px)`,
                                                  width: `calc(${
                                                    ((detail.quoteData
                                                      .boxWidth -
                                                      0.94) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - 10px)`,
                                                  marginRight: "5px",
                                                  marginTop: "5px",
                                                  background: "lightblue",
                                                  border: "1px solid #333",
                                                }}
                                              ></div>
                                            </div>
                                          </div>
                                        )}

                                        {detail.quoteData.switchFixed ===
                                          "off" && (
                                          <div
                                            style={{
                                              float: "left",
                                              width:
                                                (detail.quoteData.boxWidth *
                                                  screen) /
                                                  detail.quoteData.mCalc +
                                                "px",
                                              height:
                                                (detail.quoteData.boxHeight *
                                                  screen) /
                                                  detail.quoteData.mCalc +
                                                "px",
                                              border: "1px solid #333",
                                            }}
                                          >
                                            <div
                                              style={{
                                                float: "left",
                                                height: `calc(${
                                                  (detail.quoteData.boxHeight *
                                                    screen) /
                                                  detail.quoteData.mCalc
                                                }px - 10px)`,
                                                width: `calc(${
                                                  (detail.quoteData.boxWidth *
                                                    screen) /
                                                  detail.quoteData.mCalc
                                                }px - 10px)`,
                                                margin: "4px",
                                                border: "1px solid #333",
                                              }}
                                            >
                                              <img
                                                src={Fan}
                                                style={{
                                                  float: "left",
                                                  width:
                                                    (0.75 * screen) /
                                                      detail.quoteData.mCalc +
                                                    "px",
                                                  margin: "4px",
                                                }}
                                              />
                                              <div
                                                style={{
                                                  float: "right",
                                                  height: `calc(${
                                                    (detail.quoteData
                                                      .boxHeight *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - 22px)`,
                                                  width: `calc(${
                                                    ((detail.quoteData
                                                      .boxWidth -
                                                      0.94) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - 10px)`,
                                                  marginRight: "5px",
                                                  marginTop: "5px",
                                                  backgroundImage: `repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`,
                                                  backgroundSize: "150% auto",
                                                  backgroundRepeat: "repeat",
                                                  border: "1px solid #333",
                                                }}
                                              ></div>
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    ) : (
                                      <div
                                        style={{
                                          float: "left",
                                          width:
                                            (detail.quoteData.boxWidth *
                                              screen) /
                                              detail.quoteData.mCalc +
                                            "px",
                                          height:
                                            (detail.quoteData.boxHeight *
                                              screen) /
                                              detail.quoteData.mCalc +
                                            "px",
                                          border: "1px solid #333",
                                        }}
                                      >
                                        {detail.quoteData.switchFixed ===
                                        "off" ? (
                                          <div
                                            style={{
                                              float: "right",
                                              height: `calc(${
                                                detail.quoteData.boxHeight *
                                                screen
                                              }px - 12px)`,
                                              width: `calc(${
                                                (detail.quoteData.boxWidth *
                                                  screen) /
                                                detail.quoteData.mCalc
                                              }px - 10px)`,
                                              marginRight: "5px",
                                              marginTop: "5px",
                                              backgroundImage: `repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`,
                                              backgroundSize: "150% auto",
                                              backgroundRepeat: "repeat",
                                              border: "1px solid #333",
                                            }}
                                          ></div>
                                        ) : (
                                          <div
                                            style={{
                                              float: "right",
                                              height: `calc(${
                                                detail.quoteData.boxHeight *
                                                screen
                                              }px - 12px)`,
                                              width: `calc(${
                                                (detail.quoteData.boxWidth *
                                                  screen) /
                                                detail.quoteData.mCalc
                                              }px - 10px)`,
                                              marginRight: "5px",
                                              marginTop: "5px",
                                              background: "lightblue",
                                              border: "1px solid #333",
                                            }}
                                          ></div>
                                        )}
                                      </div>
                                    ))}

                                  {detail.quoteData.boxHeight >= 1 &&
                                    detail.quoteData.boxWidth === 1 &&
                                    (detail.quoteData.fan === "on" ? (
                                      <>
                                        {detail.quoteData.switchFixed ===
                                          "on" && (
                                          <div
                                            style={{
                                              float: "left",
                                              width:
                                                (detail.quoteData.boxWidth *
                                                  screen) /
                                                  detail.quoteData.mCalc +
                                                "px",
                                              height:
                                                (detail.quoteData.boxHeight *
                                                  screen) /
                                                  detail.quoteData.mCalc +
                                                "px",
                                              border: "1px solid #333",
                                            }}
                                          >
                                            <div
                                              style={{
                                                float: "left",
                                                height: `calc(${
                                                  (detail.quoteData.boxHeight *
                                                    screen) /
                                                  detail.quoteData.mCalc
                                                }px - 10px)`,
                                                width: `calc(${
                                                  (detail.quoteData.boxWidth *
                                                    screen) /
                                                  detail.quoteData.mCalc
                                                }px - 10px)`,
                                                margin: "4px",
                                                border: "1px solid #333",
                                              }}
                                            >
                                              <img
                                                src={Fan}
                                                style={{
                                                  float: "left",
                                                  width:
                                                    (0.75 * screen) /
                                                      detail.quoteData.mCalc +
                                                    "px",
                                                  margin: "4px",
                                                }}
                                              />
                                              <div
                                                style={{
                                                  float: "right",
                                                  height: `calc(${
                                                    ((detail.quoteData
                                                      .boxHeight -
                                                      0.75) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - 25px)`,
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - 20px)`,
                                                  marginRight: "5px",
                                                  background: "lightblue",
                                                  border: "1px solid #333",
                                                }}
                                              ></div>
                                            </div>
                                          </div>
                                        )}

                                        {detail.quoteData.switchFixed ===
                                          "off" && (
                                          <div
                                            style={{
                                              float: "left",
                                              width:
                                                (detail.quoteData.boxWidth *
                                                  screen) /
                                                  detail.quoteData.mCalc +
                                                "px",
                                              height:
                                                (detail.quoteData.boxHeight *
                                                  screen) /
                                                  detail.quoteData.mCalc +
                                                "px",
                                              border: "1px solid #333",
                                            }}
                                          >
                                            <div
                                              style={{
                                                float: "left",
                                                height: `calc(${
                                                  (detail.quoteData.boxHeight *
                                                    screen) /
                                                  detail.quoteData.mCalc
                                                }px - 10px)`,
                                                width: `calc(${
                                                  (detail.quoteData.boxWidth *
                                                    screen) /
                                                  detail.quoteData.mCalc
                                                }px - 10px)`,
                                                margin: "4px",
                                                border: "1px solid #333",
                                              }}
                                            >
                                              <img
                                                src={Fan}
                                                style={{
                                                  float: "left",
                                                  width:
                                                    (0.75 * screen) /
                                                      detail.quoteData.mCalc +
                                                    "px",
                                                  margin: "4px",
                                                }}
                                              />
                                              <div
                                                style={{
                                                  float: "right",
                                                  height: `calc(${
                                                    ((detail.quoteData
                                                      .boxHeight -
                                                      0.75) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - 25px)`,
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - 20px)`,
                                                  marginRight: "5px",
                                                  backgroundImage: `repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`,
                                                  backgroundSize: "150% auto",
                                                  backgroundRepeat: "repeat",
                                                  border: "1px solid #333",
                                                }}
                                              ></div>
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    ) : (
                                      <div
                                        style={{
                                          float: "left",
                                          width:
                                            (detail.quoteData.boxWidth *
                                              screen) /
                                              detail.quoteData.mCalc +
                                            "px",
                                          height:
                                            (detail.quoteData.boxHeight *
                                              screen) /
                                              detail.quoteData.mCalc +
                                            "px",
                                          border: "1px solid #333",
                                        }}
                                      >
                                        {detail.quoteData.switchFixed ===
                                        "off" ? (
                                          <div
                                            style={{
                                              float: "right",
                                              height: `calc(${
                                                (detail.quoteData.boxHeight *
                                                  screen) /
                                                detail.quoteData.mCalc
                                              }px - 12px)`,
                                              width: `calc(${
                                                (detail.quoteData.boxWidth *
                                                  screen) /
                                                detail.quoteData.mCalc
                                              }px - 12px)`,
                                              marginRight: "5px",
                                              marginTop: "5px",
                                              backgroundImage: `repeating-linear-gradient(lightblue, white 12%, lightblue 12%)`,
                                              backgroundSize: "150% auto",
                                              backgroundRepeat: "repeat",
                                              border: "1px solid #333",
                                            }}
                                          ></div>
                                        ) : (
                                          <div
                                            style={{
                                              float: "right",
                                              height: `calc(${
                                                (detail.quoteData.boxHeight *
                                                  screen) /
                                                detail.quoteData.mCalc
                                              }px - 12px)`,
                                              width: `calc(${
                                                (detail.quoteData.boxWidth *
                                                  screen) /
                                                detail.quoteData.mCalc
                                              }px - 12px)`,
                                              marginRight: "5px",
                                              marginTop: "5px",
                                              background: "lightblue",
                                              border: "1px solid #333",
                                            }}
                                          ></div>
                                        )}
                                      </div>
                                    ))}
                                </>
                              )}

                              {detail.quoteData.item === "Fixed Window" && (
                                <div
                                  style={{
                                    float: "left",
                                    boxShadow: "1px 1px 5px grey",
                                    width: `calc(${
                                      (detail.quoteData.measure === 'ft' ? detail.quoteData.boxWidth : detail.quoteData.boxWidth  / 304.8) * screen
                                    }px - 1px)`,
                                    height: `calc(${
                                      (detail.quoteData.measure === 'ft' ? detail.quoteData.boxHeight : detail.quoteData.boxHeight / 304.8) * screen
                                    }px + 5px)`,
                                    border: "1px solid #333",
                                    position: "relative",
                                  }}
                                >
                                  {detail.quoteData.boxHeight &&
                                  detail.quoteData.boxWidth > 0 ? (
                                    <>
                                      {/* outer corner lines start */}
                                      <div
                                        style={{
                                          position: "absolute",
                                          height: "7px",
                                          width: "1px",
                                          float: "left",
                                          marginTop: "-1px",
                                          marginLeft: `calc(${
                                            (detail.quoteData.measure === 'ft' ? detail.quoteData.boxWidth : detail.quoteData.boxWidth  / 304.8) * screen
                                          }px - 5px)`,
                                          transform: "rotate(45deg)",
                                          borderRight: "1px solid black",
                                        }}
                                      ></div>
                                      <div
                                        style={{
                                          position: "absolute",
                                          height: "8px",
                                          width: "1px",
                                          float: "left",
                                          marginTop: "-1px",
                                          marginLeft: "2px",
                                          transform: "rotate(-45deg)",
                                          borderLeft: "1px solid black",
                                        }}
                                      ></div>
                                      <div
                                        style={{
                                          position: "absolute",
                                          height: "7px",
                                          width: "1px",
                                          float: "right",
                                          marginTop: `calc(${
                                            (detail.quoteData.measure === 'ft' ? detail.quoteData.boxHeight : detail.quoteData.boxHeight / 304.8) * screen
                                          }px - 3px)`,
                                          marginLeft: `calc(${
                                            (detail.quoteData.measure === 'ft' ? detail.quoteData.boxWidth : detail.quoteData.boxWidth  / 304.8) * screen
                                          }px - 5px)`,
                                          transform: "rotate(-45deg)",
                                          borderLeft: "1px solid black",
                                        }}
                                      ></div>
                                      <div
                                        style={{
                                          position: "absolute",
                                          height: "7px",
                                          width: "1px",
                                          float: "left",
                                          marginTop: `calc(${
                                            (detail.quoteData.measure === 'ft' ? detail.quoteData.boxHeight : detail.quoteData.boxHeight / 304.8) * screen
                                          }px - 2px)`,
                                          marginLeft: "2px",
                                          transform: "rotate(45deg)",
                                          borderLeft: "1px solid black",
                                        }}
                                      ></div>
                                      {/* outer corner lines end */}
                                    </>
                                  ) : (
                                    <></>
                                  )}

                                  {detail.quoteData.horizontalMullion.map(
                                    (row, rowIndex) => (
                                      <div
                                        key={rowIndex}
                                        style={{
                                          display: "flex",
                                          gap: "1px",
                                          height: `calc(${
                                            row?.size * screen
                                          }px - 5px)`,
                                          width: `calc(${
                                            (detail.quoteData.measure === 'ft' ? detail.quoteData.boxWidth : detail.quoteData.boxWidth  / 304.8) * screen
                                          }px - 10px)`,
                                          marginTop:
                                            rowIndex === 0 ? "4px" : "0px",
                                          marginBottom: "5px",
                                          marginLeft: "4px",
                                          marginRight: "4px",
                                          position: "relative",
                                        }}
                                      >
                                        {detail.quoteData.verticalMullion.map(
                                          (col, colIndex) => (
                                            <div
                                              key={colIndex}
                                              style={{
                                                width: `calc(${
                                                  col?.size * screen
                                                }px - 5px)`,
                                                height: `100%`,
                                                marginLeft:
                                                  colIndex === 0
                                                    ? "0px"
                                                    : "4px",
                                                border: "1px solid #333",
                                                background: "lightblue",
                                                position: "relative",
                                              }}
                                            >
                                              {detail.quoteData.boxHeight &&
                                                detail.quoteData.boxWidth >
                                                  0 && (
                                                  <div
                                                    style={{
                                                      position: "absolute",
                                                      top: "50%",
                                                      left: "50%",
                                                      transform:
                                                        "translate(-50%, -50%)",
                                                      fontSize: "30px",
                                                      fontWeight: "50",
                                                      cursor: "pointer",
                                                      color: "#000",
                                                      zIndex: 1,
                                                    }}
                                                  >
                                                    +
                                                  </div>
                                                )}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              )}

                              {detail?.quoteData?.item === "TopHung" && (
                                <>
                                  <div
                                    align="center"
                                    style={{
                                      alignContent: "center",
                                      alignItems: "center",
                                      textAlign: "center",
                                      marginLeft: "auto",
                                      marginRight: "auto",
                                    }}
                                  >
                                    <div
                                      style={{
                                        float: "left",
                                        boxShadow: "1px 1px 5px grey",
                                        width:
                                          ((detail.quoteData.measure === 'ft' ? detail.quoteData.boxWidth : detail.quoteData.boxWidth  / 304.8)* screen) /
                                            detail.quoteData.mCalc +
                                          "px",
                                        height:
                                          (detail.quoteData.boxHeight *
                                            screen) /
                                            detail.quoteData.mCalc +
                                          "px",
                                        border: "1px solid #333",
                                      }}
                                    >
                                      {[
                                        ...Array(detail.quoteData.numFrames),
                                      ].map((_, index) => (
                                        <div
                                          style={{
                                            float: "left",
                                            margin: "2px",
                                            border: "1px solid #333",
                                            width: `calc(${
                                              (detail.quoteData.boxWidth *
                                                screen) /
                                                detail.quoteData.mCalc /
                                                detail.quoteData.numFrames +
                                              "px"
                                            } - 6px)`,
                                            height: `calc(${
                                              (detail.quoteData.boxHeight *
                                                screen) /
                                                detail.quoteData.mCalc +
                                              "px"
                                            } - 6px)`,
                                            position: "relative",
                                          }}
                                        >
                                          {/* outer corner lines start */}
                                          {/* <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-6.5px', marginRight: '-3px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-6px', marginLeft: '-3px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'right', marginTop: getOuterBottom(boxHeight, screen, detail.quoteData.mCalc), marginRight: '-4px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                          <div style={{ height: '8px', width: '1px', float: 'left', marginTop: getOuterBottom(boxHeight, screen, detail.quoteData.mCalc), marginLeft: '-3px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div> */}
                                          {/* outer corner lines end */}

                                          {detail.quoteData.boxTop === "on" &&
                                            [
                                              ...Array(
                                                detail.quoteData.numTopBoxes
                                              ),
                                            ].map((_, index) => (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                      detail.quoteData.mCalc /
                                                      detail.quoteData
                                                        .numFrames +
                                                    "px"
                                                  } - 18px)`,
                                                  height: `calc(${
                                                    (detail.quoteData
                                                      .topnewHeights *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px )`,
                                                  margin: "5px",
                                                  position: "relative",
                                                }}
                                              >
                                                {[
                                                  ...Array(
                                                    detail.quoteData.topFixedNum
                                                  ),
                                                ].map((_, index) => (
                                                  <div
                                                    style={{
                                                      flex: "1",
                                                      backgroundColor: "white",
                                                      padding: "4px",
                                                      boxSizing: "border-box",
                                                      width: `calc(${
                                                        (detail.quoteData
                                                          .topFixedWidth[
                                                          index
                                                        ] *
                                                          screen) /
                                                          detail.quoteData
                                                            .mCalc /
                                                          detail.quoteData
                                                            .numFrames +
                                                        "px"
                                                      } - 18px)`,
                                                      height: `calc(${
                                                        (detail.quoteData
                                                          .topnewHeights *
                                                          screen) /
                                                        detail.quoteData.mCalc
                                                      }px )`,
                                                      border: "solid 1px #000",
                                                      marginLeft:
                                                        index === 0
                                                          ? "0px"
                                                          : "5px",
                                                      position: "relative",
                                                    }}
                                                  >
                                                    <div
                                                      style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        border:
                                                          "1px solid #333",
                                                        backgroundColor:
                                                          detail.quoteData
                                                            .topsash[index]
                                                            .type === "fixed"
                                                            ? "lightgreen"
                                                            : "lightblue",
                                                        position: "relative",
                                                      }}
                                                    >
                                                      {/* Inner corner lines start */}
                                                      <div
                                                        style={{
                                                          height: "7px",
                                                          width: "1px",
                                                          float: "right",
                                                          marginTop: "-6.5px",
                                                          marginRight: "-3px",
                                                          transform:
                                                            "rotate(45deg)",
                                                          borderRight:
                                                            "1px solid black",
                                                        }}
                                                      ></div>
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "left",
                                                          marginTop: "-6px",
                                                          marginLeft: "-3px",
                                                          transform:
                                                            "rotate(-45deg)",
                                                          borderLeft:
                                                            "1px solid black",
                                                        }}
                                                      ></div>
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "right",
                                                          marginTop: `calc(${
                                                            (detail.quoteData
                                                              .topnewHeights *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - 12px)`,
                                                          marginRight: "-4px",
                                                          transform:
                                                            "rotate(-45deg)",
                                                          borderLeft:
                                                            "1px solid black",
                                                        }}
                                                      ></div>
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "left",
                                                          marginTop: `calc(${
                                                            (detail.quoteData
                                                              .topnewHeights *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - 12px)`,
                                                          marginLeft: "-3px",
                                                          transform:
                                                            "rotate(45deg)",
                                                          borderLeft:
                                                            "1px solid black",
                                                        }}
                                                      ></div>
                                                      {/* Inner corner lines end */}
                                                      {/* outer corner lines start for bottom sash*/}
                                                      <div
                                                        style={{
                                                          height: "7px",
                                                          width: "1px",
                                                          float: "right",
                                                          marginTop: "-12px",
                                                          marginRight: "-9px",
                                                          transform:
                                                            "rotate(45deg)",
                                                          background:
                                                            index ===
                                                            detail.quoteData
                                                              .topsash.length -
                                                              1
                                                              ? "black"
                                                              : "transparent",
                                                        }}
                                                      ></div>
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "left",
                                                          marginTop: "-12px",
                                                          marginLeft: "-9px",
                                                          transform:
                                                            "rotate(-45deg)",
                                                          background:
                                                            index === 0
                                                              ? "black"
                                                              : "transparent",
                                                        }}
                                                      ></div>
                                                      {/* <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${bottomnewHeights*screen/detail.quoteData.mCalc}px - 12px)`, marginRight: '-11px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>
                                                                <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${bottomnewHeights*screen/detail.quoteData.mCalc}px - 12px)`, marginLeft: '-9px', transform: 'rotate(45deg)', borderLeft: '1px solid black' }}></div>  */}
                                                      {/* outer corner lines end */}
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "right",
                                                          marginTop: `calc(${
                                                            (detail.quoteData
                                                              .topnewHeights *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - 8px)`,
                                                          marginRight: "-6px",
                                                          transform:
                                                            "rotate(180deg)",
                                                          background:
                                                            index ===
                                                            detail.quoteData
                                                              .topsash.length -
                                                              1
                                                              ? "black"
                                                              : "transparent",
                                                        }}
                                                      ></div>
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "left",
                                                          marginTop: `calc(${
                                                            (detail.quoteData
                                                              .topnewHeights *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - 8px)`,
                                                          marginLeft: "-6px",
                                                          transform:
                                                            "rotate(180deg)",
                                                          background:
                                                            index === 0
                                                              ? "black"
                                                              : "transparent",
                                                        }}
                                                      ></div>

                                                      {detail.quoteData.topsash[
                                                        index
                                                      ].type === "shutter" ? (
                                                        <>
                                                          <img
                                                            src={left}
                                                            style={{
                                                              float: "left",
                                                              marginTop: `calc(${
                                                                (detail
                                                                  .quoteData
                                                                  .topnewHeights *
                                                                  screen) /
                                                                detail.quoteData
                                                                  .mCalc
                                                              }px - 25px)`,
                                                              marginLeft: "45%",
                                                              width:
                                                                screen === 40
                                                                  ? "13px"
                                                                  : "8px",
                                                              transform:
                                                                "rotate(-90deg)",
                                                            }}
                                                            alt="Left Handle"
                                                          />
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              width: "100%",
                                                              height: "100%",
                                                              overflow:
                                                                "hidden",
                                                            }}
                                                          >
                                                            {/* Left Diagonal Line  */}
                                                            <div
                                                              style={{
                                                                position:
                                                                  "absolute",
                                                                top: "0",
                                                                left: "50%",
                                                                width: "2px",
                                                                height: "1000%",
                                                                borderLeft:
                                                                  "1px dashed gray",
                                                                transform: `rotate(${
                                                                  Math.atan(
                                                                    (detail
                                                                      .quoteData
                                                                      .topFixedWidth
                                                                      .length
                                                                      ? detail
                                                                          .quoteData
                                                                          .topFixedWidth[
                                                                          index
                                                                        ]
                                                                      : detail
                                                                          .quoteData
                                                                          .boxWidth) /
                                                                      (2 *
                                                                        detail
                                                                          .quoteData
                                                                          .topnewHeights)
                                                                  ) *
                                                                  (180 /
                                                                    Math.PI)
                                                                }deg)`,
                                                                transformOrigin:
                                                                  "top left",
                                                              }}
                                                            ></div>

                                                            {/* Right Diagonal Line */}
                                                            <div
                                                              style={{
                                                                position:
                                                                  "absolute",
                                                                top: "0",
                                                                left: "50%",
                                                                width: "2px",
                                                                height: "1000%",
                                                                borderLeft:
                                                                  "1px dashed gray",
                                                                transform: `rotate(-${
                                                                  Math.atan(
                                                                    (detail
                                                                      .quoteData
                                                                      .topFixedWidth
                                                                      .length
                                                                      ? detail
                                                                          .quoteData
                                                                          .topFixedWidth[
                                                                          index
                                                                        ]
                                                                      : detail
                                                                          .quoteData
                                                                          .boxWidth) /
                                                                      (2 *
                                                                        detail
                                                                          .quoteData
                                                                          .topnewHeights)
                                                                  ) *
                                                                  (180 /
                                                                    Math.PI)
                                                                }deg)`,
                                                                transformOrigin:
                                                                  "top left",
                                                              }}
                                                            ></div>
                                                          </div>
                                                          {detail.quoteData
                                                            .topsash[index]
                                                            .type ===
                                                            "shutter" &&
                                                            detail.quoteData
                                                              .grill ===
                                                              "yes" &&
                                                            boxes(
                                                              detail.quoteData
                                                                .mCalc,
                                                              detail.quoteData
                                                                .measure,
                                                              detail.quoteData
                                                                .topnewHeights +
                                                                0.5
                                                            )}
                                                        </>
                                                      ) : (
                                                        <>
                                                          {/* fixed plus  */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              top: "50%",
                                                              left: "50%",
                                                              transform:
                                                                "translate(-50%, -50%)",
                                                              fontSize: "20px",
                                                              fontWeight: "200",
                                                              cursor: "pointer",
                                                              color: "#000",
                                                              zIndex: 1,
                                                            }}
                                                          >
                                                            +
                                                          </div>
                                                        </>
                                                      )}
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            ))}

                                          <div style={{ display: "flex" }}>
                                            {[
                                              ...Array(
                                                detail.quoteData
                                                  .numSecondInnerBoxes
                                              ),
                                            ].map((_, index) => (
                                              <div
                                                key={index}
                                                style={{
                                                  padding: "0px",
                                                  height: `calc(${
                                                    ((detail.quoteData
                                                      .boxHeight -
                                                      detail.quoteData
                                                        .topnewHeights -
                                                      detail.quoteData
                                                        .bottomnewHeights) *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px - ${
                                                    detail.quoteData.boxTop ===
                                                    "on"
                                                      ? "22px"
                                                      : "18px"
                                                  })`,
                                                  width: `calc(${
                                                    (detail.quoteData.newWidths[
                                                      index
                                                    ] *
                                                      screen) /
                                                    detail.quoteData.mCalc
                                                  }px )`,
                                                  backgroundColor: "white",
                                                  marginTop:
                                                    detail.quoteData.boxTop ===
                                                    "on"
                                                      ? "0px"
                                                      : "5px",
                                                  marginRight:
                                                    index ===
                                                    detail.quoteData
                                                      .numSecondInnerBoxes -
                                                      1
                                                      ? "5px"
                                                      : "3.5px",
                                                  marginLeft:
                                                    index === 0
                                                      ? "5px"
                                                      : "3.5px",
                                                  border: "1px solid #333",
                                                  position: "relative",
                                                }}
                                              >
                                                <div
                                                  style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    border: "1px solid #333",
                                                    backgroundColor:
                                                      detail.quoteData
                                                        .boxColors[index] ||
                                                      "lightblue",
                                                    position: "relative",
                                                  }}
                                                >
                                                  {/* Inner corner lines start */}
                                                  <div
                                                    style={{
                                                      height:
                                                        detail.quoteData
                                                          .boxBottom === "on"
                                                          ? "11px"
                                                          : "15px",
                                                      width: "1px",
                                                      float: "left",
                                                      marginTop: `calc(${
                                                        ((detail.quoteData
                                                          .boxHeight -
                                                          detail.quoteData
                                                            .topnewHeights -
                                                          detail.quoteData
                                                            .bottomnewHeights) *
                                                          screen) /
                                                        detail.quoteData.mCalc
                                                      }px - ${
                                                        detail.quoteData
                                                          .boxTop === "on"
                                                          ? "39px"
                                                          : "33px"
                                                      })`,
                                                      marginLeft:
                                                        detail.quoteData
                                                          .boxBottom === "on"
                                                          ? "-4px"
                                                          : "-6px",
                                                      transform:
                                                        "rotate(45deg)",
                                                      borderLeft:
                                                        "1px solid grey",
                                                    }}
                                                  ></div>
                                                  <div
                                                    style={{
                                                      height:
                                                        detail.quoteData
                                                          .boxTop === "on"
                                                          ? "11px"
                                                          : "15px",
                                                      width: "1px",
                                                      float: "left",
                                                      marginTop:
                                                        detail.quoteData
                                                          .boxTop === "on"
                                                          ? "-9px"
                                                          : "-14px",
                                                      marginLeft:
                                                        detail.quoteData
                                                          .boxTop === "on"
                                                          ? "-4px"
                                                          : "-6px",
                                                      transform:
                                                        "rotate(-45deg)",
                                                      borderLeft:
                                                        "1px solid grey",
                                                    }}
                                                  ></div>
                                                  <div
                                                    style={{
                                                      height:
                                                        detail.quoteData
                                                          .boxTop === "on"
                                                          ? "11px"
                                                          : "15px",
                                                      width: "1px",
                                                      float: "right",
                                                      marginTop:
                                                        detail.quoteData
                                                          .boxTop === "on"
                                                          ? "-9px"
                                                          : "-14px",
                                                      marginRight:
                                                        detail.quoteData
                                                          .boxTop === "on"
                                                          ? "-4px"
                                                          : "-6px",
                                                      transform:
                                                        "rotate(45deg)",
                                                      borderRight:
                                                        "1px solid grey",
                                                    }}
                                                  ></div>
                                                  {/* <div style={{ height: '15px', width: '1px', float: 'left', marginTop: getInnerBottom(boxHeight - topnewHeights - bottomnewHeights, screen, detail.quoteData.mCalc), marginLeft: '-4px', transform: 'rotate(-45deg)', borderLeft: index === 0 ? 'transparent' : '1px solid black' }}></div> */}
                                                  <div
                                                    style={{
                                                      height:
                                                        detail.quoteData
                                                          .boxBottom === "on"
                                                          ? "11px"
                                                          : "15px",
                                                      width: "1px",
                                                      float: "right",
                                                      marginTop: `calc(${
                                                        ((detail.quoteData
                                                          .boxHeight -
                                                          detail.quoteData
                                                            .topnewHeights -
                                                          detail.quoteData
                                                            .bottomnewHeights) *
                                                          screen) /
                                                        detail.quoteData.mCalc
                                                      }px - ${
                                                        detail.quoteData
                                                          .boxTop === "on"
                                                          ? "39px"
                                                          : "33px"
                                                      })`,
                                                      marginRight:
                                                        detail.quoteData
                                                          .boxBottom === "on"
                                                          ? "-4px"
                                                          : "-6px",
                                                      transform:
                                                        "rotate(-45deg)",
                                                      borderLeft:
                                                        "1px solid grey",
                                                    }}
                                                  ></div>
                                                  <div
                                                    style={{
                                                      height: "10px",
                                                      width: "1px",
                                                      float: "right",
                                                      marginTop: `calc(${
                                                        ((detail.quoteData
                                                          .boxHeight -
                                                          detail.quoteData
                                                            .topnewHeights -
                                                          detail.quoteData
                                                            .bottomnewHeights) *
                                                          screen) /
                                                        detail.quoteData.mCalc
                                                      }px - ${
                                                        detail.quoteData
                                                          .boxBottom === "on"
                                                          ? "33px"
                                                          : "27px"
                                                      })`,
                                                      marginRight: "-4px",
                                                      transform:
                                                        "rotate(-45deg)",
                                                      borderRight:
                                                        index === -1
                                                          ? "1px solid grey"
                                                          : "none",
                                                    }}
                                                  ></div>
                                                  {/* <div style={{ height: '7px', width: '1px', float: 'left', right: '0px', marginTop: '-6px', marginRight: '-1px', background: index === 0 ? 'transparent' : 'black' }}></div> */}
                                                  {/* Inner corner lines ends */}

                                                  {detail.quoteData
                                                    .boxBottom === "on" ? (
                                                    <>
                                                      <div
                                                        style={{
                                                          height: "10px",
                                                          width: "1px",
                                                          float: "right",
                                                          marginTop: `calc(${
                                                            ((detail.quoteData
                                                              .boxHeight -
                                                              detail.quoteData
                                                                .topnewHeights -
                                                              detail.quoteData
                                                                .bottomnewHeights) *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - ${
                                                            detail.quoteData
                                                              .boxBottom ===
                                                            "on"
                                                              ? "29px"
                                                              : "27px"
                                                          })`,
                                                          marginRight: "-7px",
                                                          transform:
                                                            "rotate(180deg)",
                                                          background:
                                                            index ===
                                                            detail.quoteData
                                                              .newWidths
                                                              .length -
                                                              1
                                                              ? "black"
                                                              : "transparent",
                                                        }}
                                                      ></div>
                                                      <div
                                                        style={{
                                                          height: "10px",
                                                          width: "1px",
                                                          float: "left",
                                                          marginTop: `calc(${
                                                            ((detail.quoteData
                                                              .boxHeight -
                                                              detail.quoteData
                                                                .topnewHeights -
                                                              detail.quoteData
                                                                .bottomnewHeights) *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - ${
                                                            detail.quoteData
                                                              .boxBottom ===
                                                            "on"
                                                              ? "29px"
                                                              : "27px"
                                                          })`,
                                                          marginLeft: "-7px",
                                                          transform:
                                                            "rotate(180deg)",
                                                          background:
                                                            index === 0
                                                              ? "black"
                                                              : "transparent",
                                                        }}
                                                      ></div>
                                                    </>
                                                  ) : (
                                                    <></>
                                                  )}

                                                  {detail.quoteData.boxNames[
                                                    index
                                                  ] === "Shutter" ? (
                                                    detail.quoteData.boxHandle[
                                                      index
                                                    ] === "left" ? (
                                                      <>
                                                        <img
                                                          src={left}
                                                          style={{
                                                            position:
                                                              "absolute",
                                                            transform:
                                                              "rotate(-90deg)",
                                                            width:
                                                              screen === 40
                                                                ? "13px"
                                                                : "8px",
                                                            cursor: "pointer",
                                                            marginBottom: "1px",
                                                            marginTop: `calc(${
                                                              ((detail.quoteData
                                                                .boxHeight -
                                                                detail.quoteData
                                                                  .topnewHeights -
                                                                detail.quoteData
                                                                  .bottomnewHeights) *
                                                                screen) /
                                                              detail.quoteData
                                                                .mCalc
                                                            }px - ${
                                                              detail.quoteData
                                                                .boxTop === "on"
                                                                ? "42px"
                                                                : "38px"
                                                            } - ${
                                                              screen === 40
                                                                ? "5px"
                                                                : "0px"
                                                            })`,
                                                            marginLeft: `calc(${
                                                              ((detail.quoteData
                                                                .numSecondInnerBoxes ===
                                                              1
                                                                ? detail
                                                                    .quoteData
                                                                    .boxWidth
                                                                : detail
                                                                    .quoteData
                                                                    .newWidths[
                                                                    index
                                                                  ]) *
                                                                screen) /
                                                              detail.quoteData
                                                                .mCalc /
                                                              2
                                                            }px - 40px)`,
                                                          }}
                                                          alt="Left Handle"
                                                        />
                                                        <div
                                                          style={{
                                                            position:
                                                              "absolute",
                                                            width: "100%",
                                                            height: "100%",
                                                            overflow: "hidden",
                                                          }}
                                                        >
                                                          {/* Left Diagonal Line  */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              top: "0",
                                                              left: "50%",
                                                              width: "2px",
                                                              height: "1000%",
                                                              borderLeft:
                                                                "1px dashed gray",
                                                              transform: `rotate(${
                                                                Math.atan(
                                                                  (detail
                                                                    .quoteData
                                                                    .numSecondInnerBoxes ===
                                                                  1
                                                                    ? detail
                                                                        .quoteData
                                                                        .boxWidth
                                                                    : detail
                                                                        .quoteData
                                                                        .newWidths[
                                                                        index
                                                                      ]) /
                                                                    (2 *
                                                                      (detail
                                                                        .quoteData
                                                                        .boxHeight -
                                                                        detail
                                                                          .quoteData
                                                                          .topnewHeights -
                                                                        detail
                                                                          .quoteData
                                                                          .bottomnewHeights))
                                                                ) *
                                                                  (180 /
                                                                    Math.PI) +
                                                                (detail
                                                                  .quoteData
                                                                  .boxTop ===
                                                                  "on" &&
                                                                detail.quoteData
                                                                  .boxBottom ===
                                                                  "on"
                                                                  ? 1.5
                                                                  : 0)
                                                              }deg)`,
                                                              transformOrigin:
                                                                "top left",
                                                            }}
                                                          ></div>

                                                          {/* Right Diagonal Line */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              top: "0",
                                                              left: "50%",
                                                              width: "2px",
                                                              height: "1000%",
                                                              borderLeft:
                                                                "1px dashed gray",
                                                              transform: `rotate(-${
                                                                Math.atan(
                                                                  (detail
                                                                    .quoteData
                                                                    .numSecondInnerBoxes ===
                                                                  1
                                                                    ? detail
                                                                        .quoteData
                                                                        .boxWidth
                                                                    : detail
                                                                        .quoteData
                                                                        .newWidths[
                                                                        index
                                                                      ]) /
                                                                    (2 *
                                                                      (detail
                                                                        .quoteData
                                                                        .boxHeight -
                                                                        detail
                                                                          .quoteData
                                                                          .topnewHeights -
                                                                        detail
                                                                          .quoteData
                                                                          .bottomnewHeights))
                                                                ) *
                                                                  (180 /
                                                                    Math.PI) +
                                                                (detail
                                                                  .quoteData
                                                                  .boxTop ===
                                                                  "on" &&
                                                                detail.quoteData
                                                                  .boxBottom ===
                                                                  "on"
                                                                  ? 1.5
                                                                  : 0)
                                                              }deg)`,
                                                              transformOrigin:
                                                                "top left",
                                                            }}
                                                          ></div>
                                                        </div>
                                                      </>
                                                    ) : (
                                                      <>
                                                        <img
                                                          src={right}
                                                          style={{
                                                            position:
                                                              "absolute",
                                                            transform:
                                                              "rotate(-90deg)",
                                                            width:
                                                              screen === 40
                                                                ? "13px"
                                                                : "8px",
                                                            cursor: "pointer",
                                                            marginBottom: "1px",
                                                            marginTop: `calc(${
                                                              ((detail.quoteData
                                                                .boxHeight -
                                                                detail.quoteData
                                                                  .topnewHeights -
                                                                detail.quoteData
                                                                  .bottomnewHeights) *
                                                                screen) /
                                                              detail.quoteData
                                                                .mCalc
                                                            }px - ${
                                                              detail.quoteData
                                                                .boxTop === "on"
                                                                ? "34px"
                                                                : "30px"
                                                            } - ${
                                                              screen === 40
                                                                ? "5px"
                                                                : "0px"
                                                            })`,
                                                            marginLeft: `calc(${
                                                              ((detail.quoteData
                                                                .numSecondInnerBoxes ===
                                                              1
                                                                ? detail
                                                                    .quoteData
                                                                    .boxWidth
                                                                : detail
                                                                    .quoteData
                                                                    .newWidths[
                                                                    index
                                                                  ]) *
                                                                screen) /
                                                              detail.quoteData
                                                                .mCalc /
                                                              2
                                                            }px - 15px)`,
                                                          }}
                                                          alt="Right Handle"
                                                        />
                                                        <div
                                                          style={{
                                                            position:
                                                              "absolute",
                                                            width: "100%",
                                                            height: "100%",
                                                            overflow: "hidden",
                                                          }}
                                                        >
                                                          {/* Left Diagonal Line  */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              top: "0",
                                                              left: "50%",
                                                              width: "2px",
                                                              height: "1000%",
                                                              borderLeft:
                                                                "1px dashed gray",
                                                              transform: `rotate(${
                                                                Math.atan(
                                                                  (detail
                                                                    .quoteData
                                                                    .numSecondInnerBoxes ===
                                                                  1
                                                                    ? detail
                                                                        .quoteData
                                                                        .boxWidth
                                                                    : detail
                                                                        .quoteData
                                                                        .newWidths[
                                                                        index
                                                                      ]) /
                                                                    (2 *
                                                                      (detail
                                                                        .quoteData
                                                                        .boxHeight -
                                                                        detail
                                                                          .quoteData
                                                                          .topnewHeights -
                                                                        detail
                                                                          .quoteData
                                                                          .bottomnewHeights))
                                                                ) *
                                                                  (180 /
                                                                    Math.PI) +
                                                                (detail
                                                                  .quoteData
                                                                  .boxTop ===
                                                                  "on" &&
                                                                detail.quoteData
                                                                  .boxBottom ===
                                                                  "on"
                                                                  ? 1.5
                                                                  : 0)
                                                              }deg)`,
                                                              transformOrigin:
                                                                "top left",
                                                            }}
                                                          ></div>

                                                          {/* Right Diagonal Line */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              top: "0",
                                                              left: "50%",
                                                              width: "2px",
                                                              height: "1000%",
                                                              borderLeft:
                                                                "1px dashed gray",
                                                              transform: `rotate(-${
                                                                Math.atan(
                                                                  (detail
                                                                    .quoteData
                                                                    .numSecondInnerBoxes ===
                                                                  1
                                                                    ? detail
                                                                        .quoteData
                                                                        .boxWidth
                                                                    : detail
                                                                        .quoteData
                                                                        .newWidths[
                                                                        index
                                                                      ]) /
                                                                    (2 *
                                                                      (detail
                                                                        .quoteData
                                                                        .boxHeight -
                                                                        detail
                                                                          .quoteData
                                                                          .topnewHeights -
                                                                        detail
                                                                          .quoteData
                                                                          .bottomnewHeights))
                                                                ) *
                                                                  (180 /
                                                                    Math.PI) +
                                                                (detail
                                                                  .quoteData
                                                                  .boxTop ===
                                                                  "on" &&
                                                                detail.quoteData
                                                                  .boxBottom ===
                                                                  "on"
                                                                  ? 1.5
                                                                  : 0)
                                                              }deg)`,
                                                              transformOrigin:
                                                                "top left",
                                                            }}
                                                          ></div>
                                                        </div>
                                                      </>
                                                    )
                                                  ) : (
                                                    <>
                                                      {/* Plus Icon in Center */}
                                                      <div
                                                        style={{
                                                          position: "absolute",
                                                          top: "50%",
                                                          left: "50%",
                                                          transform:
                                                            "translate(-50%, -50%)",
                                                          fontSize: "50px",
                                                          fontWeight: "100",
                                                          cursor: "pointer",
                                                          color: "#000",
                                                          zIndex: 1,
                                                        }}
                                                      >
                                                        +
                                                      </div>
                                                    </>
                                                  )}

                                                  {detail.quoteData.mesh ===
                                                    "yes" &&
                                                    detail.quoteData.boxNames[
                                                      index
                                                    ] === "Shutter" &&
                                                    detail.quoteData.boxHandle[
                                                      index
                                                    ] === "left" && (
                                                      <img
                                                        src={meshimg}
                                                        style={{
                                                          position: "absolute",
                                                          left: 0,
                                                          width:
                                                            screen === 40
                                                              ? "20px"
                                                              : "15px",
                                                          float: "left",
                                                          marginTop:
                                                            screen === 40
                                                              ? `calc(${
                                                                  ((detail
                                                                    .quoteData
                                                                    .boxHeight -
                                                                    detail
                                                                      .quoteData
                                                                      .topnewHeights -
                                                                    detail
                                                                      .quoteData
                                                                      .bottomnewHeights) *
                                                                    screen) /
                                                                  detail
                                                                    .quoteData
                                                                    .mCalc
                                                                }px - ${
                                                                  detail
                                                                    .quoteData
                                                                    .boxTop ===
                                                                  "on"
                                                                    ? "45px"
                                                                    : "70px"
                                                                } )`
                                                              : `calc(${
                                                                  ((detail
                                                                    .quoteData
                                                                    .boxHeight -
                                                                    detail
                                                                      .quoteData
                                                                      .topnewHeights -
                                                                    detail
                                                                      .quoteData
                                                                      .bottomnewHeights) *
                                                                    screen) /
                                                                  detail
                                                                    .quoteData
                                                                    .mCalc
                                                                }px - 40px)`,
                                                        }}
                                                      />
                                                    )}

                                                  {detail.quoteData.mesh ===
                                                    "yes" &&
                                                    detail.quoteData.boxNames[
                                                      index
                                                    ] === "Shutter" &&
                                                    detail.quoteData.boxHandle[
                                                      index
                                                    ] === "right" && (
                                                      <img
                                                        src={meshimg}
                                                        style={{
                                                          width:
                                                            screen === 40
                                                              ? "20px"
                                                              : "20px",
                                                          float: "left",
                                                          marginLeft:
                                                            screen === 40
                                                              ? detail.quoteData
                                                                  .boxHandle[
                                                                  index
                                                                ] === "right"
                                                                ? "-1px"
                                                                : "0px"
                                                              : detail.quoteData
                                                                  .boxHandle[
                                                                  index
                                                                ] === "right"
                                                              ? "0px"
                                                              : "px",
                                                          marginTop:
                                                            screen === 40
                                                              ? `calc(${
                                                                  ((detail
                                                                    .quoteData
                                                                    .boxHeight -
                                                                    detail
                                                                      .quoteData
                                                                      .topnewHeights -
                                                                    detail
                                                                      .quoteData
                                                                      .bottomnewHeights) *
                                                                    screen) /
                                                                  detail
                                                                    .quoteData
                                                                    .mCalc
                                                                }px - ${
                                                                  detail
                                                                    .quoteData
                                                                    .boxTop ===
                                                                  "on"
                                                                    ? "45px"
                                                                    : "70px"
                                                                } )`
                                                              : `calc(${
                                                                  ((detail
                                                                    .quoteData
                                                                    .boxHeight -
                                                                    detail
                                                                      .quoteData
                                                                      .topnewHeights -
                                                                    detail
                                                                      .quoteData
                                                                      .bottomnewHeights) *
                                                                    screen) /
                                                                  detail
                                                                    .quoteData
                                                                    .mCalc
                                                                }px - 40px)`,
                                                        }}
                                                      />
                                                    )}

                                                  {detail.quoteData.boxNames[
                                                    index
                                                  ] === "Shutter" &&
                                                    detail.quoteData.grill ===
                                                      "yes" &&
                                                    boxes(
                                                      detail.quoteData.mCalc,
                                                      detail.quoteData.measure,
                                                      detail.quoteData
                                                        .boxHeight -
                                                        detail.quoteData
                                                          .topnewHeights -
                                                        detail.quoteData
                                                          .bottomnewHeights -
                                                        0.5
                                                    )}
                                                </div>
                                              </div>
                                            ))}
                                          </div>

                                          {detail.quoteData.boxBottom ===
                                            "on" &&
                                            [
                                              ...Array(
                                                detail.quoteData.numBottomBoxes
                                              ),
                                            ].map((_, index) => (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  width: `calc(${
                                                    (detail.quoteData.boxWidth *
                                                      screen) /
                                                      detail.quoteData.mCalc /
                                                      detail.quoteData
                                                        .numFrames +
                                                    "px"
                                                  } - 18px)`,
                                                  height: `calc(${
                                                    (detail.quoteData
                                                      .bottomnewHeights *
                                                      screen) /
                                                      detail.quoteData.mCalc +
                                                    "px"
                                                  } -10px)`,
                                                  margin: "5px",
                                                }}
                                              >
                                                {[
                                                  ...Array(
                                                    detail.quoteData
                                                      .bottomFixedNum
                                                  ),
                                                ].map((_, index) => (
                                                  <div
                                                    style={{
                                                      flex: "1",
                                                      backgroundColor: "white",
                                                      padding: "4px",
                                                      width: `calc(${
                                                        (detail.quoteData
                                                          .bottomFixedWidth[
                                                          index
                                                        ] *
                                                          screen) /
                                                          detail.quoteData
                                                            .mCalc /
                                                          detail.quoteData
                                                            .numFrames +
                                                        "px"
                                                      } - 18px)`,
                                                      height: `calc(${
                                                        (detail.quoteData
                                                          .bottomnewHeights *
                                                          screen) /
                                                          detail.quoteData
                                                            .mCalc +
                                                        "px"
                                                      } - 5px)`,
                                                      border: "solid 1px #000",
                                                      marginLeft:
                                                        index === 0
                                                          ? "0px"
                                                          : "5px",
                                                      position: "relative",
                                                    }}
                                                  >
                                                    <div
                                                      style={{
                                                        height: "100%",
                                                        width: "100%",
                                                        position: "relative",
                                                        backgroundColor:
                                                          detail.quoteData
                                                            .bottomsash[index]
                                                            .type === "fixed"
                                                            ? "lightgreen"
                                                            : "lightblue",
                                                        border:
                                                          "1px solid black",
                                                      }}
                                                    >
                                                      {/* inner corner lines start for bottom sash*/}
                                                      <div
                                                        style={{
                                                          height: "7px",
                                                          width: "1px",
                                                          float: "right",
                                                          marginTop: "-6.5px",
                                                          marginRight: "-3px",
                                                          transform:
                                                            "rotate(45deg)",
                                                          borderRight:
                                                            "1px solid black",
                                                        }}
                                                      ></div>
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "left",
                                                          marginTop: "-6px",
                                                          marginLeft: "-3px",
                                                          transform:
                                                            "rotate(-45deg)",
                                                          borderLeft:
                                                            "1px solid black",
                                                        }}
                                                      ></div>
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "right",
                                                          marginTop: `calc(${
                                                            (detail.quoteData
                                                              .bottomnewHeights *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - 18px)`,
                                                          marginRight: "-4px",
                                                          transform:
                                                            "rotate(-45deg)",
                                                          borderLeft:
                                                            "1px solid black",
                                                        }}
                                                      ></div>
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "left",
                                                          marginTop: `calc(${
                                                            (detail.quoteData
                                                              .bottomnewHeights *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - 18px)`,
                                                          marginLeft: "-3px",
                                                          transform:
                                                            "rotate(45deg)",
                                                          borderLeft:
                                                            "1px solid black",
                                                        }}
                                                      ></div>
                                                      {/* inner corner lines end */}
                                                      {/* outer corner lines start for bottom sash*/}
                                                      {/* <div style={{ height: '7px', width: '1px', float: 'right', marginTop: '-13px', marginRight: '-9px', transform: 'rotate(45deg)', borderRight: '1px solid black' }}></div>
                                                               <div style={{ height: '8px', width: '1px', float: 'left', marginTop: '-12px', marginLeft: '-9px', transform: 'rotate(-45deg)', borderLeft: '1px solid black' }}></div>*/}
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "right",
                                                          marginTop: `calc(${
                                                            (detail.quoteData
                                                              .bottomnewHeights *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - 12px)`,
                                                          marginRight: "-11px",
                                                          transform:
                                                            "rotate(-45deg)",
                                                          background:
                                                            index ===
                                                            detail.quoteData
                                                              .bottomsash
                                                              .length -
                                                              1
                                                              ? "black"
                                                              : "transparent",
                                                        }}
                                                      ></div>
                                                      <div
                                                        style={{
                                                          height: "8px",
                                                          width: "1px",
                                                          float: "left",
                                                          marginTop: `calc(${
                                                            (detail.quoteData
                                                              .bottomnewHeights *
                                                              screen) /
                                                            detail.quoteData
                                                              .mCalc
                                                          }px - 12px)`,
                                                          marginLeft: "-9px",
                                                          transform:
                                                            "rotate(45deg)",
                                                          background:
                                                            index === 0
                                                              ? "black"
                                                              : "transparent",
                                                        }}
                                                      ></div>
                                                      {/* outer corner lines end */}
                                                      {/* <div style={{ height: '8px', width: '1px', float: 'right', marginTop: `calc(${boxHeight-topnewHeights*screen/detail.quoteData.mCalc}px - ${screen === 3 ? '28px':'24px'})`, marginRight: '-6px', transform: 'rotate(180deg)', background: index === bottomsash.length -1  ? 'black' : 'transparent' }}></div>
                                                               <div style={{ height: '8px', width: '1px', float: 'left', marginTop:  `calc(${boxHeight-topnewHeights*screen/detail.quoteData.mCalc}px - ${screen === 3 ? '28px':'24px'})`, marginLeft: '-6px', transform: 'rotate(180deg)', background: index === 0 ? 'black' : 'transparent' }}></div> */}

                                                      {detail.quoteData
                                                        .bottomsash[index]
                                                        .type === "shutter" ? (
                                                        <>
                                                          <img
                                                            src={left}
                                                            style={{
                                                              float: "left",
                                                              marginTop: `calc(${
                                                                (detail
                                                                  .quoteData
                                                                  .bottomnewHeights *
                                                                  screen) /
                                                                detail.quoteData
                                                                  .mCalc
                                                              }px - 25px)`,
                                                              marginLeft: "45%",
                                                              width:
                                                                screen === 40
                                                                  ? "13px"
                                                                  : "8px",
                                                              transform:
                                                                "rotate(-90deg)",
                                                            }}
                                                            alt="Left Handle"
                                                          />
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              width: "100%",
                                                              height: "100%",
                                                              overflow:
                                                                "hidden",
                                                            }}
                                                          >
                                                            {/* Left Diagonal Line  */}
                                                            <div
                                                              style={{
                                                                position:
                                                                  "absolute",
                                                                top: "0",
                                                                left: "50%",
                                                                width: "2px",
                                                                height: "1000%",
                                                                borderLeft:
                                                                  "1px dashed gray",
                                                                transform: `rotate(${
                                                                  Math.atan(
                                                                    (detail
                                                                      .quoteData
                                                                      .bottomFixedWidth
                                                                      .length
                                                                      ? detail
                                                                          .quoteData
                                                                          .bottomFixedWidth[
                                                                          index
                                                                        ]
                                                                      : detail
                                                                          .quoteData
                                                                          .boxWidth) /
                                                                      (2 *
                                                                        detail
                                                                          .quoteData
                                                                          .bottomnewHeights)
                                                                  ) *
                                                                  (180 /
                                                                    Math.PI)
                                                                }deg)`,
                                                                transformOrigin:
                                                                  "top left",
                                                              }}
                                                            ></div>

                                                            {/* Right Diagonal Line */}
                                                            <div
                                                              style={{
                                                                position:
                                                                  "absolute",
                                                                top: "0",
                                                                left: "50%",
                                                                width: "2px",
                                                                height: "1000%",
                                                                borderLeft:
                                                                  "1px dashed gray",
                                                                transform: `rotate(-${
                                                                  Math.atan(
                                                                    (detail
                                                                      .quoteData
                                                                      .bottomFixedWidth
                                                                      .length
                                                                      ? detail
                                                                          .quoteData
                                                                          .bottomFixedWidth[
                                                                          index
                                                                        ]
                                                                      : detail
                                                                          .quoteData
                                                                          .boxWidth) /
                                                                      (2 *
                                                                        detail
                                                                          .quoteData
                                                                          .bottomnewHeights)
                                                                  ) *
                                                                  (180 /
                                                                    Math.PI)
                                                                }deg)`,
                                                                transformOrigin:
                                                                  "top left",
                                                              }}
                                                            ></div>
                                                          </div>

                                                          {detail.quoteData
                                                            .bottomsash[index]
                                                            .type ===
                                                            "shutter" &&
                                                            detail.quoteData
                                                              .grill ===
                                                              "yes" &&
                                                            boxes(
                                                              detail.quoteData
                                                                .mCalc,
                                                              detail.quoteData
                                                                .measure,
                                                              detail.quoteData
                                                                .bottomnewHeights
                                                            )}
                                                        </>
                                                      ) : (
                                                        <>
                                                          {/* fixed plus  */}
                                                          <div
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              top: "50%",
                                                              left: "50%",
                                                              transform:
                                                                "translate(-50%, -50%)",
                                                              fontSize: "20px",
                                                              fontWeight: "200",
                                                              cursor: "pointer",
                                                              color: "#000",
                                                              zIndex: 1,
                                                            }}
                                                          >
                                                            +
                                                          </div>
                                                        </>
                                                      )}
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            ))}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              )}

                              {/* <table>
                    <tr>
                      <td>WIDTH <small>( FT )</small></td>
                      <td>HEIGHT <small>( FT )</small></td>
                      <td>AREA <small>( SQFT )</small></td>
                      <td>RATE <small>( INR )</small></td>
                      <td>QTY <small>( NO.S )</small></td>
                      <td>AMOUNT <small>( INR )</small></td>
                      <td>RATE/SQFT <small>( INR )</small></td>
                    </tr>
                    <tr>
                      <td>{parseFloat(detail.quoteData.boxWidth).toFixed(2)}</td>
                      <td>{parseFloat(detail.quoteData.boxHeight).toFixed(2)}</td>
                      <td>{parseFloat(detail.quoteData.frameArea).toFixed(2)}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </table> */}
                              <p style={{ color: "#333" }}>
                                Width :{" "}
                                {parseFloat(detail.quoteData.boxWidth).toFixed(
                                  2
                                )}{" "}
                                {detail.quoteData.measure} - Height :{" "}
                                {parseFloat(detail.quoteData.boxHeight).toFixed(
                                  2
                                )}{" "}
                                {detail.quoteData.measure}
                                <br></br>
                                Area :{" "}
                                {parseFloat(detail.quoteData.frameArea).toFixed(
                                  2
                                )}{" "}
                                SqFt<br></br>
                                Rate : ₹{" "}
                                {numeral(
                                  parseFloat(detail.quoteData.grandTotal) *
                                    parseFloat(detail.quoteData.qty)
                                ).format("0,0.00")}
                                <br></br>
                                Rate/sqft : ₹{" "}
                                {numeral(
                                  parseFloat(detail.quoteData.grandTotal) /
                                    parseFloat(detail.quoteData.frameArea)
                                ).format("0,0.00")}
                                <br></br>
                                Quantity : {detail.quoteData.qty}
                                <br></br>
                                Total : ₹{" "}
                                {numeral(
                                  parseFloat(detail.quoteData.grandTotal) *
                                    parseFloat(detail.quoteData.qty)
                                ).format("0,0.00")}
                              </p>
                            </div>
                          </div>

                          <div
                            class="col-md-2 col-xxl-2 col-xl-2"
                            style={{
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                marginLeft: "auto",
                                marginRight: "auto",
                                textAlign: "center",
                                alignItems: "center",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                gap: "10px",
                              }}
                            >
                              {detail.quoteData.item === "CasementDoor" && (
                                <a
                                  href={`editcasementDoor?id=${quoteIds}&arrayValues=${detailIndex}`}
                                  className="btn btn-primary"
                                >
                                  <i class="text-white ti ti-edit"></i>
                                </a>
                              )}

                              {detail.quoteData.item === "SlidingDoor" && (
                                <a
                                  href={`editslidingDoor?id=${quoteIds}&arrayValues=${detailIndex}`}
                                  className="btn btn-primary"
                                >
                                  {" "}
                                  <i class="text-white ti ti-edit"></i>{" "}
                                </a>
                              )}

                              {detail.quoteData.item === "CasementWindow" && (
                                <a
                                  href={`editcasementWindow?id=${quoteIds}&arrayValues=${detailIndex}`}
                                  className="btn btn-primary"
                                >
                                  {" "}
                                  <i class="text-white ti ti-edit"></i>{" "}
                                </a>
                              )}

                              {detail.quoteData.item === "SlidingWindow" && (
                                <a
                                  href={`editslidingWindow?id=${quoteIds}&arrayValues=${detailIndex}`}
                                  className="btn btn-primary"
                                >
                                  <i class="text-white ti ti-edit"></i>
                                </a>
                              )}

                              {detail.quoteData.item === "Ventilator" && (
                                <a
                                  href={`editventilator?id=${quoteIds}&arrayValues=${detailIndex}`}
                                  className="btn btn-primary"
                                >
                                  <i class="text-white ti ti-edit"></i>
                                </a>
                              )}

                              {detail.quoteData.item === "Fixed Window" && (
                                <a
                                  href={`/edit-fixed?id=${quoteIds}&arrayValues=${detailIndex}`}
                                  className="btn btn-primary"
                                >
                                  <i class="text-white ti ti-edit"></i>
                                </a>
                              )}

                              {detail.quoteData.item === "TopHung" && (
                                <a
                                  href={`/edit-top-hung?id=${quoteIds}&arrayValues=${detailIndex}`}
                                  className="btn btn-primary"
                                >
                                  <i class="text-white ti ti-edit"></i>
                                </a>
                              )}

                              <a
                                href={`quotees?id=${quoteIds}&arrayValues=${detailIndex}`}
                                class="btn btn-success"
                              >
                                <i class="text-white ti ti-eye"></i>
                              </a>

                              <a
                                onClick={() =>
                                  removequote(quoteIds, detail.rowId)
                                }
                                class="btn btn-danger"
                              >
                                {" "}
                                <i class="text-white ti ti-trash"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))
            )}

            <hr />

            {matchedQuotes[0]?.quoteID === quoteIds ? (
              <></>
            ) : (
              <div class="row mb-5">
                <div class="col-12">
                  <div
                    class="d-grid"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <a
                      class="btn btn-outline-secondary"
                      href="/select"
                      onClick={handleAddClick}
                    >
                      <i class="ti ti-plus"></i> Add Items
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div style={{maxWidth: '100%'}}>
                    <HomeComponent
                        discount={downloadData}
                        toggle={isToggled}
                        id="pdf-content"
                    />
                  </div>
                  {filteredQuotes && filteredQuotes.length > 0 && (
                    <ScheduleComponent quote={filteredQuotes[0]} id="pdf-schedule" />
                  )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quotesdet;
