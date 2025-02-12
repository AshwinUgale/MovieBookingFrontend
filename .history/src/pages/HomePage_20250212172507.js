import { Link, useNavigate } from "react-router-dom";
import { Container, Button, Navbar, Nav } from "react-bootstrap";

const HomePage = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token") !== null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Container className="text-center mt-5">
      {/* Header */}
      <h1 className="text-primary mb-4">🎟️ Welcome to the Movie Booking App</h1>

      {/* Navigation Links */}
      <Navbar bg="dark" variant="dark" expand="md" className="justify-content-center">
        <Nav>
          <Nav.Link as={Link} to="/movies" className="mx-2">🎬 Browse Movies</Nav.Link>
          {!isAuthenticated ? (
            <>
              <Nav.Link as={Link} to="/login" className="
