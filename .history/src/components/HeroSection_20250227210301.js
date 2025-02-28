import React, { useEffect, useState } from "react";
import { Carousel, Container, Button, Row, Col } from "react-bootstrap";
import { fetchMovies, fetchEvents } from "../services/api";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const HeroSection = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function loadContent() {
      try {
        const movies = await fetchMovies();
        const events = await fetchEvents();
        if (!movies.length && !events.length) return;
        const combinedSlides = [...movies, ...events].sort(() => Math.random() - 0.5);
        setSlides(combinedSlides.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies/events:", error);
      }
    }
    loadContent();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="position-relative">
      <Carousel activeIndex={index} onSelect={setIndex} fade interval={null} className="hero-carousel">
        {slides.map((item, slideIndex) => (
          <Carousel.Item key={slideIndex}>
            <Container>
              <Row className="align-items-center hero-slide">
                {/* ✅ Left Side: Image */}
                <Col md={6} className="text-center">
                  <img
                    src={item.posterUrl || item.image || "/fallback.jpg"}
                    alt={item.title}
                    className="img-fluid hero-img"
                  />
                </Col>

                {/* ✅ Right Side: Details */}
                <Col md={6} className="text-white text-start">
                  <h1 className="fw-bold mb-3">{item.title || item.name}</h1>
                  <p className="d-none d-md-block">
                    {item.description ? item.description.substring(0, 100) + "..." : "Exciting event/movie available now!"}
                  </p>
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-light btn-lg">
                      View Details
                    </a>
                  ) : (
                    <a href={`/movies/${item._id}`} className="btn btn-primary btn-lg">
                      Book Now
                    </a>
                  )}
                </Col>
              </Row>
            </Container>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* ✅ Custom Navigation Buttons */}
      <button className="carousel-control-prev-custom" onClick={() => setIndex((prev) => (prev - 1 + slides.length) % slides.length)}>
        <FaChevronLeft />
      </button>
      <button className="carousel-control-next-custom" onClick={() => setIndex((prev) => (prev + 1) % slides.length)}>
        <FaChevronRight />
      </button>
    </div>
  );
};

// ✅ Styles
const buttonStyle = `
  .carousel-control-prev-custom, .carousel-control-next-custom {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    border: none;
    padding: 10px;
    font-size: 20px;
    color: #fff;
    z-index: 10;
    border-radius: 50%;
    transition: all 0.3s ease-in-out;
  }
  .carousel-control-prev-custom:hover, .carousel-control-next-custom:hover {
    background: rgba(255, 255, 255, 0.3);
    color: #000;
  }
  .carousel-control-prev-custom { left: 10px; }
  .carousel-control-next-custom { right: 10px; }

  .hero-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 500px;
  }
  .hero-img {
    max-height: 400px;
    object-fit: contain; /* ✅ Ensures image does not stretch */
    width: 100%;
  }
`;

// ✅ Inject styles directly into the page
const styleTag = document.createElement("style");
styleTag.innerHTML = buttonStyle;
document.head.appendChild(styleTag);

export default HeroSection;
