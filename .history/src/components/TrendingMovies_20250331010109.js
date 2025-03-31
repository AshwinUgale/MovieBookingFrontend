import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Card, Row, Col, Badge } from "react-bootstrap";
import { FaStar } from "react-icons/fa";

const TrendingMovies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await api.get("/movies");
        setMovies(response.data.slice(0, 6)); // Show 6 trending movies
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
    fetchMovies();
  }, []);

  return (
    <div className="container my-5">
      <h2 className="text-center">🔥 Trending Now</h2>
      <Row>
        {movies.map(movie => (
          <Col key={movie._id} md={4} className="mb-4">
            <Card className="dark-card movie-card">
              <div className="movie-poster-wrapper">
                <Card.Img variant="top" src={movie.posterUrl || "/default-poster.jpg"} />
                <div className="movie-rating">
                  <FaStar className="text-warning me-1" />
                  <span>{((Math.random() * 2) + 7).toFixed(1)}</span>
                </div>
              </div>
              <Card.Body>
                <Card.Title className="text-light">{movie.title}</Card.Title>
                <div className="mb-2">
                  {['Action', 'Drama'].map((genre, index) => (
                    <Badge key={index} bg="secondary" className="me-1">{genre}</Badge>
                  ))}
                </div>
                <a href={`/movies/${movie._id}`} className="btn btn-primary w-100 mt-2">View Details</a>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

// Add styles for dark mode movie cards
const movieStyles = `
  .dark-card {
    background-color: #1e1e1e;
    color: #e0e0e0;
    border: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }

  .movie-card {
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .movie-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
  }

  .movie-poster-wrapper {
    position: relative;
    overflow: hidden;
  }

  .movie-poster-wrapper img {
    height: 300px;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .movie-card:hover .movie-poster-wrapper img {
    transform: scale(1.05);
  }

  .movie-rating {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 5px 10px;
    border-radius: 20px;
    font-weight: bold;
    display: flex;
    align-items: center;
  }
`;

// Inject styles
const styleTag = document.createElement("style");
styleTag.innerHTML = movieStyles;
document.head.appendChild(styleTag);

export default TrendingMovies;
