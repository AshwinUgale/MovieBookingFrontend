import React, { useEffect, useState } from "react";
import { fetchEvents } from "../services/api";
import Select from "react-select";
import { cityOptions } from "../data/cities"; 
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaFilter, FaClock } from "react-icons/fa";

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

  // Custom styles for react-select to match dark theme
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#2d2d2d',
      borderColor: '#333',
      color: '#fff',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#007bff'
      }
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#1e1e1e',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#007bff' : state.isFocused ? '#333' : '#1e1e1e',
      color: '#e0e0e0',
      '&:hover': {
        backgroundColor: '#333'
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#e0e0e0'
    }),
    input: (provided) => ({
      ...provided,
      color: '#e0e0e0'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#aaa'
    })
  };

  return (
    <div className="events-page">
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-4 text-light">
          <FaCalendarAlt className="me-2 text-primary" />
          Upcoming Events
        </h2>

        {/* Event Type & Location Filters */}
        <div className="filters mb-4 p-4 rounded">
          <h5 className="text-light mb-3">
            <FaFilter className="me-2" />
            Filter Events
          </h5>
          <div className="row g-3">
            {/* Location (City) Filter */}
            <div className="col-md-6">
              <label htmlFor="locationSelect" className="form-label text-light">Location:</label>
              <Select
                id="locationSelect"
                options={cityOptions}
                value={cityOptions.find(city => city.value === location)}
                onChange={(selectedOption) => setLocation(selectedOption.value)}
                styles={customSelectStyles}
                isSearchable // Allows searching
                placeholder="Select a city"
                className="dark-select"
              />
            </div>

            {/* Event Type Filter */}
            <div className="col-md-6">
              <label htmlFor="eventTypeSelect" className="form-label text-light">Event Type:</label>
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
        </div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-light">Loading events...</p>
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger text-center mt-4">{error}</div>
        )}

        {!loading && !error && (
          <div className="row g-4 justify-content-center">
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <div className="card event-card h-100">
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
                      {event.dates?.start?.localDate && (
                        <div className="event-date">
                          <FaCalendarAlt className="me-2" />
                          {new Date(event.dates.start.localDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                        </div>
                      )}
                    </div>
                    
                    {/* Event Details */}
                    <div className="card-body text-center">
                      <h5 className="card-title text-light mb-3">{event.name}</h5>
                      
                      <div className="mb-2 text-muted">
                        <FaMapMarkerAlt className="me-2" />
                        {event._embedded?.venues?.[0]?.name || "Venue TBA"}
                      </div>
                      
                      {event.dates?.start?.localTime && (
                        <div className="mb-3 text-muted">
                          <FaClock className="me-2" />
                          {new Date(`2000-01-01T${event.dates.start.localTime}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      )}
                      
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary w-100"
                      >
                        <FaTicketAlt className="me-2" />
                        Get Tickets
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <div className="alert alert-secondary">
                  No events available for the selected filters.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Add styles for the Events page 
const eventsStyles = `
  .events-page {
    background-color: #121212;
    min-height: 100vh;
  }
  
  .filters {
    background-color: #1e1e1e;
    border: 1px solid #333;
    margin-bottom: 30px;
  }
  
  .event-card {
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .event-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3) !important;
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
`;

// Inject styles
const styleTag = document.createElement("style");
styleTag.innerHTML = eventsStyles;
document.head.appendChild(styleTag);

export default Events;
