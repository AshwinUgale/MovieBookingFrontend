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


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/movies" element={<MovieList />} />  {/* ✅ Updated path */}
        <Route path="/showtimes/:movieId" element={<ShowtimesPage />} />  {/* ✅ Updated path */}
        <Route path="/showtime/:showtimeId" element={<ShowtimePage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute component={DashboardPage} />} />
        <Route path="/admin/movies" element={<PrivateRoute component={AdminMoviePage} />} />
        <Route path="/admin/showtimes" element={<PrivateRoute component={AdminShowtimePage} />} />
      </Routes>
    </Router>
  );
}

export default App;
