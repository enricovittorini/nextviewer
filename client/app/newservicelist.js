'use client'
import { useState, useEffect } from 'react';



function Component(data) {

    return (

        <li key={data.id}>
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
                                            <i className={`${k.scrambled_icon} ms-1`}></i> {k.service_id} {k.service_name} - {k.bitrate}
                                        </summary>

                                        <ul>

                                            {
                                                k.components && k.components.map((comp) => {
                                                    return Component(comp)
                                                })
                                            }

                                            <li key={k.id + "_sid_pcr_" + k.service_pcr_pid} className='prop'> PCR pid: {k.service_pcr_pid} </li>
                                            <li key={k.id + "_sid_pmt_" + k.service_pmt_pid} className='prop'> PMT pid: {k.service_pmt_pid} </li>
                                            {k.lcn && (
                                                <li key={k.id + "_lcn_" + k.lcn} className='prop'> LCN: {k.lcn} </li>
                                            )}

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


}


export default NewServiceList;