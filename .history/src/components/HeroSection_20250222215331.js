import React, { useEffect, useState } from "react";
import { Carousel, Button, Container } from "react-bootstrap";
import { fetchMovies, fetchEvents } from "../services/api";

const HeroSection = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        const movies = await fetchMovies();
        const events = await fetchEvents();

        // Check if movies & events fetched correctly
        if (!movies || !events) {
          console.error("Failed to fetch movies or events.");
          return;
        }

        // Combine and shuffle movies & events
        const combinedSlides = [...movies, ...events].sort(() => Math.random() - 0.5);
        setSlides(combinedSlides.slice(0, 5)); // Show only 5 slides
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies/events:", error);
      }
    }

    loadContent();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <Carousel fade className="hero-carousel">
      {slides.length > 0 ? (
        slides.map((item, index) => (
          <Carousel.Item key={index}>
            <div 
              className="d-flex align-items-center justify-content-center text-white"
              style={{ 
                background: `url(${item.image || "/fallback-image.jpg"}) center/cover no-repeat`, 
                height: "500px",
                width: "100%",
              }}
            >
              <Container className="text-center">
                <h1 className="fw-bold">{item.title || item.name}</h1>
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
        ))
      ) : (
        <Carousel.Item>
          <div className="d-flex align-items-center justify-content-center text-white" style={{ height: "500px", width: "100%" }}>
            <h2>No Movies or Events Available</h2>
          </div>
        </Carousel.Item>
      )}
    </Carousel>
  );
};

export default HeroSection;
