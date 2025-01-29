import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navigatu from '../assets/navigatu.jpg';
import Tara from '../assets/tara.jpg'

const Navigation = () => {
    return ( 
        <>
        <div>
        <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">
          <img src={Navigatu} 
              width="30"
              height="30"
              className="d-inline-block align-top"  />
          </Navbar.Brand>
          <Navbar.Brand href="#home">
          <img src={Tara} 
              width="30"
              height="30"
              className="d-inline-block align-top"  />
          </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Tracking</Nav.Link>
            <Nav.Link href="#link">Inventory</Nav.Link>
            <Nav.Link href="#link">Logs</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
        </div>
        </>
     );
}
 
export default Navigation;