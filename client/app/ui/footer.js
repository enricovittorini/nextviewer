'use client'
import { useEffect, useState } from "react";



 function Footer({data}) {

  
    const [version, setVersion] = useState(data);



    useEffect(() => {
        setVersion(data)

    }, [data])

    return (
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
            <div className="col-sm-3 d-flex align-items-center">
                <a href="https://github.com/enricovittorini/nextviewer" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
                    <i className="bi bi-github" width="30" height="24"></i>
                </a>
                <span className="mb-3 mb-md-0">© Enrico Vittorini</span>
            </div>
            <div className="col-sm-1 text-white-50"> version {version} </div>

            <p className="nav col-md-4 justify-content-end text-white-50" data-bs-toggle="modal" data-bs-target="#credits">Credits</p>

        </footer>

    )

}

export default Footer;