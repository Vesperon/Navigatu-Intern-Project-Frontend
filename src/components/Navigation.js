import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Navigatu from "../assets/navigatu.jpg";
import Tara from "../assets/tara.jpg";

const Navigation = () => {
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
            <div className="col track">
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="toggle"/>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto ">
                <Nav.Link href="/track">Tracking</Nav.Link>
                <Nav.Link href="/inventory">Inventory</Nav.Link>
                <Nav.Link href="/logs">Logs</Nav.Link>
              </Nav>
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