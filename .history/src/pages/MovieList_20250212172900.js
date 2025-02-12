import { useEffect, useState } from "react";
import { fetchMovies } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap"; // ✅ Import Bootstrap components

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getMovies = async () => {
      try {
        const data = await fetchMovies();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
      setLoading(false);
    };

    getMovies();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center text-primary">🎬 Now Showing</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row className="mt-4">
          {movies.map((movie) => (
            <Col key={movie._id} xs={12} md={6} lg={4} className="mb-4">
              <Card className="shadow-sm">
                <Card.Img 
                  variant="top" 
                  src={movie.poster || "https://via.placeholder.com/300x450"} 
                  alt={movie.title} 
                  style={{ height: "400px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <Card.Text>
                    <strong>Genre:</strong> {movie.genre} <br />
                    <strong>Duration:</strong> {movie.duration} min
                  </Card.Text>
                  <Button 
                    variant="primary" 
                    className="w-100" 
                    onClick={() => navigate(`/showtimes/${movie._id}`)}
                  >
                    View Showtimes
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MovieList;
