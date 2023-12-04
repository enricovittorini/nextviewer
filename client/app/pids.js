
'use client'
import { useState, useEffect } from 'react';
import convertBitrate from './utils/convertBitrate';
import getPidType from './getPidType';





function renderTable(data) {

    // Do not continue if there is no "data" of the bitrate is "0".

    if (!data && data.bitrate === 0) {
        return null;
    }


    //let icon = null;
    //let tabledPid = [0, 1, 16, 17, 18, 20, 21];
    let scrambledIcon = null;
    //let description = data.description.substring(0, data.description.indexOf("(")).trim() || data.description;

    //let descriptionDetails = data.description.substring(data.description.indexOf("("), data.description.length).replace(/[()]/g, '') || description;


    //let bitrate = Intl.NumberFormat('en-US', { style: 'unit', unit: "kilobit-per-second", maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(data.bitrate / 1000)
    let bitrate = convertBitrate(data.bitrate);

    if (data["is-scrambled"]) {
        scrambledIcon = "bi bi-lock";
    } else { scrambledIcon = null }


    let [icon, description, descriptionDetails] = getPidType(data);

    /*if (data.pmt || tabledPid.find(k => k === data.id) || data.id === 0) {
        icon = "bi bi-table";
        description = data.description;
    } else if (data.id === 8191) {
        icon = "bi bi-recycle";

    } else if (data.audio) {
        icon = "bi bi-music-note-beamed";

    } else if (data.video) {
        icon = "bi bi-film";

    } else if (data.ecm) {
        icon = "bi bi-key";

    } else if (data.emm) {
        icon = "bi bi-shield-lock";

    } else if (data.unreferenced) {
        icon = "bi bi-question-square";

    } else if (data.language) {
        icon = "bi bi-card-text";

    } else {
        icon = "bi bi-app-indicator";
    }*/


    return (

        <li key={"pid_" + data.id}>
            <details>
                <summary><i className={icon}></i><i className={scrambledIcon}></i> {data.id} {description} - {bitrate}</summary>
                <ul>
                    <li className='prop'>{descriptionDetails}</li>
                </ul>
            </details>
        </li>


    )

};



function PidsList({ data }) {

    var [analyze, setTable] = useState(data.analyze);


    useEffect(() => {
        setTable(data.analyze); // Update nitTable when allTables changes
    }, [data.analyze]);

    if (analyze && analyze.pids) {
        return (

            <ul className="tree">
                <li>
                    <details>
                        <summary>PIDs</summary>
                        <ul>
                            {analyze["pids"].map((k, i) => {

                                return renderTable(k)

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
                         <summary>PIDs </summary>
                     </details>
                 </li>
 
             </ul>
         )*/
    }
}






export default PidsList;
