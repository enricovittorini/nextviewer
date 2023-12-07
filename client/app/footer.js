
function Footer() {

    return (
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
            <div className="col-md-4 d-flex align-items-center">
                <a href="https://github.com/enricovittorini/nextviewer" class="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
                    <i class="bi bi-github" width="30" height="24"></i>
                </a>
                <span className="mb-3 mb-md-0 text-muted">© 2023 Enrico Vittorini</span>
            </div>

            
            <p className="nav col-md-4 justify-content-end text-white-50" data-bs-toggle="modal" data-bs-target="#credits">Credits</p>
      
        </footer>

    )

}

export default Footer;