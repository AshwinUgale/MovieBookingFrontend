import { useState, useEffect } from "react";
import api from "../services/api";

const AdminShowtimePage = () => {
  const [movies, setMovies] = useState([]);
  const [showtime, setShowtime] = useState({
    movie: "",
    theater: "",
    showtime: "",
    availableSeats: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await api.get("/movies");
        setMovies(data.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  const handleChange = (e) => {
    setShowtime({ ...showtime, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/showtimes", showtime, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Showtime added successfully!");
      setShowtime({ movie: "", theater: "", showtime: "", availableSeats: "" });
    } catch (error) {
      setMessage("Error adding showtime: " + error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Add a New Showtime</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <select name="movie" value={showtime.movie} onChange={handleChange} required>
          <option value="">Select a Movie</option>
          {movies.map((movie) => (
            <option key={movie._id} value={movie._id}>{movie.title}</option>
          ))}
        </select>
        <input type="text" name="theater" placeholder="Theater Name" value={showtime.theater} onChange={handleChange} required />
        <input type="datetime-local" name="showtime" value={showtime.showtime} onChange={handleChange} required />
        <input type="text" name="availableSeats" placeholder="Available Seats (comma separated)" value={showtime.availableSeats} onChange={handleChange} required />
        <button type="submit">Add Showtime</button>
      </form>
    </div>
  );
};

export default AdminShowtimePage;
