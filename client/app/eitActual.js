'use client'
import { useState, useEffect } from 'react';

function ShortEventDescription({ id, event }) {

    return (
        <li key={"short_desc_" + id}>
            <details>
                <summary>Short Event Description</summary>
                <ul>
                    <li key="event_language" className='prop' >Language: {event.short_description.language_code}</li>
                    <li key="event_name" className='prop' >Event Name: {event.short_description.name}</li>
                    <li key="event_short" className='prop' >Description: {event.short_description.description}</li>
                </ul>
            </details>
        </li>
    )
}

function LongEventDescription({ id, event }) {

    return (
        <li key={"long_desc_" + id}>
            <details>
                <summary>Extended Event Description</summary>
                <ul>
                    <li key="event_name" className='prop' >Language: {event.long_description.language_code}</li>
                    <li key="event_short" className='prop' >Description: {event.long_description.description}</li>
                </ul>
            </details>
        </li>

    )
}


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
                        <li key="startTime" className='prop'>start_time: {startTime}</li>
                        <li key="duration" className='prop'>duration: {duration}</li>
                        <li key="ca" className='prop'>ca_mode: {caMode}</li>
                        <li key="running" className='prop'>running: {running}</li>
                        <ShortEventDescription id={eventId} event={k} />
                        <LongEventDescription id={eventId} event={k} />
                    </ul>
                </details>
            </li>
        )

    })
}


function Properties({ data }) {

    return (
        Object.keys(data).map(k => {
            return (
                <li key={`eit_prop_${k}`} className="prop">
                     {`${k}: ${data[k] ?? 'undefined'}`}
                </li>
            )
        })
    )
}

function EitActual({ data, pids }) {
    const [eit, setEit] = useState();
    const [bitrate, setBitrate] = useState(0);


    useEffect(() => {

        setEit(data);
        setBitrate(pids?.find(k => k.id === 18).bitrate || 0);
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
                                            data.eitpf?.map(k => (
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