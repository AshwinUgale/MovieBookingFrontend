import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const AdminMoviePage = () => {
  const [movie, setMovie] = useState({
    title: "",
    description: "",
    genre: "",
    duration: "",
    releaseDate: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/movies", movie, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Movie added successfully!");
      setMovie({ title: "", description: "", genre: "", duration: "", releaseDate: "" });
    } catch (error) {
      setMessage("Error adding movie: " + error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Add a New Movie</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" value={movie.title} onChange={handleChange} required />
        <input type="text" name="description" placeholder="Description" value={movie.description} onChange={handleChange} required />
        <input type="text" name="genre" placeholder="Genre" value={movie.genre} onChange={handleChange} required />
        <input type="number" name="duration" placeholder="Duration (mins)" value={movie.duration} onChange={handleChange} required />
        <input type="date" name="releaseDate" value={movie.releaseDate} onChange={handleChange} required />
        <button type="submit">Add Movie</button>
      </form>
    </div>
  );
};

export default AdminMoviePage;
