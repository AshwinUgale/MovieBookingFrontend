import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Card, Row, Col } from "react-bootstrap";

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
            <Card>
              <Card.Img variant="top" src={movie.posterUrl || "/default-poster.jpg"} />
              <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <a href={`/movies/${movie._id}`} className="btn btn-primary">View Details</a>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TrendingMovies;
