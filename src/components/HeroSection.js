import React, { useEffect, useState } from "react";
import api from "../services/api";

const HeroSection = () => {
  const [featuredMovie, setFeaturedMovie] = useState(null);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await api.get("/movies");
        setFeaturedMovie(response.data[0]); // First movie as featured
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
    fetchMovies();
  }, []);

  if (!featuredMovie) return <p>Loading...</p>;

  return (
    <div className="hero-section text-center text-white" style={{ 
      background: `url(${featuredMovie.posterUrl || "/banner.jpg"}) center/cover no-repeat`,
      height: '500px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div>
        <h1>{featuredMovie.title}</h1>
        <p>{featuredMovie.description.substring(0, 100)}...</p>
        <a href={`/movies/${featuredMovie._id}`} className="btn btn-primary">Book Now</a>
      </div>
    </div>
  );
};

export default HeroSection;
