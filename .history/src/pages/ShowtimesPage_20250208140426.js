import { useEffect, useState } from "react";
import { fetchShowtimes } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

const ShowtimesPage = () => {
  const { movieId } = useParams(); // Get movieId from URL
  const [showtimes, setShowtimes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getShowtimes = async () => {
      try {
        const data = await fetchShowtimes(movieId);
        setShowtimes(data);
      } catch (error) {
        console.error("Error fetching showtimes:", error);
      }
    };

    getShowtimes();
  }, [movieId]);

  return (
    <div>
      <h2>Showtimes</h2>
      {showtimes.length === 0 ? (
        <p>Loading showtimes...</p> 
      ) : (
        <ul>
          {showtimes.map((show) => (
            <li key={show._id}>
              {new Date(show.showtime).toLocaleString()} - {show.theater}
              <button onClick={() => navigate(`/showtime/${show._id}`)}>
                Book Now
              </button> 
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShowtimesPage;
