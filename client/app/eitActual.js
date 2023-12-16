'use client'
import { useState, useEffect } from 'react';




function Events({ data }) {


    return data.map(k => {
        
        const eventId = k.properties.event_id;
        const running = k.properties.running_status;
        const caMode = k.properties.ca_mode.toString();
        const startTime = k.properties.start_time;
        const duration = k.properties.duration;


        return (
            <li key={"event_prop_" + eventId}>
                <details>
                    <summary>Event Id: {eventId}</summary>
                    <ul>
                        <li key="startTime" className='prop'>start time: {startTime}</li>
                        <li key="duration" className='prop'>duration: {duration}</li>
                        <li key="ca" className='prop'>ca_mode: {caMode}</li>
                        <li key="running" className='prop'>running: {running}</li>
                        <li key={"short_desc_" + eventId}>
                            <details>
                                <summary>Short Event Description</summary>
                                <ul>
                                    <li key="event_name" className='prop' >Event Name: {k.short_description.name}</li>
                                    <li key="event_short" className='prop' >Event: Description: {k.short_description.description}</li>
                                </ul>
                            </details>
                        </li>

                    </ul>
                </details>
            </li>
        )

    })
}


function Properties({ data }) {
    const serviceId = data.service_id;
    const events = data["#nodes"];


    return (
        <>
            {/* <Events data={events} />*/}
            {Object.keys(data).map(k => {


                return (
                    <li key={`eit_prop_${serviceId}_${k}`} className="prop">
                        {`${k}: ${data[k]?.toString()}`}
                    </li>
                )

            })}
        </>

    )

}

function EitActual({ data, pids}) {
    const [eit, setEit] = useState();
    const [bitrate, setBitrate] = useState(0);
    

    useEffect(() => {

        setEit(data);
        setBitrate(pids.find(k=> k.id === 18).bitrate);
    }, [data, pids])

    /*useEffect(() => {

        setBitrate(bitrate);
    }, [bitrate])*/


    return (eit && Object.keys(eit).length > 0) && (
        <>
            <ul className="tree">
                <li>
                    <details>
                        <summary>EIT Actual - {bitrate}</summary>
                        <ul>
                            <li key="eitpf">
                                <details>
                                    <summary>EIT p/f</summary>
                                    <ul>

                                        {
                                            data.eitpf.map(k => (
                                                <li key={"eit_actual_" + k?.properties.service_id}>
                                                    <details>
                                                        <summary> Service {k?.properties.service_id}</summary>

                                                        <ul>
                                                            <Events data={k.events} />
                                                            <Properties data={k.properties} />
                                                        </ul>
                                                    </details>

                                                </li>

                                            ))

                                        }
                                    </ul>
                                </details>
                            </li>

                        </ul>
                    </details>
                </li>
            </ul>

        </>
    )


}

export default EitActual;