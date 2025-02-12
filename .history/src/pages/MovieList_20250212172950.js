import { useEffect, useState } from "react";
import { fetchMovies } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap"; // ✅ Bootstrap components

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
            <Col key={movie._id} xs={12} sm={6} md={4} lg={3} className="mb-3">
              <Card className="shadow-sm text-center" style={{ width: "220px", margin: "auto" }}>
                <Card.Img 
                  variant="top" 
                  src={movie.poster || "https://via.placeholder.com/200x300"} 
                  alt={movie.title} 
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <Card.Body className="p-2">
                  <Card.Title className="fs-6">{movie.title}</Card.Title>
                  <Card.Text className="mb-2">
                    <small className="text-muted">{movie.genre} | {movie.duration} min</small>
                  </Card.Text>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => navigate(`/showtimes/${movie._id}`)}
                  >
                    Showtimes
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
