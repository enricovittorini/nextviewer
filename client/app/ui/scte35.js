'use client'

import React, { useState, useEffect } from 'react';

import renderjson from '../lib/renderjson';


function Scte35({ data }) {

    const [scte35data, setScte35] = useState(data);
   // const [hoveredIndex, setHoveredIndex] = useState(null);
    const [meta, setMeta] = useState({});

    const handleMouseEnter = (meta) => {
        if (meta.id) {

            setMeta(meta);
            const scteIndex = scte35data.scte35.findIndex(k => k["metadata"].id === meta.id);
            const { metadata, ...command } = scte35data.scte35[scteIndex] || {};
            let jrendered = renderjson
                .set_show_by_default(true)
                .set_show_to_level(3)
                .set_icons('+', '-')
                (command);

            document.getElementById("scte35").replaceChildren(jrendered)



        } else {
           // setHoveredIndex("");
            document.getElementById("scte35").replaceChildren('')
        }
    };

    const handleMouseLeave = () => {
        // setHoveredIndex(null);

    };


    useEffect(() => {
        setScte35(data)
    }, [data])

    return (
        <>
            <div className='row'>
                <h6 data-bs-toggle="collapse" href="#sctetable" role="button" aria-expanded="false" aria-controls="sctetable" style={{ color: 'deepskyblue' }}>SCTE35</h6>
                <div className="collapse" id="sctetable">
                    <div className='row gx-5'>
                        <div className='col-5'>
                            <table className="table table-sm table-hover" >
                                <tbody className="table-group" >
                                    <tr key="header">
                                        <td key="header_id">Id</td>
                                        <td key="header_time">Time</td>
                                        <td key="header_pid">PID</td>
                                        <td key="header_command">SCT35 Command</td>
                                    </tr>
                                    {scte35data.scte35?.map((k, idx) => {
                                        const id = k["metadata"]["id"];
                                        return (

                                            <tr id={id} key={id} onMouseEnter={() => handleMouseEnter(k["metadata"])} onMouseLeave={handleMouseLeave}>
                                                <td key={{ id } + "id"}>{id}</td>
                                                <td key={{ id } + "time"}>{k["metadata"]["time"]}</td>
                                                <td key={{ id } + "_pid"}>{k["metadata"]["pid"]}</td>
                                                <td key={{ id } + "_command"}>{k["metadata"]["command_type"]}</td>
                                            </tr>

                                        )
                                    })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className='col-6 rounded border border-light-subtle'>
                            <div className='col-1'></div>

                            <div className='row mt-1'><h6>Command Id: {meta.id} - Time: {meta.time}</h6></div>
                            <div className='row' id="scte35"></div>

                        </div>
                    </div>
                </div>

            </div>
        </>
    )

}

export default Scte35;