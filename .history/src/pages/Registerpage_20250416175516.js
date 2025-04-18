import { useState } from "react";
import api from "../services/api"; // Import Axios instance
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap"; // ✅ Import Bootstrap components
import { FaUserPlus, FaEnvelope, FaUser, FaKey } from "react-icons/fa";

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
      console.log("📤 Sending registration:", { name, email, password });

      navigate("/login"); // Redirect to login page after successful registration
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 auth-page">
      <Card className="p-4 shadow auth-card">
        <h2 className="text-center mb-4 text-light">
          <FaUserPlus className="me-2 text-primary" />
          Register
        </h2>
        
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleRegister}>
          {/* Name Input */}
          <Form.Group className="mb-3">
            <Form.Label className="text-light">Name</Form.Label>
            <div className="input-with-icon">
              <FaUser className="input-icon text-muted" />
              <Form.Control 
                type="text" 
                placeholder="Enter your name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                className="ps-4"
              />
            </div>
          </Form.Group>

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

          {/* Register Button */}
          <Button variant="primary" type="submit" className="w-100 mt-3">
            Register
          </Button>
        </Form>

        <div className="text-center mt-3">
          <p className="text-muted">Already have an account? <Link to="/login" className="text-primary">Login here</Link></p>
        </div>
      </Card>
    </Container>
  );
};

// Add styles to match the dark theme
const registerStyles = `
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
styleTag.innerHTML = registerStyles;
document.head.appendChild(styleTag);

export default RegisterPage;
