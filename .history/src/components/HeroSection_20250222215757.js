import React, { useEffect, useState } from "react";
import { Carousel, Container, Button } from "react-bootstrap";
import { fetchMovies, fetchEvents } from "../services/api";

const HeroSection = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <Carousel fade controls={false} indicators={false} interval={5000} className="hero-carousel">
      {slides.map((item, index) => (
        <Carousel.Item key={index}>
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
  );
};

export default HeroSection;
