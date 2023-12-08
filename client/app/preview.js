'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image'


function Preview({ /*serviceNames, */services, previewId, image, desc }) {
    const [serviceList, setServiceList] = useState({});
    const [previewImage, setPreviewImage] = useState(image);
    const [sid, setSid] = useState(previewId);
    const [description, setDescription] = useState('');

    const handleServiceChange = async (event) => {

        //get the Service Id of the desired preview
        const selectedId = event.target.value;

        // IF the selection is 0, set start_stop_preview to "stoppreview"
        let start_stop_preview = selectedId === "0" ? "stoppreview" : "startpreview";

        setSid(selectedId);

        try {
            const response = await fetch(`/nextviewer/${start_stop_preview}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "sid": Number(selectedId) })

            });

            if (response.ok) {
                //console.log("Starting Preview ok");

            } else {
                // Handle errors
                console.log("Failed to start preview")
                const data = await response.json();
                alert(`Error: ${data.message}`);

            }
        } catch (e) {

        }

    }

    useEffect(() => {

        const servicesObject = {};
        if (services?.length > 0) {
            for (const s of services) {
                console.log(s)
                // Exclude the service from the preview list if the video is scrambled
                let videoComponent = s.components.some(k => { return (k.video === true && k.is_scrambled === false) })

                if (videoComponent) {
                    servicesObject[s.service_id] = s.service_name
                }
            }
            
        }
        setServiceList(servicesObject);

        //Neet to change teh 
        previewId === null ? setSid(0) : setSid(previewId);

    }, [services, previewId])



    useEffect(() => {
        setPreviewImage(image);
    }, [image])


    useEffect(() => {
        setDescription(desc.replace(/"/g, ''));

    }, [desc])


    return (
        <>
            <div className='row'>
                <div className='col-12'>
                    <form>
                        <div className="mb-3">
                            <select className="form-select form-select-sm" value={sid} onChange={handleServiceChange}>
                                <option value="0"> No Preview</option>
                                {Object.keys(serviceList).length > 0 && Object.keys(serviceList).map(k => {
                                    return (
                                        <option key={k} value={k} >{k} - {serviceList[k]}</option>
                                    )
                                })}

                            </select>
                        </div>
                    </form>
                </div>
                {/*   <img className="img-thumbnail float-end"  src={previewImage} alt="Preview Thumbnail" />*/}
                <div className='col-12'>
                    <Image
                        width={320}
                        height={180}
                        className="img-thumbnail float-end"
                        src={previewImage}
                        alt="Preview Thumbnail" />
                </div>
            </div >

            <div className='row'>
                <div className='col-12'>
                    <p>{description}</p>
                </div>
            </div>



        </>

    )

}


export default Preview;