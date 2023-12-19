'use client'

import React, { useState, useEffect } from 'react';


function Scte35({ data }) {

    const [scte35, setScte35] = useState(data);


    useEffect(() => {


    }, [data])

    return (
        <>
            <div className='col-9'>
                <h6 data-bs-toggle="collapse" href="#srtrcvglobal" role="button" aria-expanded="false" aria-controls="srtrcvglobal" style={{ color: 'deepskyblue' }}>SCTE35</h6>
                <div className="collapse" id="srtrcvglobal">
                    <table className="table table-sm" >
                        <tbody className="table-group" >
                            <tr>
                                <td>Date</td>
                                <td>PID</td>
                                <td>SCT35 Command</td>
                            </tr>
                            {data.scte35?.map(k => {
                                return (
                                    <tr>
                                        <td></td>
                                        <td>{k["#nodes"][0]["pid"]}</td>    
                                        <td>{k["#nodes"][1]["#name"]}</td>
                                        
                                    </tr>

                                )


                            })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='col-3'></div>
        </>
    )

}

export default Scte35;