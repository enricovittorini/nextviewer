
'use client'
import { useState, useEffect } from 'react';
import convertBitrate from './utils/convertBitrate';


function Properties({ data }) {
    let serviceId = data.service_id;
    let node = data;

    return (Object.keys(node).map(k => {

        return k !== "#nodes" && k !== "#name" && node[k] !== "component" ? (
            <li key={"pmt_table_prop_" + serviceId + "_" + k}>{k}: {node[k].toString()}</li>) : null
    })

    )

}


function Descriptor({ des }) {

    return (

        <details><summary>{des["#name"]}</summary>
            <ul>
                <Properties data={des} />
            </ul>
        </details>


    );

}



function Bat({ data }) {

    var [batTable, setTable] = useState(data.bat);


    useEffect(() => {
        setTable(data.bat); // Update nitTable when allTables changes
    }, [data.bat]);

    if (batTable && Object.keys(batTable).length > 0) {
        //let bitrate = Intl.NumberFormat('en-US', { style: 'unit', unit: "kilobit-per-second", maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(batTable["#nodes"][0]["bitrate"])
        const bitrate = convertBitrate(batTable["#nodes"][0]["bitrate"]);
        return (

            <ul className="tree">
                <li key="bat">
                    <details>
                        <summary>{batTable["#name"]} - {bitrate} </summary>
                        <ul>
                            {batTable["#nodes"].map((k, i) => (
                                i !== 0 ? (
                                    <li key={i}>

                                        <Descriptor des={k} />
                                    </li>
                                ) : null
                            ))}

                            <Properties data={batTable} />
                        </ul>
                    </details>
                </li>

            </ul>

        )
    } else {
        /* return (
 
             <ul className="tree">
                 <li>
                     <details>
                         <summary>BAT - 0 kb/s</summary>
                     </details>
                 </li>
 
             </ul>
         )*/
    };
}






export default Bat;
