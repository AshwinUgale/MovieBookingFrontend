import { useEffect, useState } from "react";
import { fetchShowtimes } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button, ListGroup, Spinner, Alert } from "react-bootstrap"; // ✅ Bootstrap Components

const ShowtimesPage = () => {
  const { movieId } = useParams(); // Get movieId from URL
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getShowtimes = async () => {
      try {
        const data = await fetchShowtimes(movieId);
        setShowtimes(data);
      } catch (err) {
        setError("Failed to fetch showtimes. Please try again.");
      }
      setLoading(false);
    };

    getShowtimes();
  }, [movieId]);

  return (
    <Container className="mt-4">
      <h2 className="text-center text-primary">🎭 Available Showtimes</h2>

      {loading ? (
        <div className="text-center mt-4">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">{error}</Alert>
      ) : showtimes.length === 0 ? (
        <Alert variant="warning" className="text-center">No showtimes available.</Alert>
      ) : (
        <Card className="shadow-sm mt-3">
          <ListGroup variant="flush">
            {showtimes.map((show) => (
              <ListGroup.Item key={show._id} className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{new Date(show.showtime).toLocaleString()}</strong> <br />
                  🎭 <span className="text-muted">{show.theater}</span>
                </div>
                <Button variant="success" size="sm" onClick={() => navigate(`/showtime/${show._id}`)}>
                  🎟️ Book Now
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      )}
    </Container>
  );
};

export default ShowtimesPage;
