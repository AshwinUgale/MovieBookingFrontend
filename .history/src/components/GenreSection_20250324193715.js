import React, { useEffect, useState } from "react";
import api from "../services/api";

const GenreSection = () => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await api.get("/movies/genres");
        const genreSet = new Set();

        // Flatten genres across all movies
        if (!Array.isArray(response.data)) {
          console.error("Genres API returned non-array data:", response.data);
          return;
        }
        
        response.data.forEach(movie => {
          if (Array.isArray(movie.genre)) {
            movie.genre.forEach(g => genreSet.add(g.trim()));
          } else if (typeof movie.genre === "string") {
            movie.genre.split(",").forEach(g => genreSet.add(g.trim()));
          }
        });

        setGenres([...genreSet]);
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
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
