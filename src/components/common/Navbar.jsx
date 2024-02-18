import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useSelector } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import { useNavigate } from 'react-router-dom';
import logo from '../images/tv.png'; // Import your logo image


import './navbar.css'; // Import your custom CSS file

function NavScrollExample() {
  const {userDetail}=useSelector(state=>state.user)
  const navigate=useNavigate()
  const doLogout=()=>{
    // localStorage.remove('token')// we can clear this method also one by one
    localStorage.clear()
    navigate('/')
  }
  return (
    <Navbar expand="lg" className=" custom" >
      <Container fluid>
      <Navbar.Brand href="#" className="navbar-brand-custom fw-bold">
          My Court
          <img
            src={logo}
            alt="Your logo"
            className="d-inline-block align-top logo-img" // Apply custom CSS class if needed
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="/home">Home</Nav.Link>
    {userDetail.role===1 &&  <Nav.Link href="/addcourt">Addcourt</Nav.Link>}   
         <Nav.Link href="/mybookings">My Bookings</Nav.Link>
           
          </Nav>
          <Form className="d-flex">
            <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic" className=''>
      {userDetail.fname}{userDetail.lname}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
        <Dropdown.Item onClick={doLogout} href="#/action-2">Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;