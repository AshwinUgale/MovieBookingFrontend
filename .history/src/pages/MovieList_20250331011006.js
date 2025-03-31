import { useEffect, useState } from "react";
import { fetchMovies } from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import GenreSection from "../components/GenreSection";
import { FaFilm, FaTicketAlt } from "react-icons/fa";

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
        setVisibleCount(16); // ✅ Reset count when genre changes
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
    <div className="movie-list-page">
      <GenreSection />
      <Container className="mt-4">
        <h2 className="text-center mb-4 text-light">
          <FaFilm className="me-2 text-primary" />
          Now Showing
        </h2>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-light">Loading movies...</p>
          </div>
        ) : (
          <>
            <Row className="mt-4 g-4">
              {/* ✅ Only show up to visibleCount */}
              {Array.isArray(movies) && movies.slice(0, visibleCount).map((movie) => (
                <Col key={movie._id} xs={12} sm={6} md={4} lg={3} className="mb-3">
                  <Card className="movie-card h-100">
                    <div className="movie-poster-container">
                      <Card.Img
                        variant="top"
                        src={movie.posterUrl || "https://via.placeholder.com/200x300"}
                        alt={movie.title}
                        className="movie-poster"
                        onError={(e) => { e.target.src = "/default-poster.jpg"; }}
                      />
                    </div>
                    <Card.Body className="p-3">
                      <Card.Title className="text-light">{movie.title}</Card.Title>
                      <Card.Text className="mb-3">
                        <small className="text-muted">
                          {Array.isArray(movie.genre)
                            ? movie.genre.join(", ")
                            : movie.genre || "Unknown"}{" "}
                          | {movie.duration || "N/A"} min
                        </small>
                      </Card.Text>
                      <Button
                        variant="primary"
                        onClick={() => navigate(`/showtimes/fake/${movie._id}`)}
                        className="w-100"
                      >
                        <FaTicketAlt className="me-2" />
                        Showtimes
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* ✅ Load More Button */}
            {visibleCount < movies.length && (
              <div className="text-center mt-4 mb-5">
                <Button variant="outline-primary" onClick={() => setVisibleCount(prev => prev + 8)} className="px-4 py-2">
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

// Add dark theme styles for the movie list page
const movieListStyles = `
  .movie-list-page {
    background-color: #121212;
    min-height: 100vh;
    padding-bottom: 30px;
  }
  
  .movie-card {
    background-color: #1e1e1e !important;
    border: none;
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  
  .movie-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.3) !important;
  }
  
  .movie-poster-container {
    height: 300px;
    overflow: hidden;
    background-color: #121212;
  }
  
  .movie-poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .movie-card:hover .movie-poster {
    transform: scale(1.05);
  }
`;

// Inject styles
const styleTag = document.createElement("style");
styleTag.innerHTML = movieListStyles;
document.head.appendChild(styleTag);

export default MovieList;
