import React, { useEffect, useState } from "react";
import api from "../services/api";

const GenreSection = () => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await api.get("/movies/genres");
        console.log("📦 Genres API Response:", response.data);

        // Make sure the response is an array
        if (!Array.isArray(response.data)) {
          console.error("Genres API returned non-array data:", response.data);
          return;
        }

        // Extract genre names
        const genreNames = response.data.map((g) => g.name);
        setGenres(genreNames);
      } catch (err) {
        console.error("🔥 Error in fetchGenres:", err.message);
      }
    }

    fetchGenres();
  }, []);

  return (
    <div className="container my-5">
      <h2 className="text-center">🎭 Browse by Genre</h2>
      <div className="d-flex flex-wrap justify-content-center">
        {genres.map((genre, index) => (
          <a
            key={`${genre}-${index}`}
            href={`/movies?genre=${genre}`}
            className="btn btn-outline-secondary m-2"
          >
            {genre}
          </a>
        ))}
      </div>
    </div>
  );
};

export default GenreSection;
