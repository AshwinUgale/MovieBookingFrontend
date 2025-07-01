import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // ✅ Import AuthContext
import { Navbar, Nav, Container, Button } from "react-bootstrap"; // ✅ Import Bootstrap components

const CustomNavbar = () => {
    const { isAuthenticated, logout } = useContext(AuthContext); // ✅ Use authentication state

    return (
        <Navbar bg="black" variant="dark" expand="lg" className="custom-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/" className="brand-text">🎬 CloudTix</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/" className="nav-link-custom">Home</Nav.Link>
                        <Nav.Link as={Link} to="/movies" className="nav-link-custom">Movies</Nav.Link>
                        <Nav.Link as={Link} to="/events" className="nav-link-custom">Live Events</Nav.Link>
                        {isAuthenticated && <Nav.Link as={Link} to="/bookings" className="nav-link-custom">My Bookings</Nav.Link>}
                    </Nav>
                    <Nav>
                        {!isAuthenticated ? (
                            <>
                                <Button variant="primary" as={Link} to="/login" className="mx-2">Login</Button>
                                <Button variant="outline-light" as={Link} to="/register">Register</Button> 
                            </>
                        ) : (
                            <Button variant="outline-light" onClick={logout}>Logout</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

// Add styles for the navbar to match carousel background
const navbarStyle = `
    .custom-navbar {
        background-color: #000 !important;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    
    .brand-text {
        font-weight: 600;
        letter-spacing: 0.5px;
    }
    
    .nav-link-custom {
        margin: 0 5px;
        transition: color 0.2s ease;
        position: relative;
    }
    
    .nav-link-custom:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 2px;
        background-color: #007bff;
        transition: width 0.3s ease;
    }
    
    .nav-link-custom:hover:after {
        width: 100%;
    }
    
    .nav-link-custom:hover {
        color: #fff !important;
    }
`;

// Inject styles
const styleTag = document.createElement("style");
styleTag.innerHTML = navbarStyle;
document.head.appendChild(styleTag);

export default CustomNavbar;
