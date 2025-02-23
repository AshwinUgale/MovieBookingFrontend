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

      {/* Horizontal Scrollable Container */}
      <div className="flex overflow-x-auto space-x-4 py-4 scrollbar-hide">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="min-w-[200px] w-48 bg-white border rounded-lg shadow-md overflow-hidden">
              {/* Event Image */}
              <img src={event.image} alt={event.name} className="w-full h-32 object-cover" />

              {/* Event Details */}
              <div className="p-2">
                <h3 className="text-sm font-semibold text-gray-800 truncate">{event.name}</h3>
                <p className="text-xs text-gray-600 mt-1 truncate">📍 {event.venue}</p>
                <p className="text-xs text-gray-600 mt-1">🗓 {event.date}</p>
                <p className="text-xs text-gray-600 mt-1">⏰ {event.time || "TBA"}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-lg text-gray-500">No events available.</p>
        )}
      </div>
    </div>
  );
};

export default Events;
