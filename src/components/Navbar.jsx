import React from "react";
import { Link } from "react-router-dom";

const Navbar = ()=>{
    return (
      <div>
        <nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
          <div class="container-fluid">
            <Link class="navbar-brand" to="#">
              NewsMonkey
            </Link>
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <Link class="nav-link active" aria-current="page" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item"><Link className="nav-link" to="/business">business</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/entertainment">entertainment</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/general">general</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/health">health</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/science">scinece</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/technology">technology</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/sports">sport</Link></li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
}

export default Navbar;
