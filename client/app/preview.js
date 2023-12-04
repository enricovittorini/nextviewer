'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image'


function Preview({ services, previewId, image, desc }) {
    const [serviceList, setServiceList] = useState(services);
    const [previewImage, setPreviewImage] = useState(image);
    const [sid, setSid] = useState(previewId);
    const [descripton, setDescription] = useState(desc);


    const handleServiceChange = async (event) => {

        //get the Service Id of the desired preview
        const selectedId = event.target.value;


        // IF the selection is 0, set start_stop_preview to "stoppreview"
        let start_stop_preview = selectedId === "0" ? "stoppreview" : "startpreview";


        //console.log("I have selected sid: " + selectedId)

        setSid(selectedId);

        try {
            const response = await fetch(`/${start_stop_preview}`, {
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
        //setPreviewImage(image);
        setServiceList(services);

        //Neet to change teh 
        previewId === null ? setSid(0) : setSid(previewId);

    }, [services, previewId])



    useEffect(() => {
        setPreviewImage(image);
    }, [image])


    useEffect(() => {
        setDescription(desc);
    }, [desc])


    return (
        <>

            <form>
                <div className="mb-3">
                    <select className="form-select form-select-sm" value={sid} onChange={handleServiceChange}>
                        <option value="0"> No Preview</option>
                        {serviceList !== undefined && serviceList.map(k => {
                            return (
                                <option key={k.id} value={k.id} >{k.id} - {k.name}</option>
                            )
                        })}


                    </select>
                </div>
            </form>


            {/*   <img className="img-thumbnail float-end"  src={previewImage} alt="Preview Thumbnail" />*/}
            <div>
            <Image
            
            width={320}
            height={180}
                className="img-thumbnail float-end"
                src={previewImage}
                alt="Preview Thumbnail" />
            <p>{descripton}</p>
            </div>



        </>

    )

}


export default Preview;