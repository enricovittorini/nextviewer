
'use client'
import { useState, useEffect } from 'react';
import getEsIcon from '../lib/getEsIcon'

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

    return des !== undefined ? (
        des.map((k, index) => (

            k["#nodes"] !== undefined ? /* Check if the component has descriptors */
                <li key={index}>
                    <details><summary>{k["#name"]}</summary>

                        <DescriptorProperties data={k["#nodes"]} />

                    </details>
                </li> : null
        ))
    ) : null;

}


function ProgramInfoDescriptor({ des }) {

    return des !== undefined ? (
        des.map((k, index) => (


            k["#name"] !== "component" && k["#name"] !== "metadata" ?
                <li key={index} >
                    <details><summary>{k["#name"]}</summary>
                        <ul>
                            <Properties data={k} />
                        </ul>
                    </details>
                </li> : null

        ))
    ) : null;

}



function DescriptorProperties({ data }) {

    return (
        <ul>
            {data.map((k, index) => (

                Object.keys(k).map((x, i) => (
                    x !== "#name" ? (
                        <li key={"pmt_table_desc_prop_" + i + "_" + x} className='prop'>
                            {x}: {k[x].toString()}
                        </li>
                    ) : null
                ))

            ))}
        </ul>
    );





}


function Component({ comp }) {

    return (

        comp.map(k => {
            // Elementary Stream Icon
            let icon = getEsIcon(k.stream_type);

            return (
                k["#name"] === "component" ? (

                    <li key={"pmt_comp_" + k.elementary_pid} >
                        <details>
                            <summary> <i className={icon}></i> {k.elementary_pid}</summary>
                            <ul>

                                <li key={"pmt_comp_" + + k.elementary_pid + "_" + k.stream_type} className='prop'>stream_type: {k.stream_type}</li>

                                {k["#nodes"] !== undefined ?
                                    <Descriptor des={k["#nodes"]} />
                                    : null}

                            </ul>
                        </details>
                    </li>
                )
                    : null
            )

        })


    )

}


/* renderTable get one PMT in input as "data" */
function renderTable(data, service) {
    if (!data || !data["#nodes"]) {
        return null;
    }



    delete data["#name"]
    let nodes = data["#nodes"];

    //PMT PID from #metadata
    let pidIndex = nodes.findIndex(k => k["#name"] === "metadata");
    let tablePid = nodes[pidIndex]["pid"];

    //Serivce ID of the PMT
    let serviceId = data["service_id"] ?? null;
    let serviceName = service?.name ?? "Unknown";


    //PMT bitrate
    //var pmtbitrate = data["#nodes"][0].bitrate !== undefined ? data["#nodes"][0].bitrate : 0;
    let pmtbitrate = data["#nodes"][0]?.bitrate ?? 0;

    const bitrate = pmtbitrate;

    return (

        <li key={"pmt_table_" + serviceId} >
            <details>
                <summary>Program {serviceId} - {serviceName} - {bitrate}</summary>

                <ul>
                    <li> <details><summary>PMT PID {tablePid}</summary>
                        <ul>
                            {/* Program Descriptors */}
                            <ProgramInfoDescriptor des={nodes} />
                            {/* PMT components */}
                            <Component comp={nodes} />
                            {/* PMT properties */}
                            <Properties data={data} />
                        </ul>
                    </details>
                    </li>
                </ul>
            </details>
        </li>


    )

};


function Pmt({ data }) {


    var [pmtTable, setTable] = useState(data.pmt);
    var [services, setServices] = useState([]);


    useEffect(() => {
        setTable(data.pmt); // Update  when allTables changes

    }, [data.pmt]);

    useEffect(() => {
        // setTable(data.analyze.services && data.analyze.services); // Update  when allTables changes

  
            //console.log(data.analyze)
            data?.analyze?.services?.length > 0 && setServices(data.analyze.services);
        
    
        
    }, [data.analyze]);


    if (pmtTable && pmtTable.length > 0) {
        return (

            <ul className="tree">
                <li>
                    <details>
                        <summary>PMT</summary>
                        <ul>
                            {/* Iterate over the arrat of PMTs tables*/}
                            {pmtTable.map(k => {

                                return renderTable(k, services.length > 0 ? services.find(x => x.id === k.service_id) :null)
                            })}
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
                         <summary>PMT</summary>
                     </details>
                 </li>
 
             </ul>
         )*/

    }



}


export default Pmt;
