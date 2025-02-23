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
      <h2 className="text-3xl font-bold text-center mb-8">🎭 Upcoming Events</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="bg-white border rounded-lg shadow-lg overflow-hidden">
              {/* Event Image */}
              <img src={event.image} alt={event.name} className="w-full h-52 object-cover" />

              {/* Event Details */}
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{event.name}</h3>
                <p className="text-gray-600 mt-1">
                  📍 <span className="font-medium">{event.venue}</span>
                </p>
                <p className="text-gray-600 mt-1">
                  🗓 <span className="font-medium">{event.date}</span>
                </p>
                <p className="text-gray-600 mt-1">
                  ⏰ <span className="font-medium">{event.time || "TBA"}</span>
                </p>

                {/* Button to view more details */}
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                  View Details
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-lg text-gray-500">No events available.</p>
        )}
      </div>
    </div>
  );
};

export default Events;
