import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // ✅ Import AuthContext
import { Container, Form, Button, Card, Alert } from "react-bootstrap"; // ✅ Import Bootstrap components

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
            const response = await fetch("http://localhost:5000/api/auth/login", {
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
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: "400px" }} className="p-4 shadow">
                <h2 className="text-center text-primary">🔑 Login</h2>
                
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleLogin}>
                    {/* Email Input */}
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="Enter your email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </Form.Group>

                    {/* Password Input */}
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Enter your password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </Form.Group>

                    {/* Login Button */}
                    <Button variant="primary" type="submit" className="w-100">
                        Login
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default LoginPage;
