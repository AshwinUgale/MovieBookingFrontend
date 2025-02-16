import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <Container className="text-center my-5 py-5 bg-light rounded shadow">
      <h2 className="text-dark">🎟️ Join Us for Exclusive Offers!</h2>
      <p className="lead text-muted">
        Sign up now and get **special discounts** on your first movie booking!
      </p>
      <div className="d-flex justify-content-center">
        <Link to="/register">
          <Button variant="success" className="mx-2">📝 Sign Up</Button>
        </Link>
        <Link to="/movies">
          <Button variant="primary" className="mx-2">🎬 Browse Movies</Button>
        </Link>
      </div>
    </Container>
  );
};

export default CallToAction;
