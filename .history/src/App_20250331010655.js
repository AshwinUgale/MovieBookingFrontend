import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./utils/PrivateRoute";
import MovieList from "./pages/MovieList";
import ShowtimesPage from "./pages/ShowtimesPage";
import AdminMoviePage from "./pages/AdminMoviePage";
import AdminShowtimePage from "./pages/AdminShowtimePage";
import ShowtimePage from "./pages/ShowtimePage";
import PaymentPage from "./pages/PaymentPage";
import BookingHistoryPage from "./pages/BookingHistoryPage";
import CustomNavbar from "./components/Navbar";
import AuthProvider from "./context/AuthContext"; 
import Events from "./pages/Events";

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Import global dark theme
import './styles/DarkTheme.css';

function App() {
  return (
    <AuthProvider>
    <Router>
      <CustomNavbar/>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/movies" element={<MovieList />} />  {/* ✅ Updated path */}
        <Route path="/events" element={<Events />} />
        <Route path="/showtimes/fake/:movieId" element={<ShowtimesPage />} />  {/* ✅ Updated path */}
        <Route path="/showtime/:showtimeId" element={<ShowtimePage />} />
        <Route path="/payment/:bookingId" element={<PaymentPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute component={DashboardPage} />} />
        <Route path="/admin/movies" element={<PrivateRoute component={AdminMoviePage} />} />
        <Route path="/admin/showtimes" element={<PrivateRoute component={AdminShowtimePage} />} />
        <Route path="/bookings" element={<PrivateRoute component={BookingHistoryPage} />} /> 
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
