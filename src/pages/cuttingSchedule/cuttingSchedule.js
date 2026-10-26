import React, { useEffect, useState } from "react";
import axios from "axios";

const NewCuttingSchedule = ({quote}) => {


    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    // console.log("Rendering NewCuttingSchedule with quote:", quote);

    const parseCalculations = (text) => {
        return Function(`return ${text}`)();
    };

    const getCuttingSchedule = async (profile, item) => {
        const response = await axios.post(
            "https://upvcapi.sninfoserv.com/cuttingSchedule/",
            { profile, item }
        );

        if (response?.data?.status === "success") {
            return parseCalculations(response?.data?.data?.calculations);
        }else{
            return [];
        }

        throw new Error("API error");
    };

    function getSeriesConfig(cuttingCalc, series) {
        const config = cuttingCalc.find(c => c.series === series);
        if (!config) {
            throw new Error(`Unknown series: ${series}`);
        }
        return config.calc;
    }

    async function getCalc(quote) {
        const cuttingCalc = await getCuttingSchedule(
            quote.profile,
            quote.item
        );

        if(!cuttingCalc || cuttingCalc.length === 0){
            return { ...quote, result: null  };
        }

        const calc = getSeriesConfig(cuttingCalc, quote.series);

        return {
            ...quote,
            result: {
                outer: {
                    height: calc.outer.height(
                        quote.boxWidth,
                        quote.boxHeight,
                        quote.shutterCount
                    ),
                    width: calc.outer.width(
                        quote.boxWidth,
                        quote.boxHeight,
                        quote.shutterCount
                    )
                },
                sash: {
                    height: calc.sash.height(
                        quote.boxWidth,
                        quote.boxHeight,
                        quote.shutterCount
                    ),
                    width: calc.sash.width(
                        quote.boxWidth,
                        quote.boxHeight,
                        quote.shutterCount
                    )
                },
                mullion: calc.mullion(
                    quote.boxWidth,
                    quote.boxHeight,
                    quote.shutterCount
                ),
                glass: {
                    height: calc.glass.height(
                        quote.boxWidth,
                        quote.boxHeight,
                        quote.shutterCount
                    ),
                    width: calc.glass.width(
                        quote.boxWidth,
                        quote.boxHeight,
                        quote.shutterCount
                    )
                }
            }
        };
    }

    const itemData = () => {
        return quote?.quoteDetails?.map((item) => {
            const itemData = item?.quoteData;

            let boxWidthMM = 0;
            let boxHeightMM = 0;

            if (itemData?.measure === 'ft') {
                boxWidthMM = Number(itemData?.boxWidth) * 304.76;
                boxHeightMM = Number(itemData?.boxHeight) * 304.76;
            } else if (itemData?.measure === 'inch') {
                boxWidthMM = Number(itemData?.boxWidth) * 25.4;
                boxHeightMM = Number(itemData?.boxHeight) * 25.4;
            } else if (itemData?.measure === 'mm') {
                boxWidthMM = Number(itemData?.boxWidth);
                boxHeightMM = Number(itemData?.boxHeight);
            }

            return {
                boxWidth: Number(boxWidthMM.toFixed(2)),
                boxHeight: Number(boxHeightMM.toFixed(2)),
                shutterCount: itemData?.shutterCount,
                series: Number(itemData?.series?.match(/\d+/)?.[0] || 0),
                profile: itemData?.selectedProfile,
                item: itemData?.item,
                qty: itemData?.qty,
                fixedCount: itemData?.fixedCount || 0,
                mesh: itemData?.mesh || 'no'
            };
        }) || [];
    };



    useEffect(() => {
        const calculateAll = async () => {
            console.log("Calculating cutting schedules for quote:", quote);
            try {
                const quoteData = itemData();
                // console.log("Item data for calculations:", quoteData);
                const calculated = await Promise.all(
                    quoteData.map(q => getCalc(q))
                );
                // console.log("Calculated cutting schedules:", calculated);
                setResults(calculated);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        calculateAll();
    }, [quote]);

    console.log("Cutting Schedule Results:", results);


    return (
        <div className='hide1 p-4' id="pdf-schedule" style={{background: '#fff'}}>
            <div className="row m-4">
                <div className="col-12 text-center">
                    <h5>Cutting Schedule</h5>
                </div>
                <div className="col-6" style={{textAlign: 'left', border: '1px solid black', padding: '10px'}}>
                    <p style={{fontSize: '13px'}}>
                        Name : <strong>{quote?.client?.name}</strong> <br />
                        Place : <strong>{quote?.client?.location}</strong> <br />
                        Phone : <strong>{quote?.client?.number}</strong> <br />
                    </p>
                </div>
                <div className="col-6" style={{textAlign: 'right', border: '1px solid black', borderLeft: 'none', padding: '10px'}}>
                    <p style={{fontSize: '13px'}}   >
                        Date : <strong>{quote?.date}</strong> <br />
                        ID : <strong>{quote?.quoteId}</strong> <br />
                        Items : <strong>{quote?.items}</strong> <br />
                    </p>
                </div>
            </div>

            <div className="row m-4">
                <table className="" style={{ width: "100%", border: "1px solid black", borderCollapse: "collapse" }}>
                    <thead className="text-center" style={{fontSize: '12px'}}>
                        <tr>
                            <th rowSpan={2} style={{border: '1px solid #000'}} width="5%">S.No</th>
                            <th rowSpan={2} style={{border: '1px solid #000'}}>Item</th>
                            <th rowSpan={2} style={{border: '1px solid #000'}} width="8%">Qty</th>
                            <th rowSpan={2} style={{border: '1px solid #000'}}>Profile</th>
                            <th colSpan={2} style={{border: '1px solid #000'}} width="18%">Width</th>
                            <th colSpan={2} style={{border: '1px solid #000'}} width="18%">Height</th>
                        </tr>
                        <tr>
                            <th style={{border: '1px solid #000'}}>Length</th>
                            <th style={{border: '1px solid #000'}}>Qty</th>
                            <th style={{border: '1px solid #000'}}>Length</th>
                            <th style={{border: '1px solid #000'}}>Qty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((item, index) => (
                            <>
                            <tr key={index} className="text-center" style={{fontSize: '12px'}}>
                                <td rowSpan={item?.mesh === 'yes' ? 6 : 5} style={{border: '1px solid #000'}}>{index + 1}</td>
                                <td rowSpan={item?.mesh === 'yes' ? 6 : 5} style={{border: '1px solid #000'}}>
                                    {item?.item}<br /> 
                                    {item?.boxWidth} x {item?.boxHeight} <br />
                                    Shutters: {item?.shutterCount} <br />
                                    Series: {item?.series} <br />
                                    Profile: {item?.profile}
                                </td>
                                <td rowSpan={item?.mesh === 'yes' ? 6 : 5} style={{border: '1px solid #000'}}>{item?.qty || ''}</td>
                                <td style={{border: '1px solid #000', textAlign: 'left'}}>Outer Frame</td>
                                <td style={{border: '1px solid #000'}}>{item?.result?.outer?.width}</td>
                                <td style={{border: '1px solid #000'}}>{item?.qty * 2 || ''}</td>
                                <td style={{border: '1px solid #000'}}>{item?.result?.outer?.height}</td>
                                <td style={{border: '1px solid #000'}}>{item?.qty * 2 || ''}</td>
                            </tr>
                            <tr key={index} className="text-center" style={{fontSize: '12px'}}>
                                <td style={{border: '1px solid #000', textAlign: 'left'}}>Sash</td>
                                <td style={{border: '1px solid #000'}}>{item?.result?.sash?.width}</td>
                                <td style={{border: '1px solid #000'}}>{item?.qty * 2 || ''}</td>
                                <td style={{border: '1px solid #000'}}>{item?.result?.sash?.height}</td>
                                <td style={{border: '1px solid #000'}}>{item?.qty * 2 || ''}</td>
                            </tr>
                            <tr key={index} className="text-center" style={{fontSize: '12px'}}>
                                <td style={{border: '1px solid #000', textAlign: 'left'}}>Mullion</td>
                                <td style={{border: '1px solid #000'}}></td>
                                <td style={{border: '1px solid #000'}}></td>
                                <td style={{border: '1px solid #000'}}>{item?.result?.mullion}</td>
                                <td style={{border: '1px solid #000'}}>{item?.shutterCount - 1 || ''}</td>
                            </tr>
                            <tr key={index} className="text-center" style={{fontSize: '12px'}}>
                                <td style={{border: '1px solid #000', textAlign: 'left'}}>Glass</td>
                                <td style={{border: '1px solid #000'}}></td>
                                <td style={{border: '1px solid #000'}}></td>
                                <td style={{border: '1px solid #000'}}>{item?.result?.mullion}</td>
                                <td style={{border: '1px solid #000'}}>{item?.shutterCount + item?.fixedCount - 1 || ''}</td>
                            </tr>
                            <tr key={index} className="text-center" style={{fontSize: '12px'}}>
                                <td style={{border: '1px solid #000', textAlign: 'left'}}>Beading</td>
                                <td style={{border: '1px solid #000'}}>{item?.result?.beading?.width}</td>
                                <td style={{border: '1px solid #000'}}>{item?.qty * 2 || ''}</td>
                                <td style={{border: '1px solid #000'}}>{item?.result?.beading?.height}</td>
                                <td style={{border: '1px solid #000'}}>{item?.qty * 2 || ''}</td>
                            </tr>
                            {item?.mesh === 'yes' && (
                                <tr key={index} className="text-center" style={{fontSize: '12px'}}>
                                    <td style={{border: '1px solid #000', textAlign: 'left'}}>Mesh</td>
                                    <td style={{border: '1px solid #000'}}>{item?.result?.mesh?.width}</td>
                                    <td style={{border: '1px solid #000'}}>{item?.qty * 2 || ''}</td>
                                    <td style={{border: '1px solid #000'}}>{item?.result?.mesh?.height}</td>
                                    <td style={{border: '1px solid #000'}}>{item?.qty * 2 || ''}</td>
                                </tr>
                            )}
                            <tr>
                                <td colSpan={8} style={{border: '1px solid #000', padding: '5px 5px 70px'}}>Notes</td>
                            </tr>
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NewCuttingSchedule;
