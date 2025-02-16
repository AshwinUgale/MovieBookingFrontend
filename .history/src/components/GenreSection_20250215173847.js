import React, { useEffect, useState } from "react";
import api from "../services/api";

const GenreSection = () => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    async function fetchGenres() {
      const response = await api.get("/movies");
      setGenres([...new Set(response.data.map(movie => movie.genre))]);
    }
    fetchGenres();
  }, []);

  return (
    <div className="container my-5">
      <h2 className="text-center">🎭 Browse by Genre</h2>
      <div className="d-flex flex-wrap justify-content-center">
        {genres.map(genre => (
          <a key={genre} href={`/movies?genre=${genre}`} className="btn btn-outline-secondary m-2">
            {genre}
          </a>
        ))}
      </div>
    </div>
  );
};

export default GenreSection;
