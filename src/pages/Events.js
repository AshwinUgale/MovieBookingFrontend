import React, { useEffect, useState } from "react";
import { fetchEvents } from "../services/api";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEvents = async () => {
      const data = await fetchEvents();
      setEvents(data);
      setLoading(false);
    };

    getEvents();
  }, []);

  if (loading) {
    return <div className="text-center fs-4 fw-bold mt-4">Loading Events...</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center fw-bold mb-4">
        🎭 Upcoming Events
      </h2>

      {/* Bootstrap Grid Layout for Events */}
      <div className="row g-4">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
              <div className="card shadow-sm border">
                {/* Event Image */}
                <img
                  src={event.image}
                  alt={event.name}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />

                {/* Event Details */}
                <div className="card-body text-center">
                  <h6 className="card-title text-truncate">{event.name}</h6>
                  <p className="card-text small mb-1">📍 {event.venue}</p>
                  <p className="card-text small">🗓 {event.date}</p>
                  <p className="card-text small">⏰ {event.time || "TBA"}</p>

                  {/* View Details Link */}
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm w-100"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted col-12">No events available.</p>
        )}
      </div>
    </div>
  );
};

export default Events;
