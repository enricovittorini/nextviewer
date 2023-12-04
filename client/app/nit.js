
'use client'
import { useState, useEffect } from 'react';
import convertBitrate from './utils/convertBitrate';
import { getServiceTypeHuman } from './serviceType';


function Properties({ data }) {

    return (
        <>
            {Object.keys(data).map((k, idx) => {

                //This is to get the Type of service in human readible format in case i find service_type key.
                let serviceType = null;
                if (k === "service_type") {
                     serviceType = getServiceTypeHuman(data[k]);
                }

                return k !== "#nodes" && k !== "#name" && data[k] !== "component" ? (
                    <li key={"nit_table_prop_" + idx} className='prop'>
                        {k}: {data[k].toString() } {serviceType}
                    </li>)
                    : null
            })}
        </>
    )
}

function NitTs({ data }) {

    let b = data["#nodes"] ? data["#nodes"].filter(k => k.preferred_section != null) : null;
    b.sort((a, b) => a.transport_stream_id - b.transport_stream_id);
    const uniqueSection = [...new Set(b.map(item => item.preferred_section))];
    const uniqueSectionNum = uniqueSection.length;


    if (b !== null) {
        return (
            <>
                {uniqueSection.map((k, index) => (
                    <li key={`section$-${k}-${index}`}><details>
                        <summary>Network Info Section {index + 1} / {uniqueSectionNum} </summary>
                        <ul>
                            {b.map((x, idx) => (
                                <li key={idx}>
                                    <details>
                                        <summary>{x["#name"]}  {x["transport_stream_id"]}</summary>
                                        <ul>
                                            <Properties data={x} />

                                            {x["#nodes"] && x["#nodes"].map((k, subIndex) => (

                                                <li key={`subSection-${subIndex}`}>
                                                    <details>
                                                        <summary>{k["#name"]}</summary>
                                                        <ul>
                                                            <Properties data={k} />

                                                            {k["#nodes"] && k["#nodes"].map((z, zIndex) => (
                                                                <li key={`subSection-${zIndex}`}>
                                                                    <details>
                                                                        <summary>{z["#name"] || "private"}</summary>
                                                                        <ul>
                                                                            <Properties data={z} />
                                                                        </ul>
                                                                    </details>
                                                                </li>
                                                            ))}

                                                        </ul>
                                                    </details>
                                                </li>

                                            ))}
                                        </ul>
                                    </details>

                                </li>
                            ))}
                        </ul>
                    </details>
                    </li>
                ))}
            </>
        );
    } else {
        return null;
    }
}


const renderTable = (data) => {
    if (!data) {
        return null;
    }


    if (data["#name"] !== "metadata" && data["#name"] !== "transport_stream") {
        return (

            <details>
                <summary>{data["#name"]}</summary>
                <ul>
                    <Properties data={data} />
                </ul>
            </details>

        )

    }






};


function Nit({ data }) {

    var [nitTable, setNitTable] = useState(data.nit);

    const service = data.service;


    useEffect(() => {
        setNitTable(data.nit); // Update nitTable when allTables changes
    }, [data.nit]);



    if (nitTable && Object.keys(nitTable).length > 0) {
        // let bitrate = Intl.NumberFormat('en-US', { style: 'unit', unit: "kilobit-per-second", maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(nitTable["#nodes"][0]["bitrate"])
        const bitrate = convertBitrate(nitTable["#nodes"][0]["bitrate"])
        return (

            <ul className="tree">
                <li key="nit">
                    <details>
                        <summary>{nitTable["#name"]} - {bitrate}</summary>

                        <ul key="nit_network_info">
                            {nitTable["#nodes"].map((k, i) => (
                                i !== 0 ? (
                                    <li key={i}>
                                        {renderTable(k)}
                                    </li>
                                ) : null
                            ))}
                            <NitTs data={nitTable} />
                            <Properties data={nitTable} />
                        </ul>

                    </details>
                </li>

            </ul>

        );
    } else {
        <></>
        /*return (

            <ul className="tree">
                <li>
                    <details>
                        <summary>NIT - 0 kb/s</summary>
                    </details>
                </li>

            </ul>
        )*/
    };
}






export default Nit;