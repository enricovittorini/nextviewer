'use client'

function Credits() {


  return (
    <>
      <div className="modal fade" id="credits" tabIndex="-1" role="dialog" aria-labelledby="credits-label" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content bg-dark">
            <div className="modal-header" data-bs-theme="dark">
              <h5 className="modal-title" id="creditsTitle">Credits</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <ul>
                <li>
                  <a href="https://tsduck.io/" className="nav-link px-2">tsduck.io</a>
                </li>
                <li>
                  <a href="https://github.com/enricovittorini/tsduck/blob/master/LICENSE.txt" className="nav-link px-2">TSduck License</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Credits;
