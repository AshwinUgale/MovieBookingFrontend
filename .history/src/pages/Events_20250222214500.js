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
    return <div className="text-center text-xl font-bold mt-10">Loading Events...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center mb-6">🎭 Upcoming Events</h2>

      {/* Grid layout for events (same as movies) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="bg-white border rounded-lg shadow-md overflow-hidden">
              {/* Event Image */}
              <img src={event.image} alt={event.name} className="w-full h-48 object-cover" />

              {/* Event Details */}
              <div className="p-3 text-center">
                <h3 className="text-sm font-semibold text-gray-800 truncate">{event.name}</h3>
                <p className="text-xs text-gray-600 mt-1 truncate">📍 {event.venue}</p>
                <p className="text-xs text-gray-600 mt-1">🗓 {event.date}</p>
                <p className="text-xs text-gray-600 mt-1">⏰ {event.time || "TBA"}</p>

                {/* View Details Link */}
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-blue-500 text-white py-1 mt-2 rounded text-sm hover:bg-blue-600 transition duration-200"
                >
                  View Details
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-lg text-gray-500 col-span-full">No events available.</p>
        )}
      </div>
    </div>
  );
};

export default Events;
