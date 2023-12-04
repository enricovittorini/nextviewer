'use client'
import {useState, useEffect } from 'react';
import convertBitrate from './utils/convertBitrate';
import getPesStreamId from './pesStreamId'
import {getServiceType} from './serviceType';
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

                   /* if (k.id === 8191) {
                        icon = "bi bi-recycle";
                
                    } else if (k.audio) {
                        icon = "bi bi-music-note-beamed";
                
                    } else if (k.video) {
                        icon = "bi bi-film";
                
                    } else if (k.ecm) {
                        icon = "bi bi-key";
                
                    } else if (k.emm) {
                        icon = "bi bi-shield-lock";
                
                    } else if (k.unreferenced) {
                        icon = "bi bi-question-square";
                
                    } else if (k.language) { //language can be found on audio or subtitles PID. If audio is false then it must be a subtitle
                        icon = "bi bi-card-text";
                
                    } else {
                        icon = "bi bi-app-indicator";
                    }*/


                    // Add lock icon if the component is scrmabled
                    var scrambledIcon = null;
                    if (k["is-scrambled"]) {
                        scrambledIcon = "bi bi-lock";
                    } else { scrambledIcon = null }

                    return (
                        <li key={"component_" + k.id} className='prop'>
                            {/* <details>
                                <summary>*/}
                            <i className={icon}></i> <i className={scrambledIcon}></i> {pid} - {description} - {bitrate}
                            {/*    </summary>
                            </details>*/}
                        </li>
                    )
                }

                return null; // If the component does not meet the condition, return null
            })

            }
        </>

    )
}


function renderTable(data, analyze) {

    //Do not list services that have packets at 0.
    if (!data || data.packets === 0) {
        return null;
    }

    const servicePids = data.pids;
    var icon = null;
    var scrambledIcon = null;
    const name = data["name"];
    const sId = data["id"];
    const pmtPid = data["pmt-pid"];
    const pcrPid = data["pcr-pid"];
    //let typeName = data["type_name"];
    const typeId = data["type"];
    const provider = data["provider"];
    const bitrate = convertBitrate(data["bitrate"]);

    const scrambled = data["is-scrambled"];

    if (scrambled) {
        scrambledIcon = "bi bi-lock";
    } else {
        scrambledIcon = null
    }

    /*
        switch (typeId) {
            case 2:
                icon = "bi bi-mic";
                break;
            case 1:
            case 22:
            case 25:
                icon = "bi bi-tv";
                break;
    
            default:
                break;
        }*/

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


    useEffect(() => {
        setTable(data.analyze); // Update nitTable when allTables changes

    }, [data.analyze]);

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

                                        return renderTable(k, analyze)

                                    })}

                            </ul>
                        </details>
                    </li>

                </ul>
            </>

        )
    }

}

export default ServiceList