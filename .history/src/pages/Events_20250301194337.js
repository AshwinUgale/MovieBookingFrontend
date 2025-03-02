import React, { useEffect, useState } from "react";
import { fetchEvents } from "../services/api";
import Select from "react-select";
import { cityOptions } from "../data/cities"; 
const Events = () => {
  const [eventType, setEventType] = useState(""); // No default category
  const [location, setLocation] = useState(""); // New state for city filter
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events when eventType or location changes
  useEffect(() => {
    const getEvents = async () => {
      setLoading(true);
      setError(null);

      console.log(`🎯 Fetching events for category: ${eventType || "All"}, location: ${location || "All"}`);

      try {
        const data = await fetchEvents(location, eventType?.toLowerCase() || "");
        console.log("📩 Received Data from API:", data);

        if (!Array.isArray(data)) {
          console.error("🚨 API returned invalid data:", data);
          setError("Invalid data received from the server.");
          setLoading(false);
          return;
        }

        const uniqueEvents = Array.from(new Map(data.map((event) => [event.id, event])).values());
        setEvents(uniqueEvents);
      } catch (err) {
        console.error("❌ Error fetching events:", err);
        setError("Failed to fetch events. Please try again.");
      }

      setLoading(false);
    };

    getEvents();
  }, [eventType, location]); // ✅ Fetch new events when eventType or location changes

  return (
    <div className="container mt-5">
      <h2 className="text-center fw-bold mb-4">🎭 Upcoming Events</h2>

      {/* Event Type & Location Filters */}
      <div className="filters mb-4 d-flex justify-content-center gap-3">
        {/* Location (City) Filter */}
        <div>
          <label htmlFor="locationSelect" className="form-label">Location:</label>
          <Select
            id="locationSelect"
            options={cityOptions}
            value={cityOptions.find(city => city.value === location)}
            onChange={(selectedOption) => setLocation(selectedOption.value)}
            className="form-select"
            isSearchable // Allows searching
          />
        </div>

        {/* Event Type Filter */}
        <div>
          <label htmlFor="eventTypeSelect" className="form-label">Event Type:</label>
          <select
            id="eventTypeSelect"
            value={eventType}
            onChange={(e) => setEventType(e.target.value.toLowerCase())}
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
                        e.target.src = "/fallback-event.jpg";
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
            <p className="text-center text-muted col-12">No events available for the selected filters.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Events;
