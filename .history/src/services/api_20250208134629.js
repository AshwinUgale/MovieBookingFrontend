import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchMovies = async () => {
  const response = await api.get("/movies");
  return response.data;
};


export const fetchShowtimes = async (movieId) => {
  const response = await api.get(`/showtimes?movie=${movieId}`);
  return response.data;
};

export const addMovie = async (movieData) => {
  const token = localStorage.getItem("token");
  const response = await api.post("/movies", movieData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addShowtime = async (showtimeData) => {
  const token = localStorage.getItem("token");
  const response = await api.post("/showtimes", showtimeData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const fetchSeats = async (showtimeId) => {
  try {
    const response = await api.get(`/showtimes/${showtimeId}`);
    return response.data.availableSeats; 
  } catch (error) {
    console.error("Error fetching seats:", error);
    throw error;
  }
};


export const bookSeats = async (showtimeId, seats) => {
  try {
    const response = await api.post("/bookings", { showtimeId, seats });
    return response.data;
  } catch (error) {
    console.error("Error booking seats:", error);
    throw error;
  }
};


export default api;
