import { Link, useNavigate } from "react-router-dom";
import { Container, Button, Navbar, Nav } from "react-bootstrap";
import HeroSection from "../components/HeroSection";
import TrendingMovies from "../components/TrendingMovies";
import MovieSearch from "../components/MovieSearch";
import GenreSection from "../components/GenreSection";
import Testimonials from "../components/Testimonials";
import CallToAction from "../components/CallToAction";

const HomePage = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token") !== null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Navigation Bar */}
      <Navbar bg="dark" variant="dark" expand="md" className="justify-content-center">
        <Nav>
          <Nav.Link as={Link} to="/movies" className="mx-2">🎬 Browse Movies</Nav.Link>
          {!isAuthenticated ? (
            <>
              <Nav.Link as={Link} to="/login" className="mx-2">🔑 Login</Nav.Link>
              <Nav.Link as={Link} to="/register" className="mx-2">📝 Register</Nav.Link>
            </>
          ) : (
            <Button 
              variant="danger" 
              onClick={handleLogout} 
              className="mx-2"
            >
              🚪 Logout
            </Button>
          )}
        </Nav>
      </Navbar>

      {/* Hero Banner */}
      <HeroSection />

      <Container className="text-center mt-5">
        {/* Search Bar */}
        <MovieSearch />

        {/* Trending Movies */}
        <TrendingMovies />

        {/* Browse by Genre */}
        <GenreSection />

        {/* User Testimonials */}
        <Testimonials />

        {/* Call to Action */}
        <CallToAction />
      </Container>
    </>
  );
};

export default HomePage;
