import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token") !== null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h1>Welcome to the Movie Booking App</h1>
      <nav>
        <Link to="/movies">🎬 Browse Movies</Link> |  
        {!isAuthenticated ? (
          <>
            <Link to="/login">🔑 Login</Link> |  
            <Link to="/register">📝 Register</Link>
          </>
        ) : (
          <>
           
            <button onClick={handleLogout} style={{ background: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}>
              🚪 Logout
            </button>
          </>
        )}
      </nav>
    </div>
  );
};

export default HomePage;
