import React, { useEffect, useState } from "react";
import { fetchEvents } from "../services/api";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEvents = async () => {
      const data = await fetchEvents();
      console.log("Fetched Events Data:", data);

      // ✅ Remove duplicate events based on `event.id`
      const uniqueEvents = Array.from(new Map(data.map(event => [event.id, event])).values());
      
      setEvents(uniqueEvents);
      setLoading(false);
    };

    getEvents();
  }, []);

  if (loading) {
    return <div className="text-center fs-4 fw-bold mt-4">Loading Events...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center fw-bold mb-4">
        🎭 Upcoming Events
      </h2>

      <div className="row g-4 justify-content-center">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card event-card shadow-lg border-0">
                {/* ✅ Event Image with uniform sizing */}
                <div className="event-image-container">
                  <img
                    src={event.images?.find(img => img.ratio === "16_9")?.url || event.images?.[0]?.url || "/fallback-event.jpg"}
                    alt={event.name}
                    className="card-img-top event-image"
                    onError={(e) => { e.target.src = "/fallback-event.jpg"; }}
                  />
                </div>

                {/* ✅ Event Details with spacing & readability */}
                <div className="card-body text-center">
                  <h6 className="card-title">{event.name}</h6>
                  <p className="card-text small">📍 {event.venue || "Venue TBA"}</p>
                  <p className="card-text small">🗓 {event.date || "Date TBA"}</p>
                  <p className="card-text small">⏰ {event.time || "Time TBA"}</p>

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

// ✅ Injecting CSS Directly into the Page
const eventStyles = `
  .event-card {
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.2s ease-in-out;
  }

  .event-card:hover {
    transform: scale(1.03);
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
styleTag.innerHTML = eventStyles;
document.head.appendChild(styleTag);

export default Events;
