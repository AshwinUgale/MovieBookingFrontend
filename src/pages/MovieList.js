import { useEffect, useState } from "react";
import { fetchMovies } from "../services/api";
import { useNavigate } from "react-router-dom";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getMovies = async () => {
      try {
        const data = await fetchMovies();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    getMovies();
  }, []);

  return (
    <div>
      <h2>Now Showing</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {movies.map((movie) => (
          <div key={movie._id} style={{ margin: "10px", padding: "10px", border: "1px solid gray" }}>
            <h3>{movie.title}</h3>
            <p>{movie.genre} | {movie.duration} min</p>
            <button onClick={() => navigate(`/showtimes/${movie._id}`)}>View Showtimes</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
