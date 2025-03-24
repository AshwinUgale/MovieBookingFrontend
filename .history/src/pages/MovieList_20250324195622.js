import { useEffect, useState } from "react";
import { fetchMovies } from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import GenreSection from "../components/GenreSection";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load More state
  const [visibleCount, setVisibleCount] = useState(8);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const selectedGenre = query.get("genre");

    const getMovies = async () => {
      try {
        const data = await fetchMovies();
        const filtered = selectedGenre
          ? data.filter((movie) => {
              const genres = Array.isArray(movie.genre)
                ? movie.genre
                : movie.genre.split(",");
              return genres.map(g => g.trim()).includes(selectedGenre);
            })
          : data;

        setMovies(filtered);
        setVisibleCount(12); // ✅ Reset count when genre changes
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
      setLoading(false);
    };

    getMovies();
  }, [location.search]);
  console.log("📦 Movies state:", movies);
  console.log("📦 Loading state:", loading);
  
  return (
    <div>
      <GenreSection />
      <Container className="mt-4">
        <h2 className="text-center text-primary">🎬 Now Showing</h2>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            <Row className="mt-4">
              {/* ✅ Only show up to visibleCount */}
              {Array.isArray(movies) && movies.slice(0, visibleCount).map((movie) => (
                <Col key={movie._id} xs={12} sm={6} md={4} lg={3} className="mb-3">
                  <Card className="shadow-sm text-center" style={{ width: "100%", maxWidth: "220px", margin: "auto" }}>
                    <div
                      style={{
                        width: "100%",
                        height: "300px",
                        overflow: "hidden",
                        backgroundColor: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Card.Img
                        variant="top"
                        src={movie.posterUrl || "https://via.placeholder.com/200x300"}
                        alt={movie.title}
                        style={{
                          width: "100%",
                          height: "300px",
                          objectFit: "cover"
                        }}
                        onError={(e) => { e.target.src = "/default-poster.jpg"; }}
                      />
                    </div>
                    <Card.Body className="p-2">
                      <Card.Title className="fs-6">{movie.title}</Card.Title>
                      <Card.Text className="mb-2">
                        <small className="text-muted">
                          {Array.isArray(movie.genre)
                            ? movie.genre.join(", ")
                            : movie.genre || "Unknown"}{" "}
                          | {movie.duration || "N/A"} min
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

            {/* ✅ Load More Button */}
            {visibleCount < movies.length && (
              <div className="text-center mt-3">
                <Button variant="outline-primary" onClick={() => setVisibleCount(prev => prev + 8)}>
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default MovieList;
