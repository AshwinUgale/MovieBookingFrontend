import { Link } from "react-router-dom";

const Navbar = () => {
    const isAuthenticated = localStorage.getItem("token") !== null; // Check if the user is logged in

    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/movies">Movies</Link></li>
                {isAuthenticated && <li><Link to="/bookings">My Bookings</Link></li>} {/* Show only if logged in */}
                {isAuthenticated ? (
                    <li><button onClick={() => { localStorage.removeItem("token"); window.location.reload(); }}>Logout</button></li>
                ) : (
                    <li><Link to="/login">Login</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
