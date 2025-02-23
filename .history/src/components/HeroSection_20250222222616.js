import React, { useEffect, useState } from "react";
import { Carousel, Container, Button } from "react-bootstrap";
import { fetchMovies, fetchEvents } from "../services/api";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // ✅ Import sleek icons

const HeroSection = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0); // ✅ Track the current slide

  useEffect(() => {
    async function loadContent() {
      try {
        const movies = await fetchMovies();
        const events = await fetchEvents();

        if (!movies.length && !events.length) {
          console.error("No movies or events received.");
          return;
        }

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

  // ✅ Functions to handle slide change
  const handleNext = () => setIndex((prevIndex) => (prevIndex + 1) % slides.length);
  const handlePrev = () => setIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);

  return (
    <div className="position-relative">
      <Carousel activeIndex={index} onSelect={setIndex} fade interval={null} className="hero-carousel">
        {slides.map((item, slideIndex) => (
          <Carousel.Item key={slideIndex}>
            <div
              className="hero-slide d-flex align-items-center justify-content-center text-white"
              style={{
                background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${item.posterUrl || item.image || "/fallback.jpg"}) center/cover no-repeat`,
                height: "500px",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
                padding: "20px",
              }}
            >
              <Container>
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
              </Container>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

    
    </div>
  );
};

// ✅ Modern Button Styles
const buttonStyle = `
.carousel-control-prev-custom, .carousel-control-next-custom {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  padding: 8px 12px;
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
.carousel-control-prev-custom {
  left: 10px;
}
.carousel-control-next-custom {
  right: 10px;
}`;

// ✅ Inject styles directly into the page
const styleTag = document.createElement("style");
styleTag.innerHTML = buttonStyle;
document.head.appendChild(styleTag);

export default HeroSection;
