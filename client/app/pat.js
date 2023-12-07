
'use client';

import { useState, useEffect } from 'react';
import convertBitrate from './utils/convertBitrate';


function Properties({ data }) {
    let serviceId = data.service_id;
    let node = data;

    return (Object.keys(node).map(k => {

        return k !== "#nodes" && k !== "#name" && node[k] !== "component" ? (
            <li key={"pat_table_prop_" + serviceId + "_" + k} className='prop'>{k}: {node[k].toString()} </li>) : null
    })

    )

}


function renderTable (data) {
    if (!data) {
        return null;
    }

    let tablePid = data["program_map_pid"] ? data["program_map_pid"] : null;

    //Get Serivce ID of the PMT
    let serviceId = data["service_id"] !== null ? data["service_id"] : null;

    return (

        <li key={"pat_table_" + serviceId}>
            <details>
                <summary>Program {serviceId}</summary>
                <ul>
                    <li className='prop'> PMT PID {tablePid}

                    </li>
                </ul>
            </details>
        </li>


    )

};


function Pat({ data }) {


    var [patTable, setTable] = useState(data.pat);


    useEffect(() => {
        setTable(data.pat); 
    }, [data.pat]);





    if (patTable && Object.keys(patTable).length > 0) {
        //let bitrate = Intl.NumberFormat('en-US', { style: 'unit', unit: "kilobit-per-second", maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(patTable["#nodes"][0]["bitrate"])
        const bitrate = convertBitrate(patTable["#nodes"][0]["bitrate"])
        return (
            !!patTable["#name"] ?

                <ul className="tree">
                    <li>
                        <details>
                            <summary>{patTable["#name"]} - {bitrate}</summary>
                            <ul>
                                {patTable["#nodes"].map((k, i) => (i !== 0 ? renderTable(k) : null))}

                                <Properties data={patTable} />

                            </ul>
                        </details>
                    </li>

                </ul>

                : null)
    } else {
      /*  return (

            <ul className="tree">
                <li>
                    <details>
                        <summary>PAT - 0 kb/s</summary>
                    </details>
                </li>

            </ul>
        )*/
    };
}






export default Pat;
