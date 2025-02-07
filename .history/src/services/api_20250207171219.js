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
  const response = await api.post("/movies", movieData);
  return response.data;
};

export const addShowtime = async (showtimeData) => {
  const response = await api.post("/showtimes", showtimeData);
  return response.data;
};

export default api;
