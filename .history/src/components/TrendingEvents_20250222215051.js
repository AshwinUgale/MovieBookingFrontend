import React, { useEffect, useState } from "react";
import { fetchEvents } from "../services/api";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const TrendingEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      const eventsData = await fetchEvents();
      setEvents(eventsData.slice(0, 6)); // Show only top 6 events
    };

    getEvents();
  }, []);

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">🎭 Trending Events</h2>
        <Link to="/events" className="btn btn-link">View More</Link>
      </div>

      <Row className="g-4">
        {events.length > 0 ? (
          events.map((event) => (
            <Col key={event.id} xs={6} sm={4} md={3} lg={2}>
              <Card className="shadow-sm border">
                <Card.Img 
                  variant="top" 
                  src={event.image} 
                  alt={event.name} 
                  style={{ height: "200px", objectFit: "cover" }} 
                />
                <Card.Body className="text-center">
                  <Card.Title className="text-truncate">{event.name}</Card.Title>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    href={event.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-100"
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center text-muted col-12">No trending events available.</p>
        )}
      </Row>
    </Container>
  );
};

export default TrendingEvents;
