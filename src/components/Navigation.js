import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Navigatu from "../assets/logo.png";
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
    <Navbar expand="lg" className="bg-white py-2 container">
      <Container fluid className="" >
        {/* Logo Section */}
        <Navbar.Brand href="/track" className="d-flex align-items-center">
          <img
            src={Navigatu}
            width="50"
            height="50"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Navbar.Brand>

        {/* Navbar Toggle for Mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="toggle" />

        <Navbar.Collapse id="basic-navbar-nav">
          <div className="d-flex flex-column flex-lg-row w-100 justify-content-between align-items-center">
            {/* Dashboard Section */}
            <div className="text-center my-2 my-lg-0">
              {localStorage.getItem("currentPage") === "Tracking" && (
                <Nav.Link disabled>Tracking Dashboard</Nav.Link>
              )}
              {localStorage.getItem("currentPage") === "Inventory" && (
                <Nav.Link disabled>Inventory Dashboard</Nav.Link>
              )}
              {localStorage.getItem("currentPage") === "Logs" && (
                <Nav.Link disabled>Logs Dashboard</Nav.Link>
              )}
            </div>

            {/* Navigation Links */}
            <Nav className="flex-grow-1 justify-content-center">
              <Nav.Link href="/track" onClick={() => pageHandler("Tracking")}>
                Tracking
              </Nav.Link>
              <Nav.Link href="/inventory" onClick={() => pageHandler("Inventory")}>
                Inventory
              </Nav.Link>
              <Nav.Link href="/logs" onClick={() => pageHandler("Logs")}>
                Logs
              </Nav.Link>
            </Nav>

            {/* Logout Button */}
            <div className="text-center my-2 my-lg-0">
              <Button variant="danger" className="px-4" onClick={logout}>
                Log out
              </Button>
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
