import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // ✅ Import AuthContext

const Navbar = () => {
    const { isAuthenticated, logout } = useContext(AuthContext); // ✅ Use authentication state

    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/movies">Movies</Link></li>
                {isAuthenticated && <li><Link to="/bookings">My Bookings</Link></li>}
                {isAuthenticated ? (
                    <li><button onClick={logout}>Logout</button></li>
                ) : (
                    <li><Link to="/login">Login</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
