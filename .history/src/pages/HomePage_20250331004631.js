import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Form, InputGroup } from "react-bootstrap";
import { FaSearch, FaTicketAlt, FaFilm, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import HeroSection from "../components/HeroSection";
import TrendingMovies from "../components/TrendingMovies";
import CallToAction from "../components/CallToAction";
import TrendingEvents from "../components/TrendingEvents";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Animation effect when component mounts
    setIsVisible(true);
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="homepage">
      {/* Hero Banner */}
      <HeroSection />

      {/* Main Content */}
      <Container className={`content-container ${isVisible ? 'fade-in' : ''}`}>
        {/* Search Section */}
        <section className="search-section py-5">
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card className="search-card shadow">
                <Card.Body>
                  <h3 className="text-center mb-4">
                    <FaSearch className="me-2" />
                    Find Your Entertainment
                  </h3>
                  <Form onSubmit={handleSearch}>
                    <InputGroup>
                      <Form.Control
                        placeholder="Search for movies, events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Button variant="primary" type="submit">
                        Search
                      </Button>
                    </InputGroup>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        {/* Quick Access Buttons */}
        <section className="quick-access py-3">
          <Row className="justify-content-center text-center g-3">
            <Col xs={6} md={3}>
              <Card className="h-100 shadow-sm feature-card">
                <Card.Body>
                  <FaFilm size={30} className="text-primary mb-3" />
                  <h5>Movies</h5>
                  <Button variant="outline-primary" href="/movies" className="mt-2">
                    Browse Movies
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={3}>
              <Card className="h-100 shadow-sm feature-card">
                <Card.Body>
                  <FaCalendarAlt size={30} className="text-success mb-3" />
                  <h5>Events</h5>
                  <Button variant="outline-success" href="/events" className="mt-2">
                    Find Events
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={3}>
              <Card className="h-100 shadow-sm feature-card">
                <Card.Body>
                  <FaTicketAlt size={30} className="text-danger mb-3" />
                  <h5>Bookings</h5>
                  <Button variant="outline-danger" href="/bookings" className="mt-2">
                    Your Tickets
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        {/* Trending Events Section with "What's Happening" Header */}
        <section className="events-section pt-5">
          <div className="section-header">
            <h2 className="text-center position-relative">
              <span className="section-title-bg">What's Happening</span>
            </h2>
            <div className="divider mt-2 mb-5"></div>
          </div>
          <TrendingEvents />
        </section>

        {/* Trending Movies Section */}
        <section className="movies-section pt-5">
          <div className="section-header">
            <h2 className="text-center position-relative">
              <span className="section-title-bg">Popular Movies</span>
            </h2>
            <div className="divider mt-2 mb-5"></div>
          </div>
          <TrendingMovies />
          <div className="text-center mt-4">
            <Button variant="outline-primary" size="lg" href="/movies" className="view-all-btn">
              View All Movies <FaArrowRight className="ms-2" />
            </Button>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="cta-section pt-5 mb-5">
          <CallToAction />
        </section>
      </Container>
    </div>
  );
};

// Add CSS styles for the HomePage
const styles = document.createElement("style");
styles.innerHTML = `
  .homepage {
    background-color: #f8f9fa;
  }
  
  .content-container {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  }
  
  .fade-in {
    opacity: 1;
    transform: translateY(0);
  }
  
  .search-card {
    border-radius: 10px;
    border: none;
  }
  
  .feature-card {
    border-radius: 10px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
  }
  
  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .section-title-bg {
    position: relative;
    padding: 0 15px;
  }
  
  .section-title-bg::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 10px;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 123, 255, 0.1);
    z-index: -1;
  }
  
  .divider {
    height: 3px;
    width: 80px;
    background: linear-gradient(to right, #e0e0e0, #007bff, #e0e0e0);
    margin: 0 auto;
  }
  
  .view-all-btn {
    transition: all 0.3s ease;
    border-radius: 30px;
    padding: 10px 25px;
  }
  
  .view-all-btn:hover {
    transform: translateX(5px);
  }
`;

document.head.appendChild(styles);

export default HomePage;
