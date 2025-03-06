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


export const fetchShowtimeDetails = async (showtimeId) => {
  try {
    const response = await api.get(`/showtimes/${showtimeId}`);

    // If no valid showtime is found, return null
    if (!response.data || Object.keys(response.data).length === 0) {
      console.warn("Showtime not found, returning null.");
      return null;
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching showtime details:", error);
    return null; // Return null on error
  }
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

    // Check if showtime exists and has available seats
    if (response.data && response.data.availableSeats.length > 0) {
      return response.data.availableSeats;
    } else {
      console.warn("No seats found for this showtime, returning default seats.");
      
      // Default fallback seats
      return [
        { id: "A1", number: "A1", type: "VIP", booked: false },
        { id: "A2", number: "A2", type: "VIP", booked: false },
        { id: "B1", number: "B1", type: "Standard", booked: false },
        { id: "B2", number: "B2", type: "Standard", booked: false },
        { id: "C1", number: "C1", type: "Economy", booked: false },
        { id: "C2", number: "C2", type: "Economy", booked: false },
      ];
    }
  } catch (error) {
    console.error("Error fetching seats, using fallback data:", error);

    // Return default seats on error
    return [
      { id: "A1", number: "A1", type: "VIP", booked: false },
      { id: "A2", number: "A2", type: "VIP", booked: false },
      { id: "B1", number: "B1", type: "Standard", booked: false },
      { id: "B2", number: "B2", type: "Standard", booked: false },
      { id: "C1", number: "C1", type: "Economy", booked: false },
      { id: "C2", number: "C2", type: "Economy", booked: false },
    ];
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

export const mockPayment = async (bookingId) => {
  try {
      const response = await api.post("/payments/pay", { bookingId });
      return response.data;
  } catch (error) {
      console.error("Error processing mock payment:", error);
      throw error;
  }
};

export const fetchBookingHistory = async () => {
  try {
      const response = await api.get("/bookings/history");  // GET request
      return response.data;
  } catch (error) {
      console.error("Error fetching booking history:", error);
      throw error;
  }
};


export const cancelBooking = async (bookingId) => {
  try {
      const response = await api.delete(`/bookings/${bookingId}`); // DELETE request
      return response.data;
  } catch (error) {
      console.error("Error canceling booking:", error);
      throw error;
  }
};

export const fetchEvents = async (city = "", category = "") => {
  try {
    let url = "/ticketmaster/events";

    const queryParams = [];
    if (city) queryParams.push(`city=${encodeURIComponent(city)}`);
    if (category) queryParams.push(`category=${category}`);

    if (queryParams.length > 0) {
      url += "?" + queryParams.join("&");
    }

    console.log("🔍 Fetching events from:", url); // Debugging API request

    const response = await api.get(url);
    console.log("✅ Received Events Data:", response.data); // Debugging API response

    return response.data;
  } catch (error) {
    console.error("❌ Error fetching live events:", error.response?.data || error.message);
    return [];
  }
};




export default api;
