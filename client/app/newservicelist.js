'use client'
import { useState, useEffect } from 'react';



function Component(data) {

    return (

                <li>
                    <details>
                        <summary>
                            <i className={data.icon}></i><i className={data.icon_scrambled}></i> {data.id} - {data.description} {data.bitrate}
                        </summary>
                        <ul>
                            <li className='prop'>
                                {data.descriptionDetails}

                            </li>
                        </ul>
                    </details>
                </li>



    )
}


function NewServiceList({ list }) {
    const [serviceList, setServiceList] = useState(list);

    useEffect(() => {
        setServiceList(list)

    }, [list])


    return (
        (serviceList && serviceList.length > 0) && <ul className="tree">
            <li>
                <details>
                    <summary>
                        Services ({serviceList ? serviceList.length : null})
                    </summary>
                    <ul>
                        {
                            serviceList &&
                            serviceList.map((k) => (
                                <li key={"sid_" + k.service_id}>
                                    <details>
                                        <summary>
                                            <i className={k.service_icon}></i>
                                            <i className={k.scrambled_icon}></i> {k.service_id} {k.service_name} - {k.bitrate}
                                        </summary>

                                        <ul>

                                            {
                                                k.components && k.components.map((comp) => {
                                                    return Component(comp)
                                                })
                                            }

                                            <li key={k.id + "_sid_pcr_" + k.service_pcr_pid} className='prop'> PCR pid: {k.service_pcr_pid} </li>
                                            <li key={k.id + "_sid_pmt_" + k.service_pmt_pid} className='prop'> PMT pid: {k.service_pmt_pid} </li>
                                            <li key={k.id + "_sid_provider"} className='prop'> Provider: {k.service_provider} </li>
                                            <li key={k.id + "_sid_description"} className='prop'> Service Type: {k.service_type} - {k.service_description} </li>
                                        </ul>
                                    </details>
                                </li>
                            ))
                        }
                    </ul>
                </details>
            </li>
        </ul>
    );

    /* <li key={"sid_" + list.service_id}>
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
</li> */



}


export default NewServiceList;