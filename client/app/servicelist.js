'use client'
import { useState, useEffect } from 'react';



function Component(data) {
    let pcrIcon = null;
    if (data.pcr) {
        pcrIcon = pcrIcon = "bi bi-clock ms-1";
    }

    return (

        <li key={data.id}>
            <details>
                <summary>
                    <div className='row'>
                        <div className='col-auto pe-1'><i className={data.icon}></i></div>
                        {data["is_scrambled"] && ( <div className='col-auto ps-0 pe-0'><i className={data.icon_scrambled }> </i></div>)}
                        {data["pcr"] && (<div className='col-auto ps-0 pe-1'><i className={pcrIcon} ></i></div>)}
                        <div className='col-auto ps-0 pe-1'><p className="my-0">{data.id} - {data.description} {data.bitrate}</p></div>
                    </div>
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


function ServiceList({ list }) {
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
                                            <div className='row'>
                                                <div className='col-auto pe-1'> <i className={k.service_icon}></i></div>
                                                {k.scrambled && (
                                                    <div className='col-auto ps-0 pe-1'><i className={k.scrambled_icon}></i></div>
                                                )}
                                                <div className='col-auto ps-0'><p className="my-0">{k.service_id} - {k.service_name} - {k.bitrate}</p></div>
                                            </div>
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


export default ServiceList;