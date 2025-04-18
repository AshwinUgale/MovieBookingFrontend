import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // ✅ Import AuthContext
import { Container, Form, Button, Card, Alert } from "react-bootstrap"; // ✅ Import Bootstrap components
import { FaKey, FaEnvelope, FaUser } from "react-icons/fa";

const LoginPage = () => {
    const { login } = useContext(AuthContext); // ✅ Get login function from context
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Reset error message

        try {
            const response = await fetch(`${window.env.REACT_API_URL}/api/auth/login`, {

                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                login(data.token); // ✅ Update authentication state
                navigate("/"); // Redirect to home after login
            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch (err) {
            setError("Login failed. Please try again.");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100 auth-page">
            <Card className="p-4 shadow auth-card">
                <h2 className="text-center mb-4 text-light">
                    <FaKey className="me-2 text-primary" />
                    Login
                </h2>
                
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleLogin}>
                    {/* Email Input */}
                    <Form.Group className="mb-3">
                        <Form.Label className="text-light">Email</Form.Label>
                        <div className="input-with-icon">
                            <FaEnvelope className="input-icon text-muted" />
                            <Form.Control 
                                type="email" 
                                placeholder="Enter your email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                className="ps-4"
                            />
                        </div>
                    </Form.Group>

                    {/* Password Input */}
                    <Form.Group className="mb-3">
                        <Form.Label className="text-light">Password</Form.Label>
                        <div className="input-with-icon">
                            <FaKey className="input-icon text-muted" />
                            <Form.Control 
                                type="password" 
                                placeholder="Enter your password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                className="ps-4"
                            />
                        </div>
                    </Form.Group>

                    {/* Login Button */}
                    <Button variant="primary" type="submit" className="w-100 mt-3">
                        Login
                    </Button>
                </Form>
                
                <div className="text-center mt-3">
                    <p className="text-muted">Don't have an account? <Link to="/register" className="text-primary">Register here</Link></p>
                </div>
            </Card>
        </Container>
    );
};

// Add styles to match the dark theme
const loginStyles = `
    .auth-page {
        background-color: #121212;
    }
    
    .auth-card {
        background-color: #1e1e1e !important;
        border: none;
        border-radius: 10px;
        width: 400px;
        max-width: 90%;
    }
    
    .input-with-icon {
        position: relative;
    }
    
    .input-icon {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
    }
`;

// Inject styles
const styleTag = document.createElement("style");
styleTag.innerHTML = loginStyles;
document.head.appendChild(styleTag);

export default LoginPage;
