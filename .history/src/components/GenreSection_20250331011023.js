import React, { useEffect, useState } from "react";
import api from "../services/api";
import { FaTags } from "react-icons/fa";

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
    <div className="genre-section py-4">
      <div className="container">
        <h2 className="text-center mb-4 text-light">
          <FaTags className="me-2 text-primary" />
          Browse by Genre
        </h2>
        <div className="d-flex flex-wrap justify-content-center">
          {genres.map((genre, index) => (
            <a
              key={`${genre}-${index}`}
              href={`/movies?genre=${genre}`}
              className="genre-btn m-2"
            >
              {genre}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

// Add styles for the genre section
const genreStyles = `
  .genre-section {
    background-color: #1e1e1e;
    border-bottom: 1px solid #333;
  }
  
  .genre-btn {
    background-color: #252525;
    color: #e0e0e0;
    border: 1px solid #444;
    border-radius: 20px;
    padding: 8px 16px;
    text-decoration: none;
    transition: all 0.2s ease;
    font-size: 0.9rem;
  }
  
  .genre-btn:hover {
    background-color: #007bff;
    border-color: #007bff;
    color: white;
    transform: translateY(-2px);
  }
`;

// Inject styles
const styleTag = document.createElement("style");
styleTag.innerHTML = genreStyles;
document.head.appendChild(styleTag);

export default GenreSection;
