import React, { useEffect, useState } from "react";
import { fetchEvents } from "../services/api";

const Events = () => {
  const [eventType, setEventType] = useState(""); // No default category
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events when eventType changes
  useEffect(() => {
    const getEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(`🎯 Fetching events for category: ${eventType || "All"}`);

        const data = await fetchEvents(eventType?.toLowerCase() || undefined); // Ensure lowercase
        console.log("📩 Received Data:", data);

        // Remove duplicate events based on event.id
        const uniqueEvents = Array.from(
          new Map(data.map((event) => [event.id, event])).values()
        );

        setEvents(uniqueEvents);
      } catch (err) {
        console.error("❌ Error fetching events:", err);
        setError("Failed to fetch events. Please try again later.");
      }
      setLoading(false);
    };

    getEvents();
  }, [eventType]);

  return (
    <div className="container mt-5">
      <h2 className="text-center fw-bold mb-4">🎭 Upcoming Events</h2>

      {/* Event Type Filter */}
      <div className="filters mb-4 d-flex justify-content-center gap-3">
        <div>
          <label htmlFor="eventTypeSelect" className="form-label">Event Type:</label>
          <select
            id="eventTypeSelect"
            value={eventType}
            onChange={(e) => setEventType(e.target.value.toLowerCase())} // Ensure lowercase
            className="form-select"
          >
            <option value="">All Events</option>
            <option value="music">Music</option>
            <option value="sports">Sports</option>
            <option value="theatre">Theatre</option>
            <option value="film">Film</option>
            <option value="miscellaneous">Miscellaneous</option>
          </select>
        </div>
      </div>

      {loading && <div className="text-center fs-4 fw-bold mt-4">Loading Events...</div>}
      {error && <div className="text-center text-danger mt-4">{error}</div>}

      {!loading && !error && (
        <div className="row g-4 justify-content-center">
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card event-card shadow-lg border-0">
                  {/* Event Image */}
                  <div className="event-image-container">
                    <img
                      src={
                        event.images?.find((img) => img.ratio === "16_9")?.url ||
                        event.images?.[0]?.url ||
                        "/fallback-event.jpg"
                      }
                      alt={event.name}
                      className="card-img-top event-image"
                      onError={(e) => {
                        e.target.src = "/fallback-event.jpg"; // Better fallback handling
                      }}
                    />
                  </div>
                  {/* Event Details */}
                  <div className="card-body text-center">
                    <h6 className="card-title">{event.name}</h6>
                    <p className="card-text small">📍 {event._embedded?.venues?.[0]?.name || "Venue TBA"}</p>
                    <p className="card-text small">🗓 {event.dates?.start?.localDate || "Date TBA"}</p>
                    <p className="card-text small">⏰ {event.dates?.start?.localTime || "Time TBA"}</p>
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
            <p className="text-center text-muted col-12">No events available for the selected category.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Events;
