import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // ✅ Import AuthContext
import { Navbar, Nav, Container, Button } from "react-bootstrap"; // ✅ Import Bootstrap components

const CustomNavbar = () => {
    const { isAuthenticated, logout } = useContext(AuthContext); // ✅ Use authentication state

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">🎬 MovieBooking</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/movies">Movies</Nav.Link>
                        <Nav.Link as={Link} to="/events">Live Events</Nav.Link>
                        {isAuthenticated && <Nav.Link as={Link} to="/bookings">My Bookings</Nav.Link>}
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

export default CustomNavbar;
