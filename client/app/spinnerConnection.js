'use client'
import { useState, useEffect } from 'react';

//The Spinner reports the status of the connection wiht the server
function SpinnerConnection({ data }) {

    const [connection, setConnection] = useState(data);

    useEffect(() => {

        setConnection(data);

    }, [data]);

    return (
        <>
            <div className='row mt-2'>
                <div className="clearfix">
                    
                    <div className={`spinner-grow spinner-grow-sm text-${connection} float-end`} role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    
                </div>
            </div>
        </>
    )
}

export default SpinnerConnection;