'use client'
import { useState, useEffect } from 'react';
import convertBitrate from './utils/convertBitrate';
import getPesStreamId from './pesStreamId'
import { getServiceType } from './serviceType';
import getPidType from './getPidType';



const Component = ({ data }) => {
    const { servicePids, analyze } = data;

    const idSet = new Set(servicePids);
    const filteredPids = analyze.pids.filter(obj => idSet.has(obj.id));


    return (
        <>
            {filteredPids.map(k => {
                //Check if the component is not a pmt table, an EMM or an ECM component
                if (!k.pmt && !k.ecm && !k.emm) {

                    //const description = k.description.substring(0, k.description.indexOf("(")).trim() || k["description"];
                    const bitrate = convertBitrate(k["bitrate"]);
                    const pid = k["id"];

                    //const pesStreamId = getPesStreamId(k["pes-stream-id"]);
                    let [icon, description, descriptionDetails] = getPidType(k);

                    // Add lock icon if the component is scrmabled
                    var scrambledIcon = null;
                    if (k["is-scrambled"]) {
                        scrambledIcon = "bi bi-lock";
                    } else { scrambledIcon = null }

                    return (
                        <li key={"component_" + k.id} className='prop'>
                            <i className={icon}></i> <i className={scrambledIcon}></i> {pid} - {description} - {bitrate}
                        </li>
                    )
                }

                return null; // If the component does not meet the condition, return null
            })

            }
        </>

    )
}


function renderTable(data, analyze, sdt) {

    //Do not list services that have packets at 0.
    if (!data || data.packets === 0) {
        return null;
    }

    const serviceId = sdt['#nodes'].find(node => node['#name'] === 'service' && node.service_id === data["id"]);
    const service = serviceId ? serviceId['#nodes'].find(node => node['#name'] === 'service_descriptor') : null;
    const serviceName = service?.service_name;
    const providerName =  service?.service_provider_name;
    const serviceType = service?.service_type;

    const servicePids = data.pids;
    var icon = null;
    var scrambledIcon = null;
    //const name = data["name"];
    const name = serviceName;
    const sId = data["id"];
    const pmtPid = data["pmt-pid"];
    const pcrPid = data["pcr-pid"];
    //const typeId = data["type"];
    const typeId = serviceType;
    //const provider = data["provider"];
    const provider = providerName
    const bitrate = convertBitrate(data["bitrate"]);

    const scrambled = data["is-scrambled"];

    if (scrambled) {
        scrambledIcon = "bi bi-lock";
    } else {
        scrambledIcon = null
    }


    icon = getServiceType(typeId);

    return (

        <li key={"sid_" + sId}>
            <details>
                <summary>
                    <i className={icon}></i>
                    <i className={scrambledIcon}></i> {sId} {name} - {bitrate}
                </summary>
                <ul>
                    <Component data={{ servicePids, analyze }} />
                    <li key={"sid_" + sId} className='prop'> Program: {sId} </li>
                    <li key={"sid_pcr_" + pcrPid} className='prop'> PCR PID: {pcrPid} </li>
                    <li key={"sid_pmt_" + pmtPid} className='prop'> PMT PID: {pmtPid} </li>
                    <li key={"sid_pmt_" + provider} className='prop'> Provider: {provider} </li>
                </ul>
            </details>
        </li>

    )
}

function ServiceList({ data }) {

    var [analyze, setTable] = useState(data.analyze);
    const [sdt, setSdt] = useState(data.sdt);


    useEffect(() => {
        setTable(data.analyze);

    }, [data.analyze]);

    useEffect(() => {
        setSdt(data.sdt);

    }, [data.sdt]);

    if (analyze && analyze.services) {

        const numServices = analyze.services.length;

        return (
            <>
                <ul className="tree">
                    <li>
                        <details>
                            <summary>Services ({numServices})</summary>
                            <ul>
                                {
                                    analyze["services"].map((k, i) => {
                                        return renderTable(k, analyze, sdt)
                                    })
                                }
                            </ul>
                        </details>
                    </li>

                </ul>
            </>

        )
    }

}

export default ServiceList