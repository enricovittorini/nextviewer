
'use client'
import { useState, useEffect } from 'react';
import getPidType from '../lib/getPidType';


function renderTable(data) {

    // Do not continue if there is no "data" or the bitrate is "0".

    if (!data && data.bitrate === 0) {
        return null;
    }

    let scrambledIcon = null;
    let pcrIcon = null;
    let bitrate = data.bitrate;

    if (data["is-scrambled"]) {
        scrambledIcon = "bi bi-lock";
    }

    if (data.packets.pcr > 0) {
        pcrIcon = "bi bi-clock";
    }


    let [icon, description, descriptionDetails] = getPidType(data);

    return (

        <li key={"pid_" + data.id}>
            <details>
                <summary>
                    <i className={icon}></i>
                    {pcrIcon !== null && (
                        <i className={`${pcrIcon} ms-1`} style={{ fontSize: '0.8rem' }}></i>
                    )}
                    <i className={scrambledIcon}></i> {data.id} {description} - {bitrate}</summary>
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
        setTable(data.analyze);
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
    } 
}



export default PidsList;
