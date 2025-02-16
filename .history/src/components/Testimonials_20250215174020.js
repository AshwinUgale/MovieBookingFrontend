import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";

const testimonials = [
  { name: "John Doe", review: "Amazing experience! The booking was super easy. ⭐⭐⭐⭐⭐" },
  { name: "Sarah Lee", review: "Loved the seamless seat selection and fast payment process! ⭐⭐⭐⭐" },
  { name: "Mark Smith", review: "A must-try for movie lovers. Great UI & customer service. ⭐⭐⭐⭐⭐" },
];

const Testimonials = () => {
  return (
    <Container className="my-5">
      <h2 className="text-center">💬 What Our Users Say</h2>
      <Row className="mt-4">
        {testimonials.map((testimonial, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <blockquote className="blockquote mb-0">
                  <p>“{testimonial.review}”</p>
                  <footer className="blockquote-footer">{testimonial.name}</footer>
                </blockquote>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Testimonials;
