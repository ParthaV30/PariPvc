import React, { useEffect, useState } from "react";
import { ReactSession } from 'react-client-session';
import { useRef } from "react";
import axios from "axios";
import { getCompanySettings, getQuotes, getQuoteById } from "../services/dbService";
import Navbar from "./navbar";

export default function NewCuttingSchedule({ quote: propQuote }) {
  const urlParams = new URLSearchParams(window.location.search);
  const quoteIds = urlParams.get('id');
  const userId = ReactSession.get('upvcuserId') || '1';
  const Empid = ReactSession.get("upvcempid");
  const userType = ReactSession.get("upvcuserType");

  let users = userType === '3' ? (Empid || userId) : userId;

  const [internalQuote, setInternalQuote] = useState(null);
  const quote = propQuote || internalQuote;
  const isStandalone = !propQuote;

  const profileImage = quote?.quoteDetails?.[0]?.quoteData?.selectedProfile || 'profile_logo';

  const [seriesData, setSeriesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [brandDatas, setBdata] = useState(null);

  useEffect(() => {
    async function loadQuote() {
      if (propQuote) return;
      try {
        let q = null;
        if (quoteIds) {
          q = await getQuoteById(quoteIds);
        }
        if (!q) {
          const list = await getQuotes(users);
          if (Array.isArray(list) && list.length > 0) {
            q = list[0];
          }
        }
        if (q) {
          const formatted = {
            ...q,
            client: { name: q.client_name || q.name || 'Client' },
            quoteDetails: (q.items || []).map((it, idx) => ({
              id: it.id || idx,
              quoteData: it.quoteData || it.data || it
            }))
          };
          setInternalQuote(formatted);
        }
      } catch (e) {
        console.warn('Error loading quote for cutting schedule:', e);
      }
    }
    loadQuote();
  }, [propQuote, quoteIds, users]);

  const brandData = async () => {
    try {
      const settings = await getCompanySettings(users);
      if (Array.isArray(settings) && settings.length > 0) {
        setBdata(settings);
        return;
      }
    } catch (e) {}

    try {
      const response = await axios.get('https://upvcapi.sninfoserv.com/company/', {params: { userId: users }});
      if (response.data?.status === 'success') {
        setBdata(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching brand data:', error);
    } 
  };
      
  useEffect(() => {
    brandData();
  },[]);

  // Convert measurements to mm
  function convertToMM(value, measure) {
    if (measure === "ft") return Number(value) * 304.8;
    if (measure === "inch") return Number(value) * 25.4;
    return Number(value);
  }

  // Map quote to input
 function mapQuoteToInput(quote = {}) {
  const data = quote.data || {};

  return {
    series: Number(quote.series?.replace(/\D/g, "")),
    shutterCount: Number(quote.shutterCount || 0),
	  FixedCount: Number(quote.fixedCount || 0),
    mesh: quote.mesh === "yes" ? "yes" : "no",
	  grill: quote.grill === "yes" ? "yes" : "no",
    bw: convertToMM(quote.boxWidth, quote.measure),
    bh: convertToMM(quote.boxHeight, quote.measure),
    qty: Number(quote.qty || 1),
    tfQty: Number(quote.topFixedNum || 0),
    bfQty: Number(quote.bottomFixedNum || 0),
    bfc: Number(quote.bottomnewHeights || 0),
    tfc: Number(quote.topnewHeights || 0),
    profile: quote.selectedProfile || "",
    item: quote.item || "",
    framename: data.frame?.name || "",
    Shuttername: data.shutter?.name || "",
    beedingname: data.beeding?.name || "",
    meshname: data.meshFrame?.name || "",
    mullionname: data.mullion?.name || "",
    glassname: data.glass?.name || "",
    glassCost: Number(data?.glassCost || 0),
    interlockname: data.interlock?.name || "",
    Bottom: quote?.bottomFrame === "yes" ? "yes" : "no" || "no"
  };
}


  // API call to get cutting schedule with standard fallback
  const getCuttingSchedule = async (profile, item) => {
    try {
      const response = await axios.post(
        "https://upvcapi.sninfoserv.com/cuttingSchedule/",
        { profile, item }
      );
      const data = response.data?.data;
      if (data && Array.isArray(data.calculations) && data.calculations.length > 0) {
        return data.calculations;
      }
    } catch (err) {
      // offline fallback
    }

    const defaultShutters = {};
    for (let i = 1; i <= 6; i++) {
      defaultShutters[i] = {
        no: { outerOffsetwidth: 0, outerOffsetheight: 0, sashOffsetheight: 45, sashOffsetwidth: 45, glassOffsetwidth: 85, glassOffsetheight: 85, beedingoffsetwidth: 20, beedingoffsetheight: 20, mullionOffsetheight: 40, interlockoffset: 30, topFixedOffset: 45, bottomFixedOffset: 45, sashOffsetheightwithbottom: 45 },
        yes: { outerOffsetwidth: 0, outerOffsetheight: 0, sashOffsetheight: 45, sashOffsetwidth: 45, glassOffsetwidth: 85, glassOffsetheight: 85, meshOffsetheight: 55, meshOffsetwidth: 55, beedingoffsetwidth: 20, beedingoffsetheight: 20, mullionOffsetheight: 40, interlockoffset: 30, topFixedOffset: 45, bottomFixedOffset: 45, sashOffsetheightwithbottom: 45 }
      };
    }

    return [
      { series: 60, shutters: defaultShutters },
      { series: 50, shutters: defaultShutters },
      { series: 88, shutters: defaultShutters }
    ];
  };


  // Fetch all seriesData from quote
  useEffect(() => {
    if (!quote?.quoteDetails?.length) return;

    async function fetchAllCalculations() {
      setLoading(true);
      const allSeriesData = [];

      for (const detail of quote.quoteDetails) {
        const input = mapQuoteToInput(detail.quoteData);
        const calculations = await getCuttingSchedule(input.profile, input.item);
        allSeriesData.push({ calculations });
      }

      setSeriesData(allSeriesData);
      setLoading(false);
    }

    fetchAllCalculations();
  }, [quote]);

  // WindowCalculator class for 1-to-1 mapping
  class WindowCalculator {
    constructor(seriesData) {
      this.seriesData = seriesData;
    }

    calculate({ series, shutterCount, FixedCount, mesh, grill, bw, bh, qty, tfQty, bfQty, bfc, tfc, profile, item, framename, Shuttername, beedingname, meshname, mullionname, glassname, glassCost, interlockname, Bottom }, windowIndex) {
      const meshKey = (mesh || "no").toLowerCase();

      // 1️⃣ Filter seriesData only by series
      let filteredSeries = [];
    
      const matched = this.seriesData[windowIndex]?.calculations?.filter(calc => calc.series === series || String(calc.series) === String(series)) || [];
      if (matched.length > 0) filteredSeries.push(...matched);
  
      if (filteredSeries.length === 0) {
        if (this.seriesData[windowIndex]?.calculations?.length > 0) {
          filteredSeries.push(this.seriesData[windowIndex].calculations[0]);
        } else {
          return null;
        }
      }

      const calc = filteredSeries[windowIndex % filteredSeries.length];
      if (!calc) return null;

      const count = shutterCount + FixedCount || 1;
      const shutterConfig = calc.shutters?.[count]?.[meshKey] || calc.shutters?.[1]?.[meshKey] || Object.values(calc.shutters || {})[0]?.[meshKey] || {};

      const outerOffsetWidth = Number(shutterConfig.outerOffsetwidth || 0);
      const outerOffsetHeight = Number(shutterConfig.outerOffsetheight || 0);
      const sashOffsetheight = Number(shutterConfig.sashOffsetheight || 0);
      const sashOffsetwidth = Number(shutterConfig.sashOffsetwidth || 0);
      const glassOffsetwidth = Number(shutterConfig.glassOffsetwidth || 0);
      const glassOffsetheight = Number(shutterConfig.glassOffsetheight || 0);
      const meshOffsetheight = Number(shutterConfig.meshOffsetheight || 0);
      const meshOffsetwidth = Number(shutterConfig.meshOffsetwidth || 0);
      const mullionOffset = Number(shutterConfig.mullionOffsetheight || 0);
      const interlockoffset = Number(shutterConfig.interlockoffset || 0);
      const topFixedOffset = Number(shutterConfig.topFixedOffset || 0);
      const bottomFixedOffset = Number(shutterConfig.bottomFixedOffset || 0);
      const sashOffsetheightwithbottomoffset = Number(shutterConfig.sashOffsetheightwithbottom || 0);
      const beedingoffsetwidth = Number(shutterConfig.beedingoffsetwidth || 0);
      const beedingoffsetheight = Number(shutterConfig.beedingoffsetheight || 0);


      const outerHeight = bh - outerOffsetHeight;
      const sashHeight =
      Bottom && Bottom === "yes"
        ? (bh - tfc - bfc) - sashOffsetheight
        : (bh - tfc - bfc) - sashOffsetheightwithbottomoffset;
      const glassHeight = (bh - tfc - bfc) - glassOffsetheight;
      const meshHeight = meshKey === "yes" ? (bh - tfc - bfc) - meshOffsetheight : 0;
      const topFixedHeight = tfc - topFixedOffset;
      const bottomFixedHeight = bfc - bottomFixedOffset;
      const interlockHeight = (bh - interlockoffset);
      const beedingHeight = 
            shutterCount === 1
            ? bh - beedingoffsetheight
            : (bh / (shutterCount+FixedCount)) - beedingoffsetheight;


      const outerWidth = bw - outerOffsetWidth;
      const mullionLength = (bh - tfc - bfc) - mullionOffset;
      const topFixedWidth = bw - topFixedOffset;
      const bottomFixedWidth = bw - bottomFixedOffset;
      
      const sashWidth = shutterCount === 1 ? bw - sashOffsetwidth : (bw / (shutterCount+FixedCount)) - sashOffsetwidth;
      const glassWidth =
          shutterCount === 1
            ? bw -  glassOffsetwidth
            : (bw / (shutterCount+FixedCount)) - glassOffsetwidth;
      const meshWidth =
          meshKey === "yes"
            ? shutterCount === 1
              ? bw - meshOffsetwidth
              : (bw / (shutterCount+FixedCount)) - meshOffsetwidth
            : 0;
      const beedingwidth = 
            shutterCount === 1
            ? bw - beedingoffsetwidth
            : (bw / (shutterCount+FixedCount)) - beedingoffsetwidth;

      return {
        outer: { 
          width: outerWidth, 
          widthQty: 2 * qty, 
          height: outerHeight, 
          heightQty: 2 * qty 
        },
        sash: { 
          width: sashWidth, 
          widthQty: 2 * shutterCount * qty, 
          height: sashHeight, 
          heightQty: 2 * shutterCount * qty 
        },
        mullion: {
          sash: {
            height: shutterCount -1 > 0 ? mullionLength : 0,
            reqQty: shutterCount -1
          },
          topFixed: {
            height: tfQty > 0 ? topFixedHeight : 0,
            heightQty: tfQty > 0 ? (tfQty-1) * qty : 0,
            width: tfQty > 0 ? topFixedWidth : 0,
            widthtQty: bfQty > 0 ? qty : 0
          },
          bottomFixed: {
            height: bfQty > 0 ? bottomFixedHeight : 0,
            heightQty: bfQty > 0 ? (bfQty-1) * qty : 0,
            width: bfQty > 0 ? bottomFixedWidth : 0,
            widthtQty: bfQty > 0 ? qty : 0
          }
        },
        beeding:{
          height: beedingHeight,
          width: beedingwidth,
          qty:(shutterCount+FixedCount) * qty
        },
        interlock:{
          height: interlockHeight,
        },
        meshPart: { 
          width: meshWidth, 
          widthQty: meshKey === "yes" ? 2 * shutterCount * qty : 0, 
          height: meshHeight, heightQty: meshKey === "yes" ? 2 * shutterCount * qty : 0 
        },
        glass: { 
          width: glassWidth, 
          height: glassHeight, 
          qty: (shutterCount+FixedCount) * qty 
        },
        seriesId: calc.series,
        Qty:qty,
        frameName: framename,
        shutterName: Shuttername,
        beedingName: beedingname,
        meshName: meshname,
        mullionName: mullionname,
        glassName: glassname,
        interlockName: interlockname,
        item:item,
        boxwidth:bw,
        boxheight:bh,
        Shuttercount:shutterCount,
        FixedCount:FixedCount,
        TopFixed:tfQty,
        TopFixedheight:tfc,
        bottomFixed:bfQty,
        bottomFixedheight:bfc,
        mesh:mesh,
        Grill:grill,
        glassCost: glassCost,
        profile: profile
      };
    }
  }

  if (loading) return <p>Loading cutting schedule...</p>;

    const calculator = new WindowCalculator(seriesData);

    // Map each window to its series calculation based on window index
    const results = (quote?.quoteDetails || []).map((detail, idx) => {
      const input = mapQuoteToInput(detail.quoteData);
      const calculation = calculator.calculate(input, idx);
      return { idx, calculation };
    });

    // console.log("results:", results);


  const format = val => (typeof val === "number" ? val.toFixed(2) : val);

  return (
  <div>
    {isStandalone && <Navbar />}
    <div className={isStandalone ? "pc-container" : ""}>
      <div className={isStandalone ? "pc-content" : ""}>
        {isStandalone && (
          <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
            <div>
              <h4 className="mb-1">Cutting Schedule</h4>
              <p className="text-muted mb-0">{quote?.client?.name || 'Client'} - {quote?.quote_id || quote?.uniqueId || ''}</p>
            </div>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => window.print()}
            >
              <i className="feather icon-printer me-2"></i> Print / Save PDF
            </button>
          </div>
        )}

        {!quote && isStandalone ? (
          <div className="card p-5 text-center">
            <h5>No Quotation Found</h5>
            <p className="text-muted">Please create a quotation or select one from the quotations list.</p>
            <a href="/quote" className="btn btn-outline-primary mx-auto" style={{ width: "200px" }}>
              View Quotations
            </a>
          </div>
        ) : (
          <div
            id="pdf-cutting-schedule"
            className={isStandalone ? "card p-4 bg-white shadow-sm" : "hide"}
            style={{
              maxWidth: isStandalone ? "100%" : "207mm",
              minWidth: isStandalone ? "100%" : "207mm",
              padding: "20px",
              margin: "0 auto"
            }}
          >

      {/* ================= HEADER TABLE ================= */}
      <table width="100%">
        <tbody>
          <tr>
            <td width="20%" style={{ textAlign: "left" }}>
              <img src="/assets/images/pari-logo.png" width='65px' height='65px' style={{ objectFit: 'contain' }} alt="Pari & Co Logo" />
            </td>

            <td width="60%" style={{ textAlign: "center" }}>
              <img 
                src={brandDatas && brandDatas[0]?.companyLogo && brandDatas[0]?.companyLogo !== 'user.png' ? `assets/user/${brandDatas[0].companyLogo}` : "/assets/images/pari-logo.png"} 
                height='55px' 
                style={{ objectFit: 'contain' }}
                alt="Company Logo"
              />
              <p>
                {brandDatas?.[0]?.companyName} <br />
                {brandDatas?.[0]?.companyAddress} <br />
                {brandDatas?.[0]?.companyContact}
              </p>
            </td>

            <td width="20%" style={{ textAlign: "right" }}>
              <img src={`assets/images/${profileImage}.jpg`} width='90px' alt="Logo" />
            </td>
          </tr>
        </tbody>
      </table>

      <hr />

      {/* ================= CLIENT INFO ================= */}
      <table width="100%">
        <tbody>
          <tr>
            <td width="50%">
              Client: {quote?.client?.name} <br />
              Location: {quote?.client?.location} <br />
              Contact: {quote?.client?.number}
            </td>
            <td width="50%" style={{ textAlign: "right" }}>
              Date: {quote?.date} <br />
              Quote No: {quote?.quoteId}
            </td>
          </tr>
        </tbody>
      </table>




      {/* ================= COLUMN HEADER ================= */}
      <table
        width="100%"
        style={{
          border: "1px solid #d4d4d4",
          borderCollapse: "collapse",
          tableLayout: "fixed"
        }}
      >
        <thead>
          <tr>
            <th width="5%" rowSpan={2} style={{ border: "1px solid #d4d4d4", fontSize: "12px" }}>S.No</th>
            <th width="16%" rowSpan={2} style={{ border: "1px solid #d4d4d4", fontSize: "12px" }}>Model</th>
            <th width="12%" rowSpan={2} style={{ border: "1px solid #d4d4d4", fontSize: "12px" }}>Frame</th>
            <th rowSpan={2} style={{ border: "1px solid #d4d4d4", fontSize: "12px" }}>Profile</th>
            <th width="15%" colSpan={2} style={{ border: "1px solid #d4d4d4", fontSize: "12px" }}>Width</th>
            <th width="15%" colSpan={2} style={{ border: "1px solid #d4d4d4", fontSize: "12px" }}>Height</th>
          </tr>

          <tr>
            <th style={{ border: "1px solid #d4d4d4", fontSize: "12px" }}>Size</th>
            <th width="3%" style={{ border: "1px solid #d4d4d4", fontSize: "12px" }}>Qty</th>
            <th style={{ border: "1px solid #d4d4d4", fontSize: "12px" }}>Size</th>
            <th width="3%" style={{ border: "1px solid #d4d4d4", fontSize: "12px" }}>Qty</th>
          </tr>

        </thead>
 

      {/* ================= EACH ITEM BLOCK ================= */}
      {results?.map(({ calculation }, i) => {

        if (!calculation) return null;

        return (
          
            <tbody>

              {/* FIRST ROW */}
              <tr>
                <td rowSpan={9} width="5%" style={{ border: "1px solid #d4d4d4", fontSize: "12px" }}>
                  {i + 1}
                </td>

                <td rowSpan={9} width="16%" style={{ border: "1px solid #d4d4d4", fontSize: "12px" }}>
                  <b>{calculation.item}</b><br />
                  {Number(calculation.boxwidth).toFixed(2)} x {Number(calculation.boxheight).toFixed(2)}<br/><br/>
                  <b>Quantity</b>: {calculation.Qty}<br/><br/>
                  <b>Profile</b><br/>
                  {calculation.profile}<br/><br/>
                  <b>Specifications</b> <br/>
                  Sash: {calculation.Shuttercount} <br/>
                  Fixed: {calculation.FixedCount} <br/>
                  Top Fixed: {calculation.TopFixed} <br/>
                  Bottom Fixed: {calculation.bottomFixed} <br/>
                  Mesh: {calculation.mesh} <br/>
                  Grill: {calculation.Grill} <br />
                  Glass: {calculation.glassCost ? 'Yes' : 'No'} <br />
                </td>

               

                <td style={{ border: "1px solid #d4d4d4", fontSize: "12px" }}>Outer Frame</td>
                <td style={{ border: "1px solid #d4d4d4", fontSize: "12px" }}>{calculation.frameName}</td>
                <td style={{ textAlign: "right", border: "1px solid #d4d4d4", fontSize: "12px" }}>{format(calculation.outer.width)}</td>
                <td style={{ textAlign: "center", border: "1px solid #d4d4d4", fontSize: "12px" }}>{calculation.outer.widthQty}</td>
                <td style={{ textAlign: "right", border: "1px solid #d4d4d4", fontSize: "12px" }}>{format(calculation.outer.height)}</td>
                <td style={{ textAlign: "center", border: "1px solid #d4d4d4", fontSize: "12px" }}>{calculation.outer.heightQty}</td>
              </tr>

              {/* SASH */}
              <tr>
                <td style={{ padding: "6px", fontSize: "12px", border: "1px solid #d4d4d4" }}>Sash</td>
                <td style={{ padding: "6px", fontSize: "12px", border: "1px solid #d4d4d4" }}>{calculation.shutterName}</td>
                <td style={{ textAlign: "right", border: "1px solid #d4d4d4", fontSize: "12px" }}>{format(calculation.sash.width > 0 ? calculation.sash.width : null)}</td>
                <td style={{ textAlign: "center", border: "1px solid #d4d4d4", fontSize: "12px" }}>{calculation.sash.widthQty > 0 ? calculation.sash.widthQty : null}</td>
                <td style={{ textAlign: "right", border: "1px solid #d4d4d4", fontSize: "12px" }}> {format(calculation.sash.height > 0 ? calculation.sash.height : null)}</td>
                <td style={{ textAlign: "center", border: "1px solid #d4d4d4", fontSize: "12px" }}>{calculation.sash.heightQty > 0 ? calculation.sash.heightQty : null}</td>
              </tr>

              {/* Beed */}
              <tr>
                <td style={{ padding: "6px", fontSize: "12px", border: "1px solid #d4d4d4" }}>Beeding</td>
                <td style={{ padding: "6px", fontSize: "12px", border: "1px solid #d4d4d4" }}>{calculation.beedingName}</td>
                <td style={{ textAlign: "right", border: "1px solid #d4d4d4", fontSize: "12px" }}>{format(calculation.beeding.width > 0 ? calculation.beeding.width : null)}</td>
                <td style={{ textAlign: "center", border: "1px solid #d4d4d4", fontSize: "12px" }}>{calculation.beeding.qty > 0 ? calculation.beeding.qty : null}</td>
                <td style={{ textAlign: "right", border: "1px solid #d4d4d4", fontSize: "12px" }}>{format(calculation.beeding.height > 0 ? calculation.beeding.height : null)}</td>
                <td style={{ textAlign: "center", border: "1px solid #d4d4d4", fontSize: "12px" }}>{calculation.beeding.qty > 0 ? calculation.beeding.qty : null}</td>
              </tr>

              {/* MESH */}
              <tr>
                <td style={{ padding: "6px", fontSize: "12px", border: "1px solid #d4d4d4", fontSize: "12px" }}>Mesh</td>
                <td style={{ padding: "6px", fontSize: "12px", border: "1px solid #d4d4d4", fontSize: "12px" }}>{calculation.meshName}</td>
                <td style={{ textAlign: "right", border: "1px solid #d4d4d4", fontSize: "12px" }}>{format(calculation.meshPart.width > 0 ? calculation.meshPart.width : null)}</td>
                <td style={{ textAlign: "center", border: "1px solid #d4d4d4", fontSize: "12px" }}>{calculation.meshPart.widthQty > 0 ? calculation.meshPart.widthQty : null}</td>
                <td style={{ textAlign: "right", border: "1px solid #d4d4d4", fontSize: "12px" }}>{format(calculation.meshPart.height > 0 ? calculation.meshPart.height : null)}</td>
                <td style={{ textAlign: "center", border: "1px solid #d4d4d4", fontSize: "12px" }}>{calculation.meshPart.heightQty > 0 ? calculation.meshPart.heightQty : null}</td>
              </tr>


              {/* Mullion */}
              <tr>
                <td style={{ padding: "6px", fontSize: "12px", border: "1px solid #d4d4d4" }}>Mullion</td>
                <td style={{ padding: "6px", fontSize: "12px", border: "1px solid #d4d4d4" }}>{calculation.mullionName}</td>
                <td style={{ textAlign: "right", border: "1px solid #d4d4d4", fontSize: "12px" }}> </td>
                <td style={{ textAlign: "center", border: "1px solid #d4d4d4", fontSize: "12px" }}></td>
                <td style={{ textAlign: "right", border: "1px solid #d4d4d4", fontSize: "12px" }}>{format(calculation.mullion.sash.height)}</td>
                <td style={{ textAlign: "center", border: "1px solid #d4d4d4", fontSize: "12px" }}>{calculation.mullion.sash.reqQty}</td>
              </tr>


               {/* TopFixed */}
              <tr>
                <td style={{ padding: "6px", fontSize: "12px", border: "1px solid #d4d4d4" }}>Top Fixed</td>
                <td style={{ padding: "6px", fontSize: "12px", border: "1px solid #d4d4d4" }}>{calculation.mullionName}</td>
                <td style={{ textAlign: "right", border: "1px solid #d4d4d4", fontSize: "12px" }}> {format(calculation.mullion.topFixed.width > 0 ? calculation.mullion.topFixed.width : null)} </td>
                <td style={{ textAlign: "center", border: "1px solid #d4d4d4" }}> {calculation.mullion.topFixed.widthQty > 0 ? calculation.mullion.topFixed.widthQty : null}</td>
                <td style={{ textAlign: "right", border: "1px solid #d4d4d4", fontSize: "12px" }}>{format(calculation.mullion.topFixed.height > 0 ? calculation.mullion.topFixed.height : null)}</td>
                <td style={{ textAlign: "center", border: "1px solid #d4d4d4", fontSize: "12px" }}>{calculation.mullion.topFixed.qty > 0 ? calculation.mullion.topFixed.qty : null}</td>
              </tr>


               {/* BottomFixed */}
              <tr>
                <td style={{ padding: "6px", fontSize: "12px", border: "1px solid #d4d4d4" }}>Bottom Fixed</td>
                <td style={{ padding: "6px", fontSize: "12px", border: "1px solid #d4d4d4" }}>{calculation.mullionName}</td>
                <td style={{ textAlign: "right", border: "1px solid #d4d4d4", fontSize: "12px" }}> {format(calculation.mullion.bottomFixed.width > 0 ? calculation.mullion.bottomFixed.width : null)}</td>
                <td style={{ textAlign: "center", border: "1px solid #d4d4d4" }}> {calculation.mullion.bottomFixed.widthQty > 0 ? calculation.mullion.bottomFixed.widthQty : null}</td>
                <td style={{ textAlign: "right", border: "1px solid #d4d4d4", fontSize: "12px" }}>{format(calculation.mullion.bottomFixed.height > 0 ? calculation.mullion.bottomFixed.height : null)} </td>
                <td style={{ textAlign: "center", border: "1px solid #d4d4d4", fontSize: "12px" }}>{calculation.mullion.bottomFixed.qty > 0 ? calculation.mullion.bottomFixed.qty : null}</td>
              </tr>


              {/* Interlock */}
              <tr>
                <td style={{ padding: "6px", fontSize: "12px", border: "1px solid #d4d4d4" }}>Interlock</td>
                <td style={{ padding: "6px", fontSize: "12px", border: "1px solid #d4d4d4" }}>{calculation.interlockName}</td>
                <td style={{ textAlign: "right", border: "1px solid #d4d4d4", fontSize: "12px" }}>{format(calculation.interlockName && calculation.interlock.width > 0 ? calculation.interlock.width : null)}</td>
                <td style={{ textAlign: "center", border: "1px solid #d4d4d4", fontSize: "12px" }}>{calculation.interlockName && calculation.interlock.qty > 0 ? calculation.interlock.qty : null}</td>
                <td style={{ textAlign: "right", border: "1px solid #d4d4d4", fontSize: "12px" }}>{format( calculation.interlockName && calculation.interlock.height > 0 ? calculation.interlock.height : null)} </td>
                <td style={{ textAlign: "center", border: "1px solid #d4d4d4", fontSize: "12px" }}>{calculation.interlockName && calculation.interlock.qty > 0 ? calculation.interlock.qty : null}</td>
              </tr>

              {/* GLASS */}
              <tr>
                <td style={{ padding: "6px", fontSize: "12px", border: "1px solid #d4d4d4" }}>Glass</td>
                <td style={{ padding: "6px", fontSize: "12px", border: "1px solid #d4d4d4" }}>{calculation.glassName}</td>
                <td colSpan={3}style={{ textAlign: "center", border: "1px solid #d4d4d4", fontSize: "12px" }}>{ format( calculation.glassCost && calculation.glass.width > 0 ? calculation.glass.width : null)} x {format(calculation.glassCost && calculation.glass.height > 0 ? calculation.glass.height : null)} </td>
                {/* <td style={{ textAlign: "center", border: "1px solid #d4d4d4" }}>{calculation.glass.qty > 0 ? calculation.glass.qty : null}</td> */}
                {/* <td style={{ border: "1px solid #d4d4d4" }}>{format(calculation.glass.height > 0 ? calculation.glass.height : null)}</td> */}
                <td style={{ textAlign: "center", border: "1px solid #d4d4d4", fontSize: "12px" }}>{calculation.glassCost && calculation.glass.qty > 0 ? calculation.glass.qty : null}</td>
              </tr>

              {/* NOTES */}
              <tr>
                <td colSpan={8} style={{
                  border: "1px solid #d4d4d4",
                  padding: "10px",
                  paddingBottom: "50px"
                }}>
                  Notes
                </td>
              </tr>

            </tbody>
        );
      })}

          </table>
        </div>
      )}
      </div>
    </div>
  </div>
  );
}
