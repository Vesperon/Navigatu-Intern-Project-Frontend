import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Navigatu from "../assets/navigatu.jpg";
import Tara from "../assets/tara.jpg";
import { Button } from "react-bootstrap";
import { useState } from "react";

const Navigation = () => {
  const pageHandler = (props) => {
    localStorage.setItem("currentPage", props);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentPage");
    window.location.href = "/";
  };

  return (
    <>
      <div>
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <div className="row">
              <div className="col">
                <Navbar.Brand href="/track">
                  <img
                    src={Navigatu}
                    width="60"
                    height="60"
                    className="d-inline-block align-top"
                  />
                </Navbar.Brand>
              </div>
              {/* <div className="col">
                
              </div> */}
              <div className="col track">
                <Navbar.Toggle
                  aria-controls="basic-navbar-nav"
                  className="toggle"
                />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto ">
                    {localStorage.getItem("currentPage") === "Tracking" && (
                      <Nav.Link>Tracking Dashboard</Nav.Link>
                    )}
                    {localStorage.getItem("currentPage") === "Inventory" && (
                      <Nav.Link>Inventory Dashboard</Nav.Link>
                    )}
                    {localStorage.getItem("currentPage") === "Logs" && (
                      <Nav.Link>Logs Dashboard</Nav.Link>
                    )}
                    <Nav.Link
                      href="/track"
                      onClick={() => pageHandler("Tracking")}
                    >
                      Tracking
                    </Nav.Link>
                    <Nav.Link
                      href="/inventory"
                      onClick={() => pageHandler("Inventory")}
                    >
                      Inventory
                    </Nav.Link>
                    <Nav.Link href="/logs" onClick={() => pageHandler("Logs")}>
                      Logs
                    </Nav.Link>
                  </Nav>

                  <button
                    type="button"
                    class="btn btn-danger logout-btn   onClick={() => logout()}>"
                  >
                    Log out
                  </button>
                </Navbar.Collapse>
              </div>
            </div>
          </Container>
        </Navbar>
      </div>
    </>
  );
};

export default Navigation;
