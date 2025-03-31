import React, { useEffect, useState } from "react";
import { fetchEvents } from "../services/api";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from "react-icons/fa";

const TrendingEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      const eventsData = await fetchEvents();
      
      // Remove duplicates and take the top 6
      const uniqueEvents = Array.from(new Map(eventsData.map(event => [event.id, event])).values());
      
      setEvents(uniqueEvents.slice(0, 6)); 
    };

    getEvents();
  }, []);

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold text-light">
          <FaCalendarAlt className="me-2 text-primary" />
          Trending Events
        </h2>
        <Link to="/events" className="btn btn-link text-light">View More</Link>
      </div>

      <Row className="g-4 justify-content-center">
        {events.length > 0 ? (
          events.map((event) => (
            <Col key={event.id} xs={12} sm={6} md={4} lg={3} xl={2}>
              <Card className="dark-card event-card border-0">
                {/* Better Image Handling */}
                <div className="event-image-container">
                  <Card.Img 
                    variant="top"
                    src={event.images?.find(img => img.ratio === "16_9")?.url || event.images?.[0]?.url || "/fallback-event.jpg"}
                    alt={event.name}
                    className="event-image"
                    onError={(e) => { e.target.src = "/fallback-event.jpg"; }} 
                  />
                  {event.dates?.start?.localDate && (
                    <div className="event-date">
                      <FaCalendarAlt className="me-1" />
                      {new Date(event.dates.start.localDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                    </div>
                  )}
                </div>

                <Card.Body className="text-center">
                  <Card.Title className="text-truncate text-light">{event.name}</Card.Title>
                  {event._embedded?.venues?.[0]?.name && (
                    <div className="mb-2 text-muted event-venue">
                      <FaMapMarkerAlt className="me-1" />
                      <small>{event._embedded.venues[0].name}</small>
                    </div>
                  )}
                  <Button 
                    variant="primary"
                    size="sm"
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-100"
                  >
                    <FaTicketAlt className="me-1" />
                    Get Tickets
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

// Inject Styles Directly into the Page
const trendingEventsStyles = `
  .dark-card {
    background-color: #1e1e1e;
    color: #e0e0e0;
    border: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }

  .event-card {
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .event-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.25) !important;
  }

  .event-image-container {
    height: 180px;
    position: relative;
    overflow: hidden;
    background: #121212;
  }

  .event-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .event-card:hover .event-image {
    transform: scale(1.05);
  }
  
  .event-date {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
  }
  
  .event-venue {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #aaa !important;
  }

  .btn-primary {
    background-color: #007bff;
    border: none;
    transition: all 0.3s ease;
  }

  .btn-primary:hover {
    background-color: #0069d9;
  }
`;

const styleTag = document.createElement("style");
styleTag.innerHTML = trendingEventsStyles;
document.head.appendChild(styleTag);

export default TrendingEvents;
