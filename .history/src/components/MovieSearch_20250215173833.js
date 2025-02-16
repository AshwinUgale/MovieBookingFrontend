import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MovieSearch = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/movies?search=${query}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="d-flex my-4">
      <input type="text" className="form-control me-2" placeholder="Search movies..." value={query} onChange={(e) => setQuery(e.target.value)} />
      <button type="submit" className="btn btn-outline-primary">Search</button>
    </form>
  );
};

export default MovieSearch;
