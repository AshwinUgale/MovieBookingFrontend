import { useEffect, useState } from "react";
import { fetchMovies } from "../services/api";
import { useLocation,useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap"; // ✅ Bootstrap components
import GenreSection from "../components/GenreSection";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const query = useQuery();
  const selectedGenre = query.get("genre");

  useEffect(() => {
    const getMovies = async () => {
      try {
        const data = await fetchMovies();
        const filtered = selectedGenre
        ? data.filter((movie) => movie.genre === selectedGenre)
        : data;
        console.log("Fetched Movies:", data); // ✅ Debugging: Check API Response
        setMovies(filtered);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
      setLoading(false);
    };

    getMovies();
  }, []);

  return (
    <div>
      <GenreSection/>
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
              <Card className="shadow-sm text-center" style={{ width: "100%", maxWidth: "220px", margin: "auto" }}>
                <div 
                  style={{ 
                    width: "100%", 
                    height: "300px", 
                    overflow: "hidden",
                    backgroundColor: "#f0f0f0", // Light grey background in case of missing images
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Card.Img
                      variant="top"
                      src={movie.posterUrl || "https://via.placeholder.com/200x300"} // ✅ Use posterUrl instead of poster
                      alt={movie.title}
                      style={{
                        width: "100%",
                        height: "300px", // Ensuring a fixed height
                        objectFit: "cover",
                      }}
                      onError={(e) => { e.target.src = "/default-poster.jpg"; }} // ✅ Fallback for broken images
                    />

                </div>
                <Card.Body className="p-2">
                  <Card.Title className="fs-6">{movie.title}</Card.Title>
                    <Card.Text className="mb-2">
                      <small className="text-muted">
                        {Array.isArray(movie.genre) 
                          ? movie.genre.join(", ")  
                          : movie.genre || "Unknown"}  
                        {" | "}
                        {movie.duration || "N/A"} min
                      </small>
                    </Card.Text>

                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => navigate(`/showtimes/fake/${movie._id}`)}
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
    </div>
    
  );
};

export default MovieList;
