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
  try {
    const response = await api.get(`/showtimes/fake?movie=${movieId}`);
    console.log("🎬 API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching showtimes:", error);
    return [];
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
    console.log("🎯 Seat API response:", response.data);

    if (response.data && Array.isArray(response.data.availableSeats) && response.data.availableSeats.length > 0) {
      return response.data.availableSeats;
    } else {
      console.warn("🚨 No availableSeats or empty, falling back.");
      return generateReducedSeats();
    }
  } catch (error) {
    console.error("❌ Error fetching seats:", error);
    return generateReducedSeats();
  }
};


// ✅ Function to Generate a Reduced Theater Layout (30-40% fewer seats)
const generateReducedSeats = () => {
  const sections = ["VIP", "Platinum", "Gold", "Silver", "Economy"];
  let generatedSeats = [];

  sections.forEach((section) => {
    for (let row = 1; row <= 5; row++) { // Reduced from 7 to 5 rows
      for (let seat = 1; seat <= 8; seat++) { // Reduced from 12 to 8 seats per row
        generatedSeats.push({
          id: `${section}-${row}-${seat}`,
          number: `${section[0]}${row}${seat}`, // Example: V12, P32
          type: section,
          booked: Math.random() < 0.1 // 10% seats randomly booked
        });
      }
    }
  });

  return generatedSeats;
};




export const bookSeats = async (showtimeId, selectedSeats) => {
  const response = await api.post("/bookings", {
    showtimeId,
    seats: selectedSeats,
  });
  return response.data;
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
