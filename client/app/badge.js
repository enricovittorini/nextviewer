import React, { useState, useEffect } from 'react';


const handleCCreset = async () => {
    try {
        // Perform your POST API request here
        const response = await fetch('/nextviewer/resetcc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add any other headers as needed
            },
            // Add your request body if required
            // body: JSON.stringify({ key: 'value' }),
        });

        // Handle the response as needed
        const data = await response.json();
        //console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
};



function CcBadge({ data }) {

    const [counter, setCounter] = useState(0);







    useEffect(() => {
        setCounter(data.stats?.cc || 0)
    }, [data]);

    return (
        <>
            <div className='col-3'>
                <span><i className="bi  bi-arrow-counterclockwise text-primary me-2" onClick={handleCCreset}></i></span>
                <span className="badge text-bg-primary"> CC Error: {counter}</span>

            </div>
        </>
    )

}


export default CcBadge;