import { useState } from "react";
import api from "../services/api"; // Import Axios instance
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap"; // ✅ Import Bootstrap components

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    try {
      await api.post("/auth/register", { name, email, password });
      navigate("/login"); // Redirect to login page after successful registration
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "400px" }} className="p-4 shadow">
        <h2 className="text-center text-primary">📝 Register</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleRegister}>
          {/* Name Input */}
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter your name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </Form.Group>

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

          {/* Register Button */}
          <Button variant="primary" type="submit" className="w-100">
            Register
          </Button>
        </Form>

        <div className="text-center mt-3">
          <p>Already have an account? <a href="/login" className="text-primary">Login here</a></p>
        </div>
      </Card>
    </Container>
  );
};

export default RegisterPage;
