import axios from "axios";

// Get runtime environment variables

const SPRING_API_BASE = window._env_.SPRING_API_URL || "http://localhost:8080/api";

const API_BASE = window._env_?.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const springApi = axios.create({
  baseURL: SPRING_API_BASE , // no env needed
  headers: {
    "Content-Type": "application/json"
  }
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
    for (let row = 1; row <= 5; row++) {
      for (let seat = 1; seat <= 8; seat++) {
        generatedSeats.push({
          id: `${section}-${row}-${seat}`,
          number: `${section[0]}${row}${seat}`,
          type: section,
          booked: Math.random() < 0.1
        });
      }
    }
  });

  return generatedSeats;
};


export const updateBookingStatus = async (bookingId) => {
  const response = await api.patch(`/payments/update-status/${bookingId}`);
  return response.data;
};



// ... keep all existing non-payment related functions ...

export const bookSeats = async (showtimeId, selectedSeats) => {
  try {
    const token = localStorage.getItem("token");
const response = await api.post("/bookings", {
  showtimeId,
  seats: selectedSeats,
}, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

    console.log("📦 Booking response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Booking error:", error);
    throw error.response?.data || error.message;
  }
};

// Payment-related functions


export const verifyPayment = async (paymentId, PayerID) => {
  const response = await api.post(`/payments/verify`, {
    paymentId,
    PayerID // match Spring's expected camelCase
  });
  return response.data;
};

export const getPaymentStatus = async (bookingId) => {
  try {
    const token = localStorage.getItem("token");
    console.log("🔍 Checking payment status for booking:", bookingId);
    const response = await api.get(`/payments/status/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("✅ Payment status response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error getting payment status:", error);
    throw error.response?.data || error.message;
  }
};


export const cancelPayment = async (bookingId) => {
  try {
    console.log("🔄 Canceling payment for booking:", bookingId);
    const response = await api.post(`/payments/cancel/${bookingId}`);
    console.log("✅ Payment cancellation response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error canceling payment:", error);
    throw error.response?.data || error.message;
  }
};

// ... keep all other existing functions ...



export const fetchBookingHistory = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get("/bookings/history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching booking history:", error);
    throw error.response?.data || error.message;
  }
};


export const cancelBooking = async (bookingId) => {
  try {
    const response = await api.delete(`/bookings/${bookingId}`);
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

    console.log("🔍 Fetching events from:", url);

    const response = await api.get(url);
    console.log("✅ Received Events Data:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Error fetching live events:", error.response?.data || error.message);
    return [];
  }
};

export default api;

