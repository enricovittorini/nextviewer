
'use client'
import { useState, useEffect } from 'react';


function Properties({ data }) {
    let serviceId = data.service_id;
    let node = data;

    return (
        Object.keys(node).map(k => {

            return k !== "#nodes" && k !== "#name" && node[k] !== "component" ? (
                <li key={"pmt_table_prop_" + serviceId + "_" + k} className='prop'>{k}: {node[k].toString()}</li>) : null
        })

    )

}


function Descriptor({ des }) {

    return (
        des && des.map((k, index) => (

            <li key={index}>
                <details><summary>{k["#name"]}</summary>
                    <ul>
                        <Properties data={k} />
                    </ul>
                </details>
            </li>
        ))
    )

}




const renderTable = (data) => {

    if (!data || !data["#nodes"]) {
        return null;
    }

    //Get Serivce ID of the PMT
    const serviceId = data["service_id"] !== null ? data["service_id"] : null;
    const serviceName = data["#name"] !== "metadata" ? data["#nodes"].map(obj => obj.service_name) : null;

    return (

        <li key={"sdt_table_" + serviceId}>
            <details>
                <summary>Program {serviceId} - {serviceName}</summary>
                <ul>
                    {/* SDT properties */}
                    <Properties data={data} />

                    {/* SDT descriptors */}
                    <Descriptor des={data["#nodes"]} />

                </ul>
            </details>
        </li>

    )

};


function SdtOther({ data }) {

    var [sdtOther, setTable] = useState(data.sdtOther);


    useEffect(() => {
        setTable(data.sdtOther); // Update nitTable when allTables changes
    }, [data.sdtOther]);


    if (sdtOther && Object.keys(sdtOther).length > 0) {
        return (
            <ul className="tree">
                <li>
                    <details>
                        <summary>SDT Other</summary>
                        <ul>
                            {
                                sdtOther.length > 0 ? sdtOther.map(sdtId => {

                                    const sdtTable = sdtId;
                                    const tsId = sdtId.transport_stream_id;
                                    const tsOnId = sdtId.original_network_id;

                                    return (

                                        <li key={tsOnId + "_" + tsId}>

                                            <details>
                                                <summary>{`OnId: ${tsOnId} - TS Id: ${tsId}`}</summary>
                                                <ul>
                                                    {sdtTable["#nodes"].map((k, i) => {
                                                        if (i !== 0) {
                                                            return renderTable(k)
                                                        } else return null
                                                    })}

                                                    <Properties data={sdtTable} />
                                                </ul>
                                            </details>
                                        </li>

                                    );
                                }
                                ) : null
                            }
                        </ul>
                    </details>
                </li>
            </ul>
        )
    }else {
       /* return (

            <ul className="tree">
                <li>
                    <details>
                        <summary>SDT Other</summary>
                    </details>
                </li>

            </ul>
        )*/
    };

}






export default SdtOther;
