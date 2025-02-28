import React, { useEffect, useState } from "react";
import { fetchEvents } from "../services/api";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const TrendingEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      const eventsData = await fetchEvents();
      
      // ✅ Remove duplicates and take the top 6
      const uniqueEvents = Array.from(new Map(eventsData.map(event => [event.id, event])).values());
      
      setEvents(uniqueEvents.slice(0, 6)); 
    };

    getEvents();
  }, []);

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">🎭 Trending Events</h2>
        <Link to="/events" className="btn btn-link">View More</Link>
      </div>

      <Row className="g-4 justify-content-center">
        {events.length > 0 ? (
          events.map((event) => (
            <Col key={event.id} xs={12} sm={6} md={4} lg={3} xl={2}>
              <Card className="shadow-sm event-card border-0">
                {/* ✅ Better Image Handling */}
                <div className="event-image-container">
                  <Card.Img 
                    variant="top"
                    src={event.images?.find(img => img.ratio === "16_9")?.url || event.images?.[0]?.url || "/fallback-event.jpg"}
                    alt={event.name}
                    className="event-image"
                    onError={(e) => { e.target.src = "/fallback-event.jpg"; }} 
                  />
                </div>

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

// ✅ Inject Styles Directly into the Page
const trendingEventsStyles = `
  .event-card {
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.2s ease-in-out;
  }

  .event-card:hover {
    transform: scale(1.05);
  }

  .event-image-container {
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f0f0;
  }

  .event-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .btn-primary {
    background-color: #007bff;
    border: none;
    transition: background 0.3s ease;
  }

  .btn-primary:hover {
    background-color: #0056b3;
  }
`;

const styleTag = document.createElement("style");
styleTag.innerHTML = trendingEventsStyles;
document.head.appendChild(styleTag);

export default TrendingEvents;
