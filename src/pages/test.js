import React, { useState, useMemo } from "react";

const seriesData = [
  {
    series: 60,
    shutters: {
      "1": {
        yes: { outerOffset: 0, sashOffset: 66, glassOffset: 57, mullionOffset: 0, meshOffset: 66, topFixedOffset: 10, bottomFixedOffset: 10 },
        no: { outerOffset: 0, sashOffset: 60, glassOffset: 58, mullionOffset: 0, meshOffset: 0, topFixedOffset: 10, bottomFixedOffset: 10 }
      },
      "2": {
        yes: { outerOffset: 0, sashOffset: 70, glassOffset: 50, mullionOffset: 0, meshOffset: 70, topFixedOffset: 10, bottomFixedOffset: 10},
        no: { outerOffset: 0, sashOffset: 65, glassOffset: 55, mullionOffset: 0, meshOffset: 0, topFixedOffset: 10, bottomFixedOffset: 10 }
      },
      "3": {
        yes: { outerOffset: 0, sashOffset: 70, glassOffset: 50, mullionOffset: 0, meshOffset: 70, topFixedOffset: 10, bottomFixedOffset: 10 },
        no: { outerOffset: 0, sashOffset: 65, glassOffset: 55, mullionOffset: 0, meshOffset: 0, topFixedOffset: 10, bottomFixedOffset: 10 }
      }
    }
  },
  { series: 50, shutters: {} },
  { series: 70, shutters: {} },
  { series: 80, shutters: {} }
];

// ============================
// Calculation Engine
// ============================

class WindowCalculator {
  constructor(seriesData) {
    this.seriesMap = new Map();
    seriesData.forEach(s => {
      this.seriesMap.set(s.series, s.shutters);
    });
  }

  calculate({ series, shutterCount, mesh, bw, bh, qty, tfQty, tfc, bfQty, bfc}) {
    const shutterConfig =
      this.seriesMap.get(series)?.[shutterCount]?.[mesh];

    if (!shutterConfig) {
      return { error: "Configuration not defined for this combination" };
    }

    const {
      outerOffset = 0,
      sashOffset = 0,
      glassOffset = 0,
      mullionOffset = 0,
      meshOffset = 0,
      topFixedOffset = 0,
      bottomFixedOffset = 0
    } = shutterConfig;

    const outerHeight = bh- outerOffset;
    const sashHeight = (bh - tfc - bfc) - sashOffset;
    const glassHeight = (bh - tfc - bfc) - sashOffset - glassOffset;
    const meshHeight = mesh === "yes" ? (bh - tfc - bfc) - meshOffset : 0;
    const topFixedHeight = tfc - topFixedOffset;
    const bottomFixedHeight = bfc - bottomFixedOffset;

    const outerWidth = bw - outerOffset;
    const mullionLength = (bh - tfc - bfc) - mullionOffset;
    const topFixedWidth = bw - topFixedOffset;
    const bottomFixedWidth = bw - bottomFixedOffset;

    const sashWidth =
      shutterCount === 1
        ? bw - sashOffset
        : (bw - sashOffset) / shutterCount;

    const glassWidth =
      shutterCount === 1
        ? bw - sashOffset - glassOffset
        : (bw - sashOffset - glassOffset) / shutterCount;

    const meshWidth =
      mesh === "yes"
        ? shutterCount === 1
          ? bw - meshOffset
          : (bw - meshOffset) / shutterCount
        : 0;

    return {
      outer: { 
        height: outerHeight, 
        heightQty: 2 * qty,
        width: outerWidth,
        widthtQty: 2 * qty, 
      },
      sash: { 
        height: sashHeight, 
        heightQty: 2 * shutterCount * qty,
        width: sashWidth,
        widthtQty: 2 * shutterCount * qty 
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
      meshPart:
        mesh === "yes"
          ? { 
            height: meshHeight, 
            heightQty: 2 * shutterCount * qty,
            width: meshWidth,
            widthtQty: 2 * shutterCount * qty
          }
          : null,
      glass: { 
        height: glassHeight, 
        width: glassWidth,
        reqQty: shutterCount * qty, 
      },
      
    };
  }
}

const calculator = new WindowCalculator(seriesData);

// ============================
// React Component
// ============================

export default function App() {
  const [series, setSeries] = useState(60);
  const [shutterCount, setShutterCount] = useState(1);
  const [mesh, setMesh] = useState("yes");
  const [bw, setBw] = useState(2000);
  const [bh, setBh] = useState(1500);
  const [qty, setQty] = useState(1);
  const [tfQty, setTfQty] = useState(0);
  const [bfQty, setBfQty] = useState(0);
  const [bfc, setBfc] = useState(0);
  const [tfc, setTfc] = useState(0);

  const result = useMemo(() => {
    return calculator.calculate({
      series,
      shutterCount,
      mesh,
      bw,
      bh,
      qty,
      tfQty,
      tfc,
      bfQty,
      bfc
    });
  }, [series, shutterCount, mesh, bw, bh, qty, tfQty, tfc, bfQty, bfc]);

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h2>Window Calculator (React)</h2>

      <div style={{ display: "grid", gap: 10, maxWidth: 300 }}>

        <label>
          Series
          <select value={series} onChange={e => setSeries(Number(e.target.value))}>
            <option value={50}>50</option>
            <option value={60}>60</option>
            <option value={70}>70</option>
            <option value={80}>80</option>
          </select>
        </label>

        <label>
          Shutter Count
          <select value={shutterCount} onChange={e => setShutterCount(Number(e.target.value))}>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>

        <label>
          Mesh
          <select value={mesh} onChange={e => setMesh(e.target.value)}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>

        <label>
          Base Width
          <input type="number" value={bw} onChange={e => setBw(Number(e.target.value))} />
        </label>

        <label>
          Base Height
          <input type="number" value={bh} onChange={e => setBh(Number(e.target.value))} />
        </label>

        <label>
          Window Qty
          <input type="number" value={qty} onChange={e => setQty(Number(e.target.value))} />
        </label>

        <label>
          Top Fixed Size
          <input type="number" value={tfc} onChange={e => setTfc(Number(e.target.value))} />
        </label>

         <label>
          Top Fixed Partitian
          <input type="number" value={tfQty} onChange={e => setTfQty(Number(e.target.value))} />
        </label>

        <label>
          Bottom Fixed Size
          <input type="number" value={bfc} onChange={e => setBfc(Number(e.target.value))} />
        </label>

         <label>
          Bottom Fixed Partitian
          <input type="number" value={bfQty} onChange={e => setBfQty(Number(e.target.value))} />
        </label>

      </div>

      <h3>Result</h3>
      <pre style={{ background: "#f4f4f4", padding: 15 }}>
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}
