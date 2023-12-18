
'use client';

import React,{ useState, useEffect, useMemo } from 'react';


function Properties({ data }) {
    if (!data) {
        return null;
    }

    console.log("Prop re-render")
    
    let serviceId = data?.service_id;
    let node = data;

    return (Object.keys(node).map(k => {

        return k !== "#nodes" && k !== "#name" && node[k] !== "component" ? (
            <li key={"pat_table_prop_" + serviceId + "_" + k} className='prop'>{k}: {node[k].toString()} </li>) : null
    })

    )

}


function renderTable(data) {

   
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

function TableName({ pids }) {
    const [bitrate, setBitrate] = useState(0);
    useEffect(() => {
        setBitrate(pids?.find(k => k.id === 0).bitrate || "0 Kb/s");
    }, [pids])

    return (
        <>
            <summary>PAT - {bitrate}</summary>
        </>
    )
}

const PropertiesChild = React.memo(Properties);

function Pat({ data, pids }) {

   
    const [patTable, setTable] = useState(data.pat);
    //const [bitrate, setBitrate] = useState(0);

    /*const patTable =  useMemo(() => {
        return data.pat
    }, [data.pat])*/

  
    

    useEffect(() => {
        setTable(data.pat);
        
    }, [data.pat]);


    const memoValue = useMemo(() => (patTable), [data.pat]);

    if (patTable && Object.keys(patTable).length > 0) {

        //const bitrate = patTable["#nodes"][0]["bitrate"];
        return (
            !!patTable["#name"] ?

                <ul className="tree">
                    <li>
                        <details>
                            {/*<summary>{patTable["#name"]} - {bitrate}</summary>*/}
                            <TableName pids={pids} />

                            <ul>
                                {patTable["#nodes"].map((k, i) => (i !== 0 ? renderTable(k) : null))}

                                <PropertiesChild data={memoValue} />

                            </ul>
                        </details>
                    </li>

                </ul>

                : null)
    } 
}


export default Pat;
