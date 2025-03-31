import React, { useEffect, useState } from "react";
import { Carousel, Container, Button, Row, Col, Badge } from "react-bootstrap";
import { fetchMovies } from "../services/api";
import { FaChevronLeft, FaChevronRight, FaStar, FaInfoCircle, FaTicketAlt, FaPlay } from "react-icons/fa";

const HeroSection = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    async function loadMovies() {
      try {
        const movieData = await fetchMovies();
        if (!movieData.length) return;
        
        // Process movie data to add ratings and genres
        const processedMovies = movieData.map(movie => ({
          ...movie,
          rating: movie.rating || (Math.floor(Math.random() * 20) + 70) / 10, // Random rating between 7-9.5 if none exists
          genres: movie.genres || ['Drama', 'Action'].slice(0, Math.floor(Math.random() * 2) + 1) // Random genres if none
        }));
        
        setMovies(processedMovies.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
    loadMovies();
  }, []);

  const handleSelect = (selectedIndex) => {
    setIsTransitioning(true);
    setIndex(selectedIndex);
    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 600);
  };

  // Custom carousel controls
  const CustomPrevButton = ({ onClick }) => (
    <Button 
      onClick={onClick} 
      className="carousel-control-prev-custom"
      aria-label="Previous slide"
    >
      <FaChevronLeft />
    </Button>
  );

  const CustomNextButton = ({ onClick }) => (
    <Button 
      onClick={onClick} 
      className="carousel-control-next-custom"
      aria-label="Next slide"
    >
      <FaChevronRight />
    </Button>
  );

  // Custom carousel indicators
  const CustomIndicators = ({ items, activeIndex, onSelect }) => (
    <div className="carousel-indicators-custom">
      {items.map((_, idx) => (
        <button
          key={idx}
          className={`carousel-indicator-dot ${idx === activeIndex ? 'active' : ''}`}
          onClick={() => onSelect(idx)}
          aria-label={`Slide ${idx + 1}`}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="hero-container loading-container">
        <Container className="py-5 text-center">
          <div className="loading-spinner"></div>
          <p className="text-white mt-3">Loading amazing movies...</p>
        </Container>
      </div>
    );
  }

  return (
    <div className="hero-container">
      <Carousel 
        activeIndex={index} 
        onSelect={handleSelect} 
        fade 
        interval={6000}
        className="hero-carousel"
        controls={false}
        indicators={false}
        pause="hover"
      >
        {movies.map((movie, slideIndex) => (
          <Carousel.Item key={slideIndex} className={isTransitioning ? 'transitioning' : ''} style={{zIndex: 10}}>
            <div className="hero-overlay"></div>
            <div className="hero-slide d-flex align-items-center">
              <Container>
                <Row className="align-items-center">
                  {/* Left Side: Image with animation */}
                  <Col md={6} className="text-center mb-4 mb-md-0">
                    <div className={`hero-image-container ${index === slideIndex ? 'active' : ''}`}>
                      <img
                        src={movie.posterUrl || "/fallback.jpg"}
                        alt={movie.title}
                        className="img-fluid hero-img"
                      />
                      <div className="image-overlay-buttons">
                        <Button variant="light" className="play-trailer-btn">
                          <FaPlay className="me-1" />
                          Trailer
                        </Button>
                      </div>
                    </div>
                  </Col>

                  {/* Right Side: Details with staggered animations */}
                  <Col md={6} className="text-white text-start hero-content">
                    <div className={`hero-content-inner ${index === slideIndex ? 'active' : ''}`}>
                      <div className="movie-meta mb-3 delay-1">
                        <span className="rating me-3">
                          <FaStar className="text-warning me-1" />
                          {movie.rating}
                        </span>
                        {movie.genres && movie.genres.map((genre, i) => (
                          <Badge 
                            key={i} 
                            bg="secondary" 
                            className="me-2 genre-badge"
                          >
                            {genre}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Title */}
                      <h1 className="fw-bold mb-2 display-4 hero-title delay-2">
                        {movie.title}
                      </h1>
                      
                      {/* Description */}
                      <p className="hero-description delay-3">
                        {movie.description 
                          ? movie.description.substring(0, 140) + "..." 
                          : "Experience the magic of cinema with this captivating film that will take you on an unforgettable journey."
                        }
                      </p>
                      
                      {/* CTA Buttons */}
                      <div className="hero-cta delay-4">
                        <Button 
                          variant="primary" 
                          size="lg" 
                          className="me-2 book-btn"
                          href={`/movies/${movie._id}`}
                        >
                          <FaTicketAlt className="me-2" />
                          Book Now
                        </Button>
                        <Button 
                          variant="outline-light" 
                          size="lg"
                          className="details-btn"
                          href={`/movies/${movie._id}/details`}
                        >
                          <FaInfoCircle className="me-2" />
                          Movie Details
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Custom Controls */}
      <CustomPrevButton onClick={() => handleSelect(index === 0 ? movies.length - 1 : index - 1)} />
      <CustomNextButton onClick={() => handleSelect(index === movies.length - 1 ? 0 : index + 1)} />
      
      {/* Custom Indicators */}
      <CustomIndicators 
        items={movies} 
        activeIndex={index} 
        onSelect={handleSelect} 
      />
    </div>
  );
};

// Enhanced Styles
const heroStyle = `
  .hero-container {
    background: #000;
    position: relative;
    overflow: hidden;
    padding: 0;
  }
  
  /* Loading State */
  .loading-container {
    min-height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* Hero Background and Overlay */
  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%);
    z-index: 1;
  }
  
  .hero-slide {
    position: relative;
    z-index: 3;
    min-height: 600px;
    display: flex;
    align-items: center;
  }
  
  /* Image Container with Effects */
  .hero-image-container {
    position: relative;
    transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease;
    transform: translateY(30px);
    opacity: 0;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
    max-width: 85%;
    margin: 0 auto;
  }
  
  .hero-image-container.active {
    transform: translateY(0);
    opacity: 1;
  }
  
  .hero-img {
    max-height: 400px;
    object-fit: cover;
    width: 100%;
    border-radius: 15px;
    transition: transform 0.5s ease;
  }
  
  .hero-image-container:hover .hero-img {
    transform: scale(1.03);
  }
  
  /* Play Trailer Button */
  .image-overlay-buttons {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.4);
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 15px;
  }
  
  .hero-image-container:hover .image-overlay-buttons {
    opacity: 1;
  }

  .play-trailer-btn {
    background: white;
    padding: 8px 24px;
    border-radius: 30px;
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    transition: all 0.2s ease;
    font-weight: 500;
    font-size: 0.95rem;
    color: #000;
    display: inline-flex;
    align-items: center;
  }
  
  .play-trailer-btn .fa-play {
    font-size: 0.8rem;
  }
  
  .play-trailer-btn:hover {
    transform: scale(1.05);
    background-color: #fff;
  }
  
  /* Content Animations */
  .hero-content-inner {
    opacity: 0;
    transition: opacity 0.4s ease-in;
  }
  
  .hero-content-inner.active {
    opacity: 1;
  }
  
  .hero-content-inner.active > * {
    animation: fadeInUp 0.8s forwards;
    opacity: 1;
  }
  
  .delay-1 { animation-delay: 0.1s !important; }
  .delay-2 { animation-delay: 0.2s !important; }
  .delay-3 { animation-delay: 0.3s !important; }
  .delay-4 { animation-delay: 0.4s !important; }
  .delay-5 { animation-delay: 0.5s !important; }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Text Styling */
  .hero-title {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    margin-bottom: 15px;
    font-weight: 800;
  }
  
  .hero-description {
    font-size: 1.1rem;
    margin-bottom: 25px;
    opacity: 0.9;
    max-width: 90%;
    line-height: 1.6;
  }
  
  .movie-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
  
  .rating {
    font-weight: bold;
    font-size: 1.1rem;
  }
  
  .genre-badge {
    font-weight: normal;
    padding: 6px 12px;
    border-radius: 20px;
    margin-bottom: 5px;
  }
  
  /* Carousel Controls */
  .carousel-control-prev-custom, .carousel-control-next-custom {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.3);
    border: none;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    z-index: 10;
    border-radius: 50%;
    transition: all 0.2s ease;
    opacity: 0.6;
    font-size: 0.9rem;
  }
  
  .carousel-control-prev-custom:hover, .carousel-control-next-custom:hover {
    background: rgba(0, 0, 0, 0.5);
    opacity: 1;
    transform: translateY(-50%);
  }
  
  .carousel-control-prev-custom { left: 10px; }
  .carousel-control-next-custom { right: 10px; }
  
  /* Custom Indicators */
  .carousel-indicators-custom {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    z-index: 15;
  }
  
  .carousel-indicator-dot {
    width: 10px;
    height: 10px;
    margin: 0 5px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.4);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .carousel-indicator-dot.active {
    background-color: #fff;
    transform: scale(1.2);
  }
  
  /* Transition Effects */
  .transitioning .hero-content-inner.active > * {
    animation: none;
    opacity: 0;
  }
  
  .transitioning .hero-image-container.active {
    opacity: 0.7;
  }
  
  /* Responsive Adjustments */
  @media (max-width: 991px) {
    .hero-image-container {
      max-width: 75%;
    }
    
    .hero-img {
      max-height: 350px;
    }
  }

  @media (max-width: 767px) {
    .hero-slide {
      min-height: 500px;
    }
    
    .hero-title {
      font-size: 2rem;
    }
    
    .hero-description {
      font-size: 1rem;
    }
    
    .hero-img {
      max-height: 250px;
    }
    
    .hero-image-container {
      max-width: 65%;
    }
  }

  /* Hero Content Visibility */
  .hero-content {
    position: relative;
    z-index: 20;
  }

  /* Button Styles */
  .book-btn, .details-btn {
    z-index: 20;
    position: relative;
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
  }

  .book-btn {
    background-color: #007bff;
    border-color: #007bff;
    padding: 10px 20px;
    font-weight: 500;
  }

  .details-btn {
    border-color: #fff;
    color: #fff;
    padding: 10px 20px;
    font-weight: 500;
    background: transparent;
  }

  /* Fix animation issues */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Disable transitions during transition state */
  .transitioning .hero-content-inner.active > * {
    animation: none !important;
    opacity: 1 !important;
  }
`;

// Inject styles directly into the page
const styleTag = document.createElement("style");
styleTag.innerHTML = heroStyle;
document.head.appendChild(styleTag);

export default HeroSection;
