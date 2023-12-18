
'use client'
import { useState, useEffect } from 'react';
//import convertBitrate from './utils/convertBitrate';


function Properties({ data }) {
    let serviceId = data.service_id;
    let node = data;

    return (Object.keys(node).map(k => {

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
    );

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


function Sdt({data}) {


    var [sdtTable, setTable] = useState(data.sdt);


    useEffect(() => {
        setTable(data.sdt); // Update nitTable when allTables changes
    }, [data.sdt]);

   
    if (sdtTable && Object.keys(sdtTable).length > 0) {
        
        //const bitrate = convertBitrate(sdtTable["#nodes"][0]["bitrate"])
        const bitrate = sdtTable["#nodes"][0]["bitrate"];
        return (

            <ul className="tree">
                <li>
                    <details>
                        <summary>{sdtTable["#name"]} - {bitrate} </summary>
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

            </ul>

        );
    }  else {
       /* return (

            <ul className="tree">
                <li>
                    <details>
                        <summary>SDT - 0 kb/s</summary>
                    </details>
                </li>

            </ul>
        )*/
    };
}






export default Sdt;
