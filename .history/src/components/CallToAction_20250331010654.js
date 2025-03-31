import React from "react";
import { Container, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaUserPlus, FaFilm, FaTicketAlt } from "react-icons/fa";

const CallToAction = () => {
  return (
    <Card className="dark-card cta-card border-0 my-5">
      <Card.Body className="text-center py-5">
        <div className="cta-icon mb-3">
          <FaTicketAlt size={40} className="text-primary" />
        </div>
        <h2 className="text-light mb-3">Join Us for Exclusive Offers!</h2>
        <p className="lead text-muted mb-4">
          Sign up now and get <span className="text-primary fw-bold">special discounts</span> on your first movie booking!
        </p>
        <div className="d-flex justify-content-center">
          <Link to="/register">
            <Button variant="primary" size="lg" className="mx-2 px-4">
              <FaUserPlus className="me-2" /> Sign Up
            </Button>
          </Link>
          <Link to="/movies">
            <Button variant="outline-light" size="lg" className="mx-2 px-4">
              <FaFilm className="me-2" /> Browse Movies
            </Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

// Add styles for the dark theme call to action
const ctaStyles = `
  .cta-card {
    background: linear-gradient(135deg, #1e1e1e 0%, #252525 100%);
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 5px 20px rgba(0,0,0,0.25);
  }
  
  .cta-card:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(to right, #007bff, #6610f2);
  }
  
  .cta-icon {
    background-color: rgba(0, 123, 255, 0.1);
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  }
`;

// Inject styles
const styleTag = document.createElement("style");
styleTag.innerHTML = ctaStyles;
document.head.appendChild(styleTag);

export default CallToAction;
